"use client";

import { useEffect, useState } from "react";
import { HelpCircle } from "lucide-react";
import { DIFFICULTY_LABEL } from "@/lib/dse/types";
import { useCatSession } from "@/store/cat-session";
import { cn } from "@/lib/utils";

const DIFF_PILL: Record<string, string> = {
  easy: "bg-emerald-50 text-emerald-700 border-emerald-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  hard: "bg-rose-50 text-rose-700 border-rose-200",
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
      <p className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm">
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
        <div className="flex items-center justify-between text-xs text-slate-500">
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
          <span className="font-medium text-indigo-600">診斷進行中</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-200">
          <div
            className="dse-cat-progress h-full rounded-full transition-[width] duration-300"
            style={{ width: `${Math.min(100, progressPct)}%` }}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span
            className={cn(
              "rounded-full border px-2.5 py-0.5 font-semibold",
              DIFF_PILL[current.difficulty],
            )}
          >
            {DIFFICULTY_LABEL[current.difficulty].zh}
          </span>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-slate-600">
            {current.category}
          </span>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-slate-500">
            {current.textLabel}
          </span>
        </div>

        <p className="mt-6 text-base leading-relaxed text-slate-900 sm:text-lg">
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
                    ? "border-indigo-300 bg-indigo-50 text-slate-900 shadow-sm"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50",
                )}
              >
                <input
                  type="radio"
                  name="cat-answer"
                  value={opt}
                  checked={active}
                  onChange={() => setSelected(opt)}
                  className="mt-1 accent-indigo-600"
                />
                <span className="leading-relaxed">{opt}</span>
              </label>
            );
          })}
        </fieldset>

        <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-2xl border border-dashed border-amber-200 bg-amber-50/60 px-4 py-3 text-sm text-amber-800">
          <input
            type="checkbox"
            checked={markedUnsure}
            onChange={(e) => setMarkedUnsure(e.target.checked)}
            className="mt-0.5 accent-amber-500"
          />
          <span className="leading-relaxed">
            <span className="inline-flex items-center gap-1 font-semibold">
              <HelpCircle className="size-3.5" />
              我不是很確定（Not Sure / Guessing）
            </span>
            <span className="mt-0.5 block text-xs text-amber-700/80">
              勾選後仍會計分，但不會讓系統過快推高難度。
            </span>
          </span>
        </label>

        <button
          type="button"
          onClick={onSubmit}
          disabled={!selected || submitting}
          className="mt-6 w-full rounded-2xl bg-indigo-600 px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {submitting ? "出下一題…" : "提交答案"}
        </button>
      </div>
    </div>
  );
}
