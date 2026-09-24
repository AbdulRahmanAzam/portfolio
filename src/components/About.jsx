import Image from "next/image";
import Link from "next/link";
import { MapPin, FileText, Linkedin, Search, Rocket, Mic, GraduationCap, ChevronDown } from "lucide-react";
import { portfolioData, PROFILE_IMAGE } from "@/lib/schema";

// Plain markup (no scroll animations) so the bio is readable in the raw HTML
// that search engines and AI crawlers fetch. The skim-first bento carries the
// essentials; the full bio stays in the DOM inside a collapsible <details>.
const stats = [
  { value: "2,500+", label: "students matched on FAST Wheels" },
  { value: "10+", label: "national hackathon wins" },
  { value: "2", label: "AI startups founded" },
];

const now = [
  { icon: Rocket, verb: "Building", what: "FAST Wheels", detail: "AI carpooling on WhatsApp" },
  { icon: Mic, verb: "Teaching", what: "AI Season", detail: "Agents, LangGraph & RAG" },
  { icon: GraduationCap, verb: "Studying", what: "BS AI · FAST NUCES", detail: "Class of 2027" },
];

const story = [
  {
    heading: "What he's built",
    items: [
      ["FastVerse", "3D multiplayer walkthrough of the FAST Karachi campus"],
      ["FAST Wheels", "founded it: AI carpooling on WhatsApp for 2,500+ FAST NUCES students"],
      ["AI Season", "founded it: live bootcamp teaching Pakistani students to build AI agents with LangChain, LangGraph and RAG"],
      ["Sir Jee", "live AI whiteboard tutor for MDCAT and ECAT"],
    ],
  },
  {
    heading: "Experience",
    items: [
      ["REON Energy", "AI/ML intern"],
      ["BoxTech", "backend engineer"],
      ["PROCOM", "led AI competitions"],
      ["ACM-AI", "led machine learning"],
    ],
  },
  {
    heading: "10+ national hackathon wins, including",
    items: [
      ["Iterate '26"],
      ["PROCOM '26 JS Bank Hackathon"],
      ["BWAI Hackathon"],
      ["Teknofest Karachi '26", "AI App Development"],
    ],
  },
  {
    heading: "Education",
    items: [["BS Artificial Intelligence", "FAST NUCES Karachi, 2023–2027"]],
  },
];

const tile ="rounded-3xl border border-border/60 bg-card/60 shadow-sm";

export function About() {
  return (
    <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 bg-background relative" aria-labelledby="about-heading">
      <div className="max-w-6xl mx-auto">
        <span className="section-label mb-4 inline-flex">About</span>
        <h2 id="about-heading" className="text-4xl sm:text-5xl font-bold tracking-tight mt-4 mb-12">
          <span className="sr-only">About {portfolioData.name}: </span>
          The short version<span className="text-primary">.</span>
        </h2>

        <div className="grid gap-4 lg:grid-cols-12">
          {/* Photo */}
          <figure className={`${tile} relative overflow-hidden lg:col-span-4 lg:row-span-3 min-h-[360px]`}>
            <Image
              src="/abdul-rahman-azam.jpg"
              alt={PROFILE_IMAGE.alt}
              fill
              sizes="(min-width: 1024px) 380px, 100vw"
              className="object-cover object-top"
            />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" aria-hidden="true" />
            <figcaption className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
              <span className="font-semibold">{portfolioData.name}</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs backdrop-blur">
                <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                Karachi, PK
              </span>
            </figcaption>
          </figure>

          {/* One-line pitch */}
          <div className={`${tile} p-8 sm:p-10 lg:col-span-8 flex flex-col justify-center`}>
            <p className="font-mono text-xs uppercase tracking-widest text-primary mb-4">{portfolioData.title}</p>
            <p className="text-2xl sm:text-3xl font-semibold leading-snug tracking-tight text-foreground">
              I build AI products <span className="text-primary">end to end</span>, from agents and ML models to
              the apps people actually use.
            </p>
          </div>

          {/* Numbers */}
          <ul className="grid grid-cols-3 gap-4 lg:col-span-8">
            {stats.map(({ value, label }) => (
              <li key={label} className={`${tile} p-5 sm:p-6`}>
                <span className="block text-3xl sm:text-4xl font-bold tracking-tight text-foreground">{value}</span>
                <span className="mt-1 block text-xs sm:text-sm text-muted-foreground leading-snug">{label}</span>
              </li>
            ))}
          </ul>

          {/* Right now */}
          <div className={`${tile} p-6 sm:p-8 lg:col-span-8`}>
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-5">Right now</p>
            <ul className="grid gap-5 sm:grid-cols-3">
              {now.map(({ icon: Icon, verb, what, detail }) => (
                <li key={what} className="flex gap-3">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-xs text-muted-foreground">{verb}</span>
                    <span className="block font-semibold text-foreground">{what}</span>
                    <span className="block text-xs text-muted-foreground">{detail}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <details className="group max-w-2xl">
            <summary className="inline-flex cursor-pointer list-none items-center gap-2 text-sm font-medium text-primary [&::-webkit-details-marker]:hidden">
              Read the full story
              <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" aria-hidden="true" />
            </summary>
            <div className="mt-4 space-y-6 text-muted-foreground leading-relaxed">
              <p className="text-foreground">
                {portfolioData.name} is a Full Stack AI Engineer from Karachi, Pakistan. He builds AI products end to
                end, from agents and machine learning models to the React and Node.js apps people actually use.
              </p>
              {story.map(({ heading, items }) => (
                <div key={heading}>
                  <h3 className="font-mono text-xs uppercase tracking-widest text-primary mb-2">{heading}</h3>
                  <ul className="space-y-1.5">
                    {items.map(([name, detail]) => (
                      <li key={name} className="flex gap-2">
                        <span className="text-primary" aria-hidden="true">→</span>
                        <span>
                          <span className="font-medium text-foreground">{name}</span>
                          {detail && <> · {detail}</>}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <p>
                <Link href="/blog/who-is-abdul-rahman-azam" className="font-medium text-primary hover:underline underline-offset-4">
                  Who is {portfolioData.name}? The full profile →
                </Link>
              </p>
            </div>
          </details>

          <div className="flex flex-wrap gap-3 sm:justify-end">
            <a
              href="/Abdul_Rahman_Azam__Resume.pdf"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              <FileText className="h-4 w-4" aria-hidden="true" />
              Resume
            </a>
            <a
              href={portfolioData.social.linkedin}
              target="_blank"
              rel="noopener noreferrer me"
              className="inline-flex items-center gap-2 rounded-lg border border-border/60 px-5 py-2.5 text-sm font-medium transition-colors hover:border-primary/40 hover:bg-primary/5"
            >
              <Linkedin className="h-4 w-4 text-primary" aria-hidden="true" />
              LinkedIn
            </a>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 rounded-lg border border-border/60 px-5 py-2.5 text-sm font-medium transition-colors hover:border-primary/40 hover:bg-primary/5"
            >
              <Search className="h-4 w-4 text-primary" aria-hidden="true" />
              SEO &amp; AI search
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
