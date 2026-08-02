import { CalculatorApp } from "@/components/calculator/calculator-app";
import { JsonLd } from "@/components/seo/json-ld";
import { getSchoolsSummary } from "@/lib/schools/load";
import { createPageMetadata } from "@/lib/page-metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site";

export const metadata = createPageMetadata({
  title: `小一大抽獎機率計算器｜選校 Match | ${SITE_NAME}`,
  description: `輸入校網、自行分配分數與選校風格，即時估算成功率，並取得廣東話個人化備戰建議（0 AI Token）。`,
  path: "/calculator",
  keywords: [
    "小一派位",
    "自行分配學位",
    "派位成功率",
    "校網",
    "K3 選小學",
  ],
});

export default function CalculatorPage() {
  const schools = getSchoolsSummary();
  const schoolNets = [
    ...new Set(
      schools
        .map((s) => s.school_net)
        .filter((n): n is string => Boolean(n)),
    ),
  ].sort((a, b) => Number(a) - Number(b) || a.localeCompare(b));

  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "首頁", path: "/" },
          { name: "派位計算器", path: "/calculator" },
        ])}
      />
      <JsonLd
        data={buildFaqJsonLd([
          {
            question: "小一自行分配成功率點樣計？",
            answer:
              "本站用規則引擎：基礎派位率（按 15／20／25 分）× 性別爆額修正 × 準備／位次策略，全程 0 AI Token，結果僅供參考。",
          },
          {
            question: "報告準唔準？",
            answer:
              "屬估算工具，唔等於教育局或學校官方結果。實際受每年申請人數、計分辦法同抽籤影響。",
          },
        ])}
      />
      <CalculatorApp schools={schools} schoolNets={schoolNets} />
    </>
  );
}
