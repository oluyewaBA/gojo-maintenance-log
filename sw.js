// GOJO offline cache — saves this app to the phone on first visit
// so it keeps working with no signal at all afterwards.
const CACHE_NAME = 'gojo-app-cache-v1';
const APP_FILE = self.location.pathname.replace('/sw.js', '/gojo-maintenance-log.html');

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll([APP_FILE]))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, response.clone());
          return response;
        });
      }).catch(() => cached);
    })
  );
});
