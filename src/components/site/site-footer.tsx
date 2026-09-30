import Link from "next/link";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import {
  CONTACT_EMAIL,
  HKEAA_URL,
  LEGAL_DISCLAIMER,
  SISTER_SITE,
  SITE_NAME,
  SITE_TAGLINE_FULL,
} from "@/lib/site";

const FOOTER_COLUMNS = [
  {
    title: "溫書",
    links: [
      { href: "/dse", label: "DSE 學習專區" },
      { href: "/dse/chinese", label: "中文範文閃卡" },
      { href: "/dse/chinese/cat", label: "中文診斷室" },
      { href: "/dse/chinese/error-notebook", label: "錯題本" },
      { href: "/dse/english/learn", label: "English 自學路徑" },
      { href: "/dse/econ/learn", label: "ECON Learn Mode" },
      { href: "/dse/math/learn", label: "數學自學路徑" },
      { href: "/dse/bafs/learn", label: "BAFS 自學路徑" },
      { href: "/dse/videos", label: "溫習片庫" },
    ],
  },
  {
    title: "升學",
    links: [
      { href: "/dse/jupas", label: "JUPAS 揀科指南" },
      { href: "/dse/jupas/compare", label: "課程比較工具" },
      { href: "/guides/dse-buxi", label: "DSE 補習選擇指南" },
    ],
  },
  {
    title: "條款",
    links: [
      { href: "/privacy", label: "私隱政策" },
      { href: "/terms", label: "使用條款" },
    ],
  },
] as const;

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto border-t border-line bg-cream print:hidden">
      <div className="mx-auto grid w-full max-w-[1160px] gap-10 px-4 py-14 sm:px-6 md:grid-cols-[minmax(0,1.3fr)_repeat(3,minmax(0,1fr))]">
        <div>
          <p className="font-[family-name:var(--font-brand)] text-xl font-extrabold tracking-tight text-navy">
            DSE<span className="text-gold-ink">.hack</span>
          </p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-muted">
            {SITE_TAGLINE_FULL}
          </p>
          <p className="mt-4 text-sm text-ink-muted">
            聯絡：
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="font-semibold text-navy underline-offset-2 hover:underline"
            >
              {CONTACT_EMAIL}
            </a>
          </p>
        </div>

        {FOOTER_COLUMNS.map((col) => (
          <div key={col.title}>
            <p className="text-xs font-bold tracking-[0.16em] text-ink-faint">
              {col.title}
            </p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-ink-muted transition-colors hover:text-navy"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mx-auto grid w-full max-w-[1160px] gap-3 px-4 pb-10 sm:px-6 md:grid-cols-2">
        <div className="flex items-start gap-3 rounded-2xl border border-line bg-white p-4">
          <ShieldCheck className="mt-0.5 size-5 shrink-0 text-gold-ink" aria-hidden />
          <p className="text-sm leading-relaxed text-ink-muted">
            <span className="font-semibold text-navy">以考評局官網為準。</span>
            本站題目同講解屬溫習參考，考試範圍、評分標準同日程請核對{" "}
            <a
              href={HKEAA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-navy underline underline-offset-2"
            >
              香港考試及評核局
            </a>
            。
          </p>
        </div>
        <a
          href={SISTER_SITE.url}
          target="_blank"
          rel="noopener"
          className="group flex items-start gap-3 rounded-2xl border border-line bg-white p-4 transition-colors hover:border-navy/40"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-navy font-[family-name:var(--font-serif-zh)] text-sm font-bold text-gold">
            升
          </span>
          <span className="min-w-0 flex-1 text-sm leading-relaxed text-ink-muted">
            <span className="block text-xs font-bold tracking-[0.16em] text-ink-faint">
              姊妹網站
            </span>
            <span className="font-semibold text-navy">{SISTER_SITE.name}</span>
            ：{SISTER_SITE.blurb}
          </span>
          <ArrowUpRight
            className="mt-1 size-4 shrink-0 text-ink-faint transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            aria-hidden
          />
        </a>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex w-full max-w-[1160px] flex-col gap-3 px-4 py-6 text-xs leading-relaxed text-ink-faint sm:px-6">
          <p>{LEGAL_DISCLAIMER}</p>
          <p>
            © {year} {SITE_NAME}
          </p>
        </div>
      </div>
    </footer>
  );
}
