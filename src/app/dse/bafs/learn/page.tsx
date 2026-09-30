import type { Metadata } from "next";
import Link from "next/link";
import BafsUnitMap from "@/components/dse/bafs-unit-map";
import { JsonLd } from "@/components/seo/json-ld";
import { BAFS_UNITS } from "@/lib/dse/bafs-path";
import { getDrillBank } from "@/lib/dse/drills";
import { createPageMetadata } from "@/lib/page-metadata";
import {
  buildBreadcrumbJsonLd,
  buildCourseJsonLd,
  buildFaqJsonLd,
  type FaqItem,
} from "@/lib/seo";
import { HKEAA_URL, LEGAL_DISCLAIMER, SITE_NAME, SITE_URL } from "@/lib/site";

const PATH = "/dse/bafs/learn";
const LESSON_COUNT = BAFS_UNITS.reduce((n, u) => n + u.lessonIds.length, 0);
const DRILL_COUNT = getDrillBank("bafs")?.meta.total ?? 0;
const PASS = BAFS_UNITS[0].passThreshold;
const STARTER_UNITS = BAFS_UNITS.filter((u) => u.prerequisites.length === 0);

export const metadata: Metadata = createPageMetadata({
  title: `DSE 企業、會計與財務概論（BAFS）自學路徑｜${BAFS_UNITS.length} 單元商管與會計 | ${SITE_NAME}`,
  description: `免費 HKDSE BAFS 自學課程：${BAFS_UNITS.length} 個單元、${LESSON_COUNT} 課，涵蓋商業環境、管理、市場營銷、人力資源、會計等式、財務報表、財務比率、個人理財與商業道德。題庫 ${DRILL_COUNT} 題 MCQ；每單元練習答啱 ${PASS}/10 題就解鎖下一個單元。`,
  path: PATH,
  keywords: [
    "DSE BAFS 自學",
    "DSE BAFS notes",
    "dse bafs course",
    "企業會計與財務概論 溫習",
    "BAFS MCQ",
    "DSE 會計 等式",
    "DSE 財務報表",
    "DSE 財務比率",
    "Hong Kong BAFS study",
  ],
});

const FAQS: FaqItem[] = [
  {
    question: "BAFS 自學路徑要唔要錢？",
    answer: "全部免費，唔使註冊。進度只存喺你部機（瀏覽器本機儲存），唔會上傳。",
  },
  {
    question: "點樣先解鎖下一個單元？",
    answer: `每個單元讀完課文，做 10 題練習，答啱 ${PASS} 題或以上就合格。合格後，所有以呢個單元做前設嘅單元會即刻解鎖；唔合格可以睇解說再做。`,
  },
  {
    question: "一定要由單元 1 開始？",
    answer: `唔一定。商業管理可以由單元 1（商業環境）開始；會計部分可以獨立由單元 6（會計等式與簿記）開始。${STARTER_UNITS.map((u) => `單元 ${u.id}（${u.titleZh}）`).join("、")}一開始已經開放。`,
  },
  {
    question: "課程有幾多個單元、課同題？",
    answer: `共 ${BAFS_UNITS.length} 個單元、${LESSON_COUNT} 課，題庫 ${DRILL_COUNT} 條中等難度 MCQ（練習關卡每單元抽 10 題）。`,
  },
  {
    question: "呢啲係咪考評局教材？",
    answer:
      "唔係。課文同練習由本站整理，只供溫習參考；課程範圍、題型同評分準則以考評局官網最新公佈為準。",
  },
];

export default function BafsLearnPage() {
  const courseJsonLd = buildCourseJsonLd({
    name: "DSE 企業、會計與財務概論（BAFS）自學路徑",
    description: `HKDSE BAFS ${BAFS_UNITS.length} 個單元、${LESSON_COUNT} 課自學課程，每單元附練習關卡。`,
    url: `${SITE_URL}${PATH}`,
  });

  return (
    <div className="mx-auto max-w-3xl">
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "首頁", path: "/" },
          { name: "DSE 備考", path: "/dse" },
          { name: "BAFS MCQ 練習", path: "/dse/bafs" },
          { name: "自學路徑", path: PATH },
        ])}
      />
      <JsonLd data={courseJsonLd} />
      <JsonLd data={buildFaqJsonLd(FAQS)} />

      <nav className="mb-6 text-sm text-ink-faint">
        <Link href="/dse" className="hover:text-navy">DSE</Link>
        <span className="mx-2">›</span>
        <Link href="/dse/bafs" className="hover:text-navy">BAFS</Link>
        <span className="mx-2">›</span>
        <span className="text-ink-muted">自學路徑</span>
      </nav>

      <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-navy sm:text-4xl">
        DSE 企業、會計與財務概論（BAFS）自學路徑
      </h1>
      <p className="mt-1 text-sm text-ink-faint">
        Business, Accounting and Financial Studies — step-by-step course
      </p>
      <p className="mt-3 text-[15px] leading-relaxed text-ink-muted sm:text-base">
        {BAFS_UNITS.length} 個單元、{LESSON_COUNT} 課，涵蓋商業管理同會計財務核心。每個單元先讀課文（英文），再做 10 題練習；
        <span className="font-semibold text-ink">答啱 {PASS} 題或以上</span>
        就過關，解鎖之後嘅單元。進度只存喺你部機，唔使帳號。
      </p>

      <div className="mt-6 rounded-2xl border border-line bg-white p-5">
        <p className="text-sm font-semibold text-navy">點樣行呢條路徑</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-ink-muted">
          <li>商業管理：由單元 1（商業環境）開始，經管理學到市場營銷／人力資源。</li>
          <li>會計財務：可以直接由單元 6（會計等式與簿記）開始，之後財務報表同比率。</li>
          <li>
            想淨係做題？去{" "}
            <Link href="/dse/bafs" className="font-semibold text-navy underline underline-offset-2">
              BAFS MCQ 題庫
            </Link>{" "}
            按課題練習。
          </li>
        </ul>
      </div>

      <div className="mt-8">
        <BafsUnitMap />
      </div>

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
