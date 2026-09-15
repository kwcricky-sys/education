"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getEnglishPracticeSet,
  unitUnlocked,
  type Unit,
} from "@/lib/dse/english-path";
import type { DrillQuestion } from "@/lib/dse/drills";
import { questionHref } from "@/lib/dse/drills";
import Link from "next/link";

type Props = { unit: Unit; completedUnits: number[] };

type QState = { picked: string | null; correct: boolean };

/** Shared with the unit map — progress lives on the learner's device only. */
export const ENGLISH_PROGRESS_KEY = "dsehack-english-progress-v1";

/**
 * English practice gate: unit practice with pass threshold (default 7/10).
 * Same gate logic as the ECON path — pass the set to unlock the next unit.
 * Progress persists in localStorage (privacy-first, no account).
 */
export default function EnglishPracticeGate({ unit, completedUnits }: Props) {
  const storageKey = ENGLISH_PROGRESS_KEY;
  const [answers, setAnswers] = useState<Record<string, QState>>({});
  const [submitted, setSubmitted] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const questions = useMemo<DrillQuestion[]>(
    () => getEnglishPracticeSet(unit.topicKey, 10),
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
        : ({ completed: [], lessonsRead: [], wrong: {}, attempts: {} } as {
            completed: number[];
            lessonsRead?: string[];
            wrong: Record<string, number>;
            attempts: Record<string, { right: number; total: number }>;
          });
      p.completed ||= [];
      p.wrong ||= {};
      p.attempts ||= {};
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
      <div className="rounded-2xl border border-amber-400/30 bg-amber-400/10 p-6 text-center">
        <p className="font-medium text-amber-200">
          🔒 未解鎖 — 請先通過單元 {unit.prerequisites.join(" & ")}
        </p>
        <p className="mt-1 text-sm text-amber-200/70">
          單元按次序解鎖，每個概念都建立在前一個之上。
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg font-semibold text-zinc-100">
          練習：{unit.title}（{questions.length} 題）
        </h3>
        <span className="text-sm text-zinc-400">
          合格：≥{unit.passThreshold}/{questions.length}
        </span>
      </div>

      <div className="space-y-6">
        {questions.map((q, qi) => {
          const a = answers[q.id];
          return (
            <div
              key={q.id}
              className="rounded-2xl border border-white/10 bg-zinc-900 p-5 shadow-lg"
            >
              <p className="text-xs text-zinc-500">
                {q.difficulty} · {q.id}
              </p>
              <p className="mt-2 font-medium text-zinc-100">
                {qi + 1}. {q.question}
              </p>
              <div className="mt-3 space-y-2">
                {q.options.map((o) => {
                  const letter = o.charAt(0);
                  const picked = a?.picked === letter;
                  const isAns = letter === q.answer;
                  let cls =
                    "border-white/10 bg-zinc-950/60 text-zinc-200 hover:bg-zinc-800 cursor-pointer";
                  if (submitted && isAns)
                    cls = "border-emerald-400/50 bg-emerald-400/15 font-semibold text-emerald-100";
                  else if (picked && submitted)
                    cls = "border-rose-400/50 bg-rose-400/15 text-rose-100";
                  else if (picked)
                    cls = "border-cyan-400/50 bg-cyan-400/10 text-cyan-50";
                  return (
                    <button
                      key={letter}
                      onClick={() => pick(q, letter)}
                      className={`block w-full rounded-xl border p-3 text-left transition ${cls}`}
                    >
                      {o}
                      {submitted && isAns && (
                        <span className="ml-2 text-sm text-emerald-300">✓</span>
                      )}
                      {picked && submitted && !isAns && (
                        <span className="ml-2 text-sm text-rose-300">
                          ✗ 你的答案
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              {submitted && (
                <p className="mt-3 rounded-lg bg-white/5 p-3 text-sm leading-relaxed text-zinc-300">
                  {q.explanation}
                  <Link
                    href={questionHref("english", q)}
                    className="ml-2 text-cyan-400 underline"
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
        <button
          onClick={submit}
          disabled={!answeredAll}
          className="mt-6 w-full rounded-full bg-cyan-500 py-3 font-semibold text-zinc-950 disabled:opacity-40"
        >
          {answeredAll
            ? "提交答案"
            : `請先回答全部 ${questions.length} 題`}
        </button>
      ) : (
        <div
          className={`mt-6 rounded-2xl border p-6 text-center ${
            passed
              ? "border-emerald-400/30 bg-emerald-400/10"
              : "border-rose-400/30 bg-rose-400/10"
          }`}
        >
          <p className="text-2xl font-bold text-zinc-100">
            {passCount}/{questions.length} — {passed ? "合格 🎉" : "尚未合格"}
          </p>
          <p className="mt-2 text-sm text-zinc-300">
            {passed
              ? `單元 ${unit.id} 已完成，下一個單元已解鎖。`
              : `你需要 ${unit.passThreshold} 題才合格。先看上面的解釋，再重做一次。`}
          </p>
          {!passed && (
            <button
              onClick={reset}
              className="mt-4 rounded-full bg-cyan-500 px-8 py-2.5 font-semibold text-zinc-950"
            >
              再做一次
            </button>
          )}
        </div>
      )}
    </div>
  );
}
