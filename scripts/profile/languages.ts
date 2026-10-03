/** Languages across my public repositories, as one bar that fills segment by segment. */
import { EASE, escapeXml, styles, svg } from "./theme.ts";

const WIDTH = 1200;
const HEIGHT = 150;
const PAD = 28;

export interface Language {
  name: string;
  share: number; // 0..1
  color: string;
}

export function languages(list: Language[], repoCount: number): string {
  const barWidth = WIDTH - PAD * 2;
  let x = PAD;
  const segments = list
    .map((language, i) => {
      const width = barWidth * language.share;
      const out = `<rect class="segment" style="animation-delay: ${(0.15 + i * 0.12).toFixed(2)}s" x="${x.toFixed(1)}" y="64" width="${width.toFixed(1)}" height="14" fill="${language.color}"/>`;
      x += width;
      return out;
    })
    .join("");

  const column = barWidth / list.length;
  const legend = list
    .map((language, i) => {
      const lx = PAD + i * column;
      return `<circle cx="${lx + 6}" cy="112" r="6" fill="${language.color}"/>
  <text class="fg" x="${lx + 20}" y="117" font-size="14.5" font-weight="600">${escapeXml(language.name)}</text>
  <text class="dim" x="${lx + 20}" y="135" font-size="12.5">${(language.share * 100).toFixed(1)}%</text>`;
    })
    .join("\n  ");

  const css = `
    .segment { transform-box: fill-box; transform-origin: left; animation: fill 0.9s ${EASE} backwards; }
    @keyframes fill { from { transform: scaleX(0); } to { transform: scaleX(1); } }
    @media (prefers-reduced-motion: reduce) { .segment { animation: none; } }`;

  return svg(WIDTH, HEIGHT, `Languages in my public repositories: ${list.map((l) => `${l.name} ${(l.share * 100).toFixed(1)}%`).join(", ")}`, `  ${styles(css)}
  <defs><clipPath id="bar"><rect x="${PAD}" y="64" width="${barWidth}" height="14" rx="7"/></clipPath></defs>
  <rect class="panel edge" x="0.5" y="0.5" width="${WIDTH - 1}" height="${HEIGHT - 1}" rx="16" stroke-width="1"/>
  <text class="fg" x="${PAD}" y="38" font-size="18" font-weight="700">Languages I write</text>
  <text class="dim" x="${WIDTH - PAD}" y="38" text-anchor="end" font-size="12.5">By code size across ${repoCount} public repositories</text>
  <g clip-path="url(#bar)">${segments}</g>
  ${legend}`);
}
