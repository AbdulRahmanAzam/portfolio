import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Abdul Rahman Azam – Full Stack AI Engineer Portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
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
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: "absolute",
            top: "-120px",
            right: "-120px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(37,99,235,0.25) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-80px",
            left: "-80px",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(34,197,94,0.2) 0%, transparent 70%)",
          }}
        />

        {/* Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 20px",
            borderRadius: "999px",
            background: "rgba(37,99,235,0.15)",
            border: "1px solid rgba(37,99,235,0.3)",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#22c55e",
            }}
          />
          <span style={{ fontSize: "16px", color: "#93c5fd", fontWeight: 500 }}>
            Open to AI/ML Opportunities
          </span>
        </div>

        {/* Name */}
        <div
          style={{
            fontSize: "64px",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            background: "linear-gradient(135deg, #3b82f6, #60a5fa, #22c55e)",
            backgroundClip: "text",
            color: "transparent",
            marginBottom: "12px",
          }}
        >
          Abdul Rahman Azam
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: "28px",
            fontWeight: 600,
            color: "#94a3b8",
            marginBottom: "32px",
          }}
        >
          Full Stack AI Engineer
        </div>

        {/* Skills row */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {["React.js", "Node.js", "Python", "Machine Learning", "Deep Learning"].map(
            (skill) => (
              <div
                key={skill}
                style={{
                  padding: "6px 16px",
                  borderRadius: "8px",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  fontSize: "15px",
                  color: "#cbd5e1",
                }}
              >
                {skill}
              </div>
            )
          )}
        </div>

        {/* URL */}
        <div
          style={{
            position: "absolute",
            bottom: "28px",
            fontSize: "16px",
            color: "#64748b",
            letterSpacing: "0.05em",
          }}
        >
          abdulrahmanazam.me
        </div>
      </div>
    ),
    { ...size }
  );
}
