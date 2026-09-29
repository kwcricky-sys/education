"use client";

import { useEffect, useState } from "react";
import { ENGLISH_UNITS } from "@/lib/dse/english-path";
import EnglishPracticeGate, {
  ENGLISH_PROGRESS_KEY,
} from "@/components/dse/english-practice-gate";
import lessons from "@/data/dse/english-lessons.json";
import {
  isUnitUnlocked,
  missingPrerequisites,
  nextOpenUnit,
} from "@/lib/dse/learn-path";
import { UnitMapSummary, scrollToUnit } from "@/components/dse/unit-map-summary";

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
  const next = nextOpenUnit(ENGLISH_UNITS, completed);

  const openUnitAndScroll = (id: number) => {
    setOpenUnit(id);
    scrollToUnit(id);
  };

  const markPassed = (id: number) =>
    setProgress((p) => {
      const prev = p?.completed ?? [];
      return { ...p, completed: prev.includes(id) ? prev : [...prev, id] };
    });

  return (
    <div className="space-y-4">
      {progress ? (
        <UnitMapSummary
          done={completed.length}
          total={ENGLISH_UNITS.length}
          next={next ? { id: next.id, name: next.title } : undefined}
          onOpenUnit={openUnitAndScroll}
        />
      ) : null}
      {ENGLISH_UNITS.map((unit) => {
        const unlocked = isUnitUnlocked(unit, completed);
        const isDone = completed.includes(unit.id);
        const missing = missingPrerequisites(ENGLISH_UNITS, unit, completed);
        const unitLessons = unit.lessonIds
          .map((lid) => reviewed[lid])
          .filter(Boolean);
        return (
          <div
            key={unit.id}
            id={`unit-${unit.id}`}
            className={`scroll-mt-24 rounded-2xl border bg-white shadow-lg ${
              unlocked ? "border-slate-200" : "border-slate-200 opacity-60"
            }`}
          >
            <button
              className="flex w-full items-center justify-between gap-3 p-5 text-left"
              aria-expanded={openUnit === unit.id}
              aria-disabled={!unlocked}
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
                    {[
                      unit.label,
                      `${unitLessons.length} 課`,
                      isDone
                        ? "已通過"
                        : unlocked
                          ? `練習答啱 ${unit.passThreshold}/10 即過關`
                          : null,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                  {!unlocked ? (
                    <p className="mt-1 text-xs font-medium text-amber-800">
                      🔒 先通過：{missing.map((u) => `單元 ${u.id} ${u.title}`).join("、")}
                    </p>
                  ) : null}
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
                <EnglishPracticeGate
                  unit={unit}
                  completedUnits={completed}
                  onPassed={markPassed}
                  onOpenUnit={openUnitAndScroll}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
