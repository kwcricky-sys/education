import adviceFile from "@/data/advice_templates.json";
import { formatMatchedSchoolsMd, matchSchools } from "@/lib/calculator/match";
import { calculateProbability, pct } from "@/lib/calculator/probability";
import type {
  CalculatorInput,
  CalculatorResult,
  GenderPref,
  Readiness,
} from "@/lib/calculator/types";
import type { SchoolSummary } from "@/lib/schools/types";
import { SITE_NAME } from "@/lib/site";

type Template = {
  id: string;
  persona: string;
  match: {
    score: number;
    style: string;
    gender_pref: "coed" | "single";
    readiness: "low" | "high";
  };
  report_md: string;
};

type AdviceFile = {
  templates: Template[];
};

const file = adviceFile as AdviceFile;

function toTemplateGenderPref(pref: GenderPref): "coed" | "single" {
  return pref === "coed" ? "coed" : "single";
}

function toTemplateReadiness(ready: Readiness): "low" | "high" {
  return ready === "low" ? "low" : "high";
}

export function pickAdviceTemplate(input: CalculatorInput): Template {
  const g = toTemplateGenderPref(input.genderPref);
  const r = toTemplateReadiness(input.readiness);

  const exact = file.templates.find(
    (t) =>
      t.match.score === input.score &&
      t.match.style === input.style &&
      t.match.gender_pref === g &&
      t.match.readiness === r,
  );
  if (exact) return exact;

  return (
    file.templates.find(
      (t) => t.match.score === input.score && t.match.style === input.style,
    ) ?? file.templates[0]
  );
}

export function fillTemplate(
  md: string,
  vars: Record<string, string>,
): string {
  return Object.entries(vars).reduce(
    (acc, [key, value]) => acc.replaceAll(`{${key}}`, value),
    md,
  );
}

export function runCalculator(
  input: CalculatorInput,
  schools: SchoolSummary[],
): CalculatorResult {
  const probability = calculateProbability(input);
  const matchedSchools = matchSchools(input, schools, 5);
  const template = pickAdviceTemplate(input);
  const target =
    input.targetSchoolName?.trim() ||
    matchedSchools[0]?.name_zh ||
    "（請先選擇心儀學校）";

  const reportMarkdown = fillTemplate(template.report_md, {
    persona_name: template.persona,
    target_school: target,
    school_net: input.schoolNet.trim() || "未填寫",
    score: String(input.score),
    success_rate: pct(probability.successRate, 0),
    discretionary_rate: pct(probability.discretionaryRate, 0),
    gender_modifier: probability.genderModifier.toFixed(2),
    strategy_modifier: probability.strategyModifier.toFixed(2),
    matched_schools: formatMatchedSchoolsMd(matchedSchools),
    site_name: SITE_NAME,
  });

  return {
    input,
    probability,
    matchedSchools,
    personaId: template.id,
    personaName: template.persona,
    reportMarkdown,
  };
}
