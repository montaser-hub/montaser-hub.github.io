"use client";

import { motion } from "framer-motion";
import { useActiveSection } from "@/hooks/useActiveSection";
import { sections } from "@/lib/sections";

/**
 * Tab bar for phones and tablets: one icon per section, fixed to the bottom
 * of the screen where the thumb reaches. The section being read sits on a
 * solid accent tile that slides from icon to icon as the page scrolls; the
 * others light up on hover and press. Labels are for screen readers and the
 * long-press tooltip; the bar shows icons only.
 */
export default function MobileNav() {
  const active = useActiveSection();

  return (
    <nav
      aria-label="Sections"
      className="mobile-nav fixed inset-x-0 bottom-0 z-40 border-t border-border/80 lg:hidden"
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-around px-3">
        {sections.map(({ id, label, icon: Icon }) => {
          const isActive = id === active;
          return (
            <li key={id} className="flex-1">
              <a
                href={`#${id}`}
                aria-label={label}
                title={label}
                aria-current={isActive ? "location" : undefined}
                // A short tap vibration on Android; other browsers ignore it.
                onClick={() => navigator.vibrate?.(8)}
                className="group relative flex h-16 items-center justify-center"
              >
                {isActive && (
                  <motion.span
                    layoutId="mobile-nav-highlight"
                    aria-hidden="true"
                    className="absolute h-11 w-14 rounded-xl bg-accent shadow-[0_6px_18px_-6px_rgb(246_130_31/0.6)]"
                    transition={{ type: "spring", stiffness: 420, damping: 36 }}
                  />
                )}
                <span
                  aria-hidden="true"
                  className={`relative grid h-11 w-14 place-items-center rounded-xl transition-colors duration-200 group-active:scale-95 ${
                    isActive
                      ? "text-background"
                      : "text-muted-dim group-hover:bg-surface-hover group-hover:text-foreground"
                  }`}
                >
                  <Icon className="h-6 w-6" />
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
