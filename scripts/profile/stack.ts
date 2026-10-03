/**
 * Technology areas as bento cards of brand-icon tiles, two cards per row.
 * Tiles pop in one after the other, then the icons bob gently in a wave.
 */
import { drawIcon, icon, type Icon } from "./icons.ts";
import { EASE, escapeXml, styles, svg } from "./theme.ts";

const WIDTH = 1200;
const COLUMNS = 2;
const CARD_GAP = 18;
const CARD_WIDTH = (WIDTH - CARD_GAP * (COLUMNS - 1)) / COLUMNS;
const PAD = 26;
const HEADER = 58;
const TILE = 94;
const TILE_GAP = 13;
const PER_ROW = Math.floor((CARD_WIDTH - PAD * 2 + TILE_GAP) / (TILE + TILE_GAP));

export function stack(groups: Record<string, string[]>): string {
  const areas = Object.entries(groups).map(([label, names]) => ({
    label,
    icons: names.map(icon).filter((found): found is Icon => found !== undefined),
  }));
  const tileRows = (count: number) => Math.ceil(count / PER_ROW);
  const cardHeight = (rows: number) => HEADER + rows * (TILE + TILE_GAP) - TILE_GAP + PAD;

  let order = 0;
  let y = 0;
  const cards: string[] = [];
  for (let first = 0; first < areas.length; first += COLUMNS) {
    const row = areas.slice(first, first + COLUMNS);
    // Cards in one row share the height of the tallest.
    const height = cardHeight(Math.max(...row.map((area) => tileRows(area.icons.length))));
    row.forEach((area, column) => {
      const x0 = column * (CARD_WIDTH + CARD_GAP);
      const tiles = area.icons
        .map((found, i) => {
          const x = x0 + PAD + (i % PER_ROW) * (TILE + TILE_GAP);
          const ty = y + HEADER + Math.floor(i / PER_ROW) * (TILE + TILE_GAP);
          return `<g class="tile" style="animation-delay: ${(order++ * 0.04).toFixed(2)}s">
      <rect class="bg edge" x="${x + 0.5}" y="${ty + 0.5}" width="${TILE - 1}" height="${TILE - 1}" rx="18" stroke-width="1"/>
      <g class="bob" style="animation-delay: ${(i * 0.2).toFixed(1)}s">${drawIcon(found, x + TILE / 2, ty + 37, 34)}</g>
      <text class="muted" x="${x + TILE / 2}" y="${ty + 78}" text-anchor="middle" font-size="12.5">${escapeXml(found.name)}</text>
    </g>`;
        })
        .join("\n    ");
      cards.push(`<rect class="panel edge" x="${x0 + 0.5}" y="${y + 0.5}" width="${CARD_WIDTH - 1}" height="${height - 1}" rx="20" stroke-width="1"/>
    <text class="fg" x="${x0 + PAD}" y="${y + 37}" font-size="18" font-weight="700">${escapeXml(area.label)}</text>
    <text class="mono dim" x="${x0 + CARD_WIDTH - PAD}" y="${y + 36}" text-anchor="end" font-size="13">${String(area.icons.length).padStart(2, "0")}</text>
    ${tiles}`);
    });
    y += height + CARD_GAP;
  }

  const css = `
    .tile { transform-box: fill-box; transform-origin: center; animation: pop 0.5s ${EASE} backwards; }
    .bob { animation: bob 4s ease-in-out infinite; }
    @keyframes pop { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }
    @keyframes bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
    @media (prefers-reduced-motion: reduce) { .tile, .bob { animation: none; } }`;

  const summary = areas.map((area) => `${area.label}: ${area.icons.map((found) => found.name).join(", ")}`).join(". ");
  return svg(WIDTH, y - CARD_GAP, `Tech stack. ${summary}`, `  ${styles(css)}
    ${cards.join("\n    ")}`);
}
