const CACHE = "hellolwd-shell-v3";
const OFFLINE = "/offline.html";
const PRECACHE = [OFFLINE, "/favicon.svg", "/icons/icon-192.png", "/icons/icon-512.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))),
    ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/admin") || url.pathname.startsWith("/api/")) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(async () => {
        const cached = await caches.match(OFFLINE);
        if (!cached) return new Response("HelloLWD", { status: 503, statusText: "Offline" });
        const locale = new URL(request.url).pathname.match(/^\/(nl|en|es|fa)(?:\/|$)/)?.[1];
        if (!locale) return cached;
        const html = (await cached.text()).replace(
          'data-locale="en"',
          `data-locale="${locale}" data-from-sw="1"`,
        );
        return new Response(html, {
          headers: { "Content-Type": "text/html; charset=utf-8" },
        });
      }),
    );
    return;
  }

  if (!/\.(?:png|svg|jpg|jpeg|webp|woff2)$/i.test(url.pathname)) return;

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy));
        }
        return response;
      });
    }),
  );
});
