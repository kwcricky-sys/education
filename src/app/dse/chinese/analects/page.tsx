import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AnalectsStudyHub } from "@/components/dse/analects-study-hub";
import { JsonLd } from "@/components/seo/json-ld";
import { analectsQuiz } from "@/lib/dse/analects";
import { createPageMetadata } from "@/lib/page-metadata";
import {
  buildBreadcrumbJsonLd,
  buildCourseJsonLd,
  buildFaqJsonLd,
} from "@/lib/seo";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const PAGE_PATH = "/dse/chinese/analects";
const PAGE_TITLE = `DSE 中文卷一範文《論語》60題三階極速刷題庫與閃卡 | ${SITE_NAME}`;
const PAGE_DESCRIPTION =
  "免費線上 DSE 中文範文《論語》（論仁、論孝、論君子）60 題極速閃卡刷題庫。涵蓋字詞釋義、通假字、句譯與考評局 Marking 邏輯，沉浸式免費備考。";

export const metadata = createPageMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  path: PAGE_PATH,
  keywords: [
    "DSE 論語",
    "論仁論孝論君子",
    "DSE 中文 閃卡",
    "指定範文",
    "文言刷題",
    "考評局",
  ],
});

const faqs = [
  {
    question: "這 60 題涵蓋哪些範圍？",
    answer:
      "題庫圍繞指定範文《論語》「論仁、論孝、論君子」三組語錄，類型包括字詞釋義、通假字、句譯、文意理解與考評標示，並分為基礎／中等／高階三級，方便分層操練。",
  },
  {
    question: "閃卡模式與題目總覽有何分別？",
    answer:
      "極速閃卡模式一次一題，支援 Space 翻牌與方向鍵切換，並可標記記錯／記牢；題目總覽以清單呈現全部題目，可快速跳轉到指定閃卡。",
  },
  {
    question: "答案與解析是否等同考評局官方？",
    answer:
      "解析以常見 DSE 答題要點與 Marking 邏輯整理，供備考練習參考，並非考評局官方試卷或評卷準則全文。正式應試請以考評局公布文件為準。",
  },
  {
    question: "可以篩選難度嗎？",
    answer:
      "可以。頂部提供「全部／基礎／中等／高階」篩選，進度條會按當前篩選後的題數重新計算。",
  },
  {
    question: "資料會上傳伺服器嗎？",
    answer:
      "不會。刷題進度、記錯與記牢計數僅留在你的瀏覽器 Session，重整頁面後會重置；題庫本身為靜態 JSON，於本機載入。",
  },
];

export default function AnalectsPage() {
  return (
    <div className="space-y-12">
      <JsonLd data={buildFaqJsonLd(faqs)} />
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "首頁", path: "/" },
          { name: "DSE 備考", path: "/dse" },
          { name: "中國語文", path: "/dse/chinese" },
          { name: "論語", path: PAGE_PATH },
        ])}
      />
      <JsonLd
        data={buildCourseJsonLd({
          name: analectsQuiz.meta.title,
          description: PAGE_DESCRIPTION,
          url: `${SITE_URL}${PAGE_PATH}`,
        })}
      />

      <div>
        <Link
          href="/dse/chinese"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 transition hover:text-teal-300"
        >
          <ArrowLeft className="size-3.5" />
          指定範文列表
        </Link>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">
          《論語》論仁、論孝、論君子
        </h1>
        <p className="mt-2 text-sm text-zinc-500 sm:text-base">
          {analectsQuiz.meta.paper} · {analectsQuiz.meta.total}{" "}
          題三階極速閃卡 · {SITE_NAME} DSE 學習區
        </p>
      </div>

      <AnalectsStudyHub questions={analectsQuiz.questions} />

      <article className="space-y-10 border-t border-zinc-800 pt-12 text-base leading-relaxed text-zinc-400">
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-zinc-100">
            《論語》DSE 答題技巧：三階操練怎麼用？
          </h2>
          <p>
            《論語》「論仁、論孝、論君子」是 DSE
            中文卷一指定文言經典的高頻考核範圍。答題時最常見失分，不是「背不到原文」，而是未能按考評局要求寫出準確釋義、通假對應與文意因果。建議先用本頁「基礎」題打通字詞與通假（如「說」通「悅」、「女」通「汝」），再用「中等」題練習句譯——句譯宜「信、達」並重：關鍵實詞不可漏，語序要化成通順白話，但不必過度增飾。進入「高階」時，重點轉為文意理解與考評標示：例如「克己復禮」須同時點出約束私欲與復歸禮制；「父母唯其疾之憂」要分清主語與憂之對象；君子相關章句則常考對比（君子／小人、義／利、坦蕩／長戚戚）。把每一條語錄想成「得分清單」，比死記單一標準句更穩妥。
          </p>
          <p>
            實戰節奏可採短循環：每輪 10–15
            題，先自己心答再翻牌核對解析；若標記「記錯」，下一輪只重刷記錯卡，直到轉為「記牢」。閱讀解析時，留意「給分點」用語——考評局往往要求「須指出……才給分」「只答一半則半分」，把這些條件寫進自己的筆記。亦可用題目總覽按主題（仁／孝／君子）掃一遍，找出最弱的語錄簇，集中補強。應試時先審題幹動詞：問「釋義」就勿寫成翻譯；問「翻譯」就勿只釋單字；問「說明道理」就要扣緊章旨，避免空泛道德口號。指定範文考核重視準確與完整，而非華麗文筆；能在有限字數內寫齊得分點，就是高分關鍵。
          </p>
          <p>
            進階複習可採「原文—關鍵字—白話—得分點」四欄筆記：原文抄短句，關鍵字標通假與多義，白話用自己的話說一遍，得分點則用條列寫「必須出現的概念」。考前一週改以閃卡極速模式壓測反應，每天兩輪、每輪二十題，專注把記錯卡清零。若遇相似章句（例如多則「問仁」「問孝」），先辨問者與答法差異，再比較孔子側重：有時重「行」，有時重「敬」，有時重「禮」，答題必須對應語境，不能一套答案打天下。亦可把易混字詞做成對照表（如「敬」與「養」、「恥」與「不恥」），考場上可減少張冠李戴。完成《論語》後，可回到中文科頁面追蹤其餘指定範文上線進度，逐步建立完整文言題感。
          </p>
          <p>
            最後提醒：本刷題庫為 {SITE_NAME}{" "}
            學習專區之練習材料，解析綜合常見備考要點整理，方便沉浸式複習；正式公開試請以考評局最新課程、樣本試卷及評卷參考為準。善用鍵盤快捷鍵（Space
            翻牌、方向鍵切換）可提高單位時間題量，讓複習更接近真正「刷題」節奏，而不是被動重讀筆記。
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-zinc-100">常見問題 FAQ</h2>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <div
                key={faq.question}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5"
              >
                <h3 className="text-base font-semibold text-zinc-100">
                  {faq.question}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>
      </article>
    </div>
  );
}
