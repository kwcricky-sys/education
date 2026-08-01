"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookMarked,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { DIFFICULTY_LABEL } from "@/lib/dse/types";
import { useCatSession } from "@/store/cat-session";
import { useErrorNotebook } from "@/store/error-notebook";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

type GroupBy = "article" | "difficulty";

export function ErrorNotebook() {
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

  const onRetest = () => {
    const pool = toPoolItems();
    const result = startMistakeRetest(pool);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setError(null);
    router.push("/dse/chinese/cat");
  };

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/dse/chinese/cat"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 transition hover:text-sky-300"
        >
          <ArrowLeft className="size-3.5" />
          返回診斷室
        </Link>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-sky-300 uppercase">
              Spaced Review
            </p>
            <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-bold text-white">
              錯題本
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              診斷室答錯的題目會自動存入本機。重測答對後移除，形成溫習閉環。
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onRetest}
              disabled={items.length === 0}
              className="inline-flex items-center gap-2 rounded-2xl bg-sky-400 px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <RotateCcw className="size-4" />
              錯題重測
            </button>
            <button
              type="button"
              onClick={clearAll}
              disabled={items.length === 0}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/10 disabled:opacity-40"
            >
              <Trash2 className="size-4" />
              清空
            </button>
          </div>
        </div>
      </div>

      {error ? (
        <p className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </p>
      ) : null}

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
              "rounded-full px-3 py-1.5 text-xs font-semibold transition",
              groupBy === key
                ? "bg-sky-400 text-slate-950"
                : "bg-white/5 text-slate-400 ring-1 ring-white/10",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {items.length === 0 ? (
        <div className="rounded-[1.75rem] border border-dashed border-white/15 bg-white/[0.02] px-6 py-16 text-center">
          <BookMarked className="mx-auto size-8 text-slate-600" />
          <p className="mt-4 text-sm text-slate-400">
            尚未有錯題。完成一次診斷室測驗後，答錯的題目會自動收進這裡。
          </p>
          <Link
            href="/dse/chinese/cat"
            className="mt-6 inline-flex rounded-2xl bg-sky-400 px-5 py-2.5 text-sm font-bold text-slate-950"
          >
            進入診斷室
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {groups.map(([title, list]) => (
            <section key={title} className="space-y-3">
              <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-white">
                {title}{" "}
                <span className="text-sm font-normal text-slate-500">
                  ({list.length})
                </span>
              </h2>
              <ul className="space-y-3">
                {list.map((item) => (
                  <li
                    key={item.uid}
                    className="rounded-2xl border border-white/8 bg-white/[0.03] p-5"
                  >
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 font-medium",
                          DIFFICULTY_LABEL[item.difficulty].className,
                        )}
                      >
                        {DIFFICULTY_LABEL[item.difficulty].zh}
                      </span>
                      <span className="rounded-full bg-white/5 px-2 py-0.5 text-slate-400">
                        {item.category}
                      </span>
                      <span className="text-slate-600">
                        錯 {item.wrongCount} 次
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-slate-200">
                      {item.question}
                    </p>
                    <p className="mt-2 text-sm text-rose-300">
                      你的答案：{item.userAnswer}
                    </p>
                    <p className="mt-1 text-sm text-emerald-300">
                      正確答案：{item.answer}
                    </p>
                    <p
                      className={cn(
                        "mt-3 rounded-xl px-3 py-2.5 text-sm leading-relaxed text-slate-300",
                        item.explanation.includes("考評局")
                          ? "border border-orange-400/25 bg-orange-400/10"
                          : "bg-white/5",
                      )}
                    >
                      {item.explanation}
                    </p>
                    <button
                      type="button"
                      onClick={() => removeItem(item.uid)}
                      className="mt-3 text-xs text-slate-500 transition hover:text-rose-300"
                    >
                      移除此題
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
