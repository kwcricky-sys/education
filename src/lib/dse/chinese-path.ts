/**
 * Chinese learn path: five cards per prescribed text, plus original
 * paper-skill drills. Hosted at /dse/chinese/learn so it does not collide
 * with /dse/chinese/[slug] flashcard routes.
 */
import chineseCards from "@/data/dse/chinese-learn-cards.json";
import chinesePaperDrills from "@/data/dse/chinese-paper-drills.json";
import { CHINESE_PRESCRIBED_TEXTS } from "@/lib/dse/texts";
import type { DrillQuestion } from "@/lib/dse/drills";

export type ChineseLearningCard = {
  id: string;
  textSlug: string;
  textTitle: string;
  source: string;
  focus: string;
  prompt: string;
  answer: string;
  trap: string;
};

export type ChinesePaperSkill = {
  id: string;
  title: string;
  blurb: string;
};

export const CHINESE_PAPER_SKILLS: ChinesePaperSkill[] = [
  {
    id: "cross-passage",
    title: "跨篇章比較",
    blurb: "兩篇指定篇章一齊讀：先寫相同，再寫不同，兩邊都要返到文本。",
  },
  {
    id: "reading",
    title: "閱讀理解",
    blurb: "用原創短文練段旨、詞義、立場同要點分。唔係歷屆試卷。",
  },
  {
    id: "writing",
    title: "寫作",
    blurb: "審題、文體、立意、細節同實用文語氣。",
  },
  {
    id: "speaking",
    title: "說話",
    blurb: "個人短講同小組討論：立場、例子、接話和收束。",
  },
];

const CARDS = (chineseCards as { cards: ChineseLearningCard[] }).cards;
const DRILLS = (chinesePaperDrills as { questions: DrillQuestion[] }).questions;

export function getChineseLearningCards(): ChineseLearningCard[] {
  return CARDS;
}

export function getChineseCardsForText(slug: string): ChineseLearningCard[] {
  return CARDS.filter((card) => card.textSlug === slug);
}

export function getChinesePaperDrills(topic?: string): DrillQuestion[] {
  if (!topic) return DRILLS;
  return DRILLS.filter((question) => question.topic === topic);
}

function assertChineseLearnConsistency(): void {
  const slugs = new Set(CHINESE_PRESCRIBED_TEXTS.map((text) => text.slug));
  const ids = new Set<string>();
  if (CARDS.length !== slugs.size * 5) {
    throw new Error(`Expected ${slugs.size * 5} Chinese learning cards, got ${CARDS.length}`);
  }
  for (const card of CARDS) {
    if (ids.has(card.id)) throw new Error(`Duplicate Chinese card id ${card.id}`);
    ids.add(card.id);
    if (!slugs.has(card.textSlug)) throw new Error(`Unknown text slug ${card.textSlug}`);
    if (!card.prompt || !card.answer || !card.trap) throw new Error(`Thin card ${card.id}`);
  }
  for (const slug of slugs) {
    const n = CARDS.filter((card) => card.textSlug === slug).length;
    if (n !== 5) throw new Error(`${slug} has ${n} cards`);
  }
  for (const skill of CHINESE_PAPER_SKILLS) {
    const rows = DRILLS.filter((question) => question.topic === skill.id);
    if (rows.length < 12) throw new Error(`${skill.id} has ${rows.length} drills`);
    const counts = { A: 0, B: 0, C: 0, D: 0 };
    for (const question of rows) {
      if (ids.has(question.id)) throw new Error(`Duplicate Chinese id ${question.id}`);
      ids.add(question.id);
      if (question.options.length !== 4 || !(question.answer in counts)) {
        throw new Error(`Malformed Chinese drill ${question.id}`);
      }
      counts[question.answer as keyof typeof counts] += 1;
    }
    const values = Object.values(counts);
    if (Math.max(...values) - Math.min(...values) > 1) {
      throw new Error(`${skill.id} answer keys unbalanced`);
    }
  }
}

assertChineseLearnConsistency();
