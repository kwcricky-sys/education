import Link from "next/link";
import { Activity, ArrowLeft, ArrowRight } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { getQuiz } from "@/lib/dse/quizzes";
import { CHINESE_PRESCRIBED_TEXTS, textHref } from "@/lib/dse/texts";
import { createPageMetadata } from "@/lib/page-metadata";
import { buildBreadcrumbJsonLd } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site";

export const metadata = createPageMetadata({
  title: `DSE 中文科指定範文 · 12 篇閃卡總覽 | ${SITE_NAME}`,
  description:
    "DSE 中國語文 12 篇指定文言經典極速閃卡：論語、魚我所欲也、逍遙遊、勸學、廉頗藺相如列傳、出師表、師說、西山宴遊記、岳陽樓記、六國論、唐詩三首、詞三首。",
  path: "/dse/chinese",
  keywords: [
    "DSE 中文",
    "指定範文",
    "文言",
    "卷一",
    "論語",
    "唐詩三首",
    "詞三首",
  ],
});

export default function DseChinesePage() {
  return (
    <div className="space-y-8">
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "首頁", path: "/" },
          { name: "DSE 備考", path: "/dse" },
          { name: "中國語文", path: "/dse/chinese" },
        ])}
      />

      <div>
        <Link
          href="/dse"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 transition hover:text-sky-300"
        >
          <ArrowLeft className="size-3.5" />
          科目總覽
        </Link>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-white sm:text-4xl">
          中國語文 · 指定範文
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-400">
          以下 12
          篇指定文言經典均已開放極速閃卡練習（每篇 60
          題，基礎／中等／高階）。點選任一篇章即可開始刷題；或使用自適應診斷測驗一次評估多篇弱點。
        </p>
      </div>

      <Link
        href="/dse/chinese/cat"
        className="panel-lift flex items-center gap-4 rounded-[1.5rem] border border-orange-400/25 bg-gradient-to-r from-orange-400/10 to-sky-400/10 px-5 py-5 transition hover:border-orange-400/40"
      >
        <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-orange-400/15 text-orange-300 ring-1 ring-orange-400/25">
          <Activity className="size-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-semibold text-white">
            自適應診斷測驗（CAT）
          </span>
          <span className="mt-1 block text-sm text-slate-400">
            選單篇／多篇／全範文 · 動態調難度 · 雷達圖弱點報告與 DSE 等級估算
          </span>
        </span>
        <ArrowRight className="size-4 shrink-0 text-orange-300" />
      </Link>

      <ol className="space-y-2">
        {CHINESE_PRESCRIBED_TEXTS.map((text, i) => {
          const quiz = getQuiz(text.slug);
          const total = quiz?.meta?.total ?? quiz?.questions.length ?? 60;
          const href = textHref(text.slug);

          return (
            <li key={text.slug}>
              <Link
                href={href}
                className="panel-lift flex items-center gap-4 rounded-2xl border border-sky-400/20 bg-sky-400/5 px-4 py-4 transition hover:border-sky-400/40 hover:bg-sky-400/10 sm:px-5"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/5 text-sm font-semibold tabular-nums text-slate-300 ring-1 ring-white/10">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-white">
                      {text.title}
                    </span>
                    <span className="text-xs text-slate-500">{text.source}</span>
                    <span className="rounded-full bg-emerald-400/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-300 ring-1 ring-emerald-400/25">
                      {total} 題
                    </span>
                  </span>
                  <span className="mt-1 block text-sm text-slate-500">
                    {text.blurb}
                  </span>
                </span>
                <ArrowRight className="size-4 shrink-0 text-sky-300" />
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
