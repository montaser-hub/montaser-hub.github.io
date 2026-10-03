/**
 * Tech stack as one line of brand-icon tiles that slides sideways forever,
 * like a logo slider. The row is drawn twice, so sliding by exactly one
 * row-width loops without a seam; the edges fade out.
 */
import { drawIcon, icon, type Icon } from "./icons.ts";
import { escapeXml, styles, svg } from "./theme.ts";

const WIDTH = 1200;
const HEIGHT = 124;
const TILE = 100;
const GAP = 16;
const PITCH = TILE + GAP;
/** Seconds each tile takes to cross its own width: keeps the speed constant whatever the count. */
const SECONDS_PER_TILE = 2.2;

export function stack(names: string[]): string {
  const icons = names.map(icon).filter((found): found is Icon => found !== undefined);
  const rowWidth = icons.length * PITCH;

  const row = (offset: number) =>
    icons
      .map((found, i) => {
        const x = offset + i * PITCH;
        return `<rect class="panel edge" x="${x + 0.5}" y="12.5" width="${TILE - 1}" height="${TILE - 1}" rx="18" stroke-width="1"/>
      ${drawIcon(found, x + TILE / 2, 50, 36)}
      <text class="muted" x="${x + TILE / 2}" y="94" text-anchor="middle" font-size="12.5">${escapeXml(found.name)}</text>`;
      })
      .join("\n      ");

  const css = `
    .track { animation: slide ${(icons.length * SECONDS_PER_TILE).toFixed(0)}s linear infinite; }
    @keyframes slide { to { transform: translateX(-${rowWidth}px); } }
    @media (prefers-reduced-motion: reduce) { .track { animation: none; } }`;

  return svg(WIDTH, HEIGHT, `Tech stack: ${icons.map((found) => found.name).join(", ")}`, `  ${styles(css)}
  <defs>
    <linearGradient id="edges" x1="0" x2="1">
      <stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="0.07" stop-color="#fff"/>
      <stop offset="0.93" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>
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
