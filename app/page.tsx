import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import FeaturedProject from "@/components/FeaturedProject";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import BackToTop from "@/components/BackToTop";
import TechIconSprite from "@/components/TechIconSprite";
import { sections, type SectionId } from "@/lib/sections";

/** What renders each section listed in lib/sections.ts; the page follows that list's order. */
const SECTION_VIEWS: Record<SectionId, React.ComponentType> = {
  about: About,
  experience: Experience,
  work: FeaturedProject,
  projects: Projects,
  contact: Contact,
};

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-7xl flex-1">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-background"
      >
        Skip to content
      </a>
      <TechIconSprite />
      <ScrollProgress />
      <BackToTop />
      <Sidebar />
      {/* Site navigation sits beside <main>, not in it, so screen readers list it as its own landmark. */}
      <MobileNav />
      <main id="content" className="pb-[calc(4rem+env(safe-area-inset-bottom))] px-6 sm:px-10 lg:ml-64 lg:pb-0 lg:px-12 xl:ml-72 xl:px-16">
        <Hero />
        {sections.map(({ id }) => {
          const View = SECTION_VIEWS[id];
          return <View key={id} />;
        })}
        <Footer />
      </main>
    </div>
  );
}
