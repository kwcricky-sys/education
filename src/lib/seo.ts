import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/site";

export type FaqItem = {
  question: string;
  answer: string;
};

export function buildFaqJsonLd(faqs: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function buildBreadcrumbJsonLd(
  items: { name: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.path === "/" ? SITE_URL : `${SITE_URL}${item.path}`,
    })),
  };
}

export function buildWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    alternateName: "StudyPath",
    url: SITE_URL,
    inLanguage: "zh-HK",
    description: `${SITE_NAME}｜${SITE_TAGLINE}。DSE 備考練習與 K3 選小學指南，免費線上學習資源。`,
  };
}

export function buildCourseJsonLd(opts: {
  name: string;
  description: string;
  url: string;
  providerName?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: opts.name,
    description: opts.description,
    url: opts.url,
    provider: {
      "@type": "Organization",
      name: opts.providerName ?? SITE_NAME,
      sameAs: SITE_URL,
    },
    isAccessibleForFree: true,
    inLanguage: "zh-HK",
    educationalLevel: "Secondary",
  };
}
