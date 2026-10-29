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
      if(event === 'SIGNED_OUT'){ Sync.user = null; Sync.email = ''; dirty = false; setSyncStatus(navigator.onLine ? 'local' : 'offline'); return; }
      if(next && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION' || event === 'TOKEN_REFRESHED')){
        const first = !Sync.user;
        Sync.user = next; Sync.email = next.email || '';
        if(first && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION')) pullAndMerge(true);
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
  setTitle('Sincronizar', 'Opcional · o app funciona sem conta');
  const online = navigator.onLine;
  if(Sync.user){
    m.innerHTML = `<div class="card"><h3>Conta</h3><div class="small">Conectado como <b>${esc(Sync.email || 'sua conta')}</b></div>
      <div class="row" style="margin-top:10px"><span class="mut small">Estado:</span> <b id="syncState" data-status="${esc(Sync.status)}">${esc(syncLabel(Sync.status))}</b></div>
      ${Sync.lastErr && Sync.status === 'erro' ? `<div class="alert bad">${esc(Sync.lastErr)}</div>` : ''}
      <p class="small mut">Cada alteração é enviada depois de uma pausa curta, e de novo quando você volta ao app ou a internet retorna. Sair não apaga o progresso deste aparelho.</p>
      <button class="btn" id="sync-out" type="button">Sair</button></div>
      <div class="card small mut">A união não descarta respostas. Se os dois lados tiverem o mesmo item, fica o mais recente. Itens marcados no cronograma, no checklist e nas etapas dos resumos permanecem marcados se estiverem marcados em qualquer um dos lados.</div>`;
    paintSync();
    $('#sync-out', m).onclick = () => withSyncBusy(async () => {
      const client = await ensureClient();
      await client.auth.signOut();
      Sync.user = null; Sync.email = ''; dirty = false; Sync.message = '';
      setSyncStatus(navigator.onLine ? 'local' : 'offline');
      toast('Você saiu. O progresso continua neste aparelho.');
      render();
    });
    return;
  }
  m.innerHTML = `<div class="card"><h3>Progresso na conta</h3>
    <p class="small">O estudo continua salvo neste aparelho, com ou sem login. Se você entrar, o progresso também fica na sua conta e pode ser aberto em outro dispositivo.</p>
    ${online ? '' : '<div class="alert warn">Você está offline. Dá para estudar normalmente; a entrada na conta espera a conexão.</div>'}
    <div class="small mut">Estado: <b id="syncState" data-status="${esc(Sync.status)}">${esc(syncLabel(Sync.status))}</b></div></div>
    <div class="card"><form id="syncForm" action="javascript:void(0)">
      <label class="lb" for="sync-email">E-mail</label><input id="sync-email" name="email" type="email" autocomplete="email" inputmode="email" required>
      <label class="lb" for="sync-pass">Senha</label><input id="sync-pass" name="password" type="password" autocomplete="current-password" minlength="6" required>
      <div id="syncMsg" class="alert info" style="display:none"></div>
      <div class="row" style="margin-top:12px"><button class="btn p" id="sync-in" type="button">Entrar</button><button class="btn" id="sync-up" type="button">Criar conta</button></div>
      <p class="small mut" style="margin-bottom:0">Ao criar a conta, chega um e-mail de confirmação. Depois de confirmar o e-mail, é só voltar ao app e entrar. O link pode abrir esta mesma página; se ele não entrar sozinho, use o e-mail e a senha aqui.</p>
    </form></div>`;
  if(Sync.message) showSyncMsg(Sync.message, Sync.kind);
  paintSync();
  $('#sync-in', m).onclick = () => withSyncBusy(async () => {
    const creds = readCreds(); if(!creds) return;
    showSyncMsg('', 'info');
    const client = await ensureClient();
    const {data, error} = await client.auth.signInWithPassword(creds);
    if(error) throw error;
    Sync.user = data.user; Sync.email = data.user && data.user.email || creds.email;
    await pullAndMerge(false);
    if(!dirty) setSyncStatus(navigator.onLine ? 'sincronizado' : 'offline');
    toast('Entrou. O progresso local e o da conta foram unidos.');
    render();
  });
  $('#sync-up', m).onclick = () => withSyncBusy(async () => {
    const creds = readCreds(); if(!creds) return;
    const client = await ensureClient();
    const {data, error} = await client.auth.signUp({email:creds.email, password:creds.password, options:{emailRedirectTo:redirectTo()}});
    if(error) throw error;
    if(data && data.session && data.user){
      Sync.user = data.user; Sync.email = data.user.email || creds.email;
      await pullAndMerge(true);
      toast('Conta criada. Você já entrou.');
      render();
      return;
    }
    Sync.message = 'Conta criada. Enviamos um e-mail de confirmação. Depois de confirmar o e-mail, é só voltar ao app e entrar.';
    Sync.kind = 'ok';
    showSyncMsg(Sync.message, 'ok');
  });
};

function bootSync(){
  try {
    mountSyncButton();
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
    const resume = authCallbackPending() || (function(){ try { return !!localStorage.getItem('tp7-supabase-auth'); } catch(e){ return false; } })();
    if(resume){
      ensureClient().then(async client => {
        if(!authCallbackPending()) return;
        try { await client.auth.getSession(); }
        catch(e){ Sync.lastErr = humanSync(e); setSyncStatus('erro'); }
        history.replaceState(null, '', location.pathname + '#/sincronizar');
        render();
      }).catch(e => { Sync.lastErr = humanSync(e); setSyncStatus('erro'); paintSync(); });
    } else setSyncStatus(navigator.onLine ? 'local' : 'offline');
    const v = (location.hash.replace(/^#\/?/, '') || 'home').split('/')[0];
    if(v === 'sincronizar') render();
  } catch(e){ Sync.lastErr = humanSync(e); setSyncStatus('erro'); }
}
bootSync();
