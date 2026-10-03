"use client";

import { useEffect, useRef } from "react";

/**
 * Soft glow that follows the cursor behind the content, and feeds the cursor
 * position to `.spot-card` elements for their border highlight. Mouse users
 * only: CSS hides it for touch input and for reduced motion.
 */
export default function Spotlight() {
  const glow = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let frame = 0;
    let x = 0;
    let y = 0;
    const paint = () => {
      frame = 0;
      glow.current?.style.setProperty("--spot-x", `${x}px`);
      glow.current?.style.setProperty("--spot-y", `${y}px`);
      // Position relative to each card under the cursor, for its border light.
      for (const card of document.querySelectorAll<HTMLElement>(".spot-card:hover")) {
        const box = card.getBoundingClientRect();
        card.style.setProperty("--card-x", `${x - box.left}px`);
        card.style.setProperty("--card-y", `${y - box.top}px`);
      }
    };
    const onMove = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
      if (!frame) frame = requestAnimationFrame(paint);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return <div ref={glow} aria-hidden="true" className="spotlight" />;
}
