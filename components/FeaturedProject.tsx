import Reveal from "./Reveal";
import { flagshipProject } from "@/lib/data";
import { ArrowUpRightIcon } from "./icons";

export default function FeaturedProject() {
  return (
    <section id="work" className="scroll-mt-20 py-24">
      <Reveal>
        <div className="mb-10 flex items-center gap-4">
          <h2 className="text-2xl font-semibold text-foreground">
            Featured Work
          </h2>
          <span className="h-px flex-1 bg-border" />
        </div>
      </Reveal>

      <Reveal delay={0.05}>
        <div className="rounded-xl border border-border bg-surface p-8 sm:p-10">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-wide text-accent">
                {flagshipProject.role}
              </p>
              <h3 className="mt-2 text-2xl font-semibold text-foreground">
                {flagshipProject.name}
              </h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {flagshipProject.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline flex items-center gap-1 text-sm font-medium text-foreground"
                >
                  {link.label}
                  <ArrowUpRightIcon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>

          <p className="mt-6 max-w-3xl text-base leading-relaxed text-muted">
            {flagshipProject.summary}
          </p>

          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {flagshipProject.highlights.map((point) => (
              <li
                key={point}
                className="flex gap-3 text-sm leading-relaxed text-muted"
              >
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                {point}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-2">
            {flagshipProject.tech.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-border bg-surface-hover px-3 py-1 font-mono text-xs text-muted"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
