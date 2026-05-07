# Migration Batches 16-17 — Lazy-Load Polish + Gospel Tab Complete

*Read alongside `BATCH_3_HANDOFF.md` through `BATCH_12_15_HANDOFF.md`. Two batches shipped together: a lazy-load polish that brings first-paint under the 180 KB target, and the full Gospel tab (the visitor-facing Gate). The Kingdom, Course, AND Gospel tabs are now all migrated.*

---

## What shipped

**Batch 16 — Lazy-load polish.** Wrapped `CourseTabView` in `React.lazy()` with a `Suspense` fallback. To enable this, moved all course-specific day-navigation logic (next/prev day, prologue handling, hasNext/hasPrev/labels) from App.jsx into CourseTabView itself. App.jsx now only holds `(weekN, dayKey)` state and a tiny `courseToggleComplete` handler. The 106 KB course data chunk + the CourseTabView component bundle now load on demand.

**Batch 17 — Gospel/Gate tab.** Migrated all 8 Gate components (Hero, Prologue, Trail, Circles, Bridge, CircleModal, GateInvitation, GospelTabView) plus the 9 CIRCLES of evidence data. Wired into App.jsx as a 4th preview mode. CircleModal manages its own keyboard handlers (Escape/ArrowLeft/ArrowRight) and the Gate locks body scroll while the modal is open. GospelTabView is also lazy-loaded.

| Batch | What | Status |
|---|---|---|
| 16 | Lazy-load CourseTabView + course data chunk; refactor day-navigation into CourseTabView | ✅ |
| 17 | 8 Gospel components + CIRCLES data + GospelTabView wrapper + lazy-load + 4-way preview toggle | ✅ |

## Components added (10 new this session)

| Component / module | File | Role |
|---|---|---|
| `gospel.js` (data) | data | 9 circles of evidence + 9 ring colors. Byte-perfect copy from source lines 4774-4971. |
| `Hero` | component | Gate landing hero — "The single greatest announcement in history" |
| `Prologue` | component | Long-form "The Message" section (anchor `#message`) |
| `Trail` | component | Davidic blueprint section with 11-row correspondence grid (anchor `#trail`) |
| `Circles` | component | 9-ring SVG visualization + tappable list (anchor `#circles`) |
| `Bridge` | component | "The circles you just saw are the path you are about to walk" — 9-ring SVG with beating wine core + Via Purgativa/Illuminativa/Unitiva explanation |
| `CircleModal` | component | Single-circle reading overlay with editorial typography, pillars, evidence, scripture, optional reflection + prayer cards, prev/next nav. Keyboard handlers: Escape/ArrowLeft/ArrowRight |
| `GateInvitation` | component | Closing CTA section with 3 reader-type paths + primary "Enter the Course" + share button + Pentecost-style closing scriptures |
| `GospelTabView` | component | Wrapper composing all 6 Gate sections + circle modal state + body-scroll lock |

Plus infrastructure:
- `src/data/gospel.js` — 22 KB data module (CIRCLES + RING_COLORS)
- `src/data/index.js` — added gospel exports to barrel
- `src/styles/index.css` — added Gate CSS (`.pulse-core`, `.ring-hit`, `.modal-enter`)
- **App.jsx** — converted 3-way preview toggle to 4-way (Harness/Gate/Hub/Course); added lazy `GospelTabView` import + Suspense boundary; refactored Course handlers (now thinner: only `courseToggleComplete`); removed direct `SEVEN_WEEKS` dependency from App so the Course chunk truly defers

## Implementation notes

### Lazy-load via React.lazy + dynamic import

```js
const CourseTabView = lazy(() => import('@components/CourseTabView.jsx'));
const GospelTabView = lazy(() => import('@components/GospelTabView.jsx'));
```

Both are wrapped in `<Suspense fallback={...}>` boundaries. The fallback is a centered "Loading the path..." / "Loading the gate..." in the project's typography, brief enough that it shouldn't show on a fast connection.

The trick to making this actually work was removing App's direct dependency on `SEVEN_WEEKS`. The previous batch (15) had App calculate next/prev day labels, requiring `import { SEVEN_WEEKS as SEVEN_WEEKS_REF } from '@data'`. That synchronous import meant Rollup couldn't tree-shake the 106 KB course chunk out of first paint. Solution: move all that logic into CourseTabView itself (where it makes more sense anyway — the labels are CourseTabView's UI concern, not App's).

After the refactor, App.jsx's contract with CourseTabView is:
- Pass: `view`, `activeWeekN`, `activeDayKey`, `setActiveWeekN`, `setActiveDayKey`, `setView`, `progress`, `onMarkComplete`, `onShare`
- Get: a fully self-managing Course view with internal day navigation

CourseTabView now exports `nextPosition` / `prevPosition` / `nextLabel` / `prevLabel` as module-private helpers, all using the lazy-imported `SEVEN_WEEKS`. Rollup's tree-shaker correctly identifies them as part of the lazy chunk.

### Tailwind → inline conversion (consistent with batches 11-15)

`Hero`, `Prologue`, `Trail`, `Circles`, `Bridge`, `CircleModal`, `GateInvitation`, `GospelTabView` all originally used Tailwind utility classes. All converted to inline `style={{}}`. Custom CSS classes preserved (paper-bg, ink-bg, ornament, sc, sc-bold, display, display-strong, body, body-lede, dropcap, scripture, btn-gold, btn-ghost, ring-hit, pulse-core, pulse-gold, modal-enter, fade, rise + d-N animation delays).

The Trail's Davidic blueprint grid was particularly fiddly — source used `grid grid-cols-2 gap-x-8 gap-y-2` which is a strict 2-column grid. Inline equivalent uses `gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 18rem), 1fr))'` so it collapses to 1 column on narrow screens (better mobile UX than fixed 2-col on phones).

### Body scroll lock for CircleModal

When the Circle modal opens, GospelTabView locks body scroll:

```js
useEffect(() => {
  if (typeof document === 'undefined') return undefined;
  if (activeCircleN !== null) {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }
  return undefined;
}, [activeCircleN]);
```

Source didn't have this, but it's expected behavior on iOS Safari where the underlying page would otherwise scroll under the modal. The cleanup restores the original overflow value (rather than hardcoding 'auto') in case a future global style sets it differently.

### Keyboard handlers in CircleModal

CircleModal owns its own `useEffect` for Escape / ArrowLeft / ArrowRight key handlers. These come from source verbatim. The handlers are SSR-safe via `typeof document !== 'undefined'` guard.

### Circles SVG hit areas

The 9-ring SVG is the trickiest component in the migration. Each ring needs to be tappable, but SVG circles are hollow — only the stroke is normally clickable. The source solution (preserved here): each ring has TWO SVG circles — the visible thin stroke + an invisible "hit band" wider than 38px (touch-ergonomic minimum). Outer rings render first so inner rings stack on top, ensuring the King ring (ring 1) at the center is always reachable.

This logic survived Tailwind → inline conversion intact. No CSS modifications.

### CIRCLES data: 9 entries with optional reflection + prayer

Each circle has required fields (`n`, `title`, `subtitle`, `essence`, `pillars`, `scripture`) plus optional `evidence`, `reflection`, `prayer`. CircleModal renders all of them when present. Tests verify the data shape. The 9 RING_COLORS go from gold (innermost) to dark bronze (outermost) — reversed in Bridge to inverse the visual hierarchy (innermost lightest there).

### App's 4-way preview mode

The toggle now has 4 buttons fixed top-right: Harness / Gate / Hub / Course. State is in-memory only (refresh returns to Harness). Switching between modes preserves each tab's internal state (e.g., switching from Course's W3.D2 view to Gate, then back to Course, lands you back on W3.D2).

The Gate's "Enter the course" buttons (in Hero and GateInvitation) wire to `setPreviewMode('course')` — clicking from the Gate jumps the dev shell to Course mode. This mirrors what the production tab system will eventually do.

### What's NOT in this session

- **`KingdomTabNav`** (header tab navigation) — 86 lines at source line 5898. Up next.
- **`Footer`** — 56 lines at source line 5983. Pairs with KingdomTabNav.
- **`Companion`** + **`FloatingCompanion`** — AI chat module, 116 + 13 lines. Last component to migrate before auth.
- **`PassItOn`** — 55 lines at source line 6168. Share modal. Could be its own batch or fold into chrome batch.
- **`SignupModal`** — 164 lines at source line 7609. Auth-stubbed in source — needs decision on auth provider before migration.
- **Real auth integration** — when the provider is decided.
- **Real share sheet** — `onShare` still console.logs.
- **Course chunk pre-warming** — could pre-load on hover/intent for instant Course mode entry. Future polish.

## How it was verified

All three gates green.

**Gate 1 — `parse-check.mjs`:** **56 of 56 files passed** (was 47; +9 new: gospel.js + 8 Gospel components).

**Gate 2 — `render-check-deep.mjs`:** **151 of 151 tests passed** (was 133; +18 new across batches 16 and 17, with 1 test rewritten for the new CourseTabView contract).

The new batch 16 tests:
- `CourseTabView callbacks route through correctly (overview → week)` — REWRITTEN to assert `setActiveWeekN(3)` + `setView('week')` are called when a step is clicked (was `onEnterWeek(3)` in the old contract)
- `CourseTabView next-day navigation walks through prologue + days correctly` — clicks "Next" at W1.D7 and verifies `setActiveWeekN(2)` + `setActiveDayKey('prologue')` are called (because week 2 has a prologue)
- `CourseTabView at W7.D7 has no next button enabled` — verifies the "Done" label appears at the end of the journey

The new batch 17 tests (16 total):
- Gospel data well-formedness — 9 circles, 9 ring colors, all required fields present, all valid hex
- Hero renders headline + both CTAs; CTAs fire onEnter / onToPrologue
- Prologue renders with the kingdom message; verifies anchor id="message"
- Trail renders Davidic blueprint correspondences (Queen Mother, Prime Minister, Twelve Tribes, Twelve Apostles)
- Circles renders all 9 entries with title + subtitle
- Circles list-row click fires onSelect(n)
- Circles progress indicator behavior (none → "X of 9 walked" → "The full trail walked")
- Bridge renders Inward/Abide/Outward labels + Via Purgativa/Illuminativa/Unitiva
- CircleModal null defensive (returns null)
- CircleModal renders essence + pillars + scripture for a real circle
- CircleModal close/next/prev buttons fire correctly
- GateInvitation renders 3 reader paths + share + scripture citations
- GateInvitation primary CTA fires onToCourse on each of 4 "Enter the Course" buttons
- GospelTabView composes all 6 sections (Hero, Prologue, Trail, Circles, Bridge, GateInvitation)
- GospelTabView clicking a circle opens CircleModal (verifies modal renders only after click)
- App test updated for 4-way toggle (Harness/Gate/Hub/Course)

**Gate 3 — Vite production build:** Clean. Bundle now:

```
dist/assets/index-*.js                 218.68 kB │ gzip:  50.81 kB    ← App + components (no Course, no Gospel)
dist/assets/CourseTabView-*.js          46.91 kB │ gzip:  10.75 kB    ← lazy
dist/assets/course-*.js                303.86 kB │ gzip: 105.96 kB    ← lazy (with CourseTabView)
dist/assets/GospelTabView-*.js          59.78 kB │ gzip:  18.40 kB    ← lazy (CIRCLES data inline)
dist/assets/field-guide-*.js           113.12 kB │ gzip:  40.73 kB    ← eager (Kingdom uses it)
dist/assets/liturgical-*.js             62.90 kB │ gzip:  19.21 kB
dist/assets/react-vendor-*.js          133.93 kB │ gzip:  43.12 kB
dist/assets/icons-*.js                  21.63 kB │ gzip:   6.17 kB
dist/assets/index-*.css                 32.62 kB │ gzip:   6.89 kB
```

**First-paint payload: ~167 KB gzipped** (App + react-vendor + icons + liturgical + field-guide + CSS). Under the 180 KB target.

When the user clicks **Gate**: +18.40 KB (GospelTabView + CIRCLES data).
When the user clicks **Course**: +116.71 KB (CourseTabView + course content).
When the user clicks **Hub**: 0 additional (already eager since Kingdom uses field-guide content too).

This means a visitor landing on the Gate (the most likely first interaction) gets ~167 KB initial + 18 KB on click = **185 KB total to see the Gate**. A visitor who lands and clicks straight to the Course gets **284 KB total to start reading**. The Gospel tab is now fast enough to be the front door without paying for the whole app's content upfront.

## What's now end-to-end

In the dev server with the **Gate** mode toggled, a visitor sees:

1. **Hero** — "The single greatest announcement in history has also been the most rigorously verified." Two CTAs: "Enter the course" (jumps to Course mode) and "Begin with the message" (smooth-scrolls to Prologue)
2. **Prologue** — long-form theological framing. CTA at end smooth-scrolls to Trail
3. **Trail** — supernatural evidence converging on the Catholic Church + 11-row Davidic blueprint table. CTA smooth-scrolls to Circles
4. **Circles** — 9-ring SVG (King at center, 8 data rings) + tappable list. Click any ring or list row to open the modal
5. **CircleModal** — fullscreen overlay reading for one circle. Editorial body, pillars, evidence cards, scripture, optional reflection list + prayer card. Footer prev/next nav. Closes on Escape, click outside, or X button. Body scroll locked while open. Walked circles get a small gold dot above the ring + a dot in the list
6. **Bridge** — "The circles you just saw are the path you are about to walk." Smaller SVG with beating wine core (ABIDE) + inward/outward arrows + 3-movement explanation
7. **GateInvitation** — 3 reader-type cards leading to Course + primary CTAs + Pentecost-style closing scriptures (Luke 12:32, Revelation 3:20)

Combined with the 7-week Course (49 days of editorial content with mark-complete persistence) + the Kingdom Hub (7 essentials + Field Guide of 22 practices), **all three of the app's main tabs are now complete and click-through-able**.

## Recommended next steps

The natural next batch is the **chrome layer**: `KingdomTabNav` (header) + `Footer` + `FloatingCompanion` + `Companion` + `PassItOn`. That replaces the temporary 4-way preview toggle with the production tab navigation, and the temporary console-logged `onShare` with a real share sheet. After that, only auth integration remains (and that needs an external decision on which provider).

Recommended ordering:
- **Batch 18** (chrome): KingdomTabNav + Footer + PassItOn modal — header navigation across all 3 tabs + share sheet wired through. Replaces the 4-way preview toggle in App.jsx. Probably 1 batch.
- **Batch 19** (companion): FloatingCompanion (the FAB) + Companion (the panel) — AI chat module. Half a batch unless we wire it to a real model right now (would extend).
- **Auth + SignupModal**: blocking on provider decision.

After the chrome layer, the dev shell becomes the production shell — toggling between tabs goes from a debug button to the real navigation. That's the moment the Vite scaffold becomes the source of truth and `the_kingdom.jsx` can be retired.

## Run it

From `kingdom-vite-batch17/`:

```bash
npm install
npm run dev     # http://localhost:5173 — Harness/Gate/Hub/Course toggle top-right
npm run build   # produces dist/ — Vercel-ready
```

## Re-verify

```bash
cd kingdom-vite-batch17/verify
npm install
node parse-check.mjs           # 56 expected
node render-check-deep.mjs     # 151 expected
```

## Files in this batch (in `/mnt/user-data/outputs/`)

- The full `kingdom-vite-batch17/` workspace (25 components, 11 data modules, 11 modals, full handoff documentation)
- `BATCH_16_17_HANDOFF.md` (this document)

---

*Salus animarum suprema lex. The gate is open. The path is mapped. The tools are in the saint's hand.*
