import fs from "node:fs";
import path from "node:path";

export type SchoolNewsItem = {
  id?: string;
  school_id?: number | string;
  school_name?: string;
  title?: string;
  summary?: string;
  event_date?: string;
  source_url?: string;
  updated_at?: string;
  url?: string;
  [key: string]: unknown;
};

export type SchoolNewsPayload = {
  generated_at?: string;
  total_items?: number;
  schools_monitored?: number;
  news?: SchoolNewsItem[];
  items?: SchoolNewsItem[];
};

function normalizePayload(data: SchoolNewsPayload): SchoolNewsItem[] {
  const list = data.news ?? data.items ?? [];
  return Array.isArray(list) ? list : [];
}

/**
 * Fetch latest news.json.
 * Prefer public R2 URL (NEXT_PUBLIC_R2_URL) with ISR revalidate 3600;
 * fall back to local sync file from `npm run sync:schools`.
 */
export async function getLatestSchoolNews(
  limit = 8,
): Promise<{ items: SchoolNewsItem[]; source: "r2" | "local"; generatedAt?: string }> {
  const base = process.env.NEXT_PUBLIC_R2_URL?.replace(/\/$/, "");

  if (base) {
    try {
      const res = await fetch(`${base}/news.json`, {
        next: { revalidate: 3600 },
      });
      if (res.ok) {
        const data = (await res.json()) as SchoolNewsPayload;
        return {
          items: normalizePayload(data).slice(0, limit),
          source: "r2",
          generatedAt: data.generated_at,
        };
      }
    } catch {
      // fall through to local
    }
  }

  const localPath = path.join(
    process.cwd(),
    "src",
    "data",
    "schools_news.json",
  );
  if (fs.existsSync(localPath)) {
    const data = JSON.parse(
      fs.readFileSync(localPath, "utf8"),
    ) as SchoolNewsPayload;
    return {
      items: normalizePayload(data).slice(0, limit),
      source: "local",
      generatedAt: data.generated_at,
    };
  }

  return { items: [], source: "local" };
}
