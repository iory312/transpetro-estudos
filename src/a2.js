/* ---------- Início ---------- */
function cronoToday(){ const t = dk(); let c = D.cronograma.find(x => x.date === t); if(!c && t < D.cronograma[0].date) c = D.cronograma[0]; return c; }
function modSlug(m){ return {Ofensiva:'of', Defensiva:'df', Compliance:'cp', 'Português':'pt', 'Inglês':'en'}[m] || 'x'; }
function chartHTML(st){
  return '<div class="chart">' + MODS.map(m => { const s = st[m], p = pct(s.ok, s.n); const tone = !s.n ? '' : p >= 70 ? 'tone-ok' : p >= 50 ? 'tone-warn' : 'tone-bad';
    return `<div class="it m-${modSlug(m)}"><div class="ring" style="--p:${s.n ? p : 0}" aria-hidden="true"><b>${s.n ? p : '–'}</b></div><div class="grow"><div class="lab"><span><i class="mdot"></i>${m}</span><span class="mut">${s.n ? `<b class="${tone}">${p}%</b> · ${s.ok}/${s.n}` : 'sem respostas'}</span></div><div class="bar"><i style="width:${p}%"></i><span class="cut" title="corte 50%"></span></div></div></div>`; }).join('')
   + '<div class="small mut">A marca na barra é o corte de 50%.</div></div>';
}
function lastSimResult(){ let best = null; D.simulados.forEach(s => { ((S.sims[s.id] || {}).hist || []).forEach(a => { if(!best || a.end > best.a.end) best = {sim:s, a}; }); }); if(best) best.r = scoreSim(best.sim, best.a.ans); return best; }
function cutAlerts(st){
  const out = []; const sum = arr => arr.reduce((a, m) => ({ok:a.ok + st[m].ok, n:a.n + st[m].n}), {ok:0, n:0});
  const e = sum(ESP), g = sum(GER), me = D.meta.eliminacao, last = lastSimResult();
  if(last){ const r = last.r; out.push(r.elim.length ? `<div class="alert bad"><b>Último simulado (${esc(last.sim.nome)}): ELIMINADO</b> — ${r.elim.map(esc).join(', ')}.</div>` : `<div class="alert ok"><b>Último simulado (${esc(last.sim.nome)}): aprovado nos cortes</b> — Específicos ${r.esp}/50 · Gerais ${r.ger}/20 · Total ${r.total}/70.</div>`); }
  if(e.n >= 5){ const pe = Math.round(50 * e.ok / e.n); out.push(`<div class="alert ${pe < me.especificosMin ? 'bad' : pe < 33 ? 'warn' : 'ok'}">Projeção Específicos: <b>${pe}/50</b> (corte ${me.especificosMin}) · ${pct(e.ok, e.n)}% em ${e.n} respostas.</div>`); }
  if(g.n >= 5){ const pg = Math.round(20 * g.ok / g.n); out.push(`<div class="alert ${pg < me.geraisMin ? 'bad' : pg < 13 ? 'warn' : 'ok'}">Projeção Gerais: <b>${pg}/20</b> (corte ${me.geraisMin}) · ${pct(g.ok, g.n)}% em ${g.n} respostas.</div>`); }
  GER.forEach(m => { if(st[m].n >= 3 && st[m].ok === 0) out.push(`<div class="alert bad">Atenção: 0 acertos em ${m} até agora — zerar ${m} elimina.</div>`); });
  if(!out.length) out.push('<div class="alert info">Responda pelo menos 5 questões de Específicos e de Gerais (ou faça um simulado) para ver a projeção contra os cortes: Específicos ≥ 25, Gerais ≥ 10 e não zerar PT nem EN.</div>');
  return out.join('');
}
const tile = ([k, t, i, s]) => `<a class="tile" href="#/${k}">${ic(i)}<b>${t}</b><span>${s}</span></a>`;
function topicNick(id){
  const t = TOP[id];
  if(!t) return 'estudo';
  if(/nmap/i.test(t.title)) return 'nmap';
  const cut = t.title.replace(/^\d+(\.\d+)?([–-]\d+(\.\d+)?)?\s*/, '').split('—')[0].split('+')[0].split(':')[0].trim();
  return cut.length > 32 ? cut.slice(0, 30) + '…' : (cut || t.title);
}
function putSpot(next){
  const prev = S.spot || {};
  const same = prev.kind === next.kind && prev.i === next.i && prev.sim === next.sim && prev.topic === next.topic && prev.show === next.show && JSON.stringify(prev.ids || []) === JSON.stringify(next.ids || []) && JSON.stringify(prev.ans || {}) === JSON.stringify(next.ans || {});
  if(same) return;
  next.t = Date.now();
  S.spot = next;
  save();
}
function clearSpot(){
  if(!S.spot || S.spot.kind === 'none') return;
  S.spot = {t:Date.now(), kind:'none'};
  save();
}
function spotFromQuiz(){
  const q = Q[QS.ids[QS.i]];
  return {kind:'questoes', ids:QS.ids.slice(), i:QS.i, ans:JSON.parse(JSON.stringify(QS.ans || {})), ctx:QS.ctx, title:QS.title, back:QS.back, topic:q && q.topic || ''};
}
function hydrateSpot(){
  const p = S.spot;
  if(!p || p.kind === 'none') return;
  if(p.kind === 'questoes' && Array.isArray(p.ids)){
    const ids = p.ids.filter(id => Q[id]);
    if(!ids.length) return;
    QS = {ids:ids, i:Math.min(p.i || 0, ids.length - 1), ctx:p.ctx || 'estudo', title:p.title || 'Questões', back:p.back || '#/questoes', ans:Object.assign({}, p.ans || {})};
  }
  if(p.kind === 'flash' && Array.isArray(p.ids) && typeof D !== 'undefined' && D.flashcards){
    const ids = p.ids.filter(id => D.flashcards.some(c => c.id === id));
    if(!ids.length) return;
    FQ = {ids:ids, i:Math.min(p.i || 0, ids.length), show:!!p.show, free:!!p.free, done:p.done || 0};
  }
}
function proximoBloco(){
  if(typeof buildPlano !== 'function') return null;
  const today = dk();
  const day = buildPlano(planoHoras(), S.planoMove || {ids:{}}).find(d => d.date === today);
  if(!day) return null;
  return day.blocks.find(b => b.tipo !== 'marco' && !(S.plano && S.plano[b.id])) || null;
}
function resumeTarget(){
  const sim = typeof runningSim === 'function' ? runningSim() : null;
  if(sim){
    const cur = (S.sims[sim.id] || {}).cur || {}, n = sim.questions.length, i = Math.min(cur.i || 0, n - 1), q = sim.questions[i];
    return {kind:'simulado', href:'#/simulado/' + sim.id + '/run', sub:sim.nome + ' — questão ' + q.n + ' de ' + n};
  }
  const p = S.spot;
  if(p && p.kind === 'questoes' && p.ids && p.ids.length && (p.i || 0) < p.ids.length){
    const q = Q[p.ids[p.i]];
    const name = q ? topicNick(q.topic) : (p.title || 'Questões');
    return {kind:'questoes', href:'#/questoes/run', sub:'Questões · ' + name + ' — questão ' + ((p.i || 0) + 1) + ' de ' + p.ids.length};
  }
  if(p && p.kind === 'flash' && p.ids && p.ids.length && (p.i || 0) < p.ids.length){
    return {kind:'flash', href:'#/flashcards', sub:'Flashcards — cartão ' + ((p.i || 0) + 1) + ' de ' + p.ids.length};
  }
  if(p && p.kind === 'modulo' && p.topic && TOP[p.topic]){
    return {kind:'modulo', href:'#/resumos/' + p.topic, sub:'Resumo · ' + topicNick(p.topic)};
  }
  const b = proximoBloco();
  if(b){
    const href = b.href || (b.topic ? '#/questoes/t/' + b.topic : '#/cronograma');
    return {kind:'crono', href:href, sub:'Hoje · ' + b.title};
  }
  return {kind:'crono', href:'#/cronograma', sub:'Próximo bloco do cronograma'};
}
function revisarHojeHTML(){
  const rows = editalRevisarHoje();
  if(!rows.length) return '<div class="card"><h3>Revisar hoje</h3><p class="mut" style="margin:0">Nada pra revisar hoje 🎉</p></div>';
  const shown = rows.slice(0, 6);
  const more = rows.length - shown.length;
  return `<div class="card"><h3>Revisar hoje <span class="r">${rows.length}</span></h3>${shown.map(r => {
    const nome = ['R1', 'R2', 'R3'][r.i];
    return `<button type="button" class="rev-item" data-rev="${esc(r.it.id)}"><b>${esc(r.it.num)} ${esc(editalShort(r.it))}</b><span>${nome} ${r.late ? 'atrasada' : 'hoje'}</span></button>`;
  }).join('')}${more ? `<a class="small" href="#/edital">e mais ${more} no edital</a>` : ''}</div>`;
}
function corteFonte(){
  const st = {};
  MODS.forEach(m => st[m] = {ok:0, n:0});
  const base = modStats();
  MODS.forEach(m => { st[m].ok = base[m].ok; st[m].n = base[m].n; });
  const map = {pt:'Português', en:'Inglês', of:'Ofensiva', df:'Defensiva', cp:'Compliance'};
  EDITAL_ITENS.forEach(it => {
    const mod = map[it.id.split('-')[0]];
    if(!mod || !st[mod]) return;
    const e = editalRead(it.id);
    let appN = 0, appOk = 0;
    (it.quiz || []).forEach(topic => {
      for(const id in S.answers){
        const q = Q[id];
        if(!q || q.topic !== topic) continue;
        (S.answers[id] || []).forEach(a => { appN++; if(a.ok) appOk++; });
      }
    });
    const extraN = Math.max(0, e.q - appN);
    const extraOk = Math.max(0, Math.min(extraN, e.ok - appOk));
    st[mod].n += extraN; st[mod].ok += extraOk;
  });
  return st;
}
function corteAlvo(){
  const d = corteFonte();
  const sum = names => names.reduce((a, m) => ({ok:a.ok + d[m].ok, n:a.n + d[m].n}), {ok:0, n:0});
  const child = names => {
    const known = names.filter(m => d[m].n > 0).sort((a, b) => pct(d[a].ok, d[a].n) - pct(d[b].ok, d[b].n));
    return known[0] || names[0];
  };
  const items = MODS.map(m => ({key:m, label:m, train:m, kind:'matéria', ok:d[m].ok, n:d[m].n})).concat([
    {key:'Específicos', label:'Específicos', train:child(ESP), kind:'bloco', ok:sum(ESP).ok, n:sum(ESP).n},
    {key:'Gerais', label:'Gerais', train:child(GER), kind:'bloco', ok:sum(GER).ok, n:sum(GER).n}
  ]);
  const known = items.filter(x => x.n > 0);
  if(!known.length) return null;
  known.forEach(x => { x.pct = pct(x.ok, x.n); x.zero = (x.key === 'Português' || x.key === 'Inglês') && x.ok === 0; });
  known.sort((a, b) => (b.zero - a.zero) || (a.pct - b.pct) || (b.n - a.n));
  return known[0];
}
function corteHTML(){
  const x = corteAlvo();
  if(!x) return `<div class="card"><h3>Mais perto do corte</h3><p class="mut">Ainda não dá para medir. Faça pelo menos 5 questões de uma disciplina.</p><a class="btn p" href="#/questoes/m/Ofensiva">Treinar agora</a></div>`;
  const tone = x.zero || x.pct < 50 ? 'bad' : x.pct < 70 ? 'mid' : 'ok';
  const gap = 50 - x.pct;
  const dist = x.zero ? 'Nota zero em ' + x.label + ' elimina.' : (gap > 0 ? gap + ' pontos abaixo de 50%.' : (gap === 0 ? 'No limite de 50%.' : (-gap) + ' pontos acima de 50%.'));
  const poucos = x.n < 5 ? `<p class="small mut">Por enquanto são só ${x.n} ${x.n === 1 ? 'questão' : 'questões'}. Dá para ver a direção, mas ainda é cedo para cravar.</p>` : '';
  return `<div class="card corte-card ${tone}"><h3>Mais perto do corte</h3><div class="corte-top"><b class="corte-pct">${x.pct}%</b><div><b>${esc(x.label)}</b><div class="small">${x.kind === 'bloco' ? 'Bloco' : 'Disciplina'} · ${x.ok}/${x.n} acertos</div></div></div><p style="margin:8px 0">${dist}</p>${poucos}<a class="btn p" href="#/questoes/m/${encodeURIComponent(x.train)}">Treinar agora</a></div>`;
}
VIEWS.home = m => {
  setTitle('Transpetro 2026 · Ênfase 7', 'Segurança Cibernética · Cesgranrio');
  const n = diffDays(D.meta.prova, dk()), st = modStats(), sk = streak();
  const de = dueErrors().length + dueRod().length, dc = dueCards().length;
  let heat = ''; for(let i = 13; i >= 0; i--){ const k = addDays(dk(), -i); heat += `<i class="${S.days[k] ? 'on' : ''} ${i === 0 ? 'today' : ''}" title="${fmtD(k)}"></i>`; }
  const weak = Object.entries(topicStats()).filter(([, s]) => s.n >= 3).map(([t, s]) => [t, pct(s.ok, s.n)]).sort((a, b) => a[1] - b[1]).slice(0, 3);
  const ed = editalSum(), lateN = editalLateCount(), hj = hojeResumo();
  const ac = ed.pct == null ? '—' : ed.pct + '%';
  const goOn = resumeTarget();
  m.innerHTML = `<div class="home">
  <button type="button" class="resume" id="resumeBtn"><b>Retomar de onde parei</b><small>${esc(goOn.sub)}</small></button>
  ${revisarHojeHTML()}
  ${corteHTML()}
  <div class="ringgrid">
   <a class="ringcard" href="#/cronograma"><div class="ring" style="--p:${n > 0 ? Math.max(4, Math.min(100, Math.round(100 * (34 - Math.min(n, 34)) / 34))) : 100}"><b id="cd">${n > 0 ? n : n === 0 ? '0' : '—'}</b></div><span>dias para a prova</span></a>
   <a class="ringcard" href="#/cronograma"><div class="ring" style="--p:${hj.n ? Math.round(100 * hj.ok / hj.n) : 0}"><b>${hj.ok}/${hj.n || 0}</b></div><span>hoje</span></a>
   <a class="ringcard" href="#/edital"><div class="ring" style="--p:${lateN ? Math.min(100, lateN * 8) : 0}"><b>${lateN}</b></div><span>revisões atrasadas</span></a>
   <a class="ringcard" href="#/edital"><div class="ring" style="--p:${ed.teoria}"><b>${ed.teoria}%</b></div><span>edital concluído</span></a>
   <a class="ringcard" href="#/edital"><div class="ring" style="--p:${ed.pct || 0}"><b>${ac}</b></div><span>% acerto</span></a>
   <a class="ringcard" href="#/home"><div class="ring" style="--p:${Math.min(100, sk * 14)}"><b id="streak">${sk}</b></div><span>dias seguidos</span></a>
  </div>
  <div class="heat homeheat" aria-label="Dias estudados nas últimas duas semanas">${heat}</div>
  <div class="home-mid">
   ${hojeCardHTML()}
   <div class="card"><h3>Acerto por módulo</h3>${chartHTML(st)}</div>
  </div>
  ${editalCardHTML()}
  <div class="home-bot">
   <div class="card"><h3>Cortes de eliminação</h3>${cutAlerts(st)}<div class="small mut">${esc(D.meta.nota)}</div></div>
   ${weak.length ? `<div class="card"><h3>Tópicos mais fracos</h3>${weak.map(([t, p]) => `<a class="li" href="#/questoes/t/${t}"><div class="f1"><div class="t">${esc(TOP[t].title)}</div><div class="s">${TOP[t].mod}</div></div><span class="tag ${p < 50 ? 'alta' : 'media'}">${p}%</span></a>`).join('')}</div>` : `<div class="card empty">Quando você responder algumas questões, os tópicos mais fracos aparecem aqui.</div>`}
  </div>
  <div class="tiles">${MORE.slice(0, 6).map(tile).join('')}</div>
  </div>`;
  bindPlano(m);
  $('#resumeBtn', m).onclick = () => {
    const t = resumeTarget();
    if(t.kind === 'questoes' || t.kind === 'flash') hydrateSpot();
    go(t.href);
  };
  $$('[data-rev]', m).forEach(b => b.onclick = () => { editalOpen = b.dataset.rev; go('#/edital'); });
};

/* ---------- Questões ---------- */
let QS = null;
function poolFor(f){
  const simQs = D.simulados.flatMap(s => s.questions);
  let pool = f.src === 'sim' ? simQs : f.src === 'all' ? D.questions.concat(simQs) : D.questions.filter(q => q.src === f.src);
  if(f.mod.length) pool = pool.filter(q => f.mod.includes(q.mod));
  if(f.topic) pool = pool.filter(q => q.topic === f.topic);
  if(f.prio) pool = pool.filter(q => (q.prio || (TOP[q.topic] || {}).prio || 'Alta') === f.prio);
  if(f.only === 'wrong') pool = pool.filter(q => { const l = lastAns(q.id); return (l && !l.ok) || (S.errors[q.id] && !S.errors[q.id].done); });
  if(f.only === 'new') pool = pool.filter(q => !S.answers[q.id]);
  return pool;
}
function shuffle(a){ a = a.slice(); for(let i = a.length - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function startSession(ids, ctx, title, back){ if(!ids.length){ toast('Nenhuma questão com esses filtros.'); return; } QS = {ids, i:0, ctx, title, back, ans:{}}; putSpot(spotFromQuiz()); go('#/questoes/run'); }
VIEWS.questoes = m => {
  if(route[1] === 't' && route[2]){ S.qf = Object.assign(S.qf, {topic:route[2], mod:[], prio:'', only:'all', src:route[2].startsWith('le') ? 'leit' : 'fix'}); save(); history.replaceState(null, '', '#/questoes'); }
  if(route[1] === 'm' && route[2]){ S.qf = Object.assign(S.qf, {mod:[decodeURIComponent(route[2])], topic:'', prio:'', only:'all', src:'fix', order:'seq'}); save(); history.replaceState(null, '', '#/questoes'); }
  if(route[1] === 'run'){ if(!QS) hydrateSpot(); if(!QS){ go('#/questoes'); return; } return runQ(m); }
  setTitle('Questões', 'Estudo reverso · correção imediata');
  const f = S.qf, pool = poolFor(f);
  const topics = D.topics.filter(t => (!f.mod.length || f.mod.includes(t.mod)) && D.questions.some(q => q.topic === t.id && (f.src === 'all' || f.src === 'sim' || q.src === f.src)));
  const chips = (id, opts, cur) => `<div class="chips" id="${id}">${opts.map(([v, l]) => `<span class="chip ${(Array.isArray(cur) ? cur.includes(v) : cur === v) ? 'on' : ''}" data-v="${v}">${l}</span>`).join('')}</div>`;
  m.innerHTML = `<div class="card"><h3>Filtros</h3>
   <label class="lb">Módulo</label>${chips('fmod', MODS.map(x => [x, x]), f.mod)}
   <label class="lb">Tópico</label><select id="ftop"><option value="">Todos os tópicos</option>${topics.map(t => `<option value="${t.id}" ${f.topic === t.id ? 'selected' : ''}>${esc(t.title)}</option>`).join('')}</select>
   <div class="grid g2"><div><label class="lb">Prioridade</label>${chips('fprio', [['', 'Todas'], ['Alta', 'Alta'], ['Média', 'Média']], f.prio)}</div>
   <div><label class="lb">Mostrar</label>${chips('fonly', [['all', 'Todas'], ['new', 'Não feitas'], ['wrong', 'Só as que errei']], f.only)}</div></div>
   <div class="grid g2"><div><label class="lb">Banco</label>${chips('fsrc', [['fix', `Fixação (${D.questions.filter(q => q.src === 'fix').length})`], ['leit', `Leitura EN (${D.questions.filter(q => q.src === 'leit').length})`], ['sim', 'Dos simulados'], ['all', 'Tudo']], f.src)}</div>
   <div><label class="lb">Ordem</label>${chips('ford', [['seq', 'Sequencial'], ['rnd', 'Embaralhar']], f.order)}</div></div>
   ${f.src === 'sim' || f.src === 'all' ? '<div class="alert warn small">Dica: resolva o simulado cronometrado antes de treinar as questões dele aqui, para não “queimar” o simulado.</div>' : ''}
   <button class="btn p w" id="go" style="margin-top:12px" ${pool.length ? '' : 'disabled'}>Começar · ${pool.length} ${pool.length === 1 ? 'questão' : 'questões'}</button>
   ${f.topic ? tecBtn(f.topic) : ''}</div>
   <div class="card"><h3>Por tópico</h3>${topics.map(t => { const qs = D.questions.filter(q => q.topic === t.id), done = qs.filter(q => S.answers[q.id]).length, ok = qs.filter(q => (lastAns(q.id) || {}).ok).length;
     return `<a class="li" href="#/questoes/t/${t.id}"><div class="f1"><div class="t">${esc(t.title)}</div><div class="s">${t.mod} · ${done}/${qs.length} feitas · ${ok} certas na última tentativa</div></div><span class="tag ${t.prio === 'Alta' ? 'alta' : 'media'}">${t.prio}</span></a>`; }).join('')}</div>`;
  const grp = (id, key, multi) => $$('#' + id + ' .chip', m).forEach(c => c.onclick = () => { const v = c.dataset.v; if(multi){ f[key] = f[key].includes(v) ? f[key].filter(x => x !== v) : f[key].concat(v); f.topic = ''; } else f[key] = v; save(); render(); });
  grp('fmod', 'mod', true); grp('fprio', 'prio'); grp('fonly', 'only'); grp('fsrc', 'src'); grp('ford', 'order');
  $('#ftop', m).onchange = e => { f.topic = e.target.value; save(); render(); };
  $('#go', m).onclick = () => { let ids = pool.map(q => q.id); if(f.order === 'rnd') ids = shuffle(ids); startSession(ids, 'estudo', 'Questões', '#/questoes'); };
  tecBind(m);
};
function qMeta(q){
  const t = TOP[q.topic], prio = q.prio || (t && t.prio);
  return `<div class="qmeta"><span class="tag m-${modSlug(q.mod)}">${q.mod}</span>${t ? `<span class="tag gray">${esc(t.title.length > 42 ? t.title.slice(0, 40) + '…' : t.title)}</span>` : ''}<span class="tag gray">${q.src === 'fix' ? 'Fixação Q' + q.n : q.src === 'leit' ? 'Leitura · ' + esc(TOP[q.topic].title.split(' — ')[0]) + ' · Q' + q.n : esc((SIM[q.src] || {}).nome || '') + ' · Q' + q.n}</span>${prio ? `<span class="tag ${prio === 'Alta' ? 'alta' : 'media'}">${prio}</span>` : ''}</div><div class="small mut" style="margin:-4px 0 6px">${q.src === 'leit' ? 'Texto real (fonte citada) · questão inédita no estilo Cesgranrio' : esc(D.meta.rotulo)}</div>`;
}
const passageHTML = (q, open) => q.passage && D.passages[q.passage] ? `<details class="passage" ${open ? 'open' : ''}><summary>Texto de apoio</summary><div class="content">${D.passages[q.passage]}</div></details>` : '';
function bizusFor(q){
  if(q.src === 'leit'){ const nn = TOP[q.topic].title.split(' — ')[0]; const v = D.glossario.filter(g => g.tipo === 'Leitura' && g.nota === nn); return `<div class="box bizu bizuhot"><div class="boxh">BIZU — vocabulário-chave do texto</div><div class="boxb">${v.map(g => `<b>${esc(g.en)}</b> = ${esc(g.pt)}`).join(' · ')}<br>Releia o trecho citado no comentário e desconfie de alternativas com <i>always/never/only/entirely</i>.</div></div>`; }
  if(q.bizu) return `<div class="box bizu bizuhot"><div class="boxh">BIZU</div><div class="boxb">${q.bizu}</div></div>`;
  const bs = BZT[q.topic] || [], pick = bs.filter(b => b.kind === 'bizu').slice(0, 2).concat(bs.filter(b => b.kind === 'peg').slice(0, 1));
  if(pick.length) return pick.map(b => `<div class="box ${b.kind} bizuhot"><div class="boxh">${esc(b.title)}</div><div class="boxb">${b.html}</div></div>`).join('') + `<a class="small" href="#/resumos/${q.topic}">Abrir o resumo do tópico →</a>`;
  return `<div class="box bizu bizuhot"><div class="boxh">BIZU</div><div class="boxb">Revise os BIZUs de <b>${q.mod}</b>: <a href="#/bizus/m/${encodeURIComponent(q.mod)}">abrir a biblioteca filtrada →</a></div></div>`;
}
function reasonChips(id){ const e = S.errors[id]; if(!e) return ''; return `<label class="lb">Por que errei? (fica no caderno de erros)</label><div class="chips" data-reason="${id}">${REASONS.map(r => `<span class="chip ${e.reason === r ? 'on' : ''}" data-v="${esc(r)}">${r}</span>`).join('')}</div>`; }
function bindReason(el){ $$('[data-reason]', el).forEach(g => $$('.chip', g).forEach(c => c.onclick = () => { const e = S.errors[g.dataset.reason]; e.reason = e.reason === c.dataset.v ? '' : c.dataset.v; save(); $$('.chip', g).forEach(x => x.classList.toggle('on', x.dataset.v === e.reason)); })); }
function feedbackHTML(q, choice, extra){
  const ok = choice === q.ans;
  return `<div class="fb"><div class="res ${ok ? 'ok' : 'bad'}">${ok ? '✔ Correta!' : `✘ Você marcou ${choice} · Gabarito: ${q.ans}`}</div>${extra ? `<div class="small mut" style="margin-bottom:6px">${esc(extra)}</div>` : ''}
   ${ok ? '' : bizusFor(q)}<div class="com"><b>Comentário:</b> ${q.com}</div>${ok ? '' : reasonChips(q.id)}</div>`;
}
function runQ(m){
  const s = QS, q = Q[s.ids[s.i]]; setTitle(s.title, `${s.i + 1} de ${s.ids.length}`);
  const done = s.ans[q.id], correct = Object.entries(s.ans).filter(([id, a]) => Q[id].ans === a.c).length;
  m.innerHTML = `<div class="prog">${s.i + 1}/${s.ids.length} · ${Object.keys(s.ans).length} respondidas · ${correct} certas</div><div class="bar" style="margin-bottom:10px"><i style="width:${pct(s.i + 1, s.ids.length)}%"></i></div>
  <div class="card">${qMeta(q)}${passageHTML(q, !done)}<div class="stem">${q.stem}</div>
   <ol class="alts">${q.alts.map((a, i) => { const L = LET[i]; let c = ''; if(done){ if(L === q.ans) c = 'right'; else if(L === done.c) c = 'wrong'; } return `<li><button data-l="${L}" class="${c}" ${done ? 'disabled' : ''}><span class="l">${L}</span><span>${a}</span></button></li>`; }).join('')}</ol>
   <div id="fb">${done ? feedbackHTML(q, done.c, done.msg) : ''}</div>
   <div class="qnav"><button class="btn" id="prev" ${s.i ? '' : 'disabled'}>← Anterior</button><button class="btn ${done ? 'p' : ''}" id="next">${s.i < s.ids.length - 1 ? 'Próxima →' : 'Concluir'}</button></div></div>
   <div class="row"><a class="btn sm" href="${s.back || '#/questoes'}">Sair</a>${q.topic && TOP[q.topic] ? `<a class="btn sm" href="#/resumos/${q.topic}">Resumo do tópico</a>` : ''}</div>`;
  bindReason(m);
  $$('.alts button', m).forEach(b => b.onclick = () => {
    if(s.ans[q.id]) return; const L = b.dataset.l, r = recordAnswer(q, L, s.ctx); s.ans[q.id] = {c:L, msg:r.msg};
    $$('.alts button', m).forEach(x => { x.disabled = true; if(x.dataset.l === q.ans) x.classList.add('right'); else if(x.dataset.l === L) x.classList.add('wrong'); });
    $('#fb', m).innerHTML = feedbackHTML(q, L, r.msg); bindReason(m); $('#next', m).classList.add('p');
    $('.prog', m).textContent = `${s.i + 1}/${s.ids.length} · ${Object.keys(s.ans).length} respondidas · ${correct + (r.ok ? 1 : 0)} certas`;
    if(!r.ok) $('#fb', m).scrollIntoView({behavior:'smooth', block:'start'});
    putSpot(spotFromQuiz());
  });
  $('#prev', m).onclick = () => { s.i--; putSpot(spotFromQuiz()); render(); };
  $('#next', m).onclick = () => { if(s.i < s.ids.length - 1){ s.i++; putSpot(spotFromQuiz()); render(); } else summaryQ(m); };
}
function summaryQ(m){
  const s = QS, n = Object.keys(s.ans).length, ok = Object.entries(s.ans).filter(([id, a]) => Q[id].ans === a.c).length;
  clearSpot();
  setTitle(s.title, 'Resumo da sessão');
  m.innerHTML = `<div class="card c"><h3>Sessão concluída</h3><div class="big-timer">${ok}/${n}</div><div class="mut">${pct(ok, n)}% de acerto · ${n - ok} erro(s) no caderno de erros</div>
   <div class="row" style="justify-content:center;margin-top:12px"><a class="btn p" href="${s.back || '#/questoes'}">Voltar</a><a class="btn" href="#/erros">Caderno de erros</a></div></div>`;
}
