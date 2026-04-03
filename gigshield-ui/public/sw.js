const CACHE_NAME = "gigshield-shell-v7";
const STATIC_ASSETS = ["/", "/offline.html", "/manifest.webmanifest", "/icons/icon-192.svg", "/icons/icon-512.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  
  // Don't cache API calls - network first for those
  if (request.url.includes("/api/") || request.url.includes("/health")) {
    event.respondWith(
      fetch(request).catch(() => new Response(JSON.stringify({ error: "offline" }), {
        status: 503,
        headers: { "Content-Type": "application/json" }
      }))
    );
    return;
  }

  // For static assets: network first, then cache, then offline page
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      })
      .catch(async () => {
        const cached = await caches.match(request);
        if (cached) return cached;
        // For navigation requests, show offline page
        if (request.mode === "navigate") {
          return caches.match("/offline.html");
        }
        return new Response("Offline", { status: 503 });
      })
  );
});

// Push notification handling
self.addEventListener("push", (event) => {
  const data = event.data?.json() ?? { title: "GigShield", body: "You have a new notification" };
  event.waitUntil(
    self.registration.showNotification(data.title || "GigShield", {
      body: data.body || data.message || "New update",
      icon: "/icons/icon-192.svg",
      badge: "/icons/icon-192.svg",
      vibrate: [200, 100, 200],
      data: data.url ? { url: data.url } : undefined
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/";
  event.waitUntil(clients.openWindow(url));
});
