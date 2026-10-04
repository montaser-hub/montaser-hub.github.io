import type { Metadata } from "next";
import Link from "next/link";
import { buildCv, type CvEntry } from "@/lib/cv";
import { cv, profile } from "@/lib/data";
import "./cv.css";

export const metadata: Metadata = {
  title: `${cv.fullName} - ${cv.headline} - CV`,
  description: cv.summary,
};

function Entries({ entries }: { entries: CvEntry[] }) {
  return entries.map((entry) => (
    <div key={entry.title + entry.meta} className="cv-entry">
      <h3>{entry.title}</h3>
      <p className="cv-meta">{entry.meta}</p>
      {entry.text && <p>{entry.text}</p>}
      {entry.bullets && (
        <ul>
          {entry.bullets.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      )}
    </div>
  ));
}

/**
 * The CV as a page, rendered from lib/cv.ts. Everything is ordinary text in
 * one column and in reading order, so it prints to a single A4 sheet and
 * applicant-tracking systems read it as written. `npm run cv` prints this
 * page to the PDF the site links to.
 */
export default function CvPage() {
  const doc = buildCv();

  return (
    <main className="cv">
      <p className="cv-actions">
        <Link href="/">← {profile.name}</Link>
        <span>
          <a href={cv.file} download>
            {cv.labels.download}
          </a>
          <a href={cv.wordFile} download>
            {cv.labels.downloadWord}
          </a>
        </span>
      </p>

      <article className="cv-sheet">
        <header>
          <h1>{doc.name}</h1>
          <p className="cv-headline">{doc.headline}</p>
          {doc.contactLines.map((line) => (
            <p key={line[0].text} className="cv-contact">
              {line.map(({ text, href }, i) => (
                <span key={text}>
                  {i > 0 && " | "}
                  {href ? <a href={href}>{text}</a> : text}
                </span>
              ))}
            </p>
          ))}
        </header>

        <section>
          <h2>{cv.labels.profile}</h2>
          <p>{doc.summary}</p>
        </section>

        <section>
          <h2>{cv.labels.skills}</h2>
          {doc.skills.map(({ group, items }) => (
            <p key={group}>
              <strong>{group}:</strong> {items}
            </p>
          ))}
        </section>

        <section>
          <h2>{cv.labels.experience}</h2>
          <Entries entries={doc.experience} />
        </section>

        <section>
          <h2>{cv.labels.projects}</h2>
          <Entries entries={doc.projects} />
        </section>

        <section>
          <h2>{cv.labels.education}</h2>
          <Entries entries={doc.education} />
        </section>
      </article>
    </main>
  );
}
