import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  DRILL_SUBJECTS,
  getDrillBank,
  getQuestion,
  getTopicQuestions,
  questionHref,
} from "@/lib/dse/drills";
import { createPageMetadata } from "@/lib/page-metadata";
import { SITE_NAME, SITE_URL } from "@/lib/site";

type Props = {
  params: Promise<{ subject: string; topic: string; qid: string }>;
};

const SUBJECT_NAME: Record<string, string> = {
  econ: "Economics",
  english: "English",
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
  if (!q) return {};
  const name = SUBJECT_NAME[subject] || subject;
  const pretty = topic.replace(/-/g, " ");
  return createPageMetadata({
    title: `${q.question.slice(0, 70)} — DSE ${name} ${pretty} | ${SITE_NAME}`,
    description: `${q.explanation.slice(0, 140)} Free DSE ${name} ${pretty} drill with full explanation.`,
    path: `/dse/${subject}/${topic}/${qid}`,
    keywords: q.tags || [],
  });
}

export default async function QuestionPage({ params }: Props) {
  const { subject, topic, qid } = await params;
  const q = getQuestion(subject, qid);
  if (!q) notFound();
  const siblings = getTopicQuestions(subject, topic);
  const idx = siblings.findIndex((x) => x.id === qid);
  const prev = idx > 0 ? siblings[idx - 1] : null;
  const next = idx < siblings.length - 1 ? siblings[idx + 1] : null;
  const name = SUBJECT_NAME[subject] || subject;
  const pretty = topic.replace(/-/g, " ");

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
    <div className="mx-auto max-w-3xl px-5 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav className="mb-6 text-sm text-black/50">
        <Link href="/dse" className="hover:text-black/80">DSE</Link>
        <span className="mx-2">›</span>
        <Link href={`/dse/${subject}`} className="hover:text-black/80">
          {name}
        </Link>
        <span className="mx-2">›</span>
        <Link href={`/dse/${subject}/${topic}`} className="hover:text-black/80">
          {pretty}
        </Link>
      </nav>

      <div className="flex items-center gap-2 text-xs">
        <span className="rounded-full bg-black/5 px-2 py-0.5 text-black/50">
          {q.difficulty}
        </span>
        <span className="text-black/40">{q.id}</span>
      </div>

      <h1 className="mt-3 text-xl font-bold leading-relaxed sm:text-2xl">
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
                <span className="ml-2 text-sm text-green-700">✓ Answer</span>
              )}
            </div>
          );
        })}
      </div>

      <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Explanation</h2>
        <p className="mt-3 leading-relaxed text-black/70">{q.explanation}</p>
      </section>

      <div className="mt-8 flex justify-between text-sm">
        {prev ? (
          <Link
            href={questionHref(subject, prev)}
            className="rounded-full border border-black/10 px-4 py-2 hover:bg-black/5"
          >
            ← Previous
          </Link>
        ) : <span />}
        {next && (
          <Link
            href={questionHref(subject, next)}
            className="rounded-full border border-black/10 px-4 py-2 hover:bg-black/5"
          >
            Next →
          </Link>
        )}
      </div>

      <p className="mt-10 text-center text-xs text-black/40">
        More free DSE {name} drills:{" "}
        <Link href={`/dse/${subject}`} className="underline">
          {pretty} question bank
        </Link>
      </p>
    </div>
  );
}
