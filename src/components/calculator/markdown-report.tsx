import type { ReactNode } from "react";

/** Tiny markdown renderer for calculator reports (no extra dependency). */
export function MarkdownReport({ source }: { source: string }) {
  const blocks = source.trim().split(/\n{2,}/);

  return (
    <div className="space-y-4 text-sm leading-relaxed text-slate-700">
      {blocks.map((block, i) => {
        const lines = block.split("\n");
        if (lines[0].startsWith("## ")) {
          return (
            <h2
              key={i}
              className="font-[family-name:var(--font-display)] text-xl font-bold text-slate-900"
            >
              {renderInline(lines[0].replace(/^##\s+/, ""))}
            </h2>
          );
        }
        if (lines[0].startsWith("### ")) {
          return (
            <h3 key={i} className="text-base font-bold text-slate-900">
              {renderInline(lines[0].replace(/^###\s+/, ""))}
            </h3>
          );
        }
        if (lines[0].startsWith("> ")) {
          return (
            <blockquote
              key={i}
              className="rounded-xl border border-sky-100 bg-sky-50 px-4 py-3 text-sky-900"
            >
              {renderInline(
                lines.map((l) => l.replace(/^>\s?/, "")).join(" "),
              )}
            </blockquote>
          );
        }
        if (lines.every((l) => /^[-*]\s+/.test(l) || /^\d+\.\s+/.test(l))) {
          const ordered = /^\d+\.\s+/.test(lines[0]);
          const Tag = ordered ? "ol" : "ul";
          return (
            <Tag
              key={i}
              className={
                ordered
                  ? "list-decimal space-y-2 pl-5"
                  : "list-disc space-y-2 pl-5"
              }
            >
              {lines.map((l, j) => (
                <li key={j}>
                  {renderInline(
                    l.replace(/^[-*]\s+/, "").replace(/^\d+\.\s+/, ""),
                  )}
                </li>
              ))}
            </Tag>
          );
        }
        return (
          <p key={i} className="whitespace-pre-wrap">
            {lines.map((l, j) => (
              <span key={j}>
                {j > 0 ? <br /> : null}
                {renderInline(l)}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}

function renderInline(text: string): ReactNode {
  const nodes: ReactNode[] = [];
  const re = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    if (m[1]) {
      nodes.push(
        <strong key={key++} className="font-semibold text-slate-900">
          {m[1]}
        </strong>,
      );
    } else if (m[2] && m[3]) {
      nodes.push(
        <a
          key={key++}
          href={m[3]}
          className="font-medium text-sky-700 underline-offset-2 hover:underline"
        >
          {m[2]}
        </a>,
      );
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  if (nodes.length === 0) return text;
  return <>{nodes}</>;
}
