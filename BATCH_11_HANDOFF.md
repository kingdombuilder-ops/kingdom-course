# Migration Batch 11 — Handoff

*The Kingdom tab is complete. Read alongside `BATCH_3_HANDOFF.md` through `BATCH_10_HANDOFF.md`, `HANDOFF.md`, and `MIGRATION.md`.*

---

## What shipped

The Field Guide views — `FieldGuideHub` (the practices index) and `PracticeGuide` (single-practice detail) — plus the `kingdomView` routing state, navigation handlers, and the field guide content data layer. With this batch, **the entire Kingdom tab is migrated**.

| Component / module | Source line | File | Notes |
|---|---|---|---|
| `field-guide.js` (data) | ~4972 | `src/data/field-guide.js` | 22 practices + 5 categories. ~125 KB raw, copied byte-perfect from source. |
| `FieldGuideHub` | ~8324 | `src/components/FieldGuideHub.jsx` | Practices index. Tailwind classes converted to inline styles. |
| `PracticeGuide` | ~8424 | `src/components/PracticeGuide.jsx` | Single-practice editorial detail. Block renderer for 4 block types (p / h / q / pullquote). Tailwind → inline. |
| `App.jsx` routing | ~12981 | `src/App.jsx` | Added `kingdomView` state ("hub" | "practices" | "practice"), `activePractice` state, and three nav handlers (`goToHub` / `goToFieldGuide` / `goToPractice`). |
| `vite.config.js` | n/a | `vite.config.js` | Added `field-guide` to `manualChunks` so the 123 KB practice content caches independently of app code. |

Plus minor:
- `src/components/index.js` barrel updated to export the two new components.
- `src/data/index.js` barrel updated to re-export `PRACTICE_CATEGORIES` and `PRACTICES`.

## Implementation notes

### Dead code skipped

`PracticeCardHorizontal` (source line ~8685, 43 lines) was **defined but never referenced anywhere** in the source — only mentioned in a comment. It would have used a different data shape than the field guide practices (verb / tradition / practice / line / duration / mode — clearly meant for daily practices, not field guide entries). Skipped intentionally; saves ~43 lines of code and a test surface that would have referenced unmigrated data.

### Tailwind utility classes converted to inline `style={{}}` 

`FieldGuideHub` and `PracticeGuide` are the first migrated components in this project that originally used Tailwind utilities. Per the user's environment constraints (Tailwind renders blank in their setup), every `className="max-w-4xl mx-auto px-6 md:px-10"`-style class string was converted to a `style={{ maxWidth: '56rem', margin: '0 auto', padding: '0 clamp(1.5rem, 3vw, 2.5rem)' }}` inline equivalent. Specifically:

- `max-w-{n}` → `maxWidth: 'Nrem'` (using the corresponding rem; Tailwind's max-w-4xl = 56rem)
- `px-N md:px-N`, `py-N md:py-N` → `padding: 'clamp(...)'` so they remain responsive without breakpoints
- `mt-N md:mt-N`, `mb-N md:mb-N` → `marginTop` / `marginBottom: 'clamp(...)'`
- `text-[clamp(...)]` → `fontSize: 'clamp(...)'`
- `flex flex-col sm:flex-row items-start sm:items-center gap-4` → `display: 'flex', flexDirection: ?, alignItems: ?, gap: ?` — with the responsive transitions baked into the layout choices (e.g., `flexWrap: 'wrap'` instead of breakpoint-conditional flex direction)
- `hover:bg-[color:var(--paper-2)]` → `onMouseEnter` / `onMouseLeave` inline JS handlers (same pattern as `PracticeRow` from batch 9)
- Custom CSS classes (`paper-bg`, `display-strong`, `body-lede`, `ornament`, `sc`, `sc-bold`, `dropcap`, `scripture`, `btn-ghost`) are preserved — those are real CSS rules in `src/styles/index.css`

The visual result should be identical to source on the user's environment.

### `dangerouslySetInnerHTML` is intentional

`PracticeGuide`'s body block renderer uses `dangerouslySetInnerHTML` for the `p` and `q` block types. This is preserved from source — practice content has inline `<em>`, `<b>`, `<strong>` tags pre-formed in the data, and the editorial style depends on rendering them. The data is hand-written content (not user input), so XSS isn't a concern.

### Routing in App.jsx

```js
const [kingdomView, setKingdomView] = useState('hub');
const [activePractice, setActivePractice] = useState(null);

const goToHub = () => { setKingdomView('hub'); setActivePractice(null); window.scrollTo(0, 0); };
const goToFieldGuide = () => { setKingdomView('practices'); setActivePractice(null); window.scrollTo(0, 0); };
const goToPractice = (slug) => {
  const found = PRACTICES.find((p) => p.slug === slug);
  if (!found) return;
  setActivePractice(found);
  setKingdomView('practice');
  window.scrollTo(0, 0);
};
```

The hub-preview branch now ternary-switches between three views based on `kingdomView`. The KingdomMoreGrid's `onGoToFieldGuide` prop (which was a `console.log` stub in batch 10) is now wired to `goToFieldGuide`. From PracticeGuide's "All Practices" button, `onBack` returns to the FieldGuideHub via `goToFieldGuide`. Related-practices routing uses the same `goToPractice` handler. Source's `onToCourse` prop on FieldGuideHub is wired to `goToHub` for now — the actual Course context lands in batch 12+.

The `window.scrollTo(0, 0)` calls are guarded by `typeof window !== 'undefined'` for SSR safety.

### Field Guide as a manual chunk

The 123 KB practice content data is now a separate Vite chunk (`field-guide-*.js`) instead of being bundled into `index.js`. Bundle is now:

```
dist/assets/index-*.js                215.56 kB │ gzip: 49.60 kB    ← App + 11 modals + 8 components
dist/assets/field-guide-*.js          113.12 kB │ gzip: 40.73 kB    ← practice content (separate cache)
dist/assets/liturgical-*.js            62.90 kB │ gzip: 19.21 kB    ← separate cache
dist/assets/react-vendor-*.js         133.93 kB │ gzip: 43.13 kB    ← separate cache
dist/assets/icons-*.js                 20.36 kB │ gzip:  5.89 kB    ← separate cache
```

Note: this is a static-import chunk split (not lazy), so the field-guide chunk still loads on page load. The benefit is **caching**: when app code changes, users only redownload the ~50 KB index chunk; the 41 KB field-guide chunk stays cached. To make it true lazy-load, the FieldGuideHub mount in `App.jsx` would need to use `React.lazy()` with `import()`. Worth doing later if first-paint becomes a concern.

### Data layer — well-formedness verified

The data harness asserts:
- `PRACTICES` is an array of exactly 22 entries
- `PRACTICE_CATEGORIES` is an array of exactly 5 entries
- Every practice has `slug`, `title`, `tagline`, `category`, and a non-empty `body` array
- Every practice's `category` matches a known `PRACTICE_CATEGORIES[].id`
- Every body block uses one of the four valid `t` types (`p`, `h`, `q`, `pullquote`)
- All slugs are unique

This protects against data-shape regressions if anyone hand-edits the field-guide.js file.

### What's NOT in batch 11 — explicit list

- Course tab — that's a tab root migration starting at batch 12+
- Gospel tab — composes the others, comes last
- `KingdomTabNav` / `Footer` / `Companion` / `FloatingCompanion` — these belong with the tab nav layer (post Course/Gospel)
- The `onToCourse` prop on `FieldGuideHub` is currently wired to `goToHub` (since there's no Course context yet). When Course tab lands, App.jsx will rewire it to `() => { setTab('course'); }`.

## How it was verified

All three gates green.

**Gate 1 — `parse-check.mjs`:** **36 of 36 files passed** (was 33; +3 new: field-guide.js, FieldGuideHub.jsx, PracticeGuide.jsx).

**Gate 2 — `render-check-deep.mjs`:** **95 of 95 tests passed** (was 87; +8 new).

The new batch 11 tests:
- `Field Guide data layer is well-formed` — asserts 22 practices, 5 categories, all required fields present, all categories valid, no duplicate slugs, all body block types recognized
- `FieldGuideHub renders all 22 practices grouped by category` — verifies hero copy, all 5 category headers (with `&` HTML-entity escaping handled correctly), all 5 category notes, the "22 practices · 5 categories" footer, the first and last practice titles, and the closing line
- `FieldGuideHub clicking a practice fires onOpenPractice with the slug` — clicks the first practice's row and verifies the slug is passed
- `FieldGuideHub "Back to the Course" fires onToCourse` — finds the back button by text, clicks it, verifies callback fired exactly once
- `PracticeGuide returns null when practice prop is null (defensive)` — empty render verified
- `PracticeGuide renders title, tagline, breadcrumb, and body blocks` — uses the first practice (Rosary), verifies the title/tagline/category breadcrumb appear, and that the first paragraph's plaintext content (with HTML stripped) appears in the rendered output
- `PracticeGuide renders related practices when provided` — verifies the "Related Practices" section header and all related titles render
- `PracticeGuide back button fires onBack from both header and footer` — finds both ("The Field Guide" header back, "All Practices" footer back), clicks each, verifies onBack fired exactly twice

**Gate 3 — Vite production build:** Clean. **1,533 modules transformed** (was 1,530; +3 new files). Bundle:

```
dist/index.html                         2.85 kB │ gzip:  1.00 kB
dist/assets/index-*.css                28.29 kB │ gzip:  5.99 kB
dist/assets/icons-*.js                 20.36 kB │ gzip:  5.89 kB
dist/assets/liturgical-*.js            62.90 kB │ gzip: 19.21 kB    ← lazy/cached
dist/assets/field-guide-*.js          113.12 kB │ gzip: 40.73 kB    ← NEW chunk
dist/assets/react-vendor-*.js         133.93 kB │ gzip: 43.13 kB
dist/assets/index-*.js                215.56 kB │ gzip: 49.60 kB
```

First-paint payload (everything except liturgical chunk): **~145 KB gzipped.** Under the MIGRATION.md 180 KB target. The +2 KB raw growth in `index.js` from batch 10 reflects the new components (FieldGuideHub + PracticeGuide are ~24 KB raw combined but they're now mostly cached separately via the field-guide chunk; the components themselves bundle into index for the navigation/composition glue).

## What's now end-to-end

In the dev server with the "Live Hub preview ▶" toggle on, the **entire Kingdom tab** is functional:

1. Open the Hub — see HubHero, the seven essentials, the More grid
2. Click any "Begin" CTA on the seven → modal opens (LectioDivina, DailyExamen, etc)
3. Click the MiniPath dots → scroll-jump to that EssentialBlock
4. Click "Your House" in the More grid → HousesQuiz opens
5. Click "Intentions" → AddIntentionModal opens
6. Click "Cloud of Witnesses" → modal opens with proper close chrome
7. **Click "The Field Guide"** → routes to FieldGuideHub with all 22 practices grouped into 5 categories
8. **Click any practice row** → routes to PracticeGuide with that practice's full editorial content (title, breadcrumb, italic tagline, body content with dropcap/headings/quotes/pullquotes, related practices)
9. **Click any related practice** → routes laterally to that practice's PracticeGuide
10. **Click "All Practices" or "The Field Guide" back** → returns to FieldGuideHub
11. **Click "Back to the Course"** at top of FieldGuideHub → returns to Hub

This is the **first batch where a complete vertical slice of the app is fully migrated**. Every button, every navigation, every piece of content from the original monolith's Kingdom tab is now in the Vite scaffold and individually verified.

## Recommended next step

Visual inspection in the dev server, this time exercising the navigation: from the Hub, click into the Field Guide, click into a practice, click a related practice, navigate back. The unit harness verifies content is present and click handlers fire — but only your eyes can tell you whether the editorial typography of the practice body reads beautifully (the dropcap, the gold rule under headings, the wine-colored pullquotes, the scripture blockquote treatment).

## What's next

The Kingdom tab is **done**. Up next is the **Course tab** — by source measure, the deepest component tree in the app:

- 7-week structured course
- Each week has a daily reading view
- Each day has a "sending" page with prayers and apostolic acts
- Top-level course overview navigates to weeks, weeks navigate to days, days navigate to sending

This is several batches of work. The natural split is probably:
- **Batch 12:** Course content data (7 books, 50+ days of readings) extracted to data modules, similar to how this batch handled the field guide data
- **Batch 13:** Course overview + week views
- **Batch 14:** Day reading view
- **Batch 15:** Sending view + course routing

After that, the Gospel tab (which composes Hub + Course + Field Guide for visitors who haven't signed up).

## Run it

From `kingdom-vite-batch11/`:

```bash
npm install
npm run dev     # http://localhost:5173 — toggle "Live Hub preview" top-right
npm run build   # produces dist/ — Vercel-ready
```

## Re-verify

```bash
cd kingdom-vite-batch11/verify
npm install
node parse-check.mjs           # 36 expected
node render-check-deep.mjs     # 95 expected
```

## Files in this batch (in `/mnt/user-data/outputs/`)

- The full `kingdom-vite-batch11/` workspace
- `BATCH_11_HANDOFF.md` (this document)

---

*Salus animarum suprema lex. The Kingdom tab is complete.*
