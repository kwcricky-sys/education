import fs from "node:fs";
import path from "node:path";
import type {
  SchoolDetail,
  SchoolSummary,
  SchoolsSummaryFile,
} from "@/lib/schools/types";

const DATA_ROOT = path.join(process.cwd(), "src", "data");
const SCHOOLS_DIR = path.join(DATA_ROOT, "schools");
const SUMMARY_PATH = path.join(DATA_ROOT, "schools_summary.json");

function asString(value: unknown): string | undefined {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number" && !Number.isNaN(value)) return String(value);
  return undefined;
}

function pickString(obj: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const v = asString(obj[key]);
    if (v) return v;
  }
  return undefined;
}

/** Normalize Hermes / R2 naming quirks into a stable SchoolSummary. */
export function normalizeSummary(raw: unknown): SchoolSummary | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const id = pickString(o, ["id", "school_id", "schoolId"]);
  const name_zh = pickString(o, [
    "name_zh",
    "name",
    "school_name",
    "school_name_zh",
    "中文名稱",
  ]);
  if (!id || !name_zh) return null;

  return {
    id,
    name_zh,
    name_en: pickString(o, ["name_en", "school_name_en", "english_name"]),
    school_net: pickString(o, [
      "school_net",
      "net",
      "poa_school_net",
      "校網",
    ]),
    finance_type: pickString(o, [
      "finance_type",
      "school_type",
      "type",
      "資助類別",
    ]),
    gender: pickString(o, ["gender", "sex", "性別"]),
    district: pickString(o, [
      "district_zh",
      "district",
      "region",
      "地區",
    ]),
    address: pickString(o, ["address", "address_zh", "地址"]),
    religion: pickString(o, ["religion", "宗教"]),
    tagline: pickString(o, ["tagline", "blurb", "one_liner"]),
  };
}

export function normalizeDetail(raw: unknown): SchoolDetail | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const base = normalizeSummary(raw);
  if (!base) return null;

  return {
    ...o,
    id: base.id,
    name_zh: base.name_zh,
    name_en: base.name_en,
    school_net: base.school_net,
    finance_type: base.finance_type,
    gender: base.gender,
    district: base.district,
    address: base.address,
    religion: base.religion,
    website:
      pickString(o, ["website", "website_url", "url", "homepage", "官網"]) ??
      undefined,
    phone:
      pickString(o, ["phone", "telephone", "tel", "電話"]) ?? undefined,
    email: pickString(o, ["email", "電郵"]),
    seo_summary: o.seo_summary as SchoolDetail["seo_summary"],
    secondary_allocation:
      o.secondary_allocation as SchoolDetail["secondary_allocation"],
    interview_prep: o.interview_prep as SchoolDetail["interview_prep"],
    admission_info: o.admission_info as SchoolDetail["admission_info"],
  };
}

function listSchoolJsonFiles(): string[] {
  if (!fs.existsSync(SCHOOLS_DIR)) return [];
  return fs
    .readdirSync(SCHOOLS_DIR)
    .filter(
      (f) =>
        f.endsWith(".json") &&
        !f.startsWith("_") &&
        !f.startsWith("."),
    )
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

/** File stem → route id. Supports `12.json` and `school_12.json`. */
export function filenameToSchoolId(filename: string): string {
  return filename.replace(/^school_/i, "").replace(/\.json$/i, "");
}

export function resolveSchoolFile(id: string): string | null {
  const candidates = [
    path.join(SCHOOLS_DIR, `${id}.json`),
    path.join(SCHOOLS_DIR, `school_${id}.json`),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

export function getAllSchoolIds(): string[] {
  return listSchoolJsonFiles().map(filenameToSchoolId);
}

export function getSchoolById(id: string): SchoolDetail | null {
  const file = resolveSchoolFile(id);
  if (!file) return null;
  try {
    const raw = JSON.parse(fs.readFileSync(file, "utf8")) as unknown;
    const detail = normalizeDetail(raw);
    if (!detail) return null;
    return { ...detail, id };
  } catch {
    return null;
  }
}

export function getSchoolsSummary(): SchoolSummary[] {
  if (!fs.existsSync(SUMMARY_PATH)) {
    const derived: SchoolSummary[] = [];
    for (const id of getAllSchoolIds()) {
      const d = getSchoolById(id);
      if (!d) continue;
      derived.push({
        id: String(d.id),
        name_zh: d.name_zh,
        name_en: d.name_en,
        school_net: asString(d.school_net),
        finance_type: d.finance_type,
        gender: d.gender,
        district: d.district,
        address: d.address,
        religion: d.religion,
      });
    }
    return derived;
  }

  try {
    const raw = JSON.parse(
      fs.readFileSync(SUMMARY_PATH, "utf8"),
    ) as SchoolsSummaryFile | SchoolSummary[] | { items?: unknown[] };

    const list = Array.isArray(raw)
      ? raw
      : Array.isArray((raw as SchoolsSummaryFile).schools)
        ? (raw as SchoolsSummaryFile).schools
        : Array.isArray((raw as { items?: unknown[] }).items)
          ? ((raw as { items?: unknown[] }).items as unknown[])
          : [];

    return list
      .map(normalizeSummary)
      .filter((x): x is SchoolSummary => x !== null);
  } catch {
    return [];
  }
}

export function getSeoSummaryText(
  summary: SchoolDetail["seo_summary"],
): string {
  if (!summary) return "";
  if (typeof summary === "string") return summary;
  return summary.cantonese || summary.text || "";
}

export function getSeoHighlights(
  summary: SchoolDetail["seo_summary"],
): string[] {
  if (!summary || typeof summary === "string") return [];
  return Array.isArray(summary.highlights) ? summary.highlights : [];
}

export function getInterviewQuestions(
  prep: SchoolDetail["interview_prep"],
): { question: string; tips?: string }[] {
  const raw = prep?.past_questions?.length
    ? prep.past_questions
    : prep?.questions;
  if (!raw?.length) return [];
  return raw
    .map((q) => {
      if (typeof q === "string") return { question: q };
      if (q && typeof q === "object" && "question" in q) {
        return {
          question: String(q.question),
          tips: q.tips ? String(q.tips) : undefined,
        };
      }
      return null;
    })
    .filter((x): x is { question: string; tips?: string } => Boolean(x));
}

export function getInterviewTips(
  prep: SchoolDetail["interview_prep"],
): string[] {
  if (!prep?.tips) return [];
  if (typeof prep.tips === "string") {
    return prep.tips.trim() ? [prep.tips.trim()] : [];
  }
  return prep.tips.map(String).filter(Boolean);
}

const TIMELINE_LABELS: Record<string, string> = {
  briefing_date: "簡介會／開放日",
  application_deadline: "報名截止",
  interview_dates: "面試日期",
  open_day: "開放日",
};

export function getAdmissionTimeline(
  info: SchoolDetail["admission_info"],
): { label: string; date?: string; note?: string }[] {
  if (!info) return [];

  if (Array.isArray(info.timeline) && info.timeline.length > 0) {
    return info.timeline.map((t) => ({
      label: t.label,
      date: t.date,
      note: t.note,
    }));
  }

  const items: { label: string; date?: string; note?: string }[] = [];

  if (info.timeline && typeof info.timeline === "object") {
    for (const [key, label] of Object.entries(TIMELINE_LABELS)) {
      const date = asString(
        (info.timeline as Record<string, unknown>)[key],
      );
      if (date) items.push({ label, date });
    }
  }

  if (items.length === 0) {
    if (info.application_deadline) {
      items.push({ label: "報名截止", date: info.application_deadline });
    }
    if (info.interview_dates) {
      const dates = Array.isArray(info.interview_dates)
        ? info.interview_dates.join("、")
        : info.interview_dates;
      if (dates) items.push({ label: "面試日期", date: dates });
    }
    if (info.open_day) {
      items.push({ label: "開放日", date: info.open_day });
    }
  }

  return items;
}

export function getFeederSchools(alloc: SchoolDetail["secondary_allocation"]) {
  if (!alloc) return [] as string[];
  return [
    ...(alloc.feeder_school ?? []),
    ...(alloc.through_train ?? []),
    ...(alloc.linked_secondary ?? []),
  ].filter(Boolean);
}

export function getBand1Estimate(alloc: SchoolDetail["secondary_allocation"]) {
  if (!alloc) return undefined;
  const v = alloc.band1_rate_estimated ?? alloc.band1_estimate;
  return v == null ? undefined : String(v);
}

export function getTopDestinations(
  alloc: SchoolDetail["secondary_allocation"],
) {
  if (!alloc) return [] as string[];
  return [
    ...(alloc.top_destinations ?? []),
    ...(alloc.common_elite_schools ?? []),
  ].filter(Boolean);
}

export const SCHOOLS_DATA_PATHS = {
  summary: "src/data/schools_summary.json",
  detailsDir: "src/data/schools/",
} as const;
