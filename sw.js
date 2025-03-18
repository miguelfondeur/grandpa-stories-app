const CACHE_NAME = "grandpa-stories-cache-v1.1";  // Increment version to force update
const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/style.css",
  "/app.js",
  "/stories.js", 
  "/manifest.json",
  "/icons/android-icon-192x192.png",
  "/icons/android-icon-144x144.png",
  "/icons/android-icon-96x96.png",
  "/icons/android-icon-72x72.png",
  "/icons/android-icon-48x48.png",
  "/icons/android-icon-36x36.png"
];

// ✅ Install Event: Cache assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
    .then(() => self.skipWaiting())  // Activate new service worker immediately
  );
});

// ✅ Activate Event: Clear old caches and claim clients
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))  // Delete old caches
      );
    }).then(() => self.clients.claim())  // Take control of all clients immediately
  );
  
  // Reload all open pages with the new cache
  self.clients.matchAll().then((clients) => {
    clients.forEach((client) => client.navigate(client.url));
  });
});

// ✅ Fetch Event: Serve from cache or fetch new content
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request).then((response) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    })
  );
});
