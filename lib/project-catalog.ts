/**
 * Hand-written project data, keyed by GitHub repo name. This file is plain
 * data with no framework imports: the site (lib/projects.ts) and the GitHub
 * profile README generator (scripts/build-profile-readme.ts) both read it.
 */
import type { Project } from "./types";

/**
 * Repos that shouldn't appear in the grid — the flagship project (shown as a
 * dedicated case study elsewhere) and anything not meant as portfolio material.
 */
export const EXCLUDED_REPOS = new Set([
  "Portal",
  // Superseded: each of its sub-projects now has its own repo and card.
  "Web_Design",
  // Instructor-provided apps where only the lab exercises are mine; real
  // testing work is shown on the Tenders, Trigo and CMS cards instead.
  "todo-node-unit-testing",
  "Unit-testing-Angular",
  // Client work: never link its source.
  "RealState",
  // The API half of the Woody store; its README is linked from the front end's card.
  "E-Commerce_NodeJs_Project",
  // Private: its history holds a database password. Its server lives on in graphql-api-server.
  "GraphQL_Full_Stack",
]);

/**
 * Hand-written copy for specific repos, keyed by GitHub repo name. A repo with
 * no entry here still appears (using its GitHub description/language) — this
 * is what makes new projects show up with zero code changes. Add an entry
 * here later to give a new repo a polished description.
 */
/**
 * Repos shown as full cards under "Selected Projects", in this order. Every
 * other repo is listed compactly under "Learning & Labs" — including new ones,
 * until they are added here.
 */
export const SELECTED_REPOS = [
  "Full-Stack-E-commerce-reactjs-nodejs",
  "movie-website",
  "content-management-system",
  "mealhub-ecommerce",
  "natours",
  "graphql-api-server",
  "school-management-db-design",
  "events-blog",
];

export const OVERRIDES: Record<string, Partial<Project>> = {
  "mealhub-ecommerce": {
    name: "MealHub — Vanilla JS Shop",
    note: "Team project · ITI",
    description:
      "Food shop with an admin panel, no framework. I built the catalogue, data layer, cart and order management in a team of four.",
    tech: ["JavaScript", "HTML", "CSS"],
    demo: "https://montaser-hub.github.io/mealhub-ecommerce/customer/home.html",
  },
  "movie-website": {
    name: "Movie App",
    note: "Team project · ITI",
    description:
      "Angular 20 movie app on the TMDB API. I built the account pages, favorites, pagination and English/Arabic switching.",
    tech: ["Angular", "TypeScript", "RxJS", "Bootstrap"],
    demo: "https://montaser-hub.github.io/movie-website/search/",
  },
  "school-management-db-design": {
    name: "School Management — Database Design",
    description:
      "ER model taken through to a tested PostgreSQL schema: 59 tables, 110 foreign keys, constraint tests and sample queries.",
    tech: ["PostgreSQL", "ER Modeling", "Docker"],
  },
  "events-blog": {
    name: "Events Blog",
    description:
      "Community events app with RSVPs, capacity limits and search, rebuilt from a tutorial with CSRF and ownership checks.",
    tech: ["Node.js", "Express", "MongoDB", "EJS", "Passport"],
  },
  natours: {
    name: "Natours — Tour Booking App",
    description:
      "Node.js course capstone, extended: closed an admin-signup hole, fixed rating bugs, added Stripe webhooks and reviews.",
    tech: ["Node.js", "Express", "MongoDB", "Pug", "Stripe"],
  },
  "hosto-landing-page": {
    name: "Hosto — Hosting Landing Page",
    description:
      "Responsive Bootstrap 5 landing page with a pricing toggle, validated domain search, FAQ accordion and a CSS-only mockup.",
    tech: ["Bootstrap", "HTML", "CSS", "JavaScript"],
    demo: "https://montaser-hub.github.io/hosto-landing-page/",
  },
  "product-management-system": {
    name: "Product Management System",
    description:
      "Framework-free inventory dashboard in vanilla JavaScript: CRUD, live pricing validation, search, stats and dark mode.",
    tech: ["JavaScript", "HTML", "CSS"],
    demo: "https://montaser-hub.github.io/product-management-system/",
  },
  "content-management-system": {
    name: "Content Management System",
    note: "In progress · becoming a team project",
    description:
      "Role-based CMS API: admin-approved signup, JWT cookies with rotating refresh tokens. 23 unit and 6 end-to-end tests.",
    tech: ["NestJS", "TypeScript", "PostgreSQL", "Prisma", "Jest"],
  },
  "nextjs-recipe-store": {
    name: "Recipe Store",
    note: "Course lab · ITI",
    description:
      "Next.js App Router lab: nested dynamic routes and server components, statically exported from a Forkify snapshot.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS"],
    demo: "https://montaser-hub.github.io/nextjs-recipe-store/",
  },
  "graphql-api-server": {
    name: "GraphQL API — Users & Companies",
    description:
      "Express + Mongoose GraphQL API. DataLoader removes N+1 queries and resolvers read only the fields asked for. Tested.",
    tech: ["GraphQL", "Node.js", "Express", "MongoDB"],
  },
  "Full-Stack-E-commerce-reactjs-nodejs": {
    name: "Woody — Furniture Store",
    note: "Team project · ITI",
    description:
      "Furniture shop: React front end and Express/MongoDB API. I built auth, the catalogue, the wishlist and the route guards.",
    tech: ["React", "Redux Toolkit", "Node.js", "Express", "MongoDB"],
  },
  "materialui-news-explorer": {
    name: "News Explorer",
    note: "Course project · ITI",
    description:
      "News search with React, Material UI 7 and Redux: debounced NewsAPI search, dark mode and English/Arabic RTL.",
    tech: ["React", "Material UI", "Redux Toolkit", "Vite"],
  },
};
