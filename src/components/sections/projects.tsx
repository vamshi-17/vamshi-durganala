"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { ArrowUpRight, Lock } from "lucide-react";
import { projects, type Project } from "@/data/profile";
import { Mark, SectionHeading } from "@/components/ui/section-heading";
import { ExpenseMock, HemoMock, JobFeedMock } from "@/components/project-mocks";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

const mocks = { jobs: JobFeedMock, expense: ExpenseMock, hemo: HemoMock };

function useIsDesktop() {
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return desktop;
}

function ProjectCard({
  project,
  i,
  progress,
  stacked,
}: {
  project: Project;
  i: number;
  progress: MotionValue<number>;
  stacked: boolean;
}) {
  const n = projects.length;
  // Earlier cards shrink slightly as later ones slide over them.
  const scale = useTransform(progress, [i / n, 1], [1, 1 - (n - 1 - i) * 0.05]);
  const Mock = mocks[project.id];

  return (
    // Each pinned card gets an extra half-screen of scroll so it can be read before the next slides over it.
    <div className={cn(stacked ? (i < n - 1 ? "h-[150vh]" : "h-screen") : "mb-6")}>
      <div className={cn(stacked && "sticky top-0 flex h-screen items-center")}>
        <motion.article
          style={stacked ? { scale, top: i * 26 } : undefined}
          className="relative grid w-full origin-top overflow-hidden rounded-2xl border border-line-strong bg-surface lg:h-[min(84vh,700px)] lg:grid-cols-[1fr_1.05fr]"
        >
          <div className="flex min-w-0 flex-col p-7 md:p-9">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-lime">
                {project.index}
                <span className="text-subtle"> / 0{n}</span>
              </span>
              <span className="text-subtle">{project.meta}</span>
            </div>

            <h3 className="mt-5 font-display text-[clamp(2.1rem,3.8vw,3.25rem)] leading-[0.95]">{project.name}</h3>
            <p className="mt-3 text-lg text-fg text-pretty">{project.tagline}</p>
            <p className="mt-3 text-[15px] leading-relaxed text-muted text-pretty">{project.problem}</p>

            <ul className="mt-5 space-y-1.5 text-sm text-fg/85">
              {project.built.map((b) => (
                <li key={b} className="flex gap-3">
                  <span className="mt-[7px] size-1.5 shrink-0 rounded-[2px] bg-lime" />
                  {b}
                </li>
              ))}
            </ul>

            <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-6">
              <div className="flex flex-wrap gap-1.5">
                {project.stack.map((s) => (
                  <span key={s} className="rounded border border-line px-2 py-0.5 font-mono text-[11px] text-muted">
                    {s}
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                {project.links.length === 0 ? (
                  <span className="flex items-center gap-1.5 font-mono text-xs text-subtle">
                    <Lock className="size-3.5" /> private repo · demo on request
                  </span>
                ) : (
                  project.links.map((l) => (
                    <a
                      key={l.href}
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-1 rounded-md border border-line-strong px-3 py-1.5 text-sm transition hover:border-lime hover:text-lime"
                    >
                      {l.label}
                      <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="relative flex items-center justify-center overflow-hidden border-t border-line bg-bg/50 p-8 lg:border-t-0 lg:border-l">
            <div className="absolute inset-0 bg-dots" />
            <div className="absolute -right-24 -bottom-24 size-72 rounded-full bg-[radial-gradient(closest-side,rgb(200_243_29/0.12),transparent)]" />
            <div className="relative flex w-full justify-center">
              <Mock />
            </div>
          </div>
        </motion.article>
      </div>
    </div>
  );
}

export function Projects() {
  const ref = useRef<HTMLDivElement>(null);
  const stacked = useIsDesktop();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  return (
    <section id="projects" className="relative pt-28 md:pt-40">
      <div className="mx-auto max-w-6xl px-5 md:px-6">
        <SectionHeading
          hop="projects"
          title={
            <>
              Things I build <Mark>for myself.</Mark>
            </>
          }
          lede="Side projects where I own every layer — from the schema to the pixels. Scroll through them."
        />
        <Reveal y={40}>
          <div ref={ref} className="relative pb-10">
            {projects.map((p, i) => (
              <ProjectCard key={p.id} project={p} i={i} progress={scrollYProgress} stacked={stacked} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
