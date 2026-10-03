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

function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export function resolveTechIcon(tech: string): IconType | undefined {
  return EXACT_ICONS[tech.trim().toLowerCase()] ?? ICONS[normalize(tech)];
}

/**
 * Renders a known brand icon for `tech`, or a monogram badge as a graceful
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
    // Icon is a stable reference from a module-level lookup map, not defined during render.
    // eslint-disable-next-line react-hooks/static-components
    return <Icon className={className} aria-hidden="true" />;
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
