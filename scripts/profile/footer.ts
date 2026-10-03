/** Closing banner: a call to action over layered waves that drift sideways. */
import { escapeXml, styles, svg } from "./theme.ts";

const WIDTH = 1200;
const HEIGHT = 200;

/** One period-repeating wave, drawn two periods wide so it can slide by one period seamlessly. */
function wave(y: number, amplitude: number, period: number): string {
  let d = `M0 ${y}`;
  for (let x = 0; x < WIDTH * 2; x += period) {
    d += ` Q${x + period / 4} ${y - amplitude} ${x + period / 2} ${y} T${x + period} ${y}`;
  }
  return `${d} V${HEIGHT} H0 Z`;
}

export function footer(title: string, line: string): string {
  const css = `
    .wave-1 { animation: slide-600 14s linear infinite; }
    .wave-2 { animation: slide-400 9s linear infinite reverse; }
    @keyframes slide-600 { to { transform: translateX(-600px); } }
    @keyframes slide-400 { to { transform: translateX(-400px); } }
    @media (prefers-reduced-motion: reduce) { .wave-1, .wave-2 { animation: none; } }`;

  return svg(WIDTH, HEIGHT, `${title}. ${line}`, `  ${styles(css)}
  <defs><clipPath id="frame"><rect width="${WIDTH}" height="${HEIGHT}" rx="20"/></clipPath></defs>
  <g clip-path="url(#frame)">
    <rect class="panel" width="${WIDTH}" height="${HEIGHT}"/>
    <path class="wave-1 accent" d="${wave(150, 22, 600)}" opacity="0.14"/>
    <path class="wave-2 accent" d="${wave(166, 16, 400)}" opacity="0.22"/>
  </g>
  <rect class="edge" x="0.5" y="0.5" width="${WIDTH - 1}" height="${HEIGHT - 1}" rx="20" fill="none"/>
  <text class="fg" x="${WIDTH / 2}" y="78" text-anchor="middle" font-size="38" font-weight="800" letter-spacing="-0.5">${escapeXml(title)}</text>
  <text class="muted" x="${WIDTH / 2}" y="112" text-anchor="middle" font-size="17">${escapeXml(line)}</text>`);
}
