"use client";

import { useEffect, useState } from "react";
import { HelpCircle } from "lucide-react";
import { DIFFICULTY_LABEL } from "@/lib/dse/types";
import { useCatSession } from "@/store/cat-session";
import { cn } from "@/lib/utils";

const DIFF_PILL: Record<string, string> = {
  easy: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
  medium: "bg-amber-400/10 text-amber-400 border-amber-400/20",
  hard: "bg-rose-400/10 text-rose-400 border-rose-400/20",
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

  const onSubmit = () => {
    if (!selected || submitting) return;
    setSubmitting(true);
    window.setTimeout(() => {
      submitAnswer(selected, { markedUnsure });
    }, 180);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span>
            {sessionKind === "adaptive"
              ? `第 ${progressIndex} / ~${targetCount} 題`
              : `第 ${progressIndex} / ${targetCount} 題`}
            {sessionKind === "remediation"
              ? " · 專攻特訓"
              : sessionKind === "mistake-retest"
                ? " · 錯題重測"
                : ""}
          </span>
          <span className="font-medium text-cyan-400">診斷進行中</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
          <div
            className="dse-cat-progress h-full rounded-full transition-[width] duration-300"
            style={{ width: `${Math.min(100, progressPct)}%` }}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-zinc-900/80 p-6 shadow-lg backdrop-blur-md sm:p-8">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span
            className={cn(
              "rounded-md border px-2 py-1 font-semibold",
              DIFF_PILL[current.difficulty],
            )}
          >
            {DIFFICULTY_LABEL[current.difficulty].zh}
          </span>
          <span className="rounded-md border border-white/10 bg-zinc-800/50 px-2 py-1 text-zinc-400">
            {current.category}
          </span>
          <span className="rounded-md border border-white/10 bg-zinc-800/50 px-2 py-1 text-zinc-500">
            {current.textLabel}
          </span>
        </div>

        <p className="mt-6 text-base leading-relaxed text-zinc-100 sm:text-lg">
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
                  "flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3.5 text-sm transition-all duration-300",
                  active
                    ? "border-cyan-500/50 bg-cyan-400/10 text-zinc-100 shadow-lg"
                    : "border-zinc-700 bg-zinc-800/50 text-zinc-300 hover:border-cyan-500/50 hover:bg-zinc-800",
                )}
              >
                <input
                  type="radio"
                  name="cat-answer"
                  value={opt}
                  checked={active}
                  onChange={() => setSelected(opt)}
                  className="mt-1 accent-cyan-400"
                />
                <span className="leading-relaxed">{opt}</span>
              </label>
            );
          })}
        </fieldset>

        <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-xl border border-dashed border-amber-400/25 bg-amber-400/5 px-4 py-3 text-sm text-amber-200/90 transition-all duration-300">
          <input
            type="checkbox"
            checked={markedUnsure}
            onChange={(e) => setMarkedUnsure(e.target.checked)}
            className="mt-0.5 accent-amber-400"
          />
          <span className="leading-relaxed">
            <span className="inline-flex items-center gap-1 font-semibold text-amber-300">
              <HelpCircle className="size-3.5" />
              我不是很確定（Not Sure / Guessing）
            </span>
            <span className="mt-0.5 block text-xs text-zinc-400">
              勾選後仍會計分，但不會讓系統過快推高難度。
            </span>
          </span>
        </label>

        <button
          type="button"
          onClick={onSubmit}
          disabled={!selected || submitting}
          className="mt-6 w-full rounded-2xl bg-cyan-400 px-5 py-3.5 text-sm font-bold text-zinc-950 shadow-lg shadow-cyan-400/20 transition-all duration-300 hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {submitting ? "出下一題…" : "提交答案"}
        </button>
      </div>
    </div>
  );
}
