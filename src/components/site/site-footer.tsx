import Link from "next/link";
import { SITE_NAME } from "@/lib/site";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto border-t border-[var(--ink-border)] py-10">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 sm:flex-row sm:items-start sm:justify-between sm:px-6">
        <div>
          <p className="font-[family-name:var(--font-display)] text-lg text-[var(--ink-text)]">
            {SITE_NAME}
          </p>
          <p className="mt-1 max-w-sm text-sm leading-relaxed text-[var(--ink-muted)]">
            香港升學資訊：DSE 備考練習與 K3 選小學指南。學術練習用途，非官方教材。
          </p>
        </div>
        <div className="flex gap-8 text-sm">
          <div className="space-y-2">
            <p className="font-medium text-[var(--ink-text)]">專區</p>
            <Link
              href="/dse"
              className="block text-[var(--ink-muted)] transition hover:text-[var(--accent)]"
            >
              DSE 備考
            </Link>
            <Link
              href="/k3"
              className="block text-[var(--ink-faint)]"
            >
              K3 選小學
            </Link>
          </div>
          <div className="space-y-2">
            <p className="font-medium text-[var(--ink-text)]">DSE</p>
            <Link
              href="/dse/chinese"
              className="block text-[var(--ink-muted)] transition hover:text-[var(--accent)]"
            >
              中國語文
            </Link>
            <Link
              href="/dse/chinese/analects"
              className="block text-[var(--ink-muted)] transition hover:text-[var(--accent)]"
            >
              《論語》閃卡
            </Link>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-8 max-w-5xl px-4 text-xs text-[var(--ink-faint)] sm:px-6">
        © {year} {SITE_NAME}. 練習內容僅供參考，正式應試請以考評局／教育局公布為準。
      </div>
    </footer>
  );
}
