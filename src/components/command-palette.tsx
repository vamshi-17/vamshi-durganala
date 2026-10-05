"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDownToLine, CornerDownLeft, Copy, Github, Hash, Linkedin, Mail, Search } from "lucide-react";
import { hops, profile } from "@/data/profile";
import { asset, cn, copyText } from "@/lib/utils";
import { navigateTo } from "@/components/smooth-scroll";
import { countEvent } from "@/components/analytics";

const OPEN_EVENT = "palette:open";
export const openPalette = () => window.dispatchEvent(new Event(OPEN_EVENT));

type Action = { id: string; label: string; hint: string; icon: React.ElementType; run: () => void };

function useActions(): Action[] {
  return useMemo(
    () => [
      ...hops.map((h) => ({
        id: `go-${h.id}`,
        label: `Go to ${h.route === "/" ? "/home" : h.route}`,
        hint: h.layer,
        icon: Hash,
        run: () => navigateTo(h.id),
      })),
      { id: "copy", label: "Copy email address", hint: profile.email, icon: Copy, run: () => void copyText(profile.email) },
      { id: "mail", label: "Send an email", hint: "mailto", icon: Mail, run: () => (window.location.href = `mailto:${profile.email}`) },
      { id: "resume", label: "Download résumé", hint: "PDF", icon: ArrowDownToLine, run: () => (countEvent("resume-download"), window.open(asset(profile.resume), "_blank")) },
      { id: "github", label: "Open GitHub", hint: "@vamshi-17", icon: Github, run: () => (countEvent("outbound/github.com"), window.open(profile.socials.github, "_blank")) },
      { id: "linkedin", label: "Open LinkedIn", hint: "in/", icon: Linkedin, run: () => (countEvent("outbound/linkedin.com"), window.open(profile.socials.linkedin, "_blank")) },
    ],
    [],
  );
}

/** ⌘K / Ctrl+K palette for jumping around the page and quick actions. */
export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const actions = useActions();

  const results = actions.filter((a) => `${a.label} ${a.hint}`.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_EVENT, onOpen);
    };
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setCursor(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [open]);

  const run = (a?: Action) => {
    if (!a) return;
    setOpen(false);
    // Run synchronously inside the click/keypress so window.open isn't treated as an unsolicited popup.
    a.run();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[70] flex items-start justify-center bg-black/60 px-4 pt-[15vh] backdrop-blur-sm"
          onClick={() => setOpen(false)}
          data-lenis-prevent
        >
          <motion.div
            role="dialog"
            aria-label="Command palette"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 500, damping: 36 }}
            className="w-full max-w-lg overflow-hidden rounded-xl border border-line-strong bg-surface shadow-2xl shadow-black/60"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-line px-4">
              <Search className="size-4 text-muted" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setCursor(0);
                }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setCursor((c) => Math.min(c + 1, results.length - 1));
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setCursor((c) => Math.max(c - 1, 0));
                  } else if (e.key === "Enter") {
                    run(results[cursor]);
                  } else if (e.key === "Escape") {
                    setOpen(false);
                  }
                }}
                placeholder="Type a command or search…"
                className="h-12 w-full bg-transparent font-mono text-sm outline-none placeholder:text-subtle"
                aria-label="Search commands"
              />
              <kbd className="rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-subtle">ESC</kbd>
            </div>
            <ul className="max-h-80 overflow-y-auto p-2">
              {results.length === 0 && <li className="px-3 py-6 text-center font-mono text-sm text-subtle">404 — no matching command</li>}
              {results.map((a, i) => (
                <li key={a.id}>
                  <button
                    type="button"
                    onMouseEnter={() => setCursor(i)}
                    onClick={() => run(a)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                      i === cursor ? "bg-lime text-bg" : "text-fg",
                    )}
                  >
                    <a.icon className="size-4 shrink-0" />
                    <span className="flex-1">{a.label}</span>
                    <span className={cn("font-mono text-xs", i === cursor ? "text-bg/70" : "text-subtle")}>{a.hint}</span>
                    {i === cursor && <CornerDownLeft className="size-3.5" />}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
