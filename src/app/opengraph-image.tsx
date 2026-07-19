import { ImageResponse } from "next/og";

export const alt = "StadiumIQ-AI — FIFA World Cup 2026 stadium intelligence";
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
          justifyContent: "space-between",
          padding: 64,
          background: "linear-gradient(135deg, #0B1F3A 0%, #003087 45%, #00A651 100%)",
          color: "white",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 28,
            fontWeight: 600,
            opacity: 0.9,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(255,255,255,0.15)",
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            IQ
          </div>
          StadiumIQ-AI
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              fontSize: 64,
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: -1.5,
              maxWidth: 980,
            }}
          >
            AI-powered stadium intelligence for match day
          </div>
          <div style={{ fontSize: 28, opacity: 0.88, maxWidth: 900, lineHeight: 1.35 }}>
            Best-gate routing · accessibility guidance · emergency help · volunteer ops
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 22,
            opacity: 0.85,
          }}
        >
          <span>FIFA World Cup 2026 · Unofficial concept demo</span>
          <span>Get Me In →</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
