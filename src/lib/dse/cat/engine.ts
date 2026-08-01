import type { QuizDifficulty } from "@/lib/dse/types";
import type { CatPoolItem } from "@/lib/dse/cat/types";
import {
  CAT_EXTENDED_MAX,
  CAT_MAX_ITEMS,
  CAT_MIN_ITEMS,
} from "@/lib/dse/cat/types";

const DIFF_RANK: Record<QuizDifficulty, number> = {
  easy: 0,
  medium: 1,
  hard: 2,
};

const RANK_TO_DIFF: QuizDifficulty[] = ["easy", "medium", "hard"];

/** Map IRT-lite θ ∈ [-2, 2] to a target difficulty band. */
export function difficultyFromTheta(theta: number): QuizDifficulty {
  if (theta <= -0.55) return "easy";
  if (theta >= 0.55) return "hard";
  return "medium";
}

/**
 * Update ability θ after a response (simplified 1PL-style step).
 * Correct on hard raises θ more; wrong on easy lowers θ more.
 */
export function updateTheta(
  theta: number,
  difficulty: QuizDifficulty,
  isCorrect: boolean,
): number {
  const gain: Record<QuizDifficulty, number> = {
    easy: 0.18,
    medium: 0.32,
    hard: 0.48,
  };
  const loss: Record<QuizDifficulty, number> = {
    easy: 0.48,
    medium: 0.34,
    hard: 0.2,
  };
  const next = isCorrect
    ? theta + gain[difficulty]
    : theta - loss[difficulty];
  return Math.max(-2, Math.min(2, next));
}

/**
 * Decide next difficulty using θ + streak rules from the spec:
 * - start: medium
 * - consecutive correct on medium (or 2 in a row) → hard
 * - wrong → easy
 * - otherwise follow θ band, with fallbacks if pool is empty
 */
export function selectNextDifficulty(opts: {
  answeredCount: number;
  theta: number;
  lastCorrect?: boolean;
  consecutiveCorrect: number;
  consecutiveWrong: number;
}): QuizDifficulty {
  if (opts.answeredCount === 0) return "medium";

  if (opts.lastCorrect === false || opts.consecutiveWrong >= 1) {
    return "easy";
  }

  if (opts.consecutiveCorrect >= 2) {
    return "hard";
  }

  if (opts.lastCorrect && difficultyFromTheta(opts.theta) !== "easy") {
    // Single correct on medium → challenge upward
    const band = difficultyFromTheta(opts.theta);
    if (band === "medium") return "hard";
    return band;
  }

  return difficultyFromTheta(opts.theta);
}

function pickRandom<T>(arr: T[]): T | undefined {
  if (arr.length === 0) return undefined;
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Prefer unused items at target difficulty; cascade to neighbors. */
export function selectNextItem(
  pool: CatPoolItem[],
  usedUids: Set<string>,
  target: QuizDifficulty,
): CatPoolItem | null {
  const available = pool.filter((q) => !usedUids.has(q.uid));
  if (available.length === 0) return null;

  const atTarget = available.filter((q) => q.difficulty === target);
  const hit = pickRandom(atTarget);
  if (hit) return hit;

  const rank = DIFF_RANK[target];
  for (const delta of [1, -1, 2, -2]) {
    const nextRank = rank + delta;
    if (nextRank < 0 || nextRank > 2) continue;
    const diff = RANK_TO_DIFF[nextRank];
    const alt = pickRandom(available.filter((q) => q.difficulty === diff));
    if (alt) return alt;
  }

  return pickRandom(available) ?? null;
}

/**
 * Stop when:
 * - reached max items, or
 * - reached min items AND θ change over last 3 answers is small, or
 * - pool exhausted
 */
export function shouldStopCat(opts: {
  answeredCount: number;
  targetCount: number;
  recentThetaDeltas: number[];
  poolRemaining: number;
}): boolean {
  if (opts.poolRemaining <= 0) return true;
  const hardCap = Math.min(
    CAT_EXTENDED_MAX,
    Math.max(opts.targetCount, CAT_MAX_ITEMS),
  );
  if (opts.answeredCount >= hardCap) return true;
  if (opts.answeredCount >= opts.targetCount) return true;

  // Early θ-stability stop only for standard (≤20) diagnostics —
  // extended runs intentionally cover more untested categories.
  const allowEarlyStop = opts.targetCount <= CAT_MAX_ITEMS;
  if (allowEarlyStop && opts.answeredCount >= CAT_MIN_ITEMS) {
    const window = opts.recentThetaDeltas.slice(-3);
    if (window.length >= 3) {
      const avg =
        window.reduce((a, b) => a + Math.abs(b), 0) / window.length;
      if (avg < 0.12) return true;
    }
  }
  return false;
}
