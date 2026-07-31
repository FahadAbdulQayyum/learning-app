/* global QUIZ_WORDS, pickQuizWord */
importScripts("./quiz-words.js");

const CACHE_NAME = "laut-v9.0.0";
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./motion-ui.js",
  "./vendor/motion.js",
  "./version.js",
  "./data.js",
  "./stories.js",
  "./vocabulary.js",
  "./grammar.js",
  "./personal.js",
  "./learn.js",
  "./quiz-words.js",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon.png",
  "./icons/favicon.png",
  "./icons/logo-mark.png",
];

const HOURLY_TAG = "laut-hourly-quiz";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(request).then((cached) => {
      const networkFetch = fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached);

      if (cached) {
        networkFetch.catch(() => {});
        return cached;
      }

      return networkFetch;
    })
  );
});

self.addEventListener("message", (event) => {
  const data = event.data || {};
  if (data.type === "SHOW_QUIZ_NOTIFICATION") {
    event.waitUntil(showQuizNotification(data.word || null));
  }
});

self.addEventListener("periodicsync", (event) => {
  if (event.tag === "hourly-vocab-quiz") {
    event.waitUntil(showQuizNotification());
  }
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const payload = event.notification.data || {};
  const params = new URLSearchParams();
  params.set("quiz", "1");
  if (payload.de) params.set("de", payload.de);
  if (payload.en) params.set("en", payload.en);

  const targetUrl = `./?${params.toString()}`;

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientsArr) => {
      for (const client of clientsArr) {
        if ("focus" in client) {
          client.postMessage({ type: "OPEN_QUIZ", de: payload.de, en: payload.en });
          return client.focus();
        }
      }
      if (self.clients.openWindow) return self.clients.openWindow(targetUrl);
      return undefined;
    })
  );
});

/**
 * @param {{ de: string, en: string } | null} [forcedWord]
 */
async function showQuizNotification(forcedWord = null) {
  const word = forcedWord && forcedWord.de && forcedWord.en ? forcedWord : pickQuizWord();
  if (typeof self.registration.showNotification !== "function") return;

  await self.registration.showNotification("Guess this German word", {
    body: `What does “${word.de}” mean?`,
    icon: "./icons/icon-192.png",
    badge: "./icons/icon-192.png",
    tag: HOURLY_TAG,
    renotify: true,
    requireInteraction: false,
    data: { de: word.de, en: word.en },
    actions: [{ action: "reveal", title: "Reveal meaning" }],
  });
}
