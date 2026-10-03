import { getProjectImages, getProjects } from "@/lib/projects";
import ProjectList from "./ProjectList";
import SectionHeading from "./SectionHeading";

/** Renders the list from this build; ProjectList then keeps it current in the browser. */
export default async function Projects() {
  return (
    <section id="projects" className="scroll-mt-20 py-24">
      <SectionHeading section="projects" />
      <ProjectList built={await getProjects()} images={getProjectImages()} />
    </section>
  );
}
