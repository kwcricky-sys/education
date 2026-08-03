import { createPageMetadata } from "@/lib/page-metadata";
import { CONTACT_EMAIL, LEGAL_DISCLAIMER, SITE_NAME } from "@/lib/site";

export const metadata = createPageMetadata({
  title: `使用條款 | ${SITE_NAME}`,
  description: `${SITE_NAME} 使用條款：說明本網站服務的使用規範、免責聲明與聯絡方式。`,
  path: "/terms",
});

export default function TermsPage() {
  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight text-zinc-100">
        使用條款
      </h1>
      <p className="mt-3 text-sm text-zinc-500">最後更新：2026 年 8 月</p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-zinc-400">
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-zinc-100">1. 接受條款</h2>
          <p>
            使用 {SITE_NAME}
            即表示你同意本使用條款。若不同意，請停止使用本網站。
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-zinc-100">2. 服務用途</h2>
          <p>
            本網站提供 DSE
            相關溫習工具（包括範文閃卡與自適應診斷），僅供個人學習與學術參考，不得用於任何非法或商業轉售用途。
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-zinc-100">3. 免責聲明</h2>
          <p>{LEGAL_DISCLAIMER}</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-zinc-100">4. 內容與知識產權</h2>
          <p>
            網站介面、品牌與原創內容屬 {SITE_NAME}{" "}
            或其授權方所有。題庫資料收集自公開來源，僅供溫習參考；你不得大量複製、轉售或以誤導方式宣稱其為官方教材。
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-zinc-100">5. 聯絡我們</h2>
          <p>
            如有疑問，請電郵：{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="font-medium text-cyan-400 hover:underline"
            >
              {CONTACT_EMAIL}
            </a>
          </p>
        </section>
      </div>
    </article>
  );
}
