import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const code = readFileSync(new URL('./src/merge.js', import.meta.url), 'utf8');
const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(code, sandbox);
const { mergeState, blank } = sandbox;

let failed = 0;
function eq(cond, msg){
  if(!cond){ failed++; console.error('FAIL', msg); }
  else console.log('OK', msg);
}

const local = blank();
local.created = 1000;
local.updated = 10;
local.settings = {theme:'dark'};
local.qf = Object.assign(blank().qf, {src:'fix', topic:'of1'});
local.answers = {q1:[{t:1, c:'A', ok:false}]};
local.errors = {q1:{added:'2026-10-01', last:'2026-10-02', stage:0, due:'2026-10-03', wrongs:1, reason:'Caí na pegadinha', done:false}};
local.cards = {c1:{last:5, iv:1, reps:1, ef:2.5}};
local.crono = {0:true, 1:false};
local.dia = {rg:false};
local.tck = {of1:[true, false, false]};
local.days = {'2026-10-29':2};
local.audio = {rate:1.5, last:'01', p01:12};
local.rod = {r1:{stage:1, last:'2026-10-02', done:false}};
local.tec = {of1:true, of2:false};
local.sims = {s1:{cur:{start:50, ans:{1:'A'}, flags:{}}, hist:[{start:10, end:20, ans:{1:'B'}}]}};

const remote = blank();
remote.created = 500;
remote.updated = 30;
remote.settings = {theme:'light'};
remote.qf = Object.assign(blank().qf, {src:'leit'});
remote.answers = {q1:[{t:1, c:'A', ok:false}, {t:2, c:'C', ok:true}], q2:[{t:3, c:'B', ok:true}]};
remote.errors = {q1:{added:'2026-10-01', last:'2026-10-05', stage:1, due:'2026-10-12', wrongs:2, reason:'', done:false}, q9:{added:'2026-10-04', wrongs:1, done:false}};
remote.cards = {c1:{last:9, iv:7, reps:3, ef:2.6}, c2:{last:4, iv:1, reps:1}};
remote.crono = {1:true, 2:true};
remote.dia = {rg:true, doc:true};
remote.tck = {of1:[false, true, true]};
remote.days = {'2026-10-29':5, '2026-10-28':1};
remote.audio = {rate:1, last:'02', p01:40, p02:3};
remote.rod = {r1:{stage:0, last:'2026-10-01', done:false}, r2:{stage:2, last:'2026-10-09', done:false}};
remote.tec = {of2:true, df1:true};
remote.sims = {s1:{cur:{start:40, ans:{1:'C', 2:'D'}, flags:{2:true}}, hist:[{start:10, end:20, ans:{1:'B'}}, {start:30, end:35, ans:{3:'A'}}]}};

const m = mergeState(local, remote);
eq(m.answers.q1.length === 2 && m.answers.q1[1].c === 'C', 'união de respostas sem duplicar');
eq(m.answers.q2.length === 1, 'resposta que só existe no remoto entra');
eq(m.errors.q1.last === '2026-10-05' && m.errors.q1.stage === 1, 'erro mais recente vence');
eq(m.errors.q1.reason === 'Caí na pegadinha', 'motivo local preservado se o remoto está vazio');
eq(m.errors.q1.wrongs === 2 && m.errors.q9, 'maior contagem de erros e erro só remoto');
eq(m.cards.c1.last === 9 && m.cards.c2.reps === 1, 'cartão mais recente vence e o outro entra');
eq(m.crono[0] === true && m.crono[1] === true && m.crono[2] === true, 'cronograma: marcado em qualquer lado permanece');
eq(m.dia.rg === true && m.dia.doc === true, 'checklist do dia da prova em união');
eq(m.tck.of1[0] === true && m.tck.of1[1] === true && m.tck.of1[2] === true, 'etapas do resumo em união');
eq(m.days['2026-10-29'] === 5 && m.days['2026-10-28'] === 1, 'dias de estudo ficam com o maior valor');
eq(m.audio.p01 === 40 && m.audio.p02 === 3 && m.audio.rate === 1.5 && m.audio.last === '01', 'áudio: maior posição, taxa e último ficam no aparelho');
eq(m.rod.r1.stage === 1 && m.rod.r2.stage === 2, 'rodada: estágio mais alto vence');
eq(m.sims.s1.hist.length === 2, 'histórico do simulado une pelo início');
eq(m.sims.s1.cur.start === 50 && m.sims.s1.cur.ans[1] === 'A' && m.sims.s1.cur.ans[2] === 'D', 'simulado em andamento: início mais novo vence o conflito e o resto se une');
eq(m.settings.theme === 'dark', 'tema fica no aparelho local');
eq(m.qf.topic === 'of1' && m.qf.src === 'fix', 'filtros de questão ficam no aparelho local');
eq(m.created === 500 && m.updated === 30, 'created mais antigo e updated mais novo');
eq(m.tec.of1 === true && m.tec.of2 === true && m.tec.df1 === true, 'feito no TEC é união dos dois lados');

const again = mergeState(m, remote);
eq(JSON.stringify(again.answers) === JSON.stringify(m.answers), 'mesclar de novo não duplica respostas');
eq(JSON.stringify(again.errors) === JSON.stringify(m.errors), 'mesclar de novo é estável nos erros');
eq(JSON.stringify(again.sims) === JSON.stringify(m.sims), 'mesclar de novo é estável no simulado');

const onlyRemote = mergeState(blank(), remote);
eq(Object.keys(onlyRemote.answers).length === 2, 'aparelho vazio recebe o remoto');
const back = mergeState(remote, local);
eq(back.answers.q1.length === 2 && back.answers.q2.length === 1, 'a união de respostas não depende da ordem');
eq(back.settings.theme === 'light', 'o tema de quem mescla é o que fica');

const older = mergeState(
  {answers:{}, errors:{q1:{added:'2026-10-01', last:'2026-10-08', stage:2, wrongs:1, done:false}}, cards:{}, sims:{}, crono:{}, dia:{}, tck:{}, settings:{}, audio:{}, rod:{}, days:{}, newToday:{}},
  {answers:{}, errors:{q1:{added:'2026-10-01', last:'2026-10-03', stage:0, wrongs:4, done:false, reason:'Chutei'}}, cards:{}, sims:{}, crono:{}, dia:{}, tck:{}, settings:{}, audio:{}, rod:{}, days:{}, newToday:{}}
);
eq(older.errors.q1.stage === 2 && older.errors.q1.wrongs === 4 && older.errors.q1.reason === 'Chutei', 'erro local mais novo mantém estágio e soma os wrongs');

if(failed){ console.error('MERGE FAILURES', failed); process.exit(1); }
console.log('merge ok');
