var CACHE_NAME = 'my-site-cache-v1';
const validateResponse = function (response) {
    if (!response || response.status !== 200 || response.type !== 'basic') {
        return false;
    }
    return true;
};
var urlsToCache = [
    './',
    './index.html',
    './styles/main.css',
    './scripts/main.js',
    './index.js'
];
////
self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    )
})

// self.addEventListener('fetch', function (event) {
//     console.log("Fetch");
//     event.respondWith(
//         caches.match(event.request)
//             .then(function (response) {
//                 // Cache hit - return response
//                 if (response) {
//                     return response;
//                 }

//                 // IMPORTANT: Clone the request. A request is a stream and
//                 // can only be consumed once. Since we are consuming this
//                 // once by cache and once by the browser for fetch, we need
//                 // to clone the response.
//                 var fetchRequest = event.request.clone();

//                 return fetch(fetchRequest).then(
//                     function (response) {
//                         // Check if we received a valid response
//                         if (!validateResponse(response)) {
//                             return response;
//                         }

//                         // IMPORTANT: Clone the response. A response is a stream
//                         // and because we want the browser to consume the response
//                         // as well as the cache consuming the response, we need
//                         // to clone it so we have two streams.
//                         var responseToCache = response.clone();

//                         caches.open(CACHE_NAME)
//                             .then(function (cache) {
//                                 cache.put(event.request, responseToCache);
//                             });

//                         return response;
//                     }
//                 );
//             })
//     );
// });

self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(function (response) {
            if (response)
                return response
            const requestClone = event.request.clone();
            return fetch(requestClone).then(function (response) {
                if (!validateResponse(response))
                    return response;
                const responseClone = response.clone();
                caches.open(CACHE_NAME)
                    .then(function (cache) {
                        cache.put(event.request, responseClone);
                    })
                return response;
            })
        })
    )
})