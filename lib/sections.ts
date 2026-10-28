import { HiBriefcase, HiEnvelope, HiSparkles, HiSquares2X2, HiUser } from "react-icons/hi2";

/**
 * The page's sections, in order. The page layout, both navigation menus and
 * the section headings are generated from this list, so renaming or
 * reordering a section is a one-line change here. `label` is the short name
 * in the menus; `title` is the heading on the page; `icon` is the section's
 * button in the mobile tab bar (Heroicons, solid).
 */
export const sections = [
  { id: "about", label: "About", title: "About", icon: HiUser },
  { id: "experience", label: "Experience", title: "Experience", icon: HiBriefcase },
  { id: "work", label: "Work", title: "Featured Work", icon: HiSparkles },
  { id: "projects", label: "Projects", title: "Selected Projects", icon: HiSquares2X2 },
  { id: "contact", label: "Contact", title: "Contact", icon: HiEnvelope },
] as const;

export type SectionId = (typeof sections)[number]["id"];
