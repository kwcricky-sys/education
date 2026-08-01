"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  BookOpen,
  CheckCircle2,
  Clock3,
  Crosshair,
  Info,
  Lightbulb,
  Lock,
  Rocket,
  RotateCcw,
  Sparkles,
  Target,
  Unlock,
  XCircle,
} from "lucide-react";
import { DIFFICULTY_LABEL } from "@/lib/dse/types";
import {
  buildDiagnosticPrecision,
  correctCount,
  formatDuration,
  getUntestedCategories,
  toSkillCards,
  type SkillCard,
} from "@/lib/dse/cat/report-view";
import { useCatSession } from "@/store/cat-session";
import { cn } from "@/lib/utils";

export function CatReport() {
  const report = useCatSession((s) => s.report);
  const lastAdaptiveSlugs = useCatSession((s) => s.lastAdaptiveSlugs);
  const selectedSlugs = useCatSession((s) => s.selectedSlugs);
  const resetSession = useCatSession((s) => s.resetSession);
  const startRemediationSession = useCatSession(
    (s) => s.startRemediationSession,
  );
  const startExtendedDiagnostic = useCatSession(
    (s) => s.startExtendedDiagnostic,
  );
  const [actionError, setActionError] = useState<string | null>(null);
  const [showPrecisionTip, setShowPrecisionTip] = useState(false);

  const testedSkills = useMemo(
    () => (report ? toSkillCards(report.categoryStats) : []),
    [report],
  );

  const sourceSlugs =
    lastAdaptiveSlugs.length > 0 ? lastAdaptiveSlugs : selectedSlugs;

  const untestedSkills = useMemo(
    () =>
      report
        ? getUntestedCategories(sourceSlugs, report.categoryStats)
        : [],
    [report, sourceSlugs],
  );

  const precision = useMemo(
    () =>
      report
        ? buildDiagnosticPrecision({
            confidence: report.predictedGrade.confidence,
            questionCount: report.questionCount,
            difficultyStats: report.difficultyStats,
          })
        : null,
    [report],
  );

  if (!report || !precision) {
    return (
      <p className="text-center text-sm text-slate-400">尚無報告資料。</p>
    );
  }

  const wrongAnswers = report.answers.filter((a) => !a.isCorrect);
  const correct = correctCount(report.answers);
  const weakest = testedSkills.filter((s) => s.status === "weak");

  const onRemediation = () => {
    const result = startRemediationSession();
    if (!result.ok) setActionError(result.error);
    else setActionError(null);
  };

  const onExtended = () => {
    const result = startExtendedDiagnostic();
    if (!result.ok) setActionError(result.error);
    else setActionError(null);
  };

  const scrollToMistakes = () => {
    document
      .getElementById("report-mistakes")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="space-y-8">
      {/* Hero summary */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-950 via-zinc-900 to-indigo-950/40 p-6 shadow-[0_0_0_1px_rgba(99,102,241,0.12)] sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-10 size-48 rounded-full bg-teal-500/10 blur-3xl" />

        <div className="relative">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/15 px-3 py-1 text-xs font-semibold text-indigo-300 ring-1 ring-indigo-400/30">
              <Sparkles className="size-3.5" />
              DSE 範文 AI 診斷室
            </span>
            <span className="rounded-full bg-slate-800/80 px-3 py-1 text-xs text-slate-400 ring-1 ring-slate-700">
              {report.sessionKind === "remediation"
                ? "弱點特訓報告"
                : report.sessionKind === "mistake-retest"
                  ? "錯題重測報告"
                  : "極速診斷報告"}
            </span>
          </div>

          <h1 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl">
            {report.predictedGrade.label}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
            {report.predictedGrade.rationale}
          </p>

          {/* Precision indicator */}
          <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-950/60 p-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <PrecisionDot tone={precision.tone} />
              <div>
                <p className="text-sm font-semibold text-slate-100">
                  診斷精準度：{precision.label}
                  <span className="ml-2 font-normal text-slate-400">
                    ({precision.percent}%)
                  </span>
                </p>
                <PrecisionStars dots={precision.dots} tone={precision.tone} />
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowPrecisionTip((v) => !v)}
              className="inline-flex items-center gap-1.5 self-start rounded-full px-3 py-1.5 text-xs font-medium text-slate-400 ring-1 ring-slate-700 transition hover:bg-slate-800 hover:text-slate-200 sm:self-center"
            >
              <Info className="size-3.5" />
              這是什麼？
            </button>
          </div>
          {showPrecisionTip ? (
            <p className="mt-2 rounded-xl border border-indigo-500/20 bg-indigo-500/10 px-4 py-3 text-xs leading-relaxed text-indigo-100/90">
              系統依據你完成的{" "}
              <span className="font-semibold text-indigo-200">
                {report.questionCount} 條自適應題目
              </span>{" "}
              動態推算。答題越多、涵蓋難度越廣，預測結果越精準！
            </p>
          ) : null}

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <MiniStat
              label="預估等級"
              value={report.predictedGrade.level}
              hint="練習導向估算"
              accent="emerald"
            />
            <MiniStat
              label="整體正確率"
              value={`${Math.round(report.overallAccuracy * 100)}%`}
              hint={`答對 ${correct}/${report.questionCount} 題`}
              accent="teal"
            />
            <MiniStat
              label="診斷用時"
              value={formatDuration(report.totalTimeMs)}
              hint={
                report.scopeLabels.length > 1
                  ? `${report.scopeLabels.length} 篇範文`
                  : (report.scopeLabels[0] ?? "—")
              }
              accent="violet"
            />
          </div>

          {/* Difficulty strip — simple, not a chart */}
          <div className="mt-5 flex flex-wrap gap-2">
            {report.difficultyStats.map((d) => (
              <span
                key={d.difficulty}
                className="inline-flex items-center gap-2 rounded-full bg-slate-900/80 px-3 py-1.5 text-xs text-slate-300 ring-1 ring-slate-700"
              >
                <span
                  className={cn(
                    "size-1.5 rounded-full",
                    d.difficulty === "easy" && "bg-emerald-400",
                    d.difficulty === "medium" && "bg-amber-400",
                    d.difficulty === "hard" && "bg-rose-400",
                  )}
                />
                {DIFFICULTY_LABEL[d.difficulty].zh}
                <span className="font-semibold text-slate-100">
                  {d.total > 0 ? `${Math.round(d.rate * 100)}%` : "—"}
                </span>
                <span className="text-slate-500">
                  ({d.correct}/{d.total})
                </span>
              </span>
            ))}
          </div>

          {report.overthinking.length > 0 ? (
            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-amber-400/25 bg-amber-400/10 px-4 py-3.5 text-sm text-amber-100">
              <Clock3 className="mt-0.5 size-4 shrink-0 text-amber-400" />
              <p>
                <span className="font-semibold text-amber-200">
                  思考過久提醒：
                </span>
                有 {report.overthinking.length}{" "}
                題雖然答對，但用時超過 60
                秒，可能屬於「險勝」。建議複習該考點的深層概念。
              </p>
            </div>
          ) : null}
        </div>
      </section>

      {/* Why untested banner */}
      {untestedSkills.length > 0 && report.sessionKind === "adaptive" ? (
        <section className="rounded-2xl border border-violet-500/25 bg-gradient-to-r from-violet-500/10 via-indigo-500/5 to-transparent p-5 sm:p-6">
          <div className="flex gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300 ring-1 ring-violet-400/30">
              <Lightbulb className="size-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100">
                為什麼部分考點顯示「未測試」？
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-400">
                CAT
                自適應演算法為求在約 15
                分鐘內極速定位你的大約 Level，會優先選取最具代表性的考點。未測試的考點（如：
                <span className="text-slate-300">
                  {untestedSkills.slice(0, 2).join("、") || "跨篇章比較"}
                </span>
                ）可點擊下方「完整診斷」或「弱點特訓」繼續檢測！
              </p>
            </div>
          </div>
        </section>
      ) : null}

      {/* Tested skills */}
      <section className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="flex items-center gap-2 font-[family-name:var(--font-display)] text-lg font-semibold text-slate-50">
              <Target className="size-4 text-teal-400" />
              本次極速診斷重點
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              已測試 {testedSkills.length} 個考點 · 依掌握程度排序
            </p>
          </div>
        </div>

        {testedSkills.length === 0 ? (
          <p className="rounded-2xl border border-slate-800 bg-zinc-900/60 p-5 text-sm text-slate-400">
            本次尚未累積足夠類別樣本。
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {testedSkills.map((skill) => (
              <SkillProgressCard key={skill.category} skill={skill} />
            ))}
          </div>
        )}
      </section>

      {/* Untested / locked skills */}
      {untestedSkills.length > 0 ? (
        <section className="space-y-4">
          <div>
            <h2 className="flex items-center gap-2 font-[family-name:var(--font-display)] text-lg font-semibold text-slate-50">
              <Lock className="size-4 text-slate-400" />
              待解鎖技能
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              本次極速診斷未抽中這些考點 — 並非系統缺漏
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {untestedSkills.map((cat) => (
              <span
                key={cat}
                className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-slate-700 bg-slate-950/50 px-3 py-1.5 text-xs text-slate-400"
              >
                <Lock className="size-3 opacity-60" />
                {cat}
                <span className="rounded-md bg-slate-800 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
                  未測試
                </span>
              </span>
            ))}
          </div>
        </section>
      ) : null}

      {/* Next actions */}
      <section className="space-y-4">
        <div>
          <h2 className="flex items-center gap-2 font-[family-name:var(--font-display)] text-lg font-semibold text-slate-50">
            <Rocket className="size-4 text-indigo-400" />
            下一步學習行動
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            選一個最貼近你現況的動作，立刻開始補強
          </p>
        </div>

        <div className="grid gap-3">
          {report.sessionKind === "adaptive" && report.weaknesses.length > 0 ? (
            <ActionCard
              icon={<Crosshair className="size-5" />}
              title="一鍵生成 5 題「弱點特訓」"
              description={
                weakest.length > 0
                  ? `針對最低分考點「${weakest[0].category}」等，從未作答題庫抽出特訓題。`
                  : `針對薄弱類別（${report.weaknesses.map((w) => w.category).join("、")}）即時生成特訓。`
              }
              tone="rose"
              onClick={onRemediation}
              primary
            />
          ) : null}

          <ActionCard
            icon={<BookOpen className="size-5" />}
            title="查看本場錯題與考評局陷阱解析"
            description={
              wrongAnswers.length === 0
                ? "本場全對！仍可往下重溫全部答題歷程。"
                : `共 ${wrongAnswers.length} 題需複習，含解析與常見陷阱說明。`
            }
            tone="amber"
            onClick={scrollToMistakes}
          />

          {report.sessionKind === "adaptive" ? (
            <ActionCard
              icon={<Unlock className="size-5" />}
              title="解鎖其餘未測試考點（開啟 30 題完整診斷）"
              description={
                untestedSkills.length > 0
                  ? `尚有 ${untestedSkills.length} 個考點未測，完整診斷會覆蓋更多題型。`
                  : "用更長診斷再確認一次等級穩定度與難度覆蓋。"
              }
              tone="indigo"
              onClick={onExtended}
            />
          ) : null}
        </div>

        {actionError ? (
          <p className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {actionError}
          </p>
        ) : null}
      </section>

      {/* Mistakes */}
      <section id="report-mistakes" className="scroll-mt-8 space-y-4">
        <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-slate-50">
          錯題與考評局陷阱解析
        </h2>
        {wrongAnswers.length === 0 ? (
          <p className="rounded-2xl border border-emerald-500/25 bg-emerald-500/10 p-5 text-sm text-emerald-200">
            全對！沒有錯題需要檢討。建議挑戰「完整診斷」或單篇特訓鞏固。
          </p>
        ) : (
          <ol className="space-y-3">
            {wrongAnswers.map((a, i) => (
              <li
                key={a.uid}
                className="rounded-2xl border border-slate-800 bg-zinc-900/70 p-5 transition hover:border-slate-700"
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
                  <span className="rounded-full bg-slate-800 px-2 py-0.5 text-slate-400">
                    {a.category}
                  </span>
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
                      ? "border border-amber-400/25 bg-amber-400/10"
                      : "border border-slate-800 bg-slate-950/50",
                  )}
                >
                  {a.explanation}
                </p>
              </li>
            ))}
          </ol>
        )}
      </section>

      {/* Compact history */}
      <section className="space-y-3">
        <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-slate-50">
          答題歷程
        </h2>
        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="bg-slate-950/80 text-xs text-slate-500">
              <tr>
                <th className="px-3 py-2.5 font-medium">#</th>
                <th className="px-3 py-2.5 font-medium">難度</th>
                <th className="px-3 py-2.5 font-medium">考點</th>
                <th className="px-3 py-2.5 font-medium">結果</th>
                <th className="px-3 py-2.5 font-medium">用時</th>
              </tr>
            </thead>
            <tbody>
              {report.answers.map((a, i) => {
                const overthink = report.overthinking.some(
                  (o) => o.uid === a.uid,
                );
                return (
                  <tr key={a.uid} className="border-t border-slate-800/80">
                    <td className="px-3 py-2.5 text-slate-500">{i + 1}</td>
                    <td className="px-3 py-2.5 text-slate-300">
                      {DIFFICULTY_LABEL[a.difficulty].zh}
                    </td>
                    <td className="px-3 py-2.5 text-slate-300">{a.category}</td>
                    <td className="px-3 py-2.5">
                      {a.isCorrect ? (
                        overthink ? (
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
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <div className="flex flex-wrap gap-3 pb-4">
        <button
          type="button"
          onClick={resetSession}
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-slate-600 hover:bg-slate-800"
        >
          <RotateCcw className="size-4" />
          再測一次
        </button>
        <Link
          href="/dse/chinese/error-notebook"
          className="inline-flex items-center gap-2 rounded-2xl border border-indigo-500/30 bg-indigo-500/10 px-5 py-3 text-sm font-semibold text-indigo-200 transition hover:bg-indigo-500/20"
        >
          <BookOpen className="size-4" />
          開啟錯題本
        </Link>
        <Link
          href="/dse/chinese"
          className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-medium text-slate-400 transition hover:text-slate-200"
        >
          返回範文列表
        </Link>
      </div>
    </div>
  );
}

function PrecisionDot({ tone }: { tone: "high" | "mid" | "low" }) {
  return (
    <span
      className={cn(
        "mt-0.5 size-3 shrink-0 rounded-full shadow-[0_0_12px_currentColor]",
        tone === "high" && "bg-emerald-400 text-emerald-400",
        tone === "mid" && "bg-amber-400 text-amber-400",
        tone === "low" && "bg-rose-400 text-rose-400",
      )}
      aria-hidden
    />
  );
}

function PrecisionStars({
  dots,
  tone,
}: {
  dots: number;
  tone: "high" | "mid" | "low";
}) {
  return (
    <div className="mt-1.5 flex gap-1" aria-label={`精準度 ${dots}/5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "h-1.5 w-5 rounded-full",
            i < dots
              ? tone === "high"
                ? "bg-emerald-400"
                : tone === "mid"
                  ? "bg-amber-400"
                  : "bg-rose-400"
              : "bg-slate-700",
          )}
        />
      ))}
    </div>
  );
}

function MiniStat({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: string;
  hint: string;
  accent: "emerald" | "teal" | "violet";
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/50 px-4 py-3 backdrop-blur">
      <p className="text-[11px] font-medium tracking-wide text-slate-500 uppercase">
        {label}
      </p>
      <p
        className={cn(
          "mt-1 font-[family-name:var(--font-display)] text-xl font-bold",
          accent === "emerald" && "text-emerald-400",
          accent === "teal" && "text-teal-300",
          accent === "violet" && "text-violet-300",
        )}
      >
        {value}
      </p>
      <p className="mt-1 text-xs text-slate-500">{hint}</p>
    </div>
  );
}

function SkillProgressCard({ skill }: { skill: SkillCard }) {
  return (
    <div
      className={cn(
        "rounded-2xl border p-4 transition hover:shadow-[0_0_24px_rgba(99,102,241,0.08)]",
        skill.status === "mastered" &&
          "border-emerald-500/25 bg-emerald-500/5",
        skill.status === "moderate" &&
          "border-indigo-500/25 bg-indigo-500/5",
        skill.status === "weak" && "border-rose-500/25 bg-rose-500/5",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold text-slate-100">{skill.category}</p>
        <div className="flex shrink-0 flex-wrap items-center justify-end gap-1.5">
          {skill.status === "weak" ? (
            <span className="rounded-full bg-rose-500/15 px-2 py-0.5 text-[10px] font-bold tracking-wide text-rose-300 ring-1 ring-rose-400/30">
              重點補強
            </span>
          ) : null}
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-[10px] font-bold",
              skill.status === "mastered" &&
                "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/30",
              skill.status === "moderate" &&
                "bg-indigo-500/15 text-indigo-300 ring-1 ring-indigo-400/30",
              skill.status === "weak" &&
                "bg-rose-500/15 text-rose-300 ring-1 ring-rose-400/30",
            )}
          >
            {skill.statusLabel}
          </span>
        </div>
      </div>

      <div className="mt-3 flex items-end justify-between gap-2">
        <p className="text-2xl font-bold tabular-nums text-slate-50">
          {skill.percent}%
        </p>
        <p className="text-xs text-slate-500">
          答對 {skill.correct}/{skill.total} 題
        </p>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            skill.status === "mastered" && "bg-emerald-400",
            skill.status === "moderate" && "bg-indigo-400",
            skill.status === "weak" && "bg-rose-400",
          )}
          style={{ width: `${skill.percent}%` }}
        />
      </div>
    </div>
  );
}

function ActionCard({
  icon,
  title,
  description,
  tone,
  onClick,
  primary,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  tone: "rose" | "amber" | "indigo";
  onClick: () => void;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex w-full items-start gap-4 rounded-2xl border p-5 text-left transition",
        primary
          ? "border-rose-400/35 bg-gradient-to-r from-rose-500/15 to-orange-500/5 hover:border-rose-400/50 hover:shadow-[0_0_28px_rgba(251,113,133,0.12)]"
          : "border-slate-800 bg-zinc-900/60 hover:border-slate-700 hover:bg-zinc-900",
        tone === "amber" && !primary && "hover:border-amber-500/30",
        tone === "indigo" && !primary && "hover:border-indigo-500/30",
      )}
    >
      <span
        className={cn(
          "flex size-11 shrink-0 items-center justify-center rounded-xl ring-1",
          tone === "rose" &&
            "bg-rose-500/15 text-rose-300 ring-rose-400/30",
          tone === "amber" &&
            "bg-amber-500/15 text-amber-300 ring-amber-400/30",
          tone === "indigo" &&
            "bg-indigo-500/15 text-indigo-300 ring-indigo-400/30",
        )}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-bold text-slate-50 group-hover:text-white">
          {title}
        </span>
        <span className="mt-1 block text-xs leading-relaxed text-slate-400">
          {description}
        </span>
      </span>
    </button>
  );
}
