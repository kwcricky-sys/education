import econDrills from "@/data/dse/econ-drills.json";
import englishDrills from "@/data/dse/english-drills.json";

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

const BANKS: Record<string, DrillBank> = {
  econ: econDrills as DrillBank,
  english: englishDrills as DrillBank,
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
