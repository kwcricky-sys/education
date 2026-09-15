"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Check, RotateCcw, Search, X } from "lucide-react";
import {
  CATEGORIES,
  PROGRAMMES,
  UGC_CATEGORY_SALARIES,
  bestFiveToIndex,
  estimateChance,
  hkd,
  monthly,
  suggestLineup,
  type ChanceBand,
  type Programme,
} from "@/lib/jupas/programmes";

const TONE_CLASS: Record<ChanceBand["tone"], string> = {
  emerald: "bg-emerald-500/10 text-emerald-300 ring-emerald-500/30",
  sky: "bg-sky-500/10 text-sky-300 ring-sky-500/30",
  amber: "bg-amber-500/10 text-amber-300 ring-amber-500/30",
  rose: "bg-rose-500/10 text-rose-300 ring-rose-500/30",
};

const TAG_CLASS: Record<string, string> = {
  神科級回報: "bg-amber-500/10 text-amber-300 ring-amber-500/30",
  水泡寶藏: "bg-emerald-500/10 text-emerald-300 ring-emerald-500/30",
  抵讀: "bg-sky-500/10 text-sky-300 ring-sky-500/30",
  中性: "bg-zinc-700/40 text-zinc-300 ring-white/10",
  回報偏弱: "bg-rose-500/10 text-rose-300 ring-rose-500/30",
};

const MAX_SELECTED = 3;

export default function CompareTool() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("全部");
  const [selected, setSelected] = useState<string[]>([]);
  const [bestFive, setBestFive] = useState<string>("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PROGRAMMES.filter((p) => {
      if (category !== "全部" && p.category !== category) return false;
      if (!q) return true;
      return (
        p.code.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        p.university.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    });
  }, [query, category]);

  const chosen = selected
    .map((c) => PROGRAMMES.find((p) => p.code === c))
    .filter((p): p is Programme => Boolean(p));

  const parsedBestFive = Number.parseFloat(bestFive);
  const hasScore = Number.isFinite(parsedBestFive) && parsedBestFive > 0;
  const index = hasScore ? bestFiveToIndex(parsedBestFive) : null;

  const chances = chosen.map((p) => (index === null ? null : estimateChance(index, p)));
  const bands = chances.filter((c): c is ChanceBand => Boolean(c));

  function toggle(code: string) {
    setSelected((cur) => {
      if (cur.includes(code)) return cur.filter((c) => c !== code);
      if (cur.length >= MAX_SELECTED) return [...cur.slice(1), code];
      return [...cur, code];
    });
  }

  return (
    <div className="space-y-8">
      {/* ── 成績輸入 ─────────────────────────────────────────── */}
      <section className="rounded-2xl bg-zinc-900/60 p-5 ring-1 ring-white/10 sm:p-6">
        <h2 className="font-[family-name:var(--font-display)] text-lg font-bold text-zinc-100">
          第一步：輸入你嘅預計成績
        </h2>
        <p className="mt-1 text-sm text-zinc-400">
          用最佳 5 科總分（5**＝7、5*＝6、5＝5、4＝4、3＝3）。例如 5 科中位一科 5*、其餘 5 級＝
          5＋5＋5＋5＋6＝26 分。
        </p>
        <div className="mt-4 flex flex-wrap items-end gap-4">
          <label className="flex flex-col gap-1 text-sm text-zinc-400">
            最佳 5 科總分（0–35）
            <input
              inputMode="decimal"
              value={bestFive}
              onChange={(e) => setBestFive(e.target.value)}
              placeholder="例如 25"
              className="w-32 rounded-lg border border-white/10 bg-zinc-950 px-3 py-2 text-base font-semibold text-zinc-100 tabular-nums outline-none focus:border-cyan-400/60"
            />
          </label>
          <div className="rounded-lg bg-zinc-950/70 px-4 py-2 ring-1 ring-white/10">
            <div className="text-xs text-zinc-500">換算入學分數指數（0–7）</div>
            <div className="text-2xl font-extrabold tabular-nums text-cyan-300">
              {index === null ? "—" : index.toFixed(2)}
            </div>
          </div>
          {chosen.length > 0 && (
            <button
              type="button"
              onClick={() => setSelected([])}
              className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-800 px-3 py-2 text-sm text-zinc-300 ring-1 ring-white/10 transition hover:bg-zinc-700"
            >
              <RotateCcw className="h-4 w-4" /> 清空已選課程
            </button>
          )}
        </div>
        <p className="mt-3 text-xs leading-relaxed text-zinc-500">
          注意：各院校計分方法、科目比重同加分機制都唔同，冇官方嘅「最佳 5 科 → 入學分數指數」公式。
          呢度用 <span className="text-zinc-400">入學分數指數 ≈ 最佳 5 科平均分</span>
          （總分 ÷ 5）作近似換算，只作自我評估參考。
        </p>
      </section>

      {/* ── 揀科 ─────────────────────────────────────────────── */}
      <section className="rounded-2xl bg-zinc-900/60 p-5 ring-1 ring-white/10 sm:p-6">
        <h2 className="font-[family-name:var(--font-display)] text-lg font-bold text-zinc-100">
          第二步：揀 2–3 個課程並排比較
        </h2>
        <p className="mt-1 text-sm text-zinc-400">
          資料庫共 {PROGRAMMES.length} 個課程。可以搜尋課程代碼（例如 JS3636）、課程名或大學。
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜尋課程代碼 / 課程名 / 大學"
              className="w-full rounded-lg border border-white/10 bg-zinc-950 py-2 pl-9 pr-3 text-sm text-zinc-100 outline-none focus:border-cyan-400/60"
            />
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-lg border border-white/10 bg-zinc-950 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-cyan-400/60"
          >
            <option value="全部">全部類別</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4 max-h-72 overflow-y-auto rounded-xl ring-1 ring-white/10">
          {results.length === 0 ? (
            <p className="p-4 text-sm text-zinc-500">冇符合嘅課程，試下其他關鍵字。</p>
          ) : (
            <ul className="divide-y divide-white/5">
              {results.map((p) => {
                const picked = selected.includes(p.code);
                const full = !picked && selected.length >= MAX_SELECTED;
                return (
                  <li key={p.code}>
                    <button
                      type="button"
                      onClick={() => toggle(p.code)}
                      disabled={full}
                      className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition ${
                        picked
                          ? "bg-cyan-500/10"
                          : full
                            ? "opacity-40"
                            : "hover:bg-white/5"
                      }`}
                    >
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                          picked
                            ? "border-cyan-400 bg-cyan-400 text-zinc-900"
                            : "border-white/20"
                        }`}
                      >
                        {picked && <Check className="h-3.5 w-3.5" />}
                      </span>
                      <span className="w-16 shrink-0 font-mono text-xs text-cyan-300">
                        {p.code}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-sm text-zinc-200">
                        {p.university}　{p.name}
                      </span>
                      <span className="shrink-0 text-xs tabular-nums text-zinc-400">
                        中位 {p.score.median.toFixed(2)}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {chosen.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {chosen.map((p) => (
              <span
                key={p.code}
                className="inline-flex items-center gap-2 rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-200 ring-1 ring-white/10"
              >
                <span className="font-mono text-cyan-300">{p.code}</span>
                {p.name.length > 14 ? `${p.name.slice(0, 14)}…` : p.name}
                <button
                  type="button"
                  onClick={() => toggle(p.code)}
                  aria-label={`移除 ${p.code}`}
                  className="text-zinc-500 hover:text-rose-300"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}
      </section>

      {/* ── 比較表 ───────────────────────────────────────────── */}
      {chosen.length === 0 ? (
        <p className="rounded-2xl bg-zinc-900/40 p-6 text-center text-sm text-zinc-500 ring-1 ring-white/10">
          揀 1–3 個課程就會出現並排比較同入學機會估算。
        </p>
      ) : (
        <section className="space-y-6">
          <div className="overflow-x-auto rounded-2xl ring-1 ring-white/10">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr className="bg-zinc-900/80 text-left">
                  <th className="p-3 font-medium text-zinc-500">項目</th>
                  {chosen.map((p) => (
                    <th key={p.code} className="p-3 align-top">
                      <div className="font-mono text-xs text-cyan-300">{p.code}</div>
                      <div className="mt-0.5 font-semibold text-zinc-100">{p.name}</div>
                      <div className="text-xs font-normal text-zinc-500">
                        {p.university}　{p.category}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 bg-zinc-950/40">
                <Row label="2025 收生中位數" values={chosen.map((p) => p.score.median.toFixed(2))} />
                <Row
                  label="下四分位 / 上四分位"
                  values={chosen.map((p) => {
                    const range =
                      p.score.lower !== null || p.score.upper !== null
                        ? `${p.score.lower?.toFixed(2) ?? "未公布"} / ${p.score.upper?.toFixed(2) ?? "未公布"}`
                        : "未公布";
                    return p.score.quartileNote ? `${range}（${p.score.quartileNote}）` : range;
                  })}
                />
                <Row
                  label="效益比（每 1 分換到嘅起薪）"
                  values={chosen.map((p) =>
                    p.valuePerPoint === null ? "—（無公開起薪）" : hkd(p.valuePerPoint),
                  )}
                />
                <Row
                  label="標籤"
                  values={chosen.map((p) => p.tag ?? "—")}
                  render={(v) => (
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs ring-1 ${
                        TAG_CLASS[v] ?? "bg-zinc-800 text-zinc-400 ring-white/10"
                      }`}
                    >
                      {v}
                    </span>
                  )}
                />
                <Row
                  label={chosen.some((p) => p.outcome.hasPublishedEntryPay)
                    ? "入職薪酬（有公開薪級表嘅課程）"
                    : "入職薪酬"}
                  values={chosen.map((p) =>
                    p.outcome.hasPublishedEntryPay && p.outcome.entryPayMonthly
                      ? hkd(p.outcome.entryPayMonthly)
                      : "未公布",
                  )}
                />
                <Row
                  label="所屬學科大類平均月薪（UGC）"
                  values={chosen.map((p) => hkd(monthly(p.outcome.ugcAnnualSalaryK)))}
                />
                <Row
                  label="薪酬依據"
                  values={chosen.map((p) => p.outcome.payBasis)}
                  small
                />
                <Row label="人力需求" values={chosen.map((p) => p.outcome.demand)} />
                <Row label="出路備註" values={chosen.map((p) => p.outcome.marketNote)} small />
              </tbody>
            </table>
          </div>

          {/* ── 入學機會估算 ─────────────────────────────────── */}
          <div className="rounded-2xl bg-zinc-900/60 p-5 ring-1 ring-white/10 sm:p-6">
            <h2 className="font-[family-name:var(--font-display)] text-lg font-bold text-zinc-100">
              第三步：入學機會估算
            </h2>
            {index === null ? (
              <p className="mt-2 text-sm text-zinc-400">
                喺上面輸入你嘅最佳 5 科總分，就會逐科顯示估算。
              </p>
            ) : (
              <>
                <p className="mt-2 text-sm text-zinc-400">
                  以你輸入嘅成績換算指數 <span className="text-cyan-300">{index.toFixed(2)}</span>
                  ，同各課程 2025 年嘅中位數及四分位比較。
                </p>
                <ul className="mt-4 space-y-3">
                  {chosen.map((p, i) => {
                    const c = chances[i];
                    if (!c) return null;
                    return (
                      <li
                        key={p.code}
                        className="flex flex-wrap items-center gap-3 rounded-xl bg-zinc-950/60 p-3 ring-1 ring-white/10"
                      >
                        <span className="font-mono text-xs text-cyan-300">{p.code}</span>
                        <span className="text-sm text-zinc-200">{p.name}</span>
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${TONE_CLASS[c.tone]}`}
                        >
                          {c.label}
                        </span>
                        <span className="text-xs text-zinc-500">
                          {c.detail}
                          {c.estimated && "（四分位數據不足，此估算以中位數 ±0.3 推算）"}
                        </span>
                      </li>
                    );
                  })}
                </ul>
                <p className="mt-4 rounded-xl bg-cyan-500/5 p-3 text-sm text-cyan-100 ring-1 ring-cyan-500/20">
                  Band A 排位建議：{suggestLineup(bands.map((b) => b.key))}
                </p>
              </>
            )}
          </div>

          {/* ── 逐科評語 ─────────────────────────────────────── */}
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {chosen.map((p) => (
              <article
                key={p.code}
                className="rounded-2xl bg-zinc-900/60 p-4 ring-1 ring-white/10"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-cyan-300">{p.code}</span>
                  {p.tag && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ring-1 ${
                        TAG_CLASS[p.tag] ?? "bg-zinc-800 text-zinc-400 ring-white/10"
                      }`}
                    >
                      {p.tag}
                    </span>
                  )}
                </div>
                <h3 className="mt-1.5 font-semibold text-zinc-100">{p.name}</h3>
                <p className="text-xs text-zinc-500">{p.university}</p>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">{p.verdict}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* ── 學科大類平均（官方數據）────────────────────────── */}
      <section className="rounded-2xl bg-zinc-900/60 p-5 ring-1 ring-white/10 sm:p-6">
        <h2 className="font-[family-name:var(--font-display)] text-lg font-bold text-zinc-100">
          官方參考：UGC 2024/25 學士畢業生平均年薪（按學科大類）
        </h2>
        <p className="mt-1 text-xs text-zinc-500">
          資料來源：教資會 2024/25 學年全日制學士課程畢業生就業調查（全職就業者）。
          呢個係學科大類平均，唔係個別課程數字。
        </p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {UGC_CATEGORY_SALARIES.map((c) => (
            <li key={c.key} className="rounded-xl bg-zinc-950/60 p-3 ring-1 ring-white/10">
              <div className="text-sm text-zinc-300">{c.label}</div>
              <div className="mt-1 text-xl font-extrabold tabular-nums text-zinc-100">
                ${(c.annualK * 1000).toLocaleString("en-US")}
              </div>
              <div className="text-xs text-zinc-500">年薪　約 {hkd(monthly(c.annualK))}／月</div>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-zinc-400">
          最高同最低嘅大類相差 {(554 / 279).toFixed(2)} 倍。搵唔到心水課程嘅話，
          可以返去 <Link href="/dse/jupas" className="text-cyan-300 hover:underline">JUPAS 揀科指南</Link>
          睇完整課程表同神科／水泡科分析。
        </p>
      </section>
    </div>
  );
}

function Row({
  label,
  values,
  small = false,
  render,
}: {
  label: string;
  values: string[];
  small?: boolean;
  render?: (v: string) => React.ReactNode;
}) {
  return (
    <tr>
      <th className="w-40 p-3 text-left align-top font-medium text-zinc-500">{label}</th>
      {values.map((v, i) => (
        <td
          key={i}
          className={`p-3 align-top ${small ? "text-xs leading-relaxed text-zinc-400" : "text-zinc-200"}`}
        >
          {render ? render(v) : v}
        </td>
      ))}
    </tr>
  );
}
