"use client";

import { useEffect, useState } from "react";
import { scrollToId } from "@/components/smooth-scroll";
import { useActiveSection } from "@/lib/use-active-section";
import { isSection, sectionFromPath, sectionPath, sectionTitle, type SectionId } from "@/lib/sections";

/**
 * Keeps the address bar and the scroll position in step:
 * - on load, jumps to the section in the URL (/about/) or a legacy #about fragment (and tidies it to /about/)
 * - while scrolling, quietly replaces the URL and tab title with the section in view (no new history entries)
 * - on back/forward, scrolls to the section of the restored URL
 */
export function RouteSync({ initial = "home" }: { initial?: SectionId }) {
  const active = useActiveSection();
  // Scroll-spy may rewrite the URL only once the initial jump has landed. State (not a ref) so that the moment it
  // flips, the effect below syncs whatever section the reader already scrolled to.
  const [ready, setReady] = useState(false);

  useEffect(() => {
    window.history.scrollRestoration = "manual";
    const hash = window.location.hash.slice(1);
    const target: SectionId = isSection(hash) ? hash : initial;

    if (hash) window.history.replaceState(null, "", sectionPath(target));
    document.title = sectionTitle(target);

    // The page keeps growing just after hydration (e.g. the pinned project cards switch to their tall desktop layout),
    // so re-aim the jump whenever the layout resizes — until the visitor scrolls themselves or things settle.
    let userMoved = false;
    const jump = () => !userMoved && target !== "home" && scrollToId(target, { instant: true });
    const onUserScroll = () => (userMoved = true);
    const userEvents = ["wheel", "touchstart", "keydown", "pointerdown"] as const;
    userEvents.forEach((ev) => window.addEventListener(ev, onUserScroll, { passive: true }));
    const ro = new ResizeObserver(jump);
    ro.observe(document.body);
    const raf = requestAnimationFrame(jump);

    // Don't let scroll-spy rewrite the URL while the initial jump is still landing.
    const settle = setTimeout(() => {
      ro.disconnect();
      setReady(true);
      // Next re-applies the route's metadata title after hydration; restate ours for the section actually shown.
      document.title = sectionTitle(sectionFromPath(window.location.pathname));
    }, 1200);

    const onPop = () => scrollToId(sectionFromPath(window.location.pathname));
    window.addEventListener("popstate", onPop);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(settle);
      ro.disconnect();
      userEvents.forEach((ev) => window.removeEventListener(ev, onUserScroll));
      window.removeEventListener("popstate", onPop);
    };
  }, [initial]);

  useEffect(() => {
    if (!ready) return;
    // Debounced so sections flashed past during a smooth scroll don't each rewrite the URL.
    const t = setTimeout(() => {
      const id = active as SectionId;
      const path = sectionPath(id);
      if (window.location.pathname !== path) window.history.replaceState(null, "", path);
      document.title = sectionTitle(id);
    }, 400);
    return () => clearTimeout(t);
  }, [active, ready]);

  return null;
}
