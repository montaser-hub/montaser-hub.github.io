"use client";

import { useState } from "react";
import Reveal from "./Reveal";
import { copy, profile } from "@/lib/data";
import Magnetic from "./Magnetic";
import RevealWords from "./RevealWords";

export default function Contact() {
  const [copied, setCopied] = useState(false);

  // The clipboard is unavailable on insecure origins and can be refused; the address is also on the page as a link.
  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
    } catch {
      return;
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

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
        <p className="font-mono text-xs font-semibold uppercase tracking-wider text-accent">{copy.contact.eyebrow}</p>
        <h2 className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          <RevealWords text={copy.contact.title} />
        </h2>
        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-muted">{copy.contact.body}</p>

        {/* Action Buttons: Primary Email & Quick Copy */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Magnetic>
            <a
              href={`mailto:${profile.email}`}
              className="cta-primary group inline-flex items-center gap-2 rounded-lg bg-accent px-8 py-3.5 text-sm font-semibold text-background transition-transform duration-200 hover:-translate-y-0.5"
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

          <button
            type="button"
            onClick={handleCopyEmail}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface/50 px-5 py-3.5 text-sm font-medium text-foreground backdrop-blur transition-all duration-200 hover:border-muted-dim hover:bg-surface-hover"
          >
            {copied ? (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 text-emerald-400" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-emerald-400" role="status">{copy.contact.copied}</span>
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4 text-muted" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>{copy.contact.copyEmail}</span>
              </>
            )}
          </button>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted">
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
