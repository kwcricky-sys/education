import type { Metadata } from "next";
import Link from "next/link";
import ChineseUnitMap from "@/components/dse/chinese-unit-map";
import { JsonLd } from "@/components/seo/json-ld";
import {
  CHINESE_HUB_LINKS,
  CHINESE_PASS_MARK,
  CHINESE_SET_SIZE,
  CHINESE_TEXT_DEEPLINKS,
  CHINESE_UNITS,
} from "@/lib/dse/chinese-path";
import { createPageMetadata } from "@/lib/page-metadata";
import {
  buildBreadcrumbJsonLd,
  buildCourseJsonLd,
  buildFaqJsonLd,
  type FaqItem,
} from "@/lib/seo";
import { LEGAL_DISCLAIMER, SITE_NAME, SITE_URL } from "@/lib/site";

const PATH = "/dse/chinese/learn";
const LESSON_COUNT = CHINESE_UNITS.reduce((count, unit) => count + unit.lessonIds.length, 0);
const PRACTICE_COUNT = CHINESE_UNITS.length * CHINESE_SET_SIZE;

export const metadata: Metadata = createPageMetadata({
  title: `DSE 中文科自學路徑：範文導讀到錯題回練 | ${SITE_NAME}`,
  description: `免費 HKDSE 中國語文自學路徑：${CHINESE_UNITS.length} 個單元、${LESSON_COUNT} 課，由字詞、句意、段旨、手法、主題，到跨篇比較、閱讀策略、寫作與說話，再到錯題回練。每單元 ${CHINESE_SET_SIZE} 題，答對 ${CHINESE_PASS_MARK} 題過關。自編內容，非考評局試題。`,
  path: PATH,
  keywords: [
    "DSE 中文 自學",
    "DSE 中文科 溫習",
    "指定範文 導讀",
    "DSE 閱讀策略",
    "DSE 寫作 審題",
    "DSE 說話",
  ],
});

const FAQS: FaqItem[] = [
  {
    question: "這條中文科自學路徑要付費嗎？",
    answer: "不用。十二個單元的課文與練習都免費開放，不需要註冊。",
  },
  {
    question: "怎樣才算通過一個單元？",
    answer: `每個單元先讀課，再做 ${CHINESE_SET_SIZE} 題自編選擇題。答對 ${CHINESE_PASS_MARK} 題或以上即通過，並解鎖下一單元。全路徑共 ${PRACTICE_COUNT} 題。`,
  },
  {
    question: "學習進度會上傳嗎？",
    answer:
      "不會。進度只記在這部裝置的瀏覽器儲存，不需登入，也不會寫入其他產品的進度。清除瀏覽器資料就會重置。",
  },
  {
    question: "這些是考評局試題或指定範文原文嗎？",
    answer:
      "不是。課文、例子與題目均為本站自編，用來練字詞、句意、段旨、手法、主題、閱讀、寫作與說話策略。正式範圍與評分以考評局最新公布為準。指定範文請用站內閃卡，本路徑不收錄原文。",
  },
];

export default function ChineseLearnPage() {
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
          name: "DSE 中文科自學路徑",
          description: `HKDSE 中國語文 ${CHINESE_UNITS.length} 個單元：範文導讀、閱讀策略、寫作、說話與錯題回練，共 ${LESSON_COUNT} 課。`,
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
          中國語文
        </Link>
        <span className="mx-2">›</span>
        <span className="text-slate-700">自學路徑</span>
      </nav>

      <h1 className="font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
        DSE 中文科自學路徑
      </h1>
      <p className="mt-3 text-[15px] leading-relaxed text-slate-700 sm:text-base">
        {CHINESE_UNITS.length} 個單元、{LESSON_COUNT} 課，由範文導讀的字詞走到錯題回練。
        每個單元先讀課文，再做練習；
        <span className="font-semibold text-slate-900">
          答對 {CHINESE_PASS_MARK} 題或以上（{CHINESE_SET_SIZE} 題中）
        </span>
        就通過關卡，解鎖下一單元。進度只存在你自己的裝置。
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {[
          { label: "單元", value: `${CHINESE_UNITS.length}`, tone: "text-blue-700" },
          { label: "課文", value: `${LESSON_COUNT}`, tone: "text-slate-900" },
          { label: "練習題", value: `${PRACTICE_COUNT}`, tone: "text-gold-ink" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-lg"
          >
            <p className="text-[10px] font-semibold tracking-[0.2em] text-slate-500 uppercase">
              {stat.label}
            </p>
            <p
              className={`mt-1 font-[family-name:var(--font-display)] text-2xl font-extrabold ${stat.tone}`}
            >
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
        <p className="text-sm font-semibold text-blue-700">路徑與深鏈</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-slate-700">
          <li>單元由淺到深：U01 起可以立即練習，通過後才解開下一單元。</li>
          <li>
            單元 6 比較站內範文，不貼原文。入口：
            <Link href="/dse/chinese" className="mx-1 font-semibold text-blue-700 underline">
              指定範文
            </Link>
          </li>
          <li>
            單元 12 把錯題送回對應單元，並連到
            {CHINESE_HUB_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="mx-1 font-semibold text-blue-700 underline"
              >
                {link.label}
              </Link>
            ))}
          </li>
        </ul>
        <ul className="mt-3 grid gap-1 sm:grid-cols-2">
          {CHINESE_TEXT_DEEPLINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="text-sm text-blue-700 underline">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8">
        <ChineseUnitMap />
      </div>

      <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-slate-900">
          常見問題
        </h2>
        <div className="mt-4 space-y-4">
          {FAQS.map((faq) => (
            <div key={faq.question}>
              <h3 className="text-sm font-semibold text-slate-900">{faq.question}</h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/dse/chinese"
          className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:border-blue-700/40 hover:text-blue-600"
        >
          指定範文閃卡
        </Link>
        <Link
          href="/dse/chinese/cat"
          className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:border-blue-700/40 hover:text-blue-600"
        >
          範文 AI 診斷室
        </Link>
        <Link
          href="/dse/chinese/error-notebook"
          className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:border-blue-700/40 hover:text-blue-600"
        >
          錯題本
        </Link>
      </div>

      <p className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs leading-relaxed text-slate-500">
        {LEGAL_DISCLAIMER}
        本路徑的課文、例子與練習由本站自行編寫，非考評局教材，不收錄指定範文原文，亦不保證考試成績。
      </p>
    </div>
  );
}
