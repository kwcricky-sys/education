"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { IndexedVideo } from "@/lib/dse/videos";

type Props = {
  videos: IndexedVideo[];
  subjects: { id: string; name: string; count: number }[];
  topics: string[];
};

/**
 * Client-side filter for the curated video library.
 * Filters by subject, topic and free-text keyword — no server round trip.
 */
export default function VideoLibrary({ videos, subjects, topics }: Props) {
  const [subject, setSubject] = useState<string>("all");
  const [topic, setTopic] = useState<string>("all");
  const [query, setQuery] = useState<string>("");

  const visibleTopics = useMemo(
    () =>
      subject === "all"
        ? topics
        : [...new Set(videos.filter((v) => v.subject === subject).flatMap((v) => v.topics))],
    [subject, videos, topics],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return videos.filter((v) => {
      if (subject !== "all" && v.subject !== subject) return false;
      if (topic !== "all" && !v.topics.includes(topic)) return false;
      if (q) {
        const hay = `${v.title} ${v.channel} ${v.summary} ${v.topics.join(" ")}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [videos, subject, topic, query]);

  const chip = (active: boolean) =>
    `rounded-full border px-3 py-1.5 text-xs font-medium transition ${
      active
        ? "border-blue-700/60 bg-blue-700/15 text-blue-700"
        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-800"
    }`;

  return (
    <div>
      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-semibold text-slate-500">科目</span>
          <button type="button" className={chip(subject === "all")} onClick={() => { setSubject("all"); setTopic("all"); }}>
            全部（{videos.length}）
          </button>
          {subjects.map((s) => (
            <button
              key={s.id}
              type="button"
              className={chip(subject === s.id)}
              onClick={() => { setSubject(s.id); setTopic("all"); }}
            >
              {s.name}（{s.count}）
            </button>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-semibold text-slate-500">課題</span>
          <button type="button" className={chip(topic === "all")} onClick={() => setTopic("all")}>
            全部課題
          </button>
          {visibleTopics.map((t) => (
            <button key={t} type="button" className={chip(topic === t)} onClick={() => setTopic(t)}>
              {t}
            </button>
          ))}
        </div>

        <div className="mt-4">
          <label htmlFor="video-search" className="sr-only">
            搜尋影片關鍵字
          </label>
          <input
            id="video-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜尋課題、頻道或關鍵字（例如：範文、Paper 2、貨幣）"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-500 focus:border-blue-700/60 focus:outline-none"
          />
        </div>

        <p className="mt-3 text-xs text-slate-500">
          顯示 {filtered.length} / {videos.length} 條影片
        </p>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {filtered.map((v) => (
          <article
            key={v.id}
            className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-blue-700/30"
          >
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <Link
                href={`/dse/videos/${v.subject}`}
                className="rounded-full bg-blue-700/10 px-2.5 py-1 font-medium text-blue-600 hover:bg-blue-700/20"
              >
                {v.subjectName}
              </Link>
              {v.topics.map((t) => (
                <span key={t} className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">
                  {t}
                </span>
              ))}
            </div>
            <h3 className="mt-3 text-base font-semibold leading-snug text-slate-900">{v.title}</h3>
            <p className="mt-1 text-xs text-slate-500">
              {v.channel} · {v.duration}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">{v.summary}</p>
            <p className="mt-3 text-xs leading-relaxed text-slate-500">
              <span className="font-semibold text-slate-600">溫習階段：</span>
              {v.studyStage}
            </p>
            <Link
              href={`/dse/videos/${v.subject}#${v.id}`}
              className="mt-4 inline-block text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              睇摘要、重點筆記同分析 →
            </Link>
          </article>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-600">
          呢個組合暫時未有片。試下換科目或者清除關鍵字。
        </p>
      )}
    </div>
  );
}
