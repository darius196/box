// Service Worker: hält die App-Dateien im Speicher des Handys,
// damit sie auch bei schlechtem Netz sofort startet.
const CACHE = "lovebox-v11";
const DATEIEN = ["./", "index.html", "mqtt.min.js", "manifest.json", "icon-180.png", "icon-192.png", "icon-512.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(DATEIEN)));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((keys) =>
    Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))));
  self.clients.claim();
});

// Erst im Netz nachsehen (für Updates), sonst aus dem Speicher
self.addEventListener("fetch", (e) => {
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
