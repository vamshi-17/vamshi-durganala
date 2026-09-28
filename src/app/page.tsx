import { Background } from "@/components/background";
import { CommandPalette } from "@/components/command-palette";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { SystemRail } from "@/components/system-rail";
import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { Experience } from "@/components/sections/experience";
import { Hero } from "@/components/sections/hero";
import { Projects } from "@/components/sections/projects";
import { Stack } from "@/components/sections/stack";

export default function Home() {
  return (
    <>
      <Background />
      <Nav />
      <SystemRail />
      <CommandPalette />
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
