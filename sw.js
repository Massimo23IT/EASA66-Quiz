const CACHE='easa66-v2.4.6-network-first';
const CORE=['./','./index.html','./app.css','./app.js','./questions.json','./manifest.webmanifest','./pilot.png','./icon-192.png','./icon-512.png'];

self.addEventListener('install',event=>{
  event.waitUntil(
    caches.open(CACHE)
      .then(cache=>cache.addAll(CORE))
      .then(()=>self.skipWaiting())
  );
});

self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key))))
      .then(()=>self.clients.claim())
  );
});

async function networkFirst(request){
  const cache=await caches.open(CACHE);
  try{
    const response=await fetch(request,{cache:'no-cache'});
    if(response&&response.ok) await cache.put(request,response.clone());
    return response;
  }catch(err){
    const cached=await cache.match(request,{ignoreSearch:true});
    if(cached) return cached;
    throw err;
  }
}

self.addEventListener('fetch',event=>{
  const request=event.request;
  const url=new URL(request.url);
  if(request.method!=='GET'||url.origin!==self.location.origin) return;

  if(request.mode==='navigate'){
    event.respondWith(
      networkFirst(request).catch(()=>caches.match('./index.html',{ignoreSearch:true}))
    );
    return;
  }

  const isAppAsset=
    ['script','style','image','manifest'].includes(request.destination) ||
    url.pathname.endsWith('/questions.json') ||
    url.pathname.endsWith('/manifest.webmanifest');

  if(isAppAsset){
    event.respondWith(networkFirst(request));
  }
});
