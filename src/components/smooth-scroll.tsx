"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { sectionPath, type SectionId } from "@/lib/sections";

let lenis: Lenis | null = null;

/** Scrolls to a section by id, through Lenis when it's running. `instant` skips the animation (e.g. on page load). */
export function scrollToId(id: string, { instant = false } = {}) {
  const el = document.getElementById(id);
  if (!el) return;
  // Nav clearance comes from `scroll-margin-top` on sections (globals.css), which both Lenis and the browser honour,
  // so no extra offset here — adding one double-counts it.
  if (lenis) {
    const l = lenis;
    // Lenis caches the scroll limit; if the page just grew, re-measure or the jump is clamped short.
    if (instant) l.resize();
    l.scrollTo(el, {
      immediate: instant,
      // Content above can change height mid-scroll (e.g. the hero console finishing its response); if the target
      // drifted by the time we arrive, glide the remaining distance once.
      onComplete: () => {
        const margin = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
        if (Math.abs(el.getBoundingClientRect().top - margin) > 2) {
          l.resize();
          l.scrollTo(el, { duration: 0.4 });
        }
      },
    });
  } else el.scrollIntoView({ behavior: "auto" }); // Lenis is off (reduced motion): jump without animating
}

/** In-page navigation: scroll to the section and put its clean URL (/about/) in the address bar as a history entry. */
export function navigateTo(id: SectionId) {
  scrollToId(id);
  const path = sectionPath(id);
  if (window.location.pathname !== path) window.history.pushState(null, "", path);
}

/** Inertial smooth scrolling; skipped entirely for reduced-motion users. */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    lenis = new Lenis({ autoRaf: true, lerp: 0.1 });
    return () => {
      lenis?.destroy();
      lenis = null;
    };
  }, []);
  return null;
}
