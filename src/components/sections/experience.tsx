"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { services, type CommitType } from "@/data/profile";
import { Mark, SectionHeading } from "@/components/ui/section-heading";
import { Reveal, ease } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

const typeColor: Record<CommitType, string> = {
  feat: "text-lime",
  perf: "text-warn",
  sec: "text-[#7cc7ff]",
  test: "text-[#c4a7ff]",
  ops: "text-fg",
  refactor: "text-muted",
};

/** Stable fake short-SHA so each changelog line looks like a real commit. */
function sha(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return (h >>> 0).toString(16).padStart(8, "0").slice(0, 7);
}

export function Experience() {
  const [activeId, setActiveId] = useState(services[0].id);
  const svc = services.find((s) => s.id === activeId)!;

  return (
    <section id="experience" className="relative py-28 md:py-40">
      <div className="mx-auto max-w-6xl px-5 md:px-6">
        <SectionHeading
          hop="experience"
          title={
            <>
              Three services, <Mark>six years</Mark> in production.
            </>
          }
          lede="Every role I've had, as a running service. Pick one to read its changelog."
        />

        <Reveal className="grid overflow-hidden rounded-xl border border-line-strong bg-surface lg:grid-cols-[300px_1fr]">
          {/* registry */}
          <div className="min-w-0 border-b border-line lg:border-r lg:border-b-0">
            <p className="border-b border-line px-4 py-3 font-mono text-xs text-subtle">
              <span className="text-lime">$</span> kubectl get svc <span className="text-muted">-n career</span>
            </p>
            <div className="hidden grid-cols-[1fr_auto] px-4 pt-3 pb-1 font-mono text-[10px] uppercase tracking-wider text-subtle lg:grid">
              <span>name</span>
              <span>status</span>
            </div>
            <ul className="flex overflow-x-auto lg:block lg:overflow-visible lg:pb-2" role="tablist" aria-label="Roles">
              {services.map((s) => {
                const active = s.id === activeId;
                return (
                  <li key={s.id} className="shrink-0">
                    <button
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setActiveId(s.id)}
                      className="relative w-full px-4 py-3.5 text-left"
                    >
                      {active && (
                        <motion.span
                          layoutId="svc-active"
                          className="absolute inset-0 bg-surface-2"
                          transition={{ type: "spring", stiffness: 420, damping: 36 }}
                        >
                          <span className="absolute bottom-0 left-0 h-0.5 w-full bg-lime lg:top-0 lg:h-full lg:w-0.5" />
                        </motion.span>
                      )}
                      <span className="relative flex items-center justify-between gap-6">
                        <span>
                          <span className={cn("block font-mono text-sm", active ? "text-fg" : "text-muted")}>{s.id}</span>
                          <span className="mt-0.5 block font-mono text-[11px] text-subtle">{s.period}</span>
                        </span>
                        <span className="flex items-center gap-1.5 font-mono text-[11px]">
                          <span className={cn("size-1.5 rounded-full", s.running ? "animate-pulse bg-lime" : "bg-subtle")} />
                          <span className={s.running ? "text-lime" : "text-subtle"}>{s.running ? "Running" : "Completed"}</span>
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* detail */}
          <div className="relative min-w-0 p-6 md:p-10 lg:min-h-[560px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={svc.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease }}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display text-4xl md:text-5xl">{svc.role}</h3>
                    <p className="mt-2 text-lg">
                      <span className="text-lime">@{svc.company}</span>
                      <span className="text-muted"> · {svc.location}</span>
                    </p>
                  </div>
                  <span className="rounded-md border border-line px-2.5 py-1 font-mono text-xs text-muted">{svc.period}</span>
                </div>
                <p className="mt-6 max-w-2xl leading-relaxed text-muted text-pretty">{svc.summary}</p>

                <p className="mt-9 mb-3 font-mono text-xs text-subtle">
                  <span className="text-lime">$</span> git log --oneline
                </p>
                <ul className="space-y-2.5 font-mono text-[13px] leading-relaxed">
                  {svc.changelog.map(([type, msg], i) => (
                    <motion.li
                      key={msg}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.05, duration: 0.35, ease }}
                      className="grid grid-cols-[auto_1fr] gap-3"
                    >
                      <span className="text-subtle">{sha(msg)}</span>
                      <span className="text-fg/85">
                        <span className={typeColor[type]}>{type}:</span> {msg}
                      </span>
                    </motion.li>
                  ))}
                </ul>

                <div className="mt-9 flex flex-wrap gap-1.5 border-t border-line pt-6">
                  {svc.stack.map((t) => (
                    <span key={t} className="rounded border border-line px-2 py-1 font-mono text-[11px] text-muted">
                      {t}
                    </span>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
