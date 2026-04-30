// Network-first: always fetch latest from the network (bypassing HTTP cache),
// fall back to cache when offline.
const CACHE = "lynn-keto-v11";
const ASSETS = ["./", "index.html", "styles.css", "data.js", "icons.js", "gate.js", "app.js", "manifest.json", "icon.svg"];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) =>
      Promise.all(ASSETS.map((a) =>
        fetch(a, { cache: "reload" }).then((res) => res.ok && c.put(a, res))
      ))
    )
  );
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  // Same-origin requests: bypass HTTP cache, keep SW cache fresh as a fallback.
  if (url.origin === self.location.origin) {
    e.respondWith(
      fetch(e.request, { cache: "reload" })
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(e.request, copy));
          }
          return res;
        })
        .catch(() => caches.match(e.request))
    );
    return;
  }
  // Cross-origin (e.g. Chart.js CDN): default fetch is fine.
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
