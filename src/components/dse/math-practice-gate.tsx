"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  MATH_UNITS,
  getPracticeSet,
  unitUnlocked,
  type Unit,
} from "@/lib/dse/math-path";
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

export const MATH_PROGRESS_KEY = "dsehack-math-progress-v1";

const toRef = (u: Unit): UnitRef => ({ id: u.id, name: `${u.titleZh}（${u.title}）` });

/**
 * Practice gate for the compulsory mathematics path.
 * Pass mark is 7/10. Progress stays in localStorage on this device.
 */
export default function MathPracticeGate({
  unit,
  completedUnits,
  onPassed,
  onOpenUnit,
}: Props) {
  const storageKey = MATH_PROGRESS_KEY;
  const [answers, setAnswers] = useState<Record<string, QState>>({});
  const [submitted, setSubmitted] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [unlockedNow, setUnlockedNow] = useState<UnitRef[]>([]);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const questions = useMemo<DrillQuestion[]>(
    () => getPracticeSet(unit.topicKey, 10),
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
      setUnlockedNow(unitsUnlockedBy(MATH_UNITS, completedUnits, unit.id).map(toRef));
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
      // localStorage unavailable — session-only progress
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
        missing={missingPrerequisites(MATH_UNITS, unit, completedUnits).map(toRef)}
      />
    );
  }

  const nextUnit = nextOpenUnit(MATH_UNITS, completedUnits);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h3 ref={headingRef} className="scroll-mt-24 text-lg font-semibold text-navy">
          練習：{unit.titleZh}（{questions.length} 題）
        </h3>
        <span className="text-sm text-ink-muted">
          合格：≥{unit.passThreshold}/{questions.length}
        </span>
      </div>

      <div className="space-y-6">
        {questions.map((q, qi) => {
          const a = answers[q.id];
          return (
            <div
              key={q.id}
              className="rounded-2xl border border-line bg-white p-5 shadow-sm"
            >
              <p className="text-xs text-ink-faint">
                {DIFFICULTY_LABEL[q.difficulty].zh} · {q.id}
              </p>
              <p className="mt-2 font-medium text-ink">
                {qi + 1}. {q.question}
              </p>
              <div className="mt-3 space-y-2">
                {q.options.map((o) => {
                  const letter = o.charAt(0);
                  const picked = a?.picked === letter;
                  const isAns = letter === q.answer;
                  let cls =
                    "border-line bg-white text-ink hover:bg-cream cursor-pointer";
                  if (submitted && isAns)
                    cls = "border-emerald-700/50 bg-emerald-700/15 font-semibold text-emerald-900";
                  else if (picked && submitted)
                    cls = "border-rose-700/50 bg-rose-700/15 text-rose-900";
                  else if (picked)
                    cls = "border-navy/40 bg-navy/5 font-semibold text-navy";
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
                        <span className="ml-2 text-sm text-rose-700">
                          ✗ 你的答案
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              {submitted && (
                <p className="mt-3 rounded-lg bg-cream p-3 text-sm leading-relaxed text-ink-muted">
                  {q.explanation}
                  <Link
                    href={questionHref("math", q)}
                    className="ml-2 font-semibold text-navy underline underline-offset-2"
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
            className="btn-navy mt-4 w-full rounded-full py-3 font-semibold disabled:opacity-40"
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
