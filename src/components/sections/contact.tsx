"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDownToLine, ArrowUpRight, Check, Copy, Github, Linkedin, Mail, X } from "lucide-react";
import { profile } from "@/data/profile";
import { asset, copyText } from "@/lib/utils";
import { Mark, SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { ContactForm } from "@/components/contact-form";

function CopyEmail() {
  const [copied, setCopied] = useState<"idle" | "ok" | "failed">("idle");
  return (
    <button
      type="button"
      onClick={async () => {
        setCopied((await copyText(profile.email)) ? "ok" : "failed");
        setTimeout(() => setCopied("idle"), 1800);
      }}
      className="group flex w-full items-center gap-4 border-b border-line py-5 text-left"
    >
      <Mail className="size-5 shrink-0 text-muted transition group-hover:text-lime" />
      <span className="min-w-0 flex-1">
        <span className="block font-mono text-[11px] text-subtle">email</span>
        <span className="block truncate text-lg transition group-hover:text-lime">{profile.email}</span>
      </span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span key={copied} initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }}>
          {copied === "ok" && <Check className="size-4 text-lime" />}
          {copied === "failed" && <X className="size-4 text-err" />}
          {copied === "idle" && <Copy className="size-4 text-muted" />}
        </motion.span>
      </AnimatePresence>
      <span className="sr-only" aria-live="polite">
        {copied === "ok" ? "Email copied" : copied === "failed" ? "Couldn't copy — please select the address" : ""}
      </span>
    </button>
  );
}

export function Contact() {
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
            <ContactForm />
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
