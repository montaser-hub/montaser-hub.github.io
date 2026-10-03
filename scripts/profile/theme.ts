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
  accent: string;
}

// Neutral surfaces and one accent: the content and the brand icons carry the colour.
export const DARK: Palette = {
  bg: "#0d1117", panel: "#151b23", border: "#2a313c", fg: "#e6edf3", muted: "#9da7b3", dim: "#7d8590", accent: "#4c8dff",
};
export const LIGHT: Palette = {
  bg: "#ffffff", panel: "#f6f8fa", border: "#d0d7de", fg: "#1f2328", muted: "#59636e", dim: "#6e7781", accent: "#0969da",
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
    .accent { fill: ${c.accent}; } .accent-line { stroke: ${c.accent}; } .dim-line { stroke: ${c.dim}; }
    .stop-accent { stop-color: ${c.accent}; } .stop-fg { stop-color: ${c.fg}; }`;
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
