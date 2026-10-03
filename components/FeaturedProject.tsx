import Image from "next/image";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { caseStudies } from "@/lib/data";
import type { CaseStudy } from "@/lib/types";
import { ArrowUpRightIcon } from "./icons";
import TechIcon from "./TechIcon";

function CaseStudyCard({ study, priority }: { study: CaseStudy; priority: boolean }) {
  return (
    <article className="rounded-xl border border-border bg-surface p-6 sm:p-10">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-wide text-accent">{study.context}</p>
          <h3 className="mt-2 text-2xl font-semibold text-foreground">{study.name}</h3>
          <p className="mt-1 text-sm text-muted">{study.role}</p>
        </div>
        {study.links ? (
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {study.links.map((link) => (
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
        ) : (
          study.note && (
            <span className="rounded-full border border-border px-3 py-1 font-mono text-[0.7rem] uppercase tracking-wide text-muted-dim">
              {study.note}
            </span>
          )
        )}
      </header>

      <p className="mt-6 max-w-3xl text-base leading-relaxed text-muted">{study.summary}</p>

      {study.image && (
        <figure className="mt-8">
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border sm:aspect-[16/10]">
            <Image
              src={study.image}
              alt={`Screenshot of ${study.name}`}
              fill
              priority={priority}
              sizes="(min-width: 1280px) 800px, 100vw"
              className="object-cover object-top"
            />
          </div>
          {study.imageCaption && (
            <figcaption className="mt-2 text-xs text-muted-dim">{study.imageCaption}</figcaption>
          )}
        </figure>
      )}

      <div className={`mt-8 grid gap-8 ${study.stats ? "md:grid-cols-[1fr_12rem]" : ""}`}>
        <ul className="space-y-3">
          {study.highlights.map((point) => (
            <li key={point} className="flex gap-3 text-sm leading-relaxed text-muted">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              {point}
            </li>
          ))}
        </ul>
        {study.stats && (
          <dl className="grid grid-cols-2 gap-4 self-start md:grid-cols-1 md:border-l md:border-border md:pl-6">
            {study.stats.map((stat) => (
              // Reversed so the number reads first while the label stays the <dt>.
              <div key={stat.label} className="flex flex-col-reverse">
                <dt className="text-xs text-muted-dim">{stat.label}</dt>
                <dd className="text-2xl font-semibold text-foreground">{stat.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {study.tech.map((tech) => (
          <span
            key={tech}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-hover px-3 py-1 font-mono text-xs text-muted"
          >
            <TechIcon tech={tech} className="h-3.5 w-3.5" />
            {tech}
          </span>
        ))}
      </div>
    </article>
  );
}

export default function FeaturedProject() {
  return (
    <section id="work" className="scroll-mt-20 py-24">
      <SectionHeading>Featured Work</SectionHeading>

      <div className="space-y-8">
        {caseStudies.map((study, i) => (
          <Reveal key={study.name} delay={0.05}>
            <CaseStudyCard study={study} priority={i === 0} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
