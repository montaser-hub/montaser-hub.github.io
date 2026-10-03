/**
 * The link to my portfolio: a headline, what's there and the address on the
 * left; on the right a small browser window where boxes carrying project
 * names move up one after another.
 */
import { EASE, escapeXml, styles, svg } from "./theme.ts";

const WIDTH = 1200;
const HEIGHT = 250;

export interface PortfolioContent {
  title: string;
  /** What the site holds, e.g. "4 case studies". */
  facts: string[];
  address: string;
  /** Names shown on the moving boxes, with a short line under each. */
  projects: { name: string; line: string }[];
}

export function portfolio(content: PortfolioContent): string {
  // The browser window on the right and the carousel inside it.
  const window = { x: 760, y: 34, width: 384, height: 182 };
  const item = 62; // height of one box plus its gap
  const visible = { x: window.x + 18, y: window.y + 44, width: window.width - 36, height: item * 2 - 8 };
  const hold = 2.2; // seconds each box stays before the next moves up
  const count = content.projects.length;
  const total = count * hold;

  // One step per project: hold, then glide up by one box. The first box is
  // repeated at the end so the loop restarts without a jump.
  const frames = Array.from({ length: count }, (_, i) => {
    const start = (i / count) * 100;
    const glide = ((i + 0.78) / count) * 100;
    return `${start.toFixed(2)}%, ${glide.toFixed(2)}% { transform: translateY(-${i * item}px); }`;
  }).join("\n      ");

  const boxes = [...content.projects, content.projects[0], content.projects[1]]
    .map((project, i) => {
      const y = visible.y + i * item;
      return `<rect class="box" x="${visible.x}" y="${y}" width="${visible.width}" height="${item - 10}" rx="10"/>
      <circle class="accent" cx="${visible.x + 24}" cy="${y + (item - 10) / 2}" r="5"/>
      <text class="fg" x="${visible.x + 42}" y="${y + 23}" font-size="15" font-weight="700">${escapeXml(project.name)}</text>
      <text class="dim" x="${visible.x + 42}" y="${y + 41}" font-size="12">${escapeXml(project.line)}</text>`;
    })
    .join("\n      ");

  const css = `
    .box { fill: var(--box); }
    svg { --box: rgba(76, 141, 255, 0.12); }
    @media (prefers-color-scheme: light) { svg { --box: rgba(9, 105, 218, 0.09); } }
    .carousel { animation: carousel ${total}s ${EASE} infinite; }
    .go { animation: go 1.8s ease-in-out infinite; }
    @keyframes carousel {
      ${frames}
      100% { transform: translateY(-${count * item}px); }
    }
    @keyframes go { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(6px); } }
    @media (prefers-reduced-motion: reduce) { .carousel, .go { animation: none; } }`;

  return svg(WIDTH, HEIGHT, `${content.title}. ${content.facts.join(", ")}. ${content.address}`, `  ${styles(css)}
  <defs><clipPath id="view"><rect x="${visible.x}" y="${visible.y}" width="${visible.width}" height="${visible.height}" rx="10"/></clipPath></defs>
  <rect class="panel edge" x="0.5" y="0.5" width="${WIDTH - 1}" height="${HEIGHT - 1}" rx="20" stroke-width="1"/>

  <text class="mono accent" x="56" y="72" font-size="14" letter-spacing="2">PORTFOLIO</text>
  <text class="fg" x="56" y="122" font-size="40" font-weight="800" letter-spacing="-0.8">${escapeXml(content.title)}</text>
  <text class="muted" x="56" y="158" font-size="17">${escapeXml(content.facts.join("  ·  "))}</text>
  <text class="accent" x="56" y="204" font-size="19" font-weight="700">${escapeXml(content.address)}</text>
  <path class="go accent-line" d="M${70 + content.address.length * 10.6} 198h22m-8-8 8 8-8 8" fill="none" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>

  <rect class="bg edge" x="${window.x}" y="${window.y}" width="${window.width}" height="${window.height}" rx="14" stroke-width="1"/>
  <circle class="dim" cx="${window.x + 20}" cy="${window.y + 18}" r="4.5" opacity="0.6"/><circle class="dim" cx="${window.x + 36}" cy="${window.y + 18}" r="4.5" opacity="0.6"/><circle class="dim" cx="${window.x + 52}" cy="${window.y + 18}" r="4.5" opacity="0.6"/>
  <rect class="panel" x="${window.x + 76}" y="${window.y + 9}" width="${window.width - 100}" height="18" rx="9"/>
  <text class="dim" x="${window.x + 90}" y="${window.y + 22}" font-size="11">${escapeXml(content.address)}</text>
  <g clip-path="url(#view)">
    <g class="carousel">
      ${boxes}
    </g>
  </g>`);
}
