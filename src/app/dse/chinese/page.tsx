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
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors duration-300 hover:text-cyan-400"
        >
          <ArrowLeft className="size-3.5" />
          科目總覽
        </Link>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
          中國語文 · 指定範文
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-zinc-400">
          以下 12
          篇指定文言經典均已開放極速閃卡練習（每篇 60
          題，基礎／中等／高階）。點選任一篇章即可開始刷題；或進入「範文 AI
          診斷室」用動態適應演算法一次找出弱點。
        </p>
      </div>

      <Link
        href="/dse/chinese/cat"
        className="panel-lift flex items-center gap-4 rounded-xl border border-white/10 bg-zinc-900 px-5 py-5 shadow-lg transition-all duration-300 hover:border-cyan-500/40 hover:bg-zinc-800"
      >
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400 ring-1 ring-cyan-400/20">
          <Activity className="size-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-semibold text-zinc-100">
            全港首創 · DSE 範文 AI 診斷室
          </span>
          <span className="mt-1 block text-sm leading-relaxed text-zinc-400">
            免刷 720 題 · 約 15 題動態適應出題 · 預測等級 + 弱點雷達報告
          </span>
        </span>
        <ArrowRight className="size-4 shrink-0 text-cyan-400" />
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
                className="flex items-center gap-4 rounded-xl border border-white/5 bg-zinc-900 p-5 shadow-lg transition-all duration-300 hover:border-white/10 hover:bg-zinc-800 sm:px-5"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-zinc-800 text-sm font-semibold tabular-nums text-zinc-400">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-zinc-100">
                      {text.title}
                    </span>
                    <span className="text-xs text-zinc-500">{text.source}</span>
                    <span className="rounded-md bg-cyan-400/10 px-2 py-1 text-[10px] font-semibold text-cyan-400">
                      {total} 題
                    </span>
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-zinc-400">
                    {text.blurb}
                  </span>
                </span>
                <ArrowRight className="size-4 shrink-0 text-zinc-500" />
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
