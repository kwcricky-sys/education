"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import ChinesePracticeGate from "@/components/dse/chinese-practice-gate";
import { UnitMapSummary, scrollToUnit } from "@/components/dse/unit-map-summary";
import { CHINESE_UNITS, type ChineseLesson, type ChineseUnit } from "@/lib/dse/chinese-path";
import {
  getChineseProgress,
  getChineseProgressServer,
  subscribeChineseProgress,
} from "@/lib/dse/chinese-progress";
import {
  isUnitUnlocked,
  missingPrerequisites,
  nextOpenUnit,
} from "@/lib/dse/learn-path";
import lessons from "@/data/dse/chinese-lessons.json";

export default function ChineseUnitMap() {
  const progress = useSyncExternalStore(
    subscribeChineseProgress,
    getChineseProgress,
    getChineseProgressServer,
  );
  const [openUnit, setOpenUnit] = useState<number | null>(null);
  const completed = progress.completed;
  const lessonBank = lessons as Record<string, ChineseLesson>;
  const next = nextOpenUnit(CHINESE_UNITS, completed);

  const openUnitAndScroll = (id: number) => {
    setOpenUnit(id);
    scrollToUnit(id);
  };

  return (
    <div className="space-y-4">
      <UnitMapSummary
        done={completed.length}
        total={CHINESE_UNITS.length}
        next={next ? { id: next.id, name: next.title } : undefined}
        onOpenUnit={openUnitAndScroll}
      />
      {CHINESE_UNITS.map((unit) => (
        <UnitCard
          key={unit.id}
          unit={unit}
          completed={completed}
          open={openUnit === unit.id}
          lessons={unit.lessonIds.map((id) => lessonBank[id]).filter(Boolean)}
          onToggle={() => setOpenUnit(openUnit === unit.id ? null : unit.id)}
          onOpenUnit={openUnitAndScroll}
        />
      ))}
    </div>
  );
}

function UnitCard({
  unit,
  completed,
  open,
  lessons,
  onToggle,
  onOpenUnit,
}: {
  unit: ChineseUnit;
  completed: number[];
  open: boolean;
  lessons: ChineseLesson[];
  onToggle: () => void;
  onOpenUnit: (id: number) => void;
}) {
  const unlocked = isUnitUnlocked(unit, completed);
  const isDone = completed.includes(unit.id);
  const missing = missingPrerequisites(CHINESE_UNITS, unit, completed);

  return (
    <div
      id={`unit-${unit.id}`}
      className={`scroll-mt-24 rounded-2xl border bg-white shadow-lg ${
        unlocked ? "border-slate-200" : "border-slate-200 opacity-60"
      }`}
    >
      <button
        type="button"
        className="flex w-full items-center justify-between gap-3 p-5 text-left"
        aria-expanded={open}
        aria-disabled={!unlocked}
        onClick={() => unlocked && onToggle()}
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
                unit.unitCode,
                unit.label,
                `${lessons.length} 課`,
                isDone ? "已通過" : unlocked ? `練習答對 ${unit.passThreshold}/4 即過關` : null,
              ]
                .filter(Boolean)
                .join(" · ")}
            </p>
            {!unlocked ? (
              <p className="mt-1 text-xs font-medium text-amber-800">
                🔒 先通過：{missing.map((item) => `單元 ${item.id} ${item.title}`).join("、")}
              </p>
            ) : null}
          </div>
        </div>
        {unlocked ? <span className="text-slate-500">{open ? "▲" : "▼"}</span> : null}
      </button>

      {open && unlocked ? (
        <div className="border-t border-slate-200 p-5 pt-4">
          {lessons.map((lesson) => (
            <details
              key={lesson.id}
              open
              className="mb-3 rounded-xl border border-slate-200 bg-slate-50 p-4"
            >
              <summary className="cursor-pointer font-medium text-slate-900">
                {lesson.id} — {lesson.title}
              </summary>
              <p className="mt-3 text-[15px] leading-relaxed whitespace-pre-line text-slate-700">
                {lesson.concept}
              </p>
              <div className="mt-3 rounded-lg border border-slate-200 bg-white p-3 text-sm">
                <p className="font-semibold text-blue-700">示範例子</p>
                <p className="mt-1 text-slate-800">{lesson.example.scenario}</p>
                <p className="mt-2 leading-relaxed text-slate-600">{lesson.example.walkthrough}</p>
              </div>
              {lesson.traps.length > 0 ? (
                <div className="mt-3 rounded-lg border border-amber-700/20 bg-amber-700/10 p-3 text-sm text-amber-900">
                  <p className="font-semibold">常見陷阱</p>
                  <ul className="mt-1 list-disc space-y-1 pl-5">
                    {lesson.traps.map((trap) => (
                      <li key={trap}>{trap}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
              <div className="mt-3 flex flex-wrap gap-2">
                {lesson.terms.map((term) => (
                  <span
                    key={term.term}
                    className="rounded-full border border-blue-700/20 bg-blue-700/10 px-3 py-1 text-xs text-blue-700"
                    title={term.definition}
                  >
                    {term.term}
                  </span>
                ))}
              </div>
            </details>
          ))}
          {unit.links.length > 0 ? (
            <div className="mb-4 rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-sm font-semibold text-slate-900">站內深鏈</p>
              <ul className="mt-2 space-y-1 text-sm">
                {unit.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link href={link.href} className="font-semibold text-blue-700 underline">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          <ChinesePracticeGate
            unit={unit}
            completedUnits={completed}
            onOpenUnit={onOpenUnit}
          />
        </div>
      ) : null}
    </div>
  );
}
