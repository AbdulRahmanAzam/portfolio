import { portfolioData } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

export const metadata = {
  ...buildMetadata({
    title: "Blog",
    description: `Articles by ${portfolioData.name} on AI agents, machine learning, full-stack development and SEO for AI search.`,
    path: "/blog",
  }),
  // Posts get " | Abdul Rahman Azam" appended unless their title already has the name.
  title: { default: "Blog", template: `%s | ${portfolioData.name}` },
};

export default function BlogLayout({ children }) {
  return children;
}
