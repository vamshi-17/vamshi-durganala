"use client";

import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { ArrowDownToLine, Menu, Search, X } from "lucide-react";
import { hops, profile } from "@/data/profile";
import { asset, cn } from "@/lib/utils";
import { useActiveSection } from "@/lib/use-active-section";
import { modifierKey, useKeyboardKind } from "@/lib/keyboard";
import { ease } from "@/components/ui/reveal";
import { openPalette } from "@/components/command-palette";
import { SectionLink } from "@/components/ui/section-link";

const links = hops.slice(1);

export function Nav() {
  const active = useActiveSection();
  const keyboard = useKeyboardKind();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 16));

  return (
    <>
      <motion.header
        initial={{ y: -64, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.1, ease }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300",
          scrolled ? "border-line bg-bg/85 backdrop-blur-md" : "border-transparent",
        )}
      >
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 md:px-6">
          <SectionLink to="home" className="font-mono text-sm" aria-label="Back to top">
            <span className="text-lime">vamshi</span>
            <span className="text-subtle">@prod</span>
            <span className="text-muted">:~$</span>
            <span className="ml-1 inline-block h-4 w-2 translate-y-0.5 animate-blink bg-lime" />
          </SectionLink>

          <ul className="hidden items-center gap-1 md:flex">
            {links.map(({ id, route }) => (
              <li key={id}>
                <SectionLink
                  to={id}
                  className={cn(
                    "relative block px-3 py-2 font-mono text-[13px] transition-colors",
                    active === id ? "text-lime" : "text-muted hover:text-fg",
                  )}
                >
                  {route}
                  {active === id && (
                    <motion.span
                      layoutId="nav-dot"
                      className="absolute inset-x-3 -bottom-px h-px bg-lime"
                      transition={{ type: "spring", stiffness: 400, damping: 34 }}
                    />
                  )}
                </SectionLink>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openPalette}
              className="hidden items-center gap-1.5 rounded-md border border-line-strong px-2.5 py-1.5 font-mono text-xs text-muted transition hover:border-fg/40 hover:text-fg sm:flex"
              aria-label="Open command palette"
              aria-keyshortcuts="Control+K Meta+K"
            >
              <Search className="size-3.5" />
              {/* The shortcut label depends on the device, so it only appears once known (none on touch-only). */}
              {keyboard && keyboard !== "touch" && <span data-testid="palette-shortcut">{`${modifierKey(keyboard)} K`}</span>}
            </button>
            <a
              href={asset(profile.resume)}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-2 rounded-md bg-lime px-3.5 py-1.5 text-sm font-semibold text-bg transition hover:bg-fg sm:flex"
            >
              <ArrowDownToLine className="size-4" />
              Résumé
            </a>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              className="grid size-10 place-items-center rounded-md text-fg md:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.5, ease }}
            className="fixed inset-0 z-40 flex flex-col bg-bg px-6 pt-24 pb-10 md:hidden"
            onClick={() => setOpen(false)}
          >
            <ul className="flex flex-col gap-1">
              {links.map(({ id, route, layer }, i) => (
                <motion.li
                  key={id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.05, ease, duration: 0.5 }}
                >
                  <SectionLink to={id} className="flex items-baseline justify-between border-b border-line py-4">
                    <span className="font-display text-4xl">{route}</span>
                    <span className="font-mono text-xs text-subtle">{layer}</span>
                  </SectionLink>
                </motion.li>
              ))}
            </ul>
            <a
              href={asset(profile.resume)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto flex items-center justify-center gap-2 rounded-md bg-lime py-3.5 font-semibold text-bg"
            >
              <ArrowDownToLine className="size-4" /> Download résumé
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
