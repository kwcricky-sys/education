import quizData from "@/data/dse/analects-quiz.json";

export type AnalectsDifficulty = "easy" | "medium" | "hard";

export type AnalectsQuestion = {
  id: string;
  difficulty: AnalectsDifficulty;
  category: string;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
};

export type AnalectsQuizFile = {
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
  questions: AnalectsQuestion[];
};

export const analectsQuiz = quizData as AnalectsQuizFile;

export const DIFFICULTY_LABEL: Record<
  AnalectsDifficulty | "all",
  { zh: string; className: string }
> = {
  all: { zh: "全部", className: "text-zinc-200" },
  easy: { zh: "基礎", className: "text-emerald-400" },
  medium: { zh: "中等", className: "text-amber-400" },
  hard: { zh: "高階", className: "text-rose-400" },
};

export function filterAnalectsQuestions(
  questions: AnalectsQuestion[],
  difficulty: AnalectsDifficulty | "all",
): AnalectsQuestion[] {
  if (difficulty === "all") return questions;
  return questions.filter((q) => q.difficulty === difficulty);
}

export type PrescribedText = {
  slug: string;
  title: string;
  source: string;
  href: string | null;
  open: boolean;
  blurb: string;
};

/** 12 篇 DSE 指定文言經典 — open first; add modules by slug later. */
export const CHINESE_PRESCRIBED_TEXTS: PrescribedText[] = [
  {
    slug: "analects",
    title: "論仁、論孝、論君子",
    source: "《論語》",
    href: "/dse/chinese/analects",
    open: true,
    blurb: "60 題三階極速閃卡 · 字詞／通假／句譯／考評標示",
  },
  {
    slug: "fish",
    title: "魚我所欲也",
    source: "《孟子》",
    href: null,
    open: false,
    blurb: "Coming Soon",
  },
  {
    slug: "xiaoyaoyou",
    title: "逍遙遊（節錄）",
    source: "《莊子》",
    href: null,
    open: false,
    blurb: "Coming Soon",
  },
  {
    slug: "quanxue",
    title: "勸學（節錄）",
    source: "《荀子》",
    href: null,
    open: false,
    blurb: "Coming Soon",
  },
  {
    slug: "lianpo",
    title: "廉頗藺相如列傳（節錄）",
    source: "《史記》",
    href: null,
    open: false,
    blurb: "Coming Soon",
  },
  {
    slug: "chushi",
    title: "出師表",
    source: "諸葛亮",
    href: null,
    open: false,
    blurb: "Coming Soon",
  },
  {
    slug: "shishuo",
    title: "師說",
    source: "韓愈",
    href: null,
    open: false,
    blurb: "Coming Soon",
  },
  {
    slug: "xishan",
    title: "始得西山宴遊記",
    source: "柳宗元",
    href: null,
    open: false,
    blurb: "Coming Soon",
  },
  {
    slug: "yueyang",
    title: "岳陽樓記",
    source: "范仲淹",
    href: null,
    open: false,
    blurb: "Coming Soon",
  },
  {
    slug: "zuiweng",
    title: "醉翁亭記",
    source: "歐陽修",
    href: null,
    open: false,
    blurb: "Coming Soon",
  },
  {
    slug: "liuguo",
    title: "六國論",
    source: "蘇洵",
    href: null,
    open: false,
    blurb: "Coming Soon",
  },
  {
    slug: "tangshi",
    title: "唐詩三首",
    source: "李白／杜甫／白居易",
    href: null,
    open: false,
    blurb: "Coming Soon",
  },
];
