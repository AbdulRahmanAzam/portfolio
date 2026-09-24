import { Code2, Brain } from "lucide-react";
import { Card } from "./ui/card";
import { portfolioData } from "@/lib/schema";
import AIShowcase from "./AIShowcase";

// Server Component. Pills float with a CSS animation (desktop only) and the
// cards fade in with a scroll-driven CSS animation; no client JS.

function SkillRow({ items }) {
  return (
    <ul className="flex flex-wrap gap-2.5">
      {items.map((label, i) => (
        <li key={label} className="float-y" style={{ "--float-duration": `${2 + (i % 5) * 0.5}s` }}>
          <span className="skill-pill">{label}</span>
        </li>
      ))}
    </ul>
  );
}

function SkillCard({ icon: Icon, title, subtitle, items }) {
  return (
    <Card className="reveal p-8 h-full gradient-border glow-hover rounded-2xl">
      <div className="mb-6 flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Icon className="w-6 h-6 text-primary" aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-2xl font-semibold mb-1">{title}</h3>
          <p className="text-muted-foreground text-sm">{subtitle}</p>
        </div>
      </div>
      <SkillRow items={items} />
    </Card>
  );
}

export function Skills() {
  return (
    <section id="skills" className="py-24 px-4 sm:px-6 lg:px-8 bg-background relative">
      <div className="max-w-6xl mx-auto">
        <div className="reveal text-center mb-16">
          <span className="section-label mb-4 inline-flex">Skills & Expertise</span>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 mt-4">
            <span className="heading-underline">What I Work With</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Specialized in AI/ML with strong full-stack development capabilities
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <SkillCard
            icon={Code2}
            title="Web Development"
            subtitle="Full-stack tools and libraries I use daily"
            items={portfolioData.skills.web.map((s) => s.name)}
          />
          <SkillCard
            icon={Brain}
            title="AI/ML & Data Science"
            subtitle="ML/DL ecosystems, data tooling, and workflows"
            items={portfolioData.skills.aiml.map((s) => s.name)}
          />
        </div>

        <div className="reveal mt-10">
          <AIShowcase />
        </div>
      </div>
    </section>
  );
}
