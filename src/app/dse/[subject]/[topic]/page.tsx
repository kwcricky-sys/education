import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/json-ld";
import {
  DRILL_SUBJECT_META,
  difficultyBreakdown,
  topicLabel,
} from "@/lib/dse/drill-meta";
import {
  DRILL_SUBJECTS,
  getDrillBank,
  getTopicQuestions,
  questionHref,
} from "@/lib/dse/drills";
import { DIFFICULTY_LABEL } from "@/lib/dse/types";
import { createPageMetadata } from "@/lib/page-metadata";
import { buildBreadcrumbJsonLd } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site";

type Props = { params: Promise<{ subject: string; topic: string }> };

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
  const meta = DRILL_SUBJECT_META[subject];
  if (!qs.length || !meta) return {};
  const label = topicLabel(subject, topic);
  return createPageMetadata({
    title: `DSE ${meta.nameZh}：${label.zh}（${label.en}）${qs.length} 題 MCQ 附解說 | ${SITE_NAME}`,
    description: `免費 DSE ${meta.nameZh}「${label.zh}」練習：${qs.length} 題 MCQ（${difficultyBreakdown(qs)}），每題附解說。Free HKDSE ${meta.nameEn} ${label.en} practice with explanations.`,
    path: `/dse/${subject}/${topic}`,
    keywords: [
      `DSE ${meta.nameZh} ${label.zh}`,
      `dse ${meta.nameEn.toLowerCase()} ${label.en.toLowerCase()}`,
      `${label.zh} 練習`,
      "hkdse practice free",
    ],
  });
}

export default async function TopicPage({ params }: Props) {
  const { subject, topic } = await params;
  const qs = getTopicQuestions(subject, topic);
  const meta = DRILL_SUBJECT_META[subject];
  if (!qs.length || !meta) notFound();
  const label = topicLabel(subject, topic);

  return (
    <div className="mx-auto max-w-3xl">
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "首頁", path: "/" },
          { name: "DSE 備考", path: "/dse" },
          { name: `${meta.nameZh} MCQ 練習`, path: `/dse/${subject}` },
          { name: label.zh, path: `/dse/${subject}/${topic}` },
        ])}
      />
      <nav className="mb-6 text-sm text-ink-faint">
        <Link href="/dse" className="hover:text-navy">DSE</Link>
        <span className="mx-2">›</span>
        <Link href={`/dse/${subject}`} className="hover:text-navy">
          {meta.nameZh}
        </Link>
        <span className="mx-2">›</span>
        <span className="text-ink-muted">{label.zh}</span>
      </nav>
      <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-navy">
        DSE {meta.nameZh}：{label.zh}
      </h1>
      {label.en !== label.zh ? (
        <p className="mt-1 text-sm text-ink-faint">{label.en}</p>
      ) : null}
      <p className="mt-3 leading-relaxed text-ink-muted">
        {qs.length} 題 MCQ（{difficultyBreakdown(qs)}），撳入去睇完整解說同上一題／下一題。
        {label.unitId !== null ? (
          <>
            未學過呢個課題？先睇{" "}
            <Link
              href={meta.learnHref}
              className="font-semibold text-navy underline underline-offset-2"
            >
              {meta.learnLabel}單元 {label.unitId}
            </Link>
            。
          </>
        ) : null}
      </p>

      <ol className="mt-8 space-y-3">
        {qs.map((q, i) => (
          <li key={q.id}>
            <Link
              href={questionHref(subject, q)}
              className="block rounded-xl border border-line bg-white p-4 transition-colors hover:border-navy/40"
            >
              <div className="flex items-center gap-2 text-xs text-ink-faint">
                <span className="rounded-full bg-cream px-2 py-0.5 ring-1 ring-line">
                  {DIFFICULTY_LABEL[q.difficulty].zh}
                </span>
                <span>{q.id}</span>
              </div>
              <p className="mt-2 font-medium text-ink">
                {i + 1}. {q.question}
              </p>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
