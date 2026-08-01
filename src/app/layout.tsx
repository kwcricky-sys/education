import type { Metadata } from "next";
import { Noto_Sans_TC, Sora } from "next/font/google";
import { JsonLd } from "@/components/seo/json-ld";
import { buildWebSiteJsonLd } from "@/lib/seo";
import { SITE_NAME, SITE_NAME_EN, SITE_TAGLINE, SITE_URL } from "@/lib/site";
import "./globals.css";

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
  description: `${SITE_NAME}（${SITE_NAME_EN}）— ${SITE_TAGLINE}。DSE 備考閃卡與 K3 選小學資訊。`,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  openGraph: {
    type: "website",
    locale: "zh_HK",
    siteName: SITE_NAME,
    url: SITE_URL,
    title: `${SITE_NAME}｜${SITE_TAGLINE}`,
    description: `${SITE_TAGLINE}。免費 DSE 中文指定範文練習與升學資源。`,
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
      className={`${bodyFont.variable} ${displayFont.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <JsonLd data={buildWebSiteJsonLd()} />
        {children}
      </body>
    </html>
  );
}
