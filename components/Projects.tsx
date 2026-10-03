import Reveal from "./Reveal";
import { getProjects } from "@/lib/projects";
import type { Project } from "@/lib/types";
import ProjectCard from "./ProjectCard";
import SectionHeading from "./SectionHeading";
import { ArrowUpRightIcon } from "./icons";

/** One line per lab: course exercises and small studies, kept out of the card grid. */
function LabRow({ project }: { project: Project }) {
  return (
    <li className="grid gap-1 py-4 transition-opacity duration-200 sm:grid-cols-[14rem_1fr_auto] sm:items-baseline sm:gap-6 lg:group-hover/labs:opacity-50 lg:hover:!opacity-100">
      <h3 className="text-sm font-medium text-foreground">
        {project.href ? (
          <a
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline inline-flex items-center gap-1 py-1"
          >
            {project.name}
            <ArrowUpRightIcon className="h-3 w-3 text-muted" />
          </a>
        ) : (
          project.name
        )}
      </h3>
      <div>
        <p className="text-sm leading-relaxed text-muted">{project.description}</p>
        <p className="mt-1 font-mono text-xs text-muted-dim">{project.tech.join(" · ")}</p>
      </div>
      {project.demo && (
        <a
          href={project.demo}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 py-1.5 text-xs font-medium text-accent transition-colors duration-200 hover:text-foreground"
        >
          Live demo
          <ArrowUpRightIcon className="h-3 w-3" />
        </a>
      )}
    </li>
  );
}

export default async function Projects() {
  const projects = await getProjects();
  const selected = projects.filter((p) => p.tier === "selected");
  const labs = projects.filter((p) => p.tier !== "selected");

  return (
    <section id="projects" className="scroll-mt-20 py-24">
      <SectionHeading section="projects">Selected Projects</SectionHeading>

      <div className="grid gap-5 sm:grid-cols-2">
        {selected.map((project, i) => (
          <Reveal
            key={project.name}
            delay={Math.min(i * 0.05, 0.3)}
            className={project.image ? "self-start" : undefined}
          >
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>

      {labs.length > 0 && (
        <div className="mt-20">
          <SectionHeading>Learning &amp; Labs</SectionHeading>
          <Reveal>
            <ul className="group/labs divide-y divide-border border-y border-border">
              {labs.map((project) => (
                <LabRow key={project.name} project={project} />
              ))}
            </ul>
          </Reveal>
        </div>
      )}
    </section>
  );
}
