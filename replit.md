# Abdul Rahman Azam - AI/ML Portfolio

## Overview
A modern, responsive portfolio website showcasing Abdul Rahman Azam's expertise in Artificial Intelligence, Machine Learning, and Full-Stack Development. Features stunning 3D animations powered by Three.js to demonstrate advanced web development skills.

## Purpose
- Showcase AI/ML projects and achievements
- Demonstrate full-stack development capabilities
- Attract AI/ML job opportunities
- Highlight technical skills through interactive animations

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Three.js** for 3D neural network animations
- **Tailwind CSS** for styling
- **Framer Motion concepts** for scroll animations
- **Wouter** for routing
- **Lucide React** for icons
- **Shadcn UI** for component library

### Backend
- **Express.js** server
- **Vite** for development and building

## Key Features

### 1. Hero Section
- Full-screen 3D neural network background animation
- Animated particle system with connecting lines
- Smooth camera movements
- Performance-optimized with geometry instancing

### 2. Skills Section
- Two-column layout: Web Development & AI/ML
- Animated skill bars with proficiency percentages
- Scroll-triggered animations with stagger effect
- Monospace font for technical appeal

### 3. Projects Showcase
- 5 featured projects with detailed descriptions
- Technology stack badges
- Key highlights for each project
- Asymmetric card layouts for visual interest
- Scroll-triggered fade-in animations

### 4. Education Timeline
- Vertical timeline with animated line drawing
- Three educational milestones
- FAST NUCES, Adamjee Govt. College, Happy Palace School
- Alternating left/right layout on desktop

### 5. Achievements & Certifications
- Grid layout with icon cards
- LeetCode, competitions, HackerRank, ChatGPT certifications
- Scroll-triggered staggered entrance animations

### 6. Resume Section
- Download resume functionality
- Social media links (GitHub, LinkedIn, LeetCode, Email)
- Clean, focused call-to-action design

## Performance Optimizations

### 3D Rendering
- Geometry instancing to reduce draw calls
- Limited particle count (40 nodes) for smooth 60fps
- RequestAnimationFrame with proper cleanup
- Respects prefers-reduced-motion media query
- Proper disposal of geometries and materials on unmount

### Animations
- Intersection Observer for scroll-triggered animations
- CSS transforms for better performance
- Lazy loading of 3D scenes
- Throttled animation updates

## Design System

### Colors
- Primary: Blue accent color (217° hue)
- Background: Light (98% lightness) / Dark (8% lightness)
- Semantic colors for cards, borders, muted text

### Typography
- **Primary Font**: Inter (sans-serif)
- **Monospace Font**: JetBrains Mono (for technical content)
- Hierarchy: H1 (4xl-7xl), H2 (3xl-5xl), H3 (2xl), Body (base-lg)

### Spacing
- Consistent rhythm using Tailwind units (4, 8, 12, 16, 20, 24)
- Section padding: py-20 (desktop), py-12 (mobile)
- Card padding: p-6 to p-8

## Project Structure

```
client/
├── src/
│   ├── components/
│   │   ├── NeuralNetworkBackground.tsx  # 3D Three.js animation
│   │   ├── Navigation.tsx               # Fixed header with smooth scroll
│   │   ├── Hero.tsx                     # Hero section with CTA
│   │   ├── Skills.tsx                   # Skills with animated bars
│   │   ├── Projects.tsx                 # Project cards
│   │   ├── Education.tsx                # Timeline component
│   │   ├── Achievements.tsx             # Achievement cards
│   │   ├── Resume.tsx                   # Resume download & contact
│   │   └── Footer.tsx                   # Footer with social links
│   ├── pages/
│   │   ├── Portfolio.tsx                # Main portfolio page
│   │   └── not-found.tsx                # 404 page
│   ├── App.tsx                          # App router
│   └── index.css                        # Global styles
├── shared/
│   └── schema.ts                        # Portfolio data & types
└── server/
    ├── routes.ts                        # API routes (future)
    └── storage.ts                       # Data storage (future)
```

## Responsive Design
- Mobile-first approach
- Breakpoints: Mobile (<768px), Tablet (768-1023px), Desktop (1024px+)
- Simplified 3D on mobile for performance
- Single-column layouts on mobile, multi-column on desktop

## Accessibility
- Semantic HTML structure
- ARIA labels for icon buttons
- Keyboard navigation support
- Sufficient color contrast
- Respects user motion preferences
- Screen reader friendly

## Future Enhancements
- Contact form with backend integration
- Blog section for AI/ML articles
- Interactive 3D project previews
- Dark mode toggle
- Downloadable PDF resume generation

## Development

### Running Locally
```bash
npm install
npm run dev
```

### Building for Production
```bash
npm run build
```

## Portfolio Owner
**Abdul Rahman Azam**
- BS in Artificial Intelligence, FAST NUCES Karachi
- 5th Semester, CGPA: 3.33
- 290+ LeetCode problems solved
- Competition winner (2nd place Web Hunt, 3rd place ACM Coders Cup)

## Contact
- GitHub: https://github.com/abdulrahmanazam
- LinkedIn: https://linkedin.com/in/abdulrahmanazam
- LeetCode: https://leetcode.com/abdulrahmanazam
- Email: abdulrahman.azam@example.com

## Setup Instructions

### Adding Your Resume
1. Replace `client/public/Abdul_Rahman_Azam_Resume.pdf` with your actual PDF resume
2. Keep the filename the same or update it in `client/src/components/Resume.tsx`
3. The resume will be automatically served as a static asset by Vite

### Customizing Portfolio Data
- Edit `shared/schema.ts` to update:
  - Personal information
  - Skills and proficiency levels
  - Projects and their details
  - Education timeline
  - Achievements and certifications
  - Social media links

  // "dev": "cross-env NODE_ENV=development node server/index.js",