"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { ThemeToggle } from "./ui/ThemeToggle";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { portfolioData } from "@/lib/schema";
import { Menu, X, Download, Newspaper } from "lucide-react";
import Link from "next/link";

const navItems = [
  { id: "home", label: "Home" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "education", label: "Education" },
  { id: "achievements", label: "Achievements" },
  { id: "contact", label: "Contact" },
];

export function Navigation() {
  const [activeSection, setActiveSection] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const smoothScroll = useSmoothScroll();
  const navRefs = useRef(new Map());

  const handleDownloadResume = () => {
    const link = document.createElement("a");
    link.href = "/Abdul_Rahman_Azam__Resume.pdf";
    link.download = "Abdul_Rahman_Azam_Resume.pdf";
    link.setAttribute("target", "_blank");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      for (const item of navItems) {
        const element = document.getElementById(item.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = useCallback((sectionId) => {
    const element = document.getElementById(sectionId);
    smoothScroll(element);
    setMobileMenuOpen(false);
  }, [smoothScroll]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? "bg-background/70 backdrop-blur-xl border-b border-border/50 shadow-sm" 
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => scrollToSection("home")}
            className="flex items-center gap-2.5 text-xl font-bold tracking-tight px-3 py-2 rounded-lg transition-colors group"
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-sm font-extrabold text-primary shadow-sm transition-all duration-300 group-hover:bg-primary/20 group-hover:border-primary/50 group-hover:shadow-primary/20 group-hover:shadow-md">
              AR
            </span>
            <span className="hidden sm:inline">{portfolioData.name}</span>
          </button>

          {/* Desktop nav with sliding indicator */}
          <div className="hidden md:flex items-center gap-1 relative bg-muted/40 rounded-full px-1.5 py-1.5 backdrop-blur-sm border border-border/30">
            {navItems.map((item) => (
              <button
                key={item.id}
                ref={(el) => { if (el) navRefs.current.set(item.id, el); }}
                onClick={() => scrollToSection(item.id)}
                className={`relative z-10 px-3.5 py-1.5 text-sm font-medium rounded-full transition-colors duration-200 ${
                  activeSection === item.id 
                    ? "text-primary-foreground" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {activeSection === item.id && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-primary rounded-full shadow-sm"
                    style={{ zIndex: -1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                {item.label}
              </button>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <Link
              href="/blog"
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground rounded-full transition-colors"
            >
              <Newspaper className="w-3.5 h-3.5" />
              Blog
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadResume}
              className="hidden md:inline-flex gap-2 border-primary/30 text-primary/90 bg-primary/5 hover:bg-primary/10 hover:text-primary hover:border-primary/50 shadow-sm transition-all duration-300"
            >
              <Download className="w-3.5 h-3.5" />
              Resume
            </Button>
            <ThemeToggle />
            
            {/* Mobile menu toggle */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
                className="relative w-9 h-9 p-0"
              >
                <AnimatePresence mode="wait">
                  {mobileMenuOpen ? (
                    <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <X className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <Menu className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu with slide animation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="md:hidden overflow-hidden border-t border-border/50"
            >
              <div className="py-4 flex flex-col gap-1">
                {navItems.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                  >
                    <button
                      onClick={() => scrollToSection(item.id)}
                      className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        activeSection === item.id 
                          ? "bg-primary/10 text-primary" 
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      }`}
                    >
                      {item.label}
                    </button>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: navItems.length * 0.05, duration: 0.3 }}
                >
                  <Link
                    href="/blog"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 flex items-center gap-2 transition-colors"
                  >
                    <Newspaper className="w-4 h-4" />
                    Blog
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
