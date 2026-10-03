/**
 * Hero banner: status chip, name with a moving sheen and a typewriter line,
 * beside an illustration of a programmer typing at two screens, over two
 * faint drifting glows.
 * Everything is CSS or SMIL inside the SVG, so it plays inside an <img>.
 */
import { programmer } from "./scene.ts";
import { EASE, FONT_MONO, MONO_ADVANCE, escapeXml, styles, svg } from "./theme.ts";

const WIDTH = 1200;
const HEIGHT = 380;

export interface HeaderContent {
  name: string;
  subtitle: string;
  status: string;
  lead: string;
  phrases: string[];
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
  <text class="mono accent typed${i === 0 ? " typed-first" : ""}" clip-path="url(#clip-${i})" x="${x}" y="${y}" font-size="${fontSize}" textLength="${width}" lengthAdjust="spacing">${escapeXml(phrase)}</text>
  <rect class="caret caret-${i} accent" x="${x + 2}" y="${y - fontSize * 0.85}" width="2.5" height="${fontSize * 1.1}"/>`;
    })
    .join("\n  ");

  return { css, body };
}

export function header(content: HeaderContent): string {
  const leadSize = 21;
  const lead = `${content.lead} `;
  const typed = typewriter(content.phrases, 64 + lead.length * leadSize * MONO_ADVANCE, 300, leadSize);
  const scene = programmer(770, 44);
  const statusWidth = 44 + content.status.length * 7.4;

  const css = `
    .typed { font-family: ${FONT_MONO}; }
    .hoodie { fill: #3b6fd4; } .hood { fill: #2f5cb5; } .sleeve { stroke: #2f5cb5; } .hood-seam { stroke: #244a94; } .skin { fill: #e8b98f; } .chair { fill: #1b222c; }
    @media (prefers-color-scheme: light) { .hoodie { fill: #2f6fe0; } .hood { fill: #2259c0; } .sleeve { stroke: #2259c0; } .hood-seam { stroke: #1b4aa3; } .chair { fill: #dfe5ee; } }
    .glow { transform-box: fill-box; transform-origin: center; }
    .glow-1 { animation: drift-1 16s ease-in-out infinite alternate; }
    .glow-2 { animation: drift-2 20s ease-in-out infinite alternate; }
    .rise { animation: rise 0.8s ${EASE} backwards; }
    .beat { transform-box: fill-box; transform-origin: center; animation: beat 2.4s ease-out infinite; }
    @keyframes drift-1 { to { transform: translate(140px, 60px) scale(1.15); } }
    @keyframes drift-2 { to { transform: translate(-160px, -40px) scale(0.9); } }
    @keyframes rise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes beat { 0% { transform: scale(1); opacity: 0.7; } 70%, 100% { transform: scale(2.6); opacity: 0; } }
    ${typed.css}
    ${scene.css}
    @media (prefers-reduced-motion: reduce) {
      .glow, .rise, .beat, .caret, [class^="clip-"], .code, .blink, .screen-glow, .hand-l, .hand-r, .nod, .key { animation: none !important; }
      .caret { opacity: 0; }
      .typed:not(.typed-first) { display: none; }
    }`;

  return svg(
    WIDTH,
    HEIGHT,
    `${content.name}, ${content.subtitle}. ${lead}${content.phrases[0]}`,
    `  ${styles(css)}
  <defs>
    <clipPath id="frame"><rect width="${WIDTH}" height="${HEIGHT}" rx="20"/></clipPath>
    <filter id="blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="70"/></filter>
    <pattern id="dots" width="26" height="26" patternUnits="userSpaceOnUse"><circle class="dim" cx="2" cy="2" r="1.1"/></pattern>
    <linearGradient id="fade" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="0.6" stop-color="#fff" stop-opacity="0.5"/><stop offset="1" stop-color="#fff" stop-opacity="0.9"/></linearGradient>
    <mask id="dots-mask"><rect width="${WIDTH}" height="${HEIGHT}" fill="url(#fade)"/></mask>
    <!-- The name's fill: text colour with a band of colour that sweeps across (a colour change, not movement). -->
    <linearGradient id="name" gradientUnits="userSpaceOnUse" x1="-400" y1="0" x2="0" y2="0">
      <stop offset="0" class="stop-fg"/><stop offset="0.5" class="stop-accent"/><stop offset="1" class="stop-fg"/>
      <animate attributeName="x1" values="-400;1200" dur="5s" repeatCount="indefinite"/>
      <animate attributeName="x2" values="0;1600" dur="5s" repeatCount="indefinite"/>
    </linearGradient>
  </defs>
  <g clip-path="url(#frame)">
    <rect class="bg" width="${WIDTH}" height="${HEIGHT}"/>
    <g filter="url(#blur)" opacity="0.22">
      <circle class="glow glow-1 accent" cx="160" cy="60" r="150"/>
      <circle class="glow glow-2 accent" cx="1040" cy="320" r="170"/>
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
  ${scene.body}`
  );
}
