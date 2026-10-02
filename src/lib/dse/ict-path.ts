/**
 * ICT structured learning path — units, lessons, practice gates.
 * Lesson content is in src/data/dse/ict-lessons.json.
 * Scope is HKDSE ICT (compulsory modules plus school-level databases,
 * multimedia and exam skills), not a university computer-science course.
 */
import ictDrills from "@/data/dse/ict-drills.json";
import ictLessons from "@/data/dse/ict-lessons.json";
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

export const ICT_UNITS: Unit[] = [
  {
    id: 1,
    title: "Computer Systems",
    titleZh: "電腦系統",
    topicKey: "computer-systems",
    prerequisites: [],
    lessonIds: ["L1.1", "L1.2", "L1.3", "L1.4"],
    passThreshold: 7,
  },
  {
    id: 2,
    title: "Data Representation",
    titleZh: "數據表示",
    topicKey: "data-representation",
    prerequisites: [1],
    lessonIds: ["L2.1", "L2.2", "L2.3", "L2.4"],
    passThreshold: 7,
  },
  {
    id: 3,
    title: "Computer Networks",
    titleZh: "電腦網絡",
    topicKey: "networks",
    prerequisites: [1],
    lessonIds: ["L3.1", "L3.2", "L3.3"],
    passThreshold: 7,
  },
  {
    id: 4,
    title: "The Internet",
    titleZh: "互聯網",
    topicKey: "internet",
    prerequisites: [3],
    lessonIds: ["L4.1", "L4.2", "L4.3"],
    passThreshold: 7,
  },
  {
    id: 5,
    title: "Databases",
    titleZh: "數據庫",
    topicKey: "databases",
    prerequisites: [1],
    lessonIds: ["L5.1", "L5.2", "L5.3"],
    passThreshold: 7,
  },
  {
    id: 6,
    title: "Multimedia",
    titleZh: "多媒體",
    topicKey: "multimedia",
    prerequisites: [2],
    lessonIds: ["L6.1", "L6.2", "L6.3"],
    passThreshold: 7,
  },
  {
    id: 7,
    title: "Algorithms & Pseudocode",
    titleZh: "演算法與偽代碼",
    topicKey: "algorithms",
    prerequisites: [],
    lessonIds: ["L7.1", "L7.2", "L7.3"],
    passThreshold: 7,
  },
  {
    id: 8,
    title: "Internet Security",
    titleZh: "網絡保安",
    topicKey: "security",
    prerequisites: [4],
    lessonIds: ["L8.1", "L8.2", "L8.3"],
    passThreshold: 7,
  },
  {
    id: 9,
    title: "Social, Ethical & Legal",
    titleZh: "社會、道德與法律",
    topicKey: "social-issues",
    prerequisites: [],
    lessonIds: ["L9.1", "L9.2", "L9.3"],
    passThreshold: 7,
  },
  {
    id: 10,
    title: "Exam Skills",
    titleZh: "應試技巧",
    topicKey: "exam-skills",
    prerequisites: [1, 7],
    lessonIds: ["L10.1", "L10.2", "L10.3"],
    passThreshold: 7,
  },
];

/** Practice set = questions from the unit's topic, mixed difficulty. */
export function getPracticeSet(topicKey: string, n = 10): DrillQuestion[] {
  const qs = (ictDrills as { questions: DrillQuestion[] }).questions.filter(
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

type StoredLesson = {
  id: string;
  unit: number;
  practice: string;
};

function assertIctPath(): void {
  const lessons = ictLessons as Record<string, StoredLesson>;
  const questions = (ictDrills as { questions: DrillQuestion[] }).questions;
  const seen = new Set<string>();
  for (const question of questions) {
    if (seen.has(question.id)) throw new Error(`Duplicate ICT drill id ${question.id}`);
    seen.add(question.id);
    if (!["A", "B", "C", "D"].includes(question.answer)) {
      throw new Error(`ICT drill ${question.id} has no answer letter`);
    }
    if (question.options.length !== 4) throw new Error(`ICT drill ${question.id} needs 4 options`);
  }
  const wired = new Set<string>();
  for (const unit of ICT_UNITS) {
    const count = questions.filter((q) => q.topic === unit.topicKey).length;
    if (count < 12) throw new Error(`ICT topic ${unit.topicKey} has ${count} drills`);
    for (const id of unit.lessonIds) {
      const lesson = lessons[id];
      if (!lesson) throw new Error(`ICT lesson ${id} missing`);
      if (lesson.unit !== unit.id) throw new Error(`ICT lesson ${id} unit mismatch`);
      if (lesson.practice !== unit.topicKey) throw new Error(`ICT lesson ${id} practice mismatch`);
      wired.add(id);
    }
  }
  for (const id of Object.keys(lessons)) {
    if (!wired.has(id)) throw new Error(`ICT lesson ${id} is not on a unit`);
  }
}

assertIctPath();
