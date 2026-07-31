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
import { SITE_NAME } from "@/lib/site";

export const metadata = createPageMetadata({
  title: `DSE 學習與備考專區（DSE Study Hub）| ${SITE_NAME}`,
  description:
    "沉浸式學術介面的 DSE 備考專區。先開放中文科指定範文《論語》60 題極速閃卡，其餘科目陸續推出。",
  path: "/dse",
  keywords: ["DSE", "DSE 備考", "中文科", "論語", "閃卡", "Study Hub"],
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

      <section className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-950 to-teal-950/40 px-6 py-10 sm:px-10 sm:py-14">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-teal-500/10 blur-3xl"
        />
        <p className="text-xs font-semibold tracking-[0.2em] text-teal-300/80 uppercase">
          Academic Immersion
        </p>
        <h1 className="mt-3 max-w-2xl font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
          DSE 學習與備考專區
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg">
          專注閱讀與刷題節奏的沉浸式介面。現階段先開放中文科指定範文練習，其餘科目標示
          Coming Soon，方便日後按科目擴充。
        </p>
        <Link
          href="/dse/chinese"
          className="mt-7 inline-flex items-center gap-2 rounded-xl bg-teal-500 px-5 py-2.5 text-sm font-semibold text-zinc-950 shadow-lg shadow-teal-500/20 transition hover:bg-teal-400"
        >
          進入中文科
          <ArrowRight className="size-4" />
        </Link>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-zinc-100">科目總覽</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {DSE_SUBJECTS.map((s) => {
            const Icon = ICONS[s.id as keyof typeof ICONS] ?? BookMarked;
            const inner = (
              <>
                <span className="flex size-10 items-center justify-center rounded-xl bg-teal-500/10 text-teal-300 ring-1 ring-teal-400/20">
                  <Icon className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="font-semibold text-zinc-100">{s.name}</span>
                    {!s.open ? (
                      <span className="rounded-md bg-zinc-800 px-2 py-0.5 text-[10px] font-medium tracking-wide text-zinc-400 uppercase">
                        Coming Soon
                      </span>
                    ) : (
                      <span className="rounded-md bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-300 ring-1 ring-emerald-400/25">
                        Open
                      </span>
                    )}
                  </span>
                  <span className="mt-0.5 block text-xs text-zinc-500">
                    {s.nameEn}
                  </span>
                  <span className="mt-2 block text-sm text-zinc-400">
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
                  className="flex items-start gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 transition hover:border-teal-400/35 hover:bg-zinc-900"
                >
                  {inner}
                </Link>
              );
            }

            return (
              <div
                key={s.id}
                className="flex items-start gap-4 rounded-2xl border border-zinc-800/70 bg-zinc-900/30 p-5 opacity-75"
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
