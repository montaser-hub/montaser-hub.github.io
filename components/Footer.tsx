import { copy } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="py-10 text-center font-mono text-xs text-muted-dim">
      <p>{copy.footer}</p>
    </footer>
  );
}
