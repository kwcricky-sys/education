"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BookMarked, Check } from "lucide-react";
import { CatHero } from "@/components/dse/cat/cat-hero";
import { HowItWorks } from "@/components/dse/cat/how-it-works";
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
      <HowItWorks />

      <div className="flex flex-wrap gap-3">
        <Link
          href="/dse/chinese/error-notebook"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-300 shadow-lg transition-all duration-300 hover:border-cyan-500/40 hover:text-cyan-400"
        >
          <BookMarked className="size-3.5 text-cyan-400" />
          開啟錯題本
        </Link>
      </div>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-zinc-100">
            1. 選擇診斷範圍
          </h2>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={selectAllTexts}
              className="rounded-md border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-xs font-semibold text-cyan-400 transition-all duration-300 hover:bg-cyan-400/15"
            >
              全範文綜合
            </button>
            <button
              type="button"
              onClick={() => useCatSession.setState({ selectedSlugs: [] })}
              className="rounded-md border border-white/10 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-400 transition-all duration-300 hover:text-zinc-200"
            >
              清除
            </button>
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          {CHINESE_PRESCRIBED_TEXTS.map((text) => {
            const selected = selectedSlugs.includes(text.slug);
            return (
              <button
                key={text.slug}
                type="button"
                onClick={() => toggleText(text.slug)}
                className={cn(
                  "flex items-start gap-3 rounded-xl border px-4 py-3.5 text-left transition-all duration-300",
                  selected
                    ? "border-cyan-500/50 bg-cyan-400/10 shadow-lg"
                    : "border-white/5 bg-zinc-900 hover:border-white/10 hover:bg-zinc-800",
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border",
                    selected
                      ? "border-cyan-400 bg-cyan-400 text-zinc-950"
                      : "border-zinc-700 bg-zinc-800 text-transparent",
                  )}
                >
                  <Check className="size-3.5" strokeWidth={3} />
                </span>
                <span className="min-w-0">
                  <span className="block font-semibold text-zinc-100">
                    {text.title}
                  </span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-zinc-400">
                    {text.source}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <p className="text-sm leading-relaxed text-zinc-400">
          已選 {selectedSlugs.length} 篇 · 題庫{" "}
          <span className="font-medium text-zinc-200">{counts.total}</span>{" "}
          題（基礎 {counts.easy}／中等 {counts.medium}／高階 {counts.hard}）
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-zinc-100">
          2. 診斷題數
        </h2>
        <div className="flex flex-wrap gap-2">
          {[CAT_MIN_ITEMS, CAT_DEFAULT_TARGET, CAT_MAX_ITEMS].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setTargetCount(n)}
              className={cn(
                "rounded-md px-4 py-2 text-sm font-semibold transition-all duration-300",
                targetCount === n
                  ? "bg-cyan-400 text-zinc-950 shadow-lg shadow-cyan-400/20"
                  : "border border-white/10 bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200",
              )}
            >
              {n} 題
            </button>
          ))}
        </div>
        <p className="text-xs leading-relaxed text-zinc-500">
          演算法判斷能力已穩定時，可能提早結束（不少於 {CAT_MIN_ITEMS} 題）。
        </p>
      </section>

      {error ? (
        <p className="rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm leading-relaxed text-rose-300">
          {error}
        </p>
      ) : null}

      <button
        type="button"
        onClick={onStart}
        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-400 px-5 py-3.5 text-sm font-bold text-zinc-950 shadow-lg shadow-cyan-400/20 transition-all duration-300 hover:bg-cyan-300 sm:w-auto"
      >
        進入診斷室，開始測驗
      </button>
    </div>
  );
}
