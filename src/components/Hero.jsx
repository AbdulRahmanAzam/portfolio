import { ChevronDown, ArrowRight, Sparkles, Mail, Linkedin, Github, Code2 } from "lucide-react";
import { buttonVariants } from "./ui/button-variants";
import { cn } from "@/lib/utils";
import { portfolioData } from "@/lib/schema";
import { ScrambleText } from "./hero/ScrambleText";
import { HeroBackground } from "./hero/HeroBackground";

// Server Component: the name, title and tagline are in the HTML and paint
// immediately. Entrance effects are CSS animations (see globals.css), so
// nothing waits for JavaScript.

const contactLinks = [
  { label: "Email", href: `mailto:${portfolioData.social.email}`, icon: Mail, external: false },
  { label: "LinkedIn", href: portfolioData.social.linkedin, icon: Linkedin, external: true },
  { label: "GitHub", href: portfolioData.social.github, icon: Github, external: true },
  { label: "LeetCode", href: portfolioData.social.leetcode, icon: Code2, external: true },
];

export function Hero() {
  const taglineWords = portfolioData.tagline.split(" ");

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background noise-bg"
    >
      <HeroBackground />

      {/* Radial glow overlays */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="glow-blob absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] max-w-[200vw] h-[700px]" />
        <div className="glow-blob absolute -bottom-24 -left-24 w-[500px] h-[500px] opacity-60" />
        <div className="glow-blob absolute -bottom-24 -right-24 w-[500px] h-[500px] opacity-60" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div
          className="hero-in inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/8 border border-primary/15 mb-8"
          style={{ "--delay": "0.9s" }}
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/60" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
          </span>
          <span className="text-sm font-medium text-primary tracking-wide">
            Open to AI/ML Opportunities
          </span>
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold tracking-tight mb-5">
          <span className="gradient-text">{portfolioData.name}</span>
        </h1>

        <p
          className="hero-in text-2xl sm:text-3xl lg:text-4xl font-semibold text-primary/90 mb-6 font-mono tracking-tight"
          style={{ "--delay": "0.2s" }}
        >
          <ScrambleText text={portfolioData.title} />
        </p>

        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          {taglineWords.map((word, i) => (
            <span
              key={i}
              className="hero-word inline-block mr-[0.3em]"
              style={{ "--delay": `${0.3 + i * 0.08}s` }}
            >
              {word}
            </span>
          ))}
        </p>

        <div
          className="hero-in flex flex-wrap items-center justify-center gap-4"
          style={{ "--delay": "0.8s" }}
        >
          <a
            href="#projects"
            className={cn(buttonVariants({ size: "lg" }), "group relative overflow-hidden px-6 h-12 text-sm")}
          >
            View Projects
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </a>
          <a
            href="#contact"
            className={cn(
              buttonVariants({ size: "lg", variant: "outline" }),
              "group px-6 h-12 text-sm border-primary/30 hover:border-primary/60 hover:bg-primary/5"
            )}
          >
            <Sparkles className="w-4 h-4 text-primary" aria-hidden="true" />
            Free Call Session
          </a>
        </div>

        <div
          className="hero-in mt-7 flex flex-wrap items-center justify-center gap-2 sm:gap-3"
          style={{ "--delay": "1s" }}
        >
          {contactLinks.map(({ label, href, icon: Icon, external }) => (
            <a
              key={label}
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer me" : undefined}
              aria-label={label}
              title={label}
              className="group inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-card/40 text-muted-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/10 hover:text-foreground"
            >
              <Icon className="h-4 w-4 text-primary/90" aria-hidden="true" />
            </a>
          ))}
        </div>
      </div>

      {/* hero-in animates transform, so it sits on an inner span to keep the -translate-x-1/2 centering */}
      <a
        href="#about"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 p-2 rounded-full"
        aria-label="Scroll to the About section"
      >
        <span className="hero-in block" style={{ "--delay": "1.3s" }}>
          <ChevronDown className="nudge-down w-7 h-7 text-muted-foreground/60" aria-hidden="true" />
        </span>
      </a>
    </section>
  );
}
