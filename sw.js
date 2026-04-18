const CACHE_NAME = 'aura-v1';
const urlsToCache = [
    './',
    './index.html',
    './customer.html',
    './jeweler.html',
    './inventory.html',
    './leads.html',
    './custom-orders.html',
    './whatsapp-crm.html',
    './heatmap.html',
    './admin.html',
    './customer-login.html',
    './jeweler-login.html',
    './css/styles.css',
    './js/app.js',
    './js/ai.js',
    './manifest.json'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', event => {
    // Skip cross-origin requests (like the Gold API or Google Translate)
    // Only handle requests for our own assets
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response; // Cache hit
                }
                return fetch(event.request);
            }).catch(error => {
                console.log('Fetch failed:', error);
                // Return a basic error response instead of undefined
                return new Response('Network error occurred', {
                    status: 408,
                    headers: { 'Content-Type': 'text/plain' }
                });
            })
    );
});

// Clean up old caches
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
