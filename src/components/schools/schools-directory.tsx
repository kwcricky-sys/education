"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, School } from "lucide-react";
import type { SchoolSummary } from "@/lib/schools/types";
import { cn } from "@/lib/utils";

function uniqueSorted(values: (string | undefined)[]) {
  return [...new Set(values.filter((v): v is string => Boolean(v)))].sort(
    (a, b) => a.localeCompare(b, "zh-Hant"),
  );
}

export function SchoolsDirectory({ schools }: { schools: SchoolSummary[] }) {
  const [q, setQ] = useState("");
  const [net, setNet] = useState("all");
  const [finance, setFinance] = useState("all");
  const [gender, setGender] = useState("all");

  const nets = useMemo(
    () => uniqueSorted(schools.map((s) => s.school_net)),
    [schools],
  );
  const finances = useMemo(
    () => uniqueSorted(schools.map((s) => s.finance_type)),
    [schools],
  );
  const genders = useMemo(
    () => uniqueSorted(schools.map((s) => s.gender)),
    [schools],
  );

  const filtered = useMemo(() => {
    const keyword = q.trim().toLowerCase();
    return schools.filter((s) => {
      if (net !== "all" && s.school_net !== net) return false;
      if (finance !== "all" && s.finance_type !== finance) return false;
      if (gender !== "all" && s.gender !== gender) return false;
      if (!keyword) return true;
      const hay = [
        s.name_zh,
        s.name_en,
        s.district,
        s.address,
        s.school_net,
        s.finance_type,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(keyword);
    });
  }, [schools, q, net, finance, gender]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <label className="relative block">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="搜尋學校名稱、地區、地址…"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pr-3 pl-10 text-sm text-slate-900 outline-none ring-sky-500/30 transition focus:bg-white focus:ring-2"
          />
        </label>

        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          <FilterSelect
            label="校網"
            value={net}
            onChange={setNet}
            options={nets}
          />
          <FilterSelect
            label="資助類別"
            value={finance}
            onChange={setFinance}
            options={finances}
          />
          <FilterSelect
            label="性別"
            value={gender}
            onChange={setGender}
            options={genders}
          />
        </div>

        <p className="mt-3 text-xs text-slate-500">
          顯示 {filtered.length} / {schools.length} 間學校
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center">
          <School className="mx-auto size-8 text-slate-300" />
          <p className="mt-3 text-sm text-slate-500">
            沒有符合條件的學校。請調整篩選或關鍵字。
          </p>
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => (
            <li key={s.id}>
              <Link
                href={`/schools/${s.id}`}
                className={cn(
                  "block h-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition",
                  "hover:border-sky-300 hover:shadow-md",
                )}
              >
                <div className="flex flex-wrap gap-1.5">
                  {s.school_net ? (
                    <span className="rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-semibold text-sky-700">
                      校網 {s.school_net}
                    </span>
                  ) : null}
                  {s.finance_type ? (
                    <span className="rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-semibold text-orange-700">
                      {s.finance_type}
                    </span>
                  ) : null}
                  {s.gender ? (
                    <span className="rounded-full bg-slate-50 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                      {s.gender}
                    </span>
                  ) : null}
                </div>
                <h2 className="mt-3 font-[family-name:var(--font-display)] text-base font-bold text-slate-900">
                  {s.name_zh}
                </h2>
                {s.name_en ? (
                  <p className="mt-1 line-clamp-1 text-xs text-slate-500">
                    {s.name_en}
                  </p>
                ) : null}
                {s.district || s.address ? (
                  <p className="mt-2 line-clamp-2 text-xs text-slate-500">
                    {[s.district, s.address].filter(Boolean).join(" · ")}
                  </p>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <label className="block text-xs font-medium text-slate-500">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none focus:bg-white focus:ring-2 focus:ring-sky-500/30"
      >
        <option value="all">全部</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
}
