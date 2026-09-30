"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { HEADER_CTA, SITE_NAV, isNavItemActive } from "@/lib/nav";

export function SiteHeader() {
  const pathname = usePathname() ?? "/";

  return (
    <header className="sticky top-0 z-50 bg-navy text-cream print:hidden">
      <div className="mx-auto flex h-16 w-full max-w-[1160px] items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          aria-label="DSE.hack 首頁"
          className="flex shrink-0 items-baseline gap-2.5 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          <span className="font-[family-name:var(--font-brand)] text-[1.35rem] leading-none font-extrabold tracking-tight">
            <span className="text-cream">DSE</span>
            <span className="text-gold">.hack</span>
          </span>
          <span className="hidden font-[family-name:var(--font-serif-zh)] text-sm font-semibold tracking-wide text-cream/70 sm:inline">
            DSE 自修室
          </span>
        </Link>

        <nav aria-label="主要導覽" className="hidden items-center gap-0.5 lg:flex">
          {SITE_NAV.map((item) => {
            const active = isNavItemActive(item, pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-full px-3 py-2 text-sm font-semibold transition-colors lg:px-3.5",
                  active
                    ? "bg-cream/10 text-cream"
                    : "text-cream/75 hover:text-cream",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Link
          href={HEADER_CTA.href}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-gold px-4 py-2 text-sm font-extrabold text-navy transition-colors hover:bg-gold-strong focus-visible:ring-2 focus-visible:ring-cream focus-visible:outline-none"
        >
          <Activity className="size-4" aria-hidden />
          {HEADER_CTA.label}
        </Link>
      </div>

      <nav
        aria-label="科目導覽"
        className="border-t border-cream/10 lg:hidden"
      >
        <ul className="mx-auto flex max-w-[1160px] justify-between gap-0.5 overflow-x-auto px-2 py-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {SITE_NAV.map((item) => {
            const active = isNavItemActive(item, pathname);
            return (
              <li key={item.href} className="shrink-0">
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "inline-flex rounded-full px-2.5 py-1.5 text-[13px] font-semibold transition-colors",
                    active
                      ? "bg-gold text-navy"
                      : "text-cream/80 hover:text-cream",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
