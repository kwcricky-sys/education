import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CHINESE_UNITS } from "@/lib/dse/chinese-path";
import { ECON_UNITS } from "@/lib/dse/econ-path";
import { ENGLISH_UNITS } from "@/lib/dse/english-path";
import { ICT_UNITS } from "@/lib/dse/ict-path";
import { MATH_UNITS } from "@/lib/dse/math-path";
import { BAFS_UNITS } from "@/lib/dse/bafs-path";
import econSkeletons from "@/data/dse/econ-skeletons.json";

/**
 * Cross-links between the six learn paths, so a learner who lands on one
 * subject's learn page can reach the others without going back to /dse.
 * Counts are read from the unit tables, so they never drift.
 */
const LEARN_PATHS = [
  {
    href: "/dse/chinese/learn",
    label: "中文科自學路徑",
    detail: `範文導讀、閱讀策略、寫作審題同說話，${CHINESE_UNITS.length} 單元每單元 4 題 gate。`,
    count: `${CHINESE_UNITS.length} 單元`,
  },
  {
    href: "/dse/english/learn",
    label: "English 自學路徑",
    detail: `卷一閱讀、卷二寫作、卷三聆聽綜合、卷四說話，${ENGLISH_UNITS.length} 單元一課一課解鎖。`,
    count: `${ENGLISH_UNITS.length} 單元`,
  },
  {
    href: "/dse/econ/learn",
    label: "經濟（ECON）自學路徑",
    detail: `需求與供應、彈性、市場干預、生產與成本、市場結構、GDP，${ECON_UNITS.length} 單元加圖表陷阱課同 ${econSkeletons.skeletons.length} 條答題骨架。`,
    count: `${ECON_UNITS.length} 單元`,
  },
  {
    href: "/dse/math/learn",
    label: "數學（必修）自學路徑",
    detail: `必修部分 ${MATH_UNITS.length} 單元，每單元 4 條加深題加 worked example；不混 M1／M2。`,
    count: `${MATH_UNITS.length} 單元`,
  },
  {
    href: "/dse/bafs/learn",
    label: "BAFS 自學路徑",
    detail: `商業環境、管理、市場營銷、人力資源、會計等式、財務報表、比率、個人理財，${BAFS_UNITS.length} 單元加弱項課同格式卡。`,
    count: `${BAFS_UNITS.length} 單元`,
  },
  {
    href: "/dse/ict/learn",
    label: "ICT 自學路徑",
    detail: `電腦系統、數據表示、網絡、互聯網、數據庫、多媒體、演算法、保安、社會議題同應試，${ICT_UNITS.length} 單元。`,
    count: `${ICT_UNITS.length} 單元`,
  },
];

export function LearnCrossLinks({ current }: { current: string }) {
  const others = LEARN_PATHS.filter((p) => p.href !== current);
  return (
    <section className="mt-10 rounded-2xl border border-line bg-white p-6" aria-labelledby="other-learn">
      <p className="text-xs font-extrabold tracking-[0.2em] text-gold-ink">換科溫習</p>
      <h2
        id="other-learn"
        className="mt-2 font-[family-name:var(--font-display)] text-xl font-bold text-navy"
      >
        其他科嘅自學路徑
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">
        六條路徑都喺本站，行完一科可以直接跳去另一科；進度只存喺你部機。
      </p>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {others.map((path) => (
          <li key={path.href}>
            <Link
              href={path.href}
              className="group flex items-start gap-3 rounded-xl border border-line bg-cream/40 px-3.5 py-3 transition-colors hover:border-navy/40 hover:bg-white"
            >
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="text-sm font-bold text-navy">{path.label}</span>
                  <span className="rounded-full bg-navy/5 px-2 py-0.5 text-[11px] font-bold text-navy">
                    {path.count}
                  </span>
                </span>
                <span className="mt-1 block text-xs leading-relaxed text-ink-muted">
                  {path.detail}
                </span>
              </span>
              <ArrowRight
                className="mt-1 size-4 shrink-0 text-ink-faint transition-transform group-hover:translate-x-0.5 group-hover:text-navy"
                aria-hidden
              />
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-ink-faint">
        全部課文同練習由本站整理，屬自編溫習內容，唔係考評局教材。
      </p>
    </section>
  );
}