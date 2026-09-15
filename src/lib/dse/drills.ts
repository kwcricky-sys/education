import econDrills from "@/data/dse/econ-drills.json";
import englishDrills from "@/data/dse/english-drills.json";
import englishLearnDrills from "@/data/dse/english-learn-drills.json";

export type DrillQuestion = {
  id: string;
  topic: string;
  subject?: string;
  difficulty: "easy" | "medium" | "hard";
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  tags?: string[];
  syllabus_ref?: string;
};

export type DrillBank = {
  meta: {
    title: string;
    subject: string;
    language: string;
    total: number;
    version: string;
    reviewed?: boolean;
  };
  questions: DrillQuestion[];
};

const PUBLISHED_ENGLISH = englishDrills as DrillBank;
const LEARN_ENGLISH = englishLearnDrills as DrillBank;

/**
 * The English bank = published drills + Learn Mode practice questions, so the
 * topic and question pages resolve for the /dse/english/learn course too.
 */
const ENGLISH_BANK: DrillBank = {
  meta: {
    ...PUBLISHED_ENGLISH.meta,
    total: PUBLISHED_ENGLISH.questions.length + LEARN_ENGLISH.questions.length,
    reviewed: PUBLISHED_ENGLISH.meta.reviewed ?? false,
  },
  questions: [...PUBLISHED_ENGLISH.questions, ...LEARN_ENGLISH.questions],
};

const BANKS: Record<string, DrillBank> = {
  econ: econDrills as DrillBank,
  english: ENGLISH_BANK,
};

export const DRILL_SUBJECTS = Object.keys(BANKS) as Array<keyof typeof BANKS>;

export function getDrillBank(subject: string): DrillBank | null {
  return BANKS[subject] || null;
}

export function getDrillTopics(subject: string): string[] {
  const bank = getDrillBank(subject);
  if (!bank) return [];
  return [...new Set(bank.questions.map((q) => q.topic))];
}

export function getTopicQuestions(
  subject: string,
  topic: string,
): DrillQuestion[] {
  const bank = getDrillBank(subject);
  if (!bank) return [];
  return bank.questions.filter((q) => q.topic === topic);
}

export function getQuestion(subject: string, qid: string): DrillQuestion | null {
  const bank = getDrillBank(subject);
  if (!bank) return null;
  return bank.questions.find((q) => q.id === qid) || null;
}

/** /dse/econ/demand-and-supply/ECON-DEMA-001 */
export function questionHref(subject: string, q: DrillQuestion): string {
  return `/dse/${subject}/${q.topic}/${q.id}`;
}
