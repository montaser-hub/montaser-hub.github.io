"use client";

import { animate, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";

const formatter = new Intl.NumberFormat("en-US");

/**
 * Counts up to `value` the first time it scrolls into view. The final number
 * is in the markup from the start, so it is correct without JavaScript, for
 * screen readers and under reduced motion.
 */
export default function CountUp({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!inView || reduceMotion || !node) return;
    const controls = animate(0, value, {
      duration: 1.2,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => {
        node.textContent = formatter.format(Math.round(latest)) + suffix;
      },
    });
    return () => controls.stop();
  }, [inView, reduceMotion, suffix, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {formatter.format(value)}
      {suffix}
    </span>
  );
}
