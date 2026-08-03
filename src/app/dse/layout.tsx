import type { Metadata } from "next";
import Link from "next/link";
import { Activity, ArrowLeft, BookMarked, BookOpen } from "lucide-react";
import { SiteFooter } from "@/components/site/site-footer";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute: `DSE 學習與備考專區 | ${SITE_NAME}`,
  },
  description: `${SITE_NAME}｜${SITE_TAGLINE}。DSE 中文科 12 篇指定文言經典閃卡刷題與備考資源。`,
};

export default function DseLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="dse-root dark flex min-h-screen flex-col text-zinc-100 antialiased">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <Link
            href="/dse"
            className="group flex items-center gap-3 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50"
          >
            <span className="font-[family-name:var(--font-display)] text-base font-extrabold tracking-tight text-cyan-400 sm:text-lg">
              {SITE_NAME}
            </span>
          </Link>

          <nav
            aria-label="DSE 專區導覽"
            className="flex items-center gap-1.5 sm:gap-2"
          >
            <Link
              href="/dse/chinese"
              className="hidden items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-zinc-400 transition-all duration-300 hover:bg-zinc-900 hover:text-zinc-100 sm:inline-flex"
            >
              <BookOpen className="size-3.5" />
              中文科
            </Link>
            <Link
              href="/dse/chinese/cat"
              className="hidden items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-zinc-400 transition-all duration-300 hover:bg-zinc-900 hover:text-zinc-100 md:inline-flex"
            >
              <Activity className="size-3.5" />
              診斷室
            </Link>
            <Link
              href="/dse/chinese/error-notebook"
              className="hidden items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-zinc-400 transition-all duration-300 hover:bg-zinc-900 hover:text-zinc-100 lg:inline-flex"
            >
              <BookMarked className="size-3.5" />
              錯題本
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-200 transition-all duration-300 hover:border-cyan-500/40 hover:bg-zinc-800 hover:text-zinc-100 sm:text-sm"
            >
              <ArrowLeft className="size-3.5 opacity-70" />
              返回首頁
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        {children}
      </main>

      <SiteFooter />
    </div>
  );
}
