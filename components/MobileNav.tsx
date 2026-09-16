const navLinks = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#work", label: "Work" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

export default function MobileNav() {
  return (
    <nav className="sticky top-0 z-30 -mx-6 mb-4 flex gap-6 overflow-x-auto border-b border-border bg-background/90 px-6 py-4 backdrop-blur sm:-mx-10 sm:px-10 lg:hidden">
      {navLinks.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className="shrink-0 text-sm font-medium text-muted transition-colors hover:text-accent"
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
}
