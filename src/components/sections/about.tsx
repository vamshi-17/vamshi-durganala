"use client";

import { motion } from "framer-motion";
import { headers } from "@/data/profile";
import { Mark, SectionHeading } from "@/components/ui/section-heading";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";

const principles = [
  ["Boring in production", "Idempotent consumers, retries with backoff, sane timeouts, and logs that tell you what happened — so on-call stays quiet."],
  ["Secure by default", "Auth is designed in, not bolted on: OAuth 2.0 + MFA at the edge, RBAC in the service, least privilege in the cloud."],
  ["Tested, then shipped", "Unit, API and load tests in CI with quality gates, then GitOps deploys that are easy to roll back."],
];

export function About() {
  return (
    <section id="about" className="relative py-28 md:py-40">
      <div className="mx-auto max-w-6xl px-5 md:px-6">
        <SectionHeading
          hop="about"
          title={
            <>
              Backend-first. <Mark>Full stack</Mark> by habit.
            </>
          }
        />

        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <Reveal className="space-y-6 text-lg leading-relaxed text-muted text-pretty md:text-xl md:leading-relaxed">
            <p className="text-fg">
              I like owning a feature all the way through — the data model, the API, the event it publishes, the screen someone
              clicks, and the dashboard that proves it&apos;s healthy.
            </p>
            <p>
              Right now that&apos;s an enterprise election management platform at TGS Technology: 14+ Spring Boot services talking
              over Kafka, secured with Keycloak, on AWS EKS. Before that I built engineering tooling for Telstra at Cognizant, and
              started out migrating legacy JSP apps to Angular.
            </p>
            <p>
              After hours I build tools I actually use — lately a platform that finds new job postings minutes after they go live. I
              pair with Copilot and Claude Code, and review what they write like any other PR.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="overflow-hidden rounded-xl border border-line-strong bg-surface font-mono text-[13px]">
              <div className="flex items-center justify-between border-b border-line px-4 py-3">
                <span>
                  <span className="text-subtle">HTTP/1.1</span> <span className="text-lime">200 OK</span>
                </span>
                <span className="text-[11px] text-subtle">response headers</span>
              </div>
              <Stagger className="divide-y divide-line">
                {headers.map(([k, v]) => (
                  <StaggerItem key={k} className="grid grid-cols-[8.5rem_1fr] gap-3 px-4 py-3 sm:grid-cols-[9.5rem_1fr]">
                    <span className="text-subtle">{k}:</span>
                    <span className={k === "X-Status" ? "text-lime" : "text-fg"}>{v}</span>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          </Reveal>
        </div>

        <Stagger className="mt-20 grid gap-px overflow-hidden rounded-xl border border-line bg-line md:grid-cols-3">
          {principles.map(([title, body], i) => (
            <StaggerItem key={title} className="group relative bg-bg p-7 transition-colors duration-500 hover:bg-surface">
              <motion.span className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-lime transition-transform duration-500 group-hover:scale-x-100" />
              <span className="font-mono text-xs text-lime">0{i + 1}</span>
              <h3 className="mt-4 text-xl font-semibold tracking-tight">{title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{body}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
