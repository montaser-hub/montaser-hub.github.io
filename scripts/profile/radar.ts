/**
 * Radar chart: how many of my projects touch each area. The shape draws
 * itself outwards from the centre, then breathes slightly.
 */
import { EASE, escapeXml, styles, svg } from "./theme.ts";

const WIDTH = 590;

export interface RadarAxis {
  label: string;
  count: number;
}

export function radar(axes: RadarAxis[], total: number, height: number): string {
  const cx = WIDTH / 2;
  const cy = height / 2 + 30;
  const radius = Math.min(WIDTH, height) / 2 - 86;
  const max = Math.max(...axes.map((axis) => axis.count), 1);
  const point = (i: number, r: number) => {
    const angle = (i / axes.length) * Math.PI * 2 - Math.PI / 2;
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)] as const;
  };
  const polygon = (r: (i: number) => number) => axes.map((_, i) => point(i, r(i)).map((n) => n.toFixed(1)).join(",")).join(" ");

  const rings = [0.25, 0.5, 0.75, 1].map((f) => `<polygon class="edge" points="${polygon(() => radius * f)}" fill="none" stroke-width="1"/>`).join("");
  const spokes = axes.map((_, i) => { const [x, y] = point(i, radius); return `<line class="edge" x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}"/>`; }).join("");
  const labels = axes
    .map((axis, i) => {
      const [x, rawY] = point(i, radius + 20);
      const anchor = Math.abs(x - cx) < 8 ? "middle" : x > cx ? "start" : "end";
      // A label straight above the chart has two lines; lift it clear of the top point.
      const y = anchor === "middle" && rawY < cy ? rawY - 18 : rawY;
      return `<text class="fg" x="${x.toFixed(1)}" y="${(y + 2).toFixed(1)}" text-anchor="${anchor}" font-size="13.5" font-weight="600">${escapeXml(axis.label)}</text>
  <text class="dim" x="${x.toFixed(1)}" y="${(y + 19).toFixed(1)}" text-anchor="${anchor}" font-size="12">${axis.count} of ${total}</text>`;
    })
    .join("\n  ");
  const dots = axes.map((axis, i) => { const [x, y] = point(i, (radius * axis.count) / max); return `<circle class="accent" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4"/>`; }).join("");

  const css = `
    .shape { transform-origin: ${cx}px ${cy}px; animation: grow 1.4s ${EASE} backwards, breathe 6s ease-in-out 1.4s infinite; }
    @keyframes grow { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }
    @keyframes breathe { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.04); } }
    @media (prefers-reduced-motion: reduce) { .shape { animation: none; } }`;

  return svg(WIDTH, height, `Projects per area: ${axes.map((axis) => `${axis.label} ${axis.count} of ${total}`).join(", ")}`, `  ${styles(css)}
  <rect class="panel edge" x="0.5" y="0.5" width="${WIDTH - 1}" height="${height - 1}" rx="16" stroke-width="1"/>
  <text class="fg" x="24" y="38" font-size="18" font-weight="700">Where my projects sit</text>
  <text class="dim" x="24" y="58" font-size="12.5">Projects touching each area, out of ${total}</text>
  ${rings}${spokes}
  <g class="shape">
    <polygon points="${polygon((i) => (radius * axes[i].count) / max)}" class="accent accent-line" fill-opacity="0.2" stroke-width="2" stroke-linejoin="round"/>
    ${dots}
  </g>
  ${labels}`);
}
