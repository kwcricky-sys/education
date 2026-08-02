import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Calculator,
  FileText,
  School,
  Sparkles,
} from "lucide-react";
import { LatestNewsCards } from "@/components/news/latest-news-cards";
import { getLatestSchoolNews } from "@/lib/news/fetch-news";
import { createPageMetadata } from "@/lib/page-metadata";
import { SITE_NAME, SITE_NAME_EN, SITE_TAGLINE } from "@/lib/site";

export const metadata = createPageMetadata({
  title: `${SITE_NAME}｜${SITE_TAGLINE}`,
  description: `${SITE_NAME}是${SITE_TAGLINE}，提供免費 DSE 中文閃卡、全港小學資料、小一派位計算器與直私報名情報。`,
  path: "/",
  keywords: [
    "學途",
    "香港一站式學習研究工作室",
    "DSE",
    "K3 選小學",
    "小一派位",
    "直資小學",
    "閃卡",
  ],
});

export const revalidate = 3600;

export default async function HomePage() {
  const news = await getLatestSchoolNews(6);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-20 pt-6 sm:px-6 sm:pt-10">
      <section className="relative min-h-[78vh] overflow-hidden rounded-[2rem] bg-[linear-gradient(145deg,#0b1220_0%,#132033_48%,#0c4a6e_120%)] px-6 py-14 text-white sm:px-12 sm:py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.28),transparent_42%),radial-gradient(circle_at_85%_30%,rgba(249,115,22,0.22),transparent_38%),radial-gradient(circle_at_60%_90%,rgba(14,165,233,0.18),transparent_40%)]"
        />
        <p className="anim-fade-up relative font-[family-name:var(--font-display)] text-xs font-semibold tracking-[0.28em] text-sky-300 uppercase">
          {SITE_NAME_EN}
        </p>
        <h1 className="anim-fade-up-delay relative mt-5 font-[family-name:var(--font-display)] text-6xl font-extrabold tracking-tight sm:text-7xl md:text-8xl">
          {SITE_NAME}
        </h1>
        <p className="anim-fade-up-delay-2 relative mt-5 max-w-xl text-lg font-medium text-sky-100/90 sm:text-2xl">
          {SITE_TAGLINE}
        </p>
        <p className="anim-fade-up-delay-2 relative mt-4 max-w-lg text-sm leading-relaxed text-slate-300 sm:text-base">
          從 K3 選小學到 DSE 備考——派位估算、學校 Insight、閃卡練習一站完成。
        </p>

        <div className="anim-fade-up-delay-2 relative mt-10 flex flex-wrap gap-3">
          <Link
            href="/calculator"
            className="btn-primary inline-flex items-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-semibold"
          >
            小一派位計算器
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/schools"
            className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
          >
            瀏覽 507 間小學
          </Link>
        </div>

        <div className="anim-fade-up-delay-2 relative mt-14 flex flex-wrap gap-6 text-xs text-slate-400 sm:gap-10">
          <span className="inline-flex items-center gap-2">
            <Sparkles className="size-3.5 text-sky-300" />
            0 Token 規則引擎
          </span>
          <span>廣東話獨家 Insight</span>
          <span>直私情報每日更新</span>
        </div>
      </section>

      <LatestNewsCards
        items={news.items}
        generatedAt={news.generatedAt}
      />

      <section className="mt-10 grid gap-4 md:grid-cols-2">
        <Link
          href="/dse"
          className="panel-lift group relative overflow-hidden rounded-[1.75rem] border border-[var(--ink-border)] bg-white p-7 shadow-sm sm:p-8"
        >
          <div className="relative flex size-12 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-600">
            <BookOpen className="size-5" />
          </div>
          <h2 className="relative mt-5 font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-[var(--ink-text)]">
            DSE 備考專區
          </h2>
          <p className="relative mt-3 text-sm leading-relaxed text-[var(--ink-muted)]">
            12 篇指定文言經典，每篇 60 題三階極速閃卡。
          </p>
          <span className="relative mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-sky-600">
            進入專區
            <ArrowRight className="size-3.5" />
          </span>
        </Link>

        <Link
          href="/schools"
          className="panel-lift group relative overflow-hidden rounded-[1.75rem] border border-[var(--ink-border)] bg-white/70 p-7 sm:p-8"
        >
          <div className="relative flex size-12 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500">
            <School className="size-5" />
          </div>
          <h2 className="relative mt-5 font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-[var(--ink-text)]">
            K3 選小學
          </h2>
          <p className="relative mt-3 text-sm leading-relaxed text-[var(--ink-muted)]">
            按校網／資助類別篩選，查看面試題庫與升中派位。
          </p>
          <span className="relative mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-orange-600">
            瀏覽學校
            <ArrowRight className="size-3.5" />
          </span>
        </Link>

        <Link
          href="/calculator"
          className="panel-lift group relative overflow-hidden rounded-[1.75rem] border border-[var(--ink-border)] bg-white p-7 sm:p-8"
        >
          <div className="relative flex size-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600">
            <Calculator className="size-5" />
          </div>
          <h2 className="relative mt-5 font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-[var(--ink-text)]">
            派位機率計算器
          </h2>
          <p className="relative mt-3 text-sm leading-relaxed text-[var(--ink-muted)]">
            6 題問答 + 36 種 Persona，即時輸出廣東話備戰報告。
          </p>
          <span className="relative mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600">
            開始估算
            <ArrowRight className="size-3.5" />
          </span>
        </Link>

        <Link
          href="/portfolio-builder"
          className="panel-lift group relative overflow-hidden rounded-[1.75rem] border border-[var(--ink-border)] bg-white/70 p-7 sm:p-8"
        >
          <div className="relative flex size-12 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-600">
            <FileText className="size-5" />
          </div>
          <h2 className="relative mt-5 font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-[var(--ink-text)]">
            叩門 Portfolio
          </h2>
          <p className="relative mt-3 text-sm leading-relaxed text-[var(--ink-muted)]">
            3 款 A4 模板，瀏覽器一鍵下載高清 PDF。
          </p>
          <span className="relative mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-violet-600">
            開始製作
            <ArrowRight className="size-3.5" />
          </span>
        </Link>
      </section>
    </div>
  );
}
