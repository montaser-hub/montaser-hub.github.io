import { spriteId, techIconId } from "@/lib/tech-icons";

/**
 * Renders a known brand logo for `tech` (drawn by TechIconSprite), or a
 * monogram badge as a graceful fallback for tokens with no icon (e.g. "SOLID
 * Principles", "CI/CD"), so every tech tag reads as an intentional badge
 * rather than a missing icon.
 */
export default function TechIcon({
  tech,
  className = "h-4 w-4",
}: {
  tech: string;
  className?: string;
}) {
  const id = techIconId(tech);

  if (id) {
    return (
      <svg className={className} aria-hidden="true">
        <use href={`#${spriteId(id)}`} />
      </svg>
    );
  }

  const initials = tech.replace(/[^A-Za-z0-9]/g, "").slice(0, 2).toUpperCase() || "•";
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-[3px] border border-current text-[0.55em] font-bold leading-none ${className}`}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}
