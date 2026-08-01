"use client";

import { useEffect, useState } from "react";
import { DIFFICULTY_LABEL } from "@/lib/dse/types";
import { useCatSession } from "@/store/cat-session";
import { cn } from "@/lib/utils";

export function CatQuiz() {
  const current = useCatSession((s) => s.current);
  const answers = useCatSession((s) => s.answers);
  const targetCount = useCatSession((s) => s.targetCount);
  const theta = useCatSession((s) => s.theta);
  const submitAnswer = useCatSession((s) => s.submitAnswer);
  const [selected, setSelected] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setSelected(null);
    setSubmitting(false);
  }, [current?.uid]);

  if (!current) {
    return (
      <p className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-sm text-slate-400">
        載入題目中…
      </p>
    );
  }

  const progressIndex = answers.length + 1;
  const progressMax = Math.max(targetCount, progressIndex);
  const progressPct = (answers.length / progressMax) * 100;

  const onSubmit = () => {
    if (!selected || submitting) return;
    setSubmitting(true);
    // Brief delay for seamless feel before next item mounts
    window.setTimeout(() => {
      submitAnswer(selected);
    }, 180);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>
            第 {progressIndex} / ~{targetCount} 題
          </span>
          <span>
            能力值 θ {theta >= 0 ? "+" : ""}
            {theta.toFixed(2)}
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
          <div
            className="dse-progress h-full rounded-full transition-[width] duration-300"
            style={{ width: `${Math.min(100, progressPct)}%` }}
          />
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-white/10 bg-gradient-to-b from-slate-900 to-[#0b1220] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.4)] sm:p-8">
        <div className="flex flex-wrap items-center gap-2 text-xs">
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
          <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-slate-500 ring-1 ring-white/10">
            {current.textLabel}
          </span>
        </div>

        <p className="mt-6 text-base leading-relaxed text-slate-50 sm:text-lg">
          {current.question}
        </p>

        <fieldset className="mt-6 space-y-2.5" disabled={submitting}>
          <legend className="sr-only">選擇答案</legend>
          {current.options.map((opt) => {
            const active = selected === opt;
            return (
              <label
                key={opt}
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3.5 text-sm transition",
                  active
                    ? "border-sky-400/50 bg-sky-400/10 text-white"
                    : "border-white/8 bg-white/[0.02] text-slate-300 hover:border-white/20 hover:bg-white/[0.05]",
                )}
              >
                <input
                  type="radio"
                  name="cat-answer"
                  value={opt}
                  checked={active}
                  onChange={() => setSelected(opt)}
                  className="mt-1 accent-sky-400"
                />
                <span className="leading-relaxed">{opt}</span>
              </label>
            );
          })}
        </fieldset>

        <button
          type="button"
          onClick={onSubmit}
          disabled={!selected || submitting}
          className="mt-8 w-full rounded-2xl bg-sky-400 px-5 py-3.5 text-sm font-bold text-slate-950 transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {submitting ? "出下一題…" : "提交答案"}
        </button>
      </div>
    </div>
  );
}
