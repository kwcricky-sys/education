"use client";

import { useMemo, useState } from "react";
import { Activity, Check, Layers } from "lucide-react";
import { countPoolByDifficulty, buildCatPool } from "@/lib/dse/cat/pool";
import { CAT_DEFAULT_TARGET, CAT_MAX_ITEMS, CAT_MIN_ITEMS } from "@/lib/dse/cat/types";
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
      <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-900/80 via-[#0b1220] to-sky-950/40 px-6 py-10 sm:px-10">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-sky-400/15 blur-3xl"
        />
        <p className="text-xs font-semibold tracking-[0.22em] text-sky-300 uppercase">
          Computerized Adaptive Testing
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-white sm:text-4xl">
          中文指定範文 · 自適應診斷測驗
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
          系統會依你的答題表現動態調整難度（基礎／中等／高階），約{" "}
          {CAT_MIN_ITEMS}–{CAT_MAX_ITEMS}{" "}
          題後產出 DSE 等級估算、能力雷達與弱點檢討。
        </p>
        <ul className="mt-6 flex flex-wrap gap-3 text-xs text-slate-400">
          <li className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 ring-1 ring-white/10">
            <Activity className="size-3.5 text-sky-300" />
            簡化 IRT 能力值 θ
          </li>
          <li className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 ring-1 ring-white/10">
            <Layers className="size-3.5 text-orange-300" />
            多範文題庫混合出題
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-white">
            1. 選擇測試範圍
          </h2>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={selectAllTexts}
              className="rounded-full bg-sky-400/15 px-3 py-1.5 text-xs font-semibold text-sky-300 ring-1 ring-sky-400/25 transition hover:bg-sky-400/25"
            >
              全範文綜合
            </button>
            <button
              type="button"
              onClick={() =>
                useCatSession.setState({ selectedSlugs: [] })
              }
              className="rounded-full bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-400 ring-1 ring-white/10 transition hover:text-white"
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
                  "flex items-start gap-3 rounded-2xl border px-4 py-3.5 text-left transition",
                  selected
                    ? "border-sky-400/40 bg-sky-400/10"
                    : "border-white/8 bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]",
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md ring-1",
                    selected
                      ? "bg-sky-400 text-slate-950 ring-sky-300"
                      : "bg-transparent text-transparent ring-white/20",
                  )}
                >
                  <Check className="size-3.5" strokeWidth={3} />
                </span>
                <span className="min-w-0">
                  <span className="block font-semibold text-white">
                    {text.title}
                  </span>
                  <span className="mt-0.5 block text-xs text-slate-500">
                    {text.source}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <p className="text-sm text-slate-500">
          已選 {selectedSlugs.length} 篇 · 題庫{" "}
          <span className="font-medium text-slate-300">{counts.total}</span>{" "}
          題（基礎 {counts.easy}／中等 {counts.medium}／高階 {counts.hard}）
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-white">
          2. 題數目標
        </h2>
        <div className="flex flex-wrap gap-2">
          {[CAT_MIN_ITEMS, CAT_DEFAULT_TARGET, CAT_MAX_ITEMS].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setTargetCount(n)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold transition",
                targetCount === n
                  ? "bg-sky-400 text-slate-950"
                  : "bg-white/5 text-slate-400 ring-1 ring-white/10 hover:text-white",
              )}
            >
              {n} 題
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-500">
          能力值穩定時可能提早結束（不少於 {CAT_MIN_ITEMS} 題）。
        </p>
      </section>

      {error ? (
        <p className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </p>
      ) : null}

      <button
        type="button"
        onClick={onStart}
        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-sky-400 px-5 py-3.5 text-sm font-bold text-slate-950 shadow-[0_12px_40px_rgba(56,189,248,0.28)] transition hover:bg-sky-300 sm:w-auto"
      >
        開始自適應測驗
      </button>
    </div>
  );
}
