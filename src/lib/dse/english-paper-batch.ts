import paperBatch from "@/data/dse/english-paper-batch1.json";
import type { DrillQuestion } from "@/lib/dse/drills";

export type EnglishPaperBatchMeta = {
  title: string;
  version: string;
  total: number;
  reviewed: boolean;
  batchReviewed: boolean;
  counts: { Paper1: number; Paper2: number; Paper3: number; Paper4: number };
  reviewStrategy: string;
  note: string;
};

export const ENGLISH_PAPER_BATCH_META = paperBatch.meta as EnglishPaperBatchMeta;

export const ENGLISH_PAPER_BATCH = paperBatch.questions as DrillQuestion[];

export const ENGLISH_PAPER_ORDER = ["Paper1", "Paper2", "Paper3", "Paper4"] as const;

export type EnglishPaperId = (typeof ENGLISH_PAPER_ORDER)[number];

export const ENGLISH_PAPER_LABEL: Record<EnglishPaperId, string> = {
  Paper1: "Paper 1 Reading",
  Paper2: "Paper 2 Writing",
  Paper3: "Paper 3 Listening／Integrated",
  Paper4: "Paper 4 Speaking",
};

export function englishPaperBatchGroups(): { paper: EnglishPaperId; label: string; questions: DrillQuestion[] }[] {
  return ENGLISH_PAPER_ORDER.map((paper) => ({
    paper,
    label: ENGLISH_PAPER_LABEL[paper],
    questions: ENGLISH_PAPER_BATCH.filter((question) => question.paper === paper),
  }));
}
