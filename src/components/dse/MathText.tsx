"use client";

import katex from "katex";
import "katex/dist/katex.min.css";
import type { ReactNode } from "react";
import { asciiMathToKatex } from "@/lib/dse/math-ascii-to-katex";

type MathTextProps = {
  text: string;
  /** When true (default), try ASCII → KaTeX. Failure stays plain text. */
  convertAscii?: boolean;
  className?: string;
};

const TEX_SEGMENT = /\\\(([\s\S]*?)\\\)/g;

/**
 * Math-only inline text. KaTeX CSS is imported here so it enters the client
 * graph with this component, not the root layout.
 * Fragments scroll inside the card (`overflow-x-auto`) at 390 / 440 / 760.
 */
export default function MathText({
  text,
  convertAscii = true,
  className,
}: MathTextProps) {
  const source = convertAscii ? asciiMathToKatex(text) : text;
  const rendered = renderSegments(source);
  if (!rendered) {
    return <span className={className}>{text}</span>;
  }
  return <span className={className}>{rendered}</span>;
}

function renderSegments(source: string): ReactNode[] | null {
  const nodes: ReactNode[] = [];
  const pattern = new RegExp(TEX_SEGMENT.source, "g");
  let last = 0;
  let sawMath = false;
  for (const match of source.matchAll(pattern)) {
    const index = match.index ?? 0;
    if (index > last) nodes.push(source.slice(last, index));
    const html = renderTex(match[1] ?? "");
    if (!html) return null;
    sawMath = true;
    nodes.push(
      <span
        key={`${index}-${match[1]}`}
        className="math-fragment inline-block max-w-full overflow-x-auto align-middle"
        dangerouslySetInnerHTML={{ __html: html }}
      />,
    );
    last = index + match[0].length;
  }
  if (!sawMath) return null;
  if (last < source.length) nodes.push(source.slice(last));
  return nodes;
}

function renderTex(tex: string): string | null {
  try {
    const html = katex.renderToString(tex, {
      throwOnError: false,
      trust: false,
      strict: "ignore",
      displayMode: false,
    });
    if (html.includes("katex-error")) return null;
    return html;
  } catch {
    return null;
  }
}
