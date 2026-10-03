import { profile } from "@/lib/data";
import SidebarNav from "./SidebarNav";
import { GithubIcon, LinkedinIcon, WhatsappIcon, MailIcon } from "./icons";

const socials = [
  { href: profile.github, label: "GitHub", icon: GithubIcon },
  { href: profile.linkedin, label: "LinkedIn", icon: LinkedinIcon },
  { href: profile.whatsapp, label: "WhatsApp", icon: WhatsappIcon },
  { href: `mailto:${profile.email}`, label: "Email", icon: MailIcon },
];

export default function Sidebar() {
  return (
    <header className="flex items-end justify-between gap-4 px-6 pt-8 pb-4 sm:px-10 lg:fixed lg:inset-y-0 lg:left-0 lg:w-[19rem] lg:flex-col lg:items-stretch lg:justify-between lg:px-0 lg:py-20 lg:pl-12 lg:pr-8 xl:w-[22rem] xl:pl-24">
      <div>
        <h1 className="whitespace-nowrap text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          <a href="#top">{profile.name}</a>
        </h1>
        <p className="mt-1 text-sm font-medium text-accent sm:text-base lg:mt-2">{profile.title}</p>
        {/* The hero carries the tagline, so the sidebar keeps to a short status line. */}
        <p className="mt-4 hidden items-center gap-2 font-mono text-xs text-muted-dim lg:flex">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-3.5 w-3.5" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s-7-5.5-7-11a7 7 0 1 1 14 0c0 5.5-7 11-7 11Z" />
            <circle cx="12" cy="10" r="2.5" />
          </svg>
          {profile.location} · Remote-friendly
        </p>

        <SidebarNav />
      </div>

      <div className="flex gap-1 lg:-ml-2.5">
        {socials.map(({ href, label, icon: Icon }) => (
          <a
            key={label}
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
            aria-label={label}
            className="rounded-md p-2.5 text-muted transition-colors duration-200 hover:text-accent"
          >
            <Icon className="h-5 w-5" />
          </a>
        ))}
      </div>
    </header>
  );
}
