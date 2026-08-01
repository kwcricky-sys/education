import { getQuiz } from "@/lib/dse/quizzes";
import { CHINESE_PRESCRIBED_TEXTS } from "@/lib/dse/texts";
import type { CatPoolItem } from "@/lib/dse/cat/types";

/** Build a CAT item pool from one or more prescribed-text slugs. */
export function buildCatPool(slugs: string[]): CatPoolItem[] {
  const unique = [...new Set(slugs)];
  const items: CatPoolItem[] = [];

  for (const slug of unique) {
    const quiz = getQuiz(slug);
    const meta = CHINESE_PRESCRIBED_TEXTS.find((t) => t.slug === slug);
    if (!quiz) continue;
    const textLabel = meta
      ? `${meta.source}${meta.title}`
      : quiz.meta?.title ?? slug;

    for (const q of quiz.questions) {
      items.push({
        ...q,
        uid: `${slug}:${q.id}`,
        textSlug: slug,
        textLabel,
      });
    }
  }

  return items;
}

export function countPoolByDifficulty(pool: CatPoolItem[]) {
  return {
    easy: pool.filter((q) => q.difficulty === "easy").length,
    medium: pool.filter((q) => q.difficulty === "medium").length,
    hard: pool.filter((q) => q.difficulty === "hard").length,
    total: pool.length,
  };
}
