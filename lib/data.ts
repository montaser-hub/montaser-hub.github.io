import type {
  Profile,
  FocusArea,
  TechStack,
  Experience,
  EducationEntry,
  FlagshipProject,
} from "./types";

export const profile: Profile = {
  name: "Montaser Ismail",
  title: "Software Engineer",
  tagline:
    "Full-stack engineer with 2+ years building enterprise-grade web platforms — from metadata-driven React UIs to Node.js/NestJS services handling six-figure record aggregations.",
  location: "Egypt",
  email: "montaserismail20@gmail.com",
  phoneDisplay: "+20 109 288 9329",
  whatsapp: "https://wa.me/201092889329",
  github: "https://github.com/montaser-hub",
  linkedin: "https://www.linkedin.com/in/montaser-ismail/",
};

export const focusAreas: FocusArea[] = [
  {
    title: "Full-stack product engineering",
    description:
      "Designing and shipping complete features across React/Angular frontends and Node.js/NestJS APIs — not just UI, not just backend.",
  },
  {
    title: "Enterprise data & workflows",
    description:
      "Modeling multi-role systems — departments, permissions, scheduling, approvals — with MongoDB aggregations that hold up at 100K+ records.",
  },
  {
    title: "Testing & reliability",
    description:
      "Writing unit and integration tests (Jasmine, Supertest, Karma) and following SOLID principles so features stay correct as the codebase grows.",
  },
];

export const techStack: TechStack = {
  Frontend: [
    "React",
    "Next.js",
    "Angular",
    "TypeScript",
    "Redux Toolkit",
    "Tailwind CSS",
    "SASS",
    "Framer Motion",
  ],
  Backend: [
    "Node.js",
    "NestJS",
    "Express",
    "GraphQL",
    "REST APIs",
    "Redis",
    "Message Queues",
    "JWT Auth",
  ],
  Data: ["MongoDB", "Aggregations & Indexing", "PostgreSQL", "MySQL", "SQL Server", "AWS S3"],
  "Practices & Tooling": [
    "Docker",
    "CI/CD",
    "Nx Monorepos",
    "SOLID Principles",
    "Design Patterns",
    "Jasmine / Supertest",
    "Karma",
  ],
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

export const flagshipProject: FlagshipProject = {
  name: "SmartShift",
  role: "Full-stack engineer",
  summary:
    "An enterprise workforce scheduling platform for organizations that run shift-based operations — built as an Nx monorepo with a Node.js/Express API, a React employee dashboard, and an Angular admin portal, with a second Angular frontend built in collaboration with another engineer.",
  highlights: [
    "REST API (Node.js, Express, MongoDB/Mongoose) modeling departments, sub-departments, positions & levels, locations, schedules, shifts, and shift-swap requests — the real org structure of a shift-based business.",
    "JWT authentication, Joi-validated inputs, and a notifications system (email via Nodemailer) covering approvals and schedule changes.",
    "React employee dashboard (Redux Toolkit, React Router, FullCalendar / react-big-calendar, Recharts) for viewing schedules, requesting shift swaps, and tracking hours.",
    "Angular Admin Portal (Angular Material, CDK) for managing departments, staff, positions, and shift configurations.",
    "AI assistant endpoint (Groq) to help staff query schedules and policies in natural language.",
    "Dockerized services with CI/CD in an Nx monorepo, plus a collaborator-built Angular frontend extending the platform with calendar views, swap-request workflows, and profile management.",
  ],
  tech: [
    "Node.js",
    "Express",
    "MongoDB",
    "React",
    "Angular",
    "TypeScript",
    "Redux Toolkit",
    "Nx",
    "Docker",
    "CI/CD",
    "AWS S3",
    "JWT",
  ],
  links: [
    { label: "API & React dashboard", href: "https://github.com/montaser-hub/Portal" },
    { label: "Angular frontend", href: "https://github.com/hageramadan/SmartShift" },
  ],
};
