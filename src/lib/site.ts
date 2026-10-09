/** Replace SITE_URL with your production domain before launch. */
export const SITE_URL = "https://dse.hkxoptima.com";
export const SITE_NAME = "DSE.hack";
export const SITE_NAME_EN = "DSE.hack";
/** Brand descriptor — shown under the name across the site. */
export const SITE_TAGLINE = "香港 DSE 免費自修室";
/** Longer footer line. */
export const SITE_TAGLINE_FULL =
  "香港 DSE 免費自修室：中文範文閃卡、自學路徑同診斷室、English／ECON／數學／BAFS／ICT 自學路徑、溫習片庫同 JUPAS 揀科數據。免登入，進度只存你部機。";

export const HKEAA_URL = "https://www.hkeaa.edu.hk/tc/hkdse/";

/** Sister product — primary-school admissions (升小). */
export const SISTER_SITE = {
  name: "升小極優",
  url: "https://primary.hkxoptima.com",
  blurb: "小一選校、直私報名日曆同面試準備",
} as const;

/** Default SEO title (root layout + homepage). */
export const SITE_TITLE =
  "DSE.hack｜免費 DSE 中文溫習工具｜AI CAT 診斷與範文閃卡";

/** Default meta description — aligned to Blue Ocean「DSE 補習」search intent. */
export const SITE_DESCRIPTION =
  "搵 DSE 補習前，先用免費 AI 自適應診斷（CAT）同 12 篇指定文言文範文 Flashcards 找出盲點。DSE.hack 專為香港考生打造極速溫習工具，唔使先交補習學費。";

/** Core keywords from HK Blue Ocean cluster「DSE 補習」+ product terms. */
export const SITE_KEYWORDS = [
  "DSE 補習",
  "dse 補習 推薦",
  "dse 補習 邊間好",
  "dse 補習 價錢",
  "dse 補習班",
  "dse 補習社",
  "DSE 中文",
  "指定範文",
  "範文閃卡",
  "CAT 診斷",
  "自適應評估",
  "DSE.hack",
  "免費 DSE 溫習",
] as const;

export const CONTACT_EMAIL = "admin@hkxoptima.com";

export const LEGAL_DISCLAIMER =
  "免責聲明：本網站內容及題庫均收集自網上公開資料，僅供溫習及學術參考之用，並非考評局官方教材。正式考試內容及評分標準請以香港考試及評核局官方公佈為準。";
