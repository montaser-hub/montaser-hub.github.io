/**
 * The page's sections, in order. The page layout, both navigation menus and
 * the section headings are generated from this list, so renaming or
 * reordering a section is a one-line change here. `label` is the short name
 * in the menus; `title` is the heading on the page.
 */
export const sections = [
  { id: "about", label: "About", title: "About" },
  { id: "experience", label: "Experience", title: "Experience" },
  { id: "work", label: "Work", title: "Featured Work" },
  { id: "projects", label: "Projects", title: "Selected Projects" },
  { id: "contact", label: "Contact", title: "Contact" },
] as const;

export type SectionId = (typeof sections)[number]["id"];
