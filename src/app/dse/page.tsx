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

      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900 px-6 py-12 shadow-lg sm:px-12 sm:py-16">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-cyan-400/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-16 left-10 size-56 rounded-full bg-orange-400/8 blur-3xl"
        />
        <p className="relative text-xs font-semibold tracking-[0.22em] text-cyan-400 uppercase">
          Study Studio
        </p>
        <h1 className="relative mt-3 max-w-2xl font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-zinc-100 sm:text-5xl">
          DSE 學習與備考專區
        </h1>
        <p className="relative mt-4 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg">
          {SITE_TAGLINE}
          ——專注刷題節奏。中文科 12 篇指定範文閃卡已全部開放；其餘科目 Coming
          Soon。
        </p>
        <div className="relative mt-8 flex flex-wrap gap-3">
          <Link
            href="/dse/chinese"
            className="inline-flex items-center gap-2 rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-bold text-zinc-950 shadow-lg shadow-cyan-400/20 transition-all duration-300 hover:bg-cyan-300"
          >
            進入中文科
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/dse/chinese/cat"
            className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-zinc-800/50 px-5 py-3 text-sm font-semibold text-zinc-200 transition-all duration-300 hover:border-cyan-500/40 hover:bg-zinc-800"
          >
            範文 AI 診斷室
          </Link>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-zinc-100">
          科目總覽
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {DSE_SUBJECTS.map((s) => {
            const Icon = ICONS[s.id as keyof typeof ICONS] ?? BookMarked;
            const inner = (
              <>
                <span className="flex size-11 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400 ring-1 ring-cyan-400/20">
                  <Icon className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="font-semibold text-zinc-100">{s.name}</span>
                    {!s.open ? (
                      <span className="rounded-md bg-zinc-800 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-zinc-500 uppercase">
                        Soon
                      </span>
                    ) : (
                      <span className="rounded-md bg-emerald-400/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                        Open
                      </span>
                    )}
                  </span>
                  <span className="mt-0.5 block text-xs text-zinc-500">
                    {s.nameEn}
                  </span>
                  <span className="mt-2 block text-sm leading-relaxed text-zinc-400">
                    {s.desc}
                  </span>
                </span>
                {s.open ? (
                  <ArrowRight className="size-4 shrink-0 text-zinc-500" />
                ) : null}
              </>
            );

            if (s.open && s.href) {
              return (
                <Link
                  key={s.id}
                  href={s.href}
                  className="flex items-start gap-4 rounded-xl border border-white/5 bg-zinc-900 p-5 shadow-lg transition-all duration-300 hover:border-white/10 hover:bg-zinc-800"
                >
                  {inner}
                </Link>
              );
            }

            return (
              <div
                key={s.id}
                className="flex items-start gap-4 rounded-xl border border-white/5 bg-zinc-900/60 p-5 opacity-70"
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
