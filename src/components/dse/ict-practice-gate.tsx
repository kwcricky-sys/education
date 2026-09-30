"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ICT_UNITS,
  getPracticeSet,
  unitUnlocked,
  type Unit,
} from "@/lib/dse/ict-path";
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

type Props = {
  unit: Unit;
  completedUnits: number[];
  onPassed?: (unitId: number) => void;
  onOpenUnit?: (unitId: number) => void;
};

type QState = { picked: string | null; correct: boolean };

export const ICT_PROGRESS_KEY = "dsehack-ict-progress-v1";
export const ICT_PROGRESS_EVENT = "dsehack-ict-progress";

export type IctStoredProgress = {
  completed: number[];
  lessonsRead: string[];
  wrong: Record<string, number>;
  attempts: Record<string, { right: number; total: number }>;
};

const EMPTY_PROGRESS: IctStoredProgress = {
  completed: [],
  lessonsRead: [],
  wrong: {},
  attempts: {},
};

function emptyIctProgress(): IctStoredProgress {
  return {
    completed: [],
    lessonsRead: [],
    wrong: {},
    attempts: {},
  };
}

function parseProgress(raw: string | null): IctStoredProgress {
  if (!raw) return emptyIctProgress();
  try {
    const parsed = JSON.parse(raw) as Partial<IctStoredProgress>;
    return {
      completed: Array.isArray(parsed.completed) ? parsed.completed : [],
      lessonsRead: Array.isArray(parsed.lessonsRead) ? parsed.lessonsRead : [],
      wrong: parsed.wrong && typeof parsed.wrong === "object" ? parsed.wrong : {},
      attempts:
        parsed.attempts && typeof parsed.attempts === "object" ? parsed.attempts : {},
    };
  } catch {
    return emptyIctProgress();
  }
}

const EMPTY_RAW = JSON.stringify(EMPTY_PROGRESS);
let memoryRaw = EMPTY_RAW;

export function subscribeIctProgress(onStoreChange: () => void) {
  window.addEventListener(ICT_PROGRESS_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(ICT_PROGRESS_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

export function getIctProgressSnapshot(): string {
  try {
    return localStorage.getItem(ICT_PROGRESS_KEY) ?? memoryRaw;
  } catch {
    return memoryRaw;
  }
}

export function getIctProgressServerSnapshot(): string {
  return EMPTY_RAW;
}

function writeIctProgress(next: IctStoredProgress) {
  memoryRaw = JSON.stringify(next);
  try {
    localStorage.setItem(ICT_PROGRESS_KEY, memoryRaw);
  } catch {
    // session-only if storage is blocked
  }
  window.dispatchEvent(new Event(ICT_PROGRESS_EVENT));
}

const toRef = (u: Unit): UnitRef => ({ id: u.id, name: `${u.titleZh}（${u.title}）` });

/**
 * Unit practice with a 7/10 pass mark.
 * Progress stays in localStorage (no account).
 */
export default function IctPracticeGate({
  unit,
  completedUnits,
  onPassed,
  onOpenUnit,
}: Props) {
  const [answers, setAnswers] = useState<Record<string, QState>>({});
  const [submitted, setSubmitted] = useState(false);
  const [unlockedNow, setUnlockedNow] = useState<UnitRef[]>([]);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const questions = useMemo<DrillQuestion[]>(
    () => getPracticeSet(unit.topicKey, 10),
    [unit.topicKey],
  );

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
      setUnlockedNow(unitsUnlockedBy(ICT_UNITS, completedUnits, unit.id).map(toRef));
      onPassed?.(unit.id);
    }
    const p = parseProgress(getIctProgressSnapshot());
    if (passed && !p.completed.includes(unit.id)) p.completed.push(unit.id);
    for (const q of questions) {
      const a = answers[q.id];
      if (!a) continue;
      const at = (p.attempts[q.id] ||= { right: 0, total: 0 });
      at.total += 1;
      if (a.correct) at.right += 1;
      else p.wrong[q.id] = (p.wrong[q.id] || 0) + 1;
    }
    writeIctProgress(p);
  }

  function reset() {
    setAnswers({});
    setSubmitted(false);
    headingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const unlocked = unitUnlocked(unit, completedUnits);
  if (!unlocked) {
    return (
      <LockedNotice
        missing={missingPrerequisites(ICT_UNITS, unit, completedUnits).map(toRef)}
      />
    );
  }

  const nextUnit = nextOpenUnit(ICT_UNITS, completedUnits);

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
              <p className="mt-2 font-medium text-navy">
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
                    href={questionHref("ict", q)}
                    className="ml-2 font-semibold text-navy underline"
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
