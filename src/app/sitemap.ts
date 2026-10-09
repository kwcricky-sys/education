import type { MetadataRoute } from "next";
import { CHINESE_PRESCRIBED_TEXTS, textHref } from "@/lib/dse/texts";
import { getDrillBank, DRILL_SUBJECTS, questionHref } from "@/lib/dse/drills";
import { getAllVideoLibraries } from "@/lib/dse/videos";
import { SITE_URL } from "@/lib/site";

/**
 * DSE-only sitemap (primary school product lives on PrimaryNav).
 *
 * `lastModified` is only set where the content carries a real date (video
 * libraries' `curatedAt`); a build timestamp on every URL tells crawlers that
 * everything changes on every deploy, which makes lastmod meaningless.
 * The error notebook is per-device state with no crawlable content, so it is
 * noindex and left out.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const core: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    {
      url: `${SITE_URL}/dse`,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${SITE_URL}/dse/chinese`,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${SITE_URL}/dse/chinese/learn`,
      changeFrequency: "weekly",
      priority: 0.93,
    },
    {
      url: `${SITE_URL}/dse/chinese/cat`,
      changeFrequency: "weekly",
      priority: 0.92,
    },
    {
      url: `${SITE_URL}/dse/econ/learn`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/dse/ict/learn`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/dse/english/learn`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/dse/math/learn`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/dse/bafs/learn`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/dse/jupas`,
      changeFrequency: "weekly",
      priority: 0.93,
    },
    {
      url: `${SITE_URL}/dse/jupas/compare`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/guides/dse-buxi`,
      changeFrequency: "monthly",
      priority: 0.88,
    },
    {
      url: `${SITE_URL}/privacy`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terms`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const texts = CHINESE_PRESCRIBED_TEXTS.map((t) => ({
    url: `${SITE_URL}${textHref(t.slug)}`,
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
      changeFrequency: "weekly",
      priority: 0.9,
    });
    const topics = [...new Set(bank.questions.map((q) => q.topic))];
    for (const t of topics) {
      drillUrls.push({
        url: `${SITE_URL}/dse/${s}/${t}`,
          changeFrequency: "weekly",
        priority: 0.8,
      });
    }
    for (const q of bank.questions) {
      drillUrls.push({
        url: `${SITE_URL}${questionHref(s, q)}`,
          changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  // Curated YouTube video library: hub + one page per subject.
  const videoUrls: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/dse/videos`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...getAllVideoLibraries().map((lib) => ({
      url: `${SITE_URL}/dse/videos/${lib.meta.subject}`,
      lastModified: lib.meta.curatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    })),
  ];

  return [...core, ...texts, ...drillUrls, ...videoUrls];
}
