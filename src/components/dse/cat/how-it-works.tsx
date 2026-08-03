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
    accent: "text-emerald-400",
  },
  {
    icon: ArrowDownCircle,
    title: "答錯降級",
    body: "答錯時，系統自動降至基礎題（Easy），幫你檢查字詞與句譯底子。",
    accent: "text-amber-400",
  },
  {
    icon: ScanSearch,
    title: "極速定位",
    body: "只需 15–20 題，就能像醫療 CT 掃描一樣，精準算出你的 DSE 等級並找出致命弱點！",
    accent: "text-cyan-400",
  },
] as const;

/** Explains adaptive testing in plain Chinese for DSE students. */
export function HowItWorks() {
  const [open, setOpen] = useState(true);

  return (
    <section className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/80 shadow-lg backdrop-blur-md">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition-all duration-300 hover:bg-zinc-800/40 sm:px-6"
        aria-expanded={open}
      >
        <span>
          <span className="block text-xs font-semibold tracking-wide text-cyan-400">
            運作原理
          </span>
          <span className="mt-1 block font-[family-name:var(--font-display)] text-lg font-bold text-zinc-100 sm:text-xl">
            什麼是「自適應診斷（Adaptive Test）」？
          </span>
        </span>
        <ChevronDown
          className={cn(
            "size-5 shrink-0 text-zinc-500 transition-transform duration-300",
            open && "rotate-180",
          )}
        />
      </button>

      {open ? (
        <div className="border-t border-white/10 px-5 pb-6 pt-4 sm:px-6">
          <p className="text-sm leading-relaxed text-zinc-400">
            傳統刷題要你做完 720
            題，既費時又做重複題。我們的演算法會「看人出題」——完全在你的瀏覽器本地運行，無需登入、無需 AI
            API。高階題過快答對會視為疑似瞎猜，不會虛高你的等級。
          </p>
          <ol className="mt-5 grid gap-3 sm:grid-cols-3">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <li
                  key={step.title}
                  className="rounded-xl border border-white/5 bg-zinc-950/50 p-4 transition-all duration-300 hover:border-white/10 hover:bg-zinc-800/50"
                >
                  <div className="flex items-center gap-2">
                    <span className="flex size-7 items-center justify-center rounded-lg border border-white/10 bg-zinc-900 text-xs font-bold text-zinc-500">
                      {i + 1}
                    </span>
                    <Icon className={cn("size-4", step.accent)} />
                  </div>
                  <p className="mt-3 font-semibold text-zinc-100">{step.title}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">
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
