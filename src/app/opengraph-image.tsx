import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_NAME_EN } from "@/lib/site";

export const alt = `${SITE_NAME} — DSE 備考與 K3 選小學`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 72,
          background: "linear-gradient(145deg, #1a2332 0%, #243044 50%, #0f766e 130%)",
          color: "#f3efe6",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 6, opacity: 0.75 }}>
          {SITE_NAME_EN}
        </div>
        <div style={{ fontSize: 88, fontWeight: 700, marginTop: 16 }}>
          {SITE_NAME}
        </div>
        <div style={{ fontSize: 36, marginTop: 28, opacity: 0.9, maxWidth: 800 }}>
          DSE 備考練習 · K3 選小學指南
        </div>
      </div>
    ),
    { ...size },
  );
}
