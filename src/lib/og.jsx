import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };

let photoDataUrl;
async function getPhoto() {
  if (!photoDataUrl) {
    const buf = await readFile(join(process.cwd(), "public/abdul-rahman-azam-square.jpg"));
    photoDataUrl = `data:image/jpeg;base64,${buf.toString("base64")}`;
  }
  return photoDataUrl;
}

/**
 * Branded 1200×630 social card: headshot on the left, text on the right.
 * Used by every opengraph-image / twitter-image route so previews stay consistent.
 */
export async function renderOgImage({ eyebrow, title, subtitle, tags = [] }) {
  const photo = await getPhoto();
  const titleSize = title.length > 60 ? 46 : title.length > 36 ? 54 : 64;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: "56px",
          padding: "64px 72px",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 55%, #0f172a 100%)",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-140px",
            right: "-120px",
            width: "420px",
            height: "420px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(37,99,235,0.28) 0%, transparent 70%)",
          }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse needs a plain img */}
        <img
          src={photo}
          width={340}
          height={340}
          alt=""
          style={{ borderRadius: "32px", border: "4px solid rgba(96,165,250,0.45)", objectFit: "cover" }}
        />
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          {eyebrow ? (
            <div style={{ fontSize: "22px", fontWeight: 600, color: "#60a5fa", marginBottom: "16px", display: "flex" }}>
              {eyebrow}
            </div>
          ) : null}
          <div
            style={{
              fontSize: `${titleSize}px`,
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              color: "#f8fafc",
              display: "flex",
            }}
          >
            {title}
          </div>
          {subtitle ? (
            <div style={{ fontSize: "26px", color: "#94a3b8", marginTop: "18px", lineHeight: 1.35, display: "flex" }}>
              {subtitle}
            </div>
          ) : null}
          {tags.length ? (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "28px" }}>
              {tags.map((tag) => (
                <div
                  key={tag}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "8px",
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    fontSize: "18px",
                    color: "#cbd5e1",
                  }}
                >
                  {tag}
                </div>
              ))}
            </div>
          ) : null}
          <div style={{ fontSize: "20px", color: "#64748b", marginTop: "32px", letterSpacing: "0.04em", display: "flex" }}>
            abdulrahmanazam.me
          </div>
        </div>
      </div>
    ),
    OG_SIZE
  );
}
