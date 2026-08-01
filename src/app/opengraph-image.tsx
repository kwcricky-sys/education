import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_NAME_EN, SITE_TAGLINE } from "@/lib/site";

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
            "linear-gradient(145deg, #0b1220 0%, #132033 45%, #0c4a6e 130%)",
          color: "#f8fafc",
        }}
      >
        <div
          style={{
            fontSize: 26,
            letterSpacing: 8,
            color: "#7dd3fc",
            fontWeight: 600,
          }}
        >
          {SITE_NAME_EN}
        </div>
        <div style={{ fontSize: 96, fontWeight: 800, marginTop: 12 }}>
          {SITE_NAME}
        </div>
        <div
          style={{
            fontSize: 34,
            marginTop: 24,
            color: "#e0f2fe",
            maxWidth: 900,
          }}
        >
          {SITE_TAGLINE}
        </div>
      </div>
    ),
    { ...size },
  );
}
