const staticcacheku = 'static-site-v3'; // versi cache

const dynamiccacheku = 'dynamic-site-v3';

// ini yg di cache
const assets = [
    '/',
    '/manifest.json',
    '/index.html',
    '/js/app.js',
    '/js/ui.js',
    '/js/materialize.js',
    '/js/materialize.min.js',
    '/css/style.css',
    '/css/materialize.min.css',
    '/css/materialize.css',
    '/img/dish.jpg',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://fonts.gstatic.com/s/materialicons/v54/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2',
    '/pages/fallback.html'
];


// cache limit size
const limitcache = function (name, size) {
    caches.open(name).then(function (cache) {
        cache.keys().then(function (keys) {
            if (keys.length > size) {
                cache.delete(keys[0]).then(limitcache(name, size))
            }
        })
    })
}

// install service worker
self.addEventListener('install', function (evt) {
    // console.log('service worker has been installed');

    // doing cache menyimpan cache untuk offline
    evt.waitUntil(
        caches.open(staticcacheku).then(function (cache) {
            console.log('caching shell assets');
            cache.addAll(assets);
        })
    );
    // end doing cache


});

// activated service worke

self.addEventListener('activate', function (evt) {
    // console.log('service worker has been activated');


    // cache versioning untuk mengganti cache versi lama ke versi baru
    evt.waitUntil(
        caches.keys().then(function (keys) {
            return Promise.all(keys
                .filter(key => key !== staticcacheku && key !== dynamiccacheku)
                .map(key => caches.delete(key))
            )
        })
    );
    // end cache versioning

});

// fetch worker

self.addEventListener('fetch', function (evt) {

    //get cache mendapatkan cache untuk offline
    if (evt.request.url.indexOf('firestore.googleapis.com') === -1) {
        evt.respondWith(
            caches.match(evt.request).then(function (cacheResp) {
                return cacheResp || fetch(evt.request).then(function (fetchResp) {

                    // melakukan sadap request resource untuk dynamic cache
                    return caches.open(dynamiccacheku).then(function (cache) {
                        cache.put(evt.request.url, fetchResp.clone());

                        limitcache(dynamiccacheku, 15); // limiting cache size

                        return fetchResp;
                    })
                    // end dynamic cache
                })
            }).catch(function () {
                if (evt.request.url.indexOf('.html') > -1) {
                    return caches.match('/pages/fallback.html');
                }
            })
        );
    }
    // // end get cache


});