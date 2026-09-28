"use client";

import { useEffect } from "react";
import Lenis from "lenis";

let lenis: Lenis | null = null;

/** Scrolls to a section by id, through Lenis when it's running. */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  // Nav clearance comes from `scroll-margin-top` on sections (globals.css), which both Lenis and the browser honour,
  // so no extra offset here — adding one double-counts it.
  if (lenis) lenis.scrollTo(el);
  else el.scrollIntoView({ behavior: "auto" }); // Lenis is off (reduced motion): jump without animating
}

/** Inertial smooth scrolling; skipped entirely for reduced-motion users. */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    lenis = new Lenis({ autoRaf: true, lerp: 0.1, anchors: true });
    return () => {
      lenis?.destroy();
      lenis = null;
    };
  }, []);
  return null;
}
