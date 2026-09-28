import { Background } from "@/components/background";
import { CommandPalette } from "@/components/command-palette";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { RouteSync } from "@/components/route-sync";
import { SystemRail } from "@/components/system-rail";
import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { Experience } from "@/components/sections/experience";
import { Hero } from "@/components/sections/hero";
import { Projects } from "@/components/sections/projects";
import { Stack } from "@/components/sections/stack";
import type { SectionId } from "@/lib/sections";

/** The whole one-page site. `/` renders it at the top; `/about/` etc. render it scrolled to that section. */
export function Site({ initial }: { initial?: SectionId }) {
  return (
    <>
      <Background />
      <Nav />
      <SystemRail />
      <CommandPalette />
      <RouteSync initial={initial} />
      <main>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Stack />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
