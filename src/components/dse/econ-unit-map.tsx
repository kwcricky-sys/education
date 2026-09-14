"use client";

import { useEffect, useState } from "react";
import { ECON_UNITS } from "@/lib/dse/econ-path";
import PracticeGate from "@/components/dse/practice-gate";
import lessons from "@/data/dse/econ-lessons.json";

type Progress = { completed: number[]; lessonsRead: string[] };

const STORAGE = "dsehack-econ-progress-v1";

/**
 * Unit map for the ECON learning path — shows lock state and progress.
 */
export default function EconUnitMap() {
  const [progress, setProgress] = useState<Progress | null>(null);
  const [openUnit, setOpenUnit] = useState<number | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE);
      if (raw) setProgress(JSON.parse(raw));
    } catch {
      // ignore
    }
    setProgress((p) => p || { completed: [], lessonsRead: [] });
  }, []);

  const completed = progress?.completed || [];
  const lessonsRead = progress?.lessonsRead || [];
  const reviewed = lessons as Record<
    string,
    { id?: string; unit: number; title: string; concept: string; example: { scenario: string; walkthrough: string }; traps: string[]; terms: { term: string; definition: string }[] }
  >;

  return (
    <div className="space-y-4">
      {ECON_UNITS.map((unit) => {
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
            className={`rounded-2xl border bg-white shadow-sm ${
              unlocked ? "border-black/5" : "border-black/5 opacity-60"
            }`}
          >
            <button
              className="flex w-full items-center justify-between p-5 text-left"
              onClick={() =>
                unlocked && setOpenUnit(openUnit === unit.id ? null : unit.id)
              }
            >
              <div className="flex items-center gap-3">
                <span
                  className={`grid size-9 place-items-center rounded-full text-sm font-bold ${
                    isDone
                      ? "bg-green-100 text-green-700"
                      : unlocked
                        ? "bg-[#0071e3] text-white"
                        : "bg-black/10 text-black/40"
                  }`}
                >
                  {isDone ? "✓" : unlocked ? unit.id : "🔒"}
                </span>
                <div>
                  <h3 className="font-semibold">{unit.title}</h3>
                  <p className="text-xs text-black/50">
                    {unitLessons.length} lessons · pass practice to unlock next
                  </p>
                </div>
              </div>
              {unlocked && (
                <span className="text-black/40">{openUnit === unit.id ? "▲" : "▼"}</span>
              )}
            </button>

            {openUnit === unit.id && unlocked && (
              <div className="border-t border-black/5 p-5 pt-4">
                {unitLessons.map((l) => (
                  <details key={l.id} className="mb-3 rounded-xl bg-black/[.03] p-4">
                    <summary className="cursor-pointer font-medium">
                      {l.id} — {l.title}
                    </summary>
                    <p className="mt-3 whitespace-pre-line leading-relaxed text-black/75">
                      {l.concept}
                    </p>
                    <div className="mt-3 rounded-lg bg-white p-3 text-sm">
                      <p className="font-semibold">Example</p>
                      <p className="mt-1">{l.example.scenario}</p>
                      <p className="mt-2 text-black/70">{l.example.walkthrough}</p>
                    </div>
                    {l.traps.length > 0 && (
                      <div className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
                        <p className="font-semibold">Common traps</p>
                        <ul className="mt-1 list-disc pl-5">
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
                          className="rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-800"
                          title={t.definition}
                        >
                          {t.term}
                        </span>
                      ))}
                    </div>
                  </details>
                ))}
                <PracticeGate
                  unit={unit}
                  completedUnits={completed}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
