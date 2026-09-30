"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  BAFS_UNITS,
  getBafsPracticeSet,
  unitUnlocked,
  type Unit,
} from "@/lib/dse/bafs-path";
import type { DrillQuestion } from "@/lib/dse/drills";
import { questionHref } from "@/lib/dse/drills";
import {
  missingPrerequisites,
  nextOpenUnit,
  unitsUnlockedBy,
} from "@/lib/dse/learn-path";
import { DIFFICULTY_LABEL } from "@/lib/dse/types";
import {
  GateProgress,
  GateResult,
  LockedNotice,
  type UnitRef,
} from "@/components/dse/practice-gate-parts";
import Link from "next/link";

type Props = {
  unit: Unit;
  completedUnits: number[];
  onPassed?: (unitId: number) => void;
  onOpenUnit?: (unitId: number) => void;
};

type QState = { picked: string | null; correct: boolean };

export const BAFS_PROGRESS_KEY = "dsehack-bafs-progress-v1";

const toRef = (u: Unit): UnitRef => ({ id: u.id, name: `${u.titleZh}（${u.title}）` });

/**
 * BAFS practice gate: unit practice with pass threshold (7/10).
 */
export default function BafsPracticeGate({
  unit,
  completedUnits,
  onPassed,
  onOpenUnit,
}: Props) {
  const storageKey = BAFS_PROGRESS_KEY;
  const [answers, setAnswers] = useState<Record<string, QState>>({});
  const [submitted, setSubmitted] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [unlockedNow, setUnlockedNow] = useState<UnitRef[]>([]);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const questions = useMemo<DrillQuestion[]>(
    () => getBafsPracticeSet(unit.topicKey, 10),
    [unit.topicKey],
  );

  useEffect(() => setHydrated(true), []);

  const passCount = questions.filter((q) => answers[q.id]?.correct).length;
  const answeredCount = questions.filter((q) => answers[q.id]?.picked).length;
  const answeredAll = answeredCount === questions.length;
  const passed = passCount >= unit.passThreshold;

  function pick(q: DrillQuestion, letter: string) {
    if (submitted || answers[q.id]?.picked) return;
    setAnswers((a) => ({
      ...a,
      [q.id]: { picked: letter, correct: letter === q.answer },
    }));
  }

  function submit() {
    setSubmitted(true);
    if (passed) {
      setUnlockedNow(unitsUnlockedBy(BAFS_UNITS, completedUnits, unit.id).map(toRef));
      onPassed?.(unit.id);
    }
    try {
      const raw = localStorage.getItem(storageKey);
      const p = raw
        ? JSON.parse(raw)
        : { completed: [], wrong: {}, attempts: {} } as {
            completed: number[];
            wrong: Record<string, number>;
            attempts: Record<string, { right: number; total: number }>;
          };
      if (passed && !p.completed.includes(unit.id)) p.completed.push(unit.id);
      for (const q of questions) {
        const a = answers[q.id];
        if (!a) continue;
        const at = (p.attempts[q.id] ||= { right: 0, total: 0 });
        at.total += 1;
        if (a.correct) at.right += 1;
        else p.wrong[q.id] = (p.wrong[q.id] || 0) + 1;
      }
      localStorage.setItem(storageKey, JSON.stringify(p));
    } catch {
      // localStorage unavailable
    }
  }

  function reset() {
    setAnswers({});
    setSubmitted(false);
    headingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (!hydrated) return <div className="h-40" />;

  const unlocked = unitUnlocked(unit, completedUnits);
  if (!unlocked) {
    return (
      <LockedNotice
        missing={missingPrerequisites(BAFS_UNITS, unit, completedUnits).map(toRef)}
      />
    );
  }

  const nextUnit = nextOpenUnit(BAFS_UNITS, completedUnits);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h3 ref={headingRef} className="scroll-mt-24 text-lg font-semibold text-slate-900">
          練習：{unit.titleZh}（{questions.length} 題）
        </h3>
        <span className="text-sm text-slate-600">
          合格：≥{unit.passThreshold}/{questions.length}
        </span>
      </div>

      <div className="space-y-6">
        {questions.map((q, qi) => {
          const a = answers[q.id];
          return (
            <div
              key={q.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <p className="text-xs text-slate-500">
                {DIFFICULTY_LABEL[q.difficulty].zh} · {q.id}
              </p>
              <p className="mt-2 font-medium text-slate-900">
                {qi + 1}. {q.question}
              </p>
              <div className="mt-3 space-y-2">
                {q.options.map((o) => {
                  const letter = o.charAt(0);
                  const picked = a?.picked === letter;
                  const isAns = letter === q.answer;
                  let cls =
                    "border-slate-200 bg-white text-slate-800 hover:bg-slate-100 cursor-pointer";
                  if (submitted && isAns)
                    cls = "border-emerald-700/50 bg-emerald-700/15 font-semibold text-emerald-900";
                  else if (picked && submitted)
                    cls = "border-rose-700/50 bg-rose-700/15 text-rose-900";
                  else if (picked)
                    cls = "border-blue-700/50 bg-blue-700/10 font-semibold text-navy";
                  return (
                    <button
                      key={letter}
                      onClick={() => pick(q, letter)}
                      className={`block w-full rounded-xl border p-3 text-left transition ${cls}`}
                    >
                      {o}
                      {submitted && isAns && (
                        <span className="ml-2 text-sm text-emerald-700">✓</span>
                      )}
                      {picked && submitted && !isAns && (
                        <span className="ml-2 text-sm text-rose-700">✗ 你的答案</span>
                      )}
                    </button>
                  );
                })}
              </div>
              {submitted && (
                <p className="mt-3 rounded-lg bg-slate-100 p-3 text-sm leading-relaxed text-slate-700">
                  {q.explanation}
                  <Link
                    href={questionHref("bafs", q)}
                    className="ml-2 text-blue-700 underline"
                  >
                    單題連結
                  </Link>
                </p>
              )}
            </div>
          );
        })}
      </div>

      {!submitted ? (
        <>
          <GateProgress
            answered={answeredCount}
            total={questions.length}
            pass={unit.passThreshold}
          />
          <button
            onClick={submit}
            disabled={!answeredAll}
            className="mt-4 w-full rounded-full bg-blue-800 py-3 font-semibold text-white disabled:opacity-40"
          >
            {answeredAll
              ? "提交答案"
              : `仲有 ${questions.length - answeredCount} 題未答`}
          </button>
        </>
      ) : (
        <GateResult
          passCount={passCount}
          total={questions.length}
          pass={unit.passThreshold}
          passed={passed}
          unitId={unit.id}
          unlocked={unlockedNow}
          next={nextUnit ? toRef(nextUnit) : undefined}
          onRetry={reset}
          onOpenUnit={onOpenUnit}
        />
      )}
    </div>
  );
}
