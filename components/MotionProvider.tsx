"use client";

import { MotionConfig } from "framer-motion";
import { useEffect, type ReactNode } from "react";

/**
 * One motion policy for the whole site: visitors who ask their system for
 * reduced motion get fades only, with no movement, in every animated component.
 */
export default function MotionProvider({ children }: { children: ReactNode }) {
  // Tells the CSS fallback in globals.css that React is running and the
  // scroll-in animations are in charge of hidden content.
  useEffect(() => {
    document.documentElement.dataset.hydrated = "";
  }, []);

  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
