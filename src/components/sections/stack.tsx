"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { layers, traces, type TraceId } from "@/data/profile";
import { Mark, SectionHeading } from "@/components/ui/section-heading";
import { Reveal, ease } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

type Point = { x: number; y: number };

/** Smooth vertical S-curves between consecutive points. */
function toPath(pts: Point[]) {
  if (pts.length < 2) return "";
  return pts.reduce((d, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = pts[i - 1];
    const my = (prev.y + p.y) / 2;
    return `${d} C ${prev.x} ${my}, ${p.x} ${my}, ${p.x} ${p.y}`;
  }, "");
}

export function Stack() {
  const [traceId, setTraceId] = useState<TraceId | null>("login");
  const [d, setD] = useState("");
  const mapRef = useRef<HTMLDivElement>(null);
  const chips = useRef(new Map<string, HTMLElement>());
  const inView = useInView(mapRef, { once: true, margin: "-20%" });

  const trace = traces.find((t) => t.id === traceId);
  const step = (name: string) => (trace ? (trace.path as readonly string[]).indexOf(name) : -1);

  const measure = useCallback(() => {
    const box = mapRef.current?.getBoundingClientRect();
    if (!box || !trace) return setD("");
    const pts = trace.path.flatMap((name) => {
      const r = chips.current.get(name)?.getBoundingClientRect();
      return r ? [{ x: r.left - box.left + r.width / 2, y: r.top - box.top + r.height / 2 }] : [];
    });
    setD(toPath(pts));
  }, [trace]);

  useLayoutEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (mapRef.current) ro.observe(mapRef.current);
    return () => ro.disconnect();
  }, [measure]);

  return (
    <section id="stack" className="relative py-28 md:py-40">
      <div className="mx-auto max-w-6xl px-5 md:px-6">
        <SectionHeading
          hop="stack"
          title={
            <>
              My stack, as a <Mark>system.</Mark>
            </>
          }
          lede="Not a list of logos — this is how the pieces actually connect. Trace a real request through the layers I work in."
        />

        <Reveal>
          <div className="mb-4 flex flex-wrap gap-2" role="tablist" aria-label="Request traces">
            {traces.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={t.id === traceId}
                onClick={() => setTraceId(t.id)}
                className={cn(
                  "relative rounded-md border px-3.5 py-2 font-mono text-xs transition-colors",
                  t.id === traceId ? "border-lime text-bg" : "border-line-strong text-muted hover:border-fg/40 hover:text-fg",
                )}
              >
                {t.id === traceId && (
                  <motion.span layoutId="trace-tab" className="absolute inset-0 bg-lime" transition={{ type: "spring", stiffness: 420, damping: 34 }} />
                )}
                <span className="relative">▸ {t.label}</span>
              </button>
            ))}
            <button
              type="button"
              onClick={() => setTraceId(null)}
              className={cn(
                "rounded-md px-3.5 py-2 font-mono text-xs transition-colors",
                traceId === null ? "text-fg underline underline-offset-4" : "text-subtle hover:text-fg",
              )}
            >
              show everything
            </button>
          </div>

          <div className="mb-8 min-h-[3.5rem] max-w-3xl">
            <AnimatePresence mode="wait">
              <motion.p
                key={traceId ?? "all"}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                className="text-muted text-pretty"
              >
                {trace ? trace.note : "Everything I've used in production or shipped in my own projects, grouped by where it lives in a system."}
              </motion.p>
            </AnimatePresence>
          </div>

          <div ref={mapRef} className="relative overflow-hidden rounded-xl border border-line-strong bg-surface">
            {layers.map((layer, li) => (
              <div
                key={layer.id}
                className="grid gap-3 border-b border-line px-5 py-4 last:border-b-0 md:grid-cols-[170px_1fr] md:items-center md:gap-6 md:px-6"
              >
                <div className="flex items-baseline gap-3 font-mono text-xs">
                  <span className="text-subtle">L{li}</span>
                  <span className="uppercase tracking-[0.15em] text-fg">{layer.name}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {layer.items.map((item) => {
                    const s = step(item);
                    const on = s >= 0;
                    return (
                      <span
                        key={item}
                        ref={(el) => {
                          if (el) chips.current.set(item, el);
                          else chips.current.delete(item);
                        }}
                        className={cn(
                          "relative z-10 rounded-md border px-2.5 py-1.5 text-[13px] transition-all duration-500",
                          on
                            ? "border-lime bg-[#1d2310] text-lime"
                            : trace
                              ? "border-line bg-surface text-subtle"
                              : "border-line-strong bg-surface text-fg/85 hover:border-lime/60 hover:text-lime",
                        )}
                      >
                        {item}
                        {on && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2 + s * 0.12, type: "spring", stiffness: 500, damping: 20 }}
                            className="absolute -top-2 -right-2 grid size-4 place-items-center rounded-full bg-lime font-mono text-[9px] font-bold text-bg"
                          >
                            {s + 1}
                          </motion.span>
                        )}
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* trace overlay */}
            {inView && d && (
              <svg className="pointer-events-none absolute inset-0 size-full" aria-hidden>
                <motion.path
                  key={`glow-${traceId}`}
                  d={d}
                  fill="none"
                  stroke="rgb(200 243 29 / 0.18)"
                  strokeWidth={8}
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.4, ease }}
                />
                <motion.path
                  key={`line-${traceId}`}
                  d={d}
                  fill="none"
                  stroke="#c8f31d"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.4, ease }}
                />
              </svg>
            )}
            {inView && d && (
              <span
                key={`packet-${traceId}`}
                aria-hidden
                className="pointer-events-none absolute top-0 left-0 z-20 size-2.5 rounded-full bg-lime shadow-[0_0_14px_4px_rgb(200_243_29/0.6)] animate-[travel_3.2s_1.4s_cubic-bezier(0.45,0,0.55,1)_infinite_both]"
                style={{ offsetPath: `path('${d}')`, offsetRotate: "0deg" }}
              />
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
