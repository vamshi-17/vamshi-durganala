"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { Check } from "lucide-react";
import { projects, type Project } from "@/data/profile";
import { Accent, SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

function ProjectCard({ project, index, featured }: { project: Project; index: number; featured?: boolean }) {
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rotateX = useSpring(useMotionValue(0), { stiffness: 150, damping: 18 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 150, damping: 18 });
  const glow = useMotionTemplate`radial-gradient(500px circle at calc(${px} * 100%) calc(${py} * 100%), rgb(255 255 255 / 0.07), transparent 60%)`;

  return (
    <Reveal delay={index * 0.1} className={cn("[perspective:1400px]", featured && "lg:col-span-2")}>
      <motion.article
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width;
          const y = (e.clientY - r.top) / r.height;
          px.set(x);
          py.set(y);
          rotateY.set((x - 0.5) * (featured ? 6 : 10));
          rotateX.set(-(y - 0.5) * (featured ? 6 : 10));
        }}
        onMouseLeave={() => {
          rotateX.set(0);
          rotateY.set(0);
        }}
        className="group relative h-full overflow-hidden rounded-3xl border border-line bg-surface/70 backdrop-blur-md transition-colors duration-500 hover:border-line-strong"
      >
        <div className={cn("absolute inset-0 bg-gradient-to-br to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-100", project.accent)} />
        <motion.div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: glow }} />
        <div className="absolute inset-0 bg-grid opacity-30 [mask-image:linear-gradient(to_bottom,black,transparent_70%)]" />

        <div className={cn("relative flex h-full flex-col p-8 md:p-10", featured && "lg:flex-row lg:gap-12")}>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted">{project.context}</span>
              <span className="font-mono text-xs text-subtle transition-colors duration-500 group-hover:text-fg">
                0{index + 1}
              </span>
            </div>
            <h3
              className={cn(
                "mt-8 font-semibold tracking-tight text-balance",
                featured ? "text-3xl md:text-5xl" : "text-2xl md:text-3xl",
              )}
              style={{ transform: "translateZ(40px)" }}
            >
              {project.title}
            </h3>
            <p className="mt-4 max-w-xl leading-relaxed text-muted text-pretty">{project.description}</p>
          </div>

          <div className={cn("mt-8 flex flex-col justify-end", featured && "lg:mt-0 lg:w-80")}>
            <ul className="space-y-2.5">
              {project.points.map((p) => (
                <li key={p} className="flex items-center gap-2.5 text-sm text-fg/85">
                  <span className="grid size-5 place-items-center rounded-full bg-white/5">
                    <Check className="size-3 text-accent" />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-1.5">
              {project.stack.map((s) => (
                <span key={s} className="rounded-full border border-line bg-bg/40 px-2.5 py-1 font-mono text-[11px] text-muted">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.article>
    </Reveal>
  );
}

export function Work() {
  return (
    <section id="work" className="relative py-28 md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          index="03"
          eyebrow="Selected work"
          title={
            <>
              Things I&apos;ve <Accent>built</Accent> and shipped.
            </>
          }
          description="Enterprise platforms I've helped design, build and run — the kind of work that lives behind a login, so here are the highlights."
        />
        <div className="grid gap-5 lg:grid-cols-2">
          {projects.map((p, i) => (
            <ProjectCard key={p.title} project={p} index={i} featured={i === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}
