"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Check,
  ChevronRight,
  Eye,
  List,
  RotateCcw,
  Smile,
  Frown,
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

const LETTERS = ["A", "B", "C", "D", "E", "F"] as const;

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
                "rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-300",
                filter === f
                  ? "bg-cyan-400/10 text-cyan-400 ring-1 ring-cyan-400/30"
                  : "bg-zinc-900 text-zinc-400 ring-1 ring-white/5 hover:bg-zinc-800 hover:text-zinc-200",
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
            className="inline-flex items-center gap-1.5 rounded-md border border-white/5 bg-zinc-900 px-3 py-1.5 text-sm text-zinc-400 transition-all duration-300 hover:border-white/10 hover:bg-zinc-800 hover:text-zinc-100"
          >
            <List className="size-3.5" />
            {mode === "flash" ? "題目總覽" : "閃卡模式"}
          </button>
          <button
            type="button"
            onClick={resetSession}
            className="inline-flex items-center gap-1.5 rounded-md border border-white/5 bg-zinc-900 px-3 py-1.5 text-sm text-zinc-400 transition-all duration-300 hover:border-white/10 hover:bg-zinc-800 hover:text-zinc-100"
            title="重置本節進度"
          >
            <RotateCcw className="size-3.5" />
            重置
          </button>
        </div>
      </div>

      {mode === "flash" && current ? (
        <div className="mx-auto max-w-2xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded-md bg-cyan-400 px-2 py-1 font-bold text-zinc-950">
                {current.id}
              </span>
              <span className="rounded-md border border-white/10 bg-zinc-900 px-2 py-1 text-zinc-400">
                {DIFFICULTY_LABEL[current.difficulty].zh}
              </span>
              <span className="rounded-md border border-white/10 bg-zinc-900 px-2 py-1 text-zinc-400">
                {current.category}
              </span>
            </div>
            <span className="text-[11px] font-medium tracking-wide text-zinc-500 uppercase">
              {index + 1} / {total}
            </span>
          </div>

          <div className="rounded-2xl border border-white/10 bg-zinc-900/80 p-6 shadow-lg backdrop-blur-md sm:p-8">
            {!flipped ? (
              <>
                <p className="text-lg leading-relaxed text-zinc-100 sm:text-xl">
                  {current.question}
                </p>
                <div className="mt-6 space-y-2.5">
                  {current.options.map((opt, i) => (
                    <div
                      key={opt}
                      className="flex items-center gap-3 rounded-xl border border-white/10 bg-zinc-950/50 px-4 py-3.5 transition-all duration-300"
                    >
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-md border border-white/10 bg-zinc-900 text-xs font-bold text-zinc-400">
                        {LETTERS[i] ?? i + 1}
                      </span>
                      <span className="text-sm leading-relaxed text-zinc-200">
                        {opt}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <p className="text-lg font-semibold leading-relaxed text-cyan-400 sm:text-xl">
                  {current.answer}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-zinc-400">
                  {current.explanation}
                </p>
              </>
            )}
          </div>

          {/* Progress strip */}
          <div className="rounded-xl border border-white/10 bg-zinc-900/80 p-4 shadow-lg backdrop-blur-md">
            <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
              <div
                className="h-full rounded-full bg-cyan-400 transition-[width] duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex gap-4">
                <span className="inline-flex items-center gap-1.5 text-emerald-400">
                  <Check className="size-3.5" />
                  記牢 {known.size}
                </span>
                <span className="inline-flex items-center gap-1.5 text-rose-400">
                  <Frown className="size-3.5" />
                  記錯 {missed.size}
                </span>
              </div>
              <span className="font-medium text-cyan-400">
                進度 {Math.round(progress)}%
              </span>
            </div>
          </div>

          {/* Action bar */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setFlipped((v) => !v)}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-zinc-900 px-4 py-2.5 text-sm font-medium text-zinc-300 transition-all duration-300 hover:border-white/20 hover:bg-zinc-800"
            >
              <Eye className="size-4" />
              翻牌 [Space]
            </button>
            <button
              type="button"
              onClick={markKnown}
              className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-400/5 px-5 py-2.5 text-sm font-semibold text-emerald-400 transition-all duration-300 hover:bg-emerald-400/10"
            >
              <Smile className="size-4" />
              記牢
            </button>
            <button
              type="button"
              onClick={markMissed}
              className="inline-flex items-center gap-2 rounded-full border border-rose-400/40 bg-rose-400/5 px-5 py-2.5 text-sm font-semibold text-rose-400 transition-all duration-300 hover:bg-rose-400/10"
            >
              <Frown className="size-4" />
              記錯
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              className="inline-flex size-11 items-center justify-center rounded-full border border-white/10 bg-zinc-900 text-zinc-300 transition-all duration-300 hover:border-cyan-500/40 hover:text-cyan-400"
              aria-label="下一題"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>
      ) : null}

      {mode === "list" ? (
        <ol className="space-y-2">
          {filtered.map((q, i) => (
            <li key={q.id}>
              <button
                type="button"
                onClick={() => jumpTo(q.id)}
                className="flex w-full items-start gap-3 rounded-xl border border-white/5 bg-zinc-900 p-5 text-left shadow-lg transition-all duration-300 hover:border-white/10 hover:bg-zinc-800"
              >
                <span className="mt-0.5 text-xs tabular-nums text-zinc-600">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="rounded-md bg-cyan-400/10 px-2 py-0.5 font-semibold text-cyan-400">
                      {q.id}
                    </span>
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
                  <span className="mt-1 block text-sm leading-relaxed text-zinc-300 line-clamp-2">
                    {q.question}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ol>
      ) : null}

      {total === 0 ? (
        <p className="rounded-xl border border-white/5 bg-zinc-900 p-8 text-center text-sm leading-relaxed text-zinc-400 shadow-lg">
          此篩選沒有題目。
        </p>
      ) : null}
    </div>
  );
}
