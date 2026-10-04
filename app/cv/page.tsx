import type { Metadata } from "next";
import Link from "next/link";
import { caseStudies, contacts, cv, education, experience, profile, techStack } from "@/lib/data";
import "./cv.css";

export const metadata: Metadata = {
  title: `${cv.fullName} — CV`,
  description: cv.summary,
};

const bare = (url: string) => url.replace(/^(https?:\/\/(www\.)?|mailto:)/, "").replace(/\/$/, "");

/** First sentence of a paragraph, for the one-line project descriptions. */
const firstSentence = (text: string) => text.split(/(?<=[.:])\s/)[0].replace(/:$/, ".");

/**
 * The CV as a page: one column of real text under standard headings, so it
 * prints to a single A4 sheet and applicant-tracking systems can read it.
 * `npm run cv` prints this page to the PDF that the site links to.
 */
export default function CvPage() {
  const links = [
    ...(profile.site ? [{ label: bare(profile.site), href: profile.site }] : []),
    ...contacts.map(({ href, kind, detail }) => ({ label: kind === "email" || kind === "whatsapp" ? detail : bare(href), href })),
  ];
  const skills = { ...techStack, ...cv.extraSkills };

  return (
    <main className="cv">
      <p className="cv-actions">
        <Link href="/">← {profile.name}</Link>
        <a href={cv.file} download>
          {cv.labels.download}
        </a>
      </p>

      <article className="cv-sheet">
        <header>
          <h1>{cv.fullName}</h1>
          <p className="cv-title">
            {profile.title} · {profile.location}
          </p>
          <ul className="cv-links">
            {links.map(({ label, href }) => (
              <li key={href}>
                <a href={href}>{label}</a>
              </li>
            ))}
          </ul>
        </header>

        <section>
          <h2>{cv.labels.profile}</h2>
          <p>{cv.summary}</p>
        </section>

        <section>
          <h2>{cv.labels.skills}</h2>
          <dl className="cv-skills">
            {Object.entries(skills).map(([group, items]) => (
              <div key={group}>
                <dt>{group}</dt>
                <dd>{items.join(", ")}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section>
          <h2>{cv.labels.experience}</h2>
          {experience.map((job) => (
            <div key={job.company} className="cv-entry">
              <h3>
                {job.role} <span>· {job.company}</span>
              </h3>
              <p className="cv-when">
                {job.start} – {job.end}
              </p>
              <ul>
                {job.highlights.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section>
          <h2>{cv.labels.projects}</h2>
          {caseStudies.map((study) => (
            <div key={study.name} className="cv-entry">
              <h3>
                {study.name} <span>· {study.role}</span>
              </h3>
              <p className="cv-when">{study.context}</p>
              <p>
                {firstSentence(study.summary)}
                {study.stats && ` ${study.stats.map((stat) => `${stat.value} ${stat.label}`).join("; ")}.`}
              </p>
              <p className="cv-tech">{study.tech.join(" · ")}</p>
            </div>
          ))}
        </section>

        <section>
          <h2>{cv.labels.education}</h2>
          {education.map((entry) => (
            <div key={entry.institution} className="cv-entry">
              <h3>{entry.program}</h3>
              <p className="cv-when">{entry.period}</p>
              <p>
                {entry.institution}
                {entry.detail && `. ${entry.detail}`}
              </p>
            </div>
          ))}
        </section>
      </article>
    </main>
  );
}
