import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const code = readFileSync(new URL('./src/plano.js', import.meta.url), 'utf8');
const sandbox = { VIEWS: {} };
vm.createContext(sandbox);
vm.runInContext(code, sandbox);
const { buildPlano, planoReprogramar } = sandbox;

let failed = 0;
function eq(cond, msg){
  if(!cond){ failed++; console.error('FAIL', msg); }
  else console.log('OK', msg);
}
const horas = {sem:3, fim:5};
const days = buildPlano(horas, {ids:{}});
eq(days[0].date === '2026-11-03' && days[days.length - 1].date === '2026-12-08', 'vai de 03/11 a 08/12');
const f1 = days.filter(d => d.fase === 1);
eq(f1.length === 20 && f1.every(d => d.blocks.length === 4), 'fase 1: 20 dias com 4 blocos');
const study = days.filter(d => d.date >= '2026-11-03' && d.date <= '2026-12-05');
study.forEach(d => {
  const n = d.blocks.length;
  if(n < 2 || n > 4){ failed++; console.error('FAIL', d.date, 'blocos', n); }
});
eq(study.every(d => d.blocks.length >= 2 && d.blocks.length <= 4), 'cada dia de estudo tem 2 a 4 blocos');
function sum(d){ return d.blocks.reduce((s, b) => s + (b.min || 0), 0); }
const wd = study.filter(d => !'2026-11-29,2026-12-01,2026-12-05'.split(',').includes(d.date) && ![0,6].includes(new Date(d.date+'T12:00:00').getDay()));
eq(wd.every(d => sum(d) === 180), 'dia útil padrão soma 3h');
const we = study.filter(d => [0,6].includes(new Date(d.date+'T12:00:00').getDay()) && d.date !== '2026-11-29' && d.date !== '2026-12-05');
eq(we.every(d => sum(d) === 300), 'fim de semana padrão soma 5h');
const sim = days.find(d => d.date === '2026-11-29');
eq(sim.blocks.some(b => b.id === 'sim-full' && b.min === 270), 'simulado de 4h30 no domingo 29/11');
eq(days.find(d => d.date === '2026-12-06').blocks.some(b => b.title.indexOf('PROVA') >= 0), '06/12 é a prova');
eq(days.find(d => d.date === '2026-12-01').blocks.some(b => b.id === 'marco-cartao'), '01/12 cartão de confirmação');
const topics = new Set(days.flatMap(d => d.blocks.map(b => b.topic)).filter(Boolean));
['of1','of2','of3','of8','of10','df1','df2','df5','df6','df9','df10','cp1','cp5','cp7'].forEach(id => {
  if(!topics.has(id)){ failed++; console.error('FAIL falta tópico', id); }
});
eq(true, 'tópicos fracos, não testados e fortes aparecem');
const big = buildPlano({sem:6, fim:5}, {ids:{}});
const d3 = big.find(d => d.date === '2026-11-03');
eq(sum(d3) === 360, '6h no dia útil dobra o tempo do dia (' + sum(d3) + ')');
const late = planoReprogramar(horas, {ids:{}}, {}, '2026-11-10');
eq(late.n > 0 && Object.values(late.ids).every(v => v >= '2026-11-10'), 'atrasados vão para 10/11 em diante (' + late.n + ')');
const moved = buildPlano(horas, late);
const back = moved.filter(d => d.date < '2026-11-10').flatMap(d => d.blocks).filter(b => b.tipo !== 'marco' && b.date < '2026-11-10');
eq(back.length === 0, 'depois de reprogramar não sobra bloco de estudo no passado');

const byWeek = {};
days.forEach(d => {
  const dt = new Date(d.date + 'T12:00:00');
  const day = dt.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const mon = new Date(dt); mon.setDate(dt.getDate() + diff);
  const key = mon.toISOString().slice(0, 10);
  (byWeek[key] = byWeek[key] || []).push(d);
});
console.log('\n--- semanas ---');
Object.keys(byWeek).sort().forEach(k => {
  const ds = byWeek[k];
  console.log('\n' + k);
  ds.forEach(d => console.log(' ', d.date, d.blocks.map(b => b.min + 'm ' + b.title).join(' | ')));
});
if(failed){ console.error('PLANO FAILURES', failed); process.exit(1); }
console.log('plano ok');
