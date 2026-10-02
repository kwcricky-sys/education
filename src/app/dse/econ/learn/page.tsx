import type { Metadata } from "next";
import Link from "next/link";
import EconUnitMap from "@/components/dse/econ-unit-map";
import { JsonLd } from "@/components/seo/json-ld";
import { ECON_UNITS } from "@/lib/dse/econ-path";
import skeletons from "@/data/dse/econ-skeletons.json";
import { createPageMetadata } from "@/lib/page-metadata";
import {
  buildBreadcrumbJsonLd,
  buildCourseJsonLd,
  buildFaqJsonLd,
  type FaqItem,
} from "@/lib/seo";
import { HKEAA_URL, LEGAL_DISCLAIMER, SITE_NAME, SITE_URL } from "@/lib/site";

const PATH = "/dse/econ/learn";
const LESSON_COUNT = ECON_UNITS.reduce((n, u) => n + u.lessonIds.length, 0);
const PASS = ECON_UNITS[0].passThreshold;
const STARTER_UNITS = ECON_UNITS.filter((u) => u.prerequisites.length === 0);

export const metadata: Metadata = createPageMetadata({
  title: `DSE 經濟科自學路徑｜Economics ${ECON_UNITS.length} 單元由供求學到國際貿易 | ${SITE_NAME}`,
  description: `免費 HKDSE 經濟科（Economics）自學課程：${ECON_UNITS.length} 個單元、${LESSON_COUNT} 課，由需求與供應、彈性、市場結構，到本地生產總值、貨幣與銀行、財政及貨幣政策、國際貿易。每單元有課文、例子、常見陷阱，練習答啱 ${PASS}/10 題就解鎖下一個單元。`,
  path: PATH,
  keywords: [
    "DSE 經濟 自學",
    "DSE Econ notes",
    "dse economics course",
    "learn dse economics",
    "經濟科 溫習",
    "econ study guide hong kong",
    "DSE 通脹 失業",
    "DSE 貨幣與銀行",
    "DSE 財政政策",
    "Hong Kong currency board",
  ],
});

const FAQS: FaqItem[] = [
  {
    question: "ECON 自學路徑要唔要錢？",
    answer: "全部免費，唔使註冊。進度只存喺你部機（瀏覽器本機儲存），唔會上傳。",
  },
  {
    question: "點樣先解鎖下一個單元？",
    answer: `每個單元讀完課文，做 10 題練習，答啱 ${PASS} 題或以上就合格。合格後，所有以呢個單元做前設嘅單元會即刻解鎖；唔合格可以睇解說再做。`,
  },
  {
    question: "一定要由單元 1 開始？",
    answer: `唔一定。${STARTER_UNITS.map((u) => `單元 ${u.id}（${u.titleZh}）`).join("同")}冇前設，一開始已經開放；其他單元要先通過指定單元。`,
  },
  {
    question: "課程有幾多個單元同課？",
    answer: `共 ${ECON_UNITS.length} 個單元、${LESSON_COUNT} 課。宏觀部分包括通脹與失業、貨幣與銀行、財政及貨幣政策：通貨膨脹嘅代價、自然失業率同短期 Phillips curve、存款創造數字、貨幣需求動機、排擠效應、自動穩定機制、政策時滯，以及聯繫匯率／貨幣發行局對獨立貨幣政策嘅限制（兌換保證約 7.75–7.85 港元兌 1 美元）。每個單元練習 10 題，答啱 ${PASS} 題或以上先過關。`,
  },
  {
    question: "呢啲係咪考評局教材？",
    answer:
      "唔係。課文同練習由本站整理，只供溫習參考；課程範圍、題型同評分準則以考評局官網最新公佈為準。",
  },
];

export default function EconLearnPage() {
  const courseJsonLd = buildCourseJsonLd({
    name: "DSE 經濟科自學路徑（Economics）",
    description: `HKDSE 經濟科 ${ECON_UNITS.length} 個單元、${LESSON_COUNT} 課自學課程，每單元附練習關卡。`,
    url: `${SITE_URL}${PATH}`,
  });

  return (
    <div className="mx-auto max-w-3xl">
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "首頁", path: "/" },
          { name: "DSE 備考", path: "/dse" },
          { name: "經濟科 MCQ 練習", path: "/dse/econ" },
          { name: "自學路徑", path: PATH },
        ])}
      />
      <JsonLd data={courseJsonLd} />
      <JsonLd data={buildFaqJsonLd(FAQS)} />

      <nav className="mb-6 text-sm text-ink-faint">
        <Link href="/dse" className="hover:text-navy">DSE</Link>
        <span className="mx-2">›</span>
        <Link href="/dse/econ" className="hover:text-navy">經濟科</Link>
        <span className="mx-2">›</span>
        <span className="text-ink-muted">自學路徑</span>
      </nav>

      <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-navy sm:text-4xl">
        DSE 經濟科自學路徑
      </h1>
      <p className="mt-1 text-sm text-ink-faint">Economics — step-by-step course</p>
      <p className="mt-3 text-[15px] leading-relaxed text-ink-muted sm:text-base">
        {ECON_UNITS.length} 個單元、{LESSON_COUNT} 課，由需求與供應一路學到國際貿易。每個單元先讀課文（英文），再做 10 題練習；
        <span className="font-semibold text-ink">答啱 {PASS} 題或以上</span>
        就過關，解鎖之後嘅單元。進度只存喺你部機，唔使帳號。
      </p>

      <div className="mt-6 rounded-2xl border border-line bg-white p-5">
        <p className="text-sm font-semibold text-navy">點樣行呢條路徑</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-ink-muted">
          <li>
            微觀由單元 1（需求與供應）開始；宏觀可以直接由單元 6（本地生產總值與國民收入）開始。
          </li>
          <li>鎖住嘅單元會寫明要先通過邊個單元。</li>
          <li>
            想淨係做題？去{" "}
            <Link href="/dse/econ" className="font-semibold text-navy underline underline-offset-2">
              經濟科 MCQ 題庫
            </Link>{" "}
            按課題做；卡住可以睇{" "}
            <Link href="/dse/videos/econ" className="font-semibold text-navy underline underline-offset-2">
              經濟科溫習片
            </Link>
            。
          </li>
        </ul>
      </div>

      <div className="mt-8">
        <EconUnitMap />
      </div>

      <section className="mt-10">
        <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-navy">
          答題骨架
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">
          下面 {skeletons.skeletons.length} 條是原創答題步驟，用來寫圖表題和計算題。不是考評局評卷參考的原文。
        </p>
        <div className="mt-4 space-y-3">
          {skeletons.skeletons.map((item) => (
            <details key={item.id} className="rounded-2xl border border-line bg-white p-5">
              <summary className="cursor-pointer font-semibold text-ink">
                {item.title}
                <span className="ml-2 text-sm font-normal text-ink-faint">單元 {item.unitId}</span>
              </summary>
              <p className="mt-3 text-sm text-ink-muted">幾時用：{item.whenToUse}</p>
              <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm leading-relaxed text-ink">
                {item.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              <p className="mt-3 rounded-lg bg-cream/70 p-3 text-sm text-ink">{item.sentenceFrames[0]}</p>
              <p className="mt-2 text-sm text-amber-900">常見失分：{item.trap}</p>
            </details>
          ))}
        </div>
      </section>

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
