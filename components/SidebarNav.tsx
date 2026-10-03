"use client";

import { useActiveSection } from "@/hooks/useActiveSection";
import { sections } from "@/lib/sections";

/** Desktop section menu; the section being read is marked and highlighted. */
export default function SidebarNav() {
  const active = useActiveSection();

  return (
    <nav aria-label="Sections" className="mt-12 hidden lg:block">
      <ul className="space-y-4">
        {sections.map(({ id, label }) => {
          const isActive = id === active;
          return (
            <li key={id}>
              <a
                href={`#${id}`}
                aria-current={isActive ? "location" : undefined}
                className={`group flex items-center gap-3 text-sm font-medium transition-colors duration-200 hover:text-foreground ${
                  isActive ? "text-foreground" : "text-muted-dim"
                }`}
              >
                <span
                  className={`h-px transition-all duration-300 ease-out group-hover:w-12 group-hover:bg-accent ${
                    isActive ? "w-16 bg-accent" : "w-8 bg-muted-dim"
                  }`}
                />
                {label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
