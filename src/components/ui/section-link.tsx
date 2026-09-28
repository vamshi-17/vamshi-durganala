"use client";

import { navigateTo } from "@/components/smooth-scroll";
import { sectionPath, type SectionId } from "@/lib/sections";

type SectionLinkProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { to: SectionId };

/**
 * A real link to a section's URL (so it works without JS, in new tabs and for crawlers) that, on a plain click,
 * smooth-scrolls in place instead of loading the page again.
 */
export function SectionLink({ to, onClick, ...props }: SectionLinkProps) {
  return (
    <a
      href={sectionPath(to)}
      onClick={(e) => {
        onClick?.(e);
        // Let the browser handle new-tab / new-window / download clicks.
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        navigateTo(to);
      }}
      {...props}
    />
  );
}
