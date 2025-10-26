import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { Skills } from '@/components/Skills';
import { Projects } from '@/components/Projects';
import { Process } from '@/components/Process';
import { Education } from '@/components/Education';
import { Achievements } from '@/components/Achievements';
import { Resume } from '@/components/Resume';
import { Footer } from '@/components/Footer';

export default function Portfolio() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <Hero />
        <Skills />
        <Projects />
        <Process />
        <Education />
        <Achievements />
        <Resume />
      </main>
      <Footer />
    </div>
  );
}