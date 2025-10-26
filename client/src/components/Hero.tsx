import { NeuralNetworkBackground } from './NeuralNetworkBackground';
import { MetricsTicker } from './MetricsTicker';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';

export function Hero() {
  const smoothScroll = useSmoothScroll();

  const scrollToSkills = () => {
    const element = document.getElementById('skills');
    smoothScroll(element);
  };

  return (
    <section 
      id="home" 
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background"
      data-testid="section-hero"
    >
      {/* 3D Background */}
      <NeuralNetworkBackground className="opacity-40" />

      {/* Metrics Ticker */}
      <MetricsTicker />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-fade-in-up">
          <h1 
            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-4"
            data-testid="text-hero-name"
          >
            Abdul Rahman Azam
          </h1>
          
          <p 
            className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-primary mb-4"
            data-testid="text-hero-title"
          >
            AI/ML Engineer & Developer
          </p>
          
          <p 
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
            data-testid="text-hero-tagline"
          >
            Crafting Code That Thinks — and Ideas That Build Themselves.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button 
              size="lg"
              onClick={() => smoothScroll(document.getElementById('projects'))}
              data-testid="button-view-projects"
            >
              View Projects
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => smoothScroll(document.getElementById('resume'))}
              data-testid="button-download-resume"
            >
              Download Resume
            </Button>
          </div>
        </div>

        {/* Scroll indicator */}
        <button
          onClick={scrollToSkills}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hover-elevate active-elevate-2 p-2 rounded-full"
          data-testid="button-scroll-indicator"
          aria-label="Scroll to skills section"
        >
          <ChevronDown className="w-8 h-8 text-primary" />
        </button>
      </div>
    </section>
  );
}