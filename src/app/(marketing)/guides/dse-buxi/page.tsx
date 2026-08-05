import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { createPageMetadata } from "@/lib/page-metadata";
import {
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  type FaqItem,
} from "@/lib/seo";
import { SITE_KEYWORDS, SITE_NAME } from "@/lib/site";

const PATH = "/guides/dse-buxi";

export const metadata = createPageMetadata({
  title: `DSE 補習邊間好？2026 推薦前必睇｜免費自習工具比較 | ${SITE_NAME}`,
  description:
    "搜尋「DSE 補習推薦」「DSE 補習價錢」前，先了解補習班、補習社同免費 AI 溫習工具點揀。DSE.hack 提供 CAT 自適應診斷與 12 篇範文閃卡，幫你用最低成本找盲點。",
  path: PATH,
  keywords: [...SITE_KEYWORDS],
});

const faqs: FaqItem[] = [
  {
    question: "DSE 補習邊間好？一定要報補習班嗎？",
    answer:
      "「邊間好」取決於你的弱科、時間表同預算。若目標只是找出盲點、穩定刷指定範文，可先用免費自適應診斷同閃卡（例如 DSE.hack）建立底子，再決定是否需要補習社或一對一。",
  },
  {
    question: "DSE 補習價錢大概幾多？有冇更平的替代方案？",
    answer:
      "香港 DSE 補習班／補習社收費差異大，常見由每堂數百至過千元不等。若預算緊絀，可先用免費線上工具做診斷與範文記憶，把學費集中投放在真正弱的範疇。",
  },
  {
    question: "DSE 補習推薦：補習社同 AI 溫習工具有何分別？",
    answer:
      "補習社提供課堂節奏與老師講解；AI／自適應工具則著重即時診斷、針對弱點出題與重複記憶。兩者可並行：工具負責定位盲點，補習負責深度講解。",
  },
  {
    question: "英文科要報 DSE 補習英文嗎？中文科又如何？",
    answer:
      "英文與中文弱點類型不同。中文指定範文適合用閃卡＋CAT 診斷快速覆蓋字詞、語譯與考點陷阱；英文則視聽讀寫需要更多語料輸入。先診斷再決定補習科目，較慳錢。",
  },
];

const CHECKS = [
  "先診斷弱點，再決定補邊科／報邊間",
  "比較補習價錢時，計埋交通同時間成本",
  "指定範文可用免費閃卡極速溫習",
  "答題節奏不穩？用 CAT 自適應測評定位",
] as const;

export default function DseBuxiGuidePage() {
  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "首頁", path: "/" },
          { name: "DSE 補習指南", path: PATH },
        ])}
      />
      <JsonLd data={buildFaqJsonLd(faqs)} />

      <p className="text-xs font-semibold tracking-wide text-cyan-400">
        溫習指南 · 2026
      </p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight text-zinc-100 sm:text-4xl">
        DSE 補習邊間好？推薦前必睇嘅選擇指南
      </h1>
      <p className="mt-4 text-base leading-relaxed text-zinc-400">
        好多香港考生搜尋「DSE 補習推薦」「DSE
        補習價錢」「補習班／補習社邊間好」——但其實未診斷弱點就報班，容易浪費學費。本頁幫你用務實框架做決定，並介紹免費自習工具可如何補位。
      </p>

      <section className="mt-10 space-y-3">
        <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-zinc-100">
          報 DSE 補習前的 4 個檢查清單
        </h2>
        <ul className="space-y-2">
          {CHECKS.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2.5 rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm leading-relaxed text-zinc-300"
            >
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-cyan-400" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-zinc-100">
          補習班／補習社 vs 免費 AI 溫習工具
        </h2>
        <div className="overflow-hidden rounded-xl border border-white/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-900 text-zinc-400">
              <tr>
                <th className="px-4 py-3 font-medium">比較</th>
                <th className="px-4 py-3 font-medium">補習社／補習班</th>
                <th className="px-4 py-3 font-medium">DSE.hack（免費工具）</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-zinc-300">
              <tr className="bg-zinc-950/40">
                <td className="px-4 py-3 text-zinc-400">價錢</td>
                <td className="px-4 py-3">按堂／按科收費</td>
                <td className="px-4 py-3">免費使用</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-zinc-400">強項</td>
                <td className="px-4 py-3">老師講解、課堂節奏</td>
                <td className="px-4 py-3">CAT 診斷、範文閃卡極速刷</td>
              </tr>
              <tr className="bg-zinc-950/40">
                <td className="px-4 py-3 text-zinc-400">最適合</td>
                <td className="px-4 py-3">需要系統講課、督促</td>
                <td className="px-4 py-3">想先找盲點、慳學費</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10 space-y-4 rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-6">
        <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-zinc-100">
          想慳補習學費？先用 DSE.hack 免費診斷
        </h2>
        <p className="text-sm leading-relaxed text-zinc-400">
          {SITE_NAME}{" "}
          提供全港考生可用的 AI CAT
          自適應評估，以及中文 12
          篇指定範文 Flashcards——唔使先交補習學費，也能開始精準溫習。
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/dse/chinese/cat"
            className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-2.5 text-sm font-bold text-zinc-950 transition-all duration-300 hover:bg-cyan-300"
          >
            免費開始 CAT 診斷
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/dse/chinese"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-zinc-200 transition-all duration-300 hover:border-cyan-500/40"
          >
            進入範文閃卡
          </Link>
        </div>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-zinc-100">
          常見問題
        </h2>
        <div className="space-y-3">
          {faqs.map((faq) => (
            <div
              key={faq.question}
              className="rounded-xl border border-white/10 bg-zinc-900 p-5"
            >
              <h3 className="font-semibold text-zinc-100">{faq.question}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      <p className="mt-10 text-xs leading-relaxed text-zinc-500">
        本頁僅提供溫習策略參考，並非個別補習社評分或招生廣告。正式考試內容請以考評局公布為準。
      </p>
    </article>
  );
}
