import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Atom,
  BookMarked,
  BookOpen,
  Calculator,
  Dna,
  FlaskConical,
  Globe2,
  GraduationCap,
  Languages,
  Layers,
  PlayCircle,
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
import { DSE_SUBJECTS } from "@/lib/dse/subjects";
import { VIDEO_SUBJECTS, getVideoLibrary } from "@/lib/dse/videos";
import { PROGRAMMES } from "@/lib/jupas/programmes";
import { createPageMetadata } from "@/lib/page-metadata";
import { buildBreadcrumbJsonLd } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site";

/* ------------------------------------------------------------------ *
 * Counts — every number on this page is read from the content data,
 * so it can never drift from what the linked page actually serves.
 * ------------------------------------------------------------------ */

const TEXT_COUNT = CHINESE_PRESCRIBED_TEXTS.length;

const CHINESE_CARD_COUNT = getAllQuizSlugs().reduce(
  (n, slug) => n + (getQuiz(slug)?.meta.total ?? 0),
  0,
);

const ENGLISH_LESSON_COUNT = ENGLISH_UNITS.reduce(
  (n, u) => n + u.lessonIds.length,
  0,
);

const ECON_LESSON_COUNT = ECON_UNITS.reduce((n, u) => n + u.lessonIds.length, 0);

const ENGLISH_DRILL_COUNT = getDrillBank("english")?.meta.total ?? 0;
const ECON_DRILL_COUNT = getDrillBank("econ")?.meta.total ?? 0;

const videoCount = (subject: string) =>
  getVideoLibrary(subject)?.videos.length ?? 0;

const TOTAL_VIDEO_COUNT = VIDEO_SUBJECTS.reduce(
  (n, s) => n + videoCount(s),
  0,
);

const TITLE = `DSE 學習與備考專區｜中文範文閃卡、English 自學路徑、ECON 課程、JUPAS 揀科 | ${SITE_NAME}`;

export const metadata = createPageMetadata({
  title: TITLE,
  description: `${SITE_NAME} DSE 備考專區：中文 ${TEXT_COUNT} 篇指定範文 ${CHINESE_CARD_COUNT} 題閃卡、English ${ENGLISH_LESSON_COUNT} 課自學路徑、ECON 課程、${VIDEO_SUBJECTS.length} 科 ${TOTAL_VIDEO_COUNT} 條溫習片同 ${PROGRAMMES.length} 個聯招課程收生數據。全部免費、免登入。`,
  path: "/dse",
  keywords: [
    "DSE",
    "DSE 備考",
    "DSE 中文科",
    "DSE English",
    "DSE Economics",
    "DSE 經濟",
    "指定範文閃卡",
    "英文自學",
    "JUPAS 揀科",
    "DSE 溫習片",
    SITE_NAME,
  ],
});

/* ------------------------------------------------------------------ *
 * Design tokens
 * ------------------------------------------------------------------ */

type SubjectMeta = {
  icon: typeof Languages;
  /** icon chip: text colour + tint + ring */
  accent: string;
  /** left accent bar on the card */
  bar: string;
  /** small count chip inside resource rows */
  chip: string;
  /** resource-row hover border */
  rowHover: string;
};

const SUBJECT_META: Record<string, SubjectMeta> = {
  chinese: {
    icon: BookOpen,
    accent: "text-sky-400 bg-sky-400/10 ring-sky-400/20",
    bar: "bg-sky-500",
    chip: "bg-sky-400/10 text-sky-300",
    rowHover: "hover:border-sky-400/50",
  },
  english: {
    icon: Languages,
    accent: "text-emerald-400 bg-emerald-400/10 ring-emerald-400/20",
    bar: "bg-emerald-500",
    chip: "bg-emerald-400/10 text-emerald-300",
    rowHover: "hover:border-emerald-400/50",
  },
  econ: {
    icon: Sigma,
    accent: "text-amber-400 bg-amber-400/10 ring-amber-400/20",
    bar: "bg-amber-500",
    chip: "bg-amber-400/10 text-amber-300",
    rowHover: "hover:border-amber-400/50",
  },
  math: {
    icon: Calculator,
    accent: "text-slate-700 bg-slate-100 ring-slate-200",
    bar: "bg-zinc-500",
    chip: "bg-slate-100 text-slate-700",
    rowHover: "hover:border-slate-300",
  },
  m2: {
    icon: Layers,
    accent: "text-indigo-400 bg-indigo-400/10 ring-indigo-400/20",
    bar: "bg-indigo-500",
    chip: "bg-indigo-400/10 text-indigo-300",
    rowHover: "hover:border-indigo-400/50",
  },
  physics: {
    icon: Atom,
    accent: "text-cyan-400 bg-cyan-400/10 ring-cyan-400/20",
    bar: "bg-cyan-500",
    chip: "bg-cyan-400/10 text-cyan-300",
    rowHover: "hover:border-cyan-400/50",
  },
  chemistry: {
    icon: FlaskConical,
    accent: "text-violet-400 bg-violet-400/10 ring-violet-400/20",
    bar: "bg-violet-500",
    chip: "bg-violet-400/10 text-violet-300",
    rowHover: "hover:border-violet-400/50",
  },
  biology: {
    icon: Dna,
    accent: "text-lime-400 bg-lime-400/10 ring-lime-400/20",
    bar: "bg-lime-500",
    chip: "bg-lime-400/10 text-lime-300",
    rowHover: "hover:border-lime-400/50",
  },
  others: {
    icon: Globe2,
    accent: "text-rose-400 bg-rose-400/10 ring-rose-400/20",
    bar: "bg-rose-400",
    chip: "bg-slate-100 text-slate-600",
    rowHover: "hover:border-slate-300",
  },
};

type Resource = {
  href: string;
  label: string;
  detail: string;
  count: string;
};

/**
 * Every resource that exists for a subject, in the order a student should
 * meet them (做題／上課 → 診斷 → 補漏 → 睇片).
 */
const SUBJECT_RESOURCES: Record<string, Resource[]> = {
  chinese: [
    {
      href: "/dse/chinese",
      label: `${TEXT_COUNT} 篇指定範文閃卡`,
      detail: "逐篇刷題：字詞、通假、句譯、章旨，基礎／中等／高階三階遞進。",
      count: `${CHINESE_CARD_COUNT} 題`,
    },
    {
      href: "/dse/chinese/cat",
      label: "範文 AI 診斷室",
      detail: "動態適應出題，約十幾題就估到你嘅等級，附弱點雷達報告。",
      count: "AI 診斷",
    },
    {
      href: "/dse/chinese/error-notebook",
      label: "錯題本",
      detail: "診斷室嘅錯題自動入簿，考前只重測弱項，唔使翻舊卷。",
      count: "重測",
    },
    {
      href: "/dse/videos/chinese",
      label: "中文科溫習片",
      detail: "範文講解同各卷答題策略，每條附摘要、重點筆記同溫習階段建議。",
      count: `${videoCount("chinese")} 條`,
    },
  ],
  english: [
    {
      href: "/dse/english/learn",
      label: "English 自學路徑",
      detail: `卷一閱讀、卷二寫作、卷三聆聽綜合、卷四說話＋語法詞彙，共 ${ENGLISH_UNITS.length} 單元，過關制一課一課解鎖。`,
      count: `${ENGLISH_LESSON_COUNT} 課`,
    },
    {
      href: "/dse/english",
      label: "英文 MCQ 練習",
      detail: "閱讀題型、推論與語氣、寫作格式與論證、聆聽綜合、語法同詞彙，每題附解說。",
      count: `${ENGLISH_DRILL_COUNT} 題`,
    },
    {
      href: "/dse/videos/english",
      label: "英文科溫習片",
      detail: "Paper 1／2／3 策略同港式英文失分位，每條附編輯分析。",
      count: `${videoCount("english")} 條`,
    },
  ],
  econ: [
    {
      href: "/dse/econ/learn",
      label: "ECON Learn Mode 課程",
      detail: `由供求、彈性一路到貨幣政策同國際貿易，共 ${ECON_UNITS.length} 單元，每單元做練習達標先解鎖下一課。`,
      count: `${ECON_LESSON_COUNT} 課`,
    },
    {
      href: "/dse/econ",
      label: "經濟 MCQ 練習",
      detail: "供求、彈性、市場干預、成本、市場結構、GDP、通脹、貨幣、財策與貿策，逐個課題練。",
      count: `${ECON_DRILL_COUNT} 題`,
    },
    {
      href: "/dse/videos/econ",
      label: "經濟科溫習片",
      detail: "供求圖、彈性計算、AD-AS 模型、貨幣政策傳導，睇完即刻做題。",
      count: `${videoCount("econ")} 條`,
    },
  ],
  math: [
    {
      href: "/dse/videos/math",
      label: "數學科溫習片",
      detail: "必修數學課題講解，每條附摘要、重點筆記同「邊個階段睇」。",
      count: `${videoCount("math")} 條`,
    },
  ],
  m2: [
    {
      href: "/dse/videos/m2",
      label: "M2 溫習片",
      detail: "微積分同代數課題講解，每條附重點筆記。",
      count: `${videoCount("m2")} 條`,
    },
  ],
  physics: [
    {
      href: "/dse/videos/physics",
      label: "物理科溫習片",
      detail: "物理課題講解，每條附重點筆記同溫習階段建議。",
      count: `${videoCount("physics")} 條`,
    },
  ],
  chemistry: [
    {
      href: "/dse/videos/chemistry",
      label: "化學科溫習片",
      detail: "化學課題講解，每條附重點筆記同溫習階段建議。",
      count: `${videoCount("chemistry")} 條`,
    },
  ],
  biology: [
    {
      href: "/dse/videos/biology",
      label: "生物科溫習片",
      detail: "生物課題講解，每條附重點筆記同溫習階段建議。",
      count: `${videoCount("biology")} 條`,
    },
  ],
};

const STATS = [
  {
    label: "中文範文閃卡",
    value: `${CHINESE_CARD_COUNT} 題`,
    note: `${TEXT_COUNT} 篇指定文言經典`,
    tone: "text-sky-400",
  },
  {
    label: "English 自學路徑",
    value: `${ENGLISH_LESSON_COUNT} 課`,
    note: `${ENGLISH_UNITS.length} 單元＋${ENGLISH_DRILL_COUNT} 題練習`,
    tone: "text-emerald-400",
  },
  {
    label: "ECON 課程",
    value: `${ECON_LESSON_COUNT} 課`,
    note: `${ECON_UNITS.length} 單元＋${ECON_DRILL_COUNT} 題練習`,
    tone: "text-amber-400",
  },
  {
    label: "精選溫習片",
    value: `${TOTAL_VIDEO_COUNT} 條`,
    note: `${VIDEO_SUBJECTS.length} 科策展片庫`,
    tone: "text-rose-400",
  },
] as const;

export default function DseHomePage() {
  return (
    <div className="space-y-10">
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "首頁", path: "/" },
          { name: "DSE 備考", path: "/dse" },
        ])}
      />

      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white/80 px-6 py-14 text-center shadow-lg backdrop-blur-md sm:px-12 sm:py-16">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(56,189,248,0.16),transparent_55%),radial-gradient(ellipse_at_80%_80%,rgba(99,102,241,0.08),transparent_45%)]"
        />
        <div className="relative">
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            DSE 學習與備考專區
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
            唔止中文科。中文 {TEXT_COUNT} 篇指定範文閃卡、English{" "}
            {ENGLISH_LESSON_COUNT} 課自學路徑、ECON 課程、{VIDEO_SUBJECTS.length}{" "}
            科 {TOTAL_VIDEO_COUNT} 條溫習片，再加 {PROGRAMMES.length}{" "}
            個聯招課程嘅真實收生分數——全部免費、免登入，進度只存你部機。
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/dse/chinese"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 px-6 py-3 text-sm font-bold text-zinc-950 shadow-lg shadow-sky-500/25 transition-all duration-300 hover:scale-[1.02] hover:brightness-110"
            >
              進入中文科
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/dse/english/learn"
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/40 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition-all duration-300 hover:border-emerald-400/70 hover:bg-white"
            >
              <Languages className="size-4 text-emerald-400" />
              English 自學路徑
            </Link>
            <Link
              href="/dse/econ/learn"
              className="inline-flex items-center gap-2 rounded-xl border border-amber-400/40 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition-all duration-300 hover:border-amber-400/70 hover:bg-white"
            >
              <Sigma className="size-4 text-amber-400" />
              ECON 課程
            </Link>
          </div>
        </div>
      </section>

      {/* NEW features showcase */}
      <section className="space-y-3">
        <div className="flex items-end justify-between gap-3">
          <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-slate-900 sm:text-2xl">
            <span className="mr-2 inline-block rounded-md bg-gradient-to-r from-violet-500 to-fuchsia-500 px-2 py-0.5 align-middle text-xs font-bold tracking-wide text-white">
              NEW
            </span>
            全新登場
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Link
            href="/dse/jupas"
            className="group relative overflow-hidden rounded-xl border border-violet-400/30 bg-gradient-to-br from-violet-50 via-white to-slate-50 p-6 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:border-violet-400/60 hover:shadow-violet-500/10"
          >
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-xl bg-violet-400/10 ring-1 ring-violet-400/30">
                <Calculator className="size-5 text-violet-400" />
              </span>
              <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-slate-900">
                JUPAS 揀科指南
              </h3>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              {PROGRAMMES.length} 個聯招課程真實收分中位數＋畢業生薪酬，邊科係「分數溢價」、邊科係水泡寶藏，逐科計埋「分數效益」畀你睇。
            </p>
            <p className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-violet-400">
              計吓你嘅入學機會
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </p>
          </Link>
          <Link
            href="/dse/videos"
            className="group relative overflow-hidden rounded-xl border border-rose-400/30 bg-gradient-to-br from-rose-50 via-white to-slate-50 p-6 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:border-rose-400/60 hover:shadow-rose-500/10"
          >
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-xl bg-rose-400/10 ring-1 ring-rose-400/30">
                <PlayCircle className="size-5 text-rose-400" />
              </span>
              <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-slate-900">
                溫習片庫
              </h3>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              {VIDEO_SUBJECTS.length} 科共 {TOTAL_VIDEO_COUNT}{" "}
              條精選教學片，每條幫你寫好摘要、重點筆記同「邊個階段睇」——唔係片單，係策展分析，慳你盲搵片嘅時間。
            </p>
            <p className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-rose-400">
              睇片溫書不求人
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </p>
          </Link>
          <Link
            href="/dse/english/learn"
            className="group relative overflow-hidden rounded-xl border border-emerald-400/30 bg-gradient-to-br from-emerald-50 via-white to-slate-50 p-6 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:border-emerald-400/60 hover:shadow-emerald-500/10"
          >
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-xl bg-emerald-400/10 ring-1 ring-emerald-400/30">
                <Languages className="size-5 text-emerald-400" />
              </span>
              <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-slate-900">
                English 自學路徑
              </h3>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              {ENGLISH_UNITS.length} 個單元 {ENGLISH_LESSON_COUNT}{" "}
              課由零開始：Reading／Writing／Listening／Speaking／Grammar，每課拆解「考生成日錯喺邊」，過關制練習即刻驗收。
            </p>
            <p className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-400">
              由第一課開始
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </p>
          </Link>
        </div>
      </section>

      {/* Stats — all figures read from the content data */}
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-lg"
          >
            <p className="text-[10px] font-semibold tracking-[0.2em] text-slate-500 uppercase">
              {s.label}
            </p>
            <p
              className={`mt-2 font-[family-name:var(--font-display)] text-2xl font-extrabold ${s.tone}`}
            >
              {s.value}
            </p>
            <p className="mt-1 text-xs text-slate-500">{s.note}</p>
          </div>
        ))}
      </section>

      {/* Subjects — every resource of every subject, on the subject's own row */}
      <section id="subjects" className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-slate-900 sm:text-2xl">
            主修與選修科目
          </h2>
          <span className="text-xs font-medium text-slate-500">
            全部資源免費、免登入 · 進度只存本機
          </span>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {DSE_SUBJECTS.map((s) => {
            const meta = SUBJECT_META[s.id] ?? SUBJECT_META.others;
            const Icon = meta.icon;
            const resources = SUBJECT_RESOURCES[s.id] ?? [];
            const isLive = s.open && resources.length > 0;

            return (
              <div
                key={s.id}
                className={`relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-lg transition-all duration-300 hover:border-slate-300 hover:bg-slate-100 ${
                  isLive ? "" : "opacity-70"
                }`}
              >
                <span
                  aria-hidden
                  className={`absolute inset-y-3 left-0 w-1 rounded-full ${meta.bar}`}
                />
                <div className="flex items-start gap-4">
                  <span
                    className={`ml-1 flex size-11 shrink-0 items-center justify-center rounded-xl ring-1 ${meta.accent}`}
                  >
                    <Icon className="size-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-slate-900">{s.name}</h3>
                      {isLive ? (
                        <span className="rounded-md bg-emerald-400/10 px-2 py-0.5 text-[10px] font-bold tracking-wide text-emerald-400">
                          已開放 {resources.length} 項
                        </span>
                      ) : (
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold tracking-wide text-slate-500">
                          即將推出
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500">{s.nameEn}</p>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      {s.desc}
                    </p>
                  </div>
                </div>

                {resources.length > 0 ? (
                  <ul className="mt-4 space-y-2.5">
                    {resources.map((r) => (
                      <li key={r.href}>
                        <Link
                          href={r.href}
                          className={`group flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50/50 px-4 py-3 transition-all duration-300 hover:bg-white ${meta.rowHover}`}
                        >
                          <span className="min-w-0 flex-1">
                            <span className="flex flex-wrap items-center gap-2">
                              <span className="text-sm font-semibold text-slate-900">
                                {r.label}
                              </span>
                              <span
                                className={`rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wide ${meta.chip}`}
                              >
                                {r.count}
                              </span>
                            </span>
                            <span className="mt-1 block text-xs leading-relaxed text-slate-600">
                              {r.detail}
                            </span>
                          </span>
                          <ArrowRight className="mt-1 size-4 shrink-0 text-slate-500 transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 rounded-lg border border-dashed border-slate-200 bg-white px-4 py-3 text-xs text-slate-500">
                    呢一科未有內容，暫時未開放。想我哋優先做邊科，可以經頁尾電郵話我哋知。
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* JUPAS — 升學規劃 */}
      <section className="rounded-xl border border-violet-400/25 bg-gradient-to-r from-violet-50 via-white to-slate-50 p-6 shadow-lg">
        <div className="flex items-center gap-2 text-violet-400">
          <GraduationCap className="size-4" />
          <p className="text-xs font-bold tracking-wide">升學規劃</p>
        </div>
        <h2 className="mt-3 font-[family-name:var(--font-display)] text-xl font-bold text-slate-900">
          考完之後，點揀科？
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
          收生分數同出路係兩條獨立嘅線。用 {PROGRAMMES.length}{" "}
          個聯招課程嘅真實收生數據同公開薪酬，計清你嘅 Band A 排位。
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <Link
            href="/dse/jupas"
            className="group flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50/50 px-4 py-3 transition-all duration-300 hover:border-violet-400/50 hover:bg-white"
          >
            <span>
              <span className="block text-sm font-semibold text-slate-900">
                JUPAS 揀科指南
              </span>
              <span className="mt-1 block text-xs text-slate-600">
                流程時間表、Band A 策略、「分數效益」逐科計
              </span>
            </span>
            <ArrowRight className="size-4 shrink-0 text-slate-500 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <Link
            href="/dse/jupas/compare"
            className="group flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50/50 px-4 py-3 transition-all duration-300 hover:border-violet-400/50 hover:bg-white"
          >
            <span>
              <span className="block text-sm font-semibold text-slate-900">
                課程比較工具
              </span>
              <span className="mt-1 block text-xs text-slate-600">
                 2–3 科並排對比，即刻睇穩入／有機／陪跑
              </span>
            </span>
            <ArrowRight className="size-4 shrink-0 text-slate-500 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* How to use */}
      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg">
          <div className="flex items-center gap-2 text-cyan-400">
            <Activity className="size-4" />
            <p className="text-xs font-bold tracking-wide">診斷先行</p>
          </div>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-xl font-bold text-slate-900">
            唔知弱喺邊，先做診斷
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            範文／閱讀／經濟各有課題練習。想知自己整體水平，就直接入中文科嘅
            AI 診斷室，做完會話你邊個技能位要補，唔使盲做幾百題。
          </p>
          <Link
            href="/dse/chinese/cat"
            className="mt-6 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-800 transition-all duration-300 hover:border-cyan-500/40 hover:text-cyan-400"
          >
            <Zap className="size-3.5" />
            入診斷室
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg">
          <div className="flex items-center gap-2 text-emerald-400">
            <BookMarked className="size-4" />
            <p className="text-xs font-bold tracking-wide">進度閉環</p>
          </div>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-xl font-bold text-slate-900">
            錯咗嘅題，唔會消失
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            練習同診斷嘅錯題自動入錯題本，可以按範文、難度重測。全部記錄只存你部機——零登入、零雲端同步壓力。
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/dse/chinese/error-notebook"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-800 transition-all duration-300 hover:border-emerald-500/40 hover:text-emerald-400"
            >
              <Sparkles className="size-3.5" />
              開錯題本
              <ArrowRight className="size-3.5" />
            </Link>
            <Link
              href="/dse/videos"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-800 transition-all duration-300 hover:border-rose-500/40 hover:text-rose-400"
            >
              <PlayCircle className="size-3.5" />
              睇片庫
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}