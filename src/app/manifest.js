import { portfolioData } from "@/lib/schema";

export default function manifest() {
  return {
    name: `${portfolioData.name} – ${portfolioData.title}`,
    short_name: portfolioData.name,
    description: portfolioData.description,
    start_url: "/",
    display: "standalone",
    background_color: "#0f172a",
    theme_color: "#2563eb",
    icons: [
      { src: "/favicon.png", sizes: "128x128", type: "image/png" },
      { src: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      { src: "/abdul-rahman-azam-square.jpg", sizes: "600x600", type: "image/jpeg" },
    ],
  };
}
