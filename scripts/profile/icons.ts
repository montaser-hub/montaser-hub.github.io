/**
 * Brand icons for the profile graphics, from the simple-icons set (24×24
 * paths). Brands whose official colour is near-black are drawn in the text
 * colour instead, so they stay visible on the dark theme.
 */
import * as simpleIcons from "simple-icons";

interface SimpleIcon {
  path: string;
  hex: string;
}

/** Display name → simple-icons export. Names match the portfolio's tech lists. */
const SOURCES: Record<string, string> = {
  React: "siReact", "Next.js": "siNextdotjs", Angular: "siAngular", TypeScript: "siTypescript",
  JavaScript: "siJavascript", "Redux Toolkit": "siRedux", "Tailwind CSS": "siTailwindcss", SASS: "siSass",
  "Framer Motion": "siFramer", Vite: "siVite", "Node.js": "siNodedotjs", NestJS: "siNestjs", Express: "siExpress",
  GraphQL: "siGraphql", Redis: "siRedis", Prisma: "siPrisma", "Socket.io": "siSocketdotio", MongoDB: "siMongodb",
  PostgreSQL: "siPostgresql", MySQL: "siMysql", Docker: "siDocker", Nx: "siNx", Git: "siGit", Jest: "siJest",
  Vitest: "siVitest", Jasmine: "siJasmine", GitHub: "siGithub", Gmail: "siGmail", WhatsApp: "siWhatsapp",
};

/** Colours that read better than the official one at small sizes. */
const COLOR_OVERRIDES: Record<string, string> = { Angular: "#DD0031", Vitest: "#6E9F18", Nx: "#7C8DB5", Prisma: "#5A67D8" };

/** Icons the set no longer ships. */
const CUSTOM: Record<string, SimpleIcon> = {
  LinkedIn: {
    hex: "0A66C2",
    path: "M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z",
  },
};

export interface Icon {
  name: string;
  path: string;
  /** Hex colour, or undefined to use the theme's text colour. */
  color?: string;
}

function luminance(hex: string): number {
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function icon(name: string): Icon | undefined {
  const source = CUSTOM[name] ?? (simpleIcons as unknown as Record<string, SimpleIcon>)[SOURCES[name]];
  if (!source) return undefined;
  const color = COLOR_OVERRIDES[name] ?? (luminance(source.hex) < 0.12 ? undefined : `#${source.hex}`);
  return { name, path: source.path, color };
}

/** The icon drawn `size` px wide, centred on (cx, cy). */
export function drawIcon({ path, color }: Icon, cx: number, cy: number, size: number): string {
  const scale = size / 24;
  const fill = color ? `fill="${color}"` : `class="fg"`;
  return `<path ${fill} transform="translate(${(cx - size / 2).toFixed(1)} ${(cy - size / 2).toFixed(1)}) scale(${scale.toFixed(3)})" d="${path}"/>`;
}
