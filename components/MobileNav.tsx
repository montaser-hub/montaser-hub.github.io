"use client";

import { useEffect, useRef } from "react";
import { useActiveSection } from "@/hooks/useActiveSection";
import { sections } from "@/lib/sections";

/** Sticky section menu for phones and tablets; follows the section being read. */
export default function MobileNav() {
  const active = useActiveSection();
  const row = useRef<HTMLElement>(null);
  const activeLink = useRef<HTMLAnchorElement>(null);

  // Keep the active item in view when the row of links is wider than the
  // screen. Only the row itself is scrolled: scrollIntoView would also touch
  // the page and cancel a smooth scroll that is still on its way to a section.
  useEffect(() => {
    const nav = row.current;
    const link = activeLink.current;
    if (!nav || !link) return;
    nav.scrollTo({ left: link.offsetLeft - (nav.clientWidth - link.offsetWidth) / 2, behavior: "smooth" });
  }, [active]);

  return (
    <nav
      ref={row}
      aria-label="Sections"
      className="sticky top-0 z-30 -mx-6 mb-4 flex justify-between gap-1 overflow-x-auto border-b border-border bg-background/90 px-3 py-2 backdrop-blur sm:-mx-10 sm:px-8 lg:hidden"
    >
      {sections.map(({ id, label }) => {
        const isActive = id === active;
        return (
          <a
            key={id}
            ref={isActive ? activeLink : undefined}
            href={`#${id}`}
            aria-current={isActive ? "location" : undefined}
            className={`shrink-0 rounded-md px-2.5 py-2.5 text-sm font-medium transition-colors duration-200 ${
              isActive ? "bg-surface-hover text-accent" : "text-muted hover:text-foreground"
            }`}
          >
            {label}
          </a>
        );
      })}
    </nav>
  );
}
