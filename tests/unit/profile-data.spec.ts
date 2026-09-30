import { existsSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "@playwright/test";
import { hops, layers, projects, services, traces } from "../../src/data/profile";

// Guards for src/data/profile.ts: mistakes here don't break the build, they silently break the page.

test.describe("projects", () => {
  test("ids are unique kebab-case", () => {
    const ids = projects.map((p) => p.id);
    expect(new Set(ids).size, "duplicate project id").toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  for (const p of projects) {
    test(`"${p.name}" is complete and within card limits`, () => {
      // The desktop card has a fixed height; these limits keep the stack chips and links from being clipped.
      expect(p.name.length).toBeLessThanOrEqual(32);
      expect(p.tagline.length).toBeLessThanOrEqual(90);
      expect(p.problem.length).toBeLessThanOrEqual(240);
      expect(p.built.length).toBeGreaterThanOrEqual(2);
      expect(p.built.length).toBeLessThanOrEqual(4);
      for (const b of p.built) expect(b.length).toBeLessThanOrEqual(95);
      expect(p.stack.length).toBeGreaterThanOrEqual(2);
      expect(p.stack.length).toBeLessThanOrEqual(8);
      expect(p.meta).toMatch(/\S · \S/);
      for (const l of p.links) expect(l.href).toMatch(/^https:\/\//);
    });

    if (p.image) {
      test(`"${p.name}" screenshot exists in public/`, () => {
        expect(p.image!.src).toMatch(/^\/projects\/.+\.(png|jpe?g|webp)$/);
        expect(existsSync(join(process.cwd(), "public", p.image!.src)), p.image!.src).toBe(true);
        expect(p.image!.alt.length).toBeGreaterThan(10);
      });
    }
  }
});

test("every stack-map trace step exists in a layer", () => {
  // A misspelt step doesn't error; the chip just silently never highlights.
  const items = new Set<string>(layers.flatMap((l) => [...l.items]));
  for (const t of traces) for (const step of t.path) expect(items.has(step), `trace "${t.id}" step "${step}"`).toBe(true);
});

test("stack-map items are unique across layers", () => {
  const all = layers.flatMap((l) => [...l.items]);
  expect(all.length - new Set(all).size, "an item appears in two layers").toBe(0);
});

test("section and service ids are unique", () => {
  expect(new Set(hops.map((h) => h.id)).size).toBe(hops.length);
  expect(new Set(services.map((s) => s.id)).size).toBe(services.length);
});
