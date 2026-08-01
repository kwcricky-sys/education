import analects from "@/data/dse/analects-quiz.json";
import fish from "@/data/dse/fish-quiz.json";
import xiaoyaoyou from "@/data/dse/xiaoyaoyou-quiz.json";
import quanxue from "@/data/dse/quanxue-quiz.json";
import lianpo from "@/data/dse/lianpo-quiz.json";
import chushi from "@/data/dse/chushi-quiz.json";
import shishuo from "@/data/dse/shishuo-quiz.json";
import xishan from "@/data/dse/xishan-quiz.json";
import yueyang from "@/data/dse/yueyang-quiz.json";
import liuguo from "@/data/dse/liuguo-quiz.json";
import tangshi from "@/data/dse/tangshi-quiz.json";
import cishi from "@/data/dse/cishi-quiz.json";
import type { QuizFile } from "@/lib/dse/types";
import { CHINESE_PRESCRIBED_TEXTS } from "@/lib/dse/texts";

const QUIZ_BY_SLUG: Record<string, QuizFile> = {
  analects: analects as QuizFile,
  fish: fish as QuizFile,
  xiaoyaoyou: xiaoyaoyou as QuizFile,
  quanxue: quanxue as QuizFile,
  lianpo: lianpo as QuizFile,
  chushi: chushi as QuizFile,
  shishuo: shishuo as QuizFile,
  xishan: xishan as QuizFile,
  yueyang: yueyang as QuizFile,
  liuguo: liuguo as QuizFile,
  tangshi: tangshi as QuizFile,
  cishi: cishi as QuizFile,
};

export function getQuiz(slug: string): QuizFile | undefined {
  return QUIZ_BY_SLUG[slug];
}

export function getAllQuizSlugs() {
  return CHINESE_PRESCRIBED_TEXTS.map((t) => t.slug);
}
