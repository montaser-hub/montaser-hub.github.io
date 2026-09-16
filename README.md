# Montaser Ismail — Portfolio

Personal portfolio site built with Next.js 16 (App Router), TypeScript, Tailwind CSS v4, and Framer Motion. Features an animated WebGL globe (via [cobe](https://github.com/shuding/cobe)) in the hero, inspired by Cloudflare's connect-globe visual.

## Structure

- `app/` — root layout, global styles, and the single page (`page.tsx`)
- `components/` — Sidebar (nav), Hero (with `ConnectGlobe`), About, FeaturedProject, Projects, Contact, Footer, plus small `Reveal` scroll-animation wrapper and inline icons
- `lib/data.ts` — all content (profile info, tech stack, featured project, project list) in one place — edit this file to update copy without touching components

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm start
```

Deploys cleanly to Vercel, Cloudflare Pages, or any Node host.
