/**
 * The page's sections, in order. The page layout and both navigation menus
 * are generated from this list, so adding, renaming or reordering a section
 * is a one-line change here.
 */
export const sections = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "work", label: "Work" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
] as const;

export type SectionId = (typeof sections)[number]["id"];
