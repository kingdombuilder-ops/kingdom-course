# Migration Batches 12-15 — Course Tab Complete

*Read alongside `BATCH_3_HANDOFF.md` through `BATCH_11_HANDOFF.md`. The Course tab is migrated end-to-end across these four batches; presented as a single handoff because they ship together.*

---

## What shipped — the Course tab in full

The Course tab — by source measure the deepest component tree in the app — is fully migrated. Four views, with sub-routing, with progress persistence. **133 tests passing, all three gates green.**

| Batch | What | Status |
|---|---|---|
| 12 | Course content data (`SEVEN_WEEKS` + `COURSE_PROGRESSION_COLORS`) extracted to `src/data/course.js` (336 KB), data well-formedness tests, course chunk added to `vite.config.js` `manualChunks` | ✅ |
| 13 | Course overview surfaces — `StepRibbon`, `HorizontalJourney` (desktop SVG with smooth-bezier path through 7 nodes + Pentecost terminus), `SevenStepsList` (vertical card list with stage dividers), `CourseJourney` (the section composing both), `CourseHero` (logged-in/out modes) | ✅ |
| 14 | `WeekDetail` (single-week view with prologue + 7 day cards + practice grid + scripture + prev/next nav), `DayReading` (single-day editorial view with block renderer + reflection/prayer + mark-complete) | ✅ |
| 15 | `SendingDay` (Day 50 Pentecost commissioning page), `CourseTabView` (composing wrapper with overview/week/day/sending routing), full Course routing wired into `App.jsx` (3-way preview mode: Harness/Hub/Course), course progress persisted to localStorage via `useKingdomStorage` | ✅ |

## Components added (10 new)

| Component | File | Role |
|---|---|---|
| `_courseGeometry.js` | helper | Pure module with `STEP_ICONS`, `VBW`/`VBH`, `NODES`, `PENTECOST`, `smoothPath` — geometry constants for the SVG journey |
| `StepRibbon` | component | Compact 7-bar progress strip, used inside CourseHero |
| `HorizontalJourney` | component | Desktop SVG visualization — bezier path through 7 medallions to Pentecost terminus, stage bands, hover tooltips |
| `SevenStepsList` | component | Mobile-primary vertical list of 7 step cards, with stage dividers ("Via Purgativa/Illuminativa/Unitiva") |
| `CourseJourney` | component | Section composing HorizontalJourney + SevenStepsList |
| `CourseHero` | component | Tab landing page; switches between logged-out CTA pitch and logged-in "Today's Mission" card |
| `WeekDetail` | component | Single week view with prologue button, 7-day cards, practice grid, scripture, prev/next step nav |
| `DayReading` | component | Single-day editorial view: header with progress label, block renderer (p/h/q/pullquote, dropcap on first), reflection/prayer card, mark-complete + prev/next |
| `SendingDay` | component | Day 50 Pentecost page — radial glow + 7 flames SVG + meditation copy + Pentecost scriptures + share/walk-again CTAs |
| `CourseTabView` | component | Wrapper that composes all 4 views (overview/week/day/sending) based on `view` prop; the integration point App.jsx mounts |

Plus infrastructure:
- `src/data/course.js` — 336 KB byte-perfect copy of `SEVEN_WEEKS` from source
- `src/data/index.js` barrel — re-exports `COURSE_PROGRESSION_COLORS` and `SEVEN_WEEKS`
- `src/styles/index.css` — added Course-specific CSS (~150 lines: `.journey-medallion`, `.journey-tooltip`, `.step-card`, `.step-medallion`, `.step-ghost`, `.step-arrow`, `.stage-divider`, `.day-card`, `.sabbath-card`, `.rise` + `.d-N` animation delays, `.pulse-gold`, `.path-draw`, `.pentecostPulse`)
- `vite.config.js` — added `course` manual chunk for independent caching
- `App.jsx` — converted binary `showHubPreview` toggle to 3-way `previewMode` (`harness | hub | course`); added Course routing state (`courseView`, `activeWeekN`, `activeDayKey`); added day-navigation logic with prologue handling; persisted `courseProgress` to localStorage

## Implementation notes worth flagging

### Course data preserves original prose verbatim

The `course.js` data module is a byte-perfect copy of `SEVEN_WEEKS` from source lines 2858-4773. Only the leading `const` was changed to `export const`. Editorial content — Day 1's "evidence of the kingdom" reading, the prologue's reflection on Mark 1:15, the meditative copy threaded through all 49 days — is preserved exactly as authored. No paraphrasing, no summarizing.

### Tailwind → inline conversion (consistent with batches 11)

`WeekDetail`, `DayReading`, `SendingDay`, `CourseHero`, `SevenStepsList`, `CourseJourney`, `HorizontalJourney`, `StepRibbon` all originally used Tailwind utility classes. Per project convention (Tailwind renders blank in user's environment), all utilities converted to inline `style={{}}`. Custom CSS classes (paper-bg, ink-bg, ornament, sc, sc-bold, display, display-strong, body, body-lede, scripture, dropcap, btn-gold, btn-ghost, journey-medallion, step-card, day-card, etc.) are preserved — those are real CSS rules in `src/styles/index.css`.

### `dangerouslySetInnerHTML` is intentional in DayReading

Same pattern as PracticeGuide (batch 11). Day reading body content has inline `<em>`, `<b>`, `<strong>` HTML pre-formed in the data, and the editorial style depends on rendering them. The data is hand-written content (not user input), so XSS isn't a concern.

### Day navigation logic in App.jsx

The `courseNextDay` / `coursePrevDay` handlers walk the user through the prologue + 49 days as a single linear sequence:

```
W1.prologue → W1.D1 → W1.D2 → ... → W1.D7 → W2.prologue → W2.D1 → ...
```

Each week with a prologue inserts an extra step before its day 1. `hasNext`/`hasPrev` flags are precomputed for the current position so the buttons disable correctly at the boundaries (week 1 prologue has no prev; week 7 day 7 has no next).

### Course chunk split — 106 KB gzipped

`course.js` is the largest single file in the app at 336 KB raw / 106 KB gzipped. It's now in its own Vite chunk via `manualChunks` so it caches independently of app code. Currently loads on first paint (because the SEVEN_WEEKS import chain reaches CourseHero which is mounted from App.jsx). To make it truly lazy: wrap `CourseTabView` in `React.lazy()` and dynamic `import()`. Worth doing in a future polish batch — the bundle is well within the 180 KB target in absolute terms, but the course payload only matters once the user clicks into the Course tab.

### Bundle sizes (before → after these batches)

```
Before batch 12:                    After batch 15:
─────────────────                   ─────────────────
index-*.js     49.60 kB gz          index-*.js     59.53 kB gz   (+10 KB: 5 components)
field-guide    40.73 kB gz          field-guide    40.73 kB gz   (unchanged)
                                    course-*.js   105.96 kB gz   (NEW chunk)
liturgical     19.21 kB gz          liturgical     19.21 kB gz
react-vendor   43.13 kB gz          react-vendor   43.12 kB gz
icons           5.89 kB gz          icons           6.17 kB gz   (+0.3 KB: SendingDay icons)
TOTAL ~ 145 kB                      TOTAL ~ 275 kB
```

Total first-paint payload now ~275 KB gzipped — over the 180 KB initial target but within reasonable bounds for an app this content-heavy. The 106 KB course chunk is the bulk of the new weight; lazy-loading it would drop first-paint back below 180 KB.

### App.jsx 3-way preview mode

Replaces the binary `showHubPreview` toggle with three buttons (Harness / Hub / Course) fixed top-right. Each button shows the corresponding live view in the dev shell. State for each view is independent — switching from Course to Hub doesn't lose your Course position; switching back restores it.

### No external state library

All state stays in `useState` + the existing `useKingdomStorage` hook. The `courseProgress` map persists to localStorage automatically. No Zustand, no Redux, no React Router — same shape as the rest of the app. When the production routing layer lands later, it'll replace the App.jsx ternary chain, but the components don't need to know.

## How it was verified

All three gates green.

**Gate 1 — `parse-check.mjs`:** **47 of 47 files passed** (was 36; +11 new: `course.js`, `_courseGeometry.js`, plus 9 component files).

**Gate 2 — `render-check-deep.mjs`:** **133 of 133 tests passed** (was 95; +38 new across 4 batches).

The new tests:
- **Batch 12 (5 tests):** `COURSE_PROGRESSION_COLORS` is a 7-element gradient with valid hex colors; `SEVEN_WEEKS` has exactly 7 weeks with correct verbs (SEE/KNOW/HEAL/ABIDE/GO/BUILD/SEND); each week has all required fields (n/verb/title/etc) and 7 days; each day has required fields plus sabbath flag on day 7; each prologue has body content
- **Batch 13 (10 tests):** StepRibbon renders 7 verbs; SevenStepsList renders all 7 weeks with 3 stage dividers; SevenStepsList click fires onEnterWeek with correct week; SevenStepsList shows completion count when progress provided; HorizontalJourney renders 7 medallions + Pentecost label + 3 stage band labels; HorizontalJourney click fires onSelectStep; CourseJourney composes both; CourseHero logged-out shows CTA; CourseHero logged-in shows greeting + Today's Mission card; CourseHero onBeginToday fires
- **Batch 14 (14 tests):** WeekDetail null defensive; renders header/essence/days for week 1; click on day fires onOpenDay(n); prologue button fires onOpenDay("prologue"); week 7 shows Sending CTA; onToSending fires; middle weeks show prev/next; isDayComplete predicate works; DayReading null defensive; renders header/body/nav for real day; prologue mode renders prologue content; isCompleted=true shows "Marked complete"; toggle/next/prev fire correctly; reflection/prayer rendered when present
- **Batch 15 (9 tests):** SendingDay renders Pentecost commissioning copy + Acts citations + closing line; SendingDay onBack/onShare fire; CourseTabView routes overview to CourseHero+CourseJourney; week to WeekDetail; day to DayReading with isCompleted; sending to SendingDay; callbacks route through; day-prologue mode works
- **Batch 15 App test update:** the App test that previously checked for "Live Hub preview" now checks for the 3-way toggle (Harness / Hub / Course)

**Gate 3 — Vite production build:** Clean. **1,549 modules transformed** (was 1,533). Course data successfully split into its own chunk:

```
dist/assets/index-*.js              263.59 kB │ gzip:  59.53 kB    ← App + 13 components + 11 modals
dist/assets/course-*.js             303.86 kB │ gzip: 105.96 kB    ← course content (separate cache)
dist/assets/field-guide-*.js        113.12 kB │ gzip:  40.73 kB    ← field guide content
dist/assets/liturgical-*.js          62.90 kB │ gzip:  19.21 kB
dist/assets/react-vendor-*.js       133.93 kB │ gzip:  43.12 kB
dist/assets/icons-*.js               21.63 kB │ gzip:   6.17 kB
```

## What's now end-to-end

In the dev server with the **Course** mode toggled, a user can walk the entire 49-day curriculum:

1. **Overview** — CourseHero with logged-out CTA pitch (or logged-in "Today's Mission" card with progress bar). Below it, CourseJourney with the SVG path + 7 medallions on desktop, vertical step list always visible
2. Click a step on either the SVG or the list → **Week view** opens with prologue + 7 day cards + practice grid + scripture + prev/next step nav
3. Click the prologue or any day → **Day reading** opens with editorial typography, dropcap on the first paragraph, gold-ruled headings, scripture quotes, pullquotes, optional reflection/prayer card, mark-complete button, prev/next day nav
4. From week 7 → "Day 50 — the Sending" CTA → **SendingDay** with Pentecost glow + 7 flame SVG + commissioning copy + Acts 2 / Acts 1:8 scriptures + share CTA
5. Mark days complete → progress persists to localStorage → next visit shows correct completion state in CourseHero, CourseJourney medallions, SevenStepsList completion counts, and the day cards in WeekDetail

Plus the existing modal harness and Kingdom Hub preview both still work — switching between modes preserves each view's state.

## What's NOT in this batch

- **Lazy-loading the course chunk** — to bring first-paint back under 180 KB gzipped, wrap `CourseTabView` in `React.lazy()` and dynamic `import()`. Future polish.
- **Course progress reset / "start over" UI** — `courseProgress` accumulates indefinitely; no UI to clear it
- **"Day 1 of 49" actual streak/streak-skip behavior** — the global day count assumes you've walked sequentially; gaps don't change the count
- **Real auth integration** — `currentUser` is hardcoded to `null` in App's preview wiring. When auth lands, swap that line.
- **Real share sheet** — `onShare` currently just `console.log`s. Hook to native share API or copy-link when launching.
- **`KingdomTabNav`, `Footer`, `Companion`, `FloatingCompanion`** — the chrome layer that wraps the three tabs. Comes after Gospel tab.
- **Gospel tab** — composes Hub + Course + Field Guide for visitors who haven't signed up. Still ahead.

## Known issues / things to watch

**Course data import currently loads on first paint.** The 106 KB course chunk is split for caching, but Rollup's tree-shaker still includes it in the synchronous import graph because `CourseHero` (mounted in App's render path) imports `SEVEN_WEEKS`. To make it truly defer-until-Course-tab-clicked, the App.jsx Course branch needs to be a `React.lazy()` boundary. Not blocking, but the bundle math improves significantly when fixed.

**`hasPrev` boundary calculation in App.jsx is conservative.** If a week has no prologue and you're on day 1 of week 1, `hasPrev` is false (correct). The logic uses `SEVEN_WEEKS_REF` from source, which currently has a prologue for every week — but if that ever changes, the boundary check accommodates it.

**3-way preview mode persists in-memory only.** Refreshing the page returns to Harness mode. If `previewMode` should persist across reloads, wrap it with `useKingdomStorage`. Left in-memory for now since the dev shell is dev-only.

## Recommended next steps

The Course tab is **functionally complete and visually testable**. The natural next step is **visual inspection in the dev server** — switch to Course mode, walk the path, click into a week, click into a day, navigate to the Sending. The unit harness verifies content + click routing; only your eyes can tell you whether the editorial typography reads beautifully through the 49 days, whether the SVG journey path animates smoothly on mount, whether the Pentecost glow on the SendingDay sits right.

After visual inspection, the remaining migration work for `kingdomcourse.org` is:

- **Gospel tab** — the visitor-facing landing page that composes Hub + Course + Field Guide previews. Likely 2 batches: data + assembly.
- **Tab navigation chrome** — `KingdomTabNav` (header), `Footer`, `FloatingCompanion`, `Companion` AI chat. Probably 1-2 batches.
- **Lazy-load course chunk** — the polish step described above. Half a batch.
- **Auth integration** — when Supabase or whatever auth provider is decided. Cross-cutting.

## Run it

From `kingdom-vite-batch15/`:

```bash
npm install
npm run dev     # http://localhost:5173 — Harness/Hub/Course toggle top-right
npm run build   # produces dist/ — Vercel-ready
```

## Re-verify

```bash
cd kingdom-vite-batch15/verify
npm install
node parse-check.mjs           # 47 expected
node render-check-deep.mjs     # 133 expected
```

## Files in this batch (in `/mnt/user-data/outputs/`)

- The full `kingdom-vite-batch15/` workspace
- `BATCH_12_15_HANDOFF.md` (this document)

---

*Salus animarum suprema lex. The path from Easter to Pentecost is mapped.*
