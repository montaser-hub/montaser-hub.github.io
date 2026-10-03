/**
 * Hero: availability line, name with a moving sheen and a typewriter line,
 * beside a cartoon of me typing behind a laptop. It has no background of its
 * own, so it sits directly on GitHub's page in either theme.
 * Everything is CSS or SMIL inside the SVG, so it plays inside an <img>.
 */
import { programmer } from "./scene.ts";
import { EASE, FONT_MONO, MONO_ADVANCE, escapeXml, styles, svg } from "./theme.ts";

const WIDTH = 1200;
const HEIGHT = 340;

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
  const typed = typewriter(content.phrases, 4 + lead.length * leadSize * MONO_ADVANCE, 300, leadSize);
  const scene = programmer(760, 36);

  const css = `
    .typed { font-family: ${FONT_MONO}; }
    .rise { animation: rise 0.8s ${EASE} backwards; }
    .beat { transform-box: fill-box; transform-origin: center; animation: beat 2.4s ease-out infinite; }
    @keyframes rise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes beat { 0% { transform: scale(1); opacity: 0.7; } 70%, 100% { transform: scale(2.6); opacity: 0; } }
    ${typed.css}
    ${scene.css}
    @media (prefers-reduced-motion: reduce) {
      .rise, .beat, .caret, [class^="clip-"], .float-a, .float-b, .type, .build, .pupil, .lids, .head, .arm-l, .arm-r, .logo, .steam { animation: none !important; }
      .build { stroke-dashoffset: 0; }
      .caret { opacity: 0; }
      .typed:not(.typed-first) { display: none; }
    }`;

  return svg(
    WIDTH,
    HEIGHT,
    `${content.name}, ${content.subtitle}. ${lead}${content.phrases[0]}`,
    `  ${styles(css)}
  <defs>
    <!-- The name's fill: text colour with a band of colour that sweeps across (a colour change, not movement). -->
    <linearGradient id="name" gradientUnits="userSpaceOnUse" x1="-400" y1="0" x2="0" y2="0">
      <stop offset="0" class="stop-fg"/><stop offset="0.5" class="stop-accent"/><stop offset="1" class="stop-fg"/>
      <animate attributeName="x1" values="-400;1200" dur="5s" repeatCount="indefinite"/>
      <animate attributeName="x2" values="0;1600" dur="5s" repeatCount="indefinite"/>
    </linearGradient>
  </defs>
  <g class="rise" style="animation-delay: 0.05s">
    <circle class="beat" cx="10" cy="72" r="5" fill="#34d399"/>
    <circle cx="10" cy="72" r="5" fill="#34d399"/>
    <text class="muted" x="26" y="77" font-size="14" font-weight="500">${escapeXml(content.status)}</text>
  </g>
  <text class="rise" style="animation-delay: 0.15s" x="2" y="176" font-size="70" font-weight="800" letter-spacing="-1.5" fill="url(#name)">${escapeXml(content.name)}</text>
  <text class="rise muted" style="animation-delay: 0.25s" x="4" y="222" font-size="23" font-weight="500">${escapeXml(content.subtitle)}</text>
  <g class="rise" style="animation-delay: 0.35s">
    <text class="mono fg" x="4" y="300" font-size="${leadSize}">${escapeXml(lead.trimEnd())}</text>
    ${typed.body}
  </g>
  ${scene.body}`
  );
}
