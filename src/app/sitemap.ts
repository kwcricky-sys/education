import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[0]["changeFrequency"] }[] = [
    { path: "/", priority: 1, changeFrequency: "weekly" },
    { path: "/dse", priority: 0.9, changeFrequency: "weekly" },
    { path: "/dse/chinese", priority: 0.85, changeFrequency: "weekly" },
    {
      path: "/dse/chinese/analects",
      priority: 0.95,
      changeFrequency: "monthly",
    },
    { path: "/k3", priority: 0.5, changeFrequency: "monthly" },
  ];

  return routes.map((r) => ({
    url: r.path === "/" ? SITE_URL : `${SITE_URL}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
