import type { Metadata } from "next";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute: `DSE 學習與備考專區 | ${SITE_NAME}`,
  },
  description: `${SITE_NAME}｜${SITE_TAGLINE}。中文指定範文閃卡、診斷室、English／ECON／數學自學路徑、溫習片同 JUPAS 揀科數據，全部免費、免登入。`,
};

export default function DseLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="dse-root flex min-h-screen flex-col antialiased">
      <SiteHeader />
      <main className="mx-auto w-full max-w-[1160px] flex-1 px-4 py-8 sm:px-6 sm:py-10">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
