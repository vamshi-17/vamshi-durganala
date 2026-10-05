# Vamshi Krishna Durganala — Portfolio

Personal portfolio built with **Next.js 15**, **Tailwind CSS v4**, **Framer Motion** and **Lenis**, statically exported and deployed to **GitHub Pages**.

Live: https://vamshi-17.github.io/vamshi-durganala/

## Local development

```bash
npm install
npm run dev      # http://localhost:3001
npm run lint
npm run build    # static export to ./out
npm run serve    # preview ./out at http://localhost:4173/vamshi-durganala/ (like GitHub Pages)
```

## Tests

[Playwright](https://playwright.dev) runs unit tests and end-to-end tests (desktop 1440px + Pixel 7) against a
production build. Analytics, the contact-form API and DNS are mocked, so tests never send email or hit the network.

```bash
npx playwright install chromium   # once per machine
npm test                          # everything (builds the site first)
npm run test:unit                 # fast unit tests only
npm run test:ui                   # interactive runner
```

CI runs the full suite on every pull request; the site only deploys when it passes. On failure, download the
`playwright-report` artifact from the workflow run and open `index.html`.

## Editing content

All copy lives in [`src/data/profile.ts`](src/data/profile.ts): roles (`services`), side projects (`projects`),
the stack map (`layers` and `traces`), the hero console's `endpoints` and the header ticker (`logLines`).
The résumé served by the site is [`public/Vamshi-Krishna-Durganala-Resume.pdf`](public/Vamshi-Krishna-Durganala-Resume.pdf);
replace that file to update it.

## Concept

The page is modelled as a request travelling through a system — client → gateway → services → events → data → response.
Each section is one hop, and the rail on the left tracks the reader's position through them.

## Project structure

```
src/
  app/                   layout, page, global styles (graphite + lime tokens), favicon
  components/
    sections/            hero, about, experience, projects, stack, contact
    api-console.tsx      interactive "GET /engineer" console in the hero
    project-mocks.tsx    live mock UIs for each side project
    system-rail.tsx      scroll-linked pipeline rail
    command-palette.tsx  Ctrl/⌘ + K navigation
    smooth-scroll.tsx    Lenis smooth scrolling
    ui/                  reveal, magnetic, section heading, log ticker
  data/profile.ts        all site content
  lib/                   helpers and the active-section hook
```

## Deployment

`.github/workflows/deploy.yml` runs on every pull request (lint, type-check, build, tests) and on pushes to `main`
(the same, then deploy to GitHub Pages). The base path is derived from the repo name automatically.

One-time setup in the repo:

1. **Settings → Pages → Source:** GitHub Actions.
2. *(Optional)* **Settings → Secrets and variables → Actions → New repository secret** named
   `WEB3FORMS_KEY` with a free key from [web3forms.com](https://web3forms.com) to enable the contact form.
   Without it the form falls back to opening the visitor's email client.

## Branching

`main` is protected and always reflects what is live. Work happens on `feature/*`, `fix/*` or `chore/*`
branches and lands via pull request once CI is green.
