/**
 * Tech stack as one line of brand icons with their names, sliding sideways
 * forever like a logo slider. The row is drawn twice, so sliding by exactly
 * one row-width loops without a seam; the edges fade out. No boxes: the
 * icons sit directly on the page.
 */
import { drawIcon, icon, type Icon } from "./icons.ts";
import { escapeXml, styles, svg } from "./theme.ts";

const WIDTH = 1200;
const HEIGHT = 104;
const PITCH = 112;
const ICON = 40;
/** Seconds each icon takes to cross its own slot: keeps the speed constant whatever the count. */
const SECONDS_PER_ICON = 2.2;

export function stack(names: string[]): string {
  const icons = names.map(icon).filter((found): found is Icon => found !== undefined);
  const rowWidth = icons.length * PITCH;

  const row = (offset: number) =>
    icons
      .map((found, i) => {
        const cx = offset + i * PITCH + PITCH / 2;
        return `${drawIcon(found, cx, 36, ICON)}
      <text class="muted" x="${cx}" y="86" text-anchor="middle" font-size="13">${escapeXml(found.name)}</text>`;
      })
      .join("\n      ");

  const css = `
    .track { animation: slide ${(icons.length * SECONDS_PER_ICON).toFixed(0)}s linear infinite; }
    @keyframes slide { to { transform: translateX(-${rowWidth}px); } }
    @media (prefers-reduced-motion: reduce) { .track { animation: none; } }`;

  return svg(WIDTH, HEIGHT, `Tech stack: ${icons.map((found) => found.name).join(", ")}`, `  ${styles(css)}
  <defs>
    <linearGradient id="edges" x1="0" x2="1">
      <stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="0.08" stop-color="#fff"/>
      <stop offset="0.92" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </linearGradient>
    <mask id="fade"><rect width="${WIDTH}" height="${HEIGHT}" fill="url(#edges)"/></mask>
  </defs>
  <g mask="url(#fade)">
    <g class="track">
      ${row(0)}
      ${row(rowWidth)}
    </g>
  </g>`);
}
