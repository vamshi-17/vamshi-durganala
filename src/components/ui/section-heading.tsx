"use client";

import { motion } from "framer-motion";
import { hops } from "@/data/profile";
import { ease } from "@/components/ui/reveal";

type SectionHeadingProps = {
  hop: (typeof hops)[number]["id"];
  title: React.ReactNode;
  lede?: React.ReactNode;
};

/** Heading styled as a hop in the request path, e.g. "02 · services — GET /experience 200". */
export function SectionHeading({ hop, title, lede }: SectionHeadingProps) {
  const i = hops.findIndex((h) => h.id === hop);
  const { layer, route } = hops[i];

  return (
    <div className="mb-12 md:mb-16">
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-muted"
      >
        <span className="text-lime">{String(i).padStart(2, "0")}</span>
        <span className="uppercase tracking-[0.2em] text-fg">{layer}</span>
        <motion.span
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease }}
          className="h-px w-12 origin-left bg-line-strong"
        />
        <span>
          GET <span className="text-fg">{route}</span> <span className="text-lime">200</span>
        </span>
      </motion.p>
      <h2 className="mt-5 overflow-hidden">
        <motion.span
          initial={{ y: "100%" }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.9, ease }}
          className="block font-display text-[clamp(2.5rem,6.5vw,5.25rem)] leading-[0.95] text-balance"
        >
          {title}
        </motion.span>
      </h2>
      {lede && (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15, ease }}
          className="mt-5 max-w-2xl text-lg leading-relaxed text-muted text-pretty"
        >
          {lede}
        </motion.p>
      )}
    </div>
  );
}

/** Lime highlighter used on a key word in headings. */
export function Mark({ children }: { children: React.ReactNode }) {
  return <span className="text-lime">{children}</span>;
}
