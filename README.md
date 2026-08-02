# 學途 StudyPath

香港 DSE 備考網站：指定範文閃卡、自適應診斷室。

小學升學產品已獨立為 **[升小指南 PrimaryNav](https://primary.studypath.hk)**。

## 開發

```bash
npm install
npm run dev
```

開啟 [http://localhost:3000](http://localhost:3000)。

## 部署（Vercel）

Root Directory 留空（倉庫根目錄），Framework 選 Next.js。

上線前請改 `src/lib/site.ts` 的 `SITE_URL`。

## 路由

| Path | 用途 |
|------|------|
| `/` | 首頁 |
| `/dse` | DSE 科目總覽 |
| `/dse/chinese` | 中文指定範文 |
| `/dse/chinese/[slug]` | 範文閃卡 |
| `/dse/chinese/cat` | 範文 AI 診斷室 |
| `/dse/chinese/error-notebook` | 錯題本 |
