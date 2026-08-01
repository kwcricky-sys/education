"use client";

import { create } from "zustand";
import {
  selectNextDifficulty,
  selectNextItem,
  shouldStopCat,
  updateTheta,
} from "@/lib/dse/cat/engine";
import { buildCatPool } from "@/lib/dse/cat/pool";
import { buildCatReport } from "@/lib/dse/cat/scoring";
import type {
  CatAnswerRecord,
  CatPhase,
  CatPoolItem,
  CatReport,
} from "@/lib/dse/cat/types";
import { CAT_DEFAULT_TARGET, CAT_MAX_ITEMS } from "@/lib/dse/cat/types";
import { CHINESE_PRESCRIBED_TEXTS } from "@/lib/dse/texts";

type CatSessionState = {
  phase: CatPhase;
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
  selectAllTexts: () => void;
  toggleText: (slug: string) => void;
  setTargetCount: (n: number) => void;
  startSession: () => { ok: true } | { ok: false; error: string };
  submitAnswer: (selectedAnswer: string) => void;
  resetSession: () => void;
};

function labelsFor(slugs: string[]) {
  return slugs.map((slug) => {
    const t = CHINESE_PRESCRIBED_TEXTS.find((x) => x.slug === slug);
    return t ? `${t.source}${t.title}` : slug;
  });
}

export const useCatSession = create<CatSessionState>((set, get) => ({
  phase: "setup",
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
      return {
        ok: false,
        error: "題庫不足 15 題，請選擇更多範文。",
      };
    }

    const first = selectNextItem(pool, new Set(), "medium");
    if (!first) {
      return { ok: false, error: "找不到可用的中等難度題目。" };
    }

    set({
      phase: "testing",
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
    });
    return { ok: true };
  },

  submitAnswer: (selectedAnswer) => {
    const state = get();
    const { current, pool, theta, questionStartedAt } = state;
    if (!current || state.phase !== "testing") return;

    const isCorrect = selectedAnswer === current.answer;
    const thetaAfter = updateTheta(theta, current.difficulty, isCorrect);
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

    const stop = shouldStopCat({
      answeredCount: answers.length,
      targetCount: state.targetCount,
      recentThetaDeltas,
      poolRemaining: pool.length - used.size,
    });

    if (stop) {
      const report = buildCatReport({
        answers,
        theta: thetaAfter,
        scopeLabels: labelsFor(state.selectedSlugs),
      });
      set({
        phase: "report",
        answers,
        theta: thetaAfter,
        consecutiveCorrect,
        consecutiveWrong,
        recentThetaDeltas,
        current: null,
        questionStartedAt: null,
        report,
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
      const report = buildCatReport({
        answers,
        theta: thetaAfter,
        scopeLabels: labelsFor(state.selectedSlugs),
      });
      set({
        phase: "report",
        answers,
        theta: thetaAfter,
        consecutiveCorrect,
        consecutiveWrong,
        recentThetaDeltas,
        current: null,
        questionStartedAt: null,
        report,
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
