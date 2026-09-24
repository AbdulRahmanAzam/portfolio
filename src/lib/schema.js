/**
 * Portfolio Data & Structured Data — Abdul Rahman Azam
 */

export const portfolioData = {
  name: "Abdul Rahman Azam",
  title: "Full Stack AI Engineer",
  tagline: "Crafting Code That Thinks — and Ideas That Build Themselves.",
  // Meta description (keep under ~160 characters).
  description:
    "Abdul Rahman Azam is a Full Stack AI Engineer from Karachi, Pakistan, founder of FAST Wheels and AI Season, building AI agents and web apps. BS AI at FAST NUCES.",
  // Longer answer-first bio for the About section and llms.txt.
  bio: [
    "Abdul Rahman Azam is a Full Stack AI Engineer from Karachi, Pakistan. He builds AI products end to end, from agents and machine learning models to the React and Node.js apps people actually use.",
    "He founded FAST Wheels, an AI carpooling platform on WhatsApp that matches 2,500+ FAST NUCES students, and AI Season, a live bootcamp that teaches Pakistani students to build AI agents with LangChain, LangGraph and RAG. He also built FastVerse, a 3D multiplayer walkthrough of the FAST Karachi campus, and Sir Jee, a live AI whiteboard tutor for MDCAT and ECAT.",
    "Abdul Rahman is studying for a BS in Artificial Intelligence at FAST NUCES Karachi (2023–2027). He has worked as an AI/ML intern at REON Energy and a backend engineer for BoxTech, won 10+ national hackathons including Iterate '26, the PROCOM '26 JS Bank Hackathon, the BWAI Hackathon and Teknofest Karachi '26 AI App Development, and led AI competitions at PROCOM and machine learning at ACM-AI.",
  ],
  location: "Karachi, Sindh, Pakistan",

  siteUrl: "https://abdulrahmanazam.me",

  skills: {
    web: [
      { name: "React.js" },
      { name: "Node.js" },
      { name: "Express.js" },
      { name: "JavaScript" },
      { name: "TypeScript" },
      { name: "Tailwind CSS" },
      { name: "MongoDB" },
      { name: "PostgreSQL" },
      { name: "REST APIs" },
      { name: "Supabase" },
      { name: "Docker" },
    ],
    aiml: [
      { name: "Python" },
      { name: "AI Agents" },
      { name: "LangChain & LangGraph" },
      { name: "RAG" },
      { name: "MCP Servers" },
      { name: "FastAPI" },
      { name: "Machine Learning" },
      { name: "Deep Learning" },
      { name: "Scikit-learn" },
      { name: "Pandas & NumPy" },
      { name: "Data Visualization" },
    ],
  },

  // `featured` projects render as large stacked cards with live screenshots;
  // the rest appear in the "More Projects" grid. Screenshots live in /public/projects.
  projects: [
    {
      id: "fastverse",
      featured: true,
      title: "FastVerse",
      tagline: "Walk the FAST Karachi campus in 3D, in your browser",
      period: "2026",
      description:
        "A browser 3D walkthrough of the FAST NUCES Karachi campus for new students. A guided orientation tour follows an arrow around 11 labelled places, with a campus map, waypoints and live multiplayer so friends can explore together.",
      technologies: ["React", "Three.js", "React Three Fiber", "Rapier", "Zustand", "WebSockets"],
      highlights: [
        "Guided orientation tour of 11 labelled campus places",
        "First-person, third-person, wide and top-down camera views",
        "Real-time multiplayer over WebSockets, installable as a PWA",
      ],
      github: null,
      live: "https://fastverse.duckdns.org",
      image: "/projects/fastverse2.png",
      category: "Game Dev",
    },
    {
      id: "fastwheels",
      featured: true,
      title: "FAST Wheels",
      tagline: "AI carpooling that lives inside WhatsApp",
      period: "Oct 2025 – Present",
      description:
        "Pakistan's AI-powered carpooling platform for FAST NUCES students. Riders and drivers message a WhatsApp bot, and an AI assistant matches them by route and time. No app download needed.",
      technologies: ["Node.js", "Express", "MongoDB", "Gemini", "Groq", "WhatsApp API"],
      highlights: [
        "Ride-matching engine with a Karachi gazetteer and phonetic place-name search",
        "One process runs five bots: carpool, food ordering, salon booking, shop, reminders",
        "LLM tool-calling on Gemini with automatic Groq fallback",
      ],
      github: null,
      live: "https://fastwheels.app",
      image: "/projects/fastwheels.jpg",
      category: "AI Product",
    },
    {
      id: "sir-jee",
      featured: true,
      title: "Sir Jee",
      tagline: "An AI tutor that draws and talks you through MDCAT & ECAT",
      period: "Apr – Jul 2026",
      description:
        "A live AI tutor that turns any MDCAT or ECAT topic into an animated whiteboard lesson, explains it out loud in Urdu or English, then quizzes the student.",
      technologies: ["React", "FastAPI", "Google ADK", "Gemini Live", "WebSockets"],
      highlights: [
        "3-agent pipeline: research, lesson and quiz agents built on Google ADK",
        "Lessons drawn on a live canvas from a custom drawing DSL",
        "Real-time voice narration streamed from Gemini native audio",
      ],
      github: null,
      live: "https://sir-jee.vercel.app",
      image: "/projects/sir-jee.jpg",
      category: "AI/ML",
    },
    {
      id: "civiclens",
      featured: true,
      title: "CivicLens",
      tagline: "AI-triaged civic complaints, reported from WhatsApp",
      period: "Jan 2026",
      description:
        "Platform where citizens report urban issues by web, voice note or WhatsApp. AI sorts and prioritizes each report, and city admins track them on a live heatmap until they're fixed.",
      technologies: ["React", "Node.js", "MongoDB", "Groq", "WhatsApp Bot", "Solidity"],
      highlights: [
        "AI sorts each complaint into a category and scores its severity from 1 to 10",
        "Flags duplicate reports filed within 500 m of each other",
        "Voice-note complaints transcribed to text automatically",
      ],
      github: "https://github.com/abdulrahmanazam/CivicLens",
      live: "https://civiclensfast.vercel.app",
      image: "/projects/civiclens.jpg",
      category: "Full Stack",
    },
    {
      id: "instyle",
      featured: true,
      title: "inStyle",
      tagline: "A personal AI stylist tuned to your skin tone and schedule",
      period: "Jan 2026",
      description:
        "AI stylist that analyzes a user's face and skin undertone with computer vision, then suggests outfits for their calendar events and the day's weather.",
      technologies: ["React", "FastAPI", "MediaPipe", "OpenCV", "PyTorch", "MongoDB"],
      highlights: [
        "Skin-tone and undertone analysis with MediaPipe + color science",
        "Outfit suggestions for Google Calendar events and live weather",
        "Style chat assistant running on Groq",
      ],
      github: "https://github.com/abdulrahmanazam/styleX",
      live: "https://style-x-lake.vercel.app",
      image: "/projects/instyle.jpg",
      category: "AI/ML",
    },
    {
      id: "vibe-coding",
      featured: true,
      title: "Vibe Coding Arena",
      tagline: "Competition platform where coders build AI bots to survive",
      period: "Nov 2025",
      description:
        "Squid Game-themed coding competition platform for PROCOM '26. Teams write AI bots in an in-browser editor to clear a web-dev round, a maze escape and an endless runner.",
      technologies: ["React", "Three.js", "Monaco Editor", "Supabase", "Tailwind CSS"],
      highlights: [
        "In-browser Monaco code editor with live bot runs",
        "3D game stages rendered with React Three Fiber",
        "Live leaderboard and team auth on Supabase",
      ],
      github: null,
      live: "https://vibecoding-procom26.vercel.app",
      image: "/projects/vibe-coding.jpg",
      category: "Full Stack",
    },
    {
      id: "driftframe",
      title: "Driftframe",
      period: "Jun 2026",
      description:
        "GIF maker that runs entirely in the browser: pick images, crop each frame, set the timing and export. Nothing is uploaded.",
      technologies: ["React", "Vite", "Canvas API"],
      highlights: ["All processing happens in the browser"],
      github: null,
      live: "https://driftframe.vercel.app",
      image: "/projects/driftframe.jpg",
      category: "Full Stack",
    },
    {
      id: "hafsa-portfolio",
      title: "Hafsa Rashid Portfolio",
      period: "Mar 2026",
      description:
        "Neo-brutalist portfolio site for Hafsa Rashid, an AI student at FAST NUCES Karachi, with sections for her skills, experience, and machine learning and full-stack projects.",
      technologies: ["React", "Vite", "Tailwind CSS", "React Router"],
      highlights: ["Page loader, scroll-in animations and a custom cursor"],
      github: null,
      live: "https://hafsarashid.vercel.app",
      image: "/projects/hafsa-portfolio.jpg",
      category: "Web Design",
    },
    {
      id: "token-tracker",
      title: "Token Tracker",
      period: "Feb 2026",
      description:
        "VS Code extension plus admin dashboard that tracks GitHub Copilot usage and enforces monthly token budgets for each device.",
      technologies: ["TypeScript", "VS Code API", "Express", "Supabase", "React"],
      highlights: ["Published on the VS Code Marketplace"],
      github: "https://github.com/abdulrahmanazam/vs-code-extension-token-tracker",
      live: "https://marketplace.visualstudio.com/items?itemName=Abdul-Rahman-Azam.token-tracker-extension",
      image: null,
      category: "Dev Tools",
    },
    {
      id: "visionrag",
      title: "VisionRAG",
      period: "Oct – Dec 2025",
      description:
        "Multimodal RAG knowledge assistant that answers questions over documents and images using OCR, embeddings and Pinecone retrieval.",
      technologies: ["Python", "FastAPI", "Gemini", "Pinecone", "OCR", "RAG"],
      highlights: [
        "Indexed 1,000+ chunks from 20+ documents and images in Pinecone",
        "Tested across 100+ queries",
      ],
      github: null,
      live: null,
      image: null,
      category: "AI/ML",
    },
    {
      id: "big-five",
      title: "Big Five Personality Ontology",
      period: "Dec 2025",
      description:
        "IPIP-50 personality assessment whose questions, norms and scoring are loaded from an OWL ontology. Predicts job and academic performance and gives RAG-based guidance.",
      technologies: ["Python", "FastAPI", "OWL", "RAG", "React"],
      highlights: ["Questions, norms and scoring all come from the ontology"],
      github: "https://github.com/abdulrahmanazam/personality-traits-ontology",
      live: null,
      image: null,
      category: "AI/ML",
    },
    {
      id: "hammad-event-planner",
      title: "Hammad Shahid Event Planner",
      period: "Aug 2025",
      description:
        "Business website for Hammad Shahid (Maato Khan), a wedding and event planner in North Karachi, with his services, a gallery of past weddings and birthdays, client reviews and one-tap call and WhatsApp buttons.",
      technologies: ["React", "TypeScript", "Vite", "Tailwind CSS"],
      highlights: ["Call and WhatsApp buttons in the header plus a floating chat button"],
      github: null,
      live: "https://hammad-event-plannar.vercel.app",
      image: "/projects/hammad-event-planner.jpg",
      category: "Web Design",
    },
    {
      id: "university-platform",
      title: "University Resource Sharing Platform",
      period: "Jan – May 2025",
      description:
        "Full-stack university platform for resource sharing, community discussions, and moderated student collaboration.",
      technologies: ["React", "Node.js", "PostgreSQL", "REST APIs"],
      highlights: [
        "Role-based authentication and admin moderation",
        "Scalable relational database architecture",
      ],
      github: null,
      live: null,
      image: null,
      category: "Full Stack",
    },
    {
      id: "super-tictactoe",
      title: "Super Tic-Tac-Toe AI Game",
      period: "Apr – May 2025",
      description:
        "Web-based 9×9 Super Tic-Tac-Toe with intelligent decision-making and multi-board scoring.",
      technologies: ["JavaScript", "Game AI", "Minimax"],
      highlights: [
        "Minimax with Alpha-Beta Pruning optimization",
        "Complex multi-board game-state evaluation",
      ],
      github: null,
      live: null,
      image: null,
      category: "AI/ML",
    },
    {
      id: "2d-platformer",
      title: "2D Action Platformer Game",
      period: "Feb – May 2024",
      description:
        "High-performance 2D action platformer with advanced enemy behavior and weapon systems.",
      technologies: ["C++", "Game Development", "OOP"],
      highlights: [
        "Top 1% university project for creativity",
        "Advanced collision and physics handling",
      ],
      github: null,
      live: null,
      image: null,
      category: "Game Dev",
    },
    {
      id: "ai-tictactoe",
      title: "Unbeatable Tic-Tac-Toe AI",
      period: "Sep – Dec 2023",
      description:
        "Perfect-play Tic-Tac-Toe AI based on deterministic game theory.",
      technologies: ["C", "Algorithms", "Game Theory"],
      highlights: [
        "Provably optimal Minimax strategy",
        "Multiple gameplay modes supported",
      ],
      github: null,
      live: null,
      image: null,
      category: "AI/ML",
    },
  ],

  education: [
    {
      id: "fast",
      institution: "FAST NUCES Karachi",
      fullName: "National University of Computer and Emerging Sciences (FAST NUCES), Karachi",
      url: "https://www.nu.edu.pk/",
      degree: "BS in Artificial Intelligence",
      period: "Aug 2023 – Aug 2027",
      score: "CGPA: 3.08 / 4.0",
    },
    {
      id: "adamjee",
      institution: "Adamjee Government Science College",
      fullName: "Adamjee Government Science College, Karachi",
      url: null,
      degree: "Intermediate in Pre-Engineering",
      period: "2021 – 2023",
      score: "Grade: A+",
    },
    {
      id: "happy-palace",
      institution: "Happy Palace School",
      fullName: "Happy Palace School, Karachi",
      url: null,
      degree: "Matric in Computer Science",
      period: "2019 – 2021",
      score: "98.12%",
    },
  ],

  // Paid and teaching roles, newest first. `type` is the short label shown
  // beside the dates in the Experience section.
  experience: [
    {
      id: "ai-season",
      type: "Founder",
      role: "Founder & Lead Instructor",
      organization: "AI Season",
      url: "https://aiseason.tech",
      period: "Jul 2026 – Present",
      description:
        "Founded AI Season, a Pakistan-focused live bootcamp on AI agents: LangChain, LangGraph, RAG, tool calling and production deployment, taught in Urdu and English. Cohort 01 ran from 1 July to 12 August 2026.",
    },
    {
      id: "fast-wheels",
      type: "Founder",
      role: "Founder",
      organization: "FAST Wheels",
      url: "https://fastwheels.app",
      period: "Oct 2025 – Present",
      description:
        "Built and runs an AI carpooling platform on WhatsApp that matches 2,500+ FAST NUCES students by route and time.",
    },
    {
      id: "reon",
      type: "Internship",
      role: "AI/ML Intern",
      organization: "REON Energy",
      url: null,
      period: "Feb 2026 – May 2026",
      description:
        "Engineered rule-based AI decision workflows with LLM tool-calling, translating business constraints into deterministic approval logic.",
    },
    {
      id: "boxtech",
      type: "Contract · Remote",
      role: "Backend Engineer",
      organization: "BoxTech (Dubai)",
      url: null,
      period: "Jan 2026 – Feb 2026",
      description:
        "Developed and maintained backend APIs and server-side logic with cross-functional teams for production applications.",
    },
    {
      id: "fast-ta",
      type: "Teaching",
      role: "Student Lab Assistant (TA)",
      organization: "FAST NUCES Karachi",
      url: "https://www.nu.edu.pk/",
      period: "Jan 2025 – Dec 2025",
      description:
        "Taught and mentored 50+ students in Object-Oriented Programming and Programming Fundamentals, graded lab work and ran LeetCode-based problem-solving practice.",
    },
    {
      id: "ml-toppers",
      type: "Community",
      role: "Founder & Mentor",
      organization: "ML Toppers Community",
      url: null,
      period: "Jun 2025 – Aug 2025",
      description: "Ran live machine learning sessions for a community of 700+ members.",
    },
  ],

  // Student society roles at FAST NUCES Karachi.
  leadership: [
    {
      id: "procom",
      society: "PROCOM",
      metric: { value: "700+", label: "participants" },
      role: "AI Competitions Head",
      organization: "PROCOM, FAST NUCES Karachi",
      period: "Oct 2025 – Jun 2026",
      description: "Led 7 module teams that designed and ran AI competitions for 700+ participants.",
    },
    {
      id: "acm-ai",
      society: "ACM-AI",
      metric: { value: "300+", label: "students mentored" },
      role: "Machine Learning Head",
      organization: "ACM-AI, FAST NUCES Karachi",
      period: "Oct 2025 – Jun 2026",
      description: "Ran machine learning workshops and mentored 300+ students in applied AI and research.",
    },
    {
      id: "ieee",
      society: "IEEE",
      metric: { value: "70%", label: "less manual work" },
      role: "Automation Head",
      organization: "IEEE, FAST NUCES Karachi",
      description: "Automated emails and event coordination for 300+ participants, cutting manual work by 70%.",
    },
    {
      id: "dsc",
      society: "Developer Student Club",
      metric: { value: "200+", label: "students trained" },
      role: "Cryptocurrency Head",
      organization: "Developer Student Club, FAST NUCES Karachi",
      description: "Ran blockchain workshops and trading simulations for 200+ students.",
    },
  ],

  // Competition results, newest first. Source: GitHub profile README and resume.
  awards: [
    { placement: "Winner", event: "Iterate '26", host: "Salim Habib University", date: "Apr 2026" },
    { placement: "Winner", event: "BWAI Hackathon", host: "GDG on Campus, DHA Suffa University", date: "Apr 2026" },
    { placement: "3rd Place", event: "National AI Hackathon '26", host: "atomcamp", date: "Apr 2026" },
    { placement: "3rd Place", event: "Zab E-Fest '26", host: "SZABIST Karachi", date: "May 2026" },
    { placement: "Winner", event: "JS Bank Hackathon", host: "PROCOM '26, FAST NUCES", date: "Feb 2026" },
    { placement: "Winner", event: "AI App Development", host: "Teknofest Karachi '26", date: "Jan 2026" },
    { placement: "Runner-up", event: "Web Development", host: "IBA Hackathon, Karachi", date: "Jan 2026" },
    { placement: "Winner", event: "Pitch Warriors", host: "Coders Cup '25, ACM NUCES FAST", date: "Nov 2025" },
    { placement: "2nd Place", event: "Debugging Competition", host: "Coders Cup '25, ACM NUCES FAST", date: null },
    { placement: "3rd Place", event: "Competitive Programming", host: "Coders Cup '25, ACM NUCES FAST", date: "Oct 2025" },
    { placement: "Winner", event: "Marketing Maestro", host: "FES Fest, FAST NUCES", date: "Feb 2025" },
    { placement: "3rd Place", event: "Asaani.io Hackathon (72 hours)", host: "Asaani.io, NASTP Karachi", date: null },
    { placement: "2nd Place", event: "Web Hunt", host: "FAST NUCES", date: null },
  ],

  achievements: [
    {
      id: "hackathon-wins",
      title: "Hackathon Wins",
      description:
        "Won 10+ national hackathons, including Iterate '26 (Salim Habib University), the JS Bank Hackathon at PROCOM '26, the BWAI Hackathon (GDG on Campus, DHA Suffa) and AI App Development at Teknofest Karachi '26.",
      icon: "trophy",
    },
    {
      id: "hackathon-podiums",
      title: "Hackathon Podiums",
      description:
        "Runner-up in IBA Hackathon Web Development; 3rd at the atomcamp National AI Hackathon '26, Zab E-Fest '26 and the Asaani.io Hackathon at NASTP.",
      icon: "trophy",
    },
    {
      id: "coders-cup",
      title: "Coders Cup & FAST Competitions",
      description:
        "Won Pitch Warriors at Coders Cup '25 and Marketing Maestro at FES Fest; 2nd in Debugging and 3rd in Competitive Programming at Coders Cup '25; 2nd in Web Hunt.",
      icon: "trophy",
    },
    {
      id: "leetcode",
      title: "LeetCode Achievement",
      description:
        "Solved 300+ problems on LeetCode (140 easy, 133 medium, 30 hard) and earned 6 badges in algorithms and data structures.",
      icon: "code",
    },
    {
      id: "hackerrank",
      title: "HackerRank Certifications",
      description:
        "Achieved Problem Solving – Basic & Intermediate certifications on HackerRank.",
      icon: "certificate",
    },
    {
      id: "chatgpt",
      title: "ChatGPT Certification",
      description:
        "Completed ChatGPT for Everyone (Learn Prompting) certification.",
      icon: "sparkles",
    },
  ],

  // Answer-first Q&A. Rendered on the home page and emitted as FAQPage schema,
  // so AI answer engines can lift a clean answer for each question.
  faqs: [
    {
      question: "Who is Abdul Rahman Azam?",
      answer:
        "Abdul Rahman Azam is a Full Stack AI Engineer from Karachi, Pakistan. He is the founder of FAST Wheels, an AI carpooling platform on WhatsApp, and of AI Season, a live AI agents bootcamp for Pakistani students. He is studying for a BS in Artificial Intelligence at FAST NUCES Karachi (2023–2027). He is not to be confused with Abdul Rahman Hassan Azzam (1893–1976), the Egyptian diplomat.",
    },
    {
      question: "What does Abdul Rahman Azam work on?",
      answer:
        "He builds AI products end to end: AI agents and multi-agent systems (LangGraph, LangChain, Google ADK), MCP servers, WhatsApp bots and full-stack web apps with React, Node.js, Python and FastAPI. His projects include FastVerse, FAST Wheels, Sir Jee and CivicLens.",
    },
    {
      question: "Where does Abdul Rahman Azam study?",
      answer:
        "He is pursuing a Bachelor of Science in Artificial Intelligence at FAST NUCES (National University of Computer and Emerging Sciences), Karachi, from August 2023 to August 2027.",
    },
    {
      question: "What is AI Season?",
      answer:
        "AI Season is a Pakistan-focused live online bootcamp on AI agents, founded and taught by Abdul Rahman Azam. It covers LangChain, LangGraph, RAG, tool calling, guardrails and production deployment in Urdu and English. Details are at aiseason.tech.",
    },
    {
      question: "What hackathons has Abdul Rahman Azam won?",
      answer:
        "He has won 10+ national hackathons, including Iterate '26 at Salim Habib University, the JS Bank Hackathon at PROCOM '26, the BWAI Hackathon at DHA Suffa University and AI App Development at Teknofest Karachi '26, and placed runner-up or 3rd at the IBA Hackathon, atomcamp National AI Hackathon '26, Zab E-Fest '26 and the Asaani.io Hackathon.",
    },
    {
      question: "Does Abdul Rahman Azam offer SEO services?",
      answer:
        "Yes. He offers technical SEO, AEO (answer engine optimization) and GEO (generative engine optimization) for personal brands, startups and businesses, so they show up on Google and in AI answers from ChatGPT, Gemini, Perplexity and Claude. See abdulrahmanazam.me/services.",
    },
    {
      question: "How can I contact Abdul Rahman Azam?",
      answer:
        "Email azamabdulrahman930@gmail.com, message him on LinkedIn (linkedin.com/in/abdulrahmanazam), or book a free 30-minute call at calendly.com/azamabdulrahman930/30min.",
    },
  ],

  // SEO / AEO / GEO services shown on /services.
  services: [
    {
      id: "technical-seo",
      name: "Technical SEO Audit & Fixes",
      summary:
        "A full crawl of your site the way Googlebot and Bingbot see it, then the fixes shipped in code.",
      deliverables: [
        "Indexing, canonical, redirect and sitemap fixes",
        "Core Web Vitals (LCP, INP, CLS) performance work",
        "Metadata, Open Graph and social preview images",
        "Search Console and Bing Webmaster Tools setup",
      ],
    },
    {
      id: "geo-aeo",
      name: "AI Search Optimization (GEO & AEO)",
      summary:
        "Get cited when people ask ChatGPT, Gemini, Perplexity, Claude or Google AI Overviews about you or your niche.",
      deliverables: [
        "AI crawler access (GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot)",
        "llms.txt and llms-full.txt knowledge files",
        "Answer-first content and FAQ blocks that models can quote",
        "Before/after AI visibility checks for your key questions",
      ],
    },
    {
      id: "entity-seo",
      name: "Personal Brand & Entity SEO",
      summary:
        "Make search engines understand exactly who you are, so your name search shows your site, photo and profiles.",
      deliverables: [
        "Person, Organization and ProfilePage structured data",
        "sameAs linking across LinkedIn, GitHub and other profiles",
        "Name disambiguation from people with similar names",
        "Knowledge panel and Wikidata readiness plan",
      ],
    },
    {
      id: "content-seo",
      name: "Content & Blog SEO",
      summary:
        "Articles structured to rank on Google and to be quoted by AI answer engines.",
      deliverables: [
        "Keyword and question research for your audience",
        "BlogPosting schema, breadcrumbs and internal linking",
        "Per-article social images and RSS feed",
        "IndexNow submission on every publish",
      ],
    },
  ],

  social: {
    github: "https://github.com/abdulrahmanazam",
    linkedin: "https://www.linkedin.com/in/abdulrahmanazam/",
    leetcode: "https://leetcode.com/abdulrahmanazam",
    aiSeason: "https://aiseason.tech/abdul-rahman-azam",
    instagram: "https://www.instagram.com/abdulrahmanazam.ai/",
    vscodeMarketplace: "https://marketplace.visualstudio.com/publishers/Abdul-Rahman-Azam",
    calendly: "https://calendly.com/azamabdulrahman930/30min",
    email: "azamabdulrahman930@gmail.com",
  },
};

// ─── Shared constants ───────────────────────────────────────────────────────

const SITE = portfolioData.siteUrl;

// Bump when content changes; used for dateModified, sitemap lastmod and llms.txt.
export const LAST_UPDATED = "2026-09-23";

export const PROFILE_IMAGE = {
  portrait: `${SITE}/abdul-rahman-azam.jpg`,
  square: `${SITE}/abdul-rahman-azam-square.jpg`,
  alt: "Abdul Rahman Azam, Full Stack AI Engineer from Karachi, Pakistan",
};

export const personRef = { "@id": `${SITE}/#person` };

export const sameAsLinks = [
  portfolioData.social.linkedin,
  portfolioData.social.github,
  portfolioData.social.leetcode,
  portfolioData.social.aiSeason,
  portfolioData.social.vscodeMarketplace,
  portfolioData.social.instagram,
];

// ─── Person Schema ──────────────────────────────────────────────────────────

const getPersonSchema = () => ({
  "@type": "Person",
  "@id": `${SITE}/#person`,
  name: portfolioData.name,
  givenName: "Abdul Rahman",
  familyName: "Azam",
  alternateName: ["abdulrahmanazam", "Abdul Rahman Azam FAST NUCES"],
  disambiguatingDescription:
    "Abdul Rahman Azam is a Full Stack AI Engineer from Karachi, Pakistan, founder of FAST Wheels and AI Season, and a BS Artificial Intelligence student at FAST NUCES Karachi. Not to be confused with Abdul Rahman Hassan Azzam, the Egyptian diplomat.",
  gender: "Male",
  url: `${SITE}/`,
  image: [
    {
      "@type": "ImageObject",
      "@id": `${SITE}/#personimage`,
      url: PROFILE_IMAGE.square,
      contentUrl: PROFILE_IMAGE.square,
      width: 600,
      height: 600,
      caption: PROFILE_IMAGE.alt,
    },
    {
      "@type": "ImageObject",
      url: PROFILE_IMAGE.portrait,
      contentUrl: PROFILE_IMAGE.portrait,
      width: 800,
      height: 1034,
      caption: PROFILE_IMAGE.alt,
    },
  ],
  jobTitle: portfolioData.title,
  description:
    "Abdul Rahman Azam is a Full Stack AI Engineer from Karachi, Pakistan. He founded FAST Wheels, an AI carpooling platform on WhatsApp used by 2,500+ FAST NUCES students, and AI Season, a live AI agents bootcamp for Pakistani students. He builds AI agents, MCP servers and full-stack apps with React, Node.js, Python and FastAPI, has worked as an AI/ML intern at REON Energy, has won hackathons including Iterate '26, the PROCOM '26 JS Bank Hackathon, the BWAI Hackathon and Teknofest Karachi '26, and is studying for a BS in Artificial Intelligence at FAST NUCES Karachi (2023–2027).",
  email: `mailto:${portfolioData.social.email}`,
  nationality: { "@type": "Country", name: "Pakistan" },
  homeLocation: {
    "@type": "Place",
    name: "Karachi, Sindh, Pakistan",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Karachi",
      addressRegion: "Sindh",
      addressCountry: "PK",
    },
  },
  sameAs: sameAsLinks,
  worksFor: [{ "@id": `${SITE}/#ai-season` }, { "@id": `${SITE}/#fast-wheels` }],
  affiliation: { "@id": `${SITE}/#fast-nuces` },
  alumniOf: portfolioData.education.map((edu) => ({
    "@type": edu.id === "fast" ? "CollegeOrUniversity" : "EducationalOrganization",
    ...(edu.id === "fast" ? { "@id": `${SITE}/#fast-nuces` } : {}),
    name: edu.fullName,
    ...(edu.url ? { url: edu.url } : {}),
  })),
  hasOccupation: {
    "@type": "Occupation",
    name: portfolioData.title,
    occupationalCategory: "15-1252.00 Software Developers",
    skills:
      "AI agents, LangGraph, LangChain, RAG, MCP servers, machine learning, React, Node.js, Python, FastAPI, MongoDB, PostgreSQL, Supabase, Docker, technical SEO, generative engine optimization",
  },
  knowsAbout: [
    "Artificial Intelligence",
    "AI Agents",
    "Multi-agent Systems",
    "Model Context Protocol (MCP)",
    "Retrieval-Augmented Generation (RAG)",
    "LangChain",
    "LangGraph",
    "Machine Learning",
    "Full Stack Development",
    "React",
    "Node.js",
    "Python",
    "FastAPI",
    "Search Engine Optimization",
    "Generative Engine Optimization",
    "Answer Engine Optimization",
  ],
  knowsLanguage: ["English", "Urdu"],
  award: portfolioData.awards.map(
    (a) => `${a.placement}, ${a.event} (${a.host}${a.date ? `, ${a.date}` : ""})`
  ),
  hasCredential: [
    {
      "@type": "EducationalOccupationalCredential",
      name: "Problem Solving (Basic)",
      credentialCategory: "certificate",
      recognizedBy: { "@type": "Organization", name: "HackerRank", url: "https://www.hackerrank.com/" },
    },
    {
      "@type": "EducationalOccupationalCredential",
      name: "Problem Solving (Intermediate)",
      credentialCategory: "certificate",
      recognizedBy: { "@type": "Organization", name: "HackerRank", url: "https://www.hackerrank.com/" },
    },
    {
      "@type": "EducationalOccupationalCredential",
      name: "ChatGPT for Everyone",
      credentialCategory: "certificate",
      recognizedBy: { "@type": "Organization", name: "Learn Prompting", url: "https://learnprompting.org/" },
    },
  ],
  mainEntityOfPage: { "@id": `${SITE}/#profilepage` },
});

// ─── Organizations he founded / studies at ──────────────────────────────────

const getOrganizationSchemas = () => [
  {
    "@type": "EducationalOrganization",
    "@id": `${SITE}/#ai-season`,
    name: "AI Season",
    url: "https://aiseason.tech/",
    description:
      "Pakistan-focused live online bootcamp on AI agents, LangChain, LangGraph, RAG and production deployment, taught in Urdu and English.",
    foundingDate: "2026-07-01",
    founder: personRef,
    areaServed: { "@type": "Country", name: "Pakistan" },
  },
  {
    "@type": "Organization",
    "@id": `${SITE}/#fast-wheels`,
    name: "FAST Wheels",
    url: "https://fastwheels.app/",
    description: "AI carpooling platform on WhatsApp for FAST NUCES students in Karachi.",
    foundingDate: "2025-10",
    founder: personRef,
    areaServed: { "@type": "City", name: "Karachi" },
  },
  {
    "@type": "CollegeOrUniversity",
    "@id": `${SITE}/#fast-nuces`,
    name: "National University of Computer and Emerging Sciences (FAST NUCES), Karachi",
    alternateName: "FAST NUCES Karachi",
    url: "https://www.nu.edu.pk/",
  },
];

// ─── WebSite Schema ─────────────────────────────────────────────────────────

const getWebsiteSchema = () => ({
  "@type": "WebSite",
  "@id": `${SITE}/#website`,
  name: portfolioData.name,
  alternateName: `${portfolioData.name} Portfolio`,
  url: `${SITE}/`,
  inLanguage: "en",
  description: portfolioData.description,
  publisher: personRef,
  author: personRef,
});

// ─── ProfilePage Schema ─────────────────────────────────────────────────────

const getProfilePageSchema = () => ({
  "@type": "ProfilePage",
  "@id": `${SITE}/#profilepage`,
  url: `${SITE}/`,
  name: `${portfolioData.name} | ${portfolioData.title}`,
  isPartOf: { "@id": `${SITE}/#website` },
  mainEntity: personRef,
  about: personRef,
  primaryImageOfPage: { "@id": `${SITE}/#personimage` },
  image: PROFILE_IMAGE.square,
  dateCreated: "2025-01-01",
  dateModified: LAST_UPDATED,
  inLanguage: "en",
  breadcrumb: { "@id": `${SITE}/#breadcrumb` },
});

// ─── BreadcrumbList Schema ──────────────────────────────────────────────────

export const getBreadcrumbSchema = (items, id = `${SITE}/#breadcrumb`) => ({
  "@type": "BreadcrumbList",
  "@id": id,
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

// ─── ItemList Schema (Projects) ─────────────────────────────────────────────

const getProjectsItemListSchema = () => ({
  "@type": "ItemList",
  "@id": `${SITE}/#projects`,
  name: `Projects by ${portfolioData.name}`,
  numberOfItems: portfolioData.projects.length,
  itemListElement: portfolioData.projects.map((project, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "CreativeWork",
      name: project.title,
      description: project.description,
      url: project.live || project.github || `${SITE}/#projects`,
      creator: personRef,
      keywords: project.technologies.join(", "),
      ...(project.image ? { image: `${SITE}${project.image}` } : {}),
    },
  })),
});

// ─── FAQPage Schema ─────────────────────────────────────────────────────────

const getFaqSchema = () => ({
  "@type": "FAQPage",
  "@id": `${SITE}/#faq`,
  isPartOf: { "@id": `${SITE}/#website` },
  about: personRef,
  mainEntity: portfolioData.faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
});

// ─── Combined @graph (home page) ────────────────────────────────────────────

export const getStructuredDataGraph = () => ({
  "@context": "https://schema.org",
  "@graph": [
    getPersonSchema(),
    ...getOrganizationSchemas(),
    getWebsiteSchema(),
    getProfilePageSchema(),
    getBreadcrumbSchema([{ name: "Home", url: `${SITE}/` }]),
    getProjectsItemListSchema(),
    getFaqSchema(),
  ],
});

// ─── Blog schemas ───────────────────────────────────────────────────────────

export const getBlogIndexSchema = (posts) => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Blog",
      "@id": `${SITE}/blog#blog`,
      url: `${SITE}/blog`,
      name: `${portfolioData.name}'s Blog`,
      description: `Articles on AI engineering, full-stack development and SEO by ${portfolioData.name}.`,
      inLanguage: "en",
      author: personRef,
      publisher: personRef,
      isPartOf: { "@id": `${SITE}/#website` },
      blogPost: posts.map((post) => ({
        "@type": "BlogPosting",
        headline: post.title,
        url: `${SITE}/blog/${post.slug}`,
        datePublished: post.date,
        dateModified: post.updated || post.date,
        author: personRef,
      })),
    },
    getBreadcrumbSchema(
      [
        { name: "Home", url: `${SITE}/` },
        { name: "Blog", url: `${SITE}/blog` },
      ],
      `${SITE}/blog#breadcrumb`
    ),
  ],
});

export const getBlogPostSchema = (post) => {
  const url = `${SITE}/blog/${post.slug}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        headline: post.title,
        description: post.excerpt,
        url,
        mainEntityOfPage: url,
        image: `${url}/opengraph-image`,
        datePublished: post.date,
        dateModified: post.updated || post.date,
        inLanguage: "en",
        keywords: post.tags.join(", "),
        author: {
          "@type": "Person",
          "@id": `${SITE}/#person`,
          name: portfolioData.name,
          url: `${SITE}/`,
          image: PROFILE_IMAGE.square,
          sameAs: sameAsLinks,
        },
        publisher: personRef,
        isPartOf: { "@id": `${SITE}/blog#blog` },
        breadcrumb: { "@id": `${url}#breadcrumb` },
      },
      getBreadcrumbSchema(
        [
          { name: "Home", url: `${SITE}/` },
          { name: "Blog", url: `${SITE}/blog` },
          { name: post.title, url },
        ],
        `${url}#breadcrumb`
      ),
    ],
  };
};

// ─── Services schema (/services) ────────────────────────────────────────────

export const getServicesSchema = () => {
  const url = `${SITE}/services`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: `SEO, AEO & GEO Services | ${portfolioData.name}`,
        isPartOf: { "@id": `${SITE}/#website` },
        about: personRef,
        breadcrumb: { "@id": `${url}#breadcrumb` },
        inLanguage: "en",
      },
      {
        "@type": "ProfessionalService",
        "@id": `${url}#service`,
        name: `${portfolioData.name} – SEO, AEO & GEO Services`,
        url,
        image: PROFILE_IMAGE.square,
        email: portfolioData.social.email,
        founder: personRef,
        provider: personRef,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Karachi",
          addressRegion: "Sindh",
          addressCountry: "PK",
        },
        areaServed: "Worldwide",
        knowsAbout: [
          "Technical SEO",
          "Generative Engine Optimization",
          "Answer Engine Optimization",
          "Structured Data",
          "Core Web Vitals",
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "SEO, AEO & GEO services",
          itemListElement: portfolioData.services.map((service) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              "@id": `${url}#${service.id}`,
              name: service.name,
              description: service.summary,
              provider: personRef,
            },
          })),
        },
      },
      getBreadcrumbSchema(
        [
          { name: "Home", url: `${SITE}/` },
          { name: "Services", url },
        ],
        `${url}#breadcrumb`
      ),
    ],
  };
};

export { getPersonSchema as getJsonLdSchema };
