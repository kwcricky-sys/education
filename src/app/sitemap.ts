import type { MetadataRoute } from "next";
import { CHINESE_PRESCRIBED_TEXTS, textHref } from "@/lib/dse/texts";
import { getDrillBank, DRILL_SUBJECTS, questionHref } from "@/lib/dse/drills";
import { SITE_URL } from "@/lib/site";

/** DSE-only sitemap (primary school product lives on PrimaryNav). */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const core: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
    {
      url: `${SITE_URL}/dse`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${SITE_URL}/dse/chinese`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${SITE_URL}/dse/chinese/cat`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.92,
    },
    {
      url: `${SITE_URL}/dse/chinese/error-notebook`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/guides/dse-buxi`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.88,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const texts = CHINESE_PRESCRIBED_TEXTS.map((t) => ({
    url: `${SITE_URL}${textHref(t.slug)}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  // Drill pages: subject hubs, topic hubs, and every question (long-tail SEO).
  const drillUrls: MetadataRoute.Sitemap = [];
  for (const s of DRILL_SUBJECTS) {
    const bank = getDrillBank(s);
    if (!bank) continue;
    drillUrls.push({
      url: `${SITE_URL}/dse/${s}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    });
    const topics = [...new Set(bank.questions.map((q) => q.topic))];
    for (const t of topics) {
      drillUrls.push({
        url: `${SITE_URL}/dse/${s}/${t}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
    for (const q of bank.questions) {
      drillUrls.push({
        url: `${SITE_URL}${questionHref(s, q)}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  return [...core, ...texts, ...drillUrls];
}
