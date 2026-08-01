import { buildCatPool } from "@/lib/dse/cat/pool";
import type { CatPoolItem } from "@/lib/dse/cat/types";

export const REMEDIATION_MIN = 5;
export const REMEDIATION_MAX = 10;
export const REMEDIATION_DEFAULT = 8;

export const OVERTHINKING_MS = 60_000;

/**
 * Rule-based weakness remediation quiz generator (no AI).
 * Picks unanswered items whose category matches weakCategories.
 */
export function generateRemediationQuiz(opts: {
  sourceSlugs: string[];
  weakCategories: string[];
  historyUids: string[];
  count?: number;
}): { items: CatPoolItem[]; error?: string } {
  const {
    sourceSlugs,
    weakCategories,
    historyUids,
    count = REMEDIATION_DEFAULT,
  } = opts;

  if (weakCategories.length === 0) {
    return { items: [], error: "找不到可專攻的弱點類別。" };
  }

  const history = new Set(historyUids);
  const weakSet = new Set(weakCategories);
  const pool = buildCatPool(sourceSlugs);

  const candidates = pool.filter(
    (q) => !history.has(q.uid) && weakSet.has(q.category),
  );

  if (candidates.length === 0) {
    return {
      items: [],
      error:
        "弱點類別中已無未作答題目。可改用錯題本重測，或擴大範文範圍再進診斷室。",
    };
  }

  // Prefer harder weakness items first, then shuffle lightly within bands
  const ranked = [...candidates].sort((a, b) => {
    const rank = { hard: 0, medium: 1, easy: 2 } as const;
    return rank[a.difficulty] - rank[b.difficulty];
  });

  const target = Math.max(
    REMEDIATION_MIN,
    Math.min(REMEDIATION_MAX, count, ranked.length),
  );

  // Round-robin across weakness categories for coverage
  const byCat = new Map<string, CatPoolItem[]>();
  for (const item of ranked) {
    const list = byCat.get(item.category) ?? [];
    list.push(item);
    byCat.set(item.category, list);
  }

  const picked: CatPoolItem[] = [];
  const queues = weakCategories
    .map((c) => byCat.get(c) ?? [])
    .filter((q) => q.length > 0);

  let i = 0;
  while (picked.length < target && queues.some((q) => q.length > 0)) {
    const q = queues[i % queues.length];
    if (q.length > 0) {
      const next = q.shift();
      if (next) picked.push(next);
    }
    i += 1;
    if (i > target * 20) break;
  }

  // Fill remainder if round-robin short
  if (picked.length < target) {
    const used = new Set(picked.map((p) => p.uid));
    for (const item of ranked) {
      if (picked.length >= target) break;
      if (!used.has(item.uid)) picked.push(item);
    }
  }

  return { items: picked.slice(0, target) };
}

export type OverthinkingFlag = {
  uid: string;
  questionId: string;
  category: string;
  timeSpentMs: number;
  textLabel: string;
};

/** Correct answers that took longer than OVERTHINKING_MS. */
export function findOverthinkingItems(
  answers: { uid: string; questionId: string; category: string; textLabel: string; isCorrect: boolean; timeSpentMs: number }[],
): OverthinkingFlag[] {
  return answers
    .filter((a) => a.isCorrect && a.timeSpentMs > OVERTHINKING_MS)
    .map((a) => ({
      uid: a.uid,
      questionId: a.questionId,
      category: a.category,
      timeSpentMs: a.timeSpentMs,
      textLabel: a.textLabel,
    }));
}
