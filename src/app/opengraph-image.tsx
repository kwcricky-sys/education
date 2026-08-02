import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";

export const alt = `${SITE_NAME} — ${SITE_TAGLINE}`;
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
            "linear-gradient(145deg, #030712 0%, #070b14 40%, #0c1a2e 100%)",
          color: "#f8fafc",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 22,
            letterSpacing: 2,
            color: "#00f2fe",
            fontWeight: 600,
          }}
        >
          ⚡️ AI Powered · CAT System
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
            color: "#94a3b8",
            maxWidth: 900,
            lineHeight: 1.35,
          }}
        >
          用 AI 10 題 Hack 穿你嘅 DSE 盲點
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 20,
            color: "#64748b",
          }}
        >
          {SITE_TAGLINE}
        </div>
      </div>
    ),
    { ...size },
  );
}
