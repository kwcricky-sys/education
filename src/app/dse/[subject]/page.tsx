import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getDrillBank,
  getDrillTopics,
  getTopicQuestions,
  DRILL_SUBJECTS,
  questionHref,
  type DrillQuestion,
} from "@/lib/dse/drills";
import { createPageMetadata } from "@/lib/page-metadata";
import { SITE_NAME, SITE_URL } from "@/lib/site";

type Props = { params: Promise<{ subject: string }> };

const SUBJECT_META: Record<
  string,
  { name: string; desc: string; keywords: string[] }
> = {
  econ: {
    name: "Economics 經濟科",
    desc: "Free HKDSE Economics MCQ drills: demand & supply, elasticity, market structures, GDP, inflation, money & banking, fiscal & monetary policy, international trade. Practice with instant explanations.",
    keywords: ["DSE Economics", "DSE Econ practice", "DSE Econ MCQ", "econ dse past paper questions", "DSE economics drill"],
  },
  english: {
    name: "English 英文科",
    desc: "Free HKDSE English grammar drills: tenses, conditionals, relative clauses, phrasal verbs, connectives and more. MCQ practice with teaching explanations.",
    keywords: ["DSE English grammar", "DSE English exercise", "English MCQ DSE", "dse english practice", "english grammar drill hong kong"],
  },
};

export function generateStaticParams() {
  return DRILL_SUBJECTS.map((s) => ({ subject: s }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subject } = await params;
  const m = SUBJECT_META[subject];
  if (!m) return {};
  return createPageMetadata({
    title: `DSE ${m.name} Free MCQ Drills | ${SITE_NAME}`,
    description: m.desc,
    path: `/dse/${subject}`,
    keywords: m.keywords,
  });
}

export default async function DrillSubjectPage({ params }: Props) {
  const { subject } = await params;
  if (!DRILL_SUBJECTS.includes(subject)) notFound();
  const bank = getDrillBank(subject);
  const meta = SUBJECT_META[subject];
  const topics = getDrillTopics(subject);

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Is this ${meta.name} drill free?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. All drills on DSE.hack are free, no sign-up required.",
        },
      },
      {
        "@type": "Question",
        name: `How many ${subject} questions are there?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `The bank currently covers ${bank?.meta.total ?? 0} reviewed questions across ${topics.length} topics, and grows daily.`,
        },
      },
    ],
  };

  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }}
      />
      <nav className="mb-6 text-sm text-black/50">
        <Link href="/dse" className="hover:text-black/80">DSE</Link>
        <span className="mx-2">›</span>
        <span>{meta.name}</span>
      </nav>
      <h1 className="text-3xl font-bold">
        DSE {meta.name} Free MCQ Drills
      </h1>
      <p className="mt-3 leading-relaxed text-black/70">
        {bank?.meta.total ?? 0} reviewed questions across {topics.length} topics.
        Every question is independently verified and comes with a teaching
        explanation. Free, no sign-up.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {topics.map((topic) => {
          const qs = getTopicQuestions(subject, topic);
          return (
            <Link
              key={topic}
              href={`/dse/${subject}/${topic}`}
              className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <h2 className="text-lg font-semibold">
                {topic.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
              </h2>
              <p className="mt-1 text-sm text-black/50">{qs.length} questions</p>
              <p className="mt-2 text-xs text-black/40">
                {qs.filter((q) => q.difficulty === "easy").length} easy ·{" "}
                {qs.filter((q) => q.difficulty === "medium").length} medium ·{" "}
                {qs.filter((q) => q.difficulty === "hard").length} hard
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
