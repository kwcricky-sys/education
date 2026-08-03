"use client";

import { useEffect, useState } from "react";
import { HelpCircle } from "lucide-react";
import { DIFFICULTY_LABEL } from "@/lib/dse/types";
import { useCatSession } from "@/store/cat-session";
import { cn } from "@/lib/utils";

const LETTERS = ["A", "B", "C", "D", "E", "F"] as const;

const DIFF_PILL: Record<string, string> = {
  easy: "border-white/10 bg-zinc-900 text-zinc-400",
  medium: "border-white/10 bg-zinc-900 text-amber-400",
  hard: "border-white/10 bg-zinc-900 text-rose-400",
};

export function CatQuiz() {
  const current = useCatSession((s) => s.current);
  const answers = useCatSession((s) => s.answers);
  const targetCount = useCatSession((s) => s.targetCount);
  const sessionKind = useCatSession((s) => s.sessionKind);
  const submitAnswer = useCatSession((s) => s.submitAnswer);
  const [selected, setSelected] = useState<string | null>(null);
  const [markedUnsure, setMarkedUnsure] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setSelected(null);
    setMarkedUnsure(false);
    setSubmitting(false);
  }, [current?.uid]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!current || submitting) return;
      const n = Number(e.key);
      if (n >= 1 && n <= current.options.length) {
        setSelected(current.options[n - 1] ?? null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current, submitting]);

  if (!current) {
    return (
      <p className="rounded-2xl border border-white/10 bg-zinc-900/80 p-8 text-center text-sm leading-relaxed text-zinc-400 shadow-lg backdrop-blur-md">
        載入題目中…
      </p>
    );
  }

  const progressIndex = answers.length + 1;
  const progressMax = Math.max(targetCount, progressIndex);
  const progressPct = (answers.length / progressMax) * 100;
  const correctSoFar = answers.filter((a) => a.isCorrect).length;
  const wrongSoFar = answers.length - correctSoFar;

  const onSubmit = () => {
    if (!selected || submitting) return;
    setSubmitting(true);
    window.setTimeout(() => {
      submitAnswer(selected, { markedUnsure });
    }, 180);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-md bg-cyan-400 px-2 py-1 font-bold text-zinc-950">
            Q{String(progressIndex).padStart(3, "0")}
          </span>
          <span
            className={cn(
              "rounded-md border px-2 py-1 font-medium",
              DIFF_PILL[current.difficulty],
            )}
          >
            {DIFFICULTY_LABEL[current.difficulty].zh}
          </span>
          <span className="rounded-md border border-white/10 bg-zinc-900 px-2 py-1 text-zinc-400">
            {current.category}
          </span>
          <span className="rounded-md border border-white/10 bg-zinc-900 px-2 py-1 text-zinc-500">
            {current.textLabel}
          </span>
        </div>
        <span className="text-[11px] font-medium tracking-wide text-zinc-500 uppercase">
          {sessionKind === "adaptive"
            ? `${progressIndex} / ~${targetCount}`
            : `${progressIndex} / ${targetCount}`}
        </span>
      </div>

      <div className="rounded-2xl border border-white/10 bg-zinc-900/80 p-6 shadow-lg backdrop-blur-md sm:p-8">
        <p className="text-[11px] font-semibold tracking-[0.2em] text-zinc-500 uppercase">
          Question Fragment
        </p>
        <p className="mt-4 text-lg leading-relaxed text-zinc-100 sm:text-xl">
          {current.question}
        </p>

        <fieldset className="mt-6 space-y-2.5" disabled={submitting}>
          <legend className="sr-only">選擇答案</legend>
          {current.options.map((opt, i) => {
            const active = selected === opt;
            return (
              <label
                key={opt}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3.5 text-sm transition-all duration-300",
                  active
                    ? "border-cyan-500/50 bg-cyan-400/10 text-zinc-100 shadow-[0_0_20px_rgba(34,211,238,0.12)]"
                    : "border-white/10 bg-zinc-950/50 text-zinc-300 hover:border-cyan-500/40 hover:bg-zinc-800/60",
                )}
              >
                <input
                  type="radio"
                  name="cat-answer"
                  value={opt}
                  checked={active}
                  onChange={() => setSelected(opt)}
                  className="sr-only"
                />
                <span
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-md border text-xs font-bold",
                    active
                      ? "border-cyan-400 bg-cyan-400 text-zinc-950"
                      : "border-white/10 bg-zinc-900 text-zinc-400",
                  )}
                >
                  {LETTERS[i] ?? i + 1}
                </span>
                <span className="leading-relaxed">{opt}</span>
              </label>
            );
          })}
        </fieldset>

        <p className="mt-4 text-center text-[11px] tracking-wide text-zinc-600 uppercase">
          Select an option or press [1–{current.options.length}]
        </p>

        <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-xl border border-dashed border-amber-400/25 bg-amber-400/5 px-4 py-3 text-sm text-amber-200/90">
          <input
            type="checkbox"
            checked={markedUnsure}
            onChange={(e) => setMarkedUnsure(e.target.checked)}
            className="mt-0.5 accent-amber-400"
          />
          <span className="leading-relaxed">
            <span className="inline-flex items-center gap-1 font-semibold text-amber-300">
              <HelpCircle className="size-3.5" />
              我不是很確定（Not Sure）
            </span>
            <span className="mt-0.5 block text-xs text-zinc-400">
              勾選後仍會計分，但不會讓系統過快推高難度。
            </span>
          </span>
        </label>
      </div>

      <div className="rounded-xl border border-white/10 bg-zinc-900/80 p-4 shadow-lg backdrop-blur-md">
        <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
          <div
            className="h-full rounded-full bg-cyan-400 transition-[width] duration-300"
            style={{ width: `${Math.min(100, progressPct)}%` }}
          />
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex gap-4">
            <span className="text-emerald-400">{correctSoFar} Mastery</span>
            <span className="text-rose-400">{wrongSoFar} Review</span>
          </div>
          <span className="font-medium text-cyan-400">
            Progress: {Math.round(Math.min(100, progressPct))}%
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={onSubmit}
        disabled={!selected || submitting}
        className="w-full rounded-xl bg-cyan-400 px-5 py-3.5 text-sm font-bold text-zinc-950 shadow-[0_0_24px_rgba(34,211,238,0.3)] transition-all duration-300 hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
      >
        {submitting ? "出下一題…" : "提交答案"}
      </button>
    </div>
  );
}
