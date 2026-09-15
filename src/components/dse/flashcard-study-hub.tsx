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
                  ? "bg-blue-700/10 text-blue-700 ring-1 ring-blue-700/30"
                  : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-200 hover:text-slate-800",
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
            className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 transition-all duration-300 hover:border-slate-200 hover:bg-slate-200 hover:text-slate-900"
          >
            <List className="size-3.5" />
            {mode === "flash" ? "題目總覽" : "閃卡模式"}
          </button>
          <button
            type="button"
            onClick={resetSession}
            className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 transition-all duration-300 hover:border-slate-200 hover:bg-slate-200 hover:text-slate-900"
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
              <span className="rounded-md bg-blue-700 px-2 py-1 font-bold text-white">
                {current.id}
              </span>
              <span className="rounded-md border border-slate-200 bg-white px-2 py-1 text-slate-600">
                {DIFFICULTY_LABEL[current.difficulty].zh}
              </span>
              <span className="rounded-md border border-slate-200 bg-white px-2 py-1 text-slate-600">
                {current.category}
              </span>
            </div>
            <span className="text-[11px] font-medium tracking-wide text-slate-500 uppercase">
              {index + 1} / {total}
            </span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg backdrop-blur-md sm:p-8">
            {!flipped ? (
              <>
                <p className="text-lg leading-relaxed text-slate-900 sm:text-xl">
                  {current.question}
                </p>
                <div className="mt-6 space-y-2.5">
                  {current.options.map((opt, i) => (
                    <div
                      key={opt}
                      className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 transition-all duration-300"
                    >
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-white text-xs font-bold text-slate-600">
                        {LETTERS[i] ?? i + 1}
                      </span>
                      <span className="text-sm leading-relaxed text-slate-800">
                        {opt}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <p className="text-lg font-semibold leading-relaxed text-blue-700 sm:text-xl">
                  {current.answer}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-slate-600">
                  {current.explanation}
                </p>
              </>
            )}
          </div>

          {/* Progress strip */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-lg backdrop-blur-md">
            <div className="h-2 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-blue-700 transition-[width] duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex gap-4">
                <span className="inline-flex items-center gap-1.5 text-emerald-700">
                  <Check className="size-3.5" />
                  記牢 {known.size}
                </span>
                <span className="inline-flex items-center gap-1.5 text-rose-700">
                  <Frown className="size-3.5" />
                  記錯 {missed.size}
                </span>
              </div>
              <span className="font-medium text-blue-700">
                進度 {Math.round(progress)}%
              </span>
            </div>
          </div>

          {/* Action bar */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setFlipped((v) => !v)}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-all duration-300 hover:border-slate-300 hover:bg-slate-200"
            >
              <Eye className="size-4" />
              翻牌 [Space]
            </button>
            <button
              type="button"
              onClick={markKnown}
              className="inline-flex items-center gap-2 rounded-full border border-emerald-700/40 bg-emerald-700/5 px-5 py-2.5 text-sm font-semibold text-emerald-700 transition-all duration-300 hover:bg-emerald-700/10"
            >
              <Smile className="size-4" />
              記牢
            </button>
            <button
              type="button"
              onClick={markMissed}
              className="inline-flex items-center gap-2 rounded-full border border-rose-700/40 bg-rose-700/5 px-5 py-2.5 text-sm font-semibold text-rose-700 transition-all duration-300 hover:bg-rose-700/10"
            >
              <Frown className="size-4" />
              記錯
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              className="inline-flex size-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition-all duration-300 hover:border-blue-800/40 hover:text-blue-700"
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
                className="flex w-full items-start gap-3 rounded-xl border border-slate-200 bg-white p-5 text-left shadow-lg transition-all duration-300 hover:border-slate-200 hover:bg-slate-200"
              >
                <span className="mt-0.5 text-xs tabular-nums text-slate-500">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="rounded-md bg-blue-700/10 px-2 py-0.5 font-semibold text-blue-700">
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
                    <span className="text-slate-500">{q.category}</span>
                    {known.has(q.id) ? (
                      <span className="text-emerald-700">記牢</span>
                    ) : null}
                    {missed.has(q.id) ? (
                      <span className="text-rose-700">記錯</span>
                    ) : null}
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-slate-700 line-clamp-2">
                    {q.question}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ol>
      ) : null}

      {total === 0 ? (
        <p className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm leading-relaxed text-slate-600 shadow-lg">
          此篩選沒有題目。
        </p>
      ) : null}
    </div>
  );
}
