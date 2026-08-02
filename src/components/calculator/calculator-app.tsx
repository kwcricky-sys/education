"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Calculator, RotateCcw } from "lucide-react";
import { MarkdownReport } from "@/components/calculator/markdown-report";
import { runCalculator } from "@/lib/calculator/advice";
import { pct } from "@/lib/calculator/probability";
import type {
  CalculatorInput,
  CalculatorResult,
  ChildGender,
  DiscretionaryScore,
  GenderPref,
  Readiness,
  TeachingStyle,
} from "@/lib/calculator/types";
import type { SchoolSummary } from "@/lib/schools/types";
import { cn } from "@/lib/utils";

const STEPS = [
  "居住校網",
  "自行分配分數",
  "小朋友性別",
  "學校性別偏好",
  "教學風格",
  "準備程度",
] as const;

type Props = {
  schools: SchoolSummary[];
  schoolNets: string[];
};

export function CalculatorApp({ schools, schoolNets }: Props) {
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [form, setForm] = useState<CalculatorInput>({
    schoolNet: schoolNets[0] ?? "",
    score: 20,
    childGender: "boy",
    genderPref: "coed",
    style: "academic",
    readiness: "mid",
    targetSchoolName: "",
  });

  const progress = ((step + (result ? 1 : 0)) / (STEPS.length + 1)) * 100;

  const onCompute = () => {
    setResult(runCalculator(form, schools));
  };

  const reset = () => {
    setResult(null);
    setStep(0);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-10 sm:px-6">
      <Link
        href="/schools"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-sky-700"
      >
        <ArrowLeft className="size-3.5" />
        返回學校列表
      </Link>

      <header>
        <p className="text-xs font-semibold tracking-[0.18em] text-sky-600 uppercase">
          0 Token · 規則引擎
        </p>
        <h1 className="mt-2 flex items-center gap-2 font-[family-name:var(--font-display)] text-3xl font-extrabold text-slate-900">
          <Calculator className="size-7 text-sky-600" />
          小一大抽獎機率計算器
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          6 條問答即時估算自行分配成功率，並 Match 36 種家長 Persona
          廣東話備戰報告。
        </p>
      </header>

      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-sky-500 to-orange-400 transition-all"
          style={{ width: `${Math.min(100, progress)}%` }}
        />
      </div>

      {result ? (
        <ResultView result={result} onReset={reset} />
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <p className="text-xs font-semibold text-slate-500">
            步驟 {step + 1} / {STEPS.length} · {STEPS[step]}
          </p>

          <div className="mt-5">
            {step === 0 && (
              <Field label="你居住／統一派位所屬校網">
                <select
                  value={form.schoolNet}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, schoolNet: e.target.value }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm"
                >
                  <option value="">尚未確定／跨網申請</option>
                  {schoolNets.map((n) => (
                    <option key={n} value={n}>
                      校網 {n}
                    </option>
                  ))}
                </select>
              </Field>
            )}

            {step === 1 && (
              <Field label="自行分配學位預計分數">
                <OptionGrid
                  options={[
                    { value: 25, label: "25 分", hint: "優勢較大" },
                    { value: 20, label: "20 分", hint: "中游偏上" },
                    { value: 15, label: "15 分", hint: "要靠策略" },
                  ]}
                  value={form.score}
                  onChange={(score) =>
                    setForm((f) => ({
                      ...f,
                      score: score as DiscretionaryScore,
                    }))
                  }
                />
              </Field>
            )}

            {step === 2 && (
              <Field label="小朋友性別">
                <OptionGrid
                  options={[
                    { value: "boy", label: "男仔" },
                    { value: "girl", label: "女仔" },
                  ]}
                  value={form.childGender}
                  onChange={(v) =>
                    setForm((f) => ({
                      ...f,
                      childGender: v as ChildGender,
                    }))
                  }
                />
              </Field>
            )}

            {step === 3 && (
              <Field label="你較想申請邊類性別學校？">
                <OptionGrid
                  options={[
                    { value: "coed", label: "男女校", hint: "彈性較大" },
                    { value: "boys", label: "男校", hint: "單性別" },
                    { value: "girls", label: "女校", hint: "單性別" },
                  ]}
                  value={form.genderPref}
                  onChange={(v) =>
                    setForm((f) => ({ ...f, genderPref: v as GenderPref }))
                  }
                />
              </Field>
            )}

            {step === 4 && (
              <Field label="選校／教學風格">
                <OptionGrid
                  options={[
                    {
                      value: "academic",
                      label: "傳統學術",
                      hint: "紀律・測驗",
                    },
                    {
                      value: "bilingual",
                      label: "雙語國際",
                      hint: "直資／私立",
                    },
                    {
                      value: "happy",
                      label: "愉快學習",
                      hint: "全人發展",
                    },
                  ]}
                  value={form.style}
                  onChange={(v) =>
                    setForm((f) => ({ ...f, style: v as TeachingStyle }))
                  }
                />
              </Field>
            )}

            {step === 5 && (
              <div className="space-y-5">
                <Field label="而家準備程度？">
                  <OptionGrid
                    options={[
                      { value: "low", label: "尚未準備" },
                      { value: "mid", label: "準備中" },
                      { value: "high", label: "已經充足" },
                    ]}
                    value={form.readiness}
                    onChange={(v) =>
                      setForm((f) => ({ ...f, readiness: v as Readiness }))
                    }
                  />
                </Field>
                <Field label="心儀學校名稱（可選）">
                  <input
                    type="text"
                    value={form.targetSchoolName ?? ""}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        targetSchoolName: e.target.value,
                      }))
                    }
                    placeholder="例如：中西區聖安多尼學校"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm"
                  />
                </Field>
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-wrap justify-between gap-3">
            <button
              type="button"
              disabled={step === 0}
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 disabled:opacity-40"
            >
              上一步
            </button>
            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-sky-500"
              >
                下一步
                <ArrowRight className="size-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onCompute}
                className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-orange-400"
              >
                計出成功率 & 報告
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ResultView({
  result,
  onReset,
}: {
  result: CalculatorResult;
  onReset: () => void;
}) {
  const rate = useMemo(
    () => Number(pct(result.probability.successRate, 0)),
    [result.probability.successRate],
  );

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold text-slate-500 uppercase">
          估算自行分配成功率
        </p>
        <p className="mt-2 font-[family-name:var(--font-display)] text-5xl font-extrabold text-sky-600">
          {rate}%
        </p>
        <p className="mt-2 text-sm text-slate-600">
          Persona：{result.personaName}
        </p>
        <div className="mt-4 grid gap-2 text-xs text-slate-500 sm:grid-cols-3">
          <span>基礎率 {pct(result.probability.discretionaryRate, 0)}%</span>
          <span>性別修正 ×{result.probability.genderModifier.toFixed(2)}</span>
          <span>
            策略修正 ×{result.probability.strategyModifier.toFixed(2)}
          </span>
        </div>
        {result.probability.notes.length > 0 ? (
          <ul className="mt-4 list-disc space-y-1 pl-5 text-xs text-amber-800">
            {result.probability.notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <MarkdownReport source={result.reportMarkdown} />
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700"
        >
          <RotateCcw className="size-4" />
          再算一次
        </button>
        <Link
          href="/portfolio-builder"
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white"
        >
          製作叩門 Portfolio
        </Link>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-semibold text-slate-900">{label}</span>
      {children}
    </label>
  );
}

function OptionGrid({
  options,
  value,
  onChange,
}: {
  options: { value: string | number; label: string; hint?: string }[];
  value: string | number;
  onChange: (v: string | number) => void;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-3">
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={String(opt.value)}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              "rounded-2xl border px-3 py-4 text-left transition",
              active
                ? "border-sky-400 bg-sky-50 shadow-sm"
                : "border-slate-200 bg-slate-50 hover:border-slate-300",
            )}
          >
            <span className="block text-sm font-bold text-slate-900">
              {opt.label}
            </span>
            {opt.hint ? (
              <span className="mt-1 block text-xs text-slate-500">
                {opt.hint}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
