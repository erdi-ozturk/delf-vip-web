import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "DELF VIP Transfer - İstanbul Lüks Transfer Hizmeti";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0f172a 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Arka plan desen */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle at 20% 50%, rgba(245,158,11,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(245,158,11,0.05) 0%, transparent 40%)",
          }}
        />

        {/* Altın çizgi üst */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, transparent, #f59e0b, transparent)",
          }}
        />

        {/* İçerik */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "24px",
            padding: "60px",
            textAlign: "center",
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(245,158,11,0.15)",
              border: "1px solid rgba(245,158,11,0.3)",
              borderRadius: "100px",
              padding: "8px 20px",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#f59e0b",
              }}
            />
            <span style={{ color: "#f59e0b", fontSize: "14px", fontWeight: 700, letterSpacing: "2px" }}>
              7/24 VIP TRANSFER HİZMETİ
            </span>
          </div>

          {/* Ana başlık */}
          <div
            style={{
              fontSize: "72px",
              fontWeight: 800,
              color: "white",
              lineHeight: 1.1,
              letterSpacing: "-1px",
            }}
          >
            DELF{" "}
            <span style={{ color: "#f59e0b" }}>VIP</span>
          </div>

          {/* Alt başlık */}
          <div
            style={{
              fontSize: "26px",
              color: "#94a3b8",
              fontWeight: 500,
              maxWidth: "700px",
              lineHeight: 1.4,
            }}
          >
            İstanbul Havalimanı & Sabiha Gökçen Transfer
          </div>

          {/* Özellikler */}
          <div
            style={{
              display: "flex",
              gap: "32px",
              marginTop: "16px",
            }}
          >
            {["Mercedes Vito", "Sabit Fiyat", "Ücretsiz Bekleme"].map((text) => (
              <div
                key={text}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "#cbd5e1",
                  fontSize: "16px",
                  fontWeight: 600,
                }}
              >
                <span style={{ color: "#f59e0b", fontSize: "18px" }}>✓</span>
                {text}
              </div>
            ))}
          </div>
        </div>

        {/* URL */}
        <div
          style={{
            position: "absolute",
            bottom: "28px",
            color: "#475569",
            fontSize: "14px",
            fontWeight: 500,
          }}
        >
          www.delfvip.com
        </div>

        {/* Altın çizgi alt */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, transparent, #f59e0b, transparent)",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
