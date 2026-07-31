import Link from "next/link";
import { ArrowRight, BookOpen, School } from "lucide-react";
import { createPageMetadata } from "@/lib/page-metadata";
import { SITE_NAME, SITE_NAME_EN } from "@/lib/site";

export const metadata = createPageMetadata({
  title: `${SITE_NAME}｜香港 K3 選小學與 DSE 備考學習平台`,
  description:
    "學途提供免費 DSE 中文指定範文閃卡練習（論語 60 題），並預留 K3 選小學資訊專區。結構清晰、適合持續擴充科目與選校工具。",
  path: "/",
  keywords: [
    "DSE",
    "DSE 中文",
    "論語",
    "指定範文",
    "K3 選小學",
    "香港升學",
    "閃卡",
  ],
});

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-16 pt-10 sm:px-6 sm:pt-16">
      <section className="relative min-h-[70vh] overflow-hidden border-b border-[var(--ink-border)] pb-16">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[120%] bg-[radial-gradient(ellipse_at_top,_rgba(15,118,110,0.14),_transparent_55%),linear-gradient(160deg,#1a2332_0%,#243044_45%,#0f766e_160%)] opacity-[0.08]"
        />
        <p className="anim-fade-up text-xs font-semibold tracking-[0.22em] text-[var(--accent)] uppercase">
          {SITE_NAME_EN}
        </p>
        <h1 className="anim-fade-up-delay mt-4 font-[family-name:var(--font-display)] text-5xl leading-[1.15] tracking-tight text-[var(--ink-text)] sm:text-6xl md:text-7xl">
          {SITE_NAME}
        </h1>
        <p className="anim-fade-up-delay-2 mt-5 max-w-xl text-lg leading-relaxed text-[var(--ink-muted)] sm:text-xl">
          從 K3 選小學到 DSE 備考——先把練習做對，再談升學下一步。
        </p>
        <div className="anim-fade-up-delay-2 mt-8 flex flex-wrap gap-3">
          <Link
            href="/dse"
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110"
          >
            開始 DSE 練習
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/dse/chinese/analects"
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--ink-border)] bg-white/50 px-5 py-3 text-sm font-semibold text-[var(--ink-text)] transition hover:border-[var(--accent)] hover:bg-white/80"
          >
            《論語》60 題閃卡
          </Link>
        </div>
      </section>

      <section className="grid gap-8 pt-14 sm:grid-cols-2">
        <article className="space-y-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
            <BookOpen className="size-5" />
          </div>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--ink-text)]">
            DSE 備考專區
          </h2>
          <p className="text-sm leading-relaxed text-[var(--ink-muted)]">
            沉浸式刷題介面，首發中文科指定範文《論語》論仁、論孝、論君子——60
            題三階極速閃卡，涵蓋字詞、通假、句譯與答題要點。
          </p>
          <Link
            href="/dse"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent)] transition hover:underline"
          >
            進入專區
            <ArrowRight className="size-3.5" />
          </Link>
        </article>

        <article className="space-y-3 opacity-80">
          <div className="flex size-11 items-center justify-center rounded-xl bg-[var(--ink-surface)] text-[var(--ink-faint)]">
            <School className="size-5" />
          </div>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--ink-text)]">
            K3 選小學
          </h2>
          <p className="text-sm leading-relaxed text-[var(--ink-muted)]">
            小一派位、學校比較與家長常見問題指南——架構已預留，內容即將上線。
          </p>
          <Link
            href="/k3"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--ink-faint)]"
          >
            預覽專區 · Coming Soon
          </Link>
        </article>
      </section>
    </div>
  );
}
