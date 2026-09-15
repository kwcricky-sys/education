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
    <footer className="mt-auto border-t border-slate-200 bg-white py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-[family-name:var(--font-display)] text-xl font-extrabold tracking-tight text-slate-900">
              {SITE_NAME}
            </p>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-600">
              {SITE_TAGLINE_FULL}
            </p>
            <p className="mt-4 text-sm text-slate-600">
              聯絡我們：{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="font-medium text-blue-700 transition-colors duration-300 hover:text-blue-600 hover:underline"
              >
                {CONTACT_EMAIL}
              </a>
            </p>
          </div>

          <div className="flex flex-wrap gap-10 text-sm">
            <div className="space-y-2.5">
              <p className="text-xs font-semibold tracking-wider text-slate-500">
                產品
              </p>
              <Link
                href="/dse"
                className="block font-medium text-slate-600 transition-colors duration-300 hover:text-blue-700"
              >
                DSE 備考
              </Link>
              <Link
                href="/dse/chinese"
                className="block font-medium text-slate-600 transition-colors duration-300 hover:text-blue-700"
              >
                範文 Flashcards
              </Link>
              <Link
                href="/dse/chinese/cat"
                className="block font-medium text-slate-600 transition-colors duration-300 hover:text-blue-700"
              >
                CAT 診斷室
              </Link>
              <Link
                href="/dse/jupas"
                className="block font-medium text-slate-600 transition-colors duration-300 hover:text-blue-700"
              >
                JUPAS 揀科指南
              </Link>
              <Link
                href="/dse/videos"
                className="block font-medium text-slate-600 transition-colors duration-300 hover:text-blue-700"
              >
                溫習片庫
              </Link>
              <Link
                href="/dse/english/learn"
                className="block font-medium text-slate-600 transition-colors duration-300 hover:text-blue-700"
              >
                English 自學路徑
              </Link>
              <Link
                href="/guides/dse-buxi"
                className="block font-medium text-slate-600 transition-colors duration-300 hover:text-blue-700"
              >
                DSE 補習指南
              </Link>
            </div>
            <div className="space-y-2.5">
              <p className="text-xs font-semibold tracking-wider text-slate-500">
                法律資訊
              </p>
              <Link
                href="/privacy"
                className="block font-medium text-slate-600 transition-colors duration-300 hover:text-blue-700"
              >
                私隱政策
              </Link>
              <Link
                href="/terms"
                className="block font-medium text-slate-600 transition-colors duration-300 hover:text-blue-700"
              >
                使用條款
              </Link>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="block font-medium text-slate-600 transition-colors duration-300 hover:text-blue-700"
              >
                聯絡我們
              </a>
            </div>
          </div>
        </div>

        <p className="text-xs leading-relaxed text-slate-500">
          {LEGAL_DISCLAIMER}
        </p>

        <div className="flex flex-col gap-2 border-t border-slate-200 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {SITE_NAME}. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/privacy"
              className="transition-colors duration-300 hover:text-slate-700"
            >
              私隱政策
            </Link>
            <Link
              href="/terms"
              className="transition-colors duration-300 hover:text-slate-700"
            >
              使用條款
            </Link>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="transition-colors duration-300 hover:text-slate-700"
            >
              {CONTACT_EMAIL}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
