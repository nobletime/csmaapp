var cacheName = 'hello-pwa';
var filesToCache = [
  '/',
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
  '/public/images/logo.jpg'
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
  e.waitUntil(async function() {
    // Exit early if we don't have access to the client.
    // Eg, if it's cross-origin.
    if (!e.clientId) return;

    // Get the client.
    const client = await clients.get(e.clientId);
    // Exit early if we don't get the client.
    // Eg, if it closed.
    if (!client) return;

    // Send a message to the client.
    client.postMessage({
      msg: "Hey I just got a fetch from you!",
      url: e.request.url
    });

  })

  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});

self.addEventListener('activate', event => {
  clients.claim();
  console.log('Ready!');
});

self.addEventListener('install', (event) => {
console.log("installing")
})

self.addEventListener('message', event => {
  console.log(`SW: ${event.data}`);
  if (JSON.parse(event.data).app_id) {
  const app_id = new URL(location).searchParams.get("app_id")
  event.source.postMessage(JSON.stringify({app_id: app_id}));
  }
});

self.clients.matchAll().then(clients => {
  clients.forEach(client => client.postMessage({msg: 'Hello from SW'}));
})

