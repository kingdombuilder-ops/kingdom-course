# The Kingdom Course — Project Context

*This file is read at the start of every Claude Code session in this repo.
Canonical decisions encoded here govern every implementation choice. Do not
relitigate. Updated 18 May 2026 (v2).*

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
  - `STRATEGIC_ARCHITECTURE.md` — principles, surfaces, tools, governance
  - `FINAL_CONTENT_REVISION_PLAN.md` — pre-launch revision work, organized by tier
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

### The Seven Steps (canonical frame)

- **Seven Steps** — the canonical name for the seven verbs of the Course.
  Used everywhere the seven are referenced collectively or individually
- **Step N — VERB** — the canonical form for naming a specific step
  (e.g., "Step 4 — ABIDE")
- **Seven essentials** — used only where the substance (what is learned
  at each step) is named, not the journey. Rare. Prefer "steps" when in
  doubt
- **Seven Keys** — retired from consumer-facing copy. The Matthew 16:19
  reference belongs in the chapter on the Church and Peter, not as the
  project's top-level frame

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

### AI methodology — six features (per STRATEGIC_ARCHITECTURE Part I)

All six required for AI-speed Catholic ministry. Three or four is not
sufficient.

1. **Citation-based authority.** Every catechetical claim cites its source
   (CCC §, Scripture, conciliar document, encyclical, Doctor, Magisterial
   source). Visible to the reader. Format consistent across surfaces
2. **Transparent AI disclosure.** Every AI-assisted surface displays the
   footer: *"This content was prepared with AI assistance, grounded in the
   Catechism and Sacred Tradition. AI can make mistakes. Verify what
   matters; consult your priest; read the cited sources."*
3. **Theological advisory** — small named advisory (initially 3 members:
   priest/religious, academic theologian, lay catechist), regular review
   of sampled content, does not gate publication, public withdrawal as
   structural backstop
4. **Ecclesial integration** — the project maintains transparent
   communication with appropriate Catholic authorities (a bishop or
   bishops, where willing relationships exist). Authorities are *informed*,
   not asked to pre-approve content. Briefings on a regular cadence. The
   relationship is transparency and accountability, not gating
5. **No personality cult** — no operator name or bio in chrome. No founder
   page. Voice is liturgical and institutional, not personal. Video
   defaults to voice-over or animation; no founder-on-camera. The
   project's authority rests on the Magisterium, the saints, the cited
   sources — not on any individual
6. **Engineered citation verification** — reference databases (CCC,
   Scripture, conciliar docs, encyclicals, Doctors, verified saint
   quotations) + automated lookup + manual spot check. Build before
   Companion ships

### AI methodology — six hard lines (per STRATEGIC_ARCHITECTURE §2.6)

**These are absolute. Never violated regardless of request or framing.**

1. **The face of Jesus Christ is never AI-generated.** Existing Catholic
   artistic tradition (Shroud, icons, Pantocrator, contemporary Catholic
   art) is used when visual reference to the Lord is needed
2. **AI never speaks *as* a saint.** No first-person voice of named saints.
   Quotation with verified citation only
3. **AI never performs or simulates sacraments.** No AI absolution,
   blessing, consecration, marriage, ordination, or any sacramental act
4. **AI never claims pastoral or spiritual authority of its own.** The
   Companion refers users to: priest for Confession, spiritual director for
   direction, mental-health professional for crisis
5. **AI never represents real living Catholics without explicit consent.**
   No deepfakes. No impersonations. No "what Bishop X would say" simulations
6. **All AI-generated content is versioned and correctable.** No "set and
   forget"; every piece is part of a living, accountable corpus

Methodology mark in chrome footer: *AI-presented · Magisterium-grounded ·
Citation-verified · Theologically reviewed* (or short Latin form:
*Per machinas, per Magisterium*)

### Aesthetic — the iconographic frame

AI-generated visuals operate in the iconographic tradition. Stylized,
openly non-photorealistic, pointing beyond themselves to the truth
transmitted. Window, not photograph.

- **No AI-generated photorealistic human faces** in regular content
- **Stylized illustration is primary visual language.** Brand-aligned
  illustration style; references: Daniel Mitsui woodcut sensibility, Mary
  Fleeson contemporary Catholic illustration, Eric Gill late-Romantic
  Catholic illustrative tradition
- **Saint imagery** — prefer existing public-domain art over AI-generated
  images of named saints
- **Symbolic / typographic visuals** are safest and brand-aligned
- **Atmospheric/environmental video** OK (Veo 3.1, Seedance 2.0, Sora 2)
  — cathedral interiors, candle light, ocean horizons, the Shroud in slow
  motion — no faces, no human likeness required
- **AI talking-head avatars** not used as primary voice of the project
- **One consistent Kingdom Course voice** via ElevenLabs Multilingual v2.
  Warm. Clearly synthetic. Never named, never given a personality

### Catholic vocabulary lock-list (preventing Protestantization)

Avoid these phrasings in generated content. Use the Catholic terms instead.

| Avoid | Use |
|---|---|
| "personal relationship with Jesus" (as primary frame) | "communion with the King" or simply "relationship with Christ" |
| "service" (instead of "Mass") | "Mass" |
| "saved" (as one-time decision) | "in a state of grace" or "saved by Christ's work, walking in grace" |
| "fellowship" (as primary community term) | "communion" or "common life" |
| "preacher" (in normal usage about priests) | "priest" |
| "Christ-follower" | "Christian" or "Catholic" |
| "do life together" | "walk together" or "live in communion" |
| "doing church" | "the parish" or "the Mass" |
| "altar call" | "the kerygma" or "the invitation" |
| "ask Jesus into your heart" | "open yourself to Christ" or "receive Him" |
| "biblical" (alone, as adjective meaning "good") | "rooted in Scripture and Tradition," or omit |

Apply during content generation and as a post-generation lint check.

### Hero copy direction (per FINAL_CONTENT_REVISION_PLAN §1.1-1.4)

- **"Most important," not "greatest"** — for the Gate (Gospel page). The
  Gate is stakes-raising for the unaffiliated seeker; "most important"
  carries weight that "greatest" does not. "Greatest" may be used in
  post-signup surfaces where the user has already crossed the threshold
- **Parallel construction** — two short declarations: *"The single most
  important announcement in history. And the most rigorously verified."*
- **"Kingdom of Eternal Life"** appears prominently — eyebrow and body
  reinforcement. The substantive claim of the entire movement
- **"Hinge of history"** — preserved as central metaphor for Christ
- **Tagline** *"The Gospel meets you. The Course forms you. The Kingdom
  holds you."* — promoted to subhead position beneath the Hero declaration

### Authentication gating (per FINAL_CONTENT_REVISION_PLAN §1.8)

- **Gospel page:** fully open, no signup
- **Course overview / preview:** fully open, no signup
- **Day 1 reading:** open without signup (low-friction try)
- **Day 2-50 readings:** require signup (Clerk modal)
- **Progress tracking, streaks, Companion:** require signup

### Surface priority and sequencing (per STRATEGIC_ARCHITECTURE Part VIII)

**Build doctrine: text first, audio second, video third, developer/
ecosystem fourth, accessibility surfaces fifth.**

The seeker is in a search bar before they are in any other surface. Build
in that order.

| Priority | Surface | Status |
|---|---|---|
| 1 | Web / PWA (formation home) | [BUILT — core] |
| 2 | **SEO question-page library** (highest seeker-acquisition leverage) | [NOT STARTED — high priority] |
| 3 | Daily audio podcast (Bible-in-a-Year pattern) | [NOT STARTED] |
| 4 | YouTube channel (long-form discovery) | [NOT STARTED] |
| 5 | Short-form video (Reels / Shorts / TikTok) | [NOT STARTED] |
| 6 | Native app wrapper (Capacitor) | [NOT STARTED] |
| 7 | MCP server (developer ecosystem; value-positive but not lead) | [NOT STARTED] |
| 8 | Voice-first surfaces (Watch, CarPlay, Alexa, Google Home) | [NOT STARTED] |
| 9 | Phone-callable Companion | [NOT STARTED] |
| 10 | Multilingual (Spanish, then per priority order) | [NOT STARTED] |

**Do not propose building MCP server, voice surfaces, or multilingual
ahead of the SEO library + audio podcast + YouTube.**

### Open content licensing (per STRATEGIC_ARCHITECTURE Part VII)

When LICENSE files are added or content is exported:

- **Course content (Day readings, Field Guide, Academy):** CC BY-SA 4.0
- **SEO question-page library:** CC BY-SA 4.0
- **Software (web app code):** AGPL-3.0
- **Brand and trademarks:** standard copyright; attribution required
- **Companion responses:** not separately licensed (service, not
  redistributable)

The catechetical content is *transmission of the deposit of faith*. Open
where possible.

### Verification

- **`npm run dev`** for local development
- **`npm run build`** must complete with zero warnings
- **`npm test`** — not wired in this repo (planned; not yet
  implemented). Verification is by `npm run build` (must complete
  with zero warnings) and manual production smoke test
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
- Seven Steps terminology standardization

### Pending — Tier 2+ (per FINAL_CONTENT_REVISION_PLAN and STRATEGIC_ARCHITECTURE)
- Hub daily tasks audit and Marian dimension
- BUILD rotation logic (family/community/civilization by day of week)
- Confession affordance
- Methodology page (`/methodology`)
- AI disclosure footers on all consumer surfaces
- Methodology mark in chrome footer
- Vocabulary audit (Gate, DTS, REST, Peace, Benedict)
- Grammar polish pass

### Pending — Tier 3+ (per STRATEGIC_ARCHITECTURE Part VIII sequencing)

Build in priority order (per Surface priority table above):

1. SEO question-page library (Surface 2) — highest priority after core product ships
2. Daily audio podcast (Surface 3)
3. YouTube channel (Surface 4)
4. Short-form video (Surface 5)
5. Native app wrapper (Surface 6)
6. MCP server (Surface 7)
7. Voice-first surfaces (Surface 8)
8. Phone-callable Companion (Surface 9)
9. Multilingual expansion — Spanish first (Surface 10)

Plus: Companion backend (`api/companion.js`) — built as Surface 2-5
develop, since those surfaces benefit from a working Companion

---

## How to resume work

Open Claude Code. This file loads automatically. Mention the relevant
execution doc:

> *Read @docs/execution/FINAL_CONTENT_REVISION_PLAN.md Tier 0. Implement
> all factual corrections. Show diffs before applying.*

For larger batches, work through the FINAL_CONTENT_REVISION_PLAN's
tier-by-tier implementation (see its §6.2).

For new feature work past the soft launch, work from
MASTER_SPECIFICATION.md and STRATEGIC_ARCHITECTURE.md, respecting the
surface priority order above.

---

*Salus animarum suprema lex.*
*Per machinas, per Magisterium.*
