"use client";

import { useEffect, useState } from "react";
import { REPOS_URL, toProjects, type GitHubRepo, type ProjectImages } from "@/lib/project-mapper";
import type { Project } from "@/lib/types";

const CACHE_KEY = "github-repos";
const CACHE_MINUTES = 10; // GitHub allows 60 unauthenticated requests an hour per visitor

function cachedRepos(): GitHubRepo[] | undefined {
  try {
    const { at, repos } = JSON.parse(sessionStorage.getItem(CACHE_KEY) ?? "null") ?? {};
    return Date.now() - at < CACHE_MINUTES * 60_000 ? repos : undefined;
  } catch {
    return undefined;
  }
}

/**
 * The project list, kept current without a redeploy: it starts as the list
 * from the last build and is replaced by GitHub's current one once the page
 * loads. If GitHub can't be reached the built list simply stays.
 */
export function useLiveProjects(built: Project[], images: ProjectImages): Project[] {
  const [projects, setProjects] = useState(built);

  useEffect(() => {
    const controller = new AbortController();
    const show = (repos: GitHubRepo[]) => {
      const live = toProjects(repos, images);
      // Same list as the build: keep the current objects so nothing re-renders.
      setProjects((current) => (JSON.stringify(current) === JSON.stringify(live) ? current : live));
    };

    const cached = cachedRepos();
    if (cached) {
      show(cached);
      return;
    }
    fetch(REPOS_URL, { headers: { Accept: "application/vnd.github+json" }, signal: controller.signal })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`GitHub API responded ${res.status}`))))
      .then((repos: GitHubRepo[]) => {
        show(repos);
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), repos }));
        } catch {
          // Storage can be blocked; the list is already on screen.
        }
      })
      .catch(() => {});

    return () => controller.abort();
  }, [images]);

  return projects;
}
