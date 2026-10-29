/* União do progresso local com outro aparelho ou com a conta.
   Não descarta respostas. Por item, o registro mais recente vence.
   Tema, filtros de questão e velocidade do áudio ficam no aparelho que está mesclando. */
function blank(){ return {v:1, created:Date.now(), answers:{}, errors:{}, cards:{}, sims:{}, crono:{}, dia:{}, days:{}, tck:{}, settings:{}, audio:{}, rod:{}, qf:{mod:[], topic:'', prio:'', only:'all', src:'fix', order:'seq'}, newToday:{}}; }
function cloneState(v){ return v == null ? v : JSON.parse(JSON.stringify(v)); }
function mergeBoolMap(a, b){
  const o = Object.assign({}, a || {});
  for(const k in b || {}) o[k] = !!(o[k] || b[k]);
  return o;
}
function mergeTck(a, b){
  const o = {}, keys = new Set([].concat(Object.keys(a || {}), Object.keys(b || {})));
  keys.forEach(k => {
    const x = (a && a[k]) || [], y = (b && b[k]) || [], n = Math.max(x.length, y.length), arr = [];
    for(let i = 0; i < n; i++) arr.push(!!(x[i] || y[i]));
    o[k] = arr;
  });
  return o;
}
function mergeAudio(a, b){
  a = a || {}; b = b || {};
  const o = Object.assign({}, b, a);
  new Set([].concat(Object.keys(a), Object.keys(b))).forEach(k => {
    if(k.charAt(0) === 'p' && (typeof a[k] === 'number' || typeof b[k] === 'number')) o[k] = Math.max(typeof a[k] === 'number' ? a[k] : 0, typeof b[k] === 'number' ? b[k] : 0);
  });
  if(a.rate) o.rate = a.rate; else if(b.rate) o.rate = b.rate;
  if(a.last) o.last = a.last; else if(b.last) o.last = b.last;
  return o;
}
function mergeRod(a, b){
  const o = Object.assign({}, a || {});
  for(const id in b || {}){
    const y = b[id], x = o[id];
    if(!x){ o[id] = y; continue; }
    if(y.done && !x.done){ o[id] = y; continue; }
    if(x.done && !y.done) continue;
    const xs = x.stage || 0, ys = y.stage || 0;
    if(ys > xs || (ys === xs && (y.last || '') > (x.last || ''))) o[id] = y;
  }
  return o;
}
function mergeCur(x, y){
  if(!x) return y || null;
  if(!y) return x || null;
  const newer = (x.start || 0) >= (y.start || 0) ? x : y, older = newer === x ? y : x;
  return {start:newer.start, dur:newer.dur || older.dur, i:newer.i || 0, ans:Object.assign({}, older.ans || {}, newer.ans || {}), flags:Object.assign({}, older.flags || {}, newer.flags || {})};
}
function mergeSim(x, y){
  x = x || {cur:null, hist:[]}; y = y || {cur:null, hist:[]};
  const ts = new Set((x.hist || []).map(h => h.start));
  return {cur:mergeCur(x.cur, y.cur), hist:(x.hist || []).concat((y.hist || []).filter(h => h && !ts.has(h.start))).sort((p, q) => (p.start || 0) - (q.start || 0))};
}
function mergeState(a, b){
  a = cloneState(a) || {}; b = cloneState(b) || {};
  const o = Object.assign(blank(), a);
  o.v = Math.max(a.v || 1, b.v || 1);
  o.created = Math.min(a.created || b.created || o.created, b.created || a.created || o.created);
  o.updated = Math.max(a.updated || 0, b.updated || 0) || undefined;
  o.settings = Object.assign({}, a.settings || {});
  o.qf = Object.assign(blank().qf, a.qf || {});
  for(const id in b.answers || {}){
    const seen = new Set((o.answers[id] || []).map(x => x.t + ':' + x.c));
    o.answers[id] = (o.answers[id] || []).concat((b.answers[id] || []).filter(x => x && !seen.has(x.t + ':' + x.c))).sort((x, y) => (x.t || 0) - (y.t || 0));
  }
  for(const id in b.errors || {}){
    const y = b.errors[id], x = o.errors[id];
    if(!y) continue;
    if(!x){ o.errors[id] = y; continue; }
    const newer = (y.last || y.added || '') > (x.last || x.added || '') ? y : x;
    const older = newer === y ? x : y;
    const patch = {wrongs:Math.max(x.wrongs || 0, y.wrongs || 0)};
    const reason = newer.reason || older.reason;
    if(reason) patch.reason = reason;
    o.errors[id] = Object.assign({}, newer, patch);
  }
  for(const id in b.cards || {}){
    const y = b.cards[id], x = o.cards[id];
    if(!x || (y && (y.last || 0) > (x.last || 0))) o.cards[id] = y;
  }
  const simIds = new Set([].concat(Object.keys(o.sims || {}), Object.keys(b.sims || {})));
  simIds.forEach(id => { o.sims[id] = mergeSim(o.sims[id], b.sims[id]); });
  o.crono = mergeBoolMap(a.crono, b.crono);
  o.dia = mergeBoolMap(a.dia, b.dia);
  o.tck = mergeTck(a.tck, b.tck);
  o.audio = mergeAudio(a.audio, b.audio);
  o.rod = mergeRod(a.rod, b.rod);
  for(const d in b.days || {}) o.days[d] = Math.max(o.days[d] || 0, b.days[d] || 0);
  for(const d in b.newToday || {}) o.newToday[d] = Math.max(o.newToday[d] || 0, b.newToday[d] || 0);
  return o;
}
