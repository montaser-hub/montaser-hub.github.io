"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { caseStudies } from "@/lib/data";
import type { CaseStudy } from "@/lib/types";
import { ArrowUpRightIcon } from "./icons";
import TechIcon from "./TechIcon";
import CountUp from "./CountUp";
import ZoomImage from "./ZoomImage";

/** The anchor id of a case study, shared by its article and the jump list. */
const anchorId = (study: CaseStudy) => `featured-${study.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

function CaseStudyItem({ study, priority, isLast }: { study: CaseStudy; priority: boolean; isLast: boolean }) {
  return (
    <article
      id={anchorId(study)}
      className={`scroll-mt-24 py-8 ${!isLast ? "border-b border-border/30 pb-20 mb-20" : ""}`}
    >
      {/* Header: Context, Title, Links */}
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-2 font-mono text-xs font-medium uppercase tracking-wider text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            {study.context}
          </span>
          <h3 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {study.name}
          </h3>
          <p className="mt-1 text-sm font-medium text-muted-dim">{study.role}</p>
        </div>

        {study.links ? (
          <div className="flex flex-wrap items-center gap-3.5">
            {study.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline inline-flex items-center gap-1.5 text-xs font-semibold text-foreground transition-colors hover:text-accent sm:text-sm"
              >
                {link.label}
                <ArrowUpRightIcon className="h-3.5 w-3.5" />
              </a>
            ))}
          </div>
        ) : (
          study.note && (
            <span className="font-mono text-xs font-medium text-muted-dim">
              {study.note}
            </span>
          )
        )}
      </header>

      {/* Summary */}
      <p className="mt-5 max-w-3xl text-sm leading-relaxed text-muted sm:text-base">{study.summary}</p>

      {/* Screenshot Frame */}
      {study.image && (
        <figure className="mt-8 overflow-hidden rounded-xl bg-surface/20">
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
            <li key={point} className="flex items-start gap-3 text-xs leading-relaxed text-muted sm:text-sm">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              <span>{point}</span>
            </li>
          ))}
        </ul>

        {study.stats && (
          <dl className="grid grid-cols-2 gap-4 self-start border-t border-border/30 pt-4 md:grid-cols-1 md:border-l md:border-t-0 md:pl-6 md:pt-0">
            {study.stats.map((stat) => (
              <div key={stat.label} className="flex flex-col-reverse">
                <dt className="text-xs text-muted-dim">{stat.label}</dt>
                <dd className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                  {/^\d+$/.test(stat.value) ? <CountUp value={Number(stat.value)} /> : stat.value}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>

      {/* Tech Stack Tags */}
      <div className="mt-8 flex flex-wrap gap-2 pt-4">
        {study.tech.map((tech) => (
          <span
            key={tech}
            className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-dim transition-colors hover:text-foreground"
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
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-20% 0px -40% 0px" }
    );

    const projectElements = document.querySelectorAll("[id^='featured-']");
    projectElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Smooth scrolling is left to the page's CSS, which already honours reduced motion.
  const scrollToProject = (study: CaseStudy) => document.getElementById(anchorId(study))?.scrollIntoView();

  return (
    <section id="work" className="scroll-mt-20 py-24">
      <SectionHeading section="work">Featured Work</SectionHeading>

      {/* Sticky Project Sub-Navigation Bar */}
      <div className="sticky top-0 z-20 -mx-4 mb-10 border-b border-border/40 bg-background/90 px-4 py-3 backdrop-blur sm:-mx-8 sm:px-8">
        <nav aria-label="Featured projects jump list" className="flex flex-wrap items-center gap-2 sm:gap-4">
          {caseStudies.map((study, index) => {
            const targetId = anchorId(study);
            const isActive = activeId === targetId;

            return (
              <button
                key={study.name}
                type="button"
                onClick={() => scrollToProject(study)}
                aria-current={isActive ? "location" : undefined}
                className={`group relative flex items-center gap-2 rounded-md px-2.5 py-1.5 text-xs font-semibold transition-all duration-200 sm:text-sm ${
                  isActive ? "text-foreground" : "text-muted-dim hover:text-foreground"
                }`}
              >
                <span className={`font-mono text-xs ${isActive ? "text-accent" : "text-muted-dim group-hover:text-muted"}`}>
                  0{index + 1}.
                </span>
                <span>{study.name.split(" — ")[0]}</span>

                {isActive && (
                  <motion.span
                    layoutId="activeFeaturedScrollSpy"
                    className="absolute inset-x-0 -bottom-[13px] h-0.5 bg-accent"
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Project Case Studies List (100% natural height, no cut-offs) */}
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
