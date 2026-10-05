import { useEffect, useState } from "react";

/** What kind of keyboard shortcut hint fits this visitor. */
export type KeyboardKind = "mac" | "pc" | "touch";

type NavigatorLike = { platform?: string; userAgent?: string; userAgentData?: { platform?: string } };

/**
 * Touch-only devices (phones, tablets without a keyboard) get no shortcut hint; Apple devices use ⌘; everything
 * else (Windows, Linux, ChromeOS) uses Ctrl. The shortcut itself accepts both everywhere — this only picks the label.
 */
export function detectKeyboard(nav: NavigatorLike, touchOnly: boolean): KeyboardKind {
  if (touchOnly) return "touch";
  const platform = `${nav.userAgentData?.platform ?? ""} ${nav.platform ?? ""} ${nav.userAgent ?? ""}`;
  return /mac|iphone|ipad|ipod/i.test(platform) ? "mac" : "pc";
}

/** "⌘" on Apple keyboards, "Ctrl" elsewhere. */
export const modifierKey = (kind: KeyboardKind) => (kind === "mac" ? "⌘" : "Ctrl");

/**
 * The visitor's keyboard kind, or null until known. Detected after hydration (the static HTML can't know the
 * device), and updated if the input mode changes — e.g. a keyboard is attached to a tablet.
 */
export function useKeyboardKind(): KeyboardKind | null {
  const [kind, setKind] = useState<KeyboardKind | null>(null);
  useEffect(() => {
    const touchOnly = window.matchMedia("(hover: none) and (pointer: coarse)");
    const update = () => setKind(detectKeyboard(navigator as unknown as NavigatorLike, touchOnly.matches));
    update();
    touchOnly.addEventListener("change", update);
    return () => touchOnly.removeEventListener("change", update);
  }, []);
  return kind;
}
