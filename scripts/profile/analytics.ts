/**
 * GitHub analytics graphics, all drawn from scripts/profile/github.ts:
 * a summary with the year's contributions as an area line, donuts for
 * languages, commits per hour of the day, and a card of account totals.
 */
import type { DayCount, GitHubStats, Share } from "./github.ts";
import { EASE, escapeXml, styles, svg } from "./theme.ts";

const HALF = 590; // width of a card shown two to a row
const FULL = 1200;
const HEIGHT = 300;
const PAD = 28;
const TOP = 92;
const BOTTOM = HEIGHT - 44;

const number = (value: number) => value.toLocaleString("en-US");

const panel = (width: number) => `<rect class="panel edge" x="0.5" y="0.5" width="${width - 1}" height="${HEIGHT - 1}" rx="16" stroke-width="1"/>`;

const heading = (title: string, subtitle: string) => `
  <text class="fg" x="${PAD}" y="38" font-size="18" font-weight="700">${escapeXml(title)}</text>
  <text class="dim" x="${PAD}" y="58" font-size="12.5">${escapeXml(subtitle)}</text>`;

const figure = (width: number, value: string, caption: string) => `
  <text class="fg" x="${width - PAD}" y="40" text-anchor="end" font-size="22" font-weight="700">${escapeXml(value)}</text>
  <text class="dim" x="${width - PAD}" y="58" text-anchor="end" font-size="12.5">${escapeXml(caption)}</text>`;

/** 16×16 outline icons for the summary and totals lists. */
const ICONS = {
  pulse: "M1.5 8h3l2-5 3 10 2-5h3",
  repo: "M3.5 2.5h9v11h-9zM6 2.5v11M8.5 5.5h2",
  calendar: "M2.5 4h11v9.5h-11zM2.5 7h11M5.5 2.5v3M10.5 2.5v3",
  star: "M8 2l1.8 3.8 4.2.5-3.1 2.9.8 4.1L8 11.3l-3.7 2 .8-4.1L2 6.3l4.2-.5z",
  commit: "M1.5 8h3.5M11 8h3.5M8 5a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  pull: "M4.5 5.5v5M4.5 2.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM4.5 10.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM11.5 10.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM11.5 10.5V7a2 2 0 0 0-2-2H8",
  issue: "M8 2a6 6 0 1 0 0 12A6 6 0 0 0 8 2zM8 5v3.5M8 11v.2",
  people: "M6 7.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM1.5 13.5c0-2.5 2-4 4.5-4s4.5 1.5 4.5 4M11 3a2.3 2.3 0 0 1 0 4.4M12.5 9.8c1.300 0.600 2 1.900 2 3.700",
} as const;

type IconName = keyof typeof ICONS;

/** A list row: icon, bold value and what it counts. */
const row = (icon: IconName, value: string, label: string, x: number, y: number, order: number) => `
  <g class="row" style="animation-delay: ${(0.15 + order * 0.08).toFixed(2)}s">
    <path class="accent-line" transform="translate(${x} ${y - 13})" d="${ICONS[icon]}" fill="none" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="${x + 28}" y="${y}" font-size="14.5"><tspan class="fg" font-weight="700">${escapeXml(value)}</tspan><tspan class="muted" dx="7">${escapeXml(label)}</tspan></text>
  </g>`;

const ROW_CSS = `
    .row { animation: row-in 0.6s ${EASE} backwards; }
    @keyframes row-in { from { opacity: 0; transform: translateX(-8px); } }`;

/** "6 years ago", "8 months ago". */
function ago(date: Date, now = new Date()): string {
  const months = (now.getFullYear() - date.getFullYear()) * 12 + now.getMonth() - date.getMonth();
  const [value, unit] = months >= 12 ? [Math.floor(months / 12), "year"] : [Math.max(months, 1), "month"];
  return `${value} ${unit}${value === 1 ? "" : "s"} ago`;
}

/** Contributions per month as a smooth area line inside the given box. */
function areaLine(days: DayCount[], left: number, right: number): { body: string; css: string; busiest: string } {
  const totals = new Map<string, number>();
  for (const day of days) totals.set(day.date.slice(0, 7), (totals.get(day.date.slice(0, 7)) ?? 0) + day.count);
  const months = [...totals.entries()].slice(-12);
  const max = Math.max(...months.map(([, count]) => count), 1);
  const step = (right - left) / (months.length - 1);
  const points = months.map(([, count], i) => [left + i * step, BOTTOM - (count / max) * (BOTTOM - TOP)] as const);

  // Smooth line through the points (Catmull-Rom converted to cubic Béziers).
  const clamp = (v: number) => Math.min(BOTTOM, Math.max(TOP, v));
  const line = points
    .map(([x, y], i) => {
      if (i === 0) return `M${x.toFixed(1)} ${y.toFixed(1)}`;
      const [px, py] = points[i - 1];
      const [ppx, ppy] = points[i - 2] ?? points[i - 1];
      const [nx, ny] = points[i + 1] ?? points[i];
      return `C${(px + (x - ppx) / 6).toFixed(1)} ${clamp(py + (y - ppy) / 6).toFixed(1)} ${(x - (nx - px) / 6).toFixed(1)} ${clamp(y - (ny - py) / 6).toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
  const area = `${line} L${points[points.length - 1][0].toFixed(1)} ${BOTTOM} L${left} ${BOTTOM} Z`;

  const labels = months
    .map(([month], i) => (i % 2 === 0 ? `<text class="dim" x="${(left + i * step).toFixed(1)}" y="${HEIGHT - 18}" text-anchor="middle" font-size="11.5">${new Date(`${month}-01T00:00:00Z`).toLocaleString("en-US", { month: "short", timeZone: "UTC" })}</text>` : ""))
    .join("");
  const peakIndex = months.reduce((best, [, count], i) => (count > months[best][1] ? i : best), 0);
  const peak = points[peakIndex];
  const busiest = new Date(`${months[peakIndex][0]}-01T00:00:00Z`).toLocaleString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });

  const css = `
    .line { stroke-dasharray: 1; stroke-dashoffset: 1; animation: draw 1.8s ${EASE} 0.2s forwards; }
    .area { animation: fade 1.2s ease-out 0.9s backwards; }
    .peak { transform-box: fill-box; transform-origin: center; animation: pulse 2.4s ease-out 2s infinite; }
    @keyframes draw { to { stroke-dashoffset: 0; } }
    @keyframes fade { from { opacity: 0; } }
    @keyframes pulse { 0% { transform: scale(1); opacity: 0.8; } 70%, 100% { transform: scale(3); opacity: 0; } }
    @media (prefers-reduced-motion: reduce) { .line { animation: none; stroke-dashoffset: 0; } .area, .peak { animation: none; } }`;

  const body = `<defs><linearGradient id="under" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="stop-accent" stop-opacity="0.35"/><stop offset="1" class="stop-accent" stop-opacity="0"/></linearGradient></defs>
  <line class="edge" x1="${left}" y1="${BOTTOM}" x2="${right}" y2="${BOTTOM}"/>
  <path class="area" d="${area}" fill="url(#under)"/>
  <path class="line accent-line" d="${line}" fill="none" stroke-width="2.5" stroke-linecap="round" pathLength="1"/>
  <circle class="peak accent" cx="${peak[0].toFixed(1)}" cy="${peak[1].toFixed(1)}" r="5"/>
  <circle class="accent" cx="${peak[0].toFixed(1)}" cy="${peak[1].toFixed(1)}" r="4.5"/>
  ${labels}`;
  return { body, css, busiest };
}

/** Full-width summary: who, three headline facts, and the year's contributions per month. */
export function summaryCard(name: string, stats: GitHubStats): string {
  const chart = areaLine(stats.days, 470, FULL - PAD - 6);
  const css = `${ROW_CSS}${chart.css}
    @media (prefers-reduced-motion: reduce) { .row { animation: none; } }`;
  return svg(FULL, HEIGHT, `${name} on GitHub: ${number(stats.contributions)} contributions in the last year, ${stats.publicRepos} public repositories, joined ${ago(stats.joined)}`, `  ${styles(css)}
  ${panel(FULL)}
  ${heading(`${stats.login} (${name})`, "GitHub at a glance")}
  ${figure(FULL, number(stats.contributions), "contributions in the last year")}
  ${row("repo", number(stats.publicRepos), "public repositories", PAD, 128, 0)}
  ${row("calendar", ago(stats.joined), "joined GitHub", PAD, 172, 1)}
  ${row("pulse", chart.busiest, "was the busiest month", PAD, 216, 2)}
  ${chart.body}`);
}

/** Opacity of each donut slice, largest first: one colour, so the legend's order carries the reading. */
const SLICE_OPACITY = [1, 0.66, 0.42, 0.26, 0.14];

/** Keeps the largest slices and folds the rest into "Other". */
function topShares(shares: Share[], keep = SLICE_OPACITY.length): Share[] {
  if (shares.length <= keep) return shares;
  const rest = shares.slice(keep - 1).reduce((sum, share) => sum + share.count, 0);
  return [...shares.slice(0, keep - 1), { label: "Other", count: rest }];
}

/** A donut with its legend: each slice's share of the whole. */
export function donutChart(title: string, subtitle: string, shares: Share[], unit: string): string {
  const slices = topShares(shares);
  const total = Math.max(slices.reduce((sum, slice) => sum + slice.count, 0), 1);
  const cx = HALF - PAD - 92;
  const cy = 176;
  const radius = 68;
  const circumference = 2 * Math.PI * radius;

  let start = 0;
  const arcs = slices
    .map((slice, i) => {
      const length = (slice.count / total) * circumference;
      const arc = `<circle class="accent-line slice" cx="${cx}" cy="${cy}" r="${radius}" fill="none" stroke-width="26" stroke-opacity="${SLICE_OPACITY[i]}" stroke-dasharray="${Math.max(length - 2, 0.5).toFixed(2)} ${(circumference - Math.max(length - 2, 0.5)).toFixed(2)}" stroke-dashoffset="${(-start).toFixed(2)}" transform="rotate(-90 ${cx} ${cy})" style="animation-delay: ${(0.2 + i * 0.12).toFixed(2)}s"/>`;
      start += length;
      return arc;
    })
    .join("\n  ");

  const legend = slices
    .map((slice, i) => {
      const y = 112 + i * 32;
      return `<g class="row" style="animation-delay: ${(0.2 + i * 0.12).toFixed(2)}s">
    <rect class="accent" x="${PAD}" y="${y - 11}" width="12" height="12" rx="3" fill-opacity="${SLICE_OPACITY[i]}"/>
    <text class="fg" x="${PAD + 24}" y="${y}" font-size="14.5" font-weight="600">${escapeXml(slice.label)}</text>
    <text class="dim" x="${PAD + 250}" y="${y}" text-anchor="end" font-size="13">${Math.round((slice.count / total) * 100)}% · ${number(slice.count)}</text>
  </g>`;
    })
    .join("\n  ");

  const css = `${ROW_CSS}
    .slice { animation: slice-in 0.8s ${EASE} backwards; }
    @keyframes slice-in { from { opacity: 0; } }
    @media (prefers-reduced-motion: reduce) { .row, .slice { animation: none; } }`;

  return svg(HALF, HEIGHT, `${title}: ${slices.map((slice) => `${slice.label} ${slice.count}`).join(", ")}`, `  ${styles(css)}
  ${panel(HALF)}
  ${heading(title, subtitle)}
  ${arcs}
  <text class="fg" x="${cx}" y="${cy + 2}" text-anchor="middle" font-size="24" font-weight="700">${number(total)}</text>
  <text class="dim" x="${cx}" y="${cy + 20}" text-anchor="middle" font-size="11.5">${escapeXml(unit)}</text>
  ${legend}`);
}

/** My commits per hour of the day, in the named time zone. */
export function hoursChart(hours: number[], zoneName: string, commits: number): string {
  const max = Math.max(...hours, 1);
  const busiest = hours.indexOf(max);
  const slot = (HALF - PAD * 2) / hours.length;
  const barWidth = slot * 0.62;
  const clock = (hour: number) => `${String(hour).padStart(2, "0")}:00`;

  const bars = hours
    .map((count, hour) => {
      const height = Math.max(3, (count / max) * (BOTTOM - TOP));
      const x = PAD + hour * slot + (slot - barWidth) / 2;
      const label = hour % 6 === 0 ? `\n  <text class="dim" x="${(x + barWidth / 2).toFixed(1)}" y="${HEIGHT - 18}" text-anchor="middle" font-size="11.5">${clock(hour)}</text>` : "";
      return `<rect class="bar accent${hour === busiest ? "" : " soft"}" x="${x.toFixed(1)}" y="${(BOTTOM - height).toFixed(1)}" width="${barWidth.toFixed(1)}" height="${height.toFixed(1)}" rx="4" style="animation-delay: ${(0.2 + hour * 0.03).toFixed(2)}s"/>${label}`;
    })
    .join("\n  ");

  const css = `
    .bar { transform-box: fill-box; transform-origin: bottom; animation: grow 0.9s ${EASE} backwards; }
    .soft { fill-opacity: 0.32; }
    @keyframes grow { from { transform: scaleY(0); } }
    @media (prefers-reduced-motion: reduce) { .bar { animation: none; } }`;

  return svg(HALF, HEIGHT, `Commits per hour of the day (${zoneName} time), busiest at ${clock(busiest)}: ${hours.join(", ")}`, `  ${styles(css)}
  ${panel(HALF)}
  ${heading("When I commit", `${number(commits)} commits by hour of the day, ${zoneName} time`)}
  ${figure(HALF, clock(busiest), "is my busiest hour")}
  <line class="edge" x1="${PAD}" y1="${BOTTOM}" x2="${HALF - PAD}" y2="${BOTTOM}"/>
  ${bars}`);
}

/** Account totals as a list. */
export function statsCard(stats: GitHubStats): string {
  const rows: [IconName, number, string][] = [
    ["commit", stats.commitsLastYear, "commits in the last year"],
    ["pull", stats.pullRequests, "pull requests opened"],
    ["issue", stats.issues, "issues opened"],
    ["people", stats.contributedTo, "repositories contributed to"],
    ["star", stats.stars, "stars on my repositories"],
  ];
  const css = `${ROW_CSS}
    @media (prefers-reduced-motion: reduce) { .row { animation: none; } }`;
  return svg(HALF, HEIGHT, `GitHub totals: ${rows.map(([, value, label]) => `${value} ${label}`).join(", ")}`, `  ${styles(css)}
  ${panel(HALF)}
  ${heading("Totals", "Counted by GitHub")}
  ${rows.map(([icon, value, label], i) => row(icon, number(value), label, PAD, 108 + i * 36, i)).join("")}`);
}
