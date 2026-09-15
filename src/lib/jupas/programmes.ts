import raw from "@/data/jupas/programmes.json";

/**
 * JUPAS programme dataset.
 *
 * Admission scores are normalised "入學分數指數" (0–7 scale) published by
 * dse.bigexam.hk, which re-scales each university's own admission score so
 * programmes with different scoring mechanisms can be compared.
 *
 * Outcome pay: either a published entry pay point from the Master Pay Scale
 * (registered / licensed professions) or the UGC 2024/25 broad-category
 * average annual salary. The two are NOT interchangeable — see
 * `hasPublishedEntryPay` and `categoryFit` below.
 */

export type UgcCategoryKey =
  | "medicine"
  | "education"
  | "sciences"
  | "social"
  | "business"
  | "engineering"
  | "arts";

export type ProgrammeOutcome = {
  ugcCategoryKey: UgcCategoryKey;
  ugcCategoryLabel: string;
  /** UGC 2024/25 average annual salary of full-time-employed graduates, HK$'000. */
  ugcAnnualSalaryK: number;
  ugcAnnualSalarySource: string;
  /** Published entry monthly pay (Master Pay Scale) — null when none exists. */
  entryPayMonthly: number | null;
  /** Figure used for display: entry pay when published, else category average. */
  derivedMonthly: number;
  payIsCategoryAverage: boolean;
  payBasis: string;
  demand: string;
  marketNote: string;
  /** "loose" = the UGC category average does not represent this programme. */
  categoryFit: "direct" | "loose";
  fitNote?: string;
  hasPublishedEntryPay: boolean;
};

export type Programme = {
  code: string;
  university: string;
  name: string;
  category: string;
  score: {
    year: number;
    /** Normalised admission score index 0–7 (2025 entry). */
    median: number;
    lower: number | null;
    upper: number | null;
    /** Set when a published quartile was dropped for being inconsistent with the median. */
    quartileNote?: string | null;
  };
  outcome: ProgrammeOutcome;
  verdict: string;
  /** HK$ of entry monthly income per admission-score point — published-pay programmes only. */
  valuePerPoint: number | null;
  tag: string | null;
};

export type JupasMeta = {
  scoreYear: number;
  scoreScale: string;
  scoreSource: string;
  paySources: string[];
  caveat: string;
};

export const JUPAS_META: JupasMeta = raw.meta as JupasMeta;
export const PROGRAMMES: Programme[] = raw.programmes as Programme[];

/** Official UGC 2024/25 average annual salary by broad academic category (HK$'000). */
export const UGC_CATEGORY_SALARIES: { key: UgcCategoryKey; label: string; annualK: number }[] = [
  { key: "medicine", label: "醫科、牙科及護理", annualK: 554 },
  { key: "education", label: "教育", annualK: 363 },
  { key: "sciences", label: "理科", annualK: 299 },
  { key: "social", label: "社會科學", annualK: 294 },
  { key: "business", label: "商科及管理", annualK: 292 },
  { key: "engineering", label: "工程及科技", annualK: 287 },
  { key: "arts", label: "文科及人文", annualK: 279 },
];

export const UNIVERSITIES = Array.from(
  new Set(PROGRAMMES.map((p) => p.university)),
).sort();

export const CATEGORIES = Array.from(
  new Set(PROGRAMMES.map((p) => p.category)),
).sort();

export function getProgramme(code: string): Programme | undefined {
  return PROGRAMMES.find((p) => p.code === code);
}

export const monthly = (annualK: number) => Math.round((annualK * 1000) / 12);

export const hkd = (n: number) => `$${n.toLocaleString("en-US")}`;

/* ── Entry-chance estimation ────────────────────────────────────────────────
 * Transparent banding around the 2025 admission-score median.
 * The dataset reports a median and (for many programmes) lower / upper
 * quartiles of the normalised index. Where quartiles are missing we widen the
 * band by ±ESTIMATED_SPREAD and label the result as an estimate rather than a
 * published figure — we never present a synthesised band as real data.
 */

export const ESTIMATED_SPREAD = 0.3;

export type ChanceBand = {
  key: "safe" | "fair" | "edge" | "reach";
  label: string;
  detail: string;
  tone: "emerald" | "sky" | "amber" | "rose";
  /** true when quartiles were missing and the band had to be approximated */
  estimated: boolean;
};

const BANDS: Record<ChanceBand["key"], Omit<ChanceBand, "estimated">> = {
  safe: {
    key: "safe",
    label: "穩入",
    detail: "成績已達到甚至高過該課程 2025 年上四分位水平",
    tone: "emerald",
  },
  fair: {
    key: "fair",
    label: "有機（偏高）",
    detail: "成績高過 2025 年中位數，屬合理範圍",
    tone: "sky",
  },
  edge: {
    key: "edge",
    label: "有機（邊緣）",
    detail: "成績在中位數與下四分位之間，要靠面試、Band A 排序同運氣",
    tone: "amber",
  },
  reach: {
    key: "reach",
    label: "陪跑",
    detail: "成績低於 2025 年下四分位，除非有特殊條件否則機會偏低",
    tone: "rose",
  },
};

export function estimateChance(
  studentIndex: number,
  programme: Programme,
): ChanceBand {
  const { median, lower, upper } = programme.score;
  const estimated = upper === null || lower === null;
  const hi = upper ?? median + ESTIMATED_SPREAD;
  const lo = lower ?? median - ESTIMATED_SPREAD;

  let key: ChanceBand["key"];
  if (studentIndex >= hi) key = "safe";
  else if (studentIndex >= median) key = "fair";
  else if (studentIndex >= lo) key = "edge";
  else key = "reach";

  return { ...BANDS[key], estimated };
}

/** Approximate a normalised index from a DSE best-5 total (5**=7 … 1=1). */
export function bestFiveToIndex(bestFiveTotal: number): number {
  return Math.round((bestFiveTotal / 5) * 100) / 100;
}

/** Suggested Band A shape given the bands of the three chosen programmes. */
export function suggestLineup(bands: ChanceBand["key"][]): string {
  if (bands.length < 3)
    return `已揀 ${bands.length} 個課程。JUPAS Band A 可以放最多 3 個選擇，建議選滿 3 個先評估到完整排位策略。`;
  const safe = bands.filter((b) => b === "safe").length;
  const reach = bands.filter((b) => b === "reach").length;
  if (safe >= 2) return "組合偏穩。Band A 三個位都可以放高，但記得留一個真正想讀嘅課程。";
  if (reach >= 2) return "組合偏高風險。如果放榜後成績唔如預期，改選時要即刻換走至少一個。";
  if (bands.includes("fair") && safe === 0 && reach === 0)
    return "組合平衡。三個位都係「有機」，屬最常見嘅實戰排法。";
  return "組合有上有落。建議維持至少一個「穩入」位墊底，唔好三個位全部搏。";
}