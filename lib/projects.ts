import { readdirSync } from "node:fs";
import path from "node:path";
import type { Project } from "./types";
import { REPOS_URL, catalogProjects, toProjects, type GitHubRepo, type ProjectImages } from "./project-mapper";

const PROJECT_IMAGES_DIR = path.join(process.cwd(), "public", "projects");
// Later entries win, so a .webp is preferred when a repo has several files.
const IMAGE_EXTENSIONS = ["jpeg", "jpg", "png", "webp"];

/**
 * Every screenshot in `public/projects/`, keyed by file name without the
 * extension. Dropping in a file named after a repo (lower-case) is enough to
 * make its card flip to it: no code changes needed.
 */
export function getProjectImages(): ProjectImages {
  const files = readdirSync(PROJECT_IMAGES_DIR);
  const images: ProjectImages = {};
  for (const ext of IMAGE_EXTENSIONS) {
    for (const file of files.filter((name) => name.endsWith(`.${ext}`))) {
      images[file.slice(0, -ext.length - 1)] = `/projects/${file}`;
    }
  }
  return images;
}

/** The project list as of this build. The browser refreshes it on each visit (hooks/useLiveProjects.ts). */
export async function getProjects(): Promise<Project[]> {
  const images = getProjectImages();
  try {
    const res = await fetch(REPOS_URL, {
      headers: { Accept: "application/vnd.github+json" },
      cache: "force-cache", // once per build
    });
    if (!res.ok) throw new Error(`GitHub API responded ${res.status}`);
    const repos: GitHubRepo[] = await res.json();
    return toProjects(repos, images);
  } catch {
    return catalogProjects(images);
  }
}
