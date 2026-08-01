import Link from "next/link";
import {
  ArrowRight,
  BookMarked,
  Clock3,
  Languages,
  Sparkles,
} from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { DSE_SUBJECTS } from "@/lib/dse/subjects";
import { createPageMetadata } from "@/lib/page-metadata";
import { buildBreadcrumbJsonLd } from "@/lib/seo";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";

export const metadata = createPageMetadata({
  title: `DSE 學習與備考專區 | ${SITE_NAME}`,
  description: `${SITE_NAME}｜${SITE_TAGLINE}。中文科 12 篇指定文言經典閃卡已上線，其餘科目陸續推出。`,
  path: "/dse",
  keywords: ["DSE", "DSE 備考", "中文科", "指定範文", "閃卡", "學途"],
});

const ICONS = {
  chinese: Languages,
  english: BookMarked,
  math: Sparkles,
  others: Clock3,
} as const;

export default function DseHomePage() {
  return (
    <div className="space-y-12">
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "首頁", path: "/" },
          { name: "DSE 備考", path: "/dse" },
        ])}
      />

      <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-900/80 via-[#0b1220] to-sky-950/50 px-6 py-12 sm:px-12 sm:py-16">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-sky-400/15 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-16 left-10 size-56 rounded-full bg-orange-400/10 blur-3xl"
        />
        <p className="relative text-xs font-semibold tracking-[0.22em] text-sky-300/90 uppercase">
          Study Studio
        </p>
        <h1 className="relative mt-3 max-w-2xl font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-white sm:text-5xl">
          DSE 學習與備考專區
        </h1>
        <p className="relative mt-4 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
          {SITE_TAGLINE}
          ——專注刷題節奏。中文科 12 篇指定範文閃卡已全部開放；其餘科目 Coming
          Soon。
        </p>
        <Link
          href="/dse/chinese"
          className="relative mt-8 inline-flex items-center gap-2 rounded-2xl bg-sky-400 px-5 py-3 text-sm font-bold text-slate-950 shadow-[0_12px_40px_rgba(56,189,248,0.28)] transition hover:bg-sky-300"
        >
          進入中文科
          <ArrowRight className="size-4" />
        </Link>
      </section>

      <section className="space-y-4">
        <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-white">
          科目總覽
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {DSE_SUBJECTS.map((s) => {
            const Icon = ICONS[s.id as keyof typeof ICONS] ?? BookMarked;
            const inner = (
              <>
                <span className="flex size-11 items-center justify-center rounded-2xl bg-sky-400/10 text-sky-300 ring-1 ring-sky-400/20">
                  <Icon className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="font-semibold text-white">{s.name}</span>
                    {!s.open ? (
                      <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-slate-500 uppercase">
                        Soon
                      </span>
                    ) : (
                      <span className="rounded-full bg-emerald-400/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-300 ring-1 ring-emerald-400/25">
                        Open
                      </span>
                    )}
                  </span>
                  <span className="mt-0.5 block text-xs text-slate-500">
                    {s.nameEn}
                  </span>
                  <span className="mt-2 block text-sm text-slate-400">
                    {s.desc}
                  </span>
                </span>
                {s.open ? (
                  <ArrowRight className="size-4 shrink-0 text-slate-500" />
                ) : null}
              </>
            );

            if (s.open && s.href) {
              return (
                <Link
                  key={s.id}
                  href={s.href}
                  className="panel-lift flex items-start gap-4 rounded-2xl border border-white/8 bg-white/[0.03] p-5 transition hover:border-sky-400/35 hover:bg-white/[0.06]"
                >
                  {inner}
                </Link>
              );
            }

            return (
              <div
                key={s.id}
                className="flex items-start gap-4 rounded-2xl border border-white/5 bg-white/[0.02] p-5 opacity-70"
              >
                {inner}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
