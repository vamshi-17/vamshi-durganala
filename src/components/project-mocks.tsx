"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { Bell, CalendarClock, Droplet, FileText, MessageSquare, Pill, Stethoscope, UserPlus } from "lucide-react";
import Image from "next/image";
import { asset, cn } from "@/lib/utils";

/** Runs `fn` every `ms` only while `ref` is on screen. */
function useTicker(ref: React.RefObject<Element | null>, ms: number, fn: () => void) {
  const inView = useInView(ref, { margin: "-10%" });
  const saved = useRef(fn);
  saved.current = fn;
  useEffect(() => {
    if (!inView) return;
    const t = setInterval(() => saved.current(), ms);
    return () => clearInterval(t);
  }, [inView, ms]);
  return inView;
}

/* ───────────────────────── Job discovery feed ───────────────────────── */

const pool = [
  ["Northwind", "Senior Java Engineer", "Greenhouse", 94],
  ["Globex", "Full Stack Engineer · React / Spring", "Workday", 91],
  ["Initech", "Backend Engineer, Payments", "Greenhouse", 88],
  ["Hooli", "Platform Engineer · Kubernetes", "Workday", 83],
  ["Acme Cloud", "Software Engineer II", "Greenhouse", 86],
  ["Umbrella Health", "Java Microservices Developer", "Workday", 90],
] as const;

type Job = { key: number; company: string; title: string; source: string; match: number; age: number };

export function JobFeedMock() {
  const ref = useRef<HTMLDivElement>(null);
  const next = useRef(4);
  const [jobs, setJobs] = useState<Job[]>(() =>
    pool.slice(0, 4).map(([company, title, source, match], i) => ({ key: i, company, title, source, match, age: 2 + i * 7 })),
  );

  useTicker(ref, 2600, () => {
    const [company, title, source, match] = pool[next.current % pool.length];
    const key = next.current++;
    setJobs((js) => [{ key, company, title, source, match, age: 0 }, ...js.map((j) => ({ ...j, age: j.age + 3 }))].slice(0, 4));
  });

  return (
    <div ref={ref} className="w-full max-w-md overflow-hidden rounded-xl border border-line-strong bg-bg shadow-2xl shadow-black/50">
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <span className="font-mono text-xs text-muted">jobs / fresh</span>
        <span className="flex items-center gap-1.5 font-mono text-[10px] text-lime">
          <span className="size-1.5 animate-pulse rounded-full bg-lime" /> ingesting
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5 border-b border-line px-4 py-2.5">
        {["posted < 1h", "Java", "React", "Remote"].map((f, i) => (
          <span
            key={f}
            className={cn(
              "rounded-full border px-2.5 py-0.5 font-mono text-[10px]",
              i === 0 ? "border-lime/50 bg-lime/10 text-lime" : "border-line text-muted",
            )}
          >
            {f}
          </span>
        ))}
      </div>
      <ul className="relative h-[264px] overflow-hidden">
        <AnimatePresence initial={false}>
          {jobs.map((j) => (
            <motion.li
              key={j.key}
              layout
              initial={{ opacity: 0, y: -24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 380, damping: 34 }}
              className="flex items-center gap-3 border-b border-line px-4 py-3.5"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-md bg-surface-2 font-mono text-xs font-semibold text-fg">
                {j.company.slice(0, 2).toUpperCase()}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">{j.title}</span>
                <span className="block font-mono text-[10px] text-subtle">
                  {j.company} · {j.source}
                </span>
              </span>
              <span className="text-right">
                <span className={cn("block font-mono text-[10px]", j.age < 5 ? "text-lime" : "text-muted")}>
                  {j.age === 0 ? "just now" : `${j.age}m ago`}
                </span>
                <span className="block font-mono text-[10px] text-subtle">{j.match}% match</span>
              </span>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}

/* ───────────────────────── Expense dashboard ───────────────────────── */

const categories = [
  { name: "Rent", amount: 1400, color: "#c8f31d" },
  { name: "Groceries", amount: 520, color: "#eceae4" },
  { name: "Transport", amount: 310, color: "#ffb547" },
  { name: "Fun", amount: 250, color: "#62635d" },
];
const total = categories.reduce((s, c) => s + c.amount, 0);
const budget = 3200;

export function ExpenseMock() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  const R = 52;
  const C = 2 * Math.PI * R;
  let offset = 0;

  return (
    <div ref={ref} className="w-full max-w-md rounded-xl border border-line-strong bg-bg p-5 shadow-2xl shadow-black/50">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-wider text-subtle">October spend</p>
          <p className="mt-1 font-display text-4xl">${total.toLocaleString()}</p>
        </div>
        <span className="rounded bg-lime/15 px-2 py-1 font-mono text-[10px] text-lime">{Math.round((total / budget) * 100)}% of budget</span>
      </div>

      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-surface-2">
        <motion.div
          className="h-full rounded-full bg-lime"
          initial={{ width: 0 }}
          animate={inView ? { width: `${(total / budget) * 100}%` } : {}}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      <div className="mt-6 flex items-center gap-6">
        <svg viewBox="0 0 140 140" className="size-32 shrink-0 -rotate-90">
          <circle cx="70" cy="70" r={R} fill="none" stroke="#191a18" strokeWidth="16" />
          {categories.map((c, i) => {
            const len = (c.amount / total) * C;
            const seg = (
              <motion.circle
                key={c.name}
                cx="70"
                cy="70"
                r={R}
                fill="none"
                stroke={c.color}
                strokeWidth="16"
                strokeDashoffset={-offset}
                initial={{ strokeDasharray: `0 ${C}` }}
                animate={inView ? { strokeDasharray: `${len - 3} ${C}` } : {}}
                transition={{ duration: 0.8, delay: 0.3 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              />
            );
            offset += len;
            return seg;
          })}
        </svg>
        <ul className="flex-1 space-y-2.5">
          {categories.map((c, i) => (
            <li key={c.name}>
              <div className="flex justify-between text-xs">
                <span className="flex items-center gap-2">
                  <span className="size-2 rounded-sm" style={{ background: c.color }} />
                  {c.name}
                </span>
                <span className="font-mono text-muted">${c.amount}</span>
              </div>
              <div className="mt-1 h-1 overflow-hidden rounded-full bg-surface-2">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: c.color }}
                  initial={{ width: 0 }}
                  animate={inView ? { width: `${(c.amount / categories[0].amount) * 100}%` } : {}}
                  transition={{ duration: 0.9, delay: 0.5 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ───────────────────────── Hemo (Android) ───────────────────────── */

const roles = {
  Patient: [
    [CalendarClock, "Appointment confirmed", "Dr. Rao · Tue 10:30"],
    [FileText, "Symptoms shared", "Fever, fatigue · 2 photos"],
    [MessageSquare, "New message", "“Please fast before the test”"],
  ],
  Doctor: [
    [CalendarClock, "4 appointments today", "Next: A. Kumar · 10:30"],
    [Stethoscope, "Symptoms to review", "2 new reports"],
    [Pill, "Prescription sent", "→ City Pharmacy"],
  ],
  Pharmacy: [
    [Pill, "Prescription received", "Dr. Rao · 3 items"],
    [Bell, "Ready for pickup", "Notify patient"],
    [FileText, "Order history", "128 fulfilled"],
  ],
  Admin: [
    [UserPlus, "Doctor onboarded", "Dr. S. Reddy · Cardiology"],
    [Stethoscope, "Symptoms catalogue", "42 entries"],
    [Bell, "Roles & access", "4 roles configured"],
  ],
} as const;
type Role = keyof typeof roles;
const roleNames = Object.keys(roles) as Role[];

export function HemoMock() {
  const ref = useRef<HTMLDivElement>(null);
  const [role, setRole] = useState<Role>("Patient");
  useTicker(ref, 2800, () => setRole((r) => roleNames[(roleNames.indexOf(r) + 1) % roleNames.length]));

  return (
    <div ref={ref} className="relative w-[260px] rounded-[2.2rem] border border-line-strong bg-surface p-2.5 shadow-2xl shadow-black/60">
      <div className="overflow-hidden rounded-[1.7rem] bg-bg">
        <div className="flex items-center justify-between px-5 pt-3 pb-2 font-mono text-[10px] text-subtle">
          <span>9:41</span>
          <span className="h-4 w-16 rounded-full bg-surface-2" />
          <span>5G</span>
        </div>
        <div className="flex items-center gap-2 px-5 pt-2">
          <Droplet className="size-5 fill-err text-err" />
          <span className="font-display text-2xl">hemo</span>
        </div>
        <div className="mx-4 mt-4 flex rounded-lg bg-surface-2 p-1">
          {roleNames.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={cn("relative flex-1 rounded-md py-1.5 text-[10px] font-medium", r === role ? "text-bg" : "text-muted")}
            >
              {r === role && <motion.span layoutId="hemo-role" className="absolute inset-0 rounded-md bg-lime" />}
              <span className="relative">{r}</span>
            </button>
          ))}
        </div>
        <div className="h-[268px] px-4 pt-4">
          <AnimatePresence mode="wait">
            <motion.ul
              key={role}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.25 }}
              className="space-y-2.5"
            >
              {roles[role].map(([Icon, title, sub]) => (
                <li key={title} className="flex items-center gap-3 rounded-xl border border-line bg-surface p-3">
                  <span className="grid size-8 place-items-center rounded-lg bg-surface-2">
                    <Icon className="size-4 text-lime" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-xs font-medium">{title}</span>
                    <span className="block truncate text-[10px] text-subtle">{sub}</span>
                  </span>
                </li>
              ))}
            </motion.ul>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── Fallbacks for projects without a bespoke mock ───────────────────────── */

/** A real screenshot (public/projects/…) in a browser frame. */
export function ScreenshotFrame({ src, alt, title }: { src: string; alt: string; title: string }) {
  return (
    <figure className="w-full max-w-lg overflow-hidden rounded-xl border border-line-strong bg-bg shadow-2xl shadow-black/50">
      <div className="flex items-center gap-2 border-b border-line px-3 py-2.5">
        <span className="size-2.5 rounded-full bg-[#ff5f57]" />
        <span className="size-2.5 rounded-full bg-[#febc2e]" />
        <span className="size-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-2 min-w-0 flex-1 truncate rounded bg-surface-2 px-3 py-1 font-mono text-[10px] text-subtle">{title}</span>
      </div>
      <Image src={asset(src)} alt={alt} width={1280} height={800} sizes="(min-width: 1024px) 32rem, 90vw" className="h-auto w-full" />
    </figure>
  );
}

/** Auto-generated "architecture" for a project: its stack as a live pipeline with a packet flowing through it. */
export function StackDiagram({ id, stack }: { id: string; stack: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-10%" });
  const nodes = stack.slice(0, 7);

  return (
    <div ref={ref} className="w-full max-w-md overflow-hidden rounded-xl border border-line-strong bg-bg shadow-2xl shadow-black/50">
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
        <span className="min-w-0 truncate font-mono text-xs text-muted">{id}/architecture</span>
        <span className="flex shrink-0 items-center gap-1.5 font-mono text-[10px] text-lime">
          <span className="size-1.5 animate-pulse rounded-full bg-lime" /> healthy
        </span>
      </div>
      <div className="relative px-6 py-5">
        {/* node squares are 15px wide starting at 24px, so their centre line is x = 31.5px */}
        <div className="absolute top-9 bottom-9 left-[31px] w-px bg-line-strong" />
        {inView && (
          <motion.span
            aria-hidden
            className="absolute left-[27px] z-20 size-[9px] rounded-full bg-lime shadow-[0_0_12px_3px_rgb(200_243_29/0.55)]"
            initial={{ top: "2rem" }}
            animate={{ top: ["2rem", "calc(100% - 2.6rem)"] }}
            transition={{ duration: 0.45 * nodes.length, repeat: Infinity, repeatDelay: 0.5, ease: "easeInOut" }}
          />
        )}
        <ul className="space-y-3">
          {nodes.map((tech, i) => (
            <motion.li
              key={tech}
              initial={{ opacity: 0, x: -8 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: i * 0.08, duration: 0.35 }}
              className="relative flex items-center gap-4"
            >
              <span className="z-10 size-[15px] shrink-0 rounded-[4px] border border-lime/70 bg-bg" />
              <span className="min-w-0 flex-1 truncate rounded-md border border-line bg-surface px-3 py-2 font-mono text-xs">{tech}</span>
              <span className="font-mono text-[10px] text-subtle">L{i}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}
