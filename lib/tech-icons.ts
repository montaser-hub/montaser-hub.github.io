/**
 * Which logo each tech label gets. This table is all the browser needs: a
 * TechIcon only points at a logo by id, and the logos themselves are drawn
 * once, on the server, by TechIconSprite. Every id here must have a logo
 * there; TypeScript checks it.
 */

/** Matched first, against the raw lowercased label (for labels normalization would collide on, e.g. "C" vs "C++"). */
const EXACT = {
  "c++": "cplusplus",
} as const;

/** Matched against the label with everything but letters and digits removed. */
const NORMALIZED = {
  react: "react",
  reactjs: "react",
  reactrouter: "reactrouter",
  nextjs: "nextdotjs",
  angular: "angular",
  typescript: "typescript",
  javascript: "javascript",
  html: "html5",
  css: "css",
  csssass: "sass",
  sass: "sass",
  scss: "sass",
  tailwindcss: "tailwindcss",
  redux: "redux",
  reduxtoolkit: "redux",
  materialui: "mui",
  mui: "mui",
  framermotion: "framer",
  nodejs: "nodedotjs",
  nestjs: "nestjs",
  express: "express",
  graphql: "graphql",
  apollo: "apollographql",
  jwt: "jsonwebtokens",
  jwtauth: "jsonwebtokens",
  mongodb: "mongodb",
  mongoose: "mongoose",
  postgresql: "postgresql",
  mysql: "mysql",
  sqlserver: "msqlserver",
  redis: "redis",
  docker: "docker",
  githubactions: "githubactions",
  nx: "nx",
  nxmonorepos: "nx",
  jest: "jest",
  jasmine: "jasmine",
  mocha: "mocha",
  postman: "postman",
  awss3: "aws",
  aws: "aws",
  python: "python",
  php: "php",
  vue: "vuedotjs",
  go: "go",
  ruby: "ruby",
  kotlin: "kotlin",
  swift: "swift",
  dart: "dart",
  rust: "rust",
  c: "c",
  shell: "gnubash",
  bash: "gnubash",
  flutter: "flutter",
  svelte: "svelte",
  jquery: "jquery",
  webpack: "webpack",
  vite: "vite",
  firebase: "firebase",
  socketio: "socketdotio",
  bootstrap: "bootstrap",
  pug: "pug",
  ejs: "ejs",
  stripe: "stripe",
  mapbox: "mapbox",
  passport: "passport",
  passportjs: "passport",
  prisma: "prisma",
  vitest: "vitest",
  rxjs: "reactivex",
} as const;

export type TechIconId = (typeof EXACT)[keyof typeof EXACT] | (typeof NORMALIZED)[keyof typeof NORMALIZED];

const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "");

export function techIconId(tech: string): TechIconId | undefined {
  return (
    (EXACT as Record<string, TechIconId>)[tech.trim().toLowerCase()] ??
    (NORMALIZED as Record<string, TechIconId>)[normalize(tech)]
  );
}

/** The id of a logo's <symbol> in the page. */
export const spriteId = (id: TechIconId) => `tech-${id}`;
