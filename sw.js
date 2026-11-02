/* 開心翻翻樂 - Service Worker
   安裝後將遊戲與全部音檔快取，離線也能玩 */
const CACHE_NAME = "flipgame-v1";

const FILES = [
  "./index.html",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png",
  // 動物
  "./動物/兔.mp3", "./動物/熊.mp3", "./動物/狗.mp3", "./動物/蝴蝶.mp3",
  "./動物/象.mp3", "./動物/豬.mp3", "./動物/貓.mp3", "./動物/雞.mp3",
  "./動物/馬.mp3", "./動物/魚.mp3", "./動物/鼠.mp3", "./動物/龜.mp3",
  // 水果
  "./水果/奇異果.mp3", "./水果/桃子.mp3", "./水果/橘子.mp3", "./水果/櫻桃.mp3",
  "./水果/芒果.mp3", "./水果/草莓.mp3", "./水果/葡萄.mp3", "./水果/蘋果.mp3",
  "./水果/西瓜.mp3", "./水果/酪梨.mp3", "./水果/香蕉.mp3", "./水果/鳳梨.mp3",
  // 生活物品
  "./生活物品/咖啡.mp3", "./生活物品/手機.mp3", "./生活物品/斧頭.mp3", "./生活物品/時鐘.mp3",
  "./生活物品/書.mp3", "./生活物品/椅子.mp3", "./生活物品/眼鏡.mp3", "./生活物品/茶.mp3",
  "./生活物品/藥.mp3", "./生活物品/鑰匙.mp3", "./生活物品/雨傘.mp3", "./生活物品/面紙.mp3"
];

// 安裝：把全部檔案放進快取
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(FILES))
      .then(() => self.skipWaiting())
  );
});

// 啟用：清除舊版快取
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// 攔截請求：優先用快取（離線可玩），沒有才上網抓
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).then(response => response.clone()).catch(() => cached);
    })
  );
});
