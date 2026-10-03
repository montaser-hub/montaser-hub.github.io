"use client";

import { motion } from "framer-motion";
import { sections, type SectionId } from "@/lib/sections";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Section title with its number in the page order; the rule draws itself
 * across the row when the heading scrolls into view.
 */
export default function SectionHeading({
  children,
  section,
}: {
  children: string;
  /** Numbers the heading from the section list; omit for sub-headings. */
  section?: SectionId;
}) {
  const number = section ? sections.findIndex(({ id }) => id === section) + 1 : 0;

  return (
    <motion.div
      className="mb-10 flex items-center gap-4"
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: "-80px" }}
    >
      <motion.h2
        variants={{ hidden: { opacity: 0, x: -12 }, shown: { opacity: 1, x: 0 } }}
        transition={{ duration: 0.5, ease: EASE }}
        className="flex items-baseline gap-3 text-2xl font-semibold text-foreground"
      >
        {number > 0 && (
          <span aria-hidden="true" className="font-mono text-sm font-normal text-accent">
            {String(number).padStart(2, "0")}.
          </span>
        )}
        {children}
      </motion.h2>
      <motion.span
        aria-hidden="true"
        variants={{ hidden: { scaleX: 0 }, shown: { scaleX: 1 } }}
        transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
        className="h-px flex-1 origin-left bg-border"
      />
    </motion.div>
  );
}
