"use client";

import { MotionConfig } from "framer-motion";

/** Honours the visitor's OS "reduce motion" setting across every animation. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
