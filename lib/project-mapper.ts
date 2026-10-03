/**
 * Turns GitHub's repository list into the site's projects. Pure: no file
 * system and no fetching, so the build (lib/projects.ts) and the browser
 * (hooks/useLiveProjects.ts) produce the same list from the same input.
 */
import type { Project } from "./types";
import { profile } from "./data";
import { EXCLUDED_REPOS, OVERRIDES, SELECTED_REPOS } from "./project-catalog";

export const GITHUB_USER = profile.github.split("/").pop()!;
export const REPOS_URL = `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=pushed`;

/** The fields read from each entry of GitHub's "list repositories" response. */
export interface GitHubRepo {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  fork: boolean;
  archived: boolean;
}

/** Screenshot path per lower-cased repo name, e.g. { natours: "/projects/natours.webp" }. */
export type ProjectImages = Record<string, string>;

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

/** Every public repo that isn't a fork, archived or excluded, with the catalog's copy laid over GitHub's. */
export function toProjects(repos: GitHubRepo[], images: ProjectImages): Project[] {
  return bySelectedOrder(
    repos
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
          image: override.image ?? images[repo.name.toLowerCase()],
          tier: tierOf(repo.name),
        }];
      })
  );
}

/** The curated repos alone, used only if the GitHub API is unreachable at build time. */
export function catalogProjects(images: ProjectImages): Project[] {
  return bySelectedOrder(
    Object.entries(OVERRIDES)
      .filter(([name]) => !EXCLUDED_REPOS.has(name))
      .map(([name, override]): [string, Project] => [name, {
        name: override.name ?? humanize(name),
        description: override.description ?? "",
        tech: override.tech ?? [],
        href: `${profile.github}/${name}`,
        note: override.note,
        demo: override.demo,
        image: override.image ?? images[name.toLowerCase()],
        tier: tierOf(name),
      }])
  );
}
