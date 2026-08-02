import type {
  CalculatorInput,
  ChildGender,
  GenderPref,
  ProbabilityBreakdown,
  Readiness,
  TeachingStyle,
} from "@/lib/calculator/types";

/** 基礎自行分配成功率（按常見計分檔） */
const BASE_BY_SCORE: Record<15 | 20 | 25, number> = {
  15: 0.3,
  20: 0.52,
  25: 0.78,
};

/**
 * 四維權重（純規則，0 Token）：
 * 成功率 ≈ 基礎派位率 × 性別爆額修正 × 位次／準備策略 × 風格微調
 */
export function calculateProbability(
  input: CalculatorInput,
): ProbabilityBreakdown {
  const discretionaryRate = BASE_BY_SCORE[input.score];
  const genderModifier = genderOversubModifier(
    input.childGender,
    input.genderPref,
  );
  const strategyModifier = readinessStrategyModifier(input.readiness);
  const styleModifier = styleSoftModifier(input.style);

  const raw =
    discretionaryRate * genderModifier * strategyModifier * styleModifier;
  const successRate = clamp(raw, 0.06, 0.94);

  const notes: string[] = [];
  if (input.score <= 15) {
    notes.push("15 分檔競爭大，建議以『匹配度高』學校為主，避免全部押注名校。");
  }
  if (genderModifier < 0.95) {
    notes.push("單性別／熱門性別組合通常較易爆額，已略為下調成功率。");
  }
  if (input.readiness === "low") {
    notes.push("準備度偏低會影響面試同文件完整度，建議先用 Portfolio 工具補齊。");
  }
  if (!input.schoolNet.trim()) {
    notes.push("未填校網時，統一派位風險較難評估；自行分配仍可跨網申請。");
  }

  return {
    successRate,
    discretionaryRate,
    genderModifier,
    strategyModifier: strategyModifier * styleModifier,
    baseLabel:
      input.score === 25
        ? "高分檔"
        : input.score === 20
          ? "中分檔"
          : "臨界分檔",
    notes,
  };
}

function genderOversubModifier(
  child: ChildGender,
  pref: GenderPref,
): number {
  if (pref === "coed") return 1;
  if (pref === "boys" && child === "girl") return 0.15;
  if (pref === "girls" && child === "boy") return 0.15;
  // Matching single-sex — typically more oversubscribed
  return 0.88;
}

function readinessStrategyModifier(ready: Readiness): number {
  if (ready === "high") return 1.1;
  if (ready === "mid") return 1;
  return 0.82;
}

function styleSoftModifier(style: TeachingStyle): number {
  // Style mainly affects match quality; tiny effect on probability
  if (style === "academic") return 0.98;
  if (style === "bilingual") return 1;
  return 1.02;
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export function pct(n: number, digits = 0) {
  return (n * 100).toFixed(digits);
}
