/**
 * "Now" card drawn as an editor window: an object literal describing what I
 * do, typed out line by line, then held and repeated.
 */
import { FONT_MONO, MONO_ADVANCE, escapeXml, styles, svg } from "./theme.ts";

const WIDTH = 590;
const FONT_SIZE = 15;
const LINE = 27;
const CHAR = FONT_SIZE * MONO_ADVANCE;
const TOP = 86;
const LEFT = 58;
const CYCLE = 16; // seconds for one type-hold-clear loop

export interface NowContent {
  variable: string;
  /** Property name → a string or a list of strings. */
  fields: Record<string, string | string[]>;
}

interface Token {
  text: string;
  kind: "key" | "string" | "plain" | "keyword" | "name";
}

/** The object literal as lines of coloured tokens; long lists get one item per line. */
function lines({ variable, fields }: NowContent): Token[][] {
  const out: Token[][] = [[
    { text: "const ", kind: "keyword" }, { text: variable, kind: "name" }, { text: " = {", kind: "plain" },
  ]];
  for (const [key, value] of Object.entries(fields)) {
    if (typeof value === "string") {
      out.push([{ text: `  ${key}`, kind: "key" }, { text: ": ", kind: "plain" }, { text: `"${value}"`, kind: "string" }, { text: ",", kind: "plain" }]);
    } else {
      out.push([{ text: `  ${key}`, kind: "key" }, { text: ": [", kind: "plain" }]);
      for (const item of value) out.push([{ text: `    "${item}"`, kind: "string" }, { text: ",", kind: "plain" }]);
      out.push([{ text: "  ],", kind: "plain" }]);
    }
  }
  out.push([{ text: "};", kind: "plain" }]);
  return out;
}

export function now(content: NowContent, height: number): string {
  const code = lines(content);
  const pct = (seconds: number) => `${((seconds / CYCLE) * 100).toFixed(2)}%`;
  const typing = 0.45; // seconds each line takes to appear

  const css = code
    .map((tokens, i) => {
      const length = tokens.reduce((sum, token) => sum + token.text.length, 0);
      const start = 0.4 + i * typing;
      return `
    @keyframes line-${i} {
      0%, ${pct(start)} { transform: scaleX(0); animation-timing-function: steps(${length}, end); }
      ${pct(start + typing)}, 94% { transform: scaleX(1); }
      98%, 100% { transform: scaleX(0); }
    }
    .line-${i} { transform-box: fill-box; transform-origin: left; animation: line-${i} ${CYCLE}s infinite; }`;
    })
    .join("");

  const body = code
    .map((tokens, i) => {
      const y = TOP + i * LINE;
      const length = tokens.reduce((sum, token) => sum + token.text.length, 0);
      const spans = tokens.map((token) => `<tspan class="t-${token.kind}">${escapeXml(token.text)}</tspan>`).join("");
      return `<text class="mono dim" x="24" y="${y}" font-size="12">${String(i + 1).padStart(2, " ")}</text>
  <clipPath id="line-${i}"><rect class="line-${i}" x="${LEFT}" y="${y - FONT_SIZE}" width="${(length * CHAR).toFixed(1)}" height="${LINE}"/></clipPath>
  <text class="mono" clip-path="url(#line-${i})" x="${LEFT}" y="${y}" font-size="${FONT_SIZE}" xml:space="preserve" textLength="${(length * CHAR).toFixed(1)}" lengthAdjust="spacing">${spans}</text>`;
    })
    .join("\n  ");

  const style = `
    .mono { font-family: ${FONT_MONO}; }
    .t-keyword { fill: #ff7b72; } .t-name { fill: #e6edf3; } .t-key { fill: #79c0ff; } .t-string { fill: #a5d6ff; }
    @media (prefers-color-scheme: light) { .t-keyword { fill: #cf222e; } .t-name { fill: #1f2328; } .t-key { fill: #0550ae; } .t-string { fill: #0a3069; } }
    ${css}
    @media (prefers-reduced-motion: reduce) { [class^="line-"] { animation: none; } }`;

  return svg(WIDTH, height, `What I do now: ${Object.entries(content.fields).map(([k, v]) => `${k}: ${[v].flat().join(", ")}`).join("; ")}`, `  ${styles(style)}
  <rect class="panel edge" x="0.5" y="0.5" width="${WIDTH - 1}" height="${height - 1}" rx="16" stroke-width="1"/>
  <circle cx="26" cy="26" r="6" fill="#ff5f57"/><circle cx="46" cy="26" r="6" fill="#febc2e"/><circle cx="66" cy="26" r="6" fill="#28c840"/>
  <text class="mono dim" x="${WIDTH / 2}" y="31" text-anchor="middle" font-size="13">now.ts</text>
  <line class="edge" x1="0" y1="50" x2="${WIDTH}" y2="50"/>
  <g class="muted">${body}</g>`);
}
