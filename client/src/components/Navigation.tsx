import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { Calendar, Mail, Linkedin } from 'lucide-react';

export function Navigation() {
  const [activeSection, setActiveSection] = useState('home');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // Update active section based on scroll position
      const sections = ['home', 'skills', 'projects', 'education', 'achievements', 'resume'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const smoothScroll = useSmoothScroll();

  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    smoothScroll(element);
  }, [smoothScroll]);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'education', label: 'Education' },
    { id: 'achievements', label: 'Achievements' },
    { id: 'resume', label: 'Resume' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-background/80 backdrop-blur-lg border-b border-border' : 'bg-transparent'
      }`}
      data-testid="navigation-header"
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => scrollToSection('home')}
            className="text-xl font-bold tracking-tight hover-elevate active-elevate-2 px-3 py-2 rounded-md transition-colors"
            data-testid="button-logo"
          >
            Abdul Rahman Azam
          </button>

          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                onClick={() => scrollToSection(item.id)}
                className={`transition-colors ${
                  activeSection === item.id ? 'bg-accent text-accent-foreground' : ''
                }`}
                data-testid={`button-nav-${item.id}`}
              >
                {item.label}
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {scrolled && (
              <Button 
                size="sm" 
                className="hidden md:flex items-center gap-2"
                onClick={() => window.open('https://calendly.com/abdulrahmanazam', '_blank')}
              >
                <Calendar className="w-4 h-4" />
                Book a Call
              </Button>
            )}
            <ThemeToggle />
            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => scrollToSection('resume')}
                data-testid="button-mobile-menu"
              >
                Menu
              </Button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}