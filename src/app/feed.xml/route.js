import { getAllPublishedPosts } from "@/lib/blog";
import { portfolioData } from "@/lib/schema";

export const dynamic = "force-static";

const escapeXml = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function GET() {
  const site = portfolioData.siteUrl;
  const posts = getAllPublishedPosts();
  const items = posts
    .map(
      (post) => `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${site}/blog/${post.slug}</link>
      <guid isPermaLink="true">${site}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <dc:creator>${escapeXml(portfolioData.name)}</dc:creator>
      <description>${escapeXml(post.excerpt)}</description>
${post.tags.map((t) => `      <category>${escapeXml(t)}</category>`).join("\n")}
    </item>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXml(`${portfolioData.name} – Blog`)}</title>
    <link>${site}/blog</link>
    <description>${escapeXml(`Articles by ${portfolioData.name} on AI agents, machine learning, full-stack development and SEO.`)}</description>
    <language>en</language>
    <atom:link href="${site}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
