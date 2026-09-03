// Tezgahçı — PWA service worker
// Amaç: mobil Safari (iOS) ve mobil Chrome (Android) tarayıcılarından
// "Ana ekrana ekle / Uygulamayı yükle" ile kurulabilir olmak (installability),
// ve internet kesildiğinde boş bir hata sayfası yerine basit bir "bağlantı yok"
// ekranı göstermek. Site içeriğini önbelleğe almaya çalışmaz — Tezgahçı sürekli
// güncellenen bir ilan platformu olduğu için eski/bayat içerik göstermek yerine
// her zaman ağdan taze veri çekmeyi tercih eder.

const CACHE_NAME = "tezgahci-shell-v1";
const OFFLINE_URL = "/offline.html";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll([OFFLINE_URL])).then(() => self.skipWaiting())
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
  // Yalnızca sayfa gezinmelerini (navigation) yakala; statik dosyalar, API
  // istekleri vb. her zaman doğrudan ağa gitsin.
  if (event.request.mode !== "navigate") return;

  event.respondWith(
    fetch(event.request).catch(() => caches.match(OFFLINE_URL))
  );
});
