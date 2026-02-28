"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { portfolioData } from "@/lib/schema";
import { Code2, Trophy, Award, Sparkles, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const iconMap = {
  code: Code2,
  trophy: Trophy,
  certificate: Award,
  sparkles: Sparkles,
};

export function Achievements() {
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(8);

  const filtered = useMemo(() => {
    const list = portfolioData.achievements;
    if (!query.trim()) return list;
    const q = query.toLowerCase();
    return list.filter(i => i.title.toLowerCase().includes(q) || i.description.toLowerCase().includes(q));
  }, [query]);

  return (
    <section
      id="achievements"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight mb-3">
            Achievements & Certificates
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Recognition and certifications earned through dedication and hard work
          </p>
        </div>

        <div className="mb-6 flex items-stretch justify-center">
          <div className="relative w-full md:max-w-lg">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search achievements..."
              value={query}
              onChange={(e) => { setQuery(e.target.value); setVisibleCount(6); }}
              className="pl-9"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.slice(0, visibleCount).map((achievement, index) => {
            const Icon = iconMap[achievement.icon] || Award;

            return (
              <div key={achievement.id}>
                <Card 
                  className="p-6 h-full hover-elevate active-elevate-2 transition-all duration-500 bg-card/80 backdrop-blur-sm rounded-xl border border-card-border"
                  style={{ transitionDelay: `${index * 60}ms` }}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-md flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">
                        {achievement.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed line-clamp-3">
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>

        {filtered.length > visibleCount && (
          <div className="mt-8 flex justify-center">
            <Button variant="secondary" onClick={() => setVisibleCount((c) => c + 8)}>
              Load more
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
