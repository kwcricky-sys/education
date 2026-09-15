import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock3, ExternalLink, ListChecks } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import {
  getVideoLibrary,
  getVideoTopics,
  VIDEO_SUBJECTS,
  type StudyVideo,
} from "@/lib/dse/videos";
import { createPageMetadata } from "@/lib/page-metadata";
import { buildBreadcrumbJsonLd } from "@/lib/seo";
import { LEGAL_DISCLAIMER, SITE_NAME, SITE_URL } from "@/lib/site";

type Props = { params: Promise<{ subject: string }> };

/** Subjects that also have a free drill bank on this site. */
const DRILL_LINKS: Record<string, { href: string; label: string }> = {
  econ: { href: "/dse/econ", label: "經濟科免費 MCQ 練習" },
  english: { href: "/dse/english", label: "英文科免費文法練習" },
};

export const dynamicParams = false;

export function generateStaticParams() {
  return VIDEO_SUBJECTS.map((subject) => ({ subject }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subject } = await params;
  const lib = getVideoLibrary(subject);
  if (!lib) return {};
  return createPageMetadata({
    title: `DSE ${lib.meta.name}溫習片庫｜${lib.videos.length} 條精選教學片分析 | ${SITE_NAME}`,
    description: `${lib.meta.description}共 ${lib.videos.length} 條影片，每條附摘要、重點筆記、溫習階段建議同編輯分析。`,
    path: `/dse/videos/${subject}`,
    keywords: [
      `DSE ${lib.meta.name} 影片`,
      `DSE ${lib.meta.nameEn} tutorial video`,
      `DSE ${lib.meta.name} 溫習`,
      `${lib.meta.name} 教學片`,
      "DSE 溫習片庫",
    ],
  });
}

function isoDuration(duration: string): string {
  const parts = duration.split(":").map((n) => Number.parseInt(n, 10) || 0);
  const [h, m, s] = parts.length === 3 ? parts : [0, parts[0] ?? 0, parts[1] ?? 0];
  return `PT${h ? `${h}H` : ""}${m ? `${m}M` : ""}${s ? `${s}S` : ""}` || "PT0S";
}

function VideoCard({ video }: { video: StudyVideo }) {
  return (
    <article
      id={video.id}
      className="scroll-mt-24 overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/60"
    >
      <div className="aspect-video w-full bg-black">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${video.id}`}
          title={video.title}
          loading="lazy"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="size-full"
        />
      </div>

      <div className="p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {video.topics.map((t) => (
            <span
              key={t}
              className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1 font-medium text-cyan-300"
            >
              {t}
            </span>
          ))}
        </div>

        <h2 className="mt-3 text-lg font-semibold leading-snug text-zinc-100">{video.title}</h2>
        <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500">
          <span>{video.channel}</span>
          <span className="inline-flex items-center gap-1">
            <Clock3 className="size-3.5" />
            {video.duration}
          </span>
          <a
            href={`https://www.youtube.com/watch?v=${video.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-cyan-300 hover:text-cyan-200"
          >
            在 YouTube 開啟
            <ExternalLink className="size-3" />
          </a>
        </p>

        <div className="mt-5 space-y-5">
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              摘要（片入面講咩）
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-300">{video.summary}</p>
          </section>

          <section>
            <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-zinc-500">
              <ListChecks className="size-3.5" />
              重點筆記
            </h3>
            <ul className="mt-2 space-y-2">
              {video.keyPoints.map((p) => (
                <li key={p} className="flex gap-2 text-sm leading-relaxed text-zinc-300">
                  <span aria-hidden className="mt-1.5 size-1.5 shrink-0 rounded-full bg-cyan-400" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-xl border border-white/5 bg-zinc-950/40 p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              點幫溫書（邊個階段睇）
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-300">{video.studyStage}</p>
          </section>

          <section className="rounded-xl border border-indigo-400/20 bg-indigo-400/5 p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-indigo-300">
              編輯分析（教法好唔好喺邊、同其他片比較）
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-indigo-100/90">{video.analysis}</p>
          </section>
        </div>
      </div>
    </article>
  );
}

export default async function VideoSubjectPage({ params }: Props) {
  const { subject } = await params;
  const lib = getVideoLibrary(subject);
  if (!lib) notFound();

  const topics = getVideoTopics(subject);
  const drill = DRILL_LINKS[subject];

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `DSE ${lib.meta.name}溫習片庫`,
    numberOfItems: lib.videos.length,
    itemListElement: lib.videos.map((v, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "VideoObject",
        name: v.title,
        description: v.summary,
        duration: isoDuration(v.duration),
        embedUrl: `https://www.youtube-nocookie.com/embed/${v.id}`,
        url: `https://www.youtube.com/watch?v=${v.id}`,
        publisher: { "@type": "Organization", name: v.channel },
        inLanguage: subject === "english" ? "en" : "zh-HK",
      },
    })),
  };

  return (
    <div className="space-y-8">
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "首頁", path: "/" },
          { name: "DSE 備考", path: "/dse" },
          { name: "溫習片庫", path: "/dse/videos" },
          { name: lib.meta.name, path: `/dse/videos/${subject}` },
        ])}
      />
      <JsonLd data={itemListJsonLd} />

      <nav className="text-sm text-zinc-500">
        <Link href="/dse" className="hover:text-zinc-200">
          DSE
        </Link>
        <span className="mx-2">›</span>
        <Link href="/dse/videos" className="hover:text-zinc-200">
          溫習片庫
        </Link>
        <span className="mx-2">›</span>
        <span className="text-zinc-300">{lib.meta.name}</span>
      </nav>

      <header className="rounded-2xl border border-white/10 bg-zinc-900/70 p-6 sm:p-8">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-extrabold tracking-tight text-zinc-100 sm:text-3xl">
          DSE {lib.meta.name}溫習片庫
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-zinc-400">
          {lib.meta.description}
        </p>
        <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-3 text-xs">
          <div>
            <dt className="text-zinc-500">影片數目</dt>
            <dd className="mt-0.5 text-sm font-semibold text-zinc-100">{lib.videos.length} 條</dd>
          </div>
          <div>
            <dt className="text-zinc-500">課題分類</dt>
            <dd className="mt-0.5 text-sm font-semibold text-zinc-100">{topics.length} 個</dd>
          </div>
          <div>
            <dt className="text-zinc-500">整理日期</dt>
            <dd className="mt-0.5 text-sm font-semibold text-zinc-100">{lib.meta.curatedAt}</dd>
          </div>
        </dl>
        <p className="mt-5 text-xs leading-relaxed text-zinc-500">{lib.meta.verification}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/dse/videos"
            className="rounded-xl border border-white/10 bg-zinc-950/50 px-4 py-2 text-xs font-semibold text-zinc-200 transition hover:border-cyan-400/40"
          >
            ← 返片庫主頁（可按課題篩選）
          </Link>
          {drill && (
            <Link
              href={drill.href}
              className="rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 px-4 py-2 text-xs font-bold text-zinc-950 transition hover:brightness-110"
            >
              {drill.label} →
            </Link>
          )}
        </div>
      </header>

      <section className="flex flex-wrap gap-2 text-xs">
        {topics.map((t) => (
          <span key={t} className="rounded-full bg-white/5 px-3 py-1.5 text-zinc-400">
            {t}
          </span>
        ))}
      </section>

      <div className="space-y-8">
        {lib.videos.map((v) => (
          <VideoCard key={v.id} video={v} />
        ))}
      </div>

      <section className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-5">
        <h2 className="text-sm font-semibold text-amber-200">版權與策展說明</h2>
        <p className="mt-3 text-xs leading-relaxed text-amber-100/80">
          以上影片版權屬原頻道所有，本站只提供策展分析同 YouTube 官方嵌入播放；摘要、重點筆記、溫習階段同分析均由編輯部自行撰寫，
          唔會轉載影片字幕或簡介內容。影片屬第三方免費資源，如發現已無法播放，請通知我哋（{SITE_URL.replace("https://", "")}）即刻跟進。
        </p>
        <p className="mt-3 text-xs leading-relaxed text-amber-100/70">{LEGAL_DISCLAIMER}</p>
      </section>
    </div>
  );
}
