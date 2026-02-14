import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "ReplaySell — Turn your live replay into 48 hours of sales";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#fcfaf7",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background grid pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.04,
            backgroundImage:
              "linear-gradient(rgba(26,26,26,1) 1px, transparent 1px), linear-gradient(90deg, rgba(26,26,26,1) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />

        {/* Decorative colored shapes */}
        <div
          style={{
            position: "absolute",
            top: -40,
            right: -40,
            width: 200,
            height: 200,
            borderRadius: 32,
            background: "#ff9ecd",
            border: "3px solid #1a1a1a",
            transform: "rotate(15deg)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -30,
            left: -30,
            width: 160,
            height: 160,
            borderRadius: 32,
            background: "#acf8e0",
            border: "3px solid #1a1a1a",
            transform: "rotate(-10deg)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 80,
            left: 60,
            width: 80,
            height: 80,
            borderRadius: 20,
            background: "#f9e27f",
            border: "3px solid #1a1a1a",
            transform: "rotate(8deg)",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
            padding: "0 80px",
            position: "relative",
          }}
        >
          {/* Logo */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                background: "#ffbc8c",
                border: "3px solid #1a1a1a",
                boxShadow: "0 4px 0 #000",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
              }}
            >
              📦
            </div>
            <span
              style={{
                fontSize: 36,
                fontWeight: 900,
                color: "#1a1a1a",
                letterSpacing: "-0.02em",
              }}
            >
              ReplaySell
            </span>
          </div>

          {/* Headline */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 0,
            }}
          >
            <span
              style={{
                fontSize: 56,
                fontWeight: 900,
                color: "#1a1a1a",
                letterSpacing: "-0.035em",
                lineHeight: 1.1,
                textAlign: "center",
              }}
            >
              Turn Your Live Replay Into
            </span>
            <span
              style={{
                fontSize: 56,
                fontWeight: 900,
                color: "#ff6b5a",
                letterSpacing: "-0.035em",
                lineHeight: 1.1,
                textAlign: "center",
              }}
            >
              48 Hours of Sales
            </span>
          </div>

          {/* Subheading */}
          <span
            style={{
              fontSize: 22,
              fontWeight: 600,
              color: "#6b6b6b",
              textAlign: "center",
              maxWidth: 700,
              lineHeight: 1.5,
            }}
          >
            Shoppable replay pages · Countdown timers · Stripe checkout
          </span>

          {/* Badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              borderRadius: 999,
              border: "3px solid #1a1a1a",
              background: "#f9e27f",
              padding: "8px 20px",
              boxShadow: "0 3px 0 #000",
              fontSize: 14,
              fontWeight: 800,
              textTransform: "uppercase" as const,
              letterSpacing: "0.08em",
              color: "#1a1a1a",
            }}
          >
            Plans from $49/mo · No commission
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
