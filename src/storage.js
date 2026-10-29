/* ===== Camada de persistência isolada =====
   Todo o app lê/grava SOMENTE por Storage.get/Storage.set.
   Para sincronizar (ex.: Supabase no GitHub Pages) basta registrar um adaptador:
     Storage.useAdapter({ push(key, value){...upsert remoto...}, async pull(){ return {progresso:{...}} } });
   e, ao abrir, chamar Storage.pull() e mesclar com mergeState(). */
const Storage = (() => {
  const P = 'tp7:'; const mem = {}; const subs = []; let ok = true, adapter = null, wired = false;
  function get(k, def){ try { const v = localStorage.getItem(P + k); return v == null ? (k in mem ? mem[k] : def) : JSON.parse(v); } catch(e){ ok = false; return k in mem ? mem[k] : def; } }
  function set(k, v){ mem[k] = v; let w = true; try { localStorage.setItem(P + k, JSON.stringify(v)); } catch(e){ ok = false; w = false; } subs.forEach(f => { try { f(k, v); } catch(e){} }); return w; }
  function remove(k){ delete mem[k]; try { localStorage.removeItem(P + k); } catch(e){} }
  function onChange(f){ subs.push(f); }
  function useAdapter(a){
    adapter = a || null;
    if(!wired){ wired = true; onChange((k, v) => { try { if(adapter && adapter.push) adapter.push(k, v); } catch(e){} }); }
  }
  async function pull(){ try { return adapter && adapter.pull ? await adapter.pull() : null; } catch(e){ return null; } }
  return {get, set, remove, onChange, useAdapter, pull, available:() => ok, prefix:P};
})();
