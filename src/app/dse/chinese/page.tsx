import Link from "next/link";
import { ArrowLeft, ArrowRight, Lock } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { CHINESE_PRESCRIBED_TEXTS } from "@/lib/dse/analects";
import { createPageMetadata } from "@/lib/page-metadata";
import { buildBreadcrumbJsonLd } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site";

export const metadata = createPageMetadata({
  title: `DSE 中文科指定範文 · 12 篇總覽 | ${SITE_NAME}`,
  description:
    "DSE 中國語文指定文言經典 12 篇列表。現已開放《論語》論仁、論孝、論君子 60 題極速閃卡刷題。",
  path: "/dse/chinese",
  keywords: ["DSE 中文", "指定範文", "論語", "文言", "卷一"],
});

export default function DseChinesePage() {
  return (
    <div className="space-y-8">
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "首頁", path: "/" },
          { name: "DSE 備考", path: "/dse" },
          { name: "中國語文", path: "/dse/chinese" },
        ])}
      />

      <div>
        <Link
          href="/dse"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 transition hover:text-teal-300"
        >
          <ArrowLeft className="size-3.5" />
          科目總覽
        </Link>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-zinc-50">
          中國語文 · 指定範文
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-zinc-400">
          以下為 12
          篇指定文言經典學習材料列表。目前開放第一篇《論語》（論仁、論孝、論君子）極速閃卡練習，其餘篇章標示
          Coming Soon，之後可按 slug 獨立上線。
        </p>
      </div>

      <ol className="space-y-2">
        {CHINESE_PRESCRIBED_TEXTS.map((text, i) => {
          const body = (
            <>
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-zinc-800 text-sm font-semibold tabular-nums text-zinc-300">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-zinc-100">
                    {text.title}
                  </span>
                  <span className="text-xs text-zinc-500">{text.source}</span>
                  {text.open ? (
                    <span className="rounded-md bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-300 ring-1 ring-emerald-400/25">
                      可練習
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-md bg-zinc-800 px-2 py-0.5 text-[10px] font-medium text-zinc-500">
                      <Lock className="size-2.5" />
                      Coming Soon
                    </span>
                  )}
                </span>
                <span className="mt-1 block text-sm text-zinc-500">
                  {text.blurb}
                </span>
              </span>
              {text.open ? (
                <ArrowRight className="size-4 shrink-0 text-teal-300" />
              ) : null}
            </>
          );

          if (text.open && text.href) {
            return (
              <li key={text.slug}>
                <Link
                  href={text.href}
                  className="flex items-center gap-4 rounded-2xl border border-teal-500/25 bg-teal-500/5 px-4 py-4 transition hover:border-teal-400/45 hover:bg-teal-500/10 sm:px-5"
                >
                  {body}
                </Link>
              </li>
            );
          }

          return (
            <li key={text.slug}>
              <div className="flex items-center gap-4 rounded-2xl border border-zinc-800/80 bg-zinc-900/40 px-4 py-4 opacity-80 sm:px-5">
                {body}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
