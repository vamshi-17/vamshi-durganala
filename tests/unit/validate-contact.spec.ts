import { expect, test } from "@playwright/test";
import { suggestEmail, validate, validateEmail, validateMessage, validateName } from "../../src/lib/validate-contact";

test.describe("validateEmail", () => {
  const valid = ["jane@company.com", "oneil+hr@example.co.uk", "first.last@sub.domain.io"];
  const invalid: [string, RegExp][] = [
    ["", /required/],
    ["jane", /missing an "@"/],
    ["jane@", /missing a domain/],
    ["jane@gmail", /domain ending/],
    ["a..b@x.com", /valid address/],
    [".a@x.com", /valid address/],
    ["a.@x.com", /valid address/],
    ["jane doe@x.com", /valid address/],
    ["temp@mailinator.com", /disposable/],
  ];
  for (const email of valid) test(`accepts ${email}`, () => expect(validateEmail(email)).toBeUndefined());
  for (const [email, error] of invalid) test(`rejects "${email}"`, () => expect(validateEmail(email)).toMatch(error));
});

test.describe("validateName", () => {
  for (const name of ["Vamshi", "José Ñúñez", "विजय"]) test(`accepts ${name}`, () => expect(validateName(name)).toBeUndefined());
  const invalid: [string, RegExp][] = [
    ["", /required/],
    ["V", /at least 2/],
    ["12345", /letters/],
    ["http://spam.com", /links/],
    ["x".repeat(81), /80 characters or fewer/],
  ];
  for (const [name, error] of invalid) test(`rejects "${name.slice(0, 20)}"`, () => expect(validateName(name)).toMatch(error));
});

test.describe("validateMessage", () => {
  test("requires 20+ characters and reports progress", () => expect(validateMessage("hi")).toMatch(/20 characters \(2 so far\)/));
  test("accepts a normal message", () => expect(validateMessage("Hello, I have a role that fits you.")).toBeUndefined());
  test("limits links", () => expect(validateMessage("see http://a.com http://b.com http://c.com http://d.com please")).toMatch(/at most 3 links/));
  test("limits length", () => expect(validateMessage("x".repeat(2001))).toMatch(/2000 characters or fewer/));
});

test("validate() only reports failing fields", () => {
  expect(validate({ name: "Jane", email: "jane@company.com", message: "A perfectly reasonable message." })).toEqual({});
  expect(Object.keys(validate({ name: "", email: "bad", message: "short" })).sort()).toEqual(["email", "message", "name"]);
});

test.describe("suggestEmail", () => {
  test("fixes common provider typos", () => {
    expect(suggestEmail("jane@gmial.com")).toBe("jane@gmail.com");
    expect(suggestEmail("jane@outlok.com")).toBe("jane@outlook.com");
  });
  test("leaves correct and unknown domains alone", () => {
    expect(suggestEmail("jane@gmail.com")).toBeUndefined();
    expect(suggestEmail("jane@acme.io")).toBeUndefined();
  });
});
