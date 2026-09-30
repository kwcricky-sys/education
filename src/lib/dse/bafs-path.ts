/**
 * BAFS structured learning path — units, lessons, practice gates.
 * Lesson content in src/data/dse/bafs-lessons.json; drills in bafs-drills.json.
 */
import bafsDrills from "@/data/dse/bafs-drills.json";
import type { DrillQuestion } from "./drills";

export type LessonContent = {
  id: string;
  title: string;
  concept: string;
  example: {
    scenario: string;
    walkthrough: string;
  };
  traps: string[];
  terms: { term: string; definition: string }[];
};

export type Lesson = LessonContent & {
  unitId: number;
  practiceTopic: string;
  passThreshold: number;
};

export type Unit = {
  id: number;
  title: string;
  titleZh: string;
  topicKey: string;
  prerequisites: number[];
  lessonIds: string[];
  passThreshold: number;
};

export const BAFS_UNITS: Unit[] = [
  {
    id: 1,
    title: "Business Environment",
    titleZh: "商業環境",
    topicKey: "business-environment",
    prerequisites: [],
    lessonIds: ["L1.1", "L1.2", "L1.3"],
    passThreshold: 7,
  },
  {
    id: 2,
    title: "Forms of Business",
    titleZh: "商業組織形式",
    topicKey: "forms-of-business",
    prerequisites: [1],
    lessonIds: ["L2.1", "L2.2"],
    passThreshold: 7,
  },
  {
    id: 3,
    title: "Management",
    titleZh: "管理學",
    topicKey: "management",
    prerequisites: [1],
    lessonIds: ["L3.1", "L3.2", "L3.3"],
    passThreshold: 7,
  },
  {
    id: 4,
    title: "Marketing",
    titleZh: "市場營銷",
    topicKey: "marketing",
    prerequisites: [3],
    lessonIds: ["L4.1", "L4.2", "L4.3"],
    passThreshold: 7,
  },
  {
    id: 5,
    title: "Human Resources",
    titleZh: "人力資源管理",
    topicKey: "human-resources",
    prerequisites: [3],
    lessonIds: ["L5.1", "L5.2", "L5.3"],
    passThreshold: 7,
  },
  {
    id: 6,
    title: "Accounting Equation",
    titleZh: "會計等式與簿記",
    topicKey: "accounting-equation",
    prerequisites: [],
    lessonIds: ["L6.1", "L6.2", "L6.3"],
    passThreshold: 7,
  },
  {
    id: 7,
    title: "Financial Statements",
    titleZh: "財務報表",
    topicKey: "financial-statements",
    prerequisites: [6],
    lessonIds: ["L7.1", "L7.2"],
    passThreshold: 7,
  },
  {
    id: 8,
    title: "Financial Analysis",
    titleZh: "財務分析",
    topicKey: "financial-ratios",
    prerequisites: [7],
    lessonIds: ["L8.1", "L8.2", "L8.3"],
    passThreshold: 7,
  },
  {
    id: 9,
    title: "Personal Finance & Ethics",
    titleZh: "個人理財與商業道德",
    topicKey: "personal-finance-ethics",
    prerequisites: [],
    lessonIds: ["L9.1", "L9.2"],
    passThreshold: 7,
  },
];

export function getBafsPracticeSet(topicKey: string, n = 10): DrillQuestion[] {
  const qs = (bafsDrills as { questions: DrillQuestion[] }).questions.filter(
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
