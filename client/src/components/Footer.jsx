import { Github, Linkedin, Mail, Code2 } from "lucide-react";
import { portfolioData } from "@shared/schema";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-muted/30 border-t border-border py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="font-semibold text-lg mb-1">{portfolioData.name}</p>
            <p className="text-sm text-muted-foreground">
              {portfolioData.title}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={portfolioData.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-md bg-card border border-card-border flex items-center justify-center hover-elevate active-elevate-2 transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            
            <a
              href={portfolioData.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-md bg-card border border-card-border flex items-center justify-center hover-elevate active-elevate-2 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            
            <a
              href={portfolioData.social.leetcode}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-md bg-card border border-card-border flex items-center justify-center hover-elevate active-elevate-2 transition-colors"
              aria-label="LeetCode"
            >
              <Code2 className="w-5 h-5" />
            </a>
            
            <a
              href={`mailto:${portfolioData.social.email}`}
              className="w-10 h-10 rounded-md bg-card border border-card-border flex items-center justify-center hover-elevate active-elevate-2 transition-colors"
              aria-label="Email"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>© {currentYear} Built with ❤️ by {portfolioData.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
