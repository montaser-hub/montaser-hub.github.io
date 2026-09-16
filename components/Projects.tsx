import Reveal from "./Reveal";
import { getProjects } from "@/lib/projects";
import { ArrowUpRightIcon } from "./icons";

export default async function Projects() {
  const projects = await getProjects();

  return (
    <section id="projects" className="scroll-mt-20 py-24">
      <Reveal>
        <div className="mb-10 flex items-center gap-4">
          <h2 className="text-2xl font-semibold text-foreground">
            Other Projects
          </h2>
          <span className="h-px flex-1 bg-border" />
        </div>
      </Reveal>

      <div className="grid gap-5 sm:grid-cols-2">
        {projects.map((project, i) => (
          <Reveal key={project.name} delay={Math.min(i * 0.05, 0.3)}>
            <a
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full flex-col rounded-lg border border-border bg-surface p-6 transition-colors hover:border-muted-dim hover:bg-surface-hover"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-medium text-foreground">
                  {project.name}
                </h3>
                <ArrowUpRightIcon className="h-4 w-4 shrink-0 text-muted transition-colors group-hover:text-accent" />
              </div>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
                {project.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs text-muted-dim">
                {project.tech.map((tech) => (
                  <span key={tech}>{tech}</span>
                ))}
              </div>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
