/**
 * Portfolio Data - Abdul Rahman Azam
 * Full Stack AI Engineer Portfolio
 */

// Portfolio data
export const portfolioData = {
  name: "Abdul Rahman Azam",
  title: "Full Stack AI Engineer",
  tagline: "Crafting Code That Thinks — and Ideas That Build Themselves.",
  description: "Full Stack AI Engineer specializing in Machine Learning, Deep Learning, and modern web development. BS in Artificial Intelligence student at FAST NUCES with expertise in React, Node.js, Python, and AI/ML technologies.",
  
  // SEO Keywords
  keywords: [
    "Abdul Rahman Azam",
    "Full Stack AI Engineer",
    "AI ML Engineer",
    "Machine Learning Developer",
    "Deep Learning Engineer",
    "React Developer",
    "Node.js Developer",
    "Python Developer",
    "FAST NUCES",
    "Artificial Intelligence",
    "Web Developer Pakistan",
    "Portfolio"
  ],
  
  // Site URL for SEO
  siteUrl: "https://abdulrahmanazam.me",
  
  skills: {
    web: [
      { name: "React.js" },
      { name: "Node.js" },
      { name: "Express.js" },
      { name: "JavaScript" },
      { name: "Tailwind CSS" },
      { name: "PostgreSQL" },
      { name: "REST APIs" },
    ],
    aiml: [
      { name: "Python" },
      { name: "Machine Learning" },
      { name: "Deep Learning" },
      { name: "Scikit-learn" },
      { name: "Pandas & NumPy" },
      { name: "Data Visualization" },
    ],
  },
  
projects: [
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
    github: "https://github.com/abdulrahmanazam/university-platform",
    live: null,
    image: "/projects/university-platform.png",
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
    github: "https://github.com/abdulrahmanazam/super-tictactoe",
    live: null,
    image: "/projects/super-tictactoe.png",
    category: "AI/ML",
  },
  {
    id: "income-predictor",
    title: "Income Prediction System",
    period: "Sep – Dec 2024",
    description:
      "Machine learning system for income prediction using large-scale census data.",
    technologies: ["Python", "Machine Learning", "FastAPI"],
    highlights: [
      "85% accuracy on 32K+ real-world records",
      "Interactive analytics with multiple model variants",
    ],
    github: "https://github.com/abdulrahmanazam/income-predictor",
    live: null,
    image: "/projects/income-predictor.png",
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
    github: "https://github.com/abdulrahmanazam/2d-platformer",
    live: null,
    image: "/projects/2d-platformer.png",
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
    github: "https://github.com/abdulrahmanazam/ai-tictactoe",
    live: null,
    image: "/projects/ai-tictactoe.png",
    category: "AI/ML",
  },
],


  
  education: [
    {
      id: "fast",
      institution: "FAST NUCES Karachi",
      degree: "BS in Artificial Intelligence",
      period: "2021 - Present",
      score: "CGPA: 3.33",
    },
    {
      id: "adamjee",
      institution: "Adamjee Govt. College",
      degree: "Intermediate in Pre-Engineering",
      period: "2019 - 2021",
      score: "80%",
    },
    {
      id: "happy-palace",
      institution: "Happy Palace School",
      degree: "Matric in Computer Science",
      period: "2017 - 2019",
      score: "98.12%",
    },
  ],
  
  achievements: [
    {
      id: "leetcode",
      title: "LeetCode Achievement",
      description: "Solved 290+ problems on LeetCode and earned 6 skill badges, strengthening algorithms and data structures.",
      icon: "code",
    },
    {
      id: "competitions",
      title: "Competition Success",
      description: "Secured 2nd Place in Web Hunt Competition and 3rd Place in ACM Coders Cup.",
      icon: "trophy",
    },
    {
      id: "hackerrank",
      title: "HackerRank Certifications",
      description: "Achieved Problem Solving – Basic & Intermediate certifications on HackerRank.",
      icon: "certificate",
    },
    {
      id: "chatgpt",
      title: "ChatGPT Certification",
      description: "Completed ChatGPT for Everyone (Learn Prompting) certification.",
      icon: "sparkles",
    },
  ],
  
  social: {
    github: "https://github.com/abdulrahmanazam",
    linkedin: "https://linkedin.com/in/abdulrahmanazam",
    leetcode: "https://leetcode.com/abdulrahmanazam",
    email: "azamabdulrahman930@gmail.com",
  },
};

// JSON-LD Schema for SEO
export const getJsonLdSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Person",
  "name": portfolioData.name,
  "url": portfolioData.siteUrl,
  "image": `${portfolioData.siteUrl}/og-image.png`,
  "jobTitle": portfolioData.title,
  "description": portfolioData.description,
  "email": `mailto:${portfolioData.social.email}`,
  "sameAs": [
    portfolioData.social.github,
    portfolioData.social.linkedin,
    portfolioData.social.leetcode
  ],
  "alumniOf": {
    "@type": "CollegeOrUniversity",
    "name": "FAST NUCES Karachi"
  },
  "knowsAbout": [
    "Artificial Intelligence",
    "Machine Learning",
    "Deep Learning",
    "Full Stack Development",
    "React.js",
    "Node.js",
    "Python",
    "Data Science"
  ]
});

// Website Schema
export const getWebsiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": `${portfolioData.name} - Portfolio`,
  "url": portfolioData.siteUrl,
  "description": portfolioData.description,
  "author": {
    "@type": "Person",
    "name": portfolioData.name
  }
});
