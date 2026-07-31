/* ============================================================
   H² 旅遊 App — Service Worker（離線快取）
   作用：把「畫面外殼 + 導覽列圖示 + Firebase 程式庫 + 字型」存進手機，
        讓沒網路時 App 照樣打開、按鈕圖示不消失。
   注意：每次更新 index.html 後，把下面的版本號 +1（例如 v2 → v3），
        使用者下次連上網才會抓到新版並清掉舊快取。
   ============================================================ */
const CACHE = 'h2-seoul-v2';

/* 開機一定要在的核心資源（同源檔案 + 外部程式庫/字型） */
const CORE = [
  './',
  './index.html',
  './manifest.json',
  './apple-touch-icon.png',
  './icon/nav/行程.png',
  './icon/nav/住宿.png',
  './icon/nav/預算.png',
  './icon/nav/待買.png',
  './icon/nav/我的.png',
  './icon/nav/刷子.png',
  './icon/葉子.webp',
  'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js',
  'https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js',
  'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js',
  'https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700&family=DM+Sans:ital,wght@0,400;0,500;1,400&family=Fredoka:wght@400;500;600;700&family=Outfit:wght@400;500;600;700;800&family=Poppins:wght@700;800&family=Syne:wght@500;600;700&display=swap'
];

/* 安裝：逐一快取核心資源（單一檔案失敗不會拖垮整個安裝） */
self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then((cache) =>
      Promise.all(CORE.map((url) => cache.add(url).catch(() => {})))
    )
  );
});

/* 啟用：清掉舊版本快取 */
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* 攔截請求 */
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  /* Firebase 即時資料庫 / 登入流量：永遠走網路，不快取
     （這些是即時同步的資料，離線時讓它自然失敗，App 會改用本地快取的最後資料） */
  const h = url.hostname;
  if (h.includes('firebaseio.com') || h.includes('firebasedatabase.app') ||
      h.includes('googleapis.com') || h.includes('identitytoolkit') ||
      h.includes('securetoken')) {
    return; // 交給瀏覽器預設處理
  }

  /* 開啟頁面（HTML 導覽）：優先拿最新版，拿不到（離線）再用快取 */
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then((r) => r || caches.match('./index.html')))
    );
    return;
  }

  /* 其他靜態資源（圖示、字型檔、Firebase 程式庫）：優先用快取，同時背景更新 */
  e.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req)
        .then((res) => {
          if (res && (res.ok || res.type === 'opaque')) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
