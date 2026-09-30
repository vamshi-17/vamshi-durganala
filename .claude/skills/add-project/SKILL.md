---
name: add-project
description: Add a new side project to Vamshi's portfolio site (the "Things I build for myself" / /projects section) — drafting the card copy from the project's repo or the user's description, choosing its visual (bespoke live mock, real screenshot, or auto-generated stack diagram), optionally extending the stack map, verifying with tests and screenshots, and shipping it as a pull request. Use this whenever the user wants to add, showcase, feature, list or put a project on the portfolio/site — e.g. "add my budget app to the portfolio", "put D:\Projects\foo on the site", "I finished X, can we show it?", "feature my GitHub repo Y" — even if they don't say "skill" or name the file. Also use it when replacing or reordering existing project cards. Not for editing work experience (that's `services` in profile.ts) or for general redesigns.
---

# Add a project to the portfolio

A project card is public, permanent-feeling copy on someone's job-search portfolio, so the two things that matter
most are **accuracy** (every claim true and verifiable) and **not breaking the live site** (it deploys when the PR
merges). The workflow below is ordered around those two concerns.

Read `CLAUDE.md` first if it isn't already in context — it has the branch/PR rules, commands and design conventions
this skill assumes.

## 1. Start clean

```bash
git status --short            # must be clean; if not, ask the user what to do with their changes
git switch main && git pull --ff-only
git switch -c feat/project-<id>
```

`main` is protected and deploys on merge, so all work happens on a branch and lands via PR. `<id>` is the project's
kebab-case id (e.g. `budget-tracker`).

## 2. Gather the facts (research first, then ask)

Before asking the user anything, learn what you can yourself — it saves them effort and your draft will be better:

- **Local path given** → read `README*`, the manifest (`package.json`, `pom.xml`, `build.gradle`, `requirements.txt`,
  `docker-compose.yml`…), the top-level folder layout, and `git log --oneline -15` for timeline and scope.
- **GitHub repo given** → `gh repo view <owner>/<repo>` and `gh api repos/<owner>/<repo>/readme -q .content | base64 -d`,
  plus `gh api repos/<owner>/<repo>/languages`. (Use the full `gh.exe` path from CLAUDE.md if `gh` isn't on PATH.)
- **Only a description** → work from that.

Then ask only for what you couldn't find, typically:
- Is the code public (link it) or private (card shows "private repo · demo on request")? Any live demo URL?
- Year and status (e.g. "2026 · in active development", "2024 · shipped").
- Where it should go in the list (array order = display order; strongest/most recent first is the usual choice).
- Do they have a screenshot? (see step 4)

Don't invent numbers, users, performance figures or technologies. If the repo doesn't show it and the user didn't say
it, it doesn't go on the card — a recruiter may ask about any line in an interview.

## 3. Draft the card and get a "yes" before editing

Write the entry for the `projects` array in `src/data/profile.ts` and show it to the user as a readable preview (not
just a diff) before touching the file. Match the voice of the existing entries — read them first.

| Field | Guidance | Hard limit (unit-tested) |
|---|---|---|
| `id` | kebab-case, unique | `^[a-z0-9]+(-[a-z0-9]+)*$` |
| `name` | The product's name | ≤ 32 chars |
| `tagline` | One sentence: the outcome for the user, not the tech | ≤ 90 chars |
| `problem` | Why it exists / what it solves, 1–2 sentences | ≤ 240 chars |
| `built` | 3–4 concrete things *they* built; lead with the substance, name real tech | 2–4 items, each ≤ 95 chars |
| `stack` | The technologies a reader would recognise, most important first | 2–8 items |
| `meta` | `"<year> · <status>"` | must contain ` · ` |
| `links` | `[{ label: "Code", href }]`, `"Live"`, or `"API"` + `"Client"` for split repos; `[]` if private | `https://` only |
| `image` | Optional screenshot, see step 4 | file must exist |

The limits exist because desktop cards have a fixed height: longer copy silently pushes the stack chips and links out
of view. `tests/unit/profile-data.spec.ts` enforces them, so a violation fails CI rather than shipping clipped.

Example of the voice (from the existing Expense App entry):
```ts
{
  id: "expense",
  name: "Expense App",
  tagline: "Budgets, salary and spending in one clear dashboard.",
  problem: "A full MERN app for tracking where money goes: set budgets by category, log expenses against them and see the month at a glance.",
  built: [
    "Express REST API with JWT auth middleware and bcrypt password hashing",
    "Mongoose models for budgets, categories, salary and expenses",
    "Joi request validation; Jest + Supertest API tests",
    "React + Material UI client with a dashboard of monthly totals",
  ],
  stack: ["Node.js", "Express", "MongoDB", "JWT", "React", "Material UI", "Jest"],
  meta: "2023 · full stack",
  links: [
    { label: "API", href: "https://github.com/vamshi-17/expense-app-server" },
    { label: "Client", href: "https://github.com/vamshi-17/expense-app-client" },
  ],
},
```

## 4. Choose the visual

`ProjectVisual` in `src/components/sections/projects.tsx` picks, in order: a bespoke mock registered for the id → the
`image` screenshot → an auto-generated `StackDiagram` of `stack`. So a card always renders; the choice is about
quality. Recommend one to the user:

1. **Real screenshot (preferred when available)** — real beats fake for credibility. Save it as
   `public/projects/<id>.png` (landscape, ~1280×800; crop browser chrome; keep it under ~400 KB — convert to `.webp`
   or compress if larger) and set `image: { src: "/projects/<id>.png", alt: "<what the screenshot shows>" }`. The alt
   text is read by screen readers, so describe the UI, not "screenshot".
2. **Bespoke live mock** — for flagship projects without a presentable screenshot. Read
   `references/bespoke-mock.md` before writing one; it has the conventions that keep the page fast and consistent.
3. **Stack diagram (default)** — nothing to do. Fine for smaller projects, and a good placeholder until a
   screenshot exists.

## 5. Stack map (only when it adds something)

The `/stack` section (`layers` and `traces` in `profile.ts`) is a map of everything used in production or shipped.

- If the project uses a notable technology that isn't in any layer yet, add it to the right layer (items must be
  unique across layers — unit-tested).
- Add a `trace` only if the project demonstrates a genuinely distinct request path worth walking through. Every step
  must exactly match an existing layer item; a typo doesn't error, the chip just never lights up — the unit test
  catches it.

Skip this step for projects whose stack is already covered.

## 6. Verify

Run these in order and fix anything that fails before moving on (on Windows Git Bash, commands are as written in
CLAUDE.md):

```bash
npm run lint && npx tsc --noEmit
npm run test:unit            # ~2s — data limits, ids, screenshot exists, trace steps
npm test                     # full suite, ~2–3 min; e2e renders every project from the data automatically
node .claude/skills/add-project/scripts/snap-project.mjs <id>
```

`snap-project.mjs` reuses the build `npm test` just made (`.next-test/`), serves it, and writes
`test-results/project-snaps/<id>-desktop.png` and `-mobile.png`. **Look at both images** (Read them) — tests prove
the card renders, not that it looks right. Check: copy reads well, nothing is clipped (the script also warns),
the visual isn't empty, and mobile doesn't overflow. If a bespoke mock is involved, glance at a neighbouring card's
screenshot too for consistency.

If the full suite fails on something unrelated to your change, say so rather than "fixing" unrelated code in this PR.

## 7. Ship as a pull request

```bash
git add src/data/profile.ts public/projects/ src/components/   # only what you changed
git commit -m "feat(projects): add <Name>" -m "<one-line summary>" -m "Co-Authored-By: …"   # per the session's attribution rules
git push -u origin feat/project-<id>
gh pr create --base main --title "feat(projects): add <Name>" --body "<summary, visual choice, test results>"
gh pr checks --watch         # both `build` and `e2e` must pass
```

The PR body should say what the card claims and where each claim came from (README, repo, the user), which visual
was chosen and why, and the verification results. Screenshots can't be attached via `gh`; mention their local paths
so the user can look.

Don't merge — the user reviews and merges, which is what deploys it. Finish by giving them the PR link, the two
screenshot paths, and anything they should double-check (e.g. a claim you inferred from code).

## Other operations

- **Reorder**: move the object within the array; numbering follows automatically.
- **Remove**: delete the object, plus its screenshot and any bespoke mock + its `mocks` registration.
- **Replace a stack diagram with a screenshot later**: add `image` and the file; nothing else changes.

Each is still a branch + verify + PR.
