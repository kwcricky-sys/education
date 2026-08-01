"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { QuizDifficulty } from "@/lib/dse/types";
import type { CatAnswerRecord, CatPoolItem } from "@/lib/dse/cat/types";

export type ErrorNotebookItem = {
  uid: string;
  textSlug: string;
  textLabel: string;
  questionId: string;
  difficulty: QuizDifficulty;
  category: string;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  userAnswer: string;
  timestamp: string;
  wrongCount: number;
};

type ErrorNotebookState = {
  items: ErrorNotebookItem[];
  addFromAnswers: (answers: CatAnswerRecord[]) => void;
  removeItem: (uid: string) => void;
  clearAll: () => void;
  markResolved: (uid: string) => void;
  toPoolItems: (uids?: string[]) => CatPoolItem[];
};

export const useErrorNotebook = create<ErrorNotebookState>()(
  persist(
    (set, get) => ({
      items: [],

      addFromAnswers: (answers) => {
        const wrongs = answers.filter((a) => !a.isCorrect);
        if (wrongs.length === 0) return;

        set((state) => {
          const map = new Map(state.items.map((i) => [i.uid, i]));
          for (const a of wrongs) {
            const prev = map.get(a.uid);
            map.set(a.uid, {
              uid: a.uid,
              textSlug: a.textSlug,
              textLabel: a.textLabel,
              questionId: a.questionId,
              difficulty: a.difficulty,
              category: a.category,
              question: a.question,
              options: a.options,
              answer: a.correctAnswer,
              explanation: a.explanation,
              userAnswer: a.selectedAnswer,
              timestamp: new Date().toISOString(),
              wrongCount: (prev?.wrongCount ?? 0) + 1,
            });
          }
          return {
            items: [...map.values()].sort(
              (a, b) =>
                new Date(b.timestamp).getTime() -
                new Date(a.timestamp).getTime(),
            ),
          };
        });
      },

      removeItem: (uid) =>
        set((s) => ({ items: s.items.filter((i) => i.uid !== uid) })),

      clearAll: () => set({ items: [] }),

      markResolved: (uid) =>
        set((s) => ({ items: s.items.filter((i) => i.uid !== uid) })),

      toPoolItems: (uids) => {
        const source = uids
          ? get().items.filter((i) => uids.includes(i.uid))
          : get().items;
        return source.map(
          (i): CatPoolItem => ({
            uid: i.uid,
            id: i.questionId,
            textSlug: i.textSlug,
            textLabel: i.textLabel,
            difficulty: i.difficulty,
            category: i.category,
            question: i.question,
            options: i.options,
            answer: i.answer,
            explanation: i.explanation,
          }),
        );
      },
    }),
    {
      name: "studypath-error-notebook-v1",
    },
  ),
);
