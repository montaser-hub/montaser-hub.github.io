import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import FeaturedProject from "@/components/FeaturedProject";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-7xl flex-1">
      <Sidebar />
      <main className="px-6 sm:px-10 lg:ml-[19rem] lg:px-16 xl:ml-[22rem] xl:px-24">
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
