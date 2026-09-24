import { renderOgImage, OG_SIZE } from "@/lib/og";

export const alt = "Abdul Rahman Azam – Full Stack AI Engineer from Karachi, Pakistan";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OGImage() {
  return renderOgImage({
    eyebrow: "Full Stack AI Engineer · Karachi, Pakistan",
    title: "Abdul Rahman Azam",
    subtitle: "Founder of FAST Wheels & AI Season. Builds AI agents, MCP servers and full-stack apps.",
    tags: ["AI Agents", "LangGraph", "React", "Node.js", "Python"],
  });
}
