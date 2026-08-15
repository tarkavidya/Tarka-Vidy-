/**
 * Tarka-Vidyā Swādhyāya Service Worker
 * Enables offline capabilities for the entire classical Indian philosophy suite.
 */

const CACHE_NAME = 'tarkavidya-offline-cache-v1';

// Initial shell assets to cache on install
const PRE_CACHE_RESOURCES = [
  '/',
  '/index.html',
  '/src/main.tsx',
  '/src/App.tsx',
  '/src/index.css'
];

// Install Event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Pre-caching Core Offline Shell');
      return cache.addAll(PRE_CACHE_RESOURCES);
    }).then(() => {
      return self.skipWaiting();
    })
  );
});

// Activate Event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheKeys) => {
      return Promise.all(
        cacheKeys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[Service Worker] Clearing Old Cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch Event
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Skip caching for server-side API endpoints (Gemini models require connection)
  if (url.pathname.startsWith('/api/')) {
    return;
  }

  // Bypass non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Allow caching of local assets, files, and third-party Google Fonts
  const isLocalAsset = url.origin === self.location.origin;
  const isGoogleFont = url.hostname.includes('fonts.googleapis.com') || url.hostname.includes('fonts.gstatic.com');

  if (!isLocalAsset && !isGoogleFont) {
    return;
  }

  // Network-First with Cache-Fallback Strategy
  event.respondWith(
    fetch(request)
      .then((networkResponse) => {
        // Cache successful responses
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch((err) => {
        console.log(`[Service Worker] Offline detected. Serving from cache: ${url.pathname}`);
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }

          // If it's a page navigation request (HTML), return the root index.html as a fallback
          if (request.headers.get('accept')?.includes('text/html')) {
            return caches.match('/') || caches.match('/index.html');
          }

          // Return an empty fallback for other assets if not found in cache
          return new Response('Offline Content Unavailable', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({ 'Content-Type': 'text/plain' })
          });
        });
      })
  );
});
