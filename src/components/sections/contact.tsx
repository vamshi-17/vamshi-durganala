"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDownToLine, ArrowUpRight, Check, Copy, Github, Linkedin, LoaderCircle, Mail, Play } from "lucide-react";
import { profile } from "@/data/profile";
import { asset, cn } from "@/lib/utils";
import { Mark, SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";

// Free key from https://web3forms.com, provided at build time; without it the form falls back to mailto.
const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

type Status = "idle" | "sending" | "sent" | "error";

const field =
  "min-w-0 flex-1 border-b border-dashed border-line-strong bg-transparent text-lime outline-none placeholder:text-subtle focus:border-lime";

function CopyEmail() {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(profile.email);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }}
      className="group flex w-full items-center gap-4 border-b border-line py-5 text-left"
    >
      <Mail className="size-5 shrink-0 text-muted transition group-hover:text-lime" />
      <span className="min-w-0 flex-1">
        <span className="block font-mono text-[11px] text-subtle">email</span>
        <span className="block truncate text-lg transition group-hover:text-lime">{profile.email}</span>
      </span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span key={String(copied)} initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }}>
          {copied ? <Check className="size-4 text-lime" /> : <Copy className="size-4 text-muted" />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

export function Contact() {
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    if (!WEB3FORMS_KEY) {
      const subject = encodeURIComponent(`Hello from ${data.get("name")}`);
      const body = encodeURIComponent(`${data.get("message")}\n\n— ${data.get("name")} (${data.get("email")})`);
      window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
      return;
    }

    setStatus("sending");
    data.append("access_key", WEB3FORMS_KEY);
    data.append("subject", `Portfolio: message from ${data.get("name")}`);
    try {
      const res = await fetch("https://api.web3forms.com/submit", { method: "POST", body: data });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  const channels = [
    { href: profile.socials.linkedin, label: "linkedin", value: "in/vamshi-krishna-durganala", icon: Linkedin },
    { href: profile.socials.github, label: "github", value: "@vamshi-17", icon: Github },
    { href: asset(profile.resume), label: "résumé", value: "Vamshi-Krishna-Durganala.pdf", icon: ArrowDownToLine },
  ];

  return (
    <section id="contact" className="relative py-28 md:py-40">
      <div className="mx-auto max-w-6xl px-5 md:px-6">
        <SectionHeading
          hop="contact"
          title={
            <>
              Let&apos;s ship <Mark>something.</Mark>
            </>
          }
          lede="Hiring for a full stack or backend role, or just want to talk systems? Send a request — I usually respond within a day."
        />

        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <Reveal className="min-w-0">
            <form onSubmit={onSubmit} className="overflow-hidden rounded-xl border border-line-strong bg-surface font-mono text-[13px]">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-3">
                <span>
                  <span className="rounded bg-lime/15 px-2 py-1 text-[11px] font-semibold text-lime">POST</span>{" "}
                  <span className="text-fg">/api/contact</span>
                </span>
                <span className="text-[11px] text-subtle">Content-Type: application/json</span>
              </div>

              <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" />

              <div className="grid grid-cols-[2.25rem_1fr] py-4 leading-8">
                <div className="select-none text-right text-subtle [&>span]:block">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                    <span key={n} className="pr-3">
                      {n}
                    </span>
                  ))}
                </div>
                <div className="pr-4 pl-2">
                  <div className="text-subtle">{"{"}</div>
                  <label className="flex items-center gap-2 pl-4">
                    <span className="shrink-0 text-fg">&quot;name&quot;</span>
                    <span className="text-subtle">:</span>
                    <input name="name" required autoComplete="name" placeholder='"Jane Doe"' className={field} />
                    <span className="text-subtle">,</span>
                  </label>
                  <label className="flex items-center gap-2 pl-4">
                    <span className="shrink-0 text-fg">&quot;email&quot;</span>
                    <span className="text-subtle">:</span>
                    <input name="email" type="email" required autoComplete="email" placeholder='"jane@company.com"' className={field} />
                    <span className="text-subtle">,</span>
                  </label>
                  <label className="flex gap-2 pl-4">
                    <span className="shrink-0 text-fg">&quot;message&quot;</span>
                    <span className="text-subtle">:</span>
                    <textarea
                      name="message"
                      required
                      rows={4}
                      placeholder='"We have a role you might like…"'
                      className={cn(field, "resize-none border-b-0 leading-8")}
                      data-lenis-prevent
                    />
                  </label>
                  <div className="text-subtle">{"}"}</div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-4 py-3">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={status}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-xs"
                  >
                    {status === "idle" && <span className="text-subtle">{WEB3FORMS_KEY ? "ready" : "opens your mail app"}</span>}
                    {status === "sending" && <span className="text-muted">sending…</span>}
                    {status === "sent" && (
                      <span>
                        <span className="text-lime">201 Created</span> <span className="text-muted">— thanks, talk soon!</span>
                      </span>
                    )}
                    {status === "error" && (
                      <span>
                        <span className="text-err">502</span> <span className="text-muted">— please email me directly</span>
                      </span>
                    )}
                  </motion.span>
                </AnimatePresence>
                <motion.button
                  type="submit"
                  disabled={status === "sending"}
                  whileTap={{ scale: 0.96 }}
                  className="flex items-center gap-2 rounded-md bg-lime px-4 py-2 font-sans text-sm font-semibold text-bg transition hover:bg-fg disabled:opacity-60"
                >
                  {status === "sending" ? <LoaderCircle className="size-4 animate-spin" /> : <Play className="size-3.5 fill-current" />}
                  Send request
                </motion.button>
              </div>
            </form>
          </Reveal>

          <Reveal delay={0.1} className="min-w-0">
            <p className="font-mono text-xs text-subtle">or reach me directly</p>
            <div className="mt-2">
              <CopyEmail />
              {channels.map(({ href, label, value, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 border-b border-line py-5"
                >
                  <Icon className="size-5 shrink-0 text-muted transition group-hover:text-lime" />
                  <span className="min-w-0 flex-1">
                    <span className="block font-mono text-[11px] text-subtle">{label}</span>
                    <span className="block truncate text-lg transition group-hover:text-lime">{value}</span>
                  </span>
                  <ArrowUpRight className="size-4 text-muted transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-lime" />
                </a>
              ))}
            </div>
            <p className="mt-6 font-mono text-xs text-subtle">
              {profile.location} · {profile.phone}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
