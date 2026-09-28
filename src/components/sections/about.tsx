"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Award, Bot, Briefcase, GraduationCap, MapPin } from "lucide-react";
import { about, certifications, education, profile } from "@/data/profile";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Accent, SectionHeading } from "@/components/ui/section-heading";
import { Stagger, StaggerItem } from "@/components/ui/reveal";

function LocalTime() {
  // Rendered client-side only so the static HTML never mismatches the visitor's clock.
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      timeZone: "America/New_York",
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const t = setInterval(tick, 15_000);
    return () => clearInterval(t);
  }, []);
  return <span className="tabular-nums">{time ?? "--:--"}</span>;
}

function CardLabel({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
      <Icon className="size-3.5 text-accent" />
      {children}
    </p>
  );
}

export function About() {
  return (
    <section id="about" className="relative py-28 md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          index="01"
          eyebrow="About"
          title={
            <>
              Engineering systems that stay <Accent>calm</Accent> under load.
            </>
          }
        />

        <Stagger className="grid auto-rows-[minmax(0,auto)] gap-4 md:grid-cols-6">
          <StaggerItem className="md:col-span-4 md:row-span-2">
            <SpotlightCard className="h-full p-8 md:p-10">
              <CardLabel icon={Briefcase}>Who I am</CardLabel>
              <div className="mt-6 space-y-5 text-lg leading-relaxed text-muted text-pretty">
                {about.map((p, i) => (
                  <p key={i} className={i === 0 ? "text-xl text-fg md:text-2xl md:leading-snug" : undefined}>
                    {p}
                  </p>
                ))}
              </div>
            </SpotlightCard>
          </StaggerItem>

          <StaggerItem className="md:col-span-2">
            <SpotlightCard className="h-full p-7" color="34 211 238">
              <CardLabel icon={MapPin}>Based in</CardLabel>
              <p className="mt-5 text-2xl font-semibold tracking-tight">{profile.location}</p>
              <p className="mt-1 text-sm text-muted">
                <LocalTime /> local · Eastern Time
              </p>
              <div className="relative mt-6 h-20 overflow-hidden rounded-xl border border-line bg-grid [background-size:16px_16px]">
                <span className="absolute left-[58%] top-[42%] flex size-3">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-cyan-400 opacity-60" />
                  <span className="relative inline-flex size-3 rounded-full border-2 border-bg bg-cyan-400" />
                </span>
              </div>
            </SpotlightCard>
          </StaggerItem>

          <StaggerItem className="md:col-span-2">
            <SpotlightCard className="h-full p-7">
              <CardLabel icon={Bot}>How I work</CardLabel>
              <p className="mt-5 text-lg font-medium leading-snug">
                AI-assisted, test-first.
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Pairing with GitHub Copilot & Claude Code for debugging, refactoring and test generation — reviewed like
                any other PR.
              </p>
            </SpotlightCard>
          </StaggerItem>

          <StaggerItem className="md:col-span-3">
            <SpotlightCard className="h-full p-7" color="251 191 36">
              <CardLabel icon={Award}>Certifications</CardLabel>
              <ul className="mt-5 space-y-3">
                {certifications.map((c, i) => (
                  <motion.li
                    key={c.name}
                    whileHover={{ x: 4 }}
                    className="flex items-center justify-between gap-4 border-b border-line pb-3 last:border-0 last:pb-0"
                  >
                    <span className={i === 0 ? "font-medium" : "text-muted"}>{c.name}</span>
                    <span className="shrink-0 rounded-full border border-line px-2.5 py-0.5 font-mono text-[11px] text-muted">
                      {c.detail}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </SpotlightCard>
          </StaggerItem>

          <StaggerItem className="md:col-span-3">
            <SpotlightCard className="h-full p-7" color="52 211 153">
              <CardLabel icon={GraduationCap}>Education</CardLabel>
              <ul className="mt-5 space-y-5">
                {education.map((e) => (
                  <li key={e.degree}>
                    <div className="flex items-baseline justify-between gap-4">
                      <p className="font-medium">{e.degree}</p>
                      <span className="shrink-0 font-mono text-xs text-muted">{e.period}</span>
                    </div>
                    <p className="mt-0.5 text-sm text-muted">{e.school}</p>
                  </li>
                ))}
              </ul>
            </SpotlightCard>
          </StaggerItem>
        </Stagger>
      </div>
    </section>
  );
}
