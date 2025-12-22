import { useEffect, useRef, useState } from "react";
import { portfolioData } from "@shared/schema";
import { GraduationCap } from "lucide-react";
import { motion } from "framer-motion";

export function Education() {
  const sectionRef = useRef(null);
  const dotRefs = useRef(new Map());
  const [glow, setGlow] = useState({});

  // Measure distance for glow effect
  useEffect(() => {
    let raf = 0;
    const radius = 160;
    
    const update = () => {
      const centerY = window.innerHeight / 2;
      const next = {};
      portfolioData.education.forEach((edu) => {
        const el = dotRefs.current.get(edu.id);
        if (!el) return;
        const r = el.getBoundingClientRect();
        const dotY = r.top + r.height / 2;
        const d = Math.abs(dotY - centerY);
        const g = Math.max(0, Math.min(1, 1 - d / radius));
        next[edu.id] = g;
      });
      setGlow(next);
      raf = 0;
    };
    
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(update);
    };
    
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section 
      id="education" 
      ref={sectionRef}
      className="py-20 px-4 sm:px-6 lg:px-8 bg-background"
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight mb-4">
            Education
          </h2>
          <p className="text-lg text-muted-foreground">
            Academic background and qualifications
          </p>
        </div>

        <div className="relative">
          {/* Timeline line with glowing segment */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border">
            <div className="sticky top-1/2 -translate-y-1/2">
              <div className="relative left-1/2 -translate-x-1/2">
                <div className="pointer-events-none absolute -left-4 -right-4 -top-16 -bottom-16 rounded-full bg-primary/25 blur-xl" />
                <div className="relative mx-auto h-40 w-px rounded-full bg-primary shadow-[0_0_28px_8px_hsl(var(--primary)/0.55)]" />
              </div>
            </div>
          </div>

          <div className="space-y-12">
            {portfolioData.education.map((edu, index) => {
              const isLeft = index % 2 === 0;
              
              return (
                <motion.div 
                  key={edu.id}
                  className={`relative flex items-center ${isLeft ? "md:flex-row-reverse" : ""}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, delay: index * 0.12, ease: "easeOut" }}
                >
                  {/* Timeline dot */}
                  <div
                    ref={(el) => {
                      if (el) dotRefs.current.set(edu.id, el);
                    }}
                    className="absolute left-4 md:left-1/2 w-3 h-3 bg-primary rounded-full -translate-x-1/2 ring-4 ring-background z-10"
                  />

                  {/* Content */}
                  <div className={`ml-12 md:ml-0 ${isLeft ? "md:pr-12 md:text-right" : "md:pl-12"} md:w-1/2`}>
                    {(() => {
                      const g = glow[edu.id] ?? 0;
                      const boxShadow = g > 0
                        ? `0 0 ${24 + g * 24}px ${-8 + g * 4}px hsl(var(--primary) / ${0.25 + 0.35 * g})`
                        : undefined;
                      const borderColor = `hsl(var(--primary) / ${0.18 + 0.32 * g})`;
                      const opacity = 0.92 + 0.08 * g;
                      const transform = g > 0 ? `translateZ(0) scale(${1 + g * 0.01})` : undefined;
                      
                      return (
                        <div
                          className="bg-card border rounded-xl p-6 hover-elevate"
                          style={{
                            borderColor,
                            boxShadow,
                            opacity,
                            transform,
                            transition: "box-shadow 180ms ease, border-color 180ms ease, opacity 180ms ease, transform 180ms ease",
                          }}
                        >
                          <div className="flex items-center gap-2 mb-3 md:justify-end">
                            <GraduationCap className="w-5 h-5 text-primary" />
                            <span className="font-mono text-sm text-muted-foreground">{edu.period}</span>
                          </div>
                          
                          <h3 className="text-xl font-semibold mb-1">
                            {edu.institution}
                          </h3>
                          
                          <p className="text-base text-muted-foreground mb-2">
                            {edu.degree}
                          </p>
                          
                          <p className="font-mono text-sm font-medium text-primary">
                            {edu.score}
                          </p>
                        </div>
                      );
                    })()}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
