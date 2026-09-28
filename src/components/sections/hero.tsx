"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowDown, ArrowUpRight, Download, Github, Linkedin, Mail } from "lucide-react";
import { marquee, profile, stats } from "@/data/profile";
import { asset } from "@/lib/utils";
import { Counter } from "@/components/ui/counter";
import { Magnetic } from "@/components/ui/magnetic";
import { Marquee } from "@/components/ui/marquee";
import { ease } from "@/components/ui/reveal";

function SplitText({ text, delay = 0 }: { text: string; delay?: number }) {
  let n = 0;
  return (
    <span className="block overflow-hidden pb-[0.1em]" aria-label={text}>
      {text.split(" ").map((word, w) => (
        // Words are unbreakable so the line only wraps between them.
        <span key={w} aria-hidden className="mr-[0.25em] inline-block whitespace-nowrap last:mr-0">
          {word.split("").map((ch) => (
            <motion.span
              key={n}
              className="inline-block"
              initial={{ y: "110%", rotate: 6 }}
              animate={{ y: 0, rotate: 0 }}
              transition={{ duration: 0.9, delay: delay + n++ * 0.035, ease }}
            >
              {ch}
            </motion.span>
          ))}
        </span>
      ))}
    </span>
  );
}

function RotatingRole() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % profile.roles.length), 2800);
    return () => clearInterval(t);
  }, []);

  return (
    <span className="relative inline-flex h-[1.35em] overflow-hidden align-bottom">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={profile.roles[i]}
          initial={{ y: "100%", opacity: 0, filter: "blur(4px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: "-100%", opacity: 0, filter: "blur(4px)" }}
          transition={{ duration: 0.5, ease }}
          className="whitespace-nowrap font-medium text-fg"
        >
          {profile.roles[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

// Hand-tokenised snippet so it renders crisply without a highlighter dependency.
const code: [string, string][][] = [
  [["@Service", "text-amber-300"]],
  [["public class ", "text-pink-400"], ["BallotEventListener", "text-cyan-300"], [" {", "text-fg/70"]],
  [],
  [["  private final ", "text-pink-400"], ["NotificationService", "text-cyan-300"], [" notifications;", "text-fg/80"]],
  [],
  [["  @KafkaListener", "text-amber-300"], ["(topics = ", "text-fg/70"], ['"ballot.events"', "text-emerald-300"], [")", "text-fg/70"]],
  [["  @Transactional", "text-amber-300"]],
  [["  public void ", "text-pink-400"], ["on", "text-violet-300"], ["(", "text-fg/70"], ["BallotEvent", "text-cyan-300"], [" event) {", "text-fg/80"]],
  [["    ballots.", "text-fg/80"], ["save", "text-violet-300"], ["(event.", "text-fg/80"], ["toEntity", "text-violet-300"], ["());", "text-fg/80"]],
  [["    notifications.", "text-fg/80"], ["publish", "text-violet-300"], ["(event);", "text-fg/80"]],
  [["  }", "text-fg/70"]],
  [["}", "text-fg/70"]],
];

function CodeWindow() {
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rotateX = useSpring(rx, { stiffness: 120, damping: 14 });
  const rotateY = useSpring(ry, { stiffness: 120, damping: 14 });

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1, delay: 0.9, ease }}
      className="relative [perspective:1200px]"
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        ry.set(((e.clientX - r.left) / r.width - 0.5) * 14);
        rx.set(-((e.clientY - r.top) / r.height - 0.5) * 14);
      }}
      onMouseLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative rounded-2xl border border-line-strong bg-surface/80 shadow-2xl shadow-violet-950/40 backdrop-blur-xl"
      >
        <div className="absolute -inset-px -z-10 rounded-2xl bg-gradient-to-br from-violet-500/40 via-transparent to-cyan-400/30 blur-xl" />
        <div className="flex items-center gap-2 border-b border-line px-4 py-3">
          <span className="size-3 rounded-full bg-[#ff5f57]" />
          <span className="size-3 rounded-full bg-[#febc2e]" />
          <span className="size-3 rounded-full bg-[#28c840]" />
          <span className="ml-3 font-mono text-xs text-muted">BallotEventListener.java</span>
        </div>
        <pre className="overflow-hidden p-5 font-mono text-[12.5px] leading-6">
          {code.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 + i * 0.07, duration: 0.4 }}
              className="flex"
            >
              <span className="mr-5 w-4 select-none text-right text-subtle">{i + 1}</span>
              <span>
                {line.map(([t, c], j) => (
                  <span key={j} className={c}>
                    {t}
                  </span>
                ))}
                {i === code.length - 1 && (
                  <span className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 animate-pulse bg-accent" />
                )}
              </span>
            </motion.div>
          ))}
        </pre>

        <FloatingBadge className="-top-4 right-8" delay={1.8}>
          <span className="size-2 rounded-full bg-emerald-400" /> 14+ microservices
        </FloatingBadge>
        <FloatingBadge className="-right-6 top-1/2" delay={2} float="[animation-delay:-2s]">
          ☁️ AWS Certified
        </FloatingBadge>
        <FloatingBadge className="-bottom-5 left-12" delay={2.2} float="[animation-delay:-4s]">
          ⚡ Kafka · Redis · EKS
        </FloatingBadge>
      </motion.div>
    </motion.div>
  );
}

function FloatingBadge({
  children,
  className,
  delay,
  float = "",
}: {
  children: React.ReactNode;
  className: string;
  delay: number;
  float?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.6, ease }}
      style={{ transform: "translateZ(60px)" }}
      className={`absolute hidden lg:block ${className}`}
    >
      <div
        className={`flex animate-float items-center gap-2 rounded-full border border-line-strong bg-surface-2/90 px-3.5 py-2 text-xs font-medium shadow-xl backdrop-blur-md ${float}`}
      >
        {children}
      </div>
    </motion.div>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const socials = [
    { href: profile.socials.github, label: "GitHub", icon: Github },
    { href: profile.socials.linkedin, label: "LinkedIn", icon: Linkedin },
    { href: `mailto:${profile.email}`, label: "Email", icon: Mail },
  ];

  return (
    <section id="home" ref={ref} className="relative flex min-h-svh flex-col justify-center pt-28 pb-10">
      <motion.div style={{ y, opacity }} className="mx-auto grid w-full max-w-6xl items-center gap-16 px-6 lg:grid-cols-[1.15fr_1fr]">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-line-strong bg-surface/60 px-3.5 py-1.5 text-xs text-muted backdrop-blur"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
            </span>
            Open to new opportunities · {profile.location}
          </motion.div>

          <h1 className="text-[clamp(2.75rem,8vw,5.5rem)] font-semibold leading-[0.95] tracking-[-0.04em]">
            <SplitText text="Vamshi Krishna" delay={0.15} />
            <span className="block overflow-hidden pb-[0.12em]">
              <motion.span
                className="inline-block font-serif font-normal italic text-gradient pr-2"
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1, delay: 0.55, ease }}
              >
                Durganala.
              </motion.span>
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease }}
            className="mt-6 text-xl text-muted md:text-2xl"
          >
            <RotatingRole />
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.95, ease }}
            className="mt-5 max-w-xl text-base leading-relaxed text-muted text-pretty md:text-lg"
          >
            {profile.tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1, ease }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <Magnetic>
              <a
                href="#work"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-fg px-6 py-3.5 text-sm font-medium text-bg"
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-violet-300 to-cyan-200 transition-transform duration-500 group-hover:translate-x-0" />
                <span className="relative">View my work</span>
                <ArrowUpRight className="relative size-4 transition-transform duration-300 group-hover:rotate-45" />
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href={asset(profile.resume)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface/50 px-6 py-3.5 text-sm font-medium backdrop-blur transition hover:border-accent/60 hover:bg-surface"
              >
                <Download className="size-4" /> Résumé
              </a>
            </Magnetic>
            <div className="ml-1 flex items-center gap-1">
              {socials.map(({ href, label, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid size-11 place-items-center rounded-full text-muted transition hover:bg-white/5 hover:text-fg"
                >
                  <Icon className="size-[18px]" />
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="hidden md:block">
          <CodeWindow />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="mx-auto mt-20 w-full max-w-6xl px-6"
      >
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col bg-bg/80 px-6 py-5 backdrop-blur">
              <dt className="order-2 mt-1 text-xs text-muted md:text-sm">{s.label}</dt>
              <dd className="text-3xl font-semibold tracking-tight md:text-4xl">
                <Counter to={s.value} suffix={s.suffix} />
              </dd>
            </div>
          ))}
        </dl>
        <Marquee items={marquee} className="mt-10" />
      </motion.div>

      <motion.a
        href="#about"
        aria-label="Scroll to about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ opacity: { delay: 2 }, y: { repeat: Infinity, duration: 2, ease: "easeInOut" } }}
        className="mx-auto mt-10 hidden size-10 place-items-center rounded-full border border-line text-muted md:grid"
      >
        <ArrowDown className="size-4" />
      </motion.a>
    </section>
  );
}
