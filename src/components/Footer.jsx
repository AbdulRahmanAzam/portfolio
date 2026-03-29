"use client";

import { Github, Linkedin, Mail, Code2, ArrowUp } from "lucide-react";
import { portfolioData } from "@/lib/schema";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import Link from "next/link";

const socialLinks = [
  { href: portfolioData.social.github, icon: Github, label: "GitHub" },
  { href: portfolioData.social.linkedin, icon: Linkedin, label: "LinkedIn" },
  { href: portfolioData.social.leetcode, icon: Code2, label: "LeetCode" },
  { href: `mailto:${portfolioData.social.email}`, icon: Mail, label: "Email", external: false },
];

export function Footer() {
  const currentYear = new Date().getFullYear();
  const smoothScroll = useSmoothScroll();
  
  return (
    <footer className="relative bg-muted/20 border-t border-border/50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Gradient line at top */}
      <div className="absolute top-0 left-0 right-0 section-divider" />

      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Brand */}
          <div className="text-center md:text-left">
            <p className="font-bold text-lg mb-0.5 gradient-text inline-block">{portfolioData.name}</p>
            <p className="text-sm text-muted-foreground">
              {portfolioData.title}
            </p>
          </div>

          {/* Social links */}
          <div className="flex items-center gap-3">
            {socialLinks.map(({ href, icon: Icon, label, external }) => (
              <a
                key={label}
                href={href}
                target={external !== false ? "_blank" : undefined}
                rel={external !== false ? "noopener noreferrer" : undefined}
                className="group w-10 h-10 rounded-xl bg-card/80 border border-border/50 flex items-center justify-center transition-all duration-300 hover:border-primary/40 hover:bg-primary/10 hover:shadow-md hover:shadow-primary/10 hover:-translate-y-0.5"
                aria-label={label}
              >
                <Icon className="w-4.5 h-4.5 text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
            ))}
          </div>

          {/* Back to top */}
          <button
            onClick={() => smoothScroll(document.getElementById("home"))}
            className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            aria-label="Back to top"
          >
            <span>Back to top</span>
            <ArrowUp className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
          </button>
        </div>

        <div className="mt-8 pt-8 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>&copy; {currentYear} {portfolioData.name}. Crafted with precision.</p>
          <Link href="/blog" className="hover:text-primary transition-colors">
            Blog
          </Link>
        </div>
      </div>
    </footer>
  );
}
