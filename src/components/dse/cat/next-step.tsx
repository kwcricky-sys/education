"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, BookMarked, Compass } from "lucide-react";
import { masteryFromRate, shortArticleTitle } from "@/lib/dse/cat/report-view";
import type { CatReport } from "@/lib/dse/cat/types";
import { textHref } from "@/lib/dse/texts";
import { useCatSession } from "@/store/cat-session";
import { useErrorNotebook } from "@/store/error-notebook";

type Action =
  | { kind: "article-focus"; textSlug: string; label: string }
  | { kind: "remediation"; label: string }
  | { kind: "extended"; label: string }
  | { kind: "retest-notebook"; label: string }
  | { kind: "new-diagnosis"; label: string }
  | { kind: "link"; href: string; label: string };

type Plan = {
  title: string;
  detail: string;
  primary: Action;
  secondary: Action[];
};

function compact(actions: (Action | null)[]): Action[] {
  return actions.filter((a): a is Action => a !== null);
}

function buildPlan(report: CatReport, notebookCount: number): Plan {
  const total = report.answers.length;
  const correct = report.answers.filter((a) => a.isCorrect).length;
  const wrong = total - correct;
  const weakest = report.articleStats[0];
  const weakestName = weakest ? shortArticleTitle(weakest.textLabel) : null;
  const flashcards: Action | null = weakest
    ? { kind: "link", href: textHref(weakest.textSlug), label: `溫「${weakestName}」閃卡` }
    : null;
  const notebook: Action = {
    kind: "link",
    href: "/dse/chinese/error-notebook",
    label: `開錯題本（${notebookCount} 題）`,
  };

  switch (report.sessionKind) {
    case "mistake-retest": {
      const resolvedLine = correct > 0 ? `今次答啱 ${correct} 題，已自動移出錯題本。` : "";
      if (notebookCount === 0) {
        return {
          title: "錯題本清晒！",
          detail: `${resolvedLine}下一步做一次新診斷，睇下有冇新弱點。`,
          primary: { kind: "new-diagnosis", label: "做一次新診斷" },
          secondary: [],
        };
      }
      return {
        title: `仲有 ${notebookCount} 題留喺錯題本`,
        detail: `${resolvedLine}${wrong > 0 ? `答錯嘅 ${wrong} 題會留低，先睇下面解析，溫返相關範文，再重測。` : ""}`,
        primary: { kind: "retest-notebook", label: `再重測餘下 ${notebookCount} 題` },
        secondary: compact([flashcards, notebook]),
      };
    }
    case "remediation": {
      const savedLine = wrong > 0 ? `錯咗嘅 ${wrong} 題已存入錯題本。` : "";
      if (total > 0 && correct / total >= 0.8) {
        return {
          title: `特訓答啱 ${correct}/${total} 題，做得好`,
          detail: `${savedLine}下一步做一次新診斷，確認等級有冇進步。`,
          primary: { kind: "new-diagnosis", label: "做一次新診斷" },
          secondary: wrong > 0 ? [notebook] : [],
        };
      }
      return {
        title: `特訓答啱 ${correct}/${total} 題，仲要鞏固`,
        detail: `${savedLine}建議先溫返範文閃卡，再用錯題本重測。`,
        primary: flashcards ?? notebook,
        secondary: notebookCount > 0
          ? [{ kind: "retest-notebook", label: `重測錯題本（${notebookCount} 題）` }]
          : [],
      };
    }
    case "adaptive": {
      const savedLine = wrong > 0
        ? `本場 ${wrong} 題錯題已自動存入錯題本（而家共 ${notebookCount} 題）。`
        : "今次冇錯題。";
      const secondary = compact([wrong > 0 ? notebook : null, flashcards]);
      if (weakest && masteryFromRate(weakest.rate, weakest.total).tone === "weak") {
        return {
          title: `下一步：專攻「${weakestName}」`,
          detail: `呢篇答啱 ${weakest.correct}/${weakest.total} 題，係今次最弱一篇。專攻測驗會由呢篇未做過嘅題目抽 5–10 題，難題先出。${savedLine}`,
          primary: { kind: "article-focus", textSlug: weakest.textSlug, label: "開始專攻此篇" },
          secondary,
        };
      }
      if (report.weaknesses.length > 0) {
        return {
          title: `下一步：補強「${report.weaknesses[0].category}」`,
          detail: `弱點特訓會針對今次最低分嘅題型抽 5–10 題。${savedLine}`,
          primary: { kind: "remediation", label: "開始弱點特訓" },
          secondary,
        };
      }
      return {
        title: "表現穩定，下一步：30 題完整診斷",
        detail: `完整診斷會測到更多今次未抽中嘅考點。${savedLine}`,
        primary: { kind: "extended", label: "開始 30 題完整診斷" },
        secondary,
      };
    }
    default: {
      const unhandled: never = report.sessionKind;
      throw new Error(`Unhandled session kind: ${String(unhandled)}`);
    }
  }
}

export function CatNextStep({ report }: { report: CatReport }) {
  const notebookCount = useErrorNotebook((s) => s.items.length);
  const toPoolItems = useErrorNotebook((s) => s.toPoolItems);
  const startArticleFocusSession = useCatSession((s) => s.startArticleFocusSession);
  const startRemediationSession = useCatSession((s) => s.startRemediationSession);
  const startExtendedDiagnostic = useCatSession((s) => s.startExtendedDiagnostic);
  const startMistakeRetest = useCatSession((s) => s.startMistakeRetest);
  const resetSession = useCatSession((s) => s.resetSession);
  const [error, setError] = useState<string | null>(null);

  const plan = buildPlan(report, notebookCount);

  const run = (action: Exclude<Action, { kind: "link" }>) => {
    let result: { ok: true } | { ok: false; error: string } = { ok: true };
    switch (action.kind) {
      case "article-focus":
        result = startArticleFocusSession(action.textSlug);
        break;
      case "remediation":
        result = startRemediationSession();
        break;
      case "extended":
        result = startExtendedDiagnostic();
        break;
      case "retest-notebook":
        result = startMistakeRetest(toPoolItems());
        break;
      case "new-diagnosis":
        resetSession();
        break;
      default: {
        const unhandled: never = action;
        throw new Error(`Unhandled action: ${String(unhandled)}`);
      }
    }
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setError(null);
    window.scrollTo({ top: 0 });
  };

  const renderAction = (action: Action, primary: boolean) => {
    const cls = primary
      ? "btn-navy inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold"
      : "inline-flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-semibold text-navy transition-colors hover:border-navy/40";
    const icon = primary ? (
      <ArrowRight className="size-4" aria-hidden />
    ) : action.kind === "link" && action.href.includes("error-notebook") ? (
      <BookMarked className="size-4" aria-hidden />
    ) : null;
    if (action.kind === "link") {
      return (
        <Link key={action.href} href={action.href} className={cls}>
          {action.label}
          {icon}
        </Link>
      );
    }
    return (
      <button key={action.kind} type="button" onClick={() => run(action)} className={cls}>
        {action.label}
        {icon}
      </button>
    );
  };

  return (
    <section
      aria-labelledby="next-step-heading"
      className="rounded-2xl border border-gold/50 bg-white p-5 shadow-[var(--shadow-card)] sm:p-6"
    >
      <p className="flex items-center gap-1.5 text-xs font-extrabold tracking-[0.2em] text-gold-ink">
        <Compass className="size-3.5" aria-hidden />
        建議下一步
      </p>
      <h2
        id="next-step-heading"
        className="mt-2 font-[family-name:var(--font-display)] text-xl font-bold text-navy"
      >
        {plan.title}
      </h2>
      <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-ink-muted">{plan.detail}</p>
      <div className="mt-4 flex flex-wrap items-center gap-2.5">
        {renderAction(plan.primary, true)}
        {plan.secondary.map((a) => renderAction(a, false))}
      </div>
      {error ? (
        <p className="mt-3 rounded-xl border border-rose-700/20 bg-rose-700/10 px-4 py-3 text-sm text-rose-700">
          {error}
        </p>
      ) : null}
    </section>
  );
}
