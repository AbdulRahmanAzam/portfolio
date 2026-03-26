"use client";

import { useEffect, useRef, useState, lazy, Suspense } from "react";
import { Card } from "./ui/card";
import { motion, useReducedMotion } from "framer-motion";
import { portfolioData } from "@/lib/schema";
import { Code2, Brain } from "lucide-react";

const AIShowcase = lazy(() => import("./AIShowcase"));

export function Skills() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const SkillPill = ({ label, index }) => {
    const reduce = useReducedMotion();
    return (
      <motion.span
        initial={{ y: 12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.03 * index, type: "spring", stiffness: 220, damping: 22 }}
        whileHover={reduce ? {} : { scale: 1.06, y: -2 }}
        whileTap={reduce ? {} : { scale: 0.98 }}
        className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/80 backdrop-blur-sm px-3.5 py-1.5 text-sm shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300"
      >
        <span className="size-1.5 rounded-full bg-primary animate-pulse" />
        <span className="font-medium leading-none">{label}</span>
      </motion.span>
    );
  };

  const FloatingRow = ({ items }) => {
    const reduce = useReducedMotion();
    return (
      <div className="flex flex-wrap gap-2.5">
        {items.map((t, i) => (
          <motion.div
            key={t}
            animate={reduce ? {} : { y: [0, -6, 0] }}
            transition={reduce ? {} : { duration: 2 + (i % 5) * 0.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <SkillPill label={t} index={i} />
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <section 
      id="skills" 
      ref={sectionRef}
      className="py-24 px-4 sm:px-6 lg:px-8 bg-background relative"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-label mb-4 inline-flex">Skills & Expertise</span>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 mt-4">
            <span className="heading-underline">What I Work With</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Specialized in AI/ML with strong full-stack development capabilities
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="p-8 h-full gradient-border glow-hover rounded-2xl">
              <div className="mb-6 flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Code2 className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-1">
                    Web Development
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Full-stack tools and libraries I use daily
                  </p>
                </div>
              </div>
              <FloatingRow items={portfolioData.skills.web.map(s => s.name)} />
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="p-8 h-full gradient-border glow-hover rounded-2xl">
              <div className="mb-6 flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-1">
                    AI/ML & Data Science
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    ML/DL ecosystems, data tooling, and workflows
                  </p>
                </div>
              </div>
              <FloatingRow items={portfolioData.skills.aiml.map(s => s.name)} />
            </Card>
          </motion.div>
        </div>

        <motion.div 
          className="mt-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Suspense fallback={
            <div className="h-64 bg-muted/20 rounded-xl animate-pulse" />
          }>
            <AIShowcase />
          </Suspense>
        </motion.div>
      </div>
    </section>
  );
}
