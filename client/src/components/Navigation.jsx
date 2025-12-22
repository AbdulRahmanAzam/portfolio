import { useState, useEffect, useCallback } from "react";
import { Button } from "./ui/button";
import { ThemeToggle } from "./ui/ThemeToggle";
import { useSmoothScroll } from "../hooks/useSmoothScroll";
import { portfolioData } from "@shared/schema";

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

      // Update active section based on scroll position
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/80 backdrop-blur-lg border-b border-border" : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Name */}
          <button
            onClick={() => scrollToSection("home")}
            className="flex items-center gap-2  text-xl font-bold tracking-tight hover-elevate active-elevate-2 px-3 py-2 rounded-md transition-colors"
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-sm font-extrabold text-primary shadow-sm shadow-primary/15">
              AR
            </span>
            <span>{portfolioData.name}</span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                onClick={() => scrollToSection(item.id)}
                className={`transition-colors ${
                  activeSection === item.id ? "bg-accent text-accent-foreground" : ""
                }`}
              >
                {item.label}
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadResume}
              className="hidden md:inline-flex border-primary/50 text-primary/90 bg-primary/5 hover:bg-primary/10 hover:text-primary shadow-sm"
            >
              Resume
            </Button>
            <ThemeToggle />
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? "✕" : "☰"}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => scrollToSection(item.id)}
                  className={`justify-start ${
                    activeSection === item.id ? "bg-accent text-accent-foreground" : ""
                  }`}
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
