import type { SchoolDetail } from "@/lib/schools/types";
import { getSeoSummaryText } from "@/lib/schools/load";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export function buildSchoolOrganizationJsonLd(
  school: SchoolDetail,
  path: string,
) {
  const description = getSeoSummaryText(school.seo_summary);
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: school.name_zh,
    alternateName: school.name_en,
    description: description || `${school.name_zh} 小學升學資訊`,
    url: `${SITE_URL}${path}`,
    address: school.address
      ? {
          "@type": "PostalAddress",
          streetAddress: school.address,
          addressCountry: "HK",
          addressRegion: school.district,
        }
      : undefined,
    telephone: school.phone,
    email: school.email,
    sameAs: school.website ? [school.website] : undefined,
    parentOrganization: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

export function buildSchoolFaqJsonLd(school: SchoolDetail) {
  const faqs: { question: string; answer: string }[] = [];

  const summary = getSeoSummaryText(school.seo_summary);
  if (summary) {
    faqs.push({
      question: `${school.name_zh}有什麼特色？`,
      answer: summary,
    });
  }

  const alloc = school.secondary_allocation;
  if (alloc?.band1_estimate != null) {
    faqs.push({
      question: `${school.name_zh}升中 Band 1 比例大概如何？`,
      answer: `公開資料推估 Band 1 比例約為 ${String(alloc.band1_estimate)}${
        alloc.notes ? `。${alloc.notes}` : "。"
      }`,
    });
  }

  if (school.admission_info?.application_deadline) {
    faqs.push({
      question: `${school.name_zh}報名什麼時候截止？`,
      answer: `報名截止日期為 ${school.admission_info.application_deadline}。`,
    });
  }

  if (faqs.length === 0) return null;

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
