/**
 * Generates the link-preview image (public/og.png) and the PNG favicon
 * fallback from the profile data and the site palette.
 *
 *   npm run images
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { profile } from "../lib/data.ts";

const PUBLIC = path.resolve(import.meta.dirname, "..", "public");
const COLORS = { background: "#05070a", foreground: "#e7ebf3", muted: "#8b96a8", accent: "#f6821f", border: "#1a2130" };

const escapeXml = (text: string) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Breaks text into lines of at most `max` characters, on word boundaries. */
function wrap(text: string, max: number): string[] {
  const lines: string[] = [];
  for (const word of text.split(" ")) {
    const last = lines[lines.length - 1];
    if (last !== undefined && `${last} ${word}`.length <= max) lines[lines.length - 1] = `${last} ${word}`;
    else lines.push(word);
  }
  return lines;
}

const tagline = wrap(profile.tagline, 62)
  .map((line, i) => `<text x="80" y="${400 + i * 40}" font-size="28" fill="${COLORS.muted}">${escapeXml(line)}</text>`)
  .join("\n  ");

const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <style>text { font-family: "DejaVu Sans", "Segoe UI", Helvetica, Arial, sans-serif; }</style>
  <rect width="1200" height="630" fill="${COLORS.background}"/>
  <rect x="24" y="24" width="1152" height="582" rx="20" fill="none" stroke="${COLORS.border}" stroke-width="2"/>
  <text x="80" y="230" font-size="76" font-weight="700" fill="${COLORS.foreground}">${escapeXml(profile.name)}</text>
  <text x="80" y="290" font-size="36" font-weight="500" fill="${COLORS.accent}">${escapeXml(profile.title)}</text>
  <rect x="80" y="325" width="96" height="4" fill="${COLORS.accent}"/>
  ${tagline}
</svg>`;

await sharp(Buffer.from(og)).png().toFile(path.join(PUBLIC, "og.png"));
await sharp(readFileSync(path.join(PUBLIC, "favicon.svg")), { density: 300 })
  .resize(180, 180)
  .png()
  .toFile(path.join(PUBLIC, "favicon.png"));
console.log("Wrote public/og.png and public/favicon.png.");
