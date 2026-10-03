/**
 * Generates the GitHub profile README (the `montaser-hub/montaser-hub` repo)
 * from the same data as the portfolio site, so the two never disagree.
 *
 *   npm run profile        writes profile/README.md and profile/assets/
 *
 * Everything is self-contained: the banner and the activity graph are SVGs
 * committed next to the README, and screenshots are copied from
 * public/projects. No third-party badge or stats services, which break or get
 * rate-limited on profile pages. The activity graph reads the contribution
 * calendar through the GitHub CLI (`gh`), so re-run this to refresh it.
 */
import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { caseStudies, copy, profile, techStack } from "../lib/data.ts";
import { OVERRIDES, SELECTED_REPOS } from "../lib/project-catalog.ts";
import type { CaseStudy } from "../lib/types.ts";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT = path.join(ROOT, "profile");
const ASSETS = path.join(OUT, "assets");

// Portfolio palette (app/globals.css), plus a light variant for GitHub's light theme.
const DARK = { background: "#05070a", foreground: "#e7ebf3", muted: "#8b96a8", dim: "#77828f", accent: "#f6821f", border: "#1a2130" };
const LIGHT = { background: "#ffffff", foreground: "#0d1117", muted: "#57606a", dim: "#6e7781", accent: "#c2570c", border: "#d0d7de" };
type Palette = typeof DARK;

const escapeXml = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/**
 * Theme rules shared by both SVGs: colours are classes, dark by default,
 * switched by the viewer's colour scheme (which is what GitHub follows).
 */
function themeCss(): string {
  const rules = (c: Palette) =>
    `.bg { fill: ${c.background}; stroke: ${c.border}; } .fg { fill: ${c.foreground}; } .muted { fill: ${c.muted}; } .dim { fill: ${c.dim}; } .accent { fill: ${c.accent}; } .cell { fill: ${c.border}; } .line { stroke: ${c.border}; } .ring { stroke: ${c.accent}; }`;
  return `${rules(DARK)}
    @media (prefers-color-scheme: light) { ${rules(LIGHT)} }`;
}

const FONT_SANS = `ui-sans-serif, -apple-system, "Segoe UI", Helvetica, Arial, sans-serif`;
const FONT_MONO = `ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace`;

/**
 * Typewriter line for the banner, in pure CSS so it plays inside an <img>.
 * Each phrase is revealed by a clip that grows one character at a time
 * (steps()), held, deleted, then the next phrase takes its slot. `textLength`
 * pins every phrase to a known width, so the clip and caret stay aligned
 * whatever monospace font the viewer has.
 */
function typewriter(phrases: string[], x: number, y: number): { css: string; svg: string } {
  const charWidth = 9.6; // 16px monospace
  const slot = 5; // seconds per phrase
  const total = phrases.length * slot;
  const pct = (seconds: number) => `${((seconds / total) * 100).toFixed(3)}%`;

  const css = phrases
    .map((phrase, i) => {
      const width = phrase.length * charWidth;
      const start = i * slot;
      const typed = start + Math.min(2.2, phrase.length * 0.05);
      const hold = start + slot - 1.2;
      const gone = start + slot - 0.4;
      // Outside its slot a phrase is fully clipped; the caret follows the clip edge.
      const frames = (from: string, to: string) => `
      0%, ${pct(start)} { transform: ${from}; animation-timing-function: steps(${phrase.length}, end); }
      ${pct(typed)}, ${pct(hold)} { transform: ${to}; animation-timing-function: steps(${phrase.length}, end); }
      ${pct(gone)}, 100% { transform: ${from}; }`;
      return `
    @keyframes reveal-${i} {${frames("scaleX(0)", "scaleX(1)")} }
    @keyframes caret-${i} {${frames("translateX(0)", `translateX(${width.toFixed(1)}px)`)} }
    @keyframes show-${i} { 0%, ${pct(start)} { opacity: 0; } ${pct(start + 0.01)}, ${pct(gone)} { opacity: 1; } ${pct(gone + 0.01)}, 100% { opacity: 0; } }
    .clip-${i} { transform-box: fill-box; transform-origin: left; animation: reveal-${i} ${total}s infinite; }
    .caret-${i} { animation: caret-${i} ${total}s infinite, show-${i} ${total}s infinite; }`;
    })
    .join("");

  const svg = phrases
    .map((phrase, i) => {
      const width = (phrase.length * charWidth).toFixed(1);
      return `<clipPath id="clip-${i}"><rect class="clip-${i}" x="${x}" y="${y - 18}" width="${width}" height="26"/></clipPath>
  <text class="typed${i === 0 ? " typed-first" : ""} muted" clip-path="url(#clip-${i})" x="${x}" y="${y}" textLength="${width}" lengthAdjust="spacing">${escapeXml(phrase)}</text>
  <rect class="caret caret-${i} accent" x="${x + 1}" y="${y - 14}" width="2" height="18"/>`;
    })
    .join("\n  ");

  return { css, svg };
}

/** Dotted globe with pulsing markers, echoing the portfolio's hero. */
function globe(cx: number, cy: number, r: number): string {
  // Orthographic projection of a latitude/longitude grid: dots bunch up and
  // fade towards the limb, which is what makes the disc read as a sphere.
  const rad = (deg: number) => (deg * Math.PI) / 180;
  const dots: string[] = [];
  for (let lat = -75; lat <= 75; lat += 12.5) {
    for (let lon = -82; lon <= 82; lon += 11) {
      const x = cx + r * Math.cos(rad(lat)) * Math.sin(rad(lon));
      const y = cy - r * Math.sin(rad(lat));
      const facing = Math.cos(rad(lat)) * Math.cos(rad(lon)); // 1 at the centre, 0 at the limb
      dots.push(`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(0.7 + 0.8 * facing).toFixed(2)}" fill-opacity="${(0.2 + 0.6 * facing).toFixed(2)}"/>`);
    }
  }
  const markers = [
    [0.28, -0.35, 0], [-0.45, -0.1, 1.1], [0.1, 0.3, 2.2],
  ].map(([dx, dy, delay]) => {
    const x = (cx + dx * r).toFixed(1), y = (cy + dy * r).toFixed(1);
    return `<circle class="ring pulse" cx="${x}" cy="${y}" r="4" fill="none" stroke-width="1.5" style="animation-delay:${delay}s"/><circle class="accent" cx="${x}" cy="${y}" r="3"/>`;
  });
  return `<g class="dim">${dots.join("")}</g>
  <circle class="line" cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke-width="1"/>
  ${markers.join("\n  ")}`;
}

/**
 * Banner: name, title and a typewriter line cycling through the same phrases
 * as the site's hero, beside a dotted globe. All animation is CSS inside the
 * SVG, so it plays on GitHub, follows the light or dark theme, and is
 * replaced by a still image for viewers who prefer reduced motion.
 */
function banner(): string {
  const lead = `${copy.hero.headlineLead} `;
  const phrases = copy.hero.headlinePhrases;
  const typedX = 48 + lead.length * 9.6;
  const typed = typewriter(phrases, typedX, 168);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 880 220" width="880" height="220" role="img" aria-label="${escapeXml(`${profile.name}, ${profile.title}. ${lead}${phrases[0]}`)}">
  <style>
    ${themeCss()}
    text { font-family: ${FONT_SANS}; }
    .mono, .typed { font-family: ${FONT_MONO}; font-size: 16px; }
    .rule { transform-box: fill-box; transform-origin: left; animation: draw 1.2s ease-out both; }
    .pulse { transform-box: fill-box; transform-origin: center; animation: pulse 3.3s ease-out infinite; }
    @keyframes draw { from { transform: scaleX(0); } to { transform: scaleX(1); } }
    @keyframes pulse { 0% { transform: scale(1); opacity: 0.9; } 70%, 100% { transform: scale(3.2); opacity: 0; } }
    ${typed.css}
    @media (prefers-reduced-motion: reduce) {
      .rule, .pulse, .caret, [class^="clip-"] { animation: none !important; }
      .caret { opacity: 0; }
      .typed:not(.typed-first) { display: none; }
    }
  </style>
  <rect class="bg" x="0.5" y="0.5" width="879" height="219" rx="12"/>
  ${globe(730, 110, 84)}
  <text class="mono accent" x="48" y="62">${escapeXml(copy.hero.eyebrow)}</text>
  <text class="fg" x="48" y="106" font-size="40" font-weight="700">${escapeXml(profile.name)}</text>
  <rect class="rule accent" x="48" y="124" width="64" height="2"/>
  <text class="muted" x="124" y="130" font-size="15" font-weight="500">${escapeXml(`${profile.title} · ${profile.location}`)}</text>
  <text class="mono fg" x="48" y="168">${escapeXml(lead.trimEnd())}</text>
  ${typed.svg}
</svg>
`;
}

interface ContributionDay {
  date: string;
  contributionCount: number;
}

interface Activity {
  total: number;
  weeks: ContributionDay[][];
}

/** The last year of contributions, or undefined when `gh` isn't available. */
function fetchActivity(): Activity | undefined {
  const login = profile.github.split("/").pop();
  const query = `{ user(login: "${login}") { contributionsCollection { contributionCalendar {
    totalContributions weeks { contributionDays { date contributionCount } } } } } }`;
  try {
    const out = execFileSync("gh", ["api", "graphql", "-f", `query=${query}`], { encoding: "utf8" });
    const calendar = JSON.parse(out).data.user.contributionsCollection.contributionCalendar;
    return {
      total: calendar.totalContributions,
      weeks: calendar.weeks.map((week: { contributionDays: ContributionDay[] }) => week.contributionDays),
    };
  } catch {
    console.warn("Skipping the activity graph: could not read contributions with `gh`.");
    return undefined;
  }
}

/**
 * Contribution heatmap in the portfolio's palette. Columns fade in from left
 * to right once; reduced motion shows the finished graph.
 */
function activityGraph({ total, weeks }: Activity): string {
  const cell = 11, gap = 3, left = 24, top = 44;
  const width = left * 2 + weeks.length * (cell + gap) - gap;
  const height = top + 7 * (cell + gap) + 16;
  const counts = weeks.flat().map((day) => day.contributionCount);
  const max = Math.max(...counts, 1);
  // Five steps, like GitHub's own graph: empty, then quartiles of the busiest day.
  const opacity = (count: number) => (count === 0 ? 0 : [0.3, 0.5, 0.75, 1][Math.min(3, Math.floor((count / max) * 4))]);

  const cells = weeks
    .map((week, x) => {
      const days = week
        .map((day) => {
          const y = new Date(day.date).getUTCDay();
          const level = opacity(day.contributionCount);
          return `<rect class="${level ? "accent" : "cell"}" x="${left + x * (cell + gap)}" y="${top + y * (cell + gap)}" width="${cell}" height="${cell}" rx="2"${level ? ` fill-opacity="${level}"` : ""}><title>${day.date}: ${day.contributionCount}</title></rect>`;
        })
        .join("");
      return `<g class="week" style="animation-delay:${(x * 0.018).toFixed(3)}s">${days}</g>`;
    })
    .join("\n  ");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="${total} contributions in the last year">
  <style>
    ${themeCss()}
    text { font-family: ${FONT_SANS}; }
    .week { opacity: 0; animation: appear 0.4s ease-out forwards; }
    @keyframes appear { to { opacity: 1; } }
    @media (prefers-reduced-motion: reduce) { .week { animation: none; opacity: 1; } }
  </style>
  <rect class="bg" x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" rx="12"/>
  <text x="${left}" y="28" font-size="14"><tspan class="fg" font-weight="600">${total.toLocaleString("en-US")}</tspan><tspan class="muted"> contributions in the last year</tspan></text>
  ${cells}
</svg>
`;
}

/** Copies a site screenshot into the profile repo and returns its relative path. */
function asset(sitePath: string): string | undefined {
  const source = path.join(ROOT, "public", sitePath);
  if (!existsSync(source)) return undefined;
  const name = path.basename(sitePath);
  copyFileSync(source, path.join(ASSETS, name));
  return `assets/${name}`;
}

const links = (items: { label: string; href: string }[]) =>
  items.map(({ label, href }) => `<a href="${href}">${label}</a>`).join(" · ");

/** One cell of the featured-work grid: screenshot, name, one line, key numbers. */
function caseStudyCell(study: CaseStudy): string {
  const image = study.image && asset(study.image);
  const stats = study.stats?.map((s) => `<b>${s.value}</b> ${s.label}`).join(" · ");
  const footer = study.links ? links(study.links) : `<i>${study.note}</i>`;
  return `<td width="50%" valign="top">
${image ? `<img src="${image}" alt="${escapeXml(study.name)} screenshot" width="100%">` : ""}
<h3>${study.name}</h3>
<sub>${study.context} · ${study.role}</sub>
<p>${study.summary}</p>
${stats ? `<p><sub>${stats}</sub></p>` : ""}
<p><sub>${footer}</sub></p>
</td>`;
}

/** Table rows of `columns` cells each. */
function grid(cells: string[], columns: number): string {
  const rows: string[] = [];
  for (let i = 0; i < cells.length; i += columns) rows.push(`<tr>\n${cells.slice(i, i + columns).join("\n")}\n</tr>`);
  return `<table>\n${rows.join("\n")}\n</table>`;
}

function projectLine(repo: string): string {
  const project = OVERRIDES[repo] ?? {};
  const demo = project.demo ? ` · [live demo](${project.demo})` : "";
  return `- **[${project.name ?? repo}](${profile.github}/${repo})** — ${project.description ?? ""}${demo}`;
}

function readme(hasActivity: boolean): string {
  const contact = [
    ...(profile.site ? [{ label: "Portfolio", href: profile.site }] : []),
    { label: "LinkedIn", href: profile.linkedin },
    { label: "Email", href: `mailto:${profile.email}` },
  ];
  const banner = `<img src="assets/banner.svg" alt="${profile.name}, ${profile.title}" width="100%">`;

  return `${profile.site ? `<a href="${profile.site}">${banner}</a>` : banner}

${profile.tagline}

**${links(contact)}** · ${profile.location}

## Featured work

${grid(caseStudies.map(caseStudyCell), 2)}

## More projects

${SELECTED_REPOS.map(projectLine).join("\n")}
${hasActivity ? `\n<img src="assets/activity.svg" alt="Contribution activity over the last year" width="100%">\n` : ""}
<sub>**Toolbox** · ${Object.values(techStack).flat().join(" · ")}</sub>
`;
}

mkdirSync(ASSETS, { recursive: true });
writeFileSync(path.join(ASSETS, "banner.svg"), banner());
const activity = fetchActivity();
if (activity) writeFileSync(path.join(ASSETS, "activity.svg"), activityGraph(activity));
writeFileSync(path.join(OUT, "README.md"), readme(Boolean(activity)));
console.log(`Wrote ${path.relative(ROOT, OUT)}/README.md and assets.`);
