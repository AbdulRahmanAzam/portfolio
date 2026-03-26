"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";

const Skills = dynamic(() => import("@/components/Skills").then(m => ({ default: m.Skills })), { ssr: false });
const Projects = dynamic(() => import("@/components/Projects").then(m => ({ default: m.Projects })), { ssr: false });
const Education = dynamic(() => import("@/components/Education").then(m => ({ default: m.Education })), { ssr: false });
const Achievements = dynamic(() => import("@/components/Achievements").then(m => ({ default: m.Achievements })), { ssr: false });
const Contact = dynamic(() => import("@/components/Contact").then(m => ({ default: m.Contact })), { ssr: false });
const Chatbot = dynamic(() => import("@/components/Chatbot").then(m => ({ default: m.Chatbot })), { ssr: false });

function SectionSkeleton({ height = "400px" }) {
  return (
    <div 
      className="w-full bg-muted/20 animate-pulse"
      style={{ minHeight: height }}
      aria-hidden="true"
    />
  );
}

function SectionDivider() {
  return <div className="section-divider" aria-hidden="true" />;
}

export default function PortfolioClient() {
  const [showChatbot, setShowChatbot] = useState(false);

  useEffect(() => {
    let timeoutId;
    let idleId;
    const activateChatbot = () => setShowChatbot(true);

    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      idleId = window.requestIdleCallback(activateChatbot, { timeout: 5000 });
    } else {
      timeoutId = setTimeout(activateChatbot, 5000);
    }

    return () => {
      if (typeof window !== "undefined" && idleId && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <Hero />
        
        <SectionDivider />
        <Suspense fallback={<SectionSkeleton height="600px" />}>
          <Skills />
        </Suspense>
        
        <SectionDivider />
        <Suspense fallback={<SectionSkeleton height="800px" />}>
          <Projects />
        </Suspense>
        
        <SectionDivider />
        <Suspense fallback={<SectionSkeleton height="500px" />}>
          <Education />
        </Suspense>
        
        <SectionDivider />
        <Suspense fallback={<SectionSkeleton height="400px" />}>
          <Achievements />
        </Suspense>

        <SectionDivider />
        <Suspense fallback={<SectionSkeleton height="400px" />}>
          <Contact />
        </Suspense>
      </main>
      <Footer />
      {showChatbot ? <Chatbot /> : null}
    </div>
  );
}
