"use client";

import { useEffect, useState } from "react";
import { ENGLISH_UNITS } from "@/lib/dse/english-path";
import EnglishPracticeGate, {
  ENGLISH_PROGRESS_KEY,
} from "@/components/dse/english-practice-gate";
import lessons from "@/data/dse/english-lessons.json";

type Progress = { completed: number[]; lessonsRead?: string[] };

type LessonEntry = {
  id?: string;
  unit: number;
  title: string;
  concept: string;
  example: { scenario: string; walkthrough: string };
  traps: string[];
  terms: { term: string; definition: string }[];
};

/**
 * Unit map for the English learning path — shows lock state and progress.
 * Same structure as the ECON unit map, dark DSE shell.
 */
export default function EnglishUnitMap() {
  const [progress, setProgress] = useState<Progress | null>(null);
  const [openUnit, setOpenUnit] = useState<number | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(ENGLISH_PROGRESS_KEY);
      if (raw) setProgress(JSON.parse(raw));
    } catch {
      // ignore
    }
    setProgress((p) => p || { completed: [], lessonsRead: [] });
  }, []);

  const completed = progress?.completed || [];
  const reviewed = lessons as Record<string, LessonEntry>;

  return (
    <div className="space-y-4">
      {ENGLISH_UNITS.map((unit) => {
        const unlocked =
          unit.prerequisites.length === 0 ||
          unit.prerequisites.every((p) => completed.includes(p));
        const isDone = completed.includes(unit.id);
        const unitLessons = unit.lessonIds
          .map((lid) => reviewed[lid])
          .filter(Boolean);
        return (
          <div
            key={unit.id}
            className={`rounded-2xl border bg-white shadow-lg ${
              unlocked ? "border-slate-200" : "border-slate-200 opacity-60"
            }`}
          >
            <button
              className="flex w-full items-center justify-between gap-3 p-5 text-left"
              onClick={() =>
                unlocked && setOpenUnit(openUnit === unit.id ? null : unit.id)
              }
            >
              <div className="flex items-center gap-3">
                <span
                  className={`grid size-9 shrink-0 place-items-center rounded-full text-sm font-bold ${
                    isDone
                      ? "bg-emerald-700/20 text-emerald-700"
                      : unlocked
                        ? "bg-blue-800 text-white"
                        : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {isDone ? "✓" : unlocked ? unit.id : "🔒"}
                </span>
                <div className="min-w-0">
                  <h3 className="font-semibold text-slate-900">
                    單元 {unit.id}　{unit.title}
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {unit.label} · {unitLessons.length} 課 · 通過練習解鎖下一個單元
                  </p>
                </div>
              </div>
              {unlocked && (
                <span className="text-slate-500">
                  {openUnit === unit.id ? "▲" : "▼"}
                </span>
              )}
            </button>

            {openUnit === unit.id && unlocked && (
              <div className="border-t border-slate-200 p-5 pt-4">
                {unitLessons.map((l) => (
                  <details
                    key={l.id}
                    className="mb-3 rounded-xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <summary className="cursor-pointer font-medium text-slate-900">
                      {l.id} — {l.title}
                    </summary>
                    <p className="mt-3 text-[15px] leading-relaxed whitespace-pre-line text-slate-700">
                      {l.concept}
                    </p>
                    <div className="mt-3 rounded-lg border border-slate-200 bg-white p-3 text-sm">
                      <p className="font-semibold text-blue-700">示範例子</p>
                      <p className="mt-1 text-slate-800">{l.example.scenario}</p>
                      <p className="mt-2 leading-relaxed text-slate-600">
                        {l.example.walkthrough}
                      </p>
                    </div>
                    {l.traps.length > 0 && (
                      <div className="mt-3 rounded-lg border border-amber-700/20 bg-amber-700/10 p-3 text-sm text-amber-900">
                        <p className="font-semibold">常見陷阱</p>
                        <ul className="mt-1 list-disc space-y-1 pl-5">
                          {l.traps.map((t, i) => (
                            <li key={i}>{t}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {l.terms.map((t) => (
                        <span
                          key={t.term}
                          className="rounded-full border border-blue-700/20 bg-blue-700/10 px-3 py-1 text-xs text-blue-700"
                          title={t.definition}
                        >
                          {t.term}
                        </span>
                      ))}
                    </div>
                  </details>
                ))}
                <EnglishPracticeGate unit={unit} completedUnits={completed} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
