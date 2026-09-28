"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Check, Copy, Github, Linkedin, LoaderCircle, Send } from "lucide-react";
import { profile } from "@/data/profile";
import { Accent, SectionHeading } from "@/components/ui/section-heading";
import { Reveal, ease } from "@/components/ui/reveal";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Magnetic } from "@/components/ui/magnetic";

// Free key from https://web3forms.com — set as a repo secret; without it the form falls back to mailto.
const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

type Status = "idle" | "sending" | "sent" | "error";

function CopyEmail() {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(profile.email);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="group flex w-full items-center justify-between gap-4 rounded-2xl border border-line bg-surface/60 p-5 text-left transition hover:border-line-strong"
    >
      <span className="min-w-0">
        <span className="block font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Email</span>
        <span className="mt-1 block truncate text-base md:text-lg">{profile.email}</span>
      </span>
      <span className="relative grid size-10 shrink-0 place-items-center rounded-full bg-white/5">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={copied ? "check" : "copy"}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {copied ? <Check className="size-4 text-emerald-400" /> : <Copy className="size-4" />}
          </motion.span>
        </AnimatePresence>
      </span>
    </button>
  );
}

const inputClass =
  "w-full rounded-xl border border-line bg-bg/60 px-4 py-3 text-fg placeholder:text-subtle outline-none transition focus:border-accent/60 focus:ring-4 focus:ring-accent/10";

export function Contact() {
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    if (!WEB3FORMS_KEY) {
      const subject = encodeURIComponent(`Portfolio enquiry from ${data.get("name")}`);
      const body = encodeURIComponent(`${data.get("message")}\n\n— ${data.get("name")} (${data.get("email")})`);
      window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
      return;
    }

    setStatus("sending");
    data.append("access_key", WEB3FORMS_KEY);
    data.append("subject", `Portfolio enquiry from ${data.get("name")}`);
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

  return (
    <section id="contact" className="relative py-28 md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          index="05"
          eyebrow="Contact"
          title={
            <>
              Let&apos;s build something <Accent>reliable</Accent> together.
            </>
          }
          description="Open to full-time full stack and backend roles. Whether it's a role, a project or just a hello — my inbox is open."
        />

        <div className="grid gap-5 lg:grid-cols-[1fr_1.3fr]">
          <Reveal className="flex flex-col gap-4">
            <CopyEmail />
            {[
              { href: profile.socials.linkedin, label: "LinkedIn", handle: "in/vamshi-krishna-durganala", icon: Linkedin },
              { href: profile.socials.github, label: "GitHub", handle: "@vamshi-17", icon: Github },
            ].map(({ href, label, handle, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-4 rounded-2xl border border-line bg-surface/60 p-5 transition hover:border-line-strong"
              >
                <span className="flex min-w-0 items-center gap-4">
                  <Icon className="size-5 shrink-0 text-muted transition group-hover:text-fg" />
                  <span className="min-w-0">
                    <span className="block font-mono text-[11px] uppercase tracking-[0.2em] text-muted">{label}</span>
                    <span className="mt-1 block truncate">{handle}</span>
                  </span>
                </span>
                <ArrowUpRight className="size-5 shrink-0 text-muted transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg" />
              </a>
            ))}
            <p className="mt-auto pt-4 text-sm text-muted">
              {profile.location} · {profile.phone}
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <SpotlightCard className="p-6 md:p-8">
              <form onSubmit={onSubmit} className="grid gap-4">
                {/* honeypot for bots */}
                <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" />
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-2 text-sm text-muted">
                    Name
                    <input name="name" required autoComplete="name" placeholder="Jane Doe" className={inputClass} />
                  </label>
                  <label className="grid gap-2 text-sm text-muted">
                    Email
                    <input
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="jane@company.com"
                      className={inputClass}
                    />
                  </label>
                </div>
                <label className="grid gap-2 text-sm text-muted">
                  Message
                  <textarea
                    name="message"
                    required
                    rows={6}
                    placeholder="Tell me about the role or project…"
                    className={`${inputClass} resize-none`}
                  />
                </label>

                <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
                  <AnimatePresence mode="wait">
                    {status === "sent" && (
                      <motion.p key="sent" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-sm text-emerald-400">
                        Thanks! I&apos;ll get back to you soon.
                      </motion.p>
                    )}
                    {status === "error" && (
                      <motion.p key="error" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-sm text-rose-400">
                        Something went wrong — please email me directly.
                      </motion.p>
                    )}
                  </AnimatePresence>
                  <Magnetic>
                    <motion.button
                      type="submit"
                      disabled={status === "sending"}
                      whileTap={{ scale: 0.97 }}
                      className="group inline-flex items-center gap-2 rounded-full bg-fg px-6 py-3.5 text-sm font-medium text-bg transition hover:bg-white disabled:opacity-60"
                    >
                      {status === "sending" ? (
                        <>
                          <LoaderCircle className="size-4 animate-spin" /> Sending…
                        </>
                      ) : (
                        <>
                          Send message
                          <Send className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                        </>
                      )}
                    </motion.button>
                  </Magnetic>
                </div>
              </form>
            </SpotlightCard>
          </Reveal>
        </div>
      </div>

      <Reveal className="mx-auto mt-28 max-w-6xl overflow-hidden px-6">
        <motion.p
          initial={{ backgroundPosition: "0% 50%" }}
          whileInView={{ backgroundPosition: "100% 50%" }}
          transition={{ duration: 3, ease }}
          viewport={{ once: true }}
          className="select-none bg-gradient-to-r from-white/10 via-white/25 to-white/5 bg-[length:200%_100%] bg-clip-text text-center text-[clamp(3rem,13vw,10rem)] font-semibold leading-none tracking-[-0.05em] text-transparent"
        >
          Say hello.
        </motion.p>
      </Reveal>
    </section>
  );
}
