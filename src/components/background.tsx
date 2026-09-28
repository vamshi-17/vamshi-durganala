"use client";

import { useEffect } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";

/** Fixed page backdrop: masked grid, drifting aurora blobs, grain and a cursor glow. */
export function Background() {
  const mx = useMotionValue(-1000);
  const my = useMotionValue(-1000);
  const x = useSpring(mx, { stiffness: 80, damping: 20 });
  const y = useSpring(my, { stiffness: 80, damping: 20 });
  const glow = useMotionTemplate`radial-gradient(600px circle at ${x}px ${y}px, rgb(139 92 246 / 0.08), transparent 75%)`;

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [mx, my]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,black_30%,transparent_75%)]" />
      <div className="absolute -top-[20%] left-[10%] size-[42rem] animate-aurora rounded-full bg-violet-600/20 blur-[120px]" />
      <div className="absolute top-[10%] -right-[10%] size-[36rem] animate-aurora rounded-full bg-cyan-500/10 blur-[120px] [animation-delay:-6s]" />
      <div className="absolute top-[60%] left-[-10%] size-[30rem] animate-aurora rounded-full bg-fuchsia-600/10 blur-[120px] [animation-delay:-12s]" />
      <motion.div className="absolute inset-0 hidden md:block" style={{ background: glow }} />
      <div className="absolute inset-0 bg-noise opacity-[0.035] mix-blend-overlay" />
    </div>
  );
}
