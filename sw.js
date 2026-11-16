/* 開心翻翻樂 - Service Worker
   安裝後將遊戲、圖片與全部音檔快取，離線也能玩
   注意：逐一下載（缺檔自動略過），不會因為少一個檔案而整個安裝失敗 */
const CACHE_NAME = "flipgame-v4";

const FILES = [
  "./index.html",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png",
  // 圖片牌面
  "./水果/芭樂.jpg", "./水果/甘蔗.jpg",
  "./花草樹木/繡球花.jpg", "./花草樹木/蓮花.jpg", "./花草樹木/蘭花.jpg",
  "./節慶民俗/香.jpg", "./台灣美食/肉粽.jpg",
  // 動物
  "./動物/兔.mp3", "./動物/熊.mp3", "./動物/狗.mp3", "./動物/蝴蝶.mp3",
  "./動物/象.mp3", "./動物/豬.mp3", "./動物/貓.mp3", "./動物/雞.mp3",
  "./動物/馬.mp3", "./動物/魚.mp3", "./動物/鼠.mp3", "./動物/龜.mp3",
  // 水果
  "./水果/蘋果.mp3", "./水果/香蕉.mp3", "./水果/西瓜.mp3", "./水果/橘子.mp3",
  "./水果/葡萄.mp3", "./水果/草莓.mp3", "./水果/鳳梨.mp3", "./水果/桃子.mp3",
  "./水果/芒果.mp3", "./水果/芭樂.mp3", "./水果/櫻桃.mp3", "./水果/甘蔗.mp3",
  // 生活物品
  "./生活物品/咖啡.mp3", "./生活物品/手機.mp3", "./生活物品/斧頭.mp3", "./生活物品/時鐘.mp3",
  "./生活物品/書.mp3", "./生活物品/椅子.mp3", "./生活物品/眼鏡.mp3", "./生活物品/茶.mp3",
  "./生活物品/藥.mp3", "./生活物品/鑰匙.mp3", "./生活物品/雨傘.mp3", "./生活物品/面紙.mp3",
  // 花草樹木
  "./花草樹木/樹.mp3", "./花草樹木/花.mp3", "./花草樹木/向日葵.mp3", "./花草樹木/菊花.mp3",
  "./花草樹木/繡球花.mp3", "./花草樹木/蓮花.mp3", "./花草樹木/蘭花.mp3", "./花草樹木/楓葉.mp3",
  "./花草樹木/稻穗.mp3", "./花草樹木/栗子.mp3", "./花草樹木/茶葉.mp3", "./花草樹木/落葉.mp3",
  // 交通工具
  "./交通工具/火車.mp3", "./交通工具/公車.mp3", "./交通工具/計程車.mp3", "./交通工具/汽車.mp3",
  "./交通工具/腳踏車.mp3", "./交通工具/機車.mp3", "./交通工具/飛機.mp3", "./交通工具/帆船.mp3",
  "./交通工具/救護車.mp3", "./交通工具/消防車.mp3", "./交通工具/警車.mp3", "./交通工具/貨車.mp3",
  // 海洋生物
  "./海洋生物/魚.mp3", "./海洋生物/蝦.mp3", "./海洋生物/螃蟹.mp3", "./海洋生物/章魚.mp3",
  "./海洋生物/海豚.mp3", "./海洋生物/鯨魚.mp3", "./海洋生物/海龜.mp3", "./海洋生物/鯊魚.mp3",
  "./海洋生物/貝殼.mp3", "./海洋生物/河豚.mp3", "./海洋生物/龍蝦.mp3", "./海洋生物/鱷魚.mp3",
  // 節慶民俗
  "./節慶民俗/燈籠.mp3", "./節慶民俗/紅包.mp3", "./節慶民俗/鞭炮.mp3", "./節慶民俗/月餅.mp3",
  "./節慶民俗/煙火.mp3", "./節慶民俗/風箏.mp3", "./節慶民俗/彩球.mp3", "./節慶民俗/竹子.mp3",
  "./節慶民俗/龍.mp3", "./節慶民俗/獅子.mp3", "./節慶民俗/香.mp3", "./節慶民俗/氣球.mp3",
  // 天氣
  "./天氣/太陽.mp3", "./天氣/月亮.mp3", "./天氣/星星.mp3", "./天氣/雲.mp3",
  "./天氣/彩虹.mp3", "./天氣/閃電.mp3", "./天氣/雪花.mp3", "./天氣/海浪.mp3",
  "./天氣/下雨.mp3", "./天氣/多雲.mp3", "./天氣/颱風.mp3", "./天氣/霧.mp3",
  // 台灣美食
  "./台灣美食/湯麵.mp3", "./台灣美食/白飯.mp3", "./台灣美食/火鍋.mp3", "./台灣美食/荷包蛋.mp3",
  "./台灣美食/麵包.mp3", "./台灣美食/餅乾.mp3", "./台灣美食/肉粽.mp3", "./台灣美食/冰淇淋.mp3",
  "./台灣美食/布丁.mp3", "./台灣美食/水餃.mp3", "./台灣美食/麻糬.mp3", "./台灣美食/籤餅.mp3"
];

// 安裝：逐一快取（缺檔略過，不中斷）
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      await Promise.allSettled(FILES.map(url => cache.add(url)));
      return self.skipWaiting();
    })
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

// 攔截請求：
// ① 遊戲本體（index.html 等）→ 「網路優先」：永遠拿最新版，離線才用快取
// ② 圖片與音檔 → 「快取優先」：快又不耗流量
self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);
  const path = decodeURIComponent(url.pathname);
  const isAppShell =
    path.endsWith("index.html") || path.endsWith("/") ||
    path.endsWith("manifest.webmanifest") || path.endsWith("icon-192.png") || path.endsWith("icon-512.png");

  if (isAppShell) {
    event.respondWith(
      fetch(event.request).then(response => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy)).catch(() => {});
        return response;
      }).catch(() => caches.match(event.request))
    );
  } else {
    event.respondWith(
      caches.match(event.request).then(cached => {
        return cached || fetch(event.request).then(response => response.clone()).catch(() => cached);
      })
    );
  }
});
