import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import katex from "katex";
import {
  asciiMathToKatex,
  splitChoicePrefix,
} from "../src/lib/dse/math-ascii-to-katex.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MINUS = "\u2212";

function texOf(converted: string): string[] {
  return [...converted.matchAll(/\\\(([\s\S]*?)\\\)/g)].map((match) => match[1] ?? "");
}

function assertExponents(input: string, label: string): string {
  const out = asciiMathToKatex(input);
  const outside = out.replace(/\\\([\s\S]*?\\\)/g, "");
  assert.equal(outside.includes("^"), false, `${label}: bare ^ outside math\n${out}`);
  for (const tex of texOf(out)) {
    assert.equal(tex.includes("^{"), true, `${label}: missing superscript\n${tex}`);
    assert.equal(hasBareCaret(tex), false, `${label}: bare ^ in tex\n${tex}`);
    const html = katex.renderToString(tex, {
      throwOnError: true,
      trust: false,
      strict: "ignore",
      displayMode: false,
    });
    assert.equal(html.includes("katex-error"), false, label);
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

const twoCubed = assertExponents("2^3", "2^3");
assert.match(twoCubed, /2\^\{3\}/);

const anchor = assertExponents("(2^3 × 2^5) / 2^4", "anchor");
assert.match(anchor, /2\^\{3\}/);
assert.match(anchor, /2\^\{5\}/);
assert.match(anchor, /2\^\{4\}/);
assert.equal((anchor.match(/\(/g) ?? []).length >= 1, true);
assert.equal((anchor.match(/\)/g) ?? []).length >= 1, true);
assert.equal(anchor.includes("/"), true);

const neg = assertExponents("2^{-4}", "2^{-4}");
assert.match(neg, /2\^\{-4\}/);

const unicodeNeg = assertExponents(`10^(${MINUS}4)`, "10^(−4)");
assert.match(unicodeNeg, /10\^\{-4\}/);

const choice = splitChoicePrefix("A. 2^4");
assert.deepEqual(choice, { prefix: "A. ", body: "2^4" });
const choiceBody = assertExponents(choice.body, "choice body");
assert.match(choiceBody, /2\^\{4\}/);
const choiceWhole = assertExponents("A. 2^4", "A. 2^4");
assert.equal(choiceWhole.includes("A^{"), false);
assert.match(choiceWhole, /A\.\s*\\\(2\^\{4\}\\\)/);

assert.equal(asciiMathToKatex("Hello world"), "Hello world");
assert.equal(
  asciiMathToKatex(
    "$5000 is invested at 4% per annum, compounded yearly, for 3 years. Which expression gives the amount?",
  ),
  "$5000 is invested at 4% per annum, compounded yearly, for 3 years. Which expression gives the amount?",
);
assert.equal(asciiMathToKatex("\\(2^{3}\\)"), "\\(2^{3}\\)");
assert.equal(splitChoicePrefix("Hello world").body, "Hello world");

assertExponents("8^(2/3)", "fraction exponent");
assertExponents("5000(1.04)^3", "compound");
assertExponents(`(a^2 b^(${MINUS}3))^2 / a^(${MINUS}1)`, "indices chain");
assertExponents("4.8 × 10^4", "scientific");
assertExponents("x^3 − 2x^2 + x − 6", "polynomial");

function walkStrings(value: unknown, out: string[]): void {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) {
    for (const item of value) walkStrings(item, out);
  } else if (value && typeof value === "object") {
    for (const item of Object.values(value)) walkStrings(item, out);
  }
}

const files = [
  "src/data/dse/math-drills.json",
  "src/data/dse/math-lessons.json",
  "src/data/dse/math-video-checks.json",
];
let caretStrings = 0;
const failures: string[] = [];
for (const file of files) {
  const data: unknown = JSON.parse(fs.readFileSync(path.join(root, file), "utf8"));
  const strings: string[] = [];
  walkStrings(data, strings);
  for (const text of strings) {
    const out = asciiMathToKatex(text);
    if (!text.includes("^")) {
      if (out !== text) failures.push(`changed plain:\n${text.slice(0, 200)}\n→ ${out.slice(0, 200)}`);
      continue;
    }
    if (text.includes("\\")) continue;
    caretStrings += 1;
    const outside = out.replace(/\\\([\s\S]*?\\\)/g, "");
    if (outside.includes("^")) {
      failures.push(`bare ^:\n${text.slice(0, 220)}\n→ ${out.slice(0, 220)}`);
      continue;
    }
    for (const tex of texOf(out)) {
      if (hasBareCaret(tex)) {
        failures.push(`bare tex ^: ${tex}`);
        continue;
      }
      try {
        katex.renderToString(tex, {
          throwOnError: true,
          trust: false,
          strict: "ignore",
          displayMode: false,
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        failures.push(`katex: ${message}\n${tex.slice(0, 220)}`);
      }
    }
  }
}
if (failures.length > 0) {
  console.error(failures.slice(0, 12).join("\n---\n"));
  console.error(`failures: ${failures.length}`);
  process.exit(1);
}

assert.equal(caretStrings > 0, true);
console.log(`selftest PASS (${caretStrings} caret strings)`);
