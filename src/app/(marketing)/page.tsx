import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { createPageMetadata } from "@/lib/page-metadata";
import { SITE_DESCRIPTION, SITE_KEYWORDS, SITE_TITLE } from "@/lib/site";

export const metadata = createPageMetadata({
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  path: "/",
  keywords: [...SITE_KEYWORDS],
});

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-20 pt-8 sm:px-6 sm:pt-12">
      <div className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-3 rounded-[2.5rem] bg-[radial-gradient(ellipse_at_20%_0%,rgba(29, 78, 216,0.18),transparent_50%),radial-gradient(ellipse_at_85%_15%,rgba(30, 64, 175,0.12),transparent_45%)] blur-3xl"
        />

        <section className="relative isolate overflow-hidden rounded-3xl border border-slate-200 bg-white px-6 py-14 shadow-2xl shadow-slate-900/5 sm:rounded-[2rem] sm:px-12 sm:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(29, 78, 216,0.1),transparent_40%),radial-gradient(circle_at_90%_10%,rgba(30, 64, 175,0.08),transparent_36%)]"
          />

          <div className="relative z-10">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-700/20 bg-blue-700/10 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-blue-700">
              🚀 全港首創 AI CAT 適應性評估系統
            </span>

            <h1 className="mt-7 max-w-3xl font-[family-name:var(--font-display)] text-4xl font-extrabold leading-[1.2] tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
              唔死背，唔盲目刷題。
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-900 bg-clip-text text-transparent">
                用 AI 10 題 Hack 穿你嘅 DSE 盲點。
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
              搵 DSE 補習之前，先用 CAT 自適應診斷 ✕ 12
              篇指定範文閃卡，精準算出你嘅真心 Level——免費、極速、專為香港考生。
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/dse/chinese/cat"
                className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-700 to-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-900/20 transition-all duration-300 hover:scale-[1.02] hover:brightness-110 hover:shadow-xl hover:shadow-blue-900/25"
              >
                ⚡️ 10 秒免費 CAT 評估
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/dse/chinese"
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-100 px-6 py-3.5 text-sm font-semibold text-slate-800 transition-all duration-300 hover:border-blue-800/40 hover:bg-slate-200"
              >
                🔥 範文 Flashcard 專區
              </Link>
            </div>

            <p className="mt-6 text-xs font-medium leading-relaxed text-slate-500 sm:text-sm">
              免費使用 · 本機進度 · 支援手機極速刷題 ·{" "}
              <Link
                href="/guides/dse-buxi"
                className="text-blue-700 underline-offset-2 hover:underline"
              >
                DSE 補習選擇指南
              </Link>
            </p>
          </div>
        </section>
      </div>

      <section className="mt-8 grid gap-4 md:grid-cols-2 md:gap-5">
        <Link
          href="/dse/chinese"
          className="group flex flex-col rounded-3xl border border-slate-200 bg-white p-7 shadow-lg transition-all duration-300 hover:border-slate-300 hover:bg-slate-100 hover:shadow-xl sm:p-8"
        >
          <h2 className="font-[family-name:var(--font-display)] text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
            ⚡️ 中文 12 篇範文極速爆破
          </h2>
          <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">
            獨家三階段記憶卡——字詞、語譯、考評局 Trap 一次過 Knockout。
          </p>
          <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700">
            進入 Flashcard 專區
            <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </Link>

        <Link
          href="/dse/chinese/cat"
          className="group flex flex-col rounded-3xl border border-slate-200 bg-white p-7 shadow-lg transition-all duration-300 hover:border-slate-300 hover:bg-slate-100 hover:shadow-xl sm:p-8"
        >
          <h2 className="font-[family-name:var(--font-display)] text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
            🧠 範文 AI 診斷室 (CAT System)
          </h2>
          <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">
            全港首創適應性測評！約 10 題動態演算，1 秒找出弱點考點並預測 DSE
            等級。
          </p>
          <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700">
            開始診斷
            <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </Link>
      </section>
    </div>
  );
}
