import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Banknote,
  Clock3,
  Compass,
  Flag,
  GraduationCap,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { createPageMetadata } from "@/lib/page-metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, type FaqItem } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site";
import {
  JUPAS_META,
  PROGRAMMES,
  UGC_CATEGORY_SALARIES,
  hkd,
  monthly,
  type Programme,
} from "@/lib/jupas/programmes";

export const metadata = createPageMetadata({
  title: `JUPAS 揀科指南 2027｜收生分數、Band A 策略、神科 vs 水泡科分析 | ${SITE_NAME}`,
  description:
    "用真實收生分數同教資會薪酬數據，分析 JUPAS 揀科：完整流程時間表、Band A 排位策略、效益比計算，以及邊啲課程「收分高但出路平平」、邊啲係「收分低但起薪高」嘅水泡寶藏。",
  path: "/dse/jupas",
  keywords: [
    "JUPAS 揀科",
    "JUPAS 排位",
    "JUPAS 收生分數",
    "Band A 策略",
    "大學聯招",
    "神科",
    "水泡科",
    "DSE 升學",
    "JUPAS 改選",
    "大學畢業生薪酬",
  ],
});

/* ── 靜態內容 ─────────────────────────────────────────────────────────── */

const TIMELINE = [
  {
    when: "9 月至 11 月",
    title: "大學資訊日",
    body: "各院校陸續舉行 Info Day。呢個係你唯一可以親身問到課程主任「實際收幾多分」、「有冇面試」嘅機會，比睇任何網上資料都準。",
  },
  {
    when: "10 月 9 日",
    title: "JUPAS 開始接受報名",
    body: "註冊帳戶、繳交申請費（2026 年度為 $460）、遞交 20 個課程選擇。20 個選擇分 A 至 E 五個組別，Band A 就係頭三個。",
  },
  {
    when: "12 月 3 日 下午 5 時",
    title: "報名截止",
    body: "截止之後仍然可以交，但要另加 $350 逾期附加費。唔好拖——逾期申請會影響你嘅資料遞交時序。",
  },
  {
    when: "1 月 2 日 下午 5 時",
    title: "OEA 資料截止",
    body: "比賽／活動經驗及成就（OEA）係你喺分數之外唯一可以主動加分嘅材料。放榜前做好，放榜後改唔到。",
  },
  {
    when: "5 月 27 日 下午 5 時",
    title: "學生學習概覽（SLP）及最後改選",
    body: "放榜前最後一次大幅調整選擇嘅機會。呢個時間點你應該已經有模擬考成績，可以開始認真排位。",
  },
  {
    when: "7 月 10 日",
    title: "公布 OEA 及校長推薦計劃特別考慮結果",
    body: "如果有校長推薦（SPN）或其他特別考慮，結果會喺放榜前公布，會直接影響你嘅排位策略。",
  },
  {
    when: "7 月 15 日",
    title: "DSE 放榜",
    body: "收到成績單。由呢一刻開始，你嘅排位策略由「估」變成「計」——即刻用真實成績同各課程往年收生分數對照。",
  },
  {
    when: "7 月 16 至 18 日",
    title: "免費改選期（最關鍵三日）",
    body: "2026 年度嘅改選安排。你可以重新排列全部選擇，或換入新課程。親身考出嚟嘅成績加真實數據，係全年最重要嘅決定時刻。",
  },
  {
    when: "8 月 5 日",
    title: "公布正式遴選結果",
    body: "只會派一個課程——你名單上排序最高而又符合資格嘅嗰一個。接受與否，同學年內都唔會再獲派任何 JUPAS 課程。",
  },
  {
    when: "8 月 6 日 下午 5 時前",
    title: "繳交留位費 $5,000",
    body: "逾期未繳即自動放棄學位。呢 $5,000 係全年最容易、亦最冤枉嘅失誤來源。",
  },
  {
    when: "8 月 12 至 20 日",
    title: "DSE 覆核成績後重新考慮",
    body: "如果覆核後成績提升，可以要求重新考慮入學申請，甚至可以換最多 5 個新課程。成績剛好差一點嘅同學，覆核係一條真實嘅後路。",
  },
  {
    when: "8 月 25 日",
    title: "公布補選結果",
    body: "未獲派位嘅申請人最後一次機會。補選結果同樣要喺當日下午 5 時前繳交留位費。",
  },
];

const BANDS = [
  { band: "Band A", n: "第 1–3 個選擇", note: "絕大部分院校嘅面試邀請同收生重心都喺呢度。放你真正想讀、而又夠分嘅課程。" },
  { band: "Band B", n: "第 4–6 個選擇", note: "次選區。放「有機入到」同「入到都會開心」之間嘅課程。" },
  { band: "Band C", n: "第 7–9 個選擇", note: "開始要放保守選擇，確保有書讀。" },
  { band: "Band D–E", n: "第 10–20 個選擇", note: "墊底區。唔好放空白，但也唔好放「入到會後悔」嘅課程——派到就要讀。" },
];

const MINDSET = [
  {
    n: 1,
    icon: TrendingUp,
    title: "分數係入場券，唔係身價",
    body: "收生分數反映嘅係「有幾多人爭呢個位」，唔係「呢個課程出路有幾好」。兩者可以完全脫鈎——物理治療收 5.60 分但市場供應急增，都大護理收 3.89 分但起薪 $35,780。分數同出路係兩條獨立嘅線，你要分別睇。",
  },
  {
    n: 2,
    icon: Banknote,
    title: "先問「呢科有冇公開入職薪級表」",
    body: "有註冊制度嘅專業（醫科、護理、藥劑、專職醫療、社工）薪級表公開透明，你可以準確計出「每 1 分收生分數換到幾多起薪」。冇薪級表嘅課程，出路薪酬離散度極大，同一科畢業生可以差兩三倍。呢個分別，比校名重要得多。",
  },
  {
    n: 3,
    icon: Compass,
    title: "用 Band A 排「真心」，唔係排「炫耀」",
    body: "派位只會派你名單上排序最高而你又夠分嘅嗰一個。放一個你根本唔想讀嘅高分課程喺第一位，只會有兩個結果：考唔到（浪費一個位），或者考到（讀 4 年唔開心）。",
  },
  {
    n: 4,
    icon: Target,
    title: "留一個「穩入」位，但唔好留三個",
    body: "最常見嘅錯誤係 Band A 三科全部搏。放榜後改選時，最少要有一科係「低於你成績」嘅選擇。三個位全部搏，運氣一差就跌落 Band B，甚至要等補選。",
  },
  {
    n: 5,
    icon: Clock3,
    title: "計埋「幾年後市場變成點」",
    body: "你 2027 年入學，2031 年畢業。今日好搶手嘅課程，四年後可能已經畢業生過剩——AI 相關學位近年爆發式增長就係最現成嘅例子。揀科唔止睇今日嘅數據，要問「四年後仲有冇位」。",
  },
];

const FAQS: FaqItem[] = [
  {
    question: "JUPAS 可以填幾多個課程選擇？Band A 係咩？",
    answer:
      "JUPAS 一共可以填 20 個課程選擇，分 Band A、B、C、D、E 五個組別。Band A 係首 3 個選擇，亦係絕大部分院校收生同面試邀請嘅重心。部分課程只會邀請 Band A 申請人面試，所以 Band A 嘅排列直接影響你有冇面試機會。",
  },
  {
    question: "如果我 DSE 成績唔夠 Band A 個課程，會唔會影響我入 Band B 嘅課程？",
    answer:
      "唔會。JUPAS 派位係按你名單上嘅優先次序處理：你夠分入 Band A 第一志願就派第一志願；唔夠分就順住落睇第二、第三個。Band A 搏唔到唔會懲罰你，只係會用你嘅選擇順序繼續向下派。所以 Band A 放「搏」嘅課程係安全嘅——但要確保 Band B 之後有真正穩陣嘅選擇。",
  },
  {
    question: "JUPAS 派位結果可以有幾多個 offer？",
    answer:
      "只有一個。申請人只會喺 20 個課程之中獲得一個課程取錄，而且係你名單上排序最高而又符合收生條件嘅嗰一個。無論你接受或放棄，同學年內都唔會再獲派任何可經 JUPAS 選報嘅課程。",
  },
  {
    question: "放榜後仲可以改選嗎？",
    answer:
      "可以。以 2026 年度為例，7 月 15 日放榜，7 月 16 至 18 日為免費改選期，申請人喺指定個人時段內可以重新排列或更換課程選擇。另外如果你申請咗 DSE 成績覆核而成績提升，可以要求重新考慮入學申請，並換入最多 5 個新課程。",
  },
  {
    question: "JUPAS 申請費同留位費係幾多？",
    answer:
      "2026 年度 JUPAS 申請費為 $460，逾期遞交須另加 $350 附加費。獲得正式遴選取錄資格後，須於指定時間內（2026 年度為 8 月 6 日下午 5 時前）繳交 $5,000 留位費，逾期未繳即自動放棄學位。",
  },
  {
    question: "「效益比」係點計？可唔可以信？",
    answer:
      "效益比＝該課程嘅公開入職月薪 ÷ 2025 年收生分數中位數，即係「每 1 分收生分數換到幾多起薪」。只有具備公開薪級表嘅專業（醫生、牙醫、藥劑師、護士、專職醫療、社工等）才會計算，因為呢啲課程嘅入職薪酬有官方數字。其他課程嘅出路薪酬離散度太大，本網站唔會用學科大類平均去假裝係個別課程數據。",
  },
  {
    question: "大學畢業生平均薪酬係幾多？",
    answer:
      "根據教資會 2024/25 學年全日制學士課程畢業生就業調查，全職就業者平均年薪約 $336,000。按學科大類計，「醫科、牙科及護理」最高（$554,000），其次為「教育」（$363,000），最低為「文科及人文」（$279,000），最高與最低相差接近兩倍。",
  },
  {
    question: "收分低嘅課程係唔係一定差？",
    answer:
      "唔係。收生分數反映入學競爭，唔反映出路。「水泡寶藏」正正指呢類課程：收分唔高，但因為有專業註冊或行業需求，起薪及就業穩定度高於同分數水平嘅其他課程。例如護理學、放射學、社會工作都屬此類。反過來講，亦有「高分低效」嘅課程，收分很高但出路薪酬同一般商科社科無明顯分別。",
  },
];

/* ── 小元件 ───────────────────────────────────────────────────────────── */

const TAG_STYLE: Record<string, string> = {
  神科級回報: "bg-amber-500/10 text-amber-300 ring-amber-500/30",
  水泡寶藏: "bg-emerald-500/10 text-emerald-300 ring-emerald-500/30",
  抵讀: "bg-sky-500/10 text-sky-300 ring-sky-500/30",
  中性: "bg-zinc-700/40 text-zinc-300 ring-white/10",
  回報偏弱: "bg-rose-500/10 text-rose-300 ring-rose-500/30",
};

function Tag({ value }: { value: string | null }) {
  if (!value) return <span className="text-zinc-600">—</span>;
  return (
    <span
      className={`inline-block whitespace-nowrap rounded-full px-2 py-0.5 text-xs ring-1 ${
        TAG_STYLE[value] ?? "bg-zinc-800 text-zinc-400 ring-white/10"
      }`}
    >
      {value}
    </span>
  );
}

function SectionTitle({
  eyebrow,
  title,
  sub,
}: {
  eyebrow?: string;
  title: string;
  sub?: string;
}) {
  return (
    <div className="mb-5">
      {eyebrow && (
        <div className="text-xs font-semibold uppercase tracking-widest text-cyan-400/80">
          {eyebrow}
        </div>
      )}
      <h2 className="mt-1 font-[family-name:var(--font-display)] text-2xl font-extrabold tracking-tight text-zinc-100 sm:text-3xl">
        {title}
      </h2>
      {sub && <p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-400">{sub}</p>}
    </div>
  );
}

/* ── 頁面 ─────────────────────────────────────────────────────────────── */

export default function JupasGuidePage() {
  const withPay = PROGRAMMES.filter((p) => p.outcome.hasPublishedEntryPay);
  // "水泡寶藏" panel: must not list 神科 (medicine/dentistry) under that heading —
  // restrict to programmes that are not already top-of-the-table on admission score.
  const treasureCandidates = withPay.filter(
    (p) => p.tag !== "神科級回報" && p.score.median < 5.6,
  );
  const topValue = [...treasureCandidates].sort(
    (a, b) => (b.valuePerPoint ?? 0) - (a.valuePerPoint ?? 0),
  );
  const weakestValue = [...withPay].sort((a, b) => (a.valuePerPoint ?? 0) - (b.valuePerPoint ?? 0));

  const highScoreLowPay: Programme[] = PROGRAMMES.filter(
    (p) => p.score.median >= 5.2 && !p.outcome.hasPublishedEntryPay,
  ).slice(0, 6);

  return (
    <article className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <JsonLd data={buildFaqJsonLd(FAQS)} />
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "DSE 備考", path: "/dse" },
          { name: "JUPAS 揀科指南", path: "/dse/jupas" },
        ])}
      />

      {/* Hero */}
      <header className="max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-300 ring-1 ring-cyan-500/20">
          <GraduationCap className="h-3.5 w-3.5" />
          {PROGRAMMES.length} 個真實課程數據　·　2025 年收生分數
        </div>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-extrabold leading-tight tracking-tight text-zinc-100 sm:text-5xl">
          JUPAS 揀科指南
        </h1>
        <p className="mt-4 text-base leading-relaxed text-zinc-400 sm:text-lg">
          呢份指南唔係幫你「排靚個表」，而係幫你答一條更難嘅問題：
          <span className="text-zinc-200">四年之後，你手上呢張文憑值幾多？</span>
          <br />
          我哋用院校公布嘅收生分數，加上教資會嘅畢業生薪酬調查，計出「每 1 分收生分數換到幾多起薪」——
          然後你就會見到，邊啲課程收分高但出路平平，邊啲係被低估嘅水泡寶藏。
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/dse/jupas/compare"
            className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-cyan-400"
          >
            <Sparkles className="h-4 w-4" />
            並排比較 2–3 科 + 估入學組合
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="#programmes"
            className="inline-flex items-center gap-2 rounded-xl bg-zinc-800 px-4 py-2.5 text-sm font-semibold text-zinc-200 ring-1 ring-white/10 transition hover:bg-zinc-700"
          >
            睇完整課程表
          </a>
        </div>
      </header>

      {/* 數據來源 */}
      <section className="mt-10 rounded-2xl bg-zinc-900/50 p-5 ring-1 ring-white/10">
        <h2 className="text-sm font-semibold text-zinc-200">數據係點嚟嘅</h2>
        <ul className="mt-2 space-y-1.5 text-xs leading-relaxed text-zinc-400">
          <li>
            <span className="text-zinc-300">收生分數：</span>
            {JUPAS_META.scoreSource}。因為各院校計分方法（科目比重、加分、計幾多科）都唔同，
            直接比較原始分數係冇意義，所以用經正規化嘅 0–7 分指數。
          </li>
          <li>
            <span className="text-zinc-300">入職薪酬：</span>
            {JUPAS_META.paySources[0]}。呢個係官方公開數字，適用於有註冊制度嘅專業。
          </li>
          <li>
            <span className="text-zinc-300">學科大類平均：</span>
            {JUPAS_META.paySources[1]}。
          </li>
          <li>
            <span className="text-zinc-300">行業狀況：</span>
            {JUPAS_META.paySources[2]}（只用於定性描述，例如市場飽和嘅報道）。
          </li>
        </ul>
      </section>

      {/* 心法 */}
      <section className="mt-14">
        <SectionTitle
          eyebrow="立場"
          title="我嘅揀科心法"
          sub="以下五條唔係中立嘅「注意事項」。每一條都有數據支撐，而且我會明確講出邊種做法係錯。"
        />
        <div className="grid gap-4 md:grid-cols-2">
          {MINDSET.map((m) => (
            <div key={m.n} className="rounded-2xl bg-zinc-900/60 p-5 ring-1 ring-white/10">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-300 ring-1 ring-cyan-500/20">
                  <m.icon className="h-4 w-4" />
                </span>
                <h3 className="font-semibold text-zinc-100">
                  {m.n}. {m.title}
                </h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">{m.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 流程 timeline */}
      <section className="mt-14">
        <SectionTitle
          eyebrow="流程"
          title="JUPAS 一年流程時間表"
          sub="以下係 2026 年度（即 2026 年 9 月入學）嘅實際日程，可以睇到整個周期嘅節奏。每年日期會微調，報名前一定要上 JUPAS 官網核對最新日程。"
        />
        <ol className="relative space-y-4 border-l border-white/10 pl-6">
          {TIMELINE.map((t) => (
            <li key={t.when} className="relative">
              <span className="absolute -left-[27px] top-1.5 h-2.5 w-2.5 rounded-full bg-cyan-400 ring-4 ring-zinc-950" />
              <div className="rounded-xl bg-zinc-900/50 p-4 ring-1 ring-white/10">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="font-mono text-xs font-semibold text-cyan-300">{t.when}</span>
                  <span className="font-semibold text-zinc-100">{t.title}</span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{t.body}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-xs text-zinc-500">
          資料來源：JUPAS 官方公布之 2026 年度日程（經《香港01》教育版整理）。日程每年更新，
          一切以 https://www.jupas.edu.hk/tc/calendar/ 官方公布為準。
        </p>
      </section>

      {/* Band A 策略 */}
      <section className="mt-14">
        <SectionTitle
          eyebrow="策略"
          title="Band A 排位策略"
          sub="20 個選擇、5 個組別、最終只派一個 offer。理解呢個機制，你就會知道排位嘅自由度其實比想像中大。"
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {BANDS.map((b) => (
            <div key={b.band} className="rounded-2xl bg-zinc-900/60 p-4 ring-1 ring-white/10">
              <div className="font-[family-name:var(--font-display)] text-lg font-bold text-zinc-100">
                {b.band}
              </div>
              <div className="text-xs font-medium text-cyan-300">{b.n}</div>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{b.note}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-zinc-900/60 p-5 ring-1 ring-white/10">
            <div className="flex items-center gap-2 text-emerald-300">
              <Flag className="h-4 w-4" />
              <h3 className="font-semibold">派位係「順序向下」</h3>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">
              你夠分入第一志願就派第一志願；唔夠分就自動睇第二、第三個。所以 Band A
              放「搏」嘅課程係安全嘅——搏唔到唔會罰你，只係繼續向下派。真正嘅風險係
              <span className="text-zinc-200"> Band B 之後冇一個你夠分嘅選擇</span>。
            </p>
          </div>
          <div className="rounded-2xl bg-zinc-900/60 p-5 ring-1 ring-white/10">
            <div className="flex items-center gap-2 text-amber-300">
              <AlertTriangle className="h-4 w-4" />
              <h3 className="font-semibold">面試只發 Band A</h3>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">
              唔少課程（尤其商學院、醫學院、設計、傳理）只會邀請 Band A
              申請人面試，甚至只錄取面試過嘅人。即係話：你想入嘅課程放得越低，
              你連面試機會都可能冇。
            </p>
          </div>
          <div className="rounded-2xl bg-zinc-900/60 p-5 ring-1 ring-white/10">
            <div className="flex items-center gap-2 text-rose-300">
              <TrendingDown className="h-4 w-4" />
              <h3 className="font-semibold">派到就要讀</h3>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">
              接受與否，同學年內都唔會再獲派其他 JUPAS 課程。所以
              <span className="text-zinc-200">唔好放一啲你入到會後悔嘅課程落 D、E 組</span>
              ——墊底位應該係「唔係首選但接受得到」嘅課程，唔係隨便填。
            </p>
          </div>
        </div>
      </section>

      {/* 神科 vs 水泡科 */}
      <section className="mt-14">
        <SectionTitle
          eyebrow="核心分析"
          title="神科 vs 水泡科：用數據講，唔用感覺講"
          sub="「神科」同「水泡科」通常係按收生分數定義。但分數同出路係兩條獨立嘅線。呢一節我用官方薪酬數據，把兩條線疊埋一齊睇。"
        />

        {/* 大類薪酬 */}
        <div className="rounded-2xl bg-zinc-900/60 p-5 ring-1 ring-white/10 sm:p-6">
          <h3 className="font-semibold text-zinc-100">
            第一層：官方學科大類平均年薪（2024/25，全職就業者）
          </h3>
          <p className="mt-1 text-xs text-zinc-500">
            教資會數據。呢個係目前唯一官方、可靠嘅「出路薪酬」分層——但要注意佢係學科大類平均，唔係個別課程。
          </p>
          <div className="mt-4 space-y-2">
            {UGC_CATEGORY_SALARIES.map((c) => {
              const max = UGC_CATEGORY_SALARIES[0].annualK;
              return (
                <div key={c.key} className="flex items-center gap-3">
                  <div className="w-36 shrink-0 text-sm text-zinc-300">{c.label}</div>
                  <div className="h-5 flex-1 overflow-hidden rounded-md bg-zinc-950 ring-1 ring-white/5">
                    <div
                      className="h-full rounded-md bg-gradient-to-r from-cyan-500/60 to-cyan-400"
                      style={{ width: `${(c.annualK / max) * 100}%` }}
                    />
                  </div>
                  <div className="w-32 shrink-0 text-right text-sm tabular-nums text-zinc-200">
                    ${(c.annualK * 1000).toLocaleString("en-US")}
                  </div>
                  <div className="hidden w-24 shrink-0 text-right text-xs tabular-nums text-zinc-500 sm:block">
                    {hkd(monthly(c.annualK))}／月
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-4 text-sm leading-relaxed text-zinc-400">
            <span className="text-zinc-200">呢張圖最重要嘅訊息：</span>
            最高（醫科、牙科及護理 $554,000）同最低（文科及人文 $279,000）相差{" "}
            <span className="text-cyan-300">{(554 / 279).toFixed(2)} 倍</span>。
            但呢個差距<span className="text-zinc-200">唔係「文科冇用」</span>——而係因為醫療類別內含大量有註冊制度、
            薪級表公開嘅專業職位。冇註冊制度嘅行業，人工先至係真正嘅「浮動市場」。
          </p>
        </div>

        {/* 效益比 */}
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl bg-emerald-500/5 p-5 ring-1 ring-emerald-500/20">
            <h3 className="flex items-center gap-2 font-semibold text-emerald-200">
              <Sparkles className="h-4 w-4" /> 水泡寶藏：收分唔高，起薪硬淨
            </h3>
            <p className="mt-1 text-xs text-emerald-200/70">
              效益比＝公開入職月薪 ÷ 收生分數中位數。以下係收生中位數 5.6 分以下、而有公開薪級表嘅課程中，
              效益比最高嘅一批。（醫科、牙醫嘅效益比更高，但收分屬全港最高，唔屬於「水泡」）
            </p>
            <ul className="mt-3 space-y-2">
              {topValue.slice(0, 5).map((p) => (
                <li
                  key={p.code}
                  className="flex items-center justify-between gap-3 rounded-lg bg-zinc-950/50 px-3 py-2"
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm text-zinc-200">{p.name}</div>
                    <div className="text-xs text-zinc-500">
                      {p.university}　收生 {p.score.median.toFixed(2)}　起薪{" "}
                      {hkd(p.outcome.entryPayMonthly ?? 0)}
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="font-mono text-sm font-bold tabular-nums text-emerald-300">
                      {hkd(p.valuePerPoint ?? 0)}
                    </div>
                    <div className="text-[10px] text-zinc-500">每 1 分</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl bg-amber-500/5 p-5 ring-1 ring-amber-500/20">
            <h3 className="flex items-center gap-2 font-semibold text-amber-200">
              <AlertTriangle className="h-4 w-4" /> 高分，但出路冇公開薪級表
            </h3>
            <p className="mt-1 text-xs text-amber-200/70">
              呢啲課程收生中位數 5.2 以上（屬全港前列），但係冇註冊制度同公開薪級表，
              出路薪酬離散度極大。呢度唔係話佢哋出路差——而係話
              <span className="text-amber-100">冇任何官方數字支持「高分必然等於高薪」</span>。
              你要用其他方法（實習、校友、行業起薪）自己查證。
            </p>
            <ul className="mt-3 space-y-2">
              {highScoreLowPay.map((p) => (
                <li
                  key={p.code}
                  className="flex items-center justify-between gap-3 rounded-lg bg-zinc-950/50 px-3 py-2"
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm text-zinc-200">{p.name}</div>
                    <div className="text-xs text-zinc-500">{p.university}</div>
                  </div>
                  <div className="shrink-0 font-mono text-sm font-bold tabular-nums text-amber-300">
                    {p.score.median.toFixed(2)}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-zinc-900/60 p-5 ring-1 ring-white/10">
          <h3 className="font-semibold text-zinc-100">我嘅立場，講明白</h3>
          <div className="mt-3 space-y-3 text-sm leading-relaxed text-zinc-400">
            <p>
              <span className="text-zinc-200">一、收分低唔等於差，收分高唔等於好。</span>
              護理學收 4.24 分，起薪 $35,780，每 1 分收生分數換到約 $8,400 起薪，而且有極高就業保障。
              科大量化金融收 6.26 分——全港第四高——但佢冇註冊制度、冇公開薪級表，
              我哋連「每 1 分換到幾多」都算唔出。呢個就係關鍵分別：
              <span className="text-zinc-200">一個嘅出路有官方數字，一個冇</span>。
              「算唔出」唔等於差，但你要清楚你係用 6.26 分買一個高賠率賭注，唔係買一個保證。
            </p>
            <p>
              <span className="text-zinc-200">二、真正嘅風險唔係「入錯科」，而係「用高分買一個冇出口嘅學位」。</span>
              文科同人文大類平均年薪 $279,000，係八個大類中最低。但同一時間，教育大類
              （$363,000）有大量職位其實係文科生讀完 PGDE 之後入去嘅。所以問題唔係讀文科，
              而係<span className="text-zinc-200">讀完文科學位之後冇再讀第二層</span>。
            </p>
            <p>
              <span className="text-zinc-200">三、唔好相信「呢科好搶手」嘅今日傳聞。</span>
              物理治療係最好嘅反面教材：曾經被視為黃金飯碗，但院校畢業生數量急增之後，
              2025 年已經有畢業生公開講投遞多份申請、三個月零回音。你入學嗰年嘅熱門，
              同你畢業嗰年嘅市場，可以完全係兩回事。
            </p>
            <p>
              <span className="text-zinc-200">四、我唔會用學科大類平均去假裝係個別課程數據。</span>
              呢個係好多升學網站最常見嘅誤導：把「醫科、牙科及護理」大類平均 $554,000
              套落中醫、中藥、公共衞生課程上面。公開衞生畢業生唔會賺 $46,000 一個月。
              所以本網站嘅「效益比」只計有公開薪級表嘅專業，其餘課程我只列大類平均，並明確標示。
            </p>
          </div>
        </div>

        {/* 同分差價 */}
        <div className="mt-6 rounded-2xl bg-cyan-500/5 p-5 ring-1 ring-cyan-500/20 sm:p-6">
          <h3 className="flex items-center gap-2 font-semibold text-cyan-100">
            <Scale2 /> 同一個專業、唔同收分：最直接嘅套利機會
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-cyan-100/80">
            當兩個課程通往同一個註冊資格、同一個薪級表，但收生分數唔同，較低分嗰個就係
            免費嘅性價比。以下係數據庫中可直接對照嘅例子：
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[520px] border-collapse text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-cyan-200/70">
                  <th className="pb-2 pr-3 font-medium">專業</th>
                  <th className="pb-2 pr-3 font-medium">課程</th>
                  <th className="pb-2 pr-3 font-medium">收生中位數</th>
                  <th className="pb-2 font-medium">同一起薪</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {[
                  ["護理學", "理大 JS3648", "4.24"],
                  ["護理學", "都大 JSSU40", "3.89"],
                  ["護理學", "港大 JS6468", "4.93"],
                  ["護理學", "中大 JS4513", "5.00"],
                ].map(([prof, prog, score], i) => (
                  <tr key={prog}>
                    <td className="py-2 pr-3 text-cyan-100/60">{i === 0 ? prof : ""}</td>
                    <td className="py-2 pr-3 text-zinc-200">{prog}</td>
                    <td className="py-2 pr-3 font-mono tabular-nums text-zinc-100">{score}</td>
                    <td className="py-2 tabular-nums text-cyan-200">
                      {i === 0 ? "$35,780／月（註冊護士薪級表第 15 點）" : "同上"}
                    </td>
                  </tr>
                ))}
                {[
                  ["物理治療", "理大 JS3636", "5.60"],
                  ["物理治療", "都大 JSSU55", "4.40"],
                ].map(([prof, prog, score], i) => (
                  <tr key={prog}>
                    <td className="py-2 pr-3 text-cyan-100/60">{i === 0 ? prof : ""}</td>
                    <td className="py-2 pr-3 text-zinc-200">{prog}</td>
                    <td className="py-2 pr-3 font-mono tabular-nums text-zinc-100">{score}</td>
                    <td className="py-2 tabular-nums text-cyan-200">
                      {i === 0 ? "$33,405／月（二級物理治療師第 14 點）" : "同上"}
                    </td>
                  </tr>
                ))}
                {[
                  ["社會工作", "港大 JS6731", "5.07"],
                  ["社會工作", "浸大 JS2660", "4.18"],
                ].map(([prof, prog, score], i) => (
                  <tr key={prog}>
                    <td className="py-2 pr-3 text-cyan-100/60">{i === 0 ? prof : ""}</td>
                    <td className="py-2 pr-3 text-zinc-200">{prog}</td>
                    <td className="py-2 pr-3 font-mono tabular-nums text-zinc-100">{score}</td>
                    <td className="py-2 tabular-nums text-cyan-200">
                      {i === 0 ? "$37,585／月（ASWO 總薪級表第 16 點）" : "同上"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-cyan-100/80">
            以護理為例：都大收 3.89 分，港大收 4.93 分，相差超過 1 分——但兩者都係註冊護士，
            同一個薪級表。呢 1 分你可以用嚟放另一科博一博。當然，課程資源、實習安排、
            教學質素係另一回事，你要自己衡量；但單論「入場分數換出路」，低分版本係明顯抵讀。
          </p>
        </div>
      </section>

      {/* 完整課程表 */}
      <section id="programmes" className="mt-14 scroll-mt-20">
        <SectionTitle
          eyebrow="數據庫"
          title={`完整課程表（${PROGRAMMES.length} 個課程）`}
          sub="全部按 2025 年收生中位數由高至低排列。有公開薪級表嘅課程先會計算「效益比」同標籤——收生分數高唔代表出路好，分數低亦唔代表差。"
        />
        <div className="overflow-x-auto rounded-2xl ring-1 ring-white/10">
          <table className="w-full min-w-[900px] border-collapse text-sm">
            <thead>
              <tr className="bg-zinc-900/80 text-left text-xs uppercase tracking-wide text-zinc-500">
                <th className="p-3 font-medium">代碼</th>
                <th className="p-3 font-medium">課程</th>
                <th className="p-3 text-right font-medium">收生中位數</th>
                <th className="p-3 text-right font-medium">下／上四分位</th>
                <th className="p-3 text-right font-medium">入職薪酬</th>
                <th className="p-3 text-right font-medium">效益比</th>
                <th className="p-3 font-medium">標籤</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-zinc-950/40">
              {PROGRAMMES.map((p) => (
                <tr key={p.code} className="align-top hover:bg-white/[0.03]">
                  <td className="whitespace-nowrap p-3 font-mono text-xs text-cyan-300">
                    {p.code}
                  </td>
                  <td className="p-3">
                    <div className="font-medium text-zinc-100">{p.name}</div>
                    <div className="text-xs text-zinc-500">
                      {p.university}　·　{p.category}　·　{p.outcome.demand}
                    </div>
                    <div className="mt-2 max-w-2xl text-xs leading-relaxed text-zinc-400">
                      {p.verdict}
                    </div>
                    {p.outcome.marketNote && (
                      <div className="mt-1.5 max-w-2xl text-xs leading-relaxed text-zinc-500">
                        <span className="text-zinc-600">市場備註：</span>
                        {p.outcome.marketNote}
                      </div>
                    )}
                  </td>
                  <td className="p-3 text-right font-mono tabular-nums text-zinc-100">
                    {p.score.median.toFixed(2)}
                  </td>
                  <td className="p-3 text-right font-mono text-xs tabular-nums text-zinc-400">
                    {p.score.lower === null
                      ? "未公布"
                      : `${p.score.lower.toFixed(2)} / ${p.score.upper?.toFixed(2) ?? "—"}`}
                    {p.score.quartileNote && (
                      <div className="mt-0.5 text-[10px] leading-snug text-zinc-600">
                        {p.score.quartileNote}
                      </div>
                    )}
                  </td>
                  <td className="p-3 text-right text-xs tabular-nums text-zinc-300">
                    {p.outcome.hasPublishedEntryPay && p.outcome.entryPayMonthly ? (
                      <>
                        <div className="font-semibold text-zinc-100">
                          {hkd(p.outcome.entryPayMonthly)}
                        </div>
                        <div className="text-zinc-500">公開薪級表</div>
                      </>
                    ) : (
                      <>
                        <div className="text-zinc-400">{hkd(monthly(p.outcome.ugcAnnualSalaryK))}</div>
                        <div className="text-zinc-600">
                          {p.outcome.ugcCategoryLabel}大類平均
                        </div>
                      </>
                    )}
                  </td>
                  <td className="p-3 text-right font-mono tabular-nums">
                    {p.valuePerPoint === null ? (
                      <span className="text-zinc-600">—</span>
                    ) : (
                      <span className="text-cyan-300">{hkd(p.valuePerPoint)}</span>
                    )}
                  </td>
                  <td className="p-3">
                    <Tag value={p.tag} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-zinc-500">
          「入職薪酬」一欄：有公開薪級表嘅專業顯示官方入職月薪；其餘課程顯示所屬學科大類平均月薪
          （UGC 2024/25，全職就業者年薪 ÷ 12），
          <span className="text-zinc-400">並非該課程嘅入職起薪</span>，兩者不可直接比較。
          「效益比」只計前者。
        </p>
      </section>

      {/* 最弱效益 */}
      <section className="mt-14">
        <SectionTitle
          eyebrow="對照"
          title="同一把尺之下，效益最低嘅一批"
          sub="以下課程同樣有公開薪級表（所以可以公平比較），但每 1 分收生分數換到嘅起薪係數據庫中最低。呢個唔代表呢啲課程唔好——而係代表「收生競爭」同「入職薪酬」之間嘅落差最大。"
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {weakestValue.slice(0, 4).map((p) => (
            <div key={p.code} className="rounded-2xl bg-zinc-900/60 p-4 ring-1 ring-white/10">
              <div className="font-mono text-xs text-cyan-300">{p.code}</div>
              <div className="mt-1 font-semibold text-zinc-100">{p.name}</div>
              <div className="text-xs text-zinc-500">{p.university}</div>
              <dl className="mt-3 space-y-1 text-xs">
                <div className="flex justify-between">
                  <dt className="text-zinc-500">收生中位數</dt>
                  <dd className="font-mono tabular-nums text-zinc-200">
                    {p.score.median.toFixed(2)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-zinc-500">入職月薪</dt>
                  <dd className="tabular-nums text-zinc-200">
                    {hkd(p.outcome.entryPayMonthly ?? 0)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-zinc-500">每 1 分</dt>
                  <dd className="font-mono tabular-nums text-zinc-200">
                    {hkd(p.valuePerPoint ?? 0)}
                  </dd>
                </div>
              </dl>
              <p className="mt-3 text-xs leading-relaxed text-zinc-400">{p.verdict}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-14">
        <SectionTitle eyebrow="常見問題" title="JUPAS 揀科 FAQ" />
        <div className="space-y-3">
          {FAQS.map((f) => (
            <details
              key={f.question}
              className="group rounded-2xl bg-zinc-900/60 p-4 ring-1 ring-white/10"
            >
              <summary className="cursor-pointer list-none font-semibold text-zinc-100 marker:hidden">
                <span className="flex items-start justify-between gap-3">
                  {f.question}
                  <span className="mt-1 shrink-0 text-cyan-400 transition group-open:rotate-45">
                    ＋
                  </span>
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">{f.answer}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-14 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-zinc-900/60 p-6 ring-1 ring-cyan-500/20 sm:p-8">
        <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-zinc-100">
          下一步：把你嘅成績同 2–3 個課程並排比較
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">
          輸入你嘅預計最佳 5 科總分，挑選最多 3 個課程，即刻睇到並排對照（收生分數、入職薪酬、
          效益比）以及逐科嘅入學機會估算（穩入／有機／陪跑）。
        </p>
        <Link
          href="/dse/jupas/compare"
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-cyan-400"
        >
          開始比較 <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      {/* Disclaimer */}
      <section className="mt-10 rounded-2xl bg-zinc-900/40 p-5 ring-1 ring-white/10">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-zinc-300">
          <AlertTriangle className="h-4 w-4 text-amber-300" /> 免責聲明
        </h2>
        <p className="mt-2 text-xs leading-relaxed text-zinc-500">{JUPAS_META.caveat}</p>
        <p className="mt-2 text-xs leading-relaxed text-zinc-500">
          本頁所有收生分數、學額、薪酬及日程資料均整理自公開來源，只供參考，並非官方資料，
          亦不構成任何升學或職業建議。收生分數及計分方法每年可能變動，過往數據不能預測將來取錄機會。
          JUPAS 及各大學之官方公布為唯一權威來源。
        </p>
      </section>
    </article>
  );
}

/** Inline icon kept separate so the lucide import list stays flat. */
function Scale2() {
  return <TrendingUp className="h-4 w-4" />;
}
