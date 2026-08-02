"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  ImagePlus,
  Sparkles,
  Wand2,
} from "lucide-react";
import {
  EliteSheet,
  KnockPage1,
  KnockPage2,
  VibrantSheet,
  type PortfolioForm,
} from "@/components/portfolio/a4-sheets";
import {
  generateCaptionWithVlm,
  generateLocalCaption,
  PHOTO_SCENES,
  type PhotoScene,
} from "@/lib/portfolio/captions";
import { handleDownloadPDF } from "@/lib/portfolio/pdf";
import { cn } from "@/lib/utils";

type TemplateId = "elite" | "vibrant" | "knock";

const TEMPLATES: {
  id: TemplateId;
  label: string;
  hint: string;
  pages: number;
}[] = [
  {
    id: "elite",
    label: "直私神校／名校風",
    hint: "藏青簡約 · 學術與閱讀",
    pages: 1,
  },
  {
    id: "vibrant",
    label: "活潑國際／全人發展",
    hint: "暖色 · 多相片圓角",
    pages: 1,
  },
  {
    id: "knock",
    label: "叩門精簡 2 頁",
    hint: "誠意 + 大抽獎策略",
    pages: 2,
  },
];

const INITIAL: PortfolioForm = {
  childName: "陳小明",
  ageLine: "5 歲 11 個月 · 適齡小一",
  targetSchool: "示例直資小學",
  headline: "好奇、有禮、鍾意閱讀",
  bodyZh:
    "我鍾意問問題同幫同學。假日會同家人去圖書館，最鍾意恐龍同太空故事。日常生活努力做到有禮貌、守規矩。",
  bodyEn:
    "I love asking questions and helping friends. I enjoy library trips and stories about dinosaurs and space.",
  caption:
    "Showing intense focus and curiosity during independent reading time.",
  interests: "Reading · Swimming · Lego · Piano",
  successNote:
    "我們已用派位計算器評估校網與計分，並將貴校列為最優先志願；懇請給予面試機會。",
  photoMain: null,
  photoSecond: null,
};

export function PortfolioBuilder() {
  const page1Ref = useRef<HTMLDivElement>(null);
  const page2Ref = useRef<HTMLDivElement>(null);

  const [template, setTemplate] = useState<TemplateId>("elite");
  const [form, setForm] = useState<PortfolioForm>(INITIAL);
  const [scene, setScene] = useState<PhotoScene>("reading");
  const [busy, setBusy] = useState(false);
  const [captionBusy, setCaptionBusy] = useState(false);
  const [captionNote, setCaptionNote] = useState<string | null>(null);

  const patch = <K extends keyof PortfolioForm>(
    key: K,
    value: PortfolioForm[K],
  ) => setForm((f) => ({ ...f, [key]: value }));

  const onPhoto = (slot: "photoMain" | "photoSecond", file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => patch(slot, String(reader.result));
    reader.readAsDataURL(file);
  };

  /** Reserved hook for Transformers.js / WebLLM; currently local 0-cost captions. */
  const onGenerateCaption = async () => {
    setCaptionBusy(true);
    setCaptionNote(null);
    try {
      if (form.photoMain) {
        const { caption, engine } = await generateCaptionWithVlm({
          imageDataUrl: form.photoMain,
          scene,
        });
        patch("caption", caption);
        setCaptionNote(
          engine === "vlm"
            ? "已用瀏覽器 VLM 生成（私隱不出機）。"
            : "已用本地場景模板生成英文 Caption（0 API · 可改字）。後續可接 Transformers.js。",
        );
      } else {
        patch("caption", generateLocalCaption(scene));
        setCaptionNote("未上載相片——已按場景生成示例 Caption，上載後可再撳。");
      }
    } finally {
      setCaptionBusy(false);
    }
  };

  const onDownloadPdf = async () => {
    const pages: HTMLElement[] = [];
    if (page1Ref.current) pages.push(page1Ref.current);
    if (template === "knock" && page2Ref.current) {
      pages.push(page2Ref.current);
    }
    if (pages.length === 0) return;

    setBusy(true);
    try {
      await handleDownloadPDF({
        pageEls: pages,
        fileName: form.childName || "portfolio",
      });
    } catch (err) {
      console.error(err);
      alert("PDF 產生失敗，請再試一次。");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-10 sm:px-6">
      <Link
        href="/calculator"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-sky-700"
      >
        <ArrowLeft className="size-3.5" />
        返回計算器
      </Link>

      <header className="max-w-3xl">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-extrabold text-slate-900">
          小一入學 & 叩門 Portfolio
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          左側填資料、右側 A4 即時預覽。罐頭模板鎖定排版層；相片自動{" "}
          <code className="text-xs">object-fit: cover</code>{" "}
          裁入圖框。PDF 以 300 DPI 輸出，全程瀏覽器本地（0 API）。
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        {/* Left: form */}
        <aside className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto">
          <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
            1. 罐頭模板
          </p>
          <div className="grid gap-2">
            {TEMPLATES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTemplate(t.id)}
                className={cn(
                  "rounded-xl border px-3 py-3 text-left text-sm transition",
                  template === t.id
                    ? "border-sky-400 bg-sky-50 shadow-sm"
                    : "border-slate-200 hover:bg-slate-50",
                )}
              >
                <span className="font-bold text-slate-900">{t.label}</span>
                <span className="mt-0.5 block text-xs text-slate-500">
                  {t.hint} · {t.pages} 頁 A4
                </span>
              </button>
            ))}
          </div>

          <Divider label="2. 基本資料" />
          <Field
            label="小朋友姓名"
            value={form.childName}
            onChange={(v) => patch("childName", v)}
          />
          <Field
            label="年齡／一行簡介"
            value={form.ageLine}
            onChange={(v) => patch("ageLine", v)}
          />
          <Field
            label="申請學校"
            value={form.targetSchool}
            onChange={(v) => patch("targetSchool", v)}
          />
          <Field
            label="標題金句"
            value={form.headline}
            onChange={(v) => patch("headline", v)}
          />

          <Divider label="3. 文字潤飾" />
          <TextArea
            label="中文介紹"
            value={form.bodyZh}
            onChange={(v) => patch("bodyZh", v)}
            rows={4}
          />
          <TextArea
            label="英文介紹"
            value={form.bodyEn}
            onChange={(v) => patch("bodyEn", v)}
            rows={3}
          />
          <Field
            label="興趣（Interests）"
            value={form.interests}
            onChange={(v) => patch("interests", v)}
          />
          {template === "knock" ? (
            <TextArea
              label="大抽獎／策略重點（叩門第 2 頁）"
              value={form.successNote}
              onChange={(v) => patch("successNote", v)}
              rows={3}
            />
          ) : null}

          <Divider label="4. 相片 Upload" />
          <PhotoUpload
            label="主相片框"
            onFile={(f) => onPhoto("photoMain", f)}
            hasPhoto={Boolean(form.photoMain)}
          />
          {(template === "vibrant" || template === "knock") && (
            <PhotoUpload
              label="第二相片框"
              onFile={(f) => onPhoto("photoSecond", f)}
              hasPhoto={Boolean(form.photoSecond)}
            />
          )}

          <Divider label="5. AI Caption（預留）" />
          <p className="text-[11px] leading-relaxed text-slate-500">
            按鈕已接好 <code>onGenerateCaption</code>
            。預設用場景模板即時出英文；之後可喺{" "}
            <code>generateCaptionWithVlm</code> 動態載入 Transformers.js /
            SmolVLM，全程 Client-side、保障私隱。
          </p>
          <div className="flex flex-wrap gap-1.5">
            {PHOTO_SCENES.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setScene(s.id)}
                className={cn(
                  "rounded-full px-2.5 py-1 text-[11px] font-semibold",
                  scene === s.id
                    ? "bg-violet-600 text-white"
                    : "bg-slate-100 text-slate-600",
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
          <TextArea
            label="英文 Photo Caption（可改）"
            value={form.caption}
            onChange={(v) => patch("caption", v)}
            rows={3}
          />
          <button
            type="button"
            disabled={captionBusy}
            onClick={onGenerateCaption}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-4 py-2.5 text-sm font-bold text-violet-800 hover:bg-violet-100 disabled:opacity-50"
          >
            <Wand2 className="size-4" />
            {captionBusy ? "生成中…" : "生成英文 Caption"}
          </button>
          {captionNote ? (
            <p className="flex gap-1.5 text-[11px] text-violet-700">
              <Sparkles className="mt-0.5 size-3.5 shrink-0" />
              {captionNote}
            </p>
          ) : null}

          <button
            type="button"
            disabled={busy}
            onClick={onDownloadPdf}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3.5 text-sm font-bold text-white hover:bg-slate-800 disabled:opacity-50"
          >
            <Download className="size-4" />
            {busy ? "輸出 300 DPI PDF…" : "一鍵下載高清 A4 PDF"}
          </button>
        </aside>

        {/* Right: A4 preview */}
        <div className="space-y-4 overflow-auto rounded-2xl border border-slate-200 bg-slate-200/80 p-4 lg:max-h-[calc(100vh-8rem)]">
          <p className="text-center text-xs font-medium text-slate-600">
            A4 Preview · 210mm × 297mm · 鎖定背景／標題層
          </p>
          {template === "elite" ? (
            <div className="mx-auto w-fit shadow-2xl">
              <EliteSheet form={form} pageRef={page1Ref} />
            </div>
          ) : null}
          {template === "vibrant" ? (
            <div className="mx-auto w-fit shadow-2xl">
              <VibrantSheet form={form} pageRef={page1Ref} />
            </div>
          ) : null}
          {template === "knock" ? (
            <div className="mx-auto w-fit space-y-6">
              <div className="shadow-2xl">
                <KnockPage1 form={form} pageRef={page1Ref} />
              </div>
              <div className="shadow-2xl">
                <KnockPage2 form={form} pageRef={page2Ref} />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function Divider({ label }: { label: string }) {
  return (
    <p className="pt-2 text-xs font-semibold tracking-wide text-slate-500 uppercase">
      {label}
    </p>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block text-xs font-medium text-slate-500">
      {label}
      <input
        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  rows,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows: number;
}) {
  return (
    <label className="block text-xs font-medium text-slate-500">
      {label}
      <textarea
        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900"
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

function PhotoUpload({
  label,
  onFile,
  hasPhoto,
}: {
  label: string;
  onFile: (f: File | null) => void;
  hasPhoto: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-3 text-sm text-slate-700">
      <ImagePlus className="size-4 shrink-0" />
      <span>
        {label}
        {hasPhoto ? (
          <span className="ml-1 text-xs text-emerald-600">已上載</span>
        ) : (
          <span className="ml-1 text-xs text-slate-400">未上載</span>
        )}
      </span>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onFile(e.target.files?.[0] ?? null)}
      />
    </label>
  );
}
