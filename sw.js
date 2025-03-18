const CACHE_NAME = "grandpa-stories-cache-v1.1";  // Increment version to force update
const ASSETS_TO_CACHE = [
    "/",
    "/index.html",
    "/style.css?v=1.1",
    "/app.js?v=1.1",
    "/stories.js?v=1.1",
    "/manifest.json?v=1.1",
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
      console.log("Caching assets:", ASSETS_TO_CACHE);  // Log cached files
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

// ✅ Fetch Event: Always fetch fresh content first, cache as backup
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)   // Always fetch fresh content first
      .then((response) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, response.clone());  // Update cache with fresh content
          return response;
        });
      })
      .catch(() => caches.match(event.request))  // Use cache only as a fallback
  );
});
