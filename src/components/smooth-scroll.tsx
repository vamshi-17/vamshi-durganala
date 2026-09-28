"use client";

import { useEffect } from "react";
import Lenis from "lenis";

let lenis: Lenis | null = null;

/** Scrolls to a section by id, through Lenis when it's running. */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: id === "home" ? 0 : -72 });
  else el.scrollIntoView({ behavior: "smooth" });
}

/** Inertial smooth scrolling; skipped entirely for reduced-motion users. */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    lenis = new Lenis({ autoRaf: true, lerp: 0.1, anchors: { offset: -72 } });
    return () => {
      lenis?.destroy();
      lenis = null;
    };
  }, []);
  return null;
}
