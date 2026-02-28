"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";
import { Chatbot } from "@/components/Chatbot";

const Skills = dynamic(() => import("@/components/Skills").then(m => ({ default: m.Skills })), { ssr: false });
const Projects = dynamic(() => import("@/components/Projects").then(m => ({ default: m.Projects })), { ssr: false });
const Education = dynamic(() => import("@/components/Education").then(m => ({ default: m.Education })), { ssr: false });
const Achievements = dynamic(() => import("@/components/Achievements").then(m => ({ default: m.Achievements })), { ssr: false });
const Contact = dynamic(() => import("@/components/Contact").then(m => ({ default: m.Contact })), { ssr: false });

function SectionSkeleton({ height = "400px" }) {
  return (
    <div 
      className="w-full bg-muted/20 animate-pulse"
      style={{ minHeight: height }}
      aria-hidden="true"
    />
  );
}

export default function PortfolioClient() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <Hero />
        
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
      <Chatbot />
    </div>
  );
}
