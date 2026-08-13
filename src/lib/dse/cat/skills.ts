/** Core skill pillars for report aggregation — 6 buckets so the report
 *  actually reflects strengths/weaknesses instead of dumping everything into
 *  one "文章理解" default bucket. */

export type CoreSkillId =
  | "foundation"
  | "translation"
  | "writing"
  | "argument"
  | "insight"
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
    blurb: "字詞釋義／通假／虛詞／句式",
    keywords: [
      "字詞釋義", "字詞", "通假", "虛詞", "詞類", "成語", "文言實詞",
      "文言虛詞", "內容記憶", "句式", "倒裝", "特殊句式", "詞類活用",
      "古今異義", "虛詞拆解", "指示代詞", "實詞", "習慣語", "謙稱",
      "敬稱", "偏義複詞", "句讀",
    ],
  },
  {
    id: "translation",
    label: "白話翻譯",
    blurb: "文言句譯／語譯",
    keywords: ["句譯", "語譯", "翻譯", "語義翻譯", "語義辨析"],
  },
  {
    id: "writing",
    label: "寫作手法",
    blurb: "修辭／描寫／意象／風格／格律",
    keywords: [
      "修辭", "寫作手法", "寫作特色", "寫作技巧", "寫作風格", "借代",
      "比喻", "擬人", "對比手法", "對比襯托", "對比", "描寫手法",
      "感官", "雙關", "意象", "疊字", "風格", "體裁", "格律", "押韻",
      "用韻", "文體", "詩歌風格", "詩人稱號", "詞派", "映襯", "象徵",
      "寄托", "托物", "反問修辭",
    ],
  },
  {
    id: "argument",
    label: "論證邏輯",
    blurb: "論證手法／結構／說理",
    keywords: [
      "論證", "論證邏輯", "比喻論證", "舉例論證", "假設論證", "對比論證",
      "駁論", "引用論證", "論證手法", "論證對比", "說理", "結構作用",
      "文章結構", "結構", "結尾作用", "題目解構", "議論", "寓言", "推論", "假設推論",
    ],
  },
  {
    id: "insight",
    label: "深層理解",
    blurb: "主旨／情感／思想／哲理",
    keywords: [
      "深層思想", "深層意圖", "主旨", "情感", "思想", "哲理", "核心概念",
      "文意理解", "內容理解", "概念理解", "歷史借鑑", "規勸", "出師條件",
      "人物推薦", "形勢分析", "借鑑", "深意", "啟示", "道理",
    ],
  },
  {
    id: "advanced",
    label: "高階考點",
    blurb: "跨篇章比較／考評局 Marking 邏輯",
    keywords: [
      "跨篇章", "考評局", "marking", "評析", "logic", "深層", "考評標示",
      "比較",
    ],
  },
];

export function mapCategoryToCoreSkill(category: string): CoreSkillId {
  const c = category.toLowerCase();

  // Advanced first — "考評局語譯" should count as advanced, not translation
  if (CORE_SKILLS.find((s) => s.id === "advanced")?.keywords.some((k) => c.includes(k.toLowerCase()))) {
    return "advanced";
  }

  for (const skill of CORE_SKILLS) {
    if (skill.id === "advanced") continue;
    if (skill.keywords.some((k) => c.includes(k.toLowerCase()))) {
      return skill.id;
    }
  }

  // Fallback: try to detect a generic "理解" word before defaulting.
  if (c.includes("理解") || c.includes("分析") || c.includes("解讀")) {
    return "insight";
  }

  // Default bucket — comprehension/insight is the most neutral.
  return "insight";
}

export function coreSkillLabel(id: CoreSkillId): string {
  return CORE_SKILLS.find((s) => s.id === id)?.label ?? id;
}
