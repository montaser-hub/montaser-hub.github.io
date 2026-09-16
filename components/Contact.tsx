import Reveal from "./Reveal";
import { profile } from "@/lib/data";

export default function Contact() {
  return (
    <section
      id="contact"
      className="scroll-mt-20 flex flex-col items-center py-32 text-center"
    >
      <Reveal>
        <p className="font-mono text-sm text-accent">What&apos;s next?</p>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Let&apos;s work together
        </h2>
        <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-muted">
          I&apos;m open to full-stack roles and freelance projects that need
          someone comfortable across the whole stack. Reach out and I&apos;ll
          get back to you.
        </p>
        <a
          href={`mailto:${profile.email}`}
          className="mt-10 inline-block rounded-md border border-accent px-8 py-4 text-sm font-medium text-accent transition-colors hover:bg-accent/10"
        >
          Say hello
        </a>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted">
          <a href={`mailto:${profile.email}`} className="link-underline">
            {profile.email}
          </a>
          <a href={profile.whatsapp} target="_blank" rel="noopener noreferrer" className="link-underline">
            {profile.phoneDisplay}
          </a>
        </div>
      </Reveal>
    </section>
  );
}
