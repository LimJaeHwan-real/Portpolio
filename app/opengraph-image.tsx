import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// ponytail: ImageResponse는 Archivo 웹폰트를 자동으로 못 불러온다 — 폰트 로딩 의존성을 새로
// 추가하지 않기 위해 시스템 sans-serif 폴백으로 둔다. 톤은 히어로 락업과 동일하게 유지.
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#f3f2f2",
          color: "#201e1d",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 20,
            fontWeight: 600,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#1240e8",
          }}
        >
          <span>Developer Portfolio</span>
          <div style={{ width: 64, height: 4, background: "#1240e8" }} />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 28,
            fontSize: 108,
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: -2,
            textTransform: "uppercase",
          }}
        >
          <span>임재환</span>
          <span>Jaehwan Lim</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
