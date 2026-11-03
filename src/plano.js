/* Plano dia a dia: 03/11/2026 até a prova de 06/12/2026.
   Minutos cabem nas horas do dia (3h útil / 5h fim de semana, editável).
   O checkbox "feito" fica em S.plano e entra na união da sincronização. */
function pParse(k){ const [y,m,d] = k.split('-').map(Number); return new Date(y, m-1, d); }
function pISO(d){ return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }
function pAdd(k, n){ const d = pParse(k); d.setDate(d.getDate()+n); return pISO(d); }
function pFmt(k){ const d = pParse(k); return String(d.getDate()).padStart(2,'0')+'/'+String(d.getMonth()+1).padStart(2,'0'); }
function pWe(k){ const d = pParse(k).getDay(); return d === 0 || d === 6; }
function pWd(k){ return ['dom','seg','ter','qua','qui','sex','sáb'][pParse(k).getDay()]; }
function pMonday(k){ const d = pParse(k).getDay(); return pAdd(k, d === 0 ? -6 : 1 - d); }
function pRange(a, b){ const o = []; for(let k = a; k <= b; k = pAdd(k, 1)) o.push(k); return o; }
function planoHoras(){
  const h = (typeof S !== 'undefined' && S.planoH) || {};
  let sem = Number(h.sem), fim = Number(h.fim);
  if(!(sem >= 1 && sem <= 12)) sem = 3;
  if(!(fim >= 1 && fim <= 12)) fim = 5;
  return {sem:sem, fim:fim, t:h.t || 0};
}
function planoBudget(date, horas){
  if(date >= '2026-12-06') return 0;
  if(date === '2026-12-01') return Math.min(120, Math.round(horas.sem * 60));
  if(date === '2026-12-05') return Math.min(150, Math.round(horas.fim * 60 * 0.5));
  return Math.round((pWe(date) ? horas.fim : horas.sem) * 60);
}
function planoFit(blocks, budget, locks){
  locks = locks || {};
  let locked = 0;
  blocks.forEach(b => { if(locks[b.id]) locked += locks[b.id]; });
  const flexB = blocks.filter(b => !locks[b.id]);
  const flex = Math.max(0, budget - locked);
  const w = flexB.reduce((s, b) => s + (b.w || 1), 0) || 1;
  let acc = 0;
  flexB.forEach((b, i) => {
    if(i === flexB.length - 1) b.min = Math.max(15, flex - acc);
    else { b.min = Math.max(15, Math.round(flex * (b.w || 1) / w)); acc += b.min; }
  });
  blocks.forEach(b => { if(locks[b.id]) b.min = locks[b.id]; });
  if(flexB.length && flexB.reduce((s, b) => s + b.min, 0) + locked !== budget && budget > 0){
    const drift = budget - (blocks.reduce((s, b) => s + b.min, 0));
    flexB[flexB.length - 1].min = Math.max(15, flexB[flexB.length - 1].min + drift);
  }
}
const F1 = [
  ['of2','1.4 Nmap: etapas do ataque e flags','of2',8,'Ponto mais fraco. Questões primeiro; o resumo só entra no que você errar.'],
  ['df2a','802.1X, EAP e RADIUS','df2',7,'Controle de acesso à rede. DAI e DHCP snooping, se caírem, revise junto dos ataques a DHCP/ARP.'],
  ['of8','1.10 MITRE ATT&CK','of8',8,'Matriz, tática, técnica e mitigação. Questões no TEC.'],
  ['df1','Perímetro: firewall, IDS, IPS e VPN','df1',7,'Defesa em profundidade. Inclua filtro de pacotes, firewall de estado e proxy.'],
  ['of3','1.5 Ataques a protocolos','of3',8,'ARP, IP, ICMP, UDP, TCP, DHCP, SMTP, IMAP, POP3, HTTP, FTP e SMB.'],
  ['df2b','OWASP Top 10, CVE, CWE e SAMM','df2',7,'Segunda metade do tópico 2.2. Questões de aplicação.'],
  ['of10','1.12 Ferramentas do edital','of10',8,'As 24 ferramentas, com ênfase em nmap, burp, wireshark, metasploit, sqlmap e mimikatz.'],
  ['of5','1.7 Sniffing e spoofing','of5',6,'Man-in-the-Middle. Questões primeiro.'],
  ['of4','1.6 Ataques Wi-Fi','of4',5,'Rogue AP, Evil Twin, SSID tracking, jamming e disassociation.'],
  ['of1','1.1–1.3 Passivo e ativo','of1',5,'Escuta, inferência, disfarce, repetição e negação de serviço.'],
  ['of6','1.8 Engenharia social','of6',5,'Ciclo e técnicas. Questões no TEC.'],
  ['of7','1.9 Malware','of7',5,'Da lista do edital: vírus, worm, trojan, ransomware, rootkit, botnet e o restante.'],
  ['of9','1.11 MITRE CAPEC','of9',4,'Padrões, mecanismos e domínios de ataque.'],
  ['df6','2.6 TLS, SSL e IPsec','df6',6,'Ainda não testado. Questões primeiro.'],
  ['df5','2.5 ICP-Brasil','df5',5,'Ainda não testado. AC, carimbo do tempo, normas.'],
  ['df10','2.10 Forense e OSINT','df10',6,'Ainda não testado. Evidência, armazenamento, sites, e-mail e OSINT.'],
  ['df9','2.9 ICS/OT e ISA/IEC 62443','df9',6,'Ainda não testado. Ameaças, ICS Advisory, 62443 e NIST SP 800-82.'],
  ['cp5a','CIS Controls v8.1','cp5',5,'Ainda não testado. O NIST CSF deste tópico fica na revisão leve.'],
  ['cp5b','NIST CSF 2.0 — revisão leve','cp5',3,'Você já está forte aqui. Só questões rápidas, sem refazer a teoria.'],
  ['df4','2.4 Criptografia — revisão leve','df4',3,'Hash, cifra, assinatura, envelope, certificado, MFA, carimbo e redundância. Só o que errar.'],
  ['cp1','ISO 27001 e 27002 — revisão leve','cp1',3,'Ponto forte. Questões curtas.'],
  ['cp7','LGPD — revisão leve','cp7',3,'Ponto forte. Questões curtas.'],
  ['df3','2.3 Propriedades da informação','df3',4,'Integridade, autenticidade, confidencialidade, autorização, disponibilidade e irretratabilidade.'],
  ['df7','2.7 Endpoint: antimalware e firewall pessoal','df7',4,'Questões no TEC.'],
  ['df8','2.8 CIS Benchmarks, Linux e Windows','df8',5,'Hardening de sistema operacional.'],
  ['cp2','ISO 27005 e 27035','cp2',4,'Riscos e incidentes.'],
  ['cp3','ISO 22301 e 22313','cp3',4,'Continuidade de negócios.'],
  ['cp4','Privacidade: 29100, 29134 e 27701','cp4',4,'Questões no TEC.'],
  ['cp6','Marco Civil da Internet','cp6',3,'Lei 12.965/2014.'],
  ['cp8','Resolução Anatel 740/2020','cp8',4,'Segurança cibernética em telecomunicações.'],
  ['of2b','Nmap de novo: só as flags que errou','of2',5,'Segunda leva curta, ainda na base. Caderno de erros do app se já tiver questão errada.'],
  ['of8b','ATT&CK de novo','of8',5,'Segunda leva: tática × técnica.'],
  ['of3b','Protocolos de novo','of3',5,'Segunda leva dos ataques de rede.'],
  ['of10b','Ferramentas de novo','of10',5,'Segunda leva: as que ainda confunde.'],
  ['df1b','Firewall, IDS, IPS e VPN de novo','df1',4,'Segunda leva do perímetro.'],
  ['df2c','802.1X / RADIUS de novo','df2',4,'Segunda leva do controle de acesso.'],
  ['df2d','OWASP de novo','df2',4,'Segunda leva de Top 10, CVE, CWE e SAMM.'],
  ['of5b','Sniffing e spoofing de novo','of5',4,'Segunda leva curta.'],
  ['df10b','Forense e OSINT de novo','df10',4,'Ainda é terreno novo: mais uma leva de questões.'],
  ['df6b','TLS e IPsec de novo','df6',4,'Segunda leva do que não tinha sido testado.']
];
const F2 = [
  ['p2-of2','Revisão: nmap e etapas','of2',5,'Segunda passagem. Só questões; teoria no erro.'],
  ['p2-of8','Revisão: MITRE ATT&CK','of8',5,'Segunda passagem.'],
  ['p2-of3','Revisão: ataques a protocolos','of3',5,'Segunda passagem.'],
  ['p2-of10','Revisão: ferramentas do edital','of10',5,'Segunda passagem.'],
  ['p2-df1','Revisão: firewall, IDS, IPS, VPN','df1',5,'Segunda passagem do perímetro.'],
  ['p2-df2a','Revisão: 802.1X, EAP, RADIUS','df2',5,'Segunda passagem.'],
  ['p2-df2b','Revisão: OWASP, CVE, CWE, SAMM','df2',5,'Segunda passagem.'],
  ['p2-df10','Forense e OSINT — de novo','df10',5,'Não testado antes do plano: mais uma leva.'],
  ['p2-df9','ICS/OT e IEC 62443 — de novo','df9',5,'Não testado antes do plano.'],
  ['p2-df6','TLS e IPsec — de novo','df6',5,'Não testado antes do plano.'],
  ['p2-mini','Mini-simulado de específicos','',6,'No app: Simulado 1, só as questões de específicos (Ofensiva, Defensiva, Compliance). Sem fazer a prova inteira ainda.','simulado','#/simulado','Abrir simulados'],
  ['p2-fc','Flashcards do que errou','',3,'Repetição espaçada do app, nos cartões dos tópicos fracos.','revisão','#/flashcards','Abrir flashcards']
];
const PT_FOCO = [
  ['pt1','Interpretação de texto'],
  ['pt3','Concordância'],
  ['pt3','Regência'],
  ['pt3','Crase'],
  ['pt4','Pontuação']
];
const EN_LEIT = ['le1','le2','le3','le4','le5','le6','le7','le8','le9','le10','le11','le12','en1','en2'];
const EN_ESP = {
  '2026-11-07':['en-vid-txt','Text and Vocabulary — vídeo 1,5–2×','en1','vídeo','Estratégia Concursos · Língua Inglesa para TRANSPETRO Nível Superior 2026 Pós-Edital · Profª Andrea Belo. Assista só esta aula, em 1,5–2×.'],
  '2026-11-08':['en-pdf','Demais aulas de inglês — só o PDF','en1','revisão','Não assista o resto do curso em vídeo. Passe o PDF atrás de vocabulário de texto e conectivos.'],
  '2026-11-14':['en-vid-conj','Conjunções e conectivos — vídeo 1,5–2×','en1','vídeo','Estratégia · Profª Andrea Belo. Uma aula, em 1,5–2×. O hábito do dia continua sendo questão de leitura.']
};
function planoBloco(id, title, topic, w, note, tipo, href, hrefLabel){
  return {id:id, title:title, topic:topic || '', w:w, note:note || '', tipo:tipo || 'questões', href:href || '', hrefLabel:hrefLabel || ''};
}
function planoPT(i){ const f = PT_FOCO[i % PT_FOCO.length]; return planoBloco('pt-' + i, 'Português · ' + f[1], f[0], 3, '30 min de questões Cesgranrio. Teoria só no erro.', 'questões'); }
function planoEN(i, date){
  const sp = EN_ESP[date];
  if(sp) return planoBloco(sp[0], sp[1], sp[2], 5, sp[4], sp[3]);
  const id = EN_LEIT[i % EN_LEIT.length];
  return planoBloco('en-' + date, 'Inglês · leitura Cesgranrio', id, 4, '30–45 min de questões de leitura no TEC. Não é aula nova.', 'questões');
}
function buildPlano(horas, moves){
  horas = horas || {sem:3, fim:5};
  const ids = (moves && moves.ids) || {};
  const days = [];
  let pti = 0, eni = 0;
  const f1 = F1.map(x => planoBloco(x[0], x[1], x[2], x[3], x[4]));
  let ei = 0;
  pRange('2026-11-03','2026-11-22').forEach(date => {
    const parts = [f1[ei++], f1[ei++], planoPT(pti++), planoEN(eni++, date)];
    days.push({date:date, fase:1, parts:parts});
  });
  const f2 = F2.map(x => planoBloco(x[0], x[1], x[2], x[3], x[4], x[5], x[6], x[7]));
  let e2 = 0;
  pRange('2026-11-23','2026-11-28').forEach(date => {
    days.push({date:date, fase:2, parts:[f2[e2++], f2[e2++], planoPT(pti++), planoEN(eni++, date)]});
  });
  days.push({date:'2026-11-29', fase:2, parts:[
    planoBloco('sim-full','Simulado completo · 70 questões · 4h30','',9,'Um simulado inteiro, no domingo, como a prova: 50 específicos + 10 português + 10 inglês. Corrija em seguida no caderno de erros.','simulado','#/simulado','Abrir simulados'),
    planoEN(eni++, '2026-11-29')
  ]});
  days.push({date:'2026-11-30', fase:3, parts:[
    planoBloco('e-1130','Caderno de erros','',5,'Revise o que o simulado e as questões mandaram para o caderno.','revisão','#/erros','Abrir caderno de erros'),
    planoBloco('r-1130','Revisão curta: nmap e ATT&CK','of2',4,'Só os pontos que ainda escapam.', 'revisão'),
    planoPT(pti++), planoEN(eni++, '2026-11-30')
  ]});
  days.push({date:'2026-12-01', fase:3, parts:[
    planoBloco('marco-cartao','Cartão de confirmação','',2,'Tire ou confira o cartão de confirmação da inscrição. Dia mais leve.','marco'),
    planoBloco('r-1201','Revisão leve','of1',2,'Uma leva curta. Sem abrir frente nova.','revisão'),
    planoPT(pti++), planoEN(eni++, '2026-12-01')
  ]});
  days.push({date:'2026-12-02', fase:3, parts:[
    planoBloco('p3-df5','ICP-Brasil — questões','df5',4,'Ainda pouco testado. Uma leva e segue.','questões'),
    planoBloco('e-1202','Caderno de erros','',4,'','revisão','#/erros','Abrir caderno de erros'),
    planoPT(pti++), planoEN(eni++, '2026-12-02')
  ]});
  days.push({date:'2026-12-03', fase:3, parts:[
    planoBloco('p3-cp5','CIS Controls — questões','cp5',4,'O NIST CSF continua só revisão leve, dentro do mesmo tópico.','questões'),
    planoBloco('fc-1203','Flashcards','',3,'','revisão','#/flashcards','Abrir flashcards'),
    planoPT(pti++), planoEN(eni++, '2026-12-03')
  ]});
  days.push({date:'2026-12-04', fase:3, parts:[
    planoBloco('e-1204','Caderno de erros','',5,'','revisão','#/erros','Abrir caderno de erros'),
    planoBloco('sim-rev','Rever o simulado no app','',4,'Olhe o gabarito comentado do simulado que você entregou.','revisão','#/simulado','Abrir simulados'),
    planoPT(pti++), planoEN(eni++, '2026-12-04')
  ]});
  days.push({date:'2026-12-05', fase:3, parts:[
    planoBloco('e-1205','Caderno de erros — carga leve','',3,'Sábado leve. Não abra matéria nova.','revisão','#/erros','Abrir caderno de erros'),
    planoBloco('en-1205','Inglês curto','le1',2,'Uma leitura só, para não chegar zerado.','questões'),
    planoBloco('desc-1205','Parar cedo','',2,'Revise uma página de flags do nmap e encerre.','revisão')
  ]});
  days.push({date:'2026-12-06', fase:4, parts:[
    planoBloco('marco-prova','PROVA · Manaus · 4h30 · 70 questões','',1,'50 específicos + 10 português + 10 inglês. Elimina abaixo de 50% em cada bloco, ou zero em português ou em inglês.','marco'),
    planoBloco('marco-doc','Documento e cartão de confirmação','',1,'Confira o que precisa levar antes de sair.','marco')
  ]});
  days.push({date:'2026-12-07', fase:4, parts:[
    planoBloco('marco-gab','Gabarito','',1,'Conferir o gabarito preliminar.','marco'),
    planoBloco('marco-rec1','Começar recursos','',1,'Separe as questões para recurso.','marco')
  ]});
  days.push({date:'2026-12-08', fase:4, parts:[
    planoBloco('marco-rec2','Concluir recursos','',1,'Último dia previsto para fechar os recursos.','marco')
  ]});
  const out = days.map(d => {
    const budget = planoBudget(d.date, horas);
    const blocks = d.parts.map(b => Object.assign({date:d.date, min:b.w}, b));
    const locks = {};
    const k = budget / (pWe(d.date) ? 300 : 180) || 1;
    blocks.forEach(b => {
      if(b.id.indexOf('pt-') === 0) locks[b.id] = Math.max(20, Math.min(40, Math.round(30 * k)));
      else if(b.id === 'en-vid-txt' || b.id === 'en-vid-conj') locks[b.id] = Math.max(30, Math.min(50, Math.round(45 * k)));
      else if(b.id === 'en-pdf') locks[b.id] = Math.max(25, Math.min(40, Math.round(30 * k)));
      else if(b.id.indexOf('en-') === 0) locks[b.id] = Math.max(30, Math.min(45, Math.round((pWe(d.date) ? 45 : 40) * k)));
    });
    if(d.date === '2026-11-29'){
      const enId = blocks.filter(b => b.id.indexOf('en-') === 0).map(b => b.id)[0];
      const en = Math.max(20, Math.min(45, budget - 270));
      if(enId) locks[enId] = en;
      locks['sim-full'] = Math.max(270, budget - (locks[enId] || 0));
    }
    if(budget > 0) planoFit(blocks, budget, locks);
    else blocks.forEach(b => { b.min = 0; });
    return {date:d.date, fase:d.fase, blocks:blocks};
  });
  if(!ids || !Object.keys(ids).length) return out;
  const all = [];
  out.forEach(d => d.blocks.forEach(b => all.push(b)));
  all.forEach(b => { if(ids[b.id]) b.date = ids[b.id]; });
  return out.map(d => Object.assign({}, d, {blocks: all.filter(b => b.date === d.date)}));
}
function planoReprogramar(horas, moves, done, today){
  const base = buildPlano(horas, moves || {ids:{}});
  const blocks = [];
  base.forEach(d => d.blocks.forEach(b => blocks.push(b)));
  const late = blocks.filter(b => b.tipo !== 'marco' && !done[b.id] && b.date < today);
  const lateIds = {};
  late.forEach(b => { lateIds[b.id] = 1; });
  const count = {};
  blocks.forEach(b => { if(!lateIds[b.id]) count[b.date] = (count[b.date] || 0) + 1; });
  const ids = Object.assign({}, (moves && moves.ids) || {});
  Object.keys(lateIds).forEach(k => { delete ids[k]; });
  let day = today < '2026-11-03' ? '2026-11-03' : (today > '2026-12-05' ? '2026-12-05' : today);
  late.forEach(b => {
    while(day < '2026-12-05' && (count[day] || 0) >= 4) day = pAdd(day, 1);
    ids[b.id] = day;
    count[day] = (count[day] || 0) + 1;
  });
  return {t:Date.now(), ids:ids, n:late.length};
}
function planoFeito(id){ return !!(S.plano && S.plano[id]); }
function planoStats(days){
  const all = days.reduce((a, d) => a.concat(d.blocks), []);
  const ok = all.filter(b => planoFeito(b.id)).length;
  return {n:all.length, ok:ok};
}
const TIPO_L = {'questões':'Questões', 'revisão':'Revisão', 'vídeo':'Vídeo', 'simulado':'Simulado', 'marco':'Marco'};
const TIPO_C = {'questões':'tipo-q', 'revisão':'tipo-r', 'vídeo':'tipo-v', 'simulado':'tipo-s', 'marco':'tipo-m'};
const FASE_L = {1:'Fase 1 · específicos, do mais fraco', 2:'Fase 2 · segunda passagem', 3:'Fase 3 · revisão', 4:'Depois da prova'};
function planoLinks(b){
  let h = '';
  const tec = b.topic && typeof TEC !== 'undefined' && TEC[b.topic];
  if(tec) h += `<a class="btn sm" data-tec="${esc(b.topic)}" href="${esc(tec.url)}" target="_blank" rel="noopener noreferrer">Resolver no TEC</a> `;
  if(b.href) h += `<a class="btn sm" href="${esc(b.href)}">${esc(b.hrefLabel || 'Abrir no app')}</a> `;
  else if(b.topic) h += `<a class="btn sm" href="#/questoes/t/${esc(b.topic)}">Questões no app</a> `;
  return h;
}
function planoItem(b, today){
  const on = planoFeito(b.id);
  const min = b.tipo === 'marco' ? '' : `<span class="mut">${b.min} min</span>`;
  return `<label class="li ${on ? 'done' : ''} ${b.date === today ? 'today' : ''}" style="align-items:flex-start"><input class="bigck" type="checkbox" data-plano="${esc(b.id)}" ${on ? 'checked' : ''} aria-label="Feito: ${esc(b.title)}"><div class="f1"><div class="t"><span class="tipo ${TIPO_C[b.tipo] || ''}">${TIPO_L[b.tipo] || ''}</span> ${min ? ' · ' + min : ''} · ${esc(b.title)}</div>${b.note ? `<div class="s">${esc(b.note)}</div>` : ''}<div class="row" style="margin-top:6px">${planoLinks(b)}</div></div></label>`;
}
function bindPlano(root){
  $$('[data-plano]', root).forEach(cb => cb.onchange = () => {
    S.plano = S.plano || {};
    S.plano[cb.dataset.plano] = cb.checked;
    if(cb.checked){ activity(); if(typeof editalFromPlano === 'function') editalFromPlano(cb.dataset.plano); }
    save();
    const row = cb.closest('.li'); if(row) row.classList.toggle('done', cb.checked);
    const bar = document.getElementById('planoBar');
    if(bar){ const st = planoStats(buildPlano(planoHoras(), S.planoMove)); bar.style.width = pct(st.ok, st.n) + '%'; const lab = document.getElementById('planoLab'); if(lab) lab.textContent = st.ok + ' de ' + st.n + ' blocos · ' + pct(st.ok, st.n) + '%'; }
  });
  if(typeof tecBind === 'function') tecBind(root);
}
let planoSem = '', planoDia = '';
function hojeResumo(){
  const today = (typeof dk === 'function') ? dk() : pISO(new Date());
  const day = buildPlano(planoHoras(), (typeof S !== 'undefined' && S.planoMove) || {ids:{}}).find(d => d.date === today);
  const blocks = day ? day.blocks : [];
  return {n:blocks.length, ok:blocks.filter(b => planoFeito(b.id)).length};
}
function hojeCardHTML(){
  const today = (typeof dk === 'function') ? dk() : pISO(new Date());
  const horas = planoHoras();
  const days = buildPlano(horas, S.planoMove);
  const day = days.find(d => d.date === today);
  const blocks = day ? day.blocks : [];
  const head = `<h3>Hoje <span class="r">${pFmt(today)} ${pWd(today)}</span></h3>`;
  if(!blocks.length){
    const msg = today < '2026-11-03' ? 'O plano começa em 03/11.' : (today > '2026-12-08' ? 'Plano encerrado.' : 'Nada marcado nesta data.');
    return `<div class="card">${head}<p class="mut">${msg}</p><a class="btn sm" href="#/cronograma">Abrir cronograma</a></div>`;
  }
  return `<div class="card">${head}${blocks.slice(0, 4).map(b => planoItem(b, today)).join('')}<div class="row" style="margin-top:8px"><a class="btn sm p" href="#/cronograma">Cronograma da semana</a></div></div>`;
}
if(typeof VIEWS !== 'undefined') VIEWS.cronograma = m => {
  const today = dk();
  const horas = planoHoras();
  const moves = S.planoMove || {t:0, ids:{}};
  const days = buildPlano(horas, moves);
  const st = planoStats(days);
  if(!planoSem) planoSem = pMonday(today < '2026-11-03' ? '2026-11-03' : (today > '2026-12-08' ? '2026-12-08' : today));
  const week = pRange(planoSem, pAdd(planoSem, 6)).filter(k => days.some(d => d.date === k));
  const shown = days.filter(d => week.indexOf(d.date) >= 0);
  const wall = shown.reduce((a, d) => a.concat(d.blocks), []);
  const wok = wall.filter(b => planoFeito(b.id)).length;
  const fase = shown.length ? FASE_L[shown[0].fase] : '';
  setTitle('Cronograma', pFmt(week[0] || planoSem) + ' – ' + pFmt(week[week.length - 1] || planoSem));
  if(!planoDia || !shown.some(d => d.date === planoDia)) planoDia = (shown.find(d => d.date === today) || shown[0] || {}).date || today;
  const day = days.find(d => d.date === planoDia) || shown[0];
  const strip = pRange(planoSem, pAdd(planoSem, 6)).map(k => {
    const has = days.some(d => d.date === k);
    return `<button type="button" class="wday ${k === planoDia ? 'on' : ''} ${k === today ? 'today' : ''}" data-day="${k}" ${has ? '' : 'disabled'}>${pWd(k)}<b>${pFmt(k).slice(0, 2)}</b></button>`;
  }).join('');
  m.innerHTML = `<div class="card"><h3>Semana</h3>
    <div class="bar" style="height:8px"><i id="planoBar" style="width:${pct(wok, wall.length)}%"></i></div>
    <div class="small" id="planoLab" style="margin-top:6px">Esta semana: ${wok} de ${wall.length} · ${pct(wok, wall.length)}% · plano ${pct(st.ok, st.n)}%</div>
    <div class="small mut">${esc(fase)}. Prova em 06/12, em Manaus.</div>
    <div class="wstrip" id="wStrip">${strip}</div>
    <div class="weeknav"><button class="btn sm" id="wPrev" type="button">← Semana</button><button class="btn sm" id="wNext" type="button">Semana →</button></div></div>
   <div class="card" id="cd${day ? day.date : ''}"><h3>${day ? pWd(day.date) + ' ' + pFmt(day.date) : ''}${day && day.date === today ? ' · HOJE' : ''} <span class="r">${day ? day.blocks.reduce((s, b) => s + (b.min || 0), 0) + ' min' : ''}</span></h3>
    <div class="daylist">${day && day.blocks.length ? day.blocks.map(b => planoItem(b, today)).join('') : '<p class="mut">Nenhum bloco neste dia.</p>'}</div></div>
   <div class="row" style="margin-bottom:12px"><button class="btn sm" id="reprog" type="button">Reprogramar atrasados</button></div>
   <details class="card"><summary><b>Horas por dia</b></summary>
    <p class="small mut">Padrão: 3h nos dias úteis e 5h no sábado e no domingo. Os blocos crescem ou encolhem com essas horas.</p>
    <div class="row"><label class="lb" style="margin:0">Dia útil</label><input id="hSem" type="number" min="1" max="12" step="0.5" value="${horas.sem}" aria-label="Horas por dia útil">
     <label class="lb" style="margin:0">Sábado e domingo</label><input id="hFim" type="number" min="1" max="12" step="0.5" value="${horas.fim}" aria-label="Horas no fim de semana">
     <button class="btn sm p" id="hApply" type="button">Atualizar tempos</button></div></details>`;
  bindPlano(m);
  $('#hApply', m).onclick = () => {
    let sem = Number($('#hSem', m).value), fim = Number($('#hFim', m).value);
    if(!(sem >= 1 && sem <= 12) || !(fim >= 1 && fim <= 12)){ toast('Use entre 1 e 12 horas.'); return; }
    S.planoH = {sem:sem, fim:fim, t:Date.now()};
    save(); toast('Tempos atualizados.'); render();
  };
  $$('#wStrip .wday', m).forEach(b => b.onclick = () => { if(b.disabled) return; planoDia = b.dataset.day; render(); });
  $('#wPrev', m).onclick = () => { const n = pAdd(planoSem, -7); if(n >= pMonday('2026-11-03')){ planoSem = n; planoDia = ''; render(); } };
  $('#wNext', m).onclick = () => { const n = pAdd(planoSem, 7); if(n <= '2026-12-08'){ planoSem = n; planoDia = ''; render(); } };
  $('#reprog', m).onclick = () => {
    const r = planoReprogramar(planoHoras(), S.planoMove, S.plano || {}, today);
    if(!r.n){ toast('Nenhum bloco atrasado.'); return; }
    S.planoMove = {t:r.t, ids:r.ids};
    save(); toast(r.n + (r.n === 1 ? ' bloco foi para os próximos dias.' : ' blocos foram para os próximos dias.'));
    planoSem = pMonday(today);
    render();
  };
};
