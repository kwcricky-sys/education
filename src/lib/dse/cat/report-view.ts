import type {
  ArticleMasteryStat,
  CatAnswerRecord,
  CoreSkillStat,
  DifficultyStat,
  PredictedGrade,
} from "@/lib/dse/cat/types";
import {
  CORE_SKILLS,
  mapCategoryToCoreSkill,
  type CoreSkillId,
} from "@/lib/dse/cat/skills";

export type MasteryTone = "good" | "ok" | "weak" | "empty";

export type MasteryView = {
  percent: number;
  tone: MasteryTone;
  statusLabel: string;
};

export type DiagnosticPrecision = {
  label: "高" | "中" | "需更多答題";
  percent: number;
  dots: number;
  tone: "high" | "mid" | "low";
};

function rate(correct: number, total: number) {
  if (total === 0) return 0;
  return correct / total;
}

export function masteryFromRate(r: number, total: number): MasteryView {
  if (total === 0) {
    return { percent: 0, tone: "empty", statusLabel: "未測試" };
  }
  const percent = Math.round(r * 100);
  if (percent >= 80) {
    return { percent, tone: "good", statusLabel: "良好" };
  }
  if (percent >= 50) {
    return { percent, tone: "ok", statusLabel: "尚可" };
  }
  return { percent, tone: "weak", statusLabel: "急需重溫" };
}

export function buildArticleStats(
  answers: CatAnswerRecord[],
): ArticleMasteryStat[] {
  const map = new Map<
    string,
    { textLabel: string; correct: number; total: number }
  >();
  for (const a of answers) {
    const cur = map.get(a.textSlug) ?? {
      textLabel: a.textLabel,
      correct: 0,
      total: 0,
    };
    cur.total += 1;
    if (a.isCorrect) cur.correct += 1;
    map.set(a.textSlug, cur);
  }
  return [...map.entries()]
    .map(([textSlug, v]) => ({
      textSlug,
      textLabel: v.textLabel,
      correct: v.correct,
      total: v.total,
      rate: rate(v.correct, v.total),
    }))
    .sort((a, b) => a.rate - b.rate || b.total - a.total);
}

export function buildCoreSkillStats(
  answers: CatAnswerRecord[],
): CoreSkillStat[] {
  const buckets = new Map<CoreSkillId, { correct: number; total: number }>();
  for (const def of CORE_SKILLS) {
    buckets.set(def.id, { correct: 0, total: 0 });
  }
  for (const a of answers) {
    const id = mapCategoryToCoreSkill(a.category);
    const cur = buckets.get(id) ?? { correct: 0, total: 0 };
    cur.total += 1;
    if (a.isCorrect) cur.correct += 1;
    buckets.set(id, cur);
  }
  return CORE_SKILLS.map((def) => {
    const v = buckets.get(def.id) ?? { correct: 0, total: 0 };
    return {
      skillId: def.id,
      label: def.label,
      blurb: def.blurb,
      correct: v.correct,
      total: v.total,
      rate: rate(v.correct, v.total),
    };
  });
}

/** Build student-facing grade rationale from dual-dimension stability. */
export function buildGradeRationale(
  grade: PredictedGrade,
  coreSkills: CoreSkillStat[],
): string {
  const tested = coreSkills.filter((s) => s.total > 0);
  if (tested.length === 0) return grade.rationale;

  const ranked = [...tested].sort((a, b) => b.rate - a.rate);
  const strongest = ranked[0];
  const weakest = ranked[ranked.length - 1];

  const focus =
    weakest && weakest.rate < 0.6
      ? `弱點主要落在「${weakest.label}」`
      : strongest
        ? `「${strongest.label}」表現相對穩定`
        : "整體答題穩定度";

  return `此結果根據你在「白話翻譯」與「高階考點」等核心技能的穩定度推算；本次${focus}。`;
}

export function buildDiagnosticPrecision(opts: {
  confidence: PredictedGrade["confidence"];
  questionCount: number;
  difficultyStats: DifficultyStat[];
  guessCount: number;
}): DiagnosticPrecision {
  const { confidence, questionCount, difficultyStats, guessCount } = opts;
  const bandsTouched = difficultyStats.filter((d) => d.total > 0).length;

  let percent =
    confidence === "高" ? 92 : confidence === "中" ? 74 : 48;
  percent += Math.min(6, Math.max(0, questionCount - 12));
  percent += Math.min(4, (bandsTouched - 1) * 2);
  percent -= Math.min(12, guessCount * 4);
  percent = Math.max(40, Math.min(96, percent));

  const label: DiagnosticPrecision["label"] =
    percent >= 85 ? "高" : percent >= 65 ? "中" : "需更多答題";

  return {
    label,
    percent,
    dots: label === "高" ? 5 : label === "中" ? 3 : 2,
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

export function shortArticleTitle(label: string): string {
  // textLabel is often like "論語《論仁、論孝、論君子》" — keep readable
  if (label.length <= 14) return label;
  return `${label.slice(0, 12)}…`;
}
