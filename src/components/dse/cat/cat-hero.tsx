import { BarChart3, Lightbulb, Target, Zap } from "lucide-react";

const BADGES = [
  { icon: Zap, label: "約 15 題極速診斷" },
  { icon: Target, label: "動態適應演算法出題" },
  { icon: BarChart3, label: "篇章 × 技能雙維報告" },
  { icon: Lightbulb, label: "考評局高頻陷阱拆解" },
] as const;

/** USP hero — clean light EdTech branding. */
export function CatHero() {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white px-6 py-12 shadow-sm sm:px-12 sm:py-14">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_20%,rgba(99,102,241,0.12),transparent_42%),radial-gradient(circle_at_88%_10%,rgba(20,184,166,0.1),transparent_36%)]"
      />

      <div className="relative">
        <span className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-[11px] font-bold tracking-[0.16em] text-indigo-700 uppercase">
          全港首創 · HK&apos;s First
        </span>
        <h1 className="mt-5 max-w-3xl font-[family-name:var(--font-display)] text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl">
          全港首創 DSE 中文範文 3 分鐘極速診斷室
        </h1>
        <p className="mt-4 max-w-2xl text-base font-medium leading-relaxed text-slate-600 sm:text-lg">
          免刷 720 題！運用「動態適應演算法」，15
          題精準測出你的 DSE 預測等級、範文熟悉度與技能破綻。
        </p>
        <p className="mt-2 text-sm text-slate-500">
          又名：DSE 範文 AI 診斷室 — 本地規則引擎，零 API 成本。
        </p>

        <ul className="mt-8 flex flex-wrap gap-2.5">
          {BADGES.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 sm:text-sm"
            >
              <Icon className="size-3.5 text-indigo-600" />
              {label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
