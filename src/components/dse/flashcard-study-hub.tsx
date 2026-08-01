"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  List,
  RotateCcw,
  X,
} from "lucide-react";
import {
  DIFFICULTY_LABEL,
  filterQuizQuestions,
  type QuizDifficulty,
  type QuizQuestion,
} from "@/lib/dse/types";
import { cn } from "@/lib/utils";

type Mode = "flash" | "list";
type Filter = QuizDifficulty | "all";

export function FlashcardStudyHub({
  questions,
}: {
  questions: QuizQuestion[];
}) {
  const [filter, setFilter] = useState<Filter>("all");
  const [mode, setMode] = useState<Mode>("flash");
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [missed, setMissed] = useState<Set<string>>(() => new Set());
  const [known, setKnown] = useState<Set<string>>(() => new Set());

  const filtered = useMemo(
    () => filterQuizQuestions(questions, filter),
    [questions, filter],
  );

  const current = filtered[index] ?? null;
  const total = filtered.length;
  const progress = total === 0 ? 0 : ((index + 1) / total) * 100;

  const go = useCallback(
    (next: number) => {
      if (total === 0) return;
      const clamped = ((next % total) + total) % total;
      setIndex(clamped);
      setFlipped(false);
    },
    [total],
  );

  useEffect(() => {
    setIndex(0);
    setFlipped(false);
  }, [filter]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (mode !== "flash") return;
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.code === "Space") {
        e.preventDefault();
        setFlipped((v) => !v);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        go(index + 1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(index - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, index, mode]);

  const markMissed = () => {
    if (!current) return;
    setMissed((prev) => new Set(prev).add(current.id));
    setKnown((prev) => {
      const next = new Set(prev);
      next.delete(current.id);
      return next;
    });
    go(index + 1);
  };

  const markKnown = () => {
    if (!current) return;
    setKnown((prev) => new Set(prev).add(current.id));
    setMissed((prev) => {
      const next = new Set(prev);
      next.delete(current.id);
      return next;
    });
    go(index + 1);
  };

  const resetSession = () => {
    setMissed(new Set());
    setKnown(new Set());
    setIndex(0);
    setFlipped(false);
  };

  const jumpTo = (id: string) => {
    const i = filtered.findIndex((q) => q.id === id);
    if (i < 0) return;
    setMode("flash");
    setIndex(i);
    setFlipped(false);
  };

  const filters: Filter[] = ["all", "easy", "medium", "hard"];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div
          role="tablist"
          aria-label="難度篩選"
          className="flex flex-wrap gap-1.5"
        >
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              role="tab"
              aria-selected={filter === f}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition",
                filter === f
                  ? "bg-sky-400 text-slate-950"
                  : "bg-white/5 text-slate-400 ring-1 ring-white/10 hover:text-white",
              )}
            >
              {DIFFICULTY_LABEL[f].zh}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMode(mode === "flash" ? "list" : "flash")}
            className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 text-sm text-slate-300 ring-1 ring-white/10 transition hover:text-white"
          >
            <List className="size-3.5" />
            {mode === "flash" ? "題目總覽" : "閃卡模式"}
          </button>
          <button
            type="button"
            onClick={resetSession}
            className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 text-sm text-slate-300 ring-1 ring-white/10 transition hover:text-white"
            title="重置本節進度"
          >
            <RotateCcw className="size-3.5" />
            重置
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-zinc-500">
          <span>
            {total === 0 ? "沒有題目" : `${index + 1} / ${total}`}
          </span>
          <span>
            記牢 {known.size} · 記錯 {missed.size}
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-zinc-800">
          <div
            className="dse-progress h-full rounded-full transition-[width] duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {mode === "flash" && current ? (
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => setFlipped((v) => !v)}
            className="group relative mx-auto block w-full max-w-2xl text-left outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            style={{ perspective: 1200 }}
            aria-label={flipped ? "顯示題目" : "顯示答案"}
          >
            <div className="relative h-[min(420px,58vh)] w-full">
              <div className={cn("dse-flip-inner", flipped && "is-flipped")}>
                <div className="dse-card-face flex flex-col rounded-3xl border border-white/10 bg-gradient-to-b from-slate-900 to-[#0b1220] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.45)] sm:p-8">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-slate-400 ring-1 ring-white/10">
                      {current.id}
                    </span>
                    <span
                      className={cn(
                        "rounded-full bg-white/5 px-2.5 py-0.5 font-medium ring-1 ring-white/10",
                        DIFFICULTY_LABEL[current.difficulty].className,
                      )}
                    >
                      {DIFFICULTY_LABEL[current.difficulty].zh}
                    </span>
                    <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-slate-400 ring-1 ring-white/10">
                      {current.category}
                    </span>
                  </div>
                  <p className="mt-6 flex-1 text-base leading-relaxed text-slate-50 sm:text-lg">
                    {current.question}
                  </p>
                  <ul className="mt-4 space-y-1.5 text-sm text-slate-400">
                    {current.options.map((opt) => (
                      <li key={opt}>{opt}</li>
                    ))}
                  </ul>
                  <p className="mt-auto pt-6 text-center text-xs text-slate-600">
                    點擊或按 Space 翻牌
                  </p>
                </div>

                <div className="dse-card-face dse-card-back flex flex-col rounded-3xl border border-sky-400/30 bg-gradient-to-b from-slate-900 to-[#0b1220] p-6 shadow-[0_20px_60px_rgba(14,165,233,0.15)] sm:p-8">
                  <p className="text-xs font-semibold tracking-wide text-sky-300 uppercase">
                    答案
                  </p>
                  <p className="mt-3 text-lg font-semibold text-white sm:text-xl">
                    {current.answer}
                  </p>
                  <div className="mt-5 flex-1 overflow-y-auto">
                    <p className="text-sm leading-relaxed text-slate-400">
                      {current.explanation}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </button>

          <div className="mx-auto flex max-w-2xl items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => go(index - 1)}
              className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-zinc-400 transition hover:bg-zinc-900 hover:text-zinc-100"
            >
              <ChevronLeft className="size-4" />
              上一題
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={markMissed}
                className="inline-flex items-center gap-1.5 rounded-lg bg-rose-500/10 px-3 py-2 text-sm font-medium text-rose-300 ring-1 ring-rose-500/25 transition hover:bg-rose-500/20"
              >
                <X className="size-4" />
                記錯
              </button>
              <button
                type="button"
                onClick={markKnown}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-3 py-2 text-sm font-medium text-emerald-300 ring-1 ring-emerald-500/25 transition hover:bg-emerald-500/20"
              >
                <Check className="size-4" />
                記牢
              </button>
            </div>
            <button
              type="button"
              onClick={() => go(index + 1)}
              className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-zinc-400 transition hover:bg-zinc-900 hover:text-zinc-100"
            >
              下一題
              <ChevronRight className="size-4" />
            </button>
          </div>
          <p className="text-center text-xs text-zinc-600">
            快捷鍵：Space 翻牌 · ← → 切換
          </p>
        </div>
      ) : null}

      {mode === "list" ? (
        <ol className="space-y-2">
          {filtered.map((q, i) => (
            <li key={q.id}>
              <button
                type="button"
                onClick={() => jumpTo(q.id)}
                className="flex w-full items-start gap-3 rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-3 text-left transition hover:border-[color-mix(in_srgb,var(--accent)_40%,#3f3f46)] hover:bg-zinc-900"
              >
                <span className="mt-0.5 text-xs tabular-nums text-zinc-600">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-zinc-500">{q.id}</span>
                    <span
                      className={cn(
                        "font-medium",
                        DIFFICULTY_LABEL[q.difficulty].className,
                      )}
                    >
                      {DIFFICULTY_LABEL[q.difficulty].zh}
                    </span>
                    <span className="text-zinc-500">{q.category}</span>
                    {known.has(q.id) ? (
                      <span className="text-emerald-400">記牢</span>
                    ) : null}
                    {missed.has(q.id) ? (
                      <span className="text-rose-400">記錯</span>
                    ) : null}
                  </span>
                  <span className="mt-1 block text-sm text-zinc-300 line-clamp-2">
                    {q.question}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ol>
      ) : null}

      {total === 0 ? (
        <p className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-8 text-center text-sm text-zinc-500">
          此篩選沒有題目。
        </p>
      ) : null}
    </div>
  );
}
