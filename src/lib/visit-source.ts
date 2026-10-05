/**
 * Where a visit came from, read from a tagged link: `?ref=linkedin`, `?ref=acme` (an application), or the standard
 * `?utm_source=…`. Normalised to a short lowercase slug so "LinkedIn" and "linkedin " count as the same source.
 * Returns undefined for untagged visits (the browser's own referrer is used then).
 */
export function visitSource(search: string): string | undefined {
  const params = new URLSearchParams(search);
  const raw = params.get("ref") ?? params.get("utm_source");
  if (!raw) return undefined;
  const slug = raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return slug || undefined;
}
