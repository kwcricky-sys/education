import Link from "next/link";
import {
  ArrowRight,
  BookMarked,
  BookOpen,
  Calculator,
  Clock3,
  Globe2,
  Languages,
  Sparkles,
  Zap,
} from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { DSE_SUBJECTS } from "@/lib/dse/subjects";
import { createPageMetadata } from "@/lib/page-metadata";
import { buildBreadcrumbJsonLd } from "@/lib/seo";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";

export const metadata = createPageMetadata({
  title: `DSE 學習與備考專區 | ${SITE_NAME}`,
  description: `${SITE_NAME}｜${SITE_TAGLINE}。中文科 12 篇指定文言經典閃卡已上線，其餘科目陸續推出。`,
  path: "/dse",
  keywords: ["DSE", "DSE 備考", "中文科", "指定範文", "閃卡", "DSE.hack"],
});

const SUBJECT_META: Record<
  string,
  { icon: typeof Languages; accent: string; bar: string }
> = {
  chinese: {
    icon: BookOpen,
    accent: "text-sky-400 bg-sky-400/10 ring-sky-400/20",
    bar: "bg-sky-500",
  },
  english: {
    icon: Languages,
    accent: "text-emerald-400 bg-emerald-400/10 ring-emerald-400/20",
    bar: "bg-emerald-500",
  },
  math: {
    icon: Calculator,
    accent: "text-zinc-300 bg-zinc-800 ring-white/10",
    bar: "bg-zinc-500",
  },
  others: {
    icon: Globe2,
    accent: "text-rose-400 bg-rose-400/10 ring-rose-400/20",
    bar: "bg-rose-400",
  },
};

const STATS = [
  { label: "FLASHCARDS", value: "720+", tone: "text-sky-400" },
  { label: "CAT DIAGNOSTICS", value: "本地引擎", tone: "text-emerald-400" },
  { label: "範文覆蓋", value: "12 篇", tone: "text-zinc-100" },
  { label: "DAYS TO EXAM", value: "備戰中", tone: "text-rose-400" },
] as const;

export default function DseHomePage() {
  return (
    <div className="space-y-10">
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "首頁", path: "/" },
          { name: "DSE 備考", path: "/dse" },
        ])}
      />

      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/80 px-6 py-14 text-center shadow-lg backdrop-blur-md sm:px-12 sm:py-16">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(56,189,248,0.16),transparent_55%),radial-gradient(ellipse_at_80%_80%,rgba(99,102,241,0.08),transparent_45%)]"
        />
        <div className="relative">
          <span className="inline-flex items-center rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 text-[11px] font-bold tracking-[0.18em] text-sky-300 uppercase">
            2025 EXAM SEASON
          </span>
          <h1 className="mt-5 font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight text-zinc-100 sm:text-5xl">
            DSE 學習與備考專區
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">
            結合 AI 適應性測評與極速記憶閃卡——精準定位盲點，強行拉高
            Cutoff。中文科 12 篇指定範文已全部開放。
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/dse/chinese"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 px-6 py-3 text-sm font-bold text-zinc-950 shadow-lg shadow-sky-500/25 transition-all duration-300 hover:scale-[1.02] hover:brightness-110"
            >
              進入中文科
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/dse/chinese/cat"
              className="inline-flex items-center gap-2 rounded-xl border border-sky-400/40 bg-zinc-950/40 px-6 py-3 text-sm font-semibold text-zinc-100 transition-all duration-300 hover:border-sky-400/70 hover:bg-zinc-900"
            >
              <Zap className="size-4 text-sky-400" />
              範文 AI 診斷室
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-white/10 bg-zinc-900 px-5 py-4 shadow-lg"
          >
            <p className="text-[10px] font-semibold tracking-[0.2em] text-zinc-500 uppercase">
              {s.label}
            </p>
            <p
              className={`mt-2 font-[family-name:var(--font-display)] text-2xl font-extrabold ${s.tone}`}
            >
              {s.value}
            </p>
          </div>
        ))}
      </section>

      {/* Subjects */}
      <section className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-zinc-100 sm:text-2xl">
            主修與選修科目
          </h2>
          <span className="text-xs font-medium text-zinc-500">View All</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {DSE_SUBJECTS.map((s) => {
            const meta = SUBJECT_META[s.id] ?? SUBJECT_META.others;
            const Icon = meta.icon;
            const card = (
              <div className="relative flex items-start gap-4 overflow-hidden rounded-xl border border-white/10 bg-zinc-900 p-5 shadow-lg transition-all duration-300 hover:border-white/15 hover:bg-zinc-800/80">
                <span
                  aria-hidden
                  className={`absolute inset-y-3 left-0 w-1 rounded-full ${meta.bar}`}
                />
                <span
                  className={`ml-1 flex size-11 shrink-0 items-center justify-center rounded-xl ring-1 ${meta.accent}`}
                >
                  <Icon className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-zinc-100">{s.name}</span>
                    {s.open ? (
                      <span className="rounded-md bg-emerald-400/10 px-2 py-0.5 text-[10px] font-bold tracking-wide text-emerald-400 uppercase">
                        Open
                      </span>
                    ) : (
                      <span className="rounded-md bg-zinc-800 px-2 py-0.5 text-[10px] font-bold tracking-wide text-zinc-500 uppercase">
                        Soon
                      </span>
                    )}
                  </span>
                  <span className="mt-0.5 block text-xs text-zinc-500">
                    {s.nameEn}
                  </span>
                  <span className="mt-2 block text-sm leading-relaxed text-zinc-400">
                    {s.desc}
                  </span>
                </span>
                {s.open ? (
                  <ArrowRight className="mt-1 size-4 shrink-0 text-zinc-500" />
                ) : null}
              </div>
            );

            if (s.open && s.href) {
              return (
                <Link key={s.id} href={s.href} className="block">
                  {card}
                </Link>
              );
            }
            return (
              <div key={s.id} className="opacity-70">
                {card}
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom features */}
      <section className="grid gap-4 lg:grid-cols-5">
        <div className="rounded-xl border border-white/10 bg-zinc-900 p-6 shadow-lg lg:col-span-3">
          <div className="flex items-center gap-2 text-cyan-400">
            <Sparkles className="size-4" />
            <p className="text-xs font-bold tracking-[0.16em] uppercase">
              AI Report
            </p>
          </div>
          <h3 className="mt-3 font-[family-name:var(--font-display)] text-xl font-bold text-zinc-100">
            個人化 AI 學習報告
          </h3>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-zinc-400">
            完成 CAT 診斷後，即時拆解篇章熟悉度與技能破綻，給你下一步專攻路線。
          </p>
          <Link
            href="/dse/chinese/cat"
            className="mt-6 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-zinc-950/60 px-4 py-2.5 text-sm font-semibold text-zinc-200 transition-all duration-300 hover:border-cyan-500/40 hover:text-cyan-400"
          >
            立即查看報告
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        <div className="rounded-xl border border-white/10 bg-zinc-900 p-6 shadow-lg lg:col-span-2">
          <div className="flex items-center gap-2 text-emerald-400">
            <BookMarked className="size-4" />
            <p className="text-xs font-bold tracking-[0.16em] uppercase">
              Progress
            </p>
          </div>
          <h3 className="mt-3 font-[family-name:var(--font-display)] text-xl font-bold text-zinc-100">
            進度排行榜
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-zinc-400">
            本機進度私密保存——零登入、零雲端同步壓力。
          </p>
          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between text-xs text-zinc-500">
              <span>Flashcard Ready</span>
              <span className="font-medium text-zinc-300">本地就緒</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
              <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400" />
            </div>
            <p className="mt-3 flex items-center gap-2 text-xs text-zinc-500">
              <Clock3 className="size-3.5" />
              即開即練 · 支援手機 9:16
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
