"use client";

import { useState } from "react";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  ChevronDown,
  ScanSearch,
} from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    icon: ArrowUpCircle,
    title: "答對升級",
    body: "答對題目後，系統自動推播更難（Hard）的考評局高分題，測試你的上限。",
    accent: "text-emerald-300",
  },
  {
    icon: ArrowDownCircle,
    title: "答錯降級",
    body: "答錯時，系統自動降至基礎題（Easy），幫你檢查字詞與句譯底子。",
    accent: "text-amber-300",
  },
  {
    icon: ScanSearch,
    title: "極速定位",
    body: "只需 15–20 題，就能像醫療 CT 掃描一樣，精準算出你的 DSE 等級（Level 1 至 5**）並找出致命弱點！",
    accent: "text-sky-300",
  },
] as const;

/** Explains adaptive testing in plain Chinese for DSE students. */
export function HowItWorks() {
  const [open, setOpen] = useState(true);

  return (
    <section className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left sm:px-6"
        aria-expanded={open}
      >
        <span>
          <span className="block text-xs font-semibold tracking-[0.18em] text-sky-300 uppercase">
            How it works
          </span>
          <span className="mt-1 block font-[family-name:var(--font-display)] text-lg font-bold text-white sm:text-xl">
            什麼是「自適應診斷（Adaptive Test）」？
          </span>
        </span>
        <ChevronDown
          className={cn(
            "size-5 shrink-0 text-slate-400 transition",
            open && "rotate-180",
          )}
        />
      </button>

      {open ? (
        <div className="border-t border-white/8 px-5 pb-6 pt-4 sm:px-6">
          <p className="text-sm leading-relaxed text-slate-400">
            傳統刷題要你做完 720
            題，既費時又做重複題。我們的演算法會「看人出題」——完全在你的瀏覽器本地運行，無需登入、無需 AI
            API。
          </p>
          <ol className="mt-5 grid gap-3 sm:grid-cols-3">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <li
                  key={step.title}
                  className="rounded-2xl border border-white/8 bg-[#070a12]/60 p-4"
                >
                  <div className="flex items-center gap-2">
                    <span className="flex size-7 items-center justify-center rounded-lg bg-white/5 text-xs font-bold text-slate-500">
                      {i + 1}
                    </span>
                    <Icon className={cn("size-4", step.accent)} />
                  </div>
                  <p className="mt-3 font-semibold text-white">{step.title}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-400">
                    {step.body}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      ) : null}
    </section>
  );
}
