/**
 * Two analytics charts from my GitHub contribution calendar: contributions
 * per month as an area line that draws itself, and contributions by weekday
 * as bars that grow. They show trends the calendar heatmap doesn't.
 */
import { EASE, escapeXml, styles, svg } from "./theme.ts";

const WIDTH = 590;
const HEIGHT = 300;
const PAD = 28;
const TOP = 92;
const BOTTOM = HEIGHT - 44;

export interface DayCount {
  date: string; // YYYY-MM-DD
  count: number;
}

const frame = (title: string, subtitle: string, figure: string, caption: string) => `
  <rect class="panel edge" x="0.5" y="0.5" width="${WIDTH - 1}" height="${HEIGHT - 1}" rx="16" stroke-width="1"/>
  <text class="fg" x="${PAD}" y="38" font-size="18" font-weight="700">${escapeXml(title)}</text>
  <text class="dim" x="${PAD}" y="58" font-size="12.5">${escapeXml(subtitle)}</text>
  <text class="fg" x="${WIDTH - PAD}" y="40" text-anchor="end" font-size="22" font-weight="700">${escapeXml(figure)}</text>
  <text class="dim" x="${WIDTH - PAD}" y="58" text-anchor="end" font-size="12.5">${escapeXml(caption)}</text>`;

/** Contributions per month over the last year. */
export function monthlyChart(days: DayCount[]): string {
  const totals = new Map<string, number>();
  for (const day of days) totals.set(day.date.slice(0, 7), (totals.get(day.date.slice(0, 7)) ?? 0) + day.count);
  const months = [...totals.entries()].slice(-12);
  const max = Math.max(...months.map(([, count]) => count), 1);
  const step = (WIDTH - PAD * 2) / (months.length - 1);
  const points = months.map(([, count], i) => [PAD + i * step, BOTTOM - (count / max) * (BOTTOM - TOP)] as const);

  // Smooth line through the points (Catmull-Rom converted to cubic Béziers).
  const line = points
    .map(([x, y], i) => {
      if (i === 0) return `M${x.toFixed(1)} ${y.toFixed(1)}`;
      const [px, py] = points[i - 1];
      const [ppx, ppy] = points[i - 2] ?? points[i - 1];
      const [nx, ny] = points[i + 1] ?? points[i];
      const clamp = (v: number) => Math.min(BOTTOM, Math.max(TOP, v));
      return `C${(px + (x - ppx) / 6).toFixed(1)} ${clamp(py + (y - ppy) / 6).toFixed(1)} ${(x - (nx - px) / 6).toFixed(1)} ${clamp(y - (ny - py) / 6).toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
  const area = `${line} L${points[points.length - 1][0].toFixed(1)} ${BOTTOM} L${PAD} ${BOTTOM} Z`;

  const labels = months
    .map(([month], i) => (i % 2 === 0 ? `<text class="dim" x="${(PAD + i * step).toFixed(1)}" y="${HEIGHT - 18}" text-anchor="middle" font-size="11.5">${new Date(`${month}-01T00:00:00Z`).toLocaleString("en-US", { month: "short", timeZone: "UTC" })}</text>` : ""))
    .join("");
  const [peakMonth, peak] = months.reduce((best, entry) => (entry[1] > best[1] ? entry : best));
  const peakIndex = months.findIndex(([month]) => month === peakMonth);
  const total = months.reduce((sum, [, count]) => sum + count, 0);

  const css = `
    .line { stroke-dasharray: 1; stroke-dashoffset: 1; animation: draw 1.8s ${EASE} 0.2s forwards; }
    .area { animation: fade 1.2s ease-out 0.9s backwards; }
    .peak { transform-box: fill-box; transform-origin: center; animation: pulse 2.4s ease-out 2s infinite; }
    @keyframes draw { to { stroke-dashoffset: 0; } }
    @keyframes fade { from { opacity: 0; } }
    @keyframes pulse { 0% { transform: scale(1); opacity: 0.8; } 70%, 100% { transform: scale(3); opacity: 0; } }
    @media (prefers-reduced-motion: reduce) { .line { animation: none; stroke-dashoffset: 0; } .area, .peak { animation: none; } }`;

  return svg(WIDTH, HEIGHT, `Contributions per month over the last year: ${total.toLocaleString("en-US")} in total, busiest month ${peak}`, `  ${styles(css)}
  <defs><linearGradient id="under" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="stop-accent" stop-opacity="0.35"/><stop offset="1" class="stop-accent" stop-opacity="0"/></linearGradient></defs>
  ${frame("Activity over the year", "Contributions per month", total.toLocaleString("en-US"), "in the last 12 months")}
  <line class="edge" x1="${PAD}" y1="${BOTTOM}" x2="${WIDTH - PAD}" y2="${BOTTOM}"/>
  <path class="area" d="${area}" fill="url(#under)"/>
  <path class="line accent-line" d="${line}" fill="none" stroke-width="2.5" stroke-linecap="round" pathLength="1"/>
  <circle class="peak accent" cx="${points[peakIndex][0].toFixed(1)}" cy="${points[peakIndex][1].toFixed(1)}" r="5"/>
  <circle class="accent" cx="${points[peakIndex][0].toFixed(1)}" cy="${points[peakIndex][1].toFixed(1)}" r="4.5"/>
  ${labels}`);
}

/** Contributions by day of the week over the last year. */
export function weekdayChart(days: DayCount[]): string {
  const names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const totals = names.map(() => 0);
  for (const day of days) totals[new Date(`${day.date}T00:00:00Z`).getUTCDay()] += day.count;
  const max = Math.max(...totals, 1);
  const busiest = totals.indexOf(max);
  const slot = (WIDTH - PAD * 2) / names.length;
  const barWidth = slot * 0.56;

  const bars = totals
    .map((count, i) => {
      const height = Math.max(3, (count / max) * (BOTTOM - TOP));
      const x = PAD + i * slot + (slot - barWidth) / 2;
      return `<rect class="bar ${i === busiest ? "accent" : "soft"}" x="${x.toFixed(1)}" y="${(BOTTOM - height).toFixed(1)}" width="${barWidth.toFixed(1)}" height="${height.toFixed(1)}" rx="6" style="animation-delay: ${(0.2 + i * 0.09).toFixed(2)}s"/>
  <text class="${i === busiest ? "fg" : "dim"}" x="${(x + barWidth / 2).toFixed(1)}" y="${HEIGHT - 18}" text-anchor="middle" font-size="12"${i === busiest ? ` font-weight="700"` : ""}>${names[i]}</text>`;
    })
    .join("\n  ");

  const css = `
    .bar { transform-box: fill-box; transform-origin: bottom; animation: grow 0.9s ${EASE} backwards; }
    .soft { fill-opacity: 0.32; }
    @keyframes grow { from { transform: scaleY(0); } }
    @media (prefers-reduced-motion: reduce) { .bar { animation: none; } }`;

  return svg(WIDTH, HEIGHT, `Contributions by weekday: ${names.map((name, i) => `${name} ${totals[i]}`).join(", ")}`, `  ${styles(css)}
  ${frame("When I code", "Contributions by day of the week", names[busiest], "is my busiest day")}
  <line class="edge" x1="${PAD}" y1="${BOTTOM}" x2="${WIDTH - PAD}" y2="${BOTTOM}"/>
  <g class="accent">${bars}</g>`);
}
