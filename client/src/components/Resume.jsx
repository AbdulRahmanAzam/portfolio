import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Download, Mail, Github, Linkedin, Code2 } from "lucide-react";
import { portfolioData } from "@shared/schema";

export function Resume() {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/Abdul_Rahman_Azam__Resume.pdf";
    link.download = "Abdul_Rahman_Azam_Resume.pdf";
    link.setAttribute("target", "_blank");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section 
      id="resume" 
      className="py-20 px-4 sm:px-6 lg:px-8 bg-background"
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight mb-4">
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
              Get a detailed overview of my experience, skills, and projects
            </p>
            
            <Button 
              size="lg"
              onClick={handleDownload}
              className="group"
            >
              <Download className="w-5 h-5 mr-2 group-hover:animate-bounce" />
              Download Resume (PDF)
            </Button>
          </div>

          {/* Contact Links */}
          <div className="border-t border-border pt-8">
            <h4 className="text-lg font-medium mb-6">Connect With Me</h4>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button
                variant="outline"
                onClick={() => window.open(portfolioData.social.github, "_blank")}
              >
                <Github className="w-4 h-4 mr-2" />
                GitHub
              </Button>
              
              <Button
                variant="outline"
                onClick={() => window.open(portfolioData.social.linkedin, "_blank")}
              >
                <Linkedin className="w-4 h-4 mr-2" />
                LinkedIn
              </Button>
              
              <Button
                variant="outline"
                onClick={() => window.open(portfolioData.social.leetcode, "_blank")}
              >
                <Code2 className="w-4 h-4 mr-2" />
                LeetCode
              </Button>
              
              <Button
                variant="outline"
                onClick={() => window.location.href = `mailto:${portfolioData.social.email}`}
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
