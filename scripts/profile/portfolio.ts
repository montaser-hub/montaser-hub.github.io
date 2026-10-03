/**
 * The link to my portfolio, kept minimal: a label, a headline, what the site
 * holds, and the address with an arrow that nudges forward. No box, so it
 * reads as part of the page.
 */
import { EASE, escapeXml, styles, svg } from "./theme.ts";

const WIDTH = 1200;
const HEIGHT = 190;

export interface PortfolioContent {
  title: string;
  /** What the site holds, e.g. "4 case studies". */
  facts: string[];
  address: string;
}

export function portfolio(content: PortfolioContent): string {
  const addressWidth = content.address.length * 13.2;

  const css = `
    .in { animation: in 0.7s ${EASE} backwards; }
    .rule { transform-box: fill-box; transform-origin: left; animation: rule 0.9s ${EASE} 0.2s backwards; }
    .go { animation: go 1.8s ease-in-out infinite; }
    @keyframes in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes rule { from { transform: scaleX(0); } }
    @keyframes go { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(8px); } }
    @media (prefers-reduced-motion: reduce) { .in, .rule, .go { animation: none; } }`;

  return svg(WIDTH, HEIGHT, `${content.title}. ${content.facts.join(", ")}. ${content.address}`, `  ${styles(css)}
  <text class="mono accent in" x="4" y="34" font-size="14" letter-spacing="2.5">PORTFOLIO</text>
  <text class="fg in" style="animation-delay: 0.08s" x="2" y="92" font-size="46" font-weight="800" letter-spacing="-1">${escapeXml(content.title)}</text>
  <text class="muted in" style="animation-delay: 0.16s" x="4" y="130" font-size="18">${escapeXml(content.facts.join("   ·   "))}</text>

  <g class="in" style="animation-delay: 0.24s">
    <text class="accent" x="${WIDTH - 60}" y="92" text-anchor="end" font-size="24" font-weight="700">${escapeXml(content.address)}</text>
    <rect class="accent rule" x="${(WIDTH - 60 - addressWidth).toFixed(0)}" y="104" width="${addressWidth.toFixed(0)}" height="2" rx="1"/>
    <path class="go accent-line" d="M${WIDTH - 44} 84h26m-9-9 9 9-9 9" fill="none" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <line class="edge" x1="0" y1="${HEIGHT - 16}" x2="${WIDTH}" y2="${HEIGHT - 16}"/>`);
}
