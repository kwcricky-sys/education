import type { Metadata } from "next";
import Link from "next/link";
import EnglishUnitMap from "@/components/dse/english-unit-map";
import { JsonLd } from "@/components/seo/json-ld";
import { ENGLISH_UNITS } from "@/lib/dse/english-path";
import { createPageMetadata } from "@/lib/page-metadata";
import {
  buildBreadcrumbJsonLd,
  buildCourseJsonLd,
  buildFaqJsonLd,
  type FaqItem,
} from "@/lib/seo";
import { LEGAL_DISCLAIMER, SITE_NAME, SITE_URL } from "@/lib/site";
import lessons from "@/data/dse/english-lessons.json";

const PATH = "/dse/english/learn";
const LESSON_COUNT = Object.keys(
  lessons as Record<string, { unit: number }>,
).length;
const PRACTICE_COUNT = ENGLISH_UNITS.length * 10;

export const metadata: Metadata = createPageMetadata({
  title: `DSE English 自學路徑：由零開始的英文課程 | ${SITE_NAME}`,
  description: `免費 HKDSE 英文自學課程：10 個單元、${LESSON_COUNT} 課，涵蓋卷一閱讀、卷二寫作、卷三聆聽及綜合、卷四說話、語法與詞彙。每課有考評局評卷重心分析、示範例子、常見陷阱，通過練習（≥7/10）才解鎖下一單元。`,
  path: PATH,
  keywords: [
    "DSE English 自學",
    "dse english 課程",
    "dse english reading 技巧",
    "dse english writing 格式",
    "dse english 聆聽 綜合",
    "dse english speaking 技巧",
    "hkdse english 溫習",
  ],
});

const FAQS: FaqItem[] = [
  {
    question: "這個 DSE English 自學路徑是免費的嗎？",
    answer: "是。全部單元、課文與練習都免費開放，唔需要註冊帳號。",
  },
  {
    question: "課程有幾多個單元與練習題？",
    answer: `共 ${ENGLISH_UNITS.length} 個單元、${LESSON_COUNT} 課，覆蓋卷一閱讀、卷二寫作、卷三聆聽及綜合、卷四說話，以及語法與詞彙基礎。每個單元的練習關卡有 10 條題目（合共 ${PRACTICE_COUNT} 條），答對 7 條或以上即可解鎖下一個單元。`,
  },
  {
    question: "學習進度會上傳嗎？",
    answer:
      "唔會。進度只儲存在你瀏覽器的本機儲存（localStorage），唔會上傳，亦唔需要登入。清除瀏覽器資料就會重置進度。",
  },
  {
    question: "這些內容是考評局的官方教材嗎？",
    answer:
      "唔是。單元內容是根據公開的考評局評核框架與評卷方式整理的分析與教學建議，供溫習參考；正式考試範圍與評分標準請以考評局的最新公佈為準。",
  },
];

export default function EnglishLearnPage() {
  const courseJsonLd = buildCourseJsonLd({
    name: "DSE English 自學路徑（由零開始）",
    description: `HKDSE 英文科 10 個單元的自學課程：閱讀、寫作、聆聽及綜合、說話、語法與詞彙，共 ${LESSON_COUNT} 課，每單元附練習關卡。`,
    url: `${SITE_URL}${PATH}`,
  });

  return (
    <div className="mx-auto max-w-3xl">
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "首頁", path: "/" },
          { name: "DSE 備考", path: "/dse" },
          { name: "English", path: "/dse/english" },
          { name: "自學路徑", path: PATH },
        ])}
      />
      <JsonLd data={courseJsonLd} />
      <JsonLd data={buildFaqJsonLd(FAQS)} />

      <nav className="mb-6 text-sm text-zinc-500">
        <Link href="/dse" className="hover:text-cyan-400">
          DSE
        </Link>
        <span className="mx-2">›</span>
        <Link href="/dse/english" className="hover:text-cyan-400">
          English
        </Link>
        <span className="mx-2">›</span>
        <span className="text-zinc-300">自學路徑</span>
      </nav>

      <h1 className="font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight text-zinc-100 sm:text-4xl">
        DSE English 自學路徑
      </h1>
      <p className="mt-3 text-[15px] leading-relaxed text-zinc-300 sm:text-base">
        {ENGLISH_UNITS.length} 個單元、{LESSON_COUNT} 課，由卷一閱讀講到卷四說話，
        加上語法與詞彙基礎。每個單元先讀課文，再做練習；
        <span className="font-semibold text-zinc-100">
          答對 {ENGLISH_UNITS[0].passThreshold} 題或以上（10 題中）
        </span>
        就通過關卡，解鎖下一個單元。進度只存在你自己的裝置，唔需要帳號。
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {[
          { label: "單元", value: `${ENGLISH_UNITS.length}`, tone: "text-cyan-400" },
          { label: "課文", value: `${LESSON_COUNT}`, tone: "text-zinc-100" },
          { label: "練習題", value: `${PRACTICE_COUNT}`, tone: "text-emerald-400" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-white/10 bg-zinc-900 px-5 py-4 shadow-lg"
          >
            <p className="text-[10px] font-semibold tracking-[0.2em] text-zinc-500 uppercase">
              {s.label}
            </p>
            <p
              className={`mt-1 font-[family-name:var(--font-display)] text-2xl font-extrabold ${s.tone}`}
            >
              {s.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-zinc-900/70 p-5">
        <p className="text-sm font-semibold text-cyan-400">建議使用次序</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-zinc-300">
          <li>卷一、卷二、卷三、卷四各自獨立，可以按你最近考的卷開始。</li>
          <li>
            計分比重是卷三 30% ＞ 卷二 25% ＞ 卷一 20% ＞ 卷四 10%
            （四卷合共 85%，其餘為校本評核），時間有限就先處理比重高的卷。
          </li>
          <li>
            語法與詞彙單元（7 至 9）是卷二、卷三語言分的基礎，寫作反覆失分時應該回頭做。
          </li>
          <li>單元 10 是考前流程：Past Paper 用法、時間分配、考場心態。</li>
        </ul>
      </div>

      <div className="mt-8">
        <EnglishUnitMap />
      </div>

      <section className="mt-10 rounded-2xl border border-white/10 bg-zinc-900 p-6">
        <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-zinc-100">
          常見問題
        </h2>
        <div className="mt-4 space-y-4">
          {FAQS.map((f) => (
            <div key={f.question}>
              <h3 className="text-sm font-semibold text-zinc-100">{f.question}</h3>
              <p className="mt-1 text-sm leading-relaxed text-zinc-400">
                {f.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/dse/english"
          className="rounded-xl border border-white/10 bg-zinc-900 px-5 py-3 text-sm font-semibold text-zinc-200 transition hover:border-cyan-400/40 hover:text-cyan-300"
        >
          英文科題庫（MCQ Drills）
        </Link>
        <Link
          href="/dse/econ/learn"
          className="rounded-xl border border-white/10 bg-zinc-900 px-5 py-3 text-sm font-semibold text-zinc-200 transition hover:border-cyan-400/40 hover:text-cyan-300"
        >
          ECON 自學路徑
        </Link>
      </div>

      <p className="mt-8 rounded-xl border border-white/10 bg-zinc-950/60 p-4 text-xs leading-relaxed text-zinc-500">
        {LEGAL_DISCLAIMER}
        本課程的內容、例子與練習由本站自行編寫及分析，用以說明常見的答題與評分考慮，並非考評局教材，亦不保證考試成績。
      </p>
    </div>
  );
}
