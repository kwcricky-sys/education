import { PortfolioBuilder } from "@/components/portfolio/portfolio-builder";
import { createPageMetadata } from "@/lib/page-metadata";
import { SITE_NAME } from "@/lib/site";

export const metadata = createPageMetadata({
  title: `小一入學 Portfolio 編輯器｜直私／叩門 A4 PDF | ${SITE_NAME}`,
  description: `名校簡約、全人發展、叩門 2 頁罐頭模板；相片自動裁入圖框，300 DPI 高清 PDF，瀏覽器本地生成（0 API）。`,
  path: "/portfolio-builder",
  keywords: [
    "小一 Portfolio",
    "叩門",
    "直資小學",
    "私立小學",
    "A4 PDF",
    "面試",
  ],
});

export default function PortfolioBuilderPage() {
  return <PortfolioBuilder />;
}
