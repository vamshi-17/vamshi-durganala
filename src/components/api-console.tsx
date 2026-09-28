"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Play, RotateCw } from "lucide-react";
import { endpoints, type EndpointPath } from "@/data/profile";
import { cn } from "@/lib/utils";
import { ease } from "@/components/ui/reveal";

const nodes = ["client", "gateway", "service", "kafka", "db"];
const REQUEST_MS = 1000;
const RESPONSE_MS = 650;

type Phase = "idle" | "request" | "response" | "done";
type Token = [string, string];

/** Turns a flat JSON object into syntax-coloured lines. */
function toLines(body: Record<string, unknown>): Token[][] {
  const value = (v: unknown): Token[] => {
    if (typeof v === "number") return [[String(v), "text-warn"]];
    if (Array.isArray(v))
      return [["[", "text-subtle"], ...v.flatMap((x, i) => [[`"${x}"`, "text-lime"], ...(i < v.length - 1 ? [[", ", "text-subtle"]] : [])] as Token[]), ["]", "text-subtle"]];
    return [[`"${v}"`, "text-lime"]];
  };
  const entries = Object.entries(body);
  return [
    [["{", "text-subtle"]],
    ...entries.map(([k, v], i): Token[] => [
      [`  "${k}"`, "text-fg"],
      [": ", "text-subtle"],
      ...value(v),
      [i < entries.length - 1 ? "," : "", "text-subtle"],
    ]),
    [["}", "text-subtle"]],
  ];
}

export function ApiConsole() {
  const [path, setPath] = useState<EndpointPath>("/engineer");
  const [phase, setPhase] = useState<Phase>("idle");
  const [run, setRun] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const send = useCallback(() => {
    timers.current.forEach(clearTimeout);
    setRun((r) => r + 1);
    setPhase("request");
    timers.current = [
      setTimeout(() => setPhase("response"), REQUEST_MS),
      setTimeout(() => setPhase("done"), REQUEST_MS + RESPONSE_MS),
    ];
  }, []);

  useEffect(() => {
    const t = setTimeout(send, 1500);
    const all = timers.current;
    return () => {
      clearTimeout(t);
      all.forEach(clearTimeout);
    };
  }, [send]);

  const { latency, body } = endpoints[path];
  const lines = toLines(body as Record<string, unknown>);
  const busy = phase === "request" || phase === "response";

  return (
    <div className="overflow-hidden rounded-xl border border-line-strong bg-surface shadow-[0_30px_80px_-20px_rgb(0_0_0/0.7)]">
      {/* request bar */}
      <div className="flex items-center gap-2 border-b border-line p-2.5">
        <span className="rounded bg-lime/15 px-2 py-1 font-mono text-[11px] font-semibold text-lime">GET</span>
        <div className="flex min-w-0 flex-1 items-center rounded-md bg-bg px-3 py-1.5 font-mono text-[13px]">
          <span className="hidden text-subtle sm:inline">api.vamshi.dev</span>
          <span className="truncate text-fg">{path}</span>
        </div>
        <motion.button
          type="button"
          onClick={send}
          disabled={busy}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-1.5 rounded-md bg-lime px-3 py-1.5 text-sm font-semibold text-bg transition hover:bg-fg disabled:opacity-60"
        >
          {phase === "done" ? <RotateCw className="size-3.5" /> : <Play className="size-3.5 fill-current" />}
          Send
        </motion.button>
      </div>

      {/* endpoint tabs */}
      <div className="flex gap-1 border-b border-line px-2.5 py-2" role="tablist" aria-label="Endpoints">
        {(Object.keys(endpoints) as EndpointPath[]).map((p) => (
          <button
            key={p}
            role="tab"
            aria-selected={p === path}
            type="button"
            onClick={() => {
              setPath(p);
              send();
            }}
            className={cn(
              "relative rounded px-2.5 py-1 font-mono text-xs transition-colors",
              p === path ? "text-fg" : "text-subtle hover:text-muted",
            )}
          >
            {p === path && <motion.span layoutId="endpoint-tab" className="absolute inset-0 rounded bg-surface-2" />}
            <span className="relative">{p}</span>
          </button>
        ))}
      </div>

      {/* topology: the packet travels client → db and back */}
      <div className="relative border-b border-line bg-bg/40 px-6 py-5">
        {/* columns are w-14, so node centres sit 1.5rem + 28px in from each side */}
        <div className="absolute inset-x-[52px] top-[27px] h-px bg-line-strong" />
        <div className="relative flex justify-between">
          {nodes.map((n, i) => (
            <div key={n} className="flex w-14 flex-col items-center gap-2">
              <motion.span
                key={`${n}-${run}`}
                initial={false}
                animate={
                  phase === "request" || phase === "response"
                    ? { backgroundColor: ["#121311", "#c8f31d", "#121311"], borderColor: ["#62635d", "#c8f31d", "#62635d"] }
                    : {}
                }
                transition={{
                  duration: 0.35,
                  delay: phase === "request" ? (i / (nodes.length - 1)) * (REQUEST_MS / 1000) * 0.9 : ((nodes.length - 1 - i) / (nodes.length - 1)) * (RESPONSE_MS / 1000) * 0.9,
                }}
                className="relative z-10 size-3.5 rounded-[4px] border border-subtle bg-surface"
              />
              <span className="font-mono text-[10px] uppercase tracking-wider text-subtle">{n}</span>
            </div>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-x-[52px] top-5">
          <AnimatePresence>
            {busy && (
              <motion.span
                key={`packet-${run}-${phase}`}
                initial={{ left: phase === "request" ? "0%" : "100%", opacity: 1 }}
                animate={{ left: phase === "request" ? "100%" : "0%" }}
                exit={{ opacity: 0 }}
                transition={{ duration: (phase === "request" ? REQUEST_MS : RESPONSE_MS) / 1000, ease: "easeInOut" }}
                className={cn(
                  "absolute top-0 block size-3.5 -translate-x-1/2 rounded-full",
                  phase === "request" ? "bg-lime shadow-[0_0_16px_4px_rgb(200_243_29/0.6)]" : "bg-fg shadow-[0_0_16px_4px_rgb(236_234_228/0.5)]",
                )}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* response */}
      <div className="min-h-[268px] p-4 font-mono text-[12.5px] leading-6 sm:p-5 sm:text-[13px]">
        <div className="mb-3 flex items-center gap-3 text-xs">
          {phase === "done" ? (
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
              <span className="rounded bg-lime/15 px-1.5 py-0.5 text-lime">200 OK</span>
              <span className="text-muted">{latency} ms</span>
              <span className="text-subtle">application/json</span>
            </motion.span>
          ) : (
            <span className="text-subtle">{phase === "idle" ? "Press Send to call the API" : "awaiting response…"}</span>
          )}
        </div>
        {phase === "done" && (
          <div key={`${path}-${run}`}>
            {lines.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05, duration: 0.3, ease }}
                className="whitespace-pre-wrap break-words"
              >
                {line.map(([t, c], j) => (
                  <span key={j} className={c}>
                    {t}
                  </span>
                ))}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
