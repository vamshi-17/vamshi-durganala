/**
 * Contact-form validation. Sync rules run as the visitor types/blurs; `checkMailDomain` runs async on email blur
 * and before sending. A static site can't prove the sender owns the address (that needs a confirmation email and a
 * backend), so these checks aim to catch typos, junk and throwaway inboxes.
 */

export type Field = "name" | "email" | "message";
export type Values = Record<Field, string>;
export type Errors = Partial<Record<Field, string>>;

export const LIMITS = {
  name: { min: 2, max: 80 },
  email: { max: 254 },
  message: { min: 20, max: 2000, maxLinks: 3 },
} as const;

// local@domain.tld — no spaces, no leading/trailing/double dots, TLD of 2+ letters. (No lookbehind: target is ES2017.)
const EMAIL_RE = /^(?!.*\.\.)[a-z0-9_%+'-](?:[a-z0-9._%+'-]*[a-z0-9_%+'-])?@(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,24}$/i;
// Any letter in any script; built at runtime because \p{…} literals need an ES2018 target.
const LETTER_RE = new RegExp("\\p{L}", "u");

const DISPOSABLE = new Set([
  "mailinator.com", "guerrillamail.com", "guerrillamail.info", "sharklasers.com", "10minutemail.com",
  "tempmail.com", "temp-mail.org", "tempmailo.com", "yopmail.com", "trashmail.com", "getnada.com", "maildrop.cc",
  "dispostable.com", "fakeinbox.com", "throwawaymail.com", "mintemail.com", "mailnesia.com", "emailondeck.com",
  "moakt.com", "burnermail.io",
]);

const COMMON_DOMAINS = [
  "gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "icloud.com", "live.com", "aol.com", "msn.com",
  "protonmail.com", "proton.me",
];

export function validateName(raw: string): string | undefined {
  const v = raw.trim();
  if (!v) return "is required";
  if (v.length < LIMITS.name.min) return `needs at least ${LIMITS.name.min} characters`;
  if (v.length > LIMITS.name.max) return `must be ${LIMITS.name.max} characters or fewer`;
  if (!LETTER_RE.test(v)) return "should contain letters";
  if (/https?:\/\/|www\./i.test(v)) return "can't contain links";
  return undefined;
}

export function validateEmail(raw: string): string | undefined {
  const v = raw.trim();
  if (!v) return "is required";
  if (v.length > LIMITS.email.max) return "is too long";
  if (!v.includes("@")) return 'is missing an "@"';
  const domain = v.split("@").pop() ?? "";
  if (!domain) return "is missing a domain";
  if (!domain.includes(".")) return `is missing a domain ending, e.g. ${domain}.com`;
  if (!EMAIL_RE.test(v)) return "doesn't look like a valid address";
  if (DISPOSABLE.has(domain.toLowerCase())) return "is a disposable inbox — please use one you'll check";
  return undefined;
}

export function validateMessage(raw: string): string | undefined {
  const v = raw.trim();
  if (!v) return "is required";
  if (v.length < LIMITS.message.min) return `needs at least ${LIMITS.message.min} characters (${v.length} so far)`;
  if (v.length > LIMITS.message.max) return `must be ${LIMITS.message.max} characters or fewer`;
  if ((v.match(/https?:\/\//gi) ?? []).length > LIMITS.message.maxLinks) return `can include at most ${LIMITS.message.maxLinks} links`;
  return undefined;
}

export function validate(values: Values): Errors {
  const errors: Errors = {
    name: validateName(values.name),
    email: validateEmail(values.email),
    message: validateMessage(values.message),
  };
  (Object.keys(errors) as Field[]).forEach((k) => errors[k] === undefined && delete errors[k]);
  return errors;
}

function distance(a: string, b: string) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}

/** "jane@gmial.com" → "jane@gmail.com"; undefined when there's no close common-provider match. */
export function suggestEmail(raw: string): string | undefined {
  const [local, domain] = raw.trim().toLowerCase().split("@");
  if (!local || !domain || COMMON_DOMAINS.includes(domain)) return undefined;
  const best = COMMON_DOMAINS.map((d) => [d, distance(domain, d)] as const).sort((a, b) => a[1] - b[1])[0];
  return best && best[1] > 0 && best[1] <= 2 ? `${local}@${best[0]}` : undefined;
}

export type DomainCheck = "ok" | "no-mail" | "unknown";
const domainCache = new Map<string, Promise<DomainCheck>>();

async function dns(name: string, type: "MX" | "A", signal: AbortSignal) {
  const res = await fetch(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(name)}&type=${type}`, {
    headers: { accept: "application/dns-json" },
    signal,
  });
  if (!res.ok) throw new Error(`DoH ${res.status}`);
  return (await res.json()) as { Status: number; Answer?: { type: number; data: string }[] };
}

/**
 * Asks public DNS (Cloudflare DNS-over-HTTPS; only the domain is sent) whether the domain can receive mail.
 * Fails open: network errors or timeouts return "unknown" so a flaky lookup never blocks a real message.
 */
export function checkMailDomain(email: string): Promise<DomainCheck> {
  const domain = email.trim().toLowerCase().split("@")[1];
  if (!domain) return Promise.resolve("unknown");
  const cached = domainCache.get(domain);
  if (cached) return cached;

  const run = (async (): Promise<DomainCheck> => {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 3500);
    try {
      const mx = await dns(domain, "MX", ctrl.signal);
      if (mx.Status === 3) return "no-mail"; // NXDOMAIN: domain doesn't exist
      const records = (mx.Answer ?? []).filter((a) => a.type === 15);
      if (records.length) return records.every((r) => /^0\s+\.$/.test(r.data.trim())) ? "no-mail" : "ok"; // "0 ." = null MX
      // No MX: mail falls back to the A record (RFC 5321 §5.1).
      const a = await dns(domain, "A", ctrl.signal);
      return (a.Answer ?? []).some((r) => r.type === 1) ? "ok" : "no-mail";
    } catch {
      return "unknown";
    } finally {
      clearTimeout(timer);
    }
  })();
  domainCache.set(domain, run);
  return run;
}
