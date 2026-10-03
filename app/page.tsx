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
import Spotlight from "@/components/Spotlight";
import BackToTop from "@/components/BackToTop";

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-7xl flex-1">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-background"
      >
        Skip to content
      </a>
      <ScrollProgress />
      <Spotlight />
      <BackToTop />
      <Sidebar />
      <main id="content" className="px-6 sm:px-10 lg:ml-[19rem] lg:px-16 xl:ml-[22rem] xl:px-24">
        <MobileNav />
        <Hero />
        <About />
        <Experience />
        <FeaturedProject />
        <Projects />
        <Contact />
        <Footer />
      </main>
    </div>
  );
}
