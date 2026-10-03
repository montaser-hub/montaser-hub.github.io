import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { copy, focusAreas, techStack } from "@/lib/data";
import TechIcon from "./TechIcon";

export default function About() {
  return (
    <section id="about" className="scroll-mt-20 py-24">
      <SectionHeading>About</SectionHeading>

      <div className="grid gap-12 lg:grid-cols-5">
        <Reveal className="lg:col-span-3" delay={0.05}>
          <div className="space-y-4 text-base leading-relaxed text-muted">
            {copy.about.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {focusAreas.map((area) => (
              <div key={area.title}>
                <h3 className="text-sm font-semibold text-foreground">
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
          <div className="rounded-lg border border-border bg-surface p-6">
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
                        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-hover px-3 py-1 text-xs text-muted"
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
    </section>
  );
}
