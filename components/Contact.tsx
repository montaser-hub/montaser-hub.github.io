import Reveal from "./Reveal";
import { copy, profile } from "@/lib/data";
import Magnetic from "./Magnetic";
import RevealWords from "./RevealWords";

export default function Contact() {
  return (
    <section
      id="contact"
      className="scroll-mt-20 flex flex-col items-center py-32 text-center"
    >
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
              className="inline-block rounded-md bg-accent px-8 py-4 text-sm font-semibold text-background"
            >
              {copy.contact.cta}
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
