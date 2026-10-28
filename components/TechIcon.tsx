import type { IconType } from "react-icons";
import {
  SiReact,
  SiNextdotjs,
  SiAngular,
  SiTypescript,
  SiJavascript,
  SiHtml5,
  SiCss,
  SiSass,
  SiTailwindcss,
  SiRedux,
  SiReactrouter,
  SiMui,
  SiFramer,
  SiNodedotjs,
  SiNestjs,
  SiExpress,
  SiGraphql,
  SiApollographql,
  SiJsonwebtokens,
  SiMongodb,
  SiMongoose,
  SiPostgresql,
  SiMysql,
  SiRedis,
  SiDocker,
  SiGithubactions,
  SiNx,
  SiJest,
  SiJasmine,
  SiMocha,
  SiPostman,
  SiPython,
  SiPhp,
  SiVuedotjs,
  SiGo,
  SiRuby,
  SiKotlin,
  SiSwift,
  SiDart,
  SiRust,
  SiCplusplus,
  SiC,
  SiGnubash,
  SiFlutter,
  SiSvelte,
  SiJquery,
  SiWebpack,
  SiVite,
  SiFirebase,
  SiSocketdotio,
  SiBootstrap,
  SiPug,
  SiEjs,
  SiStripe,
  SiMapbox,
  SiPassport,
  SiPrisma,
  SiVitest,
  SiReactivex,
} from "react-icons/si";
import { DiAws, DiMsqlServer } from "react-icons/di";

/** Keys here are matched against the raw, lowercased tech label first (for tokens normalization would collide on, e.g. "C" vs "C++"). */
const EXACT_ICONS: Record<string, IconType> = {
  "c++": SiCplusplus,
};

/** Keys here are matched against the tech label with all non-alphanumeric characters stripped. */
const ICONS: Record<string, IconType> = {
  react: SiReact,
  reactjs: SiReact,
  reactrouter: SiReactrouter,
  nextjs: SiNextdotjs,
  angular: SiAngular,
  typescript: SiTypescript,
  javascript: SiJavascript,
  html: SiHtml5,
  css: SiCss,
  csssass: SiSass,
  sass: SiSass,
  scss: SiSass,
  tailwindcss: SiTailwindcss,
  redux: SiRedux,
  reduxtoolkit: SiRedux,
  materialui: SiMui,
  mui: SiMui,
  framermotion: SiFramer,
  nodejs: SiNodedotjs,
  nestjs: SiNestjs,
  express: SiExpress,
  graphql: SiGraphql,
  apollo: SiApollographql,
  jwt: SiJsonwebtokens,
  jwtauth: SiJsonwebtokens,
  mongodb: SiMongodb,
  mongoose: SiMongoose,
  postgresql: SiPostgresql,
  mysql: SiMysql,
  sqlserver: DiMsqlServer,
  redis: SiRedis,
  docker: SiDocker,
  githubactions: SiGithubactions,
  nx: SiNx,
  nxmonorepos: SiNx,
  jest: SiJest,
  jasmine: SiJasmine,
  mocha: SiMocha,
  postman: SiPostman,
  awss3: DiAws,
  aws: DiAws,
  python: SiPython,
  php: SiPhp,
  vue: SiVuedotjs,
  go: SiGo,
  ruby: SiRuby,
  kotlin: SiKotlin,
  swift: SiSwift,
  dart: SiDart,
  rust: SiRust,
  c: SiC,
  shell: SiGnubash,
  bash: SiGnubash,
  flutter: SiFlutter,
  svelte: SiSvelte,
  jquery: SiJquery,
  webpack: SiWebpack,
  vite: SiVite,
  firebase: SiFirebase,
  socketio: SiSocketdotio,
  bootstrap: SiBootstrap,
  pug: SiPug,
  ejs: SiEjs,
  stripe: SiStripe,
  mapbox: SiMapbox,
  passport: SiPassport,
  passportjs: SiPassport,
  prisma: SiPrisma,
  vitest: SiVitest,
  rxjs: SiReactivex,
};

/**
 * Every logo above, once each, with a stable id. The ids come from the map
 * keys rather than component names, which minification changes, so the
 * server and the browser always agree on them.
 */
const SPRITE_IDS = new Map<IconType, string>();
for (const [key, icon] of [...Object.entries(EXACT_ICONS), ...Object.entries(ICONS)]) {
  // "+" is spelled out so "c++" and "c" get different ids.
  if (!SPRITE_IDS.has(icon)) SPRITE_IDS.set(icon, `tech-${normalize(key.replace(/\+/g, "plus"))}`);
}

/**
 * Defines each logo once for the whole page; TechIcon points at these with
 * <use>. Tech tags repeat the same logos dozens of times, and inline copies
 * made up half the page's HTML. Render it once, anywhere on the page.
 */
export function TechIconSprite() {
  return (
    <svg aria-hidden="true" width="0" height="0" className="absolute">
      {[...SPRITE_IDS].map(([Icon, id]) => (
        <symbol key={id} id={id}>
          <Icon size="100%" />
        </symbol>
      ))}
    </svg>
  );
}

function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export function resolveTechIcon(tech: string): IconType | undefined {
  return EXACT_ICONS[tech.trim().toLowerCase()] ?? ICONS[normalize(tech)];
}

/**
 * Renders a known brand icon for `tech` (from TechIconSprite), or a monogram badge as a graceful
 * fallback for tokens with no icon (e.g. "SOLID Principles", "CI/CD") — so
 * every tech tag reads as an intentional badge rather than a missing icon.
 */
export default function TechIcon({
  tech,
  className = "h-4 w-4",
}: {
  tech: string;
  className?: string;
}) {
  const Icon = resolveTechIcon(tech);

  if (Icon) {
    return (
      <svg className={className} aria-hidden="true">
        <use href={`#${SPRITE_IDS.get(Icon)}`} />
      </svg>
    );
  }

  const initials = tech.replace(/[^A-Za-z0-9]/g, "").slice(0, 2).toUpperCase() || "•";
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-[3px] border border-current text-[0.55em] font-bold leading-none ${className}`}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}
