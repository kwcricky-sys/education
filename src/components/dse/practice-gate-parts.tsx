import { ArrowRight, Lock, RotateCcw } from "lucide-react";

export type UnitRef = { id: number; name: string };

export function GateProgress({
  answered,
  total,
  pass,
}: {
  answered: number;
  total: number;
  pass: number;
}) {
  const pct = total === 0 ? 0 : Math.round((answered / total) * 100);
  return (
    <div className="mt-6 rounded-xl border border-line bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="font-semibold text-navy">
          已答 {answered}/{total} 題
        </span>
        <span className="text-ink-muted">
          合格線：答啱 {pass} 題或以上 · 每題揀咗就唔改得，提交後先對答案
        </span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200">
        <div className="h-full rounded-full bg-navy transition-[width]" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function GateResult({
  passCount,
  total,
  pass,
  passed,
  unitId,
  unlocked,
  next,
  onRetry,
  onOpenUnit,
}: {
  passCount: number;
  total: number;
  pass: number;
  passed: boolean;
  unitId: number;
  unlocked: UnitRef[];
  next: UnitRef | undefined;
  onRetry: () => void;
  onOpenUnit?: (id: number) => void;
}) {
  const wrong = total - passCount;
  const targets = unlocked.length > 0 ? unlocked : next ? [next] : [];

  return (
    <div
      role="status"
      className={`mt-6 rounded-2xl border p-6 ${
        passed ? "border-emerald-700/30 bg-emerald-700/10" : "border-rose-700/30 bg-rose-700/10"
      }`}
    >
      <p className="text-center text-2xl font-bold text-ink">
        {passCount}/{total} — {passed ? "合格 🎉" : "未合格"}
      </p>
      {passed ? (
        <>
          <p className="mt-2 text-center text-sm text-ink-muted">
            單元 {unitId} 已完成
            {wrong > 0 ? `。錯咗嘅 ${wrong} 題已標紅，值得睇埋解說。` : "，全對！"}
          </p>
          <div className="mt-4 rounded-xl border border-line bg-white p-4">
            <p className="text-sm font-semibold text-navy">
              {unlocked.length > 0
                ? `新解鎖 ${unlocked.length} 個單元`
                : next
                  ? "下一步"
                  : "全部單元已完成"}
            </p>
            {targets.length > 0 ? (
              <ul className="mt-2 space-y-2">
                {targets.map((u) => (
                  <li key={u.id}>
                    {onOpenUnit ? (
                      <button
                        type="button"
                        onClick={() => onOpenUnit(u.id)}
                        className="group flex w-full items-center justify-between gap-3 rounded-lg border border-line bg-cream/50 px-3 py-2 text-left text-sm text-ink transition-colors hover:border-navy/40"
                      >
                        <span>
                          單元 {u.id}　{u.name}
                        </span>
                        <span className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-gold-ink">
                          開始
                          <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" aria-hidden />
                        </span>
                      </button>
                    ) : (
                      <span className="text-sm text-ink">
                        單元 {u.id}　{u.name}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-1 text-sm text-ink-muted">
                可以返去任何單元重溫，或者去題庫按課題再練。
              </p>
            )}
          </div>
        </>
      ) : (
        <>
          <p className="mt-2 text-center text-sm text-ink-muted">
            仲差 {pass - passCount} 題就合格（要答啱 {pass}/{total}）。錯咗嘅題目已標紅：
            先睇解說、重讀上面課文，再重做同一組 {total} 題。
          </p>
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={onRetry}
              className="btn-navy inline-flex items-center gap-2 rounded-full px-8 py-2.5 font-semibold"
            >
              <RotateCcw className="size-4" aria-hidden />
              再做一次
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export function LockedNotice({ missing }: { missing: UnitRef[] }) {
  return (
    <div className="rounded-2xl border border-amber-700/30 bg-amber-700/10 p-6 text-center">
      <p className="inline-flex items-center gap-1.5 font-medium text-amber-800">
        <Lock className="size-4" aria-hidden />
        未解鎖：請先通過{" "}
        {missing.map((u) => `單元 ${u.id}（${u.name}）`).join("、")}
      </p>
      <p className="mt-1 text-sm text-amber-800/70">
        單元按次序解鎖，每個概念都建立喺前一個之上。
      </p>
    </div>
  );
}
