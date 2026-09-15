import Link from "next/link";
import {
  CONTACT_EMAIL,
  LEGAL_DISCLAIMER,
  SITE_NAME,
  SITE_TAGLINE_FULL,
} from "@/lib/site";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto border-t border-white/10 bg-zinc-950 py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-[family-name:var(--font-display)] text-xl font-extrabold tracking-tight text-zinc-100">
              {SITE_NAME}
            </p>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-zinc-400">
              {SITE_TAGLINE_FULL}
            </p>
            <p className="mt-4 text-sm text-zinc-400">
              聯絡我們：{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="font-medium text-cyan-400 transition-colors duration-300 hover:text-cyan-300 hover:underline"
              >
                {CONTACT_EMAIL}
              </a>
            </p>
          </div>

          <div className="flex flex-wrap gap-10 text-sm">
            <div className="space-y-2.5">
              <p className="text-xs font-semibold tracking-wider text-zinc-500">
                產品
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
              <Link
                href="/dse/jupas"
                className="block font-medium text-zinc-400 transition-colors duration-300 hover:text-cyan-400"
              >
                JUPAS 揀科指南
              </Link>
              <Link
                href="/dse/videos"
                className="block font-medium text-zinc-400 transition-colors duration-300 hover:text-cyan-400"
              >
                溫習片庫
              </Link>
              <Link
                href="/dse/english/learn"
                className="block font-medium text-zinc-400 transition-colors duration-300 hover:text-cyan-400"
              >
                English 自學路徑
              </Link>
              <Link
                href="/guides/dse-buxi"
                className="block font-medium text-zinc-400 transition-colors duration-300 hover:text-cyan-400"
              >
                DSE 補習指南
              </Link>
            </div>
            <div className="space-y-2.5">
              <p className="text-xs font-semibold tracking-wider text-zinc-500">
                法律資訊
              </p>
              <Link
                href="/privacy"
                className="block font-medium text-zinc-400 transition-colors duration-300 hover:text-cyan-400"
              >
                私隱政策
              </Link>
              <Link
                href="/terms"
                className="block font-medium text-zinc-400 transition-colors duration-300 hover:text-cyan-400"
              >
                使用條款
              </Link>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="block font-medium text-zinc-400 transition-colors duration-300 hover:text-cyan-400"
              >
                聯絡我們
              </a>
            </div>
          </div>
        </div>

        <p className="text-xs leading-relaxed text-zinc-500">
          {LEGAL_DISCLAIMER}
        </p>

        <div className="flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {SITE_NAME}. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/privacy"
              className="transition-colors duration-300 hover:text-zinc-300"
            >
              私隱政策
            </Link>
            <Link
              href="/terms"
              className="transition-colors duration-300 hover:text-zinc-300"
            >
              使用條款
            </Link>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="transition-colors duration-300 hover:text-zinc-300"
            >
              {CONTACT_EMAIL}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
