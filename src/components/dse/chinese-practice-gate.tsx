"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  GateProgress,
  GateResult,
  LockedNotice,
  type UnitRef,
} from "@/components/dse/practice-gate-parts";
import {
  CHINESE_UNITS,
  getChinesePracticeSet,
  type ChineseQuestion,
  type ChineseUnit,
} from "@/lib/dse/chinese-path";
import { recordChineseGate } from "@/lib/dse/chinese-progress";
import {
  isUnitUnlocked,
  missingPrerequisites,
  nextOpenUnit,
  unitsUnlockedBy,
} from "@/lib/dse/learn-path";

type Props = {
  unit: ChineseUnit;
  completedUnits: number[];
  onOpenUnit?: (unitId: number) => void;
};

const toRef = (unit: ChineseUnit): UnitRef => ({ id: unit.id, name: unit.title });

const LETTERS = ["A", "B", "C"] as const;

type QState = { picked: number | null; correct: boolean };

/**
 * Chinese practice gate. Pass mark is 3/4, from the locked unit brief.
 * Progress stays in localStorage on this device (dsehack-chinese-progress-v1).
 */
export default function ChinesePracticeGate({
  unit,
  completedUnits,
  onOpenUnit,
}: Props) {
  const [answers, setAnswers] = useState<Record<string, QState>>({});
  const [submitted, setSubmitted] = useState(false);
  const [unlockedNow, setUnlockedNow] = useState<UnitRef[]>([]);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const questions = useMemo<ChineseQuestion[]>(
    () => getChinesePracticeSet(unit.unitCode),
    [unit.unitCode],
  );

  const passCount = questions.filter((q) => answers[q.id]?.correct).length;
  const answeredCount = questions.filter((q) => answers[q.id]?.picked !== undefined && answers[q.id]?.picked !== null).length;
  const answeredAll = answeredCount === questions.length;
  const passed = passCount >= unit.passThreshold;

  function pick(q: ChineseQuestion, index: number) {
    const already = answers[q.id]?.picked;
    if (submitted || (already !== undefined && already !== null)) return;
    setAnswers((current) => ({
      ...current,
      [q.id]: { picked: index, correct: index === q.answerIndex },
    }));
  }

  function submit() {
    setSubmitted(true);
    if (passed) {
      setUnlockedNow(unitsUnlockedBy(CHINESE_UNITS, completedUnits, unit.id).map(toRef));
    }
    recordChineseGate({
      unitId: unit.id,
      passed,
      results: questions.flatMap((question) => {
        const answer = answers[question.id];
        if (!answer || answer.picked === null) return [];
        return [{ id: question.id, correct: answer.correct }];
      }),
    });
  }

  function reset() {
    setAnswers({});
    setSubmitted(false);
    headingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (!isUnitUnlocked(unit, completedUnits)) {
    return (
      <LockedNotice
        missing={missingPrerequisites(CHINESE_UNITS, unit, completedUnits).map(toRef)}
      />
    );
  }

  const nextUnit = nextOpenUnit(CHINESE_UNITS, completedUnits);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h3 ref={headingRef} className="scroll-mt-24 text-lg font-semibold text-slate-900">
          練習：{unit.title}（{questions.length} 題）
        </h3>
        <span className="text-sm text-slate-600">
          合格：≥{unit.passThreshold}/{questions.length}
        </span>
      </div>
      <p className="mb-4 text-xs leading-relaxed text-slate-500">
        自編練習，非考評局試題，亦非指定範文原文。
      </p>

      <div className="space-y-6">
        {questions.map((question, index) => {
          const answer = answers[question.id];
          return (
            <div
              key={question.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg"
            >
              <p className="text-xs text-slate-500">自編 · {question.id}</p>
              <p className="mt-2 font-medium text-slate-900">
                {index + 1}. {question.prompt}
              </p>
              <div className="mt-3 space-y-2">
                {question.choices.map((choice, choiceIndex) => {
                  const picked = answer?.picked === choiceIndex;
                  const isAnswer = choiceIndex === question.answerIndex;
                  let cls =
                    "border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-200 cursor-pointer";
                  if (submitted && isAnswer)
                    cls = "border-emerald-700/50 bg-emerald-700/15 font-semibold text-emerald-900";
                  else if (picked && submitted)
                    cls = "border-rose-700/50 bg-rose-700/15 text-rose-900";
                  else if (picked)
                    cls = "border-blue-700/50 bg-blue-700/10 font-semibold text-navy";
                  return (
                    <button
                      key={choice}
                      type="button"
                      onClick={() => pick(question, choiceIndex)}
                      className={`block w-full rounded-xl border p-3 text-left transition ${cls}`}
                    >
                      {LETTERS[choiceIndex]}. {choice}
                      {submitted && isAnswer && (
                        <span className="ml-2 text-sm text-emerald-700">✓</span>
                      )}
                      {picked && submitted && !isAnswer && (
                        <span className="ml-2 text-sm text-rose-700">✗ 你的答案</span>
                      )}
                    </button>
                  );
                })}
              </div>
              {submitted && (
                <div className="mt-3 space-y-2 rounded-lg bg-slate-100 p-3 text-sm leading-relaxed text-slate-700">
                  <p>
                    <span className="font-semibold text-slate-900">提示：</span>
                    {question.hint}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-900">解說：</span>
                    {question.explain}
                  </p>
                </div>
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
            type="button"
            onClick={submit}
            disabled={!answeredAll}
            className="mt-4 w-full rounded-full bg-blue-800 py-3 font-semibold text-white disabled:opacity-40"
          >
            {answeredAll ? "提交答案" : `仲有 ${questions.length - answeredCount} 題未答`}
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
      {unit.id === 12 && submitted && passed ? (
        <p className="mt-4 text-sm text-slate-600">
          回練入口：
          <Link href="/dse/chinese/error-notebook" className="mx-1 font-semibold text-blue-700 underline">
            錯題本
          </Link>
          <Link href="/dse/chinese/cat" className="mx-1 font-semibold text-blue-700 underline">
            診斷室
          </Link>
          <Link href="/dse/chinese" className="mx-1 font-semibold text-blue-700 underline">
            指定範文
          </Link>
        </p>
      ) : null}
    </div>
  );
}
