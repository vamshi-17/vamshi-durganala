"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown, ArrowDownToLine, Github, Linkedin } from "lucide-react";
import { profile } from "@/data/profile";
import { asset } from "@/lib/utils";
import { ApiConsole } from "@/components/api-console";
import { LogTicker } from "@/components/ui/marquee";
import { Magnetic } from "@/components/ui/magnetic";
import { SectionLink } from "@/components/ui/section-link";
import { ease } from "@/components/ui/reveal";

function LocalTime() {
  // Client-only so the static HTML never disagrees with the visitor's clock.
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone: "America/New_York" });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const t = setInterval(tick, 20_000);
    return () => clearInterval(t);
  }, []);
  return <span className="tabular-nums">{time ?? "--:--"} ET</span>;
}

function Line({ children, delay }: { children: React.ReactNode; delay: number }) {
  return (
    <span className="block overflow-hidden pb-[0.06em]">
      <motion.span className="block" initial={{ y: "105%" }} animate={{ y: 0 }} transition={{ duration: 1, delay, ease }}>
        {children}
      </motion.span>
    </span>
  );
}

const facts = [
  ["6+", "years shipping"],
  ["14+", "microservices"],
  ["AWS", "certified architect"],
];

export function Hero() {
  return (
    <section id="home" className="relative pt-28 md:pt-32">
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 md:px-6 lg:grid-cols-[1.08fr_1fr] lg:gap-14">
        <div className="min-w-0">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-xs text-muted"
          >
            <span className="flex items-center gap-2">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-lime opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-lime" />
              </span>
              <span className="text-fg">online</span>
            </span>
            <span>{profile.location}</span>
            <LocalTime />
            <span className="text-lime">status: open_to_work</span>
          </motion.div>

          <h1>
            <span className="block overflow-hidden">
              <motion.span
                className="block text-xl text-muted md:text-2xl"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease }}
              >
                Hi, I&apos;m <span className="font-semibold text-fg">{profile.name}</span> —
              </motion.span>
            </span>
            <span className="mt-3 block font-display text-[clamp(3rem,6.3vw,5.6rem)] leading-[0.9]">
              <Line delay={0.45}>I build systems</Line>
              <Line delay={0.58}>
                that <span className="text-lime">stay up.</span>
              </Line>
            </span>
          </h1>

          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9, ease }}
          >
            <p className="max-w-md text-lg leading-relaxed text-muted text-pretty md:text-xl">
              Full stack engineer building <span className="text-fg">secure, event-driven platforms</span> end to end — Spring
              Boot microservices and Kafka pipelines underneath, fast React interfaces on top, all running on AWS.
            </p>

            <dl className="mt-7 flex gap-8 border-t border-line pt-5">
              {facts.map(([v, l]) => (
                <div key={l}>
                  <dt className="sr-only">{l}</dt>
                  <dd className="font-display text-3xl">{v}</dd>
                  <dd className="mt-0.5 font-mono text-[11px] text-subtle">{l}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Magnetic>
                <SectionLink
                  to="projects"
                  className="group inline-flex items-center gap-2 rounded-md bg-lime px-5 py-3 font-semibold text-bg transition hover:bg-fg"
                >
                  See what I&apos;ve built
                  <ArrowDown className="size-4 transition-transform duration-300 group-hover:translate-y-0.5" />
                </SectionLink>
              </Magnetic>
              <a
                href={asset(profile.resume)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-line-strong px-5 py-3 font-medium transition hover:border-fg/50"
              >
                <ArrowDownToLine className="size-4" /> Résumé
              </a>
              {[
                { href: profile.socials.github, label: "GitHub", icon: Github },
                { href: profile.socials.linkedin, label: "LinkedIn", icon: Linkedin },
              ].map(({ href, label, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid size-12 place-items-center rounded-md text-muted transition hover:bg-surface-2 hover:text-lime"
                >
                  <Icon className="size-5" />
                </a>
              ))}
            </div>
            <p className="mt-6 hidden font-mono text-xs text-subtle sm:block">
              tip: press <kbd className="rounded border border-line px-1.5 py-0.5 text-muted">Ctrl</kbd> +{" "}
              <kbd className="rounded border border-line px-1.5 py-0.5 text-muted">K</kbd> to jump anywhere
            </p>
          </motion.div>
        </div>

        <motion.div
          className="min-w-0"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.05, ease }}
        >
          <ApiConsole />
          <p className="mt-3 text-center font-mono text-[11px] text-subtle">↑ it&apos;s live — try another endpoint</p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="mt-16 md:mt-24"
      >
        <LogTicker />
      </motion.div>
    </section>
  );
}
