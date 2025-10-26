import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';

interface Metric {
  label: string;
  value: string;
  change?: string;
}

const metrics: Metric[] = [
  { label: 'LeetCode Problems', value: '290+', change: '+5 this week' },
  { label: 'GitHub Repos', value: '15+', change: 'Active' },
  { label: 'ML Accuracy', value: '85%', change: 'KNN Model' },
  { label: 'Projects Completed', value: '10+', change: 'Production' },
  { label: 'Code Quality', value: 'A+', change: 'TypeScript' },
];

export function MetricsTicker() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % metrics.length);
    }, 3000); // Change metric every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const metric = metrics[currentIndex];

  return (
    <div className="fixed top-20 right-4 z-40 hidden lg:block" aria-live="polite" aria-atomic="true">
      <div className="bg-card/90 backdrop-blur-md border border-border rounded-lg p-3 shadow-lg animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <div className="text-xs text-muted-foreground uppercase tracking-wider">
              {metric.label}
            </div>
            <div className="text-2xl font-bold text-primary">
              {metric.value}
            </div>
          </div>
          {metric.change && (
            <Badge variant="secondary" className="text-xs whitespace-nowrap">
              {metric.change}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
