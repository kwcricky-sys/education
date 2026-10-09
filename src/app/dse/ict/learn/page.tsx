import type { Metadata } from "next";
import Link from "next/link";
import IctUnitMap from "@/components/dse/ict-unit-map";
import { JsonLd } from "@/components/seo/json-ld";
import conceptCards from "@/data/dse/ict-concept-cards.json";
import phraseCards from "@/data/dse/ict-phrase-cards.json";
import { ICT_UNITS } from "@/lib/dse/ict-path";
import { LearnCrossLinks } from "@/components/dse/learn-cross-links";
import { createPageMetadata } from "@/lib/page-metadata";
import {
  buildBreadcrumbJsonLd,
  buildCourseJsonLd,
  buildFaqJsonLd,
  type FaqItem,
} from "@/lib/seo";
import { HKEAA_URL, LEGAL_DISCLAIMER, SITE_NAME, SITE_URL } from "@/lib/site";

const PATH = "/dse/ict/learn";
const LESSON_COUNT = ICT_UNITS.reduce((n, u) => n + u.lessonIds.length, 0);
const PASS = ICT_UNITS[0].passThreshold;
const STARTER_UNITS = ICT_UNITS.filter((u) => u.prerequisites.length === 0);

export const metadata: Metadata = createPageMetadata({
  title: `DSE ICT 自學路徑｜資訊及通訊科技 ${ICT_UNITS.length} 單元由系統學到應試 | ${SITE_NAME}`,
  description: `免費 HKDSE 資訊及通訊科技（ICT）自學課程：${ICT_UNITS.length} 個單元、${LESSON_COUNT} 課，涵蓋電腦系統、數據表示、網絡、互聯網、數據庫、多媒體、演算法與偽代碼、網絡保安、社會道德法律同應試技巧。每單元練習答啱 ${PASS}/10 題就解鎖下一個單元。`,
  path: PATH,
  keywords: [
    "DSE ICT",
    "DSE 資訊及通訊科技",
    "HKDSE ICT notes",
    "ICT 自學",
    "DSE ICT MCQ",
    "資訊及通訊科技 溫習",
    "DSE 數據庫",
    "DSE 演算法 偽代碼",
    "DSE 電腦網絡",
    "ICT study guide hong kong",
  ],
});

const FAQS: FaqItem[] = [
  {
    question: "ICT 自學路徑要唔要錢？",
    answer: "全部免費，唔使註冊。進度只存喺你部機（瀏覽器本機儲存），唔會上傳。",
  },
  {
    question: "點樣先解鎖下一個單元？",
    answer: `每個單元讀完課文，做 10 題練習，答啱 ${PASS} 題或以上就合格。合格後，所有以呢個單元做前設嘅單元會即刻解鎖；唔合格可以睇解說再做。`,
  },
  {
    question: "一定要由單元 1 開始？",
    answer: `唔一定。${STARTER_UNITS.map((u) => `單元 ${u.id}（${u.titleZh}）`).join("、")}冇前設，一開始已經開放；其他單元要先通過指定單元。`,
  },
  {
    question: "課程包唔包選修同大學電腦科？",
    answer: `共 ${ICT_UNITS.length} 個單元、${LESSON_COUNT} 課，對準 HKDSE ICT：必修嘅電腦系統、數據表示、網絡同互聯網、演算思維（偽代碼、追蹤、測試數據），加上中學程度嘅數據庫同多媒體，以及保安、社會／道德／法律同應試技巧。唔會教大學程度嘅作業系統、複雜度理論或者網絡攻擊手法。卷二選修（數據庫、網頁應用開發、演算法與程式編寫）要按你學校揀嘅兩個單元再對考評局最新評核大綱。`,
  },
  {
    question: "呢啲係咪考評局教材？",
    answer:
      "唔係。課文同練習由本站整理，只供溫習參考；課程範圍、題型同評分準則以考評局官網最新公佈為準。",
  },
];

export default function IctLearnPage() {
  const courseJsonLd = buildCourseJsonLd({
    name: "DSE ICT 自學路徑（資訊及通訊科技）",
    description: `HKDSE 資訊及通訊科技 ${ICT_UNITS.length} 個單元、${LESSON_COUNT} 課自學課程，每單元附練習關卡。`,
    url: `${SITE_URL}${PATH}`,
  });

  return (
    <div className="mx-auto max-w-3xl">
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "首頁", path: "/" },
          { name: "DSE 備考", path: "/dse" },
          { name: "ICT MCQ 練習", path: "/dse/ict" },
          { name: "自學路徑", path: PATH },
        ])}
      />
      <JsonLd data={courseJsonLd} />
      <JsonLd data={buildFaqJsonLd(FAQS)} />

      <nav className="mb-6 text-sm text-ink-faint">
        <Link href="/dse" className="hover:text-navy">DSE</Link>
        <span className="mx-2">›</span>
        <Link href="/dse/ict" className="hover:text-navy">資訊及通訊科技</Link>
        <span className="mx-2">›</span>
        <span className="text-ink-muted">自學路徑</span>
      </nav>

      <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-navy sm:text-4xl">
        DSE ICT 自學路徑
      </h1>
      <p className="mt-1 text-sm text-ink-faint">
        Information and Communication Technology — step-by-step course
      </p>
      <p className="mt-3 text-[15px] leading-relaxed text-ink-muted sm:text-base">
        {ICT_UNITS.length} 個單元、{LESSON_COUNT} 課，由電腦系統、網絡同數據，學到數據庫、演算法、保安同應試。每個單元先讀課文（英文），再做 10 題練習；
        <span className="font-semibold text-ink">答啱 {PASS} 題或以上</span>
        就過關，解鎖之後嘅單元。進度只存喺你部機，唔使帳號。
      </p>

      <div className="mt-6 rounded-2xl border border-line bg-white p-5">
        <p className="text-sm font-semibold text-navy">點樣行呢條路徑</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-ink-muted">
          <li>
            系統由單元 1 開始；演算法可以直接由單元 7 開始；社會、道德與法律由單元 9 開始。
          </li>
          <li>鎖住嘅單元會寫明要先通過邊個單元。數據庫同多媒體用中學程度，方便對卷二選修。</li>
          <li>
            想淨係做題？去{" "}
            <Link href="/dse/ict" className="font-semibold text-navy underline underline-offset-2">
              ICT MCQ 題庫
            </Link>
            ，按課題逐題睇解說。
          </li>
        </ul>
      </div>

      <div className="mt-8">
        <IctUnitMap />
      </div>

      <section className="mt-10">
        <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-navy">
          概念卡
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">
          {conceptCards.cards.length} 張原創概念卡，用來核對系統、網絡、數據、數據庫、多媒體同版權嘅常見分界。不是考評局試題。
        </p>
        <div className="mt-4 space-y-3">
          {conceptCards.cards.map((card) => (
            <details key={card.id} className="rounded-2xl border border-line bg-white p-5">
              <summary className="cursor-pointer font-semibold text-ink">
                {card.title}
                <span className="ml-2 text-sm font-normal text-ink-faint">{card.focus}</span>
              </summary>
              <p className="mt-3 text-sm text-ink">{card.prompt}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{card.answer}</p>
              <p className="mt-2 text-sm text-amber-900">常見失分：{card.trap}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-navy">
          Explain／compare 句式卡
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">
          {phraseCards.cards.length} 條原編句式，答 explain 同 compare 題時照樣填返個案例。
          括號入面換成題目自己嘅細節，分數先會穩陣。
        </p>
        <div className="mt-4 space-y-3">
          {phraseCards.cards.map((card) => (
            <details key={card.id} className="rounded-2xl border border-line bg-white p-5">
              <summary className="cursor-pointer font-semibold text-ink">
                {card.title}
                <span className="ml-2 text-sm font-normal text-ink-faint">{card.focus}</span>
              </summary>
              <p className="mt-3 rounded-lg bg-cream/70 p-3 text-sm leading-relaxed text-ink">
                {card.phrase}
              </p>
              <p className="mt-2 text-sm text-amber-900">用嘅時候：{card.tips}</p>
            </details>
          ))}
        </div>
      </section>

      <LearnCrossLinks current="/dse/ict/learn" />

      <section className="mt-10 rounded-2xl border border-line bg-white p-6">
        <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-navy">
          常見問題
        </h2>
        <div className="mt-4 space-y-4">
          {FAQS.map((f) => (
            <div key={f.question}>
              <h3 className="text-sm font-semibold text-ink">{f.question}</h3>
              <p className="mt-1 text-sm leading-relaxed text-ink-muted">{f.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <p className="mt-8 rounded-xl border border-line bg-cream/60 p-4 text-xs leading-relaxed text-ink-muted">
        {LEGAL_DISCLAIMER}課程範圍及評分準則以{" "}
        <a
          href={HKEAA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-navy underline underline-offset-2"
        >
          考評局官網
        </a>{" "}
        為準。
      </p>
    </div>
  );
}
