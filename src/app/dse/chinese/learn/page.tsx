import type { Metadata } from "next";
import Link from "next/link";
import ChinesePaperDrill from "@/components/dse/chinese-paper-drill";
import { JsonLd } from "@/components/seo/json-ld";
import {
  CHINESE_PAPER_SKILLS,
  getChineseCardsForText,
  getChineseLearningCards,
  getChinesePaperDrills,
} from "@/lib/dse/chinese-path";
import { CHINESE_PRESCRIBED_TEXTS, textHref } from "@/lib/dse/texts";
import { createPageMetadata } from "@/lib/page-metadata";
import { buildBreadcrumbJsonLd, buildCourseJsonLd, buildFaqJsonLd, type FaqItem } from "@/lib/seo";
import { HKEAA_URL, LEGAL_DISCLAIMER, SITE_NAME, SITE_URL } from "@/lib/site";

const PATH = "/dse/chinese/learn";
const CARD_COUNT = getChineseLearningCards().length;
const DRILL_COUNT = getChinesePaperDrills().length;

export const metadata: Metadata = createPageMetadata({
  title: `DSE 中文自學路徑：篇章學習卡、閱讀、寫作、說話 | ${SITE_NAME}`,
  description: `十二篇指定篇章，每篇 5 張學習卡。呢頁仲有跨篇章 ${getChinesePaperDrills("cross-passage").length} 題、閱讀 ${getChinesePaperDrills("reading").length} 題、寫作 ${getChinesePaperDrills("writing").length} 題、說話 ${getChinesePaperDrills("speaking").length} 題。全部係原創練習，唔係考評局試題。`,
  path: PATH,
  keywords: [
    "DSE 中文 自學",
    "DSE 中文 跨篇章",
    "DSE 中文 閱讀",
    "DSE 中文 寫作",
    "DSE 中文 說話",
    "指定範文 學習卡",
  ],
});

const FAQS: FaqItem[] = [
  {
    question: "學習卡同原本嘅閃卡有咩分別？",
    answer: `閃卡仍然係每篇 60 題選擇練習。呢頁每篇再加 5 張學習卡，分別處理字詞、章旨、手法、比較同答題，一共 ${CARD_COUNT} 張。`,
  },
  {
    question: "呢啲係咪考評局試題？",
    answer: "唔係。學習卡同練習都係原創教材，冇收錄歷屆試卷原文。考試範圍同評分以考評局最新公佈為準。",
  },
  {
    question: "練習使唔使登入？",
    answer: "唔使。呢頁嘅作答只留喺你呢次瀏覽，唔會上傳。",
  },
];

export default function ChineseLearnPage() {
  const drills = getChinesePaperDrills();

  return (
    <div className="mx-auto max-w-3xl">
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "首頁", path: "/" },
          { name: "DSE 備考", path: "/dse" },
          { name: "中國語文", path: "/dse/chinese" },
          { name: "自學路徑", path: PATH },
        ])}
      />
      <JsonLd
        data={buildCourseJsonLd({
          name: "DSE 中文自學路徑",
          description: `指定篇章學習卡 ${CARD_COUNT} 張，閱讀、寫作、說話同跨篇章練習 ${DRILL_COUNT} 題。`,
          url: `${SITE_URL}${PATH}`,
        })}
      />
      <JsonLd data={buildFaqJsonLd(FAQS)} />

      <nav className="mb-6 text-sm text-slate-500">
        <Link href="/dse" className="hover:text-blue-700">
          DSE
        </Link>
        <span className="mx-2">›</span>
        <Link href="/dse/chinese" className="hover:text-blue-700">
          中文
        </Link>
        <span className="mx-2">›</span>
        <span className="text-slate-700">自學路徑</span>
      </nav>

      <h1 className="font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
        DSE 中文自學路徑
      </h1>
      <p className="mt-3 text-[15px] leading-relaxed text-slate-700 sm:text-base">
        十二篇指定篇章，每篇 5 張學習卡，先搞掂字詞、章旨、手法、比較同答題。跟住喺呢頁練跨篇章、閱讀、寫作同說話。
        呢啲全部係原創練習，唔係考評局試題。
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {[
          { label: "篇章", value: `${CHINESE_PRESCRIBED_TEXTS.length}` },
          { label: "學習卡", value: `${CARD_COUNT}` },
          { label: "練習題", value: `${DRILL_COUNT}` },
        ].map((item) => (
          <div key={item.label} className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-lg">
            <p className="text-[10px] font-semibold tracking-[0.2em] text-slate-500 uppercase">{item.label}</p>
            <p className="mt-1 font-[family-name:var(--font-display)] text-2xl font-extrabold text-slate-900">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <section className="mt-10 space-y-4">
        <h2 className="text-xl font-bold text-slate-900">篇章學習卡</h2>
        {CHINESE_PRESCRIBED_TEXTS.map((text) => {
          const cards = getChineseCardsForText(text.slug);
          return (
            <details key={text.slug} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg">
              <summary className="cursor-pointer font-semibold text-slate-900">
                {text.title}
                <span className="ml-2 text-sm font-normal text-slate-500">{text.source} · {cards.length} 張</span>
              </summary>
              <p className="mt-3 text-sm">
                <Link href={textHref(text.slug)} className="font-semibold text-blue-700">
                  去呢篇嘅閃卡練習
                </Link>
              </p>
              <ol className="mt-4 space-y-4">
                {cards.map((card) => (
                  <li key={card.id} className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold text-blue-700">
                      {card.focus} · {card.id}
                    </p>
                    <p className="mt-1 font-medium text-slate-900">{card.prompt}</p>
                    <p className="mt-2 text-sm leading-relaxed text-slate-700">{card.answer}</p>
                    <p className="mt-2 text-sm leading-relaxed text-amber-900">易錯：{card.trap}</p>
                  </li>
                ))}
              </ol>
            </details>
          );
        })}
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-slate-900">閱讀、寫作、說話練習</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          {CHINESE_PAPER_SKILLS.map((skill) => `${skill.title} ${getChinesePaperDrills(skill.id).length} 題`).join(" · ")}
          。揀一個範圍，答完先交。
        </p>
        <div className="mt-4">
          <ChinesePaperDrill questions={drills} />
        </div>
      </section>

      <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-bold text-slate-900">常見問題</h2>
        <div className="mt-4 space-y-4">
          {FAQS.map((item) => (
            <div key={item.question}>
              <h3 className="text-sm font-semibold text-slate-900">{item.question}</h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <p className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs leading-relaxed text-slate-500">
        {LEGAL_DISCLAIMER}課程範圍及評分準則以{" "}
        <a
          href={HKEAA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-blue-700 underline underline-offset-2"
        >
          考評局官網
        </a>{" "}
        為準。
      </p>
    </div>
  );
}
