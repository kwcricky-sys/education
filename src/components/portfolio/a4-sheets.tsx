import type { ReactNode, Ref } from "react";

export type PortfolioForm = {
  childName: string;
  ageLine: string;
  targetSchool: string;
  headline: string;
  bodyZh: string;
  bodyEn: string;
  caption: string;
  interests: string;
  successNote: string;
  photoMain: string | null;
  photoSecond: string | null;
};

type SheetProps = {
  form: PortfolioForm;
  pageRef?: Ref<HTMLDivElement>;
};

const a4Style = {
  width: "210mm",
  height: "297mm",
  boxSizing: "border-box" as const,
};

/** 【直私神校／名校風】藏青簡約 */
export function EliteSheet({ form, pageRef }: SheetProps) {
  return (
    <div
      ref={pageRef}
      style={a4Style}
      className="relative overflow-hidden bg-[#f7f8fa] text-[#0f172a]"
    >
      {/* Locked brand bar */}
      <div className="h-3 w-full bg-[#0b1f3a]" />
      <div className="flex h-full flex-col px-[16mm] pt-8 pb-[14mm]">
        <div className="flex items-start justify-between gap-6 border-b border-[#0b1f3a]/20 pb-5">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold tracking-[0.28em] text-[#1e3a5f] uppercase">
              Primary One Portfolio
            </p>
            <h1 className="mt-2 text-[32px] leading-tight font-bold tracking-tight text-[#0b1f3a]">
              {form.childName}
            </h1>
            <p className="mt-1 text-[13px] text-slate-500">{form.ageLine}</p>
            {form.targetSchool ? (
              <p className="mt-3 text-[12px] font-semibold text-[#1e3a5f]">
                Applying to · {form.targetSchool}
              </p>
            ) : null}
          </div>
          <PhotoFrame src={form.photoMain} className="h-[42mm] w-[42mm] rounded-sm" />
        </div>

        <p className="mt-6 text-[18px] font-semibold text-[#0b1f3a]">
          {form.headline}
        </p>

        <div className="mt-5 grid flex-1 grid-cols-2 gap-6">
          <div>
            <LockedLabel>Academic & Character</LockedLabel>
            <p className="mt-2 whitespace-pre-wrap text-[13px] leading-7 text-slate-700">
              {form.bodyZh}
            </p>
          </div>
          <div>
            <LockedLabel>English Snapshot</LockedLabel>
            <p className="mt-2 whitespace-pre-wrap text-[13px] leading-7 text-slate-700">
              {form.bodyEn}
            </p>
            {form.caption ? (
              <p className="mt-4 border-l-2 border-[#0b1f3a] pl-3 text-[12px] leading-6 text-[#1e3a5f] italic">
                {form.caption}
              </p>
            ) : null}
            {form.interests ? (
              <>
                <LockedLabel className="mt-5">Interests</LockedLabel>
                <p className="mt-2 text-[12px] leading-6 text-slate-600">
                  {form.interests}
                </p>
              </>
            ) : null}
          </div>
        </div>

        <p className="mt-auto pt-4 text-center text-[9px] tracking-wide text-slate-400">
          CONFIDENTIAL · FOR ADMISSION USE ONLY
        </p>
      </div>
    </div>
  );
}

/** 【活潑國際／全人發展風】暖色多相片 */
export function VibrantSheet({ form, pageRef }: SheetProps) {
  return (
    <div
      ref={pageRef}
      style={a4Style}
      className="relative overflow-hidden bg-[#fffaf5] text-[#292524]"
    >
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-br from-orange-200/80 via-amber-100 to-transparent" />
      <div className="relative flex h-full flex-col px-[15mm] pt-9 pb-[14mm]">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold tracking-[0.2em] text-orange-600 uppercase">
              Whole-Person Snapshot
            </p>
            <h1 className="mt-2 text-[34px] font-extrabold text-stone-900">
              {form.childName}
            </h1>
            <p className="mt-1 text-[13px] text-stone-500">{form.ageLine}</p>
          </div>
          <PhotoFrame
            src={form.photoMain}
            className="h-[48mm] w-[48mm] rounded-full ring-4 ring-white"
          />
        </div>

        <p className="mt-6 rounded-2xl bg-white/80 px-4 py-3 text-[16px] font-semibold text-orange-800 shadow-sm">
          {form.headline}
        </p>

        <div className="mt-5 grid flex-1 grid-cols-[1.1fr_0.9fr] gap-4">
          <div className="rounded-3xl bg-white p-4 shadow-sm">
            <LockedLabel tone="warm">About me · 關於我</LockedLabel>
            <p className="mt-2 whitespace-pre-wrap text-[13px] leading-7">
              {form.bodyZh}
            </p>
            <p className="mt-3 whitespace-pre-wrap text-[12px] leading-6 text-stone-600">
              {form.bodyEn}
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <PhotoFrame
              src={form.photoSecond || form.photoMain}
              className="min-h-[55mm] flex-1 rounded-3xl"
            />
            <div className="rounded-3xl bg-amber-50 p-3">
              <LockedLabel tone="warm">Photo note</LockedLabel>
              <p className="mt-1 text-[11px] leading-5 text-stone-700 italic">
                {form.caption ||
                  "A joyful moment that shows personality and growth."}
              </p>
            </div>
          </div>
        </div>

        {form.interests ? (
          <p className="mt-4 text-center text-[12px] text-stone-600">
            ♥ {form.interests}
          </p>
        ) : null}
      </div>
    </div>
  );
}

/** 【叩門精簡】第 1 頁：誠意 + 相片 */
export function KnockPage1({ form, pageRef }: SheetProps) {
  return (
    <div
      ref={pageRef}
      style={a4Style}
      className="relative bg-white text-slate-900"
    >
      <div className="flex h-full flex-col px-[16mm] py-[14mm]">
        <p className="text-[11px] font-bold tracking-[0.22em] text-rose-600 uppercase">
          Discretionary Places · 叩門誠意信頁
        </p>
        <h1 className="mt-3 text-[30px] font-extrabold">
          {form.childName}
        </h1>
        <p className="mt-1 text-[13px] text-slate-500">{form.ageLine}</p>
        <p className="mt-4 text-[14px] font-semibold text-slate-800">
          誠意申請：{form.targetSchool || "（貴校）"}
        </p>

        <div className="mt-6 grid flex-1 grid-cols-2 gap-5">
          <PhotoFrame
            src={form.photoMain}
            className="min-h-[90mm] rounded-xl"
          />
          <div>
            <p className="text-[17px] font-bold text-rose-700">
              {form.headline}
            </p>
            <p className="mt-4 whitespace-pre-wrap text-[13px] leading-7 text-slate-700">
              {form.bodyZh}
            </p>
            {form.caption ? (
              <p className="mt-4 text-[12px] leading-6 text-slate-500 italic">
                {form.caption}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

/** 【叩門精簡】第 2 頁：大抽獎／策略重點 */
export function KnockPage2({ form, pageRef }: SheetProps) {
  return (
    <div
      ref={pageRef}
      style={a4Style}
      className="relative bg-white text-slate-900"
    >
      <div className="flex h-full flex-col px-[16mm] py-[14mm]">
        <p className="text-[11px] font-bold tracking-[0.22em] text-rose-600 uppercase">
          Page 2 · Why this school
        </p>
        <h2 className="mt-3 text-[24px] font-extrabold">
          為什麼我們選擇貴校
        </h2>

        <div className="mt-6 rounded-2xl border border-rose-100 bg-rose-50 p-5">
          <LockedLabel tone="rose">大抽獎／策略重點</LockedLabel>
          <p className="mt-2 whitespace-pre-wrap text-[14px] leading-7 text-slate-800">
            {form.successNote ||
              "我們已按校網與計分謹慎部署志願，並視貴校為最合適的學習環境。"}
          </p>
        </div>

        <div className="mt-5 grid flex-1 grid-cols-2 gap-5">
          <div className="rounded-2xl border border-slate-200 p-4">
            <LockedLabel>English note</LockedLabel>
            <p className="mt-2 whitespace-pre-wrap text-[13px] leading-7">
              {form.bodyEn}
            </p>
          </div>
          <PhotoFrame
            src={form.photoSecond || form.photoMain}
            className="min-h-[70mm] rounded-2xl"
          />
        </div>

        <p className="mt-auto pt-6 text-[12px] leading-6 text-slate-600">
          我們承諾配合學校理念，與老師同行，培養孩子成為有禮、自律、愛學習的小一學生。懇請貴校給予面試／考慮機會。
        </p>
      </div>
    </div>
  );
}

function LockedLabel({
  children,
  className = "",
  tone = "navy",
}: {
  children: ReactNode;
  className?: string;
  tone?: "navy" | "warm" | "rose";
}) {
  const color =
    tone === "warm"
      ? "text-orange-600"
      : tone === "rose"
        ? "text-rose-600"
        : "text-[#1e3a5f]";
  return (
    <p
      className={`text-[10px] font-bold tracking-[0.18em] uppercase ${color} ${className}`}
    >
      {children}
    </p>
  );
}

function PhotoFrame({
  src,
  className,
}: {
  src: string | null;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden bg-slate-200 ${className ?? ""}`}
      style={{ flexShrink: 0 }}
    >
      {src ? (
        // object-fit: cover — photo slot crop
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt=""
          className="h-full w-full object-cover"
          draggable={false}
        />
      ) : (
        <div className="flex h-full min-h-[40mm] w-full items-center justify-center text-[11px] text-slate-400">
          Photo slot
        </div>
      )}
    </div>
  );
}
