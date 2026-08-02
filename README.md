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

### R2（K3 學校資料）

學校資料存放於 Cloudflare R2 bucket `school-info`，透過 **jurisdiction-specific** S3 endpoint 讀取（勿用通用 AWS endpoint）：

`https://2c2a3e2fab390a799cadaa93e0da262d.r2.cloudflarestorage.com`

Vercel Environment Variables（Production & Preview）：

| Key | 用途 |
|-----|------|
| `School_Access_Key` | R2 Access Key ID |
| `School_Secret_AccessKey` | R2 Secret Access Key |
| `School_Token` | R2 Account ID（可選；endpoint 已內建預設） |

本地開發可複製 `.env.example` → `.env.local`。

物件：

- `schools_summary.json`
- `schools/school_1.json` … `school_507.json`
- `news.json`

## 路由

| Path | 用途 |
|------|------|
| `/` | 首頁 |
| `/dse` | DSE 科目總覽 |
| `/dse/chinese` | 中文指定範文 |
| `/dse/chinese/analects` | 《論語》60 題閃卡 |
| `/schools` | K3 選小學列表（篩選／搜尋） |
| `/schools/[id]` | 學校詳情（SSG） |
| `/calculator` | 小一派位成功率計算器 + Persona 報告 |
| `/portfolio-builder` | 叩門 A4 Portfolio → PDF |
| `/news` | 最新直私報名情報 |
| `/k3` | 重新導向至 `/schools` |
| `/api/schools/summary` | R2 學校總表（可選） |
| `/api/schools/news` | R2 直資＋私立新聞 |
| `/api/schools/[id]` | R2 單校詳情（可選） |

### 本地學校 JSON（SSG）

請將 Hermes 數據歸位：

```
src/data/schools_summary.json
src/data/schools/1.json … 507.json
```

（亦相容 `school_1.json` 命名。）預覽用範例：`/schools/example`。

原稿／草稿在 [`_draft/`](./_draft/)。
