const CACHE_NAME = 'maraton-cache-v5';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', event => {
  self.skipWaiting(); // Fuerza la instalación inmediata
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName); // Borra rastros antiguos
          }
        })
      );
    }).then(() => self.clients.claim()) // Toma el control de la pantalla al instante
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    // El parámetro 'no-store' prohíbe usar la memoria interna del teléfono para esta consulta
    fetch(event.request, { cache: 'no-store' })
      .then(response => {
        // Guarda la versión nueva recién descargada
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
      .catch(() => {
        // Solo usa la memoria si el teléfono está en modo avión o sin cobertura
        return caches.match(event.request);
      })
  );
});
