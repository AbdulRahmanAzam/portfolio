import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Check, Search, Bot, UserCheck, FileText, Calendar, Mail, ExternalLink } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { portfolioData, getServicesSchema, PROFILE_IMAGE } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "SEO, AEO & GEO Services",
  description:
    "Technical SEO, GEO and AEO by Abdul Rahman Azam: get found on Google and cited by ChatGPT, Gemini, Perplexity and Claude. Fixes shipped in code.",
  path: "/services",
});

const serviceIcons = {
  "technical-seo": Search,
  "geo-aeo": Bot,
  "entity-seo": UserCheck,
  "content-seo": FileText,
};

const site = portfolioData.siteUrl;

// Everything listed here is live on this site and can be checked by anyone.
const caseStudy = [
  {
    title: "One entity, described the same way everywhere",
    detail:
      "Person, Organization, ProfilePage, FAQPage and BlogPosting structured data in a single linked graph, with sameAs links to LinkedIn, GitHub, LeetCode and more.",
    proof: { label: "Test in Google's Rich Results Test", href: `https://search.google.com/test/rich-results?url=${encodeURIComponent(site + "/")}` },
  },
  {
    title: "Open to AI crawlers, with a knowledge file for them",
    detail:
      "robots.txt explicitly welcomes GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot and Google-Extended, and llms.txt gives language models a clean, citable profile.",
    proof: { label: "View llms.txt", href: "/llms.txt" },
  },
  {
    title: "Answer-first content",
    detail:
      "Every key question about me has a short, quotable answer on the page, so an AI assistant can lift it directly.",
    proof: { label: "See the FAQ", href: "/#faq" },
  },
  {
    title: "Clean indexing signals",
    detail:
      "Self-referencing canonicals on every page, a generated XML sitemap with real last-modified dates, an RSS feed, and IndexNow pings to Bing on every deploy.",
    proof: { label: "View sitemap.xml", href: "/sitemap.xml" },
  },
  {
    title: "Social previews and a real face",
    detail:
      "A generated preview image for every page and article, and an optimized headshot wired into the structured data for image and knowledge-panel results.",
    proof: { label: "View preview image", href: "/opengraph-image" },
  },
];

const steps = [
  { step: "Audit", text: "I crawl your site like Googlebot and AI crawlers do and ask the major AI assistants about you or your niche to see where you stand." },
  { step: "Fix", text: "I ship the fixes in code: indexing, speed, structured data, content structure and AI crawler access. You get a pull request, not just a PDF." },
  { step: "Submit", text: "Search Console, Bing Webmaster Tools and IndexNow, so the changes are picked up quickly." },
  { step: "Measure", text: "We re-check rankings, rich results and AI answers for your key questions and adjust." },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-background noise-bg relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getServicesSchema()) }}
      />

      <header className="border-b border-border/50 bg-background/70 backdrop-blur-xl sticky top-0 z-50">
        <nav className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group">
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            Portfolio
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Blog
            </Link>
            <ThemeToggle />
          </div>
        </nav>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <section className="grid gap-10 md:grid-cols-[minmax(0,1fr)_220px] items-center mb-20">
          <div>
            <span className="section-label mb-4 inline-flex">Services</span>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mt-4 mb-6 leading-tight">
              SEO, AEO &amp; GEO services by <span className="gradient-text">{portfolioData.name}</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              I help personal brands, startups and businesses show up on Google and get cited when people ask
              ChatGPT, Gemini, Perplexity or Claude. I&apos;m a {portfolioData.title}, so I fix SEO in the code
              itself, not just in a report.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={portfolioData.social.calendly}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                <Calendar className="h-4 w-4" aria-hidden="true" />
                Book a free 30-min call
              </a>
              <a
                href={`mailto:${portfolioData.social.email}?subject=SEO%20services`}
                className="inline-flex items-center gap-2 rounded-lg border border-border/60 px-5 py-2.5 text-sm font-medium transition-colors hover:border-primary/40 hover:bg-primary/5"
              >
                <Mail className="h-4 w-4 text-primary" aria-hidden="true" />
                Email me
              </a>
            </div>
          </div>
          <Image
            src="/abdul-rahman-azam-square.jpg"
            alt={PROFILE_IMAGE.alt}
            width={220}
            height={220}
            priority
            className="mx-auto rounded-3xl border border-border/60 shadow-xl"
          />
        </section>

        <section aria-labelledby="what-i-do" className="mb-20">
          <h2 id="what-i-do" className="text-3xl font-bold tracking-tight mb-8">What I do</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {portfolioData.services.map((service) => {
              const Icon = serviceIcons[service.id] ?? Search;
              return (
                <article key={service.id} id={service.id} className="rounded-2xl border border-border/50 bg-card/50 p-6 gradient-border">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">{service.summary}</p>
                  <ul className="space-y-2">
                    {service.deliverables.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </section>

        <section aria-labelledby="case-study" className="mb-20">
          <h2 id="case-study" className="text-3xl font-bold tracking-tight mb-3">Case study: this website</h2>
          <p className="text-muted-foreground mb-8 max-w-3xl leading-relaxed">
            The best proof is the site you are on. This is what I did to make &ldquo;{portfolioData.name}&rdquo; resolve
            to one clear person for search engines and AI assistants. Each item links to something you can check yourself.
          </p>
          <ol className="space-y-4">
            {caseStudy.map((item, index) => (
              <li key={item.title} className="flex gap-4 rounded-2xl border border-border/50 bg-card/40 p-5">
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 font-mono text-sm font-bold text-primary">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{item.detail}</p>
                  <a
                    href={item.proof.href}
                    {...(item.proof.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline underline-offset-2"
                  >
                    {item.proof.label}
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="process" className="mb-20">
          <h2 id="process" className="text-3xl font-bold tracking-tight mb-8">How it works</h2>
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((item, index) => (
              <li key={item.step} className="rounded-2xl border border-border/50 bg-card/40 p-5">
                <p className="font-mono text-xs text-primary mb-2">Step {index + 1}</p>
                <h3 className="font-semibold mb-2">{item.step}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="rounded-3xl border border-primary/20 bg-primary/5 p-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">Want the same for your site?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Tell me your site and the questions your customers ask. I&apos;ll show you where you stand on Google and in AI
            answers on a free call.
          </p>
          <a
            href={portfolioData.social.calendly}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Calendar className="h-4 w-4" aria-hidden="true" />
            Book a free call
          </a>
        </section>
      </main>

      <footer className="relative z-10 border-t border-border/50 py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {portfolioData.name}. Karachi, Pakistan.</p>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-primary transition-colors">Portfolio</Link>
            <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
