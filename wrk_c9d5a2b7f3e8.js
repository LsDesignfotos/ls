const CACHE_NAME = 'ls-design-v4';
const urlsToCache = [
  './',
  './index.html',
  './favicon.svg',
  './assets/css/styles-extra.css',
  './assets/css/mobile-optimizations.css',
  './assets/css/pwa-styles.css',
  './assets/css/accessibility.css',
  './assets/js/particles.js',
  './assets/js/before-after.js',
  './assets/js/faq.js',
  './assets/js/upload-handler.js',
  './assets/js/performance-optimizer.js',
  './assets/js/pwa-manager.js',
  './assets/js/image-optimizer.js',
  './security.js',
  './site.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './assets/hero/pizza-com-presunto-e-ovos.png',
  './assets/antes-depois/FEIJOADAANTES.jpg',
  './assets/antes-depois/FEIJOADADEPOIS.png'
];

// Instalar Service Worker
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

// Interceptar requisições
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - retorna resposta
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Atualizar cache
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
