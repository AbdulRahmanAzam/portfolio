import { lazy, Suspense } from "react";
import { Navigation } from "../components/Navigation";
import { Hero } from "../components/Hero";
import { Footer } from "../components/Footer";
import { Chatbot } from "../components/Chatbot";

// Lazy load heavy components for better LCP
const Skills = lazy(() => import("../components/Skills").then(m => ({ default: m.Skills })));
const Projects = lazy(() => import("../components/Projects").then(m => ({ default: m.Projects })));
const Education = lazy(() => import("../components/Education").then(m => ({ default: m.Education })));
const Achievements = lazy(() => import("../components/Achievements").then(m => ({ default: m.Achievements })));
const Contact = lazy(() => import("../components/Contact").then(m => ({ default: m.Contact })));

// Section loading placeholder - prevents CLS
function SectionSkeleton({ height = "400px" }) {
  return (
    <div 
      className="w-full bg-muted/20 animate-pulse"
      style={{ minHeight: height }}
      aria-hidden="true"
    />
  );
}

export default function Portfolio() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        {/* Hero loads immediately - critical for LCP */}
        <Hero />
        
        {/* Below-the-fold sections lazy loaded */}
        <Suspense fallback={<SectionSkeleton height="600px" />}>
          <Skills />
        </Suspense>
        
        <Suspense fallback={<SectionSkeleton height="800px" />}>
          <Projects />
        </Suspense>
        
        <Suspense fallback={<SectionSkeleton height="500px" />}>
          <Education />
        </Suspense>
        
        <Suspense fallback={<SectionSkeleton height="400px" />}>
          <Achievements />
        </Suspense>

        <Suspense fallback={<SectionSkeleton height="400px" />}>
          <Contact />
        </Suspense>
      </main>
      <Footer />
      
      {/* AI Chatbot - auto opens after 10 seconds */}
      <Chatbot />
    </div>
  );
}
