import type { Metadata } from "next";
import Script from "next/script";
import { Inter, Noto_Sans_TC, Sora } from "next/font/google";
import { JsonLd } from "@/components/seo/json-ld";
import { buildWebSiteJsonLd } from "@/lib/seo";
import {
  ADSENSE_CLIENT_ID,
  SITE_NAME,
  SITE_NAME_EN,
  SITE_TAGLINE,
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
    default: `${SITE_NAME}｜${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: `${SITE_NAME}（${SITE_NAME_EN}）— ${SITE_TAGLINE}。DSE 備考閃卡與範文診斷練習。`,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  other: {
    "google-adsense-account": ADSENSE_CLIENT_ID,
  },
  openGraph: {
    type: "website",
    locale: "zh_HK",
    siteName: SITE_NAME,
    url: SITE_URL,
    title: `${SITE_NAME}｜${SITE_TAGLINE}`,
    description: `${SITE_TAGLINE}。免費 DSE 中文指定範文練習與自適應診斷。`,
  },
  twitter: {
    card: "summary_large_image",
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
      </body>
    </html>
  );
}
