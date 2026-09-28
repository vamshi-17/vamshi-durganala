"use client";

import { useEffect, useState } from "react";
import { hops } from "@/data/profile";

/** Id of the section currently crossing the middle of the viewport. */
export function useActiveSection() {
  const [active, setActive] = useState<string>("home");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    hops.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return active;
}
