import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SchoolsDirectory } from "@/components/schools/schools-directory";
import { JsonLd } from "@/components/seo/json-ld";
import { getSchoolsSummary } from "@/lib/schools/load";
import { createPageMetadata } from "@/lib/page-metadata";
import { buildBreadcrumbJsonLd } from "@/lib/seo";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";

export const metadata = createPageMetadata({
  title: `香港小學一覽｜K3 選小學 | ${SITE_NAME}`,
  description: `${SITE_NAME}｜${SITE_TAGLINE}。按校網、資助類別、性別篩選全港小學，查看面試題庫與升中派位資訊。`,
  path: "/schools",
  keywords: [
    "香港小學",
    "K3 選小學",
    "校網",
    "直資小學",
    "私立小學",
    "小一面試",
  ],
});

export default function SchoolsPage() {
  const schools = getSchoolsSummary();

  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "首頁", path: "/" },
          { name: "選小學", path: "/schools" },
        ])}
      />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 transition hover:text-sky-700"
        >
          <ArrowLeft className="size-3.5" />
          返回首頁
        </Link>

        <header className="mt-6 max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.18em] text-sky-600 uppercase">
            K3 選小學
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            香港小學一覽
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
            即時按校網、資助類別與性別篩選；點進學校頁可看面試題庫、升中去向與報名
            Timeline。
          </p>
        </header>

        <div className="mt-8">
          {schools.length === 0 ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
              <p className="font-semibold">尚未載入學校數據</p>
              <p className="mt-2 leading-relaxed">
                請將 Hermes 產出的{" "}
                <code className="rounded bg-white px-1.5 py-0.5 text-xs">
                  schools_summary.json
                </code>{" "}
                放到{" "}
                <code className="rounded bg-white px-1.5 py-0.5 text-xs">
                  src/data/schools_summary.json
                </code>
                ，並把各校詳情 JSON 放到{" "}
                <code className="rounded bg-white px-1.5 py-0.5 text-xs">
                  src/data/schools/
                </code>
                （支援 <code className="text-xs">1.json</code> 或{" "}
                <code className="text-xs">school_1.json</code>）。
              </p>
            </div>
          ) : (
            <SchoolsDirectory schools={schools} />
          )}
        </div>
      </div>
    </>
  );
}
