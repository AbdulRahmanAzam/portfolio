import { portfolioData } from "@/lib/schema";

export const metadata = {
  title: `Blog | ${portfolioData.name}`,
  description: `Technical articles on AI/ML, full-stack development, and software engineering by ${portfolioData.name}.`,
  openGraph: {
    title: `Blog | ${portfolioData.name}`,
    description: `Technical articles on AI/ML, full-stack development, and software engineering by ${portfolioData.name}.`,
    url: `${portfolioData.siteUrl}/blog`,
    siteName: `${portfolioData.name} Portfolio`,
    type: "website",
  },
};

export default function BlogLayout({ children }) {
  return children;
}
