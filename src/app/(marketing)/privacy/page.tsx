import { createPageMetadata } from "@/lib/page-metadata";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/site";

export const metadata = createPageMetadata({
  title: `私隱政策 | ${SITE_NAME}`,
  description: `${SITE_NAME} 私隱政策：說明本網站如何使用 Cookies、廣告與本機資料，以及如何聯絡我們。`,
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight text-zinc-100">
        私隱政策
      </h1>
      <p className="mt-3 text-sm text-zinc-500">最後更新：2026 年 8 月</p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-zinc-400">
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-zinc-100">1. 簡介</h2>
          <p>
            {SITE_NAME}
            （「本網站」）重視你的私隱。本政策說明我們如何收集、使用與保護與你瀏覽及使用本服務相關的資料。
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-zinc-100">2. 我們收集的資料</h2>
          <p>
            練習進度、錯題本等學習資料預設儲存於你的裝置本機（瀏覽器），不會上傳至我們的伺服器。我們可能透過 Cookies
            或類似技術收集匿名使用數據，以改善體驗。
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-zinc-100">3. Cookies 與廣告</h2>
          <p>
            本網站使用 Cookies
            以改善用戶體驗。你可以透過瀏覽器設定管理
            Cookies；繼續使用本網站即表示你知悉相關用途。
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-zinc-100">4. 第三方服務</h2>
          <p>
            本網站或會使用第三方服務商（如字型及數據分析等），該等服務商可能按其自身私隱政策收集資料。詳情請參閱相關服務商的政策。
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-zinc-100">5. 聯絡我們</h2>
          <p>
            如對本私隱政策有任何疑問，請電郵：{" "}
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
