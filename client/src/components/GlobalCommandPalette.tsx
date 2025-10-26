import { useEffect, useState, useCallback } from 'react';
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { portfolioData } from '@shared/schema';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { Brain, Globe, Trophy, Code2, FileText, Home, User, Briefcase, GraduationCap } from 'lucide-react';

interface CommandItem {
  id: string;
  label: string;
  icon: typeof Brain;
  action: () => void;
  keywords?: string[];
}

export function GlobalCommandPalette() {
  const [open, setOpen] = useState(false);
  const smoothScroll = useSmoothScroll();

  // Toggle command palette with Cmd+K or Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    smoothScroll(element);
    setOpen(false);
  }, [smoothScroll]);

  const commands: CommandItem[] = [
    // Navigation
    { id: 'home', label: 'Home', icon: Home, action: () => scrollToSection('home') },
    { id: 'skills', label: 'Skills', icon: Code2, action: () => scrollToSection('skills') },
    { id: 'projects', label: 'Projects', icon: Briefcase, action: () => scrollToSection('projects') },
    { id: 'education', label: 'Education', icon: GraduationCap, action: () => scrollToSection('education') },
    { id: 'achievements', label: 'Achievements', icon: Trophy, action: () => scrollToSection('achievements') },
    { id: 'resume', label: 'Resume', icon: FileText, action: () => scrollToSection('resume') },
    
    // Project navigation
    ...portfolioData.projects.map(project => ({
      id: `project-${project.id}`,
      label: project.title,
      icon: project.category === 'aiml' ? Brain : Globe,
      action: () => scrollToSection('projects'),
      keywords: [project.category || '', ...project.technologies],
    })),

    // Social links
    {
      id: 'github',
      label: 'Open GitHub',
      icon: Code2,
      action: () => window.open(portfolioData.social.github, '_blank'),
      keywords: ['code', 'repo'],
    },
    {
      id: 'linkedin',
      label: 'Open LinkedIn',
      icon: User,
      action: () => window.open(portfolioData.social.linkedin, '_blank'),
      keywords: ['profile', 'connect'],
    },
    {
      id: 'leetcode',
      label: 'Open LeetCode',
      icon: Code2,
      action: () => window.open(portfolioData.social.leetcode, '_blank'),
      keywords: ['problems', 'algorithms'],
    },
  ];

  return (
    <>
      {/* Keyboard shortcut hint */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-50 px-3 py-2 text-sm bg-card/90 backdrop-blur-md border border-border rounded-lg shadow-lg hover:shadow-xl transition-all hover-elevate hidden md:flex items-center gap-2"
      >
        <span className="text-muted-foreground">Press</span>
        <kbd className="px-2 py-1 text-xs bg-muted rounded">⌘K</kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          
          <CommandGroup heading="Navigation">
            {commands.slice(0, 6).map((cmd) => {
              const Icon = cmd.icon;
              return (
                <CommandItem key={cmd.id} onSelect={cmd.action}>
                  <Icon className="mr-2 h-4 w-4" />
                  <span>{cmd.label}</span>
                </CommandItem>
              );
            })}
          </CommandGroup>

          <CommandGroup heading="Projects">
            {commands.slice(6, 6 + portfolioData.projects.length).map((cmd) => {
              const Icon = cmd.icon;
              return (
                <CommandItem key={cmd.id} onSelect={cmd.action} keywords={cmd.keywords}>
                  <Icon className="mr-2 h-4 w-4" />
                  <span>{cmd.label}</span>
                </CommandItem>
              );
            })}
          </CommandGroup>

          <CommandGroup heading="External Links">
            {commands.slice(6 + portfolioData.projects.length).map((cmd) => {
              const Icon = cmd.icon;
              return (
                <CommandItem key={cmd.id} onSelect={cmd.action} keywords={cmd.keywords}>
                  <Icon className="mr-2 h-4 w-4" />
                  <span>{cmd.label}</span>
                </CommandItem>
              );
            })}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
