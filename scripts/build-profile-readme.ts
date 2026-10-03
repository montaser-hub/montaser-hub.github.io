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
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { caseStudies, copy, experience, focusAreas, metrics as siteMetrics, profile } from "../lib/data.ts";
import { EXCLUDED_REPOS, OVERRIDES, SELECTED_REPOS } from "../lib/project-catalog.ts";
import { monthlyChart, weekdayChart, type DayCount } from "./profile/analytics.ts";
import { button, type ContactIcon } from "./profile/button.ts";
import { footer } from "./profile/footer.ts";
import { header } from "./profile/header.ts";
import { metrics } from "./profile/metrics.ts";
import { now } from "./profile/now.ts";
import { portfolio } from "./profile/portfolio.ts";
import { measureCoverage } from "./profile/coverage.ts";
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

const HEIGHT_PAIR = 424; // the "now" window and the radar sit side by side

/** Repositories left out of the radar: client work I was asked not to show, and this profile itself. */
const NOT_PROJECTS = new Set(["RealState", "montaser-hub"]);

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
  // Private projects are the case studies without a public repository link.
  const privateStacks = caseStudies.filter((study) => !study.links).map((study) => study.tech);
  const coverage = measureCoverage(profile.github.split("/").pop()!, NOT_PROJECTS, privateStacks);
  if (coverage) {
    write(
      "radar.svg",
      radar(coverage.axes, coverage.total, HEIGHT_PAIR, `Measured from ${coverage.repositories} repositories and ${coverage.privateProjects} private projects`)
    );
  }
  const days = contributions();
  if (days) {
    write("analytics-months.svg", monthlyChart(days));
    write("analytics-weekdays.svg", weekdayChart(days));
  }
  write("footer.svg", footer(copy.contact.title, `${profile.email}  ·  ${profile.location}`));
  write("stack.svg", stack(STACK));
  CONTACTS.forEach((item, order) => write(item.file, button(item.label, item.detail, item.icon, order)));

  const demos = Object.entries(OVERRIDES).filter(([repo, project]) => !EXCLUDED_REPOS.has(repo) && project.demo).length;
  write(
    "portfolio.svg",
    portfolio({
      title: "See the work in detail",
      facts: [`${caseStudies.length} case studies`, `${SELECTED_REPOS.length} projects`, `${demos} live demos`],
      address: profile.site?.replace(/^https?:\/\//, "") ?? "",
      projects: caseStudies.map((study) => ({ name: study.name, line: study.role })),
    })
  );

  // A failed GitHub lookup would silently drop sections: refuse to write a partial profile.
  if (!coverage || !days) throw new Error("GitHub data unavailable (see warnings above); profile not written.");

  const image = (file: string, alt: string, width: string) => `<img src="assets/${file}" alt="${alt.replace(/"/g, "&quot;")}" width="${width}">`;
  const pair = (left: string, right: string) => `<p>\n  ${left}\n  ${right}\n</p>`;
  const readme = `<a href="${profile.site}">${image("header.svg", `${profile.name}, ${profile.title}. ${copy.hero.headlineLead} ${copy.hero.headlinePhrases[0]}`, "100%")}</a>

<p>
${CONTACTS.map((item) => `  <a href="${item.href}">${image(item.file, `${item.label}: ${item.detail}`, "24.4%")}</a>`).join("\n")}
</p>

${image("metrics.svg", siteMetrics.map((m) => `${m.value.toLocaleString("en-US")}${m.suffix ?? ""} ${m.label}`).join(", "), "100%")}

${image("stack.svg", `Tech stack: ${STACK.join(", ")}`, "100%")}

${
  coverage
    ? pair(
        image("now.svg", `What I do now: ${current.role} at ${current.company}`, "49.5%"),
        image("radar.svg", `Projects per area: ${coverage.axes.map((axis) => `${axis.label} ${axis.count}`).join(", ")}`, "49.5%")
      )
    : image("now.svg", `What I do now: ${current.role} at ${current.company}`, "49.5%")
}

<a href="${profile.site}">${image("portfolio.svg", `Portfolio: ${caseStudies.length} case studies, ${SELECTED_REPOS.length} projects and ${demos} live demos at ${profile.site}`, "100%")}</a>
${days ? `\n### Activity\n\n${pair(image("analytics-months.svg", "Contributions per month over the last year", "49.5%"), image("analytics-weekdays.svg", "Contributions by day of the week", "49.5%"))}\n` : ""}
<a href="mailto:${profile.email}">${image("footer.svg", `${copy.contact.title}: ${profile.email}`, "100%")}</a>
`;
  writeFileSync(path.join(OUT, "README.md"), readme);
  console.log("Wrote profile/README.md and its graphics.");
}

await build();
