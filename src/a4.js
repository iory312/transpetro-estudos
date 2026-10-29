/* ---------- BIZUs ---------- */
const KIND = {bizu:'BIZU', peg:'Pegadinha', atn:'Atenção', dica:'Dica'};
const hl = (html, q) => { if(!q) return html; const d = document.createElement('div'); d.innerHTML = html; const re = new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
  const walk = n => { [...n.childNodes].forEach(c => { if(c.nodeType === 3){ if(re.test(c.data)){ const s = document.createElement('span'); s.innerHTML = esc(c.data).replace(re, '<mark>$1</mark>'); c.replaceWith(s); } re.lastIndex = 0; } else walk(c); }); }; walk(d); return d.innerHTML; };
let bzQ = '', bzK = '';
VIEWS.bizus = m => {
  const fm = route[1] === 'm' ? decodeURIComponent(route[2] || '') : '';
  setTitle('BIZUs', `${D.bizus.length} caixas · pesquisável`);
  m.innerHTML = `<div class="card"><input type="search" id="bq" placeholder="Buscar (ex.: XSS, LGPD, crase, CVSS)" value="${esc(bzQ)}">
   <div class="chips" style="margin-top:8px"><a class="chip ${!fm ? 'on' : ''}" href="#/bizus">Todos</a>${MODS.concat('Geral').filter(x => D.bizus.some(b => b.mod === x)).map(x => `<a class="chip ${fm === x ? 'on' : ''}" href="#/bizus/m/${encodeURIComponent(x)}">${x}</a>`).join('')}</div>
   <div class="chips" style="margin-top:6px" id="bk">${[['', 'Todos os tipos']].concat(Object.entries(KIND)).map(([k, l]) => `<span class="chip ${bzK === k ? 'on' : ''}" data-k="${k}">${l}</span>`).join('')}</div></div><div id="bl"></div>`;
  const draw = () => { const q = norm(bzQ.trim()), L = D.bizus.filter(b => (!fm || b.mod === fm) && (!bzK || b.kind === bzK) && (!q || norm(b.title + ' ' + b.html + ' ' + ((TOP[b.topic] || {}).title || '')).includes(q)));
    $('#bl', m).innerHTML = `<div class="small mut" style="margin:0 4px 8px">${L.length} resultado(s)</div>` + L.map(b => `<div class="box ${b.kind}"><div class="boxh">${hl(esc(b.title), bzQ.trim())}</div><div class="boxb">${hl(b.html, bzQ.trim())}</div>
     <div class="small mut" style="margin-top:6px">${b.mod}${TOP[b.topic] ? ` · <a href="#/resumos/${b.topic}">${esc(TOP[b.topic].title)}</a>` : ''}</div></div>`).join('') || '<div class="card empty">Nada encontrado.</div>'; };
  draw(); $('#bq', m).oninput = e => { bzQ = e.target.value; draw(); };
  $$('#bk .chip', m).forEach(c => c.onclick = () => { bzK = c.dataset.k; render(); });
};

/* ---------- Resumos ---------- */
const TCK = ['Estudei', 'R1', 'R7', 'R14', 'Domino'];
let rsQ = '';
VIEWS.resumos = m => {
  const id = route[1], t = TOP[id];
  if(t){
    const list = D.topics, i = list.indexOf(t), qs = D.questions.filter(q => q.topic === id), st = S.tck[id] || [];
    setTitle(t.title, t.modTitle);
    m.innerHTML = `<div class="card"><div class="qmeta"><span class="tag">${t.mod}</span><span class="tag ${t.prio === 'Alta' ? 'alta' : 'media'}">${t.prio}</span></div>
     <div class="chips" id="tck">${TCK.map((k, j) => `<span class="chip ${st[j] ? 'on' : ''}" data-j="${j}">${st[j] ? '✔ ' : ''}${k}</span>`).join('')}</div>
     <div class="content" style="margin-top:10px">${t.html}</div>
     ${qs.length ? `<a class="btn p w" style="margin-top:12px" href="#/questoes/t/${id}">Resolver as ${qs.length} questões deste tópico</a>` : ''}
     ${tecBtn(id)}
     <div class="qnav">${i > 0 ? `<a class="btn" href="#/resumos/${list[i - 1].id}">← Anterior</a>` : '<span></span>'}${i < list.length - 1 ? `<a class="btn" href="#/resumos/${list[i + 1].id}">Próximo →</a>` : ''}</div></div>`;
    $$('#tck .chip', m).forEach(c => c.onclick = () => { const a = S.tck[id] = S.tck[id] || []; a[+c.dataset.j] = !a[+c.dataset.j]; activity(); save(); render(); });
    tecBind(m);
    return;
  }
  setTitle('Resumos', 'Por tópico do edital');
  m.innerHTML = `<div class="card"><input type="search" id="rq" placeholder="Buscar nos resumos" value="${esc(rsQ)}"></div><div id="rl"></div>`;
  const draw = () => { const q = norm(rsQ.trim()); let h = '';
    [...new Set(D.topics.map(t => t.modTitle))].forEach(mt => { const L = D.topics.filter(t => t.modTitle === mt && (!q || norm(t.title + ' ' + t.html).includes(q))); if(!L.length) return;
      h += `<div class="card"><h3>${esc(mt)}</h3>${L.map(t => { const st = S.tck[t.id] || [], n = st.filter(Boolean).length; return `<a class="li" href="#/resumos/${t.id}"><div class="f1"><div class="t">${esc(t.title)}</div><div class="s">${n}/5 etapas · <span class="dots">${TCK.map((_, j) => `<i class="${st[j] ? 'on' : ''}"></i>`).join('')}</span></div></div><span class="tag ${t.prio === 'Alta' ? 'alta' : 'media'}">${t.prio}</span></a>`; }).join('')}</div>`; });
    $('#rl', m).innerHTML = h || '<div class="card empty">Nada encontrado.</div>'; };
  draw(); $('#rq', m).oninput = e => { rsQ = e.target.value; draw(); };
};

/* ---------- Leitura em Inglês ---------- */
VIEWS.leitura = m => {
  setTitle('Leitura em Inglês', `${D.leitura.length} textos reais · ${D.questions.filter(q => q.src === 'leit').length} questões`);
  const all = D.questions.filter(q => q.src === 'leit').map(q => q.id);
  m.innerHTML = `<div class="alert info small">Textos <b>reais</b> de fontes públicas de cibersegurança (fonte citada em cada um). As questões são inéditas no estilo Cesgranrio: Q11–20 da prova são de leitura em inglês, e zerar Inglês elimina.</div>
   <button class="btn p w" id="lall" style="margin-bottom:12px">Resolver as ${all.length} questões (todos os textos)</button>
   <div class="card">${D.leitura.map(l => { const qs = D.questions.filter(q => q.topic === l.id), ok = qs.filter(q => (lastAns(q.id) || {}).ok).length, done = qs.filter(q => S.answers[q.id]).length;
     return `<div class="li"><div class="f1"><div class="t">Text ${l.n} — ${esc(l.tema)}</div><div class="s">${esc(l.fonte)} · ${done}/${qs.length} feitas · ${ok} certas</div></div>
      <div style="display:flex;flex-direction:column;gap:6px"><a class="btn sm p" href="#/questoes/t/${l.id}">Questões</a><a class="btn sm" href="#/resumos/${l.id}">Texto + vocab</a></div></div>`; }).join('')}</div>`;
  $('#lall', m).onclick = () => startSession(all, 'estudo', 'Leitura em Inglês', '#/leitura');
};

/* ---------- Glossário ---------- */
let glQ = '', glT = '';
VIEWS.glossario = m => {
  setTitle('Glossário EN', `${D.glossario.length} termos`);
  const tipos = [...new Set(D.glossario.map(g => g.tipo))];
  m.innerHTML = `<div class="card"><input type="search" id="gq" placeholder="Buscar em inglês ou português" value="${esc(glQ)}"><div class="chips" style="margin-top:8px" id="gt">${[''].concat(tipos).map(t => `<span class="chip ${glT === t ? 'on' : ''}" data-t="${t}">${t || 'Todos'}</span>`).join('')}</div></div><div class="card" id="gl"></div>`;
  const draw = () => { const q = norm(glQ.trim()), L = D.glossario.filter(g => (!glT || g.tipo === glT) && (!q || norm(g.en + ' ' + g.pt + ' ' + (g.nota || '')).includes(q)));
    $('#gl', m).innerHTML = `<div class="small mut">${L.length} termo(s)</div>` + L.map(g => `<div class="li"><div class="f1"><div class="t">${hl(esc(g.en), glQ.trim())}</div><div class="s">${hl(esc(g.pt), glQ.trim())}${g.nota ? ' · ' + esc(g.nota) : ''}</div></div><span class="tag gray">${esc(g.tipo)}</span></div>`).join('') || '<div class="empty">Nada encontrado.</div>'; };
  draw(); $('#gq', m).oninput = e => { glQ = e.target.value; draw(); };
  $$('#gt .chip', m).forEach(c => c.onclick = () => { glT = c.dataset.t; render(); });
};

/* ---------- Cronograma ---------- */
VIEWS.cronograma = m => {
  const t = dk(), done = D.cronograma.filter(c => S.crono[c.i]).length;
  setTitle('Cronograma', `${done}/${D.cronograma.length} dias concluídos`);
  m.innerHTML = `<div class="card"><div class="bar"><i style="width:${pct(done, D.cronograma.length)}%"></i></div><div class="small mut" style="margin-top:6px">R1/R7/R14 = revisões espaçadas dos tópicos estudados 1, 7 e 14 dias antes.</div></div>
   <div class="card">${D.cronograma.map(c => `<label class="li ${c.date === t ? 'today' : ''} ${S.crono[c.i] ? 'done' : ''} ${c.kind}" id="cd${c.date}"><input type="checkbox" data-i="${c.i}" ${S.crono[c.i] ? 'checked' : ''}>
     <div class="f1"><div class="t">${fmtD(c.date)} ${c.dow}${c.date === t ? ' · <b>HOJE</b>' : ''} — ${esc(c.task)}</div><div class="s">${c.rev.length ? 'Revisões: ' + c.rev.map(esc).join(' · ') : ''}${c.topic && TOP[c.topic] ? ` <a href="#/resumos/${c.topic}">abrir resumo →</a>` : ''}</div></div></label>`).join('')}</div>`;
  $$('[data-i]', m).forEach(b => b.onchange = () => { S.crono[b.dataset.i] = b.checked; if(b.checked) activity(); save(); b.closest('.li').classList.toggle('done', b.checked); setTitle('Cronograma', `${D.cronograma.filter(c => S.crono[c.i]).length}/${D.cronograma.length} dias concluídos`); });
  const td = document.getElementById('cd' + t); if(td) setTimeout(() => td.scrollIntoView({block:'center'}), 30);
};

/* ---------- Dia da prova ---------- */
VIEWS.prova = m => {
  const done = D.diaProva.filter(d => S.dia[d.id]).length, dl = diffDays(D.meta.prova, dk());
  setTitle('Dia da prova', `06/12/2026 · ${done}/${D.diaProva.length} itens`);
  m.innerHTML = `<div class="card hero"><b style="font-size:20px">${dl > 0 ? `Faltam ${dl} dias` : dl === 0 ? 'É hoje! Boa prova!' : 'Prova realizada'}</b><div class="small">Domingo, 06/12/2026 · ${Math.floor(D.meta.duracaoMin / 60)}h${pad(D.meta.duracaoMin % 60)} de prova · 70 questões A–E · confira horário e local no Cartão de Confirmação.</div></div>
   <div class="card"><h3>Checklist (itens do edital)</h3>${D.diaProva.map(d => `<label class="li ${S.dia[d.id] ? 'done' : ''}"><input type="checkbox" data-d="${d.id}" ${S.dia[d.id] ? 'checked' : ''}><div class="f1"><div class="t" style="font-weight:500">${d.html}</div>${d.item ? `<div class="s">Edital ${esc(d.item)}</div>` : ''}</div></label>`).join('')}
   <button class="btn sm" id="dclr" style="margin-top:8px">Desmarcar tudo</button></div>`;
  $$('[data-d]', m).forEach(b => b.onchange = () => { S.dia[b.dataset.d] = b.checked; save(); b.closest('.li').classList.toggle('done', b.checked); });
  $('#dclr', m).onclick = () => { S.dia = {}; save(); render(); };
};
