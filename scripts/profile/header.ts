/**
 * Hero banner: status chip, name with a moving sheen, a typewriter line, and
 * technology icons orbiting on three rings, over slowly drifting colour glows.
 * Everything is CSS or SMIL inside the SVG, so it plays inside an <img>.
 */
import { drawIcon, icon } from "./icons.ts";
import { EASE, FONT_MONO, GRADIENTS, MONO_ADVANCE, escapeXml, styles, svg } from "./theme.ts";

const WIDTH = 1200;
const HEIGHT = 380;

export interface HeaderContent {
  name: string;
  subtitle: string;
  status: string;
  lead: string;
  phrases: string[];
  /** Icon names per ring, innermost first. */
  orbits: string[][];
}

/**
 * Typewriter in pure CSS. Each phrase is revealed by a clip that grows one
 * character at a time (steps()), held, deleted, then the next takes its slot.
 * `textLength` pins each phrase to a known width so the clip and caret stay
 * aligned whatever monospace font the viewer has.
 */
function typewriter(phrases: string[], x: number, y: number, fontSize: number): { css: string; body: string } {
  const charWidth = fontSize * MONO_ADVANCE;
  const slot = 5; // seconds per phrase
  const total = phrases.length * slot;
  const pct = (seconds: number) => `${((seconds / total) * 100).toFixed(3)}%`;

  const css = phrases
    .map((phrase, i) => {
      const width = (phrase.length * charWidth).toFixed(1);
      const start = i * slot;
      const typed = start + Math.min(2.2, phrase.length * 0.05);
      const hold = start + slot - 1.2;
      const gone = start + slot - 0.4;
      const frames = (from: string, to: string) => `
      0%, ${pct(start)} { transform: ${from}; animation-timing-function: steps(${phrase.length}, end); }
      ${pct(typed)}, ${pct(hold)} { transform: ${to}; animation-timing-function: steps(${phrase.length}, end); }
      ${pct(gone)}, 100% { transform: ${from}; }`;
      return `
    @keyframes reveal-${i} {${frames("scaleX(0)", "scaleX(1)")} }
    @keyframes caret-${i} {${frames("translateX(0)", `translateX(${width}px)`)} }
    @keyframes show-${i} { 0%, ${pct(start)} { opacity: 0; } ${pct(start + 0.01)}, ${pct(gone)} { opacity: 1; } ${pct(gone + 0.01)}, 100% { opacity: 0; } }
    .clip-${i} { transform-box: fill-box; transform-origin: left; animation: reveal-${i} ${total}s infinite; }
    .caret-${i} { animation: caret-${i} ${total}s infinite, show-${i} ${total}s infinite; }`;
    })
    .join("");

  const body = phrases
    .map((phrase, i) => {
      const width = (phrase.length * charWidth).toFixed(1);
      return `<clipPath id="clip-${i}"><rect class="clip-${i}" x="${x}" y="${y - fontSize}" width="${width}" height="${fontSize * 1.5}"/></clipPath>
  <text class="mono typed${i === 0 ? " typed-first" : ""}" fill="url(#accent)" clip-path="url(#clip-${i})" x="${x}" y="${y}" font-size="${fontSize}" textLength="${width}" lengthAdjust="spacing">${escapeXml(phrase)}</text>
  <rect class="caret caret-${i} cyan" x="${x + 2}" y="${y - fontSize * 0.85}" width="2.5" height="${fontSize * 1.1}"/>`;
    })
    .join("\n  ");

  return { css, body };
}

/**
 * Icons on rings that turn at different speeds; each icon counter-turns to
 * stay upright. Coordinates are absolute and the rotation centre is set
 * explicitly: CSS would otherwise rotate SVG groups around the canvas origin.
 */
function orbits(rings: string[][], cx: number, cy: number): { css: string; body: string } {
  const radii = [62, 108, 154];
  const durations = [22, 34, 48];

  const css = `
    .ring { transform-origin: ${cx}px ${cy}px; }
    .upright { transform-box: fill-box; transform-origin: center; }${rings
      .map((_, i) => {
        const direction = i % 2 ? "reverse" : "normal";
        const counter = i % 2 ? "normal" : "reverse";
        return `
    .ring-${i} { animation: turn ${durations[i]}s linear infinite ${direction}; }
    .ring-${i} .upright { animation: turn ${durations[i]}s linear infinite ${counter}; }`;
      })
      .join("")}`;

  const body = rings
    .map((names, i) => {
      const nodes = names
        .map((name, k) => {
          const found = icon(name);
          if (!found) return "";
          const angle = (k / names.length) * Math.PI * 2 + i * 0.6;
          const x = cx + radii[i] * Math.cos(angle);
          const y = cy + radii[i] * Math.sin(angle);
          return `<g class="upright"><circle class="panel edge" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="19" stroke-width="1"/>${drawIcon(found, x, y, 20)}</g>`;
        })
        .join("");
      return `<circle class="edge" cx="${cx}" cy="${cy}" r="${radii[i]}" fill="none" stroke-width="1.2" stroke-dasharray="3 6"/>
  <g class="ring ring-${i}">${nodes}</g>`;
    })
    .join("\n  ");

  return {
    css,
    body: `${body}
  <circle cx="${cx}" cy="${cy}" r="26" fill="url(#accent)" opacity="0.18"/>
  <text class="mono fg" x="${cx}" y="${cy + 6}" text-anchor="middle" font-size="17" font-weight="700">&lt;/&gt;</text>`,
  };
}

export function header(content: HeaderContent): string {
  const leadSize = 21;
  const lead = `${content.lead} `;
  const typed = typewriter(content.phrases, 64 + lead.length * leadSize * MONO_ADVANCE, 300, leadSize);
  const rings = orbits(content.orbits, 990, HEIGHT / 2);
  const statusWidth = 44 + content.status.length * 7.4;

  const css = `
    .typed { font-family: ${FONT_MONO}; }
    .glow { transform-box: fill-box; transform-origin: center; }
    .glow-1 { animation: drift-1 16s ease-in-out infinite alternate; }
    .glow-2 { animation: drift-2 20s ease-in-out infinite alternate; }
    .glow-3 { animation: drift-3 24s ease-in-out infinite alternate; }
    .rise { animation: rise 0.8s ${EASE} backwards; }
    .beat { transform-box: fill-box; transform-origin: center; animation: beat 2.4s ease-out infinite; }
    @keyframes drift-1 { to { transform: translate(140px, 60px) scale(1.15); } }
    @keyframes drift-2 { to { transform: translate(-160px, -40px) scale(0.9); } }
    @keyframes drift-3 { to { transform: translate(90px, -70px) scale(1.2); } }
    @keyframes rise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes beat { 0% { transform: scale(1); opacity: 0.7; } 70%, 100% { transform: scale(2.6); opacity: 0; } }
    @keyframes turn { to { transform: rotate(360deg); } }
    ${typed.css}
    ${rings.css}
    @media (prefers-reduced-motion: reduce) {
      .glow, .rise, .beat, .caret, [class^="clip-"], .ring, .upright { animation: none !important; }
      .caret { opacity: 0; }
      .typed:not(.typed-first) { display: none; }
    }`;

  return svg(
    WIDTH,
    HEIGHT,
    `${content.name}, ${content.subtitle}. ${lead}${content.phrases[0]}`,
    `  ${styles(css)}
  <defs>${GRADIENTS}
    <clipPath id="frame"><rect width="${WIDTH}" height="${HEIGHT}" rx="20"/></clipPath>
    <filter id="blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="70"/></filter>
    <pattern id="dots" width="26" height="26" patternUnits="userSpaceOnUse"><circle class="dim" cx="2" cy="2" r="1.1"/></pattern>
    <linearGradient id="fade" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="0.6" stop-color="#fff" stop-opacity="0.5"/><stop offset="1" stop-color="#fff" stop-opacity="0.9"/></linearGradient>
    <mask id="dots-mask"><rect width="${WIDTH}" height="${HEIGHT}" fill="url(#fade)"/></mask>
    <!-- The name's fill: text colour with a band of colour that sweeps across (a colour change, not movement). -->
    <linearGradient id="name" gradientUnits="userSpaceOnUse" x1="-400" y1="0" x2="0" y2="0">
      <stop offset="0" class="stop-fg"/><stop offset="0.5" class="stop-cyan"/><stop offset="1" class="stop-fg"/>
      <animate attributeName="x1" values="-400;1200" dur="5s" repeatCount="indefinite"/>
      <animate attributeName="x2" values="0;1600" dur="5s" repeatCount="indefinite"/>
    </linearGradient>
  </defs>
  <g clip-path="url(#frame)">
    <rect class="bg" width="${WIDTH}" height="${HEIGHT}"/>
    <g filter="url(#blur)" opacity="0.5">
      <circle class="glow glow-1 violet" cx="180" cy="80" r="150"/>
      <circle class="glow glow-2 cyan" cx="1040" cy="300" r="160"/>
      <circle class="glow glow-3 pink" cx="640" cy="400" r="120"/>
    </g>
    <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#dots)" mask="url(#dots-mask)" opacity="0.5"/>
  </g>
  <rect class="edge" x="0.5" y="0.5" width="${WIDTH - 1}" height="${HEIGHT - 1}" rx="20" fill="none"/>

  <g class="rise" style="animation-delay: 0.05s">
    <rect class="panel edge" x="64" y="56" width="${statusWidth.toFixed(0)}" height="32" rx="16" stroke-width="1"/>
    <circle class="beat" cx="84" cy="72" r="5" fill="#34d399"/>
    <circle cx="84" cy="72" r="5" fill="#34d399"/>
    <text class="muted" x="100" y="77" font-size="14" font-weight="500">${escapeXml(content.status)}</text>
  </g>
  <text class="rise" style="animation-delay: 0.15s" x="62" y="176" font-size="70" font-weight="800" letter-spacing="-1.5" fill="url(#name)">${escapeXml(content.name)}</text>
  <text class="rise muted" style="animation-delay: 0.25s" x="64" y="222" font-size="23" font-weight="500">${escapeXml(content.subtitle)}</text>
  <g class="rise" style="animation-delay: 0.35s">
    <text class="mono fg" x="64" y="300" font-size="${leadSize}">${escapeXml(lead.trimEnd())}</text>
    ${typed.body}
  </g>
  ${rings.body}`
  );
}
