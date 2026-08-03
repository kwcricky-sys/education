"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  BookMarked,
  Check,
  Clock3,
  LineChart,
  Rocket,
} from "lucide-react";
import { CatHero } from "@/components/dse/cat/cat-hero";
import { countPoolByDifficulty, buildCatPool } from "@/lib/dse/cat/pool";
import {
  CAT_DEFAULT_TARGET,
  CAT_MAX_ITEMS,
  CAT_MIN_ITEMS,
} from "@/lib/dse/cat/types";
import { CHINESE_PRESCRIBED_TEXTS } from "@/lib/dse/texts";
import { useCatSession } from "@/store/cat-session";
import { cn } from "@/lib/utils";

export function CatSetup() {
  const selectedSlugs = useCatSession((s) => s.selectedSlugs);
  const targetCount = useCatSession((s) => s.targetCount);
  const toggleText = useCatSession((s) => s.toggleText);
  const selectAllTexts = useCatSession((s) => s.selectAllTexts);
  const setTargetCount = useCatSession((s) => s.setTargetCount);
  const startSession = useCatSession((s) => s.startSession);
  const [error, setError] = useState<string | null>(null);

  const counts = useMemo(
    () => countPoolByDifficulty(buildCatPool(selectedSlugs)),
    [selectedSlugs],
  );

  const onStart = () => {
    const result = startSession();
    if (!result.ok) setError(result.error);
    else setError(null);
  };

  return (
    <div className="space-y-8">
      <CatHero />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-lg font-bold text-zinc-100">
            選擇診斷範圍
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-zinc-400">
            已選 {selectedSlugs.length} 篇 · 題庫 {counts.total} 題
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/dse/chinese/error-notebook"
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-xs font-medium text-zinc-300 transition-all duration-300 hover:border-cyan-500/40 hover:text-cyan-400"
          >
            <BookMarked className="size-3.5 text-cyan-400" />
            錯題本
          </Link>
          <button
            type="button"
            onClick={selectAllTexts}
            className="rounded-lg border border-cyan-400/25 bg-cyan-400/10 px-3 py-2 text-xs font-semibold text-cyan-400 transition-all duration-300 hover:bg-cyan-400/15"
          >
            全範文綜合
          </button>
          <button
            type="button"
            onClick={() => useCatSession.setState({ selectedSlugs: [] })}
            className="rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-xs font-medium text-zinc-400 transition-all duration-300 hover:text-zinc-200"
          >
            清除
          </button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {CHINESE_PRESCRIBED_TEXTS.map((text) => {
          const selected = selectedSlugs.includes(text.slug);
          return (
            <button
              key={text.slug}
              type="button"
              onClick={() => toggleText(text.slug)}
              className={cn(
                "group flex items-center gap-3 rounded-xl border p-4 text-left shadow-lg transition-all duration-300",
                selected
                  ? "border-cyan-400/60 bg-cyan-400/5 shadow-cyan-400/10"
                  : "border-white/10 bg-zinc-900 hover:border-white/15 hover:bg-zinc-800/80",
              )}
            >
              <span
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-lg border text-xs font-bold",
                  selected
                    ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-400"
                    : "border-white/10 bg-zinc-950 text-zinc-500",
                )}
              >
                {text.title.slice(0, 1)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-zinc-100">
                  {text.title}
                </span>
                <span className="mt-0.5 block text-xs leading-relaxed text-zinc-400">
                  {text.source}
                </span>
              </span>
              <span
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full border transition-all duration-300",
                  selected
                    ? "border-cyan-400 bg-cyan-400 text-zinc-950"
                    : "border-zinc-600 text-transparent group-hover:border-zinc-500",
                )}
              >
                <Check className="size-3.5" strokeWidth={3} />
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-4 rounded-xl border border-white/10 bg-zinc-900/80 p-5 shadow-lg backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.16em] text-zinc-500 uppercase">
            Question Count
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {[CAT_MIN_ITEMS, CAT_DEFAULT_TARGET, CAT_MAX_ITEMS].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setTargetCount(n)}
                className={cn(
                  "min-w-14 rounded-lg px-4 py-2 text-sm font-bold transition-all duration-300",
                  targetCount === n
                    ? "border border-cyan-400 bg-cyan-400/10 text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.2)]"
                    : "border border-white/10 bg-zinc-950 text-zinc-400 hover:border-white/20 hover:text-zinc-200",
                )}
              >
                {n}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs leading-relaxed text-zinc-500">
            能力穩定時可能提早結束（不少於 {CAT_MIN_ITEMS} 題）
          </p>
        </div>

        <button
          type="button"
          onClick={onStart}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-7 py-3.5 text-sm font-bold text-zinc-950 shadow-[0_0_28px_rgba(34,211,238,0.35)] transition-all duration-300 hover:scale-[1.02] hover:bg-cyan-300"
        >
          <Rocket className="size-4" />
          進入診斷室
        </button>
      </div>

      {error ? (
        <p className="rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm leading-relaxed text-rose-300">
          {error}
        </p>
      ) : null}

      <section className="grid gap-4 md:grid-cols-5">
        <div className="rounded-xl border border-white/10 bg-zinc-900 p-5 shadow-lg md:col-span-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-400">
            <LineChart className="size-5" />
          </div>
          <h3 className="mt-4 font-[family-name:var(--font-display)] text-lg font-bold text-zinc-100">
            視覺化掌握進度
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-zinc-400">
            診斷結束即輸出篇章 × 技能雙維雷達，一眼睇穿弱點考點與下一步專攻。
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-zinc-900 p-5 text-center shadow-lg md:col-span-2">
          <div className="mx-auto flex size-10 items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-400">
            <Clock3 className="size-5" />
          </div>
          <h3 className="mt-4 text-sm font-semibold text-zinc-300">
            平均完成時間
          </h3>
          <p className="mt-2 font-[family-name:var(--font-display)] text-4xl font-extrabold text-cyan-400">
            3:42
          </p>
          <p className="mt-2 text-xs leading-relaxed text-zinc-500">
            比盲目刷 720 題快 10 倍以上
          </p>
        </div>
      </section>
    </div>
  );
}
