# 學途 StudyPath

香港升學資訊網站：**DSE 備考**（已上線）＋ **K3 選小學**（架構預留）。

## 開發

```bash
npm install
npm run dev
```

開啟 [http://localhost:3000](http://localhost:3000)。

## 部署（Vercel）

本專案是標準 Next.js App Router，**Root Directory 請留空（倉庫根目錄）**，Framework 選 Next.js。

上線前請改 `src/lib/site.ts` 的 `SITE_URL`。

## 路由

| Path | 用途 |
|------|------|
| `/` | 首頁 |
| `/dse` | DSE 科目總覽 |
| `/dse/chinese` | 中文指定範文 |
| `/dse/chinese/analects` | 《論語》60 題閃卡 |
| `/k3` | K3 選小學（Coming Soon） |

原稿／草稿在 [`_draft/`](./_draft/)。
