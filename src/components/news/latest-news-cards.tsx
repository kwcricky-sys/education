import Link from "next/link";
import { ArrowRight, Newspaper } from "lucide-react";
import type { SchoolNewsItem } from "@/lib/news/fetch-news";

function cleanSummary(text: string | undefined, max = 120) {
  if (!text) return "";
  const flat = text.replace(/\s+/g, " ").trim();
  return flat.length > max ? `${flat.slice(0, max)}…` : flat;
}

export function LatestNewsCards({
  items,
  generatedAt,
  showViewAll = true,
  showHeading = true,
}: {
  items: SchoolNewsItem[];
  generatedAt?: string;
  showViewAll?: boolean;
  showHeading?: boolean;
}) {
  if (items.length === 0) return null;

  return (
    <section className="mt-10">
      {showHeading ? (
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-orange-600 uppercase">
              Latest News
            </p>
            <h2 className="mt-1 flex items-center gap-2 font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--ink-text)]">
              <Newspaper className="size-6 text-orange-500" />
              最新直私報名情報
            </h2>
            {generatedAt ? (
              <p className="mt-1 text-xs text-[var(--ink-faint)]">
                資料更新：{new Date(generatedAt).toLocaleDateString("zh-HK")}
              </p>
            ) : null}
          </div>
          {showViewAll ? (
            <Link
              href="/news"
              className="inline-flex items-center gap-1 text-sm font-semibold text-orange-600 hover:text-orange-500"
            >
              查看全部
              <ArrowRight className="size-3.5" />
            </Link>
          ) : null}
        </div>
      ) : null}

      <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const href =
            item.source_url ||
            item.url ||
            (item.school_id ? `/schools/${item.school_id}` : "/news");
          const external = Boolean(item.source_url || item.url);
          return (
            <li key={item.id ?? `${item.school_id}-${item.title}`}>
              <a
                href={href}
                {...(external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="panel-lift block h-full rounded-2xl border border-[var(--ink-border)] bg-white/80 p-5"
              >
                <p className="text-[11px] font-semibold text-orange-600">
                  {item.school_name ?? "直私情報"}
                  {item.event_date ? ` · ${item.event_date}` : ""}
                </p>
                <h3 className="mt-2 line-clamp-2 text-sm font-bold text-[var(--ink-text)]">
                  {item.title ?? "入學消息"}
                </h3>
                <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-[var(--ink-muted)]">
                  {cleanSummary(item.summary)}
                </p>
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
