import Image from "next/image";
import type { Project } from "@/lib/types";
import { ArrowUpRightIcon } from "./icons";
import TechIcon from "./TechIcon";

function TechRow({ tech }: { tech: string[] }) {
  return (
    <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1.5 pt-4">
      {tech.map((item) => (
        <span
          key={item}
          className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-dim"
        >
          <TechIcon tech={item} className="h-3.5 w-3.5" />
          {item}
        </span>
      ))}
    </div>
  );
}

/**
 * Covers its (relatively positioned) parent so the whole surface opens the
 * repo. Pass `decorative` when the card already has an explicit GitHub link,
 * to keep it out of the tab order and accessibility tree.
 */
function StretchedRepoLink({ project, decorative }: { project: Project; decorative?: boolean }) {
  return (
    <a
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
      {...(decorative
        ? { tabIndex: -1, "aria-hidden": true }
        : { "aria-label": `${project.name} on GitHub` })}
      className="absolute inset-0 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
    />
  );
}

function DemoLink({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="relative z-10 -my-2 inline-flex items-center gap-1 py-2 text-xs font-medium text-accent hover:text-foreground focus-visible:text-foreground"
    >
      Live demo
      <ArrowUpRightIcon className="h-3 w-3" />
    </a>
  );
}

/** Context line such as "Client project · source private". */
function Note({ children }: { children: string }) {
  return (
    <p className="mt-1 font-mono text-xs uppercase tracking-wide text-accent-dim">
      {children}
    </p>
  );
}

function CardFront({
  project,
  showDemo,
  clamp,
}: {
  project: Project;
  showDemo?: boolean;
  /** Limit the description to three lines. Only flip cards need it: their height is fixed. */
  clamp?: boolean;
}) {
  return (
    <div className="spot-card flex h-full flex-col rounded-lg border border-border bg-surface p-6 transition-colors duration-200 group-hover:bg-surface-hover">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-medium text-foreground">{project.name}</h3>
        {/* The arrow promises a link, so only show it when there is one. */}
        {project.href && (
          <ArrowUpRightIcon className="h-4 w-4 shrink-0 text-muted transition-colors group-hover:text-accent" />
        )}
      </div>
      {project.note && <Note>{project.note}</Note>}
      {/* No flex-1 here: a stretched box would show lines past the clamp. */}
      <p
        className={`mt-3 text-sm leading-relaxed text-muted ${clamp ? "line-clamp-3" : ""}`}
        data-description
      >
        {project.description}
      </p>
      <TechRow tech={project.tech} />
      {showDemo && project.demo && (
        <div className="mt-4">
          <DemoLink href={project.demo} />
        </div>
      )}
    </div>
  );
}

function CardBack({ project }: { project: Project }) {
  return (
    <div className="relative h-full rounded-lg border border-border">
      <Image
        src={project.image!}
        alt={`Screenshot of ${project.name}`}
        fill
        sizes="(min-width: 640px) 50vw, 100vw"
        className="rounded-lg object-cover object-top"
      />
      <div className="absolute inset-0 flex flex-col justify-end rounded-lg bg-gradient-to-t from-background via-background/40 to-transparent p-5">
        {project.href && <StretchedRepoLink project={project} decorative />}
        <h3 className="font-medium text-foreground">{project.name}</h3>
        <div className="mt-1 flex items-center gap-4">
          {project.href ? (
            <a
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 -my-2 inline-flex items-center gap-1 py-2 text-xs font-medium text-accent hover:text-foreground focus-visible:text-foreground"
            >
              View on GitHub
              <ArrowUpRightIcon className="h-3 w-3" />
            </a>
          ) : (
            // No repo to link to: say why instead of leaving the row empty.
            <span className="text-xs font-medium text-muted">{project.note}</span>
          )}
          {project.demo && <DemoLink href={project.demo} />}
        </div>
      </div>
    </div>
  );
}

export default function ProjectCard({ project }: { project: Project }) {
  if (!project.image) {
    // Nothing to link to (e.g. private client work without a demo): a plain card.
    if (!project.href && !project.demo) {
      return (
        <div className="group h-full">
          <CardFront project={project} />
        </div>
      );
    }

    if (project.href && !project.demo) {
      return (
        <a
          href={project.href}
          target="_blank"
          rel="noopener noreferrer"
          className="group block h-full"
        >
          <CardFront project={project} />
        </a>
      );
    }

    // A demo link can't nest inside the card-wide <a>, so the repo link is
    // stretched underneath and the demo link sits above it.
    return (
      <div className="group relative h-full">
        <CardFront project={project} showDemo />
        {project.href && <StretchedRepoLink project={project} />}
      </div>
    );
  }

  // Focusable so keyboard and touch users can flip the card (via
  // :focus-within) to reach the links on the back face.
  return (
    <div
      tabIndex={0}
      role="group"
      aria-label={
        project.href || project.demo
          ? `${project.name} — screenshot and links`
          : `${project.name} — screenshot`
      }
      className="group flip-card block aspect-[4/3] w-full rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
    >
      <div className="flip-card-inner">
        <div className="flip-card-face">
          <CardFront project={project} clamp />
        </div>
        <div className="flip-card-face flip-card-face--back">
          <CardBack project={project} />
        </div>
      </div>
    </div>
  );
}
