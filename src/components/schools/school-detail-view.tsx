import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  ExternalLink,
  GraduationCap,
  Lightbulb,
  MapPin,
  MessageSquareQuote,
  Sparkles,
} from "lucide-react";
import {
  getAdmissionTimeline,
  getBand1Estimate,
  getFeederSchools,
  getInterviewQuestions,
  getInterviewTips,
  getSeoHighlights,
  getSeoSummaryText,
  getTopDestinations,
} from "@/lib/schools/load";
import type { SchoolDetail } from "@/lib/schools/types";
import { cn } from "@/lib/utils";

function Pill({
  children,
  tone = "slate",
}: {
  children: ReactNode;
  tone?: "slate" | "sky" | "orange" | "emerald";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
        tone === "slate" &&
          "border-slate-200 bg-slate-50 text-slate-700",
        tone === "sky" && "border-sky-200 bg-sky-50 text-sky-800",
        tone === "orange" &&
          "border-orange-200 bg-orange-50 text-orange-800",
        tone === "emerald" &&
          "border-emerald-200 bg-emerald-50 text-emerald-800",
      )}
    >
      {children}
    </span>
  );
}

function Section({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-700 ring-1 ring-slate-200">
          {icon}
        </div>
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-lg font-bold text-slate-900">
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>
          ) : null}
        </div>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export function SchoolDetailView({ school }: { school: SchoolDetail }) {
  const seoText = getSeoSummaryText(school.seo_summary);
  const highlights = getSeoHighlights(school.seo_summary);
  const interviewQs = getInterviewQuestions(school.interview_prep);
  const interviewTips = getInterviewTips(school.interview_prep);
  const timeline = getAdmissionTimeline(school.admission_info);
  const feeders = getFeederSchools(school.secondary_allocation);
  const band1 = getBand1Estimate(school.secondary_allocation);
  const destinations = getTopDestinations(school.secondary_allocation);
  const website = school.website || school.website_url;
  const netLabel =
    school.school_net != null && String(school.school_net) !== ""
      ? String(school.school_net)
      : null;

  const hasAllocation =
    feeders.length > 0 ||
    destinations.length > 0 ||
    (band1 != null && band1 !== "" && band1 !== "不適用");

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-10 sm:px-6 sm:py-12">
      <Link
        href="/schools"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 transition hover:text-sky-700"
      >
        <ArrowLeft className="size-3.5" />
        返回學校列表
      </Link>

      <header className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_0%,rgba(14,165,233,0.1),transparent_40%),radial-gradient(circle_at_90%_20%,rgba(249,115,22,0.08),transparent_35%)]"
        />
        <div className="relative">
          <div className="flex flex-wrap gap-2">
            {netLabel ? <Pill tone="sky">校網 {netLabel}</Pill> : null}
            {school.finance_type ? (
              <Pill tone="orange">{school.finance_type}</Pill>
            ) : null}
            {school.gender ? <Pill>{school.gender}</Pill> : null}
            {school.district ? (
              <Pill tone="emerald">{school.district}</Pill>
            ) : null}
            {school.religion ? <Pill>{school.religion}</Pill> : null}
          </div>

          <h1 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            {school.name_zh}
          </h1>
          {school.name_en ? (
            <p className="mt-2 text-base text-slate-500">{school.name_en}</p>
          ) : null}

          {school.address ? (
            <p className="mt-4 flex items-start gap-2 text-sm text-slate-600">
              <MapPin className="mt-0.5 size-4 shrink-0 text-sky-600" />
              {school.address}
            </p>
          ) : null}

          <div className="mt-6 flex flex-wrap gap-3">
            {website ? (
              <a
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                官方網站
                <ExternalLink className="size-3.5" />
              </a>
            ) : null}
            <Link
              href="/schools"
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              比較其他學校
            </Link>
          </div>
        </div>
      </header>

      {seoText ? (
        <Section
          icon={<Sparkles className="size-5 text-orange-500" />}
          title="獨家 Insight"
          subtitle="廣東話學校特色簡介 · SEO Summary"
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap text-slate-700 sm:text-base">
            {seoText}
          </p>
          {highlights.length > 0 ? (
            <ul className="mt-4 flex flex-wrap gap-2">
              {highlights.map((h) => (
                <li key={h}>
                  <Pill tone="orange">{h}</Pill>
                </li>
              ))}
            </ul>
          ) : null}
        </Section>
      ) : null}

      {hasAllocation ? (
        <Section
          icon={<GraduationCap className="size-5 text-sky-600" />}
          title="升中派位表現"
          subtitle="Secondary Allocation · 僅供參考"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {band1 && band1 !== "不適用" ? (
              <div className="rounded-2xl border border-sky-100 bg-sky-50/70 p-4">
                <p className="text-xs font-semibold tracking-wide text-sky-700 uppercase">
                  Band 1 預估比例
                </p>
                <p className="mt-2 font-[family-name:var(--font-display)] text-3xl font-bold text-slate-900">
                  {band1}
                </p>
              </div>
            ) : null}

            {feeders.length > 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold text-slate-500 uppercase">
                  直屬／聯繫中學
                </p>
                <ul className="mt-2 space-y-1 text-sm text-slate-800">
                  {feeders.map((s) => (
                    <li key={s}>· {s}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {destinations.length > 0 ? (
              <div className="rounded-2xl border border-orange-100 bg-orange-50/60 p-4 sm:col-span-2">
                <p className="text-xs font-semibold text-orange-700 uppercase">
                  常見名校去向
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {destinations.map((s) => (
                    <Pill key={s} tone="orange">
                      {s}
                    </Pill>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
          {school.secondary_allocation?.notes ? (
            <p className="mt-4 text-xs leading-relaxed text-slate-500">
              {school.secondary_allocation.notes}
            </p>
          ) : null}
        </Section>
      ) : null}

      {interviewQs.length > 0 ||
      interviewTips.length > 0 ||
      school.interview_prep?.format ? (
        <Section
          icon={<MessageSquareQuote className="size-5 text-emerald-600" />}
          title="歷年面試題庫"
          subtitle="Interview Prep · 常考題與應試 Tips"
        >
          {school.interview_prep?.format ? (
            <p className="mb-4 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
              {school.interview_prep.format}
            </p>
          ) : null}

          {interviewQs.length > 0 ? (
            <ol className="space-y-3">
              {interviewQs.map((q, i) => (
                <li
                  key={`${i}-${q.question.slice(0, 24)}`}
                  className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4"
                >
                  <p className="text-sm font-semibold text-slate-900">
                    <span className="mr-2 text-slate-400">Q{i + 1}.</span>
                    {q.question}
                  </p>
                  {q.tips ? (
                    <p className="mt-2 flex items-start gap-2 text-sm text-emerald-800">
                      <Lightbulb className="mt-0.5 size-3.5 shrink-0" />
                      {q.tips}
                    </p>
                  ) : null}
                </li>
              ))}
            </ol>
          ) : null}

          {interviewTips.length > 0 ? (
            <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
              <p className="text-xs font-semibold text-emerald-700 uppercase">
                應試 Tips
              </p>
              <ul className="mt-2 space-y-1.5 text-sm text-emerald-900">
                {interviewTips.map((tip) => (
                  <li key={tip.slice(0, 40)} className="flex gap-2">
                    <Lightbulb className="mt-0.5 size-3.5 shrink-0" />
                    <span className="whitespace-pre-wrap">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </Section>
      ) : null}

      {timeline.length > 0 || school.admission_info?.application_fee ? (
        <Section
          icon={<CalendarDays className="size-5 text-violet-600" />}
          title="入學 Timeline"
          subtitle="報名截止、面試及開放日"
        >
          {timeline.length > 0 ? (
            <ol className="relative space-y-0 border-l-2 border-violet-100 pl-5">
              {timeline.map((item, i) => (
                <li
                  key={`${item.label}-${i}`}
                  className="relative pb-6 last:pb-0"
                >
                  <span className="absolute top-1.5 -left-[1.4rem] size-2.5 rounded-full bg-violet-500 ring-4 ring-white" />
                  <p className="text-sm font-semibold text-slate-900">
                    {item.label}
                  </p>
                  {item.date ? (
                    <p className="mt-0.5 text-sm whitespace-pre-wrap text-violet-700">
                      {item.date}
                    </p>
                  ) : null}
                  {item.note ? (
                    <p className="mt-1 text-xs text-slate-500">{item.note}</p>
                  ) : null}
                </li>
              ))}
            </ol>
          ) : null}
          {school.admission_info?.application_fee ? (
            <p className="mt-3 text-sm text-slate-600">
              報名費：{school.admission_info.application_fee}
            </p>
          ) : null}
          {school.admission_info?.notes ? (
            <p className="mt-2 text-xs text-slate-500">
              {school.admission_info.notes}
            </p>
          ) : null}
        </Section>
      ) : null}

      <p className="text-center text-xs text-slate-400">
        資料僅供家長參考，實際安排以學校／教育局最新公布為準。
      </p>
    </div>
  );
}
