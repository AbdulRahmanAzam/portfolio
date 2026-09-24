import { Code2, Trophy, Award, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { portfolioData } from "@/lib/schema";
import { AchievementSearch } from "./AchievementSearch";

const iconMap = {
  code: Code2,
  trophy: Trophy,
  certificate: Award,
  sparkles: Sparkles,
};

const iconColors = {
  code: "from-blue-500/20 to-cyan-500/20 text-blue-500 dark:text-blue-400",
  trophy: "from-amber-500/20 to-yellow-500/20 text-amber-500 dark:text-amber-400",
  certificate: "from-purple-500/20 to-pink-500/20 text-purple-500 dark:text-purple-400",
  sparkles: "from-emerald-500/20 to-teal-500/20 text-emerald-500 dark:text-emerald-400",
};

// Server Component; only the search box is a client island.
export function Achievements() {
  return (
    <section id="achievements" className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/20 relative">
      <div className="max-w-6xl mx-auto">
        <div className="reveal text-center mb-12">
          <span className="section-label mb-4 inline-flex">Recognition</span>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3 mt-4">
            <span className="heading-underline">Achievements & Certificates</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Recognition and certifications earned through dedication and hard work
          </p>
        </div>

        <AchievementSearch listId="achievements-list" />

        <ul id="achievements-list" className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {portfolioData.achievements.map((achievement) => {
            const Icon = iconMap[achievement.icon] || Award;
            const colorClass = iconColors[achievement.icon] || iconColors.sparkles;

            return (
              <li
                key={achievement.id}
                className="reveal"
                data-search={`${achievement.title} ${achievement.description}`.toLowerCase()}
              >
                <Card className="group p-6 h-full bg-card/60 rounded-2xl border border-border/50 glow-hover transition-all duration-500 hover:border-primary/30">
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${colorClass} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}
                    >
                      <Icon className="w-6 h-6" aria-hidden="true" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-1.5 group-hover:text-primary transition-colors duration-300">
                        {achievement.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{achievement.description}</p>
                    </div>
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
