import { hops } from "@/data/profile";

/**
 * Each section has a real, statically exported URL (e.g. /about/) so links are shareable and refresh-safe without
 * `#` fragments. `trailingSlash: true` in next.config means every route is a folder with an index.html.
 */
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Absolute URL of the live site (metadataBase, canonical links). */
export const SITE_URL = "https://vamshi-17.github.io/vamshi-portfolio/";

export type SectionId = (typeof hops)[number]["id"];

export const sectionIds = hops.map((h) => h.id) as SectionId[];
export const routedSections = sectionIds.filter((id) => id !== "home");

export const isSection = (id: string): id is SectionId => (sectionIds as string[]).includes(id);

/** "about" → "/vamshi-portfolio/about/", "home" → "/vamshi-portfolio/". */
export const sectionPath = (id: SectionId) => `${BASE}/${id === "home" ? "" : `${id}/`}`;

/** Inverse of sectionPath; unknown paths map to "home". */
export function sectionFromPath(pathname: string): SectionId {
  const rest = pathname.slice(BASE.length).replace(/^\/+|\/+$/g, "");
  return isSection(rest) ? rest : "home";
}

const SITE_TITLE = "Vamshi Krishna Durganala — Full Stack Engineer";

export const sectionTitle = (id: SectionId) =>
  id === "home" ? SITE_TITLE : `${id[0].toUpperCase()}${id.slice(1)} — Vamshi Krishna Durganala`;
