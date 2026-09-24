import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Skills } from "@/components/Skills";
import { Projects } from "@/components/Projects";
import { Experience } from "@/components/Experience";
import { Education } from "@/components/Education";
import { Achievements } from "@/components/Achievements";
import { FAQ } from "@/components/FAQ";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { ChatLauncher } from "@/components/ChatLauncher";
import { portfolioData, getStructuredDataGraph } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: `${portfolioData.name} | ${portfolioData.title} in Karachi`,
  absoluteTitle: true,
  path: "/",
  openGraph: {
    type: "profile",
    firstName: "Abdul Rahman",
    lastName: "Azam",
    username: "abdulrahmanazam",
    gender: "male",
  },
});

function SectionDivider() {
  return <div className="section-divider" aria-hidden="true" />;
}

// The whole page is Server Components: every section ships as HTML and only
// the small interactive islands (nav menu, theme toggle, search box, chat
// button, desktop-only effects) hydrate. Below-fold sections use
// content-visibility so phones skip laying them out until they scroll near.
export default function Home() {
  return (
    <>
      {/* Person, organizations, ProfilePage, projects and FAQ as one JSON-LD graph */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getStructuredDataGraph()) }}
      />
      <div className="min-h-screen">
        <Navigation />
        <main>
          <Hero />
          <SectionDivider />
          <About />
          <SectionDivider />
          <div className="section-deferred">
            <Skills />
          </div>
          <SectionDivider />
          {/* Not deferred: the sticky card stack needs normal layout to scroll correctly */}
          <Projects />
          <SectionDivider />
          <div className="section-deferred">
            <Experience />
          </div>
          <SectionDivider />
          <div className="section-deferred">
            <Education />
          </div>
          <SectionDivider />
          <div className="section-deferred">
            <Achievements />
          </div>
          <SectionDivider />
          <div className="section-deferred">
            <FAQ />
          </div>
          <SectionDivider />
          <div className="section-deferred">
            <Contact />
          </div>
        </main>
        <Footer />
        <ChatLauncher />
      </div>
    </>
  );
}
