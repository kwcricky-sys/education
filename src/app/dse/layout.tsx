import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, BookOpen, GraduationCap } from "lucide-react";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute: `DSE 學習與備考專區 | ${SITE_NAME}`,
  },
  description:
    "學途 DSE Study Hub：沉浸式學術介面，中文科指定範文《論語》閃卡刷題與備考資源。",
};

export default function DseLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="dse-root dark min-h-screen bg-zinc-950 text-zinc-100 antialiased">
      <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/85 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-6">
          <Link
            href="/dse"
            className="group flex items-center gap-2.5 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-teal-400/60"
          >
            <span className="flex size-8 items-center justify-center rounded-lg bg-teal-500/15 text-teal-300 ring-1 ring-teal-400/25">
              <GraduationCap className="size-4" />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-[11px] font-medium tracking-wider text-zinc-500 uppercase">
                {SITE_NAME}
              </span>
              <span className="text-sm font-semibold tracking-tight text-zinc-100 sm:text-[15px]">
                DSE Study Hub
              </span>
            </span>
          </Link>

          <nav
            aria-label="DSE 專區導覽"
            className="flex items-center gap-1.5 sm:gap-2"
          >
            <Link
              href="/dse/chinese"
              className="hidden items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-zinc-400 transition hover:bg-zinc-800/80 hover:text-zinc-100 sm:inline-flex"
            >
              <BookOpen className="size-3.5" />
              中文科
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700/80 bg-zinc-900/80 px-3 py-1.5 text-xs font-medium text-zinc-200 shadow-sm transition hover:border-teal-400/40 hover:bg-zinc-800 hover:text-white sm:text-sm"
            >
              <ArrowLeft className="size-3.5 opacity-70" />
              返回首頁
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        {children}
      </main>

      <footer className="border-t border-zinc-800/80 py-8">
        <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            © {new Date().getFullYear()} {SITE_NAME} · DSE 學習專區
          </p>
          <p className="text-xs text-zinc-600">
            學術練習用途 · 非考評局官方教材
          </p>
        </div>
      </footer>
    </div>
  );
}
