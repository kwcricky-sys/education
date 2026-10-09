# HANDOFF — Front／Gate｜DSE Coverage Gate2（ECON／Math／BAFS／ICT 加厚）

**日期：** 2026-10-09（Asia/Taipei）
**From：** OpenCode（loops）→ Front／Gate
**站：** https://dse.hkxoptima.com/dse（勿用 education.hkxoptima.com/dse）
**對齊：** `_gate2-briefs/TITLES-GATE2.md`｜`BATCH-DSE-{ECON,MATH,BAFS,ICT}-GATE2.md`｜`ACCEPTANCE-DSE-COVERAGE.md` C2–C5｜`HANDOFF-DSE-GATE2.md`
**紅線守：** 無廣告 SDK｜無公民新入口｜Math 必修 only（無 M1／M2 題）｜不自寫 `learn-play:progress:v3`｜無 HKEAA 真題原文

---

## 1. PR

- Repo：`kwcricky-sys/education`（education-safe）
- Base：`main`（Gate1 `a6630fc`）
- Branch：`gate2-dse-econ-math-bafs-ict`
- **未 merge、未 deploy**（等 Primary）

---

## 2. 本拍範圍（C2–C5 內容加厚 ＋ discoverability）

### 2.1 內容增量（全部自編，非 HKEAA 原文／真題）

| 科 | 項目 | TITLES 目標 | 本批實數 | 狀態 |
|---|---|---|---|---|
| ECON | U1–U6 drills | +36 | **+36**（每單元 +6） | ✅ |
| ECON | 誤解／圖表課 | +6 | **+6**（`econ-u01-mischart`…`u06`） | ✅ |
| ECON | 長題答題骨架卡 | +10 | **+10**（`econ-skel-01`…`10`） | ✅ |
| Math | 10u × +4 深題 | +40 | **+40**（每單元 +4） | ✅ |
| Math | 薄弱 unit worked-example | +4～6 | **+5**（U2／U4／U5／U6／U7） | ✅ |
| Math | 片後 5 題示範 | 2 unit | **2**（`math-vid-u02`、`math-vid-u07`，各 5 題） | ✅ 其餘 unit＝TBD／Should（未做，唔阻 Must） |
| BAFS | 9u × +4 drills | +36 | **+36**（每單元 +4） | ✅ |
| BAFS | 弱課 lessons | +4 | **+4**（`bafs-acc-weak-01/02`、`bafs-biz-weak-01/02`） | ✅ |
| BAFS | 答題／格式卡 | +8 | **+8**（`bafs-fmt-01`…`08`） | ✅ |
| ICT | lessons（Algo／Sec／Exam） | +6 | **+6**（`ict-l-algo-01/02`、`ict-l-sec-01/02`、`ict-l-exam-01/02`） | ✅ |
| ICT | 10u × +4 drills | +40 | **+40**（每單元 +4） | ✅ |
| ICT | explain／compare 句式卡 | +8 | **+8**（`ict-phrase-01`…`08`） | ✅ |

題庫總數（`meta.total` 同步更新，hub／科目頁數字自動跟）：

| 科 | Gate1 前 | Gate2 後 | 本批新增 ID 範圍 |
|---|---|---|---|
| ECON | 188 | **224** | `econ-u01-d01`…`econ-u06-d06` |
| Math | 120 | **160** | `math-u01-d01`…`math-u10-d04` |
| BAFS | 144 | **180** | `bafs-u01-d01`…`bafs-u09-d04` |
| ICT | 160 | **200** | `ict-u01-d01`…`ict-u10-d04` |

### 2.2 Discoverability（C6／D1／E3 文案級）

- `/dse` 新增「**自學路徑入口**」區：中文／English／ECON／數學／BAFS／ICT 六格一格即跳 learn；課數／題數由 unit table 讀出，唔會同實際內容脫節。
- 四個 Gate2 科嘅 learn 頁各加「其他科嘅自學路徑」交叉連結（`LearnCrossLinks`），跳去另外五條路徑。
- Footer／header nav 原有 learn 連結不變（Gate1 已備）。
- **無** learn-play 連結：learn-play 暫時只有 `workers.dev` 網址，按規格「never only workers.dev」，故本拍**不掛**任何 learn-play 連結；待有正式網域再由 Primary 加。
- **無**公民新入口：`DSE_SUBJECTS` 的「公民與社會發展」維持 `open:false / href:null`（Gate1 現況，未改）。

---

## 3. Files touched

### 新增（4）
- `src/data/dse/bafs-format-cards.json` — `bafs-fmt-01`…`08`（答題格式卡；公司條例／MPF 措辭保守，唔寫死 %）
- `src/data/dse/ict-phrase-cards.json` — `ict-phrase-01`…`08`（explain／compare 句式卡）
- `src/data/dse/math-video-checks.json` — `math-vid-u02`、`math-vid-u07`（片後 5 題示範，各 5 題）
- `src/components/dse/learn-cross-links.tsx` — 六科 learn 交叉連結

### 修改（19）
- 資料：`src/data/dse/{econ,math,bafs,ict}-drills.json`、`{econ,math,bafs,ict}-lessons.json`、`econ-skeletons.json`
- Unit 表（把新課接上原有單元）：`src/lib/dse/{econ,math,bafs,ict}-path.ts`
- 頁面：`src/app/dse/page.tsx`（hub learn 入口區）、`src/app/dse/{econ,math,bafs,ict}/learn/page.tsx`
- `.gitignore`：加 `_gate2-briefs/`（確保本地 brief 唔入 PR）

**未改（Gate1 不受影響）：** `chinese-*`／`english-*` 資料、`/dse/chinese/learn`、`/dse/english/learn`、`src/lib/dse/chinese-path.ts`、`english-path.ts`、`src/lib/dse/subjects.ts`。

---

## 4. Smoke checklist（本地已跑；請 Gate 重跑）

### 4.1 Build / lint
```bash
npm ci
npm run build     # PASS（1143 static pages）
npm run lint      # 12 problems（11 errors / 1 warning）＝ Gate1 baseline，數目與類型不變，本次無新增
```
> `react-hooks/set-state-in-effect` 全部落喺 Gate1 已有嘅 client component（practice gate／unit map／cookie consent），本次改動檔案 0 個 lint error。

### 4.2 頁面 200
```bash
npx next start -p 3111
for u in /dse /dse/chinese/learn /dse/english/learn \
         /dse/econ/learn /dse/math/learn /dse/bafs/learn /dse/ict/learn; do
  curl -s -o /dev/null -w "%{http_code} $u\n" "http://localhost:3111$u"
done
```
- 期望全部 `200`；Gate1 CHI／EN learn 不變。

### 4.3 本批 ID 抽查（各 1 題單題頁 + 課 ID 在 client bundle）
```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3111/dse/econ/demand-and-supply/econ-u01-d01
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3111/dse/math/algebra/math-u02-d01
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3111/dse/bafs/management/bafs-u03-d01
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3111/dse/ict/algorithms/ict-u07-d01
# 課 ID（課文喺 unit map 內，展開單元先見；確認已打包入頁面 script）：
curl -s http://localhost:3111/dse/econ/learn  | grep -o '/_next/static/chunks/[^"]*\.js' | sort -u   # 再對 chunk grep econ-u01-mischart
curl -s http://localhost:3111/dse/math/learn  | ...  # math-u02-worked
curl -s http://localhost:3111/dse/bafs/learn  | ...  # bafs-biz-weak-02
curl -s http://localhost:3111/dse/ict/learn   | ...  # ict-l-sec-02
```
- learn 頁 server HTML 應見：`econ-skel-01`…`10`（骨架卡 20 條）、`bafs-fmt-01`…`08`、`ict-phrase-01`…`08`、`math-vid-u02`／`math-vid-u07`。

### 4.4 功能（人手）
1. `/dse`：見「自學路徑入口」六格；點任何一格跳對應 learn。
2. `/dse/econ/learn`：單元 1 展開 → 應見 `econ-u01-mischart` 一課（共 6 課）；做 10 題 gate，答啱 7/10 解鎖單元 5。
3. `/dse/math/learn`：單元 2 展開 → `math-u02-worked`；頁底「片後 5 題（示範）」兩組各 5 題。
4. `/dse/bafs/learn`：單元 2／5／7／8 各有一課 weak；頁底「答題格式卡」8 張。
5. `/dse/ict/learn`：單元 7／8／10 各多兩課；頁底「Explain／compare 句式卡」8 條。
6. 進度：做題後 `localStorage` 只寫 `dsehack-{econ,math,bafs,ict}-progress-v1`。

### 4.5 紅線自查
```bash
grep -rn "learn-play:progress\|evolveStage" src/          # 只餘 chinese-path 註解（無寫入）
grep -rniE "adsense|doubleclick|googlesyndication|adsbygoogle" src/ public/   # 無結果
git diff main -- src/lib/dse/subjects.ts                   # 空（公民維持 open:false）
```
- Math 必修紅線：新 40 題只出現 M1／M2 兩次，兩次都係 `math-u10-d01`／`math-u10-d04` 的**反例／紅線題**（正確答案分別係「只考寫作卷，延伸部分唔屬本路徑」同「M1／M2 技術唔算必修核心」），冇引入任何 M1／M2 題型。
- BAFS 法定數字：`bafs-fmt-08` 同 `bafs-biz-weak-02` 明寫「精確 % 以最新官方文件為準」，全檔無自創 MPF % 或公司條例細則數字。
- 題目全為自編：每條新題帶 `syllabus_ref`（…original drill, not an HKEAA paper…），頁尾 `LEGAL_DISCLAIMER` 照舊。

---

## 5. 已知缺口／follow-up

| 項 | 狀態 |
|---|---|
| Math 片後 5 題其餘 8 個 unit | **TBD／Should**（brief 本身列 TBD；本批只做 U2／U7 示範） |
| Math M2-lite 主內容 | 仍 freeze（未碰） |
| EN paper 餘量 | 非本閘（未碰） |
| 理化生／M2 片後自測（ACCEPT E1／E2） | 非本閘（未碰） |
| learn-play 正式網域 CTA | 等有正式網域再加（暫時唔掛 workers.dev） |
| M1 選修上架 | 明確唔做 |

---

## 6. NEXT

Front 收貨 → Gate（`REPORT-dse-coverage` 或等價）→ Harbor → Primary → 課程開發簽核。
**merge／deploy／DNS 一律等 Primary。**