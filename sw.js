const staticcacheku = 'static-site';
const assets = [
    '/',
    '/index.html',
    '/js/app.js',
    '/js/ui.js',
    '/js/materialize.min.js',
    '/css/style.css',
    '/css/materialize.min.css',
    '/css/materialize.css',
    '/img/dish.jpg',
    'https://fonts.googleapis.com/icon?family=Material+Icons'
];


// install service worker
self.addEventListener('install',function(evt){
    // console.log('service worker has been installed');
    // doing cache
    evt.waitUntil(
        caches.open(staticcacheku).then(function(cache){
            console.log('caching shell assets');
            cache.addAll(assets);
        })
    );
    

});

// activated service worke

self.addEventListener('activate',function(evt){
    console.log('service worker has been activated');
});

// fetch workerr

self.addEventListener('fetch',function(evt){
    // console.log('fetching data...',evt);
});