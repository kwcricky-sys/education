import type {
  CalculatorInput,
  GenderPref,
  MatchedSchool,
  TeachingStyle,
} from "@/lib/calculator/types";
import type { SchoolSummary } from "@/lib/schools/types";

/**
 * Rule-based school match (no AI). Pass in summary rows from the page.
 */
export function matchSchools(
  input: CalculatorInput,
  all: SchoolSummary[],
  limit = 5,
): MatchedSchool[] {
  const net = input.schoolNet.trim();

  let pool = all.filter((s) => {
    if (net && s.school_net && s.school_net !== net) return false;
    return genderFits(s.gender, input.genderPref, input.childGender);
  });

  if (pool.length < 3 && net) {
    pool = all.filter((s) =>
      genderFits(s.gender, input.genderPref, input.childGender),
    );
  }

  const scored = pool.map((s) => ({
    school: s,
    score:
      styleFinanceScore(s.finance_type, input.style) +
      (net && s.school_net === net ? 3 : 0),
  }));

  scored.sort(
    (a, b) =>
      b.score - a.score ||
      a.school.name_zh.localeCompare(b.school.name_zh, "zh-Hant"),
  );

  return scored.slice(0, limit).map(({ school }) => ({
    id: school.id,
    name_zh: school.name_zh,
    name_en: school.name_en,
    school_net: school.school_net,
    finance_type: school.finance_type,
    gender: school.gender,
    district: school.district,
  }));
}

function genderFits(
  schoolGender: string | undefined,
  pref: GenderPref,
  child: CalculatorInput["childGender"],
): boolean {
  const g = schoolGender ?? "";
  if (pref === "coed") {
    return (
      g.includes("男女") ||
      g === "" ||
      (!g.includes("男") && !g.includes("女"))
    );
  }
  if (pref === "boys") {
    return (
      g === "男" ||
      (child === "boy" && g.includes("男") && !g.includes("女"))
    );
  }
  if (pref === "girls") {
    return (
      g === "女" ||
      (child === "girl" && g.includes("女") && !g.includes("男"))
    );
  }
  return true;
}

function styleFinanceScore(
  finance: string | undefined,
  style: TeachingStyle,
): number {
  const f = finance ?? "";
  if (style === "bilingual") {
    if (f.includes("私立") || f.includes("直資")) return 4;
    return 1;
  }
  if (style === "happy") {
    if (f.includes("直資")) return 3;
    if (f.includes("資助")) return 2;
    return 1;
  }
  if (f.includes("資助") || f.includes("官立")) return 3;
  return 1;
}

export function formatMatchedSchoolsMd(schools: MatchedSchool[]): string {
  if (schools.length === 0) {
    return "_暫時搵唔到足夠匹配學校，建議放寬性別或校網條件。_";
  }
  return schools
    .map(
      (s, i) =>
        `${i + 1}. **${s.name_zh}**${s.finance_type ? `（${s.finance_type}）` : ""}${
          s.school_net ? ` · 校網 ${s.school_net}` : ""
        }${s.district ? ` · ${s.district}` : ""} — [/schools/${s.id}](/schools/${s.id})`,
    )
    .join("\n");
}
