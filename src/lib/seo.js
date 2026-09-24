import { portfolioData } from "@/lib/schema";

/**
 * Page metadata with a self-referencing canonical URL.
 *
 * Next.js replaces (not merges) `openGraph`, `twitter` and `alternates` from the
 * root layout when a page sets them, so every page builds the full objects here.
 * Images are left out on purpose: they come from the route's opengraph-image file.
 */
export function buildMetadata({ title, description, path = "/", openGraph = {}, absoluteTitle = false }) {
  const url = `${portfolioData.siteUrl}${path === "/" ? "/" : path}`;
  const desc = description ?? portfolioData.description;
  const socialTitle = title ?? `${portfolioData.name} | ${portfolioData.title}`;

  return {
    ...(title ? { title: absoluteTitle ? { absolute: title } : title } : {}),
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      siteName: portfolioData.name,
      locale: "en_US",
      url,
      title: socialTitle,
      description: desc,
      ...openGraph,
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: desc,
    },
  };
}
