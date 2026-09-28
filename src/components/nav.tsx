"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from "framer-motion";
import { Download, Menu, X } from "lucide-react";
import { nav, profile } from "@/data/profile";
import { asset, cn } from "@/lib/utils";
import { ease } from "@/components/ui/reveal";

export function Nav() {
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 24));

  // Highlight whichever section crosses the middle of the viewport.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ["home", ...nav.map((n) => n.id)].forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <motion.div
        aria-hidden
        className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-gradient-to-r from-violet-400 via-accent to-cyan-400"
        style={{ scaleX: progress }}
      />

      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease }}
        className="fixed inset-x-0 top-4 z-50 flex justify-center px-4"
      >
        <nav
          className={cn(
            "flex w-full max-w-3xl items-center justify-between gap-2 rounded-full border px-2 py-2 transition-all duration-500",
            scrolled
              ? "border-line-strong bg-surface/70 shadow-2xl shadow-black/40 backdrop-blur-xl"
              : "border-transparent bg-transparent",
          )}
        >
          <a href="#home" className="group flex items-center gap-2 rounded-full px-3 py-1.5" aria-label="Back to top">
            <span className="grid size-7 place-items-center rounded-lg bg-gradient-to-br from-violet-500 to-cyan-400 font-mono text-[11px] font-bold text-bg transition-transform duration-300 group-hover:rotate-12">
              VK
            </span>
            <span className="hidden text-sm font-medium sm:inline">{profile.firstName}</span>
          </a>

          <ul className="hidden items-center md:flex">
            {nav.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={cn(
                    "relative isolate block rounded-full px-4 py-2 text-sm transition-colors",
                    active === item.id ? "text-fg" : "text-muted hover:text-fg",
                  )}
                >
                  {active === item.id && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full border border-line-strong bg-white/[0.06]"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-1">
            <a
              href={asset(profile.resume)}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-2 rounded-full bg-fg px-4 py-2 text-sm font-medium text-bg transition hover:bg-white sm:flex"
            >
              <Download className="size-4" />
              Résumé
            </a>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              className="grid size-10 place-items-center rounded-full text-fg md:hidden"
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-bg/90 backdrop-blur-2xl md:hidden"
            onClick={() => setOpen(false)}
          >
            <motion.ul
              className="flex h-full flex-col justify-center gap-2 px-8"
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } } }}
            >
              {nav.map((item, i) => (
                <motion.li
                  key={item.id}
                  variants={{ hidden: { opacity: 0, x: -24 }, show: { opacity: 1, x: 0, transition: { ease, duration: 0.5 } } }}
                >
                  <a href={`#${item.id}`} className="flex items-baseline gap-4 py-2 text-4xl font-semibold tracking-tight">
                    <span className="font-mono text-sm text-accent">0{i + 1}</span>
                    {item.label}
                  </a>
                </motion.li>
              ))}
              <motion.li variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }} className="mt-8">
                <a
                  href={asset(profile.resume)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-fg px-5 py-3 text-sm font-medium text-bg"
                >
                  <Download className="size-4" /> Download résumé
                </a>
              </motion.li>
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
