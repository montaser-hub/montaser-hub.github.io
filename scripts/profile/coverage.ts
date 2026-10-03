/**
 * Where my projects sit, measured rather than declared: for each of my public
 * repositories, read what is actually in it (package.json dependencies,
 * Dockerfiles, test files, SQL and HTML files) and decide which areas it
 * touches. Private work is added from the stacks recorded in the case studies.
 * Needs the gh CLI.
 */
import { execFileSync } from "node:child_process";

export interface Coverage {
  axes: { label: string; count: number }[];
  total: number;
  repositories: number;
  privateProjects: number;
}

interface RepoFacts {
  dependencies: Set<string>;
  paths: string[];
}

const has = (facts: RepoFacts, ...names: string[]) => names.some((name) => facts.dependencies.has(name));
const anyPath = (facts: RepoFacts, pattern: RegExp) => facts.paths.some((path) => pattern.test(path));
const TEST_FILE = /\.(test|spec)\.[jt]sx?$/;

/** One rule per radar axis: does this repository touch the area? */
const AREAS: Record<string, (facts: RepoFacts) => boolean> = {
  Frontend: (f) =>
    has(f, "react", "next", "@angular/core", "vue", "bootstrap", "tailwindcss", "@mui/material", "pug", "ejs") || anyPath(f, /\.html$/),
  "Backend & APIs": (f) => has(f, "express", "@nestjs/core", "graphql", "express-graphql", "fastify"),
  Databases: (f) =>
    has(f, "mongoose", "mongodb", "pg", "mysql2", "@prisma/client", "prisma", "sequelize", "typeorm") || anyPath(f, /\.sql$/),
  "Real-time & queues": (f) => has(f, "socket.io", "socket.io-client", "ws", "ioredis", "redis", "bullmq"),
  // A test runner alone doesn't count: there have to be test files.
  Testing: (f) => anyPath(f, TEST_FILE) || anyPath(f, /(^|\/)(tests?|spec|__tests__)\/.+\.[jt]sx?$/),
  "Containers & tooling": (f) => anyPath(f, /(^|\/)Dockerfile$|docker-compose[^/]*\.ya?ml$/) || has(f, "nx"),
};

/** The same areas for private projects, from the technology names in their case studies. */
const PRIVATE_AREAS: Record<string, string[]> = {
  Frontend: ["React", "Angular", "Next.js", "Redux Toolkit", "Tailwind CSS", "Vite"],
  "Backend & APIs": ["Node.js", "NestJS", "Express", "GraphQL"],
  Databases: ["MongoDB", "PostgreSQL", "MySQL", "Prisma"],
  "Real-time & queues": ["Socket.io", "Redis", "BullMQ"],
  Testing: ["Jest", "Vitest", "Jasmine"],
  "Containers & tooling": ["Docker", "Nx"],
};

const gh = (path: string) => JSON.parse(execFileSync("gh", ["api", path], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 }));

function repoFacts(login: string, repo: string): RepoFacts {
  const tree: { tree: { path: string; type: string }[] } = gh(`repos/${login}/${repo}/git/trees/HEAD?recursive=1`);
  const paths = tree.tree.filter((entry) => entry.type === "blob" && !entry.path.includes("node_modules/")).map((entry) => entry.path);
  const dependencies = new Set<string>();
  for (const file of paths.filter((path) => /(^|\/)package\.json$/.test(path))) {
    const { content } = gh(`repos/${login}/${repo}/contents/${file.split("/").map(encodeURIComponent).join("/")}`);
    try {
      const manifest = JSON.parse(Buffer.from(content, "base64").toString("utf8"));
      for (const name of Object.keys({ ...manifest.dependencies, ...manifest.devDependencies })) dependencies.add(name);
    } catch {
      // Not valid JSON: ignore this manifest.
    }
  }
  return { dependencies, paths };
}

/**
 * @param login          GitHub user
 * @param skipRepos      repositories to leave out (not my own work, or not a project)
 * @param privateStacks  technology lists of private projects
 */
export function measureCoverage(login: string, skipRepos: Set<string>, privateStacks: string[][]): Coverage | undefined {
  try {
    const repos: { name: string; fork: boolean; archived: boolean }[] = gh(`users/${login}/repos?per_page=100`);
    const own = repos.filter((repo) => !repo.fork && !repo.archived && !skipRepos.has(repo.name));
    const facts = own.map((repo) => repoFacts(login, repo.name));

    const axes = Object.entries(AREAS).map(([label, touches]) => ({
      label,
      count:
        facts.filter(touches).length +
        privateStacks.filter((stack) => stack.some((tech) => PRIVATE_AREAS[label].includes(tech))).length,
    }));
    return { axes, total: own.length + privateStacks.length, repositories: own.length, privateProjects: privateStacks.length };
  } catch {
    console.warn("Skipping the radar: could not read repositories with `gh`.");
    return undefined;
  }
}
