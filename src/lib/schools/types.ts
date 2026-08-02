/** Lightweight row used by /schools filter & search. */
export type SchoolSummary = {
  id: string;
  name_zh: string;
  name_en?: string;
  school_net?: string;
  finance_type?: string;
  gender?: string;
  district?: string;
  address?: string;
  religion?: string;
  tagline?: string;
};

export type SchoolsSummaryFile = {
  generated_at?: string;
  updated_at?: string;
  total?: number;
  count?: number;
  source?: string;
  schools: SchoolSummary[];
};

export type InterviewQuestion = {
  question: string;
  tips?: string;
};

export type AdmissionTimelineItem = {
  label: string;
  date?: string;
  note?: string;
};

/** Hermes secondary_allocation shape (+ legacy aliases). */
export type SecondaryAllocation = {
  feeder_school?: string[];
  through_train?: string[];
  linked_secondary?: string[];
  band1_rate_estimated?: string | number;
  band1_estimate?: string | number;
  top_destinations?: string[];
  common_elite_schools?: string[];
  notes?: string;
};

/** Hermes admission_info — timeline may be object or array. */
export type AdmissionInfo = {
  application_fee?: string;
  direct_link?: string;
  application_deadline?: string;
  interview_dates?: string | string[];
  open_day?: string;
  timeline?:
    | AdmissionTimelineItem[]
    | {
        briefing_date?: string;
        application_deadline?: string;
        interview_dates?: string;
        open_day?: string;
        [key: string]: string | undefined;
      };
  notes?: string;
};

export type InterviewPrep = {
  format?: string;
  past_questions?: Array<InterviewQuestion | string>;
  questions?: Array<InterviewQuestion | string>;
  tips?: string | string[];
  notes?: string;
};

export type SeoSummary =
  | string
  | {
      cantonese?: string;
      text?: string;
      highlights?: string[];
    };

/** Full detail document: `src/data/schools/{id}.json` */
export type SchoolDetail = {
  id: string | number;
  name_zh: string;
  name_en?: string;
  school_net?: string | number;
  finance_type?: string;
  gender?: string;
  district?: string;
  district_zh?: string;
  address?: string;
  website?: string;
  website_url?: string;
  phone?: string;
  telephone?: string;
  email?: string;
  religion?: string;
  motto?: string;
  sponsoring_body?: string;
  founding_year?: string;
  seo_summary?: SeoSummary;
  secondary_allocation?: SecondaryAllocation;
  interview_prep?: InterviewPrep;
  admission_info?: AdmissionInfo;
  [key: string]: unknown;
};
