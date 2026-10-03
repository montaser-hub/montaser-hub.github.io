import type { ReactNode } from "react";

/**
 * Row of items that scrolls sideways forever; it pauses on hover and stands
 * still under reduced motion. The items are rendered twice so the loop has no
 * seam; the second copy is hidden from assistive technology.
 */
export default function Marquee({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div className="marquee" role="group" aria-label={label}>
      <div className="marquee-track">
        <div className="marquee-group">{children}</div>
        <div className="marquee-group" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
