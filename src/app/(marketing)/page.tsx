import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  FileText,
  Calculator,
  GraduationCap,
  Languages,
  LockKeyhole,
  NotebookPen,
  PlayCircle,
  ScrollText,
  ShieldCheck,
  Sigma,
} from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { Eyebrow, SectionHeading, TrustChips } from "@/components/site/trust-ui";
import { getDrillBank } from "@/lib/dse/drills";
import { ECON_UNITS } from "@/lib/dse/econ-path";
import { ENGLISH_UNITS } from "@/lib/dse/english-path";
import { MATH_UNITS } from "@/lib/dse/math-path";
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

const MATH_UNIT_COUNT = MATH_UNITS.length;
const MATH_LESSON_COUNT = MATH_UNITS.reduce((n, u) => n + u.lessonIds.length, 0);

const ENGLISH_DRILL_COUNT = getDrillBank("english")?.meta.total ?? 0;
const ECON_DRILL_COUNT = getDrillBank("econ")?.meta.total ?? 0;
const MATH_DRILL_COUNT = getDrillBank("math")?.meta.total ?? 0;

const VIDEO_COUNT = (subject: string) =>
  getVideoLibrary(subject)?.videos.length ?? 0;

const TOTAL_VIDEO_COUNT = VIDEO_SUBJECTS.reduce(
  (n, subject) => n + VIDEO_COUNT(subject),
  0,
);

const PROGRAMME_COUNT = PROGRAMMES.length;

const SAMPLE_CARD = getQuiz("quanxue")?.questions[0];

const TITLE = `DSE 自修室｜中文範文閃卡、English／ECON／數學自學路徑、8 科溫習片、JUPAS 揀科數據 | ${SITE_NAME}`;

export const metadata = createPageMetadata({
  title: TITLE,
  description: `${SITE_NAME} DSE 自修室：中文 ${TEXT_COUNT} 篇指定範文 ${CHINESE_CARD_COUNT} 題閃卡同 AI 診斷室、English ${ENGLISH_LESSON_COUNT} 課、ECON ${ECON_LESSON_COUNT} 課、數學 ${MATH_LESSON_COUNT} 課自學路徑、${VIDEO_SUBJECTS.length} 科 ${TOTAL_VIDEO_COUNT} 條溫習片，仲有 ${PROGRAMME_COUNT} 個聯招課程嘅真實收生分數同畢業薪酬。全部免費、免登入，進度只存你部機。`,
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
    "DSE 數學 自學",
    "數學自學路徑",
    "JUPAS 揀科",
    "免費 DSE 練習",
    SITE_NAME,
    ...SITE_KEYWORDS,
  ],
});

const HERO_STATS = [
  { value: CHINESE_CARD_COUNT, unit: "題", label: `中文 ${TEXT_COUNT} 篇範文閃卡` },
  { value: ENGLISH_LESSON_COUNT, unit: "課", label: "English 自學路徑" },
  { value: ECON_LESSON_COUNT, unit: "課", label: "ECON Learn Mode" },
  { value: MATH_LESSON_COUNT, unit: "課", label: "數學自學路徑" },
  { value: TOTAL_VIDEO_COUNT, unit: "條", label: `${VIDEO_SUBJECTS.length} 科溫習片` },
  { value: PROGRAMME_COUNT, unit: "個", label: "JUPAS 課程數據" },
] as const;

const SUBJECT_ENTRIES = [
  {
    href: "/dse/chinese",
    name: "中文",
    nameEn: "Chinese Language",
    icon: BookOpen,
    desc: `${TEXT_COUNT} 篇指定範文 ${CHINESE_CARD_COUNT} 題閃卡，字詞、通假、句譯、章旨三階遞進；配 AI 診斷室同錯題本。`,
    cta: "開始刷範文",
  },
  {
    href: "/dse/english/learn",
    name: "English",
    nameEn: "English Language",
    icon: Languages,
    desc: `${ENGLISH_UNIT_COUNT} 單元 ${ENGLISH_LESSON_COUNT} 課，由卷一閱讀做到卷四說話同語法；練習 ≥7/10 先解鎖下一課，另備 ${ENGLISH_DRILL_COUNT} 題 MCQ。`,
    cta: "由第一課開始",
  },
  {
    href: "/dse/econ/learn",
    name: "ECON 經濟",
    nameEn: "Economics",
    icon: Sigma,
    desc: `${ECON_UNIT_COUNT} 單元 ${ECON_LESSON_COUNT} 課，由供求、彈性做到貨幣政策同國際貿易；${ECON_DRILL_COUNT} 題練習做關卡。`,
    cta: "由供求開始",
  },
  {
    href: "/dse/math/learn",
    name: "數學",
    nameEn: "Mathematics (Compulsory)",
    icon: Calculator,
    desc: `${MATH_UNIT_COUNT} 單元 ${MATH_LESSON_COUNT} 課必修部分，由數與代數做到三角、統計同概率；${MATH_DRILL_COUNT} 題練習，答啱 7/10 先過關。`,
    cta: "由數與估算開始",
  },
  {
    href: "/dse/videos",
    name: "其他科",
    nameEn: "數學 · M2 · 物理 · 化學 · 生物",
    icon: PlayCircle,
    desc: `未有自學路徑嘅科，先睇策展溫習片：每條附摘要、重點筆記同「邊個階段睇」。`,
    cta: "睇溫習片",
  },
] as const;

const TOOL_ENTRIES = [
  {
    href: "/dse/jupas",
    icon: GraduationCap,
    tag: "升學",
    title: "JUPAS 揀科指南",
    desc: `${PROGRAMME_COUNT} 個聯招課程嘅真實收生中位數同畢業薪酬，逐科計「分數效益」；再用比較工具排你嘅 Band A，睇穩入／有機／陪跑。`,
    cta: "計吓入學機會",
    featured: true,
  },
  {
    href: "/dse/videos",
    icon: PlayCircle,
    tag: "片庫",
    title: "溫習片庫",
    desc: `${VIDEO_SUBJECTS.length} 科共 ${TOTAL_VIDEO_COUNT} 條精選教學片，每條寫好摘要、重點筆記同「邊個階段睇」——唔係片單，係策展分析。`,
    cta: "睇片溫書",
    featured: false,
  },
  {
    href: "/guides/dse-buxi",
    icon: FileText,
    tag: "指南",
    title: "DSE 補習選擇指南",
    desc: "補習社價錢、大班細班點揀、邊種學生真係需要補——落決定之前，知道自己買緊咩。",
    cta: "睇指南",
    featured: false,
  },
] as const;

const TRUST_POINTS = [
  {
    icon: CheckCircle2,
    title: "完全免費",
    desc: "全部工具同題庫唔收錢，亦冇隱藏收費步驟。",
  },
  {
    icon: LockKeyhole,
    title: "免登入",
    desc: "唔使開帳號、唔使填個人資料，開頁即用。",
  },
  {
    icon: NotebookPen,
    title: "進度只存你部機",
    desc: "做題記錄同錯題本留喺瀏覽器本機，唔會上傳伺服器。",
  },
  {
    icon: ScrollText,
    title: "以考評局官網為準",
    desc: "題目同講解自家編寫，屬溫習參考；考試範圍同評分以考評局公佈為準。",
  },
] as const;

export default function HomePage() {
  return (
    <div className="pb-20">
      <JsonLd data={buildBreadcrumbJsonLd([{ name: "首頁", path: "/" }])} />
      <JsonLd
        data={buildCourseJsonLd({
          name: "DSE 自修室：中文、English、ECON、數學自學路徑與 JUPAS 揀科數據",
          description: `免費 DSE 自修室：中文 ${TEXT_COUNT} 篇指定範文 ${CHINESE_CARD_COUNT} 題閃卡、English ${ENGLISH_LESSON_COUNT} 課、ECON ${ECON_LESSON_COUNT} 課、數學 ${MATH_LESSON_COUNT} 課自學路徑、${VIDEO_SUBJECTS.length} 科 ${TOTAL_VIDEO_COUNT} 條溫習片、${PROGRAMME_COUNT} 個聯招課程收生數據。`,
          url: `${SITE_URL}/dse`,
          providerName: SITE_NAME,
        })}
      />

      {/* 1. HERO */}
      <section className="mx-auto w-full max-w-[1160px] px-4 pt-8 sm:px-6 min-[960px]:pt-14">
        <div className="min-[960px]:grid min-[960px]:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] min-[960px]:items-center min-[960px]:gap-14">
          <div className="text-center min-[960px]:text-left">
            <Eyebrow>香港 DSE · 免費自修室</Eyebrow>
            <h1 className="mt-3 font-[family-name:var(--font-serif-zh)] text-[2.15rem] leading-[1.18] font-bold tracking-tight text-navy min-[960px]:text-[3rem] min-[1160px]:text-[3.4rem]">
              DSE 自修室，
              <br />
              <span className="inline-block">溫書揀科一次睇清</span>
            </h1>
            <p className="mx-auto mt-4 max-w-[34rem] text-[15px] leading-relaxed text-ink-muted min-[960px]:mx-0 min-[960px]:text-[17px]">
              中文 {TEXT_COUNT} 篇範文閃卡同診斷室、English／ECON／數學自學路徑、
              {VIDEO_SUBJECTS.length} 科溫習片，考完再用真實收生分數排 JUPAS——唔使先交補習學費。
            </p>

            <div className="mt-7 flex flex-col gap-2.5 min-[960px]:flex-row min-[960px]:items-center min-[960px]:gap-3">
              <Link
                href="/dse"
                className="btn-primary group inline-flex h-[3.25rem] w-full items-center justify-center gap-2 rounded-full px-8 text-base font-extrabold min-[960px]:w-auto"
              >
                入 DSE 學習專區
                <ArrowRight
                  className="size-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              </Link>
              <div className="grid grid-cols-2 gap-2.5 min-[960px]:flex">
                <Link
                  href="/dse/chinese/cat"
                  className="inline-flex h-11 items-center justify-center gap-1.5 rounded-full border border-navy/25 bg-white px-5 text-sm font-bold text-navy transition-colors hover:border-navy min-[960px]:h-[3.25rem] min-[960px]:px-6"
                >
                  <Activity className="size-4" aria-hidden />
                  中文診斷室
                </Link>
                <Link
                  href="/dse/jupas"
                  className="inline-flex h-11 items-center justify-center gap-1.5 rounded-full border border-navy/25 bg-white px-5 text-sm font-bold text-navy transition-colors hover:border-navy min-[960px]:h-[3.25rem] min-[960px]:px-6"
                >
                  <GraduationCap className="size-4" aria-hidden />
                  JUPAS 揀科
                </Link>
              </div>
            </div>
            <p className="mt-3 text-xs font-medium text-ink-faint">
              診斷室十幾題估到你範文等級 · 錯題自動入錯題本
            </p>

            <TrustChips className="mt-5 justify-center min-[960px]:justify-start" />
          </div>

          <HeroPanel />
        </div>

        <dl className="mt-10 grid grid-cols-2 overflow-hidden rounded-2xl border border-line bg-white sm:grid-cols-3 lg:grid-cols-6 min-[960px]:mt-14">
          {HERO_STATS.map((stat) => (
            <div
              key={stat.label}
              className="border-line px-4 py-4 max-lg:border-b lg:border-r lg:last:border-r-0"
            >
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <span className="font-[family-name:var(--font-brand)] text-2xl font-extrabold text-navy">
                  {stat.value}
                </span>
                <span className="ml-1 text-sm font-semibold text-navy">
                  {stat.unit}
                </span>
                <span className="mt-0.5 block text-xs font-medium text-ink-muted">
                  {stat.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* 2. 揀科目 */}
      <section
        aria-labelledby="subjects-heading"
        className="mx-auto mt-14 w-full max-w-[1160px] space-y-5 px-4 sm:px-6"
      >
        <SectionHeading
          id="subjects-heading"
          eyebrow="由科目開始"
          title="揀你嘅科目"
          action={{ href: "/dse", label: "睇全部科目同資源" }}
        />
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SUBJECT_ENTRIES.map((entry) => {
            const Icon = entry.icon;
            return (
              <li key={entry.href}>
                <Link
                  href={entry.href}
                  className="panel-lift group flex h-full flex-col rounded-2xl border border-line bg-white p-5"
                >
                  <span className="flex size-10 items-center justify-center rounded-xl bg-navy text-gold">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <h3 className="mt-4 font-[family-name:var(--font-serif-zh)] text-lg font-bold text-navy">
                    {entry.name}
                  </h3>
                  <p className="mt-0.5 text-xs text-ink-faint">{entry.nameEn}</p>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">
                    {entry.desc}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-navy">
                    {entry.cta}
                    <ArrowRight
                      className="size-3.5 transition-transform group-hover:translate-x-1"
                      aria-hidden
                    />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* 3. 升學同工具 */}
      <section
        aria-labelledby="tools-heading"
        className="mx-auto mt-14 w-full max-w-[1160px] space-y-5 px-4 sm:px-6"
      >
        <SectionHeading id="tools-heading" eyebrow="溫書以外" title="升學同工具" />
        <ul className="grid gap-4 md:grid-cols-3">
          {TOOL_ENTRIES.map((tool) => {
            const Icon = tool.icon;
            return (
              <li key={tool.href}>
                <Link
                  href={tool.href}
                  className={
                    tool.featured
                      ? "panel-lift group flex h-full flex-col rounded-2xl bg-navy p-6 text-cream"
                      : "panel-lift group flex h-full flex-col rounded-2xl border border-line bg-white p-6"
                  }
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={
                        tool.featured
                          ? "flex size-11 items-center justify-center rounded-xl bg-gold text-navy"
                          : "flex size-11 items-center justify-center rounded-xl bg-cream text-navy ring-1 ring-line"
                      }
                    >
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <span
                      className={
                        tool.featured
                          ? "rounded-full bg-cream/10 px-2.5 py-0.5 text-[11px] font-bold tracking-wide text-gold"
                          : "rounded-full bg-cream px-2.5 py-0.5 text-[11px] font-bold tracking-wide text-gold-ink"
                      }
                    >
                      {tool.tag}
                    </span>
                  </div>
                  <h3
                    className={`mt-4 font-[family-name:var(--font-serif-zh)] text-xl font-bold ${tool.featured ? "text-cream" : "text-navy"}`}
                  >
                    {tool.title}
                  </h3>
                  <p
                    className={`mt-2 flex-1 text-sm leading-relaxed ${tool.featured ? "text-cream/75" : "text-ink-muted"}`}
                  >
                    {tool.desc}
                  </p>
                  <span
                    className={`mt-5 inline-flex items-center gap-1.5 text-sm font-bold ${tool.featured ? "text-gold" : "text-navy"}`}
                  >
                    {tool.cta}
                    <ArrowRight
                      className="size-3.5 transition-transform group-hover:translate-x-1"
                      aria-hidden
                    />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* 4. Trust */}
      <section
        aria-labelledby="trust-heading"
        className="mx-auto mt-14 w-full max-w-[1160px] px-4 sm:px-6"
      >
        <div className="rounded-2xl border border-line bg-white p-6 sm:p-8">
          <div className="flex items-center gap-2 text-gold-ink">
            <ShieldCheck className="size-4" aria-hidden />
            <h2 id="trust-heading" className="text-xs font-extrabold tracking-[0.2em]">
              用得安心
            </h2>
          </div>
          <ul className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {TRUST_POINTS.map(({ icon: Icon, title, desc }) => (
              <li key={title} className="flex items-start gap-3">
                <Icon className="mt-0.5 size-5 shrink-0 text-navy" aria-hidden />
                <span>
                  <span className="block text-sm font-bold text-navy">{title}</span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-ink-muted">
                    {desc}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 5. 最後一推 */}
      <section className="mx-auto mt-8 w-full max-w-[1160px] px-4 sm:px-6">
        <div className="relative isolate flex flex-col gap-5 overflow-hidden rounded-2xl bg-navy p-6 text-cream sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-[radial-gradient(90%_120%_at_100%_0%,rgba(196,163,90,0.22)_0%,rgba(11,31,58,0)_60%)]"
          />
          <div>
            <h2 className="font-[family-name:var(--font-serif-zh)] text-xl font-bold sm:text-2xl">
              唔知由邊度開始？
            </h2>
            <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-cream/75">
              先去學習專區，一頁睇齊每科有咩資源；或者直接入中文診斷室，十幾題就知自己弱喺邊。
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/dse"
              className="btn-primary inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-extrabold"
            >
              DSE 學習專區
              <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Link
              href="/dse/chinese/cat"
              className="inline-flex items-center gap-2 rounded-full border border-cream/30 px-6 py-3 text-sm font-bold text-cream transition-colors hover:border-cream"
            >
              <Brain className="size-4" aria-hidden />
              中文診斷室
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

/** Decorative product preview — a real flashcard from the 勸學 bank. */
function HeroPanel() {
  const card = SAMPLE_CARD;
  return (
    <div
      aria-hidden
      className="relative isolate mt-10 aspect-square overflow-hidden rounded-[1.75rem] bg-navy min-[960px]:mt-0 min-[960px]:aspect-[5/4]"
    >
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(120%_90%_at_85%_10%,rgba(196,163,90,0.28)_0%,rgba(11,31,58,0)_55%),radial-gradient(90%_80%_at_0%_100%,rgba(42,68,104,0.9)_0%,rgba(11,31,58,0)_60%)]" />
      <svg
        className="absolute inset-0 -z-10 size-full"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 600 480"
      >
        <defs>
          <pattern id="hero-dots" width="18" height="18" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1.1" fill="rgba(247,243,234,0.09)" />
          </pattern>
        </defs>
        <rect width="600" height="480" fill="url(#hero-dots)" />
        {[260, 200, 140].map((r) => (
          <circle
            key={r}
            cx="520"
            cy="60"
            r={r}
            fill="none"
            stroke="rgba(196,163,90,0.22)"
            strokeWidth="1"
          />
        ))}
        <path
          d="M-20 400 C 120 340, 240 460, 420 380 S 640 340, 660 360"
          fill="none"
          stroke="rgba(196,163,90,0.35)"
          strokeWidth="1.2"
        />
      </svg>
      <div className="absolute inset-3 -z-10 rounded-[1.35rem] border border-gold/25" />

      {card ? (
        <div className="absolute top-[8%] left-[7%] w-[60%] rotate-[-3deg] rounded-2xl bg-white p-4 shadow-[0_24px_60px_rgba(0,0,0,0.45)] sm:p-5">
          <div className="flex items-center justify-between text-[10px] font-bold tracking-wide sm:text-xs">
            <span className="text-gold-ink">《勸學》· {card.category}</span>
            <span className="rounded-full bg-navy px-2 py-0.5 text-cream">基礎</span>
          </div>
          <p className="mt-2.5 font-[family-name:var(--font-serif-zh)] text-[13px] leading-snug font-bold text-navy sm:text-base">
            {card.question}
          </p>
          <ul className="mt-3 space-y-1.5 text-[11px] sm:text-[13px]">
            {card.options.slice(0, 3).map((opt) => {
              const correct = opt === card.answer;
              return (
                <li
                  key={opt}
                  className={
                    correct
                      ? "rounded-lg border border-navy bg-navy/5 px-2.5 py-1.5 font-semibold text-navy"
                      : "rounded-lg border border-line px-2.5 py-1.5 text-ink-muted"
                  }
                >
                  {opt}
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      <div className="absolute right-[5%] bottom-[6%] w-[44%] rotate-[2deg] rounded-2xl bg-cream p-4 shadow-[0_18px_40px_rgba(0,0,0,0.35)] sm:p-5">
        <p className="font-[family-name:var(--font-serif-zh)] text-sm font-bold text-navy sm:text-base">
          診斷報告
        </p>
        <div className="mt-3 space-y-2.5">
          {[
            { label: "基礎文言", value: 82 },
            { label: "寫作手法", value: 64 },
            { label: "白話翻譯", value: 41 },
          ].map((row) => (
            <div key={row.label}>
              <div className="flex justify-between text-[10px] font-semibold text-ink-muted sm:text-xs">
                <span>{row.label}</span>
                <span>{row.value}%</span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-line">
                <div
                  className={row.value < 50 ? "h-full rounded-full bg-gold" : "h-full rounded-full bg-navy"}
                  style={{ width: `${row.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[10px] font-bold text-gold-ink sm:text-xs">
          弱項：白話翻譯 → 入錯題本重測
        </p>
      </div>
    </div>
  );
}
