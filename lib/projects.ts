import type { Project } from "./types";
import { profile } from "./data";

const GITHUB_USER = profile.github.split("/").pop()!;

/**
 * Repos that shouldn't appear in the grid — the flagship project (shown as a
 * dedicated case study elsewhere) and anything not meant as portfolio material.
 */
const EXCLUDED_REPOS = new Set(["Portal", "Ismail_Coursera"]);

/**
 * Hand-written copy for specific repos, keyed by GitHub repo name. A repo with
 * no entry here still appears (using its GitHub description/language) — this
 * is what makes new projects show up with zero code changes. Add an entry
 * here later to give a new repo a polished description.
 */
const OVERRIDES: Record<string, Partial<Project>> = {
  "content-management-system": {
    description:
      "A TypeScript-based CMS for structuring and publishing content, built with an emphasis on clean data modeling and type safety.",
    tech: ["TypeScript"],
  },
  "nextjs-recipe-store": {
    name: "Next.js Recipe Store",
    description:
      "A modern e-commerce demo built with Next.js 15, TypeScript, and Tailwind CSS — dynamic routes, API data fetching, and modular UI components.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS"],
  },
  GraphQL_Full_Stack: {
    name: "GraphQL Full Stack (Users & Companies)",
    description:
      "A full CRUD system managing Users and Companies — React + Apollo Client on the frontend, Node.js/Express/GraphQL/MongoDB on the backend.",
    tech: ["React", "Apollo", "GraphQL", "Node.js", "MongoDB"],
  },
  "graphql-api-server": {
    name: "GraphQL API Server",
    description:
      "A standalone GraphQL API for managing Users and Companies, structured cleanly around Express and Mongoose.",
    tech: ["GraphQL", "Express", "Mongoose"],
  },
  "Full-Stack-E-commerce-reactjs-nodejs": {
    name: "Full-Stack E-Commerce",
    description:
      "An end-to-end e-commerce application with a React frontend and a Node.js backend handling products, carts, and orders.",
    tech: ["React", "Node.js"],
  },
  "E-Commerce_NodeJs_Project": {
    name: "E-Commerce API (Node.js)",
    description: "A Node.js-driven e-commerce backend covering catalog and order management.",
    tech: ["Node.js"],
  },
  "materialui-news-explorer": {
    name: "News Explorer",
    description: "A news browsing app built with Material UI, focused on clean, responsive component design.",
    tech: ["React", "Material UI"],
  },
  "Unit-testing-Angular": {
    name: "Angular Unit Testing — Heroes App",
    description:
      "Component and service test suites for an Angular Heroes app, using HttpClientTestingModule and mocked services to demonstrate testing discipline.",
    tech: ["Angular", "Karma", "Jasmine"],
  },
  "todo-node-unit-testing": {
    name: "Todo API with Full Test Coverage",
    description:
      "A Todo REST API (Node.js, Express, MongoDB, JWT auth) fully covered by unit and integration tests using Jasmine and Supertest.",
    tech: ["Node.js", "Express", "MongoDB", "Jasmine", "Supertest"],
  },
  RealState: {
    name: "Real Estate Listings",
    description: "A property listings web app for browsing and managing real estate data.",
    tech: ["JavaScript"],
  },
  Web_Design: {
    name: "Web Design Showcase",
    description:
      "A collection of front-end builds — including Natours (advanced responsive CSS/Sass), an events blog, a hospitality landing page, and a product management UI — demonstrating range in layout, animation, and responsive design fundamentals.",
    tech: ["HTML", "CSS/Sass", "JavaScript"],
  },
};

interface GitHubRepo {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  fork: boolean;
  archived: boolean;
  pushed_at: string;
}

function humanize(name: string): string {
  return name
    .replace(/[-_]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Curated fallback used only if the GitHub API is unreachable at build time. */
const FALLBACK_PROJECTS: Project[] = Object.entries(OVERRIDES)
  .filter(([name]) => !EXCLUDED_REPOS.has(name))
  .map(([name, override]) => ({
    name: override.name ?? humanize(name),
    description: override.description ?? "",
    tech: override.tech ?? [],
    href: `${profile.github}/${name}`,
  }));

export async function getProjects(): Promise<Project[]> {
  try {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=pushed`,
      {
        headers: { Accept: "application/vnd.github+json" },
        next: { revalidate: 3600 },
      }
    );

    if (!res.ok) throw new Error(`GitHub API responded ${res.status}`);
    const repos: GitHubRepo[] = await res.json();

    return repos
      .filter((repo) => !repo.fork && !repo.archived && !EXCLUDED_REPOS.has(repo.name))
      .map((repo) => {
        const override = OVERRIDES[repo.name] ?? {};
        return {
          name: override.name ?? humanize(repo.name),
          description:
            override.description ??
            repo.description ??
            (repo.language ? `A ${repo.language} project.` : "A project by " + profile.name + "."),
          tech: override.tech ?? (repo.language ? [repo.language] : []),
          href: repo.html_url,
        };
      });
  } catch {
    return FALLBACK_PROJECTS;
  }
}
