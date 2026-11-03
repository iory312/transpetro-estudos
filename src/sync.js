/* Sincronização opcional. Sem conta e sem rede o app segue só com localStorage. */
const SYNC_URL = 'https://epmvolilhwlgpitnhrck.supabase.co';
const SYNC_KEY = 'sb_publishable_iiVVvhC8Uqbo__5kAB1zpw_k6L3lP8i';
const SYNC_LIB = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.118.0/+esm';
const SYNC_DEBOUNCE = 1500;

const Sync = {
  status:'local', user:null, email:'', busy:false, message:'', kind:'info', lastErr:''
};
let syncClient = null, libPromise = null, clientPromise = null, suspend = false, dirty = false, inflight = false, pushTimer = null, wakeAt = 0;

function syncLabel(st){
  return {sincronizado:'sincronizado', pendente:'pendente', offline:'offline', erro:'erro', local:'neste aparelho'}[st] || st;
}
function setSyncStatus(st){
  Sync.status = st;
  paintSync();
}
function paintSync(){
  const dot = document.getElementById('syncDot'), btn = document.getElementById('syncBtn'), box = document.getElementById('syncState');
  const label = syncLabel(Sync.status);
  if(btn) btn.setAttribute('aria-label', 'Sincronizar: ' + label);
  if(dot) dot.className = 'dot' + (Sync.status === 'sincronizado' ? ' ok' : Sync.status === 'pendente' ? ' warn' : Sync.status === 'erro' ? ' bad' : '');
  if(box){ box.dataset.status = Sync.status; box.textContent = label; }
}
function mountSyncButton(){
  const host = document.querySelector('header.top');
  if(!host || document.getElementById('syncBtn')) return;
  const b = document.createElement('button');
  b.type = 'button'; b.className = 'ib'; b.id = 'syncBtn'; b.title = 'Sincronizar';
  b.innerHTML = '<span class="dot" id="syncDot"></span>';
  b.onclick = () => { location.hash = '#/sincronizar'; };
  const themeBtn = document.getElementById('themeBtn');
  host.insertBefore(b, themeBtn || null);
  paintSync();
}
function authCallbackPending(){
  const q = location.search || '', h = location.hash || '';
  return /[?&]code=/.test(q) || /access_token=|error_description=|refresh_token=/.test(h);
}
function redirectTo(){
  const search = (location.search || '').replace(/([?&])code=[^&]*/g, '$1').replace(/[?&]$/, '').replace(/\?&/, '?').replace(/\?$/, '');
  return location.origin + location.pathname + search;
}
function humanSync(err){
  const m = String(err && (err.message || err.error_description || err) || '').toLowerCase();
  if(!navigator.onLine || m.includes('failed to fetch') || m.includes('network') || m.includes('timeout') || m.includes('load failed')) return 'Sem conexão. O progresso continua salvo neste aparelho.';
  if(m.includes('invalid login') || m.includes('invalid credentials')) return 'E-mail ou senha incorretos.';
  if(m.includes('email not confirmed')) return 'Falta confirmar o e-mail. Depois de confirmar, é só voltar ao app e entrar.';
  if(m.includes('already registered') || m.includes('already been registered') || m.includes('user already')) return 'Este e-mail já está cadastrado. Entre com a senha.';
  if(m.includes('password') && (m.includes('least') || m.includes('short') || m.includes('6'))) return 'A senha precisa ter pelo menos 6 caracteres.';
  if(m.includes('rate limit') || m.includes('too many')) return 'Muitas tentativas. Espere um pouco e tente de novo.';
  if(m.includes('row-level security') || m.includes('jwt') || m.includes('not authorized')) return 'A sessão não pôde gravar agora. Saia e entre de novo.';
  return 'Não foi possível sincronizar. O app continua funcionando neste aparelho.';
}
function loadSupabase(){
  if(libPromise) return libPromise;
  libPromise = import(SYNC_LIB).then(mod => {
    if(!mod || !mod.createClient) throw new Error('biblioteca');
    return mod;
  }).catch(err => { libPromise = null; throw err; });
  return libPromise;
}
async function ensureClient(){
  if(syncClient) return syncClient;
  if(clientPromise) return clientPromise;
  clientPromise = (async () => {
  const mod = await loadSupabase();
  syncClient = mod.createClient(SYNC_URL, SYNC_KEY, {
    auth:{
      persistSession:true,
      autoRefreshToken:true,
      detectSessionInUrl:true,
      flowType:'pkce',
      storageKey:'tp7-supabase-auth',
      lock: function(_name, _timeout, fn){ return fn(); }
    }
  });
  syncClient.auth.onAuthStateChange((event, session) => {
    try {
      const next = session && session.user ? session.user : null;
      if(event === 'SIGNED_OUT'){
        Sync.user = null; Sync.email = ''; dirty = false;
        setSyncStatus(navigator.onLine ? 'local' : 'offline');
        if(navBuilt) leaveApp();
        return;
      }
      if(next && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION' || event === 'TOKEN_REFRESHED')){
        const first = !Sync.user;
        Sync.user = next; Sync.email = next.email || '';
        if(navBuilt && first && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION')) pullAndMerge(true);
      }
    } catch(e){ setSyncStatus('erro'); Sync.lastErr = humanSync(e); paintSync(); }
  });
  return syncClient;
  })().catch(err => { clientPromise = null; syncClient = null; throw err; });
  return clientPromise;
}
function unwrapRemote(data){
  if(!data || typeof data !== 'object' || Array.isArray(data)) return null;
  if(data.progresso && typeof data.progresso === 'object' && !data.answers) return data.progresso;
  return data;
}
function refreshIfSafe(){
  if(!navBuilt || !Sync.user) return;
  const v = (location.hash.replace(/^#\/?/, '') || 'home').split('/')[0];
  const typing = document.activeElement && document.activeElement.closest && document.activeElement.closest('#syncForm');
  if(typing) return;
  if(['home','mais','sincronizar','backup','erros','sobre'].indexOf(v) >= 0) render();
}
async function pullAndMerge(quiet){
  if(!syncClient || !Sync.user) return;
  if(!navigator.onLine){ setSyncStatus('offline'); return; }
  const {data, error} = await syncClient.from('transpetro_progress').select('data, updated_at').eq('user_id', Sync.user.id).maybeSingle();
  if(error) throw error;
  const remote = data && unwrapRemote(data.data);
  if(!remote || typeof remote !== 'object'){ schedulePush(); return; }
  const merged = mergeState(S, remote);
  if(JSON.stringify(merged) !== JSON.stringify(S)){
    suspend = true;
    S = merged;
    Storage.set(SKEY, S);
    suspend = false;
    theme();
    refreshIfSafe();
    schedulePush();
    if(!quiet) toast('Progresso mesclado com a conta.');
  } else if(!dirty) setSyncStatus('sincronizado');
}
function schedulePush(){
  if(!Sync.user || suspend) return;
  dirty = true;
  setSyncStatus(navigator.onLine ? 'pendente' : 'offline');
  clearTimeout(pushTimer);
  pushTimer = setTimeout(() => { flushSync(); }, SYNC_DEBOUNCE);
}
async function flushSync(){
  clearTimeout(pushTimer);
  if(!Sync.user || !syncClient) return;
  if(!navigator.onLine){ setSyncStatus('offline'); return; }
  if(inflight) return;
  if(!dirty){ setSyncStatus('sincronizado'); return; }
  inflight = true;
  try {
    while(dirty){
      dirty = false;
      const payload = Storage.get(SKEY, {});
      const {error} = await syncClient.from('transpetro_progress').upsert({
        user_id: Sync.user.id,
        data: payload,
        updated_at: new Date().toISOString()
      }, {onConflict:'user_id'});
      if(error) throw error;
    }
    Sync.lastErr = '';
    if(!dirty) setSyncStatus('sincronizado');
  } catch(e){
    dirty = true;
    Sync.lastErr = humanSync(e);
    setSyncStatus(navigator.onLine ? 'erro' : 'offline');
  } finally { inflight = false; }
}
async function onWake(){
  if(!Sync.user){ setSyncStatus(navigator.onLine ? 'local' : 'offline'); return; }
  if(!navigator.onLine){ setSyncStatus('offline'); return; }
  if(Date.now() - wakeAt < 8000 && !dirty) return;
  wakeAt = Date.now();
  try { await ensureClient(); await pullAndMerge(true); if(dirty) await flushSync(); }
  catch(e){ Sync.lastErr = humanSync(e); setSyncStatus('erro'); }
}
function showSyncMsg(text, kind){ Sync.message = text || ''; Sync.kind = kind || 'info'; const el = document.getElementById('syncMsg'); if(el){ el.className = 'alert ' + (kind || 'info'); el.style.display = text ? '' : 'none'; el.textContent = text || ''; } }
async function withSyncBusy(fn){
  Sync.busy = true; paintBusy();
  try { await fn(); }
  catch(e){ Sync.lastErr = humanSync(e); setSyncStatus(navigator.onLine ? 'erro' : 'offline'); showSyncMsg(Sync.lastErr, 'bad'); }
  finally { Sync.busy = false; paintBusy(); }
}
function paintBusy(){
  ['sync-in','sync-up','sync-out'].forEach(id => { const b = document.getElementById(id); if(b) b.disabled = Sync.busy; });
}
function readCreds(){
  const email = ($('#sync-email') && $('#sync-email').value || '').trim();
  const password = ($('#sync-pass') && $('#sync-pass').value) || '';
  if(!email || !email.includes('@')){ showSyncMsg('Informe um e-mail válido.', 'warn'); return null; }
  if(password.length < 6){ showSyncMsg('A senha precisa ter pelo menos 6 caracteres.', 'warn'); return null; }
  return {email, password};
}

VIEWS.sincronizar = m => {
  setTitle('Conta', 'Sincronização');
  if(Sync.user){
    m.innerHTML = `<div class="card"><h3>Conta</h3><div class="small">Conectado como <b>${esc(Sync.email || 'sua conta')}</b></div>
      <div class="row" style="margin-top:10px"><span class="mut small">Estado:</span> <b id="syncState" data-status="${esc(Sync.status)}">${esc(syncLabel(Sync.status))}</b></div>
      ${Sync.lastErr && Sync.status === 'erro' ? `<div class="alert bad">${esc(Sync.lastErr)}</div>` : ''}
      <p class="small mut">Cada alteração é enviada depois de uma pausa curta, e de novo quando você volta ao app ou a internet retorna. Sair não apaga o progresso deste aparelho.</p>
      <button class="btn" id="sync-out" type="button">Sair</button></div>
      <div class="card small mut">A união não descarta respostas. Se os dois lados tiverem o mesmo item, fica o mais recente. Itens marcados no cronograma, no checklist e nas etapas dos resumos permanecem marcados se estiverem marcados em qualquer um dos lados.</div>`;
    paintSync();
    $('#sync-out', m).onclick = () => signOutAccount();
    return;
  }
  showLanding('login');
};

function signOutAccount(){
  return withSyncBusy(async () => {
    const client = await ensureClient();
    await client.auth.signOut();
  });
}
function leaveApp(){
  document.body.classList.add('gated');
  const nav = $('#bnav'); if(nav) nav.innerHTML = '';
  const side = $('#side'); if(side) side.innerHTML = '';
  const sb = document.getElementById('syncBtn'); if(sb) sb.remove();
  const pill = document.getElementById('tpill'); if(pill) pill.style.display = 'none';
  showLanding('home');
  toast('Você saiu. O progresso continua neste aparelho.');
}
function loadScript(src){
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src; s.onload = () => resolve(); s.onerror = () => reject(new Error(src));
    document.head.appendChild(s);
  });
}
function loadContent(){
  return (async () => {
    if(!(D && D.questions && D.questions.length)){
      if('serviceWorker' in navigator && /^https?:$/.test(location.protocol)){
        try {
          await navigator.serviceWorker.register('./sw.js', {scope:'./', updateViaCache:'none'});
          await navigator.serviceWorker.ready;
        } catch(e){}
      }
      await loadScript('./conteudo.js');
      if(!globalThis.TP7_DATA || !globalThis.TP7_DATA.questions) throw new Error('conteudo vazio');
      D = globalThis.TP7_DATA;
      indexStudy();
    }
    if(!globalThis.TP7_TEORIA){ try { await loadScript('./teoria.js'); } catch(e){} }
  })();
}
async function enterApp(){
  if(!Sync.user){ showLanding('home'); return; }
  try { await loadContent(); if(typeof hydrateSpot === 'function') hydrateSpot(); }
  catch(e){ showLanding('conteudo'); return; }
  document.body.classList.remove('gated');
  shell();
  if(!document.getElementById('syncBtn')) mountSyncButton();
  try { await pullAndMerge(true); }
  catch(e){ Sync.lastErr = humanSync(e); setSyncStatus(navigator.onLine ? 'erro' : 'offline'); }
}
function showLanding(mode){
  document.body.classList.add('gated');
  const next = mode || 'home';
  const tb = $('#themeBtn');
  if(tb) tb.onclick = () => theme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
  if(document.getElementById('land') && gateMode === next) return;
  gateMode = next;
  const n = diffDays('2026-12-06', dk());
  const num = n > 0 ? String(n) : '0';
  const unit = n === 1 ? 'dia para a prova' : 'dias para a prova';
  const feats = [
    ['Edital verticalizado', 'Teoria, revisões e questões em cada item.'],
    ['Cronograma até 06/12', 'O dia de estudo, com o que fazer agora.'],
    ['Questões no estilo Cesgranrio', 'Fixação, leitura em inglês e simulados.'],
    ['Sincronização entre dispositivos', 'O mesmo progresso na conta e neste aparelho.']
  ];
  if(next === 'login'){
    setTitle('Entrar', 'Ênfase 7');
    $('#main').innerHTML = `<div class="land" id="land"><p class="eyebrow">Ênfase 7</p><h1>Entrar</h1>
      <p class="lead">Use o e-mail e a senha da sua conta para abrir o plano, o edital e as questões.</p>
      <form id="syncForm" class="card" action="javascript:void(0)">
        <label class="lb" for="sync-email">E-mail</label><input id="sync-email" name="email" type="email" autocomplete="email" inputmode="email" required>
        <label class="lb" for="sync-pass">Senha</label><input id="sync-pass" name="password" type="password" autocomplete="current-password" minlength="6" required>
        <div id="syncMsg" class="alert info" style="display:none"></div>
        <button class="btn p land-go" id="sync-in" type="button">Entrar</button>
        <button class="btn land-go" id="sync-up" type="button">Criar conta</button>
        <p class="small mut">Ao criar a conta, chega um e-mail de confirmação. Depois de confirmar o e-mail, é só voltar ao app e entrar. O link pode abrir esta mesma página; se ele não entrar sozinho, use o e-mail e a senha aqui.</p>
        <button class="btn sm" id="landBack" type="button">Voltar</button>
      </form></div>`;
    if(Sync.message) showSyncMsg(Sync.message, Sync.kind);
    $('#landBack').onclick = () => showLanding('home');
    $('#sync-in').onclick = () => withSyncBusy(async () => {
      const creds = readCreds(); if(!creds) return;
      showSyncMsg('', 'info');
      const client = await ensureClient();
      const {data, error} = await client.auth.signInWithPassword(creds);
      if(error) throw error;
      if(!data.session || !data.user){ showSyncMsg('Falta confirmar o e-mail. Depois de confirmar, é só voltar ao app e entrar.', 'warn'); return; }
      Sync.user = data.user; Sync.email = data.user.email || creds.email;
      toast('Entrou. O progresso local e o da conta foram unidos.');
      await enterApp();
    });
    $('#sync-up').onclick = () => withSyncBusy(async () => {
      const creds = readCreds(); if(!creds) return;
      const client = await ensureClient();
      const {data, error} = await client.auth.signUp({email:creds.email, password:creds.password, options:{emailRedirectTo:redirectTo()}});
      if(error) throw error;
      if(data && data.session && data.user){
        Sync.user = data.user; Sync.email = data.user.email || creds.email;
        toast('Conta criada. Você já entrou.');
        await enterApp();
        return;
      }
      Sync.message = 'Conta criada. Enviamos um e-mail de confirmação. Depois de confirmar o e-mail, é só voltar ao app e entrar.';
      Sync.kind = 'ok';
      showSyncMsg(Sync.message, 'ok');
    });
    return;
  }
  if(next === 'conteudo'){
    setTitle('Ênfase 7', 'Material');
    $('#main').innerHTML = `<div class="land" id="land"><h1>Ênfase 7</h1><div class="card alert warn">Não foi possível carregar o material agora. Confira a conexão e tente de novo.</div>
      <button class="btn p land-go" id="landRetry" type="button">Tentar de novo</button>
      <button class="btn land-go" id="landOut" type="button">Sair</button></div>`;
    $('#landRetry').onclick = () => enterApp();
    $('#landOut').onclick = () => signOutAccount();
    return;
  }
  setTitle('Ênfase 7', 'Preparação');
  $('#main').innerHTML = `<div class="land" id="land">
    <p class="eyebrow">Estudo</p>
    <h1>Ênfase 7</h1>
    <p class="lead">Sua preparação para a Transpetro 2026 – Ênfase 7 Segurança Cibernética</p>
    <div class="land-count"><b>${num}</b><span>${unit}<small>06/12/2026</small></span></div>
    <div class="land-feats">${feats.map(([t, s]) => `<div><b>${esc(t)}</b><span>${esc(s)}</span></div>`).join('')}</div>
    <button class="btn p land-go" id="landIn" type="button">Entrar</button>
  </div>`;
  $('#landIn').onclick = () => showLanding('login');
}
async function bootGate(){
  document.body.classList.add('gated');
  const tb = $('#themeBtn');
  if(tb) tb.onclick = () => theme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
  theme();
  try {
    const client = await ensureClient();
    const {data, error} = await client.auth.getSession();
    if(error) throw error;
    const user = data && data.session && data.session.user;
    if(user){
      Sync.user = user;
      Sync.email = user.email || '';
      await enterApp();
      return;
    }
  } catch(e){ Sync.lastErr = humanSync(e); }
  showLanding('home');
}
function bootSync(){
  try {
    Storage.useAdapter({
      push(k){ if(k === SKEY && Sync.user && !suspend) schedulePush(); },
      async pull(){
        if(!Sync.user) return null;
        await ensureClient();
        const {data, error} = await syncClient.from('transpetro_progress').select('data, updated_at').eq('user_id', Sync.user.id).maybeSingle();
        if(error) throw error;
        const remote = data && unwrapRemote(data.data);
        return remote ? {progresso:remote, updated_at:data.updated_at} : null;
      }
    });
    window.addEventListener('online', () => { onWake(); });
    window.addEventListener('offline', () => { setSyncStatus('offline'); if((location.hash || '').indexOf('sincronizar') >= 0) render(); });
    window.addEventListener('focus', () => { onWake(); });
    document.addEventListener('visibilitychange', () => { if(document.visibilityState === 'visible') onWake(); if(document.visibilityState === 'hidden' && dirty) flushSync(); });
    window.addEventListener('pagehide', () => { if(dirty) flushSync(); });
    setSyncStatus(navigator.onLine ? 'local' : 'offline');
  } catch(e){ Sync.lastErr = humanSync(e); setSyncStatus('erro'); }
  bootGate();
}
bootSync();
