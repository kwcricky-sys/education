import { NextResponse } from "next/server";
import { buildCatPool, countPoolByDifficulty } from "@/lib/dse/cat/pool";
import { getAllQuizSlugs } from "@/lib/dse/quizzes";

/** GET /api/dse/cat-pool?slugs=analects,fish — returns pool stats for selected texts. */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const raw = searchParams.get("slugs");
  const slugs =
    raw && raw.trim().length > 0
      ? raw.split(",").map((s) => s.trim()).filter(Boolean)
      : getAllQuizSlugs();

  const allowed = new Set(getAllQuizSlugs());
  const filtered = slugs.filter((s) => allowed.has(s));
  const pool = buildCatPool(filtered);

  return NextResponse.json({
    slugs: filtered,
    counts: countPoolByDifficulty(pool),
    sampleCategories: [
      ...new Set(pool.map((q) => q.category)),
    ].slice(0, 12),
  });
}
