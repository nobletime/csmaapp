var cacheName = 'hello-pwa';
var filesToCache = [
  '/',
  '/public/css/stylepwa.css',
  '/public/images/therapy/appliance.png',
  '/public/images/therapy/back.png',
  '/public/images/therapy/dsa.png',
  '/public/images/therapy/general-notes.jpg',
  '/public/images/therapy/inspire.png',
  '/public/images/therapy/med.png',
  '/public/images/therapy/pap.png',
  '/public/images/therapy/therapy-tracker.jpg',
  '/public/images/logo.jpg'
  // '/public/js/mainpwa.js',
  // '/public/js/main.js'
  //'/public/js/surverys.js',
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

// const SHARED_DATA_ENDPOINT = '/app_id';

// self.addEventListener('fetch', function(event) {
//   const {
//     request,
//     request: {
//       url,
//       method,
//     },
//   } = event;
//   if  (url.match(SHARED_DATA_ENDPOINT)) {
//     if (method === 'POST') {
//       request.json().then(body => {
//         caches.open(SHARED_DATA_ENDPOINT).then(function(cache) {
//           cache.put(SHARED_DATA_ENDPOINT, new Response(JSON.stringify(body)));
//         });
//       }); 
//       return new Response('{}');
//     } else {
//       event.respondWith(
//         caches.open(SHARED_DATA_ENDPOINT).then(function(cache) {
//           return cache.match(SHARED_DATA_ENDPOINT).then(function (response) {
//             return response || new Response('{}');;
//           }) || new Response('{}');
//         })
//       );
//     }
//   } else {
//     return event;
//   }
// });

/* Serve cached content when offline */
self.addEventListener('fetch', function(event) {
  
  event.waitUntil(async function() {
    // Exit early if we don't have access to the client.
    // Eg, if it's cross-origin.
    // if (!e.clientId) return;

    // // Get the client.
    // const client = await clients.get(e.clientId);
    // // Exit early if we don't get the client.
    // // Eg, if it closed.
    // if (!client) return;

    // // Send a message to the client.
    // client.postMessage({
    //   msg: "Hey I just got a fetch from you!",
    //   url: e.request.url
    // });

  })

  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());
 // clients.claim();
  console.log('Ready!');
});

self.addEventListener('install', (event) => {
console.log("installing")
})

self.addEventListener('message', event => {
  console.log(`SW: ${event.data}`);
  // if (JSON.parse(event.data).app_id) {
  // const app_id = new URL(location).searchParams.get("app_id")
  // event.source.postMessage(JSON.stringify({app_id: app_id}));
  // }
});


