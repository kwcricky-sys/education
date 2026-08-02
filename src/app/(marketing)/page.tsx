import Link from "next/link";
import { ArrowRight, BookOpen, Sparkles, Target } from "lucide-react";
import { createPageMetadata } from "@/lib/page-metadata";
import { SITE_NAME, SITE_NAME_EN, SITE_TAGLINE } from "@/lib/site";

export const metadata = createPageMetadata({
  title: `${SITE_NAME}｜${SITE_TAGLINE}`,
  description: `${SITE_NAME}是${SITE_TAGLINE}，提供免費 DSE 中文 12 篇指定範文閃卡練習與 AI 診斷室。`,
  path: "/",
  keywords: [
    "學途",
    "香港一站式學習研究工作室",
    "DSE",
    "DSE 中文",
    "指定範文",
    "閃卡",
    "自適應診斷",
  ],
});

export default function HomePage() {
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
          專注 DSE 備考——指定範文閃卡、自適應診斷室，把練習做快、做準。
        </p>

        <div className="anim-fade-up-delay-2 relative mt-10 flex flex-wrap gap-3">
          <Link
            href="/dse"
            className="btn-primary inline-flex items-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-semibold"
          >
            開始 DSE 練習
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/dse/chinese/cat"
            className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
          >
            範文 AI 診斷室
          </Link>
        </div>

        <div className="anim-fade-up-delay-2 relative mt-14 flex flex-wrap gap-6 text-xs text-slate-400 sm:gap-10">
          <span className="inline-flex items-center gap-2">
            <Sparkles className="size-3.5 text-sky-300" />
            720+ 文言閃卡
          </span>
          <span>三階難度 · 即開即練</span>
          <span>進度只留在本機</span>
        </div>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-2">
        <Link
          href="/dse/chinese"
          className="panel-lift group relative overflow-hidden rounded-[1.75rem] border border-[var(--ink-border)] bg-white p-7 shadow-sm sm:p-8"
        >
          <div className="relative flex size-12 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-600">
            <BookOpen className="size-5" />
          </div>
          <h2 className="relative mt-5 font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-[var(--ink-text)]">
            中文 12 篇指定範文
          </h2>
          <p className="relative mt-3 text-sm leading-relaxed text-[var(--ink-muted)]">
            每篇 60 題三階極速閃卡——字詞、通假、句譯與考評要點一次刷齊。
          </p>
          <span className="relative mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-sky-600">
            進入專區
            <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" />
          </span>
        </Link>

        <Link
          href="/dse/chinese/cat"
          className="panel-lift group relative overflow-hidden rounded-[1.75rem] border border-[var(--ink-border)] bg-white/70 p-7 sm:p-8"
        >
          <div className="relative flex size-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600">
            <Target className="size-5" />
          </div>
          <h2 className="relative mt-5 font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-[var(--ink-text)]">
            範文 AI 診斷室
          </h2>
          <p className="relative mt-3 text-sm leading-relaxed text-[var(--ink-muted)]">
            約 15 題自適應診斷，找出弱點考點與預測等級。
          </p>
          <span className="relative mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600">
            開始診斷
            <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" />
          </span>
        </Link>
      </section>
    </div>
  );
}
