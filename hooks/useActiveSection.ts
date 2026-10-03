"use client";

import { useEffect, useState } from "react";
import { sections, type SectionId } from "@/lib/sections";

/**
 * The section currently being read: the last one whose top has passed a line
 * 40% down the viewport. Returns undefined above the first section (the hero).
 */
export function useActiveSection(): SectionId | undefined {
  const [active, setActive] = useState<SectionId>();

  useEffect(() => {
    const elements = sections
      .map(({ id }) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);

    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.4;
      // At the very bottom the last section may be too short to reach the line.
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      const current = atBottom
        ? elements[elements.length - 1]
        : elements.filter((element) => element.getBoundingClientRect().top <= line).pop();
      setActive(current?.id as SectionId | undefined);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return active;
}
