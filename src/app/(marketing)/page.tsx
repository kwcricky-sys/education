import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { createPageMetadata } from "@/lib/page-metadata";
import { SITE_DESCRIPTION, SITE_TITLE } from "@/lib/site";

export const metadata = createPageMetadata({
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  path: "/",
  keywords: [
    "DSE.hack",
    "DSE",
    "CAT",
    "適應性評估",
    "範文閃卡",
    "Flashcards",
    "DSE 中文",
    "文言文",
    "AI 診斷",
    "5**",
  ],
});

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-20 pt-8 sm:px-6 sm:pt-12">
      <div className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-3 rounded-[2.5rem] bg-[radial-gradient(ellipse_at_20%_0%,rgba(34,211,238,0.18),transparent_50%),radial-gradient(ellipse_at_85%_15%,rgba(6,182,212,0.12),transparent_45%)] blur-3xl"
        />

        <section className="relative isolate overflow-hidden rounded-3xl border border-white/10 bg-zinc-900 px-6 py-14 shadow-2xl shadow-black/20 sm:rounded-[2rem] sm:px-12 sm:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(34,211,238,0.1),transparent_40%),radial-gradient(circle_at_90%_10%,rgba(6,182,212,0.08),transparent_36%)]"
          />

          <div className="relative z-10">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-cyan-400">
              🚀 全港首創 AI CAT 適應性評估系統
            </span>

            <h1 className="mt-7 max-w-3xl font-[family-name:var(--font-display)] text-4xl font-extrabold leading-[1.2] tracking-tight text-zinc-100 sm:text-5xl md:text-6xl">
              唔死背，唔盲目刷題。
              <br />
              <span className="bg-gradient-to-r from-cyan-300 via-cyan-400 to-sky-400 bg-clip-text text-transparent">
                用 AI 10 題 Hack 穿你嘅 DSE 盲點。
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">
              專為 DSE 考生打造——結合 CAT (Computerized Adaptive Testing)
              智能演算法 ✕ 記憶閃卡，精準算出你嘅真心 Level，強行拉高 Cutoff。
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/dse/chinese/cat"
                className="group inline-flex items-center gap-2 rounded-2xl bg-cyan-400 px-6 py-3.5 text-sm font-bold text-zinc-950 shadow-lg shadow-cyan-400/20 transition-all duration-300 hover:scale-[1.02] hover:bg-cyan-300 hover:shadow-xl hover:shadow-cyan-400/30"
              >
                ⚡️ 10 秒免費 CAT 評估
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/dse/chinese"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-zinc-800/50 px-6 py-3.5 text-sm font-semibold text-zinc-200 transition-all duration-300 hover:border-cyan-500/40 hover:bg-zinc-800"
              >
                🔥 範文 Flashcard 專區
              </Link>
            </div>

            <p className="mt-6 text-xs font-medium leading-relaxed text-zinc-500 sm:text-sm">
              ✨ 零廣告 · 免費使用 · 支援手機 9:16 極速刷題
            </p>
          </div>
        </section>
      </div>

      <section className="mt-8 grid gap-4 md:grid-cols-2 md:gap-5">
        <Link
          href="/dse/chinese"
          className="group flex flex-col rounded-3xl border border-white/10 bg-zinc-900 p-7 shadow-lg transition-all duration-300 hover:border-white/15 hover:bg-zinc-800/80 hover:shadow-xl sm:p-8"
        >
          <h2 className="font-[family-name:var(--font-display)] text-xl font-extrabold tracking-tight text-zinc-100 sm:text-2xl">
            ⚡️ 中文 12 篇範文極速爆破
          </h2>
          <p className="mt-3 flex-1 text-sm leading-relaxed text-zinc-400">
            獨家三階段記憶卡——字詞、語譯、考評局 Trap 一次過 Knockout。
          </p>
          <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-400">
            進入 Flashcard 專區
            <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </Link>

        <Link
          href="/dse/chinese/cat"
          className="group flex flex-col rounded-3xl border border-white/10 bg-zinc-900 p-7 shadow-lg transition-all duration-300 hover:border-white/15 hover:bg-zinc-800/80 hover:shadow-xl sm:p-8"
        >
          <h2 className="font-[family-name:var(--font-display)] text-xl font-extrabold tracking-tight text-zinc-100 sm:text-2xl">
            🧠 範文 AI 診斷室 (CAT System)
          </h2>
          <p className="mt-3 flex-1 text-sm leading-relaxed text-zinc-400">
            全港首創適應性測評！約 10 題動態演算，1 秒找出弱點考點並預測 DSE
            等級。
          </p>
          <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-400">
            開始診斷
            <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </Link>
      </section>
    </div>
  );
}
