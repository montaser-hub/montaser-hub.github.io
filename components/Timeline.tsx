"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useRef, type ReactNode } from "react";

/**
 * Vertical line beside its children that fills from the top as the block
 * scrolls through the viewport. Items mark themselves with `.timeline-dot`.
 */
export default function Timeline({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <div ref={ref} className="relative pl-8">
      <span aria-hidden="true" className="absolute bottom-2 left-[5px] top-2 w-px bg-border" />
      <motion.span
        aria-hidden="true"
        style={{ scaleY: progress }}
        className="absolute bottom-2 left-[5px] top-2 w-px origin-top bg-accent"
      />
      {children}
    </div>
  );
}
