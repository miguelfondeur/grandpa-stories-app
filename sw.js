const CACHE_NAME = "grandpa-stories-cache-v1";
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

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

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