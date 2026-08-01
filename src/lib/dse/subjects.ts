export type DseSubject = {
  id: string;
  name: string;
  nameEn: string;
  href: string | null;
  open: boolean;
  desc: string;
};

/** Extensible subject registry — add href + open:true when a module ships. */
export const DSE_SUBJECTS: DseSubject[] = [
  {
    id: "chinese",
    name: "中國語文",
    nameEn: "Chinese Language",
    href: "/dse/chinese",
    open: true,
    desc: "12 篇閃卡 + 範文 AI 診斷室已上線",
  },
  {
    id: "english",
    name: "英國語文",
    nameEn: "English Language",
    href: null,
    open: false,
    desc: "Reading / Writing drills — Coming Soon",
  },
  {
    id: "math",
    name: "數學",
    nameEn: "Mathematics",
    href: null,
    open: false,
    desc: "Compulsory + M1/M2 — Coming Soon",
  },
  {
    id: "others",
    name: "其他科目",
    nameEn: "More Subjects",
    href: null,
    open: false,
    desc: "公民與社會發展等 — Coming Soon",
  },
];
