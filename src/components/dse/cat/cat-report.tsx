"use client";

import { useState } from "react";
import Link from "next/link";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";
import {
  AlertTriangle,
  BookMarked,
  CheckCircle2,
  Clock3,
  Crosshair,
  RotateCcw,
  Target,
  XCircle,
} from "lucide-react";
import { DIFFICULTY_LABEL } from "@/lib/dse/types";
import { useCatSession } from "@/store/cat-session";
import { cn } from "@/lib/utils";

const DIFF_COLORS = {
  easy: "#34d399",
  medium: "#fbbf24",
  hard: "#fb7185",
} as const;

export function CatReport() {
  const report = useCatSession((s) => s.report);
  const resetSession = useCatSession((s) => s.resetSession);
  const startRemediationSession = useCatSession(
    (s) => s.startRemediationSession,
  );
  const [remediationError, setRemediationError] = useState<string | null>(null);

  if (!report) {
    return (
      <p className="text-center text-sm text-slate-400">尚無報告資料。</p>
    );
  }

  const onRemediation = () => {
    const result = startRemediationSession();
    if (!result.ok) setRemediationError(result.error);
    else setRemediationError(null);
  };

  const radarData = report.categoryStats.slice(0, 8).map((c) => ({
    category:
      c.category.length > 8 ? `${c.category.slice(0, 8)}…` : c.category,
    full: c.category,
    score: Math.round(c.rate * 100),
  }));

  const barData = report.difficultyStats.map((d) => ({
    name: DIFFICULTY_LABEL[d.difficulty].zh,
    key: d.difficulty,
    rate: Math.round(d.rate * 100),
    total: d.total,
  }));

  const wrongAnswers = report.answers.filter((a) => !a.isCorrect);

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-900 via-[#0b1220] to-emerald-950/30 px-6 py-10 sm:px-10">
        <p className="text-xs font-semibold tracking-[0.22em] text-emerald-300 uppercase">
          診斷報告 · AI 診斷室
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold text-white sm:text-4xl">
          {report.predictedGrade.label}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400">
          {report.predictedGrade.rationale}
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-4">
          <Stat
            label="預估等級"
            value={report.predictedGrade.level}
            hint={`信心：${report.predictedGrade.confidence}`}
          />
          <Stat
            label="能力百分位"
            value={`P${report.abilityPercentile}`}
            hint={`θ = ${report.theta.toFixed(2)}`}
          />
          <Stat
            label="整體正確率"
            value={`${Math.round(report.overallAccuracy * 100)}%`}
            hint={`${report.answers.filter((a) => a.isCorrect).length}/${report.questionCount} 題`}
          />
          <Stat
            label="用時"
            value={`${Math.round(report.totalTimeMs / 1000)}s`}
            hint={report.scopeLabels.length > 1 ? `${report.scopeLabels.length} 篇範文` : report.scopeLabels[0] ?? "—"}
          />
        </div>

        {report.overthinking.length > 0 ? (
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-400/30 bg-amber-400/10 px-4 py-3.5 text-sm text-amber-100">
            <Clock3 className="mt-0.5 size-4 shrink-0 text-amber-300" />
            <p>
              <span className="font-semibold">⚠️ 進階提示：</span>
              系統偵測到有 {report.overthinking.length}{" "}
              條題目雖然答對，但思考時間超過 60
              秒（屬於「險勝／猜對」），建議複習該範文的深層概念！
            </p>
          </div>
        ) : null}
      </section>

      {report.sessionKind === "adaptive" && report.weaknesses.length > 0 ? (
        <section className="rounded-[1.75rem] border border-orange-400/25 bg-gradient-to-r from-orange-400/10 via-sky-400/5 to-transparent p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="flex items-center gap-2 font-[family-name:var(--font-display)] text-xl font-bold text-white">
                <Crosshair className="size-5 text-orange-300" />
                弱點專攻特訓
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                針對最低分類別（
                {report.weaknesses.map((w) => w.category).join("、")}
                ）從未作答題庫抽出 5–10 題，本地規則即時生成，零 API 成本。
              </p>
            </div>
            <button
              type="button"
              onClick={onRemediation}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-orange-400 px-5 py-3.5 text-sm font-bold text-slate-950 shadow-[0_12px_36px_rgba(251,146,60,0.28)] transition hover:bg-orange-300"
            >
              一鍵生成「弱點專攻」特訓
            </button>
          </div>
          {remediationError ? (
            <p className="mt-4 rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {remediationError}
            </p>
          ) : null}
        </section>
      ) : null}

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5 sm:p-6">
          <h2 className="flex items-center gap-2 font-[family-name:var(--font-display)] text-lg font-semibold text-white">
            <Target className="size-4 text-sky-300" />
            類別得分雷達
          </h2>
          <div className="mt-4 h-72 w-full">
            {radarData.length >= 3 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.12)" />
                  <PolarAngleAxis
                    dataKey="category"
                    tick={{ fill: "#94a3b8", fontSize: 11 }}
                  />
                  <PolarRadiusAxis
                    angle={30}
                    domain={[0, 100]}
                    tick={{ fill: "#64748b", fontSize: 10 }}
                  />
                  <Radar
                    name="得分率"
                    dataKey="score"
                    stroke="#38bdf8"
                    fill="#38bdf8"
                    fillOpacity={0.35}
                  />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <p className="flex h-full items-center justify-center text-sm text-slate-500">
                類別樣本不足，無法繪製雷達圖。
              </p>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5 sm:p-6">
          <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-white">
            難度勝率
          </h2>
          <div className="mt-4 h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  unit="%"
                />
                <Tooltip
                  contentStyle={{
                    background: "#0f172a",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 12,
                    color: "#e2e8f0",
                  }}
                  formatter={(value) => [`${value}%`, "正確率"]}
                />
                <Bar dataKey="rate" radius={[8, 8, 0, 0]}>
                  {barData.map((entry) => (
                    <Cell
                      key={entry.key}
                      fill={DIFF_COLORS[entry.key as keyof typeof DIFF_COLORS]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="flex items-center gap-2 font-[family-name:var(--font-display)] text-lg font-semibold text-white">
          <AlertTriangle className="size-4 text-amber-300" />
          弱點領域（最低 2–3 項）
        </h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {report.weaknesses.map((w) => (
            <div
              key={w.category}
              className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-4"
            >
              <p className="font-semibold text-amber-100">{w.category}</p>
              <p className="mt-2 text-2xl font-bold text-white">
                {Math.round(w.rate * 100)}%
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {w.correct}/{w.total} 題正確
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-white">
          錯題檢討
        </h2>
        {wrongAnswers.length === 0 ? (
          <p className="rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-5 text-sm text-emerald-200">
            全對！沒有錯題需要檢討。
          </p>
        ) : (
          <ol className="space-y-3">
            {wrongAnswers.map((a, i) => (
              <li
                key={a.uid}
                className="rounded-2xl border border-white/8 bg-white/[0.03] p-5"
              >
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-slate-500">#{i + 1}</span>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 font-medium",
                      DIFFICULTY_LABEL[a.difficulty].className,
                    )}
                  >
                    {DIFFICULTY_LABEL[a.difficulty].zh}
                  </span>
                  <span className="rounded-full bg-white/5 px-2 py-0.5 text-slate-400">
                    {a.category}
                  </span>
                  {report.overthinking.some((o) => o.uid === a.uid) ? (
                    <span className="rounded-full bg-amber-400/15 px-2 py-0.5 font-medium text-amber-200 ring-1 ring-amber-400/30">
                      僥倖答對／思考過久
                    </span>
                  ) : null}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-200">
                  {a.question}
                </p>
                <p className="mt-3 flex items-start gap-2 text-sm text-rose-300">
                  <XCircle className="mt-0.5 size-4 shrink-0" />
                  你的答案：{a.selectedAnswer}
                </p>
                <p className="mt-1.5 flex items-start gap-2 text-sm text-emerald-300">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
                  正確答案：{a.correctAnswer}
                </p>
                <p
                  className={cn(
                    "mt-3 rounded-xl px-3 py-2.5 text-sm leading-relaxed text-slate-300",
                    a.explanation.includes("考評局")
                      ? "border border-orange-400/25 bg-orange-400/10"
                      : "bg-white/5",
                  )}
                >
                  {a.explanation}
                </p>
              </li>
            ))}
          </ol>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-white">
          全部答題歷程
        </h2>
        <div className="overflow-x-auto rounded-2xl border border-white/8">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-white/5 text-xs text-slate-500">
              <tr>
                <th className="px-3 py-2.5 font-medium">#</th>
                <th className="px-3 py-2.5 font-medium">難度</th>
                <th className="px-3 py-2.5 font-medium">類別</th>
                <th className="px-3 py-2.5 font-medium">結果</th>
                <th className="px-3 py-2.5 font-medium">用時</th>
                <th className="px-3 py-2.5 font-medium">θ</th>
              </tr>
            </thead>
            <tbody>
              {report.answers.map((a, i) => (
                <tr key={a.uid} className="border-t border-white/5">
                  <td className="px-3 py-2.5 text-slate-400">{i + 1}</td>
                  <td className="px-3 py-2.5">
                    {DIFFICULTY_LABEL[a.difficulty].zh}
                  </td>
                  <td className="px-3 py-2.5 text-slate-300">{a.category}</td>
                  <td className="px-3 py-2.5">
                    {a.isCorrect ? (
                      report.overthinking.some((o) => o.uid === a.uid) ? (
                        <span className="text-amber-300">正確（過久）</span>
                      ) : (
                        <span className="text-emerald-300">正確</span>
                      )
                    ) : (
                      <span className="text-rose-300">錯誤</span>
                    )}
                  </td>
                  <td className="px-3 py-2.5 text-slate-500">
                    {(a.timeSpentMs / 1000).toFixed(1)}s
                  </td>
                  <td className="px-3 py-2.5 tabular-nums text-slate-400">
                    {a.thetaAfter.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={resetSession}
          className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
        >
          <RotateCcw className="size-4" />
          再測一次
        </button>
        <Link
          href="/dse/chinese/error-notebook"
          className="inline-flex items-center gap-2 rounded-2xl border border-sky-400/25 bg-sky-400/10 px-5 py-3 text-sm font-semibold text-sky-200 transition hover:bg-sky-400/20"
        >
          <BookMarked className="size-4" />
          開啟錯題本
        </Link>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <p className="text-[11px] tracking-wide text-slate-500 uppercase">
        {label}
      </p>
      <p className="mt-1 font-[family-name:var(--font-display)] text-xl font-bold text-white">
        {value}
      </p>
      <p className="mt-1 text-xs text-slate-500">{hint}</p>
    </div>
  );
}
