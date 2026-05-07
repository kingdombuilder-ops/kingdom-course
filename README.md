# The Kingdom Course

A Catholic spiritual formation web app at [kingdomcourse.org](https://kingdomcourse.org). Three tabs: **The Gospel** (a visitor-facing apologetic — nine concentric circles of evidence converging on the Resurrection), **The Course** (a 50-day Walk to Pentecost across seven steps and 49 daily readings), and **The Kingdom** (a daily Mass-anchored hub for the formed Catholic, including a Field Guide of 22 Catholic practices).

This is the **Vite/React migration scaffold**. It replaces the original 13,631-line monolith (`the_kingdom.jsx`) with a tree of small, testable components organized into a normal modern web project.

> *Salus animarum suprema lex.* — the salvation of souls is the supreme law.

## Status

The migration is **functionally complete**. All three tabs work end-to-end, the chrome layer is in place, and 176 unit tests pass. Two pieces remain as integration seams pending external decisions:

- **Auth provider** — `SignupModal` ships in stub mode (persists user to localStorage). When a real provider is chosen, pass `submitHandler={authSignup}` and the same modal becomes the production sign-up form.
- **Companion backend** — `Companion` ships in stub mode (returns a friendly placeholder). When a proxy server is ready, pass `apiEndpoint="/api/companion"` and the same component becomes the production AI chat.

## Run

```bash
npm install
npm run dev      # http://localhost:5173 — dev mode with preview toggle
npm run build    # production bundle in dist/
npm run preview  # serve the production bundle locally
```

## Verify

```bash
cd verify
npm install
node parse-check.mjs         # 63 of 63 source files Babel-parse cleanly
node render-check-deep.mjs   # 176 of 176 unit tests pass via jsdom + React 18
```

## Architecture at a glance

```
kingdom-vite/
├── src/
│   ├── App.jsx               ← entry component; production chrome assembly
│   ├── env.js                ← IS_DEV flag (Vite-replaceable)
│   ├── main.jsx              ← ReactDOM.createRoot mount
│   ├── components/  (31 files)
│   │   ├── Bridge.jsx        ┐
│   │   ├── Circles.jsx       │
│   │   ├── CircleModal.jsx   │  ← Gospel/Gate tab (8 files)
│   │   ├── GateInvitation.jsx│
│   │   ├── GospelTabView.jsx │
│   │   ├── Hero.jsx          │
│   │   ├── Prologue.jsx      │
│   │   ├── Trail.jsx         ┘
│   │   ├── CourseHero.jsx    ┐
│   │   ├── CourseJourney.jsx │
│   │   ├── CourseTabView.jsx │  ← Course tab (8 files + helper)
│   │   ├── DayReading.jsx    │
│   │   ├── HorizontalJourney│
│   │   ├── SendingDay.jsx    │
│   │   ├── SevenStepsList.jsx│
│   │   ├── StepRibbon.jsx    │
│   │   ├── WeekDetail.jsx    │
│   │   ├── _courseGeometry.js┘
│   │   ├── EssentialBlock.jsx┐
│   │   ├── FieldGuideHub.jsx │
│   │   ├── HubHero.jsx       │
│   │   ├── KingdomHubView.jsx│  ← Kingdom tab (8 files)
│   │   ├── KingdomMoreGrid.js│
│   │   ├── PracticeGuide.jsx │
│   │   ├── PracticeRow.jsx   │
│   │   ├── SevenEssentials.jx┘
│   │   ├── Companion.jsx     ┐
│   │   ├── Footer.jsx        │  ← Chrome (4 files)
│   │   ├── KingdomTabNav.jsx │
│   │   ├── FloatingCompanion ┘
│   │   └── index.js          ← barrel
│   ├── modals/  (13 files)
│   │   ├── AbideLocator.jsx
│   │   ├── AddIntentionModal.jsx
│   │   ├── AwakenToTheDay.jsx
│   │   ├── CloudOfWitnesses.jsx
│   │   ├── Compline.jsx
│   │   ├── DailyExamen.jsx
│   │   ├── HousesQuiz.jsx
│   │   ├── LectioDivina.jsx
│   │   ├── PassItOn.jsx        ← share modal
│   │   ├── ReachOut.jsx
│   │   ├── SignupModal.jsx     ← signup w/ stub or API mode
│   │   ├── TheRosary.jsx
│   │   ├── WorkOfMercy.jsx
│   │   └── index.js
│   ├── data/  (11 files)
│   │   ├── colors.js           ← STEP_COLORS, RING_COLORS
│   │   ├── course.js           ← SEVEN_WEEKS — 49 days of editorial content
│   │   ├── field-guide.js      ← 22 Catholic practices with full content
│   │   ├── gospel.js           ← CIRCLES — 9 evidence circles for the Gate
│   │   ├── houses.js           ← HOUSES — Light/Fire/Earth/Joy/Glory
│   │   ├── liturgical.js       ← getLiturgicalDay() + readings
│   │   ├── practices.js        ← PRACTICES — daily Mass-anchored items
│   │   ├── prompts.js          ← daily reflection prompts
│   │   ├── quiz.js             ← QUIZ_QUESTIONS for HousesQuiz
│   │   ├── saints.js           ← SAINTS_HUB
│   │   └── index.js            ← barrel — single import point
│   ├── shared/  (3 files)
│   │   ├── CopyButton.jsx
│   │   ├── storage.js          ← useKingdomStorage, useDailyCompletion hooks
│   │   └── utils.js            ← toRoman, etc.
│   └── styles/
│       └── index.css           ← CSS custom properties + utility classes
├── verify/
│   ├── parse-check.mjs         ← Babel parse-only sanity for all source files
│   ├── render-check.mjs        ← shallow render harness (legacy)
│   ├── render-check-deep.mjs   ← jsdom + React 18 + act() — 176 unit tests
│   └── package.json
├── public/                     ← static assets (favicon, manifest)
├── index.html
├── vite.config.js              ← path aliases + chunk splitting
├── postcss.config.js           ← autoprefixer only (Tailwind removed)
└── package.json
```

### Path aliases

Components import via short aliases configured in `vite.config.js`:

| Alias | Target |
|---|---|
| `@data` | `./src/data/index.js` |
| `@shared` | `./src/shared/` |
| `@components` | `./src/components/index.js` |
| `@modals` | `./src/modals/index.js` |
| `@styles` | `./src/styles/` |

### Bundle splitting

Chunks are deliberate, not automatic:

| Chunk | Eager / Lazy | Size (gzipped) | Loaded when |
|---|---|---|---|
| `index` | eager | ~56 KB | Always — App + chrome + 9 components |
| `react-vendor` | eager | 43 KB | Always |
| `field-guide` | eager | 41 KB | Always — Kingdom uses it |
| `liturgical` | eager | 19 KB | Always — readings rendered eagerly |
| `icons` | eager | 6 KB | Always — lucide-react |
| `CSS` | eager | 5 KB | Always |
| `GospelTabView` | lazy | 18 KB | Click "The Gospel" tab |
| `CourseTabView` | lazy | 11 KB | Click "The Course" tab |
| `course` | lazy (with CourseTabView) | 106 KB | Click "The Course" tab |

**First-paint payload: ~170 KB gzipped** — under the 180 KB target.

## Key conventions

These weren't optional. They each came from a real failure mode:

### 1. Inline `style={{}}`, NOT Tailwind utility classes

Every component uses `style={{ ... }}` for spacing/layout/color and a small set of CSS utility classes from `src/styles/index.css` for typography (`display`, `body`, `sc`, `btn-gold`, `ornament`, etc.) and animations (`rise`, `fade`, `pulse-core`, `modal-enter`).

Why: when migration started, Tailwind utilities rendered blank in the user's environment. Inline styles work everywhere. Tailwind toolchain was removed entirely in batch 21.

### 2. Three verification gates before any batch ships

Every migration batch must pass:

1. **`parse-check.mjs`** — every `.js`/`.jsx` source file parses cleanly through Babel
2. **`render-check-deep.mjs`** — every component mounts in jsdom + React 18, props/callbacks/state work, modals open and close
3. **`vite build`** — production build is clean, bundle size is healthy, no chunk explosion

A batch is not "done" until all three gates are green. The handoff docs (`BATCH_*_HANDOFF.md`) record each batch's gate state.

### 3. API/stub seam pattern for external integrations

`Companion` and `SignupModal` both have an integration prop (`apiEndpoint` for Companion, `submitHandler` for SignupModal) that's optional. When provided, the component calls the real backend. When omitted, the component falls back to a friendly stub (Companion returns a placeholder reply; SignupModal persists to localStorage).

This pattern lets the UI ship before the backend is decided. When the auth provider lands or the Companion proxy is ready, swap the prop value — no component rewrite.

### 4. The app gives tools to the Church's life; it doesn't add to it

Every practice in the Field Guide and every Course exercise must already be a Catholic practice. Lectio Divina, the Rosary, Compline, the Examen, work of mercy — these come from 2000 years of tradition. The app is a delivery mechanism, not a new spirituality.

## Migration story (batches 3-21)

The migration ran across 19 batches. Each handoff doc (`BATCH_3_HANDOFF.md` through `BATCH_18_19_HANDOFF.md` plus `BATCH_20_21_HANDOFF.md`) records what shipped, what was verified, what changed about the conventions, and what comes next. Read them in order if you're picking this up cold.

Tactical milestones:

- **Batches 3-9**: 11 daily-life modals migrated (LectioDivina, TheRosary, Compline, DailyExamen, AwakenToTheDay, etc.)
- **Batch 10-11**: Kingdom tab — HubHero, SevenEssentials, FieldGuideHub, PracticeGuide
- **Batches 12-15**: Course tab — CourseHero, CourseJourney, WeekDetail, DayReading, SendingDay, CourseTabView
- **Batches 16-17**: Lazy-load polish + Gospel tab (Hero, Prologue, Trail, Circles, Bridge, CircleModal, GateInvitation, GospelTabView)
- **Batches 18-19**: Chrome (KingdomTabNav, Footer, PassItOn, Companion, FloatingCompanion) — production assembly via "Live" preview mode
- **Batches 20-21**: SignupModal (stub mode), production polish (Live as default mode, dev toggle gated behind IS_DEV, Tailwind toolchain removed)

## What this means for `the_kingdom.jsx`

After auth lands and the Companion backend is wired, `the_kingdom.jsx` (the original 13,631-line monolith) can be retired. The Vite scaffold has every feature except those two integration points. The handoff docs in this repo are the chain-of-custody — anyone picking up the project can reconstruct what shipped, why, and what's left.

## Deployment

The `dist/` folder produced by `npm run build` is a static site — drop it on Vercel, Netlify, Cloudflare Pages, or any static host. There's no server. The Companion's eventual proxy backend lives elsewhere; the static site posts to it via `apiEndpoint`.

`vercel.json` is not yet set up. Default Vercel settings (output directory `dist`, framework "Vite") work. SPA routing fallback should rewrite all routes to `/index.html` — for Vercel, that's automatic with the Vite framework preset; for other hosts, configure a rewrite to `/index.html` for paths that don't match a static asset.

## License

Not yet specified. The content (course readings, Gospel apologetic, Field Guide entries) is original to the project. Code patterns are conventional React.
