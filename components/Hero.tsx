"use client";

import { motion } from "framer-motion";
import ConnectGlobe from "./ConnectGlobe";
import { profile } from "@/lib/data";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[88vh] flex-col justify-center overflow-hidden py-20"
    >
      <ConnectGlobe />
      <div className="relative z-10 max-w-2xl">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-mono text-sm text-accent"
        >
          Hi, my name is
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl"
        >
          {profile.name}.
        </motion.h2>
        <motion.h3
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-2 text-3xl font-bold tracking-tight text-muted sm:text-4xl"
        >
          I build software for how businesses actually run.
        </motion.h3>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-6 max-w-lg text-base leading-relaxed text-muted"
        >
          {profile.tagline}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10 flex flex-wrap gap-4"
        >
          <a
            href="#work"
            className="rounded-md border border-accent px-6 py-3 text-sm font-medium text-accent transition-colors hover:bg-accent/10"
          >
            View my work
          </a>
          <a
            href="#contact"
            className="rounded-md border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:border-muted-dim"
          >
            Get in touch
          </a>
        </motion.div>
      </div>
    </section>
  );
}
