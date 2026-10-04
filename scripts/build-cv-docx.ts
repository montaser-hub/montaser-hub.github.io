/**
 * Writes the Word version of the CV from the same content as the /cv page
 * (lib/cv.ts). Some applicant-tracking systems read .docx more reliably than
 * PDF, so applications that accept Word should get this file.
 *
 * Plain paragraphs only: no tables, text boxes, columns, headers or footers.
 * Sizes match app/cv/cv.css. Run through `npm run cv`.
 */
import { writeFileSync } from "node:fs";
import path from "node:path";
import { AlignmentType, BorderStyle, Document, ExternalHyperlink, Packer, Paragraph, TextRun, convertMillimetersToTwip } from "docx";
import { buildCv, type CvEntry, type CvLink } from "../lib/cv.ts";
import { cv } from "../lib/data.ts";

const FONT = "Arial";
const INK = "111318";
const SOFT = "3F4552";
const LINK = "0B4FB3";
/** Word measures type in half-points and spacing in twentieths of a point. */
const pt = (points: number) => points * 2;
const space = (points: number) => points * 20;

const text = (value: string, options: { size?: number; bold?: boolean; color?: string } = {}) =>
  new TextRun({ text: value, font: FONT, size: pt(options.size ?? 10.5), bold: options.bold, color: options.color ?? INK });

const linked = ({ text: label, href }: CvLink, size: number) =>
  href ? new ExternalHyperlink({ link: href, children: [text(label, { size, color: LINK })] }) : text(label, { size });

const heading = (label: string) =>
  new Paragraph({
    spacing: { before: space(9), after: space(4) },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "9AA1AD", space: 1 } },
    children: [text(label.toUpperCase(), { size: 12, bold: true })],
  });

function entry({ title, meta, text: body, bullets }: CvEntry, first: boolean): Paragraph[] {
  return [
    new Paragraph({ keepNext: true, spacing: { before: first ? 0 : space(5) }, children: [text(title, { size: 11, bold: true })] }),
    new Paragraph({ keepNext: true, children: [text(meta, { color: SOFT })] }),
    ...(body ? [new Paragraph({ children: [text(body)] })] : []),
    ...(bullets ?? []).map((point) => new Paragraph({ bullet: { level: 0 }, children: [text(point)] })),
  ];
}

const entries = (list: CvEntry[]) => list.flatMap((item, i) => entry(item, i === 0));

const doc = buildCv();
const margin = convertMillimetersToTwip(15);

const file = new Document({
  title: `${doc.name} - ${doc.headline} - CV`,
  creator: doc.name,
  description: doc.summary,
  sections: [
    {
      properties: { page: { size: { width: convertMillimetersToTwip(210), height: convertMillimetersToTwip(297) }, margin: { top: convertMillimetersToTwip(11), bottom: convertMillimetersToTwip(11), left: margin, right: margin } } },
      children: [
        new Paragraph({ alignment: AlignmentType.CENTER, children: [text(doc.name, { size: 20, bold: true })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: space(2), after: space(3) }, children: [text(doc.headline, { size: 12, bold: true, color: SOFT })] }),
        ...doc.contactLines.map(
          (line) =>
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: line.flatMap((item, i) => [...(i > 0 ? [text(" | ", { size: 10 })] : []), linked(item, 10)]),
            })
        ),
        heading(cv.labels.profile),
        new Paragraph({ children: [text(doc.summary)] }),
        heading(cv.labels.skills),
        ...doc.skills.map(({ group, items }) => new Paragraph({ children: [text(`${group}: `, { bold: true }), text(items)] })),
        heading(cv.labels.experience),
        ...entries(doc.experience),
        heading(cv.labels.projects),
        ...entries(doc.projects),
        heading(cv.labels.education),
        ...entries(doc.education),
      ],
    },
  ],
});

const target = path.join(import.meta.dirname, "..", "public", cv.wordFile);
writeFileSync(target, await Packer.toBuffer(file));
console.log(`Wrote public${cv.wordFile}`);
