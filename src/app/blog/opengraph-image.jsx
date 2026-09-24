import { renderOgImage, OG_SIZE } from "@/lib/og";

export const alt = "Blog by Abdul Rahman Azam – AI engineering, full-stack development and SEO";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OGImage() {
  return renderOgImage({
    eyebrow: "Blog · Abdul Rahman Azam",
    title: "Notes on AI engineering, full-stack apps and SEO",
    tags: ["AI Agents", "Machine Learning", "Full Stack", "SEO"],
  });
}
