import { ImageResponse } from "next/og";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export const alt = SITE_DESCRIPTION;
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
          background:
            "radial-gradient(circle at 88% 8%, rgba(196,163,90,0.32) 0%, rgba(11,31,58,0) 45%), linear-gradient(145deg, #0B1F3A 0%, #163056 100%)",
          color: "#F7F3EA",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 22,
            letterSpacing: 2,
            color: "#C4A35A",
            fontWeight: 600,
          }}
        >
          DSE 自修室 · 免費 · 免登入
        </div>
        <div
          style={{
            fontSize: 88,
            fontWeight: 800,
            marginTop: 16,
            letterSpacing: -2,
          }}
        >
          {SITE_NAME}
        </div>
        <div
          style={{
            fontSize: 32,
            marginTop: 20,
            color: "#F7F3EA",
            maxWidth: 900,
            lineHeight: 1.35,
          }}
        >
          中文範文閃卡、診斷室、English／ECON 自學路徑、JUPAS 揀科
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 18,
            color: "#C4A35A",
            maxWidth: 900,
            lineHeight: 1.4,
          }}
        >
          dse.hkxoptima.com
        </div>
      </div>
    ),
    { ...size },
  );
}
