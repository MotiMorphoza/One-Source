const CACHE_NAME = "llh-core-v5";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./styles.css",
  "./hubIndex.js",
  "./core/audio.js",
  "./core/engine.js",
  "./core/eventBus.js",
  "./core/hubAdapter.js",
  "./core/hubManager.js",
  "./core/router.js",
  "./core/speech.js",
  "./core/storage.js",
  "./games/flashcards.js",
  "./games/gameInterface.js",
  "./games/wordmatch.js",
  "./games/wordpuzzle.js",
  "./ui/accordion.js",
  "./ui/library.js",
  "./ui/modals.js",
  "./ui/stats.js",
  "./utils/csv.js",
  "./utils/helpers.js",
  "./utils/text.js"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
          return Promise.resolve();
        }),
      ),
    ).then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  const requestUrl = new URL(event.request.url);
  const isSameOrigin = requestUrl.origin === self.location.origin;
  const isHubMetadataRequest = requestUrl.pathname.endsWith("/hubIndex.js");
  const isHubContentRequest = requestUrl.pathname.includes("/hub/");
  const isAppShellRequest =
    isSameOrigin &&
    (event.request.mode === "navigate" ||
      /\.(?:html|css|js|json)$/i.test(requestUrl.pathname));

  if (isHubMetadataRequest || isHubContentRequest) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => caches.match(event.request)),
    );
    return;
  }

  if (isAppShellRequest) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => caches.match(event.request)),
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        return cached;
      }

      return fetch(event.request).then((response) => {
        if (isSameOrigin && response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      });
    }),
  );
});
