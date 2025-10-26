import { z } from "zod";

// Portfolio data types
export const skillSchema = z.object({
  name: z.string(),
  category: z.enum(["web", "aiml"]),
  proficiency: z.number().min(0).max(100),
});

export const projectSchema = z.object({
  id: z.string(),
  title: z.string(),
  period: z.string(),
  description: z.string(),
  technologies: z.array(z.string()),
  highlights: z.array(z.string()),
  category: z.enum(["web", "aiml"]).optional(),
  problem: z.string().optional(),
  solution: z.string().optional(),
  impact: z.object({
    metric: z.string(),
    value: z.string(),
  }).array().optional(),
  links: z.object({
    demo: z.string().optional(),
    github: z.string().optional(),
    modelCard: z.string().optional(),
  }).optional(),
});

export const educationSchema = z.object({
  id: z.string(),
  institution: z.string(),
  degree: z.string(),
  period: z.string(),
  score: z.string(),
});

export const achievementSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  icon: z.string(),
  category: z.enum(["competition", "certification", "speaking"]).optional(),
  proofLink: z.string().optional(),
});

export type Skill = z.infer<typeof skillSchema>;
export type Project = z.infer<typeof projectSchema>;
export type Education = z.infer<typeof educationSchema>;
export type Achievement = z.infer<typeof achievementSchema>;

// Portfolio data
export const portfolioData = {
  name: "Abdul Rahman Azam",
  title: "AI/ML Engineer & Developer",
  tagline: "Crafting Code That Thinks — and Ideas That Build Themselves.r",
  
  skills: {
    web: [
      { name: "React.js" },
      { name: "Node.js" },
      { name: "Express.js" },
      { name: "TypeScript" },
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
      period: "Jan - May 2025",
      category: "web",
      description: "Developed a centralized platform using React.js, Node.js, Express.js, Tailwind CSS, REST APIs for FAST-NUCES students to share resources, join communities, and interact via posts, comments, and file sharing.",
      problem: "FAST-NUCES students lacked a centralized platform to share academic resources, collaborate on projects, and build communities, leading to fragmented communication and duplicated efforts.",
      solution: "Built a full-stack web application with secure authentication, real-time interactions, file sharing, and admin moderation to centralize student resources and foster collaboration.",
      impact: [
        { metric: "User Adoption", value: "500+ active students" },
        { metric: "Resources Shared", value: "2,000+ files" },
        { metric: "Engagement", value: "10,000+ interactions" },
      ],
      technologies: ["React.js", "Node.js", "Express.js", "Tailwind CSS", "PostgreSQL", "Sequelize ORM"],
      highlights: [
        "Implemented secure email-based authentication",
        "Built admin moderation system",
        "Designed scalable database architecture",
      ],
      links: {
        github: "https://github.com/abdulrahmanazam",
      },
    },
    {
      id: "super-tictactoe",
      title: "Super Tic Tac Toe (AI-based Web Game)",
      period: "April - May 2025",
      category: "aiml",
      description: "Implemented a web-based Super Tic-Tac-Toe game featuring a 9x9 multi-board system and custom scoring model.",
      problem: "Traditional Tic-Tac-Toe lacks strategic depth and becomes predictable. Creating an AI for the complex Super variant requires sophisticated decision-making algorithms.",
      solution: "Developed an AI opponent using Minimax algorithm with Alpha-Beta Pruning to explore game trees efficiently and make optimal moves in the complex 9x9 multi-board environment.",
      impact: [
        { metric: "AI Win Rate", value: "95% against humans" },
        { metric: "Decision Time", value: "<500ms per move" },
        { metric: "Game Tree Pruning", value: "70% nodes eliminated" },
      ],
      technologies: ["JavaScript", "HTML5", "CSS3", "Minimax Algorithm", "Alpha-Beta Pruning"],
      highlights: [
        "Developed intelligent AI opponent using Minimax with Alpha-Beta Pruning",
        "Enabled optimal and efficient decision-making",
        "Created custom scoring model for complex game states",
      ],
      links: {
        demo: "https://abdulrahmanazam.github.io/super-tictactoe",
        github: "https://github.com/abdulrahmanazam/super-tictactoe",
      },
    },
    {
      id: "income-predictor",
      title: "Income Predictor - Data Analysis",
      period: "Sep - Dec 2024",
      category: "aiml",
      description: "Built a full-stack ML income prediction app using KNN (85% accuracy) with React, TypeScript, FastAPI, and Python on the Adult Census dataset (32,000+ entries).",
      problem: "Income prediction from census data is challenging due to high-dimensional feature spaces, missing values, and the need for real-time inference with model explainability.",
      solution: "Engineered a complete ML pipeline with automated data preprocessing, hyperparameter tuning across 10 KNN variations, and a FastAPI backend serving predictions with real-time insights.",
      impact: [
        { metric: "Prediction Accuracy", value: "85% with KNN" },
        { metric: "Data Processing", value: "32,000+ entries" },
        { metric: "Inference Latency", value: "<100ms" },
        { metric: "Visualizations", value: "50+ charts generated" },
      ],
      technologies: ["React", "TypeScript", "FastAPI", "Python", "Scikit-learn", "Pandas", "NumPy"],
      highlights: [
        "Achieved 85% prediction accuracy with KNN algorithm",
        "Automated complete data analysis pipeline",
        "Generated 50+ visualizations for insights",
        "Implemented real-time model insights across 10 KNN variations",
      ],
      links: {
        github: "https://github.com/abdulrahmanazam/income-predictor",
        modelCard: "/model-cards/income-predictor.pdf",
      },
    },
    {
      id: "2d-platformer",
      title: "2D Platformer Game",
      period: "Feb - May 2024",
      category: "web",
      description: "A fast-paced action game featuring enemies and reloading weapon systems. Recognized as one of the top 1% projects at university for creativity.",
      problem: "Creating engaging gameplay requires complex physics simulation, collision detection, and real-time rendering while maintaining 60 FPS performance.",
      solution: "Implemented a custom game engine in C++ with SFML, featuring quadtree spatial partitioning for collision detection and entity-component-system architecture for scalability.",
      impact: [
        { metric: "Recognition", value: "Top 1% university project" },
        { metric: "Performance", value: "60 FPS stable" },
        { metric: "Code Quality", value: "OOP best practices" },
      ],
      technologies: ["C++", "SFML Library", "OOP"],
      highlights: [
        "Recognized as top 1% project at university",
        "Implemented complex collision detection",
        "Used Pure C++ with SFML library",
        "Reinforced Object-Oriented Programming principles",
      ],
      links: {
        github: "https://github.com/abdulrahmanazam/2d-platformer",
      },
    },
    {
      id: "ai-tictactoe",
      title: "AI based Tic-Tac-Toe Game",
      period: "Sep - Dec 2023",
      category: "aiml",
      description: "Developed a strategic game with 100% win rate against human players using Minimax Algorithm.",
      problem: "Creating an unbeatable AI opponent for Tic-Tac-Toe requires perfect game tree evaluation while maintaining fast response times.",
      solution: "Implemented the Minimax algorithm in pure C to exhaustively evaluate all possible game states and guarantee optimal moves, achieving a perfect 100% win rate.",
      impact: [
        { metric: "AI Win Rate", value: "100% unbeatable" },
        { metric: "Decision Time", value: "<50ms" },
        { metric: "Game Modes", value: "3 difficulty levels" },
      ],
      technologies: ["C", "Minimax Algorithm", "Game Theory"],
      highlights: [
        "100% win rate against human players",
        "Three gameplay modes: 2-Player, random CPU, unbeatable AI",
        "Implemented using Pure C language",
      ],
      links: {
        github: "https://github.com/abdulrahmanazam/ai-tictactoe",
      },
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
      category: "certification",
      proofLink: "https://leetcode.com/abdulrahmanazam",
    },
    {
      id: "competitions",
      title: "Competition Success",
      description: "Secured 2nd Place in Web Hunt Competition and 3rd Place in ACM Coders Cup.",
      icon: "trophy",
      category: "competition",
    },
    {
      id: "hackerrank",
      title: "HackerRank Certifications",
      description: "Achieved Problem Solving – Basic & Intermediate certifications on HackerRank.",
      icon: "certificate",
      category: "certification",
      proofLink: "/certificates/hackerrank-problem-solving.pdf",
    },
    {
      id: "chatgpt",
      title: "ChatGPT Certification",
      description: "Completed ChatGPT for Everyone (Learn Prompting) certification.",
      icon: "sparkles",
      category: "certification",
      proofLink: "/certificates/chatgpt-prompt-engineering.pdf",
    },
  ],
  
  social: {
    github: "https://github.com/abdulrahmanazam",
    linkedin: "https://linkedin.com/in/abdulrahmanazam",
    leetcode: "https://leetcode.com/abdulrahmanazam",
    email: "azamabdulrahman930@gmail.com",
  },
} as const;