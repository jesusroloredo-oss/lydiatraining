const CACHE_NAME = 'maraton-cache-v1';
// Archivos a guardar para que funcione sin internet
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// Instalación del Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Interceptar peticiones para devolver la versión guardada si no hay internet
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Devuelve el caché si existe, si no, lo descarga de la red
        return response || fetch(event.request);
      })
  );
});
