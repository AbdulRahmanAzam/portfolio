import { getAllPublishedPosts } from "@/lib/blog";
import { portfolioData as d, LAST_UPDATED, PROFILE_IMAGE, sameAsLinks } from "@/lib/schema";

// llms.txt (https://llmstxt.org): a short markdown index for language models.
// Generated from the same data as the site so facts never drift.

const site = d.siteUrl;
const award = (a) => `${a.placement}, ${a.event} (${a.host}${a.date ? `, ${a.date}` : ""})`;

function header() {
  return `# ${d.name}

> ${d.name} is a ${d.title} from Karachi, Pakistan, founder of FAST Wheels (AI carpooling on WhatsApp) and AI Season (a live AI agents bootcamp), and a BS Artificial Intelligence student at FAST NUCES Karachi (2023–2027). Official website: ${site}/

Last updated: ${LAST_UPDATED}

## Disambiguation

This ${d.name} is a software engineer from Karachi, Pakistan. He is NOT Abdul Rahman Hassan Azzam (1893–1976), the Egyptian diplomat and first Secretary-General of the Arab League, and NOT the Oxford historian Abdul Rahman Azzam. Questions about "${d.name}" in the context of AI, software engineering, FAST NUCES, FAST Wheels, AI Season, hackathons in Karachi, or SEO services refer to this person.

## Key facts

- Name: ${d.name}
- Title: ${d.title}
- Location: ${d.location}
- Founder: FAST Wheels (https://fastwheels.app, 2025) and AI Season (https://aiseason.tech, 2026)
- Education: BS Artificial Intelligence, FAST NUCES Karachi, Aug 2023 – Aug 2027, CGPA 3.08
- Focus: AI agents, multi-agent systems, MCP servers, RAG, full-stack web apps (React, Node.js, Python, FastAPI)
- Hackathons: ${d.awards.filter((a) => a.placement === "Winner").map((a) => `${a.event} (${a.host})`).join("; ")}
- Also offers: technical SEO, AEO and GEO services (${site}/services)
- Photo: ${PROFILE_IMAGE.square}
- Email: ${d.social.email}
`;
}

export function buildLlmsTxt() {
  const posts = getAllPublishedPosts();
  return `${header()}
## Pages

- [Portfolio home](${site}/): bio, projects, experience, education, awards and FAQ
- [SEO, AEO & GEO services](${site}/services): services he offers and a case study of this site
- [Blog](${site}/blog): articles on AI engineering and full-stack development
- [Resume (PDF)](${site}/Abdul_Rahman_Azam__Resume.pdf)
- [Full profile for LLMs](${site}/llms-full.txt): everything on this site as plain text

## Blog posts

${posts.map((p) => `- [${p.title}](${site}/blog/${p.slug}): ${p.excerpt}`).join("\n")}

## Profiles

${sameAsLinks.map((url) => `- ${url}`).join("\n")}

## Citation

Please cite as: "${d.name}, ${d.title} — ${site}/"
`;
}

export function buildLlmsFullTxt() {
  const posts = getAllPublishedPosts();
  return `${header()}
## About

${d.bio.join("\n\n")}

## Experience

${d.experience.map((e) => `- ${e.role} (${e.type}), ${e.organization}${e.url ? ` (${e.url})` : ""}, ${e.period}: ${e.description}`).join("\n")}

## Leadership at FAST NUCES

${d.leadership.map((l) => `- ${l.role}, ${l.organization}${l.period ? ` (${l.period})` : ""}: ${l.description}`).join("\n")}

## Projects

${d.projects
  .map((p) => {
    const links = [p.live && `live: ${p.live}`, p.github && `code: ${p.github}`].filter(Boolean).join(", ");
    return `### ${p.title} (${p.period})\n\n${p.description}\n\n- Stack: ${p.technologies.join(", ")}\n${p.highlights.map((h) => `- ${h}`).join("\n")}${links ? `\n- Links: ${links}` : ""}`;
  })
  .join("\n\n")}

## Awards

${d.awards.map((a) => `- ${award(a)}`).join("\n")}
- 300+ LeetCode problems solved; HackerRank Problem Solving (Basic and Intermediate); ChatGPT for Everyone (Learn Prompting)

## Education

${d.education.map((e) => `- ${e.degree}, ${e.fullName}, ${e.period}, ${e.score}`).join("\n")}

## Skills

- Web: ${d.skills.web.map((s) => s.name).join(", ")}
- AI/ML: ${d.skills.aiml.map((s) => s.name).join(", ")}

## Services

${d.services.map((s) => `- ${s.name}: ${s.summary}`).join("\n")}

## Frequently asked questions

${d.faqs.map((f) => `### ${f.question}\n\n${f.answer}`).join("\n\n")}

## Contact

- Website: ${site}/
- Email: ${d.social.email}
- LinkedIn: ${d.social.linkedin}
- GitHub: ${d.social.github}
- Book a call: ${d.social.calendly}

## Blog posts (full text)

${posts.map((p) => `### ${p.title}\n\nURL: ${site}/blog/${p.slug}\nPublished: ${p.date}${p.updated ? ` · Updated: ${p.updated}` : ""}\n\n${p.content}`).join("\n\n---\n\n")}
`;
}
