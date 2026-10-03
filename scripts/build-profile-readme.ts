/**
 * Generates my GitHub profile README (the `montaser-hub/montaser-hub` repo)
 * from the same data as the portfolio site.
 *
 *   npm run profile        writes profile/README.md and profile/assets/
 *
 * The README is a handful of animated SVGs generated here and committed with
 * it: no third-party badge, stats or typing services, which break or get
 * rate-limited on profile pages. Every figure in them is read from the site's
 * data or from GitHub when this runs, so re-running it brings them up to date.
 */
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { caseStudies, contacts, copy, experience, focusAreas, metrics as siteMetrics, profile } from "../lib/data.ts";
import type { ContactLink } from "../lib/types.ts";
import { EXCLUDED_REPOS, OVERRIDES, SELECTED_REPOS } from "../lib/project-catalog.ts";
import { donutChart, hoursChart, statsCard, summaryCard } from "./profile/analytics.ts";
import { button, type ContactIcon } from "./profile/button.ts";
import { footer } from "./profile/footer.ts";
import { readGitHub } from "./profile/github.ts";
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

const login = profile.github.split("/").pop()!;

const HEIGHT_PAIR = 424; // the "now" window and the radar sit side by side

/** Repositories left out of the radar and the language and commit figures: client work I was asked not to show, and this profile itself. */
const NOT_PROJECTS = new Set(["RealState", "montaser-hub"]);

const write = (name: string, content: string) => writeFileSync(path.join(ASSETS, name), content);

/** Contact links under the hero: the portfolio first, then the site's contact list (GitHub itself is where this is shown). */
const CONTACT_ICONS: Partial<Record<ContactLink["kind"], ContactIcon>> = { linkedin: "linkedin", email: "mail", whatsapp: "whatsapp" };
const CONTACTS: { label: string; detail: string; href: string; file: string; icon: ContactIcon }[] = [
  ...(profile.site
    ? [{ label: "Portfolio", detail: profile.site.replace(/^https?:\/\//, ""), href: profile.site, file: "contact-portfolio.svg", icon: "globe" as const }]
    : []),
  ...contacts.flatMap(({ kind, label, detail, href }) => {
    const icon = CONTACT_ICONS[kind];
    return icon ? [{ label, detail, href, file: `contact-${kind}.svg`, icon }] : [];
  }),
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
  const coverage = measureCoverage(login, NOT_PROJECTS, privateStacks);
  if (coverage) {
    write(
      "radar.svg",
      radar(coverage.axes, coverage.total, HEIGHT_PAIR, `Measured from ${coverage.repositories} repositories and ${coverage.privateProjects} private projects`)
    );
  }
  const github = readGitHub(login, NOT_PROJECTS, profile.timeZone);
  if (github) {
    write("analytics-summary.svg", summaryCard(profile.name, github));
    write("analytics-languages-repos.svg", donutChart("Languages by repository", "Main language of each public repository", github.languagesByRepo, "repositories"));
    write("analytics-hours.svg", hoursChart(github.commitHours, profile.timeZone.split("/").pop()!.replace(/_/g, " "), github.commitsRead));
    write("analytics-totals.svg", statsCard(github));
    write("analytics-languages-commits.svg", donutChart("Languages by commit", "My commits, by each repository's main language", github.languagesByCommit, "commits"));
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
  if (!coverage || !github) throw new Error("GitHub data unavailable (see warnings above); profile not written.");

  const image = (file: string, alt: string, width: string) => `<img src="assets/${file}" alt="${alt.replace(/"/g, "&quot;")}" width="${width}">`;
  const number = (value: number) => value.toLocaleString("en-US");
  const shares = (list: { label: string; count: number }[]) => list.map((share) => `${share.label} ${share.count}`).join(", ");
  const pair = (left: string, right: string) => `<p>\n  ${left}\n  ${right}\n</p>`;
  const readme = `<a href="${profile.site}">${image("header.svg", `${profile.name}, ${profile.title}. ${copy.hero.headlineLead} ${copy.hero.headlinePhrases[0]}`, "100%")}</a>

<p>
${CONTACTS.map((item) => `  <a href="${item.href}">${image(item.file, `${item.label}: ${item.detail}`, `${(97.6 / CONTACTS.length).toFixed(1)}%`)}</a>`).join("\n")}
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

### GitHub analytics

${image("analytics-summary.svg", `${number(github.contributions)} contributions in the last year, ${github.publicRepos} public repositories`, "100%")}

${pair(
  image("analytics-languages-repos.svg", `Languages by repository: ${shares(github.languagesByRepo)}`, "49.5%"),
  image("analytics-hours.svg", `Commits per hour of the day, ${profile.timeZone} time`, "49.5%")
)}

${pair(
  image("analytics-totals.svg", `${number(github.commitsLastYear)} commits in the last year, ${number(github.pullRequests)} pull requests, ${number(github.issues)} issues`, "49.5%"),
  image("analytics-languages-commits.svg", `Languages by commit: ${shares(github.languagesByCommit)}`, "49.5%")
)}

<a href="mailto:${profile.email}">${image("footer.svg", `${copy.contact.title}: ${profile.email}`, "100%")}</a>
`;
  writeFileSync(path.join(OUT, "README.md"), readme);
  console.log("Wrote profile/README.md and its graphics.");
}

await build();
