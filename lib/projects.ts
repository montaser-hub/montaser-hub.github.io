import { existsSync } from "node:fs";
import path from "node:path";
import type { Project } from "./types";
import { profile } from "./data";
import { EXCLUDED_REPOS, OVERRIDES, SELECTED_REPOS } from "./project-catalog";

const GITHUB_USER = profile.github.split("/").pop()!;

const PROJECT_IMAGES_DIR = path.join(process.cwd(), "public", "projects");
const IMAGE_EXTENSIONS = ["webp", "png", "jpg", "jpeg"];

/**
 * Looks up `public/projects/<repo-name>.<ext>` for a given repo. Dropping a
 * screenshot in with the exact repo slug as the filename is enough to make
 * it appear on hover — no code changes needed.
 */
function findProjectImage(repoName: string): string | undefined {
  const slug = repoName.toLowerCase();
  for (const ext of IMAGE_EXTENSIONS) {
    const file = `${slug}.${ext}`;
    if (existsSync(path.join(PROJECT_IMAGES_DIR, file))) {
      return `/projects/${file}`;
    }
  }
  return undefined;
}

interface GitHubRepo {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  fork: boolean;
  archived: boolean;
  pushed_at: string;
}

function tierOf(repoName: string): Project["tier"] {
  return SELECTED_REPOS.includes(repoName) ? "selected" : "lab";
}

/** Selected projects in SELECTED_REPOS order; labs keep their incoming order. */
function bySelectedOrder(entries: [repoName: string, project: Project][]): Project[] {
  const rank = (name: string) => {
    const i = SELECTED_REPOS.indexOf(name);
    return i === -1 ? SELECTED_REPOS.length : i;
  };
  return entries
    .map((entry, i) => ({ entry, i }))
    .sort((a, b) => rank(a.entry[0]) - rank(b.entry[0]) || a.i - b.i)
    .map(({ entry }) => entry[1]);
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
const FALLBACK_PROJECTS: Project[] = bySelectedOrder(
  Object.entries(OVERRIDES)
    .filter(([name]) => !EXCLUDED_REPOS.has(name))
    .map(([name, override]): [string, Project] => [name, {
      name: override.name ?? humanize(name),
      description: override.description ?? "",
      tech: override.tech ?? [],
      href: `${profile.github}/${name}`,
      note: override.note,
      demo: override.demo,
      image: override.image ?? findProjectImage(name),
      tier: tierOf(name),
    }])
);

export async function getProjects(): Promise<Project[]> {
  try {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=pushed`,
      {
        headers: { Accept: "application/vnd.github+json" },
        // Fetched once per build: the repo list refreshes on each deploy.
        cache: "force-cache",
      }
    );

    if (!res.ok) throw new Error(`GitHub API responded ${res.status}`);
    const repos: GitHubRepo[] = await res.json();

    const fromGitHub = repos
      .filter((repo) => !repo.fork && !repo.archived && !EXCLUDED_REPOS.has(repo.name))
      .map((repo): [string, Project] => {
        const override = OVERRIDES[repo.name] ?? {};
        return [repo.name, {
          name: override.name ?? humanize(repo.name),
          description:
            override.description ??
            repo.description ??
            (repo.language ? `A ${repo.language} project.` : "A project by " + profile.name + "."),
          tech: override.tech ?? (repo.language ? [repo.language] : []),
          href: repo.html_url,
          note: override.note,
          demo: override.demo ?? (repo.homepage || undefined),
          image: override.image ?? findProjectImage(repo.name),
          tier: tierOf(repo.name),
        }];
      });

    return bySelectedOrder(fromGitHub);
  } catch {
    return FALLBACK_PROJECTS;
  }
}
