import { CatApp } from "@/components/dse/cat/cat-app";
import { JsonLd } from "@/components/seo/json-ld";
import { createPageMetadata } from "@/lib/page-metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site";

const PATH = "/dse/chinese/cat";

export const metadata = createPageMetadata({
  title: `全港首創 DSE 中文範文 CAT 診斷室｜免費替代盲目補習 | ${SITE_NAME}`,
  description: `唔使先交 DSE 補習學費：${SITE_NAME} 範文 AI 診斷室用自適應演算法約 15 題測出預測等級與知識盲區，配合 12 篇指定範文閃卡極速溫習。`,
  path: PATH,
  keywords: [
    "DSE 補習",
    "DSE 範文 AI 診斷室",
    "自適應診斷",
    "CAT",
    "中文指定範文",
    "DSE 等級預測",
    "免費 DSE 溫習",
    "動態適應演算法",
  ],
});

const faqs = [
  {
    question: "什麼是「自適應診斷」？和普通刷題有何分別？",
    answer:
      "普通刷題要你做完大量重複題。自適應診斷會「看人出題」：答對推高難度、答錯降至基礎，約 15–20 題就能估算 DSE 等級並找出弱點，全程在瀏覽器本地運行。",
  },
  {
    question: "一次診斷會出多少題？",
    answer:
      "預設約 15–20 題。若演算法判斷能力值已穩定，可能在不少於 15 題時提早結束。",
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
          { name: "範文 AI 診斷室", path: PATH },
        ])}
      />
      <CatApp />
    </>
  );
}
