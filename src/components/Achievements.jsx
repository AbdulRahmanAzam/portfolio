"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { portfolioData } from "@/lib/schema";
import { Code2, Trophy, Award, Sparkles, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

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
      className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/20 relative"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-label mb-4 inline-flex">Recognition</span>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3 mt-4">
            <span className="heading-underline">Achievements & Certificates</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Recognition and certifications earned through dedication and hard work
          </p>
        </motion.div>

        <motion.div 
          className="mb-8 flex items-stretch justify-center"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="relative w-full md:max-w-lg">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search achievements..."
              value={query}
              onChange={(e) => { setQuery(e.target.value); setVisibleCount(6); }}
              className="pl-10 h-11 rounded-xl border-border/60 bg-card/50 backdrop-blur-sm focus:border-primary/50 transition-colors"
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.slice(0, visibleCount).map((achievement, index) => {
            const Icon = iconMap[achievement.icon] || Award;
            const colorClass = iconColors[achievement.icon] || iconColors.sparkles;

            return (
              <motion.div 
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
              >
                <Card 
                  className="group p-6 h-full bg-card/60 backdrop-blur-sm rounded-2xl border border-border/50 glow-hover transition-all duration-500 hover:border-primary/30"
                >
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${colorClass} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-1.5 group-hover:text-primary transition-colors duration-300">
                        {achievement.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {filtered.length > visibleCount && (
          <motion.div 
            className="mt-10 flex justify-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Button 
              variant="outline" 
              onClick={() => setVisibleCount((c) => c + 8)}
              className="rounded-xl border-primary/30 hover:border-primary/50 hover:bg-primary/5"
            >
              Load more
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
