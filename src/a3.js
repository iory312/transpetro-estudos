/* ---------- Simulado ---------- */
const simSt = id => S.sims[id] = S.sims[id] || {cur:null, hist:[]};
const SIMDUR = cur => (cur.dur || D.meta.duracaoMin) * 60000;
const remaining = cur => cur.start + SIMDUR(cur) - Date.now();
const hms = ms => { ms = Math.max(0, ms); const s = Math.floor(ms / 1000); return `${Math.floor(s / 3600)}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}`; };
function runningSim(){ return D.simulados.find(s => (S.sims[s.id] || {}).cur); }
function updTimerPill(){
  clearInterval(timerI); const rs = runningSim(), pill = $('#tpill');
  if(!rs){ pill.style.display = 'none'; return; }
  const tick = () => { const cur = (S.sims[rs.id] || {}).cur; if(!cur){ clearInterval(timerI); pill.style.display = 'none'; return; } const r = remaining(cur);
    pill.style.display = ''; pill.textContent = '⏱ ' + hms(r); pill.href = '#/simulado/' + rs.id + '/run'; const bt = $('#bigtimer'); if(bt) bt.textContent = hms(r);
    if(r <= 0){ clearInterval(timerI); submitSim(rs.id, true); } };
  tick(); timerI = setInterval(tick, 1000);
}
function submitSim(id, auto){
  const st = simSt(id), cur = st.cur; if(!cur) return;
  const att = {start:cur.start, end:Date.now(), ans:cur.ans, flags:cur.flags || {}}; st.hist.push(att); st.cur = null;
  SIM[id].questions.forEach(q => { const c = cur.ans[q.n]; if(c) (S.answers[q.id] = S.answers[q.id] || []).push({t:att.end, c, ok:c === q.ans, ctx:'simulado'}); if(c !== q.ans) addError(q.id); });
  activity(); save(); if(auto) alert('Tempo esgotado! O simulado foi entregue automaticamente.');
  go(`#/simulado/${id}/r/${st.hist.length - 1}`);
}
VIEWS.simulado = m => {
  const id = route[1];
  if(!id){
    setTitle('Simulados', '70 questões · 4h30 · regras do edital');
    m.innerHTML = `<div class="alert info small">Formato da prova: Q1–10 Português · Q11–20 Inglês · Q21–70 Específicos (Ofensiva, Defensiva, Compliance). Eliminação: Específicos &lt; 25, Gerais &lt; 10, ou zerar PT ou EN. O cronômetro continua correndo mesmo se você fechar o app (como na prova, não há pausa).</div>` +
      D.simulados.map(s => { const st = simSt(s.id), res = st.hist.map((a, i) => [scoreSim(s, a.ans), i]);
        return `<div class="card"><h3>${esc(s.nome)} <span class="r">${s.questions.length} questões · ${Math.floor(s.duracaoMin / 60)}h${pad(s.duracaoMin % 60)}</span></h3><div class="small mut">${esc(s.label)}</div>
        ${st.cur ? `<div class="alert warn">Em andamento · restam <b>${hms(remaining(st.cur))}</b> · ${Object.keys(st.cur.ans).length}/${s.questions.length} marcadas</div><a class="btn p w" href="#/simulado/${s.id}/run">Continuar</a>` : `<button class="btn p w" data-start="${s.id}" style="margin-top:8px">Iniciar simulado cronometrado</button>`}
        ${res.length ? `<label class="lb">Tentativas</label>${res.map(([r, i]) => `<a class="li" href="#/simulado/${s.id}/r/${i}"><div class="f1"><div class="t">${new Date(st.hist[i].end).toLocaleDateString('pt-BR')} · ${r.total}/70</div><div class="s">Específicos ${r.esp}/50 · Gerais ${r.ger}/20</div></div><span class="tag ${r.elim.length ? 'alta' : ''}">${r.elim.length ? 'Eliminado' : 'Aprovado'}</span></a>`).join('')}` : ''}</div>`; }).join('') +
      `<div class="card small mut">Novos simulados (ex.: Simulado 2) entram pela lista <code>simulados</code> do <code>data.json</code> e aparecem aqui automaticamente.</div>`;
    $$('[data-start]', m).forEach(b => b.onclick = () => { if(runningSim()){ toast('Já existe um simulado em andamento.'); return; } if(!confirm('Iniciar o simulado agora? O cronômetro de 4h30 começa e não pausa (como na prova).')) return;
      simSt(b.dataset.start).cur = {start:Date.now(), ans:{}, flags:{}, i:0}; activity(); save(); go(`#/simulado/${b.dataset.start}/run`); });
    return;
  }
  const sim = SIM[id]; if(!sim){ go('#/simulado'); return; } const st = simSt(id);
  if(route[2] === 'r') return simResult(m, sim, st.hist[+route[3]], +route[3]);
  if(!st.cur){ go('#/simulado'); return; }
  const cur = st.cur, N = sim.questions.length, view = route[3] === 'folha' ? 'folha' : 'q', q = sim.questions[cur.i || 0];
  setTitle(sim.nome, `Questão ${q.n} de ${N}`);
  const sheet = () => `<div class="sheet">${sim.questions.map(x => `${[1, 11, 21].includes(x.n) ? `<div class="sep">${x.n === 1 ? 'Português' : x.n === 11 ? 'Inglês' : 'Específicos'}</div>` : ''}<button data-go="${x.n - 1}" class="${cur.ans[x.n] ? 'ans' : ''} ${x.n === q.n ? 'cur' : ''} ${cur.flags[x.n] ? 'flag' : ''}">${pad(x.n)}<b>${cur.ans[x.n] || '·'}</b></button>`).join('')}</div>`;
  m.innerHTML = `<div class="card row sp"><div><div class="small mut">Tempo restante</div><div class="big-timer" id="bigtimer">${hms(remaining(cur))}</div></div><div class="c"><div class="small mut">Marcadas</div><b style="font-size:20px" id="cnt">${Object.keys(cur.ans).length}/${N}</b></div>
   <div class="row"><a class="btn sm ${view === 'folha' ? 'p' : ''}" href="#/simulado/${id}/run/${view === 'folha' ? 'q' : 'folha'}">${view === 'folha' ? 'Ver questão' : 'Folha de respostas'}</a><button class="btn sm warn" id="entregar">Entregar</button></div></div>` +
   (view === 'folha' ? `<div class="card"><h3>Folha de respostas</h3><div class="small mut" style="margin-bottom:8px">Toque no número para ir à questão. Faixa laranja = marcada para revisar.</div>${sheet()}</div>` :
   `<div class="card"><div class="qmeta"><span class="tag">${esc(D.areas[q.area].nome)}</span><span class="tag gray">Q${q.n}</span><span class="small mut">${esc(sim.label)}</span></div>${passageHTML(q, true)}<div class="stem">${q.stem}</div>
    <ol class="alts">${q.alts.map((a, i) => `<li><button data-l="${LET[i]}" class="${cur.ans[q.n] === LET[i] ? 'sel' : ''}"><span class="l">${LET[i]}</span><span>${a}</span></button></li>`).join('')}</ol>
    <div class="row" style="margin-top:10px"><button class="btn sm ${cur.flags[q.n] ? 'warn' : ''}" id="flag">${cur.flags[q.n] ? '★ Marcada p/ revisar' : '☆ Marcar p/ revisar'}</button>${cur.ans[q.n] ? '<button class="btn sm" id="clr">Limpar resposta</button>' : ''}</div>
    <div class="qnav"><button class="btn" id="prev" ${cur.i ? '' : 'disabled'}>← Anterior</button><button class="btn p" id="next" ${cur.i < N - 1 ? '' : 'disabled'}>Próxima →</button></div></div>
    <details class="card sc"><summary>Folha de respostas</summary>${sheet()}</details>`);
  $$('[data-go]', m).forEach(b => b.onclick = () => { cur.i = +b.dataset.go; save(); if(view === 'q') render(); else go(`#/simulado/${id}/run`); });
  $$('.alts button', m).forEach(b => b.onclick = () => { cur.ans[q.n] = b.dataset.l; save(); $$('.alts button', m).forEach(x => x.classList.toggle('sel', x === b)); const sb = $(`.sheet [data-go="${q.n - 1}"]`, m); if(sb){ sb.classList.add('ans'); $('b', sb).textContent = b.dataset.l; } $('#cnt', m).textContent = `${Object.keys(cur.ans).length}/${N}`; });
  const fl = $('#flag', m); if(fl) fl.onclick = () => { cur.flags[q.n] = !cur.flags[q.n]; save(); render(); };
  const cl = $('#clr', m); if(cl) cl.onclick = () => { delete cur.ans[q.n]; save(); render(); };
  const pv = $('#prev', m); if(pv){ pv.onclick = () => { cur.i--; save(); render(); }; $('#next', m).onclick = () => { cur.i++; save(); render(); }; }
  $('#entregar', m).onclick = () => { const b = N - Object.keys(cur.ans).length; if(confirm(`Entregar o simulado?${b ? `\n\n${b} questão(ões) em branco (contam como erro).` : ''}`)) submitSim(id); };
};
function simResult(m, sim, att, idx){
  if(!att){ go('#/simulado'); return; } const r = scoreSim(sim, att.ans); setTitle(sim.nome, 'Resultado');
  const filt = route[4] || 'erradas', dur = Math.round((att.end - att.start) / 60000), me = D.meta.eliminacao;
  const rows = [['PT', 'Língua Portuguesa', '≥ 1'], ['EN', 'Língua Inglesa', '≥ 1']].map(([a, n, mn]) => `<tr><td>${n}</td><td class="n">${r.area[a].ok}/${r.area[a].n}</td><td>${mn}</td></tr>`).join('')
   + `<tr><td><b>Conhecimentos Gerais</b></td><td class="n"><b>${r.ger}/20</b></td><td><b>≥ ${me.geraisMin}</b></td></tr>`
   + [['OF', 'Ofensiva'], ['DF', 'Defensiva'], ['CP', 'Compliance']].map(([a, n]) => `<tr><td>${n}</td><td class="n">${r.area[a].ok}/${r.area[a].n}</td><td>—</td></tr>`).join('')
   + `<tr><td><b>Conhecimentos Específicos</b></td><td class="n"><b>${r.esp}/50</b></td><td><b>≥ ${me.especificosMin}</b></td></tr><tr><td><b>Nota final</b></td><td class="n"><b>${r.total}/70</b></td><td></td></tr>`;
  const faixa = r.esp < 25 ? 'eliminado — rever a base, começando pelos tópicos de prioridade ALTA' : r.esp <= 32 ? 'aprovado no corte, mas dificilmente entre os primeiros — atacar fracos' : r.esp <= 39 ? 'competitivo — lapidar detalhes' : 'muito competitivo — manter ritmo e revisar erros';
  const list = sim.questions.filter(q => filt === 'todas' || (filt === 'erradas' ? att.ans[q.n] !== q.ans : att.ans[q.n] === q.ans));
  const blocks = [['Português', r.area.PT, 'pt'], ['Inglês', r.area.EN, 'en'], ['Ofensiva', r.area.OF, 'of'], ['Defensiva', r.area.DF, 'df'], ['Compliance', r.area.CP, 'cp']];
  const bars = `<div class="blkchart">${blocks.map(([name, a, slug]) => `<div class="blk m-${slug}"><div class="blk-t"><span>${name}</span><b>${a.ok}/${a.n}</b></div><div class="bar"><i style="width:${pct(a.ok, a.n)}%"></i></div></div>`).join('')}</div>`;
  m.innerHTML = `<div class="card"><div class="alert ${r.elim.length ? 'bad' : 'ok'}" style="margin-top:0"><b style="font-size:17px">${r.elim.length ? 'ELIMINADO' : 'APROVADO nos cortes do edital'}</b>${r.elim.length ? '<br>' + r.elim.map(esc).join(' · ') : ''}</div>
   <div class="stat"><div><b>${r.total}</b><span>acertos / 70</span></div><div><b>${r.esp}</b><span>Específicos / 50</span></div><div><b>${r.ger}</b><span>Gerais / 20</span></div></div>
   ${bars}
   <table class="sc" style="margin-top:10px"><thead><tr><th>Bloco</th><th style="text-align:right">Acertos</th><th>Mínimo</th></tr></thead><tbody>${rows}</tbody></table>
   <div class="small mut" style="margin-top:8px">Tempo usado: ${Math.floor(dur / 60)}h${pad(dur % 60)} · em branco: ${r.blank} · Faixa pessoal (não é corte oficial): ${faixa}. Ranqueamento = Específicos; nota final = Específicos + Gerais. Erradas e em branco já foram para o caderno de erros.</div></div>
   <div class="card"><h3>Gabarito comentado</h3><div class="chips" style="margin-bottom:8px">${[['erradas', 'Erradas/branco'], ['certas', 'Certas'], ['todas', 'Todas']].map(([v, l]) => `<a class="chip ${filt === v ? 'on' : ''}" href="#/simulado/${sim.id}/r/${idx}/${v}">${l}</a>`).join('')}</div>
   <div class="sheet" style="margin-bottom:10px">${sim.questions.map(q => `<button class="${att.ans[q.n] === q.ans ? 'right' : 'wrong'}" data-j="${q.n}">${pad(q.n)}<b>${att.ans[q.n] || '–'}/${q.ans}</b></button>`).join('')}</div>
   ${list.map(q => `<details class="sc" id="rq${q.n}" style="border-top:1px solid var(--line);padding:6px 0"><summary>Q${q.n} · ${esc(D.areas[q.area].mod)} · marcou ${att.ans[q.n] || 'branco'} · gabarito ${q.ans} ${att.ans[q.n] === q.ans ? '✔' : '✘'}</summary>${passageHTML(q, false)}<div class="stem">${q.stem}</div><ol class="alts">${q.alts.map((a, i) => `<li><button disabled class="${LET[i] === q.ans ? 'right' : LET[i] === att.ans[q.n] ? 'wrong' : ''}"><span class="l">${LET[i]}</span><span>${a}</span></button></li>`).join('')}</ol>
     ${att.ans[q.n] !== q.ans ? bizusFor(q) : ''}<div class="com" style="margin-top:8px"><b>Comentário:</b> ${q.com}</div></details>`).join('') || '<div class="empty">Nada aqui.</div>'}</div>
   <div class="row"><a class="btn" href="#/simulado">Voltar</a><a class="btn p" href="#/erros">Caderno de erros</a></div>`;
  $$('[data-j]', m).forEach(b => b.onclick = () => { const open = () => { const d = $('#rq' + b.dataset.j); if(d){ d.open = true; d.scrollIntoView({behavior:'smooth'}); } }; if($('#rq' + b.dataset.j, m)) open(); else { go(`#/simulado/${sim.id}/r/${idx}/todas`); setTimeout(open, 60); } });
}

/* ---------- Flashcards (SM-2 leve) ---------- */
const NEW_PER_DAY = 20;
const cs = id => S.cards[id];
function dueCards(){ const now = Date.now(), due = D.flashcards.filter(c => cs(c.id) && cs(c.id).due <= now), left = Math.max(0, NEW_PER_DAY - (S.newToday[dk()] || 0));
  return due.concat(D.flashcards.filter(c => !cs(c.id)).slice(0, left)); }
function nextIv(p, g){ if(g === 1) return p.reps === 0 ? 1 : Math.max(p.iv + 1, Math.round(p.iv * 1.2)); return p.reps === 0 ? 3 : p.reps === 1 ? 7 : Math.round(Math.max(p.iv, 1) * p.ef); }
function schedule(c, g){
  const prev = cs(c.id), st = prev ? Object.assign({}, prev) : {ef:2.5, iv:0, reps:0, lapses:0};
  if(!prev) S.newToday[dk()] = (S.newToday[dk()] || 0) + 1;
  if(g === 0){ st.reps = 0; st.iv = 0; st.lapses++; st.ef = Math.max(1.3, st.ef - 0.2); st.due = Date.now() + 60000; }
  else { st.iv = nextIv(st, g); st.ef = g === 1 ? Math.max(1.3, st.ef - 0.15) : Math.min(3, st.ef + 0.1); st.reps++; st.due = parseDk(addDays(dk(), st.iv)).getTime() + 4 * 3600e3; }
  st.last = Date.now(); S.cards[c.id] = st; activity(); save();
}
function preview(c, g){ if(g === 0) return '1 min'; const iv = nextIv(cs(c.id) || {ef:2.5, iv:0, reps:0}, g); return iv + (iv === 1 ? ' dia' : ' dias'); }
let FQ = null;
VIEWS.flashcards = m => {
  setTitle('Flashcards', `${D.flashcards.length} cartões · repetição espaçada`);
  if(!FQ || route[1] === 'novo'){ FQ = {ids:dueCards().map(c => c.id), i:0, show:false, free:false, done:0}; if(route[1]) history.replaceState(null, '', '#/flashcards'); }
  const learned = D.flashcards.filter(c => cs(c.id) && cs(c.id).iv >= 7).length, seen = D.flashcards.filter(c => cs(c.id)).length;
  const head = `<div class="stat" style="margin-bottom:12px"><div><b>${FQ.ids.length - FQ.i}</b><span>na fila</span></div><div><b>${seen}</b><span>já vistos</span></div><div><b>${learned}</b><span>firmes (≥7 dias)</span></div></div>`;
  if(FQ.i >= FQ.ids.length){
    m.innerHTML = head + `<div class="card empty"><div style="font-size:40px">✅</div><b>Fila concluída${FQ.done ? ` (${FQ.done} revisões)` : ''}.</b><p>Volte amanhã para as próximas revisões.</p>
     <div class="row" style="justify-content:center"><button class="btn" id="free">Treino livre (sem alterar a agenda)</button><button class="btn" id="more">+10 cartões novos</button></div></div>`;
    $('#free', m).onclick = () => { FQ = {ids:shuffle(D.flashcards.map(c => c.id)), i:0, show:false, free:true, done:0}; render(); };
    $('#more', m).onclick = () => { const nw = D.flashcards.filter(c => !cs(c.id)).slice(0, 10); if(!nw.length){ toast('Não há cartões novos.'); return; } FQ = {ids:nw.map(c => c.id), i:0, show:false, free:false, done:0}; render(); };
    return;
  }
  const c = D.flashcards.find(x => x.id === FQ.ids[FQ.i]);
  m.innerHTML = head + `<div class="card fc" id="fcard"><div class="small mut">Cartão ${pad(+c.id.slice(1))}${FQ.free ? ' · treino livre' : !cs(c.id) ? ' · novo' : ''}</div><div style="margin-top:8px;font-weight:700">${esc(c.q)}</div>${FQ.show ? `<div class="a">${esc(c.a)}</div>` : '<div class="small mut" style="margin-top:14px">Pense na resposta e toque para virar</div>'}</div>
   ${FQ.show ? `<div class="grade"><button class="btn bad" data-g="0">Errei<small>${FQ.free ? 'repetir' : preview(c, 0)}</small></button><button class="btn warn" data-g="1">Difícil<small>${FQ.free ? '&nbsp;' : preview(c, 1)}</small></button><button class="btn ok" data-g="2">Fácil<small>${FQ.free ? '&nbsp;' : preview(c, 2)}</small></button></div>`
   : '<button class="btn p w" id="show">Mostrar resposta</button>'}
   <p class="small mut c">Errei = volta em 1 min · Difícil = intervalo curto · Fácil = intervalo cresce (SM-2 leve).</p>`;
  const sh = $('#show', m); if(sh){ sh.onclick = () => { FQ.show = true; render(); }; $('#fcard', m).onclick = sh.onclick; }
  $$('[data-g]', m).forEach(b => b.onclick = () => { const g = +b.dataset.g; if(!FQ.free) schedule(c, g); else { activity(); save(); } if(g === 0) FQ.ids.push(c.id); FQ.i++; FQ.done++; FQ.show = false; render(); });
};

/* ---------- Caderno de erros ---------- */
function rodHTML(){
  if(!RODS.length) return ''; const t = dk(), er = RODS.filter(r => !r.ok), byD = {}; RODS.forEach(r => { const d = byD[r.date] = byD[r.date] || {n:0, ok:0}; d.n++; if(r.ok) d.ok++; });
  return `<div class="card"><h3>Rodadas diárias (planilha) <span class="r">${Object.entries(byD).map(([d, x]) => `${fmtD(d)}: ${x.ok}/${x.n} acertos`).join(' · ')}</span></h3>
   <div class="small mut" style="margin-bottom:6px">Erros pré-carregados da aba “Rodadas diárias” do Caderno_Erros.xlsx (questões feitas no chat; a planilha não guarda o enunciado). Revise o BIZU, pratique o tópico e marque “Revisei” quando chegar a data.</div>
   ${er.map(r => { const s = rodSt(r), due = !s.done && s.due <= t; return `<div class="li" style="align-items:flex-start"><div class="f1"><div class="t">${esc(r.topico)}</div>
     <div class="s">${r.mod} · rodada ${fmtD(r.date)} Q${r.n} · marcou ${esc(r.marcada)}, gabarito ${esc(r.gabarito)}${r.motivo ? ' · ' + esc(r.motivo) : ''} · ${s.done ? 'dominado' : 'revisar ' + (due ? '<b>hoje</b>' : 'em ' + fmtD(s.due))} <span class="dots">${STAGES.map((_, i) => `<i class="${s.stage > i ? 'on' : ''}"></i>`).join('')}</span></div>
     ${r.bizu ? `<div class="box bizu" style="margin:6px 0 0"><div class="boxh">BIZU</div><div class="boxb">${esc(r.bizu)}</div></div>` : ''}</div>
     <div style="display:flex;flex-direction:column;gap:6px">${due ? `<button class="btn sm ok" data-rok="${r.id}">Revisei</button>` : ''}${r.topic && TOP[r.topic] ? `<a class="btn sm" href="#/questoes/t/${r.topic}">Praticar</a>` : ''}</div></div>`; }).join('')}</div>`;
}
function qLabel(q){ return q.src === 'fix' ? 'Fixação Q' + q.n : q.src === 'leit' ? 'Leitura ' + esc(TOP[q.topic].title.split(' — ')[0]) + ' Q' + q.n : esc(SIM[q.src].nome) + ' Q' + q.n; }
VIEWS.erros = m => {
  if(route[1] === 'revisar'){ const ids = dueErrors(); if(ids.length){ startSession(ids, 'revisao', 'Revisão de erros', '#/erros'); return; } toast('Nenhum erro pendente para hoje.'); history.replaceState(null, '', '#/erros'); }
  setTitle('Caderno de erros', 'Automático · +1 / +7 / +14 dias');
  const all = Object.entries(S.errors).filter(([id]) => Q[id]), t = dk(), fm = route[1] === 'f' ? decodeURIComponent(route[2] || '') : '';
  const pend = all.filter(([, e]) => !e.done && e.due <= t), rp = dueRod().length, sched = all.filter(([, e]) => !e.done && e.due > t), dom = all.filter(([, e]) => e.done);
  const byReason = {}; all.forEach(([, e]) => { const r = e.reason || 'Sem motivo marcado'; byReason[r] = (byReason[r] || 0) + 1; });
  const list = all.filter(([id, e]) => !fm || (fm === 'dominados' ? e.done : !e.done && Q[id].mod === fm)).sort((a, b) => (a[1].done - b[1].done) || String(a[1].due).localeCompare(String(b[1].due)));
  m.innerHTML = `<div class="card"><div class="stat"><div><b>${pend.length + rp}</b><span>para hoje</span></div><div><b>${sched.length}</b><span>agendados</span></div><div><b>${dom.length}</b><span>dominados</span></div></div>
   <button class="btn p w" style="margin-top:10px" id="rev" ${pend.length ? '' : 'disabled'}>Revisar ${pend.length} pendente(s)</button>
   <div class="small mut" style="margin-top:6px">Toda questão errada (inclusive no simulado) entra aqui com revisão em +1 dia. Acertou na revisão: avança para +7 e depois +14 dias; errou de novo: volta para +1.</div></div>
   ${all.length ? `<div class="card"><h3>Motivos dos erros</h3>${Object.entries(byReason).sort((a, b) => b[1] - a[1]).map(([r, n]) => `<div style="margin:6px 0"><div class="row sp small"><span>${esc(r)}</span><b>${n}</b></div><div class="bar"><i style="width:${pct(n, all.length)}%"></i></div></div>`).join('')}</div>` : ''}
   ${rodHTML()}
   <div class="chips" style="margin-bottom:10px"><a class="chip ${!fm ? 'on' : ''}" href="#/erros">Todos</a>${MODS.map(x => `<a class="chip ${fm === x ? 'on' : ''}" href="#/erros/f/${encodeURIComponent(x)}">${x}</a>`).join('')}<a class="chip ${fm === 'dominados' ? 'on' : ''}" href="#/erros/f/dominados">Dominados</a></div>
   <div class="card">${list.length ? list.map(([id, e]) => { const q = Q[id]; return `<div class="li" style="align-items:flex-start"><div class="f1"><div class="t" style="font-weight:500">${esc(strip(q.stem).slice(0, 140))}…</div>
     <div class="s">${q.mod} · ${qLabel(q)} · errou ${e.wrongs || 1}x · ${e.done ? 'dominado' : 'revisar ' + (e.due <= t ? '<b>hoje</b>' : 'em ' + fmtD(e.due))} <span class="dots">${STAGES.map((_, i) => `<i class="${e.stage > i ? 'on' : ''}"></i>`).join('')}</span></div>
     <select data-rs="${id}" style="margin-top:6px;padding:6px"><option value="">Motivo do erro…</option>${REASONS.map(r => `<option ${e.reason === r ? 'selected' : ''}>${r}</option>`).join('')}</select></div>
     <div style="display:flex;flex-direction:column;gap:6px"><button class="btn sm" data-redo="${id}">Refazer</button><button class="btn sm" data-del="${id}" title="Remover do caderno">✕</button></div></div>`; }).join('') : '<div class="empty">Nenhum erro registrado aqui. 👏</div>'}</div>`;
  $('#rev', m).onclick = () => startSession(dueErrors(), 'revisao', 'Revisão de erros', '#/erros');
  $$('[data-rok]', m).forEach(b => b.onclick = () => { const r = RODS.find(x => x.id === b.dataset.rok); rodOk(r); toast(rodSt(r).done ? 'Erro dominado 🎉' : `Revisado · próxima em ${STAGES[rodSt(r).stage]} dias`); render(); });
  $$('[data-rs]', m).forEach(s => s.onchange = () => { S.errors[s.dataset.rs].reason = s.value; save(); });
  $$('[data-redo]', m).forEach(b => b.onclick = () => startSession([b.dataset.redo], 'revisao', 'Refazer questão', '#/erros'));
  $$('[data-del]', m).forEach(b => b.onclick = () => { if(confirm('Remover esta questão do caderno de erros?')){ delete S.errors[b.dataset.del]; save(); render(); } });
};
