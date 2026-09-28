import { cn } from "@/lib/utils";

/** Infinite horizontal ticker; content is duplicated so the loop is seamless. */
export function Marquee({ items, className, reverse }: { items: readonly string[]; className?: string; reverse?: boolean }) {
  return (
    <div className={cn("group flex overflow-hidden mask-fade-x", className)}>
      {[0, 1].map((copy) => (
        <ul
          key={copy}
          aria-hidden={copy === 1}
          className={cn(
            "flex shrink-0 animate-marquee items-center gap-10 pr-10 group-hover:[animation-play-state:paused]",
            reverse && "[animation-direction:reverse]",
          )}
        >
          {items.map((item) => (
            <li key={item} className="flex items-center gap-10 whitespace-nowrap font-mono text-sm uppercase tracking-widest text-subtle">
              {item}
              <span className="size-1 rounded-full bg-accent/60" />
            </li>
          ))}
        </ul>
      ))}
    </div>
  );
}
