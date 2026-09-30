import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/json-ld";
import { DRILL_SUBJECT_META, topicLabel } from "@/lib/dse/drill-meta";
import {
  DRILL_SUBJECTS,
  getDrillBank,
  getQuestion,
  getTopicQuestions,
  questionHref,
} from "@/lib/dse/drills";
import { DIFFICULTY_LABEL } from "@/lib/dse/types";
import { createPageMetadata } from "@/lib/page-metadata";
import { buildBreadcrumbJsonLd } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site";

type Props = {
  params: Promise<{ subject: string; topic: string; qid: string }>;
};

export function generateStaticParams() {
  const params: { subject: string; topic: string; qid: string }[] = [];
  for (const s of DRILL_SUBJECTS) {
    const bank = getDrillBank(s);
    if (!bank) continue;
    for (const q of bank.questions) {
      params.push({ subject: s, topic: q.topic, qid: q.id });
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subject, topic, qid } = await params;
  const q = getQuestion(subject, qid);
  const meta = DRILL_SUBJECT_META[subject];
  if (!q || !meta) return {};
  const label = topicLabel(subject, topic);
  return createPageMetadata({
    title: `${q.question.slice(0, 70)} — DSE ${meta.nameZh}${label.zh} | ${SITE_NAME}`,
    description: `${q.explanation.slice(0, 140)} DSE ${meta.nameZh}「${label.zh}」免費練習，附完整解說。`,
    path: `/dse/${subject}/${topic}/${qid}`,
    keywords: q.tags || [],
  });
}

export default async function QuestionPage({ params }: Props) {
  const { subject, topic, qid } = await params;
  const q = getQuestion(subject, qid);
  const meta = DRILL_SUBJECT_META[subject];
  if (!q || !meta) notFound();
  const siblings = getTopicQuestions(subject, topic);
  const idx = siblings.findIndex((x) => x.id === qid);
  const prev = idx > 0 ? siblings[idx - 1] : null;
  const next = idx < siblings.length - 1 ? siblings[idx + 1] : null;
  const label = topicLabel(subject, topic);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "QAPage",
    mainEntity: {
      "@type": "Question",
      name: q.question,
      answerCount: 1,
      acceptedAnswer: {
        "@type": "Answer",
        text: `${q.answer}. ${q.explanation}`,
      },
    },
  };

  return (
    <div className="mx-auto max-w-3xl">
      <JsonLd data={jsonLd} />
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "首頁", path: "/" },
          { name: "DSE 備考", path: "/dse" },
          { name: `${meta.nameZh} MCQ 練習`, path: `/dse/${subject}` },
          { name: label.zh, path: `/dse/${subject}/${topic}` },
          { name: q.id, path: `/dse/${subject}/${topic}/${qid}` },
        ])}
      />
      <nav className="mb-6 text-sm text-black/50">
        <Link href="/dse" className="hover:text-black/80">DSE</Link>
        <span className="mx-2">›</span>
        <Link href={`/dse/${subject}`} className="hover:text-black/80">
          {meta.nameZh}
        </Link>
        <span className="mx-2">›</span>
        <Link href={`/dse/${subject}/${topic}`} className="hover:text-black/80">
          {label.zh}
        </Link>
      </nav>

      <div className="flex items-center gap-2 text-xs">
        <span className="rounded-full bg-black/5 px-2 py-0.5 text-black/50">
          {DIFFICULTY_LABEL[q.difficulty].zh}
        </span>
        <span className="text-black/40">{q.id}</span>
      </div>

      <h1 className="mt-3 font-[family-name:var(--font-display)] text-xl font-bold leading-relaxed text-navy sm:text-2xl">
        {q.question}
      </h1>

      <div className="mt-6 space-y-2">
        {q.options.map((o) => {
          const letter = o.charAt(0);
          const isAns = letter === q.answer;
          return (
            <div
              key={letter}
              className={`rounded-xl border p-4 ${
                isAns
                  ? "border-green-200 bg-green-50 font-semibold"
                  : "border-black/5 bg-white"
              }`}
            >
              {o}
              {isAns && (
                <span className="ml-2 text-sm text-green-700">✓ 答案</span>
              )}
            </div>
          );
        })}
      </div>

      <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-navy">解說</h2>
        <p className="mt-3 leading-relaxed text-black/70">{q.explanation}</p>
      </section>

      <div className="mt-8 flex justify-between text-sm">
        {prev ? (
          <Link
            href={questionHref(subject, prev)}
            className="rounded-full border border-black/10 px-4 py-2 hover:bg-black/5"
          >
            ← 上一題
          </Link>
        ) : <span />}
        {next && (
          <Link
            href={questionHref(subject, next)}
            className="rounded-full border border-black/10 px-4 py-2 hover:bg-black/5"
          >
            下一題 →
          </Link>
        )}
      </div>

      <p className="mt-10 text-center text-xs text-black/40">
        <Link href={`/dse/${subject}/${topic}`} className="underline">
          「{label.zh}」全部 {siblings.length} 題
        </Link>
        {" · "}
        <Link href={`/dse/${subject}`} className="underline">
          {meta.nameZh} MCQ 題庫
        </Link>
      </p>
    </div>
  );
}
