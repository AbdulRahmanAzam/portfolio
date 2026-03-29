"use client";

import { lazy, Suspense, useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { ChevronDown, ArrowRight, Sparkles, Mail, Linkedin, Github, Code2 } from "lucide-react";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { portfolioData } from "@/lib/schema";

const NeuralNetworkBackground = lazy(() => 
  import("./NeuralNetworkBackground").then(m => ({ default: m.NeuralNetworkBackground }))
);

// Text scramble/decode effect
function useTextScramble(text, { speed = 30, delay = 0 } = {}) {
  const [display, setDisplay] = useState("");
  const chars = "!<>-_\\/[]{}—=+*^?#_abcdefghijklmnopqrstuvwxyz";

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isSmallViewport = typeof window !== "undefined" && window.innerWidth < 768;

    if (prefersReducedMotion || isSmallViewport) {
      setDisplay(text);
      return;
    }

    let timeout;
    let frame = 0;
    const len = text.length;

    timeout = setTimeout(() => {
      const interval = setInterval(() => {
        let output = "";
        for (let i = 0; i < len; i++) {
          if (i < frame) {
            output += text[i];
          } else if (i === frame) {
            output += chars[Math.floor(Math.random() * chars.length)];
          } else {
            output += chars[Math.floor(Math.random() * chars.length)];
          }
        }
        setDisplay(output);
        frame++;
        if (frame > len + 2) {
          setDisplay(text);
          clearInterval(interval);
        }
      }, speed);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [text, speed, delay]);

  return display;
}

// Staggered word reveal animation variants
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.3 },
  },
};

const wordVariants = {
  hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

// Floating status badge
function StatusBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.2, duration: 0.5, type: "spring" }}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/8 border border-primary/15 backdrop-blur-md mb-8"
    >
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/60" />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
      </span>
      <span className="text-sm font-medium text-primary tracking-wide">
        Open to AI/ML Opportunities
      </span>
    </motion.div>
  );
}

function HomeContactLinks() {
  const items = [
    {
      label: "Email",
      href: `mailto:${portfolioData.social.email}`,
      icon: Mail,
      external: false,
    },
    {
      label: "LinkedIn",
      href: portfolioData.social.linkedin,
      icon: Linkedin,
      external: true,
    },
    {
      label: "GitHub",
      href: portfolioData.social.github,
      icon: Github,
      external: true,
    },
    {
      label: "LeetCode",
      href: portfolioData.social.leetcode,
      icon: Code2,
      external: true,
    },
  ];

  return (
    <motion.div
      className="mt-7 flex flex-wrap items-center justify-center gap-2 sm:gap-3"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.15, duration: 0.5 }}
    >
      {items.map(({ label, href, icon: Icon, external }) => (
        <a
          key={label}
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          aria-label={label}
          title={label}
          className="group inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-card/40 text-muted-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/10 hover:text-foreground"
        >
          <Icon className="h-4 w-4 text-primary/90" />
        </a>
      ))}
    </motion.div>
  );
}

export function Hero() {
  const smoothScroll = useSmoothScroll();
  const [showBackground, setShowBackground] = useState(false);
  const scrambledTitle = useTextScramble(portfolioData.title, { speed: 25, delay: 800 });

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isDesktop = window.innerWidth >= 1024;
    const shouldShow = !prefersReducedMotion && isDesktop;

    const timer = setTimeout(() => setShowBackground(shouldShow), 250);
    return () => clearTimeout(timer);
  }, []);

  const scrollToSkills = () => {
    const element = document.getElementById("skills");
    smoothScroll(element);
  };

  const taglineWords = portfolioData.tagline.split(" ");

  return (
    <section 
      id="home" 
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background noise-bg"
    >
      {showBackground && (
        <Suspense fallback={null}>
          <NeuralNetworkBackground className="opacity-30" />
        </Suspense>
      )}

      {/* Radial gradient overlays */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/3 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/3 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Status badge */}
        <StatusBadge />
        
        {/* Name with gradient & reveal */}
        <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold tracking-tight mb-5">
          <span className="gradient-text">{portfolioData.name}</span>
        </h1>
        
        {/* Title with scramble effect */}
        <motion.p 
          className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-primary/90 mb-6 font-mono tracking-tight"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {scrambledTitle}
        </motion.p>
        
        {/* Tagline with word-by-word reveal */}
        <motion.p 
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {taglineWords.map((word, i) => (
            <motion.span key={i} variants={wordVariants} className="inline-block mr-[0.3em]">
              {word}
            </motion.span>
          ))}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div 
          className="flex flex-wrap items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.5 }}
        >
          <Button 
            size="lg"
            onClick={() => smoothScroll(document.getElementById("projects"))}
            className="group relative overflow-hidden px-6 h-12 text-sm"
          >
            <span className="relative z-10 flex items-center gap-2">
              View Projects
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Button>
          <Button 
            size="lg"
            variant="outline"
            onClick={() => smoothScroll(document.getElementById("contact"))}
            className="group px-6 h-12 text-sm border-primary/30 hover:border-primary/60 hover:bg-primary/5"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Free Call Session
            </span>
          </Button>
        </motion.div>

        <HomeContactLinks />
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={scrollToSkills}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 p-2 rounded-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        aria-label="Scroll to skills section"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-7 h-7 text-muted-foreground/60" />
        </motion.div>
      </motion.button>
    </section>
  );
}
