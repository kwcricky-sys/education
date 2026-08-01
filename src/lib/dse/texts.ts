import type { PrescribedText } from "@/lib/dse/types";

/** Official HKDSE 12 prescribed classical texts (卷一). */
export const CHINESE_PRESCRIBED_TEXTS: PrescribedText[] = [
  {
    slug: "analects",
    title: "論仁、論孝、論君子",
    source: "《論語》",
    shortName: "論語",
    keywords: ["DSE 論語", "論仁論孝論君子", "指定範文"],
    blurb: "60 題三階極速閃卡 · 字詞／通假／句譯／考評標示",
  },
  {
    slug: "fish",
    title: "魚我所欲也",
    source: "《孟子》",
    shortName: "魚我所欲也",
    keywords: ["DSE 魚我所欲也", "孟子", "捨生取義"],
    blurb: "60 題三階極速閃卡 · 字詞／通假／章旨／考評標示",
  },
  {
    slug: "xiaoyaoyou",
    title: "逍遙遊（節錄）",
    source: "《莊子》",
    shortName: "逍遙遊",
    keywords: ["DSE 逍遙遊", "莊子", "指定範文"],
    blurb: "60 題三階極速閃卡 · 字詞／寓言／文意／考評標示",
  },
  {
    slug: "quanxue",
    title: "勸學（節錄）",
    source: "《荀子》",
    shortName: "勸學",
    keywords: ["DSE 勸學", "荀子", "指定範文"],
    blurb: "60 題三階極速閃卡 · 字詞／比喻／章旨／考評標示",
  },
  {
    slug: "lianpo",
    title: "廉頗藺相如列傳（節錄）",
    source: "《史記》",
    shortName: "廉頗藺相如列傳",
    keywords: ["DSE 廉頗藺相如", "史記", "指定範文"],
    blurb: "60 題三階極速閃卡 · 字詞／人物／敘事／考評標示",
  },
  {
    slug: "chushi",
    title: "出師表",
    source: "諸葛亮",
    shortName: "出師表",
    keywords: ["DSE 出師表", "諸葛亮", "指定範文"],
    blurb: "60 題三階極速閃卡 · 字詞／情理／章旨／考評標示",
  },
  {
    slug: "shishuo",
    title: "師說",
    source: "韓愈",
    shortName: "師說",
    keywords: ["DSE 師說", "韓愈", "指定範文"],
    blurb: "60 題三階極速閃卡 · 字詞／議論／章旨／考評標示",
  },
  {
    slug: "xishan",
    title: "始得西山宴遊記",
    source: "柳宗元",
    shortName: "始得西山宴遊記",
    keywords: ["DSE 西山宴遊記", "柳宗元", "指定範文"],
    blurb: "60 題三階極速閃卡 · 字詞／寫景／寄託／考評標示",
  },
  {
    slug: "yueyang",
    title: "岳陽樓記",
    source: "范仲淹",
    shortName: "岳陽樓記",
    keywords: ["DSE 岳陽樓記", "范仲淹", "先憂後樂"],
    blurb: "60 題三階極速閃卡 · 字詞／對比／章旨／考評標示",
  },
  {
    slug: "liuguo",
    title: "六國論",
    source: "蘇洵",
    shortName: "六國論",
    keywords: ["DSE 六國論", "蘇洵", "指定範文"],
    blurb: "60 題三階極速閃卡 · 字詞／史論／借古諷今／考評標示",
  },
  {
    slug: "tangshi",
    title: "唐詩三首",
    source: "王維／李白／杜甫",
    shortName: "唐詩三首",
    keywords: ["DSE 唐詩三首", "山居秋暝", "月下獨酌", "登樓"],
    blurb: "60 題 · 山居秋暝、月下獨酌、登樓",
  },
  {
    slug: "cishi",
    title: "詞三首",
    source: "蘇軾／李清照／辛棄疾",
    shortName: "詞三首",
    keywords: ["DSE 詞三首", "念奴嬌", "聲聲慢", "青玉案"],
    blurb: "60 題 · 念奴嬌、聲聲慢、青玉案",
  },
];

export function getPrescribedText(slug: string): PrescribedText | undefined {
  return CHINESE_PRESCRIBED_TEXTS.find((t) => t.slug === slug);
}

export function textHref(slug: string) {
  return `/dse/chinese/${slug}`;
}
