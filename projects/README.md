# Project screenshots

Screenshots shown on the site.

- **Selected Projects cards**: name the file after the GitHub repo, lower-case, and the card flips to it on
  hover with no code change. For `github.com/montaser-hub/nextjs-recipe-store` use `nextjs-recipe-store.webp`.
  `lib/projects.ts` looks for `webp`, `png`, `jpg`, `jpeg`, in that order. A repo without a file keeps a plain card.
- **Case studies**: referenced explicitly by the `image` field in `lib/data.ts` (`smartshift.webp`,
  `tenders.webp`, `trigo.webp`, `qyser.webp`).

Recommended: 1280×960 (4:3) WebP at quality ~80, under 300 KB. The site is a static export, so images are served
as they are; size them before adding them.
