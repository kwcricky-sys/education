import Link from "next/link";
import { SITE_NAME, SITE_NAME_EN } from "@/lib/site";
import { PRIMARY_NAV } from "@/lib/nav";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--ink-border)] bg-[color-mix(in_srgb,var(--ink-bg)_88%,transparent)] backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4 sm:h-16 sm:px-6">
        <Link
          href="/"
          className="group flex items-baseline gap-2 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        >
          <span className="font-[family-name:var(--font-display)] text-xl tracking-tight text-[var(--ink-text)] sm:text-2xl">
            {SITE_NAME}
          </span>
          <span className="hidden text-xs font-medium tracking-[0.14em] text-[var(--ink-muted)] uppercase sm:inline">
            {SITE_NAME_EN}
          </span>
        </Link>

        <nav aria-label="主要導覽" className="flex items-center gap-1 sm:gap-2">
          {PRIMARY_NAV.map((item) =>
            item.open ? (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-2.5 py-1.5 text-sm text-[var(--ink-muted)] transition hover:bg-[var(--ink-surface)] hover:text-[var(--ink-text)]"
              >
                {item.label}
              </Link>
            ) : (
              <span
                key={item.href}
                className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-[var(--ink-faint)]"
                title="即將推出"
              >
                {item.label}
                <span className="text-[10px] tracking-wide uppercase">Soon</span>
              </span>
            ),
          )}
        </nav>
      </div>
    </header>
  );
}
