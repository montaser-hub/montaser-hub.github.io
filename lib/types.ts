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

export interface FlagshipProject {
  name: string;
  role: string;
  summary: string;
  highlights: string[];
  tech: string[];
  links: ProjectLink[];
}

export interface Project {
  name: string;
  description: string;
  tech: string[];
  href: string;
}
