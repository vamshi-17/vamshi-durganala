"use client";

import { motion } from "framer-motion";
import {
  Activity,
  Cloud,
  CodeXml,
  Database,
  FlaskConical,
  LayoutTemplate,
  Server,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { marquee, skillGroups } from "@/data/profile";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Marquee } from "@/components/ui/marquee";
import { Accent, SectionHeading } from "@/components/ui/section-heading";
import { Stagger, StaggerItem } from "@/components/ui/reveal";

const icons = { Activity, Cloud, CodeXml, Database, FlaskConical, LayoutTemplate, Server, ShieldCheck, Wrench };

export function Skills() {
  return (
    <section id="skills" className="relative py-28 md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          index="04"
          eyebrow="Toolbox"
          title={
            <>
              A stack built for the <Accent>whole</Accent> request path.
            </>
          }
          description="From the browser to the database and everything that keeps it observable and secure in between."
        />

        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group) => {
            const Icon = icons[group.icon];
            return (
              <StaggerItem key={group.title}>
                <SpotlightCard className="h-full p-6">
                  <div className="flex items-center gap-3">
                    <motion.span
                      whileHover={{ rotate: -12, scale: 1.1 }}
                      className="grid size-10 place-items-center rounded-xl border border-line-strong bg-gradient-to-br from-violet-500/15 to-cyan-400/10 text-accent"
                    >
                      <Icon className="size-5" />
                    </motion.span>
                    <h3 className="font-semibold tracking-tight">{group.title}</h3>
                    <span className="ml-auto font-mono text-xs text-subtle">{String(group.items.length).padStart(2, "0")}</span>
                  </div>
                  <ul className="mt-5 flex flex-wrap gap-1.5">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="rounded-md border border-line bg-white/[0.02] px-2.5 py-1 text-[13px] text-fg/75 transition duration-300 hover:-translate-y-0.5 hover:border-accent/50 hover:bg-accent/10 hover:text-fg"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </SpotlightCard>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>

      <div className="mt-20 space-y-4">
        <Marquee items={marquee} />
        <Marquee items={[...marquee].reverse()} reverse />
      </div>
    </section>
  );
}
