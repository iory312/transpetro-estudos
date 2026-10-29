'use strict';
const D = JSON.parse(document.getElementById('data').textContent);
const LET = 'ABCDE', SKEY = 'progresso', DAY = 864e5;
const MODS = ['Ofensiva','Defensiva','Compliance','Português','Inglês'];
const ESP = ['Ofensiva','Defensiva','Compliance'], GER = ['Português','Inglês'];
const REASONS = ['Não sabia o conteúdo','Confundi conceitos parecidos','Caí na pegadinha','Li rápido / falta de atenção','Esqueci número/detalhe','Interpretação do texto/enunciado','Chutei'];
const STAGES = [1,7,14];
const VIEWS = {};
const $ = (s, el=document) => el.querySelector(s), $$ = (s, el=document) => [...el.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const strip = h => { const d = document.createElement('div'); d.innerHTML = h; return d.textContent || ''; };
const pad = n => String(n).padStart(2,'0');
const dk = (d=new Date()) => d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());
const parseDk = k => { const [y,m,d] = k.split('-').map(Number); return new Date(y, m-1, d); };
const addDays = (k, n) => { const d = parseDk(k); d.setDate(d.getDate()+n); return dk(d); };
const diffDays = (a, b) => Math.round((parseDk(a) - parseDk(b)) / DAY);
const fmtD = k => { const d = parseDk(k); return pad(d.getDate())+'/'+pad(d.getMonth()+1); };
const pct = (a, b) => b ? Math.round(100*a/b) : 0;
const norm = s => strip(String(s)).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();

/* ---------- estado ---------- */
let S;
function loadState(){ const v = Storage.get(SKEY, null); S = Object.assign(blank(), v && typeof v === 'object' ? v : {}); }
loadState();
let saveWarned = false;
function save(){ S.updated = Date.now(); if(!Storage.set(SKEY, S) && !saveWarned){ saveWarned = true; toast('Atenção: o navegador bloqueou o armazenamento local. Use Exportar progresso.'); } }
function activity(){ const k = dk(); S.days[k] = (S.days[k]||0) + 1; }

/* ---------- índices ---------- */
const Q = {}, TOP = {}, BZT = {}, SIM = {};
D.topics.forEach(t => TOP[t.id] = t);
D.questions.forEach(q => Q[q.id] = q);
D.simulados.forEach(s => { SIM[s.id] = s; s.questions.forEach(q => Q[q.id] = q); });
D.bizus.forEach(b => (BZT[b.topic] = BZT[b.topic] || []).push(b));

/* ---------- UI util ---------- */
let toastT;
function toast(m){ let t = $('.toast'); if(!t){ t = document.createElement('div'); t.className='toast'; document.body.appendChild(t); } t.textContent = m; t.style.display='block'; clearTimeout(toastT); toastT = setTimeout(()=> t.style.display='none', 2600); }
const ICON = {
 home:'<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
 q:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6M12 17h.01"/>',
 sim:'<circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 2h6"/>',
 cards:'<rect x="3" y="6" width="14" height="14" rx="2"/><path d="M7 3h12a2 2 0 0 1 2 2v12"/>',
 more:'<circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/>',
 err:'<path d="M12 3l9 16H3z"/><path d="M12 10v4M12 17h.01"/>',
 bizu:'<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z"/>',
 book:'<path d="M4 4h6a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4zM20 4h-5a2 2 0 0 0-2 2"/><path d="M20 4v14h-7"/>',
 gloss:'<path d="M4 5h8M8 3v2M5 9c1.5 3 4 5 7 6M11 5c-1 4-3 7-7 9"/><path d="M13 21l4-9 4 9M14.5 18h5"/>',
 cal:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
 check:'<path d="M9 11l3 3 8-8"/><path d="M20 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
 audio:'<path d="M3 14v-2a9 9 0 0 1 18 0v2"/><rect x="3" y="14" width="4" height="7" rx="1"/><rect x="17" y="14" width="4" height="7" rx="1"/>',
 info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/>',
 save:'<path d="M12 3v12M7 10l5 5 5-5M4 21h16"/>',
 sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
 moon:'<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
 cloud:'<path d="M7 18h10a4 4 0 0 0 .5-8 6 6 0 0 0-11.5-1.5A3.5 3.5 0 0 0 7 18z"/>',
 ext:'<path d="M14 4h6v6"/><path d="M20 4l-9 9"/><path d="M16 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h5"/>'
};
const ic = n => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICON[n]}</svg>`;
const NAV = [['home','Início','home'],['questoes','Questões','q'],['simulado','Simulado','sim'],['flashcards','Flashcards','cards'],['mais','Mais','more']];
const MORE = [['erros','Caderno de erros','err','Revisão em +1/+7/+14 dias'],['bizus','BIZUs','bizu','Biblioteca pesquisável'],['resumos','Resumos','book','Por tópico do edital'],
 ['leitura','Leitura em Inglês','gloss','12 textos reais · 36 questões'],['glossario','Glossário EN','gloss','Termos, conectores, falsos cognatos'],['cronograma','Cronograma','cal','29/10 → 06/12'],['prova','Dia da prova','check','Checklist do edital'],
 ['ouvir','Ouvir','audio','Áudios de BIZUs'],['sobre','Sobre a prova','info','Edital, perfil da banca'],['tec','TEC Concursos','ext','Cadernos guia e assuntos'],['backup','Progresso','save','Exportar / importar'],['sincronizar','Sincronizar','cloud','Conta na nuvem (opcional)']];
function theme(t){ if(t){ S.settings.theme = t; save(); } const th = S.settings.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'); document.documentElement.dataset.theme = th; const b = $('#themeBtn'); if(b) b.innerHTML = th === 'dark' ? ic('sun') : ic('moon'); const meta = document.querySelector('meta[name="theme-color"]'); if(meta) meta.setAttribute('content', th === 'dark' ? '#0c141c' : '#f3f6f8'); }

/* ---------- estatísticas ---------- */
function lastAns(id){ const a = S.answers[id]; return a && a.length ? a[a.length-1] : null; }
function modStats(){
  const st = {}; MODS.forEach(m => st[m] = {ok:0, n:0});
  for(const id in S.answers){ const q = Q[id]; if(!q || !st[q.mod]) continue; S.answers[id].forEach(a => { st[q.mod].n++; if(a.ok) st[q.mod].ok++; }); }
  return st;
}
function topicStats(){ const st = {}; for(const id in S.answers){ const q = Q[id]; if(!q || !q.topic || !TOP[q.topic]) continue; const s = st[q.topic] = st[q.topic] || {ok:0,n:0}; S.answers[id].forEach(a => { s.n++; if(a.ok) s.ok++; }); } return st; }
function streak(){ let k = dk(), n = 0; if(!S.days[k]) k = addDays(k, -1); while(S.days[k]){ n++; k = addDays(k, -1); } return n; }
function scoreSim(sim, ans){
  const r = {area:{}, ok:0}; Object.keys(D.areas).forEach(a => r.area[a] = {ok:0, n:0});
  sim.questions.forEach(q => { const A = r.area[q.area]; A.n++; if(ans[q.n] === q.ans){ A.ok++; r.ok++; } });
  r.ger = r.area.PT.ok + r.area.EN.ok; r.esp = r.area.OF.ok + r.area.DF.ok + r.area.CP.ok;
  const e = D.meta.eliminacao; r.elim = [];
  if(r.esp < e.especificosMin) r.elim.push(`Específicos ${r.esp} < ${e.especificosMin}`);
  if(r.ger < e.geraisMin) r.elim.push(`Gerais ${r.ger} < ${e.geraisMin}`);
  if(r.area.PT.ok < e.ptMin) r.elim.push('zero em Português');
  if(r.area.EN.ok < e.enMin) r.elim.push('zero em Inglês');
  r.total = r.esp + r.ger; r.blank = sim.questions.filter(q => !ans[q.n]).length; return r;
}

/* ---------- caderno de erros ---------- */
function addError(id){
  const e = S.errors[id];
  if(!e) S.errors[id] = {added:dk(), reason:'', stage:0, due:addDays(dk(), 1), wrongs:1, done:false};
  else Object.assign(e, {stage:0, due:addDays(dk(), 1), wrongs:(e.wrongs||1)+1, done:false, last:dk()});
}
function reviewOk(id){ const e = S.errors[id]; if(!e || e.done || e.due > dk()) return false; e.stage++; e.last = dk(); if(e.stage >= STAGES.length){ e.done = true; e.due = null; } else e.due = addDays(dk(), STAGES[e.stage]); return true; }
function dueErrors(){ const t = dk(); return Object.keys(S.errors).filter(id => Q[id] && !S.errors[id].done && S.errors[id].due <= t); }
/* erros das rodadas diárias (planilha) — sem enunciado, só registro + BIZU */
const RODS = D.rodadas || [];
function rodSt(r){ return (S.rod = S.rod || {})[r.id] || {stage:0, due:addDays(r.date, 1), done:false}; }
function dueRod(){ const t = dk(); return RODS.filter(r => !r.ok && !rodSt(r).done && rodSt(r).due <= t); }
function rodOk(r){ const e = Object.assign({}, rodSt(r)); e.stage++; e.last = dk(); if(e.stage >= STAGES.length){ e.done = true; e.due = null; } else e.due = addDays(dk(), STAGES[e.stage]); S.rod[r.id] = e; activity(); save(); }
function recordAnswer(q, choice, ctx){
  const ok = choice === q.ans; (S.answers[q.id] = S.answers[q.id] || []).push({t:Date.now(), c:choice, ok, ctx});
  let msg = '';
  if(!ok){ addError(q.id); msg = 'Entrou no caderno de erros · revisar amanhã'; }
  else if(reviewOk(q.id)) msg = S.errors[q.id].done ? 'Erro dominado: saiu da fila de revisão 🎉' : `Revisão ok · próxima em ${STAGES[S.errors[q.id].stage]} dias`;
  activity(); save(); return {ok, msg};
}

/* ---------- roteamento ---------- */
let route = [], timerI = null;
function go(h){ location.hash = h; }
window.addEventListener('hashchange', render);
function setTitle(t, sub){ $('#ttl').innerHTML = esc(t) + (sub ? `<small>${esc(sub)}</small>` : ''); document.title = t + ' · Transpetro Ênfase 7'; }
function render(){
  route = (location.hash.replace(/^#\/?/, '') || 'home').split('/');
  const v = route[0], main = $('#main');
  const navKey = NAV.some(n => n[0] === v) ? v : (MORE.some(m => m[0] === v) ? 'mais' : 'home');
  $$('nav.bot a').forEach(a => a.classList.toggle('on', a.dataset.k === navKey));
  $$('aside.side a').forEach(a => a.classList.toggle('on', a.dataset.k === (VIEWS[v] ? v : 'home')));
  const fn = VIEWS[v] || VIEWS.home; main.innerHTML = ''; window.scrollTo(0, 0);
  try { fn(main); } catch(e) { console.error(e); main.innerHTML = `<div class="card alert bad">Erro ao abrir a tela: ${esc(e.message)}</div>`; }
  updTimerPill();
}
