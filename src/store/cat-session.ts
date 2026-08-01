"use client";

import { create } from "zustand";
import {
  selectNextDifficulty,
  selectNextItem,
  shouldStopCat,
  updateTheta,
} from "@/lib/dse/cat/engine";
import { buildCatPool } from "@/lib/dse/cat/pool";
import { generateRemediationQuiz } from "@/lib/dse/cat/remediation";
import { buildCatReport } from "@/lib/dse/cat/scoring";
import type {
  CatAnswerRecord,
  CatPhase,
  CatPoolItem,
  CatReport,
  CatSessionKind,
} from "@/lib/dse/cat/types";
import { CAT_DEFAULT_TARGET, CAT_MAX_ITEMS } from "@/lib/dse/cat/types";
import { CHINESE_PRESCRIBED_TEXTS } from "@/lib/dse/texts";
import { useErrorNotebook } from "@/store/error-notebook";

type StartResult = { ok: true } | { ok: false; error: string };

type CatSessionState = {
  phase: CatPhase;
  sessionKind: CatSessionKind;
  selectedSlugs: string[];
  targetCount: number;
  pool: CatPoolItem[];
  current: CatPoolItem | null;
  usedUids: string[];
  answers: CatAnswerRecord[];
  theta: number;
  consecutiveCorrect: number;
  consecutiveWrong: number;
  recentThetaDeltas: number[];
  questionStartedAt: number | null;
  report: CatReport | null;
  /** Persist last adaptive scope for remediation */
  lastAdaptiveSlugs: string[];
  lastHistoryUids: string[];
  selectAllTexts: () => void;
  toggleText: (slug: string) => void;
  setTargetCount: (n: number) => void;
  startSession: () => StartResult;
  startRemediationSession: () => StartResult;
  startMistakeRetest: (items: CatPoolItem[]) => StartResult;
  submitAnswer: (selectedAnswer: string) => void;
  resetSession: () => void;
};

function labelsFor(slugs: string[]) {
  return slugs.map((slug) => {
    const t = CHINESE_PRESCRIBED_TEXTS.find((x) => x.slug === slug);
    return t ? `${t.source}${t.title}` : slug;
  });
}

function finishReport(
  set: (partial: Partial<CatSessionState>) => void,
  get: () => CatSessionState,
  answers: CatAnswerRecord[],
  theta: number,
  extras: Partial<CatSessionState> = {},
) {
  const state = get();
  const report = buildCatReport({
    answers,
    theta,
    scopeLabels:
      state.sessionKind === "mistake-retest"
        ? ["錯題重測"]
        : state.sessionKind === "remediation"
          ? ["弱點專攻測驗", ...labelsFor(state.selectedSlugs)]
          : labelsFor(state.selectedSlugs),
    sessionKind: state.sessionKind,
  });

  useErrorNotebook.getState().addFromAnswers(answers);

  // Resolve notebook items answered correctly in mistake retest
  if (state.sessionKind === "mistake-retest") {
    for (const a of answers) {
      if (a.isCorrect) useErrorNotebook.getState().markResolved(a.uid);
    }
  }

  set({
    phase: "report",
    answers,
    theta,
    current: null,
    questionStartedAt: null,
    report,
    ...extras,
  });
}

export const useCatSession = create<CatSessionState>((set, get) => ({
  phase: "setup",
  sessionKind: "adaptive",
  selectedSlugs: [],
  targetCount: CAT_DEFAULT_TARGET,
  pool: [],
  current: null,
  usedUids: [],
  answers: [],
  theta: 0,
  consecutiveCorrect: 0,
  consecutiveWrong: 0,
  recentThetaDeltas: [],
  questionStartedAt: null,
  report: null,
  lastAdaptiveSlugs: [],
  lastHistoryUids: [],

  selectAllTexts: () =>
    set({ selectedSlugs: CHINESE_PRESCRIBED_TEXTS.map((t) => t.slug) }),

  toggleText: (slug) =>
    set((s) => {
      const has = s.selectedSlugs.includes(slug);
      return {
        selectedSlugs: has
          ? s.selectedSlugs.filter((x) => x !== slug)
          : [...s.selectedSlugs, slug],
      };
    }),

  setTargetCount: (n) =>
    set({
      targetCount: Math.max(15, Math.min(CAT_MAX_ITEMS, Math.round(n))),
    }),

  startSession: () => {
    const { selectedSlugs, targetCount } = get();
    if (selectedSlugs.length === 0) {
      return { ok: false, error: "請至少選擇一篇範文。" };
    }
    const pool = buildCatPool(selectedSlugs);
    if (pool.length < 15) {
      return { ok: false, error: "題庫不足 15 題，請選擇更多範文。" };
    }

    const first = selectNextItem(pool, new Set(), "medium");
    if (!first) {
      return { ok: false, error: "找不到可用的中等難度題目。" };
    }

    set({
      phase: "testing",
      sessionKind: "adaptive",
      pool,
      current: first,
      usedUids: [first.uid],
      answers: [],
      theta: 0,
      consecutiveCorrect: 0,
      consecutiveWrong: 0,
      recentThetaDeltas: [],
      questionStartedAt: Date.now(),
      report: null,
      targetCount,
      lastAdaptiveSlugs: selectedSlugs,
      lastHistoryUids: [],
    });
    return { ok: true };
  },

  startRemediationSession: () => {
    const { report, lastAdaptiveSlugs, selectedSlugs, lastHistoryUids } =
      get();
    if (!report || report.weaknesses.length === 0) {
      return {
        ok: false,
        error: "請先完成一次診斷室測驗，才可生成弱點專攻特訓。",
      };
    }

    const sourceSlugs =
      lastAdaptiveSlugs.length > 0 ? lastAdaptiveSlugs : selectedSlugs;
    const historyUids =
      lastHistoryUids.length > 0
        ? lastHistoryUids
        : report.answers.map((a) => a.uid);

    const { items, error } = generateRemediationQuiz({
      sourceSlugs,
      weakCategories: report.weaknesses.map((w) => w.category),
      historyUids,
    });

    if (error || items.length === 0) {
      return { ok: false, error: error ?? "無法生成弱點專攻測驗。" };
    }

    set({
      phase: "testing",
      sessionKind: "remediation",
      pool: items,
      current: items[0],
      usedUids: [items[0].uid],
      answers: [],
      theta: report.theta,
      consecutiveCorrect: 0,
      consecutiveWrong: 0,
      recentThetaDeltas: [],
      questionStartedAt: Date.now(),
      report: null,
      targetCount: items.length,
      selectedSlugs: sourceSlugs,
    });
    return { ok: true };
  },

  startMistakeRetest: (items) => {
    if (items.length === 0) {
      return { ok: false, error: "錯題本目前沒有題目。" };
    }
    set({
      phase: "testing",
      sessionKind: "mistake-retest",
      pool: items,
      current: items[0],
      usedUids: [items[0].uid],
      answers: [],
      theta: 0,
      consecutiveCorrect: 0,
      consecutiveWrong: 0,
      recentThetaDeltas: [],
      questionStartedAt: Date.now(),
      report: null,
      targetCount: items.length,
    });
    return { ok: true };
  },

  submitAnswer: (selectedAnswer) => {
    const state = get();
    const { current, pool, theta, questionStartedAt, sessionKind } = state;
    if (!current || state.phase !== "testing") return;

    const isCorrect = selectedAnswer === current.answer;
    const thetaAfter =
      sessionKind === "adaptive"
        ? updateTheta(theta, current.difficulty, isCorrect)
        : theta;
    const delta = thetaAfter - theta;
    const timeSpentMs = Math.max(
      0,
      Date.now() - (questionStartedAt ?? Date.now()),
    );

    const record: CatAnswerRecord = {
      uid: current.uid,
      textSlug: current.textSlug,
      textLabel: current.textLabel,
      questionId: current.id,
      difficulty: current.difficulty,
      category: current.category,
      question: current.question,
      options: current.options,
      correctAnswer: current.answer,
      selectedAnswer,
      isCorrect,
      explanation: current.explanation,
      timeSpentMs,
      thetaBefore: theta,
      thetaAfter,
    };

    const answers = [...state.answers, record];
    const consecutiveCorrect = isCorrect ? state.consecutiveCorrect + 1 : 0;
    const consecutiveWrong = isCorrect ? 0 : state.consecutiveWrong + 1;
    const recentThetaDeltas = [...state.recentThetaDeltas, delta];
    const used = new Set(state.usedUids);

    const stopPractice =
      sessionKind !== "adaptive" && answers.length >= pool.length;
    const stopAdaptive =
      sessionKind === "adaptive" &&
      shouldStopCat({
        answeredCount: answers.length,
        targetCount: state.targetCount,
        recentThetaDeltas,
        poolRemaining: pool.length - used.size,
      });

    if (stopPractice || stopAdaptive) {
      finishReport(set, get, answers, thetaAfter, {
        consecutiveCorrect,
        consecutiveWrong,
        recentThetaDeltas,
        lastHistoryUids:
          sessionKind === "adaptive"
            ? answers.map((a) => a.uid)
            : state.lastHistoryUids,
        lastAdaptiveSlugs:
          sessionKind === "adaptive"
            ? state.selectedSlugs
            : state.lastAdaptiveSlugs,
      });
      return;
    }

    if (sessionKind !== "adaptive") {
      const next = pool.find((q) => !used.has(q.uid));
      if (!next) {
        finishReport(set, get, answers, thetaAfter);
        return;
      }
      set({
        answers,
        theta: thetaAfter,
        consecutiveCorrect,
        consecutiveWrong,
        recentThetaDeltas,
        current: next,
        usedUids: [...state.usedUids, next.uid],
        questionStartedAt: Date.now(),
      });
      return;
    }

    const nextDiff = selectNextDifficulty({
      answeredCount: answers.length,
      theta: thetaAfter,
      lastCorrect: isCorrect,
      consecutiveCorrect,
      consecutiveWrong,
    });
    const next = selectNextItem(pool, used, nextDiff);
    if (!next) {
      finishReport(set, get, answers, thetaAfter, {
        lastHistoryUids: answers.map((a) => a.uid),
        lastAdaptiveSlugs: state.selectedSlugs,
      });
      return;
    }

    set({
      answers,
      theta: thetaAfter,
      consecutiveCorrect,
      consecutiveWrong,
      recentThetaDeltas,
      current: next,
      usedUids: [...state.usedUids, next.uid],
      questionStartedAt: Date.now(),
    });
  },

  resetSession: () =>
    set({
      phase: "setup",
      sessionKind: "adaptive",
      pool: [],
      current: null,
      usedUids: [],
      answers: [],
      theta: 0,
      consecutiveCorrect: 0,
      consecutiveWrong: 0,
      recentThetaDeltas: [],
      questionStartedAt: null,
      report: null,
    }),
}));
