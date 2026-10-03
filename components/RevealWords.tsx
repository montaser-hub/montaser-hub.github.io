"use client";

import { motion } from "framer-motion";

/** Reveals a line of text word by word as it scrolls into view. */
export default function RevealWords({ text, className }: { text: string; className?: string }) {
  return (
    <motion.span
      className={className}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: "-80px" }}
      variants={{ hidden: {}, shown: { transition: { staggerChildren: 0.07 } } }}
    >
      {/* Screen readers get the sentence once; the animated words are decoration. */}
      <span className="sr-only">{text}</span>
      {text.split(" ").map((word, i) => (
        // Each word rises out of its own clipped box.
        <span key={`${word}-${i}`} aria-hidden="true" className="inline-block overflow-hidden pb-[0.1em] align-bottom">
          <motion.span
            className="inline-block"
            variants={{ hidden: { y: "110%" }, shown: { y: 0 } }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {word}&nbsp;
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
