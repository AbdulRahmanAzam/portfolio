import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Calendar, Mail, Github, Linkedin, ExternalLink, Download, Code2} from "lucide-react";
import { useDarkMode } from "../hooks/use-dark-mode";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { portfolioData } from "@shared/schema";

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

// Convert HSL "217 91% 48%" to hex for Calendly
function hslToHex(hslString) {
  const [hRaw, sRaw, lRaw] = hslString.trim().split(" ");
  if (!hRaw || !sRaw || !lRaw) return "3b82f6";
  const h = parseFloat(hRaw);
  const s = parseFloat(sRaw.replace("%", "")) / 100;
  const l = parseFloat(lRaw.replace("%", "")) / 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, "0");
  };
  return `${f(0)}${f(8)}${f(4)}`;
}

// Calendly Embed with lazy loading
function CalendlyEmbed() {
  const embedRef = useRef(null);
  const isInView = useInView(embedRef, { once: true, margin: "-100px" });
  const [isLoaded, setIsLoaded] = useState(false);
  const [primaryHex, setPrimaryHex] = useState("3b82f6");
  const { isDarkMode } = useDarkMode();

  useEffect(() => {
    const root = getComputedStyle(document.documentElement);
    const hsl = root.getPropertyValue("--primary");
    setPrimaryHex(hslToHex(hsl));
  }, [isDarkMode]);

  useEffect(() => {
    if (!isInView) return;
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    script.onload = () => setIsLoaded(true);
    document.body.appendChild(script);
    return () => {
      const existing = document.querySelector('script[src="https://assets.calendly.com/assets/external/widget.js"]');
      if (existing) existing.remove();
    };
  }, [isInView]);

  return (
    <div
      ref={embedRef}
      className="relative w-full h-[360px] overflow-hidden rounded-2xl"
    >
      {isInView && (
        <div
          className="calendly-inline-widget w-full"
          data-url={`${CONFIG.calendlyUrl}?hide_event_type_details=1&hide_landing_page_details=1&hide_gdpr_banner=1&background_color=transparent&primary_color=${primaryHex}`}
          style={{ height: "380px" }}
        />
      )}
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
    <section id="contact" className="relative py-16 px-4 sm:px-6 lg:px-8 bg-background overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">Available for opportunities</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            Let's Work Together
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            I'm actively seeking AI/ML opportunities. Schedule a call or connect with me directly.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Calendly Card */}
          <Card className="h-full p-6 bg-card/50 backdrop-blur-sm border-border/60 overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Schedule a Call</h3>
                <p className="text-sm text-muted-foreground">Book a Free meeting</p>
              </div>
            </div>
            <CalendlyEmbed />
          </Card>

          {/* Connect Card */}
          <Card className="h-full p-6 bg-card/50 backdrop-blur-sm border-border/60">
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

        {/* Resume Download */}
        <div className="w-full flex justify-center">
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
        </div>
      </motion.div>
    </section>
  );
}
