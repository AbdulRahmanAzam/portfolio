import { GraduationCap, Calendar } from "lucide-react";
import { portfolioData } from "@/lib/schema";

// Server Component. Cards and dots glow as they cross the middle of the
// screen using a CSS view timeline (.edu-glow / .edu-dot-glow in globals.css),
// replacing a scroll listener that re-rendered the section on every frame.
export function Education() {
  return (
    <section id="education" className="py-24 px-4 sm:px-6 lg:px-8 bg-background relative">
      <div className="max-w-4xl mx-auto">
        <div className="reveal text-center mb-16">
          <span className="section-label mb-4 inline-flex">Academic Journey</span>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 mt-4">
            <span className="heading-underline">Education</span>
          </h2>
          <p className="text-lg text-muted-foreground">Academic background and qualifications</p>
        </div>

        <div className="relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border" aria-hidden="true">
            <div className="sticky top-1/2 -translate-y-1/2">
              <div className="relative left-1/2 -translate-x-1/2">
                <div className="glow-blob pointer-events-none absolute -left-6 -right-6 -top-16 -bottom-16 opacity-80" />
                <div className="relative mx-auto h-40 w-px rounded-full bg-primary shadow-[0_0_28px_8px_hsl(var(--primary)/0.55)]" />
              </div>
            </div>
          </div>

          <ol className="space-y-12">
            {portfolioData.education.map((edu, index) => {
              const isLeft = index % 2 === 0;

              return (
                <li key={edu.id} className={`reveal relative flex items-center ${isLeft ? "md:flex-row-reverse" : ""}`}>
                  <div
                    className="edu-dot-glow absolute left-4 md:left-1/2 w-4 h-4 bg-primary rounded-full -translate-x-1/2 ring-4 ring-background z-10"
                    aria-hidden="true"
                  />

                  <div className={`ml-12 md:ml-0 ${isLeft ? "md:pr-12 md:text-right" : "md:pl-12"} md:w-1/2`}>
                    <div className="edu-glow bg-card/80 border border-primary/20 rounded-2xl p-6 glow-hover">
                      <div className={`flex items-center gap-2 mb-3 ${isLeft ? "md:justify-end" : ""}`}>
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <GraduationCap className="w-4 h-4 text-primary" aria-hidden="true" />
                        </div>
                        <span className="flex items-center gap-1.5 font-mono text-sm text-muted-foreground">
                          <Calendar className="w-3 h-3" aria-hidden="true" />
                          {edu.period}
                        </span>
                      </div>

                      <h3 className="text-xl font-semibold mb-1">{edu.institution}</h3>
                      <p className="text-base text-muted-foreground mb-3">{edu.degree}</p>

                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/8 border border-primary/15">
                        <span className="font-mono text-sm font-semibold text-primary">{edu.score}</span>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
