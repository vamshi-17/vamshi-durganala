"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LoaderCircle, Play } from "lucide-react";
import { profile } from "@/data/profile";
import { cn } from "@/lib/utils";
import { track } from "@/components/analytics";
import {
  LIMITS,
  checkMailDomain,
  suggestEmail,
  validate,
  validateEmail,
  type DomainCheck,
  type Field,
  type Values,
} from "@/lib/validate-contact";

// Free key from https://web3forms.com, provided at build time; without it the form falls back to mailto.
const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

type Status = "idle" | "invalid" | "validating" | "sending" | "sent" | "error";
type Domain = DomainCheck | "checking";

const EMPTY: Values = { name: "", email: "", message: "" };
const ORDER: Field[] = ["name", "email", "message"];

const input =
  "min-w-0 flex-1 border-b border-dashed bg-transparent text-lime outline-none placeholder:text-subtle transition-colors";

/** One numbered line of the fake JSON editor. */
function Line({ n, children, className }: { n: number; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("grid grid-cols-[2.25rem_1fr]", className)}>
      <span className="select-none pr-3 text-right text-subtle">{n}</span>
      <div className="min-w-0 pr-4 pl-2">{children}</div>
    </div>
  );
}

/** A `// comment` line under a field: errors, hints and live checks. */
function Comment({ id, tone, children }: { id?: string; tone: "err" | "info" | "ok"; children: React.ReactNode }) {
  return (
    <motion.p
      id={id}
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("pl-4 text-xs leading-8", tone === "err" ? "text-err" : tone === "ok" ? "text-lime/80" : "text-subtle")}
    >
      {"// "}
      {children}
    </motion.p>
  );
}

export function ContactForm() {
  const [values, setValues] = useState<Values>(EMPTY);
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [domains, setDomains] = useState<Record<string, Domain>>({});
  const [status, setStatus] = useState<Status>("idle");
  const refs = { name: useRef<HTMLInputElement>(null), email: useRef<HTMLInputElement>(null), message: useRef<HTMLTextAreaElement>(null) };

  const emailDomain = values.email.trim().toLowerCase().split("@")[1] ?? "";
  const domain = domains[emailDomain];
  const errors = validate(values);
  if (!errors.email && domain === "no-mail") errors.email = `domain "${emailDomain}" can't receive email — check for typos`;
  const suggestion = !errors.email || errors.email.startsWith("domain") ? suggestEmail(values.email) : undefined;

  const visible = (f: Field) => (touched[f] || submitted) && errors[f];
  const errorCount = Object.keys(errors).length;

  const set = (f: Field) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [f]: e.target.value }));
    if (status === "invalid" || status === "error") setStatus("idle");
  };

  async function lookupDomain(email: string): Promise<DomainCheck> {
    const d = email.trim().toLowerCase().split("@")[1];
    if (!d || validateEmail(email)) return "unknown";
    setDomains((m) => ({ ...m, [d]: m[d] ?? "checking" }));
    const result = await checkMailDomain(email);
    setDomains((m) => ({ ...m, [d]: result }));
    return result;
  }

  const blur = (f: Field) => () => {
    setTouched((t) => ({ ...t, [f]: true }));
    if (f === "email") void lookupDomain(values.email);
  };

  const focusFirstInvalid = (errs: Partial<Record<Field, string>>) => {
    const first = ORDER.find((f) => errs[f]);
    if (first) refs[first].current?.focus();
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Capture now: React clears e.currentTarget once this handler awaits.
    const form = e.currentTarget;
    if (status === "sending" || status === "validating") return;
    setSubmitted(true);

    if (errorCount) {
      setStatus("invalid");
      focusFirstInvalid(errors);
      return;
    }

    // Final gate: make sure the email's domain can actually receive mail (fails open on network issues).
    setStatus("validating");
    if ((await lookupDomain(values.email)) === "no-mail") {
      setStatus("invalid");
      refs.email.current?.focus();
      return;
    }

    const clean = { name: values.name.trim(), email: values.email.trim(), message: values.message.trim() };
    const honeypot = (form.elements.namedItem("botcheck") as HTMLInputElement | null)?.checked;

    if (!WEB3FORMS_KEY) {
      track("generate_lead", { method: "mailto" });
      const subject = encodeURIComponent(`Hello from ${clean.name}`);
      const body = encodeURIComponent(`${clean.message}\n\n— ${clean.name} (${clean.email})`);
      window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
      setStatus("idle");
      return;
    }

    setStatus("sending");
    try {
      // FormData (not JSON) keeps this a "simple" CORS request: no preflight, same format that's proven in production.
      const body = new FormData();
      body.append("access_key", WEB3FORMS_KEY);
      body.append("subject", `Portfolio: message from ${clean.name}`);
      body.append("from_name", clean.name);
      body.append("replyto", clean.email);
      Object.entries(clean).forEach(([k, v]) => body.append(k, v));
      if (honeypot) body.append("botcheck", "on");
      const res = await fetch("https://api.web3forms.com/submit", { method: "POST", body });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      setStatus("sent");
      track("generate_lead", { method: "contact_form" });
      setValues(EMPTY);
      setTouched({});
      setSubmitted(false);
    } catch {
      setStatus("error");
    }
  }

  const fieldProps = (f: Field) => ({
    name: f,
    value: values[f],
    onChange: set(f),
    onBlur: blur(f),
    "aria-invalid": visible(f) ? true : undefined,
    "aria-describedby": `contact-${f}-note`,
    className: cn(input, visible(f) ? "border-err/70 focus:border-err" : "border-line-strong focus:border-lime"),
  });

  let n = 0;
  const msgLen = values.message.trim().length;

  return (
    <form onSubmit={onSubmit} noValidate className="overflow-hidden rounded-xl border border-line-strong bg-surface font-mono text-[13px]">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-3">
        <span>
          <span className="rounded bg-lime/15 px-2 py-1 text-[11px] font-semibold text-lime">POST</span>{" "}
          <span className="text-fg">/api/contact</span>
        </span>
        <span className="text-[11px] text-subtle">Content-Type: application/json</span>
      </div>

      {/* Honeypot: real users never see or tick this; Web3Forms drops submissions where it's checked. */}
      <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden />

      <div className="py-4 leading-8">
        <Line n={++n}>
          <span className="text-subtle">{"{"}</span>
        </Line>

        <Line n={++n}>
          <label className="flex items-center gap-2 pl-4">
            <span className="shrink-0 text-fg">&quot;name&quot;</span>
            <span className="text-subtle">:</span>
            <input ref={refs.name} autoComplete="name" placeholder='"Jane Doe"' maxLength={LIMITS.name.max + 20} {...fieldProps("name")} />
            <span className="text-subtle">,</span>
          </label>
        </Line>
        <AnimatePresence initial={false}>
          {visible("name") && (
            <Line n={++n} key="name-note">
              <Comment id="contact-name-note" tone="err">
                ✕ &quot;name&quot; {errors.name}
              </Comment>
            </Line>
          )}
        </AnimatePresence>

        <Line n={++n}>
          <label className="flex items-center gap-2 pl-4">
            <span className="shrink-0 text-fg">&quot;email&quot;</span>
            <span className="text-subtle">:</span>
            <input
              ref={refs.email}
              type="email"
              inputMode="email"
              autoComplete="email"
              spellCheck={false}
              placeholder='"jane@company.com"'
              maxLength={LIMITS.email.max}
              {...fieldProps("email")}
            />
            <span className="text-subtle">,</span>
          </label>
        </Line>
        <AnimatePresence initial={false} mode="popLayout">
          {visible("email") ? (
            <Line n={++n} key="email-err">
              <Comment id="contact-email-note" tone="err">
                ✕ &quot;email&quot; {errors.email}
              </Comment>
            </Line>
          ) : null}
          {suggestion && (touched.email || submitted) ? (
            <Line n={++n} key="email-suggest">
              <Comment tone="info">
                did you mean{" "}
                <button
                  type="button"
                  onClick={() => {
                    setValues((v) => ({ ...v, email: suggestion }));
                    void lookupDomain(suggestion);
                    refs.email.current?.focus();
                  }}
                  className="text-lime underline decoration-dashed underline-offset-4 hover:text-fg"
                >
                  {suggestion}
                </button>
                ?
              </Comment>
            </Line>
          ) : null}
          {!visible("email") && domain === "checking" ? (
            <Line n={++n} key="email-checking">
              <Comment id="contact-email-note" tone="info">
                resolving MX for {emailDomain}…
              </Comment>
            </Line>
          ) : null}
          {/* Typo-squatted domains (e.g. gmial.com) do resolve; the suggestion matters more than the ✓. */}
          {!errors.email && domain === "ok" && !suggestion ? (
            <Line n={++n} key="email-ok">
              <Comment id="contact-email-note" tone="ok">
                ✓ {emailDomain} accepts mail
              </Comment>
            </Line>
          ) : null}
        </AnimatePresence>

        <Line n={++n}>
          <label className="flex gap-2 pl-4">
            <span className="shrink-0 text-fg">&quot;message&quot;</span>
            <span className="text-subtle">:</span>
            <textarea
              ref={refs.message}
              rows={4}
              placeholder='"We have a role you might like…"'
              maxLength={LIMITS.message.max + 200}
              data-lenis-prevent
              {...fieldProps("message")}
              className={cn(fieldProps("message").className, "resize-none border-b-0 leading-8")}
            />
          </label>
        </Line>
        <Line n={++n}>
          <Comment id="contact-message-note" tone={visible("message") ? "err" : "info"}>
            {visible("message") ? (
              <>✕ &quot;message&quot; {errors.message}</>
            ) : (
              <span className={cn(msgLen > LIMITS.message.max && "text-err")}>
                {msgLen} / {LIMITS.message.max} chars{msgLen > 0 && msgLen < LIMITS.message.min && ` · ${LIMITS.message.min - msgLen} more to go`}
              </span>
            )}
          </Comment>
        </Line>

        <Line n={++n}>
          <span className="text-subtle">{"}"}</span>
        </Line>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-4 py-3">
        <AnimatePresence mode="wait">
          <motion.span
            key={status}
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-xs"
          >
            {status === "idle" && <span className="text-subtle">{WEB3FORMS_KEY ? "ready" : "opens your mail app"}</span>}
            {status === "invalid" && (
              <span>
                <span className="text-err">400 Bad Request</span>{" "}
                <span className="text-muted">
                  — fix {Math.max(errorCount, 1)} field{errorCount > 1 ? "s" : ""}
                </span>
              </span>
            )}
            {status === "validating" && <span className="text-muted">verifying email domain…</span>}
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
          disabled={status === "sending" || status === "validating"}
          whileTap={{ scale: 0.96 }}
          className="flex items-center gap-2 rounded-md bg-lime px-4 py-2 font-sans text-sm font-semibold text-bg transition hover:bg-fg disabled:opacity-60"
        >
          {status === "sending" || status === "validating" ? (
            <LoaderCircle className="size-4 animate-spin" />
          ) : (
            <Play className="size-3.5 fill-current" />
          )}
          Send request
        </motion.button>
      </div>
    </form>
  );
}
