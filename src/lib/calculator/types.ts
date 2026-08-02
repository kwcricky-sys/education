export type DiscretionaryScore = 15 | 20 | 25;
export type TeachingStyle = "academic" | "bilingual" | "happy";
export type GenderPref = "coed" | "boys" | "girls";
export type ChildGender = "boy" | "girl";
export type Readiness = "low" | "mid" | "high";

export type CalculatorInput = {
  schoolNet: string;
  score: DiscretionaryScore;
  childGender: ChildGender;
  genderPref: GenderPref;
  style: TeachingStyle;
  readiness: Readiness;
  /** Optional display name for report */
  targetSchoolName?: string;
};

export type ProbabilityBreakdown = {
  successRate: number;
  discretionaryRate: number;
  genderModifier: number;
  strategyModifier: number;
  baseLabel: string;
  notes: string[];
};

export type MatchedSchool = {
  id: string;
  name_zh: string;
  name_en?: string;
  school_net?: string;
  finance_type?: string;
  gender?: string;
  district?: string;
};

export type CalculatorResult = {
  input: CalculatorInput;
  probability: ProbabilityBreakdown;
  matchedSchools: MatchedSchool[];
  personaId: string;
  personaName: string;
  reportMarkdown: string;
};
