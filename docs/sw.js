// オフラインで使うためのサービスワーカー。
// 画面と JS は「キャッシュを先に返し、裏で更新」、心電図データ（.bin）は一度保存したら変わらないので「キャッシュ優先」。
// 画面や JS を変えて公開したら VERSION を上げる。
const VERSION = "v1";
const SHELL = `shell-${VERSION}`;
const DATA = "data-v1";
const SHELL_FILES = [
  "./", "index.html", "manifest.webmanifest", "css/style.css",
  "js/app.js", "js/basics.js", "js/dx.js", "js/lessons.js", "js/lessons2.js", "js/monitor.js",
  "js/paper.js", "js/schematic.js", "js/widgets2.js", "js/sync.js", "js/firebase-config.js",
  "data/cases_12lead.json", "data/cases_monitor.json",
  "icons/icon-192.png", "icons/icon-512.png", "icons/apple-touch-icon.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(SHELL).then((c) => c.addAll(SHELL_FILES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k !== SHELL && k !== DATA) await caches.delete(k);
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return;
  if (url.pathname.endsWith(".bin")) {
    e.respondWith((async () => {
      const cache = await caches.open(DATA);
      const hit = await cache.match(e.request);
      if (hit) return hit;
      const res = await fetch(e.request);
      if (res.ok) cache.put(e.request, res.clone());
      return res;
    })());
    return;
  }
  e.respondWith((async () => {
    const cache = await caches.open(SHELL);
    const hit = await cache.match(e.request, { ignoreSearch: true });
    const net = fetch(e.request).then((res) => { if (res.ok) cache.put(e.request, res.clone()); return res; }).catch(() => null);
    return hit || (await net) || new Response("offline", { status: 503 });
  })());
});

// 画面から「全データを保存」と頼まれたら、心電図データをまとめてキャッシュする
self.addEventListener("message", (e) => {
  if (e.data?.type !== "cacheData") return;
  e.waitUntil((async () => {
    const cache = await caches.open(DATA);
    let done = 0;
    for (const f of e.data.files) {
      if (!(await cache.match(f))) {
        try { const res = await fetch(f); if (res.ok) await cache.put(f, res); } catch { /* 次回また試す */ }
      }
      done += 1;
      if (done % 20 === 0 || done === e.data.files.length) e.source?.postMessage({ type: "cacheProgress", done, total: e.data.files.length });
    }
  })());
});
