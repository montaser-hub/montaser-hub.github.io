export interface Profile {
  name: string;
  title: string;
  tagline: string;
  location: string;
  /** IANA time zone I work in, used for the commit-hours chart on my GitHub profile. */
  timeZone: string;
  email: string;
  phoneDisplay: string;
  whatsapp: string;
  github: string;
  linkedin: string;
  /** Public URL of this portfolio, once it is deployed. */
  site?: string;
  /** One line on what I'm open to, shown on my GitHub profile. */
  availability: string;
}

/** A way to reach me. `kind` picks the icon; the site and the GitHub profile both list these. */
export interface ContactLink {
  kind: "github" | "linkedin" | "whatsapp" | "email";
  label: string;
  href: string;
  /** Short readable form of the address, shown under the label on the GitHub profile. */
  detail: string;
}

/** A real place on the hero globe: a pin with a label, or (in `regions`) a name written on the map. */
export interface Place {
  /** Short lower-case id, unique across places and regions (letters, digits and dashes). */
  id: string;
  label: string;
  /** [latitude, longitude] in degrees. */
  location: [number, number];
}

/** Page copy that isn't a list of records: hero, about and contact text. */
export interface SiteCopy {
  hero: {
    /** Fixed start of the headline, followed by the typed phrases in turn. */
    headlineLead: string;
    headlinePhrases: string[];
    primaryCta: string;
    secondaryCta: string;
  };
  about: string[];
  contact: { eyebrow: string; title: string; body: string; cta: string; copyEmail: string; copied: string };
  footer: string;
  /** Short fixed labels used around the page. */
  labels: { techStack: string; education: string; labs: string; liveDemo: string; viewSource: string; builtWith: string };
  metaDescription: string;
}

/** What the CV adds to the site's data: everything else on it is read from the same lists as the site. */
export interface Cv {
  /** Full legal name, as it should appear on applications. */
  fullName: string;
  summary: string;
  /** Skills not in the site's tech stack, as extra "Group: items" lines. */
  extraSkills: Record<string, string[]>;
  /** Published PDF, relative to the site root. Written by `npm run cv`. */
  file: string;
  labels: { download: string; view: string; profile: string; skills: string; experience: string; projects: string; education: string };
}

/** A headline number for the About section; `value` counts up when it scrolls into view. */
export interface Metric {
  value: number;
  suffix?: string;
  label: string;
}

export interface FocusArea {
  title: string;
  description: string;
}

export type TechStack = Record<string, string[]>;

export interface Experience {
  company: string;
  role: string;
  start: string;
  end: string;
  highlights: string[];
}

export interface EducationEntry {
  institution: string;
  program: string;
  period: string;
  detail?: string;
}

export interface ProjectLink {
  label: string;
  href: string;
}

export interface CaseStudyStat {
  value: string;
  label: string;
}

/** A featured project told as a short case study: context, my part, numbers. */
export interface CaseStudy {
  name: string;
  /** Who it was for, e.g. "Arkaan International · client project". */
  context: string;
  role: string;
  summary: string;
  highlights: string[];
  stats?: CaseStudyStat[];
  tech: string[];
  links?: ProjectLink[];
  /** Shown instead of links when the source can't be shared. */
  note?: string;
  image?: string;
  /** Says what the screenshot shows when it isn't obviously my own work. */
  imageCaption?: string;
}

export interface Project {
  name: string;
  description: string;
  tech: string[];
  /** Source repository. Omit for work whose code can't be shared (e.g. client projects). */
  href?: string;
  /** Short context line shown on the card, e.g. "Client project · source private". */
  note?: string;
  /** Live deployment (e.g. GitHub Pages). Optional — shown as a "Live demo" link when set. */
  demo?: string;
  /** Screenshot shown on the back of the card when hovered. Optional — cards without one stay static. */
  image?: string;
  /**
   * "selected" projects get a full card; everything else (including any new
   * repo until it is curated) is listed compactly under Learning & Labs.
   */
  tier?: "selected" | "lab";
}
