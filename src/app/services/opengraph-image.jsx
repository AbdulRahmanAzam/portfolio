import { renderOgImage, OG_SIZE } from "@/lib/og";

export const alt = "SEO, AEO and GEO services by Abdul Rahman Azam";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OGImage() {
  return renderOgImage({
    eyebrow: "Services · Abdul Rahman Azam",
    title: "SEO, AEO & GEO that gets you found on Google and in AI answers",
    tags: ["Technical SEO", "AI Search", "Structured Data", "Core Web Vitals"],
  });
}
