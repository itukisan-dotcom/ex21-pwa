const CACHE='ex21-v3';
const ROOT=new URL('./',self.location).href;
const ASSETS=/* BUILD_ASSETS */[];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(c=>c.addAll([ROOT,ROOT+'manifest.webmanifest',ROOT+'icon-192.png',ROOT+'icon-512.png',...ASSETS.map(path=>ROOT+path)])));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('ex21-')&&k!==CACHE).map(k=>caches.delete(k)))));});
self.addEventListener('fetch',event=>{if(event.request.method!=='GET'||new URL(event.request.url).origin!==self.location.origin)return;event.respondWith(fetch(event.request).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE).then(c=>c.put(event.request,copy));}return response;}).catch(()=>caches.match(event.request).then(cached=>cached||(event.request.mode==='navigate'?caches.match(ROOT):Response.error()))));});
