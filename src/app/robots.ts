import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * Native App Router robots → served at /robots.txt
 * (App Router 使用 robots.ts，唔係靜態 robots.txt 檔)
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
