import Reveal from "./Reveal";
import { copy, profile } from "@/lib/data";
import Magnetic from "./Magnetic";
import RevealWords from "./RevealWords";

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative isolate scroll-mt-20 flex flex-col items-center py-32 text-center"
    >
      {/* Soft halo behind the closing call to action. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-72 w-[36rem] max-w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-3xl"
      />
      <Reveal>
        <p className="font-mono text-sm text-accent">{copy.contact.eyebrow}</p>
        <h2 className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          <RevealWords text={copy.contact.title} />
        </h2>
        <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-muted">{copy.contact.body}</p>
        <div className="mt-10">
          <Magnetic>
            <a
              href={`mailto:${profile.email}`}
              className="cta-primary group inline-flex items-center gap-2 rounded-md bg-accent px-8 py-4 text-sm font-semibold text-background"
            >
              {copy.contact.cta}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-1"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
              </svg>
            </a>
          </Magnetic>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted">
          <a href={`mailto:${profile.email}`} className="link-underline py-2">
            {profile.email}
          </a>
          <a href={profile.whatsapp} target="_blank" rel="noopener noreferrer" className="link-underline py-2">
            {profile.phoneDisplay}
          </a>
        </div>
      </Reveal>
    </section>
  );
}
