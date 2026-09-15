import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Brain,
  Calculator,
  CheckCircle2,
  FileText,
  GraduationCap,
  Languages,
  ListChecks,
  LockKeyhole,
  NotebookPen,
  PlayCircle,
  ScrollText,
  ShieldCheck,
  Sigma,
  Sparkles,
  Zap,
} from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { getDrillBank } from "@/lib/dse/drills";
import { ECON_UNITS } from "@/lib/dse/econ-path";
import { ENGLISH_UNITS } from "@/lib/dse/english-path";
import { getAllQuizSlugs, getQuiz } from "@/lib/dse/quizzes";
import { CHINESE_PRESCRIBED_TEXTS } from "@/lib/dse/texts";
import { VIDEO_SUBJECTS, getVideoLibrary } from "@/lib/dse/videos";
import { PROGRAMMES } from "@/lib/jupas/programmes";
import { createPageMetadata } from "@/lib/page-metadata";
import { buildBreadcrumbJsonLd, buildCourseJsonLd } from "@/lib/seo";
import { SITE_KEYWORDS, SITE_NAME, SITE_URL } from "@/lib/site";

/* ------------------------------------------------------------------ *
 * Counts — 全部數字都係由內容資料即時讀出嚟，唔會同實際頁面脫節。
 * ------------------------------------------------------------------ */

const TEXT_COUNT = CHINESE_PRESCRIBED_TEXTS.length;

const CHINESE_CARD_COUNT = getAllQuizSlugs().reduce(
  (n, slug) => n + (getQuiz(slug)?.meta.total ?? 0),
  0,
);

const ENGLISH_UNIT_COUNT = ENGLISH_UNITS.length;
const ENGLISH_LESSON_COUNT = ENGLISH_UNITS.reduce(
  (n, u) => n + u.lessonIds.length,
  0,
);

const ECON_UNIT_COUNT = ECON_UNITS.length;
const ECON_LESSON_COUNT = ECON_UNITS.reduce((n, u) => n + u.lessonIds.length, 0);

const ENGLISH_DRILL_COUNT = getDrillBank("english")?.meta.total ?? 0;
const ECON_DRILL_COUNT = getDrillBank("econ")?.meta.total ?? 0;

const VIDEO_COUNT = (subject: string) =>
  getVideoLibrary(subject)?.videos.length ?? 0;

const TOTAL_VIDEO_COUNT = VIDEO_SUBJECTS.reduce(
  (n, subject) => n + VIDEO_COUNT(subject),
  0,
);

const PROGRAMME_COUNT = PROGRAMMES.length;

const TITLE = `DSE 自修室｜中文範文閃卡、English 自學路徑、ECON 課程、8 科溫習片、JUPAS 揀科數據 | ${SITE_NAME}`;

export const metadata = createPageMetadata({
  title: TITLE,
  description: `${SITE_NAME} DSE 自修室：中文 ${TEXT_COUNT} 篇指定範文 ${CHINESE_CARD_COUNT} 題閃卡同 AI 診斷室、English ${ENGLISH_LESSON_COUNT} 課自學路徑、ECON ${ECON_LESSON_COUNT} 課 Learn Mode、${VIDEO_SUBJECTS.length} 科 ${TOTAL_VIDEO_COUNT} 條溫習片，仲有 ${PROGRAMME_COUNT} 個聯招課程嘅真實收生分數同畢業薪酬。全部免費、免登入，進度只存你部機。`,
  path: "/",
  keywords: [
    "DSE 自修室",
    "DSE 溫習",
    "DSE 中文",
    "DSE 英文",
    "DSE English",
    "DSE 經濟",
    "DSE Economics",
    "DSE 溫習片",
    "指定範文閃卡",
    "英文自學路徑",
    "ECON Learn Mode",
    "JUPAS 揀科",
    "免費 DSE 練習",
    SITE_NAME,
    ...SITE_KEYWORDS,
  ],
});

/* ------------------------------------------------------------------ *
 * Hero 數字總覽 — 一句過講清楚個網站有幾多嘢
 * ------------------------------------------------------------------ */

const HERO_STATS = [
  {
    value: `${CHINESE_CARD_COUNT} 題`,
    label: `中文 ${TEXT_COUNT} 篇指定範文閃卡`,
  },
  {
    value: `${ENGLISH_LESSON_COUNT} 課`,
    label: `English 自學路徑（${ENGLISH_UNIT_COUNT} 單元）`,
  },
  {
    value: `${ECON_LESSON_COUNT} 課`,
    label: `ECON Learn Mode（${ECON_UNIT_COUNT} 單元）`,
  },
  {
    value: `${TOTAL_VIDEO_COUNT} 條`,
    label: `${VIDEO_SUBJECTS.length} 科溫習片庫`,
  },
  {
    value: `${PROGRAMME_COUNT} 個`,
    label: "JUPAS 課程收生數據",
  },
] as const;

/* ------------------------------------------------------------------ *
 * 「揀你嘅科目」快速入口
 * ------------------------------------------------------------------ */

const QUICK_ENTRIES = [
  {
    href: "/dse/chinese",
    name: "中文",
    nameEn: "Chinese Language",
    icon: BookOpen,
    chip: "bg-blue-700/10 text-blue-700 ring-blue-700/20",
    bar: "bg-blue-700",
    hover: "hover:border-blue-700/40",
    desc: `${TEXT_COUNT} 篇指定範文 ${CHINESE_CARD_COUNT} 題閃卡、AI 診斷室、錯題本。`,
  },
  {
    href: "/dse/english/learn",
    name: "English",
    nameEn: "English Language",
    icon: Languages,
    chip: "bg-emerald-600/10 text-emerald-700 ring-emerald-600/20",
    bar: "bg-emerald-600",
    hover: "hover:border-emerald-600/40",
    desc: `${ENGLISH_LESSON_COUNT} 課自學路徑 ${ENGLISH_UNIT_COUNT} 單元，過關制一課一課解鎖。`,
  },
  {
    href: "/dse/econ/learn",
    name: "ECON 經濟",
    nameEn: "Economics",
    icon: Sigma,
    chip: "bg-amber-600/10 text-amber-700 ring-amber-600/20",
    bar: "bg-amber-600",
    hover: "hover:border-amber-600/40",
    desc: `${ECON_LESSON_COUNT} 課 Learn Mode，配 ${ECON_DRILL_COUNT} 題練習當關卡。`,
  },
  {
    href: "/dse/videos",
    name: "其他科",
    nameEn: "數學 · M2 · 物理 · 化學 · 生物",
    icon: PlayCircle,
    chip: "bg-rose-600/10 text-rose-700 ring-rose-600/20",
    bar: "bg-rose-600",
    hover: "hover:border-rose-600/40",
    desc: `未有自學路徑嘅科，都可以睇 ${VIDEO_SUBJECTS.length} 科 ${TOTAL_VIDEO_COUNT} 條策展溫習片。`,
  },
] as const;

/* ------------------------------------------------------------------ *
 * Landing page — 全站橱窗：hero → 科目入口 → 功能卡 → trust
 * ------------------------------------------------------------------ */

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-20 pt-8 sm:px-6 sm:pt-12">
      <JsonLd
        data={buildBreadcrumbJsonLd([{ name: "首頁", path: "/" }])}
      />
      <JsonLd
        data={buildCourseJsonLd({
          name: "DSE 自修室：中文、English、ECON 自學路徑與 JUPAS 揀科數據",
          description: `免費 DSE 自修室：中文 ${TEXT_COUNT} 篇指定範文 ${CHINESE_CARD_COUNT} 題閃卡、English ${ENGLISH_LESSON_COUNT} 課自學路徑、ECON ${ECON_LESSON_COUNT} 課 Learn Mode、${VIDEO_SUBJECTS.length} 科 ${TOTAL_VIDEO_COUNT} 條溫習片、${PROGRAMME_COUNT} 個聯招課程收生數據。`,
          url: `${SITE_URL}/dse`,
          providerName: SITE_NAME,
        })}
      />

      {/* ---------------------------------------------------------------- *
       * 1. HERO — 跨科 value prop + 數字總覽 + 兩條 CTA
       * ---------------------------------------------------------------- */}
      <div className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-3 rounded-[2.5rem] bg-[radial-gradient(ellipse_at_20%_0%,rgba(29,78,216,0.16),transparent_50%),radial-gradient(ellipse_at_85%_15%,rgba(30,64,175,0.1),transparent_45%)] blur-3xl"
        />

        <section className="relative isolate overflow-hidden rounded-3xl border border-slate-200 bg-white px-6 py-12 shadow-2xl shadow-slate-900/5 sm:rounded-[2rem] sm:px-10 sm:py-16">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(29,78,216,0.09),transparent_42%),radial-gradient(circle_at_88%_8%,rgba(30,64,175,0.07),transparent_38%)]"
          />

          <div className="relative z-10">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-700/20 bg-blue-700/10 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-blue-800">
              <Sparkles className="size-3.5" />
              免費 · 免登入 · 進度只存你部機
            </span>

            <h1 className="mt-6 max-w-3xl font-[family-name:var(--font-display)] text-3xl font-extrabold leading-[1.25] tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
              DSE 自修室
              <br />
              <span className="bg-gradient-to-r from-blue-700 via-blue-700 to-blue-900 bg-clip-text text-transparent">
                中文、English、ECON 自學路徑，加 8 科溫習片同 JUPAS 揀科數據。
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
              中四開始跟自學路徑一課一課過關，中六用範文閃卡同診斷室補底，考完再用真實收生分數排你嘅
              Band A。同一頁睇齊你溫書同揀科需要嘅嘢——唔使先交補習學費。
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/dse"
                className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-700 to-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-900/20 transition-all duration-300 hover:scale-[1.02] hover:brightness-110 hover:shadow-xl hover:shadow-blue-900/25"
              >
                入 DSE 學習專區
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/dse/jupas"
                className="group inline-flex items-center gap-2 rounded-2xl border border-violet-300 bg-violet-50 px-6 py-3.5 text-sm font-semibold text-violet-900 transition-all duration-300 hover:border-violet-400 hover:bg-violet-100"
              >
                <GraduationCap className="size-4 text-violet-700" />
                JUPAS 揀科指南
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </div>

            {/* 數字總覽 */}
            <dl className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {HERO_STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3"
                >
                  <dt className="font-[family-name:var(--font-display)] text-xl font-extrabold text-blue-800">
                    {stat.value}
                  </dt>
                  <dd className="mt-1 text-xs leading-relaxed font-medium text-slate-600">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      </div>

      {/* ---------------------------------------------------------------- *
       * 2. 揀你嘅科目 — quick entry
       * ---------------------------------------------------------------- */}
      <section className="mt-10 space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="font-[family-name:var(--font-display)] text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            揀你嘅科目
          </h2>
          <Link
            href="/dse"
            className="text-xs font-semibold text-blue-800 underline-offset-2 hover:underline"
          >
            睇全部科目同資源 →
          </Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {QUICK_ENTRIES.map((entry) => {
            const Icon = entry.icon;
            return (
              <Link
                key={entry.href}
                href={entry.href}
                className={`group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-md transition-all duration-300 hover:bg-slate-50 hover:shadow-lg ${entry.hover}`}
              >
                <span
                  aria-hidden
                  className={`absolute inset-y-4 left-0 w-1 rounded-full ${entry.bar}`}
                />
                <span
                  className={`ml-1.5 flex size-10 items-center justify-center rounded-xl ring-1 ${entry.chip}`}
                >
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-4 font-[family-name:var(--font-display)] text-base font-bold text-slate-900">
                  {entry.name}
                </h3>
                <p className="mt-0.5 text-xs text-slate-500">{entry.nameEn}</p>
                <p className="mt-2 flex-1 text-xs leading-relaxed text-slate-600">
                  {entry.desc}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-800">
                  入去溫書
                  <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ---------------------------------------------------------------- *
       * 3. Feature grid — 6 張功能卡（JUPAS 同片庫加強）
       * ---------------------------------------------------------------- */}
      <section className="mt-12 space-y-4">
        <h2 className="font-[family-name:var(--font-display)] text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
          自修室有咩玩
        </h2>

        <div className="grid gap-4 md:grid-cols-3">
          {/* 中文：閃卡 + 診斷室 */}
          <Link
            href="/dse/chinese"
            className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-md transition-all duration-300 hover:border-slate-300 hover:bg-slate-50 hover:shadow-lg"
          >
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-xl bg-blue-700/10 ring-1 ring-blue-700/20">
                <BookOpen className="size-5 text-blue-800" />
              </span>
              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold tracking-wide text-slate-600">
                中文
              </span>
            </div>
            <h3 className="mt-4 font-[family-name:var(--font-display)] text-lg font-bold text-slate-900">
              範文閃卡 ＋ AI 診斷室
            </h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
              {TEXT_COUNT} 篇指定範文共 {CHINESE_CARD_COUNT}{" "}
              題，字詞、通假、句譯、章旨分三階遞進。想知自己弱喺邊，就用診斷室：十幾題動態出題，直接估你嘅等級，錯題自動入錯題本。
            </p>
            <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-800">
              開始刷範文
              <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </Link>

          {/* English 自學路徑 */}
          <Link
            href="/dse/english/learn"
            className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-md transition-all duration-300 hover:border-slate-300 hover:bg-slate-50 hover:shadow-lg"
          >
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-xl bg-emerald-600/10 ring-1 ring-emerald-600/20">
                <Languages className="size-5 text-emerald-700" />
              </span>
              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold tracking-wide text-slate-600">
                English
              </span>
            </div>
            <h3 className="mt-4 font-[family-name:var(--font-display)] text-lg font-bold text-slate-900">
              English 自學路徑
            </h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
              {ENGLISH_UNIT_COUNT} 個單元 {ENGLISH_LESSON_COUNT} 課，由卷一閱讀一路做到卷四說話同語法詞彙。每課講「考生成日錯喺邊」，做完
              ≥7/10 嘅練習先解鎖下一課，另備 {ENGLISH_DRILL_COUNT} 題練習。
            </p>
            <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700">
              由第一課開始
              <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </Link>

          {/* ECON Learn Mode */}
          <Link
            href="/dse/econ/learn"
            className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-md transition-all duration-300 hover:border-slate-300 hover:bg-slate-50 hover:shadow-lg"
          >
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-xl bg-amber-600/10 ring-1 ring-amber-600/20">
                <Sigma className="size-5 text-amber-700" />
              </span>
              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold tracking-wide text-slate-600">
                ECON
              </span>
            </div>
            <h3 className="mt-4 font-[family-name:var(--font-display)] text-lg font-bold text-slate-900">
              ECON Learn Mode
            </h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
              {ECON_UNIT_COUNT} 個單元 {ECON_LESSON_COUNT}{" "}
              課，由供求、彈性做到貨幣政策同國際貿易。每課有概念、例子逐步拆解、常見陷阱同術語表，配{" "}
              {ECON_DRILL_COUNT} 題練習驗收。
            </p>
            <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-amber-700">
              由供求開始
              <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </Link>

          {/* 溫習片庫 — 加強 */}
          <Link
            href="/dse/videos"
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-rose-300 bg-gradient-to-br from-rose-50 via-white to-slate-50 p-6 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:border-rose-400 hover:shadow-rose-500/10"
          >
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-xl bg-rose-600/10 ring-1 ring-rose-600/25">
                <PlayCircle className="size-5 text-rose-700" />
              </span>
              <span className="rounded-md bg-rose-600/10 px-2 py-0.5 text-[10px] font-bold tracking-wide text-rose-800">
                全新登場
              </span>
            </div>
            <h3 className="mt-4 font-[family-name:var(--font-display)] text-lg font-bold text-slate-900">
              溫習片庫
            </h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
              {VIDEO_SUBJECTS.length} 科共 {TOTAL_VIDEO_COUNT}{" "}
              條精選教學片（中文、英文、數學、M2、經濟、物理、化學、生物）。每條都幫你寫好摘要、重點筆記同「邊個階段睇」，唔係片單，係策展分析。
            </p>
            <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-rose-700">
              睇片溫書不求人
              <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </Link>

          {/* JUPAS — 加強 */}
          <Link
            href="/dse/jupas"
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-violet-300 bg-gradient-to-br from-violet-50 via-white to-slate-50 p-6 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:border-violet-400 hover:shadow-violet-500/10"
          >
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-xl bg-violet-600/10 ring-1 ring-violet-600/25">
                <Calculator className="size-5 text-violet-700" />
              </span>
              <span className="rounded-md bg-violet-600/10 px-2 py-0.5 text-[10px] font-bold tracking-wide text-violet-800">
                全新登場
              </span>
            </div>
            <h3 className="mt-4 font-[family-name:var(--font-display)] text-lg font-bold text-slate-900">
              JUPAS 揀科指南
            </h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
              {PROGRAMME_COUNT}{" "}
              個聯招課程嘅真實收生中位數同畢業薪酬，邊科係「分數溢價」、邊科係水泡寶藏，逐科計埋分數效益；再入比較工具排你嘅 Band A，即刻睇穩入／有機／陪跑。
            </p>
            <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-violet-700">
              計吓你嘅入學機會
              <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </Link>

          {/* 指南內容 */}
          <Link
            href="/guides/dse-buxi"
            className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-md transition-all duration-300 hover:border-slate-300 hover:bg-slate-50 hover:shadow-lg"
          >
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-xl bg-slate-900/5 ring-1 ring-slate-900/10">
                <FileText className="size-5 text-slate-700" />
              </span>
              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold tracking-wide text-slate-600">
                指南
              </span>
            </div>
            <h3 className="mt-4 font-[family-name:var(--font-display)] text-lg font-bold text-slate-900">
              DSE 補習選擇指南
            </h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
              補習社價錢、大班細班點揀、邊種學生真係需要補——用客觀角度拆清楚，等你落決定之前知道自己買緊咩。自修唔代表要一個人硬撐。
            </p>
            <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-800">
              睇指南
              <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </Link>
        </div>
      </section>

      {/* ---------------------------------------------------------------- *
       * 4. Trust strip
       * ---------------------------------------------------------------- */}
      <section className="mt-10 rounded-2xl border border-slate-200 bg-slate-50/70 p-6 shadow-sm sm:p-7">
        <div className="flex items-center gap-2 text-blue-800">
          <ShieldCheck className="size-4" />
          <p className="text-xs font-bold tracking-wide">用得安心</p>
        </div>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <li className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-blue-800" />
            <span>
              <span className="block text-sm font-semibold text-slate-900">
                完全免費
              </span>
              <span className="mt-0.5 block text-xs leading-relaxed text-slate-600">
                全部工具同題庫唔收錢，亦冇隱藏收費步驟。
              </span>
            </span>
          </li>
          <li className="flex items-start gap-3">
            <LockKeyhole className="mt-0.5 size-5 shrink-0 text-blue-800" />
            <span>
              <span className="block text-sm font-semibold text-slate-900">
                免登入
              </span>
              <span className="mt-0.5 block text-xs leading-relaxed text-slate-600">
                唔使開帳號、唔使填個人資料，開頁即用。
              </span>
            </span>
          </li>
          <li className="flex items-start gap-3">
            <NotebookPen className="mt-0.5 size-5 shrink-0 text-blue-800" />
            <span>
              <span className="block text-sm font-semibold text-slate-900">
                進度只存你部機
              </span>
              <span className="mt-0.5 block text-xs leading-relaxed text-slate-600">
                做題記錄同錯題本留喺瀏覽器本機，唔會上傳伺服器。
              </span>
            </span>
          </li>
          <li className="flex items-start gap-3">
            <ScrollText className="mt-0.5 size-5 shrink-0 text-blue-800" />
            <span>
              <span className="block text-sm font-semibold text-slate-900">
                內容原創整理
              </span>
              <span className="mt-0.5 block text-xs leading-relaxed text-slate-600">
                題目同講解由我哋自己編寫，唔係補習社筆記嘅掃描抄本。
              </span>
            </span>
          </li>
        </ul>
      </section>

      {/* 最後一推 */}
      <section className="mt-8 flex flex-col gap-4 rounded-2xl border border-blue-700/20 bg-gradient-to-r from-blue-50 via-white to-slate-50 p-6 shadow-lg sm:flex-row sm:items-center sm:justify-between sm:p-7">
        <div className="flex items-start gap-3">
          <Zap className="mt-0.5 size-5 shrink-0 text-blue-800" />
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-lg font-bold text-slate-900">
              唔知由邊度開始？
            </h2>
            <p className="mt-1 max-w-xl text-sm leading-relaxed text-slate-600">
              先去 DSE 學習專區，一頁睇齊每一科有咩資源；或者直接入中文診斷室，十幾題就知自己弱喺邊。
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/dse"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-800 px-5 py-3 text-sm font-bold text-white shadow-md shadow-blue-900/20 transition-all duration-300 hover:bg-blue-700"
          >
            <ListChecks className="size-4" />
            DSE 學習專區
          </Link>
          <Link
            href="/dse/chinese/cat"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition-all duration-300 hover:border-blue-700/40 hover:bg-slate-50"
          >
            <Brain className="size-4 text-blue-800" />
            AI 診斷室
          </Link>
        </div>
      </section>
    </div>
  );
}
