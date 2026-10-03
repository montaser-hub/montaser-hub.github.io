/**
 * Hero illustration: a programmer in a hoodie, seen from behind, typing at a
 * desk with two monitors. Code appears line by line on the screens, a cursor
 * blinks, the hands tap the keyboard and the screens glow softly.
 *
 * Drawn in a 400×300 box whose top-left corner is (x, y).
 */
import { EASE } from "./theme.ts";

/** Lines of "code" on a screen: [indent, width, tone] in screen units. */
type CodeLine = [indent: number, width: number, tone: "accent" | "muted" | "dim"];

const LEFT_SCREEN: CodeLine[] = [
  [0, 46, "accent"], [8, 70, "muted"], [8, 52, "dim"], [16, 60, "muted"], [16, 38, "accent"], [8, 30, "dim"], [0, 18, "muted"],
];
const RIGHT_SCREEN: CodeLine[] = [
  [0, 58, "muted"], [8, 40, "accent"], [8, 76, "dim"], [16, 48, "muted"], [8, 64, "muted"], [0, 26, "accent"], [0, 50, "dim"], [8, 34, "muted"],
];

const CYCLE = 9; // seconds for the screens to fill, hold and clear

/** One monitor with its stand; the code lines type themselves in a loop. */
function monitor(id: string, x: number, y: number, width: number, height: number, tilt: number, code: CodeLine[], delay: number, desk: number): string {
  const lines = code
    .map(([indent, w, tone], i) => {
      const scaleW = (w / 100) * (width - 36);
      return `<rect class="${tone} code code-${id}-${i}" x="${x + 18 + indent}" y="${y + 20 + i * 12}" width="${scaleW.toFixed(1)}" height="5" rx="2.5" style="animation-delay: ${(delay + i * 0.45).toFixed(2)}s"/>`;
    })
    .join("\n    ");
  const last = code[code.length - 1];
  const cursorX = x + 18 + last[0] + (last[1] / 100) * (width - 36) + 4;
  const cx = x + width / 2;

  return `<g transform="rotate(${tilt} ${cx} ${y + height})">
    <rect class="screen-glow accent" x="${x - 14}" y="${y - 14}" width="${width + 28}" height="${height + 28}" rx="22" opacity="0.1"/>
    <rect class="bg edge" x="${x}" y="${y}" width="${width}" height="${height}" rx="9" stroke-width="2.5"/>
    <circle class="dim" cx="${x + 12}" cy="${y + 10}" r="2"/><circle class="dim" cx="${x + 20}" cy="${y + 10}" r="2"/><circle class="dim" cx="${x + 28}" cy="${y + 10}" r="2"/>
    ${lines}
    <rect class="accent blink" x="${cursorX.toFixed(1)}" y="${y + 18 + (code.length - 1) * 12}" width="5" height="9" rx="1"/>
    <rect class="panel edge" x="${cx - 7}" y="${y + height}" width="14" height="${desk - (y + height) - 5}" stroke-width="1"/>
    <rect class="panel edge" x="${cx - 32}" y="${desk - 7}" width="64" height="7" rx="3.5" stroke-width="1"/>
  </g>`;
}

export function programmer(x: number, y: number): { css: string; body: string } {
  const cx = x + 200; // the figure's centre line
  const desk = y + 214; // top edge of the desk

  const css = `
    .code { transform-box: fill-box; transform-origin: left; animation: type ${CYCLE}s ${EASE} infinite backwards; }
    .blink { animation: blink 1s steps(1) infinite; }
    .screen-glow { animation: glow 4s ease-in-out infinite; }
    .hand-l { animation: tap 0.42s ease-in-out infinite alternate; }
    .hand-r { animation: tap 0.42s ease-in-out 0.21s infinite alternate; }
    .nod { transform-box: fill-box; transform-origin: 50% 100%; animation: nod 5s ease-in-out infinite; }
    .key { animation: key 0.84s steps(1) infinite; }
    @keyframes type { 0% { transform: scaleX(0); } 6%, 82% { transform: scaleX(1); } 90%, 100% { transform: scaleX(0); } }
    @keyframes blink { 50% { opacity: 0; } }
    @keyframes glow { 0%, 100% { opacity: 0.08; } 50% { opacity: 0.16; } }
    @keyframes tap { from { transform: translateY(0); } to { transform: translateY(2.5px); } }
    @keyframes nod { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(-1.6deg); } }
    @keyframes key { 50% { opacity: 0.35; } }`;

  // Keyboard wider than the body, so both hands show beside it; some keys flash as they are "pressed".
  const keyColumns = 20;
  const keys = Array.from({ length: 3 }, (_, row) =>
    Array.from({ length: keyColumns }, (_, col) => {
      const pressed = (row * 5 + col * 3) % 7 === 0;
      return `<rect class="${pressed ? "accent key" : "dim"}" x="${cx - 108 + col * 10.9}" y="${desk - 17 + row * 5}" width="8.4" height="3.2" rx="1"${pressed ? ` style="animation-delay: ${((col % 4) * 0.21).toFixed(2)}s"` : ` opacity="0.6"`}/>`;
    }).join("")
  ).join("\n    ");

  const body = `<g>
    <!-- desk -->
    <rect class="panel edge" x="${x + 6}" y="${desk}" width="388" height="10" rx="5" stroke-width="1"/>
    <rect class="panel edge" x="${x + 34}" y="${desk + 10}" width="8" height="72" stroke-width="1"/>
    <rect class="panel edge" x="${x + 358}" y="${desk + 10}" width="8" height="72" stroke-width="1"/>

    ${monitor("l", x + 14, y + 36, 176, 122, -3, LEFT_SCREEN, 0.3, desk)}
    ${monitor("r", x + 206, y + 22, 184, 136, 3, RIGHT_SCREEN, 1.2, desk)}

    <!-- keyboard -->
    <rect class="panel edge" x="${cx - 114}" y="${desk - 22}" width="228" height="22" rx="5" stroke-width="1"/>
    ${keys}

    <!-- programmer, from behind: body, then each arm reaching out to the keyboard -->
    <path class="hoodie" d="M${cx - 72} ${y + 300} C${cx - 76} ${desk + 14} ${cx - 66} ${desk - 30} ${cx - 36} ${desk - 38} L${cx + 36} ${desk - 38} C${cx + 66} ${desk - 30} ${cx + 76} ${desk + 14} ${cx + 72} ${y + 300} Z"/>
    <g class="hand-l">
      <path class="sleeve" d="M${cx - 52} ${desk - 24} Q${cx - 74} ${desk - 30} ${cx - 88} ${desk - 13}" fill="none" stroke-width="19" stroke-linecap="round"/>
      <ellipse class="skin" cx="${cx - 92}" cy="${desk - 11}" rx="9" ry="7"/>
    </g>
    <g class="hand-r">
      <path class="sleeve" d="M${cx + 52} ${desk - 24} Q${cx + 74} ${desk - 30} ${cx + 88} ${desk - 13}" fill="none" stroke-width="19" stroke-linecap="round"/>
      <ellipse class="skin" cx="${cx + 92}" cy="${desk - 11}" rx="9" ry="7"/>
    </g>
    <g class="nod">
      <path class="hood" d="M${cx - 44} ${desk - 30} C${cx - 54} ${desk - 82} ${cx - 32} ${desk - 116} ${cx} ${desk - 118} C${cx + 32} ${desk - 116} ${cx + 54} ${desk - 82} ${cx + 44} ${desk - 30} C${cx + 22} ${desk - 20} ${cx - 22} ${desk - 20} ${cx - 44} ${desk - 30} Z"/>
      <path class="hood-seam" d="M${cx} ${desk - 116} C${cx - 4} ${desk - 84} ${cx - 4} ${desk - 54} ${cx} ${desk - 24}" fill="none" stroke-width="1.5" stroke-linecap="round"/>
    </g>

    <!-- chair back -->
    <rect class="chair edge" x="${cx - 54}" y="${desk + 30}" width="108" height="74" rx="18" stroke-width="1"/>
  </g>`;

  return { css, body };
}
