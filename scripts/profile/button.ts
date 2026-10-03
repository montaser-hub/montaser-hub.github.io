/**
 * A contact link: icon, the channel's name with an arrow, and where it leads.
 * No box around it; all four use the same single-colour icon style.
 */
import { EASE, escapeXml, styles, svg } from "./theme.ts";

const WIDTH = 290;
const HEIGHT = 68;

/** 24×24 icons. `stroke` icons are outlines; `fill` icons are solid glyphs. */
const ICONS = {
  globe: { stroke: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18ZM3 12h18M12 3c2.6 2.6 3.9 5.6 3.9 9s-1.3 6.4-3.9 9c-2.6-2.6-3.9-5.6-3.9-9S9.4 5.6 12 3Z" },
  mail: { stroke: "M4.5 6h15A1.5 1.5 0 0 1 21 7.5v9a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 16.5v-9A1.5 1.5 0 0 1 4.5 6Zm-1 1.5 8.5 6 8.5-6" },
  linkedin: { fill: "M6.94 8.5H3.56V20h3.38V8.5ZM5.25 3A1.97 1.97 0 0 0 3.3 4.97c0 1.08.87 1.96 1.95 1.96S7.2 6.05 7.2 4.97A1.97 1.97 0 0 0 5.25 3ZM20.7 13.4c0-3.1-1.66-5.17-4.5-5.17-1.6 0-2.67.75-3.2 1.67V8.5H9.7V20h3.38v-6.1c0-1.6.76-2.56 2.1-2.56 1.3 0 2.14.9 2.14 2.56V20h3.38v-6.6Z" },
  whatsapp: { fill: "M12.04 3a8.94 8.94 0 0 0-7.7 13.5L3 21l4.63-1.3A8.95 8.95 0 1 0 12.04 3Zm0 1.63a7.32 7.32 0 1 1-3.87 13.54l-.3-.18-2.5.7.7-2.42-.2-.32a7.32 7.32 0 0 1 6.17-11.32Zm-2.6 3.6c-.17 0-.44.06-.67.3-.23.25-.88.86-.88 2.1s.9 2.43 1.03 2.6c.13.17 1.75 2.8 4.33 3.8 2.15.84 2.58.67 3.05.63.47-.04 1.5-.61 1.72-1.2.2-.6.2-1.1.15-1.2-.07-.11-.24-.18-.5-.3-.26-.13-1.5-.74-1.74-.83-.23-.08-.4-.12-.57.13-.17.25-.65.83-.8 1-.15.17-.3.19-.55.06a6.9 6.9 0 0 1-2.04-1.26 7.6 7.6 0 0 1-1.4-1.75c-.15-.25-.02-.39.11-.51.12-.11.26-.3.39-.44.13-.15.17-.25.26-.42.08-.17.04-.32-.02-.44-.07-.13-.56-1.4-.79-1.9-.19-.43-.4-.44-.57-.45h-.5Z" },
} as const;

export type ContactIcon = keyof typeof ICONS;

export function button(label: string, detail: string, iconName: ContactIcon, order: number): string {
  const icon = ICONS[iconName];
  const glyph = "stroke" in icon
    ? `<path class="accent-line" d="${icon.stroke}" fill="none" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>`
    : `<path class="accent" d="${icon.fill}"/>`;

  const css = `
    .card { animation: card-in 0.6s ${EASE} ${(order * 0.08).toFixed(2)}s backwards; }
    .arrow { animation: nudge 2.4s ease-in-out ${(order * 0.3).toFixed(1)}s infinite; }
    @keyframes card-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes nudge { 0%, 70%, 100% { transform: translate(0, 0); } 85% { transform: translate(3px, -3px); } }
    @media (prefers-reduced-motion: reduce) { .card, .arrow { animation: none; } }`;

  return svg(WIDTH, HEIGHT, `${label}: ${detail}`, `  ${styles(css)}
  <g class="card">
    <g transform="translate(6 18) scale(1.25)">${glyph}</g>
    <text class="fg" x="50" y="31" font-size="17" font-weight="700">${escapeXml(label)}</text>
    <path class="arrow accent-line" d="M${62 + label.length * 10.6} 30l8-8m-6.5 0h6.5v6.5" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    <text class="dim" x="50" y="52" font-size="${detail.length > 22 ? 12 : 13}">${escapeXml(detail)}</text>
  </g>`);
}
