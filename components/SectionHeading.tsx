import Reveal from "./Reveal";

/** Section title followed by a rule that fills the row. */
export default function SectionHeading({ children }: { children: string }) {
  return (
    <Reveal>
      <div className="mb-10 flex items-center gap-4">
        <h2 className="text-2xl font-semibold text-foreground">{children}</h2>
        <span className="h-px flex-1 bg-border" />
      </div>
    </Reveal>
  );
}
