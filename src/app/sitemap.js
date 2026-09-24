import { getAllPublishedPosts } from "@/lib/blog";
import { portfolioData, LAST_UPDATED, PROFILE_IMAGE } from "@/lib/schema";

export default function sitemap() {
  const site = portfolioData.siteUrl;
  const posts = getAllPublishedPosts();
  const latestPost = posts.reduce((latest, p) => ((p.updated || p.date) > latest ? p.updated || p.date : latest), "");

  return [
    {
      url: `${site}/`,
      lastModified: LAST_UPDATED,
      changeFrequency: "monthly",
      priority: 1,
      images: [PROFILE_IMAGE.portrait],
    },
    {
      url: `${site}/services`,
      lastModified: LAST_UPDATED,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${site}/blog`,
      lastModified: latestPost || LAST_UPDATED,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...posts.map((post) => ({
      url: `${site}/blog/${post.slug}`,
      lastModified: post.updated || post.date,
      changeFrequency: "monthly",
      priority: post.slug === "who-is-abdul-rahman-azam" ? 0.9 : 0.6,
    })),
  ];
}
