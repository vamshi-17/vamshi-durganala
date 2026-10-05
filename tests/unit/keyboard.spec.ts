import { expect, test } from "@playwright/test";
import { detectKeyboard, modifierKey } from "../../src/lib/keyboard";

const UA = {
  windows: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36",
  mac: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15",
  linux: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36",
  iphone: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148",
  android: "Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Mobile Safari/537.36",
};

test.describe("detectKeyboard", () => {
  test("Windows and Linux use Ctrl", () => {
    expect(detectKeyboard({ platform: "Win32", userAgent: UA.windows, userAgentData: { platform: "Windows" } }, false)).toBe("pc");
    expect(detectKeyboard({ platform: "Linux x86_64", userAgent: UA.linux }, false)).toBe("pc");
  });

  test("Macs use ⌘ (old and new platform APIs)", () => {
    expect(detectKeyboard({ platform: "MacIntel", userAgent: UA.mac }, false)).toBe("mac");
    expect(detectKeyboard({ userAgent: UA.windows, userAgentData: { platform: "macOS" } }, false)).toBe("mac");
  });

  test("an iPad with a keyboard uses ⌘", () => {
    expect(detectKeyboard({ platform: "MacIntel", userAgent: UA.mac }, false)).toBe("mac"); // iPadOS reports as a Mac
  });

  test("touch-only devices get no hint, whatever the platform", () => {
    expect(detectKeyboard({ platform: "iPhone", userAgent: UA.iphone }, true)).toBe("touch");
    expect(detectKeyboard({ platform: "Linux armv8l", userAgent: UA.android }, true)).toBe("touch");
    expect(detectKeyboard({ platform: "MacIntel", userAgent: UA.mac }, true)).toBe("touch"); // iPad, no keyboard
  });

  test("modifierKey", () => {
    expect(modifierKey("mac")).toBe("⌘");
    expect(modifierKey("pc")).toBe("Ctrl");
  });
});
