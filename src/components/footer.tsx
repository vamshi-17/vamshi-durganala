"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { profile } from "@/data/profile";
import { navigateTo } from "@/components/smooth-scroll";
import { ease } from "@/components/ui/reveal";

const BUILD_YEAR = new Date().getFullYear();

export function Footer() {
  // The static HTML carries the build year; correct it after hydration so an old build never shows a stale year
  // (and never mismatches during hydration).
  const [year, setYear] = useState(BUILD_YEAR);
  useEffect(() => setYear(new Date().getFullYear()), []);

  return (
    <footer className="relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-5 md:px-6">
        <div className="overflow-hidden">
          <motion.p
            initial={{ y: "100%" }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, ease }}
            className="font-display text-[clamp(4.5rem,22vw,17rem)] leading-[0.8] text-surface-2 select-none"
            aria-hidden
          >
            200 <span className="text-lime/90">OK</span>
          </motion.p>
        </div>
      </div>

      {/* IDE-style status bar */}
      <div className="border-t border-line bg-surface font-mono text-[11px] text-muted">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-5 py-3 md:px-6">
          <span className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-lime" />
            all systems operational
          </span>
          <span className="hidden md:inline">next.js · framer motion · lenis · tailwind</span>
          <span className="flex items-center gap-4">
            <span>© {year} {profile.name}</span>
            <button
              type="button"
              onClick={() => navigateTo("home")}
              className="flex items-center gap-1 text-fg transition hover:text-lime"
              aria-label="Back to top"
            >
              <ArrowUp className="size-3.5" /> top
            </button>
          </span>
        </div>
      </div>
    </footer>
  );
}
