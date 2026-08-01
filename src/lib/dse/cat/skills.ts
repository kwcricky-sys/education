/** Four human-readable exam skill pillars for report aggregation. */

export type CoreSkillId =
  | "foundation"
  | "translation"
  | "comprehension"
  | "advanced";

export type CoreSkillDef = {
  id: CoreSkillId;
  label: string;
  blurb: string;
  /** Substring / keyword matches against raw question.category */
  keywords: string[];
};

export const CORE_SKILLS: CoreSkillDef[] = [
  {
    id: "foundation",
    label: "基礎文言",
    blurb: "字詞釋義／通假字／虛詞",
    keywords: [
      "字詞",
      "通假",
      "虛詞",
      "詞類",
      "成語",
      "文言實詞",
      "文言虛詞",
      "內容記憶",
      "句式結構",
      "倒裝",
    ],
  },
  {
    id: "translation",
    label: "白話翻譯",
    blurb: "文言句譯",
    keywords: ["句譯", "語譯", "翻譯"],
  },
  {
    id: "comprehension",
    label: "文章理解",
    blurb: "論證邏輯／寫作手法／國學思想",
    keywords: [
      "論證",
      "寫作",
      "修辭",
      "手法",
      "主旨",
      "思想",
      "情感",
      "內容理解",
      "國學",
      "典故",
      "意象",
      "風格",
      "體裁",
      "格律",
      "押韻",
      "用韻",
      "借代",
      "比喻",
      "擬人",
      "感官",
      "對比分析",
      "歷史人物",
      "詩人",
      "詩歌",
      "雙關",
    ],
  },
  {
    id: "advanced",
    label: "高階考點",
    blurb: "跨篇章比較／考評局 Marking 邏輯",
    keywords: [
      "跨篇章",
      "考評局",
      "marking",
      "評析",
      "深層",
      "logic",
    ],
  },
];

export function mapCategoryToCoreSkill(category: string): CoreSkillId {
  const c = category.toLowerCase();

  // Advanced first — "考評局語譯" should count as advanced, not translation
  for (const skill of CORE_SKILLS) {
    if (skill.id === "advanced") {
      if (skill.keywords.some((k) => c.includes(k.toLowerCase()))) {
        return "advanced";
      }
    }
  }

  for (const skill of CORE_SKILLS) {
    if (skill.id === "advanced") continue;
    if (skill.keywords.some((k) => c.includes(k.toLowerCase()))) {
      return skill.id;
    }
  }

  // Default bucket for unmatched tags
  return "comprehension";
}

export function coreSkillLabel(id: CoreSkillId): string {
  return CORE_SKILLS.find((s) => s.id === id)?.label ?? id;
}
