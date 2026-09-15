export type QuizDifficulty = "easy" | "medium" | "hard";

export type QuizQuestion = {
  id: string;
  difficulty: QuizDifficulty;
  category: string;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
};

export type QuizFile = {
  quiz_title?: string;
  total_questions?: number;
  difficulty_summary?: Record<string, number>;
  meta: {
    title: string;
    subject: string;
    paper: string;
    total: number;
    version: string;
  };
  questions: QuizQuestion[];
};

export type PrescribedText = {
  slug: string;
  title: string;
  source: string;
  shortName: string;
  keywords: string[];
  blurb: string;
};

export const DIFFICULTY_LABEL: Record<
  QuizDifficulty | "all",
  { zh: string; className: string }
> = {
  all: { zh: "全部", className: "text-slate-800" },
  easy: { zh: "基礎", className: "text-emerald-700" },
  medium: { zh: "中等", className: "text-amber-700" },
  hard: { zh: "高階", className: "text-rose-700" },
};

export function filterQuizQuestions(
  questions: QuizQuestion[],
  difficulty: QuizDifficulty | "all",
): QuizQuestion[] {
  if (difficulty === "all") return questions;
  return questions.filter((q) => q.difficulty === difficulty);
}
