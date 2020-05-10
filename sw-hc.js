var VS = "V1"

//缓存
self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(VS).then(function(cache) {
      return cache.addAll(['./index.html']);
    })
  )
})
//缓存更新
self.addEventListener('activate', function (e) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          // 如果当前版本和缓存版本不一致
          if (cacheName !== VS) {
            return caches.delete(cacheName);
          }
        } )
      );
    })
  )
})
// 捕捉请求返回缓存数据
self.addEventListener('fetch', function(e) {
  console.log(e, 666)
  e.respondWith(
    caches
      .match(e.request)
      .catch(function (){
        return fetch(e.request);
      })
      .then(function (response) {
        caches.open(VS).then(function (cache){
          cache.put(e.request, response);
        });
        return response.clone();
      })
      .catch(function (){
        return caches.match('https://miniapps123.oss-cn-chengdu.aliyuncs.com/content_1.png')
      })
  )
})