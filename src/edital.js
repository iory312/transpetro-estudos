/* Edital verticalizado — texto do Anexo IV (ênfase 7), sem parafrasear o item. */
const EDITAL_PROVA = '2026-12-06';
const EDITAL = [
  {id:'bas', titulo:'CONHECIMENTOS BÁSICOS (Conhecimentos Gerais – Fase 2)', grupos:[
    {id:'pt', titulo:'LÍNGUA PORTUGUESA', itens:[
      item('pt-1','1','Compreensão de textos.',['pt1'],['pt1']),
      item('pt-2','2','Ortografia oficial.',['pt4'],[]),
      item('pt-3','3','Mecanismos de coesão textual.',['pt2'],['pt2']),
      item('pt-4','4','Significação das palavras.',['pt4'],[]),
      item('pt-5','5','Emprego de tempos e modos verbais.',['pt4'],[]),
      item('pt-6','6','Emprego das classes de palavras.',['pt4'],[]),
      item('pt-7','7','Coordenação e de subordinação.',['pt2'],[]),
      item('pt-8','8','Emprego dos sinais de pontuação.',['pt4'],[]),
      item('pt-9','9','Concordância verbal e nominal.',['pt3'],['pt3']),
      item('pt-10','10','Regência verbal e nominal.',['pt3'],[]),
      item('pt-11','11','Emprego do sinal indicativo de crase.',['pt3'],[]),
      item('pt-12','12','Colocação dos pronomes átonos.',['pt3'],[])
    ]},
    {id:'en', titulo:'LÍNGUA INGLESA', itens:[
      item('en-1','1','Compreensão de texto escrito em língua inglesa.',['en1'],['en1','le1','le2','le3','le4','le5','le6','le7','le8','le9','le10','le11','le12']),
      item('en-2','2','Itens gramaticais relevantes para a compreensão dos conteúdos semânticos.',['en1'],['en2'])
    ]}
  ]},
  {id:'esp', titulo:'CONHECIMENTOS ESPECÍFICOS (Fase 1)', grupos:[
    {id:'of', titulo:'1. Segurança Ofensiva', itens:[
      item('of-1.1','1.1','Conceitos básicos: vulnerabilidades, ameaças e ataques.',['of1'],['of1']),
      item('of-1.2','1.2','Ataques Passivos: Escuta Passiva e Inferência.',['of1'],[]),
      item('of-1.3','1.3','Ataques Ativos: Escuta Ativa, Disfarce, Repetição e Negação de Serviço.',['of1'],[]),
      item('of-1.4','1.4','Etapas do Ataque: Footprinting, Varredura, Enumeração, Ganho de acesso, Escalação de privilégios, Criação de Porta dos Fundos, Encobrimento de rastros e Recusas de serviço.',['of2'],['of2']),
      item('of-1.5','1.5','Ataques aos protocolos de comunicação: ARP, IP, ICMP, UDP, TCP, DHCP, SMTP, IMAP, POP3, HTTP, FTP, SMB.',['of3'],['of3']),
      item('of-1.6','1.6','Ataques à Rede Wi-Fi: Rogue Access Point, Evil Twin, SSID Tracking, Jamming e Disassociation.',['of4'],['of4']),
      item('of-1.7','1.7','Ataques do Man-in-the-Middle: Sniffing e Spoofing.',['of5'],['of5']),
      item('of-1.8','1.8','Ataques de Engenharia Social: Ciclo de Ataque e Técnicas.',['of6'],['of6']),
      item('of-1.9','1.9','Código Malicioso: Vírus, Worm, Trojan Horse, Backdoor, Screenlogger, Keylogger, Injector, Downloader, Flooder, Rootkit, Bot, Botnet, Exploit, Spyware, Ransomware, Cryptojacking e Formjacking.',['of7'],['of7']),
      item('of-1.10','1.10','MITRE ATT&CK: matrizes, táticas, técnicas, procedimentos e mitigações.',['of8'],['of8']),
      item('of-1.11','1.11','– MITRE CAPEC: Padrões de Ataques Cibernéticos, Mecanismos de Ataque, Domínios de Ataque.',['of9'],['of9']),
      item('of-1.12','1.12','Ferramentas de Hacking: amass, aircrack-ng, airgeddon, arpwatch, beef-xss, burpsuite, ettercap, ghidra, hashcat, hydra, john the ripper, nmap, netcat, maltego, steghide, masscan, mimikatz, metasploit-framework, set, smbmap, sqlmap, theharvester, veil, wireshark.',['of10'],['of10'])
    ]},
    {id:'df', titulo:'2. Segurança Defensiva', itens:[
      item('df-2.1','2.1','Defesa em profundidade: Perímetro de segurança (Filtro de Pacotes, Firewall de Estado, Firewall Proxy, IDS, IPS, VPN).',['df1'],['df1']),
      item('df-2.2','2.2','Controle de Acesso à Rede: IEEE 802.1X, EAP e RADIUS. Segurança em Aplicações: OWASP Top 10, OWASP SAMM, CVE, CWE.',['df2'],['df2']),
      item('df-2.3','2.3','Segurança da Informação: Integridade, Autenticidade, Confidencialidade, Autorização de Acesso, Disponibilidade e Irretratabilidade.',['df3'],['df3']),
      item('df-2.4','2.4','Mecanismos de Segurança: Resumo de Mensagem, Cifragem de Dados, Assinatura Digital, Envelope Digital, Certificado Digital, Autenticação Multifator, Carimbo do Tempo e Técnicas de Redundância e Tolerância a Falhas.',['df4'],['df4']),
      item('df-2.5','2.5','ICP-Brasil: Autoridade Certificadora, Autoridade de Carimbo do Tempo, Organização, Normas e Padrões.',['df5'],['df5']),
      item('df-2.6','2.6','Comunicação Segura: TLS, SSL, IPsec.',['df6'],['df6']),
      item('df-2.7','2.7','Segurança no Endpoint: Antimalware e Firewall Pessoal.',['df7'],['df7']),
      item('df-2.8','2.8','Segurança em Sistemas Operacionais: CIS Benchmarks, Linux e Windows.',['df8'],['df8']),
      item('df-2.9','2.9','Segurança em Sistemas de Controle e Automação Industrial: ameaças e vulnerabilidades, ICS Advisory Project, Série ISA/IEC 62443 e NIST SP 800-82.',['df9'],['df9']),
      item('df-2.10','2.10','Forense Digital: Evidência Digital, Processo de Análise Forense, Análise Forense de Dispositivos de Armazenamento, Sites e E-mails e Open Source Intelligence (OSINT).',['df10'],['df10'])
    ]},
    {id:'cp', titulo:'3. Compliance de Segurança e Privacidade', itens:[
      item('cp-3.1','3.1','Normas: ABNT NBR ISO/IEC 27001:2022 (Versão Corrigida: 2023), ABNT NBR ISO/IEC 27002:2022, ABNT NBR ISO/IEC 27005:2023, ABNT ISO/IEC 27035-1:2023, ABNT NBR ISO 22301:2020, ABNT NBR ISO 22313:2020, ABNT NBR ISO/IEC 29100:2024, ABNT NBR ISO/IEC 29134:2024, ABNT NBR ISO/IEC 27701:2019 (Versão corrigida: 2020)',['cp1','cp2','cp3','cp4'],['cp1','cp2','cp3','cp4']),
      item('cp-3.2','3.2','Frameworks e Controles: The NIST Cybersecurity Framework (CSF) 2.0, CIS Critical Security Controls Version 8.1.',['cp5'],['cp5']),
      item('cp-3.3','3.3','Leis e Regulamentações: Marco Civil da Internet (Lei nº 12.965, de 23 de abril de 2014, e suas alterações); LGPD - Lei Geral de Proteção de Dados (Lei nº 13.709, de 14 de agosto de 2018, e suas alterações); Regulamento de Segurança Cibernética Aplicada ao Setor de Telecomunicações – ANATEL (Resolução nº 740, de 21 de dezembro de 2020, e suas alterações).',['cp6','cp7','cp8'],['cp6','cp7','cp8'])
    ]}
  ]}
];
function item(id, num, txt, topics, quiz){ return {id:id, num:num, txt:txt, topics:topics || [], quiz:quiz || []}; }
const EDITAL_ITENS = [];
EDITAL.forEach(sec => sec.grupos.forEach(g => g.itens.forEach(it => EDITAL_ITENS.push(it))));
const EDITAL_QUIZ = {};
EDITAL_ITENS.forEach(it => (it.quiz || []).forEach(topic => { if(!EDITAL_QUIZ[topic]) EDITAL_QUIZ[topic] = it.id; }));
let editalFilt = 'todos', editalBusca = '';
function editalRead(id){
  const e = (S.edital && S.edital[id]) || {};
  const q = Math.max(0, +e.q || 0), ok = Math.max(0, Math.min(q, +e.ok || 0));
  return {t:!!e.t, te:e.te || '', r:[!!(e.r && e.r[0]), !!(e.r && e.r[1]), !!(e.r && e.r[2])], q:q, ok:ok, n:e.n || '', u:e.u || ''};
}
function editalGet(id){
  S.edital = S.edital || {};
  if(!S.edital[id] || typeof S.edital[id] !== 'object') S.edital[id] = {t:false, te:'', r:[false,false,false], q:0, ok:0, n:'', u:''};
  const e = S.edital[id];
  e.r = [!!(e.r && e.r[0]), !!(e.r && e.r[1]), !!(e.r && e.r[2])];
  e.q = Math.max(0, +e.q || 0); e.ok = Math.max(0, Math.min(e.q, +e.ok || 0));
  e.n = e.n || ''; e.te = e.te || ''; e.u = e.u || '';
  return e;
}
function editalRevDate(te, plus){
  if(!te || typeof addDays !== 'function') return '';
  const d = addDays(te, plus);
  return d > EDITAL_PROVA ? EDITAL_PROVA : d;
}
function editalPct(e){ return e.q ? Math.round(100 * e.ok / e.q) : null; }
function editalPctClass(p){ if(p == null) return ''; return p < 60 ? 'bad' : (p < 80 ? 'mid' : 'ok'); }
function editalLate(e, i){
  if(!e.t || e.r[i]) return false;
  const d = editalRevDate(e.te, [1, 7, 30][i]);
  return !!(d && typeof dk === 'function' && d < dk());
}
function editalSum(itens){
  const list = itens || EDITAL_ITENS;
  let te = 0, rev = 0, q = 0, ok = 0;
  list.forEach(it => { const e = (S.edital && S.edital[it.id]) || {}; if(e.t) te++; const r = e.r || []; rev += (r[0]?1:0)+(r[1]?1:0)+(r[2]?1:0); q += +e.q || 0; ok += +e.ok || 0; });
  return {n:list.length, te:te, teoria:list.length ? Math.round(100 * te / list.length) : 0, rev:rev, revPct:list.length ? Math.round(100 * rev / (list.length * 3)) : 0, q:q, ok:ok, pct:q ? Math.round(100 * ok / q) : null};
}
function editalMatch(it, e){
  const q = (typeof norm === 'function' ? norm(editalBusca) : editalBusca.toLowerCase());
  if(q && (typeof norm === 'function' ? norm(it.num + ' ' + it.txt) : (it.num + ' ' + it.txt).toLowerCase()).indexOf(q) < 0) return false;
  if(editalFilt === 'pendentes') return !e.t;
  if(editalFilt === 'atrasada') return [0,1,2].some(i => editalLate(e, i));
  if(editalFilt === 'baixo'){ const p = editalPct(e); return p != null && p < 60; }
  return true;
}
function editalLinks(it){
  let h = '';
  (it.topics || []).forEach((id, i) => {
    const top = typeof TOP !== 'undefined' && TOP[id];
    const label = it.topics.length > 1 ? (top ? top.title.split('—')[0].trim() : id) : 'Questões no app';
    h += `<a class="btn sm" href="#/questoes/t/${esc(id)}">${esc(label)}</a> `;
    const tec = typeof TEC !== 'undefined' && TEC[id];
    if(tec) h += `<a class="btn sm" data-tec="${esc(id)}" href="${esc(tec.url)}" target="_blank" rel="noopener noreferrer">${it.topics.length > 1 ? 'TEC · ' + esc(id) : 'Resolver no TEC'}</a> `;
    if(i === 0 && id === 'en1') h += '<a class="btn sm" href="#/leitura">Leitura no app</a> ';
  });
  return h;
}
function editalShort(it){
  const t = it.txt.replace(/^–\s*/, '');
  const cut = t.split(':')[0];
  return cut.length > 42 ? cut.slice(0, 40) + '…' : cut;
}
function editalRevisarHoje(){
  const today = typeof dk === 'function' ? dk() : '';
  const rows = [];
  EDITAL_ITENS.forEach(it => {
    const e = editalRead(it.id);
    if(!e.t || !e.te) return;
    let pick = null;
    [0, 1, 2].forEach(i => {
      if(e.r[i]) return;
      const d = editalRevDate(e.te, [1, 7, 30][i]);
      if(!d || d > today) return;
      if(!pick || d < pick.d) pick = {it:it, i:i, d:d, late:d < today};
    });
    if(pick) rows.push(pick);
  });
  rows.sort((a, b) => a.d < b.d ? -1 : a.d > b.d ? 1 : (a.i - b.i));
  return rows;
}
function editalLateCount(){
  let n = 0;
  EDITAL_ITENS.forEach(it => { const e = editalRead(it.id); if([0,1,2].some(i => editalLate(e, i))) n++; });
  return n;
}
function editalToggles(it){
  const e = editalRead(it.id);
  const dates = e.t ? [1, 7, 30].map(n => editalRevDate(e.te, n)) : ['','',''];
  const tgl = (label, on, late, attr) => `<button type="button" class="tog ${on ? 'on' : ''} ${late ? 'late' : ''}" ${attr} aria-pressed="${on ? 'true' : 'false'}" aria-label="${esc(label)}">${label}</button>`;
  return tgl('T', e.t, false, `data-ed-t="${esc(it.id)}"`) + [0,1,2].map(i => tgl('R' + (i + 1), e.r[i], editalLate(e, i), `data-ed-r="${esc(it.id)}" data-i="${i}" title="${dates[i] ? (typeof fmtD === 'function' ? fmtD(dates[i]) : dates[i]) : ''}"`)).join('');
}
function editalRow(it){
  const e = editalRead(it.id);
  const p = editalPct(e);
  return `<article class="ed-item" data-ed-open="${esc(it.id)}"><div class="ed-top"><span class="ed-num">${esc(it.num)}</span><button type="button" class="ed-title" data-ed-exp="${esc(it.id)}">${esc(editalShort(it))}</button><span class="ed-pill ${editalPctClass(p)}" data-ed-open="${esc(it.id)}">${e.ok}/${e.q} <b>${p == null ? '—' : p + '%'}</b></span></div>
   <div class="ed-togs">${editalToggles(it)}</div>
   <p class="ed-full">${esc(it.txt)}</p></article>`;
}
function editalBars(sum){
  const ac = sum.pct == null ? '—' : sum.pct + '%';
  return `<div class="ed-meta"><span>${sum.teoria}% concluído</span><span class="ed-pct ${editalPctClass(sum.pct)}">${ac} acerto</span></div>
    <div class="bar ed-thin"><i style="width:${sum.teoria}%"></i></div>`;
}
function editalOnAnswer(q, ok){
  if(!q || !q.topic) return;
  const id = EDITAL_QUIZ[q.topic];
  if(!id) return;
  const e = editalGet(id);
  e.q += 1; if(ok) e.ok += 1; e.u = dk();
}
function editalFromPlano(blockId){
  if(typeof buildPlano !== 'function') return;
  let topic = '';
  buildPlano(planoHoras(), S.planoMove).forEach(d => d.blocks.forEach(b => { if(b.id === blockId) topic = b.topic || ''; }));
  const id = EDITAL_QUIZ[topic];
  if(!id) return;
  const e = editalGet(id);
  if(!e.t){ e.t = true; if(!e.te) e.te = dk(); }
  e.u = dk();
}
function editalCardHTML(){
  const s = editalSum();
  return `<div class="card"><h3>Edital <span class="r">${s.teoria}% teoria</span></h3>${editalBars(s)}<a class="btn sm" href="#/edital" style="margin-top:8px">Abrir edital verticalizado</a></div>`;
}
function editalDraw(root){
  const box = $('#edList', root);
  if(!box) return;
  let html = '';
  EDITAL.forEach(sec => {
    const grupos = sec.grupos.map(g => {
      const rows = g.itens.filter(it => editalMatch(it, editalRead(it.id)));
      if(!rows.length) return '';
      const sum = editalSum(g.itens);
      return `<details class="card ed-grp" open><summary><b>${esc(g.titulo)}</b>${editalBars(sum)}</summary>${rows.map(editalRow).join('')}</details>`;
    }).join('');
    if(grupos) html += `<h2 class="ed-sec">${esc(sec.titulo)}</h2>${grupos}`;
  });
  box.innerHTML = html || '<div class="card empty">Nenhum item com esse filtro.</div>';
  $$('[data-ed-t]', box).forEach(b => b.onclick = ev => {
    ev.stopPropagation();
    const e = editalGet(b.dataset.edT); e.t = !e.t; if(e.t && !e.te) e.te = dk(); e.u = dk(); save(); editalDraw(root); if(editalOpen === b.dataset.edT) editalSheet(b.dataset.edT);
  });
  $$('[data-ed-r]', box).forEach(b => b.onclick = ev => {
    ev.stopPropagation();
    const e = editalGet(b.dataset.edR); e.r[+b.dataset.i] = !e.r[+b.dataset.i]; e.u = dk(); save(); editalDraw(root); if(editalOpen === b.dataset.edR) editalSheet(b.dataset.edR);
  });
  $$('[data-ed-exp]', box).forEach(b => b.onclick = ev => { ev.stopPropagation(); b.closest('.ed-item').classList.toggle('open'); });
  $$('[data-ed-open]', box).forEach(el => { if(el.classList.contains('tog')) return; el.addEventListener('click', ev => { if(ev.target.closest('.tog, .ed-title')) return; editalSheet(el.dataset.edOpen); }); });
  if(typeof tecBind === 'function') tecBind(box);
  const s = editalSum();
  const lab = $('#edTot', root); if(lab) lab.innerHTML = editalBars(s);
}
let editalOpen = '';
function editalSheet(id){
  const it = EDITAL_ITENS.find(x => x.id === id); if(!it) return;
  editalOpen = id;
  const e = editalRead(id);
  const host = document.getElementById('edSheet'); if(!host) return;
  host.hidden = false;
  host.innerHTML = `<div class="sheet" role="dialog" aria-modal="true" aria-label="${esc(it.num)}"><div class="sheet-grab"></div>
    <div class="row sp"><b>${esc(it.num)}</b><button type="button" class="btn sm" id="edClose">Fechar</button></div>
    <p class="ed-txt">${esc(it.txt)}</p>
    ${typeof teoriaDoItem === 'function' ? teoriaDoItem(it) : ''}
    <div class="ed-togs" style="margin:8px 0">${editalToggles(it)}</div>
    <div class="step"><span>Feitas</span><button type="button" class="btn" data-step="q" data-d="-1" aria-label="Menos feitas">−</button><b id="edQv">${e.q}</b><button type="button" class="btn" data-step="q" data-d="1" aria-label="Mais feitas">+</button></div>
    <div class="step"><span>Acertos</span><button type="button" class="btn" data-step="ok" data-d="-1" aria-label="Menos acertos">−</button><b id="edOv">${e.ok}</b><button type="button" class="btn" data-step="ok" data-d="1" aria-label="Mais acertos">+</button></div>
    <div class="small mut" style="margin-top:8px">Último estudo: ${e.u && typeof fmtD === 'function' ? fmtD(e.u) : (e.u || '—')}</div>
    <label class="lb" for="edNote">Anotação</label><input id="edNote" type="text" maxlength="180" value="${esc(e.n)}">
    <div class="ed-links" style="margin-top:12px">${editalLinks(it)}</div></div>`;
  host.onclick = ev => { if(ev.target === host) editalClose(); };
  $('#edClose').onclick = editalClose;
  $$('[data-step]', host).forEach(b => b.onclick = () => {
    const row = editalGet(id); const k = b.dataset.step; const d = +b.dataset.d;
    if(k === 'q'){ row.q = Math.max(0, row.q + d); if(row.ok > row.q) row.ok = row.q; }
    else { row.ok = Math.max(0, row.ok + d); if(row.ok > row.q) row.q = row.ok; }
    row.u = dk(); save(); editalSheet(id); editalDraw(document.getElementById('main'));
  });
  $('#edNote').onchange = () => { const row = editalGet(id); row.n = $('#edNote').value.slice(0, 180); row.u = dk(); save(); };
  $$('[data-ed-t]', host).forEach(b => b.onclick = ev => { ev.stopPropagation(); const row = editalGet(id); row.t = !row.t; if(row.t && !row.te) row.te = dk(); row.u = dk(); save(); editalSheet(id); editalDraw(document.getElementById('main')); });
  $$('[data-ed-r]', host).forEach(b => b.onclick = ev => { ev.stopPropagation(); const row = editalGet(id); row.r[+b.dataset.i] = !row.r[+b.dataset.i]; row.u = dk(); save(); editalSheet(id); editalDraw(document.getElementById('main')); });
  if(typeof tecBind === 'function') tecBind(host);
  if(typeof bindTeoria === 'function') bindTeoria(host);
}
function teoriaDoItem(it){
  const T = globalThis.TP7_TEORIA; if(!T) return '';
  const vistos = {};
  const lista = [];
  Object.keys(T).forEach(k => {
    const r = T[k];
    if(r && r.itens && r.itens.indexOf(it.id) >= 0 && !vistos[r.id]){ vistos[r.id] = 1; lista.push(r); }
  });
  if(!lista.length) return '';
  return `<div class="ed-links" style="margin-top:8px">${lista.map(r => `<div class="teoria-linha">${teoriaChip(r, it.id)}${r.nota ? `<span class="small mut">${esc(r.nota)}</span>` : ''}${r.alt ? `<a class="small" data-teoria="${esc(r.id)}" data-ed="${esc(it.id)}" href="${esc(r.alt.url)}" target="_blank" rel="noopener noreferrer">Alternativa: ${esc(r.alt.titulo)} · ${esc(r.alt.tempo)}</a>` : ''}</div>`).join('')}</div>`;
}
function editalClose(){ editalOpen = ''; const host = document.getElementById('edSheet'); if(host){ host.hidden = true; host.innerHTML = ''; } }
if(typeof VIEWS !== 'undefined') VIEWS.edital = m => {
  setTitle('Edital', 'Ênfase 7 · verticalizado');
  const sum = editalSum();
  m.innerHTML = `<div class="ed-stick"><input id="edBusca" type="search" placeholder="Buscar no edital" value="${esc(editalBusca)}" aria-label="Buscar no edital">
    <div class="chips" id="edFilt">${[['todos','Todos'],['pendentes','Pendentes'],['atrasada','Revisão atrasada'],['baixo','% baixo']].map(([v,l]) => `<button type="button" class="chip ${editalFilt === v ? 'on' : ''}" data-f="${v}">${l}</button>`).join('')}</div>
    <div id="edTot">${editalBars(sum)}</div></div><div id="edList"></div><div id="edSheet" class="sheet-back" hidden></div>`;
  editalDraw(m);
  if(editalOpen) editalSheet(editalOpen);
  $('#edBusca', m).oninput = e => { editalBusca = e.target.value; editalDraw(m); };
  $$('#edFilt .chip', m).forEach(c => c.onclick = () => { editalFilt = c.dataset.f; $$('#edFilt .chip', m).forEach(x => x.classList.toggle('on', x === c)); editalDraw(m); });
};
