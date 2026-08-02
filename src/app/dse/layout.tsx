import type { Metadata } from "next";
import Link from "next/link";
import { Activity, ArrowLeft, BookMarked, BookOpen } from "lucide-react";
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
    <div className="dse-root dark min-h-screen text-slate-100 antialiased">
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#070a12]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <Link
            href="/dse"
            className="group flex items-center gap-3 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60"
          >
            <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-sky-500 font-[family-name:var(--font-display)] text-sm font-extrabold text-slate-950 shadow-[0_0_24px_rgba(0,242,254,0.35)]">
              H
            </span>
            <span className="flex flex-col leading-tight">
              <span className="font-[family-name:var(--font-display)] text-sm font-bold tracking-tight text-white sm:text-[15px]">
                {SITE_NAME}
              </span>
              <span className="hidden text-[11px] text-slate-500 sm:block">
                {SITE_TAGLINE}
              </span>
            </span>
          </Link>

          <nav
            aria-label="DSE 專區導覽"
            className="flex items-center gap-1.5 sm:gap-2"
          >
            <Link
              href="/dse/chinese"
              className="hidden items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white sm:inline-flex"
            >
              <BookOpen className="size-3.5" />
              中文科
            </Link>
            <Link
              href="/dse/chinese/cat"
              className="hidden items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white md:inline-flex"
            >
              <Activity className="size-3.5" />
              診斷室
            </Link>
            <Link
              href="/dse/chinese/error-notebook"
              className="hidden items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white lg:inline-flex"
            >
              <BookMarked className="size-3.5" />
              錯題本
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:border-sky-400/40 hover:bg-sky-400/10 hover:text-white sm:text-sm"
            >
              <ArrowLeft className="size-3.5 opacity-70" />
              返回首頁
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        {children}
      </main>

      <footer className="border-t border-white/5 py-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            © {new Date().getFullYear()} {SITE_NAME} · {SITE_TAGLINE}
          </p>
          <p className="text-xs text-slate-600">
            學術練習用途 · 非考評局官方教材
          </p>
        </div>
      </footer>
    </div>
  );
}
