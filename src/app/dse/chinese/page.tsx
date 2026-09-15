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
    "範文閃卡",
    "DSE 補習",
    "免費溫習",
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
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors duration-300 hover:text-blue-700"
        >
          <ArrowLeft className="size-3.5" />
          科目總覽
        </Link>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          中國語文 · 指定範文
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600">
          以下 12
          篇指定文言經典均已開放極速閃卡練習（每篇 60
          題，基礎／中等／高階）。點選任一篇章即可開始刷題；或進入「範文 AI
          診斷室」用動態適應演算法一次找出弱點。
        </p>
      </div>

      <Link
        href="/dse/chinese/cat"
        className="panel-lift flex items-center gap-4 rounded-xl border border-slate-200 bg-white px-5 py-5 shadow-lg transition-all duration-300 hover:border-blue-800/40 hover:bg-slate-200"
      >
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-700/10 text-blue-700 ring-1 ring-blue-700/20">
          <Activity className="size-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-semibold text-slate-900">
            全港首創 · DSE 範文 AI 診斷室
          </span>
          <span className="mt-1 block text-sm leading-relaxed text-slate-600">
            免刷 720 題 · 約 15 題動態適應出題 · 預測等級 + 弱點雷達報告
          </span>
        </span>
        <ArrowRight className="size-4 shrink-0 text-blue-700" />
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
                className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-lg transition-all duration-300 hover:border-slate-200 hover:bg-slate-200 sm:px-5"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-200 text-sm font-semibold tabular-nums text-slate-600">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-slate-900">
                      {text.title}
                    </span>
                    <span className="text-xs text-slate-500">{text.source}</span>
                    <span className="rounded-md bg-blue-700/10 px-2 py-1 text-[10px] font-semibold text-blue-700">
                      {total} 題
                    </span>
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-slate-600">
                    {text.blurb}
                  </span>
                </span>
                <ArrowRight className="size-4 shrink-0 text-slate-500" />
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
