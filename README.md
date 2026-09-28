# Vamshi Krishna Durganala — Portfolio

Personal portfolio built with **Next.js 15**, **Tailwind CSS v4** and **Framer Motion**, statically exported and deployed to **GitHub Pages**.

Live: https://vamshi-17.github.io/vamshi-portfolio/

## Local development

```bash
npm install
npm run dev      # http://localhost:3001
npm run lint
npm run build    # static export to ./out
```

## Editing content

All copy — roles, experience, projects, skills, certifications, education — lives in
[`src/data/profile.ts`](src/data/profile.ts). The résumé served by the site is
[`public/Vamshi-Krishna-Durganala-Resume.pdf`](public/Vamshi-Krishna-Durganala-Resume.pdf); replace that file to update it.

## Project structure

```
src/
  app/                 layout, page, global styles, favicon
  components/
    sections/          hero, about, experience, work, skills, contact
    ui/                reusable motion primitives (reveal, magnetic, spotlight card, counter, marquee)
    nav.tsx            floating nav with active-section pill and scroll progress
    background.tsx     aurora / grid / cursor-glow backdrop
  data/profile.ts      all site content
  lib/utils.ts         cn() and asset() (base-path aware) helpers
```

## Deployment

`.github/workflows/deploy.yml` runs on every pull request (lint + build only) and on pushes to `main`
(lint + build + deploy to GitHub Pages). The base path is derived from the repo name automatically.

One-time setup in the repo:

1. **Settings → Pages → Source:** GitHub Actions.
2. *(Optional)* **Settings → Secrets and variables → Actions → New repository secret** named
   `WEB3FORMS_KEY` with a free key from [web3forms.com](https://web3forms.com) to enable the contact form.
   Without it the form falls back to opening the visitor's email client.

## Branching

`main` is protected and always reflects what is live. Work happens on `feature/*`, `fix/*` or `chore/*`
branches and lands via pull request once CI is green.
