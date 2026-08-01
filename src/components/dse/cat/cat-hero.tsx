import { BarChart3, Lightbulb, Target, Zap } from "lucide-react";

const BADGES = [
  { icon: Zap, label: "約 15 題極速診斷" },
  { icon: Target, label: "動態適應演算法出題" },
  { icon: BarChart3, label: "多維度雷達圖報告" },
  { icon: Lightbulb, label: "考評局高頻陷阱拆解" },
] as const;

/** USP hero — student-friendly branding (no jargon "CAT"). */
export function CatHero() {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(145deg,#0b1220_0%,#132033_42%,#0c4a6e_100%)] px-6 py-12 sm:px-12 sm:py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(56,189,248,0.28),transparent_40%),radial-gradient(circle_at_88%_25%,rgba(249,115,22,0.22),transparent_36%),radial-gradient(circle_at_50%_100%,rgba(251,191,36,0.12),transparent_40%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-8 top-10 hidden h-56 w-56 rounded-full border border-white/10 sm:block anim-float"
      />

      <div className="relative">
        <span className="inline-flex items-center rounded-full bg-orange-400/15 px-3 py-1 text-[11px] font-bold tracking-[0.18em] text-orange-300 ring-1 ring-orange-400/30 uppercase">
          全港首創 · HK&apos;s First
        </span>
        <h1 className="mt-5 max-w-3xl font-[family-name:var(--font-display)] text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl md:text-[2.65rem]">
          全港首創 DSE 中文範文 3 分鐘極速診斷室
        </h1>
        <p className="mt-5 max-w-2xl text-base font-medium leading-relaxed text-sky-100/90 sm:text-lg">
          免刷 720 題！運用「動態適應演算法」，15
          題精準測出你的 DSE 預測等級與知識盲區。
        </p>
        <p className="mt-3 text-sm text-slate-400">
          又名：DSE 範文 AI 診斷室 — 本地規則引擎，零 API 成本。
        </p>

        <ul className="mt-8 flex flex-wrap gap-2.5">
          {BADGES.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-semibold text-slate-100 backdrop-blur sm:text-sm"
            >
              <Icon className="size-3.5 text-sky-300" />
              {label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
