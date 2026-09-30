export type DseSubject = {
  id: string;
  name: string;
  nameEn: string;
  href: string | null;
  open: boolean;
  desc: string;
};

/**
 * Subject registry for the /dse hub.
 *
 * `open` must always reflect content that is actually shipped: set open:true
 * (and give the primary href) as soon as a module is live, so the hub never
 * shows「即將推出」for a subject that already has resources. Language subjects
 * (中文／English), ECON, BAFS and Mathematics (Compulsory) have learn paths, and the
 * subjects below have a curated video library — only subjects with zero
 * content stay closed.
 */
export const DSE_SUBJECTS: DseSubject[] = [
  {
    id: "chinese",
    name: "中國語文",
    nameEn: "Chinese Language",
    href: "/dse/chinese",
    open: true,
    desc: "指定範文閃卡、AI 診斷室、錯題本與溫習片",
  },
  {
    id: "english",
    name: "英國語文",
    nameEn: "English Language",
    href: "/dse/english/learn",
    open: true,
    desc: "由零開始自學路徑、各卷 MCQ 練習與溫習片",
  },
  {
    id: "econ",
    name: "經濟",
    nameEn: "Economics",
    href: "/dse/econ/learn",
    open: true,
    desc: "Learn Mode 課程、經濟 MCQ 練習與溫習片",
  },
  {
    id: "bafs",
    name: "企業、會計與財務概論",
    nameEn: "BAFS",
    href: "/dse/bafs/learn",
    open: true,
    desc: "商管與會計自學路徑、BAFS MCQ 練習",
  },
  {
    id: "math",
    name: "數學",
    nameEn: "Mathematics (Compulsory)",
    href: "/dse/math/learn",
    open: true,
    desc: "必修部分自學路徑、MCQ 練習與溫習片",
  },
  {
    id: "m2",
    name: "數學延伸部分（單元二）",
    nameEn: "Mathematics Extended Part (Module 2)",
    href: "/dse/videos/m2",
    open: true,
    desc: "M2 微積分與代數溫習片",
  },
  {
    id: "physics",
    name: "物理",
    nameEn: "Physics",
    href: "/dse/videos/physics",
    open: true,
    desc: "物理科課題溫習片",
  },
  {
    id: "chemistry",
    name: "化學",
    nameEn: "Chemistry",
    href: "/dse/videos/chemistry",
    open: true,
    desc: "化學科課題溫習片",
  },
  {
    id: "biology",
    name: "生物",
    nameEn: "Biology",
    href: "/dse/videos/biology",
    open: true,
    desc: "生物科課題溫習片",
  },
  {
    id: "others",
    name: "公民與社會發展",
    nameEn: "Citizenship & Social Development",
    href: null,
    open: false,
    desc: "暫未開放，未有內容",
  },
];