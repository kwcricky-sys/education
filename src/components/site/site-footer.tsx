import Link from "next/link";
import { SITE_NAME, SITE_TAGLINE_FULL } from "@/lib/site";

/** Sister primary-school product */
const PRIMARY_NAV_URL = "https://primary.studypath.hk";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto border-t border-white/10 bg-zinc-950 py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 sm:flex-row sm:items-start sm:justify-between sm:px-6">
        <div>
          <p className="font-[family-name:var(--font-display)] text-xl font-extrabold tracking-tight text-zinc-100">
            {SITE_NAME}
          </p>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-zinc-400">
            {SITE_TAGLINE_FULL}
          </p>
        </div>
        <div className="flex gap-10 text-sm">
          <div className="space-y-2.5">
            <p className="text-xs font-semibold tracking-wider text-zinc-500 uppercase">
              Product
            </p>
            <Link
              href="/dse"
              className="block font-medium text-zinc-400 transition-colors duration-300 hover:text-cyan-400"
            >
              DSE 備考
            </Link>
            <Link
              href="/dse/chinese"
              className="block font-medium text-zinc-400 transition-colors duration-300 hover:text-cyan-400"
            >
              範文 Flashcards
            </Link>
            <Link
              href="/dse/chinese/cat"
              className="block font-medium text-zinc-400 transition-colors duration-300 hover:text-cyan-400"
            >
              CAT 診斷室
            </Link>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-8 max-w-6xl px-4 sm:px-6">
        <p className="rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm leading-relaxed text-zinc-400">
          家有 K3 幼兒？造訪我們的{" "}
          <a
            href={PRIMARY_NAV_URL}
            className="font-semibold text-cyan-400 underline-offset-2 hover:underline"
            rel="noopener noreferrer"
          >
            升小指南 PrimaryNav →
          </a>
        </p>
      </div>
      <div className="mx-auto mt-6 max-w-6xl px-4 text-xs text-zinc-500 sm:px-6">
        © {year} {SITE_NAME}. 練習內容僅供參考，正式應試請以考評局／教育局公布為準。
      </div>
    </footer>
  );
}
