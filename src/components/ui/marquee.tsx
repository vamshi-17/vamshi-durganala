import { logLines } from "@/data/profile";

const statusColor: Record<string, string> = {
  "200": "text-lime",
  "201": "text-lime",
  "202": "text-warn",
  "204": "text-muted",
};

/** Infinite ticker of "access log" lines about me; duplicated for a seamless loop. */
export function LogTicker() {
  return (
    <div className="group flex overflow-hidden border-y border-line py-3 mask-fade-x">
      {[0, 1].map((copy) => (
        <ul
          key={copy}
          aria-hidden={copy === 1}
          className="flex shrink-0 animate-ticker items-center gap-10 pr-10 group-hover:[animation-play-state:paused]"
        >
          {logLines.map(([status, method, path, note]) => (
            <li key={path} className="flex items-center gap-2.5 whitespace-nowrap font-mono text-xs">
              <span className={statusColor[status]}>{status}</span>
              <span className="text-subtle">{method}</span>
              <span className="text-fg">{path}</span>
              <span className="text-subtle">→</span>
              <span className="text-muted">{note}</span>
            </li>
          ))}
        </ul>
      ))}
    </div>
  );
}
