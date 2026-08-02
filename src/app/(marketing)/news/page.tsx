import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LatestNewsCards } from "@/components/news/latest-news-cards";
import { getLatestSchoolNews } from "@/lib/news/fetch-news";
import { createPageMetadata } from "@/lib/page-metadata";
import { SITE_NAME } from "@/lib/site";

export const metadata = createPageMetadata({
  title: `最新直私報名情報 | ${SITE_NAME}`,
  description: `每日更新直資／私立小學報名、簡介會與面試日期情報。`,
  path: "/news",
  keywords: ["直資小學", "私立小學", "小一報名", "簡介會", "面試日期"],
});

export default async function NewsPage() {
  const { items } = await getLatestSchoolNews(24);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-sky-700"
      >
        <ArrowLeft className="size-3.5" />
        返回首頁
      </Link>

      <header className="mt-6 max-w-2xl">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-extrabold text-slate-900">
          最新直私報名情報
        </h1>
      </header>

      <div className="mt-6">
        <LatestNewsCards items={items} showViewAll={false} showHeading={false} />
      </div>
    </div>
  );
}
