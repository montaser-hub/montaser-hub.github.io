"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/**
 * One motion policy for the whole site: visitors who ask their system for
 * reduced motion get fades only, with no movement, in every animated component.
 */
export default function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
