import { Reveal } from "@/components/ui/reveal";

type SectionHeadingProps = {
  index: string;
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
};

export function SectionHeading({ index, eyebrow, title, description }: SectionHeadingProps) {
  return (
    <Reveal className="mb-14 max-w-3xl md:mb-20">
      <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-accent">
        <span>{index}</span>
        <span className="h-px w-8 bg-accent/50" />
        <span>{eyebrow}</span>
      </p>
      <h2 className="mt-5 text-4xl font-semibold tracking-tight text-balance md:text-6xl">{title}</h2>
      {description && <p className="mt-5 text-lg leading-relaxed text-muted text-pretty">{description}</p>}
    </Reveal>
  );
}

/** Serif italic accent used inside headings. */
export function Accent({ children }: { children: React.ReactNode }) {
  return <span className="font-serif font-normal italic text-gradient pr-1">{children}</span>;
}
