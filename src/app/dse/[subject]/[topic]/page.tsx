import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  DRILL_SUBJECTS,
  getDrillBank,
  getTopicQuestions,
  questionHref,
} from "@/lib/dse/drills";
import { createPageMetadata } from "@/lib/page-metadata";
import { SITE_NAME, SITE_URL } from "@/lib/site";

type Props = { params: Promise<{ subject: string; topic: string }> };

const SUBJECT_NAME: Record<string, string> = {
  econ: "Economics",
  english: "English",
};

export function generateStaticParams() {
  const params: { subject: string; topic: string }[] = [];
  for (const s of DRILL_SUBJECTS) {
    const bank = getDrillBank(s);
    if (!bank) continue;
    for (const t of [...new Set(bank.questions.map((q) => q.topic))]) {
      params.push({ subject: s, topic: t });
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subject, topic } = await params;
  const qs = getTopicQuestions(subject, topic);
  if (!qs.length) return {};
  const name = SUBJECT_NAME[subject] || subject;
  const pretty = topic.replace(/-/g, " ");
  return createPageMetadata({
    title: `DSE ${name} ${pretty} — ${qs.length} MCQ Drills with Answers | ${SITE_NAME}`,
    description: `Free HKDSE ${name} practice on ${pretty}: ${qs.length} multiple-choice questions (easy/medium/hard) with step-by-step explanations. Covers common exam traps.`,
    path: `/dse/${subject}/${topic}`,
    keywords: [
      `dse ${name.toLowerCase()} ${pretty}`,
      `dse ${name.toLowerCase()} mcq`,
      `${pretty} dse exercise`,
      "hkdse practice free",
    ],
  });
}

export default async function TopicPage({ params }: Props) {
  const { subject, topic } = await params;
  const qs = getTopicQuestions(subject, topic);
  if (!qs.length) notFound();
  const name = SUBJECT_NAME[subject] || subject;
  const pretty = topic.replace(/-/g, " ");

  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <nav className="mb-6 text-sm text-black/50">
        <Link href="/dse" className="hover:text-black/80">DSE</Link>
        <span className="mx-2">›</span>
        <Link href={`/dse/${subject}`} className="hover:text-black/80">
          {name}
        </Link>
        <span className="mx-2">›</span>
        <span>{pretty}</span>
      </nav>
      <h1 className="text-3xl font-bold capitalize">
        DSE {name}: {pretty}
      </h1>
      <p className="mt-3 text-black/70">
        {qs.length} MCQ drills with teaching explanations. Click a question to
        see the full walkthrough, distractor analysis and related questions.
      </p>

      <ol className="mt-8 space-y-3">
        {qs.map((q, i) => (
          <li key={q.id}>
            <Link
              href={questionHref(subject, q)}
              className="block rounded-xl border border-black/5 bg-white p-4 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-center gap-2 text-xs text-black/40">
                <span className="rounded-full bg-black/5 px-2 py-0.5">
                  {q.difficulty}
                </span>
                <span>{q.id}</span>
              </div>
              <p className="mt-2 font-medium text-black/80">
                {i + 1}. {q.question}
              </p>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
