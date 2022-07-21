var cacheName = 'hello-pwa';
var filesToCache = [
  '/',
  //'/public/html/index.html',
  '/signin',
  '/public/css/stylepwa.css',
  '/public/js/mainpwa.js',
  '/public/images/therapy/appliance.png',
  '/public/images/therapy/back.png',
  '/public/images/therapy/dsa.png',
  '/public/images/therapy/general-notes.jpg',
  '/public/images/therapy/inspire.png',
  '/public/images/therapy/med.png',
  '/public/images/therapy/pap.png',
  '/public/images/therapy/therapy-tracker.jpg',
  '/public/images/logo.png'
];

/* Start the service worker and cache all of the app's content */
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(filesToCache);
    })
  );
  self.skipWaiting();
});

/* Serve cached content when offline */
self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});
