"use client";

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

type SpotlightCardProps = {
  children: React.ReactNode;
  className?: string;
  color?: string;
};

/** Glass card with a soft glow and border highlight that follow the cursor. */
export function SpotlightCard({ children, className, color = "167 139 250" }: SpotlightCardProps) {
  const x = useMotionValue(-400);
  const y = useMotionValue(-400);
  const glow = useMotionTemplate`radial-gradient(420px circle at ${x}px ${y}px, rgb(${color} / 0.12), transparent 65%)`;
  const border = useMotionTemplate`radial-gradient(260px circle at ${x}px ${y}px, rgb(${color} / 0.55), transparent 70%)`;

  return (
    <div
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - r.left);
        y.set(e.clientY - r.top);
      }}
      className={cn(
        "group relative overflow-hidden rounded-3xl border border-line bg-surface/70 backdrop-blur-md",
        className,
      )}
    >
      {/* border highlight: gradient layer masked to a 1px ring */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: border,
          padding: 1,
          WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: glow }}
      />
      <div className="relative h-full">{children}</div>
    </div>
  );
}
