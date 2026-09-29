import { ECON_UNITS } from "@/lib/dse/econ-path";
import { ENGLISH_UNITS } from "@/lib/dse/english-path";
import type { DrillQuestion } from "@/lib/dse/drills";
import { DIFFICULTY_LABEL } from "@/lib/dse/types";

export type DrillSubjectMeta = {
  nameZh: string;
  nameEn: string;
  learnHref: string;
  learnLabel: string;
  videoHref: string;
  keywords: string[];
};

export const DRILL_SUBJECT_META: Record<string, DrillSubjectMeta> = {
  econ: {
    nameZh: "經濟科",
    nameEn: "Economics",
    learnHref: "/dse/econ/learn",
    learnLabel: "ECON 自學路徑",
    videoHref: "/dse/videos/econ",
    keywords: [
      "DSE 經濟",
      "DSE Econ MCQ",
      "DSE Economics 練習",
      "經濟科 選擇題",
      "DSE Econ practice",
    ],
  },
  english: {
    nameZh: "英文科",
    nameEn: "English",
    learnHref: "/dse/english/learn",
    learnLabel: "English 自學路徑",
    videoHref: "/dse/videos/english",
    keywords: [
      "DSE English 練習",
      "DSE English grammar",
      "DSE English reading",
      "英文科 MCQ",
      "dse english practice",
    ],
  },
};

/** Topics that exist only in the published drill bank, not in a learn-path unit. */
const EXTRA_TOPIC_LABELS: Record<string, { zh: string; en: string }> = {
  tenses: { zh: "時態", en: "Tenses" },
  conditionals: { zh: "條件句", en: "Conditionals" },
};

export type TopicLabel = { zh: string; en: string; unitId: number | null };

export function topicLabel(subject: string, topic: string): TopicLabel {
  if (subject === "econ") {
    const u = ECON_UNITS.find((x) => x.topicKey === topic);
    if (u) return { zh: u.titleZh, en: u.title, unitId: u.id };
  }
  if (subject === "english") {
    const u = ENGLISH_UNITS.find((x) => x.topicKey === topic);
    if (u) return { zh: u.title, en: u.label, unitId: u.id };
  }
  const extra = EXTRA_TOPIC_LABELS[topic];
  if (extra) return { ...extra, unitId: null };
  const en = topic.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return { zh: en, en, unitId: null };
}

/** Pass mark shared by every unit gate in a subject's learn path. */
export function learnPassThreshold(subject: string): number {
  const units = subject === "econ" ? ECON_UNITS : ENGLISH_UNITS;
  return Math.min(...units.map((u) => u.passThreshold));
}

export function difficultyBreakdown(qs: DrillQuestion[]): string {
  return (["easy", "medium", "hard"] as const)
    .map((d) => `${DIFFICULTY_LABEL[d].zh} ${qs.filter((q) => q.difficulty === d).length}`)
    .join(" · ");
}
