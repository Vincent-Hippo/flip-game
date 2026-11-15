/* 開心翻翻樂 - Service Worker
   安裝後將遊戲與全部音檔快取，離線也能玩
   注意：音檔逐一下載（缺檔自動略過），不會因為少一個 mp3 而整個安裝失敗 */
const CACHE_NAME = "flipgame-v2";

const FILES = [
  "./index.html",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png",
  // 動物
  "./動物/兔.mp3", "./動物/熊.mp3", "./動物/狗.mp3", "./動物/蝴蝶.mp3",
  "./動物/象.mp3", "./動物/豬.mp3", "./動物/貓.mp3", "./動物/雞.mp3",
  "./動物/馬.mp3", "./動物/魚.mp3", "./動物/鼠.mp3", "./動物/龜.mp3",
  // 水果（芭樂、甘蔗待補音檔）
  "./水果/蘋果.mp3", "./水果/香蕉.mp3", "./水果/西瓜.mp3", "./水果/橘子.mp3",
  "./水果/葡萄.mp3", "./水果/草莓.mp3", "./水果/鳳梨.mp3", "./水果/桃子.mp3",
  "./水果/芒果.mp3", "./水果/芭樂.mp3", "./水果/櫻桃.mp3", "./水果/甘蔗.mp3",
  // 生活物品
  "./生活物品/咖啡.mp3", "./生活物品/手機.mp3", "./生活物品/斧頭.mp3", "./生活物品/時鐘.mp3",
  "./生活物品/書.mp3", "./生活物品/椅子.mp3", "./生活物品/眼鏡.mp3", "./生活物品/茶.mp3",
  "./生活物品/藥.mp3", "./生活物品/鑰匙.mp3", "./生活物品/雨傘.mp3", "./生活物品/面紙.mp3",
  // 花草樹木
  "./花草/樹.mp3", "./花草/花.mp3", "./花草/向日葵.mp3", "./花草/菊花.mp3",
  "./花草/鬱金香.mp3", "./花草/仙人掌.mp3", "./花草/幸運草.mp3", "./花草/楓葉.mp3",
  "./花草/稻穗.mp3", "./花草/栗子.mp3", "./花草/茶葉.mp3", "./花草/落葉.mp3",
  // 交通工具
  "./交通/火車.mp3", "./交通/公車.mp3", "./交通/計程車.mp3", "./交通/汽車.mp3",
  "./交通/腳踏車.mp3", "./交通/機車.mp3", "./交通/飛機.mp3", "./交通/帆船.mp3",
  "./交通/救護車.mp3", "./交通/消防車.mp3", "./交通/警車.mp3", "./交通/貨車.mp3",
  // 海洋生物
  "./海洋/魚.mp3", "./海洋/蝦.mp3", "./海洋/螃蟹.mp3", "./海洋/章魚.mp3",
  "./海洋/海豚.mp3", "./海洋/鯨魚.mp3", "./海洋/海龜.mp3", "./海洋/鯊魚.mp3",
  "./海洋/貝殼.mp3", "./海洋/河豚.mp3", "./海洋/龍蝦.mp3", "./海洋/鱷魚.mp3",
  // 節慶民俗
  "./節慶/燈籠.mp3", "./節慶/紅包.mp3", "./節慶/鞭炮.mp3", "./節慶/月餅.mp3",
  "./節慶/煙火.mp3", "./節慶/風箏.mp3", "./節慶/彩球.mp3", "./節慶/竹子.mp3",
  "./節慶/龍.mp3", "./節慶/獅子.mp3", "./節慶/仙女棒.mp3", "./節慶/氣球.mp3",
  // 天氣
  "./天氣/太陽.mp3", "./天氣/月亮.mp3", "./天氣/星星.mp3", "./天氣/雲.mp3",
  "./天氣/彩虹.mp3", "./天氣/閃電.mp3", "./天氣/雪花.mp3", "./天氣/海浪.mp3",
  "./天氣/下雨.mp3", "./天氣/多雲.mp3", "./天氣/颱風.mp3", "./天氣/霧.mp3",
  // 台灣美食
  "./美食/湯麵.mp3", "./美食/白飯.mp3", "./美食/火鍋.mp3", "./美食/荷包蛋.mp3",
  "./美食/麵包.mp3", "./美食/餅乾.mp3", "./美食/甜甜圈.mp3", "./美食/冰淇淋.mp3",
  "./美食/布丁.mp3", "./美食/水餃.mp3", "./美食/麻糬.mp3", "./美食/籤餅.mp3"
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

// 攔截請求：優先用快取（離線可玩），沒有才上網抓
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).then(response => response.clone()).catch(() => cached);
    })
  );
});
