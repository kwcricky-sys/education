import type { Metadata } from "next";
import Script from "next/script";
import { Inter, Noto_Sans_TC, Sora } from "next/font/google";
import { CookieConsent } from "@/components/site/cookie-consent";
import { JsonLd } from "@/components/seo/json-ld";
import { buildWebSiteJsonLd } from "@/lib/seo";
import {
  ADSENSE_CLIENT_ID,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
} from "@/lib/site";
import "./globals.css";

const sansFont = Inter({
  variable: "--font-sans-latin",
  subsets: ["latin"],
  display: "swap",
});

const bodyFont = Noto_Sans_TC({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const displayFont = Sora({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  keywords: [
    "DSE.hack",
    "DSE",
    "DSE 中文",
    "DSE 補習",
    "CAT",
    "適應性評估",
    "範文閃卡",
    "Flashcards",
    "文言文",
    "AI 診斷",
    "香港 DSE",
    ...SITE_KEYWORDS,
  ],
  other: {
    "google-adsense-account": ADSENSE_CLIENT_ID,
  },
  openGraph: {
    type: "website",
    locale: "zh_HK",
    siteName: SITE_NAME,
    url: SITE_URL,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-HK"
      className={`${sansFont.variable} ${bodyFont.variable} ${displayFont.variable} h-full antialiased`}
    >
      <head>
        <meta name="google-adsense-account" content={ADSENSE_CLIENT_ID} />
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
      </head>
      <body className="flex min-h-full flex-col">
        <JsonLd data={buildWebSiteJsonLd()} />
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
