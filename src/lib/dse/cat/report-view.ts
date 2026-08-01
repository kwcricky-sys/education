import { buildCatPool } from "@/lib/dse/cat/pool";
import type {
  CatAnswerRecord,
  CategoryStat,
  DifficultyStat,
  PredictedGrade,
} from "@/lib/dse/cat/types";

export type SkillStatus = "mastered" | "moderate" | "weak";

export type SkillCard = CategoryStat & {
  status: SkillStatus;
  statusLabel: string;
  percent: number;
};

export type DiagnosticPrecision = {
  label: "高" | "中" | "需更多答題";
  percent: number;
  dots: number; // 1–5 for visual bar
  tone: "high" | "mid" | "low";
};

export function skillStatus(rate: number): SkillStatus {
  if (rate >= 0.8) return "mastered";
  if (rate >= 0.5) return "moderate";
  return "weak";
}

export function skillStatusLabel(status: SkillStatus): string {
  if (status === "mastered") return "精通";
  if (status === "moderate") return "尚可";
  return "薄弱";
}

export function toSkillCards(stats: CategoryStat[]): SkillCard[] {
  return [...stats]
    .sort((a, b) => b.rate - a.rate || b.total - a.total)
    .map((s) => {
      const status = skillStatus(s.rate);
      return {
        ...s,
        status,
        statusLabel: skillStatusLabel(status),
        percent: Math.round(s.rate * 100),
      };
    });
}

/** All categories available in selected texts, minus those already tested. */
export function getUntestedCategories(
  sourceSlugs: string[],
  tested: CategoryStat[],
): string[] {
  const pool = buildCatPool(sourceSlugs);
  const all = [...new Set(pool.map((q) => q.category))];
  const testedSet = new Set(tested.map((t) => t.category));
  return all.filter((c) => !testedSet.has(c)).sort((a, b) => a.localeCompare(b, "zh-Hant"));
}

/**
 * Human-friendly diagnostic precision from confidence + coverage signals.
 * Avoids raw θ / statistical jargon.
 */
export function buildDiagnosticPrecision(opts: {
  confidence: PredictedGrade["confidence"];
  questionCount: number;
  difficultyStats: DifficultyStat[];
}): DiagnosticPrecision {
  const { confidence, questionCount, difficultyStats } = opts;
  const bandsTouched = difficultyStats.filter((d) => d.total > 0).length;

  let percent =
    confidence === "高" ? 92 : confidence === "中" ? 74 : 48;
  // Slight bump when more items / more difficulty bands covered
  percent += Math.min(6, Math.max(0, questionCount - 12));
  percent += Math.min(4, (bandsTouched - 1) * 2);
  percent = Math.max(40, Math.min(96, percent));

  const label: DiagnosticPrecision["label"] =
    percent >= 85 ? "高" : percent >= 65 ? "中" : "需更多答題";

  const dots =
    label === "高" ? 5 : label === "中" ? 3 : 2;

  return {
    label,
    percent,
    dots,
    tone: label === "高" ? "high" : label === "中" ? "mid" : "low",
  };
}

export function formatDuration(ms: number): string {
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s} 秒`;
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m} 分 ${r} 秒`;
}

export function correctCount(answers: CatAnswerRecord[]): number {
  return answers.filter((a) => a.isCorrect).length;
}
