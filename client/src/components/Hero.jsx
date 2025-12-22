import { lazy, Suspense, useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { ChevronDown } from "lucide-react";
import { useSmoothScroll } from "../hooks/useSmoothScroll";
import { portfolioData } from "@shared/schema";

// Lazy load 3D background - not critical for LCP
const NeuralNetworkBackground = lazy(() => 
  import("./NeuralNetworkBackground").then(m => ({ default: m.NeuralNetworkBackground }))
);

export function Hero() {
  const smoothScroll = useSmoothScroll();
  const [showBackground, setShowBackground] = useState(false);

  // Delay loading 3D background until after critical content renders
  useEffect(() => {
    const timer = setTimeout(() => setShowBackground(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const scrollToSkills = () => {
    const element = document.getElementById("skills");
    smoothScroll(element);
  };

  return (
    <section 
      id="home" 
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background"
    >
      {/* 3D Background - Lazy loaded after critical content */}
      {showBackground && (
        <Suspense fallback={null}>
          <NeuralNetworkBackground className="opacity-40" />
        </Suspense>
      )}

      {/* Critical Content - Renders immediately for LCP */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-fade-in-up">
          {/* Name - Most important for SEO and LCP */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-4">
            {portfolioData.name}
          </h1>
          
          {/* Title */}
          <p className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-primary mb-4">
            {portfolioData.title}
          </p>
          
          {/* Tagline */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            {portfolioData.tagline}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button 
              size="lg"
              onClick={() => smoothScroll(document.getElementById("projects"))}
            >
              View Projects
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => smoothScroll(document.getElementById("contact"))}
            >
              Free Call Session
            </Button>
          </div>
        </div>

        {/* Scroll indicator */}
        <button
          onClick={scrollToSkills}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hover-elevate active-elevate-2 p-2 rounded-full"
          aria-label="Scroll to skills section"
        >
          <ChevronDown className="w-8 h-8 text-primary" />
        </button>
      </div>
    </section>
  );
}
