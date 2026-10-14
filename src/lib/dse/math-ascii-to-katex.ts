/**
 * Strategy A — ASCII math fragments to KaTeX, without editing drill JSON.
 *
 * Equation display (§E) code map:
 * | Row | Where |
 * | Stem | `math-practice-gate.tsx` — `<MathText text={q.question} />`; `{qi+1}. ` stays outside |
 * | Options | `splitChoicePrefix` + `math-practice-gate.tsx` — letter prefix, MathText(body) |
 * | Explanation | `math-practice-gate.tsx` — same page, after submit |
 * | Lesson / worked | `math-unit-map.tsx` — concept, scenario, walkthrough, traps |
 * | Video-check prompts | `app/dse/math/learn/page.tsx` — math route only |
 * | Exponents (R1–R3, Must) | `applyExponents` in this file |
 * | × ÷ √ relations (R5, R7, R8) | symbol map, only inside a run that already has `^` |
 * | Fractions (R6) | kept as `/` (no `\frac`) so wide quotients do not force a tall layout |
 * | Prose / units (R11) | runs without `^` stay original text; `km/h`, currency `$5000` |
 * | Already TeX (R12) | input containing `\` is returned unchanged |
 * | Mobile 390/440/760 | `MathText` fragment: `max-w-full overflow-x-auto` |
 * | Other subjects | N/A — MathText is not imported by CHI/EN/ECON/BAFS/ICT or `practice-gate.tsx` |
 * | learn-play | N/A — SKIP (no DSE exponent drills) |
 * | Unit titles / term chips | N/A — labels have no exponents; definitions are `title` tooltips |
 * | Shared `/dse/[subject]` question route | N/A — one page module for every subject |
 *
 * Failures return the original string.
 */

/** Same as `/^([A-D])\.\s*(.*)$/s` without the `s` flag (tsconfig target is ES2017). */
const CHOICE_PREFIX = /^([A-D])\.\s*([\s\S]*)$/;

const FUNCTIONS = new Set(["sin", "cos", "tan", "sec", "csc", "cot", "log", "ln", "sqrt"]);

const FUNCTION_TEX: Record<string, string> = {
  sin: "\\sin",
  cos: "\\cos",
  tan: "\\tan",
  sec: "\\sec",
  csc: "\\csc",
  cot: "\\cot",
  log: "\\log",
  ln: "\\ln",
  sqrt: "\\sqrt",
};

const SYMBOL_TEX: Record<string, string> = {
  "×": "\\times",
  "·": "\\cdot",
  "⋅": "\\cdot",
  "÷": "\\div",
  "−": "-",
  "≤": "\\le",
  "≥": "\\ge",
  "≠": "\\neq",
  "≈": "\\approx",
  π: "\\pi",
  θ: "\\theta",
  Δ: "\\Delta",
  α: "\\alpha",
  β: "\\beta",
  γ: "\\gamma",
  λ: "\\lambda",
  μ: "\\mu",
  ω: "\\omega",
  σ: "\\sigma",
  "√": "\\sqrt",
  "*": "\\times",
};

const OPERATORS = new Set([
  "+",
  "-",
  "*",
  "/",
  "=",
  "<",
  ">",
  "×",
  "÷",
  "−",
  "≤",
  "≥",
  "≠",
  "≈",
  "·",
  "⋅",
]);

type RoughCls = "space" | "break" | "hyphen" | "ident" | "math";
type Kind = "space" | "break" | "prose" | "math";

type Rough = { raw: string; start: number; end: number; cls: RoughCls };
type Tok = { raw: string; start: number; end: number; kind: Kind };

/**
 * Split an MC option into its letter prefix and the math body.
 * `A. 2^4` → `{ prefix: "A. ", body: "2^4" }`. Unmatched strings stay whole.
 */
export function splitChoicePrefix(option: string): { prefix: string; body: string } {
  const match = CHOICE_PREFIX.exec(option);
  if (!match) return { prefix: "", body: option };
  return { prefix: `${match[1]}. `, body: match[2] };
}

/** Plain text with `\( ... \)` around converted fragments. Original string on failure. */
export function asciiMathToKatex(input: string): string {
  try {
    if (typeof input !== "string" || input.length === 0) return input;
    if (input.includes("\\")) return input;
    const wrapped = /^\$([\s\S]*)\$$/.exec(input);
    if (
      wrapped &&
      /[\\^{}_]/.test(wrapped[1]) &&
      !/^[\d,.\s]+$/.test(wrapped[1])
    ) {
      const inner = wrapped[1];
      if (inner.includes("\\")) return `\\(${inner}\\)`;
      return convertPlain(inner);
    }
    return convertPlain(input);
  } catch {
    return input;
  }
}

function convertPlain(input: string): string {
  const tokens = tokenize(input);
  let out = "";
  let i = 0;
  while (i < tokens.length) {
    const token = tokens[i];
    switch (token.kind) {
      case "space":
      case "break":
      case "prose":
        out += token.raw;
        i += 1;
        break;
      case "math": {
        let j = i + 1;
        while (j < tokens.length) {
          const next = tokens[j];
          if (next.kind === "math") {
            j += 1;
            continue;
          }
          if (
            next.kind === "space" &&
            tokens[j + 1] &&
            tokens[j + 1].kind === "math"
          ) {
            j += 1;
            continue;
          }
          break;
        }
        const slice = tokens.slice(i, j);
        const raw = input.slice(slice[0].start, slice[slice.length - 1].end);
        if (raw.includes("^")) {
          const tex = runToTex(slice);
          out += tex ? `\\(${tex}\\)` : raw;
        } else {
          out += raw;
        }
        i = j;
        break;
      }
      default: {
        const neverKind: never = token.kind;
        return neverKind;
      }
    }
  }
  return out;
}

function tokenize(input: string): Tok[] {
  const rough: Rough[] = [];
  let i = 0;
  while (i < input.length) {
    const start = i;
    const cp = input.codePointAt(i);
    if (cp === undefined) break;
    const ch = String.fromCodePoint(cp);
    if (/\s/u.test(ch)) {
      i += ch.length;
      while (i < input.length) {
        const ncp = input.codePointAt(i);
        if (ncp === undefined) break;
        const nch = String.fromCodePoint(ncp);
        if (!/\s/u.test(nch)) break;
        i += nch.length;
      }
      rough.push({ raw: input.slice(start, i), start, end: i, cls: "space" });
      continue;
    }
    if (/[0-9]/.test(ch)) {
      i += 1;
      while (i < input.length && /[0-9]/.test(input[i])) i += 1;
      if (input[i] === "." && /[0-9]/.test(input[i + 1] ?? "")) {
        i += 1;
        while (i < input.length && /[0-9]/.test(input[i])) i += 1;
      }
      rough.push({ raw: input.slice(start, i), start, end: i, cls: "math" });
      continue;
    }
    if (/[A-Za-z]/.test(ch)) {
      i += 1;
      while (i < input.length && /[A-Za-z]/.test(input[i])) i += 1;
      rough.push({ raw: input.slice(start, i), start, end: i, cls: "ident" });
      continue;
    }
    i += ch.length;
    let cls: RoughCls = "break";
    if (ch === "-") cls = "hyphen";
    else if (isMathChar(ch)) cls = "math";
    rough.push({ raw: ch, start, end: i, cls });
  }

  const kinds: Kind[] = rough.map((tok, index) => {
    if (tok.cls === "space") return "space";
    if (tok.cls === "break") return "break";
    if (tok.cls === "hyphen") return "math";
    if (tok.cls === "math") return "math";
    return identKind(tok.raw, rough[index - 1], rough[index + 1]);
  });

  for (let h = 0; h < rough.length; h += 1) {
    if (rough[h].cls !== "hyphen") continue;
    const prev = kinds[h - 1];
    const next = kinds[h + 1];
    if (prev === "prose" || next === "prose") kinds[h] = "break";
  }

  return rough.map((tok, index) => ({
    raw: tok.raw,
    start: tok.start,
    end: tok.end,
    kind: kinds[index],
  }));
}

function identKind(word: string, prev?: Rough, next?: Rough): Kind {
  if (word.length === 1) return "math";
  if (FUNCTIONS.has(word.toLowerCase())) return "math";
  if (word.length >= 4) return "prose";
  const juxtaposed = (tok?: Rough) => {
    if (!tok) return false;
    if (tok.cls === "space" || tok.cls === "break" || tok.cls === "hyphen") return false;
    if (tok.cls === "math" && OPERATORS.has(tok.raw)) return false;
    return true;
  };
  if (juxtaposed(prev) || juxtaposed(next)) return "math";
  return "prose";
}

function isMathChar(ch: string): boolean {
  if ("+-*/=<>^_()[]{}".includes(ch)) return true;
  if (SYMBOL_TEX[ch]) return true;
  if (OPERATORS.has(ch)) return true;
  const cp = ch.codePointAt(0) ?? 0;
  return (cp >= 0x0391 && cp <= 0x03a9) || (cp >= 0x03b1 && cp <= 0x03c9);
}

function runToTex(tokens: Tok[]): string | null {
  const parts: string[] = [];
  let i = 0;
  while (i < tokens.length) {
    const token = tokens[i];
    switch (token.kind) {
      case "space":
        parts.push(" ");
        i += 1;
        break;
      case "math":
        if (
          token.raw === "√" &&
          tokens[i + 1] &&
          tokens[i + 1].kind === "math" &&
          /^[0-9]/.test(tokens[i + 1].raw)
        ) {
          parts.push(`\\sqrt{${tokens[i + 1].raw}}`);
          i += 2;
          break;
        }
        parts.push(mapMathToken(tokens, i));
        i += 1;
        break;
      case "break":
      case "prose":
        return null;
      default: {
        const neverKind: never = token.kind;
        return neverKind;
      }
    }
  }
  let tex = applySqrt(applyExponents(applySubscripts(parts.join("")))).replace(
    /[−–]/g,
    "-",
  );
  tex = tex.replace(/[ \t]+/g, " ").trim();
  if (!tex || hasBareCaret(tex)) return null;
  if (/[%&#~]/.test(tex)) return null;
  if (/\\sqrt(?![{])/.test(tex)) return null;
  return tex;
}

function mapMathToken(tokens: Tok[], index: number): string {
  const raw = tokens[index].raw;
  if (isTimesX(tokens, index)) return "\\times";
  const fn = FUNCTION_TEX[raw.toLowerCase()];
  if (fn && raw.length > 1) return fn;
  return SYMBOL_TEX[raw] ?? raw;
}

function isTimesX(tokens: Tok[], index: number): boolean {
  const token = tokens[index];
  if (token.raw !== "x" && token.raw !== "X") return false;
  const prev = tokens[index - 1];
  const next = tokens[index + 1];
  if (!prev || !next || prev.kind !== "space" || next.kind !== "space") return false;
  const before = tokens[index - 2];
  const after = tokens[index + 2];
  if (!before || !after || before.kind !== "math" || after.kind !== "math") return false;
  const beforeOk = /[0-9)]$/.test(before.raw);
  const afterOk = /^[0-9(]/.test(after.raw);
  return beforeOk && afterOk;
}

function applySubscripts(src: string): string {
  return src.replace(/_(?!\{)([A-Za-z0-9])/g, "_{$1}");
}

function applyExponents(src: string): string {
  let out = "";
  for (let i = 0; i < src.length; i += 1) {
    if (src[i] !== "^" || (i > 0 && src[i - 1] === "\\")) {
      out += src[i];
      continue;
    }
    const exp = readExponent(src, i + 1);
    if (!exp) {
      out += "^";
      continue;
    }
    const body = applyExponents(exp.body).replace(/[−–]/g, "-").trim();
    out += `^{${body}}`;
    i = exp.end - 1;
  }
  return out;
}

function readExponent(src: string, start: number): { body: string; end: number } | null {
  let i = start;
  if (src[i] === " ") i += 1;
  const ch = src[i];
  if (!ch) return null;
  if (ch === "{") {
    const close = findBalanced(src, i, "{", "}");
    if (close < 0) return null;
    const body = src.slice(i + 1, close);
    if (!body.trim()) return null;
    return { body, end: close + 1 };
  }
  if (ch === "(") {
    const close = findBalanced(src, i, "(", ")");
    if (close < 0) return null;
    const body = src.slice(i + 1, close);
    if (!body.trim()) return null;
    return { body, end: close + 1 };
  }
  const sliced = src.slice(i);
  const matched = /^[−–-]?\d+/.exec(sliced) ?? /^[−–-]?[A-Za-z]/.exec(sliced);
  if (!matched) return null;
  return { body: matched[0], end: i + matched[0].length };
}

function findBalanced(src: string, openIndex: number, open: string, close: string): number {
  if (src[openIndex] !== open) return -1;
  let depth = 0;
  for (let i = openIndex; i < src.length; i += 1) {
    if (src[i] === "\\") {
      i += 1;
      continue;
    }
    if (src[i] === open) depth += 1;
    else if (src[i] === close) {
      depth -= 1;
      if (depth === 0) return i;
    }
  }
  return -1;
}

function applySqrt(src: string): string {
  let out = "";
  for (let i = 0; i < src.length; i += 1) {
    if (src.startsWith("\\sqrt(", i) || src.startsWith("\\sqrt[", i)) {
      const open = i + "\\sqrt".length;
      const closeChar = src[open] === "(" ? ")" : "]";
      const openChar = src[open] ?? "";
      const close = findBalanced(src, open, openChar, closeChar);
      if (close >= 0) {
        out += `\\sqrt{${src.slice(open + 1, close)}}`;
        i = close;
        continue;
      }
    }
    out += src[i];
  }
  return out;
}

function hasBareCaret(tex: string): boolean {
  for (let i = 0; i < tex.length; i += 1) {
    if (tex[i] !== "^") continue;
    if (i > 0 && tex[i - 1] === "\\") continue;
    if (tex[i + 1] !== "{") return true;
  }
  return false;
}
