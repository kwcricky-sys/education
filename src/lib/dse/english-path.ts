/**
 * ENGLISH structured learning path — units, lessons, practice gates.
 *
 * Mirrors the ECON path (src/lib/dse/econ-path.ts): each unit has a topic key
 * that pulls a 10-question practice set from the drill bank, and a pass
 * threshold that unlocks the next unit. Content lives in
 * src/data/dse/english-lessons.json.
 */
import englishDrills from "@/data/dse/english-drills.json";
import englishLearnDrills from "@/data/dse/english-learn-drills.json";
import type { DrillQuestion } from "./drills";

export type LessonContent = {
  /** Lesson 1.1 etc. */
  id: string;
  title: string;
  /** 150-250 word concept explanation */
  concept: string;
  example: {
    scenario: string;
    walkthrough: string;
  };
  /** 2-4 common exam traps */
  traps: string[];
  /** key terms defined in this lesson */
  terms: { term: string; definition: string }[];
};

export type Lesson = LessonContent & {
  unitId: number;
  /** drill topic key to pull practice questions from */
  practiceTopic: string;
  /** min correct out of practice set to unlock next lesson/unit */
  passThreshold: number;
};

export type Unit = {
  id: number;
  title: string;
  /** short English label shown next to the Chinese unit title */
  label: string;
  topicKey: string;
  /** ids of units that must be completed first */
  prerequisites: number[];
  lessonIds: string[];
  /** min correct out of 10-question practice to complete the unit */
  passThreshold: number;
};

export const ENGLISH_UNITS: Unit[] = [
  { id: 1, title: "卷一閱讀：拆題與定位", label: "Reading 1 — locating answers", topicKey: "reading-locating", prerequisites: [], lessonIds: ["L1.1", "L1.2", "L1.3"], passThreshold: 7 },
  { id: 2, title: "卷一閱讀：推論、語氣與詞彙", label: "Reading 2 — inference & tone", topicKey: "reading-inference", prerequisites: [1], lessonIds: ["L2.1", "L2.2", "L2.3"], passThreshold: 7 },
  { id: 3, title: "卷二寫作：格式與組織", label: "Writing 1 — formats", topicKey: "writing-formats", prerequisites: [], lessonIds: ["L3.1", "L3.2"], passThreshold: 7 },
  { id: 4, title: "卷二寫作：論證與語言", label: "Writing 2 — argument & language", topicKey: "writing-argument", prerequisites: [3], lessonIds: ["L4.1", "L4.2", "L4.3"], passThreshold: 7 },
  { id: 5, title: "卷三聆聽及綜合：筆記與任務", label: "Listening & Integrated Skills", topicKey: "listening-integrated", prerequisites: [], lessonIds: ["L5.1", "L5.2"], passThreshold: 7 },
  { id: 6, title: "卷四說話：小組討論與個人回應", label: "Speaking — group & individual", topicKey: "speaking", prerequisites: [], lessonIds: ["L6.1", "L6.2"], passThreshold: 7 },
  { id: 7, title: "語法核心（一）：時態、語態與條件句", label: "Grammar core 1", topicKey: "grammar-core-1", prerequisites: [], lessonIds: ["L7.1", "L7.2"], passThreshold: 7 },
  { id: 8, title: "語法核心（二）：句式與高頻錯誤", label: "Grammar core 2", topicKey: "grammar-core-2", prerequisites: [7], lessonIds: ["L8.1", "L8.2", "L8.3"], passThreshold: 7 },
  { id: 9, title: "詞彙與主題詞庫", label: "Vocabulary & collocation", topicKey: "vocabulary", prerequisites: [], lessonIds: ["L9.1", "L9.2"], passThreshold: 7 },
  { id: 10, title: "應試流程：由模擬考到考場", label: "Exam workflow", topicKey: "exam-workflow", prerequisites: [], lessonIds: ["L10.1", "L10.2"], passThreshold: 7 },
];

/**
 * Practice set = questions from the unit's topic, mixed difficulty.
 * Both the Learn Mode bank and the original published English drill bank are
 * searched, so topics shared by both contribute questions from each.
 */
export function getEnglishPracticeSet(topicKey: string, n = 10): DrillQuestion[] {
  const learn = (englishLearnDrills as { questions: DrillQuestion[] }).questions;
  const published = (englishDrills as { questions: DrillQuestion[] }).questions;
  const seen = new Set<string>();
  const qs = [...learn, ...published].filter((q) => {
    if (q.topic !== topicKey || seen.has(q.id)) return false;
    seen.add(q.id);
    return true;
  });
  // interleave difficulties so the set isn't front-loaded
  const byDiff: Record<string, DrillQuestion[]> = { easy: [], medium: [], hard: [] };
  for (const q of qs) (byDiff[q.difficulty] ||= []).push(q);
  const out: DrillQuestion[] = [];
  while (out.length < n && (byDiff.easy.length || byDiff.medium.length || byDiff.hard.length)) {
    if (byDiff.easy.length) out.push(byDiff.easy.shift()!);
    if (byDiff.medium.length && out.length < n) out.push(byDiff.medium.shift()!);
    if (byDiff.hard.length && out.length < n) out.push(byDiff.hard.shift()!);
  }
  return out;
}

export function unitUnlocked(unit: Unit, completed: number[]): boolean {
  return unit.prerequisites.every((p) => completed.includes(p));
}
