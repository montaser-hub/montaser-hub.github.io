import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { copy, focusAreas, metrics, techStack } from "@/lib/data";
import CountUp from "./CountUp";
import TechIcon from "./TechIcon";
import Marquee from "./Marquee";

export default function About() {
  return (
    <section id="about" className="scroll-mt-20 py-24">
      <SectionHeading section="about">About</SectionHeading>

      <Reveal>
        <dl className="mb-14 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-4">
          {metrics.map((metric) => (
            // Reversed so the number reads first while the label stays the <dt>.
            <div
              key={metric.label}
              className="group flex flex-col-reverse bg-surface p-5 transition-colors duration-300 hover:bg-surface-hover"
            >
              <dt className="mt-1 text-xs leading-snug text-muted-dim">{metric.label}</dt>
              <dd className="text-3xl font-semibold tracking-tight text-foreground transition-colors duration-300 group-hover:text-accent">
                <CountUp value={metric.value} suffix={metric.suffix} />
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>

      <div className="grid gap-12 lg:grid-cols-5">
        <Reveal className="lg:col-span-3" delay={0.05}>
          <div className="space-y-4 text-base leading-relaxed text-muted">
            {copy.about.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {focusAreas.map((area, i) => (
              <div key={area.title} className="border-t border-border pt-4">
                <p className="font-mono text-xs text-accent">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-2 text-sm font-semibold text-foreground">
                  {area.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {area.description}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal className="lg:col-span-2" delay={0.1}>
          <div className="spot-card rounded-lg border border-border bg-surface p-6">
            <h3 className="mb-4 text-sm font-semibold text-foreground">
              Tech I work with
            </h3>
            <dl className="space-y-4">
              {Object.entries(techStack).map(([category, items]) => (
                <div key={category}>
                  <dt className="mb-2 text-xs font-mono uppercase tracking-wide text-muted-dim">
                    {category}
                  </dt>
                  <dd className="flex flex-wrap gap-2">
                    {items.map((item) => (
                      <span
                        key={item}
                        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-hover px-3 py-1 text-xs text-muted transition-all duration-200 hover:-translate-y-0.5 hover:border-muted-dim hover:text-foreground"
                      >
                        <TechIcon tech={item} className="h-3.5 w-3.5" />
                        {item}
                      </span>
                    ))}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>

      <Reveal delay={0.1}>
        <div className="mt-14">
          <Marquee label="Technologies I work with">
            {Object.values(techStack)
              .flat()
              .map((item) => (
                <span key={item} className="inline-flex items-center gap-2 font-mono text-sm text-muted-dim transition-colors duration-200 hover:text-foreground">
                  <TechIcon tech={item} className="h-4 w-4 text-accent" />
                  {item}
                </span>
              ))}
          </Marquee>
        </div>
      </Reveal>
    </section>
  );
}

