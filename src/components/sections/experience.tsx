"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { ChevronDown, MapPin } from "lucide-react";
import { experience, type Job } from "@/data/profile";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Accent, SectionHeading } from "@/components/ui/section-heading";
import { Reveal, ease } from "@/components/ui/reveal";

const VISIBLE = 3;

function JobCard({ job, index }: { job: Job; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const hidden = job.highlights.length - VISIBLE;

  return (
    <Reveal delay={index * 0.05} className="relative pl-10 md:pl-16">
      {/* timeline node */}
      <span className="absolute left-0 top-9 grid size-[18px] -translate-x-1/2 place-items-center rounded-full border border-line-strong bg-bg md:left-0">
        <span className={job.current ? "size-2 rounded-full bg-accent shadow-[0_0_12px_2px] shadow-accent/70" : "size-1.5 rounded-full bg-muted"} />
      </span>

      <SpotlightCard className="p-7 md:p-9">
        <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
          <div>
            <h3 className="text-xl font-semibold tracking-tight md:text-2xl">{job.role}</h3>
            <p className="mt-1 text-accent">{job.company}</p>
          </div>
          <div className="flex flex-col items-start gap-1.5 md:items-end">
            <span className="flex items-center gap-2 rounded-full border border-line px-3 py-1 font-mono text-xs text-muted">
              {job.current && <span className="size-1.5 rounded-full bg-emerald-400" />}
              {job.period}
            </span>
            <span className="flex items-center gap-1 text-xs text-subtle">
              <MapPin className="size-3" /> {job.location}
            </span>
          </div>
        </div>

        <p className="mt-5 text-muted text-pretty">{job.summary}</p>

        <ul className="mt-5 space-y-3">
          {job.highlights.slice(0, VISIBLE).map((h) => (
            <Highlight key={h}>{h}</Highlight>
          ))}
          <AnimatePresence initial={false}>
            {expanded &&
              job.highlights.slice(VISIBLE).map((h, i) => (
                <motion.li
                  key={h}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto", transition: { delay: i * 0.04, ease, duration: 0.4 } }}
                  exit={{ opacity: 0, height: 0, transition: { duration: 0.25 } }}
                  className="overflow-hidden"
                >
                  <HighlightBody>{h}</HighlightBody>
                </motion.li>
              ))}
          </AnimatePresence>
        </ul>

        {hidden > 0 && (
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            className="mt-4 inline-flex items-center gap-1.5 text-sm text-muted transition hover:text-fg"
            aria-expanded={expanded}
          >
            {expanded ? "Show less" : `Show ${hidden} more`}
            <ChevronDown className={`size-4 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`} />
          </button>
        )}

        <div className="mt-6 flex flex-wrap gap-2 border-t border-line pt-6">
          {job.stack.map((s) => (
            <span
              key={s}
              className="rounded-md border border-line bg-white/[0.02] px-2.5 py-1 font-mono text-xs text-muted transition hover:border-accent/50 hover:text-fg"
            >
              {s}
            </span>
          ))}
        </div>
      </SpotlightCard>
    </Reveal>
  );
}

function HighlightBody({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 pb-0.5 text-[15px] leading-relaxed text-fg/80">
      <span className="mt-2.5 size-1 shrink-0 rounded-full bg-accent" />
      <span>{children}</span>
    </div>
  );
}

function Highlight({ children }: { children: React.ReactNode }) {
  return (
    <li>
      <HighlightBody>{children}</HighlightBody>
    </li>
  );
}

export function Experience() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <section id="experience" className="relative py-28 md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          index="02"
          eyebrow="Experience"
          title={
            <>
              Six years of shipping to <Accent>production.</Accent>
            </>
          }
          description="From modernising legacy JSP apps to running event-driven microservices on Kubernetes — here's where I've done it."
        />

        <div ref={ref} className="relative ml-2 md:ml-4">
          <div className="absolute left-0 top-0 h-full w-px bg-line" />
          <motion.div
            style={{ scaleY }}
            className="absolute left-0 top-0 h-full w-px origin-top bg-gradient-to-b from-violet-400 via-accent to-cyan-400"
          />
          <div className="space-y-8">
            {experience.map((job, i) => (
              <JobCard key={job.company} job={job} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
