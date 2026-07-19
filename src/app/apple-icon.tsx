import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 36,
          background: "linear-gradient(135deg, #003087 0%, #00A651 100%)",
          color: "white",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 700, letterSpacing: -2 }}>IQ</div>
        <div style={{ fontSize: 22, fontWeight: 600, opacity: 0.9 }}>Stadium</div>
      </div>
    ),
    { ...size },
  );
}
