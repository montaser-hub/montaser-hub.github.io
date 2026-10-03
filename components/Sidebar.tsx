import { contacts, profile } from "@/lib/data";
import type { ContactLink } from "@/lib/types";
import SidebarNav from "./SidebarNav";
import { GithubIcon, LinkedinIcon, WhatsappIcon, MailIcon } from "./icons";

const ICONS: Record<ContactLink["kind"], typeof GithubIcon> = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  whatsapp: WhatsappIcon,
  email: MailIcon,
};

export default function Sidebar() {
  return (
    <header className="flex items-end justify-between gap-4 px-6 pt-8 pb-4 sm:px-10 lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:flex-col lg:items-stretch lg:justify-between lg:px-8 lg:py-16 xl:w-72 xl:px-10">
      <div>
        <h1 className="whitespace-nowrap text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          <a href="#top" className="transition-colors hover:text-accent">
            {profile.name}
          </a>
        </h1>
        <p className="mt-1 text-sm font-semibold text-accent">{profile.title}</p>

        <SidebarNav />
      </div>

      <div className="flex items-center gap-1 lg:-ml-2">
        {contacts.map(({ href, label, kind }) => {
          const Icon = ICONS[kind];
          return (
            <a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              aria-label={label}
              className="rounded-lg p-2.5 text-muted transition-all duration-200 hover:bg-surface-hover hover:text-accent"
            >
              <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
            </a>
          );
        })}
      </div>
    </header>
  );
}
