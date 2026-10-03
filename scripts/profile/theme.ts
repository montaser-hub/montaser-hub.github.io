/**
 * Visual language of the profile graphics. Every SVG takes its colours from
 * these classes: dark by default, switched by the viewer's colour scheme
 * (which GitHub's theme follows), so one file serves both themes.
 */
export interface Palette {
  bg: string;
  panel: string;
  border: string;
  fg: string;
  muted: string;
  dim: string;
  violet: string;
  cyan: string;
  pink: string;
}

export const DARK: Palette = {
  bg: "#0b1020", panel: "#121a33", border: "#232f55", fg: "#e8ecf8", muted: "#a3aecb", dim: "#7482a8",
  violet: "#8b6cff", cyan: "#22d3ee", pink: "#f472b6",
};
export const LIGHT: Palette = {
  bg: "#ffffff", panel: "#f5f7fc", border: "#d5dceb", fg: "#0f172a", muted: "#475569", dim: "#64748b",
  violet: "#5b3df5", cyan: "#0891b2", pink: "#db2777",
};

export const FONT_SANS = `ui-sans-serif, -apple-system, "Segoe UI", Helvetica, Arial, sans-serif`;
export const FONT_MONO = `ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace`;
/** Fraction of the font size one monospace character occupies. */
export const MONO_ADVANCE = 0.6;
/** One easing for everything that arrives. */
export const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

function rules(c: Palette): string {
  return `
    .bg { fill: ${c.bg}; } .panel { fill: ${c.panel}; } .edge { stroke: ${c.border}; }
    .fg { fill: ${c.fg}; } .muted { fill: ${c.muted}; } .dim { fill: ${c.dim}; }
    .violet { fill: ${c.violet}; } .cyan { fill: ${c.cyan}; } .pink { fill: ${c.pink}; }
    .stop-violet { stop-color: ${c.violet}; } .stop-cyan { stop-color: ${c.cyan}; } .stop-pink { stop-color: ${c.pink}; }
    .stop-fg { stop-color: ${c.fg}; }`;
}

/** The <style> body shared by every graphic; `extra` holds its own rules. */
export function styles(extra = ""): string {
  return `<style>${rules(DARK)}
    @media (prefers-color-scheme: light) {${rules(LIGHT)}
    }
    text { font-family: ${FONT_SANS}; }
    .mono { font-family: ${FONT_MONO}; }
    ${extra}
  </style>`;
}

/** Gradient definitions used across the graphics. */
export const GRADIENTS = `
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" class="stop-violet"/><stop offset="0.55" class="stop-cyan"/><stop offset="1" class="stop-pink"/>
    </linearGradient>`;

export const escapeXml = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Breaks text into lines of at most `max` characters on word boundaries, capped at `maxLines`. */
export function wrap(text: string, max: number, maxLines = Infinity): string[] {
  const lines: string[] = [];
  for (const word of text.split(" ")) {
    const last = lines[lines.length - 1];
    if (last !== undefined && `${last} ${word}`.length <= max) lines[lines.length - 1] = `${last} ${word}`;
    else lines.push(word);
  }
  if (lines.length <= maxLines) return lines;
  const kept = lines.slice(0, maxLines);
  kept[maxLines - 1] = `${kept[maxLines - 1].replace(/[\s,.;:]+$/, "")}…`;
  return kept;
}

export function svg(width: number, height: number, label: string, body: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="${escapeXml(label)}">
${body}
</svg>
`;
}
