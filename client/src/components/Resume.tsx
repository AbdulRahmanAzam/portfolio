import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, Mail, Github, Linkedin, Code2, Brain, Globe } from 'lucide-react';
import { portfolioData } from '@shared/schema';

export function Resume() {
  const handleDownload = (type: 'general' | 'ai' | 'web') => {
    // Download the resume PDF from the public directory
    const link = document.createElement('a');
    const filename = type === 'general' 
      ? '/Abdul_Rahman_Azam_Resume.pdf'
      : type === 'ai'
      ? '/Abdul_Rahman_Azam_Resume_AI_ML.pdf'
      : '/Abdul_Rahman_Azam_Resume_Web_Dev.pdf';
    link.href = filename;
    link.download = filename.split('/').pop() || 'resume.pdf';
    link.setAttribute('target', '_blank');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section 
      id="resume" 
      className="py-20 px-4 sm:px-6 lg:px-8 bg-background"
      data-testid="section-resume"
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight mb-4" data-testid="text-resume-header">
            Get In Touch
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            I'm actively looking for AI/ML opportunities. Let's connect and discuss how I can contribute to your team.
          </p>
        </div>

        <Card className="p-8 md:p-12 text-center">
          <div className="mb-8">
            <h3 className="text-2xl font-semibold mb-4">Download My Resume</h3>
            <p className="text-muted-foreground mb-6">
              Get a detailed overview of my experience, skills, and projects. Choose a tailored version for your needs.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg"
                onClick={() => handleDownload('general')}
                className="group w-full sm:w-auto"
                data-testid="button-download-resume-main"
              >
                <Download className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                General Resume
              </Button>
              
              <Button 
                size="lg"
                variant="outline"
                onClick={() => handleDownload('ai')}
                className="group w-full sm:w-auto"
              >
                <Brain className="w-5 h-5 mr-2" />
                AI/ML Focus
              </Button>
              
              <Button 
                size="lg"
                variant="outline"
                onClick={() => handleDownload('web')}
                className="group w-full sm:w-auto"
              >
                <Globe className="w-5 h-5 mr-2" />
                Web Dev Focus
              </Button>
            </div>
          </div>

          {/* Contact Links */}
          <div className="border-t border-border pt-8">
            <h4 className="text-lg font-medium mb-6">Connect With Me</h4>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button
                variant="outline"
                onClick={() => window.open(portfolioData.social.github, '_blank')}
                data-testid="button-github"
              >
                <Github className="w-4 h-4 mr-2" />
                GitHub
              </Button>
              
              <Button
                variant="outline"
                onClick={() => window.open(portfolioData.social.linkedin, '_blank')}
                data-testid="button-linkedin"
              >
                <Linkedin className="w-4 h-4 mr-2" />
                LinkedIn
              </Button>
              
              <Button
                variant="outline"
                onClick={() => window.open(portfolioData.social.leetcode, '_blank')}
                data-testid="button-leetcode"
              >
                <Code2 className="w-4 h-4 mr-2" />
                LeetCode
              </Button>
              
              <Button
                variant="outline"
                onClick={() => window.location.href = `mailto:${portfolioData.social.email}`}
                data-testid="button-email"
              >
                <Mail className="w-4 h-4 mr-2" />
                Email
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}