import type {
  Profile,
  FocusArea,
  TechStack,
  Experience,
  EducationEntry,
  CaseStudy,
  SiteCopy,
  Metric,
} from "./types";

export const profile: Profile = {
  name: "Montaser Ismail",
  title: "Software Engineer",
  tagline:
    "Full-stack engineer building enterprise platforms — metadata-driven React UIs and Node.js/NestJS services that hold up at 100K+ records.",
  location: "Egypt",
  email: "montaserismail20@gmail.com",
  phoneDisplay: "+20 109 288 9329",
  whatsapp: "https://wa.me/201092889329",
  github: "https://github.com/montaser-hub",
  linkedin: "https://www.linkedin.com/in/montaser-ismail/",
  site: "https://montaser-hub.github.io",
  availability: "Open to full-stack roles",
};

export const copy: SiteCopy = {
  hero: {
    eyebrow: "Software Engineer",
    headlineLead: "I build",
    headlinePhrases: [
      "software for how businesses actually run.",
      "metadata-driven React interfaces.",
      "real-time Node.js and NestJS APIs.",
      "systems backed by 1,200+ tests.",
    ],
    primaryCta: "View my work",
    secondaryCta: "Get in touch",
  },
  about: [
    "I build software for how enterprise teams actually operate: metadata-driven UIs, approval workflows, and backend services that hold up under real load.",
    "At Arkaan International I build a rendering engine that turns backend JSON schemas into React screens and forms. Before that, at Qyser Tech, I wrote Node.js services and MongoDB aggregations behind reporting and HR approvals.",
  ],
  contact: {
    eyebrow: "Contact",
    title: "Let's build something",
    body: "Open to full-stack roles and freelance projects. I usually reply within a day.",
    cta: "Say hello",
  },
  footer: "Designed & built by Montaser Ismail",
  metaDescription:
    "Full-stack software engineer building enterprise web platforms: scheduling systems, procurement tools and real-time APIs with React, Angular, Node.js and NestJS.",
};

/**
 * Headline numbers, each traceable to the case studies below:
 * tests = 566 (Tenders) + 639 (Trigo); endpoints = 136 (Trigo) + 168 (Qyser).
 */
export const metrics: Metric[] = [
  { value: 1205, label: "automated tests written" },
  { value: 304, label: "API endpoints shipped" },
  { value: 4, label: "platforms built with teams" },
  { value: 2, suffix: "+", label: "years in production code" },
];

export const focusAreas: FocusArea[] = [
  {
    title: "Full-stack delivery",
    description: "Complete features across React/Angular frontends and Node.js/NestJS APIs.",
  },
  {
    title: "Enterprise workflows",
    description: "Roles, permissions, scheduling and approvals, on MongoDB aggregations that scale.",
  },
  {
    title: "Tested by default",
    description: "Tests ship with the feature (Jest, Vitest, Jasmine, Supertest), so it stays correct.",
  },
];

export const techStack: TechStack = {
  Frontend: ["React", "Next.js", "Angular", "TypeScript", "Redux Toolkit", "Tailwind CSS", "Framer Motion"],
  Backend: ["Node.js", "NestJS", "Express", "GraphQL", "Socket.io", "Redis", "BullMQ", "JWT Auth"],
  Data: ["MongoDB", "PostgreSQL", "Prisma", "MySQL", "SQL Server", "AWS S3"],
  "Testing & DevOps": ["Jest", "Vitest", "Jasmine", "Docker", "Nx Monorepos", "CI/CD"],
};

export const experience: Experience[] = [
  {
    company: "Arkaan International Group Co.",
    role: "Frontend Developer",
    start: "Dec 2025",
    end: "Present",
    highlights: [
      "Engineered dynamic UI components rendered entirely from JSON metadata schemas, reducing manual frontend coding effort by ~40%.",
      "Developed configurable form builders that auto-generate layouts from backend data models, cutting form development time by ~70% across 5+ form types.",
      "Built a high-performance rendering engine mapping server-side metadata to reusable React components, supporting 10+ reusable component types application-wide.",
    ],
  },
  {
    company: "Qyser Tech.",
    role: "Backend Developer",
    start: "Sep 2024",
    end: "Mar 2026",
    highlights: [
      "Architected modular backend services with Node.js and REST APIs, serving 500+ concurrent API requests.",
      "Built dynamic report generation features with complex queries and aggregations, processing across 100K+ records.",
      "Delivered the \"Performance\" feature using MongoDB aggregations to generate employee insights and support admin approvals, cutting manual HR reporting time by ~60%.",
    ],
  },
];

export const education: EducationEntry[] = [
  {
    institution: "Information Technology Institute (ITI)",
    program: "Full Stack Intensive Code Camp — MEARN Stack",
    period: "Jul 2025 – Dec 2025",
  },
  {
    institution: "6 October High Institute for Engineering & Technology",
    program: "B.Sc. Communication & Electronics Engineering",
    period: "2014 – 2019",
    detail: "RF energy-harvesting rectenna design (Agilent ADS, CST); organized IEEE student workshops.",
  },
];

/**
 * Featured work, in order. Facts here are checked against the code: test
 * counts were re-run, commit shares come from git history, and the stack from
 * each project's dependencies. Keep it that way when editing.
 */
export const caseStudies: CaseStudy[] = [
  {
    name: "SmartShift",
    context: "Team project · 2025",
    role: "Full-stack engineer · API lead",
    summary:
      "A shift-scheduling platform for hospitals: staff see their schedule, swap shifts through a two-step approval and get live notifications. A Node.js API and a React staff dashboard in one Nx monorepo, with an Angular admin portal.",
    highlights: [
      "I wrote most of the REST API (Express, MongoDB): auth and users, swap requests with peer-then-manager approval, shift time handling including overnight shifts, and the shared filtering and pagination layer.",
      "JWT sessions in httpOnly cookies, role-based access, Joi-validated input, and notifications pushed live over Server-Sent Events.",
      "An AI assistant endpoint (Groq) that answers questions about schedules in plain language.",
      "Contributed to the React dashboard (Redux Toolkit, calendar views) built mainly by a teammate; the Angular admin portal is a teammate's.",
    ],
    stats: [
      { value: "76 / 102", label: "API commits are mine" },
      { value: "3 apps", label: "API, React, Angular" },
    ],
    tech: ["Node.js", "Express", "MongoDB", "React", "Redux Toolkit", "Angular", "Nx", "Docker"],
    links: [
      { label: "API & React dashboard", href: "https://github.com/montaser-hub/Portal" },
      { label: "Angular admin portal", href: "https://github.com/hageramadan/SmartShift" },
    ],
    image: "/projects/smartshift.webp",
  },
  {
    name: "Tenders — Procurement Platform",
    context: "Arkaan International · client project",
    role: "Lead front-end developer · UI designer",
    summary:
      "A tendering and procurement system. I designed the interface in Figma, then led the React front end, built so that screens are generated from server-side metadata instead of being hand-coded one by one.",
    highlights: [
      "Metadata-driven grids and forms: columns, fields, validation and layout come from backend schemas.",
      "A workflow designer for configuring approval steps in tender processes.",
      "A mock-server mode so front-end work and demos run without the backend.",
      "Tested as it was built: 566 Vitest tests across 49 files.",
    ],
    stats: [
      { value: "566", label: "tests passing" },
      { value: "49", label: "test files" },
    ],
    tech: ["React", "Redux Toolkit", "Tailwind CSS", "Vite", "Vitest"],
    note: "Source private",
    image: "/projects/tenders.webp",
  },
  {
    name: "Trigo — Ride-Hailing Backend",
    context: "Delivery Quote Ltd · team project",
    role: "Backend developer",
    summary:
      "The real-time API behind a ride-hailing app: matching riders with drivers, shared rides, live driver locations, and in-app chat and calls.",
    highlights: [
      "NestJS modules over PostgreSQL with Prisma, with rate limiting and Swagger docs.",
      "Live locations, chat and call signaling over Socket.io, scaled across instances with a Redis adapter.",
      "Driver matching and shared-ride logic covered by unit tests: 639 passing across 49 suites.",
    ],
    stats: [
      { value: "639", label: "unit tests" },
      { value: "136", label: "documented endpoints" },
      { value: "17 / 24", label: "commits are mine" },
    ],
    tech: ["NestJS", "TypeScript", "PostgreSQL", "Prisma", "Redis", "Socket.io", "Jest"],
    note: "Source private",
    image: "/projects/trigo.webp",
    imageCaption: "The API's Swagger documentation: 21 areas, 136 endpoints.",
  },
  {
    name: "Qyser — Residency Scheduling API",
    context: "Qyser Tech · employer, Sep 2024 – Mar 2026",
    role: "Backend developer",
    summary:
      "The backend of a scheduling platform for hospital residency programs: rotations, on-call and clinic shifts, swaps and leave with approvals, performance tracking and reporting, built by a team of five.",
    highlights: [
      "Scheduling with configurable rules per position and level, and shift-swap and leave requests that go through approval flows.",
      "Performance feature built on MongoDB aggregations, giving admins insight per resident and cutting manual HR reporting.",
      "Role and permission system, audit log, Excel exports, background jobs on BullMQ and Redis, live updates over Server-Sent Events and push notifications.",
    ],
    stats: [
      { value: "~470 / 754", label: "commits are mine" },
      { value: "168", label: "API endpoints" },
      { value: "18 months", label: "on the product" },
    ],
    tech: ["Node.js", "Express", "MongoDB", "Redis", "BullMQ", "Docker", "Jasmine"],
    note: "Source private",
    image: "/projects/qyser.webp",
    imageCaption: "The web app my API serves (UI by the front-end team), running on demo data.",
  },
];
