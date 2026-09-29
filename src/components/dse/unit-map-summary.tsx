import { ArrowRight } from "lucide-react";
import type { UnitRef } from "@/components/dse/practice-gate-parts";

export function UnitMapSummary({
  done,
  total,
  next,
  onOpenUnit,
}: {
  done: number;
  total: number;
  next: UnitRef | undefined;
  onOpenUnit: (id: number) => void;
}) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  return (
    <div className="rounded-2xl border border-line bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-extrabold tracking-[0.2em] text-gold-ink">你嘅進度</p>
          <p className="mt-1 text-sm font-semibold text-navy">
            已通過 {done}/{total} 個單元
          </p>
        </div>
        {next ? (
          <button
            type="button"
            onClick={() => onOpenUnit(next.id)}
            className="btn-navy inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold"
          >
            {done === 0 ? "由" : "下一步："}單元 {next.id}
            {done === 0 ? "開始" : ""}
            <ArrowRight className="size-3.5" aria-hidden />
          </button>
        ) : done === total ? (
          <span className="text-sm font-semibold text-emerald-700">全部單元已完成 🎉</span>
        ) : null}
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200">
        <div className="h-full rounded-full bg-navy" style={{ width: `${pct}%` }} />
      </div>
      {next ? (
        <p className="mt-2 text-xs text-ink-muted">
          建議下一個：單元 {next.id}　{next.name}
        </p>
      ) : null}
    </div>
  );
}

export function scrollToUnit(id: number) {
  window.requestAnimationFrame(() => {
    document.getElementById(`unit-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}
