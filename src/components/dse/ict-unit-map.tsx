"use client";

import { useState, useSyncExternalStore } from "react";
import { ICT_UNITS } from "@/lib/dse/ict-path";
import IctPracticeGate, {
  getIctProgressServerSnapshot,
  getIctProgressSnapshot,
  subscribeIctProgress,
} from "@/components/dse/ict-practice-gate";
import lessons from "@/data/dse/ict-lessons.json";
import {
  isUnitUnlocked,
  missingPrerequisites,
  nextOpenUnit,
} from "@/lib/dse/learn-path";
import { UnitMapSummary, scrollToUnit } from "@/components/dse/unit-map-summary";

function completedFromSnapshot(raw: string): number[] {
  try {
    const parsed = JSON.parse(raw) as { completed?: unknown };
    return Array.isArray(parsed.completed)
      ? parsed.completed.filter((id): id is number => typeof id === "number")
      : [];
  } catch {
    return [];
  }
}

/**
 * Unit map for the ICT learning path — lock state, lessons, practice gate.
 */
export default function IctUnitMap() {
  const [openUnit, setOpenUnit] = useState<number | null>(null);
  const progressRaw = useSyncExternalStore(
    subscribeIctProgress,
    getIctProgressSnapshot,
    getIctProgressServerSnapshot,
  );
  const completed = completedFromSnapshot(progressRaw);
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

  const next = nextOpenUnit(ICT_UNITS, completed);

  const openUnitAndScroll = (id: number) => {
    setOpenUnit(id);
    scrollToUnit(id);
  };

  return (
    <div className="space-y-4">
      <UnitMapSummary
        done={completed.length}
        total={ICT_UNITS.length}
        next={next ? { id: next.id, name: `${next.titleZh}（${next.title}）` } : undefined}
        onOpenUnit={openUnitAndScroll}
      />
      {ICT_UNITS.map((unit) => {
        const unlocked = isUnitUnlocked(unit, completed);
        const isDone = completed.includes(unit.id);
        const missing = missingPrerequisites(ICT_UNITS, unit, completed);
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
                      ? "bg-emerald-100 text-emerald-800"
                      : unlocked
                        ? "bg-navy text-gold"
                        : "bg-black/10 text-black/40"
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
                    <p className="mt-1 text-xs font-medium text-amber-800">
                      🔒 先通過：{missing.map((u) => `單元 ${u.id} ${u.titleZh}`).join("、")}
                    </p>
                  ) : null}
                </div>
              </div>
              {unlocked && (
                <span className="text-black/40">{openUnit === unit.id ? "▲" : "▼"}</span>
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
                      <div className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-950">
                        <p className="font-semibold">常見陷阱</p>
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
                          className="rounded-full bg-white px-3 py-1 text-xs text-navy ring-1 ring-line"
                          title={t.definition}
                        >
                          {t.term}
                        </span>
                      ))}
                    </div>
                  </details>
                ))}
                <IctPracticeGate
                  unit={unit}
                  completedUnits={completed}
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
