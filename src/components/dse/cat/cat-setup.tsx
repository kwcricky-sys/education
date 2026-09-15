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
          <h2 className="font-[family-name:var(--font-display)] text-lg font-bold text-slate-900">
            選擇診斷範圍
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-slate-600">
            已選 {selectedSlugs.length} 篇 · 題庫 {counts.total} 題
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/dse/chinese/error-notebook"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition-all duration-300 hover:border-blue-800/40 hover:text-blue-700"
          >
            <BookMarked className="size-3.5 text-blue-700" />
            錯題本
          </Link>
          <button
            type="button"
            onClick={selectAllTexts}
            className="rounded-lg border border-blue-700/25 bg-blue-700/10 px-3 py-2 text-xs font-semibold text-blue-700 transition-all duration-300 hover:bg-blue-700/15"
          >
            全範文綜合
          </button>
          <button
            type="button"
            onClick={() => useCatSession.setState({ selectedSlugs: [] })}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition-all duration-300 hover:text-slate-800"
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
                  ? "border-blue-700/60 bg-blue-700/5 shadow-blue-700/10"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-100",
              )}
            >
              <span
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-lg border text-xs font-bold",
                  selected
                    ? "border-blue-700/40 bg-blue-700/10 text-blue-700"
                    : "border-slate-200 bg-white text-slate-500",
                )}
              >
                {text.title.slice(0, 1)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-slate-900">
                  {text.title}
                </span>
                <span className="mt-0.5 block text-xs leading-relaxed text-slate-600">
                  {text.source}
                </span>
              </span>
              <span
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full border transition-all duration-300",
                  selected
                    ? "border-blue-700 bg-blue-700 text-white"
                    : "border-slate-300 text-transparent group-hover:border-slate-300",
                )}
              >
                <Check className="size-3.5" strokeWidth={3} />
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-lg backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-wide text-slate-500">
            診斷題數
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
                    ? "border border-blue-700 bg-blue-700/10 text-blue-700 shadow-[0_0_20px_rgba(29, 78, 216,0.2)]"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-800",
                )}
              >
                {n}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs leading-relaxed text-slate-500">
            能力穩定時可能提早結束（不少於 {CAT_MIN_ITEMS} 題）
          </p>
        </div>

        <button
          type="button"
          onClick={onStart}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-7 py-3.5 text-sm font-bold text-white shadow-[0_0_28px_rgba(29, 78, 216,0.35)] transition-all duration-300 hover:scale-[1.02] hover:bg-blue-600"
        >
          <Rocket className="size-4" />
          進入診斷室
        </button>
      </div>

      {error ? (
        <p className="rounded-xl border border-rose-700/20 bg-rose-700/10 px-4 py-3 text-sm leading-relaxed text-rose-700">
          {error}
        </p>
      ) : null}

      <section className="grid gap-4 md:grid-cols-5">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-lg md:col-span-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-blue-700/10 text-blue-700">
            <LineChart className="size-5" />
          </div>
          <h3 className="mt-4 font-[family-name:var(--font-display)] text-lg font-bold text-slate-900">
            視覺化掌握進度
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            診斷結束即輸出篇章 × 技能雙維雷達，一眼睇穿弱點考點與下一步專攻。
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 text-center shadow-lg md:col-span-2">
          <div className="mx-auto flex size-10 items-center justify-center rounded-lg bg-blue-700/10 text-blue-700">
            <Clock3 className="size-5" />
          </div>
          <h3 className="mt-4 text-sm font-semibold text-slate-700">
            平均完成時間
          </h3>
          <p className="mt-2 font-[family-name:var(--font-display)] text-4xl font-extrabold text-blue-700">
            3:42
          </p>
          <p className="mt-2 text-xs leading-relaxed text-slate-500">
            比盲目刷 720 題快 10 倍以上
          </p>
        </div>
      </section>
    </div>
  );
}
