const CACHE_NAME = "carb-cruncher-app-v1";
const APP_SHELL = [
  "./index%20copy.html",
  "./app.webmanifest",
  "./app-icon-192.png",
  "./app-icon-512.png",
  "./Carbs%20logo.png",
  "./home%20logo.png",
  "./background.png",
  "./Green%20background.png",
  "./Pink%20background.png",
  "./Purple%20background.png",
  "./Search%20icon.png",
  "./burger.png",
  "./lightbulb.png",
  "./recipes.png",
  "./learning.png",
  "./settings%20logo.png",
  "./Carbs%20icon%20transparent.png",
  "./Blood%20Glucose%20icon%20transparent.png",
  "./Blood%20Vessel%20icon%20transparent.png",
  "./insulin%20icon%20transparent.png",
  "./Carb%20Calculator%20icon%20transparent.png",
  "./Nutrition%20label%20icon%20transparent.png",
  "./Food%20pyramid%20icon%20transparent.png",
  "./calorie%20icon%20transparent.png",
  "./budget%20icon%20transparent.png",
  "./Weighing%20food%20icon%20transparent.png"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key.startsWith("carb-cruncher-app-") && key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
          return response;
        })
        .catch(async () => (await caches.match(request)) || caches.match("./index%20copy.html"))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(response => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
        }
        return response;
      });
    })
  );
});
