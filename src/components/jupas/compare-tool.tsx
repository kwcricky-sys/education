"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, ClipboardCopy, RotateCcw, Search, X } from "lucide-react";
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
import { SITE_NAME } from "@/lib/site";

const JUPAS_URL = "https://www.jupas.edu.hk/";
const MAX_BEST_FIVE = 35;

const TONE_CLASS: Record<ChanceBand["tone"], string> = {
  emerald: "bg-emerald-500/10 text-emerald-700 ring-emerald-300",
  sky: "bg-blue-700/10 text-blue-700 ring-blue-300",
  amber: "bg-amber-500/10 text-amber-700 ring-amber-300",
  rose: "bg-rose-500/10 text-rose-700 ring-rose-300",
};

const TAG_CLASS: Record<string, string> = {
  神科級回報: "bg-amber-500/10 text-amber-700 ring-amber-300",
  水泡寶藏: "bg-emerald-500/10 text-emerald-700 ring-emerald-300",
  抵讀: "bg-blue-700/10 text-blue-700 ring-blue-300",
  中性: "bg-slate-200 text-slate-700 ring-slate-200",
  回報偏弱: "bg-rose-500/10 text-rose-700 ring-rose-300",
};

const MAX_SELECTED = 3;

export default function CompareTool() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("全部");
  const [selected, setSelected] = useState<string[]>([]);
  const [bestFive, setBestFive] = useState<string>("");
  const [copyState, setCopyState] = useState<"idle" | "done" | "failed">("idle");
  const scoreInputRef = useRef<HTMLInputElement>(null);

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

  const trimmedScore = bestFive.trim();
  const parsedBestFive = Number(trimmedScore);
  const scoreError =
    trimmedScore === ""
      ? null
      : !Number.isFinite(parsedBestFive)
        ? "請輸入數字，例如 25。"
        : parsedBestFive <= 0 || parsedBestFive > MAX_BEST_FIVE
          ? `最佳 5 科總分應該喺 1–${MAX_BEST_FIVE} 之間（5** 最高 7 分 × 5 科）。`
          : null;
  const hasScore = trimmedScore !== "" && scoreError === null;
  const index = hasScore ? bestFiveToIndex(parsedBestFive) : null;

  const chances = chosen.map((p) => (index === null ? null : estimateChance(index, p)));
  const bands = chances.filter((c): c is ChanceBand => Boolean(c));

  function focusScore() {
    scoreInputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    scoreInputRef.current?.focus({ preventScroll: true });
  }

  async function copySummary() {
    const lines = [
      `JUPAS 課程比較（${SITE_NAME} 估算，只供參考）`,
      index === null
        ? "未輸入預計成績"
        : `最佳 5 科：${parsedBestFive}（約等於指數 ${index.toFixed(2)}）`,
      ...chosen.map((p, i) => {
        const c = chances[i];
        return `- ${p.code} ${p.university} ${p.name}｜2025 中位 ${p.score.median.toFixed(2)}${c ? `｜${c.label}` : ""}`;
      }),
      ...(bands.length > 0 ? [`Band A 建議：${suggestLineup(bands.map((b) => b.key))}`] : []),
      `正式資料以 JUPAS 官網及各院校公佈為準：${JUPAS_URL}`,
    ];
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopyState("done");
    } catch {
      setCopyState("failed");
    }
  }

  function toggle(code: string) {
    setCopyState("idle");
    setSelected((cur) => {
      if (cur.includes(code)) return cur.filter((c) => c !== code);
      if (cur.length >= MAX_SELECTED) return [...cur.slice(1), code];
      return [...cur, code];
    });
  }

  return (
    <div className="space-y-8">
      {/* ── 成績輸入 ─────────────────────────────────────────── */}
      <section className="rounded-2xl bg-white p-5 ring-1 ring-slate-200 sm:p-6">
        <h2 className="font-[family-name:var(--font-display)] text-lg font-bold text-slate-900">
          第一步：輸入你嘅預計成績
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          用最佳 5 科總分（5**＝7、5*＝6、5＝5、4＝4、3＝3）。例如一科 5*、其餘四科 5 級＝
          6＋5＋5＋5＋5＝26 分。唔輸入都可以先比較課程，只係冇入學機會估算。
        </p>
        <div className="mt-4 flex flex-wrap items-end gap-4">
          <label className="flex flex-col gap-1 text-sm text-slate-600">
            最佳 5 科總分（1–{MAX_BEST_FIVE}）
            <input
              ref={scoreInputRef}
              inputMode="decimal"
              value={bestFive}
              onChange={(e) => {
                setBestFive(e.target.value);
                setCopyState("idle");
              }}
              placeholder="例如 25"
              aria-invalid={scoreError !== null}
              aria-describedby={scoreError ? "best-five-error" : undefined}
              className={`w-32 rounded-lg border bg-white px-3 py-2 text-base font-semibold text-slate-900 tabular-nums outline-none ${
                scoreError ? "border-rose-700/60" : "border-slate-200 focus:border-blue-700/60"
              }`}
            />
          </label>
          <div className="rounded-lg bg-slate-50 px-4 py-2 ring-1 ring-slate-200">
            <div className="text-xs text-slate-500">換算入學分數指數（0–7）</div>
            <div className="text-2xl font-extrabold tabular-nums text-blue-600">
              {index === null ? "—" : index.toFixed(2)}
            </div>
          </div>
        </div>
        {scoreError ? (
          <p id="best-five-error" role="alert" className="mt-2 text-sm text-rose-700">
            {scoreError}
          </p>
        ) : null}
        <p className="mt-3 text-xs leading-relaxed text-slate-500">
          注意：各院校計分方法、科目比重同加分機制都唔同，冇官方嘅「最佳 5 科 → 入學分數指數」公式。
          呢度用 <span className="text-slate-600">入學分數指數 ≈ 最佳 5 科平均分</span>
          （總分 ÷ 5）作近似換算，只作自我評估參考。
        </p>
      </section>

      {/* ── 揀科 ─────────────────────────────────────────────── */}
      <section className="rounded-2xl bg-white p-5 ring-1 ring-slate-200 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-[family-name:var(--font-display)] text-lg font-bold text-slate-900">
            第二步：揀 2–3 個課程並排比較
          </h2>
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${
              chosen.length === MAX_SELECTED
                ? "bg-navy text-cream ring-navy"
                : "bg-cream text-navy ring-line"
            }`}
          >
            已揀 {chosen.length}/{MAX_SELECTED}
          </span>
        </div>
        <p className="mt-1 text-sm text-slate-600">
          資料庫共 {PROGRAMMES.length} 個課程。可以搜尋課程代碼（例如 JS3636）、課程名或大學。
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜尋課程代碼 / 課程名 / 大學"
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 outline-none focus:border-blue-700/60"
            />
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-700/60"
          >
            <option value="全部">全部類別</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {chosen.length === MAX_SELECTED ? (
          <p className="mt-3 text-xs text-ink-muted">
            已揀滿 {MAX_SELECTED} 個。想換課程，先喺下面剔走一個，或者撳課程標籤旁邊嘅 ✕。
          </p>
        ) : (query || category !== "全部") && results.length > 0 ? (
          <p className="mt-3 text-xs text-ink-muted">
            顯示 {results.length} 個符合嘅課程
          </p>
        ) : null}

        <div className="mt-3 max-h-72 overflow-y-auto rounded-xl ring-1 ring-slate-200">
          {results.length === 0 ? (
            <div className="p-4 text-sm text-slate-600">
              <p>
                冇符合{query.trim() ? `「${query.trim()}」` : ""}
                {category !== "全部" ? `（${category}）` : ""}嘅課程。
                試下用課程代碼（例如 JS3636）、大學全名或者較短嘅關鍵字。
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setCategory("全部");
                }}
                className="mt-2 text-sm font-semibold text-navy underline underline-offset-2"
              >
                清除搜尋同類別
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-slate-200">
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
                          ? "bg-blue-800/10"
                          : full
                            ? "opacity-40"
                            : "hover:bg-slate-100"
                      }`}
                    >
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                          picked
                            ? "border-blue-700 bg-blue-700 text-white"
                            : "border-slate-300"
                        }`}
                      >
                        {picked && <Check className="h-3.5 w-3.5" />}
                      </span>
                      <span className="w-16 shrink-0 font-mono text-xs text-blue-600">
                        {p.code}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-sm text-slate-800">
                        {p.university}　{p.name}
                      </span>
                      <span className="shrink-0 text-xs tabular-nums text-slate-600">
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
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {chosen.map((p) => (
              <span
                key={p.code}
                className="inline-flex items-center gap-2 rounded-full bg-slate-200 px-3 py-1 text-xs text-slate-800 ring-1 ring-slate-200"
              >
                <span className="font-mono text-blue-600">{p.code}</span>
                {p.name.length > 14 ? `${p.name.slice(0, 14)}…` : p.name}
                <button
                  type="button"
                  onClick={() => toggle(p.code)}
                  aria-label={`移除 ${p.code}`}
                  className="text-slate-500 hover:text-rose-700"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
            <button
              type="button"
              onClick={() => {
                setSelected([]);
                setCopyState("idle");
              }}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-slate-600 transition hover:text-navy"
            >
              <RotateCcw className="h-3.5 w-3.5" /> 清空已選課程
            </button>
          </div>
        )}
      </section>

      {/* ── 比較表 ───────────────────────────────────────────── */}
      {chosen.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-white p-6 text-sm text-slate-600">
          <p className="font-semibold text-navy">未揀課程</p>
          <p className="mt-1">喺上面剔 2–3 個課程，呢度就會並排顯示：</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>2025 收生中位數同上／下四分位</li>
            <li>公開入職薪酬、學科大類平均月薪同效益比</li>
            <li>輸入咗成績嘅話，逐科估算「穩入／有機／陪跑」同 Band A 排位建議</li>
          </ul>
          <p className="mt-3 text-xs text-slate-500">
            唔知揀邊科？可以先用類別篩選，或者返{" "}
            <Link href="/dse/jupas" className="font-semibold text-navy underline underline-offset-2">
              JUPAS 揀科指南
            </Link>{" "}
            睇完整課程表。
          </p>
        </div>
      ) : (
        <section className="space-y-6">
          {chosen.length === 1 ? (
            <p className="rounded-xl border border-line bg-cream/60 px-4 py-3 text-sm text-ink-muted">
              已揀 1 個課程。再揀 1–2 個，就可以並排比較同睇 Band A 組合建議。
            </p>
          ) : null}
          <div className="overflow-x-auto rounded-2xl ring-1 ring-slate-200">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr className="bg-white text-left">
                  <th className="p-3 font-medium text-slate-500">項目</th>
                  {chosen.map((p) => (
                    <th key={p.code} className="p-3 align-top">
                      <div className="font-mono text-xs text-blue-600">{p.code}</div>
                      <div className="mt-0.5 font-semibold text-slate-900">{p.name}</div>
                      <div className="text-xs font-normal text-slate-500">
                        {p.university}　{p.category}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-slate-50">
                <Row label="2025 收生中位數（指數）" values={chosen.map((p) => p.score.median.toFixed(2))} />
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
                        TAG_CLASS[v] ?? "bg-slate-200 text-slate-600 ring-slate-200"
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
          <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200 sm:p-6">
            <h2 className="font-[family-name:var(--font-display)] text-lg font-bold text-slate-900">
              第三步：入學機會估算
            </h2>
            {index === null ? (
              <div className="mt-2 text-sm text-slate-600">
                <p>
                  {scoreError
                    ? "你輸入嘅成績唔喺合理範圍，改好之後就會逐科顯示估算。"
                    : "輸入你嘅最佳 5 科總分，就會逐科顯示「穩入／有機／陪跑」估算。"}
                </p>
                <button
                  type="button"
                  onClick={focusScore}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-2 text-sm font-semibold text-navy transition hover:border-navy/40"
                >
                  去第一步輸入成績
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </button>
              </div>
            ) : (
              <>
                <p className="mt-2 text-sm text-slate-600">
                  以你輸入嘅成績換算指數 <span className="text-blue-600">{index.toFixed(2)}</span>
                  ，同各課程 2025 年嘅中位數及四分位比較。估算只睇分數，唔包括面試、科目比重同加分。
                </p>
                <ul className="mt-4 space-y-3">
                  {chosen.map((p, i) => {
                    const c = chances[i];
                    if (!c) return null;
                    return (
                      <li
                        key={p.code}
                        className="flex flex-wrap items-center gap-3 rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200"
                      >
                        <span className="font-mono text-xs text-blue-600">{p.code}</span>
                        <span className="text-sm text-slate-800">{p.name}</span>
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${TONE_CLASS[c.tone]}`}
                        >
                          {c.label}
                        </span>
                        <span className="text-xs text-slate-500">
                          {c.detail}
                          {c.estimated && "（四分位數據不足，此估算以中位數 ±0.3 推算）"}
                        </span>
                      </li>
                    );
                  })}
                </ul>
                <p className="mt-4 rounded-xl bg-blue-800/5 p-3 text-sm text-blue-800 ring-1 ring-blue-800/20">
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
                className="rounded-2xl bg-white p-4 ring-1 ring-slate-200"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-blue-600">{p.code}</span>
                  {p.tag && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ring-1 ${
                        TAG_CLASS[p.tag] ?? "bg-slate-200 text-slate-600 ring-slate-200"
                      }`}
                    >
                      {p.tag}
                    </span>
                  )}
                </div>
                <h3 className="mt-1.5 font-semibold text-slate-900">{p.name}</h3>
                <p className="text-xs text-slate-500">{p.university}</p>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{p.verdict}</p>
              </article>
            ))}
          </div>

          <div className="rounded-2xl border border-gold/50 bg-white p-5 sm:p-6">
            <p className="text-xs font-extrabold tracking-[0.2em] text-gold-ink">下一步</p>
            <h2 className="mt-2 font-[family-name:var(--font-display)] text-lg font-bold text-navy">
              記低結果，再對照官方資料
            </h2>
            <ol className="mt-3 space-y-2 text-sm text-slate-700">
              <li>1. 複製呢次比較摘要，貼去筆記或者同老師、家長傾。</li>
              <li>2. 睇 JUPAS 揀科指南嘅時間表同 Band A 排位策略。</li>
              <li>3. 入學要求、科目比重同計分方法，以 JUPAS 官網及各院校公佈為準。</li>
            </ol>
            <div className="mt-4 flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={copySummary}
                className="btn-navy inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold"
              >
                <ClipboardCopy className="h-4 w-4" aria-hidden />
                複製比較摘要
              </button>
              <Link
                href="/dse/jupas"
                className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-semibold text-navy transition hover:border-navy/40"
              >
                JUPAS 揀科指南
              </Link>
              <a
                href={JUPAS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-semibold text-navy transition hover:border-navy/40"
              >
                JUPAS 官網
              </a>
              <span role="status" className="text-xs text-ink-muted">
                {copyState === "done"
                  ? "已複製 ✓"
                  : copyState === "failed"
                    ? "複製唔到，請手動記低上面嘅結果。"
                    : ""}
              </span>
            </div>
          </div>
        </section>
      )}

      {/* ── 學科大類平均（官方數據）────────────────────────── */}
      <section className="rounded-2xl bg-white p-5 ring-1 ring-slate-200 sm:p-6">
        <h2 className="font-[family-name:var(--font-display)] text-lg font-bold text-slate-900">
          官方參考：UGC 2024/25 學士畢業生平均年薪（按學科大類）
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          資料來源：教資會 2024/25 學年全日制學士課程畢業生就業調查（全職就業者）。
          呢個係學科大類平均，唔係個別課程數字。
        </p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {UGC_CATEGORY_SALARIES.map((c) => (
            <li key={c.key} className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200">
              <div className="text-sm text-slate-700">{c.label}</div>
              <div className="mt-1 text-xl font-extrabold tabular-nums text-slate-900">
                ${(c.annualK * 1000).toLocaleString("en-US")}
              </div>
              <div className="text-xs text-slate-500">年薪　約 {hkd(monthly(c.annualK))}／月</div>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-slate-600">
          最高同最低嘅大類相差 {(554 / 279).toFixed(2)} 倍。搵唔到心水課程嘅話，
          可以返去 <Link href="/dse/jupas" className="text-blue-600 hover:underline">JUPAS 揀科指南</Link>
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
      <th className="w-40 p-3 text-left align-top font-medium text-slate-500">{label}</th>
      {values.map((v, i) => (
        <td
          key={i}
          className={`p-3 align-top ${small ? "text-xs leading-relaxed text-slate-600" : "text-slate-800"}`}
        >
          {render ? render(v) : v}
        </td>
      ))}
    </tr>
  );
}
