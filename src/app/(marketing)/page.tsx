import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { createPageMetadata } from "@/lib/page-metadata";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";

export const metadata = createPageMetadata({
  title: `${SITE_NAME}｜用 AI Hack 穿你嘅 DSE 盲點`,
  description: `${SITE_NAME} — ${SITE_TAGLINE}。全港首創 AI CAT 適應性評估系統 ✕ 範文記憶閃卡，精準算出你嘅真心 Level。`,
  path: "/",
  keywords: [
    "DSE.hack",
    "DSE",
    "CAT",
    "適應性評估",
    "範文閃卡",
    "DSE 中文",
    "AI 診斷",
  ],
});

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-20 pt-8 sm:px-6 sm:pt-12">
      <div className="relative">
        {/* Outer cyan mesh glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-4 rounded-[2.5rem] bg-[radial-gradient(ellipse_at_20%_0%,rgba(0,242,254,0.35),transparent_50%),radial-gradient(ellipse_at_85%_20%,rgba(79,172,254,0.28),transparent_45%),radial-gradient(ellipse_at_50%_100%,rgba(0,242,254,0.12),transparent_50%)] opacity-80 blur-3xl"
        />

        <section className="relative isolate overflow-hidden rounded-3xl border border-gray-800 bg-[#070b14] px-6 py-14 shadow-2xl shadow-cyan-500/10 sm:rounded-[2rem] sm:px-12 sm:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(0,242,254,0.14),transparent_38%),radial-gradient(circle_at_90%_10%,rgba(79,172,254,0.12),transparent_36%),radial-gradient(circle_at_60%_95%,rgba(0,242,254,0.08),transparent_40%)]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.06)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]"
          />

          <div className="relative z-10">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-cyan-300 shadow-[0_0_24px_rgba(0,242,254,0.2)]">
              🚀 全港首創 AI CAT 適應性評估系統
            </span>

            <h1 className="mt-7 max-w-3xl font-[family-name:var(--font-display)] text-4xl font-extrabold leading-[1.15] tracking-tight text-white sm:text-5xl md:text-6xl">
              唔死背，唔盲目刷題。
              <br />
              <span className="bg-gradient-to-r from-cyan-300 via-[#00f2fe] to-[#4facfe] bg-clip-text text-transparent">
                用 AI 10 題 Hack 穿你嘅 DSE 盲點。
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
              專為 DSE 考生打造——結合 CAT (Computerized Adaptive Testing)
              智能演算法 ✕ 記憶閃卡，精準算出你嘅真心 Level，強行拉高 Cutoff。
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/dse/chinese/cat"
                className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#00f2fe] to-[#4facfe] px-6 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/30 transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-cyan-400/40"
              >
                ⚡️ 10 秒免費 CAT 評估
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/dse/chinese"
                className="inline-flex items-center gap-2 rounded-2xl border border-gray-700 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:border-cyan-400/40 hover:bg-white/10"
              >
                🔥 範文 Flashcard 專區
              </Link>
            </div>

            <p className="mt-6 text-xs font-medium text-slate-500 sm:text-sm">
              ✨ 零廣告 · 免費使用 · 支援手機 9:16 極速刷題
            </p>
          </div>
        </section>
      </div>

      <section className="mt-8 grid gap-4 md:grid-cols-2 md:gap-5">
        <Link
          href="/dse/chinese"
          className="group flex flex-col rounded-3xl border border-gray-800 bg-[#0a0f1a] p-7 shadow-sm transition-all duration-300 hover:border-cyan-400/30 hover:shadow-md hover:shadow-cyan-500/10 sm:p-8"
        >
          <h2 className="font-[family-name:var(--font-display)] text-xl font-extrabold tracking-tight text-white sm:text-2xl">
            ⚡️ 中文 12 篇範文極速爆破
          </h2>
          <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-400">
            獨家三階段記憶卡——字詞、語譯、考評局 Trap 一次過 Knockout。
          </p>
          <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-300">
            進入 Flashcard 專區
            <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </Link>

        <Link
          href="/dse/chinese/cat"
          className="group flex flex-col rounded-3xl border border-gray-800 bg-[#0a0f1a] p-7 shadow-sm transition-all duration-300 hover:border-cyan-400/30 hover:shadow-md hover:shadow-cyan-500/10 sm:p-8"
        >
          <h2 className="font-[family-name:var(--font-display)] text-xl font-extrabold tracking-tight text-white sm:text-2xl">
            🧠 範文 AI 診斷室 (CAT System)
          </h2>
          <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-400">
            全港首創適應性測評！約 10 題動態演算，1 秒找出弱點考點並預測 DSE
            等級。
          </p>
          <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-300">
            開始診斷
            <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </Link>
      </section>
    </div>
  );
}
