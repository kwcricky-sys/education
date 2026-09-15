"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ECON_UNITS,
  getPracticeSet,
  unitUnlocked,
  type Unit,
} from "@/lib/dse/econ-path";
import type { DrillQuestion } from "@/lib/dse/drills";
import { questionHref } from "@/lib/dse/drills";
import Link from "next/link";

type Props = { unit: Unit; completedUnits: number[] };

type QState = { picked: string | null; correct: boolean };

/**
 * PracticeGate: unit practice with pass threshold (default 7/10).
 * Progress persists in localStorage (privacy-first, no account).
 */
export default function PracticeGate({ unit, completedUnits }: Props) {
  const storageKey = `dsehack-econ-progress-v1`;
  const [answers, setAnswers] = useState<Record<string, QState>>({});
  const [submitted, setSubmitted] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const questions = useMemo<DrillQuestion[]>(
    () => getPracticeSet(unit.topicKey, 10),
    [unit.topicKey],
  );

  useEffect(() => setHydrated(true), []);

  const passCount = questions.filter((q) => answers[q.id]?.correct).length;
  const answeredAll = questions.every((q) => answers[q.id]?.picked);
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
    // record into global progress (completed units + wrong-question book)
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
  }

  if (!hydrated) return <div className="h-40" />;

  const unlocked = unitUnlocked(unit, completedUnits);
  if (!unlocked) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center">
        <p className="font-medium text-amber-800">
          🔒 Locked — complete Unit {unit.prerequisites.join(" & ")} first
        </p>
        <p className="mt-1 text-sm text-amber-700">
          Lessons unlock in order so each concept builds on the last.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          Practice: {unit.title} ({questions.length} questions)
        </h3>
        <span className="text-sm text-black/50">
          Pass: ≥7/{questions.length}
        </span>
      </div>

      <div className="space-y-6">
        {questions.map((q, qi) => {
          const a = answers[q.id];
          return (
            <div key={q.id} className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-xs text-black/40">
                {q.difficulty} · {q.id}
              </p>
              <p className="mt-2 font-medium">
                {qi + 1}. {q.question}
              </p>
              <div className="mt-3 space-y-2">
                {q.options.map((o) => {
                  const letter = o.charAt(0);
                  const picked = a?.picked === letter;
                  const isAns = letter === q.answer;
                  let cls = "border-black/5 bg-white hover:bg-black/5 cursor-pointer";
                  if (submitted && isAns)
                    cls = "border-green-300 bg-green-50 font-semibold";
                  else if (picked && submitted)
                    cls = "border-red-300 bg-red-50";
                  else if (picked) cls = "border-blue-300 bg-blue-50";
                  return (
                    <button
                      key={letter}
                      onClick={() => pick(q, letter)}
                      className={`block w-full rounded-xl border p-3 text-left transition ${cls}`}
                    >
                      {o}
                      {submitted && isAns && (
                        <span className="ml-2 text-sm text-green-700">✓</span>
                      )}
                      {picked && submitted && !isAns && (
                        <span className="ml-2 text-sm text-red-600">
                          ✗ your answer
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              {submitted && (
                <p className="mt-3 rounded-lg bg-black/5 p-3 text-sm text-black/70">
                  {q.explanation}
                  <Link
                    href={questionHref("econ", q)}
                    className="ml-2 underline text-blue-600"
                  >
                    permalink
                  </Link>
                </p>
              )}
            </div>
          );
        })}
      </div>

      {!submitted ? (
        <button
          onClick={submit}
          disabled={!answeredAll}
          className="mt-6 w-full rounded-full bg-blue-700 py-3 font-semibold text-white disabled:opacity-40"
        >
          {answeredAll ? "Submit answers" : `Answer all ${questions.length} questions`}
        </button>
      ) : (
        <div
          className={`mt-6 rounded-2xl p-6 text-center ${
            passed ? "bg-green-50" : "bg-red-50"
          }`}
        >
          <p className="text-2xl font-bold">
            {passCount}/{questions.length} — {passed ? "PASSED 🎉" : "Not yet"}
          </p>
          <p className="mt-2 text-sm text-black/60">
            {passed
              ? `Unit ${unit.id} complete. The next unit is unlocked.`
              : `You need 7 to pass. Review the explanations above and retry.`}
          </p>
          {!passed && (
            <button
              onClick={reset}
              className="mt-4 rounded-full bg-blue-700 px-8 py-2.5 font-semibold text-white"
            >
              Retry
            </button>
          )}
        </div>
      )}
    </div>
  );
}
