/** Static page backdrop: dotted grid, one soft lime glow and grain. Nothing animates, so scrolling stays cheap. */
export function Background() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-dots [mask-image:radial-gradient(ellipse_70%_50%_at_60%_0%,black,transparent_80%)]" />
      <div className="absolute -top-64 right-[-10%] h-[36rem] w-[48rem] rounded-full bg-[radial-gradient(closest-side,rgb(200_243_29/0.10),transparent)]" />
      <div className="absolute inset-0 bg-noise opacity-[0.04] mix-blend-overlay" />
    </div>
  );
}
