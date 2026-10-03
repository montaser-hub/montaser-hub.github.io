/** A link button: brand icon and label in a pill. */
import { drawIcon, icon } from "./icons.ts";
import { escapeXml, styles, svg } from "./theme.ts";

const HEIGHT = 44;

export function button(label: string, iconName?: string): string {
  const found = iconName ? icon(iconName) : undefined;
  const width = Math.round(label.length * 8.8 + (found ? 62 : 40));
  const textX = found ? 46 : 20;
  return svg(width, HEIGHT, label, `  ${styles()}
  <rect class="panel edge" x="1" y="1" width="${width - 2}" height="${HEIGHT - 2}" rx="${(HEIGHT - 2) / 2}" stroke-width="1.5"/>
  ${found ? drawIcon(found, 26, HEIGHT / 2, 18) : ""}
  <text class="fg" x="${textX}" y="${HEIGHT / 2 + 5}" font-size="15" font-weight="600">${escapeXml(label)}</text>`);
}
