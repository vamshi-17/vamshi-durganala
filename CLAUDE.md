# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Personal portfolio of Vamshi Krishna Durganala. Next.js 15 (App Router) + Tailwind CSS v4 + Framer Motion + Lenis,
**statically exported** and served from GitHub Pages at https://vamshi-17.github.io/vamshi-durganala/.

## Commands

```bash
npm run dev     # dev server on http://localhost:3001 (turbopack)
npm run lint    # next lint (ESLint, next/core-web-vitals + typescript)
npx tsc --noEmit
npm run build   # static export to ./out
npm run og      # re-render public/og.png from scripts/og/og.html (Playwright Chromium, falls back to Chrome/Edge)
npm run serve   # serve ./out under /vamshi-durganala/ like GitHub Pages (after a base-path build)

npm test                                   # everything: unit + e2e (desktop + mobile); builds the site first
npm run test:unit                          # unit tests only, no build (~2s)
npm run test:e2e                           # e2e only
npx playwright test tests/e2e/contact.spec.ts            # one file
npx playwright test -g "legacy #fragment"                # one test by name
npx playwright test --project=mobile                     # one viewport
npm run test:ui                            # interactive runner
```

First time on a machine: `npx playwright install chromium`.

**Tests** (Playwright, `playwright.config.ts`): `tests/unit/` runs pure functions in Node; `tests/e2e/` runs against a
real production build (base path + dummy `NEXT_PUBLIC_WEB3FORMS_KEY`) served by `scripts/serve-out.mjs`, which mimics
Pages (trailing-slash redirects, 404.html). The test build uses `NEXT_DIST_DIR=.next-test` so it can't collide with a
running `next dev`; note that with `output: "export"` a custom distDir is also where the export lands (not `out/`),
which is why serve-out reads `NEXT_DIST_DIR`. The auto fixture in `tests/e2e/fixtures.ts` blocks analytics, mocks
Cloudflare DNS (`*.no-such-domain.test` = dead domain), and **fails any test whose page throws or logs an error**.
Tag tests `@mobile` to also run on the Pixel 7 project, `@mobile-only` to run only there. Use relative `page.goto("about/")`
— a leading `/` drops the base path. Prefer `expect.poll`/web-first assertions over sleeps (scrolling is animated).

To build exactly as production does (assets under the Pages sub-path):

```bash
NEXT_PUBLIC_BASE_PATH=/vamshi-durganala npm run build
```

On Windows Git Bash prefix with `MSYS_NO_PATHCONV=1`, otherwise `/vamshi-durganala` is rewritten to a Windows path.

## Workflow rules

- `main` is protected and always equals what is live. Never commit to it directly: branch as `feat/*`, `fix/*`,
  `chore/*`, `docs/*`, `ci/*`, use Conventional Commit messages, push, and open a PR with `gh pr create`.
- `.github/workflows/deploy.yml` runs `build` (lint, type-check, build) and `e2e` (`npm test`, uploads the HTML report
  on failure) on every PR, and deploys to Pages only on push to `main` after both pass (i.e. merging a PR deploys).
  A PR is not done until both checks pass; add or update tests alongside behaviour changes.
- `gh` may not be on PATH in Git Bash on this machine; use `"/c/Program Files/GitHub CLI/gh.exe"`.
- Commit author email for this repo is `durganalavamshikrishna@gmail.com` (set in local git config; the global one is
  a work address).

## Architecture

**Concept — "live system".** The page is modelled as a request travelling through a backend. Each section is one hop,
defined once in `hops` in `src/data/profile.ts` (`home→client`, `about→gateway`, `experience→services`,
`projects→events`, `stack→data`, `contact→response`). Section ids, nav routes, the left `SystemRail`, the command
palette and each `SectionHeading` ("02 · services — GET /experience 200") all derive from `hops`; adding or renaming a
section means updating `hops` and the section's `id`, not those components.

**Adding or changing a side project: use the `add-project` skill** (`.claude/skills/add-project/`). A project needs
only a data entry — its visual falls back from a bespoke mock → `image` screenshot → auto-generated stack diagram
(`ProjectVisual` in `sections/projects.tsx`), numbering is derived from array order, and
`tests/unit/profile-data.spec.ts` enforces copy-length limits (desktop cards have a fixed height), unique ids,
screenshot files and valid stack-map trace steps.

**All content lives in `src/data/profile.ts`** — profile, `services` (jobs, with typed `changelog` entries rendered as
a git log), `projects` (side projects; array order = display order), `layers` + `traces` (the stack map; every step in a trace's `path` must exactly match
an item in some layer — unit-tested), `endpoints` (hero API console JSON), `logLines` (ticker) and
`headers` (about card). Prefer editing data over components.

**Static export + base path.** `next.config.ts` sets `output: "export"` and `basePath` from `NEXT_PUBLIC_BASE_PATH`
(set by CI to `/<repo-name>`, empty locally). Consequences:
- Anything in `public/` referenced from code must go through `asset()` in `src/lib/utils.ts`.
- Metadata image URLs in `layout.tsx` are *relative* (`"og.png"`) so they resolve against `metadataBase`, which
  includes the sub-path. A leading `/` would drop it.
- No server features: no API routes, no server actions, no runtime env. Anything dynamic runs client-side
  (e.g. the contact form posts directly to Web3Forms).

**Section URLs (no `#`).** Every section has a real route: `app/page.tsx` is `/` and `app/[section]/page.tsx`
statically generates `/about/`, `/experience/`, … — each renders the same `components/site.tsx`, told which section
to open. `lib/sections.ts` maps ids ↔ paths (base-path aware) and holds `SITE_URL`; all routes declare the home page
as canonical (root layout). Never use `href="#id"`: link with `<SectionLink to="about">` or call `navigateTo(id)`
(smooth scroll + `pushState`). `components/route-sync.tsx` jumps to the URL's section on load (re-aiming while the
layout grows after hydration), replaces the URL/title as the reader scrolls, handles back/forward, and upgrades legacy
`#about` links.

**Client-side runtime pieces.**
- `components/smooth-scroll.tsx` owns the single Lenis instance; programmatic scrolling must use its `scrollToId()`
  (or `navigateTo()` when the URL should change). Scrollable inner elements (palette list, textareas) need
  `data-lenis-prevent`.
- `lib/use-active-section.ts` (IntersectionObserver) drives the active state in both `Nav` and `SystemRail`.
- `CommandPalette` opens on Ctrl/⌘+K or via the `openPalette()` event helper. Shortcut *labels* come from
  `useKeyboardKind()` (`lib/keyboard.ts`): ⌘ on Apple, Ctrl elsewhere, none on touch-only devices — detected after
  hydration, so never hard-code a modifier key in markup.
- `components/analytics.tsx` loads GA4 (`G-CSC26DCGT1`) and GoatCounter (`GOATCOUNTER_CODE`) in production builds
  only; both IDs are public by design. GoatCounter is the primary visitor count: it runs with `no_onload` and counts
  **one page view per visit** — the landing path captured at module load, before RouteSync rewrites the URL — with
  the source from tagged links (`?ref=linkedin`, `?ref=<company>`, or `utm_source`; see `lib/visit-source.ts`).
  `track()` sends custom events to both; résumé downloads and outbound clicks are GoatCounter events via a document
  click listener (GA4 records those itself). Tests replace `gc.zgo.at/count.js` with a recorder
  (`tests/e2e/analytics.spec.ts`); the fixture blocks both services everywhere else.
- `NEXT_PUBLIC_WEB3FORMS_KEY` is injected at build time from the `WEB3FORMS_KEY` repo secret; without it the contact
  form falls back to `mailto:`.
- Contact form (`components/contact-form.tsx`) uses `noValidate` + custom rules in `lib/validate-contact.ts` (pure,
  testable): field rules, disposable-domain blocklist, typo suggestions, and an MX lookup via Cloudflare DNS-over-HTTPS
  that fails open. Submit as `FormData` (a JSON body triggers a CORS preflight). Capture `e.currentTarget` before any
  `await` in submit handlers — React clears it.

## Design system

Tokens are defined with `@theme` in `src/app/globals.css` (graphite `bg/surface/surface-2`, `fg/muted/subtle`, accent
`lime` #c8f31d, plus `warn`/`err`). Fonts: Bricolage Grotesque (sans; `font-display` utility = condensed heavy cut
for headlines) and JetBrains Mono (labels, code, technical text). Use the tokens rather than raw Tailwind colors.

Conventions that exist for a reason:
- Animate only `transform`/`opacity`. Blur filters, animated `backdrop-blur` and large animated blurred blobs caused
  scroll jank and were removed. `MotionConfig reducedMotion="user"` and the CSS reduced-motion block must keep working.
- Grid/flex children that contain long text or horizontally scrollable content need `min-w-0`, otherwise they widen
  the page on mobile (this caused horizontal overflow twice).
- `body` must not get a background (it would paint over the fixed `-z-10` backdrop); the background is on `html`.
- Tailwind v4 only emits `@keyframes` declared inside `@theme` when a `--animate-*` token uses them; keyframes used via
  arbitrary `animate-[…]` classes go at top level of `globals.css` (see `travel`).
- Ongoing mock animations (e.g. `project-mocks.tsx`) run only while in view (`useTicker`/`useInView`).
- Anything that depends on the visitor's clock or window renders a placeholder on the server and fills in inside
  `useEffect`, to avoid hydration mismatches in the static HTML.

## Assets

- `public/Vamshi-Krishna-Durganala-Resume.pdf` is the résumé the site serves; replace the file to update it.
- `public/og.png` is generated — edit `scripts/og/og.html` and run `npm run og`, don't hand-edit the PNG.
- `src/app/icon.svg` (favicon) and `src/app/apple-icon.png` (180px, full-bleed) are Next file-based metadata.
