import { ArrowUpRight } from "lucide-react";
import { portfolioData } from "@/lib/schema";

// Résumé-style list: a scannable date column on the left, the role on the
// right, hairline dividers instead of a box per entry. Founder roles get the
// primary colour so they read first. Student society roles follow as a compact
// strip that leads with each role's number.
export function Experience() {
  return (
    <section id="experience" className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/20 relative" aria-labelledby="experience-heading">
      <div className="max-w-6xl mx-auto">
        <span className="section-label mb-4 inline-flex">Experience</span>
        <div className="mt-4 mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 id="experience-heading" className="text-4xl sm:text-5xl font-bold tracking-tight">
            <span className="sr-only">Work experience and leadership: </span>
            Where I&apos;ve worked<span className="text-primary">.</span>
          </h2>
          <p className="max-w-sm text-muted-foreground sm:text-right">
            Two companies founded, an AI/ML internship, remote contract work and a year of teaching.
          </p>
        </div>

        <ol className="border-t border-border/70">
          {portfolioData.experience.map((job) => {
            const current = job.period.endsWith("Present");
            const founder = job.type === "Founder";
            return (
              <li
                key={job.id}
                className="grid gap-2 border-b border-border/70 py-7 sm:grid-cols-[200px_minmax(0,1fr)] sm:gap-8"
              >
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 sm:flex-col sm:items-start">
                  <p className="font-mono text-sm text-muted-foreground">
                    {current && (
                      <span className="mr-2 inline-block h-2 w-2 rounded-full bg-emerald-500 align-middle" aria-hidden="true" />
                    )}
                    {job.period}
                  </p>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      founder ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {job.type}
                  </span>
                </div>

                <div className="max-w-2xl">
                  <h3 className="text-xl font-semibold tracking-tight text-foreground">
                    {job.url ? (
                      <a
                        href={job.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-1 hover:text-primary transition-colors"
                      >
                        {job.organization}
                        <ArrowUpRight
                          className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                          aria-hidden="true"
                        />
                      </a>
                    ) : (
                      job.organization
                    )}
                  </h3>
                  <p className="text-sm font-medium text-primary">{job.role}</p>
                  <p className="mt-3 leading-relaxed text-muted-foreground">{job.description}</p>
                </div>
              </li>
            );
          })}
        </ol>

        <div className="mt-16">
          <h3 className="mb-6 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Student leadership · FAST NUCES Karachi
          </h3>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {portfolioData.leadership.map((role) => (
              <li key={role.id} className="flex flex-col rounded-2xl border border-border/60 bg-card/60 p-6">
                <p className="text-3xl font-bold tracking-tight text-foreground">{role.metric.value}</p>
                <p className="text-xs text-muted-foreground">{role.metric.label}</p>
                <p className="mt-5 font-semibold text-foreground">{role.role}</p>
                <p className="text-sm text-primary">{role.society}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{role.description}</p>
                {role.period && <p className="mt-auto pt-4 font-mono text-xs text-muted-foreground">{role.period}</p>}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
