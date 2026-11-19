/* Le Stylo Rouge, the offline copy (version 3.0.1). Caches the page and the icons on install and serves them cache-first. A new version has a new cache name:
   it is filled on install and the old ones are deleted when it takes over. No network address is written here; it fetches only the page's own files. */
var CACHE = 'pas-a-pas-3.0.1';
var FILES = ["./", "index.html", "icon-192.png", "icon-512.png", "manifest.webmanifest"];
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(FILES); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k.indexOf('pas-a-pas-') === 0 && k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  var u = new URL(e.request.url);
  if (u.origin !== self.location.origin) return;
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(function (r) { return r || fetch(e.request); }));
});
