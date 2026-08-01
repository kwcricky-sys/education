import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { FlashcardStudyHub } from "@/components/dse/flashcard-study-hub";
import { JsonLd } from "@/components/seo/json-ld";
import { getAllQuizSlugs, getQuiz } from "@/lib/dse/quizzes";
import { getPrescribedText, textHref } from "@/lib/dse/texts";
import { createPageMetadata } from "@/lib/page-metadata";
import {
  buildBreadcrumbJsonLd,
  buildCourseJsonLd,
  buildFaqJsonLd,
} from "@/lib/seo";
import { SITE_NAME, SITE_URL } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllQuizSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const text = getPrescribedText(slug);
  const quiz = getQuiz(slug);
  if (!text || !quiz) return {};

  const total = quiz.meta?.total ?? quiz.questions.length;
  return createPageMetadata({
    title: `DSE 中文範文${text.source}${text.title} ${total}題三階閃卡 | ${SITE_NAME}`,
    description: `免費線上 DSE 中文指定範文「${text.title}」（${text.source}）${total} 題極速閃卡。涵蓋字詞釋義、通假、句譯與考評標示，沉浸式備考。`,
    path: textHref(slug),
    keywords: [
      ...text.keywords,
      "DSE 中文 閃卡",
      "指定範文",
      "文言刷題",
    ],
  });
}

function buildFaqs(shortName: string, total: number) {
  return [
    {
      question: `這 ${total} 題涵蓋哪些範圍？`,
      answer: `題庫圍繞指定範文「${shortName}」，類型包括字詞釋義、通假字、句譯、文意理解與考評標示，並分為基礎／中等／高階三級，方便分層操練。`,
    },
    {
      question: "閃卡模式與題目總覽有何分別？",
      answer:
        "極速閃卡模式一次一題，支援 Space 翻牌與方向鍵切換，並可標記記錯／記牢；題目總覽以清單呈現全部題目，可快速跳轉到指定閃卡。",
    },
    {
      question: "答案與解析是否等同考評局官方？",
      answer:
        "解析以常見 DSE 答題要點與 Marking 邏輯整理，供備考練習參考，並非考評局官方試卷或評卷準則全文。正式應試請以考評局公布文件為準。",
    },
    {
      question: "可以篩選難度嗎？",
      answer:
        "可以。頂部提供「全部／基礎／中等／高階」篩選，進度條會按當前篩選後的題數重新計算。",
    },
    {
      question: "資料會上傳伺服器嗎？",
      answer:
        "不會。刷題進度、記錯與記牢計數僅留在你的瀏覽器 Session，重整頁面後會重置；題庫本身為靜態 JSON，於本機載入。",
    },
  ];
}

export default async function ChineseTextPracticePage({ params }: Props) {
  const { slug } = await params;
  const text = getPrescribedText(slug);
  const quiz = getQuiz(slug);
  if (!text || !quiz) notFound();

  const total = quiz.meta?.total ?? quiz.questions.length;
  const path = textHref(slug);
  const faqs = buildFaqs(text.shortName, total);
  const description = `免費線上 DSE 中文指定範文「${text.title}」（${text.source}）${total} 題極速閃卡練習。`;

  return (
    <div className="space-y-12">
      <JsonLd data={buildFaqJsonLd(faqs)} />
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "首頁", path: "/" },
          { name: "DSE 備考", path: "/dse" },
          { name: "中國語文", path: "/dse/chinese" },
          { name: text.shortName, path },
        ])}
      />
      <JsonLd
        data={buildCourseJsonLd({
          name: quiz.meta?.title ?? `${text.source}${text.title}`,
          description,
          url: `${SITE_URL}${path}`,
        })}
      />

      <div>
        <Link
          href="/dse/chinese"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 transition hover:text-sky-300"
        >
          <ArrowLeft className="size-3.5" />
          指定範文列表
        </Link>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-white sm:text-3xl">
          {text.source}
          {text.title}
        </h1>
        <p className="mt-2 text-sm text-slate-500 sm:text-base">
          {quiz.meta?.paper ?? "卷一 指定文言經典"} · {total} 題三階極速閃卡 ·{" "}
          {SITE_NAME} DSE 學習區
        </p>
      </div>

      <FlashcardStudyHub questions={quiz.questions} />

      <article className="space-y-10 border-t border-white/10 pt-12 text-base leading-relaxed text-slate-400">
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">
            {text.shortName}：三階閃卡怎麼練？
          </h2>
          <p>
            「{text.title}」是 DSE
            中文卷一指定文言經典之一。答題最常見失分，往往不是背不到原文，而是未能按考評要求寫出準確釋義、通假對應與文意因果。建議先用「基礎」題打通字詞與通假，再用「中等」題練句譯——關鍵實詞不可漏，語序要化成通順白話。進入「高階」時，重點轉為章旨、修辭與考評標示：把每一問想成「得分清單」，比死記單一標準句更穩妥。
          </p>
          <p>
            實戰可採短循環：每輪 10–15
            題，心答後翻牌核對；標記「記錯」的下一輪重刷，直到轉為「記牢」。應試時先審題幹動詞：問「釋義」勿寫成翻譯；問「翻譯」勿只釋單字；問「說明道理」須扣緊章旨。正式公開試請以考評局最新課程與評卷參考為準。
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">常見問題 FAQ</h2>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <div
                key={faq.question}
                className="rounded-2xl border border-white/8 bg-white/[0.03] p-5"
              >
                <h3 className="text-base font-semibold text-white">
                  {faq.question}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>
      </article>
    </div>
  );
}
