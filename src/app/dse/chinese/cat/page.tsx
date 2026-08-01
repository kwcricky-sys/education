import { CatApp } from "@/components/dse/cat/cat-app";
import { JsonLd } from "@/components/seo/json-ld";
import { createPageMetadata } from "@/lib/page-metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd } from "@/lib/seo";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";

const PATH = "/dse/chinese/cat";

export const metadata = createPageMetadata({
  title: `DSE 中文指定範文自適應診斷測驗（CAT）| ${SITE_NAME}`,
  description: `${SITE_NAME}｜${SITE_TAGLINE}。電腦化自適應測驗（CAT）：依答題表現動態調整難度，產出 DSE 等級估算、能力雷達與弱點檢討。`,
  path: PATH,
  keywords: [
    "DSE CAT",
    "自適應測驗",
    "中文指定範文",
    "能力診斷",
    "DSE 等級預測",
    "弱點分析",
  ],
});

const faqs = [
  {
    question: "什麼是自適應測驗（CAT）？",
    answer:
      "系統會依你上一題的對錯與當前能力估算，動態選擇下一題難度（基礎／中等／高階），用較少題數更準確地診斷能力與弱點。",
  },
  {
    question: "一次測驗會出多少題？",
    answer:
      "預設約 15–20 題。若能力值已趨於穩定，可能在不少於 15 題時提早結束。",
  },
  {
    question: "預測等級是否等於正式 DSE 成績？",
    answer:
      "不是。此為練習導向的估算，供備考參考；正式成績以考評局評核為準。",
  },
];

export default function CatPage() {
  return (
    <>
      <JsonLd data={buildFaqJsonLd(faqs)} />
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "首頁", path: "/" },
          { name: "DSE 備考", path: "/dse" },
          { name: "中國語文", path: "/dse/chinese" },
          { name: "自適應測驗", path: PATH },
        ])}
      />
      <CatApp />
    </>
  );
}
