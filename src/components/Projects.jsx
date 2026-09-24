import Image from "next/image";
import { Card } from "./ui/card";
import { buttonVariants } from "./ui/button-variants";
import { cn } from "@/lib/utils";
import { portfolioData } from "@/lib/schema";
import {
  Github,
  Layers,
  Brain,
  Gamepad2,
  Globe,
  ArrowUpRight,
  Rocket,
  Wrench,
  Palette,
} from "lucide-react";

// Server Component. The featured cards stack with position: sticky, and the
// shrink/dim effects are CSS scroll-driven animations (globals.css:
// .project-stack, .project-card-scale, .project-card-dim). No client JS.
const MIN_SCALE = 0.85;
const SCALE_STEP = 0.025;
const MAX_DIM = 0.35;
const DIM_STEP = 0.07;

const categoryIcons = {
  "Full Stack": Globe,
  "AI/ML": Brain,
  "AI Product": Rocket,
  "Game Dev": Gamepad2,
  "Dev Tools": Wrench,
  "Web Design": Palette,
};

const projectGradients = {
  fastverse: "from-emerald-600 via-green-700 to-teal-800",
  fastwheels: "from-indigo-500 via-violet-500 to-yellow-400",
  "sir-jee": "from-orange-400 via-amber-500 to-rose-400",
  civiclens: "from-emerald-500 via-green-600 to-teal-600",
  instyle: "from-stone-400 via-stone-500 to-lime-700",
  "vibe-coding": "from-pink-600 via-rose-600 to-teal-500",
  driftframe: "from-teal-500 via-emerald-600 to-teal-700",
  "token-tracker": "from-green-500 via-emerald-600 to-neutral-900",
  "big-five": "from-sky-500 via-indigo-500 to-purple-600",
  "university-platform": "from-blue-500 via-purple-500 to-cyan-500",
  "super-tictactoe": "from-emerald-500 via-teal-500 to-green-500",
  visionrag: "from-orange-500 via-red-500 to-pink-500",
  "2d-platformer": "from-violet-500 via-purple-500 to-fuchsia-500",
  "ai-tictactoe": "from-cyan-500 via-blue-500 to-indigo-500",
};

function StickyProjectCard({ project, index, totalProjects }) {
  const CategoryIcon = categoryIcons[project.category] || Layers;
  const gradient = projectGradients[project.id] || "from-primary via-primary to-primary";
  const primaryUrl = project.live || project.github;

  // Cards further back in the stack shrink and dim more. Each card starts
  // reacting once the stack has scrolled to its slot.
  const remaining = totalProjects - index - 1;
  const stackVars = {
    "--i": index,
    "--target-scale": Math.max(MIN_SCALE, 1 - remaining * SCALE_STEP),
    "--target-dim": Math.min(MAX_DIM, remaining * DIM_STEP),
    "--scale-start": `${((index / totalProjects) * 100).toFixed(2)}%`,
    // Dim only once the next card begins sliding over this one.
    "--dim-start": `${(Math.min((index + 1) / totalProjects, 0.999) * 100).toFixed(2)}%`,
    zIndex: index + 1,
  };

  return (
    <div className="project-sticky sticky flex items-start justify-center" style={stackVars}>
      <div className="project-card-scale relative w-full max-w-md px-3 lg:max-w-6xl lg:px-8 mx-auto">
        <Card className="group relative overflow-hidden rounded-3xl border-0 bg-card shadow-2xl hover:shadow-primary/10 transition-shadow duration-500">
          {/* content-visibility lets the browser skip laying out cards that are still off screen */}
          <div className="flex flex-col lg:flex-row [content-visibility:auto] [contain-intrinsic-size:auto_640px]">
            {/* Visual: the screenshot fills the whole left half of the card */}
            <div className="relative lg:w-[65%] overflow-hidden aspect-[16/10] lg:aspect-auto lg:min-h-[400px]">
              {project.image ? (
                <>
                  {/* The whole screenshot is shown (contain); a blurred copy of it fills
                      any space left around it, so the panel never looks empty. */}
                  <Image
                    src={project.image}
                    alt=""
                    aria-hidden="true"
                    fill
                    sizes="(min-width: 1024px) 760px, min(92vw, 420px)"
                    className="scale-110 object-cover blur-2xl opacity-70"
                  />
                  <Image
                    src={project.image}
                    alt={`Screenshot of ${project.title}`}
                    fill
                    sizes="(min-width: 1024px) 760px, min(92vw, 420px)"
                    className="object-contain transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                </>
              ) : (
                <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`}>
                  <div className="dots-white absolute inset-0 opacity-20" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 rounded-2xl bg-white/95 dark:bg-background/95 flex items-center justify-center shadow-2xl">
                      <CategoryIcon className="w-12 h-12 text-primary" />
                    </div>
                  </div>
                </div>
              )}

              {project.live && (
                <span className="pointer-events-none absolute bottom-6 right-6 hidden lg:inline-flex items-center gap-1.5 rounded-full bg-background/95 px-3.5 py-1.5 text-xs font-semibold text-foreground shadow-lg opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                  Visit site <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              )}
            </div>

            {/* Content: hook first, proof second, actions last. The long description
                lives in the JSON-LD, llms.txt and chatbot, so the card stays skimmable. */}
            <div className="lg:w-[35%] p-6 sm:p-8 lg:p-8 flex flex-col justify-center">
              <p className="mb-4 flex items-center gap-2 font-mono text-xs text-muted-foreground">
                <span className="text-primary font-semibold">{String(index + 1).padStart(2, "0")}</span>
                <span className="h-px w-6 bg-border" aria-hidden="true" />
                <CategoryIcon className="h-3.5 w-3.5" aria-hidden="true" />
                {project.category} · {project.period}
              </p>

              <h3 className="text-3xl lg:text-4xl font-bold tracking-tight mb-3 group-hover:text-primary transition-colors duration-300">
                {primaryUrl ? (
                  <a
                    href={primaryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="after:absolute after:inset-0 after:z-0 after:content-[''] focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-primary focus-visible:after:rounded-3xl"
                  >
                    {project.title}
                  </a>
                ) : (
                  project.title
                )}
              </h3>

              <p className="text-base lg:text-lg text-muted-foreground leading-relaxed">
                {project.tagline || project.description}
              </p>

              <ul className="tick-list hidden lg:block space-y-2.5 mt-6">
                {project.highlights.slice(0, 3).map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>

              <p className="mt-6 font-mono text-xs text-muted-foreground/80 leading-relaxed">
                {project.technologies.join("  ·  ")}
              </p>

              <div className="relative z-10 mt-6 flex flex-wrap items-center gap-4">
                {project.live && (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(buttonVariants({ size: "sm" }), "gap-2 rounded-full px-4 group/btn")}
                  >
                    Visit live site
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                  </a>
                )}
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Github className="w-4 h-4" />
                    Source code
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-primary/20 transition-colors duration-500 pointer-events-none" />
          {/* Dim with an overlay instead of element opacity so the card stays opaque
              and cards stacked underneath never show through. */}
          <div aria-hidden="true" className="project-card-dim absolute inset-0 z-20 bg-background pointer-events-none opacity-0" />
        </Card>
      </div>
    </div>
  );
}

function MoreProjectCard({ project }) {
  const CategoryIcon = categoryIcons[project.category] || Layers;
  const gradient = projectGradients[project.id] || "from-primary via-primary to-primary";
  const primaryUrl = project.live || project.github;
  // The stretched title link covers the card, so only show a separate
  // source link when it points somewhere different.
  const showSourceLink = project.github && project.github !== primaryUrl;

  return (
    <article
      className="reveal group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/30"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        {project.image ? (
          <Image
            src={project.image}
            alt={`Screenshot of ${project.title}`}
            fill
            sizes="(min-width: 1024px) 300px, (min-width: 640px) 50vw, 100vw"
            className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`}>
            <div className="dots-white absolute inset-0 opacity-20 [background-size:20px_20px]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-14 h-14 rounded-xl bg-white/95 dark:bg-background/95 flex items-center justify-center shadow-xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                <CategoryIcon className="w-7 h-7 text-primary" />
              </div>
            </div>
          </div>
        )}
        <span className="absolute top-3 left-3 rounded-full bg-background/90 px-2.5 py-0.5 text-[11px] font-medium shadow">
          {project.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h4 className="font-semibold leading-snug group-hover:text-primary transition-colors">
            {primaryUrl ? (
              <a
                href={primaryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-primary focus-visible:after:rounded-2xl"
              >
                {project.title}
              </a>
            ) : (
              project.title
            )}
          </h4>
          {primaryUrl && (
            <ArrowUpRight className="h-4 w-4 flex-shrink-0 text-muted-foreground transition-all group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          )}
        </div>
        <span className="font-mono text-[11px] text-muted-foreground mb-2">{project.period}</span>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-3">
          {project.description}
        </p>
        <div className="mt-auto flex items-center gap-2">
          <div className="flex flex-wrap gap-1 min-w-0">
            {project.technologies.slice(0, 3).map((tech) => (
              <span key={tech} className="chip-sm">
                {tech}
              </span>
            ))}
          </div>
          {showSourceLink && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} source code on GitHub`}
              className="relative z-10 ml-auto rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <Github className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export function Projects() {
  const featured = portfolioData.projects.filter((p) => p.featured);
  const more = portfolioData.projects.filter((p) => !p.featured);

  return (
    <section id="projects" className="relative bg-muted/30">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="glow-blob absolute top-1/4 -left-1/4 w-1/2 h-1/2" />
        <div className="glow-blob absolute bottom-1/4 -right-1/4 w-1/2 h-1/2" />
      </div>

      <div className="project-stack relative">
        <div
          className="sticky top-0 z-20 pt-20 pb-4 sm:pb-6"
          style={{
            background:
              "linear-gradient(to bottom, hsl(var(--muted)/0.98) 0%, hsl(var(--muted)/0.9) 60%, transparent 100%)",
          }}
        >
          <div className="text-center px-4">
            <span className="section-label mb-4 inline-flex">Portfolio</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-3 lg:mb-4 mt-4">
              <span className="heading-underline">Featured Projects</span>
            </h2>
            <p className="hidden sm:block text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
              Live products I&apos;ve designed, built and shipped — click any card to try it
            </p>
          </div>
        </div>

        <div className="relative pb-[4vh] lg:pb-[8vh]">
          {featured.map((project, i) => (
            <StickyProjectCard key={project.id} project={project} index={i} totalProjects={featured.length} />
          ))}
        </div>
      </div>

      {more.length > 0 && (
        <div className="section-deferred relative z-30 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-24">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h3 className="text-2xl lg:text-3xl font-bold tracking-tight">More Projects</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Tools, client websites, experiments and university work
              </p>
            </div>
            <a
              href={portfolioData.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              <Github className="h-4 w-4" />
              All repositories
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {more.map((project) => (
              <MoreProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
