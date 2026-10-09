import bafsDrills from "@/data/dse/bafs-drills.json";
import econDrills from "@/data/dse/econ-drills.json";
import englishDrills from "@/data/dse/english-drills.json";
import englishLearnDrills from "@/data/dse/english-learn-drills.json";
import englishPaperBatch from "@/data/dse/english-paper-batch1.json";
import ictDrills from "@/data/dse/ict-drills.json";
import mathDrills from "@/data/dse/math-drills.json";

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
  hint?: string;
  /** Paper 1–4 batch items only. */
  paper?: string;
  batchReviewed?: boolean;
  authorship?: string;
};

export type DrillBank = {
  meta: {
    title: string;
    subject: string;
    language: string;
    total: number;
    version: string;
    reviewed?: boolean;
    reviewStrategy?: string;
  };
  questions: DrillQuestion[];
};

const PUBLISHED_ENGLISH = englishDrills as DrillBank;
const LEARN_ENGLISH = englishLearnDrills as DrillBank;
const PAPER_BATCH_ENGLISH = englishPaperBatch as DrillBank;

/**
 * The English bank = published SAMPLE drills + Learn Mode practice + Paper
 * Batch 1, so topic and question pages resolve for /dse/english/learn too.
 * Aggregate reviewed stays false: the learn-mode bank is not fully signed off.
 * See PAPER_BATCH_ENGLISH.meta.reviewStrategy.
 */
const ENGLISH_BANK: DrillBank = {
  meta: {
    ...LEARN_ENGLISH.meta,
    total:
      PUBLISHED_ENGLISH.questions.length +
      LEARN_ENGLISH.questions.length +
      PAPER_BATCH_ENGLISH.questions.length,
    reviewed: false,
    reviewStrategy: PAPER_BATCH_ENGLISH.meta.reviewStrategy,
  },
  questions: [
    ...PUBLISHED_ENGLISH.questions,
    ...LEARN_ENGLISH.questions,
    ...PAPER_BATCH_ENGLISH.questions,
  ],
};

const BANKS: Record<string, DrillBank> = {
  bafs: bafsDrills as DrillBank,
  econ: econDrills as DrillBank,
  english: ENGLISH_BANK,
  ict: ictDrills as DrillBank,
  math: mathDrills as DrillBank,
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
