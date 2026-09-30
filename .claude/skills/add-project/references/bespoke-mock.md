# Writing a bespoke project mock

A bespoke mock is a small, live, fake UI of the project (see `JobFeedMock`, `ExpenseMock`, `HemoMock` in
`src/components/project-mocks.tsx`). It's worth it for flagship projects: it shows the product *doing* its job.
Read one or two existing mocks before writing a new one — match them.

## Registering it

1. Export the component from `src/components/project-mocks.tsx` (e.g. `export function BudgetMock()`).
2. Add it to the `mocks` map in `src/components/sections/projects.tsx`, keyed by the project's `id`:
   `const mocks = { jobs: JobFeedMock, …, "budget-tracker": BudgetMock };`

That's all — `ProjectVisual` prefers a registered mock over `image` and the stack diagram.

## Conventions (and why)

- **Size**: fit inside the card's visual panel — a root element around `w-full max-w-md` (or a phone frame ~260px
  wide like Hemo). The panel is centred and padded; anything wider gets clipped on laptops.
- **Animate only while visible**: use the file's `useTicker(ref, ms, fn)` for recurring updates, or `useInView` for
  one-shot entrances. Several mocks are on the page at once; off-screen timers waste CPU and made the page janky
  before this rule existed.
- **Transform/opacity only** for animation (framer-motion `x`, `y`, `scale`, `opacity`, `layout`). No animated
  `filter: blur`, `backdrop-blur`, or width/height tweens on large elements — they cause scroll jank. Small progress
  bars animating `width` are fine (see `ExpenseMock`).
- **Design tokens, not raw colours**: `bg-bg`, `bg-surface`, `bg-surface-2`, `border-line(-strong)`, `text-fg`,
  `text-muted`, `text-subtle`, accent `text-lime`/`bg-lime`, and `text-warn`/`text-err` sparingly. Mono labels use
  `font-mono text-[10px]/text-xs`.
- **Fictional data only**: made-up companies, people and numbers (e.g. "Northwind", "Dr. Rao"). Never real
  customer data, real employers' names in a way that implies endorsement, or real personal information.
- **Deterministic first frame**: the static HTML renders the initial state; anything random or time-based must be
  seeded from constants or set in `useEffect`, otherwise hydration mismatches (the e2e suite fails on any console
  error).
- **Reduced motion** is handled globally (`MotionConfig reducedMotion="user"` + CSS), so don't add per-mock checks —
  just don't rely on animation to convey information.
- **Accessibility**: decorative-only mocks are fine, but real buttons inside a mock (like Hemo's role tabs) need
  `type="button"` and readable labels.

## Checking it

The standard verification in SKILL.md step 6 covers it: the e2e suite fails on runtime/console errors and checks the
card renders, and `snap-project.mjs` shows it at desktop and mobile widths. Look closely at the mobile screenshot —
mocks are the usual source of horizontal overflow (fix with `min-w-0`, `truncate`, or a smaller `max-w`).
