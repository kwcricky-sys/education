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
      <p className="text-center text-sm text-zinc-400">尚無報告資料。</p>
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

  const accuracyPct = Math.round(report.overallAccuracy * 100);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold tracking-[0.2em] text-cyan-400 uppercase">
          Diagnostic Complete
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight text-zinc-100 sm:text-4xl">
          Performance Report
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-400">
          {report.predictedGrade.rationale}
        </p>
      </div>

      <section className="grid gap-3 sm:grid-cols-3">
        <MiniStat
          label="Expected Level"
          value={report.predictedGrade.label}
          hint={`精準度 ${precision.label} · ${precision.percent}%`}
          icon={<Target className="size-4 text-cyan-400" />}
          accent
        />
        <MiniStat
          label="Time Taken"
          value={formatDuration(report.totalTimeMs)}
          hint={
            report.scopeLabels.length > 1
              ? `${report.scopeLabels.length} 篇範文`
              : (report.scopeLabels[0] ?? "—")
          }
          icon={<Clock3 className="size-4 text-zinc-400" />}
        />
        <MiniStat
          label="Accuracy"
          value={`${accuracyPct}%`}
          hint={`答對 ${correct}/${report.questionCount} 題`}
          icon={<Sparkles className="size-4 text-cyan-400" />}
          progress={accuracyPct}
        />
      </section>

      <section className="rounded-xl border border-white/10 bg-zinc-900/80 p-4 shadow-lg backdrop-blur-md sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-zinc-100">
              診斷精準度：{precision.label}
              <span className="ml-2 font-normal text-zinc-400">
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
                        ? "bg-emerald-400"
                        : precision.tone === "mid"
                          ? "bg-amber-400"
                          : "bg-rose-400"
                      : "bg-zinc-800",
                  )}
                />
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowPrecisionTip((v) => !v)}
            className="inline-flex items-center gap-1.5 self-start rounded-full border border-white/10 bg-zinc-950/50 px-3 py-1.5 text-xs font-medium text-zinc-400 transition-all duration-300 hover:bg-zinc-800 sm:self-center"
          >
            <Info className="size-3.5" />
            這是什麼？
          </button>
        </div>
        {showPrecisionTip ? (
          <p className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-400/10 px-4 py-3 text-xs leading-relaxed text-cyan-300">
            系統依據你完成的{" "}
            <span className="font-semibold">{report.questionCount} 條</span>{" "}
            自適應題目動態推算。答題越多、涵蓋難度越廣，預測越精準；疑似瞎猜題會略為降低精準度。
          </p>
        ) : null}
      </section>

      {/* Section A — Article mastery */}
      <section className="space-y-4">
        <Header
          icon={<BookOpen className="size-4 text-teal-400" />}
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
                    "rounded-2xl border bg-zinc-900/80 p-4 shadow-lg backdrop-blur-md transition-all duration-300",
                    toneBorder(m.tone),
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold text-zinc-100">
                      {shortArticleTitle(article.textLabel)}
                    </h3>
                    <StatusPill tone={m.tone} label={m.statusLabel} />
                  </div>
                  <div className="mt-3 flex items-end justify-between">
                    <p className="text-2xl font-bold tabular-nums text-zinc-100">
                      {m.percent}%
                    </p>
                    <p className="text-xs text-zinc-400">
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
          icon={<Target className="size-4 text-cyan-400" />}
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
                  "rounded-2xl border bg-zinc-900/80 p-4 shadow-lg backdrop-blur-md transition-all duration-300",
                  toneBorder(m.tone),
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-100">
                      {skill.label}
                    </h3>
                    <p className="mt-0.5 text-xs text-zinc-400">
                      {skill.blurb}
                    </p>
                  </div>
                  <StatusPill tone={m.tone} label={m.statusLabel} />
                </div>
                <div className="mt-3 flex items-end justify-between">
                  <p className="text-2xl font-bold tabular-nums text-zinc-100">
                    {skill.total === 0 ? "—" : `${m.percent}%`}
                  </p>
                  <p className="text-xs text-zinc-400">
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
          icon={<Rocket className="size-4 text-rose-400" />}
          title="極速補強指南"
          subtitle="三步行動 · 立刻知道下一步練什麼"
        />

        <div className="space-y-3">
          {/* Step 1 */}
          <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 p-5">
            <p className="text-xs font-bold tracking-wide text-rose-400 uppercase">
              步驟 1 · 優先複習篇章
            </p>
            {weakestArticle && weakestMastery ? (
              <>
                <p className="mt-2 text-sm font-semibold text-zinc-100">
                  {weakestArticle.textLabel}
                  <span
                    className={cn(
                      "ml-2 font-normal",
                      weakestMastery.tone === "weak"
                        ? "text-rose-400"
                        : "text-zinc-400",
                    )}
                  >
                    {weakestMastery.percent}% · {weakestMastery.statusLabel}
                  </span>
                </p>
                <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                  答對 {weakestArticle.correct}/{weakestArticle.total}{" "}
                  題。建議先從此篇開始鞏固，再做綜合診斷。
                </p>
                <button
                  type="button"
                  onClick={onArticleFocus}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-2.5 text-sm font-bold text-rose-400 shadow-lg transition-all duration-300 hover:bg-rose-400/20"
                >
                  <Crosshair className="size-4" />
                  一鍵專攻此篇
                </button>
              </>
            ) : (
              <p className="mt-2 text-sm text-zinc-400">
                尚無篇章弱點資料。
              </p>
            )}
          </div>

          {/* Step 2 */}
          <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-5">
            <p className="text-xs font-bold tracking-wide text-amber-400 uppercase">
              步驟 2 · 防範盲點
            </p>
            <p className="mt-2 text-sm font-semibold text-zinc-100">
              答對但疑似瞎猜／思考過久
            </p>
            {blindSpots.length === 0 ? (
              <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                很好！沒有偵測到可疑答題模式。
              </p>
            ) : (
              <ul className="mt-3 space-y-2">
                {blindSpots.slice(0, 5).map((b) => (
                  <li
                    key={`${b.kind}-${b.uid}`}
                    className="flex items-start gap-2 rounded-xl border border-amber-400/20 bg-zinc-900/80 px-3 py-2 text-xs text-zinc-300 backdrop-blur-md"
                  >
                    {b.kind === "guess" ? (
                      <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-amber-400" />
                    ) : (
                      <Clock3 className="mt-0.5 size-3.5 shrink-0 text-amber-400" />
                    )}
                    <span>
                      <span className="font-semibold">
                        {b.kind === "guess" ? "疑似瞎猜" : "思考過久"}
                      </span>
                      {" · "}
                      {shortArticleTitle(b.label)} · {b.category}
                      <span className="mt-0.5 block text-zinc-400">
                        {b.detail}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Step 3 */}
          <div className="rounded-2xl border border-white/10 bg-zinc-900/80 p-5 shadow-lg backdrop-blur-md">
            <p className="text-xs font-bold tracking-wide text-zinc-400 uppercase">
              步驟 3 · 錯題解析
            </p>
            <p className="mt-2 text-sm font-semibold text-zinc-100">
              本場錯題與考評局陷阱
            </p>
            <p className="mt-1 text-xs leading-relaxed text-zinc-400">
              {wrongAnswers.length === 0
                ? "全對！可挑戰更長診斷或單篇特訓。"
                : `共 ${wrongAnswers.length} 題需複習，含【考評局陷阱】高亮。`}
            </p>
            <a
              href="#report-mistakes"
              className="mt-4 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-zinc-200 transition-all duration-300 hover:bg-zinc-800"
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
              className="rounded-2xl border border-cyan-500/50 bg-cyan-400/10 px-4 py-4 text-left transition-all duration-300 hover:bg-cyan-400/20"
            >
              <p className="text-sm font-bold text-cyan-400">
                一鍵生成弱點特訓
              </p>
              <p className="mt-1 text-xs text-cyan-400/80">
                針對最低分類別抽出 5–10 題
              </p>
            </button>
          ) : null}
          {report.sessionKind === "adaptive" ? (
            <button
              type="button"
              onClick={onExtended}
              className="rounded-2xl border border-white/10 bg-zinc-900/80 px-4 py-4 text-left shadow-lg backdrop-blur-md transition-all duration-300 hover:bg-zinc-800"
            >
              <p className="text-sm font-bold text-zinc-100">
                開啟 30 題完整診斷
              </p>
              <p className="mt-1 text-xs text-zinc-400">
                解鎖更多未測試考點
              </p>
            </button>
          ) : null}
        </div>

        {actionError ? (
          <p className="rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-400">
            {actionError}
          </p>
        ) : null}
      </section>

      {/* Mistakes detail */}
      <section id="report-mistakes" className="scroll-mt-8 space-y-4">
        <Header
          icon={<Lightbulb className="size-4 text-amber-400" />}
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
                  className="rounded-2xl border border-white/10 bg-zinc-900/80 p-5 shadow-lg backdrop-blur-md"
                >
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-zinc-400">#{i + 1}</span>
                    <span className="rounded-full border border-white/10 bg-zinc-900 px-2 py-0.5 font-medium text-zinc-300">
                      {DIFFICULTY_LABEL[a.difficulty].zh}
                    </span>
                    <span className="rounded-full border border-white/10 bg-zinc-900 px-2 py-0.5 text-zinc-400">
                      {a.category}
                    </span>
                    {a.isGuess ? (
                      <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-2 py-0.5 font-medium text-amber-400">
                        疑似瞎猜
                      </span>
                    ) : null}
                    {trap ? (
                      <span className="rounded-full border border-rose-400/20 bg-rose-400/10 px-2 py-0.5 font-semibold text-rose-400">
                        考評局陷阱
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-200">
                    {a.question}
                  </p>
                  <p className="mt-3 flex items-start gap-2 text-sm text-rose-400">
                    <XCircle className="mt-0.5 size-4 shrink-0" />
                    你的答案：{a.selectedAnswer}
                  </p>
                  <p className="mt-1.5 flex items-start gap-2 text-sm text-emerald-400">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
                    正確答案：{a.correctAnswer}
                  </p>
                  <p
                    className={cn(
                      "mt-3 rounded-xl px-3 py-2.5 text-sm leading-relaxed",
                      trap
                        ? "border border-amber-400/20 bg-amber-400/10 text-amber-400"
                        : "border border-white/10 bg-zinc-900 text-zinc-400",
                    )}
                  >
                    {trap ? (
                      <span className="mb-1 block text-xs font-bold text-amber-400">
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
          className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-zinc-900/80 px-5 py-3 text-sm font-semibold text-zinc-200 shadow-lg backdrop-blur-md transition-all duration-300 hover:bg-zinc-800"
        >
          <RotateCcw className="size-4" />
          再測一次
        </button>
        <Link
          href="/dse/chinese/error-notebook"
          className="inline-flex items-center gap-2 rounded-2xl border border-cyan-500/50 bg-cyan-400/10 px-5 py-3 text-sm font-semibold text-cyan-400 transition-all duration-300 hover:bg-cyan-400/20"
        >
          <BookOpen className="size-4" />
          開啟錯題本
        </Link>
        <Link
          href="/dse/chinese"
          className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-medium text-zinc-400 transition-all duration-300 hover:text-zinc-200"
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
      <h2 className="flex items-center gap-2 font-[family-name:var(--font-display)] text-lg font-semibold text-zinc-100">
        {icon}
        {title}
      </h2>
      <p className="mt-1 text-xs leading-relaxed text-zinc-400">{subtitle}</p>
    </div>
  );
}

function MiniStat({
  label,
  value,
  hint,
  icon,
  accent,
  progress,
}: {
  label: string;
  value: string;
  hint: string;
  icon?: ReactNode;
  accent?: boolean;
  progress?: number;
}) {
  return (
    <div className="relative rounded-xl border border-white/10 bg-zinc-900 p-5 shadow-lg">
      {icon ? (
        <span className="absolute right-4 top-4 opacity-80">{icon}</span>
      ) : null}
      <p className="text-[11px] font-medium tracking-[0.16em] text-zinc-500 uppercase">
        {label}
      </p>
      <p
        className={cn(
          "mt-2 font-[family-name:var(--font-display)] text-2xl font-extrabold",
          accent ? "text-cyan-400" : "text-zinc-100",
        )}
      >
        {value}
      </p>
      <p className="mt-1 text-xs leading-relaxed text-zinc-400">{hint}</p>
      {typeof progress === "number" ? (
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-zinc-800">
          <div
            className="h-full rounded-full bg-cyan-400 transition-all duration-300"
            style={{ width: `${Math.min(100, progress)}%` }}
          />
        </div>
      ) : null}
    </div>
  );
}

function StatusPill({ tone, label }: { tone: MasteryTone; label: string }) {
  return (
    <span
      className={cn(
        "shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold",
        tone === "good" &&
          "border-emerald-400/20 bg-emerald-400/10 text-emerald-400",
        tone === "ok" && "border-cyan-500/50 bg-cyan-400/10 text-cyan-400",
        tone === "weak" && "border-rose-400/20 bg-rose-400/10 text-rose-400",
        tone === "empty" && "border-white/10 bg-zinc-900 text-zinc-400",
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
    <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-800">
      <div
        className={cn(
          "h-full rounded-full transition-all duration-300",
          tone === "good" && "bg-emerald-400",
          tone === "ok" && "bg-cyan-400",
          tone === "weak" && "bg-rose-400",
          tone === "empty" && "bg-zinc-600",
        )}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}

function toneBorder(tone: MasteryTone) {
  return cn(
    tone === "good" && "border-emerald-400/20",
    tone === "ok" && "border-cyan-500/50",
    tone === "weak" && "border-rose-400/20",
    tone === "empty" && "border-white/10",
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
        "rounded-2xl border p-5 text-sm shadow-lg",
        tone === "good"
          ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-400"
          : "border-white/10 bg-zinc-900/80 text-zinc-400 backdrop-blur-md",
      )}
    >
      {children}
    </p>
  );
}
