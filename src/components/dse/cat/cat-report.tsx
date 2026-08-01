"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  Clock3,
  Crosshair,
  Info,
  Lightbulb,
  Rocket,
  RotateCcw,
  Sparkles,
  Target,
  XCircle,
} from "lucide-react";
import { DIFFICULTY_LABEL } from "@/lib/dse/types";
import {
  buildDiagnosticPrecision,
  correctCount,
  formatDuration,
  masteryFromRate,
  shortArticleTitle,
  type MasteryTone,
} from "@/lib/dse/cat/report-view";
import { useCatSession } from "@/store/cat-session";
import { cn } from "@/lib/utils";

export function CatReport() {
  const report = useCatSession((s) => s.report);
  const resetSession = useCatSession((s) => s.resetSession);
  const startRemediationSession = useCatSession(
    (s) => s.startRemediationSession,
  );
  const startArticleFocusSession = useCatSession(
    (s) => s.startArticleFocusSession,
  );
  const startExtendedDiagnostic = useCatSession(
    (s) => s.startExtendedDiagnostic,
  );
  const [actionError, setActionError] = useState<string | null>(null);
  const [showPrecisionTip, setShowPrecisionTip] = useState(false);

  const precision = useMemo(
    () =>
      report
        ? buildDiagnosticPrecision({
            confidence: report.predictedGrade.confidence,
            questionCount: report.questionCount,
            difficultyStats: report.difficultyStats,
            guessCount: report.luckyGuesses.length,
          })
        : null,
    [report],
  );

  if (!report || !precision) {
    return (
      <p className="text-center text-sm text-slate-500">尚無報告資料。</p>
    );
  }

  const wrongAnswers = report.answers.filter((a) => !a.isCorrect);
  const correct = correctCount(report.answers);
  const weakestArticle = report.articleStats[0];
  const weakestMastery = weakestArticle
    ? masteryFromRate(weakestArticle.rate, weakestArticle.total)
    : null;
  const blindSpots = [
    ...report.luckyGuesses.map((g) => ({
      kind: "guess" as const,
      uid: g.uid,
      label: g.textLabel,
      category: g.category,
      detail:
        g.reason === "marked-unsure"
          ? "你標記為不確定"
          : `高階題 ${(g.timeSpentMs / 1000).toFixed(1)} 秒內答對`,
    })),
    ...report.overthinking.map((o) => ({
      kind: "overthink" as const,
      uid: o.uid,
      label: o.textLabel,
      category: o.category,
      detail: `用時 ${(o.timeSpentMs / 1000).toFixed(0)} 秒（思考過久）`,
    })),
  ];

  const onArticleFocus = () => {
    if (!weakestArticle) return;
    const result = startArticleFocusSession(weakestArticle.textSlug);
    if (!result.ok) setActionError(result.error);
    else setActionError(null);
  };

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

  return (
    <div className="space-y-8">
      {/* Section C header — grade + precision */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
            <Sparkles className="size-3.5" />
            DSE 範文 AI 診斷室
          </span>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-500">
            {report.sessionKind === "remediation"
              ? "專攻特訓報告"
              : report.sessionKind === "mistake-retest"
                ? "錯題重測報告"
                : "極速診斷報告"}
          </span>
        </div>

        <h1 className="mt-4 font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          {report.predictedGrade.label}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
          {report.predictedGrade.rationale}
        </p>

        <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">
              診斷精準度：{precision.label}
              <span className="ml-2 font-normal text-slate-500">
                ({precision.percent}%)
              </span>
            </p>
            <div className="mt-1.5 flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    "h-1.5 w-5 rounded-full",
                    i < precision.dots
                      ? precision.tone === "high"
                        ? "bg-emerald-500"
                        : precision.tone === "mid"
                          ? "bg-amber-500"
                          : "bg-rose-400"
                      : "bg-slate-200",
                  )}
                />
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowPrecisionTip((v) => !v)}
            className="inline-flex items-center gap-1.5 self-start rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50 sm:self-center"
          >
            <Info className="size-3.5" />
            這是什麼？
          </button>
        </div>
        {showPrecisionTip ? (
          <p className="mt-2 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-xs leading-relaxed text-indigo-800">
            系統依據你完成的{" "}
            <span className="font-semibold">{report.questionCount} 條</span>{" "}
            自適應題目動態推算。答題越多、涵蓋難度越廣，預測越精準；疑似瞎猜題會略為降低精準度。
          </p>
        ) : null}

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <MiniStat
            label="整體正確率"
            value={`${Math.round(report.overallAccuracy * 100)}%`}
            hint={`答對 ${correct}/${report.questionCount} 題`}
          />
          <MiniStat
            label="診斷用時"
            value={formatDuration(report.totalTimeMs)}
            hint={
              report.scopeLabels.length > 1
                ? `${report.scopeLabels.length} 篇範文`
                : (report.scopeLabels[0] ?? "—")
            }
          />
          <MiniStat
            label="風險標記"
            value={`${report.luckyGuesses.length + report.overthinking.length}`}
            hint="瞎猜／思考過久"
          />
        </div>
      </section>

      {/* Section A — Article mastery */}
      <section className="space-y-4">
        <Header
          icon={<BookOpen className="size-4 text-teal-600" />}
          title="範文熟悉度"
          subtitle="哪一篇需要重溫？依篇章正確率排序"
        />
        {report.articleStats.length === 0 ? (
          <EmptyCard>本次尚未累積篇章樣本。</EmptyCard>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {report.articleStats.map((article) => {
              const m = masteryFromRate(article.rate, article.total);
              return (
                <article
                  key={article.textSlug}
                  className={cn(
                    "rounded-2xl border bg-white p-4 shadow-sm",
                    toneBorder(m.tone),
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold text-slate-900">
                      {shortArticleTitle(article.textLabel)}
                    </h3>
                    <StatusPill tone={m.tone} label={m.statusLabel} />
                  </div>
                  <div className="mt-3 flex items-end justify-between">
                    <p className="text-2xl font-bold tabular-nums text-slate-900">
                      {m.percent}%
                    </p>
                    <p className="text-xs text-slate-500">
                      答對 {article.correct}/{article.total} 題
                    </p>
                  </div>
                  <ProgressBar percent={m.percent} tone={m.tone} />
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Section B — Core skills */}
      <section className="space-y-4">
        <Header
          icon={<Target className="size-4 text-indigo-600" />}
          title="考評技能破綻"
          subtitle="四大核心技能 · 一眼看出要練什麼題型"
        />
        <div className="grid gap-3 sm:grid-cols-2">
          {report.coreSkillStats.map((skill) => {
            const m = masteryFromRate(skill.rate, skill.total);
            return (
              <div
                key={skill.skillId}
                className={cn(
                  "rounded-2xl border bg-white p-4 shadow-sm",
                  toneBorder(m.tone),
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      {skill.label}
                    </h3>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {skill.blurb}
                    </p>
                  </div>
                  <StatusPill tone={m.tone} label={m.statusLabel} />
                </div>
                <div className="mt-3 flex items-end justify-between">
                  <p className="text-2xl font-bold tabular-nums text-slate-900">
                    {skill.total === 0 ? "—" : `${m.percent}%`}
                  </p>
                  <p className="text-xs text-slate-500">
                    {skill.total === 0
                      ? "本次未抽中"
                      : `答對 ${skill.correct}/${skill.total} 題`}
                  </p>
                </div>
                <ProgressBar
                  percent={skill.total === 0 ? 0 : m.percent}
                  tone={m.tone}
                />
              </div>
            );
          })}
        </div>
      </section>

      {/* Section C — Action guide */}
      <section className="space-y-4">
        <Header
          icon={<Rocket className="size-4 text-rose-600" />}
          title="極速補強指南"
          subtitle="三步行動 · 立刻知道下一步練什麼"
        />

        <div className="space-y-3">
          {/* Step 1 */}
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5">
            <p className="text-xs font-bold tracking-wide text-rose-700 uppercase">
              步驟 1 · 優先複習篇章
            </p>
            {weakestArticle && weakestMastery ? (
              <>
                <p className="mt-2 text-sm font-semibold text-slate-900">
                  {weakestArticle.textLabel}
                  <span
                    className={cn(
                      "ml-2 font-normal",
                      weakestMastery.tone === "weak"
                        ? "text-rose-700"
                        : "text-slate-600",
                    )}
                  >
                    {weakestMastery.percent}% · {weakestMastery.statusLabel}
                  </span>
                </p>
                <p className="mt-1 text-xs text-slate-600">
                  答對 {weakestArticle.correct}/{weakestArticle.total}{" "}
                  題。建議先從此篇開始鞏固，再做綜合診斷。
                </p>
                <button
                  type="button"
                  onClick={onArticleFocus}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-rose-500"
                >
                  <Crosshair className="size-4" />
                  一鍵專攻此篇
                </button>
              </>
            ) : (
              <p className="mt-2 text-sm text-slate-600">
                尚無篇章弱點資料。
              </p>
            )}
          </div>

          {/* Step 2 */}
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <p className="text-xs font-bold tracking-wide text-amber-700 uppercase">
              步驟 2 · 防範盲點
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-900">
              答對但疑似瞎猜／思考過久
            </p>
            {blindSpots.length === 0 ? (
              <p className="mt-1 text-xs text-slate-600">
                很好！沒有偵測到可疑答題模式。
              </p>
            ) : (
              <ul className="mt-3 space-y-2">
                {blindSpots.slice(0, 5).map((b) => (
                  <li
                    key={`${b.kind}-${b.uid}`}
                    className="flex items-start gap-2 rounded-xl border border-amber-200/80 bg-white/70 px-3 py-2 text-xs text-slate-700"
                  >
                    {b.kind === "guess" ? (
                      <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-amber-600" />
                    ) : (
                      <Clock3 className="mt-0.5 size-3.5 shrink-0 text-amber-600" />
                    )}
                    <span>
                      <span className="font-semibold">
                        {b.kind === "guess" ? "疑似瞎猜" : "思考過久"}
                      </span>
                      {" · "}
                      {shortArticleTitle(b.label)} · {b.category}
                      <span className="mt-0.5 block text-slate-500">
                        {b.detail}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Step 3 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold tracking-wide text-slate-500 uppercase">
              步驟 3 · 錯題解析
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-900">
              本場錯題與考評局陷阱
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {wrongAnswers.length === 0
                ? "全對！可挑戰更長診斷或單篇特訓。"
                : `共 ${wrongAnswers.length} 題需複習，含【考評局陷阱】高亮。`}
            </p>
            <a
              href="#report-mistakes"
              className="mt-4 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
            >
              <BookOpen className="size-4" />
              查看錯題解析
            </a>
          </div>
        </div>

        {/* Extra CTAs */}
        <div className="grid gap-3 sm:grid-cols-2">
          {report.sessionKind === "adaptive" &&
          report.weaknesses.length > 0 ? (
            <button
              type="button"
              onClick={onRemediation}
              className="rounded-2xl border border-indigo-200 bg-indigo-50 px-4 py-4 text-left transition hover:bg-indigo-100/80"
            >
              <p className="text-sm font-bold text-indigo-900">
                一鍵生成弱點特訓
              </p>
              <p className="mt-1 text-xs text-indigo-700/80">
                針對最低分類別抽出 5–10 題
              </p>
            </button>
          ) : null}
          {report.sessionKind === "adaptive" ? (
            <button
              type="button"
              onClick={onExtended}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-left shadow-sm transition hover:bg-slate-50"
            >
              <p className="text-sm font-bold text-slate-900">
                開啟 30 題完整診斷
              </p>
              <p className="mt-1 text-xs text-slate-500">
                解鎖更多未測試考點
              </p>
            </button>
          ) : null}
        </div>

        {actionError ? (
          <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {actionError}
          </p>
        ) : null}
      </section>

      {/* Mistakes detail */}
      <section id="report-mistakes" className="scroll-mt-8 space-y-4">
        <Header
          icon={<Lightbulb className="size-4 text-amber-600" />}
          title="錯題與考評局陷阱解析"
          subtitle="逐題對照 · 高亮常見陷阱"
        />
        {wrongAnswers.length === 0 ? (
          <EmptyCard tone="good">
            全對！沒有錯題需要檢討。建議挑戰完整診斷或單篇特訓鞏固。
          </EmptyCard>
        ) : (
          <ol className="space-y-3">
            {wrongAnswers.map((a, i) => {
              const trap = a.explanation.includes("考評局");
              return (
                <li
                  key={a.uid}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-slate-400">#{i + 1}</span>
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 font-medium text-slate-600">
                      {DIFFICULTY_LABEL[a.difficulty].zh}
                    </span>
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-slate-500">
                      {a.category}
                    </span>
                    {a.isGuess ? (
                      <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 font-medium text-amber-700">
                        疑似瞎猜
                      </span>
                    ) : null}
                    {trap ? (
                      <span className="rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 font-semibold text-rose-700">
                        考評局陷阱
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-slate-800">
                    {a.question}
                  </p>
                  <p className="mt-3 flex items-start gap-2 text-sm text-rose-700">
                    <XCircle className="mt-0.5 size-4 shrink-0" />
                    你的答案：{a.selectedAnswer}
                  </p>
                  <p className="mt-1.5 flex items-start gap-2 text-sm text-emerald-700">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
                    正確答案：{a.correctAnswer}
                  </p>
                  <p
                    className={cn(
                      "mt-3 rounded-xl px-3 py-2.5 text-sm leading-relaxed",
                      trap
                        ? "border border-amber-200 bg-amber-50 text-amber-900"
                        : "border border-slate-100 bg-slate-50 text-slate-600",
                    )}
                  >
                    {trap ? (
                      <span className="mb-1 block text-xs font-bold text-amber-800">
                        【考評局陷阱】
                      </span>
                    ) : null}
                    {a.explanation}
                  </p>
                </li>
              );
            })}
          </ol>
        )}
      </section>

      <div className="flex flex-wrap gap-3 pb-2">
        <button
          type="button"
          onClick={resetSession}
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50"
        >
          <RotateCcw className="size-4" />
          再測一次
        </button>
        <Link
          href="/dse/chinese/error-notebook"
          className="inline-flex items-center gap-2 rounded-2xl border border-indigo-200 bg-indigo-50 px-5 py-3 text-sm font-semibold text-indigo-800 transition hover:bg-indigo-100"
        >
          <BookOpen className="size-4" />
          開啟錯題本
        </Link>
        <Link
          href="/dse/chinese"
          className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-medium text-slate-500 transition hover:text-slate-800"
        >
          返回範文列表
        </Link>
      </div>
    </div>
  );
}

function Header({
  icon,
  title,
  subtitle,
}: {
  icon: ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div>
      <h2 className="flex items-center gap-2 font-[family-name:var(--font-display)] text-lg font-semibold text-slate-900">
        {icon}
        {title}
      </h2>
      <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
    </div>
  );
}

function MiniStat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <p className="text-[11px] font-medium tracking-wide text-slate-500 uppercase">
        {label}
      </p>
      <p className="mt-1 font-[family-name:var(--font-display)] text-xl font-bold text-slate-900">
        {value}
      </p>
      <p className="mt-1 text-xs text-slate-500">{hint}</p>
    </div>
  );
}

function StatusPill({ tone, label }: { tone: MasteryTone; label: string }) {
  return (
    <span
      className={cn(
        "shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold",
        tone === "good" &&
          "border-emerald-200 bg-emerald-50 text-emerald-700",
        tone === "ok" && "border-indigo-200 bg-indigo-50 text-indigo-700",
        tone === "weak" && "border-rose-200 bg-rose-50 text-rose-700",
        tone === "empty" && "border-slate-200 bg-slate-50 text-slate-500",
      )}
    >
      {tone === "weak" ? `🚨 ${label}` : label}
    </span>
  );
}

function ProgressBar({
  percent,
  tone,
}: {
  percent: number;
  tone: MasteryTone;
}) {
  return (
    <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
      <div
        className={cn(
          "h-full rounded-full transition-all",
          tone === "good" && "bg-emerald-500",
          tone === "ok" && "bg-indigo-500",
          tone === "weak" && "bg-rose-500",
          tone === "empty" && "bg-slate-300",
        )}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}

function toneBorder(tone: MasteryTone) {
  return cn(
    tone === "good" && "border-emerald-200",
    tone === "ok" && "border-indigo-200",
    tone === "weak" && "border-rose-200",
    tone === "empty" && "border-slate-200",
  );
}

function EmptyCard({
  children,
  tone,
}: {
  children: ReactNode;
  tone?: "good";
}) {
  return (
    <p
      className={cn(
        "rounded-2xl border p-5 text-sm shadow-sm",
        tone === "good"
          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
          : "border-slate-200 bg-white text-slate-500",
      )}
    >
      {children}
    </p>
  );
}
