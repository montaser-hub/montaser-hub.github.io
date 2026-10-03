import { profile } from "@/lib/data";
import { navLinks } from "@/lib/sections";
import { GithubIcon, LinkedinIcon, WhatsappIcon, MailIcon } from "./icons";

const socials = [
  { href: profile.github, label: "GitHub", icon: GithubIcon },
  { href: profile.linkedin, label: "LinkedIn", icon: LinkedinIcon },
  { href: profile.whatsapp, label: "WhatsApp", icon: WhatsappIcon },
  { href: `mailto:${profile.email}`, label: "Email", icon: MailIcon },
];

export default function Sidebar() {
  return (
    <header className="px-6 pt-10 pb-6 sm:px-10 lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:w-[19rem] lg:flex-col lg:justify-between lg:px-0 lg:py-20 lg:pl-12 lg:pr-8 xl:w-[22rem] xl:pl-24">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          <a href="#top">{profile.name}</a>
        </h1>
        <p className="mt-2 text-base font-medium text-accent">{profile.title}</p>
        <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
          {profile.tagline}
        </p>

        <nav className="mt-12 hidden lg:block">
          <ul className="space-y-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="group flex items-center gap-3 text-sm font-medium text-muted-dim transition-colors hover:text-foreground"
                >
                  <span className="h-px w-8 bg-muted-dim transition-all group-hover:w-12 group-hover:bg-accent" />
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="mt-10 flex gap-5 lg:mt-0">
        {socials.map(({ href, label, icon: Icon }) => (
          <a
            key={label}
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
            aria-label={label}
            className="text-muted transition-colors hover:text-accent"
          >
            <Icon className="h-5 w-5" />
          </a>
        ))}
      </div>
    </header>
  );
}
