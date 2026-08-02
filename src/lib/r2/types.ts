/**
 * Flexible shapes for school-info R2 payloads.
 * Fields are optional until we lock a schema against live JSON.
 */

export type SchoolSummaryItem = {
  id?: number | string;
  school_id?: number | string;
  name?: string;
  name_en?: string;
  name_zh?: string;
  district?: string;
  region?: string;
  school_type?: string;
  type?: string;
  gender?: string;
  religion?: string;
  website?: string;
  [key: string]: unknown;
};

export type SchoolsSummary = {
  generated_at?: string;
  updated_at?: string;
  total?: number;
  count?: number;
  schools?: SchoolSummaryItem[];
  items?: SchoolSummaryItem[];
  [key: string]: unknown;
};

export type SchoolDetail = SchoolSummaryItem & {
  address?: string;
  phone?: string;
  email?: string;
  description?: string;
  facilities?: unknown;
  [key: string]: unknown;
};

export type SchoolNewsItem = {
  title?: string;
  url?: string;
  source?: string;
  school?: string;
  school_id?: number | string;
  published_at?: string;
  date?: string;
  summary?: string;
  [key: string]: unknown;
};

export type SchoolNewsPayload = {
  generated_at?: string;
  updated_at?: string;
  total_items?: number;
  schools_monitored?: number;
  items?: SchoolNewsItem[];
  news?: SchoolNewsItem[];
  [key: string]: unknown;
};
