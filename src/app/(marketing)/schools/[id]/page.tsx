import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/json-ld";
import { SchoolDetailView } from "@/components/schools/school-detail-view";
import {
  buildSchoolFaqJsonLd,
  buildSchoolOrganizationJsonLd,
} from "@/lib/schools/json-ld";
import {
  getAllSchoolIds,
  getSchoolById,
  getSeoSummaryText,
} from "@/lib/schools/load";
import { createPageMetadata } from "@/lib/page-metadata";
import { buildBreadcrumbJsonLd } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site";

type PageProps = {
  params: Promise<{ id: string }>;
};

/** 100% SSG：掃描 `src/data/schools/*.json` 預渲染全部詳情頁。 */
export function generateStaticParams() {
  return getAllSchoolIds().map((id) => ({ id }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const school = getSchoolById(id);
  if (!school) {
    return createPageMetadata({
      title: `找不到學校 | ${SITE_NAME}`,
      description: "此學校頁面不存在。",
      path: `/schools/${id}`,
      robots: { index: false, follow: false },
    });
  }

  const insight = getSeoSummaryText(school.seo_summary);
  const description =
    insight.slice(0, 155) ||
    `${school.name_zh}${school.name_en ? `（${school.name_en}）` : ""}升學資訊：校網、資助類別、面試題庫與升中派位表現。`;

  return createPageMetadata({
    title: `${school.name_zh}｜小學升學資訊 | ${SITE_NAME}`,
    description,
    path: `/schools/${id}`,
    keywords: [
      school.name_zh,
      school.name_en ?? "",
      school.school_net ? `校網${school.school_net}` : "",
      school.finance_type ?? "",
      "香港小學",
      "K3 選小學",
      "面試題",
    ].filter(Boolean),
  });
}

export default async function SchoolDetailPage({ params }: PageProps) {
  const { id } = await params;
  const school = getSchoolById(id);
  if (!school) notFound();

  const path = `/schools/${id}`;
  const orgLd = buildSchoolOrganizationJsonLd(school, path);
  const faqLd = buildSchoolFaqJsonLd(school);

  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "首頁", path: "/" },
          { name: "選小學", path: "/schools" },
          { name: school.name_zh, path },
        ])}
      />
      <JsonLd data={orgLd} />
      {faqLd ? <JsonLd data={faqLd} /> : null}
      <SchoolDetailView school={school} />
    </>
  );
}
