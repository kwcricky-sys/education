import Link from "next/link";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";

/** Sister primary-school product */
const PRIMARY_NAV_URL = "https://primary.studypath.hk";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto border-t border-[var(--ink-border)] bg-white/50 py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 sm:flex-row sm:items-start sm:justify-between sm:px-6">
        <div>
          <p className="font-[family-name:var(--font-display)] text-xl font-bold tracking-tight text-[var(--ink-text)]">
            {SITE_NAME}
          </p>
          <p className="mt-1 text-sm font-medium text-[var(--accent-strong)]">
            {SITE_TAGLINE}
          </p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-[var(--ink-muted)]">
            專注 DSE 備考練習與閃卡診斷。學術練習用途，非官方教材。
          </p>
        </div>
        <div className="flex gap-10 text-sm">
          <div className="space-y-2.5">
            <p className="text-xs font-semibold tracking-wider text-[var(--ink-faint)] uppercase">
              DSE
            </p>
            <Link
              href="/dse"
              className="block font-medium text-[var(--ink-muted)] transition hover:text-[var(--accent-strong)]"
            >
              DSE 備考
            </Link>
            <Link
              href="/dse/chinese"
              className="block font-medium text-[var(--ink-muted)] transition hover:text-[var(--accent-strong)]"
            >
              中國語文 · 12 篇範文
            </Link>
            <Link
              href="/dse/chinese/cat"
              className="block font-medium text-[var(--ink-muted)] transition hover:text-[var(--accent-strong)]"
            >
              範文 AI 診斷室
            </Link>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-8 max-w-6xl px-4 sm:px-6">
        <p className="rounded-xl border border-orange-100 bg-orange-50/80 px-4 py-3 text-sm text-stone-700">
          家有 K3 幼兒？造訪我們的{" "}
          <a
            href={PRIMARY_NAV_URL}
            className="font-semibold text-orange-700 underline-offset-2 hover:underline"
            rel="noopener noreferrer"
          >
            升小指南 PrimaryNav ➔
          </a>
        </p>
      </div>
      <div className="mx-auto mt-6 max-w-6xl px-4 text-xs text-[var(--ink-faint)] sm:px-6">
        © {year} {SITE_NAME}. 練習內容僅供參考，正式應試請以考評局／教育局公布為準。
      </div>
    </footer>
  );
}
