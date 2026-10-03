export interface Profile {
  name: string;
  title: string;
  tagline: string;
  location: string;
  email: string;
  phoneDisplay: string;
  whatsapp: string;
  github: string;
  linkedin: string;
  /** Public URL of this portfolio, once it is deployed. */
  site?: string;
}

/** Page copy that isn't a list of records: hero, about and contact text. */
export interface SiteCopy {
  hero: {
    eyebrow: string;
    /** Fixed start of the headline, followed by the typed phrases in turn. */
    headlineLead: string;
    headlinePhrases: string[];
    primaryCta: string;
    secondaryCta: string;
  };
  about: string[];
  contact: { eyebrow: string; title: string; body: string; cta: string };
  footer: string;
  metaDescription: string;
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
