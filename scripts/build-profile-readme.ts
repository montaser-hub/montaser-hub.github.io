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
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { caseStudies, copy, experience, focusAreas, metrics as siteMetrics, profile } from "../lib/data.ts";
import { EXCLUDED_REPOS, OVERRIDES } from "../lib/project-catalog.ts";
import { button } from "./profile/button.ts";
import { card } from "./profile/card.ts";
import { footer } from "./profile/footer.ts";
import { header } from "./profile/header.ts";
import { languages, type Language } from "./profile/languages.ts";
import { metrics } from "./profile/metrics.ts";
import { now } from "./profile/now.ts";
import { radar } from "./profile/radar.ts";
import { stack } from "./profile/stack.ts";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT = path.join(ROOT, "profile");
const ASSETS = path.join(OUT, "assets");

/** Tools on the sliding icon line, in order. Concepts without a logo are left to the project write-ups. */
const STACK = [
  "React", "Next.js", "Angular", "TypeScript", "JavaScript", "Redux Toolkit", "Tailwind CSS", "SASS", "Vite",
  "Node.js", "NestJS", "Express", "GraphQL", "Prisma", "Socket.io",
  "MongoDB", "PostgreSQL", "MySQL", "Redis",
  "Jest", "Vitest", "Jasmine", "Docker", "Nx",
];

/** Icons on the hero's rings, innermost first. */
const ORBITS = [
  ["React", "Node.js", "TypeScript"],
  ["NestJS", "MongoDB", "Angular", "Docker"],
  ["Next.js", "PostgreSQL", "Redis", "GraphQL", "Tailwind CSS"],
];

/** Which technologies count towards each radar axis. */
const AREAS: Record<string, string[]> = {
  Frontend: ["React", "Angular", "Next.js", "Redux Toolkit", "Tailwind CSS", "Vite", "JavaScript", "HTML", "CSS", "Bootstrap", "Material UI", "RxJS", "EJS", "Pug"],
  "Backend & APIs": ["Node.js", "NestJS", "Express", "GraphQL"],
  Databases: ["MongoDB", "PostgreSQL", "MySQL", "Prisma", "ER Modeling"],
  "Real-time & queues": ["Socket.io", "Redis", "BullMQ"],
  Testing: ["Jest", "Vitest"],
  "Containers & tooling": ["Docker", "Nx"],
};

/** GitHub's colours for the languages I use; anything else is grouped as Other. */
const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: "#f1e05a", TypeScript: "#3178c6", HTML: "#e34c26", CSS: "#7e57c2", SCSS: "#c6538c",
  EJS: "#a91e50", Pug: "#a86454", PLpgSQL: "#336790", Shell: "#89e051",
};
const HEIGHT_PAIR = 424; // the "now" window and the radar sit side by side

/** How many projects (case studies and listed repos) use at least one technology of each area. */
function projectsPerArea(): { axes: { label: string; count: number }[]; total: number } {
  const stacks = [
    ...caseStudies.map((study) => study.tech),
    ...Object.entries(OVERRIDES).filter(([repo]) => !EXCLUDED_REPOS.has(repo)).map(([, project]) => project.tech ?? []),
  ];
  const axes = Object.entries(AREAS).map(([label, techs]) => ({
    label,
    count: stacks.filter((stack) => stack.some((tech) => techs.includes(tech))).length,
  }));
  return { axes, total: stacks.length };
}

/** Language shares by code size over my own public, non-archived repositories (needs the gh CLI). */
function languageShares(): { list: Language[]; repoCount: number } | undefined {
  const login = profile.github.split("/").pop();
  try {
    const gh = (path: string) => JSON.parse(execFileSync("gh", ["api", path], { encoding: "utf8" }));
    const repos: { name: string; fork: boolean; archived: boolean }[] = gh(`users/${login}/repos?per_page=100`);
    const own = repos.filter((repo) => !repo.fork && !repo.archived && repo.name !== login);
    const bytes: Record<string, number> = {};
    for (const repo of own) {
      const perLanguage: Record<string, number> = gh(`repos/${login}/${repo.name}/languages`);
      for (const [name, size] of Object.entries(perLanguage)) bytes[name] = (bytes[name] ?? 0) + size;
    }
    const total = Object.values(bytes).reduce((sum, size) => sum + size, 0);
    const ranked = Object.entries(bytes).sort((a, b) => b[1] - a[1]);
    const top = ranked.slice(0, 5).map(([name, size]) => ({ name, share: size / total, color: LANGUAGE_COLORS[name] ?? "#8b949e" }));
    const rest = ranked.slice(5).reduce((sum, [, size]) => sum + size, 0);
    if (rest > 0) top.push({ name: "Other", share: rest / total, color: "#8b949e" });
    return { list: top, repoCount: own.length };
  } catch {
    console.warn("Skipping the languages chart: could not read repositories with `gh`.");
    return undefined;
  }
}

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

  const [current, previous] = experience;
  write(
    "now.svg",
    now(
      {
        variable: "montaser",
        fields: {
          role: current.role,
          company: current.company,
          previously: `${previous.role}, ${previous.company}`,
          focus: focusAreas.map((area) => area.title),
          based: profile.location,
          status: profile.availability,
        },
      },
      HEIGHT_PAIR
    )
  );
  const coverage = projectsPerArea();
  write("radar.svg", radar(coverage.axes, coverage.total, HEIGHT_PAIR));
  const shares = languageShares();
  if (shares) write("languages.svg", languages(shares.list, shares.repoCount));
  write("footer.svg", footer(copy.contact.title, `${profile.email}  ·  ${profile.location}`));
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

<p>
  ${image("now.svg", `What I do now: ${current.role} at ${current.company}`, "49.5%")}
  ${image("radar.svg", `Projects per area: ${coverage.axes.map((axis) => `${axis.label} ${axis.count}`).join(", ")}`, "49.5%")}
</p>

### Featured work

<p>
${cards.map((item) => `  <a href="${item.href}">${image(item.file, item.alt, "49.5%")}</a>`).join("\n")}
</p>

### Tech stack

${image("stack.svg", `Tech stack: ${STACK.join(", ")}`, "100%")}
${shares ? `\n${image("languages.svg", `Languages: ${shares.list.map((l) => `${l.name} ${(l.share * 100).toFixed(0)}%`).join(", ")}`, "100%")}\n` : ""}
<a href="mailto:${profile.email}">${image("footer.svg", `${copy.contact.title}: ${profile.email}`, "100%")}</a>
`;
  writeFileSync(path.join(OUT, "README.md"), readme);
  console.log("Wrote profile/README.md and its graphics.");
}

await build();
