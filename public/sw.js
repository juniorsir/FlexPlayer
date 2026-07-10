// File: public/sw.js
const CACHE_NAME = 'flexplayer-studio-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/docs.html',
  '/player.js',
  '/logo.svg',
  '/logo.png',
  '/manifest.json',
  // External assets & CDNs for fully modular offline capability
  'https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.4.10/hls.min.js',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/codemirror.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/theme/material-ocean.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/codemirror.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/mode/xml/xml.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/mode/javascript/javascript.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/mode/css/css.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/mode/htmlmixed/htmlmixed.min.js'
];

// Install Service Worker and cache essential files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('FlexPlayer SW: Caching static assets & CDNs');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Activate Service Worker and clean up older caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('FlexPlayer SW: Clearing old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Intelligent fetch strategy: Network first (with cache fallback) so online sessions are dynamic
// and offline sessions run seamlessly.
self.addEventListener('fetch', (event) => {
  // Only handle GET requests (avoid POST caching issues)
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Skip self-hosted web-socket/HMR connections if in dev mode
  if (url.pathname.includes('socket.io') || url.pathname.includes('webpack-hmr')) return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // If valid response, clone it to cache for offline backup
        if (networkResponse && networkResponse.status === 200) {
          const cacheCopy = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, cacheCopy);
          });
        }
        return networkResponse;
      })
      .catch((error) => {
        console.log('FlexPlayer SW: App is offline. Attempting cache fallback for:', event.request.url);
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          
          // Match index.html as fallback for SPA-like routes if cached
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
          
          return Promise.reject(error);
        });
      })
  );
});
