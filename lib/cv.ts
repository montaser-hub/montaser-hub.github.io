/**
 * The CV's content as plain text, assembled from the site's data. The /cv
 * page (and so the PDF) and the Word file are both rendered from this, so
 * they always say the same thing.
 *
 * It is written for applicant-tracking systems as much as for people: one
 * column, standard headings, "Mon YYYY - Mon YYYY" dates, and no symbols a
 * parser might trip on (see `plain`). Everything is plain text in reading
 * order: no tab stops or right-aligned columns, dates on a line of their
 * own, and bullets are a typed "•".
 */
import { caseStudies, contacts, cv, education, experience, profile, techStack } from "./data.ts";

export interface CvLink {
  text: string;
  href: string;
}

export interface CvEntry {
  title: string;
  /** What it is, shown after the title in regular weight. */
  subtitle?: string;
  /** Where: the company, school or role and context, on the line under the title. */
  place: string;
  /** When, on its own line under `place`: parsers that split a shared line misread both. */
  dates?: string;
  /** Where to check the work: the live app if there is one, otherwise public code. */
  link?: CvLink & { kind: "Live" | "Code" };
  /** A line under the bullets. */
  text?: string;
  bullets?: string[];
}

export interface CvDocument {
  name: string;
  headline: string;
  /** Contact details, one array per line. */
  contactLines: CvLink[][];
  summary: string;
  skills: { group: string; items: string }[];
  experience: CvEntry[];
  projects: CvEntry[];
  education: CvEntry[];
  certifications: CvEntry[];
}

/** Separators a parser reads reliably: commas and hyphens instead of middle dots and long dashes. */
const plain = (text: string) => text.replace(/\s·\s/g, ", ").replace(/\s[—–]\s/g, " - ");

const capitalise = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

const bare = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

/** A live app beats public code as proof; private work has neither. */
function proofLink(links: { label: string; href: string }[] | undefined): CvEntry["link"] {
  const live = links?.find(({ label }) => /^live/i.test(label));
  const code = links?.find(({ href }) => href.startsWith("https://github.com/"));
  const pick = live ?? code;
  return pick && { kind: live ? "Live" : "Code", text: bare(pick.href), href: pick.href };
}

/** First sentence of a paragraph, for the one-line project descriptions. */
const firstSentence = (text: string) => text.split(/(?<=[.:])\s/)[0].replace(/:$/, ".");

// The detail line stays on the site: the CV keeps to one page.
// School and years share a line, the usual form for education; jobs and
// projects keep their dates on a line of their own.
const toEntry = (entry: (typeof education)[number]): CvEntry => ({
  title: plain(entry.program),
  place: `${entry.institution} | ${plain(entry.period)}`,
});

export function buildCv(): CvDocument {
  const link = (kind: (typeof contacts)[number]["kind"]) => contacts.find((contact) => contact.kind === kind);
  const web = [link("linkedin"), link("github")].flatMap((contact) => (contact ? [{ text: bare(contact.href), href: contact.href }] : []));

  return {
    name: cv.fullName,
    headline: cv.headline,
    contactLines: [
      [
        { text: cv.location, href: "" },
        { text: profile.phoneDisplay, href: `tel:${profile.phoneDisplay.replace(/\s/g, "")}` },
        { text: profile.email, href: `mailto:${profile.email}` },
      ],
      [...web, ...(profile.site ? [{ text: bare(profile.site), href: profile.site }] : [])],
    ],
    summary: cv.summary,
    skills: Object.entries({ ...techStack, ...cv.extraSkills }).map(([group, items]) => ({ group, items: items.join(", ") })),
    experience: experience.map((job) => ({
      title: job.role,
      place: job.type ? `${job.company} | ${job.type}` : job.company,
      dates: `${job.start} - ${job.end}`,
      bullets: job.highlights,
    })),
    projects: cv.projects.flatMap((name) => {
      const study = caseStudies.find((candidate) => candidate.name === name);
      if (!study) throw new Error(`cv.projects names "${name}", which is not a case study in lib/data.ts`);
      const figures = study.stats?.map((stat) => `${stat.value} ${stat.label}`).join("; ");
      return [
        {
          title: plain(study.name),
          subtitle: capitalise(firstSentence(study.summary).replace(/^(A|An|The) /, "").replace(/\.$/, "")),
          // The role, then its context in brackets: one idea per line, dates apart.
          place: `${plain(study.role)} (${plain(study.context)})`,
          dates: study.period && plain(study.period),
          link: proofLink(study.links),
          bullets: [
            ...study.highlights.slice(0, cv.projectBullets),
            ...(figures ? [`${capitalise(figures)}.`] : []),
          ],
          text: `Technologies: ${study.tech.join(", ")}.`,
        },
      ];
    }),
    education: education.filter((entry) => entry.kind !== "certificate").map(toEntry),
    certifications: education.filter((entry) => entry.kind === "certificate").map(toEntry),
  };
}
