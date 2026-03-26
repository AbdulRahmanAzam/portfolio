"use client";

import { motion } from "framer-motion";
import { Calendar, Mail, Github, Linkedin, ExternalLink, Download, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { portfolioData } from "@/lib/schema";

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
      <div className="absolute -top-20 -right-20 h-44 w-44 rounded-full bg-primary/20 blur-3xl" />

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

        <Button asChild className="w-full h-12 rounded-xl group">
          <a href={CONFIG.calendlyUrl} target="_blank" rel="noopener noreferrer" aria-label="Book a free meeting on Calendly">
            <span>Book a Free Meeting</span>
            <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </a>
        </Button>

        <p className="text-xs text-muted-foreground">You&apos;ll be redirected to Calendly to confirm your slot.</p>
      </div>
    </div>
  );
}

export function Contact() {
  const handleDownloadResume = () => {
    const link = document.createElement("a");
    link.href = CONFIG.resumeFile;
    link.download = CONFIG.resumeFileName;
    link.setAttribute("target", "_blank");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="contact" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-background overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/4 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-primary/4 rounded-full blur-[120px]" />
      </div>
      
      <motion.div 
        className="max-w-6xl mx-auto relative z-10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="text-center mb-16">
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
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="h-full p-6 bg-card/50 backdrop-blur-sm border-border/40 overflow-hidden rounded-2xl glow-hover">
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
          </motion.div>

          {/* Connect Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="h-full p-6 bg-card/50 backdrop-blur-sm border-border/40 rounded-2xl glow-hover">
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
          </motion.div>
        </div>

        {/* Resume Download */}
        <motion.div 
          className="w-full flex justify-center"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <Button
            onClick={handleDownloadResume}
            className="w-full max-w-[16.5rem] h-15 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 border border-primary/30 shadow-sm transition-all duration-300 group"
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
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
