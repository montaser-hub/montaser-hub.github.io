/**
 * Generates my GitHub profile README (the `montaser-hub/montaser-hub` repo)
 * from the same data as the portfolio site.
 *
 *   npm run profile        writes profile/README.md and profile/assets/
 *
 * The README is a handful of animated SVGs generated here and committed with
 * it: no third-party badge, stats or typing services, which break or get
 * rate-limited on profile pages. It deliberately leaves out what GitHub
 * already shows beside it (the contribution graph and the repository list).
 */
import { existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { caseStudies, copy, metrics as siteMetrics, profile } from "../lib/data.ts";
import { button } from "./profile/button.ts";
import { card } from "./profile/card.ts";
import { header } from "./profile/header.ts";
import { metrics } from "./profile/metrics.ts";
import { stack } from "./profile/stack.ts";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT = path.join(ROOT, "profile");
const ASSETS = path.join(OUT, "assets");

/** Tools shown as icons, by area. Concepts without a logo are left to the project write-ups. */
const STACK = {
  Frontend: ["React", "Next.js", "Angular", "TypeScript", "JavaScript", "Redux Toolkit", "Tailwind CSS", "SASS", "Vite"],
  Backend: ["Node.js", "NestJS", "Express", "GraphQL", "Prisma", "Socket.io"],
  Data: ["MongoDB", "PostgreSQL", "MySQL", "Redis"],
  "Test & ship": ["Jest", "Vitest", "Jasmine", "Docker", "Nx"],
};

/** Icons on the hero's rings, innermost first. */
const ORBITS = [
  ["React", "Node.js", "TypeScript"],
  ["NestJS", "MongoDB", "Angular", "Docker"],
  ["Next.js", "PostgreSQL", "Redis", "GraphQL", "Tailwind CSS"],
];

const slug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const write = (name: string, content: string) => writeFileSync(path.join(ASSETS, name), content);

const BUTTONS = [
  ...(profile.site ? [{ label: "Portfolio", href: profile.site, file: "button-portfolio.svg", icon: undefined }] : []),
  { label: "LinkedIn", href: profile.linkedin, file: "button-linkedin.svg", icon: "LinkedIn" },
  { label: "Email", href: `mailto:${profile.email}`, file: "button-email.svg", icon: "Gmail" },
  { label: "WhatsApp", href: profile.whatsapp, file: "button-whatsapp.svg", icon: "WhatsApp" },
];

async function build(): Promise<void> {
  rmSync(ASSETS, { recursive: true, force: true });
  mkdirSync(ASSETS, { recursive: true });

  write(
    "header.svg",
    header({
      name: profile.name,
      subtitle: `${profile.title} · ${profile.location}`,
      status: profile.availability,
      lead: copy.hero.headlineLead,
      phrases: copy.hero.headlinePhrases,
      orbits: ORBITS,
    })
  );
  write("metrics.svg", metrics(siteMetrics));
  write("stack.svg", stack(STACK));
  for (const item of BUTTONS) write(item.file, button(item.label, item.icon));

  const featured = caseStudies.filter((study) => study.image && existsSync(path.join(ROOT, "public", study.image)));
  const cards = await Promise.all(
    featured.map(async (study, index) => {
      const file = `card-${slug(study.name)}.svg`;
      write(
        file,
        await card({
          name: study.name,
          context: study.context,
          summary: study.summary,
          stats: study.stats ?? [],
          imagePath: path.join(ROOT, "public", study.image!),
          index,
        })
      );
      // Open-source work links to its repo; private work to the case study on the site.
      return { file, alt: `${study.name}: ${study.summary}`, href: study.links?.[0].href ?? `${profile.site}/#work` };
    })
  );

  const image = (file: string, alt: string, width: string) => `<img src="assets/${file}" alt="${alt.replace(/"/g, "&quot;")}" width="${width}">`;
  const readme = `<a href="${profile.site}">${image("header.svg", `${profile.name}, ${profile.title}. ${copy.hero.headlineLead} ${copy.hero.headlinePhrases[0]}`, "100%")}</a>

<p align="center">
${BUTTONS.map((item) => `  <a href="${item.href}"><img src="assets/${item.file}" alt="${item.label}" height="40"></a>`).join("\n")}
</p>

${image("metrics.svg", siteMetrics.map((m) => `${m.value.toLocaleString("en-US")}${m.suffix ?? ""} ${m.label}`).join(", "), "100%")}

### Featured work

<p>
${cards.map((item) => `  <a href="${item.href}">${image(item.file, item.alt, "49.5%")}</a>`).join("\n")}
</p>

### Tech stack

${image("stack.svg", Object.entries(STACK).map(([area, names]) => `${area}: ${names.join(", ")}`).join(". "), "100%")}
`;
  writeFileSync(path.join(OUT, "README.md"), readme);
  console.log(`Wrote profile/README.md and ${featured.length + BUTTONS.length + 3} graphics.`);
}

await build();
