import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CompareTool from "@/components/jupas/compare-tool";
import { JsonLd } from "@/components/seo/json-ld";
import { createPageMetadata } from "@/lib/page-metadata";
import { buildBreadcrumbJsonLd } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site";
import { PROGRAMMES, UGC_CATEGORY_SALARIES } from "@/lib/jupas/programmes";

export const metadata = createPageMetadata({
  title: `JUPAS 課程比較工具｜揀 2–3 科並排對比 + 估入學組合（穩入／有機／陪跑）| ${SITE_NAME}`,
  description:
    "輸入預計最佳 5 科總分，揀選最多 3 個 JUPAS 課程並排比較：2025 收生中位數、四分位、公開入職薪酬、效益比，並用中位數 ± 四分位估算穩入／有機／陪跑及 Band A 排位建議。",
  path: "/dse/jupas/compare",
  keywords: [
    "JUPAS 課程比較",
    "JUPAS 收生分數比較",
    "JUPAS 入學機會",
    "穩入 有機 陪跑",
    "Band A 排位",
    "DSE 選科工具",
  ],
});

export default function ComparePage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "DSE 備考", path: "/dse" },
          { name: "JUPAS 揀科指南", path: "/dse/jupas" },
          { name: "課程比較工具", path: "/dse/jupas/compare" },
        ])}
      />

      <header className="max-w-3xl">
        <Link
          href="/dse/jupas"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 transition hover:text-blue-600"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> 返回 JUPAS 揀科指南
        </Link>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl">
          JUPAS 課程比較工具
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
          唔好靠感覺揀科。輸入你嘅預計成績，揀 2–3 個課程，即刻睇到收生分數、公開入職薪酬、
          效益比同入學機會估算並排對照。所有收生分數係院校公布數據經正規化嘅
          <span className="text-slate-700">入學分數指數（0–7）</span>。
        </p>
      </header>

      <div className="mt-8">
        <CompareTool />
      </div>

      <section className="mt-10 rounded-2xl bg-white p-5 ring-1 ring-slate-200">
        <h2 className="text-sm font-semibold text-slate-700">免責聲明</h2>
        <p className="mt-2 text-xs leading-relaxed text-slate-500">
          本工具涵蓋 {PROGRAMMES.length} 個代表性課程，收生分數為 2025 年入學數據，薪酬數據來自
          醫管局／政府總薪級表及教資會 2024/25 學年畢業生就業調查，並以學科大類
          （{UGC_CATEGORY_SALARIES.map((c) => c.label).join("、")}）形式呈現。
          「穩入／有機／陪跑」係根據 2025 年收生中位數及四分位推算嘅粗略估算，
          並無考慮面試表現、Band A 排序、科目比重、額外加分及學生學習概覽等因素，
          與實際遴選結果並無必然關係。所有資料只供參考，並非官方資料。JUPAS 及各大學之官方公布為準。
        </p>
      </section>
    </div>
  );
}
