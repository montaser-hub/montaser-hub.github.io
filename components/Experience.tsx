import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import Timeline from "./Timeline";
import { experience, education } from "@/lib/data";

export default function Experience() {
  return (
    <section id="experience" className="scroll-mt-20 py-24">
      <SectionHeading section="experience">Experience</SectionHeading>

      <Timeline>
        <div className="space-y-12">
        {experience.map((job, i) => (
          <Reveal key={job.company} delay={Math.min(i * 0.08, 0.2)}>
            <div className="relative grid gap-2 sm:grid-cols-[11rem_1fr] sm:gap-6">
              <span aria-hidden="true" className="timeline-dot" />
              <div>
                <p className="font-mono text-xs text-muted-dim">
                  {job.start} — {job.end}
                </p>
                <p className="mt-1 text-sm font-medium text-muted">{job.company}</p>
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground">
                  {job.role}
                </h3>
                <ul className="mt-3 space-y-2">
                  {job.highlights.map((point) => (
                    <li
                      key={point}
                      className="flex gap-3 text-sm leading-relaxed text-muted"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        ))}
        </div>
      </Timeline>

      <Reveal delay={0.1}>
        <div className="mt-14 border-t border-border pt-10">
          <h3 className="mb-6 text-sm font-semibold uppercase tracking-wide text-muted-dim">
            Education
          </h3>
          <div className="space-y-5">
            {education.map((entry) => (
              <div
                key={entry.institution}
                className="grid gap-1 sm:grid-cols-[13rem_1fr] sm:gap-6"
              >
                <p className="font-mono text-xs text-muted-dim">{entry.period}</p>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {entry.program}
                  </p>
                  <p className="text-sm text-muted">{entry.institution}</p>
                  {entry.detail && (
                    <p className="mt-1 text-sm leading-relaxed text-muted-dim">
                      {entry.detail}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
