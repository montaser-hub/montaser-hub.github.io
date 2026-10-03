"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import ConnectGlobe from "./ConnectGlobe";
import Typewriter from "./Typewriter";
import Magnetic from "./Magnetic";
import { copy, profile } from "@/lib/data";

const EASE = [0.22, 1, 0.36, 1] as const;

// Each line of the hero rises into place, one after the other.
const container = { hidden: {}, shown: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } } };
const line = {
  hidden: { opacity: 0, y: 16 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

export default function Hero() {
  const section = useRef<HTMLElement>(null);
  // As the hero scrolls away: the text lifts and fades, the globe recedes.
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const globeScale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);
  const globeOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.2]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  return (
    <section
      ref={section}
      id="top"
      className="relative flex flex-col justify-center overflow-hidden py-12 sm:py-20 md:min-h-[70vh] lg:min-h-[88vh]"
    >
      <motion.div style={{ scale: globeScale, opacity: globeOpacity }} className="absolute inset-0">
        <ConnectGlobe />
      </motion.div>

      {/* Keeps the text readable where it overlaps the globe. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 hidden w-3/4 bg-gradient-to-r from-background via-background/80 to-transparent md:block"
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="shown"
        style={{ y: textY, opacity: textOpacity }}
        className="relative z-10 max-w-2xl"
      >
        <motion.h2
          variants={line}
          className="text-gradient-hero text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
        >
          {profile.name}
        </motion.h2>
        <motion.h3
          variants={line}
          // Two lines reserved, so phrases of different lengths don't move the page.
          className="mt-3 min-h-[2.4em] text-2xl font-bold tracking-tight text-muted sm:text-4xl"
        >
          {copy.hero.headlineLead} <Typewriter phrases={copy.hero.headlinePhrases} />
        </motion.h3>
        <motion.p variants={line} className="mt-6 max-w-lg text-base leading-relaxed text-muted">
          {profile.tagline}
        </motion.p>
        <motion.div variants={line} className="mt-10 flex flex-wrap items-center gap-4">
          <Magnetic strength={0.2}>
            <a
              href="#work"
              className="cta-primary group inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3 text-sm font-semibold text-background"
            >
              {copy.hero.primaryCta}
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
          <a
            href="#contact"
            className="rounded-md border border-border bg-surface/40 px-6 py-3 text-sm font-medium text-foreground backdrop-blur transition-colors duration-200 hover:border-muted-dim hover:bg-surface-hover"
          >
            {copy.hero.secondaryCta}
          </a>
        </motion.div>
      </motion.div>

      {/* Mouse-shaped scroll cue: the wheel drifts down and fades, on a loop. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-6 hidden justify-center sm:flex">
        <motion.a
          href="#about"
          aria-label="Scroll to About"
          style={{ opacity: cueOpacity }}
          className="scroll-mouse pointer-events-auto"
        >
          <span className="scroll-mouse-wheel" aria-hidden="true" />
        </motion.a>
      </div>
    </section>
  );
}
