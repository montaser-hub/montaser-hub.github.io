/**
 * Row of stat tiles whose digits roll into place like an odometer: each digit
 * is a column of 0–9 that slides up to its value inside a clipped window.
 */
import { EASE, escapeXml, styles, svg } from "./theme.ts";

export interface Stat {
  value: number;
  suffix?: string;
  label: string;
}

const WIDTH = 1200;
const HEIGHT = 150;
const GAP = 18;
const DIGIT_WIDTH = 30;
const DIGIT_HEIGHT = 56;
const SEPARATOR_WIDTH = 13;

export function metrics(stats: Stat[]): string {
  const tileWidth = (WIDTH - GAP * (stats.length - 1)) / stats.length;
  let clipId = 0;

  const tiles = stats
    .map((stat, tile) => {
      const x0 = tile * (tileWidth + GAP);
      const characters = [...stat.value.toLocaleString("en-US"), ...(stat.suffix ?? "")];
      let x = x0 + 28;
      const number = characters
        .map((character, position) => {
          if (!/\d/.test(character)) {
            const out = `<text class="fg" x="${x}" y="78" font-size="50" font-weight="800">${escapeXml(character)}</text>`;
            x += character === "," ? SEPARATOR_WIDTH : DIGIT_WIDTH;
            return out;
          }
          const id = `digit-${clipId++}`;
          const column = Array.from({ length: 10 }, (_, n) => `<text x="${x + DIGIT_WIDTH / 2}" y="${78 + n * DIGIT_HEIGHT}" text-anchor="middle" font-size="50" font-weight="800">${n}</text>`).join("");
          const out = `<clipPath id="${id}"><rect x="${x - 2}" y="34" width="${DIGIT_WIDTH + 4}" height="${DIGIT_HEIGHT}"/></clipPath>
    <g clip-path="url(#${id})"><g class="fg roll roll-${character}" style="animation-delay: ${(0.2 + tile * 0.15 + position * 0.08).toFixed(2)}s">${column}</g></g>`;
          x += DIGIT_WIDTH;
          return out;
        })
        .join("\n    ");

      return `<g class="tile" style="animation-delay: ${(tile * 0.12).toFixed(2)}s">
    <rect class="panel edge" x="${x0 + 0.5}" y="0.5" width="${tileWidth - 1}" height="${HEIGHT - 1}" rx="16" stroke-width="1"/>
    ${number}
    <text class="muted" x="${x0 + 28}" y="118" font-size="16">${escapeXml(stat.label)}</text>
  </g>`;
    })
    .join("\n  ");

  // roll-N ends with digit N in the window; the start shows 0.
  const rolls = Array.from({ length: 10 }, (_, n) => `.roll-${n} { animation-name: roll-${n}; } @keyframes roll-${n} { to { transform: translateY(-${n * DIGIT_HEIGHT}px); } }`).join("\n    ");
  const css = `
    .tile { animation: tile-in 0.6s ${EASE} backwards; }
    .roll { animation-duration: 1.6s; animation-timing-function: ${EASE}; animation-fill-mode: both; }
    ${rolls}
    @keyframes tile-in { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
    @media (prefers-reduced-motion: reduce) {
      .tile { animation: none; }
      .roll { animation-duration: 0.01s; animation-delay: 0s !important; }
    }`;

  return svg(WIDTH, HEIGHT, stats.map((s) => `${s.value.toLocaleString("en-US")}${s.suffix ?? ""} ${s.label}`).join(", "), `  ${styles(css)}
  ${tiles}`);
}
