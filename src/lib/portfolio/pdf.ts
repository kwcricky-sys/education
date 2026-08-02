/** A4 at 300 DPI via html2canvas + jsPDF (browser-only). */

export const A4_WIDTH_MM = 210;
export const A4_HEIGHT_MM = 297;
/** CSS px reference ≈ 96 DPI → scale for print-grade capture */
export const PDF_DPI = 300;
export const PDF_SCALE = PDF_DPI / 96;

export async function handleDownloadPDF(opts: {
  /** One or more A4 page root elements */
  pageEls: HTMLElement[];
  fileName: string;
}): Promise<void> {
  const { pageEls, fileName } = opts;
  if (pageEls.length === 0) throw new Error("No pages to export");

  const html2canvas = (await import("html2canvas")).default;
  const { jsPDF } = await import("jspdf");

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  for (let i = 0; i < pageEls.length; i += 1) {
    const el = pageEls[i];
    const canvas = await html2canvas(el, {
      scale: PDF_SCALE,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      logging: false,
    });

    const img = canvas.toDataURL("image/jpeg", 0.92);
    if (i > 0) pdf.addPage("a4", "portrait");
    pdf.addImage(img, "JPEG", 0, 0, A4_WIDTH_MM, A4_HEIGHT_MM, undefined, "FAST");
  }

  const safe = fileName.replace(/[^\w\u4e00-\u9fff-]+/g, "_") || "portfolio";
  pdf.save(`${safe}-A4-${PDF_DPI}dpi.pdf`);
}
