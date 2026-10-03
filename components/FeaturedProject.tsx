import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { caseStudies } from "@/lib/data";
import type { CaseStudy } from "@/lib/types";
import { ArrowUpRightIcon } from "./icons";
import TechIcon from "./TechIcon";
import CountUp from "./CountUp";
import ZoomImage from "./ZoomImage";

function CaseStudyItem({ study, priority, isLast }: { study: CaseStudy; priority: boolean; isLast: boolean }) {
  return (
    <article className={`relative py-6 ${!isLast ? "border-b border-border/40 pb-20 mb-20" : ""}`}>
      {/* Header: Title, Context, Links */}
      <header className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <span className="inline-flex items-center gap-2 font-mono text-xs font-medium uppercase tracking-wider text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            {study.context}
          </span>
          <h3 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {study.name}
          </h3>
          <p className="mt-1 text-sm font-medium text-muted">{study.role}</p>
        </div>

        {study.links ? (
          <div className="flex flex-wrap items-center gap-4">
            {study.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline inline-flex items-center gap-1.5 text-sm font-semibold text-foreground transition-colors hover:text-accent"
              >
                {link.label}
                <ArrowUpRightIcon className="h-4 w-4" />
              </a>
            ))}
          </div>
        ) : (
          study.note && (
            <span className="rounded-full border border-border/60 bg-surface/40 px-3.5 py-1 font-mono text-xs font-medium text-muted-dim">
              {study.note}
            </span>
          )
        )}
      </header>

      {/* Summary */}
      <p className="mt-5 max-w-3xl text-base leading-relaxed text-muted">{study.summary}</p>

      {/* Screenshot Frame (Clean borderless image with subtle rounded frame) */}
      {study.image && (
        <figure className="mt-8 overflow-hidden rounded-xl bg-surface/30">
          <ZoomImage src={study.image} alt={`Screenshot of ${study.name}`} priority={priority} />
          {study.imageCaption && (
            <figcaption className="mt-2.5 text-xs text-muted-dim">{study.imageCaption}</figcaption>
          )}
        </figure>
      )}

      {/* Details & Metrics */}
      <div className={`mt-8 grid gap-8 ${study.stats ? "md:grid-cols-[1fr_13rem]" : ""}`}>
        <ul className="space-y-3">
          {study.highlights.map((point) => (
            <li key={point} className="flex items-start gap-3 text-sm leading-relaxed text-muted">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              <span>{point}</span>
            </li>
          ))}
        </ul>

        {study.stats && (
          <dl className="grid grid-cols-2 gap-4 self-start border-t border-border/40 pt-4 md:grid-cols-1 md:border-l md:border-t-0 md:pl-6 md:pt-0">
            {study.stats.map((stat) => (
              <div key={stat.label} className="flex flex-col-reverse">
                <dt className="text-xs text-muted-dim">{stat.label}</dt>
                <dd className="text-2xl font-bold tracking-tight text-foreground">
                  {/^\d+$/.test(stat.value) ? <CountUp value={Number(stat.value)} /> : stat.value}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>

      {/* Tech Stack Chips */}
      <div className="mt-8 flex flex-wrap gap-2">
        {study.tech.map((tech) => (
          <span
            key={tech}
            className="inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-surface/60 px-3 py-1 font-mono text-xs text-muted transition-colors hover:border-muted-dim hover:text-foreground"
          >
            <TechIcon tech={tech} className="h-3.5 w-3.5 text-accent" />
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
      <SectionHeading section="work">Featured Work</SectionHeading>

      <div>
        {caseStudies.map((study, i) => (
          <Reveal key={study.name} delay={0.05}>
            <CaseStudyItem
              study={study}
              priority={i === 0}
              isLast={i === caseStudies.length - 1}
            />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
