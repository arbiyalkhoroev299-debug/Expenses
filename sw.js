const C='grosh-v4',L='grosh-lib',F=['./','index.html','manifest.json','icon-192.png','icon-512.png','apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x.startsWith('grosh-')&&x!==C&&x!==L).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const u=new URL(e.request.url);
  if(u.hostname==='cdn.jsdelivr.net'){
    e.respondWith(caches.open(L).then(async c=>{const m=await c.match(e.request);if(m)return m;const r=await fetch(e.request);if(r.ok)c.put(e.request,r.clone());return r}));
    return;
  }
  if(u.origin!==location.origin)return;
  e.respondWith(caches.open(C).then(async c=>{
    const m=await c.match(e.request,{ignoreSearch:true});
    const n=fetch(e.request).then(r=>{if(r.ok)c.put(e.request,r.clone());return r}).catch(()=>m);
    return m||n;
  }));
});
