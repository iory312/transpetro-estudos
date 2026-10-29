/* ---------- Ouvir ---------- */
VIEWS.ouvir = m => {
  setTitle('Ouvir', `${D.audios.length} áudios de BIZUs`);
  const cur = D.audios.find(a => a.id === route[1]) || D.audios.find(a => a.id === S.audio.last) || D.audios[0];
  if(!cur){ m.innerHTML = '<div class="card empty">Nenhum áudio cadastrado.</div>'; return; }
  const rate = S.audio.rate || 1;
  m.innerHTML = `<div class="card"><h3>${esc(cur.title)}</h3><audio id="au" controls preload="metadata" src="${esc(cur.file)}" style="width:100%;margin-top:6px"></audio>
   <div id="aerr" class="alert warn small" style="display:none">Arquivo <code>${esc(cur.file)}</code> não encontrado — use o roteiro abaixo. (Os MP3 ficam na pasta <code>audios/</code> ao lado do index.html.)</div>
   <div class="chips" style="margin-top:8px" id="rt">${[1, 1.25, 1.5, 1.75].map(r => `<span class="chip ${rate === r ? 'on' : ''}" data-r="${r}">${r}x</span>`).join('')}</div></div>
   <div class="card">${D.audios.map(a => `<a class="li ${a.id === cur.id ? 'today' : ''}" href="#/ouvir/${a.id}"><div class="f1"><div class="t">${esc(a.title)}</div><div class="s">${S.audio['p' + a.id] ? 'continuar de ' + hms(S.audio['p' + a.id] * 1000).replace(/^0:/, '') : esc(a.file)}</div></div></a>`).join('')}</div>
   <details class="card sc"><summary>Roteiro (texto do áudio)</summary><div class="content" style="white-space:pre-wrap">${esc(cur.script)}</div></details>`;
  const au = $('#au', m); S.audio.last = cur.id; save();
  au.addEventListener('error', () => { $('#aerr', m).style.display = ''; });
  au.addEventListener('loadedmetadata', () => { const p = S.audio['p' + cur.id]; if(p && p < au.duration - 3) au.currentTime = p; au.playbackRate = rate; });
  let lastSave = 0; au.addEventListener('timeupdate', () => { if(Date.now() - lastSave > 4000){ lastSave = Date.now(); S.audio['p' + cur.id] = Math.floor(au.currentTime); save(); } });
  au.addEventListener('ended', () => { delete S.audio['p' + cur.id]; activity(); save(); });
  $$('#rt .chip', m).forEach(c => c.onclick = () => { S.audio.rate = +c.dataset.r; au.playbackRate = S.audio.rate; save(); $$('#rt .chip', m).forEach(x => x.classList.toggle('on', x === c)); });
};

/* ---------- Sobre ---------- */
VIEWS.sobre = m => {
  const it = D.info.find(i => i.id === route[1]);
  if(it){ setTitle(it.title, 'Sobre a prova'); m.innerHTML = `<div class="card content">${it.html}</div><a class="btn" href="#/sobre">← Voltar</a>`; return; }
  setTitle('Sobre a prova', `${D.meta.banca} · ${fmtD(D.meta.prova)}/2026`);
  m.innerHTML = `<div class="card"><h3>${esc(D.meta.titulo)}</h3><div class="small">${esc(D.meta.subtitulo)}</div><div class="small mut" style="margin-top:6px">${esc(D.meta.nota)}</div>
   <table class="sc" style="margin-top:8px"><tbody><tr><td>Língua Portuguesa</td><td class="n">Q1–10</td></tr><tr><td>Língua Inglesa</td><td class="n">Q11–20</td></tr><tr><td>Específicos (Ofensiva · Defensiva · Compliance)</td><td class="n">Q21–70</td></tr></tbody></table></div>
   <div class="card">${D.info.map(i => `<a class="li" href="#/sobre/${i.id}"><div class="f1"><div class="t">${esc(i.title)}</div></div></a>`).join('')}</div>
   <div class="card small mut">Conteúdo extraído do material de estudo (resumos, BIZUs, questões). Todas as questões são <b>inéditas no estilo Cesgranrio</b>; os textos da Leitura em Inglês são reais, com fonte citada. Versão dos dados: ${esc(D.meta.versao)}.</div>`;
};

/* ---------- Mais ---------- */
VIEWS.mais = m => {
  setTitle('Mais', 'Todas as ferramentas');
  const badge = {erros:dueErrors().length + dueRod().length};
  m.innerHTML = `<div class="tiles">${MORE.map(([k, l, i, s]) => `<a class="tile" href="#/${k}">${ic(i)}<b>${l}${badge[k] ? ` <span class="tag alta">${badge[k]}</span>` : ''}</b><span>${s}</span></a>`).join('')}</div>`;
};

/* ---------- Progresso (backup) ---------- */
/* mergeState fica em src/merge.js (também usado pela sincronização). */
function doImport(txt, mode){
  let b; try { b = JSON.parse(txt); } catch(e){ toast('Arquivo inválido (não é JSON).'); return; }
  if(b && b.app === 'tp7' && b.state) b = b.state;
  if(!b || typeof b !== 'object' || !('answers' in b)){ toast('JSON não parece um backup deste app.'); return; }
  S = mode === 'replace' ? Object.assign(blank(), b) : mergeState(S, b); save(); theme(); toast(mode === 'replace' ? 'Progresso substituído.' : 'Progresso mesclado.'); render();
}
VIEWS.backup = m => {
  setTitle('Progresso', 'Exportar · importar · tema');
  const nA = Object.values(S.answers).reduce((a, x) => a + x.length, 0), payload = () => JSON.stringify({app:'tp7', exported:new Date().toISOString(), state:S});
  m.innerHTML = `<div class="card"><h3>Seu progresso</h3><div class="stat"><div><b>${nA}</b><span>respostas</span></div><div><b>${Object.keys(S.errors).length}</b><span>no caderno</span></div><div><b>${Object.keys(S.cards).length}</b><span>cartões vistos</span></div></div>
   <div class="small mut" style="margin-top:8px">Tudo fica salvo neste navegador (armazenamento local${Storage.available() ? '' : ' — <b>indisponível agora</b>'}). Exporte com frequência para não perder nada ao trocar de aparelho ou limpar o navegador. <a href="#/sincronizar">Sincronizar com uma conta</a> é opcional e não é necessário para estudar offline.</div></div>
   <div class="card"><h3>Exportar</h3><div class="row"><button class="btn p" id="exp">Baixar backup (.json)</button><button class="btn" id="cpy">Copiar como texto</button></div></div>
   <div class="card"><h3>Importar</h3><label class="lb">Modo</label><div class="chips" id="im"><span class="chip on" data-v="merge">Mesclar com o atual</span><span class="chip" data-v="replace">Substituir tudo</span></div>
    <input type="file" id="fil" accept=".json,application/json" style="margin-top:10px"><label class="lb">…ou cole o texto do backup</label><textarea id="txt" rows="4" placeholder='{"app":"tp7",...}'></textarea><button class="btn" id="imp" style="margin-top:8px">Importar texto colado</button></div>
   <div class="card"><h3>Aparência</h3><div class="chips" id="th">${[['', 'Automático'], ['light', 'Claro'], ['dark', 'Escuro']].map(([v, l]) => `<span class="chip ${(S.settings.theme || '') === v ? 'on' : ''}" data-v="${v}">${l}</span>`).join('')}</div></div>
   <div class="card"><h3>Zerar</h3><button class="btn bad" id="rst">Apagar todo o progresso deste aparelho</button></div>`;
  let mode = 'merge';
  $$('#im .chip', m).forEach(c => c.onclick = () => { mode = c.dataset.v; $$('#im .chip', m).forEach(x => x.classList.toggle('on', x === c)); });
  $('#exp', m).onclick = () => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([payload()], {type:'application/json'})); a.download = `transpetro-enfase7-progresso-${dk()}.json`; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500); toast('Backup gerado.'); };
  $('#cpy', m).onclick = async () => { const t = payload(); try { await navigator.clipboard.writeText(t); toast('Copiado! Cole num bloco de notas ou mande para você mesmo.'); } catch(e){ $('#txt', m).value = t; $('#txt', m).select(); toast('Texto colocado na caixa abaixo — copie manualmente.'); } };
  $('#fil', m).onchange = e => { const f = e.target.files[0]; if(!f) return; const r = new FileReader(); r.onload = () => doImport(r.result, mode); r.readAsText(f); };
  $('#imp', m).onclick = () => { const t = $('#txt', m).value.trim(); if(t) doImport(t, mode); else toast('Cole o texto primeiro.'); };
  $$('#th .chip', m).forEach(c => c.onclick = () => { if(c.dataset.v) theme(c.dataset.v); else { delete S.settings.theme; save(); theme(); } render(); });
  $('#rst', m).onclick = () => {
    const cloud = typeof Sync !== 'undefined' && Sync.user;
    const ask = cloud ? 'Apagar o progresso deste aparelho e também o que está salvo na conta?' : 'Apagar TODO o progresso deste aparelho? (Exporte antes se quiser guardar.)';
    if(confirm(ask) && confirm('Tem certeza? Não dá para desfazer.')){ const th = S.settings.theme; S = blank(); if(th) S.settings.theme = th; save(); FQ = null; QS = null; toast(cloud ? 'Progresso zerado neste aparelho e na conta.' : 'Progresso zerado.'); render(); }
  };
};

/* ---------- shell ---------- */
function shell(){
  $('#bnav').innerHTML = NAV.map(([k, l, i]) => `<a href="#/${k}" data-k="${k}">${ic(i)}<span>${l}</span></a>`).join('');
  const by = k => NAV.find(x => x[0] === k) || MORE.find(x => x[0] === k);
  const link = k => { const it = by(k); return `<a href="#/${it[0]}" data-k="${it[0]}">${ic(it[2])}<span>${it[1]}</span></a>`; };
  $('#side').innerHTML = `<div class="brand"><span class="mark" aria-hidden="true">E7</span><div>Transpetro<small>Ênfase 7 · Cibernética</small></div></div>
   <div class="side-sec">Estudar</div>${['home','questoes','simulado','flashcards','erros'].map(link).join('')}
   <div class="side-sec">Conteúdo</div>${['bizus','resumos','leitura','glossario','ouvir'].map(link).join('')}
   <div class="side-sec">Plano</div>${['cronograma','prova','sobre'].map(link).join('')}
   <div class="side-sec">Conta</div>${['backup','sincronizar'].map(link).join('')}`;
  $('#themeBtn').onclick = () => theme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
  window.addEventListener('hashchange', render);
  window.addEventListener('storage', e => { if(e.key === Storage.prefix + SKEY){ loadState(); theme(); render(); } });
  if(/^https?:$/.test(location.protocol)){
    const l = document.createElement('link'); l.rel = 'manifest'; l.href = 'manifest.webmanifest'; document.head.appendChild(l);
    if('serviceWorker' in navigator){
      let had = !!navigator.serviceWorker.controller;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if(!had){ had = true; return; }
        location.reload();
      });
      navigator.serviceWorker.register('./sw.js', {scope:'./', updateViaCache:'none'}).catch(() => {});
    }
  }
  theme(); render();
}
shell();
