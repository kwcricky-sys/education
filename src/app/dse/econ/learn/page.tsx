import type { Metadata } from "next";
import Link from "next/link";
import EconUnitMap from "@/components/dse/econ-unit-map";
import { createPageMetadata } from "@/lib/page-metadata";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: `Learn DSE Economics Step by Step | ${SITE_NAME}`,
  description:
    "A structured HKDSE Economics course: 10 units from demand & supply to international trade. Lessons, worked examples and practice gates — pass each unit to unlock the next. Free.",
  path: "/dse/econ/learn",
  keywords: [
    "dse economics course",
    "dse econ notes",
    "learn dse economics",
    "econ study guide hong kong",
  ],
});

export default function EconLearnPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <nav className="mb-6 text-sm text-black/50">
        <Link href="/dse" className="hover:text-black/80">DSE</Link>
        <span className="mx-2">›</span>
        <Link href="/dse/econ" className="hover:text-black/80">Economics</Link>
        <span className="mx-2">›</span>
        <span>Learn</span>
      </nav>
      <h1 className="text-3xl font-bold">DSE Economics — Step-by-Step Course</h1>
      <p className="mt-3 leading-relaxed text-black/70">
        Work through the units in order. Each unit: read the lessons, then pass
        the practice set (≥7/10) to unlock what comes next. Progress is saved on
        your device only — no account, nothing leaves your browser.
      </p>
      <div className="mt-8">
        <EconUnitMap />
      </div>
    </div>
  );
}
