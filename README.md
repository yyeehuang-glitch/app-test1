# Yong Bros Tokyo — 部署說明

## 檔案清單
- `index.html` — 主要 App 頁面
- `manifest.json` — PWA 設定（讓手機可加入主畫面）
- `sw.js` — Service Worker（離線模式）

---

## 部署到 Vercel（5分鐘完成）

### 方法一：直接拖曳（最簡單）
1. 前往 https://vercel.com → 登入（可用 Google 登入）
2. 點「Add New → Project」
3. 選「Import Third-Party Git Repository」或直接拖曳資料夾
4. 選擇這個資料夾 → Deploy
5. 完成！取得網址

### 方法二：透過 GitHub（推薦，方便之後更新）
1. 在 GitHub 建立新 repo（例如 `tokyo-yongbros`）
2. 把這個資料夾的三個檔案上傳進去
3. 前往 Vercel → Import Git Repository
4. 選你的 repo → Deploy
5. 之後想改行程資料，直接改 GitHub 上的 index.html 就會自動重新部署

---

## 手機加入主畫面（離線使用）

### iPhone Safari：
1. 用 Safari 打開 Vercel 網址
2. 點下方分享按鈕（方塊+箭頭圖示）
3. 選「加入主畫面」
4. 就像 App 一樣可離線使用

### Android Chrome：
1. 用 Chrome 打開網址
2. 點右上角選單（三個點）
3. 選「加入主畫面」

---

## 使用說明
- 點 ✏️ 編輯地點（時間、名稱、描述、備注、地圖連結、照片）
- 點 🧭 直接跳 Google Maps 導航
- 點「＋ 新增地點」增加行程
- 所有修改自動存在手機，不需重新部署
- 照片：上傳到 Google Photos → 分享連結 → 貼入照片欄位
