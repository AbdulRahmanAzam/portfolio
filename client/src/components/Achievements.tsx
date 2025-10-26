import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { portfolioData } from '@shared/schema';
import { Code2, Trophy, Award, Sparkles, Search, ExternalLink } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const iconMap = {
  code: Code2,
  trophy: Trophy,
  certificate: Award,
  sparkles: Sparkles,
};

export function Achievements() {
  const [query, setQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(8);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filtered = useMemo(() => {
    let result = [...portfolioData.achievements];
    
    // Filter by category
    if (categoryFilter !== 'all') {
      result = result.filter(i => i.category === categoryFilter);
    }
    
    // Filter by search query
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(i => i.title.toLowerCase().includes(q) || i.description.toLowerCase().includes(q));
    }
    
    return result;
  }, [query, categoryFilter]);

  return (
    <section
      id="achievements"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30"
      data-testid="section-achievements"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight mb-3" data-testid="text-achievements-header">
            Achievements & Certificates
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Clean, searchable, and organized list that scales as you add more
          </p>
        </div>

        <div className="mb-6 space-y-4">
          {/* Category filters */}
          <div className="flex justify-center gap-2 flex-wrap">
            <Button
              variant={categoryFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCategoryFilter('all')}
            >
              All
            </Button>
            <Button
              variant={categoryFilter === 'competition' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCategoryFilter('competition')}
            >
              Competitions
            </Button>
            <Button
              variant={categoryFilter === 'certification' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCategoryFilter('certification')}
            >
              Certifications
            </Button>
            <Button
              variant={categoryFilter === 'speaking' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCategoryFilter('speaking')}
            >
              Speaking
            </Button>
          </div>
          
          {/* Search bar */}
          <div className="flex items-stretch justify-center">
            <div className="relative w-full md:max-w-lg">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title or description"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setVisibleCount(6); }}
                className="pl-9"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.slice(0, visibleCount).map((achievement, index) => {
            const Icon = iconMap[achievement.icon as keyof typeof iconMap] || Award;

            return (
              <div key={achievement.id} data-testid={`achievement-${achievement.id}`}>
                <Card 
                  className="p-6 h-full hover-elevate active-elevate-2 transition-all duration-500 bg-card/80 backdrop-blur-sm rounded-xl border border-card-border"
                  style={{ transitionDelay: `${index * 60}ms` }}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-md flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="text-xl font-semibold" data-testid={`text-achievement-title-${achievement.id}`}>
                          {achievement.title}
                        </h3>
                        {achievement.category && (
                          <Badge variant="secondary" className="text-xs capitalize">
                            {achievement.category}
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground leading-relaxed line-clamp-3 mb-3" data-testid={`text-achievement-description-${achievement.id}`}>
                        {achievement.description}
                      </p>
                      {'proofLink' in achievement && achievement.proofLink && (
                        <Button variant="ghost" size="sm" asChild className="h-auto p-0">
                          <a href={achievement.proofLink} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-3 h-3 mr-1" />
                            View Proof
                          </a>
                        </Button>
                      )}
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