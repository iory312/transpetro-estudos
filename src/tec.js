/* Links públicos do TEC Concursos. Sem API: só abre a página do assunto. */
const TEC = {};
((D.tec && D.tec.topicos) || []).forEach(t => { TEC[t.topic_id] = t; });
function tecObs(t){
  return String(t && t.obs || '').replace(/\s*filtrar banca Cesgranrio[\s\S]*$/i, '').trim();
}
function tecClick(ev){
  if(navigator.onLine) return;
  ev.preventDefault();
  toast('Sem internet. O link do TEC abre quando você estiver online.');
}
function tecBind(root){ $$('a[data-tec]', root).forEach(a => { a.addEventListener('click', tecClick); }); }
function tecBtn(id){
  const t = TEC[id];
  if(!t) return '';
  const extra = tecObs(t);
  const aproximado = t.precisao === 'aproximado';
  return `<div class="tecbox"><a class="btn" data-tec="${esc(id)}" href="${esc(t.url)}" target="_blank" rel="noopener noreferrer">Resolver no TEC</a>
   <div class="small"><b>${esc(t.tec_assunto)}</b></div>
   ${aproximado || extra ? `<div class="small mut">${esc(extra || 'O assunto do TEC é o mais próximo deste tópico.')}</div>` : ''}
   <div class="small mut">No TEC, filtre a banca CESGRANRIO.</div></div>`;
}
VIEWS.tec = m => {
  setTitle('TEC Concursos', 'Links por tópico · sem API');
  const gerais = (D.tec && D.tec.gerais) || [];
  const guias = gerais.filter(g => /Caderno guia TEC/.test(g.titulo) && /transpetro-2026/.test(g.url));
  const resto = gerais.filter(g => guias.indexOf(g) < 0);
  const mods = [];
  (D.tec.topicos || []).forEach(t => { if(mods.indexOf(t.modulo) < 0) mods.push(t.modulo); });
  const link = (g, cls) => `<a class="${cls || 'li'}" data-tec="g" href="${esc(g.url)}" target="_blank" rel="noopener noreferrer"><div class="f1"><div class="t">${esc(g.titulo)}</div>${g.obs ? `<div class="s">${esc(g.obs)}</div>` : ''}</div></a>`;
  m.innerHTML = `${navigator.onLine ? '' : '<div class="alert warn">Você está offline. Os links do TEC só abrem com internet.</div>'}
   <div class="card"><h3>Cadernos guia · Transpetro 2026</h3>
    <p class="small">Abra logado e clique em Salvar. Estes cadernos cobrem a ênfase 7: específicos, português e inglês.</p>
    <div class="tec-guides">${guias.map(g => `<a class="tec-guide" data-tec="guia" href="${esc(g.url)}" target="_blank" rel="noopener noreferrer"><b>${esc(g.titulo.replace(/^Caderno guia TEC – /, ''))}</b><span>Abra logado e clique em Salvar.</span></a>`).join('')}</div></div>
   <div class="card"><h3>Links gerais</h3>${resto.map(g => link(g)).join('')}</div>
   ${mods.map(mod => `<div class="card"><h3>${esc(mod)}</h3>${(D.tec.topicos || []).filter(t => t.modulo === mod).map(t => {
     const on = !!(S.tec && S.tec[t.topic_id]);
     const extra = tecObs(t);
     return `<div class="li ${on ? 'done' : ''}" style="align-items:flex-start"><input type="checkbox" data-tecdone="${esc(t.topic_id)}" ${on ? 'checked' : ''} aria-label="feito no TEC: ${esc(t.topic_title)}"><div class="f1"><div class="t">${esc(t.topic_title)}</div><div class="s">${esc(t.tec_assunto)}${t.precisao === 'aproximado' ? ' · aproximado' : ''}</div>${extra ? `<div class="s">${esc(extra)}</div>` : ''}<div class="s">No TEC, filtre a banca CESGRANRIO.</div><a class="btn sm" style="margin-top:6px" data-tec="${esc(t.topic_id)}" href="${esc(t.url)}" target="_blank" rel="noopener noreferrer">Resolver no TEC</a></div></div>`;
   }).join('')}</div>`).join('')}`;
  tecBind(m);
  $$('[data-tecdone]', m).forEach(cb => cb.onchange = () => {
    S.tec = S.tec || {};
    S.tec[cb.dataset.tecdone] = cb.checked;
    if(cb.checked) activity();
    save();
    cb.closest('.li').classList.toggle('done', cb.checked);
  });
};
