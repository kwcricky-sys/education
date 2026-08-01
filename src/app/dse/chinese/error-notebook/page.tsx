import { ErrorNotebook } from "@/components/dse/cat/error-notebook";
import { createPageMetadata } from "@/lib/page-metadata";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";

export const metadata = createPageMetadata({
  title: `DSE 中文錯題本｜本地溫習閉環 | ${SITE_NAME}`,
  description: `${SITE_NAME}｜${SITE_TAGLINE}。診斷室錯題自動存入本機錯題本，支援按範文／難度複習與錯題重測。`,
  path: "/dse/chinese/error-notebook",
  keywords: ["DSE 錯題本", "間隔重複", "中文範文", "診斷室"],
});

export default function ErrorNotebookPage() {
  return <ErrorNotebook />;
}
