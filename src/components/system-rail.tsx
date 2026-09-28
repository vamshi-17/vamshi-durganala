"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { hops } from "@/data/profile";
import { useActiveSection } from "@/lib/use-active-section";
import { navigateTo } from "@/components/smooth-scroll";
import { cn } from "@/lib/utils";

const GAP = 56; // px between nodes
const HEIGHT = GAP * (hops.length - 1);

/**
 * The page's signature: a vertical pipeline (client → … → response) pinned to the left edge.
 * A lime packet travels down it in step with the reader's position between sections.
 */
export function SystemRail() {
  const active = useActiveSection();
  const tops = useRef<number[]>([]);
  const progress = useMotionValue(0); // fractional hop index
  const smooth = useSpring(progress, { stiffness: 160, damping: 26, mass: 0.4 });
  const y = useTransform(smooth, (v) => v * GAP);
  const fill = useTransform(smooth, (v) => v / (hops.length - 1));
  const { scrollY } = useScroll();

  useEffect(() => {
    const measure = () => {
      tops.current = hops.map(({ id }) => document.getElementById(id)?.offsetTop ?? 0);
    };
    const update = (sy: number) => {
      const t = tops.current;
      const probe = sy + window.innerHeight * 0.4;
      let i = 0;
      while (i < t.length - 1 && probe >= t[i + 1]) i++;
      const span = (t[i + 1] ?? t[i] + 1) - t[i];
      const frac = i === t.length - 1 ? 0 : Math.min(1, Math.max(0, (probe - t[i]) / span));
      progress.set(i + frac);
    };
    measure();
    update(window.scrollY);
    const ro = new ResizeObserver(() => {
      measure();
      update(window.scrollY);
    });
    ro.observe(document.body);
    const unsub = scrollY.on("change", update);
    return () => {
      ro.disconnect();
      unsub();
    };
  }, [progress, scrollY]);

  const activeIndex = hops.findIndex((h) => h.id === active);

  return (
    <motion.aside
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.2, duration: 0.8 }}
      aria-label="Page sections"
      className="fixed top-1/2 left-8 z-40 hidden -translate-y-1/2 min-[1400px]:block"
    >
      <div className="relative" style={{ height: HEIGHT }}>
        <div className="absolute left-[5px] top-0 h-full w-px bg-line-strong" />
        <motion.div className="absolute left-[5px] top-0 h-full w-px origin-top bg-lime" style={{ scaleY: fill }} />

        {hops.map((hop, i) => (
          <button
            key={hop.id}
            type="button"
            onClick={() => navigateTo(hop.id)}
            className="group absolute left-0 flex -translate-y-1/2 items-center gap-3"
            style={{ top: i * GAP }}
            aria-label={`Go to ${hop.layer}`}
          >
            <span
              className={cn(
                "size-[11px] rounded-[3px] border transition-colors duration-300",
                i <= activeIndex ? "border-lime bg-bg" : "border-line-strong bg-bg group-hover:border-fg/50",
              )}
            />
            <AnimatePresence>
              {i === activeIndex && (
                <motion.span
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -6 }}
                  className="font-mono text-[11px] uppercase tracking-[0.18em] text-lime"
                >
                  {hop.layer}
                </motion.span>
              )}
            </AnimatePresence>
            {i !== activeIndex && (
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-subtle opacity-0 transition-opacity group-hover:opacity-100">
                {hop.layer}
              </span>
            )}
          </button>
        ))}

        <motion.span
          aria-hidden
          style={{ y }}
          className="absolute -top-[4px] left-[1.5px] size-2 rounded-full bg-lime shadow-[0_0_14px_3px_rgb(200_243_29/0.55)]"
        />
      </div>
    </motion.aside>
  );
}
