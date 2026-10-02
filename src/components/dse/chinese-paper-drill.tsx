"use client";

import { useMemo, useState } from "react";
import type { DrillQuestion } from "@/lib/dse/drills";
import { CHINESE_PAPER_SKILLS } from "@/lib/dse/chinese-path";
import { DIFFICULTY_LABEL } from "@/lib/dse/types";

type QState = { picked: string | null; correct: boolean };

export default function ChinesePaperDrill({
  questions,
}: {
  questions: DrillQuestion[];
}) {
  const [topic, setTopic] = useState(CHINESE_PAPER_SKILLS[0].id);
  const [answers, setAnswers] = useState<Record<string, QState>>({});
  const [submitted, setSubmitted] = useState(false);

  const visible = useMemo(
    () => questions.filter((question) => question.topic === topic),
    [questions, topic],
  );
  const skill = CHINESE_PAPER_SKILLS.find((item) => item.id === topic);

  function switchTopic(next: string) {
    setTopic(next);
    setSubmitted(false);
  }

  function pick(question: DrillQuestion, letter: string) {
    if (submitted || answers[question.id]?.picked) return;
    setAnswers((prev) => ({
      ...prev,
      [question.id]: { picked: letter, correct: letter === question.answer },
    }));
  }

  const answeredCount = visible.filter((question) => answers[question.id]?.picked).length;
  const passCount = visible.filter((question) => answers[question.id]?.correct).length;

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {CHINESE_PAPER_SKILLS.map((item) => {
          const count = questions.filter((question) => question.topic === item.id).length;
          const active = item.id === topic;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => switchTopic(item.id)}
              className={`rounded-full border px-3 py-1.5 text-sm font-semibold ${
                active
                  ? "border-blue-800 bg-blue-800 text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:border-blue-700/40"
              }`}
            >
              {item.title} · {count}
            </button>
          );
        })}
      </div>
      {skill ? <p className="mt-3 text-sm leading-relaxed text-slate-600">{skill.blurb}</p> : null}

      <div className="mt-6 space-y-6">
        {visible.map((question, index) => {
          const state = answers[question.id];
          return (
            <div key={question.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg">
              <p className="text-xs text-slate-500">
                {DIFFICULTY_LABEL[question.difficulty].zh} · {question.id}
              </p>
              <p className="mt-2 font-medium text-slate-900">
                {index + 1}. {question.question}
              </p>
              <div className="mt-3 space-y-2">
                {question.options.map((option) => {
                  const letter = option.charAt(0);
                  const picked = state?.picked === letter;
                  const isAnswer = letter === question.answer;
                  let cls = "border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-200";
                  if (submitted && isAnswer) cls = "border-emerald-700/50 bg-emerald-700/15 font-semibold text-emerald-900";
                  else if (picked && submitted) cls = "border-rose-700/50 bg-rose-700/15 text-rose-900";
                  else if (picked) cls = "border-blue-700/50 bg-blue-700/10 font-semibold text-navy";
                  return (
                    <button
                      key={letter}
                      type="button"
                      onClick={() => pick(question, letter)}
                      className={`block w-full rounded-xl border p-3 text-left transition ${cls}`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
              {submitted ? (
                <p className="mt-3 rounded-lg bg-slate-100 p-3 text-sm leading-relaxed text-slate-700">
                  {question.explanation}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>

      {!submitted ? (
        <button
          type="button"
          onClick={() => setSubmitted(true)}
          disabled={answeredCount !== visible.length}
          className="mt-4 w-full rounded-full bg-blue-800 py-3 font-semibold text-white disabled:opacity-40"
        >
          {answeredCount === visible.length
            ? "提交呢組答案"
            : `仲有 ${visible.length - answeredCount} 題未答`}
        </button>
      ) : (
        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5">
          <p className="font-semibold text-slate-900">
            呢組答啱 {passCount} / {visible.length}
          </p>
          <button
            type="button"
            onClick={() => {
              setAnswers((prev) => {
                const next = { ...prev };
                for (const question of visible) delete next[question.id];
                return next;
              });
              setSubmitted(false);
            }}
            className="mt-3 text-sm font-semibold text-blue-700"
          >
            重做呢組
          </button>
        </div>
      )}
    </div>
  );
}
