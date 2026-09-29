import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { Eyebrow } from "@/components/site/trust-ui";
import {
  DRILL_SUBJECT_META,
  difficultyBreakdown,
  learnPassThreshold,
  topicLabel,
} from "@/lib/dse/drill-meta";
import {
  getDrillBank,
  getDrillTopics,
  getTopicQuestions,
  DRILL_SUBJECTS,
} from "@/lib/dse/drills";
import { createPageMetadata } from "@/lib/page-metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, type FaqItem } from "@/lib/seo";
import { HKEAA_URL, SITE_NAME } from "@/lib/site";

type Props = { params: Promise<{ subject: string }> };

export function generateStaticParams() {
  return DRILL_SUBJECTS.map((s) => ({ subject: s }));
}

function subjectFacts(subject: string) {
  const meta = DRILL_SUBJECT_META[subject];
  const bank = getDrillBank(subject);
  if (!meta || !bank) return null;
  const topics = getDrillTopics(subject);
  return { meta, total: bank.questions.length, topics };
}

function buildFaqs(subject: string): FaqItem[] {
  const facts = subjectFacts(subject);
  if (!facts) return [];
  const { meta, total, topics } = facts;
  return [
    {
      question: `呢個 DSE ${meta.nameZh}題庫要唔要錢？`,
      answer: "全部免費，唔使註冊，亦唔使登入。揀課題就可以即刻做。",
    },
    {
      question: "題庫有幾多題？",
      answer: `而家有 ${total} 題，分 ${topics.length} 個課題，每題都附解說。`,
    },
    {
      question: "應該由邊度開始？",
      answer: `未學過嘅課題，建議先跟${meta.learnLabel}：每個單元讀完課文做 10 題練習，答啱 ${learnPassThreshold(subject)} 題或以上就解鎖下一個單元。學完再返嚟呢度按課題做題，逐題睇解說。`,
    },
    {
      question: "呢啲係咪考評局試題？",
      answer:
        "唔係。題目只供溫習參考，並非考評局官方試題或教材；考試範圍、題型同評分準則以考評局官網公佈為準。",
    },
  ];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subject } = await params;
  const facts = subjectFacts(subject);
  if (!facts) return {};
  const { meta, total, topics } = facts;
  const topicNames = topics.map((t) => topicLabel(subject, t).zh);
  return createPageMetadata({
    title: `DSE ${meta.nameZh}（${meta.nameEn}）MCQ 練習｜${total} 題附解說 | ${SITE_NAME}`,
    description: `免費 DSE ${meta.nameZh} MCQ 練習：${topicNames.slice(0, 6).join("、")}等 ${topics.length} 個課題共 ${total} 題，每題附解說。免登入，可配合${meta.learnLabel}使用。`,
    path: `/dse/${subject}`,
    keywords: meta.keywords,
  });
}

export default async function DrillSubjectPage({ params }: Props) {
  const { subject } = await params;
  const facts = subjectFacts(subject);
  if (!facts) notFound();
  const { meta, total, topics } = facts;
  const faqs = buildFaqs(subject);

  const steps = [
    {
      title: "未學過？先上自學路徑",
      detail: `${meta.learnLabel}逐個單元教，做完練習過關先解鎖下一課。`,
      href: meta.learnHref,
      cta: `去${meta.learnLabel}`,
    },
    {
      title: "按課題做題",
      detail: "揀下面一個課題，逐題做，每題睇埋解說同錯誤選項點解錯。",
      href: "#topics",
      cta: "揀課題",
    },
    {
      title: "卡住就睇溫習片",
      detail: "片庫每條附摘要同重點筆記，睇完再返嚟做同一課題。",
      href: meta.videoHref,
      cta: "睇溫習片",
    },
  ];

  return (
    <div className="mx-auto max-w-3xl">
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "首頁", path: "/" },
          { name: "DSE 備考", path: "/dse" },
          { name: `${meta.nameZh} MCQ 練習`, path: `/dse/${subject}` },
        ])}
      />
      <JsonLd data={buildFaqJsonLd(faqs)} />

      <nav className="mb-6 text-sm text-ink-faint">
        <Link href="/dse" className="hover:text-navy">DSE</Link>
        <span className="mx-2">›</span>
        <span className="text-ink-muted">{meta.nameZh} MCQ 練習</span>
      </nav>

      <Eyebrow>DSE {meta.nameEn} · MCQ 題庫</Eyebrow>
      <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-bold text-navy sm:text-4xl">
        DSE {meta.nameZh} MCQ 練習
      </h1>
      <p className="mt-3 leading-relaxed text-ink-muted">
        {total} 題、{topics.length} 個課題，每題附解說。唔使註冊，揀課題就做得。
      </p>

      <section aria-labelledby="how-heading" className="mt-8">
        <h2 id="how-heading" className="text-sm font-bold text-navy">
          點樣用呢個題庫
        </h2>
        <ol className="mt-3 grid gap-3 sm:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.title}>
              <Link
                href={s.href}
                className="group flex h-full flex-col rounded-2xl border border-line bg-white p-4 transition-colors hover:border-navy/40"
              >
                <span className="flex size-7 items-center justify-center rounded-full bg-navy text-xs font-bold text-gold">
                  {i + 1}
                </span>
                <span className="mt-3 text-sm font-bold text-navy">{s.title}</span>
                <span className="mt-1 flex-1 text-xs leading-relaxed text-ink-muted">
                  {s.detail}
                </span>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-gold-ink">
                  {s.cta}
                  <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section id="topics" aria-labelledby="topics-heading" className="mt-10 scroll-mt-24">
        <h2
          id="topics-heading"
          className="font-[family-name:var(--font-display)] text-2xl font-bold text-navy"
        >
          按課題練習
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {topics.map((topic) => {
            const qs = getTopicQuestions(subject, topic);
            const label = topicLabel(subject, topic);
            return (
              <Link
                key={topic}
                href={`/dse/${subject}/${topic}`}
                className="panel-lift rounded-2xl border border-line bg-white p-5"
              >
                <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-navy">
                  {label.zh}
                </h3>
                {label.en !== label.zh ? (
                  <p className="text-xs text-ink-faint">{label.en}</p>
                ) : null}
                <p className="mt-2 text-sm font-semibold text-ink">{qs.length} 題</p>
                <p className="mt-1 text-xs text-ink-faint">{difficultyBreakdown(qs)}</p>
                {label.unitId !== null ? (
                  <p className="mt-2 inline-block rounded-full bg-cream px-2 py-0.5 text-[11px] font-semibold text-gold-ink ring-1 ring-line">
                    對應自學路徑單元 {label.unitId}
                  </p>
                ) : null}
              </Link>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="faq-heading" className="mt-10 rounded-2xl border border-line bg-white p-6">
        <h2
          id="faq-heading"
          className="font-[family-name:var(--font-display)] text-xl font-bold text-navy"
        >
          常見問題
        </h2>
        <div className="mt-4 space-y-4">
          {faqs.map((f) => (
            <div key={f.question}>
              <h3 className="text-sm font-semibold text-ink">{f.question}</h3>
              <p className="mt-1 text-sm leading-relaxed text-ink-muted">{f.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <p className="mt-6 rounded-xl border border-line bg-cream/60 p-4 text-xs leading-relaxed text-ink-muted">
        題目只供溫習參考，並非考評局官方試題。考試範圍、題型及評分準則，以{" "}
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
