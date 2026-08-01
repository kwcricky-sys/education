"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CatQuiz } from "@/components/dse/cat/cat-quiz";
import { CatReport } from "@/components/dse/cat/cat-report";
import { CatSetup } from "@/components/dse/cat/cat-setup";
import { useCatSession } from "@/store/cat-session";

export function CatApp() {
  const phase = useCatSession((s) => s.phase);

  return (
    <div className="space-y-6">
      {phase === "setup" ? (
        <Link
          href="/dse/chinese"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 transition hover:text-sky-300"
        >
          <ArrowLeft className="size-3.5" />
          指定範文列表
        </Link>
      ) : null}

      {phase === "setup" ? <CatSetup /> : null}
      {phase === "testing" ? <CatQuiz /> : null}
      {phase === "report" ? <CatReport /> : null}
    </div>
  );
}
