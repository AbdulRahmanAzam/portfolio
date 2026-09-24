import { renderOgImage, OG_SIZE } from "@/lib/og";
import { getBlogPost, getAllPublishedPosts } from "@/lib/blog";

export const alt = "Article by Abdul Rahman Azam";
export const size = OG_SIZE;
export const contentType = "image/png";

// Prerender one image per post at build time.
export function generateStaticParams() {
  return getAllPublishedPosts().map((post) => ({ slug: post.slug }));
}

export default async function OGImage({ params }) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  return renderOgImage({
    eyebrow: "Abdul Rahman Azam · Blog",
    title: post?.title ?? "Abdul Rahman Azam",
    tags: post?.tags ?? [],
  });
}
