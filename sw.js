// Service worker do app (só em http/https). Cache rev visual-2: o nome muda a cada build.
// Página, manifest e ícone: rede primeiro, para um deploy novo não ficar na versão antiga.
// Áudios: cache primeiro. Pedidos de outro site (Supabase, CDN) não são interceptados.
const C = 'tp7-2026-10-29-9d3c4e158249';
const CORE = ['./', './index.html', './manifest.webmanifest', './icon.svg'];
const AUD = ["./audios/01_Ofensiva_BIZUs.mp3", "./audios/02_Defensiva_BIZUs.mp3", "./audios/03_Compliance_BIZUs.mp3", "./audios/04_Portugues_BIZUs.mp3", "./audios/05_Ingles_BIZUs.mp3", "./audios/06_Top_BIZUs.mp3"];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(C);
    await Promise.all(CORE.map(async url => {
      const res = await fetch(new Request(url, {cache:'reload'}));
      if(!res.ok) throw new Error('falha ao pré-carregar ' + url);
      await cache.put(url, res);
    }));
    await Promise.allSettled(AUD.map(async url => {
      try {
        const res = await fetch(new Request(url, {cache:'reload'}));
        if(res.ok) await cache.put(url, res);
      } catch(e){}
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== C).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

function shellRequest(req, url){
  if(req.mode === 'navigate') return true;
  const p = url.pathname;
  return p.endsWith('/index.html') || p.endsWith('/manifest.webmanifest') || p.endsWith('/icon.svg') || /\/transpetro-estudos\/?$/.test(p) || p.endsWith('/');
}

self.addEventListener('fetch', event => {
  const req = event.request;
  if(req.method !== 'GET') return;
  let url;
  try { url = new URL(req.url); } catch(e){ return; }
  if(url.origin !== location.origin) return;
  if(url.pathname.endsWith('/sw.js')) return;
  const range = req.headers.get('range');
  if(range){ event.respondWith(ranged(req, range)); return; }
  if(shellRequest(req, url)){ event.respondWith(networkFirst(req)); return; }
  event.respondWith(cacheFirst(req));
});

async function networkFirst(req){
  try {
    const res = await fetch(req);
    if(res && res.ok && res.status === 200){ const copy = res.clone(); caches.open(C).then(c => c.put(req, copy)).catch(() => {}); }
    return res;
  } catch(e){
    return (await caches.match(req, {ignoreSearch:true})) || (await caches.match('./index.html')) || new Response('offline', {status:503, headers:{'Content-Type':'text/plain;charset=utf-8'}});
  }
}

async function cacheFirst(req){
  const hit = await caches.match(req, {ignoreSearch:true});
  if(hit) return hit;
  try {
    const res = await fetch(req);
    if(res && res.ok && res.status === 200){ const copy = res.clone(); caches.open(C).then(c => c.put(req, copy)).catch(() => {}); }
    return res;
  } catch(e){
    if(req.mode === 'navigate') return (await caches.match('./index.html')) || new Response('offline', {status:503});
    return new Response('', {status:504});
  }
}

async function ranged(req, range){
  const hit = await caches.match(req.url, {ignoreSearch:true});
  if(!hit) return fetch(req);
  const buf = await hit.arrayBuffer();
  const m = /bytes=(\d*)-(\d*)/.exec(range) || [], start = +m[1] || 0, end = m[2] ? Math.min(+m[2], buf.byteLength - 1) : buf.byteLength - 1;
  return new Response(buf.slice(start, end + 1), {status:206, headers:{
    'Content-Type': hit.headers.get('Content-Type') || 'audio/mpeg',
    'Content-Range': 'bytes ' + start + '-' + end + '/' + buf.byteLength,
    'Content-Length': String(end - start + 1),
    'Accept-Ranges': 'bytes'
  }});
}
