"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, FileText, ArrowUpRight } from "lucide-react";
import { ThemeToggle } from "./ui/ThemeToggle";
import { buttonVariants } from "./ui/button-variants";
import { cn } from "@/lib/utils";
import { portfolioData } from "@/lib/schema";

// Career-first: four destinations a recruiter or client actually looks for.
// Home is the logo, Contact is the CTA; Skills, Education, Awards and FAQ are
// one scroll away and linked from the footer.
const navItems = [
  { id: "projects", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "about", label: "About" },
];

const RESUME = "/Abdul_Rahman_Azam__Resume.pdf";

export function Navigation() {
  const [activeSection, setActiveSection] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Header background: one cheap scroll read, no layout work.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Active link: IntersectionObserver instead of measuring every section on every scroll.
  // Sections that aren't in the nav clear the highlight so it never points at the wrong place.
  useEffect(() => {
    const ids = ["home", "about", "skills", "projects", "experience", "education", "achievements", "faq", "contact"];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        }
      },
      // A thin band just below the header counts as "current section".
      { rootMargin: "-100px 0px -60% 0px" }
    );
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${
        scrolled || mobileMenuOpen
          ? "bg-background/90 supports-[backdrop-filter]:bg-background/70 supports-[backdrop-filter]:backdrop-blur-xl border-b border-border/50 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Main">
        <div className="flex items-center justify-between h-16 gap-4">
          <a href="#home" onClick={closeMenu} className="group flex items-center gap-2.5">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-sm font-extrabold text-primary-foreground shadow-sm transition-transform duration-300 group-hover:-rotate-6">
              AR
            </span>
            <span className="leading-tight">
              <span className="block text-sm font-bold tracking-tight">{portfolioData.name}</span>
              <span className="hidden sm:block text-[11px] text-muted-foreground">{portfolioData.title}</span>
            </span>
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-7">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                aria-current={activeSection === item.id ? "true" : undefined}
                className={`relative py-1 text-sm font-medium transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-primary after:transition-transform after:duration-300 ${
                  activeSection === item.id
                    ? "text-foreground after:scale-x-100"
                    : "text-muted-foreground hover:text-foreground after:scale-x-0"
                }`}
              >
                {item.label}
              </a>
            ))}
            <Link
              href="/blog"
              className="py-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Blog
            </Link>
          </div>

          <div className="flex items-center gap-1.5">
            <a
              href={RESUME}
              target="_blank"
              rel="noopener"
              aria-label="Resume (PDF)"
              title="Resume (PDF)"
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "hidden md:inline-flex w-9 h-9 p-0")}
            >
              <FileText className="w-4 h-4" aria-hidden="true" />
            </a>
            <ThemeToggle />
            <a
              href="#contact"
              className={cn(buttonVariants({ size: "sm" }), "hidden md:inline-flex ml-1.5 gap-1.5 rounded-full px-4")}
            >
              Let&apos;s talk
              <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
            </a>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "md:hidden relative w-9 h-9 p-0")}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div id="mobile-menu" className="pop-in md:hidden border-t border-border/50">
            <div className="py-4 flex flex-col gap-1">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={closeMenu}
                  className={`px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                    activeSection === item.id
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/80 hover:bg-muted/50"
                  }`}
                >
                  {item.label}
                </a>
              ))}
              <Link
                href="/blog"
                onClick={closeMenu}
                className="px-4 py-3 rounded-lg text-base font-medium text-foreground/80 hover:bg-muted/50 transition-colors"
              >
                Blog
              </Link>
              <div className="mt-3 grid grid-cols-2 gap-2 px-1">
                <a
                  href={RESUME}
                  target="_blank"
                  rel="noopener"
                  onClick={closeMenu}
                  className={cn(buttonVariants({ variant: "outline" }), "gap-2")}
                >
                  <FileText className="w-4 h-4" aria-hidden="true" />
                  Resume
                </a>
                <a href="#contact" onClick={closeMenu} className={cn(buttonVariants(), "gap-1.5")}>
                  Let&apos;s talk
                  <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
