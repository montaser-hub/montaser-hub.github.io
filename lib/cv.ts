/**
 * The CV's content as plain text, assembled from the site's data. The /cv
 * page (and so the PDF) and the Word file are both rendered from this, so
 * they always say the same thing.
 *
 * It is written for applicant-tracking systems as much as for people: one
 * column, standard headings, "Mon YYYY - Mon YYYY" dates, and no symbols a
 * parser might trip on (see `plain`).
 */
import { caseStudies, contacts, cv, education, experience, profile, techStack } from "./data.ts";

export interface CvLink {
  text: string;
  href: string;
}

export interface CvEntry {
  /** Title and meta on one line, for short entries such as degrees. */
  compact?: boolean;
  title: string;
  /** Where and when, on the line under the title. */
  meta: string;
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

const bare = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

/** First sentence of a paragraph, for the one-line project descriptions. */
const firstSentence = (text: string) => text.split(/(?<=[.:])\s/)[0].replace(/:$/, ".");

// The detail line stays on the site: the CV keeps to one page.
const toEntry = (entry: (typeof education)[number]): CvEntry => ({
  compact: true,
  title: plain(entry.program),
  meta: `${entry.institution} | ${plain(entry.period)}`,
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
      meta: `${job.company} | ${job.start} - ${job.end}`,
      bullets: job.highlights,
    })),
    projects: cv.projects.flatMap((name) => {
      const study = caseStudies.find((candidate) => candidate.name === name);
      if (!study) throw new Error(`cv.projects names "${name}", which is not a case study in lib/data.ts`);
      const figures = study.stats?.map((stat) => `${stat.value} ${stat.label}`).join("; ");
      return [
        {
          title: `${plain(study.name)}: ${firstSentence(study.summary).replace(/^A /, "a ").replace(/^The /, "the ")}`,
          meta: [plain(study.role), plain(study.context), study.period && plain(study.period)].filter(Boolean).join(" | "),
          bullets: [
            ...study.highlights.slice(0, cv.projectBullets),
            ...(figures ? [`${figures.charAt(0).toUpperCase()}${figures.slice(1)}.`] : []),
          ],
          text: `Technologies: ${study.tech.join(", ")}.`,
        },
      ];
    }),
    education: education.filter((entry) => entry.kind !== "certificate").map(toEntry),
    certifications: education.filter((entry) => entry.kind === "certificate").map(toEntry),
  };
}
