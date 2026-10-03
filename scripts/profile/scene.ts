/**
 * Hero illustration: a flat cartoon of me (dark hair, full beard, dark shirt)
 * facing the viewer behind a laptop. A code panel types itself on one side, a
 * page wireframe builds on the other, the eyes glance between them and blink,
 * the arms tap, and steam rises from a cup. No background of its own.
 *
 * Drawn in a 420×300 box whose top-left corner is (x, y).
 */
import { EASE } from "./theme.ts";

const CYCLE = 10; // seconds for the panels to fill, hold and clear

/** Line widths (percent of the panel) for the code panel, top to bottom. */
const CODE = [34, 62, 48, 70, 40, 56, 28, 64, 44, 30];

export function programmer(x: number, y: number): { css: string; body: string } {
  const cx = x + 214;
  const desk = y + 264;

  const code = { x: x + 4, y: y + 22, width: 150, height: 150 };
  const page = { x: x + 300, y: y + 62, width: 116, height: 104 };

  const codeLines = CODE.map((percent, i) => {
    const tone = i % 4 === 0 ? "accent" : i % 3 === 0 ? "dim" : "muted";
    return `<rect class="${tone} type" x="${code.x + 14}" y="${code.y + 16 + i * 12.5}" width="${((percent / 100) * (code.width - 28)).toFixed(1)}" height="4.5" rx="2.2" style="animation-delay: ${(0.3 + i * 0.4).toFixed(1)}s"/>`;
  }).join("\n    ");

  // The wireframe: a header bar, a hero block, a column and a card, drawn one after another.
  const blocks: [number, number, number, number][] = [
    [12, 12, page.width - 24, 7],
    [12, 28, page.width - 24, 28],
    [12, 64, 28, 28],
    [48, 64, page.width - 60, 16],
  ];
  const wire = blocks
    .map(([bx, by, w, h], i) => `<rect class="accent-line build" x="${page.x + bx}" y="${page.y + by}" width="${w}" height="${h}" rx="3" fill="none" stroke-width="1.6" pathLength="1" style="animation-delay: ${(1 + i * 0.9).toFixed(1)}s"/>`)
    .join("\n    ");

  const css = `
    .skin { fill: #e3b08a; } .skin-dark { stroke: #c08a63; } .hair { fill: #17181c; } .hair-line { stroke: #17181c; }
    .shirt { fill: #3a4354; } .shirt-line { stroke: #3a4354; } .collar { fill: #2d3544; } .lid { fill: #1c2230; } .cup { fill: #c9d1d9; }
    @media (prefers-color-scheme: light) { .shirt { fill: #2f3744; } .shirt-line { stroke: #2f3744; } .collar { fill: #222933; } .lid { fill: #2b3340; } .cup { fill: #8c959f; } }
    .float-a { animation: float 6s ease-in-out infinite; }
    .float-b { animation: float 7s ease-in-out -2s infinite; }
    .type { transform-box: fill-box; transform-origin: left; animation: type ${CYCLE}s ${EASE} infinite backwards; }
    .build { stroke-dasharray: 1; animation: build ${CYCLE}s ease-in-out infinite backwards; }
    .pupil { animation: glance ${CYCLE}s ease-in-out infinite; }
    .lids { transform-box: fill-box; transform-origin: center; animation: blink 4.6s ease-in-out infinite; }
    .head { transform-box: fill-box; transform-origin: 50% 100%; animation: tilt ${CYCLE}s ease-in-out infinite; }
    .arm-l { transform-box: fill-box; transform-origin: 100% 0%; animation: tap 0.4s ease-in-out infinite alternate; }
    .arm-r { transform-box: fill-box; transform-origin: 0% 0%; animation: tap-r 0.4s ease-in-out 0.2s infinite alternate; }
    .logo { animation: logo 3s ease-in-out infinite; }
    .steam { stroke-dasharray: 3 5; animation: steam 2.4s linear infinite; }
    @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
    @keyframes type { 0% { transform: scaleX(0); } 5%, 84% { transform: scaleX(1); } 92%, 100% { transform: scaleX(0); } }
    @keyframes build { 0% { stroke-dashoffset: 1; } 10%, 84% { stroke-dashoffset: 0; } 92%, 100% { stroke-dashoffset: 1; } }
    @keyframes glance { 0%, 8% { transform: translateX(0); } 14%, 44% { transform: translateX(-3px); } 52%, 86% { transform: translateX(3px); } 94%, 100% { transform: translateX(0); } }
    @keyframes blink { 0%, 44%, 50%, 100% { transform: scaleY(1); } 47% { transform: scaleY(0.1); } }
    @keyframes tilt { 0%, 8%, 94%, 100% { transform: rotate(0deg); } 14%, 44% { transform: rotate(-2deg); } 52%, 86% { transform: rotate(2deg); } }
    @keyframes tap { from { transform: rotate(0deg); } to { transform: rotate(2.4deg); } }
    @keyframes tap-r { from { transform: rotate(0deg); } to { transform: rotate(-2.4deg); } }
    @keyframes logo { 0%, 100% { opacity: 0.55; } 50% { opacity: 1; } }
    @keyframes steam { to { stroke-dashoffset: -16; } }`;

  const body = `<g>
    <!-- floating panels: code on the left, a page being laid out on the right -->
    <g class="float-a">
      <rect class="panel edge" x="${code.x}" y="${code.y}" width="${code.width}" height="${code.height}" rx="10" stroke-width="1" opacity="0.94"/>
      ${codeLines}
    </g>
    <g class="float-b">
      <rect class="panel edge" x="${page.x}" y="${page.y}" width="${page.width}" height="${page.height}" rx="10" stroke-width="1" opacity="0.94"/>
      ${wire}
    </g>

    <!-- arms, elbows out, reaching to the keyboard behind the laptop -->
    <path class="shirt shirt-line arm-l" d="M${cx - 60} ${desk - 62} L${cx - 104} ${desk - 26} L${cx - 62} ${desk - 6}" stroke-width="24" stroke-linecap="round" stroke-linejoin="round"/>
    <path class="shirt shirt-line arm-r" d="M${cx + 60} ${desk - 62} L${cx + 104} ${desk - 26} L${cx + 62} ${desk - 6}" stroke-width="24" stroke-linecap="round" stroke-linejoin="round"/>

    <!-- torso and collar -->
    <path class="shirt" d="M${cx - 76} ${desk} C${cx - 80} ${desk - 58} ${cx - 54} ${desk - 88} ${cx - 22} ${desk - 94} L${cx + 22} ${desk - 94} C${cx + 54} ${desk - 88} ${cx + 80} ${desk - 58} ${cx + 76} ${desk} Z"/>
    <rect class="skin" x="${cx - 13}" y="${desk - 118}" width="26" height="30" rx="8"/>
    <path class="collar" d="M${cx - 24} ${desk - 96} L${cx - 13} ${desk - 100} L${cx} ${desk - 82} L${cx + 13} ${desk - 100} L${cx + 24} ${desk - 96} L${cx + 8} ${desk - 70} L${cx} ${desk - 78} L${cx - 8} ${desk - 70} Z"/>

    <!-- head -->
    <g class="head">
      <ellipse class="skin" cx="${cx - 39}" cy="${desk - 148}" rx="6" ry="10"/>
      <ellipse class="skin" cx="${cx + 39}" cy="${desk - 148}" rx="6" ry="10"/>
      <rect class="skin" x="${cx - 37}" y="${desk - 196}" width="74" height="90" rx="35"/>
      <!-- beard and moustache -->
      <path class="hair" d="M${cx - 37} ${desk - 152} C${cx - 39} ${desk - 122} ${cx - 30} ${desk - 104} ${cx} ${desk - 102} C${cx + 30} ${desk - 104} ${cx + 39} ${desk - 122} ${cx + 37} ${desk - 152} C${cx + 32} ${desk - 140} ${cx + 24} ${desk - 136} ${cx + 15} ${desk - 137} C${cx + 8} ${desk - 142} ${cx - 8} ${desk - 142} ${cx - 15} ${desk - 137} C${cx - 24} ${desk - 136} ${cx - 32} ${desk - 140} ${cx - 37} ${desk - 152} Z"/>
      <path class="skin-dark" d="M${cx - 7} ${desk - 127} Q${cx} ${desk - 123} ${cx + 7} ${desk - 127}" fill="none" stroke-width="2.2" stroke-linecap="round"/>
      <!-- hair -->
      <path class="hair" d="M${cx - 39} ${desk - 158} C${cx - 44} ${desk - 194} ${cx - 24} ${desk - 210} ${cx + 2} ${desk - 210} C${cx + 28} ${desk - 210} ${cx + 45} ${desk - 192} ${cx + 39} ${desk - 158} C${cx + 36} ${desk - 174} ${cx + 26} ${desk - 182} ${cx + 4} ${desk - 180} C${cx - 18} ${desk - 182} ${cx - 34} ${desk - 174} ${cx - 39} ${desk - 158} Z"/>
      <!-- brows, eyes, nose -->
      <path class="hair-line" d="M${cx - 26} ${desk - 163} L${cx - 9} ${desk - 165}" stroke-width="3.6" stroke-linecap="round"/>
      <path class="hair-line" d="M${cx + 9} ${desk - 165} L${cx + 26} ${desk - 163}" stroke-width="3.6" stroke-linecap="round"/>
      <g class="lids">
        <ellipse cx="${cx - 17}" cy="${desk - 154}" rx="7" ry="5.5" fill="#fff"/>
        <ellipse cx="${cx + 17}" cy="${desk - 154}" rx="7" ry="5.5" fill="#fff"/>
        <g class="pupil">
          <circle class="hair" cx="${cx - 17}" cy="${desk - 154}" r="3"/>
          <circle class="hair" cx="${cx + 17}" cy="${desk - 154}" r="3"/>
        </g>
      </g>
      <path class="skin-dark" d="M${cx} ${desk - 154} L${cx - 3} ${desk - 142} L${cx + 3} ${desk - 141}" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </g>

    <!-- laptop (its lid faces the viewer), desk, cup -->
    <path class="lid edge" d="M${cx - 66} ${desk} L${cx - 74} ${desk - 84} Q${cx - 75} ${desk - 92} ${cx - 67} ${desk - 92} L${cx + 67} ${desk - 92} Q${cx + 75} ${desk - 92} ${cx + 74} ${desk - 84} L${cx + 66} ${desk} Z" stroke-width="1"/>
    <circle class="accent logo" cx="${cx}" cy="${desk - 46}" r="13"/>
    <rect class="edge panel" x="${x + 14}" y="${desk}" width="392" height="9" rx="4.5" stroke-width="1"/>
    <path class="cup" d="M${cx + 118} ${desk - 34} h26 l-3 34 h-20 z"/>
    <path class="dim-line steam" d="M${cx + 126} ${desk - 40} q-4 -7 0 -13 q4 -6 0 -12 M${cx + 137} ${desk - 40} q-4 -7 0 -13 q4 -6 0 -12" fill="none" stroke-width="1.6" stroke-linecap="round"/>
  </g>`;

  return { css, body };
}
