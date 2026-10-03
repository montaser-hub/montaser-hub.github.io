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
import { monthlyChart, weekdayChart, type DayCount } from "./profile/analytics.ts";
import { button, type ContactIcon } from "./profile/button.ts";
import { card } from "./profile/card.ts";
import { footer } from "./profile/footer.ts";
import { header } from "./profile/header.ts";
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

/** Which technologies count towards each radar axis. */
const AREAS: Record<string, string[]> = {
  Frontend: ["React", "Angular", "Next.js", "Redux Toolkit", "Tailwind CSS", "Vite", "JavaScript", "HTML", "CSS", "Bootstrap", "Material UI", "RxJS", "EJS", "Pug"],
  "Backend & APIs": ["Node.js", "NestJS", "Express", "GraphQL"],
  Databases: ["MongoDB", "PostgreSQL", "MySQL", "Prisma", "ER Modeling"],
  "Real-time & queues": ["Socket.io", "Redis", "BullMQ"],
  Testing: ["Jest", "Vitest"],
  "Containers & tooling": ["Docker", "Nx"],
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

/** Daily contribution counts for the last year (needs the gh CLI). */
function contributions(): DayCount[] | undefined {
  const login = profile.github.split("/").pop();
  const query = `{ user(login: "${login}") { contributionsCollection { contributionCalendar {
    weeks { contributionDays { date contributionCount } } } } } }`;
  try {
    const out = execFileSync("gh", ["api", "graphql", "-f", `query=${query}`], { encoding: "utf8" });
    const weeks: { contributionDays: { date: string; contributionCount: number }[] }[] =
      JSON.parse(out).data.user.contributionsCollection.contributionCalendar.weeks;
    return weeks.flatMap((week) => week.contributionDays.map((day) => ({ date: day.date, count: day.contributionCount })));
  } catch {
    console.warn("Skipping the analytics charts: could not read contributions with `gh`.");
    return undefined;
  }
}

const slug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const write = (name: string, content: string) => writeFileSync(path.join(ASSETS, name), content);

/** Contact cards under the hero: where each leads and the line shown under its name. */
const CONTACTS: { label: string; detail: string; href: string; file: string; icon: ContactIcon }[] = [
  ...(profile.site
    ? [{ label: "Portfolio", detail: profile.site.replace(/^https?:\/\//, ""), href: profile.site, file: "contact-portfolio.svg", icon: "globe" as const }]
    : []),
  {
    label: "LinkedIn",
    detail: profile.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\//, "").replace(/\/$/, ""),
    href: profile.linkedin,
    file: "contact-linkedin.svg",
    icon: "linkedin",
  },
  { label: "Email", detail: profile.email, href: `mailto:${profile.email}`, file: "contact-email.svg", icon: "mail" },
  { label: "WhatsApp", detail: profile.phoneDisplay, href: profile.whatsapp, file: "contact-whatsapp.svg", icon: "whatsapp" },
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
  const days = contributions();
  if (days) {
    write("analytics-months.svg", monthlyChart(days));
    write("analytics-weekdays.svg", weekdayChart(days));
  }
  write("footer.svg", footer(copy.contact.title, `${profile.email}  ·  ${profile.location}`));
  write("stack.svg", stack(STACK));
  CONTACTS.forEach((item, order) => write(item.file, button(item.label, item.detail, item.icon, order)));

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
  const pair = (left: string, right: string) => `<p>\n  ${left}\n  ${right}\n</p>`;
  const readme = `<a href="${profile.site}">${image("header.svg", `${profile.name}, ${profile.title}. ${copy.hero.headlineLead} ${copy.hero.headlinePhrases[0]}`, "100%")}</a>

<p>
${CONTACTS.map((item) => `  <a href="${item.href}">${image(item.file, `${item.label}: ${item.detail}`, "24.4%")}</a>`).join("\n")}
</p>

${image("metrics.svg", siteMetrics.map((m) => `${m.value.toLocaleString("en-US")}${m.suffix ?? ""} ${m.label}`).join(", "), "100%")}

${image("stack.svg", `Tech stack: ${STACK.join(", ")}`, "100%")}

${pair(
  image("now.svg", `What I do now: ${current.role} at ${current.company}`, "49.5%"),
  image("radar.svg", `Projects per area: ${coverage.axes.map((axis) => `${axis.label} ${axis.count}`).join(", ")}`, "49.5%")
)}

### Featured work

<p>
${cards.map((item) => `  <a href="${item.href}">${image(item.file, item.alt, "49.5%")}</a>`).join("\n")}
</p>
${days ? `\n### Activity\n\n${pair(image("analytics-months.svg", "Contributions per month over the last year", "49.5%"), image("analytics-weekdays.svg", "Contributions by day of the week", "49.5%"))}\n` : ""}
<a href="mailto:${profile.email}">${image("footer.svg", `${copy.contact.title}: ${profile.email}`, "100%")}</a>
`;
  writeFileSync(path.join(OUT, "README.md"), readme);
  console.log("Wrote profile/README.md and its graphics.");
}

await build();
