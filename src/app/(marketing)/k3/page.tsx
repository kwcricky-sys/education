import Link from "next/link";
import { ArrowLeft, School } from "lucide-react";
import { createPageMetadata } from "@/lib/page-metadata";
import { SITE_NAME } from "@/lib/site";

export const metadata = createPageMetadata({
  title: `K3 選小學指南（即將推出）| ${SITE_NAME}`,
  description:
    "學途 K3 選小學專區即將上線：小一派位資訊、學校比較與家長常見問題。現階段請先使用 DSE 備考練習。",
  path: "/k3",
  keywords: ["K3", "選小學", "小一派位", "香港小學"],
  robots: { index: true, follow: true },
});

export default function K3ComingSoonPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--ink-muted)] transition hover:text-[var(--accent)]"
      >
        <ArrowLeft className="size-3.5" />
        返回首頁
      </Link>

      <div className="mt-10 max-w-xl">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-[var(--ink-surface)] text-[var(--ink-muted)]">
          <School className="size-7" />
        </div>
        <h1 className="mt-6 font-[family-name:var(--font-display)] text-4xl tracking-tight text-[var(--ink-text)]">
          K3 選小學
        </h1>
        <p className="mt-4 text-base leading-relaxed text-[var(--ink-muted)]">
          此專區將收錄小一派位、學校資料比較與家長決策指南。架構已預留於網站導覽與
          sitemap，內容開發中。
        </p>
        <p className="mt-3 text-sm text-[var(--ink-faint)]">Coming Soon</p>
        <Link
          href="/dse"
          className="mt-8 inline-flex rounded-xl bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110"
        >
          先練習 DSE
        </Link>
      </div>
    </div>
  );
}
