"use client";

import { useEffect, useState } from "react";
import { MATH_UNITS } from "@/lib/dse/math-path";
import MathPracticeGate, { MATH_PROGRESS_KEY } from "@/components/dse/math-practice-gate";
import lessons from "@/data/dse/math-lessons.json";
import {
  isUnitUnlocked,
  missingPrerequisites,
  nextOpenUnit,
} from "@/lib/dse/learn-path";
import { UnitMapSummary, scrollToUnit } from "@/components/dse/unit-map-summary";

type Progress = { completed: number[]; lessonsRead: string[] };

const STORAGE = MATH_PROGRESS_KEY;

/**
 * Unit map for the compulsory mathematics path — lock state and progress.
 */
export default function MathUnitMap() {
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
  const reviewed = lessons as Record<
    string,
    {
      id?: string;
      unit: number;
      title: string;
      concept: string;
      example: { scenario: string; walkthrough: string };
      traps: string[];
      terms: { term: string; definition: string }[];
    }
  >;

  const next = nextOpenUnit(MATH_UNITS, completed);

  const openUnitAndScroll = (id: number) => {
    setOpenUnit(id);
    scrollToUnit(id);
  };

  const markPassed = (id: number) =>
    setProgress((p) => {
      const prev = p?.completed ?? [];
      return {
        lessonsRead: p?.lessonsRead ?? [],
        completed: prev.includes(id) ? prev : [...prev, id],
      };
    });

  return (
    <div className="space-y-4">
      {progress ? (
        <UnitMapSummary
          done={completed.length}
          total={MATH_UNITS.length}
          next={next ? { id: next.id, name: `${next.titleZh}（${next.title}）` } : undefined}
          onOpenUnit={openUnitAndScroll}
        />
      ) : null}
      {MATH_UNITS.map((unit) => {
        const unlocked = isUnitUnlocked(unit, completed);
        const isDone = completed.includes(unit.id);
        const missing = missingPrerequisites(MATH_UNITS, unit, completed);
        const unitLessons = unit.lessonIds
          .map((lid) => reviewed[lid])
          .filter(Boolean);
        return (
          <div
            key={unit.id}
            id={`unit-${unit.id}`}
            className={`scroll-mt-24 rounded-2xl border bg-white shadow-sm ${
              unlocked ? "border-line" : "border-line opacity-60"
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
                  className={`grid size-9 place-items-center rounded-full text-sm font-bold ${
                    isDone
                      ? "bg-emerald-700/15 text-emerald-800"
                      : unlocked
                        ? "bg-navy text-cream"
                        : "bg-cream text-ink-faint"
                  }`}
                >
                  {isDone ? "✓" : unlocked ? unit.id : "🔒"}
                </span>
                <div className="min-w-0">
                  <h3 className="font-semibold text-navy">
                    單元 {unit.id}　{unit.titleZh}
                  </h3>
                  <p className="mt-0.5 text-xs text-ink-faint">
                    {[
                      unit.title,
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
                    <p className="mt-1 text-xs font-medium text-gold-ink">
                      🔒 先通過：{missing.map((u) => `單元 ${u.id} ${u.titleZh}`).join("、")}
                    </p>
                  ) : null}
                </div>
              </div>
              {unlocked && (
                <span className="text-ink-faint">{openUnit === unit.id ? "▲" : "▼"}</span>
              )}
            </button>

            {openUnit === unit.id && unlocked && (
              <div className="border-t border-line p-5 pt-4">
                {unitLessons.map((l) => (
                  <details key={l.id} className="mb-3 rounded-xl bg-cream/70 p-4">
                    <summary className="cursor-pointer font-medium text-navy">
                      {l.id} — {l.title}
                    </summary>
                    <p className="mt-3 whitespace-pre-line leading-relaxed text-ink-muted">
                      {l.concept}
                    </p>
                    <div className="mt-3 rounded-lg border border-line bg-white p-3 text-sm">
                      <p className="font-semibold text-navy">示範例子</p>
                      <p className="mt-1 text-ink">{l.example.scenario}</p>
                      <p className="mt-2 text-ink-muted">{l.example.walkthrough}</p>
                    </div>
                    {l.traps.length > 0 && (
                      <div className="mt-3 rounded-lg border border-gold/40 bg-cream p-3 text-sm text-ink">
                        <p className="font-semibold text-gold-ink">常見陷阱</p>
                        <ul className="mt-1 list-disc pl-5 text-ink-muted">
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
                          className="rounded-full bg-navy/5 px-3 py-1 text-xs font-semibold text-navy"
                          title={t.definition}
                        >
                          {t.term}
                        </span>
                      ))}
                    </div>
                  </details>
                ))}
                <MathPracticeGate
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
