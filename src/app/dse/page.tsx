import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Atom,
  BookMarked,
  BookOpen,
  Briefcase,
  Calculator,
  Cpu,
  Dna,
  FlaskConical,
  Globe2,
  GraduationCap,
  Languages,
  Layers,
  PlayCircle,
  Route,
  Sigma,
  Sparkles,
  Zap,
} from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { Eyebrow, SectionHeading, TrustChips } from "@/components/site/trust-ui";
import { getDrillBank } from "@/lib/dse/drills";
import { BAFS_UNITS } from "@/lib/dse/bafs-path";
import { ECON_UNITS } from "@/lib/dse/econ-path";
import { CHINESE_PASS_MARK, CHINESE_SET_SIZE, CHINESE_UNITS } from "@/lib/dse/chinese-path";
import { ENGLISH_UNITS } from "@/lib/dse/english-path";
import { ICT_UNITS } from "@/lib/dse/ict-path";
import { MATH_UNITS } from "@/lib/dse/math-path";
import { getAllQuizSlugs, getQuiz } from "@/lib/dse/quizzes";
import { CHINESE_PRESCRIBED_TEXTS } from "@/lib/dse/texts";
import { DSE_SUBJECTS } from "@/lib/dse/subjects";
import { VIDEO_SUBJECTS, getVideoLibrary } from "@/lib/dse/videos";
import { PROGRAMMES } from "@/lib/jupas/programmes";
import { createPageMetadata } from "@/lib/page-metadata";
import { buildBreadcrumbJsonLd } from "@/lib/seo";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/site";

/* ------------------------------------------------------------------ *
 * Counts — every number on this page is read from the content data,
 * so it can never drift from what the linked page actually serves.
 * ------------------------------------------------------------------ */

const TEXT_COUNT = CHINESE_PRESCRIBED_TEXTS.length;

const CHINESE_CARD_COUNT = getAllQuizSlugs().reduce(
  (n, slug) => n + (getQuiz(slug)?.meta.total ?? 0),
  0,
);

const CHINESE_LESSON_COUNT = CHINESE_UNITS.reduce(
  (n, u) => n + u.lessonIds.length,
  0,
);

const ENGLISH_LESSON_COUNT = ENGLISH_UNITS.reduce(
  (n, u) => n + u.lessonIds.length,
  0,
);

const ECON_LESSON_COUNT = ECON_UNITS.reduce((n, u) => n + u.lessonIds.length, 0);

const ICT_LESSON_COUNT = ICT_UNITS.reduce((n, u) => n + u.lessonIds.length, 0);
const MATH_LESSON_COUNT = MATH_UNITS.reduce((n, u) => n + u.lessonIds.length, 0);
const BAFS_LESSON_COUNT = BAFS_UNITS.reduce((n, u) => n + u.lessonIds.length, 0);

const ENGLISH_DRILL_COUNT = getDrillBank("english")?.meta.total ?? 0;
const ECON_DRILL_COUNT = getDrillBank("econ")?.meta.total ?? 0;
const ICT_DRILL_COUNT = getDrillBank("ict")?.meta.total ?? 0;
const MATH_DRILL_COUNT = getDrillBank("math")?.meta.total ?? 0;
const BAFS_DRILL_COUNT = getDrillBank("bafs")?.meta.total ?? 0;

const videoCount = (subject: string) =>
  getVideoLibrary(subject)?.videos.length ?? 0;

const TOTAL_VIDEO_COUNT = VIDEO_SUBJECTS.reduce(
  (n, s) => n + videoCount(s),
  0,
);

const TITLE = `DSE 學習與備考專區｜中文範文閃卡、English／ECON／數學／BAFS／ICT 自學路徑、JUPAS 揀科 | ${SITE_NAME}`;

export const metadata = createPageMetadata({
  title: TITLE,
  description: `${SITE_NAME} DSE 備考專區：中文 ${TEXT_COUNT} 篇指定範文 ${CHINESE_CARD_COUNT} 題閃卡同 ${CHINESE_LESSON_COUNT} 課自學路徑、English ${ENGLISH_LESSON_COUNT} 課、ECON ${ECON_LESSON_COUNT} 課、數學 ${MATH_LESSON_COUNT} 課、BAFS ${BAFS_LESSON_COUNT} 課、ICT ${ICT_LESSON_COUNT} 課自學路徑、${VIDEO_SUBJECTS.length} 科 ${TOTAL_VIDEO_COUNT} 條溫習片同 ${PROGRAMMES.length} 個聯招課程收生數據。全部免費、免登入。`,
  path: "/dse",
  keywords: [
    "DSE",
    "DSE 備考",
    "DSE 中文科",
    "DSE English",
    "DSE Economics",
    "DSE BAFS",
    "DSE 經濟",
    "DSE ICT",
    "資訊及通訊科技",
    "DSE 數學",
    "DSE Mathematics",
    "DSE 企業會計與財務概論",
    "指定範文閃卡",
    "英文自學",
    "JUPAS 揀科",
    "DSE 溫習片",
    SITE_NAME,
  ],
});

const SUBJECT_ICON: Record<string, typeof Languages> = {
  chinese: BookOpen,
  english: Languages,
  econ: Sigma,
  ict: Cpu,
  bafs: Briefcase,
  math: Calculator,
  m2: Layers,
  physics: Atom,
  chemistry: FlaskConical,
  biology: Dna,
};

/** Subjects with a full learning path; the rest are video-only for now. */
const CORE_SUBJECT_IDS = ["chinese", "english", "econ", "ict", "bafs", "math"] as const;

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
      href: "/dse/chinese/learn",
      label: "中文科自學路徑",
      detail: `U01–U12：字詞、句意、段旨、手法、主題、跨篇、閱讀、寫作、說話，再到錯題回練。每單元 ${CHINESE_SET_SIZE} 題，答對 ${CHINESE_PASS_MARK} 題過關。`,
      count: `${CHINESE_UNITS.length} 單元`,
    },
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
  ict: [
    {
      href: "/dse/ict/learn",
      label: "ICT 自學路徑",
      detail: `電腦系統、網絡、數據、數據庫、多媒體、演算法、保安同應試，共 ${ICT_UNITS.length} 單元，練習達標先解鎖。`,
      count: `${ICT_LESSON_COUNT} 課`,
    },
    {
      href: "/dse/ict",
      label: "ICT MCQ 練習",
      detail: "系統、數據表示、網絡、互聯網、數據庫、多媒體、偽代碼、保安同社會議題，每題附解說。",
      count: `${ICT_DRILL_COUNT} 題`,
    },
  ],
  bafs: [
    {
      href: "/dse/bafs/learn",
      label: "BAFS 自學路徑",
      detail: `商業環境、管理、市場營銷、人力資源、會計等式、財務報表、比率同個人理財，共 ${BAFS_UNITS.length} 單元，過關制解鎖。`,
      count: `${BAFS_LESSON_COUNT} 課`,
    },
    {
      href: "/dse/bafs",
      label: "BAFS MCQ 練習",
      detail: "商管與會計財務課題 MCQ，每題附解說，可配合自學路徑使用。",
      count: `${BAFS_DRILL_COUNT} 題`,
    },
  ],
  math: [
    {
      href: "/dse/math/learn",
      label: "數學自學路徑",
      detail: `必修部分 ${MATH_UNITS.length} 單元，由數與代數做到三角、統計同概率，練習達標先解鎖下一課。`,
      count: `${MATH_LESSON_COUNT} 課`,
    },
    {
      href: "/dse/math",
      label: "數學 MCQ 練習",
      detail: "數與估算、代數、函數、幾何、三角、統計同概率，每題附解說。",
      count: `${MATH_DRILL_COUNT} 題`,
    },
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

/**
 * The six learn paths, listed up front so a student does not have to hunt for
 * them. Counts are read from the unit tables, never typed in.
 */
const LEARN_PATHS = [
  {
    subjectId: "chinese",
    href: "/dse/chinese/learn",
    label: "中文科自學路徑",
    count: `${CHINESE_UNITS.length} 單元`,
    detail: `範文導讀、閱讀策略、寫作審題同說話；每單元 ${CHINESE_SET_SIZE} 題，答啱 ${CHINESE_PASS_MARK} 題過關。`,
  },
  {
    subjectId: "english",
    href: "/dse/english/learn",
    label: "English 自學路徑",
    count: `${ENGLISH_LESSON_COUNT} 課`,
    detail: "卷一閱讀、卷二寫作、卷三聆聽綜合、卷四說話同語法詞彙。",
  },
  {
    subjectId: "econ",
    href: "/dse/econ/learn",
    label: "經濟（ECON）自學路徑",
    count: `${ECON_LESSON_COUNT} 課 · ${ECON_DRILL_COUNT} 題`,
    detail: `需求與供應、彈性、市場干預、生產與成本、市場結構、GDP 等 ${ECON_UNITS.length} 單元，另有圖表陷阱課同答題骨架。`,
  },
  {
    subjectId: "math",
    href: "/dse/math/learn",
    label: "數學（必修）自學路徑",
    count: `${MATH_LESSON_COUNT} 課 · ${MATH_DRILL_COUNT} 題`,
    detail: `必修部分 ${MATH_UNITS.length} 單元加 worked example 示範；不混 M1／M2。`,
  },
  {
    subjectId: "bafs",
    href: "/dse/bafs/learn",
    label: "BAFS 自學路徑",
    count: `${BAFS_LESSON_COUNT} 課 · ${BAFS_DRILL_COUNT} 題`,
    detail: `商管同會計財務 ${BAFS_UNITS.length} 單元，另有會計／商管弱項課同答題格式卡。`,
  },
  {
    subjectId: "ict",
    href: "/dse/ict/learn",
    label: "ICT 自學路徑",
    count: `${ICT_LESSON_COUNT} 課 · ${ICT_DRILL_COUNT} 題`,
    detail: `系統、數據、網絡、互聯網、數據庫、多媒體、演算法、保安同應試 ${ICT_UNITS.length} 單元。`,
  },
] as const;

const START_STEPS = [
  {
    href: "/dse/chinese/cat",
    icon: Activity,
    title: "先做中文診斷",
    detail: "十幾題估到範文等級，睇清邊個技能要補。",
  },
  {
    href: "/dse/english/learn",
    icon: Route,
    title: "跟自學路徑過關",
    detail: `English ${ENGLISH_LESSON_COUNT} 課、ECON ${ECON_LESSON_COUNT} 課、數學 ${MATH_LESSON_COUNT} 課、BAFS ${BAFS_LESSON_COUNT} 課、ICT ${ICT_LESSON_COUNT} 課，一課一課解鎖。`,
  },
  {
    href: "/dse/jupas",
    icon: GraduationCap,
    title: "考完排 JUPAS",
    detail: `${PROGRAMMES.length} 個課程真實收生分數，排你嘅 Band A。`,
  },
] as const;

export default function DseHomePage() {
  const coreSubjects = CORE_SUBJECT_IDS.map((id) =>
    DSE_SUBJECTS.find((s) => s.id === id),
  ).filter((s) => s !== undefined);
  const otherSubjects = DSE_SUBJECTS.filter(
    (s) => !(CORE_SUBJECT_IDS as readonly string[]).includes(s.id),
  );
  const videoSubjects = otherSubjects.filter(
    (s) => s.open && (SUBJECT_RESOURCES[s.id]?.length ?? 0) > 0,
  );
  const closedSubjects = otherSubjects.filter(
    (s) => !videoSubjects.includes(s),
  );

  return (
    <div className="space-y-12">
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "首頁", path: "/" },
          { name: "DSE 備考", path: "/dse" },
        ])}
      />

      {/* Hero + 第一次嚟 */}
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:items-stretch">
        <div className="flex flex-col justify-center py-2">
          <Eyebrow>DSE 學習專區</Eyebrow>
          <h1 className="mt-3 font-[family-name:var(--font-serif-zh)] text-[2rem] leading-tight font-bold tracking-tight text-navy sm:text-[2.6rem]">
            DSE 學習與備考專區
          </h1>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-ink-muted sm:text-base">
            中文 {TEXT_COUNT} 篇指定範文 {CHINESE_CARD_COUNT} 題閃卡、{CHINESE_UNITS.length}{" "}
            單元自學路徑、English{" "}
            {ENGLISH_LESSON_COUNT} 課、ECON {ECON_LESSON_COUNT} 課、數學 {MATH_LESSON_COUNT}{" "}
            課、BAFS {BAFS_LESSON_COUNT} 課、ICT {ICT_LESSON_COUNT} 課自學路徑、
            {VIDEO_SUBJECTS.length} 科 {TOTAL_VIDEO_COUNT} 條溫習片，再加{" "}
            {PROGRAMMES.length} 個聯招課程嘅真實收生分數。
          </p>
          <TrustChips className="mt-5" />
        </div>

        <div className="rounded-2xl bg-navy p-5 text-cream sm:p-6">
          <p className="text-xs font-extrabold tracking-[0.2em] text-gold">
            第一次嚟？三步開始
          </p>
          <ol className="mt-4 space-y-2.5">
            {START_STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <li key={step.href}>
                  <Link
                    href={step.href}
                    className="group flex items-center gap-3 rounded-xl border border-cream/15 bg-cream/5 px-4 py-3 transition-colors hover:border-gold/60 hover:bg-cream/10"
                  >
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gold font-[family-name:var(--font-brand)] text-sm font-extrabold text-navy">
                      {i + 1}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-1.5 text-sm font-bold text-cream">
                        <Icon className="size-3.5 text-gold" aria-hidden />
                        {step.title}
                      </span>
                      <span className="mt-0.5 block text-xs leading-relaxed text-cream/70">
                        {step.detail}
                      </span>
                    </span>
                    <ArrowRight
                      className="size-4 shrink-0 text-cream/60 transition-transform group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* 自學路徑入口 — 六科一格即跳 */}
      <section aria-labelledby="learn-heading" className="space-y-4">
        <SectionHeading
          id="learn-heading"
          eyebrow="自學路徑入口"
          title="揀科即刻開始：課 → 練習 → 過關解鎖"
        />
        <p className="-mt-2 max-w-3xl text-sm leading-relaxed text-ink-muted">
          六科都有完整自學路徑：先讀課文，再做 10 題練習，答啱合格線就解鎖下一個單元。
          進度只存喺你部機，唔使帳號，冇廣告。
        </p>
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {LEARN_PATHS.map((path) => {
            const Icon = SUBJECT_ICON[path.subjectId] ?? Globe2;
            return (
              <li key={path.href}>
                <Link
                  href={path.href}
                  className="group flex h-full items-start gap-3.5 rounded-2xl border border-line bg-white px-4 py-4 shadow-[var(--shadow-card)] transition-colors hover:border-navy/40"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-navy text-gold">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="text-sm font-bold text-navy">{path.label}</span>
                      <span className="rounded-full bg-cream px-2 py-0.5 text-[11px] font-bold text-gold-ink ring-1 ring-line">
                        {path.count}
                      </span>
                    </span>
                    <span className="mt-1 block text-xs leading-relaxed text-ink-muted">
                      {path.detail}
                    </span>
                  </span>
                  <ArrowRight
                    className="mt-1 size-4 shrink-0 text-ink-faint transition-transform group-hover:translate-x-0.5 group-hover:text-navy"
                    aria-hidden
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* 完整學習路徑 */}
      <section aria-labelledby="core-heading" className="space-y-5">
        <SectionHeading
          id="core-heading"
          eyebrow="完整學習路徑"
          title="中文 · English · ECON · 數學 · BAFS · ICT"
        />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {coreSubjects.map((s) => {
            const Icon = SUBJECT_ICON[s.id] ?? Globe2;
            const resources = SUBJECT_RESOURCES[s.id] ?? [];
            return (
              <article
                key={s.id}
                id={s.id}
                className="flex scroll-mt-28 flex-col rounded-2xl border border-line bg-white p-5 shadow-[var(--shadow-card)]"
              >
                <div className="flex items-start gap-3.5">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-navy text-gold">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-[family-name:var(--font-serif-zh)] text-lg font-bold text-navy">
                        {s.name}
                      </h3>
                      <span className="rounded-full bg-cream px-2 py-0.5 text-[11px] font-bold text-gold-ink ring-1 ring-line">
                        {resources.length} 項資源
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-ink-faint">{s.nameEn}</p>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                  {s.desc}
                </p>
                <ul className="mt-4 flex-1 space-y-2">
                  {resources.map((r) => (
                    <li key={r.href}>
                      <Link
                        href={r.href}
                        className="group flex items-start gap-3 rounded-xl border border-line bg-cream/40 px-3.5 py-3 transition-colors hover:border-navy/40 hover:bg-white"
                      >
                        <span className="min-w-0 flex-1">
                          <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                            <span className="text-sm font-bold text-navy">
                              {r.label}
                            </span>
                            <span className="rounded-full bg-navy/5 px-2 py-0.5 text-[11px] font-bold text-navy">
                              {r.count}
                            </span>
                          </span>
                          <span className="mt-1 block text-xs leading-relaxed text-ink-muted">
                            {r.detail}
                          </span>
                        </span>
                        <ArrowRight
                          className="mt-1 size-4 shrink-0 text-ink-faint transition-transform group-hover:translate-x-0.5 group-hover:text-navy"
                          aria-hidden
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </section>

      {/* 其他科：溫習片先行 */}
      <section aria-labelledby="other-heading" className="space-y-5">
        <SectionHeading
          id="other-heading"
          eyebrow="溫習片先行"
          title="其他科目"
          action={{ href: "/dse/videos", label: "睇全部溫習片" }}
        />
        <p className="-mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted">
          呢幾科暫時未有自學路徑，先用策展溫習片打底——每條附摘要、重點筆記同「邊個階段睇」。
        </p>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {videoSubjects.map((s) => {
            const Icon = SUBJECT_ICON[s.id] ?? Globe2;
            const resource = SUBJECT_RESOURCES[s.id]?.[0];
            if (!resource) return null;
            return (
              <li key={s.id} id={s.id} className="scroll-mt-28">
                <Link
                  href={resource.href}
                  className="panel-lift group flex h-full items-center gap-3.5 rounded-2xl border border-line bg-white px-4 py-4"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-cream text-navy ring-1 ring-line">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-[family-name:var(--font-serif-zh)] text-base font-bold text-navy">
                      {s.name}
                    </span>
                    <span className="mt-0.5 flex items-center gap-1.5 text-xs text-ink-muted">
                      <PlayCircle className="size-3.5 text-gold-ink" aria-hidden />
                      {resource.count}溫習片
                    </span>
                  </span>
                  <ArrowRight
                    className="size-4 shrink-0 text-ink-faint transition-transform group-hover:translate-x-0.5 group-hover:text-navy"
                    aria-hidden
                  />
                </Link>
              </li>
            );
          })}
          {closedSubjects.map((s) => (
            <li
              key={s.id}
              id={s.id}
              className="flex scroll-mt-28 items-center gap-3.5 rounded-2xl border border-dashed border-line bg-cream/60 px-4 py-4"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl text-ink-faint ring-1 ring-line">
                <Globe2 className="size-5" aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-[family-name:var(--font-serif-zh)] text-base font-bold text-ink-muted">
                  {s.name}
                </span>
                <span className="mt-0.5 block text-xs text-ink-faint">
                  未開放 ·{" "}
                  <a
                    href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`想優先做：${s.name}`)}`}
                    className="font-semibold text-navy underline underline-offset-2"
                  >
                    想我哋優先做？話我哋知
                  </a>
                </span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* JUPAS — 升學規劃 */}
      <section
        id="jupas"
        aria-labelledby="jupas-heading"
        className="relative isolate scroll-mt-28 overflow-hidden rounded-2xl bg-navy p-6 text-cream sm:p-8"
      >
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(90%_120%_at_100%_0%,rgba(196,163,90,0.22)_0%,rgba(11,31,58,0)_60%)]"
        />
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center">
          <div>
            <p className="flex items-center gap-2 text-xs font-extrabold tracking-[0.2em] text-gold">
              <GraduationCap className="size-4" aria-hidden />
              升學規劃
            </p>
            <h2
              id="jupas-heading"
              className="mt-3 font-[family-name:var(--font-serif-zh)] text-2xl font-bold"
            >
              考完之後，點揀科？
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-cream/75">
              收生分數同出路係兩條獨立嘅線。用 {PROGRAMMES.length}{" "}
              個聯招課程嘅真實收生數據同公開薪酬，計清你嘅 Band A 排位。
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              {
                href: "/dse/jupas",
                title: "JUPAS 揀科指南",
                detail: "流程時間表、Band A 策略、「分數效益」逐科計",
              },
              {
                href: "/dse/jupas/compare",
                title: "課程比較工具",
                detail: "2–3 科並排對比，即刻睇穩入／有機／陪跑",
              },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group flex items-center justify-between gap-3 rounded-xl border border-cream/15 bg-cream/5 px-4 py-3.5 transition-colors hover:border-gold/60 hover:bg-cream/10"
              >
                <span>
                  <span className="block text-sm font-bold text-cream">
                    {link.title}
                  </span>
                  <span className="mt-1 block text-xs text-cream/70">
                    {link.detail}
                  </span>
                </span>
                <ArrowRight
                  className="size-4 shrink-0 text-gold transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How to use */}
      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-line bg-white p-6">
          <p className="flex items-center gap-2 text-xs font-extrabold tracking-[0.2em] text-gold-ink">
            <Activity className="size-4" aria-hidden />
            診斷先行
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-serif-zh)] text-xl font-bold text-navy">
            唔知弱喺邊，先做診斷
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">
            範文／閱讀／經濟各有課題練習。想知自己整體水平，就直接入中文科嘅
            AI 診斷室，做完會話你邊個技能位要補，唔使盲做幾百題。
          </p>
          <Link
            href="/dse/chinese/cat"
            className="btn-navy mt-6 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold"
          >
            <Zap className="size-3.5" aria-hidden />
            入診斷室
            <ArrowRight className="size-3.5" aria-hidden />
          </Link>
        </div>

        <div className="rounded-2xl border border-line bg-white p-6">
          <p className="flex items-center gap-2 text-xs font-extrabold tracking-[0.2em] text-gold-ink">
            <BookMarked className="size-4" aria-hidden />
            進度閉環
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-serif-zh)] text-xl font-bold text-navy">
            錯咗嘅題，唔會消失
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">
            練習同診斷嘅錯題自動入錯題本，可以按範文、難度重測。全部記錄只存你部機——零登入、零雲端同步壓力。
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/dse/chinese/error-notebook"
              className="inline-flex items-center gap-2 rounded-full border border-navy/25 bg-white px-5 py-2.5 text-sm font-bold text-navy transition-colors hover:border-navy"
            >
              <Sparkles className="size-3.5" aria-hidden />
              開錯題本
            </Link>
            <Link
              href="/dse/videos"
              className="inline-flex items-center gap-2 rounded-full border border-navy/25 bg-white px-5 py-2.5 text-sm font-bold text-navy transition-colors hover:border-navy"
            >
              <PlayCircle className="size-3.5" aria-hidden />
              睇片庫
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
