import Reveal from "./Reveal";
import { focusAreas, techStack } from "@/lib/data";

export default function About() {
  return (
    <section id="about" className="scroll-mt-20 py-24">
      <Reveal>
        <div className="mb-10 flex items-center gap-4">
          <h2 className="text-2xl font-semibold text-foreground">About</h2>
          <span className="h-px flex-1 bg-border" />
        </div>
      </Reveal>

      <div className="grid gap-12 lg:grid-cols-5">
        <Reveal className="lg:col-span-3" delay={0.05}>
          <div className="space-y-4 text-base leading-relaxed text-muted">
            <p>
              I&apos;m a full-stack engineer who came up through the ITI
              MEARN bootcamp and now builds software for how enterprise
              teams actually operate — metadata-driven UIs, approval
              workflows, and backend services that hold up under real load.
            </p>
            <p>
              At Arkaan International Group I build a rendering engine that
              turns backend JSON schemas directly into reusable React
              components and forms, cutting manual frontend work
              dramatically. Before that, at Qyser Tech, I worked backend —
              Node.js services and MongoDB aggregations processing
              100K+ records to power internal reporting and HR approvals.
            </p>
            <p>
              Most recently I&apos;ve been building{" "}
              <span className="text-foreground">SmartShift</span>, a
              multi-frontend workforce scheduling platform — see the case
              study below.
            </p>
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
                        className="rounded-full border border-border bg-surface-hover px-3 py-1 text-xs text-muted"
                      >
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
