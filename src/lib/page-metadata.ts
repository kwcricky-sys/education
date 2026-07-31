import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const DEFAULT_OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
} as const;

export type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  ogType?: "website" | "article";
  robots?: Metadata["robots"];
};

/** Complete App Router metadata: title, description, canonical, OG, Twitter. */
export function createPageMetadata({
  title,
  description,
  path,
  keywords,
  ogType = "website",
  robots = { index: true, follow: true },
}: PageMetadataInput): Metadata {
  const url = path === "/" ? SITE_URL : `${SITE_URL}${path}`;
  const ogImage = { ...DEFAULT_OG_IMAGE, alt: title };

  return {
    title: { absolute: title },
    description,
    ...(keywords?.length ? { keywords } : {}),
    alternates: { canonical: url },
    robots,
    openGraph: {
      type: ogType,
      locale: "zh_HK",
      url,
      siteName: SITE_NAME,
      title,
      description,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [DEFAULT_OG_IMAGE.url],
    },
  };
}
