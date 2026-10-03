# Montaser Ismail — Portfolio

My portfolio site: a single page built with Next.js (App Router), TypeScript, Tailwind CSS 4 and Framer Motion,
exported as a static site and hosted on GitHub Pages at https://montaser-hub.github.io.

## How it is organized

The site is driven by data: components render what the files in `lib/` describe, so content changes never touch
component code.

| File | What it holds |
|---|---|
| `lib/data.ts` | Profile, contact links, globe places, page copy, focus areas, tech stack, experience, education and the featured case studies |
| `lib/project-catalog.ts` | Hand-written copy per GitHub repo, which repos are "selected" and in what order, and which are hidden |
| `lib/project-mapper.ts` | Merges GitHub's repository list with the catalog (shared by the build and the browser) |
| `lib/projects.ts` | Reads my public repos from the GitHub API at build time |
| `hooks/useLiveProjects.ts` | Refreshes the project list from GitHub in the visitor's browser, so it is current without a redeploy |
| `lib/sections.ts` | The page's sections; the page order and both navigation menus are generated from it |
| `public/projects/` | Screenshots, matched to repos by file name (see its README) |

Projects appear in three tiers: **Featured Work** (case studies), **Selected Projects** (cards that flip to a
screenshot) and **Learning & Labs** (a compact list). A new public repo shows up under Learning & Labs on the
next page load; add it to `SELECTED_REPOS` to promote it.

## Common changes

| To do this | Edit |
|---|---|
| Change my title, location, links or availability | `profile` in `lib/data.ts` |
| Add or reorder a contact link | `contacts` in `lib/data.ts` |
| Pin another place on the globe | `places` in `lib/data.ts` (label, latitude, longitude) |
| Add a job or a case study | `experience` or `caseStudies` in `lib/data.ts` |
| Give a repo a proper name, description and tech list | `OVERRIDES` in `lib/project-catalog.ts` |
| Promote a repo to a card, or hide one | `SELECTED_REPOS` or `EXCLUDED_REPOS` in `lib/project-catalog.ts` |
| Add a card screenshot | drop `<repo-name>.webp` into `public/projects/` |
| Rename or reorder a page section, or change its heading | `lib/sections.ts` (a new section also needs its component in `app/page.tsx`) |
| Change a button or small label ("Live demo", "Education", the footer line) | `copy` in `lib/data.ts` |
| Change the icons on the GitHub profile's tech line | `STACK` in `scripts/build-profile-readme.ts` |

After a change to `lib/`, run `npm run deploy` for the site and `npm run profile:publish` for the GitHub
profile. Repository changes on GitHub (a new repo, a new description) reach the site by themselves; the
profile's numbers and charts are read from GitHub each time `npm run profile:publish` runs.

Animation respects the visitor's reduced-motion setting (`components/MotionProvider.tsx`, `app/globals.css`),
and the WebGL globe pauses when it is off screen.

## Commands

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static site in out/
npm run lint
npm run images     # regenerate the link-preview image and PNG favicon
npm run profile    # generate my GitHub profile README from the same data (needs the gh CLI)
npm run profile:publish   # generate it and push it to the profile repository
npm run deploy     # build and publish to the gh-pages branch
```

Facts in the case studies (test counts, commit shares, endpoint counts) were checked against the projects'
code and git history; re-check before changing them.
