import { expect, test } from "@playwright/test";
import { visitSource } from "../../src/lib/visit-source";

test.describe("visitSource", () => {
  const cases: [string, string | undefined][] = [
    ["", undefined],
    ["?foo=bar", undefined],
    ["?ref=linkedin", "linkedin"],
    ["?ref=LinkedIn%20", "linkedin"],
    ["?ref=Acme Corp", "acme-corp"],
    ["?utm_source=newsletter", "newsletter"],
    ["?ref=resume&utm_source=ignored", "resume"],
    ["?ref=%3Cscript%3E", "script"],
    ["?ref=---", undefined],
    [`?ref=${"x".repeat(60)}`, "x".repeat(40)],
  ];
  for (const [search, expected] of cases) {
    test(`${JSON.stringify(search.slice(0, 30))} → ${expected}`, () => expect(visitSource(search)).toBe(expected));
  }
});
