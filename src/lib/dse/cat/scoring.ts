import type { QuizDifficulty } from "@/lib/dse/types";
import type {
  CatAnswerRecord,
  CatReport,
  CategoryStat,
  DifficultyStat,
  PredictedGrade,
} from "@/lib/dse/cat/types";

function rate(correct: number, total: number) {
  if (total === 0) return 0;
  return correct / total;
}

export function buildDifficultyStats(
  answers: CatAnswerRecord[],
): DifficultyStat[] {
  const levels: QuizDifficulty[] = ["easy", "medium", "hard"];
  return levels.map((difficulty) => {
    const subset = answers.filter((a) => a.difficulty === difficulty);
    const correct = subset.filter((a) => a.isCorrect).length;
    return {
      difficulty,
      correct,
      total: subset.length,
      rate: rate(correct, subset.length),
    };
  });
}

export function buildCategoryStats(
  answers: CatAnswerRecord[],
): CategoryStat[] {
  const map = new Map<string, { correct: number; total: number }>();
  for (const a of answers) {
    const cur = map.get(a.category) ?? { correct: 0, total: 0 };
    cur.total += 1;
    if (a.isCorrect) cur.correct += 1;
    map.set(a.category, cur);
  }
  return [...map.entries()]
    .map(([category, v]) => ({
      category,
      correct: v.correct,
      total: v.total,
      rate: rate(v.correct, v.total),
    }))
    .sort((a, b) => a.rate - b.rate || b.total - a.total);
}

/** Map final θ + difficulty win-rates to an estimated DSE level band. */
export function predictDseGrade(
  theta: number,
  difficultyStats: DifficultyStat[],
  overallAccuracy: number,
): PredictedGrade {
  const byDiff = Object.fromEntries(
    difficultyStats.map((d) => [d.difficulty, d]),
  ) as Record<QuizDifficulty, DifficultyStat>;

  const hard = byDiff.hard;
  const medium = byDiff.medium;
  const easy = byDiff.easy;

  if (hard.total >= 4 && hard.rate >= 0.7 && theta >= 0.8) {
    return {
      level: "5**",
      label: "預計 DSE 等級 5**",
      confidence: hard.total >= 6 ? "高" : "中",
      rationale:
        "在高階題維持約七成或以上正確率，能力值偏高，顯示對考評標示與跨篇章分析掌握穩健。",
    };
  }

  if (
    (hard.total >= 3 && hard.rate >= 0.55 && theta >= 0.35) ||
    (medium.total >= 5 && medium.rate >= 0.75 && theta >= 0.2)
  ) {
    return {
      level: "5 / 5*",
      label: "預計 DSE 等級 5／5*",
      confidence: "中",
      rationale:
        "中高階題表現良好，具備衝刺 5 級以上的基礎；可再強化高階考評邏輯與跨篇章比較。",
    };
  }

  if (
    (medium.total >= 4 && medium.rate >= 0.55) ||
    (theta >= -0.2 && overallAccuracy >= 0.55)
  ) {
    return {
      level: "4",
      label: "預計 DSE 等級 4",
      confidence: "中",
      rationale:
        "中等難度表現尚可，基礎概念大致穩固，但高階題仍不穩定，建議針對弱點類別重練。",
    };
  }

  if (easy.total >= 4 && easy.rate >= 0.6 && theta < -0.2) {
    return {
      level: "3",
      label: "預計 DSE 等級 3",
      confidence: "中",
      rationale:
        "測驗多停留在基礎題，顯示字詞／通假等基本功仍需鞏固，宜先清空 easy 錯題再上調難度。",
    };
  }

  return {
    level: "1 / 2",
    label: "預計 DSE 等級 1／2",
    confidence: overallAccuracy < 0.35 ? "高" : "低",
    rationale:
      "整體正確率偏低，建議先用閃卡模式重溫指定範文基礎字詞與句譯，再進行下一次 CAT。",
  };
}

/** Convert θ ∈ [-2, 2] to a rough percentile for UI. */
export function thetaToPercentile(theta: number): number {
  const t = (theta + 2) / 4; // 0..1
  return Math.round(Math.max(5, Math.min(98, t * 100)));
}

export function buildCatReport(opts: {
  answers: CatAnswerRecord[];
  theta: number;
  scopeLabels: string[];
}): CatReport {
  const { answers, theta, scopeLabels } = opts;
  const correct = answers.filter((a) => a.isCorrect).length;
  const overallAccuracy = rate(correct, answers.length);
  const difficultyStats = buildDifficultyStats(answers);
  const categoryStats = buildCategoryStats(answers);
  const weaknesses = categoryStats
    .filter((c) => c.total >= 1)
    .slice(0, 3)
    .filter((c) => c.rate < 0.75 || categoryStats.length <= 3);

  return {
    theta,
    abilityPercentile: thetaToPercentile(theta),
    predictedGrade: predictDseGrade(theta, difficultyStats, overallAccuracy),
    overallAccuracy,
    difficultyStats,
    categoryStats,
    weaknesses,
    answers,
    scopeLabels,
    questionCount: answers.length,
    totalTimeMs: answers.reduce((s, a) => s + a.timeSpentMs, 0),
    finishedAt: new Date().toISOString(),
  };
}
