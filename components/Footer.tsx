import { copy } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="flex flex-col items-center justify-between gap-2 border-t border-border py-8 font-mono text-xs text-muted-dim sm:flex-row">
      <p>
        © {new Date().getFullYear()} · {copy.footer}
      </p>
      <p>Next.js · Tailwind CSS · Framer Motion</p>
    </footer>
  );
}
