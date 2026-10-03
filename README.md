# Montaser Ismail — Portfolio

My portfolio site: a single page built with Next.js (App Router), TypeScript, Tailwind CSS 4 and Framer Motion,
exported as a static site and hosted on GitHub Pages at https://montaser-hub.github.io.

## How it is organized

The site is driven by data: components render what the files in `lib/` describe, so content changes never touch
component code.

| File | What it holds |
|---|---|
| `lib/data.ts` | Profile, page copy, focus areas, tech stack, experience, education and the featured case studies |
| `lib/project-catalog.ts` | Hand-written copy per GitHub repo, which repos are "selected" and in what order, and which are hidden |
| `lib/projects.ts` | Reads my public repos from the GitHub API at build time and merges them with the catalog |
| `lib/sections.ts` | The page's sections; both navigation menus are generated from it |
| `public/projects/` | Screenshots, matched to repos by file name (see its README) |

Projects appear in three tiers: **Featured Work** (case studies), **Selected Projects** (cards that flip to a
screenshot) and **Learning & Labs** (a compact list). A new public repo shows up under Learning & Labs on the
next deploy; add it to `SELECTED_REPOS` to promote it.

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
npm run deploy     # build and publish to the gh-pages branch
```

Facts in the case studies (test counts, commit shares, endpoint counts) were checked against the projects'
code and git history; re-check before changing them.
