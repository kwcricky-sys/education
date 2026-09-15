import Link from "next/link";
import { ArrowRight, GraduationCap, PlayCircle, ShieldCheck } from "lucide-react";
import VideoLibrary from "@/components/dse/video-library";
import { JsonLd } from "@/components/seo/json-ld";
import {
  getAllTopics,
  getAllVideoLibraries,
  getVideoCount,
  getVideoIndex,
} from "@/lib/dse/videos";
import { createPageMetadata } from "@/lib/page-metadata";
import { buildBreadcrumbJsonLd } from "@/lib/seo";
import { LEGAL_DISCLAIMER, SITE_NAME } from "@/lib/site";

export const metadata = createPageMetadata({
  title: `DSE 溫習片庫｜各科精選 YouTube 教學片策展分析 | ${SITE_NAME}`,
  description:
    "DSE 各科精選溫習片庫：中文十二篇範文、英文 Paper 1-3、經濟、數學、M2、物理、化學、生物。每條片附摘要、重點筆記、溫習階段建議同編輯分析，全部影片連結已驗證可用。",
  path: "/dse/videos",
  keywords: [
    "DSE 溫習 影片",
    "DSE YouTube 教學",
    "DSE 中文 範文 影片",
    "DSE 英文 Paper 2 影片",
    "DSE Econ 影片",
    "DSE 數學 溫習片",
    "免費 DSE 補習 影片",
    "DSE 溫習片庫",
  ],
});

export default function VideoLibraryPage() {
  const libraries = getAllVideoLibraries();
  const videos = getVideoIndex();
  const topics = getAllTopics();
  const total = getVideoCount();

  return (
    <div className="space-y-10">
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "首頁", path: "/" },
          { name: "DSE 備考", path: "/dse" },
          { name: "溫習片庫", path: "/dse/videos" },
        ])}
      />

      <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white px-6 py-12 sm:px-10">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(56,189,248,0.16),transparent_55%),radial-gradient(ellipse_at_85%_90%,rgba(99,102,241,0.10),transparent_45%)]"
        />
        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-700/30 bg-blue-700/10 px-3 py-1 text-xs font-semibold text-blue-600">
            <PlayCircle className="size-3.5" />
            {total} 條影片 · {libraries.length} 科 · 全部連結已驗證
          </span>
          <h1 className="mt-5 font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            DSE 溫習片庫
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
            YouTube 上 DSE 教學片好多，但質素參差、長短不一。呢個片庫由編輯部逐條睇過再寫分析：每條片都有摘要（片入面講咩）、重點筆記（3 至 5 點）、溫習階段建議（邊個階段睇最有效），
            同編輯分析（教法好在邊、同其他片點比較）。我哋唔會照抄影片簡介，亦只收錄經 oembed 驗證、仍然可以正常播放的影片。
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-emerald-700" />
              404 死片、401 禁止嵌入一律唔收錄
            </span>
            <span className="inline-flex items-center gap-1.5">
              <GraduationCap className="size-3.5 text-sky-700" />
              學生視角整理，唔係片單搬運
            </span>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-slate-900">按科目進入</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {libraries.map((lib) => (
            <Link
              key={lib.meta.subject}
              href={`/dse/videos/${lib.meta.subject}`}
              className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-blue-700/40 hover:bg-slate-100"
            >
              <h3 className="text-base font-semibold text-slate-900">{lib.meta.name}</h3>
              <p className="mt-1 text-xs text-slate-500">
                {lib.meta.nameEn} · {lib.videos.length} 條片
              </p>
              <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-slate-600">
                {lib.meta.description.replace(/^DSE [^：]*策展溫習片庫：/, "")}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 group-hover:text-blue-700">
                睇片單
                <ArrowRight className="size-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-slate-900">全部影片（可按科目、課題篩選）</h2>
        <p className="mt-2 text-sm text-slate-600">
          想搵特定課題？直接用下面嘅篩選器；每一科的完整片單同內嵌播放器喺科目頁。
        </p>
        <div className="mt-4">
          <VideoLibrary
            videos={videos}
            subjects={libraries.map((lib) => ({
              id: lib.meta.subject,
              name: lib.meta.name,
              count: lib.videos.length,
            }))}
            topics={topics}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-amber-700/20 bg-amber-700/5 p-5">
        <h2 className="text-sm font-semibold text-amber-800">策展說明與版權</h2>
        <ul className="mt-3 space-y-2 text-xs leading-relaxed text-amber-900/80">
          <li>
            本站只做策展與分析：影片版權屬原頻道所有，播放時直接嵌入 YouTube 官方播放器，我哋唔會下載或轉載任何影片內容。
          </li>
          <li>
            分析內容由編輯部根據影片標題、頻道、長度、章節同公開簡介自行撰寫，用嚟幫你決定「邊條片值唔值得花時間睇」，並非影片官方介紹。
          </li>
          <li>
            影片為第三方免費資源，頻道日後可能修改或移除；如果你發現有片已經睇唔到，歡迎通知我哋，我哋會即刻下架。
          </li>
        </ul>
        <p className="mt-4 text-xs leading-relaxed text-amber-900/70">{LEGAL_DISCLAIMER}</p>
      </section>
    </div>
  );
}
