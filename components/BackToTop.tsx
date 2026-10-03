"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from "framer-motion";
import { useState } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Appears after the first screen and returns to the top. A thin ring around
 * the button fills as the page is read, so it doubles as a progress meter.
 * Neutral glass by default; the accent only shows in the ring and on hover.
 */
export default function BackToTop() {
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 });
  const [visible, setVisible] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setVisible(y > window.innerHeight * 0.8));

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          href="#top"
          aria-label="Back to top"
          initial={{ opacity: 0, scale: 0.85, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 12 }}
          transition={{ duration: 0.35, ease: EASE }}
          className="back-to-top group fixed bottom-6 right-6 z-40 grid h-12 w-12 place-items-center rounded-full"
        >
          <svg viewBox="0 0 48 48" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden="true">
            <defs>
              <linearGradient id="back-to-top-ring" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="var(--accent)" />
                <stop offset="100%" stopColor="#ffc078" />
              </linearGradient>
            </defs>
            <circle cx="24" cy="24" r="22" fill="none" stroke="var(--border)" strokeWidth="1.5" />
            <motion.circle
              cx="24"
              cy="24"
              r="22"
              fill="none"
              stroke="url(#back-to-top-ring)"
              strokeWidth="1.5"
              strokeLinecap="round"
              style={{ pathLength: progress }}
            />
          </svg>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="relative h-4 w-4 transition-transform duration-300 ease-out group-hover:-translate-y-0.5"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m-6 6 6-6 6 6" />
          </svg>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
