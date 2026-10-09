import { CHINESE_PROGRESS_KEY } from "@/lib/dse/chinese-path";

export type ChineseProgress = {
  completed: number[];
  lessonsRead?: string[];
  wrong?: Record<string, number>;
  attempts?: Record<string, { right: number; total: number }>;
};

const EMPTY: ChineseProgress = { completed: [] };

let cache: ChineseProgress = EMPTY;
let cacheRaw: string | null = null;
const listeners = new Set<() => void>();

function readSnapshot(): ChineseProgress {
  if (typeof window === "undefined") return EMPTY;
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(CHINESE_PROGRESS_KEY);
  } catch {
    return cache;
  }
  if (raw === cacheRaw) return cache;
  cacheRaw = raw;
  if (!raw) {
    cache = EMPTY;
    return cache;
  }
  try {
    const parsed = JSON.parse(raw) as ChineseProgress;
    cache = {
      ...parsed,
      completed: Array.isArray(parsed.completed) ? parsed.completed : [],
    };
  } catch {
    cache = EMPTY;
  }
  return cache;
}

export function subscribeChineseProgress(listener: () => void): () => void {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === CHINESE_PROGRESS_KEY) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function getChineseProgress(): ChineseProgress {
  return readSnapshot();
}

export function getChineseProgressServer(): ChineseProgress {
  return EMPTY;
}

function publish(next: ChineseProgress) {
  const raw = JSON.stringify(next);
  cache = next;
  cacheRaw = raw;
  try {
    window.localStorage.setItem(CHINESE_PROGRESS_KEY, raw);
  } catch {
    // session-only if storage is blocked
  }
  for (const listener of listeners) listener();
}

export function recordChineseGate(input: {
  unitId: number;
  passed: boolean;
  results: { id: string; correct: boolean }[];
}) {
  const current = readSnapshot();
  const completed = current.completed ?? [];
  const wrong = { ...(current.wrong ?? {}) };
  const attempts = { ...(current.attempts ?? {}) };
  const nextCompleted =
    input.passed && !completed.includes(input.unitId)
      ? [...completed, input.unitId]
      : completed;
  for (const result of input.results) {
    const attempt = attempts[result.id] ?? { right: 0, total: 0 };
    attempts[result.id] = {
      right: attempt.right + (result.correct ? 1 : 0),
      total: attempt.total + 1,
    };
    if (!result.correct) wrong[result.id] = (wrong[result.id] ?? 0) + 1;
  }
  publish({ ...current, completed: nextCompleted, wrong, attempts });
}
