self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open('cur_converter-v1').then(function (cache) {
            return cache.addAll([
                '/',
                'js/main.js',
                'css/style.css',
            ]);
        })
    );
});

self.addEventListener('fetch', function (event) {
    // TODO: respond with an entry from the cache if there is one.
    // If there isn't, fetch from the network.
});

