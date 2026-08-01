import Link from "next/link";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";
import { PRIMARY_NAV } from "@/lib/nav";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--ink-border)]/80 bg-[color-mix(in_srgb,var(--ink-bg)_78%,transparent)] backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="group flex min-w-0 items-center gap-3 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[var(--ink-text)] font-[family-name:var(--font-display)] text-sm font-bold text-white shadow-sm transition group-hover:scale-[1.03]">
            途
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block font-[family-name:var(--font-display)] text-base font-bold tracking-tight text-[var(--ink-text)] sm:text-lg">
              {SITE_NAME}
            </span>
            <span className="block truncate text-[11px] text-[var(--ink-muted)] sm:text-xs">
              {SITE_TAGLINE}
            </span>
          </span>
        </Link>

        <nav aria-label="主要導覽" className="flex items-center gap-1 sm:gap-1.5">
          {PRIMARY_NAV.map((item) =>
            item.open ? (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-3 py-1.5 text-sm font-medium text-[var(--ink-muted)] transition hover:bg-white hover:text-[var(--ink-text)] hover:shadow-sm"
              >
                {item.label}
              </Link>
            ) : (
              <span
                key={item.href}
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-[var(--ink-faint)]"
                title="即將推出"
              >
                {item.label}
                <span className="rounded-full bg-[var(--ink-border)] px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-[var(--ink-muted)] uppercase">
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
