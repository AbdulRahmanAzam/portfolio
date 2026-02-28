"use client";

import { useRef, useEffect, useState } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { portfolioData } from "@/lib/schema";
import { motion, useScroll, useTransform } from "framer-motion";
import { Github, ChevronRight, Layers, Brain, Gamepad2, Globe, ArrowUpRight } from "lucide-react";

const STACK_CONFIG = {
  stickyTopOffset: 220,
  cardSpacing: 46,
  cardContainerHeight: "60vh",
  mobileStickyTopOffset: 150,
  mobileCardSpacing: 20,
  mobileCardContainerHeight: "75vh",
  minScale: 0.8,
  scaleReduction: 0.03,
  minOpacity: 0.7,
  opacityReduction: 0.06,
  parallaxIntensity: 30,
  hoverRotateX: 2,
  hoverRotateY: 4,
  hoverScale: 1.02,
  bottomPadding: "3vh",
};

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  
  return isMobile;
}

const FEATURES = {
  enableParallax: true,
  enableOpacityFade: true,
  enable3DHover: false,
  enableProgressBar: false,
  enableReducedMotion: true,
};

const categoryIcons = {
  "Full Stack": Globe,
  "AI/ML": Brain,
  "Game Dev": Gamepad2,
};

const projectGradients = {
  "university-platform": "from-blue-500 via-purple-500 to-cyan-500",
  "super-tictactoe": "from-emerald-500 via-teal-500 to-green-500",
  "income-predictor": "from-orange-500 via-red-500 to-pink-500",
  "2d-platformer": "from-violet-500 via-purple-500 to-fuchsia-500",
  "ai-tictactoe": "from-cyan-500 via-blue-500 to-indigo-500",
};

function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false);
  
  useEffect(() => {
    if (!FEATURES.enableReducedMotion) return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);
    
    const handler = (e) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);
  
  return reducedMotion;
}

function ScrollProgressBar({ progress, totalProjects }) {
  if (!FEATURES.enableProgressBar) return null;
  
  const height = useTransform(progress, [0, 1], ["0%", "100%"]);
  
  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col items-center gap-3">
      <div className="relative w-1 h-32 bg-muted/50 rounded-full overflow-hidden backdrop-blur-sm">
        <motion.div 
          className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-primary to-primary/50 rounded-full"
          style={{ height }}
        />
      </div>
      <motion.span 
        className="text-xs font-mono text-muted-foreground/70"
        style={{ opacity: useTransform(progress, [0, 0.1], [0, 1]) }}
      >
        {totalProjects}
      </motion.span>
    </div>
  );
}

function StickyProjectCard({ 
  project, 
  index, 
  progress, 
  range, 
  targetScale,
  targetOpacity,
  totalProjects,
  reducedMotion,
  isMobile,
}) {
  const container = useRef(null);
  const isEven = 1;
  const CategoryIcon = categoryIcons[project.category] || Layers;
  const gradient = projectGradients[project.id] || "from-primary via-primary to-primary";

  const scale = useTransform(progress, range, [1, targetScale]);
  const opacityTransform = useTransform(progress, range, [1, targetOpacity]);
  const iconYTransform = useTransform(progress, range, [0, -STACK_CONFIG.parallaxIntensity]);

  const opacity = FEATURES.enableOpacityFade ? opacityTransform : 1;
  const iconY = FEATURES.enableParallax && !reducedMotion && !isMobile ? iconYTransform : 0;

  const topPosition = isMobile 
    ? STACK_CONFIG.mobileStickyTopOffset + (index * STACK_CONFIG.mobileCardSpacing)
    : STACK_CONFIG.stickyTopOffset + (index * STACK_CONFIG.cardSpacing);
  
  const containerHeight = isMobile 
    ? STACK_CONFIG.mobileCardContainerHeight 
    : STACK_CONFIG.cardContainerHeight;

  const hoverAnimation = FEATURES.enable3DHover && !reducedMotion && !isMobile ? {
    whileHover: {
      rotateX: STACK_CONFIG.hoverRotateX,
      rotateY: isEven ? STACK_CONFIG.hoverRotateY : -STACK_CONFIG.hoverRotateY,
      scale: STACK_CONFIG.hoverScale,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  } : {};

  return (
    <div
      ref={container}
      className="sticky flex items-start justify-center"
      style={{ 
        top: `${topPosition}px`,
        height: containerHeight,
        zIndex: index + 1,
      }}
    >
      <motion.div
        style={{
          scale: reducedMotion ? 1 : scale,
          opacity: reducedMotion ? 1 : opacity,
          transformPerspective: 1000,
        }}
        {...hoverAnimation}
        className={`relative origin-top w-full ${isMobile ? 'max-w-md px-3' : 'max-w-6xl px-4 sm:px-6 lg:px-8'} mx-auto pointer-events-auto`}
      >
        <Card className="group relative overflow-hidden rounded-3xl border-0 bg-card shadow-2xl hover:shadow-primary/10 transition-shadow duration-500">
        <div className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
          <div className="relative lg:w-1/2 aspect-[16/9] lg:aspect-auto overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-90`} />
            
            <div className="absolute inset-0">
              <div className="absolute inset-0 opacity-20" 
                style={{
                  backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                  backgroundSize: '24px 24px'
                }}
              />
              
              <div className="absolute top-8 left-8 w-20 h-20 border-2 border-white/20 rounded-xl rotate-12 group-hover:rotate-45 transition-transform duration-700" />
              <div className="absolute bottom-8 right-8 w-16 h-16 border-2 border-white/20 rounded-full group-hover:scale-125 transition-transform duration-700" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-white/10 rounded-2xl -rotate-12 group-hover:rotate-12 transition-transform duration-700" />
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                style={{ y: iconY }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-24 h-24 rounded-2xl bg-white/95 dark:bg-background/95 backdrop-blur-sm flex items-center justify-center shadow-2xl"
              >
                <CategoryIcon className="w-12 h-12 text-primary" />
              </motion.div>
            </div>

            <div className="absolute top-5 left-5">
              <Badge className="bg-white/90 dark:bg-background/90 text-foreground backdrop-blur-sm border-0 shadow-md">
                {project.category}
              </Badge>
            </div>
            <div className="absolute top-5 right-5">
              <span className="px-3 py-1.5 text-xs font-mono bg-white/90 dark:bg-background/90 backdrop-blur-sm rounded-full text-muted-foreground shadow-md">
                {project.period}
              </span>
            </div>

            <div className="absolute bottom-5 left-5">
              <motion.span 
                className="text-6xl font-bold text-white/20"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 0.2, scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 200, delay: index * 0.1 }}
              >
                {String(index + 1).padStart(2, '0')}
              </motion.span>
            </div>
          </div>

          <div className="lg:w-1/2 p-5 sm:p-6 lg:p-10 flex flex-col justify-center">
            <div>
              <h3 className="text-2xl lg:text-3xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">
                {project.title}
              </h3>

              <p className="text-muted-foreground mb-6 leading-relaxed">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {project.technologies.map((tech) => (
                  <Badge 
                    key={tech} 
                    variant="secondary"
                    className="font-mono text-xs tracking-wide"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>

              <div className="space-y-2.5 mb-8">
                {project.highlights.slice(0, 3).map((highlight, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 text-sm text-muted-foreground"
                  >
                    <ChevronRight className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                {project.github && (
                  <Button
                    variant="outline"
                    className="gap-2 group/btn hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
                    asChild
                  >
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="w-4 h-4" />
                      Source Code
                      <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -ml-1 group-hover/btn:opacity-100 group-hover/btn:ml-0 transition-all" />
                    </a>
                  </Button>
                )}
                {project.live && (
                  <Button className="gap-2 group/btn" asChild>
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Globe className="w-4 h-4" />
                      Live Demo
                      <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -ml-1 group-hover/btn:opacity-100 group-hover/btn:ml-0 transition-all" />
                    </a>
                  </Button>
                )}
                {!project.github && !project.live && (
                  <span className="text-sm text-muted-foreground/70 italic px-1">
                    Source code available upon request
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-primary/20 transition-colors duration-500 pointer-events-none" />
      </Card>
      </motion.div>
    </div>
  );
}

export function Projects() {
  const containerRef = useRef(null);
  const projects = portfolioData.projects;
  const reducedMotion = useReducedMotion();
  const isMobile = useIsMobile();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <section
      id="projects"
      ref={containerRef}
      className="relative bg-muted/30"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-primary/5 rounded-full blur-3xl" />
      </div>

      {!isMobile && <ScrollProgressBar progress={scrollYProgress} totalProjects={projects.length} />}

      <div 
        className="sticky top-0 z-20 pt-20 sm:pt-20 lg:pt-20 pb-4 sm:pb-6"
        style={{ 
          background: 'linear-gradient(to bottom, hsl(var(--muted)/0.98) 0%, hsl(var(--muted)/0.9) 60%, transparent 100%)',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center px-4"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-3 lg:mb-4">
            Featured Projects
          </h2>
          <p className="text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
            A selection of my best work in AI/ML and full-stack development
          </p>
        </motion.div>
      </div>

      <div 
        className="relative" 
        style={{ paddingBottom: isMobile ? STACK_CONFIG.mobileBottomPadding : STACK_CONFIG.bottomPadding }}
      >
        {projects.map((project, i) => {
          const targetScale = Math.max(
            STACK_CONFIG.minScale, 
            1 - (projects.length - i - 1) * STACK_CONFIG.scaleReduction
          );
          const targetOpacity = Math.max(
            STACK_CONFIG.minOpacity,
            1 - (projects.length - i - 1) * STACK_CONFIG.opacityReduction
          );
          
          return (
            <StickyProjectCard
              key={project.id}
              project={project}
              index={i}
              progress={scrollYProgress}
              range={[i * (1 / projects.length), 1]}
              targetScale={targetScale}
              targetOpacity={targetOpacity}
              totalProjects={projects.length}
              reducedMotion={reducedMotion}
              isMobile={isMobile}
            />
          );
        })}
      </div>
    </section>
  );
}
