/**
 * A featured-work card: screenshot, context, title, summary and key numbers,
 * with a light that travels around the border. The screenshot is embedded as
 * a data URI, because an SVG shown through <img> cannot load other files.
 */
import sharp from "sharp";
import { escapeXml, styles, svg, wrap } from "./theme.ts";

export interface CardContent {
  name: string;
  context: string;
  summary: string;
  stats: { value: string; label: string }[];
  /** Absolute path of the screenshot. */
  imagePath: string;
  /** Position in the grid, used to stagger the border light. */
  index: number;
}

const WIDTH = 590;
const IMAGE_HEIGHT = 369; // 16:10
const HEIGHT = 640;
const PAD = 24;

export async function card(content: CardContent): Promise<string> {
  const image = await sharp(content.imagePath)
    .resize(WIDTH * 2, IMAGE_HEIGHT * 2, { fit: "cover", position: "top" })
    .webp({ quality: 72 })
    .toBuffer();

  const summary = wrap(content.summary, 68, 4)
    .map((line, i) => `<text class="muted" x="${PAD}" y="${IMAGE_HEIGHT + 100 + i * 22}" font-size="15">${escapeXml(line)}</text>`)
    .join("\n  ");

  let x = PAD;
  const stats = content.stats
    .slice(0, 3)
    .map((stat) => {
      const width = Math.max(stat.value.length * 13 + 8, stat.label.length * 6.6) + 22;
      const out = `<g transform="translate(${x} ${HEIGHT - 86})">
    <text class="fg" x="0" y="24" font-size="22" font-weight="700">${escapeXml(stat.value)}</text>
    <text class="dim" x="0" y="46" font-size="12.5">${escapeXml(stat.label)}</text>
  </g>`;
      x += width;
      return out;
    })
    .join("\n  ");

  const css = `
    .light { animation: travel 6s linear infinite; animation-delay: ${(-content.index * 1.5).toFixed(1)}s; }
    @keyframes travel { to { stroke-dashoffset: -100; } }
    @media (prefers-reduced-motion: reduce) { .light { animation: none; opacity: 0; } }`;

  return svg(WIDTH, HEIGHT, `${content.name}. ${content.context}. ${content.summary}`, `  ${styles(css)}
  <defs>
    <clipPath id="shot"><path d="M0 16A16 16 0 0 1 16 0H${WIDTH - 16}A16 16 0 0 1 ${WIDTH} 16V${IMAGE_HEIGHT}H0Z"/></clipPath>
  </defs>
  <rect class="panel" width="${WIDTH}" height="${HEIGHT}" rx="16"/>
  <image clip-path="url(#shot)" width="${WIDTH}" height="${IMAGE_HEIGHT}" preserveAspectRatio="xMidYMin slice" href="data:image/webp;base64,${image.toString("base64")}"/>
  <line class="edge" x1="0" y1="${IMAGE_HEIGHT}" x2="${WIDTH}" y2="${IMAGE_HEIGHT}"/>
  <text class="mono accent" x="${PAD}" y="${IMAGE_HEIGHT + 34}" font-size="12" letter-spacing="0.8">${escapeXml(content.context.toUpperCase())}</text>
  <text class="fg" x="${PAD}" y="${IMAGE_HEIGHT + 68}" font-size="23" font-weight="700">${escapeXml(content.name)}</text>
  ${summary}
  ${stats}
  <rect class="edge" x="0.5" y="0.5" width="${WIDTH - 1}" height="${HEIGHT - 1}" rx="16" fill="none"/>
  <rect class="light accent-line" x="0.5" y="0.5" width="${WIDTH - 1}" height="${HEIGHT - 1}" rx="16" fill="none" stroke-width="2" stroke-linecap="round" pathLength="100" stroke-dasharray="14 86"/>`);
}
