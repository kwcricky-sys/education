"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookMarked,
  Compass,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { shortArticleTitle } from "@/lib/dse/cat/report-view";
import { textHref } from "@/lib/dse/texts";
import { DIFFICULTY_LABEL } from "@/lib/dse/types";
import { useCatSession } from "@/store/cat-session";
import { useErrorNotebook, type ErrorNotebookItem } from "@/store/error-notebook";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

type GroupBy = "article" | "difficulty";

const noopSubscribe = () => () => {};

/** The notebook lives in localStorage, so the server can only ever render it empty. */
function useIsClient() {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

function articleCounts(items: ErrorNotebookItem[]) {
  const map = new Map<string, { slug: string; label: string; count: number }>();
  for (const i of items) {
    const cur = map.get(i.textSlug) ?? { slug: i.textSlug, label: i.textLabel, count: 0 };
    cur.count += 1;
    map.set(i.textSlug, cur);
  }
  return [...map.values()].sort((a, b) => b.count - a.count);
}

export function ErrorNotebook() {
  const isClient = useIsClient();
  const items = useErrorNotebook((s) => s.items);
  const clearAll = useErrorNotebook((s) => s.clearAll);
  const removeItem = useErrorNotebook((s) => s.removeItem);
  const toPoolItems = useErrorNotebook((s) => s.toPoolItems);
  const startMistakeRetest = useCatSession((s) => s.startMistakeRetest);
  const router = useRouter();
  const [groupBy, setGroupBy] = useState<GroupBy>("article");
  const [error, setError] = useState<string | null>(null);

  const groups = useMemo(() => {
    const map = new Map<string, typeof items>();
    for (const item of items) {
      const key =
        groupBy === "article"
          ? item.textLabel
          : DIFFICULTY_LABEL[item.difficulty].zh;
      const list = map.get(key) ?? [];
      list.push(item);
      map.set(key, list);
    }
    return [...map.entries()];
  }, [items, groupBy]);

  const articles = useMemo(() => articleCounts(items), [items]);
  const stubbornCount = items.filter((i) => i.wrongCount >= 2).length;
  const topArticle = articles[0];

  const onRetest = (uids?: string[]) => {
    const pool = toPoolItems(uids);
    const result = startMistakeRetest(pool);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setError(null);
    router.push("/dse/chinese/cat");
  };

  const onClear = () => {
    if (window.confirm(`確定清空全部 ${items.length} 題錯題？清空後無法復原。`)) {
      clearAll();
    }
  };

  const retestArticleUids = (slug: string) =>
    items.filter((i) => i.textSlug === slug).map((i) => i.uid);

  const showItems = isClient && items.length > 0;

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/dse/chinese/cat"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors duration-300 hover:text-blue-700"
        >
          <ArrowLeft className="size-3.5" />
          返回診斷室
        </Link>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-wide text-blue-700">
              間隔複習
            </p>
            <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-bold text-slate-900">
              錯題本
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              診斷室同特訓答錯嘅題目會自動存入你部機。重測答啱就會移除，答錯就留低再溫。
            </p>
          </div>
          {showItems ? (
            <button
              type="button"
              onClick={onClear}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-all duration-300 hover:bg-slate-200"
            >
              <Trash2 className="size-4" />
              清空
            </button>
          ) : null}
        </div>
      </div>

      {error ? (
        <p className="rounded-xl border border-rose-700/20 bg-rose-700/10 px-4 py-3 text-sm leading-relaxed text-rose-700">
          {error}
        </p>
      ) : null}

      {!isClient ? (
        <div className="h-40 animate-pulse rounded-xl border border-slate-200 bg-white" aria-hidden />
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center shadow-lg">
          <BookMarked className="mx-auto size-8 text-slate-500" />
          <p className="mt-4 font-semibold text-slate-900">錯題本暫時係空嘅</p>
          <ol className="mx-auto mt-4 max-w-md space-y-2 text-left text-sm leading-relaxed text-slate-600">
            <li>1. 喺診斷室做一次範文診斷（約 15–20 題）。</li>
            <li>2. 答錯嘅題目會自動收入呢度，附正確答案同解說。</li>
            <li>3. 返嚟撳「重測」，答啱就移除，直到錯題本清晒。</li>
          </ol>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/dse/chinese/cat"
              className="btn-navy inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-bold"
            >
              進入診斷室
              <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Link
              href="/dse/chinese"
              className="inline-flex rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 transition hover:border-blue-700/40"
            >
              或者先刷範文閃卡
            </Link>
          </div>
        </div>
      ) : (
        <>
          <section className="grid gap-3 sm:grid-cols-3">
            {[
              { label: "錯題總數", value: `${items.length} 題` },
              { label: "涉及範文", value: `${articles.length} 篇` },
              { label: "錯兩次或以上", value: `${stubbornCount} 題` },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-slate-200 bg-white px-5 py-4">
                <p className="text-[11px] font-medium tracking-wide text-slate-500">{s.label}</p>
                <p className="mt-1 font-[family-name:var(--font-display)] text-2xl font-extrabold text-slate-900">
                  {s.value}
                </p>
              </div>
            ))}
          </section>

          <section
            aria-labelledby="notebook-next-heading"
            className="rounded-2xl border border-gold/50 bg-white p-5 shadow-[var(--shadow-card)] sm:p-6"
          >
            <p className="flex items-center gap-1.5 text-xs font-extrabold tracking-[0.2em] text-gold-ink">
              <Compass className="size-3.5" aria-hidden />
              建議下一步
            </p>
            <h2
              id="notebook-next-heading"
              className="mt-2 font-[family-name:var(--font-display)] text-xl font-bold text-navy"
            >
              重測全部 {items.length} 題，答啱即移除
            </h2>
            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-ink-muted">
              {stubbornCount > 0 && topArticle
                ? `有 ${stubbornCount} 題錯咗兩次或以上，重測前建議先溫返「${shortArticleTitle(topArticle.label)}」閃卡。`
                : topArticle && articles.length > 1
                  ? `錯得最多係「${shortArticleTitle(topArticle.label)}」（${topArticle.count} 題），時間唔夠可以先重測呢篇。`
                  : "先睇清楚下面每題嘅解說，再開始重測。"}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => onRetest()}
                className="btn-navy inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold"
              >
                <RotateCcw className="size-4" aria-hidden />
                重測全部 {items.length} 題
              </button>
              {topArticle && articles.length > 1 ? (
                <button
                  type="button"
                  onClick={() => onRetest(retestArticleUids(topArticle.slug))}
                  className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-semibold text-navy transition-colors hover:border-navy/40"
                >
                  只重測「{shortArticleTitle(topArticle.label)}」（{topArticle.count} 題）
                </button>
              ) : null}
              {topArticle ? (
                <Link
                  href={textHref(topArticle.slug)}
                  className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-semibold text-navy transition-colors hover:border-navy/40"
                >
                  溫「{shortArticleTitle(topArticle.label)}」閃卡
                </Link>
              ) : null}
            </div>
          </section>

          <div className="flex gap-2">
            {(
              [
                ["article", "按範文"],
                ["difficulty", "按難度"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setGroupBy(key)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-semibold transition-all duration-300",
                  groupBy === key
                    ? "bg-blue-700/10 text-blue-700 ring-1 ring-blue-700/30"
                    : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-200",
                )}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="space-y-8">
            {groups.map(([title, list]) => (
              <section key={title} className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-slate-900">
                    {title}{" "}
                    <span className="text-sm font-normal text-slate-500">
                      ({list.length})
                    </span>
                  </h2>
                  <button
                    type="button"
                    onClick={() => onRetest(list.map((i) => i.uid))}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-navy transition hover:border-navy/40"
                  >
                    <RotateCcw className="size-3.5" aria-hidden />
                    重測呢組（{list.length} 題）
                  </button>
                </div>
                <ul className="space-y-3">
                  {list.map((item) => (
                    <li
                      key={item.uid}
                      className="rounded-xl border border-slate-200 bg-white p-5 shadow-lg"
                    >
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span
                          className={cn(
                            "rounded-md bg-slate-200 px-2 py-1 font-medium",
                            DIFFICULTY_LABEL[item.difficulty].className,
                          )}
                        >
                          {DIFFICULTY_LABEL[item.difficulty].zh}
                        </span>
                        <span className="rounded-md bg-blue-700/10 px-2 py-1 text-blue-700">
                          {item.category}
                        </span>
                        <span
                          className={cn(
                            item.wrongCount >= 2 ? "font-semibold text-rose-700" : "text-slate-500",
                          )}
                        >
                          錯 {item.wrongCount} 次
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-slate-800">
                        {item.question}
                      </p>
                      <p className="mt-2 text-sm text-rose-700">
                        你的答案：{item.userAnswer}
                      </p>
                      <p className="mt-1 text-sm text-emerald-700">
                        正確答案：{item.answer}
                      </p>
                      <p
                        className={cn(
                          "mt-3 rounded-xl px-3 py-2.5 text-sm leading-relaxed text-slate-700",
                          item.explanation.includes("考評局")
                            ? "border border-amber-700/20 bg-amber-700/10"
                            : "border border-slate-200 bg-slate-50",
                        )}
                      >
                        {item.explanation}
                      </p>
                      <button
                        type="button"
                        onClick={() => removeItem(item.uid)}
                        className="mt-3 text-xs text-slate-500 transition-colors duration-300 hover:text-rose-700"
                      >
                        已經識，移除此題
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
