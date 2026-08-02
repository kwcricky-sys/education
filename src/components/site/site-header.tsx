import Link from "next/link";
import { SITE_NAME } from "@/lib/site";
import { PRIMARY_NAV } from "@/lib/nav";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="group flex min-w-0 items-center gap-3 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 font-[family-name:var(--font-display)] text-sm font-extrabold text-cyan-400 ring-1 ring-cyan-400/25 transition group-hover:scale-[1.03]">
            H
          </span>
          <span className="min-w-0 leading-tight">
            <span className="flex items-center gap-2">
              <span className="font-[family-name:var(--font-display)] text-base font-bold tracking-tight text-zinc-100 sm:text-lg">
                {SITE_NAME}
              </span>
              <span className="hidden items-center gap-1 rounded-md bg-cyan-400/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-cyan-400 sm:inline-flex">
                ⚡️ AI Powered
              </span>
            </span>
            <span className="mt-0.5 block truncate text-[11px] text-zinc-500 sm:text-xs">
              EdTech AI Lab
            </span>
          </span>
        </Link>

        <nav aria-label="主要導覽" className="flex items-center gap-0.5 sm:gap-1">
          {PRIMARY_NAV.map((item) =>
            item.open ? (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-zinc-400 transition-all duration-300 hover:bg-zinc-900 hover:text-zinc-100 sm:px-3 sm:text-sm"
              >
                {item.label}
              </Link>
            ) : (
              <span
                key={item.href}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-zinc-600"
                title="即將推出"
              >
                {item.label}
                <span className="rounded-md bg-zinc-900 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-zinc-500 uppercase">
                  Soon
                </span>
              </span>
            ),
          )}
        </nav>
      </div>
    </header>
  );
}
