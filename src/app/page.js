import { Providers } from "./providers";
import PortfolioClient from "./PortfolioClient";
import { portfolioData } from "@/lib/schema";

// Server-rendered SEO content visible to crawlers + client portfolio
export default function Home() {
  return (
    <Providers>
      {/* Hidden server-rendered content for SEO crawlers */}
      <noscript>
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 20px", fontFamily: "system-ui, sans-serif" }}>
          <h1>{portfolioData.name}</h1>
          <p>{portfolioData.title} | Machine Learning | Deep Learning | React | Node.js | Python</p>
          <p>{portfolioData.description}</p>
          <h2>Skills</h2>
          <p>{portfolioData.skills.web.map(s => s.name).join(", ")}, {portfolioData.skills.aiml.map(s => s.name).join(", ")}</p>
          <h2>Contact</h2>
          <p>Email: {portfolioData.social.email}</p>
          <p>GitHub: {portfolioData.social.github} | LinkedIn: {portfolioData.social.linkedin}</p>
        </div>
      </noscript>
      <PortfolioClient />
    </Providers>
  );
}
