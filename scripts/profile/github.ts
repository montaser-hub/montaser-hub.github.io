/**
 * Everything the profile reads from GitHub, in one place: the contribution
 * calendar, account totals, and per-repository languages and commit times.
 * Nothing here is typed in by hand, so the graphics change when GitHub does.
 * Needs the gh CLI.
 */
import { execFileSync } from "node:child_process";

export interface DayCount {
  date: string; // YYYY-MM-DD
  count: number;
}

/** A named share of a whole, e.g. a language and how many repositories use it. */
export interface Share {
  label: string;
  count: number;
}

export interface GitHubStats {
  login: string;
  joined: Date;
  /** Contributions in the last year, public and private, as GitHub's calendar counts them. */
  contributions: number;
  days: DayCount[];
  commitsLastYear: number;
  pullRequests: number;
  issues: number;
  contributedTo: number;
  publicRepos: number;
  stars: number;
  /** Public repositories per main language, largest first. */
  languagesByRepo: Share[];
  /** My commits per repository's main language, largest first. */
  languagesByCommit: Share[];
  /** My commits per hour of the day (0 to 23) in `timeZone`. */
  commitHours: number[];
  /** How many commits `commitHours` and `languagesByCommit` are counted from. */
  commitsRead: number;
}

function graphql<T>(query: string, variables: Record<string, string> = {}): T {
  const args = Object.entries(variables).flatMap(([name, value]) => ["-f", `${name}=${value}`]);
  const out = execFileSync("gh", ["api", "graphql", "-f", `query=${query}`, ...args], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  return JSON.parse(out).data;
}

const OVERVIEW = `query($login: String!) { user(login: $login) {
  id createdAt
  pullRequests { totalCount }
  issues { totalCount }
  repositoriesContributedTo(contributionTypes: [COMMIT, PULL_REQUEST, ISSUE]) { totalCount }
  contributionsCollection {
    totalCommitContributions
    contributionCalendar { totalContributions weeks { contributionDays { date contributionCount } } }
  }
  repositories(first: 100, ownerAffiliations: OWNER, isFork: false, privacy: PUBLIC) {
    nodes { name stargazerCount primaryLanguage { name } }
  }
} }`;

const COMMITS = `query($login: String!, $repo: String!, $author: ID!, $after: String) { repository(owner: $login, name: $repo) {
  defaultBranchRef { target { ... on Commit {
    history(first: 100, after: $after, author: { id: $author }) { pageInfo { hasNextPage endCursor } nodes { committedDate } }
  } } }
} }`;

interface Overview {
  user: {
    id: string;
    createdAt: string;
    pullRequests: { totalCount: number };
    issues: { totalCount: number };
    repositoriesContributedTo: { totalCount: number };
    contributionsCollection: {
      totalCommitContributions: number;
      contributionCalendar: { totalContributions: number; weeks: { contributionDays: { date: string; contributionCount: number }[] }[] };
    };
    repositories: { nodes: { name: string; stargazerCount: number; primaryLanguage: { name: string } | null }[] };
  };
}

interface CommitPage {
  repository: {
    defaultBranchRef: { target: { history: { pageInfo: { hasNextPage: boolean; endCursor: string }; nodes: { committedDate: string }[] } } } | null;
  };
}

/** When each of my commits on a repository's default branch was made. */
function commitTimes(login: string, repo: string, author: string): Date[] {
  const times: Date[] = [];
  let after: string | undefined;
  do {
    const page = graphql<CommitPage>(COMMITS, { login, repo, author, ...(after ? { after } : {}) });
    const history = page.repository.defaultBranchRef?.target.history;
    if (!history) break;
    times.push(...history.nodes.map((node) => new Date(node.committedDate)));
    after = history.pageInfo.hasNextPage ? history.pageInfo.endCursor : undefined;
  } while (after);
  return times;
}

const largestFirst = (counts: Map<string, number>): Share[] =>
  [...counts.entries()].map(([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count);

/**
 * @param login      GitHub user
 * @param skipRepos  repositories to leave out of the language and commit figures
 * @param timeZone   IANA zone the commit hours are shown in, e.g. "Africa/Cairo"
 */
export function readGitHub(login: string, skipRepos: Set<string>, timeZone: string): GitHubStats | undefined {
  try {
    const { user } = graphql<Overview>(OVERVIEW, { login });
    const calendar = user.contributionsCollection.contributionCalendar;
    const repos = user.repositories.nodes;
    const hourOf = new Intl.DateTimeFormat("en-US", { hour: "numeric", hourCycle: "h23", timeZone });

    const byRepo = new Map<string, number>();
    const byCommit = new Map<string, number>();
    const commitHours = Array.from({ length: 24 }, () => 0);
    let commitsRead = 0;
    for (const repo of repos.filter((repo) => !skipRepos.has(repo.name))) {
      const times = commitTimes(login, repo.name, user.id);
      for (const time of times) commitHours[Number(hourOf.format(time))] += 1;
      commitsRead += times.length;
      const language = repo.primaryLanguage?.name;
      if (!language) continue;
      byRepo.set(language, (byRepo.get(language) ?? 0) + 1);
      byCommit.set(language, (byCommit.get(language) ?? 0) + times.length);
    }

    return {
      login,
      joined: new Date(user.createdAt),
      contributions: calendar.totalContributions,
      days: calendar.weeks.flatMap((week) => week.contributionDays.map((day) => ({ date: day.date, count: day.contributionCount }))),
      commitsLastYear: user.contributionsCollection.totalCommitContributions,
      pullRequests: user.pullRequests.totalCount,
      issues: user.issues.totalCount,
      contributedTo: user.repositoriesContributedTo.totalCount,
      publicRepos: repos.length,
      stars: repos.reduce((sum, repo) => sum + repo.stargazerCount, 0),
      languagesByRepo: largestFirst(byRepo),
      languagesByCommit: largestFirst(byCommit),
      commitHours,
      commitsRead,
    };
  } catch (error) {
    console.warn(`Could not read GitHub with \`gh\`: ${error instanceof Error ? error.message.split("\n")[0] : error}`);
    return undefined;
  }
}
