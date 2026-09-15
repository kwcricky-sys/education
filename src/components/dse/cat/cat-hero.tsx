import { BarChart3, Clock3, Sparkles } from "lucide-react";

/** Centered CAT hero — Adaptive Engine mockup style. */
export function CatHero() {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center shadow-lg backdrop-blur-md sm:px-10 sm:py-14">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-10%,rgba(29, 78, 216,0.14),transparent_50%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
      />

      <div className="relative">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-700/30 bg-blue-700/10 px-3.5 py-1 text-[11px] font-bold tracking-[0.18em] text-blue-700 uppercase">
          <Sparkles className="size-3" />
          自適應引擎 V2.0
        </span>
        <h1 className="mt-5 font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          DSE 中文範文
        </h1>
        <p className="mt-2 font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight text-blue-700 sm:text-5xl">
          3 分鐘極速診斷室
        </p>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
          免適應演算法看人出題——約 10–15
          題精準測出預測等級、範文熟悉度與技能破綻。
        </p>

        <ul className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-500">
          <li className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5">
            <BarChart3 className="size-3.5 text-blue-700" />
            篇章 × 技能雙維報告
          </li>
          <li className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5">
            <Clock3 className="size-3.5 text-blue-700" />
            平均約 3–4 分鐘
          </li>
        </ul>
      </div>
    </section>
  );
}
