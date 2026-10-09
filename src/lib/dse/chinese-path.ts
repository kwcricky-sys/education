/**
 * Chinese structured learning path — U01–U12, lesson then 4-question gate.
 *
 * Content is the locked CHI-A / CHI-B batches. Progress stays on this site's
 * device key and is never written to learn-play:progress:v3.
 */
import chineseDrills from "@/data/dse/chinese-drills.json";
import chineseLessons from "@/data/dse/chinese-lessons.json";
import { CHINESE_PRESCRIBED_TEXTS, textHref } from "@/lib/dse/texts";

export const CHINESE_PROGRESS_KEY = "dsehack-chinese-progress-v1";

export const CHINESE_PASS_MARK = 3;
export const CHINESE_SET_SIZE = 4;

export type ChineseLesson = {
  id: string;
  unit: number;
  title: string;
  concept: string;
  example: { scenario: string; walkthrough: string };
  traps: string[];
  terms: { term: string; definition: string }[];
};

export type ChineseQuestion = {
  id: string;
  unitId: string;
  topic: string;
  prompt: string;
  choices: string[];
  answerIndex: number;
  hint: string;
  explain: string;
  tag: string;
};

export type ChineseLink = { href: string; label: string };

export type ChineseUnit = {
  id: number;
  unitCode: string;
  title: string;
  label: string;
  topicKey: string;
  prerequisites: number[];
  lessonIds: string[];
  passThreshold: number;
  links: ChineseLink[];
};

/** 範文-01…12 → the 12 prescribed-text pages already on this site. */
export const CHINESE_TEXT_DEEPLINKS: ChineseLink[] = CHINESE_PRESCRIBED_TEXTS.map(
  (text, index) => ({
    href: textHref(text.slug),
    label: `範文-${String(index + 1).padStart(2, "0")}　${text.title}`,
  }),
);

const textLink = (index: number): ChineseLink => CHINESE_TEXT_DEEPLINKS[index];

export const CHINESE_HUB_LINKS: ChineseLink[] = [
  { href: "/dse/chinese", label: "指定範文" },
  { href: "/dse/chinese/cat", label: "範文 AI 診斷室" },
  { href: "/dse/chinese/error-notebook", label: "錯題本" },
];

export const CHINESE_UNITS: ChineseUnit[] = [
  {
    id: 1,
    unitCode: "chi-learn-U01",
    title: "範文導讀・字詞入門",
    label: "chi-vocab",
    topicKey: "chi-vocab",
    prerequisites: [],
    lessonIds: ["L01"],
    passThreshold: CHINESE_PASS_MARK,
    links: [textLink(0), textLink(1), textLink(2)],
  },
  {
    id: 2,
    unitCode: "chi-learn-U02",
    title: "範文導讀・句意",
    label: "chi-sentence",
    topicKey: "chi-sentence",
    prerequisites: [1],
    lessonIds: ["L02"],
    passThreshold: CHINESE_PASS_MARK,
    links: [textLink(1)],
  },
  {
    id: 3,
    unitCode: "chi-learn-U03",
    title: "範文導讀・段旨",
    label: "chi-para",
    topicKey: "chi-para",
    prerequisites: [2],
    lessonIds: ["L03"],
    passThreshold: CHINESE_PASS_MARK,
    links: [textLink(2)],
  },
  {
    id: 4,
    unitCode: "chi-learn-U04",
    title: "範文導讀・手法",
    label: "chi-device",
    topicKey: "chi-device",
    prerequisites: [3],
    lessonIds: ["L04"],
    passThreshold: CHINESE_PASS_MARK,
    links: [textLink(3)],
  },
  {
    id: 5,
    unitCode: "chi-learn-U05",
    title: "範文導讀・主題",
    label: "chi-theme",
    topicKey: "chi-theme",
    prerequisites: [4],
    lessonIds: ["L05"],
    passThreshold: CHINESE_PASS_MARK,
    links: [textLink(4)],
  },
  {
    id: 6,
    unitCode: "chi-learn-U06",
    title: "跨篇比較・短答框架",
    label: "chi-compare, chi-frame",
    topicKey: "chi-compare",
    prerequisites: [5],
    lessonIds: ["L06"],
    passThreshold: CHINESE_PASS_MARK,
    links: [
      { href: "/dse/chinese", label: "12 篇指定範文" },
      textLink(0),
      textLink(4),
    ],
  },
  {
    id: 7,
    unitCode: "chi-learn-U07",
    title: "閱讀策略・題幹拆解",
    label: "chi-stem",
    topicKey: "chi-stem",
    prerequisites: [6],
    lessonIds: ["L07"],
    passThreshold: CHINESE_PASS_MARK,
    links: [],
  },
  {
    id: 8,
    unitCode: "chi-learn-U08",
    title: "閱讀策略・推論與主旨",
    label: "chi-infer, chi-gist",
    topicKey: "chi-infer",
    prerequisites: [7],
    lessonIds: ["L08"],
    passThreshold: CHINESE_PASS_MARK,
    links: [],
  },
  {
    id: 9,
    unitCode: "chi-learn-U09",
    title: "寫作・審題立綱",
    label: "chi-prompt, chi-outline",
    topicKey: "chi-prompt",
    prerequisites: [8],
    lessonIds: ["L09"],
    passThreshold: CHINESE_PASS_MARK,
    links: [],
  },
  {
    id: 10,
    unitCode: "chi-learn-U10",
    title: "寫作・段落與銜接",
    label: "chi-cohere",
    topicKey: "chi-cohere",
    prerequisites: [9],
    lessonIds: ["L10"],
    passThreshold: CHINESE_PASS_MARK,
    links: [],
  },
  {
    id: 11,
    unitCode: "chi-learn-U11",
    title: "說話・情境回應",
    label: "chi-speak",
    topicKey: "chi-speak",
    prerequisites: [10],
    lessonIds: ["L11"],
    passThreshold: CHINESE_PASS_MARK,
    links: [],
  },
  {
    id: 12,
    unitCode: "chi-learn-U12",
    title: "綜合・錯題回練",
    label: "chi-review",
    topicKey: "chi-review",
    prerequisites: [11],
    lessonIds: ["L12"],
    passThreshold: CHINESE_PASS_MARK,
    links: CHINESE_HUB_LINKS,
  },
];

const QUESTIONS = (chineseDrills as { questions: ChineseQuestion[] }).questions;

export function getChinesePracticeSet(unitCode: string): ChineseQuestion[] {
  return QUESTIONS.filter((question) => question.unitId === unitCode);
}

function assertChinesePathConsistency(): void {
  if (CHINESE_PROGRESS_KEY.includes("learn-play")) {
    throw new Error("Chinese learn progress must stay on the DSE device key");
  }
  const lessons = chineseLessons as Record<string, ChineseLesson>;
  const meta = chineseDrills as { meta: { total: number }; questions: ChineseQuestion[] };
  if (meta.meta.total !== meta.questions.length) {
    throw new Error(
      `Chinese learn meta.total ${meta.meta.total} does not match ${meta.questions.length} questions`,
    );
  }
  const seen = new Set<string>();
  for (const question of meta.questions) {
    if (seen.has(question.id)) throw new Error(`Duplicate Chinese drill ${question.id}`);
    seen.add(question.id);
    if (question.choices.length !== 3) {
      throw new Error(`Chinese drill ${question.id} must keep its 3 authored choices`);
    }
    if (question.answerIndex < 0 || question.answerIndex >= question.choices.length) {
      throw new Error(`Chinese drill ${question.id} has an answer outside its choices`);
    }
    if (!question.prompt || !question.hint || !question.explain) {
      throw new Error(`Chinese drill ${question.id} is missing prompt, hint, or explain`);
    }
  }
  const lessonIds = new Set<string>();
  for (const unit of CHINESE_UNITS) {
    if (unit.passThreshold !== CHINESE_PASS_MARK) {
      throw new Error(`Chinese unit ${unit.unitCode} pass mark drifted from 3/4`);
    }
    for (const lessonId of unit.lessonIds) {
      const lesson = lessons[lessonId];
      if (!lesson) throw new Error(`Missing Chinese lesson ${lessonId}`);
      if (lesson.unit !== unit.id) {
        throw new Error(`Lesson ${lessonId} is unit ${lesson.unit}, expected ${unit.id}`);
      }
      if (lesson.title !== unit.title) {
        throw new Error(`Lesson ${lessonId} title does not match ${unit.unitCode}`);
      }
      lessonIds.add(lessonId);
    }
    const set = getChinesePracticeSet(unit.unitCode);
    if (set.length !== CHINESE_SET_SIZE) {
      throw new Error(`${unit.unitCode} has ${set.length} drills; need ${CHINESE_SET_SIZE}`);
    }
  }
  for (const lessonId of Object.keys(lessons)) {
    if (!lessonIds.has(lessonId)) {
      throw new Error(`Chinese lesson ${lessonId} is not on the learn path`);
    }
  }
}

assertChinesePathConsistency();
