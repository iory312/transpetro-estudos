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
VIEWS.home = m => {
  setTitle('Transpetro 2026 · Ênfase 7', 'Segurança Cibernética · Cesgranrio');
  const n = diffDays(D.meta.prova, dk()), st = modStats(), c = cronoToday(), sk = streak();
  const de = dueErrors().length + dueRod().length, dc = dueCards().length;
  let heat = ''; for(let i = 13; i >= 0; i--){ const k = addDays(dk(), -i); heat += `<i class="${S.days[k] ? 'on' : ''} ${i === 0 ? 'today' : ''}" title="${fmtD(k)}"></i>`; }
  const weak = Object.entries(topicStats()).filter(([, s]) => s.n >= 3).map(([t, s]) => [t, pct(s.ok, s.n)]).sort((a, b) => a[1] - b[1]).slice(0, 3);
  m.innerHTML = `<div class="home">
  <div class="home-top">
   <div class="card hero"><div class="eyebrow">Prova · domingo, 06/12/2026 · 4h30 · 70 questões</div>
    <div class="hero-row"><div><div class="big" id="cd">${n > 0 ? n : n === 0 ? 'HOJE' : '—'}</div><div class="hero-sub">${n > 1 ? 'dias para a prova' : n === 1 ? 'dia para a prova — amanhã!' : n === 0 ? 'Boa prova, Allan!' : 'prova realizada'}</div></div>
    <div class="streak-box"><div class="mut">Sequência</div><div class="big" id="streak">${sk}</div><div class="mut">${sk === 1 ? 'dia seguido' : 'dias seguidos'}</div></div></div>
    <div class="heat" aria-label="Dias estudados nas últimas duas semanas">${heat}</div></div>
   <div class="card kpi"><h3>Para revisar hoje</h3><div class="stat"><div><b>${de}</b><span>erros pendentes</span></div><div><b>${dc}</b><span>flashcards</span></div><div><b>${Object.keys(S.answers).length}</b><span>questões feitas</span></div></div>
    <div class="row" style="margin-top:14px"><a class="btn sm ${de ? 'p' : ''}" href="#/erros/revisar">Revisar erros</a><a class="btn sm ${dc ? 'p' : ''}" href="#/flashcards">Flashcards</a><a class="btn sm" href="#/questoes">Questões</a></div></div>
  </div>
  <div class="home-mid">
   <div class="card"><h3>Tarefa de hoje ${c ? `<span class="r">${fmtD(c.date)} ${c.dow}</span>` : ''}</h3>${c ? `
    <label class="li ${S.crono[c.i] ? 'done' : ''}" style="border:0"><input type="checkbox" data-cr="${c.i}" ${S.crono[c.i] ? 'checked' : ''}><div class="f1"><div class="t">${esc(c.task)}</div>${c.rev.length ? `<div class="s">${c.rev.map(esc).join(' · ')}</div>` : ''}</div></label>
    <div class="row">${c.topic ? `<a class="btn sm" href="#/resumos/${c.topic}">Resumo</a><a class="btn sm p" href="#/questoes/t/${c.topic}">Praticar tópico</a>` : ''}<a class="btn sm" href="#/cronograma">Cronograma</a></div>` : '<p class="mut">Cronograma encerrado.</p>'}</div>
   <div class="card"><h3>Acerto por módulo</h3>${chartHTML(st)}</div>
  </div>
  <div class="home-bot">
   <div class="card"><h3>Cortes de eliminação</h3>${cutAlerts(st)}<div class="small mut">${esc(D.meta.nota)}</div></div>
   ${weak.length ? `<div class="card"><h3>Tópicos mais fracos</h3>${weak.map(([t, p]) => `<a class="li" href="#/questoes/t/${t}"><div class="f1"><div class="t">${esc(TOP[t].title)}</div><div class="s">${TOP[t].mod}</div></div><span class="tag ${p < 50 ? 'alta' : 'media'}">${p}%</span></a>`).join('')}</div>` : `<div class="card empty">Quando você responder algumas questões, os tópicos mais fracos aparecem aqui.</div>`}
  </div>
  <div class="tiles">${MORE.slice(0, 6).map(tile).join('')}</div>
  </div>`;
  $$('[data-cr]', m).forEach(cb => cb.onchange = () => { S.crono[cb.dataset.cr] = cb.checked; if(cb.checked) activity(); save(); render(); });
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
function startSession(ids, ctx, title, back){ if(!ids.length){ toast('Nenhuma questão com esses filtros.'); return; } QS = {ids, i:0, ctx, title, back, ans:{}}; go('#/questoes/run'); }
VIEWS.questoes = m => {
  if(route[1] === 't' && route[2]){ S.qf = Object.assign(S.qf, {topic:route[2], mod:[], prio:'', only:'all', src:route[2].startsWith('le') ? 'leit' : 'fix'}); save(); history.replaceState(null, '', '#/questoes'); }
  if(route[1] === 'run'){ if(!QS){ go('#/questoes'); return; } return runQ(m); }
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
  });
  $('#prev', m).onclick = () => { s.i--; render(); };
  $('#next', m).onclick = () => { if(s.i < s.ids.length - 1){ s.i++; render(); } else summaryQ(m); };
}
function summaryQ(m){
  const s = QS, n = Object.keys(s.ans).length, ok = Object.entries(s.ans).filter(([id, a]) => Q[id].ans === a.c).length;
  setTitle(s.title, 'Resumo da sessão');
  m.innerHTML = `<div class="card c"><h3>Sessão concluída</h3><div class="big-timer">${ok}/${n}</div><div class="mut">${pct(ok, n)}% de acerto · ${n - ok} erro(s) no caderno de erros</div>
   <div class="row" style="justify-content:center;margin-top:12px"><a class="btn p" href="${s.back || '#/questoes'}">Voltar</a><a class="btn" href="#/erros">Caderno de erros</a></div></div>`;
}
