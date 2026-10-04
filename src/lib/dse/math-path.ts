/**
 * DSE Mathematics (Compulsory Part) learning path — units, lessons, practice gates.
 * Lesson content lives in src/data/dse/math-lessons.json.
 * Practice questions live in src/data/dse/math-drills.json.
 */
import mathDrills from "@/data/dse/math-drills.json";
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
  /** Chinese unit name shown next to the English title */
  titleZh: string;
  topicKey: string;
  /** ids of units that must be completed first */
  prerequisites: number[];
  lessonIds: string[];
  /** min correct out of 10-question practice to complete the unit */
  passThreshold: number;
};

export const MATH_UNITS: Unit[] = [
  {
    id: 1,
    title: "Numbers & Estimation",
    titleZh: "數與估算",
    topicKey: "numbers-estimation",
    prerequisites: [],
    lessonIds: ["L1.1", "L1.2", "L1.3", "L1.4"],
    passThreshold: 7,
  },
  {
    id: 2,
    title: "Algebra",
    titleZh: "代數",
    topicKey: "algebra",
    prerequisites: [1],
    lessonIds: ["L2.1", "L2.2", "L2.3", "L2.4"],
    passThreshold: 7,
  },
  {
    id: 3,
    title: "Functions & Graphs",
    titleZh: "函數與圖像",
    topicKey: "functions-graphs",
    prerequisites: [2],
    lessonIds: ["L3.1", "L3.2", "L3.3"],
    passThreshold: 7,
  },
  {
    id: 4,
    title: "Exponentials, Logs & Sequences",
    titleZh: "指數、對數與數列",
    topicKey: "exp-log-sequences",
    prerequisites: [2],
    lessonIds: ["L4.1", "L4.2", "L4.3", "L4.4"],
    passThreshold: 7,
  },
  {
    id: 5,
    title: "Inequalities & Linear Programming",
    titleZh: "不等式與線性規劃",
    topicKey: "inequalities-lp",
    prerequisites: [2, 3],
    lessonIds: ["L5.1", "L5.2", "L5.3"],
    passThreshold: 7,
  },
  {
    id: 6,
    title: "Coordinate Geometry",
    titleZh: "坐標幾何",
    topicKey: "coordinate-geometry",
    prerequisites: [2],
    lessonIds: ["L6.1", "L6.2", "L6.3", "L6.4"],
    passThreshold: 7,
  },
  {
    id: 7,
    title: "Trigonometry",
    titleZh: "三角學",
    topicKey: "trigonometry",
    prerequisites: [2],
    lessonIds: ["L7.1", "L7.2", "L7.3"],
    passThreshold: 7,
  },
  {
    id: 8,
    title: "Statistics",
    titleZh: "統計",
    topicKey: "statistics",
    prerequisites: [],
    lessonIds: ["L8.1", "L8.2", "L8.3", "L8.4"],
    passThreshold: 7,
  },
  {
    id: 9,
    title: "Probability & Counting",
    titleZh: "概率與排列組合",
    topicKey: "probability-counting",
    prerequisites: [8],
    lessonIds: ["L9.1", "L9.2", "L9.3"],
    passThreshold: 7,
  },
  {
    id: 10,
    title: "Exam Skills",
    titleZh: "應試技巧",
    topicKey: "exam-skills",
    prerequisites: [3, 7, 9],
    lessonIds: ["L10.1", "L10.2", "L10.3"],
    passThreshold: 7,
  },
];

/** Practice set = questions from the unit's topic, mixed difficulty. */
export function getPracticeSet(topicKey: string, n = 10): DrillQuestion[] {
  const qs = (mathDrills as { questions: DrillQuestion[] }).questions.filter(
    (q) => q.topic === topicKey,
  );
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
