import type { QuizDifficulty, QuizQuestion } from "@/lib/dse/types";

export type CatPoolItem = QuizQuestion & {
  /** Unique across all texts: `${slug}:${id}` */
  uid: string;
  textSlug: string;
  textLabel: string;
};

export type CatAnswerRecord = {
  uid: string;
  textSlug: string;
  textLabel: string;
  questionId: string;
  difficulty: QuizDifficulty;
  category: string;
  question: string;
  options: string[];
  correctAnswer: string;
  selectedAnswer: string;
  isCorrect: boolean;
  explanation: string;
  timeSpentMs: number;
  thetaBefore: number;
  thetaAfter: number;
};

export type CategoryStat = {
  category: string;
  correct: number;
  total: number;
  rate: number;
};

export type DifficultyStat = {
  difficulty: QuizDifficulty;
  correct: number;
  total: number;
  rate: number;
};

export type PredictedGrade = {
  level: string;
  label: string;
  confidence: "低" | "中" | "高";
  rationale: string;
};

export type CatReport = {
  theta: number;
  abilityPercentile: number;
  predictedGrade: PredictedGrade;
  overallAccuracy: number;
  difficultyStats: DifficultyStat[];
  categoryStats: CategoryStat[];
  weaknesses: CategoryStat[];
  answers: CatAnswerRecord[];
  scopeLabels: string[];
  questionCount: number;
  totalTimeMs: number;
  finishedAt: string;
};

export type CatPhase = "setup" | "testing" | "report";

export const CAT_MIN_ITEMS = 15;
export const CAT_MAX_ITEMS = 20;
export const CAT_DEFAULT_TARGET = 18;
