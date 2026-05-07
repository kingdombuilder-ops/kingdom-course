# Render Harness — verification workflow for The Kingdom Course

*This document describes how to verify any future migration before presenting it. Re-run this on every batch.*

---

## Why a render harness

The Kingdom Course is built with inline `style={{}}` (not Tailwind utility classes — the V2 attempt at Tailwind rendered blank in the user's environment). The risk model that follows from that constraint:

1. **A successful Vite build is necessary but not sufficient.** Vite verifies modules resolve and code compiles. It doesn't catch a component that throws on first render, references an undefined identifier in JSX, or expects DOM globals that aren't in scope.
2. **A "looks correct" code review is insufficient.** The migration is mechanical (extract from `the_kingdom.jsx`, fix paths, ship), but the surface area is large enough that a typo in a class name or a missed prop can survive review and break at runtime.

So every batch goes through three gates before it's presented.

---

## The three gates

### Gate 1 — Parse check

Every `.js` and `.jsx` file under `kingdom-vite/src/` is parsed with `@babel/parser` (the same parser Vite uses internally). This catches:
- Syntax errors
- Unclosed JSX tags
- Stray characters from copy-paste

```bash
cd /home/claude/verify
node parse-check.mjs
```

Expected output: `N passed, 0 failed, N total` where N is the file count.

### Gate 2 — Render check

Each migrated component is mounted in jsdom with React 18 and the resulting DOM is asserted against. This catches:
- Components that throw on mount
- Missing exports from `@data` or `@shared`
- Stale strings or labels (e.g., the "Light · Fire · Peace · Glory" pre-rename litany)
- Behavioral regressions in interactive flows (e.g., quiz transitions)

```bash
cd /home/claude/verify
node render-check-deep.mjs
```

The harness handles:
- jsdom setup with all the globals React 18 needs
- The `@data` / `@shared` / `@modals` aliases that Vite resolves at build time
- Babel transformation on the fly (preset-env + preset-react with automatic runtime)
- A simulated click-through of multi-phase components (e.g., `HousesQuiz` answering all six questions to reach the result phase)

### Gate 3 — Production build

```bash
cd kingdom-vite
npx vite build
```

Expected: 1,514+ modules transformed, no errors. Bundle sizes within the targets in `MIGRATION.md`.

---

## Adding tests for new modals

When migrating a new modal (e.g., `LectioDivina`), add to `render-check-deep.mjs` in the modal-tests section:

```javascript
const { default: LectioDivina } = loadModule(path.join(SRC, 'modals/LectioDivina.jsx'));

await step('LectioDivina renders without throwing', async () => {
  const html = await renderToHtml(React.createElement(LectioDivina, {
    onComplete: () => {},
    onClose: () => {},
  }));
  // Pick a phrase that should appear if the gospel passage is rendered correctly
  if (!html.includes('Lectio Divina')) throw new Error('header missing');
});
```

For modals with multi-phase flow (most of them), follow the `HousesQuiz` pattern: render, find the next-phase button, click it, assert the new phase rendered. The `act()` wrapper around state-changing events is critical — without it React batches updates differently and the DOM check sees stale state.

---

## Catching regressions in shared data

The deep harness also asserts the `@data` barrel exports everything expected. When you change `src/data/index.js` (e.g., adding a new export), update the `expectedExports` array in `render-check-deep.mjs` to match. If you remove an export, removing it from the array shows the test that will catch any consumer that still imports it.

The post-rename House label test (`HOUSES.peace.name === 'Joy'`, etc.) is a regression guard. If anyone migrates the data layer from another source and accidentally pulls a pre-rename version, this test fails immediately.

---

## When to skip the harness

Don't. The user memory rule is explicit: every build verifies through this harness before presentation. The cost is ~5 seconds; the cost of skipping it is a broken `localhost:5173`.

---

## Files

- `/home/claude/verify/parse-check.mjs` — Gate 1
- `/home/claude/verify/render-check.mjs` — Gate 2 (the simpler, faster version)
- `/home/claude/verify/render-check-deep.mjs` — Gate 2 (with state-change tests)
- `/home/claude/verify/package.json` — pinned dependencies for the harness

---

*Salus animarum suprema lex.*
