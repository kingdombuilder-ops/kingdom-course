# The Kingdom Course — Project Context

*This file is read at the start of every Claude Code session in this repo.
Canonical decisions encoded here govern every implementation choice. Do not
relitigate. Updated 18 May 2026.*

---

## What this project is

**The Kingdom Course** is a Catholic spiritual formation web application.
Fifty days, anchored to the Mass, leading to Pentecost. Three audiences in
one shell:

- **The Gospel** (Gate) — apologetic and evangelistic. First-time visitors
- **The Course** — Tier 1 product, seven-week fifty-day formation walk
  through the seven essentials (SEE · KNOW · HEAL · ABIDE · GO · BUILD · SEND)
- **The Kingdom** (Hub) — daily home: liturgical day, Mass-anchored 3-1-3
  pattern, Today's Seven, intentions, Field Guide

Sister surface, unlocked at Day 50: **The Kingdom Academy** (Tier 2),
drawn from the seven internal DTS books.

**Operating principle:** *Salus animarum suprema lex.*

---

## Where everything lives

### Reference documentation

All reference docs live in `docs/`:

- `docs/strategy/` — the vision and historical record
  - `KINGDOM_MASTER_STRATEGY_V10.md` — the WHY
  - `COMPREHENSIVE_CHANGE_SUMMARY_SINCE_V9.md` — V9→V10 shifts
  - `KINGDOM_BUILD_FROM_SCRATCH.md` — from-scratch reference
- `docs/execution/` — the operational documents
  - `MASTER_SPECIFICATION.md` — what to build (20 systems, 80 items, status-tagged)
  - `STRATEGIC_ARCHITECTURE_v2.md` — principles, surfaces, tools, governance
  - `FINAL_CONTENT_REVISION_PLAN.md` — next 8 days of revision work
  - `COMPREHENSIVE_REVIEW.md` — multi-disciplinary critical review
- `docs/handoff/PHASE_3_HANDOFF.md` — current state-of-build
- `docs/archive/` — superseded docs kept for history

When a question arises that this CLAUDE.md doesn't answer, the answer is
usually in `docs/strategy/` (for the why) or `docs/execution/` (for the
what and how).

### Code structure

```
~/projects/kingdom-vite-batch21/
├── CLAUDE.md                          (this file)
├── index.html
├── vercel.json
├── public/
│   ├── manifest.webmanifest
│   ├── favicon.svg + icon set (5 files)
│   ├── privacy.html, terms.html
│   └── methodology.html               (per FINAL_CONTENT_REVISION_PLAN §5.1)
├── src/
│   ├── main.jsx                       ClerkProvider wrap
│   ├── App.jsx                        Tab state, auth, modals
│   ├── components/
│   │   ├── KingdomTabNav.jsx          Production header (awaiting App.jsx swap-in)
│   │   ├── Hero.jsx                   Gate hero
│   │   ├── CourseHero.jsx             Course tab signed-in landing
│   │   ├── HubHero.jsx                Kingdom tab daily Hub
│   │   ├── Footer.jsx                 Four-column + bottom row with methodology mark
│   │   ├── Companion.jsx              Ask widget (stubbed — see MASTER_SPEC §5.x)
│   │   └── (Bridge, Circles, KingdomHubView, etc.)
│   ├── modals/
│   │   ├── SignupModal.jsx
│   │   ├── VerifyEmailModal.jsx
│   │   ├── DailyExamen.jsx, LectioDivina.jsx (device-local journal)
│   │   ├── HousesQuiz.jsx
│   │   └── (22 Field Guide practice modals total)
│   ├── data/
│   │   ├── liturgical.js              Calendar day mapping
│   │   ├── saints.js                  Saint roster (see Saint Carlo Acutis canonization note)
│   │   ├── quiz.js                    Five Houses discernment
│   │   ├── course.js                  Seven-step Course content
│   │   └── houses.js                  Five Houses (Earth = 5th)
│   └── styles/index.css               CSS vars, paper-bg classes, sc/sc-bold
└── docs/                              (per "Where everything lives" above)
```

---

## Locked canonical decisions (do not relitigate)

### Architecture

- **Vite + React 18** custom codebase. Do not migrate to Next.js, Astro, or
  any website builder
- **Inline `style={{}}` only — never Tailwind.** V2 + Tailwind caused blank
  renders. Tailwind utility classes do not work here. Use inline styles +
  CSS variables from `src/styles/index.css` (`--ink`, `--paper`, `--gold`,
  `--wine`)
- **Custom CSS classes are OK** where they exist: `paper-bg`, `paper-bg-2`,
  `sc`, `sc-bold`, `body`, `display`, `btn-gold`, `btn-ghost`
- **No `localStorage`/`sessionStorage` for auth.** Clerk `useUser()` is the
  source of truth. Local browser state reserved for reflective journal
  fields (Daily Examen, Lectio Divina) — intentionally device-local for
  privacy

### Hosting and services

- **Vercel** — hosting, auto-deploys from `main`
- **Clerk** — auth (email + verification code, Google OAuth, Apple deferred)
- **Plausible** — analytics (planned; not yet installed)
- **Resend** — email (planned; not yet installed)
- **Sentry** — error monitoring (planned; not yet installed)
- **Vercel Edge Functions** — Companion AI backend (`api/companion.js`,
  not yet built — see MASTER_SPEC §5.x)
- **Anthropic API** — Companion model provider (Sonnet 4.6 default, Opus 4.7
  escalation, Haiku 4.5 utility)

### Content and naming

- **"Fifty days" / "Seven weeks to Pentecost"** — never "forty-nine days"
- **ABIDE is the Step 4 verb** in all consumer-facing surfaces. Never REST
- **The Kingdom Course** = Tier 1 product name
  **The Kingdom Academy** = Tier 2, unlocked at Day 50
- **DTS** = internal/post-threshold language only; never in marketing
- **Three classical movements:** Via Purgativa · Via Illuminativa · Via Unitiva
- **Mass-anchored 3-1-3 daily pattern** in the Hub (3 preparing, At the
  Altar, 3 sent forth)
- **Channel-agnostic community language.** No structural requirement for
  in-person community. Catechetical teaching preserved as organic fruit
- **The Five Houses** display names: Light · Fire · Joy · Glory · Earth
- **Internal House slugs** (code, not display): `light`, `fire`, `peace`
  (= Joy), `glory`, `benedict` (= Earth)
- **Earth is the 5th House** — always — both in display and in array order

### The Seven Keys (canonical frame, per FINAL_CONTENT_REVISION_PLAN §1.12)

- **Seven Keys** — primary unifying frame (Matthew 16:19 — keys of the
  kingdom)
- **Seven essentials** — substance language (what each key unlocks)
- **Seven steps** — journey language (the user's walking metaphor)
- All three are used deliberately, never as synonyms

The verbs: SEE · KNOW · HEAL · ABIDE · GO · BUILD · SEND

### Pope and saint references (factual, per FINAL_CONTENT_REVISION_PLAN §0.x)

- **Reigning pope:** Pope Leo XIV (Robert Francis Prevost), elected
  May 8, 2025. First American pope. Augustinian
- **Pope Francis (Jorge Bergoglio):** died April 21, 2025. Referenced in
  past tense ("Pope Francis taught," not "Pope Francis says")
- **Saint Carlo Acutis** — canonized September 7, 2025 by Pope Leo XIV.
  First canonized saint of the millennial generation. Feast: October 12
- **Saint Pier Giorgio Frassati** — canonized September 7, 2025 (same Mass
  as Carlo Acutis). Feast: July 4
- Never use "Blessed Carlo Acutis" or "Blessed Pier Giorgio Frassati"

### AI methodology (per STRATEGIC_ARCHITECTURE_v2 Parts I and II)

- **Citation-based authority.** Every catechetical claim cites its source
  (CCC §, Scripture, conciliar document, encyclical, Doctor, Magisterial
  source)
- **Transparent AI disclosure.** Every AI-assisted surface displays the
  disclosure footer: *"This content was prepared with AI assistance,
  grounded in the Catechism and Sacred Tradition. AI can make mistakes."*
- **Methodology mark in footer:** *AI-presented · Magisterium-grounded ·
  Citation-verified · Theologically reviewed* (or short Latin form:
  *Per machinas, per Magisterium*)
- **Engineered citation verification** — reference databases + automated
  lookup + manual spot check. Build before Companion ships
- **Iconographic frame.** Stylized illustration over photorealistic faces.
  No AI-generated face of Christ. No AI speaking *as* a saint. No AI
  simulating sacraments. See STRATEGIC_ARCHITECTURE_v2 §2.6 for hard lines

### Verification

- **`npm run dev`** for local development
- **`npm run build`** must complete with zero warnings
- **`npm test`** — 176/176 tests passing as of last verified state
- **Do not use the broken `verify/` harness** with hardcoded
  `/home/claude/` paths

### Tone of working

- Direct, opinionated technical advice with rationale
- Honest constraints — say "I don't know" when true
- Brief preambles, no flattery
- Catholic context taken seriously (theology, liturgy, saints, Latin)
- Inline styles over abstractions where the trade-off is tight
- One step at a time when shipping; verify each step before moving

---

## Current build state (May 18, 2026)

### Shipped to production
- Three-tab shell with Clerk auth (Google OAuth + email/verification)
- Gate (Gospel) with Hero, evidentiary content, signup invitation
- Course tab with seven-step preview and Day 1 landing for signed-in users
- Kingdom Hub with liturgical-day eyebrow, 3-1-3 strip, At the Altar
- Branded icon set + modern PWA meta
- `public/privacy.html`, `public/terms.html` at clean URLs
- Footer with copyright + Privacy + Terms + Latin motto
- L.10 production smoke test passed

### Pending — Tier 0 urgent factual fixes (per FINAL_CONTENT_REVISION_PLAN)
- Pope Francis → Pope Leo XIV across all surfaces
- Blessed Carlo Acutis → Saint Carlo Acutis (and Pier Giorgio Frassati)

### Pending — Tier 1 structural revisions (per FINAL_CONTENT_REVISION_PLAN)
- Hero headline "most important" replacement
- Tagline subhead promotion
- Kingdom of Eternal Life reinforcement
- Opening paragraph tightening
- Living Evidence section (with verified statistics)
- Trail/Course wording cleanup
- Reader-types 3-column responsive grid
- Authentication gating at Day 2 (Day 1 free)
- Step button height reduction
- Course content reading width to 720px
- Earth-as-5th-House bug fix
- Seven Keys terminology standardization

### Pending — Tier 2+ (per FINAL_CONTENT_REVISION_PLAN and STRATEGIC_ARCHITECTURE_v2)
- Hub daily tasks audit and Marian dimension
- BUILD rotation logic (family/community/civilization by day of week)
- Confession affordance
- Methodology page (`/methodology`)
- AI disclosure footers on all consumer surfaces
- Methodology mark in chrome footer
- Vocabulary audit (Gate, DTS, REST, Peace, Benedict)
- Grammar polish pass

### Pending — Tier 3+ (per STRATEGIC_ARCHITECTURE_v2 Part VIII sequencing)
- Companion backend (api/companion.js)
- SEO question-page library
- Daily audio podcast
- YouTube channel
- Short-form video
- Native app wrapper
- MCP server
- Voice-first surfaces
- Phone-callable Companion
- Multilingual expansion (Spanish first)

---

## How to resume work

Open Claude Code. This file loads automatically. Mention the relevant
execution doc:

> *Read @docs/execution/FINAL_CONTENT_REVISION_PLAN.md Tier 0. Implement
> all factual corrections. Show diffs before applying.*

For larger batches, work through the FINAL_CONTENT_REVISION_PLAN's
8-day sequenced implementation (see its §6.2).

For new feature work past the soft launch, work from
MASTER_SPECIFICATION.md and STRATEGIC_ARCHITECTURE_v2.md.

---

*Salus animarum suprema lex.*
