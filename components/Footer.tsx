import { profile } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="py-10 text-center font-mono text-xs text-muted-dim">
      <p>Designed &amp; built by {profile.name}.</p>
    </footer>
  );
}
