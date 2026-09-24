import { Calendar, Mail, Github, Linkedin, ExternalLink, Download, Code2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button-variants";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { portfolioData } from "@/lib/schema";

// Server Component: plain links, CSS scroll reveals, no client JS.

// ============================================================================
// CONFIGURATION
// ============================================================================
const CONFIG = {
  calendlyUrl: "https://calendly.com/azamabdulrahman930/30min",
  resumeFile: "/Abdul_Rahman_Azam__Resume.pdf",
  resumeFileName: "Abdul_Rahman_Azam_Resume.pdf",
};

// Social Link Component
function SocialLink({ href, icon: Icon, label, username, external = true }) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="group flex items-center gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/60 border border-transparent hover:border-primary/20 transition-all duration-300 hover:translate-x-1"
    >
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm">{label}</p>
        <p className="text-xs text-muted-foreground truncate">{username}</p>
      </div>
      <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
    </a>
  );
}

function ScheduleCallPanel() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-background p-6">
      <div className="glow-blob absolute -top-24 -right-24 h-56 w-56 opacity-90" aria-hidden="true" />

      <div className="relative space-y-5">
        <p className="text-sm text-muted-foreground leading-relaxed">
          Pick a time that works for you and let&apos;s discuss your project, collaboration, or AI/ML opportunity.
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-border/60 bg-card/60 p-3">
            <p className="text-xs text-muted-foreground">Session Type</p>
            <p className="text-sm font-medium">1:1 Discovery Call</p>
          </div>
          <div className="rounded-xl border border-border/60 bg-card/60 p-3">
            <p className="text-xs text-muted-foreground">Duration</p>
            <p className="text-sm font-medium">30 Minutes</p>
          </div>
        </div>

        <a
          href={CONFIG.calendlyUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Book a free meeting on Calendly"
          className={cn(buttonVariants(), "w-full h-12 rounded-xl group")}
        >
          <span>Book a Free Meeting</span>
          <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </a>

        <p className="text-xs text-muted-foreground">You&apos;ll be redirected to Calendly to confirm your slot.</p>
      </div>
    </div>
  );
}

export function Contact() {
  return (
    <section id="contact" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-background overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="glow-blob absolute top-0 left-1/4 w-[500px] h-[500px] opacity-60" />
        <div className="glow-blob absolute bottom-0 right-1/4 w-[500px] h-[500px] opacity-60" />
      </div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="reveal text-center mb-16">
          <span className="section-label mb-4 inline-flex">Get in Touch</span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4 mt-4">
            <span className="heading-underline">Let&apos;s Work Together</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            I&apos;m actively seeking AI/ML opportunities. Schedule a call or connect with me directly.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Calendly Card */}
          <div className="reveal">
            <Card className="h-full p-6 bg-card/50 border-border/40 overflow-hidden rounded-2xl glow-hover">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Schedule a Call</h3>
                  <p className="text-sm text-muted-foreground">Book a Free Meeting</p>
                </div>
              </div>
              <ScheduleCallPanel />
            </Card>
          </div>

          {/* Connect Card */}
          <div className="reveal">
            <Card className="h-full p-6 bg-card/50 border-border/40 rounded-2xl glow-hover">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Connect With Me</h3>
                  <p className="text-sm text-muted-foreground">Find me on these platforms</p>
                </div>
              </div>
              <div className="space-y-3">
                <SocialLink href={`mailto:${portfolioData.social.email}`} icon={Mail} label="Email" username={portfolioData.social.email} external={false} />
                <SocialLink href={portfolioData.social.linkedin} icon={Linkedin} label="LinkedIn" username="@abdulrahmanazam" />
                <SocialLink href={portfolioData.social.github} icon={Github} label="GitHub" username="@abdulrahmanazam" />
                <SocialLink href={portfolioData.social.leetcode} icon={Code2} label="LeetCode" username="@abdulrahmanazam" />
              </div>
            </Card>
          </div>
        </div>

        {/* Resume Download */}
        <div className="reveal w-full flex justify-center">
          <a
            href={CONFIG.resumeFile}
            download={CONFIG.resumeFileName}
            className={cn(
              buttonVariants(),
              "w-full max-w-[16.5rem] h-15 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 border border-primary/30 shadow-sm transition-all duration-300 group"
            )}
          >
            <div className="flex items-center justify-center gap-3 w-full text-sm">
              <div className="w-9 h-9 rounded-xl bg-primary-foreground/10 flex items-center justify-center group-hover:bg-primary-foreground/20 transition-colors">
                <Download className="w-4 h-4" />
              </div>
              <div className="text-left leading-tight">
                <p className="font-semibold">Download Resume</p>
                <p className="text-[11px] text-primary-foreground/80">Instant PDF download</p>
              </div>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
