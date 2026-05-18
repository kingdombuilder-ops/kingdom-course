# THE KINGDOM COURSE — MASTER PRODUCT SPECIFICATION

*The complete technical and strategic build manifest. Every system. Every
requirement. Every acceptance criterion. Status-tagged. Dependency-ordered.
No commentary on difficulty, duration, or vision — only what must exist for
the full product to exist.*

**Spec version:** 1.0 · 17 May 2026
**Operator:** Aaron · Sidney BC
**Production URL:** kingdomcourse.org

---

## STATUS LEGEND

- **[BUILT]** — Shipped to production, verified working
- **[BUILT-DEV]** — Built but on dev/test keys; needs production swap
- **[PARTIAL]** — Started but incomplete
- **[STUBBED]** — UI/seam exists, backend or data missing
- **[NOT STARTED]** — Not begun

---

## SECTION 0 — CANONICAL DECISIONS (LOCKED)

These are settled. No spec item below contradicts them.

- **Tech stack:** Vite + React 18. No Next.js, no Astro, no website builder
- **Styling:** Inline `style={{}}` only. Never Tailwind utility classes. Custom
  CSS classes from `src/styles/index.css` permitted
- **Hosting:** Vercel
- **Auth:** Clerk
- **Email:** Resend
- **Analytics:** Plausible (no Google Analytics)
- **Error monitoring:** Sentry free tier
- **AI backend:** Anthropic API via Vercel Edge Functions
- **Pricing:** Free forever. No paywall. No premium tier
- **Course duration:** 50 days, framed as "seven weeks to Pentecost." Never 49
- **Step 4 verb:** ABIDE. Never REST
- **Five Houses display names:** Light · Fire · Joy · Glory · Earth
- **Five Houses internal slugs:** `light`, `fire`, `peace`, `glory`, `benedict`
- **Tab structure:** Three tabs — `gate` (The Gospel), `course` (The Course),
  `kingdom` (The Kingdom)
- **Tier 1 product name:** The Kingdom Course
- **Tier 2 product name:** The Kingdom Academy (unlocked Day 50)
- **Internal-only terms:** "DTS" — never in marketing surfaces
- **Three movements:** Via Purgativa · Via Illuminativa · Via Unitiva
- **Seven keys:** SEE · KNOW · HEAL · ABIDE · GO · BUILD · SEND
- **Daily Hub pattern:** Mass-anchored 3-1-3 (three preparing, At the Altar,
  three sent forth)
- **Community framing:** Channel-agnostic. No structural requirement for
  in-person community; catechetical teaching about it preserved
- **Verification commands:** `npm run dev` and `npm run build`. Build must
  finish with zero warnings. Do not use the broken `verify/` harness
- **Operating principle:** *Salus animarum suprema lex*

---

# 1. INFRASTRUCTURE & DEPLOYMENT

## 1.1 Hosting

**Status:** [BUILT]
**Purpose:** Serve the application worldwide with TLS, auto-deploy on push.

**Requirements:**
- Vercel project `kingdom-course` in `kingdombuilder-ops` workspace
- Hobby tier sufficient through ~50K–100K monthly visitors
- Auto-deploy from `main` branch
- Preview deploys for branches and PRs

**Acceptance:** push to `main` triggers deploy; production URL serves
within 60 seconds.

## 1.2 Domain

**Status:** [BUILT]

**Requirements:**
- `kingdomcourse.org` registered (Namecheap)
- Apex `A` record → `216.198.79.1` (Vercel)
- `www` `CNAME` → `8dabb35f45ae5909.vercel-dns-017.com.`
- `www.kingdomcourse.org` 301-redirects to apex
- SSL via Let's Encrypt (Vercel-managed, auto-renew)
- DNS TTL ≤ 1 hour for first 6 months

**Acceptance:** apex loads with valid cert; `www` redirects; SSL Labs A or A+.

## 1.3 Source Control

**Status:** [BUILT]

**Requirements:**
- GitHub repo `kingdombuilder-ops/kingdom-course`, private until Tier 3 launch
- `main` is the deploy branch
- `node_modules/` gitignored
- `.env.local` gitignored
- Branch protection on `main` once team grows to 2+

**Acceptance:** `git push origin main` deploys to production.

## 1.4 Environment Variables

**Status:** [BUILT-DEV — needs production swap]

**Required vars:**
- `VITE_CLERK_PUBLISHABLE_KEY` (frontend, public)
- `CLERK_SECRET_KEY` (backend, server-only) — when Companion ships
- `ANTHROPIC_API_KEY` (backend, server-only) — when Companion ships
- `RESEND_API_KEY` (backend, server-only) — when email ships
- `PLAUSIBLE_DOMAIN` — when analytics ships
- `SENTRY_DSN` — when error monitoring ships

**Storage:** Vercel Environment Variables UI, Production + Preview scopes,
sensitive flag enabled on all secrets.

**Acceptance:** all vars loaded in production; no secret committed to git.

## 1.5 Backup and Disaster Recovery

**Status:** [NOT STARTED]

**Requirements:**
- GitHub repo is canonical source of truth for code
- Clerk exports user data on schedule (weekly CSV via API)
- Vercel deployment history kept indefinitely (default)
- Domain registration auto-renew + lock enabled
- DNS records documented in `INFRASTRUCTURE.md`

**Acceptance:** in event of total account loss, project can be rebuilt
from GitHub repo + Clerk export + DNS doc within 4 hours.

## 1.6 Custom 404 Page

**Status:** [NOT STARTED]

**Requirements:**
- File: `public/404.html` (Vercel auto-serves)
- Brand-styled (paper background, Cormorant Garamond)
- Single message: "This door is not here. The Kingdom is."
- Link back to `/` ("Return to The Kingdom")
- Latin motto in footer

**Acceptance:** `kingdomcourse.org/nonexistent` returns the custom 404.

---

# 2. AUTHENTICATION & IDENTITY

## 2.1 Auth Provider

**Status:** [BUILT-DEV]

**Requirements:**
- Clerk Hobby plan (free) through 10,000 MAU; Pro at $25/mo above
- App name: "Kingdom Course"
- Production instance to be created when Tier 1 broad launch is approved
- Development instance: `balanced-cod-0.clerk.accounts.dev`

**Acceptance:** L.10 smoke test passes — production OAuth round-trip + email
verification work in incognito.

## 2.2 OAuth Providers

**Status:** [PARTIAL — Google built; Apple not started]

**Google OAuth:**
- [BUILT-DEV] Google Cloud project "Kingdom Course" (#895029317495)
- OAuth Client "Kingdom Course Web"
- Custom credentials in Clerk (not Clerk's shared Google dev creds)
- Scopes: `openid`, `email`, `profile`
- Test users whitelisted in Google Cloud while Testing mode is on
- Production-ready: switch Google Cloud audience to External + Verified

**Apple OAuth:**
- [NOT STARTED]
- Requires Apple Developer Program enrollment ($99/yr USD)
- Requires DUNS number
- Add as Clerk SSO provider after enrollment
- Add Sign in with Apple button to SignupModal

**Acceptance:** Both buttons functional; round-trip lands user on Course tab.

## 2.3 Email + Verification Code Auth

**Status:** [BUILT]

**Requirements:**
- Clerk email + 6-digit code flow enabled
- Password field disabled (key configuration — do not re-enable)
- Verification email sent via Clerk's default in development
- Replace verification email from-address with `welcome@kingdomcourse.org`
  before broad launch
- Subject line: customize to "Your door to the Kingdom — code XXXXXX"
- Body: include welcome line + Latin motto

**Acceptance:** new user can sign up with email only, complete flow under 60s.

## 2.4 Session Management

**Status:** [BUILT]

**Requirements:**
- Clerk handles session via cookies (HttpOnly, Secure, SameSite=Lax)
- Frontend uses `useUser()` hook for auth state
- No reliance on `localStorage`/`sessionStorage` for auth
- Session length: Clerk default (7 days inactivity, sliding)
- Sign-out clears session and routes to Gate

**Acceptance:** session persists across browser restart; sign-out works.

## 2.5 User Profile Schema

**Status:** [PARTIAL — relies on Clerk profile]

**Required user fields (stored in Clerk):**
- `firstName` (collected at signup)
- `email` (verified)
- `imageUrl` (optional, from Google)
- `unsafeMetadata.startingFrom` (the optional free-text response)
- `unsafeMetadata.signupDate` (ISO date, set on signup)
- `unsafeMetadata.preferredHouse` (set by Houses quiz, optional)
- `unsafeMetadata.locale` (default `en`, set by user)
- `unsafeMetadata.parishGooglePlaceId` (optional, parish bridge)

**Additional data (not in Clerk, kept device-local):**
- Journal entries from Daily Examen, Lectio Divina, Houses quiz reflections
- Reading progress (current Day number)
- Streak count

**Acceptance:** all six metadata fields readable from `useUser()`.

## 2.6 Privacy of Reflective Content

**Status:** [BUILT — by absence; pattern to maintain]

**Requirement:** journal/reflection fields used in Examen, Lectio, Houses
quiz remain in browser state only. Never POST to server. Never store on
Clerk. Document this in code comments at every relevant component.

**Acceptance:** code review of every modal containing user reflection confirms
no network calls write the content.

---

# 3. FRONTEND APPLICATION

## 3.1 Application Shell

**Status:** [PARTIAL]

**Components:**
- `App.jsx` — root, manages tab state, mounts modals
- `KingdomTabNav.jsx` — production header (clean, ready, awaiting App.jsx
  swap-in per its own file comment)
- `Footer.jsx` — four-column footer + bottom row

**Open work:**
- Swap `KingdomTabNav.jsx` into `App.jsx` (currently using older inline
  nav). Estimated 1-hour task per file's own comment.
- Resolve V2 (Tailwind monolith) vs. inline-styles split. Reconcile to
  inline-styles-only.

**Acceptance:** three-tab navigation renders identically on desktop and
mobile, with active state visible.

## 3.2 The Gate (The Gospel Tab)

**Status:** [BUILT]

**Components:**
- `Hero.jsx` — "The single greatest announcement in history"
- Long-scroll content: kerygma, Nine Circles preview, invitation
- Internal route: tab key `gate`

**Open work:**
- Add quiet CTA bottom-right of Hero ("ENTER" small-caps) linking to
  signup invitation
- Add subhead beneath Hero headline: *"The Gospel meets you. The Course
  forms you. The Kingdom holds you."*
- Add unauthenticated "Read the Gospel" doorway that delivers the
  classical kerygma without requiring signup

**Acceptance:** Hero loads in < 2s on 3G; CTA visible above fold on
desktop and mobile.

## 3.3 The Course Tab

**Status:** [PARTIAL]

**Components:**
- `CourseHero.jsx` — landing for signed-in users
- Signed-out view shows Course preview (seven steps, fifty days)
- Day-by-day reading content

**Open work:**
- Day 1 reading: verify classical kerygma order (God loves you → Sin is
  real → Christ saves → Respond in faith)
- Day 2–7 readings (Step 1: SEE)
- Day 8–14 readings (Step 2: KNOW)
- Day 15–21 readings (Step 3: HEAL)
- Day 22–28 readings (Step 4: ABIDE)
- Day 29–35 readings (Step 5: GO)
- Day 36–42 readings (Step 6: BUILD)
- Day 43–50 readings (Step 7: SEND)
- Progress bar component (highlights current step)
- Day completion mechanic (mark-as-done, advance)
- Post-Day-50 transition to Academy

**Acceptance:** signed-in user lands on Course tab, sees "Hello, [name]"
+ correct current Day + 50-day progress visualization.

## 3.4 The Kingdom Tab (Daily Hub)

**Status:** [PARTIAL]

**Components:**
- `HubHero.jsx` — liturgical day eyebrow + "The Kingdom." title
- `liturgical.js` — calendar mapping
- 3-1-3 strip (TODAY'S SEVEN)
- "At the Altar" panel for the day's feast/memorial
- "Today in the Kingdom" awareness block

**Open work:**
- Wire 3-1-3 strip glyphs to actual daily content (preparing actions,
  At the Altar reading, sent-forth actions)
- Saint-of-the-day pull from `saints.js`
- Daily intention prompt
- Field Guide entry link based on liturgical season
- Lectionary integration (the day's Mass readings — needs source API or
  data file)

**Acceptance:** Hub renders correctly for any date in liturgical year,
including movable feasts (Easter, Pentecost, Ascension).

## 3.5 The Field Guide

**Status:** [PARTIAL — content exists, surface incomplete]

**Components:**
- 22 practice modals (Daily Examen, Lectio Divina, Rosary, Stations of
  the Cross, Liturgy of the Hours, Fasting, Confession Examination,
  etc.)
- Field Guide index page
- Per-practice "How to" content

**Open work:**
- Permanent home for Field Guide outside V2 monolith
- Field Guide content from `The_Kingdom_Field_Guide_FINAL.md` migrated
  into per-practice components
- Search/filter by topic
- Cross-references between practices

**Acceptance:** all 22 practices accessible from a Field Guide index;
each opens its own modal or detail view.

## 3.6 The Academy Reader

**Status:** [STUBBED — locked card visible]

**Purpose:** Tier 2 reading surface, unlocked Day 50. Reads from the seven
internal DTS books.

**Components:**
- Reader UI: chapter navigation, progress bar, font-size controls,
  reading position memory
- Content source: `The_Kingdom_DTS_Book[1-7]_*.md` files
- Chapter-level URLs for SEO
- Section bookmarking

**Open work:**
- Reader component (modeled on Bible in a Year reader or Word on Fire
  reader patterns)
- Content migration from `.md` to renderable structure
- Audio version integration (see 4.8)
- Day-50-unlock gate (auto-unlock when user marks Day 50 complete)

**Acceptance:** post-Day-50 user can open Academy, read Book 1 Chapter
1, return to last position on next visit.

## 3.7 Signup / Auth Modals

**Status:** [BUILT — needs minor edits]

**Components:**
- `SignupModal.jsx` — Google button + email form
- `VerifyEmailModal.jsx` — 6-digit code entry
- Sign-in modal (or unified with signup)

**Open work:**
- Rename "Where are you starting from?" → "In one sentence — what is
  bringing you here today?"
- Mark the field as optional, visible (`Optional · skip if you prefer`)
- Add Privacy/Terms acknowledgment line beneath submit
- Mobile-specific layout (single column, fixed-bottom submit)

**Acceptance:** signup completes in < 60s on mobile; abandonment
< 30% in soft launch.

## 3.8 The Companion UI

**Status:** [STUBBED]

**Components:**
- `Companion.jsx` — chat surface (UI shell exists, backend missing)
- Floating ASK button (bottom-right, persistent)
- Conversation history (session-scoped initially; persistent later)

**Open work:**
- See Section 5 for full backend spec
- Currently: replace stubbed behavior with explicit placeholder until
  backend ships — *"The Companion is coming. For now, your daily reading
  and the Field Guide are your guides."*
- Per-tab context (Companion knows which tab the user is on)

**Acceptance:** ASK button always responsive; placeholder or live
Companion never returns silence.

## 3.9 Static Legal Pages

**Status:** [BUILT]

**Files:**
- `public/privacy.html` → served at `/privacy`
- `public/terms.html` → served at `/terms`
- `vercel.json` — clean URLs enabled, trailing slash disabled

**Open work:**
- BC lawyer review before broad launch
- Add "last updated" + changelog block
- Update Privacy page when Plausible is installed
- Real contact email replaces `hello@kingdomcourse.org` placeholder

**Acceptance:** `/privacy` and `/terms` clean URLs serve correct pages;
lawyer signs off.

## 3.10 Footer

**Status:** [BUILT]

**Components:**
- Brand block + tagline
- Walk column (three tabs)
- Reference column (Field Guide, Academy lock indicator)
- Bottom row: copyright · Privacy · Terms · Latin motto

**Open work:**
- Add quiet "If you are in crisis" link in bottom row or as floating
  always-visible link
- Add Find-a-parish link (when 8.1 ships)
- Add Latin motto translation gloss for first 6 months

**Acceptance:** footer renders correctly on every page; all links work.

## 3.11 PWA Configuration

**Status:** [BUILT]

**Components:**
- `public/manifest.webmanifest`
- Icons: `favicon.svg`, `apple-touch-icon.png`, `icon-192.png`,
  `icon-512.png`, `icon-maskable-512.png`
- Meta tags: `apple-mobile-web-app-capable`, `mobile-web-app-capable`,
  `theme-color`, `viewport`

**Open work:**
- Service worker for offline reading of current Day + cached Field
  Guide entries
- Install-prompt UI for returning users on Day 3 or 7
- Test installation on iOS Safari and Android Chrome
- Push notification support (requires service worker + opt-in flow)

**Acceptance:** "Add to Home Screen" works on both platforms; installed
app launches in full-screen mode with correct icon.

## 3.12 Houses Discernment Quiz

**Status:** [PARTIAL]

**Components:**
- `HousesQuiz.jsx` modal
- `quiz.js` data file
- Quiz results: assigned House + saint mentor recommendation

**Open work:**
- Verify display names use Light/Fire/Joy/Glory/Earth (not Peace/Benedict)
- Save result to Clerk user metadata (`preferredHouse`)
- Allow re-taking the quiz
- Per-House content path through the Course (saint mentor calls out
  House-specific practices)

**Acceptance:** quiz returns a House; House influences saint
recommendations across the Course.

## 3.13 The Nine Circles Interactive SVG

**Status:** [PARTIAL — in V2 monolith]

**Purpose:** Visual representation of the Nine Circles of evidence from
the Miracles outline. Interactive SVG, each circle expands to its content.

**Open work:**
- Migrate from V2 monolith to standalone component with inline styles
- Mobile touch interactions
- Per-circle content from `Miracles_of_the_Kingdom_REVISED.md`
- Accessibility (keyboard navigation, screen-reader labels)

**Acceptance:** Nine Circles visible on Gate; each circle expands to its
content modal.

---

# 4. CONTENT SYSTEMS

## 4.1 Daily Course Content (Days 1–50)

**Status:** [PARTIAL — outlines in Master Vision, full text needs writing]

**Required content:**
- 50 daily readings, each ~1,200–1,800 words
- Each Day mapped to one of seven Steps (SEE/KNOW/HEAL/ABIDE/GO/BUILD/SEND)
- Each Day with: title, subtitle, body, Scripture citation, saint
  reference, daily practice
- Sourced from Books 1–7 of the Master Vision

**Storage:** `src/data/course.js` (or `course/dayN.js` per-day for
maintainability at scale)

**Schema per Day:**
```js
{
  day: 1,
  step: 'SEE',
  stepIndex: 1,
  title: 'Awaken to the Kingdom',
  subtitle: 'Meet the King. Learn who you are. Receive the Spirit. Cross
             the threshold.',
  scripture: 'Mark 1:15',
  saintReference: 'St. Carlo Acutis',
  body: '...full reading...',
  practice: 'Pray the kerygma aloud.',
  audioUrl: '/audio/day-01.mp3', // when 4.8 ships
  estimatedReadingMinutes: 12
}
```

**Open work:**
- Write all 50 Day readings
- Theological review by external advisor
- Audio recording (see 4.8)

**Acceptance:** Day N renders; user can navigate forward/backward; mark
complete.

## 4.2 Field Guide Content (22 Practices)

**Status:** [BUILT — content exists in `The_Kingdom_Field_Guide_FINAL.md`]

**Required content:**
- 22 practices from the Field Guide source
- Each practice: name, source-book reference, brief description,
  "how to" steps, when/duration, see-also cross-references

**Storage:** `src/data/fieldGuide.js` (or `fieldGuide/[slug].js` per-practice)

**Open work:**
- Migration from markdown to renderable JSON/component data
- Per-practice modal component (or shared template)

**Acceptance:** all 22 practices openable from Field Guide index.

## 4.3 Academy Content (Seven Books)

**Status:** [BUILT — content exists in `The_Kingdom_DTS_Book[1-7]_*.md`]

**Required content:**
- 7 books × ~6 chapters = ~42 chapters
- Each chapter: title, body (10,000–25,000 words), Scripture index,
  saints index, Catechism index

**Storage:** `src/data/academy/book[1-7]/chapter[N].js`

**Open work:**
- Migration from markdown to renderable structure
- Per-chapter component with reading-progress capture
- URL structure: `/academy/book-1-awakening/chapter-1-the-veil-lifts`

**Acceptance:** every chapter accessible at a clean URL.

## 4.4 Liturgical Calendar Engine

**Status:** [PARTIAL]

**Purpose:** map any date to its liturgical day, season, color, feast,
saints of the day, and Mass readings.

**Storage:** `src/data/liturgical.js`

**Required functions:**
- `getSeason(date)` → 'advent' | 'christmas' | 'ordinary' | 'lent' |
  'triduum' | 'easter'
- `getColor(date)` → 'purple' | 'white' | 'green' | 'red' | 'rose'
- `getFeast(date)` → null | { name, rank, color }
- `getSaintsOfDay(date)` → array of saints
- `getReadings(date)` → { firstReading, psalm, secondReading, gospel }
- `getMovableFeasts(year)` → { ashWednesday, easter, ascension,
  pentecost, christTheKing }

**Open work:**
- Movable feast calculation (Computus for Easter)
- Universal Catholic calendar data (2020–2050 at minimum)
- Diocesan-specific feast support (Memorial-vs-Optional distinctions)
- Lectionary cycle (A/B/C years for Sundays; I/II for weekdays)

**Acceptance:** May 13, 2026 returns "Easter season, white, Memorial of
Our Lady of Fatima, [readings]"; movable feasts correct for years
2020–2050.

## 4.5 Saints Feed

**Status:** [PARTIAL]

**Purpose:** per-day saint(s), with House attribution, biography, prayer.

**Storage:** `src/data/saints.js`

**Schema per saint:**
```js
{
  slug: 'carlo-acutis',
  name: 'Blessed Carlo Acutis',
  feastDate: '10-12', // MM-DD
  house: 'fire', // internal slug
  born: 1991, died: 2006,
  beatified: 2020,
  patronOf: ['internet', 'computer programmers'],
  oneLineSummary: 'A teenage saint of the digital age.',
  biography: '...',
  prayer: '...',
  imageUrl: '/saints/carlo-acutis.jpg',
  sources: ['CCC ...', 'Vatican.va URL']
}
```

**Open work:**
- Minimum 200 saints with full data for first launch
- Eventually full Roman Martyrology (~7,000 saints)
- House assignments (theological judgment per saint)
- Public-domain or licensed images

**Acceptance:** every day of the year returns at least one saint;
clicking returns full biography modal.

## 4.6 Miracles Content (For the Gate)

**Status:** [BUILT — content exists in `Miracles_of_the_Kingdom_REVISED.md`]

**Required content:**
- Nine Circles each with: title, theological framing, 5–10 verified
  cases with scientific/historical citations

**Storage:** `src/data/miracles.js` (or `miracles/circle[N].js`)

**Open work:**
- Migration to renderable structure
- Per-circle modal/expandable component
- Verifiable external citations for every miracle claim

**Acceptance:** Nine Circles SVG opens each circle to full content;
every claim has a citation.

## 4.7 Five Houses Content

**Status:** [PARTIAL]

**Required content per House:**
- Display name (Light/Fire/Joy/Glory/Earth)
- Charism (Dominican/Charismatic/Franciscan/Visionary/Benedictine)
- Founder/Patron
- Three primary saints
- Three primary practices
- Per-Day Course callouts (House-specific encouragement)

**Storage:** `src/data/houses.js`

**Open work:**
- Saint and practice assignments per House
- Quiz-result calibration (which answers map to which House)
- House-specific accent color (subtle, within paper-gold-wine-ink palette)

**Acceptance:** Houses quiz returns House; Course content reflects
House when assigned.

## 4.8 Audio Versions

**Status:** [NOT STARTED]

**Required audio:**
- 50 Day readings (12–18 min each)
- 22 Field Guide practices (5–10 min each)
- 42 Academy chapters (20–60 min each — Tier 2)
- Optional: prayer recordings (Rosary, Examen, Stations)

**Voice talent:**
- Single primary voice for Course Days
- Multiple voices for Academy (variety helps long-form listening)
- Native speakers for translations

**Production:**
- Studio recording (not phone audio)
- Light music bed (optional, brand-aligned)
- MP3 + AAC delivery
- Stored on CDN (Vercel-served from `public/audio/` initially; offload
  to Bunny.net or similar at scale)

**Acceptance:** every Day has an audio version playable inline.

## 4.9 Lectionary Integration

**Status:** [NOT STARTED]

**Purpose:** show the day's actual Mass readings in the Hub.

**Source options:**
- USCCB daily readings API (US calendar)
- Universalis or similar paid API (global calendars)
- Static data file generated annually

**Required fields per day:**
- First reading reference + text
- Responsorial Psalm reference + text
- Second reading reference + text (Sundays/solemnities)
- Gospel reference + text
- Translation: NABRE (US default), RSV-CE (universal Catholic), JB

**Open work:**
- Choose source (recommendation: Universalis paid feed at ~$60/year)
- Render in Hub "At the Altar" section
- Cache aggressively (readings don't change)

**Acceptance:** Hub shows current day's readings, clickable to full text.

---

# 5. THE COMPANION (AI BACKEND)

## 5.1 API Endpoint

**Status:** [NOT STARTED]

**Purpose:** Proxy Anthropic API calls. Server-side keys. Rate-limited.
Content-safety filtered.

**Architecture:**
- File: `api/companion.js` — Vercel Edge Function (not Node serverless;
  Edge for lower latency)
- Runtime: Vercel Edge Runtime
- Streaming: Server-Sent Events to frontend
- Model: Claude Sonnet (default), Opus available for complex queries

**Required endpoints:**
- `POST /api/companion` — main chat endpoint
- `POST /api/companion/feedback` — thumbs up/down per response
- `GET /api/companion/health` — uptime monitoring

**Request schema:**
```json
{
  "messages": [{ "role": "user", "content": "..." }],
  "context": {
    "currentTab": "course",
    "currentDay": 7,
    "userHouse": "fire",
    "locale": "en"
  }
}
```

**Response:** SSE stream of message chunks.

**Acceptance:** end-to-end working under 2s first-token latency.

## 5.2 System Prompt

**Status:** [NOT STARTED]

**Required components:**
- Identity: "You are the Companion of The Kingdom Course, a Catholic
  spiritual formation guide."
- Theological grounding: explicit reference to the Catechism as floor
- Tone: liturgical, plain, adult; never marketing-speak; never emoji
- Vocabulary lock: ABIDE not REST; "fifty days" not 49; Five Houses
  with correct names; "Mass" not "service"; "Confession" not "rite of
  reconciliation" in casual usage
- Limits: not a priest (no absolution, no doctrinal binding); not a
  therapist (no psychological diagnosis); not the Magisterium (humble
  about teaching authority)
- Crisis protocol: see 5.3
- Parish-bridge instruction: always point to local sacramental life
  when sacraments come up
- Multilingual: respond in the user's locale

**Storage:** `api/companion/system-prompt.js` — versioned, code-reviewed
on every change

**Acceptance:** system prompt is theologically reviewed by external
Catholic advisor before broad launch.

## 5.3 Crisis-Detection and Safety

**Status:** [NOT STARTED]

**Required detection patterns:**
- Suicidal ideation: explicit ("want to die", "kill myself", "end it
  all") and implicit ("can't go on", "no point", "everyone better off
  without me")
- Self-harm: cutting, eating disorders, substance abuse
- Active abuse (domestic, child, elder)
- Acute psychotic symptoms (loss of reality contact, command voices)

**Response on detection:**
- Stop normal flow
- Deliver crisis-response template:
  - Acknowledge the person's pain
  - State Companion's limits ("I am a digital companion; you deserve
    a real human")
  - Provide concrete resources (988 US/Canada; local crisis lines per
    locale; Catholic counseling directory; "call a priest" suggestion)
  - Do not attempt therapy
- Log the interaction (consent-aware) for review

**Implementation:**
- Pre-filter user input through Anthropic's Claude with a classifier
  prompt, OR use a dedicated classifier model
- Crisis response stored as static templates per locale
- Never proceed to normal Companion response after crisis detection
  without human override

**Acceptance:** crisis test inputs trigger crisis response 100% of time
in QA; false-positive rate < 5%.

## 5.4 Rate Limiting

**Status:** [NOT STARTED]

**Limits:**
- 30 messages per user per hour (normal)
- 100 messages per user per day
- Override for paid pastoral users (if a "pastor" tier emerges)
- 5 messages per IP per hour for unauthenticated requests

**Implementation:**
- Vercel KV store (Redis) for counters
- Key by Clerk user ID for authenticated; by IP+UA for unauthenticated
- 429 response on limit hit, with retry-after header

**Acceptance:** limits enforce; honest user with one phone never hits
them in normal use.

## 5.5 Per-Tab Context Awareness

**Status:** [NOT STARTED]

**Purpose:** Companion knows which tab the user is on and adjusts.

**Behavior:**
- On Gospel tab: apologetic mode (case for the faith, evidentiary
  questions, intellectual concerns)
- On Course tab: catechumenal mode (reading explanation, Day-specific
  reflection prompts)
- On Kingdom tab: daily-practice mode (today's reading, practice
  guidance, liturgical questions)
- On Field Guide: practice-specific mode (deep dive on the open
  practice)
- On Academy: theological mode (philosophy, mysticism, deeper texts)

**Implementation:**
- Frontend sends `currentTab` and `currentDay` in request context
- System prompt receives these and adjusts tone/scope
- Conversation does not break if user switches tabs mid-conversation

**Acceptance:** same question asked from different tabs returns
appropriately different responses.

## 5.6 Multilingual Support

**Status:** [NOT STARTED]

**Behavior:**
- Companion responds in user's `locale` (set in Clerk metadata or
  derived from browser)
- Catechetical vocabulary uses the standard Catholic terms of that
  language (Spanish: "la Confesión," "el Sagrado Corazón"; not English
  loan-words)
- Translation review by native Catholic speakers before launch per
  language

**Languages by phase:**
- Phase 1: English (built-in default)
- Phase 2: Spanish
- Phase 3: Portuguese, French, Polish
- Phase 4: Vietnamese, Tagalog, Italian, German
- Phase 5: Mandarin (where allowed), Arabic (where allowed), Igbo,
  Swahili

**Acceptance:** Companion in Spanish uses native Catholic vocabulary
and reads as authentically Catholic to native speakers.

## 5.7 Conversation Logging

**Status:** [NOT STARTED]

**Storage:**
- Default: not stored
- Opt-in: user grants permission per conversation OR globally
- Storage: anonymized (no name, email, IP), keyed by random session ID
- Retention: 30 days, then deleted

**Purpose of logged data:**
- Improving system prompt (catechetical quality)
- Detecting safety failures
- Multilingual translation feedback

**Implementation:**
- Frontend asks user before saving any conversation
- Logs to Vercel KV or external service (e.g., Supabase, with
  privacy-aware schema)
- Never logged: full identity, full message text without consent
- Logged with consent: full message + response, language, tab context,
  feedback rating

**Acceptance:** default is no logging; opt-in works; logs are auditable
and deletable.

## 5.8 Theological Review Process

**Status:** [NOT STARTED]

**Process:**
- All system prompt changes require theological review
- Reviewer is a Catholic with theological training (priest, theologian,
  or graduate-level Catholic studies)
- Review by GitHub PR (system prompt lives in version control)
- Major catechetical content also requires review
- Sample of 100 random Companion conversations reviewed quarterly for
  doctrinal soundness

**Acceptance:** named theological advisor in place before broad launch;
review process documented in `THEOLOGICAL_REVIEW.md`.

---

# 6. EMAIL & NOTIFICATIONS

## 6.1 Transactional Email Service

**Status:** [NOT STARTED]

**Service:** Resend
**Tier:** Free (3,000 emails/month) → Pro at $20/mo (50K emails/month)
above

**Required emails:**
- Email verification (currently sent by Clerk; switch to Resend with
  Clerk webhook trigger for branded sender)
- Welcome email (sent on first signup)
- Password reset (if password ever re-enabled)
- Email change confirmation

**Domain setup:**
- DKIM, SPF, DMARC records in Namecheap DNS
- Subdomain for sending: `mail.kingdomcourse.org`
- From-addresses:
  - `welcome@kingdomcourse.org` (signup)
  - `daily@kingdomcourse.org` (daily reading)
  - `notes@kingdomcourse.org` (milestone)
  - `hello@kingdomcourse.org` (support, also monitored inbox)

**Acceptance:** all emails arrive in inbox (not spam) on Gmail,
Outlook, Apple Mail.

## 6.2 Welcome Email Series

**Status:** [NOT STARTED]

**Sequence (triggered on signup):**
1. **Day 0:** Welcome. The Course is here. Your Day 1 is waiting.
2. **Day 1:** Today is Day 1. Open The Course tab.
3. **Day 3 (if no Day 2 completion):** Gentle nudge.
4. **Day 7:** First week reflection. Saints met. Verses encountered.
5. **Day 14:** Two weeks. The Spirit is patient.
6. **Day 21:** Half-way. The Healing week ahead.
7. **Day 30:** Day 30. The world has not seen what you are walking.
8. **Day 49:** Pentecost eve.
9. **Day 50:** Sending. The Academy is now open.
10. **Day 60 (post-Course):** The walk continues.
11. **Day 90:** Three months. Has Confession found you?
12. **Day 365:** One year in the Kingdom.

**Templates:** React Email (Resend's native template library)
**Storage:** `emails/welcome-day-N.jsx`

**Acceptance:** every email renders correctly in major email clients;
all links work.

## 6.3 Daily Reading Email

**Status:** [NOT STARTED]

**Purpose:** for users who opt in, email the day's reading and Hub
content at their chosen time (default: 6:00 AM local).

**Required fields per email:**
- Liturgical-day header (e.g., "Wednesday · Easter · Memorial of Our
  Lady of Fatima")
- Today's Day number (within Course) or "Walking in the Kingdom" (post)
- The day's reading or At-the-Altar content
- Today's saint
- One-line practice prompt
- Link to open in app

**Trigger:** Vercel Cron Job at 5:55 AM in user's timezone (per-user
scheduling)

**Implementation:**
- Cron triggers serverless function
- Function iterates users with daily email opt-in
- Per user, fetches current Day or liturgical content, renders email,
  sends via Resend

**Opt-in:** user opts in from profile settings or Day-7 welcome email
prompt

**Acceptance:** daily email arrives on schedule with correct content
for user's current Day and timezone.

## 6.4 Push Notifications (PWA)

**Status:** [NOT STARTED]

**Purpose:** for users with the site installed as PWA, send daily
formation reminders.

**Implementation:**
- Service worker (see 3.11)
- Web Push API
- User opt-in flow
- Notification content: brief, beautiful, never guilting

**Sample notification:**
> The Kingdom is at hand.
> Today's Day 7 is waiting.

**Acceptance:** notifications arrive on opt-in devices; tap opens app
to current Day.

## 6.5 Email Preferences UI

**Status:** [NOT STARTED]

**Purpose:** user controls what email they receive.

**Settings:**
- Daily reading email (default: opt-in prompt on signup)
- Milestone emails (default: on)
- Special-occasion emails (Holy Week, Easter, Pentecost, Christmas)
  (default: on)
- All emails off (default: opt-in retained)

**Storage:** Clerk `unsafeMetadata.emailPreferences`

**Acceptance:** user can change preferences; changes honored within
next send cycle.

---

# 7. RETENTION & PROGRESSION

## 7.1 Reading Progress Persistence

**Status:** [NOT STARTED]

**Purpose:** remember user's current Day across sessions and devices.

**Schema:**
- `progress.currentDay` — integer 1–50, then "academy" post-Day-50
- `progress.completedDays` — array of completed Day numbers
- `progress.streakCurrent` — current consecutive-days streak
- `progress.streakLongest` — longest historical streak
- `progress.startDate` — ISO date of signup
- `progress.lastActiveDate` — ISO date of last app open

**Storage:** Clerk `unsafeMetadata.progress` (for backup) + Vercel KV
for fast read

**Acceptance:** user opens app on phone, sees Day 7; opens on laptop,
sees Day 7; marks Day 7 complete on laptop, opens phone, sees Day 8.

## 7.2 Streak Counter

**Status:** [NOT STARTED]

**Display:** "You have walked N days in the Kingdom" on Course tab and
Hub tab.

**Logic:**
- Increment on completion of a Day reading
- Reset to 0 if user misses > 48 hours (grace for travel)
- "Walked" verb, not "streak" — pastoral framing
- Never guilt-prompt for broken streaks

**Acceptance:** count increments correctly; resets correctly; visible
on both relevant tabs.

## 7.3 Day Completion Mechanic

**Status:** [NOT STARTED]

**UI:** "Mark complete" button at end of each Day reading.

**Logic:**
- Save completion timestamp to user metadata
- Advance `currentDay` by 1 (max 50)
- Trigger Day-N+1 visibility
- If Day 50 → unlock Academy
- Show brief acknowledgment ("Day 7 complete · 43 days remain")

**Acceptance:** completion persists; next Day visible immediately.

## 7.4 Day 50 Threshold

**Status:** [NOT STARTED]

**Triggers on Day 50 completion:**
- Academy unlock (remove lock icon; enable navigation)
- "Sending" email (per 6.2)
- Recommendation modal: "What's next?" with three paths:
  1. Begin Academy Book 1
  2. Continue daily Hub walking
  3. Form a Kingdom Group (when 9.2 ships)
- Optional: prompt for sacramental self-report ("In the past 50 days,
  did you go to Mass? Did you go to Confession?")

**Acceptance:** Day 50 completion produces the full transition flow.

## 7.5 Re-Engagement Flows

**Status:** [NOT STARTED]

**For users who stop:**
- Day 3 inactive: gentle email ("The Course is still here")
- Day 7 inactive: one more email ("The Kingdom is patient. Return when
  you can.")
- Day 30 inactive: no more daily emails; one optional re-entry email
  per quarter
- Never: aggressive guilt, push spam, "we miss you" emotional manipulation

**Acceptance:** users opt-out without friction; re-entry is welcoming.

## 7.6 Pass-It-On Sharing Architecture

**Status:** [STUBBED — button exists]

**Behavior on click:**
- Modal opens with options:
  - Copy link
  - Email to a friend (mailto: with prepared subject + body)
  - Share to specific app (WhatsApp, iMessage, Signal, Telegram —
    Web Share API)
  - Print Day 1 invitation card (PDF download for parish bulletins)
- Optional: track sharing-count metric (per 10.4)
- Personalized message: "I am walking The Kingdom Course. Walk with
  me." (editable)

**Acceptance:** share works on iOS Safari, Android Chrome, desktop
browsers; copied link works.

---

# 8. PARISH BRIDGE

## 8.1 Find-a-Parish Search

**Status:** [NOT STARTED]

**Purpose:** every user can find their local parish from inside the
app.

**Implementation:**
- Search by ZIP/postal code, city, or geolocation
- Data source: Google Places API (Catholic Church type filter) OR
  scrape USCCB parishesonline.com for US / CCCB equivalent for Canada
- Display: list of parishes within 10 mi, name, address, Mass times if
  available
- Save user's selected parish to `unsafeMetadata.parishGooglePlaceId`

**UI placement:**
- Footer link "Your Parish"
- Hub block "Find your home parish" if no parish saved
- Prompt in Day-7 reading

**Acceptance:** user inputs ZIP, sees nearby Catholic parishes; selects
one; app remembers across sessions.

## 8.2 Sacramental Affordances

**Status:** [NOT STARTED]

**Visible from Hub:**
- "Find Mass times near you" (links to selected parish or search)
- "Find Confession times near you" (same)
- "Find Adoration near you" (when data available)

**Data:**
- Mass times API: masstimes.org (free, US/Canada/UK coverage) OR
  individual parish websites
- Confession times: typically requires direct parish website parsing
- Adoration: TheRealPresence.org or 1800Adoration listings

**Acceptance:** Hub shows current-day Mass options near user's
location.

## 8.3 Parish Dashboard

**Status:** [NOT STARTED]

**Audience:** priests, DREs, RCIA directors.

**Purpose:** show aggregate (privacy-preserving) participation from
parishioners using the Course.

**Required views:**
- Parish-aggregate sign-up count
- Aggregate progress distribution (% on each Day)
- Aggregate sacramental self-report (Mass, Confession frequency)
- Cohort enrollment (see 8.4)

**Privacy:**
- Never individual data
- Minimum cohort size of 10 before any data shown (avoid
  re-identification)
- Pastor must verify parish association

**Acceptance:** Father Tom can see "12 parishioners on Course, average
Day 14, 8 attending weekly Mass."

## 8.4 Cohort Enrollment

**Status:** [NOT STARTED]

**Purpose:** parish-led cohorts walk the Course together.

**Implementation:**
- Pastor/DRE creates a cohort with a code
- Users enter the code at signup or in settings
- Cohort members see (opt-in) others' progress
- Shared Companion conversation thread (group catechesis)
- Cohort leader sees full cohort dashboard

**Acceptance:** RCIA director enrolls 9 catechumens; they walk Days 1–50
together visibly.

---

# 9. MULTIPLICATION ARCHITECTURE

## 9.1 Walk-with-Friends Mode

**Status:** [NOT STARTED]

**Purpose:** small-group of 3–5 friends walk together.

**Implementation:**
- User creates a "walk" and invites by email or shareable link
- Invited friends join with one tap
- Walk members see each other's current Day
- Daily prompt: "Susan finished Day 7. Did you?"
- Optional shared journal entries (opt-in per entry)

**Acceptance:** 4 friends sign up, see each other's progress, complete
Day 50 within ~2 weeks of each other.

## 9.2 Kingdom Groups

**Status:** [NOT STARTED]

**Purpose:** post-Day-50 ongoing formation groups per Field Guide
Guide 26.

**Components:**
- Group creation flow
- Meeting agenda templates (Scripture + question + practice)
- Reading schedule (Academy chapters)
- Intercessory prayer rotation
- Recommended cadence: weekly, 90 minutes

**Acceptance:** a parish-organized Kingdom Group runs for 12 weeks with
the app's scaffolding.

## 9.3 Multiplication Tracking

**Status:** [NOT STARTED]

**Purpose:** measure spread per Master Vision Book 7.

**Tracked metrics:**
- "Souls shared with" per user (counter; updated on link share)
- "Souls who signed up via your link" (referral count)
- "Kingdom Groups you've led" (count)
- "Cohorts you've taught" (for catechists)

**Privacy:**
- All counters are personal-visible only
- Aggregated for site-wide multiplication metric
- No leaderboard, no public visibility, no shaming

**Acceptance:** Pass-It-On clicks attributed; referral signups counted.

---

# 10. ANALYTICS & MEASUREMENT

## 10.1 Plausible Analytics

**Status:** [NOT STARTED]

**Setup:**
- Plausible Cloud account, $9/mo standard plan
- Site added: `kingdomcourse.org`
- Embed script in `index.html`
- No cookie banner needed (Plausible doesn't set cookies)
- Privacy page updated to disclose Plausible

**Tracked events:**
- Page views (all routes)
- Custom events: signup-started, signup-completed, day-completed,
  share-clicked, companion-opened, academy-opened

**Acceptance:** Plausible dashboard shows real traffic; events fire
correctly.

## 10.2 Sentry Error Monitoring

**Status:** [NOT STARTED]

**Setup:**
- Sentry account (free tier: 5K errors/month, sufficient initially)
- React SDK integration
- Source maps uploaded on deploy
- Privacy: don't capture user PII; scrub Clerk session tokens

**Alerts:**
- New error type: Slack/email
- Error rate spike: Slack/email

**Acceptance:** Sentry catches a deliberately-thrown test error;
notification arrives.

## 10.3 Web Vitals

**Status:** [NOT STARTED]

**Source:** Vercel Analytics (free for Web Vitals) or Plausible Vitals.

**Tracked metrics:**
- LCP (Largest Contentful Paint) — target < 2.5s
- FID/INP (Interaction to Next Paint) — target < 200ms
- CLS (Cumulative Layout Shift) — target < 0.1
- TTFB (Time to First Byte) — target < 800ms

**Acceptance:** dashboard visible; budget violations flag for review.

## 10.4 Salvation Metrics

**Status:** [NOT STARTED]

**Purpose:** measure what matters, not what's easy.

**Core metrics:**
- **Day-50 completion rate** — of users who sign up, what % finish?
- **Multi-day return rate** — Day 2, 7, 14, 30, 50 (cohort-based)
- **Sacramental self-report** — Mass attendance, Confession frequency
  (opt-in post-Day-50)
- **Saints encountered** — per-user counter
- **Souls shared with** — per-user counter (per 9.3)
- **Kingdom Groups formed** — site-aggregate
- **Languages served** — count of unique locales used
- **Parishes connected** — count of parishes with > 1 walker

**Implementation:**
- Vercel KV for aggregate counters
- Per-user metadata for personal counters
- Internal-only dashboard (route: `/admin/metrics`, Clerk role-gated)

**Acceptance:** dashboard shows all eight metrics; updates daily.

## 10.5 Companion Quality Metrics

**Status:** [NOT STARTED]

**Tracked (with consent):**
- Average thumbs-up rate per response
- Crisis-detection trigger rate
- Per-tab usage (which tabs generate most Companion use)
- Per-locale usage
- Per-Day correlation (which Course Days produce most questions)

**Acceptance:** weekly Companion quality report available to operator.

---

# 11. ACCESSIBILITY

## 11.1 WCAG 2.2 AA Compliance

**Status:** [PARTIAL]

**Audit:**
- Run WAVE on every page
- Run axe-core on every page
- Manual keyboard-only walkthrough
- Manual screen-reader walkthrough (VoiceOver + NVDA)

**Acceptance:** zero AA violations on every page.

## 11.2 Color Contrast

**Status:** [PARTIAL — gold-on-paper marginal]

**Required:**
- Body text: ≥ 4.5:1 contrast
- Large text (≥ 18pt): ≥ 3:1
- UI components (buttons, form borders): ≥ 3:1

**Open work:**
- Audit every use of gold (`#B5883F`) for text purposes
- Darken gold or thicken weight where text-bearing
- Verify wine (`#6B1E1E`) and ink (`#0E0A06`) hold AAA

**Acceptance:** WCAG contrast checker passes for all text.

## 11.3 Focus States

**Status:** [PARTIAL]

**Required:**
- Every interactive element has visible `:focus-visible` style
- Focus ring: 2px gold offset 2px
- Focus ring color contrast: ≥ 3:1 against adjacent backgrounds

**Acceptance:** keyboard-only navigation visible at all times.

## 11.4 Reduced Motion

**Status:** [NOT STARTED]

**Required:**
- All animations wrapped in `@media (prefers-reduced-motion: reduce)`
- Animation-disabled fallbacks for: brand mark hover, modal fade-ins,
  scroll-triggered animations, Companion button pulse

**Acceptance:** macOS Reduce Motion setting disables all animation.

## 11.5 Screen Reader Support

**Status:** [PARTIAL]

**Required:**
- Semantic HTML: `<header>`, `<nav>`, `<main>`, `<footer>`, `<article>`
- ARIA roles only when semantic HTML insufficient
- Live regions for dynamic content (Companion responses, completion
  acknowledgments)
- Alt text on all images
- `aria-label` on icon buttons
- Form labels associated with inputs (not placeholder-only)
- Tab/Tablist patterns: `role="tab"`, `aria-selected`, `role="tabpanel"`

**Acceptance:** full app navigable with VoiceOver and NVDA.

## 11.6 Large-Text Mode

**Status:** [NOT STARTED]

**Required:**
- All typography uses relative units (rem, em, %)
- Browser zoom to 200% does not break layout
- Optional in-app text-size control (Small/Default/Large) for Course
  and Academy reading

**Acceptance:** 200% browser zoom usable on every page.

## 11.7 Internationalization Readiness

**Status:** [NOT STARTED]

**Required:**
- All strings externalized to a translation table (not hardcoded)
- Right-to-left layout support (for Arabic, future)
- Locale-specific date/number formatting

**Acceptance:** switching `locale` to `es` translates the entire UI.

---

# 12. SEO & DISCOVERY

## 12.1 Sitemap

**Status:** [NOT STARTED]

**File:** `public/sitemap.xml`

**Content:**
- `/` (priority 1.0)
- `/privacy` (priority 0.5)
- `/terms` (priority 0.5)
- `/academy/...` (when shipped, priority 0.8)
- `/field-guide/...` (when shipped, priority 0.7)
- `lastmod` per route based on build time

**Submit:**
- Google Search Console
- Bing Webmaster Tools

**Acceptance:** sitemap valid; submitted; indexed within 30 days.

## 12.2 Robots

**Status:** [NOT STARTED]

**File:** `public/robots.txt`

**Content:**
```
User-agent: *
Allow: /
Sitemap: https://kingdomcourse.org/sitemap.xml
```

**Acceptance:** crawlers find sitemap.

## 12.3 Structured Data

**Status:** [NOT STARTED]

**Schemas to implement:**
- `Organization` on all pages
- `WebSite` on `/`
- `EducationalOrganization` on `/` and Course pages
- `Article` on Academy chapter pages
- `HowTo` on Field Guide practice pages
- `Person` on saint pages

**Implementation:** JSON-LD in `<head>` of each page type.

**Acceptance:** Google Rich Results Test validates every schema.

## 12.4 Open Graph and Twitter Cards

**Status:** [PARTIAL]

**Current (verified):**
- `og:title`, `og:description`, `og:type`, `og:url`
- `theme-color`

**Open work:**
- `og:image` — 1200×630 brand image
- `twitter:card` — summary_large_image
- `twitter:image` — same as og:image
- Per-page overrides (Course landing, Hub, Academy chapters each get
  their own preview image)

**Acceptance:** sharing a link previews correctly on iMessage, Twitter,
WhatsApp, Signal.

## 12.5 Meta Descriptions

**Status:** [PARTIAL]

**Required per page:**
- 150–160 characters
- Specific to page content
- Inviting, not keyword-stuffed

**Acceptance:** every indexable page has a unique meta description.

## 12.6 Canonical URLs

**Status:** [NOT STARTED]

**Required:**
- `<link rel="canonical">` on every page
- For SPA routes, set via React Helmet or equivalent
- Trailing slash policy enforced (no trailing slash, per vercel.json)

**Acceptance:** duplicate-URL test (e.g., `/`, `/index.html`) does not
appear in Google Search Console as duplicate content.

## 12.7 Long-Tail Content Strategy

**Status:** [NOT STARTED]

**Strategy:** every Academy chapter and Field Guide practice is a
long-tail SEO entry.

**Implementation:**
- Clean URL per chapter: `/academy/book-1-awakening/chapter-3-the-creed`
- Clean URL per practice: `/field-guide/daily-examen`
- H1 = page title; H2 = section headings
- Internal linking between related chapters and practices

**Acceptance:** within 12 months of launch, organic search drives ≥ 30%
of new signups.

---

# 13. INTERNATIONALIZATION

## 13.1 i18n Framework

**Status:** [NOT STARTED]

**Library:** `react-i18next` or `react-intl`
**Storage:** `src/locales/[locale]/[namespace].json`
**Locale codes:** ISO 639-1 (`en`, `es`, `pt`, `fr`, `pl`, etc.)

**Required namespaces:**
- `common` (nav, buttons, modals)
- `gate` (Gospel tab)
- `course` (Course tab)
- `kingdom` (Hub)
- `fieldguide`
- `academy`
- `companion` (UI strings only — content streams from Companion API in
  user's locale)
- `legal` (privacy, terms — translated separately with legal review)

**Acceptance:** `?lang=es` switch translates entire UI; persists in
`localStorage` and Clerk metadata.

## 13.2 Spanish Translation

**Status:** [NOT STARTED]

**Translator:** Native Catholic Spanish speaker (vocabulary matters —
"la Confesión," "la Misa," "el Sagrado Corazón")

**Scope:**
- All UI strings
- All 50 Day readings
- All 22 Field Guide practices
- Privacy and Terms (with lawyer review for Mexico/Spain/Argentina
  jurisdictions if applicable)
- Companion system prompt + crisis templates in Spanish

**Theological review:** Spanish-speaking theologian/priest before
launch.

**Acceptance:** `/es/` URLs serve all content; native Spanish-speaking
Catholic confirms it reads natively.

## 13.3 Portuguese, French, Polish

**Status:** [NOT STARTED]

**Same scope as 13.2.** Theological review per language by native
Catholic speakers.

**Acceptance:** each locale serves all content natively.

## 13.4 Right-to-Left Support

**Status:** [NOT STARTED]

**Trigger:** required for Arabic (when 13.5 launches).

**Required:**
- CSS logical properties (`margin-inline-start` not `margin-left`)
- `dir="rtl"` set on `<html>` for RTL locales
- Mirror layouts where appropriate
- Bidirectional text handling in mixed-language strings

**Acceptance:** Arabic Catholic content renders correctly with RTL
layout.

## 13.5 Multilingual Companion

**Status:** [NOT STARTED — see 5.6]

**Per language:**
- System prompt translated
- Crisis-detection patterns localized
- Crisis-response templates localized
- Catechetical vocabulary lock-list localized

**Acceptance:** Spanish-speaking user asks the Companion a theological
question in Spanish, gets a native-Spanish Catholic answer.

## 13.6 Liturgical Calendar Localization

**Status:** [NOT STARTED]

**Per locale:**
- National patron feast days (e.g., Our Lady of Guadalupe — Mexico,
  St. Patrick — Ireland)
- Local saints
- Translation of feast names

**Acceptance:** Mexican user sees Our Lady of Guadalupe as a Solemnity
on Dec 12; American user sees it as an Optional Memorial.

---

# 14. SAFETY & CRISIS HANDLING

## 14.1 Crisis Resource Link

**Status:** [PARTIAL — only in Terms page]

**Required:**
- Always-visible "If you are in crisis" link in footer
- Opens a modal/page with:
  - 988 (US/Canada Suicide and Crisis Lifeline)
  - Per-locale crisis lines (Samaritans UK, Lifeline Australia, etc.)
  - Catholic Counselors directory link
  - "Call a priest" suggestion with diocesan finder
  - Brief honest message: "You are not alone. The Kingdom holds you."

**Acceptance:** crisis link visible from every page in two clicks or
fewer.

## 14.2 Companion Crisis Protocol

**Status:** [NOT STARTED — see 5.3]

## 14.3 Mental Health Pastoral Content

**Status:** [NOT STARTED]

**Required Field Guide entry:**
- "Spiritual Desolation and Clinical Depression: Distinguishing and
  Tending"
- Catholic tradition's wisdom (Therese, JP2, Ignatian discernment)
- Strong recommendation for professional help
- Explicit: this is not a substitute for therapy/psychiatry

**Acceptance:** entry exists; reviewed by Catholic counselor or
psychiatrist.

## 14.4 Spiritual Abuse Pathway

**Status:** [NOT STARTED]

**Required content:**
- Acknowledgment that some users carry church-inflicted wounds
- Clear pastoral language: "If your relationship with the Church has
  been harmed, this Course welcomes you slowly"
- Resources: SNAP (Survivors Network of those Abused by Priests),
  Catholic survivor-led organizations
- Companion training: never minimize, never blame, never pressure
  toward Confession before the user is ready

**Acceptance:** pathway exists; reviewed by survivor advocate or
trauma-informed pastor.

## 14.5 Content Reporting

**Status:** [NOT STARTED]

**Mechanism:**
- "Report this" link on every Companion response
- "Report content" link on Course Days, Field Guide entries, Academy
  chapters
- Reports go to support inbox
- 48-hour response SLA

**Acceptance:** report sent; received in inbox; triaged within 48 hours.

---

# 15. LEGAL & COMPLIANCE

## 15.1 Privacy Policy

**Status:** [BUILT — needs lawyer review]

**Open work:**
- BC-licensed lawyer review
- Update on every material change (Plausible install, Sentry install,
  user data schema additions)
- Add "Last updated" + changelog
- Re-translate for each locale

**Acceptance:** lawyer signs off.

## 15.2 Terms of Service

**Status:** [BUILT — needs lawyer review]

**Open work:**
- BC-licensed lawyer review
- Arbitration clause (or explicit decision not to include one)
- Jurisdiction-specific addenda (US users, EU users)
- Account termination process documented
- IP/copyright clause for user content

**Acceptance:** lawyer signs off.

## 15.3 GDPR Compliance (EU Users)

**Status:** [PARTIAL]

**Required:**
- Lawful basis for processing (consent + legitimate interest, documented)
- Data Processing Agreement with Clerk (in place by default)
- Data Processing Agreement with Vercel (in place by default)
- Data Processing Agreement with Anthropic (when Companion ships)
- Right to access (export user data on request)
- Right to be forgotten (delete user data on request)
- Data Protection Officer (only if > 250 EU users or sensitive data;
  defer)

**Acceptance:** GDPR self-audit passes; user-data-export flow works.

## 15.4 PIPEDA / PIPA Compliance (Canadian Users)

**Status:** [BUILT — by virtue of GDPR-equivalent practices]

**BC PIPA + federal PIPEDA covered by:**
- Privacy policy disclosure
- Consent at signup (Privacy/Terms acknowledgment per 3.7)
- Reasonable security
- Access and correction rights

**Acceptance:** lawyer confirms compliance.

## 15.5 COPPA Compliance (Children Under 13)

**Status:** [PARTIAL]

**Approach:** site is for adults. Minors under 13 are not permitted to
sign up.

**Required:**
- Age gate at signup (or clear "must be 18+" statement)
- No knowing collection of data from < 13
- Process for parental consent if a minor is identified
- Process for data deletion on parental request

**Acceptance:** age gate visible; lawyer confirms.

## 15.6 Data Export and Deletion

**Status:** [NOT STARTED]

**Required:**
- User can export all their data as JSON from settings
- User can delete account; all data purged within 30 days
- Companion conversation logs deleted with account
- Backups purged within 90 days

**Implementation:**
- Settings page with export and delete buttons
- Clerk handles user-record deletion
- Custom function purges Vercel KV data tied to user
- Email confirmation of deletion

**Acceptance:** end-to-end export and delete flows work.

## 15.7 Ecclesial Compliance (Imprimi Potest / Nihil Obstat)

**Status:** [NOT STARTED]

**Process:**
- Identify a bishop willing to grant ecclesial recognition
- Submit catechetical content for theological review
- Address any corrections
- Receive *Nihil Obstat* (nothing stands in the way)
- Receive *Imprimi Potest* (it is permitted to be printed/published)

**Acceptance:** marks displayed in footer or About page.

---

# 16. ECCLESIAL RELATIONSHIPS

## 16.1 Local Bishop / Theological Advisor

**Status:** [NOT STARTED]

**Required:**
- Named theological advisor (priest, theologian, or graduate-degree
  Catholic studies)
- Quarterly review meeting (in person or video)
- Decision authority on contested catechetical questions
- Public credit and footer mention with their consent

**Acceptance:** advisor in place; first review held.

## 16.2 Theological Review Board

**Status:** [NOT STARTED]

**Composition (at maturity):**
- Three to five members
- At least one priest
- At least one academic theologian
- At least one religious sister or brother
- At least one lay catechist
- Diverse Catholic intellectual traditions represented (Thomist,
  Carmelite, Franciscan, Ignatian)

**Acceptance:** board constituted; meeting cadence established.

## 16.3 Diocesan Partnerships

**Status:** [NOT STARTED]

**Target:** five dioceses recommending the Course as RCIA
supplementary material within 24 months.

**Process:**
- Approach each diocese's Office of Catechesis
- Provide free institutional access
- Theological review by diocesan theologians
- Co-branded materials if appropriate

**Acceptance:** five dioceses listed as partners.

## 16.4 Parish Partnerships

**Status:** [NOT STARTED]

**Target:** 100 parishes using Course in catechesis by Year 2.

**Process:**
- Parish dashboard (per 8.3) lowers friction
- Bulletin templates and Day-1 invitation cards (downloadable PDFs)
- "Parish recommendations" testimonials feature

**Acceptance:** 100 parishes registered as cohort organizers.

## 16.5 Religious Community Partnerships

**Status:** [NOT STARTED]

**Target:** ten religious orders using Course in initial formation by
Year 3.

**Process:**
- Direct outreach to vocation directors
- Free institutional access
- Formator dashboard (similar to parish dashboard, smaller scale)

**Acceptance:** ten orders listed as partners.

---

# 17. CONTENT GOVERNANCE

## 17.1 Editorial Process

**Status:** [NOT STARTED]

**Required:**
- Style guide (extends Voice and Tone Guide from Pass 7)
- Theological review for catechetical content
- Copy-editing pass before publication
- Version control in Git
- Changelog per published piece

**Acceptance:** documented process; first review cycle completed.

## 17.2 Content Versioning

**Status:** [NOT STARTED]

**Schema per content item:**
- Slug
- Title
- Current version number
- Last updated date
- Theological reviewer
- Copy editor
- Changelog

**Acceptance:** every Day reading, Field Guide entry, Academy chapter
has visible version metadata internally.

## 17.3 Companion Training Updates

**Status:** [NOT STARTED]

**Cadence:** monthly review of:
- 100 random Companion conversations (with consent)
- Crisis-detection accuracy
- Catechetical correctness
- Voice consistency

**Output:** system prompt update PR, theological review, deploy.

**Acceptance:** monthly review meeting; documented improvements.

## 17.4 Translation Review

**Status:** [NOT STARTED]

**Per language:**
- Native-speaker theologian/catechist reviews translations
- Sample 10 random Companion conversations per language quarterly
- User feedback channel per language

**Acceptance:** quarterly review for each active language.

---

# 18. OPERATIONS

## 18.1 Support Email

**Status:** [NOT STARTED]

**Setup:**
- `hello@kingdomcourse.org` (general)
- `support@kingdomcourse.org` (technical issues)
- `theological@kingdomcourse.org` (catechetical questions)
- `press@kingdomcourse.org` (media)
- All routed to monitored inbox (Gmail or equivalent)

**Acceptance:** test message arrives in inbox within 5 minutes.

## 18.2 Support Workflow

**Status:** [NOT STARTED]

**Response SLAs:**
- General questions: 48 hours
- Technical bugs: 24 hours
- Crisis indications: immediate (escalation to operator + advisor)
- Theological questions: 7 days (allow advisor review)

**Tooling:**
- Inbox triage (Gmail or Help Scout when volume justifies)
- Common-question response templates
- Bug intake → GitHub issue

**Acceptance:** queue managed within SLA; bug intake produces clean
GitHub issues.

## 18.3 Bug Triage

**Status:** [PARTIAL]

**Process:**
- Bugs filed as GitHub issues
- Labels: `bug`, `severity-critical/high/medium/low`, `area-X`
- Critical = breaks core flow (signup, Day reading, Hub render)
- High = breaks important feature for some users
- Medium = visual or non-blocking issue
- Low = nice-to-fix

**Acceptance:** all production bugs filed; critical fixed within 48
hours.

## 18.4 Content Update Workflow

**Status:** [NOT STARTED]

**Process:**
- Content stored in `src/data/` (or migrated to CMS at scale)
- Updates via Git PR
- Theological review for catechetical updates
- Deploy after approval

**Acceptance:** documented; first content update through workflow.

## 18.5 Feedback Loop

**Status:** [NOT STARTED]

**Channels:**
- In-app feedback form (settings page)
- Companion thumbs-up/down
- Email replies
- Optional post-Day-50 survey

**Triage:**
- Weekly review of feedback
- Categorize: bug, feature request, content issue, theological,
  pastoral
- Patterns inform roadmap

**Acceptance:** weekly feedback review held; aggregated themes
documented.

---

# 19. FUNDING & SUSTAINABILITY

## 19.1 Free-Forever Commitment

**Status:** [LOCKED — canonical decision]

**Implications:**
- No paywall
- No premium tier
- No advertising
- No data sale
- All formation content free to every user worldwide

## 19.2 Donation Infrastructure

**Status:** [NOT STARTED]

**Setup:**
- Stripe Donations (or Donorbox, Givebutter — Catholic-friendly)
- Recurring + one-time options
- $5 / $25 / $100 / $500 / custom amounts
- No login required to donate
- Optional: anonymous donations
- Tax-receipt automated for 501(c)(3) or Canadian charitable status

**Page:** `/support` or `/donate` (decide naming)

**Acceptance:** test donation processes; receipt generated.

## 19.3 Charitable Entity

**Status:** [NOT STARTED]

**Options:**
- Canadian charitable status (CRA registration) — recommended for BC
  operator
- US 501(c)(3) if US donations are a meaningful source
- Cross-border partnership (Canadian charity + US fiscal sponsor)

**Required for charitable status:**
- Articles of incorporation
- Board of directors (minimum 3 in Canada)
- Charitable purposes statement
- Annual returns

**Acceptance:** registered charity; can issue tax receipts.

## 19.4 Major Donor Strategy

**Status:** [NOT STARTED]

**Approach:**
- Personal cultivation, not mass outreach
- Catholic philanthropic networks: Lumen Christi, Napa Institute,
  Knights of Columbus
- One-page case for support
- Annual donor report (private)

**Acceptance:** first major donor relationship in place.

## 19.5 Grants

**Status:** [NOT STARTED]

**Target sources:**
- Our Sunday Visitor Institute
- Knights of Columbus
- Lilly Endowment (broader Christian)
- Templeton Religion Trust
- Diocesan grants (rare but real)

**Process:**
- Identify grants annually
- Apply with concrete metrics
- Steward awarded grants per terms

**Acceptance:** at least one grant secured by Year 2.

## 19.6 Sustainability Budget

**Status:** [NOT STARTED]

**Annual fixed costs (estimated, USD):**
- Vercel: $20–240 (free tier through scale; Pro at $20/mo per seat)
- Clerk: $0–600 (free tier through 10K MAU; Pro at $25/mo)
- Resend: $0–240 (free tier; Pro at $20/mo)
- Plausible: $108 ($9/mo)
- Sentry: $0 (free tier)
- Anthropic API (Companion): $500–50,000 depending on usage
- Domain renewal: $15
- Email (Google Workspace): $72 ($6/mo)
- Storage/CDN (audio): $0–1,200
- Translation services: variable

**Total at modest scale:** $1,500–60,000/year, dominated by Companion
API costs at scale.

**Acceptance:** budget documented; annual review.

---

# 20. ORGANIZATION

## 20.1 Solo Operator Phase

**Status:** [CURRENT]

**Operator (Aaron) handles:**
- Code (with Claude Code)
- Content (with Claude assistance, with theological review)
- Operations
- Support

**Acceptance:** site runs sustainably with one operator + tools.

## 20.2 First Hires / Volunteers

**Status:** [NOT STARTED]

**Priority order:**
1. Theological advisor (volunteer or stipend)
2. Translation volunteers (Spanish first)
3. Voice talent (volunteer or paid for audio recordings)
4. Designer (part-time or contract for new surfaces)
5. Developer (when operator's capacity is exceeded)

**Acceptance:** at least one theological advisor and one translator in
place before broad multilingual launch.

## 20.3 Board / Advisory

**Status:** [NOT STARTED]

**Composition (charitable status will require this):**
- 3+ members in Canada (legal minimum)
- Mix of: theological expertise, fundraising, operations,
  pastoral/clergy

**Acceptance:** named board with documented meetings.

## 20.4 Volunteer Coordination

**Status:** [NOT STARTED]

**Approach:**
- Public call for translators, voice talent, theological reviewers
- Clear scopes per volunteer role
- Recognition (footer credits, optional)
- No exploitation: meaningful work, reasonable scope

**Acceptance:** volunteer roster with active contributors.

## 20.5 Succession Plan

**Status:** [NOT STARTED]

**Required documents:**
- CLAUDE.md (per project root) — code-level handoff
- PHASE_N_HANDOFF.md — operational handoff
- ARCHITECTURE.md — system-level documentation
- CONTACTS.md — relationships (advisors, donors, partners)
- LEGAL.md — entity, registrations, accounts
- All stored in repo + secure off-repo backup

**Acceptance:** in event of operator unavailability, named successor
can continue.

---

# APPENDIX A — DEPENDENCY-ORDERED BUILD SEQUENCE

This is the order to execute in. Each batch can be parallelized
internally; batches must complete in order.

## Batch A — Pre-Launch Polish (current)

1. Mobile smoke test
2. Verify all polish commits pushed (privacy/terms/footer/meta)
3. Set real `hello@kingdomcourse.org` inbox

## Batch B — Tier 1 Foundation

4. Custom 404 (1.6)
5. Crisis-resource link in footer (14.1)
6. Find-a-parish search (8.1)
7. Privacy/Terms acknowledgment in SignupModal (3.7)
8. "In one sentence" field rename (3.7)
9. Gate Hero CTA (3.2)
10. Voice and Tone Guide (referenced in 3.x)
11. Contrast audit and fixes (11.2)
12. Focus states (11.3)
13. Reduced motion (11.4)
14. Sitemap + robots + structured data (12.1–12.3)
15. Open Graph image (12.4)
16. Sentry install (10.2)
17. Plausible install + privacy update (10.1)

## Batch C — Pre-Broad-Launch Legal & Production

18. BC lawyer review of Privacy and Terms (15.1, 15.2)
19. Production Clerk keys (2.1)
20. `welcome@kingdomcourse.org` verification email (6.1)
21. Email DNS records (DKIM/SPF/DMARC)
22. Day 1 catechetical review (4.1, 5.8)
23. Data export and deletion flow (15.6)
24. Age gate (15.5)

## Batch D — Day-by-Day Engagement

25. Reading progress persistence (7.1)
26. Day completion mechanic (7.3)
27. Streak counter (7.2)
28. Day 50 threshold flow (7.4)
29. Re-engagement flows (7.5)
30. Welcome email series (6.2)
31. Daily reading email + cron (6.3)
32. Email preferences UI (6.5)
33. Pass-It-On share architecture (7.6)

## Batch E — Companion (Highest Risk, Highest Value)

34. Companion API endpoint (5.1)
35. System prompt v1 (5.2)
36. Crisis-detection (5.3)
37. Rate limiting (5.4)
38. Per-tab context (5.5)
39. Theological review process (5.8)
40. Replace Companion stub with live integration (3.8)

## Batch F — Multiplication & Parish

41. Parish dashboard (8.3)
42. Cohort enrollment (8.4)
43. Sacramental affordances (8.2)
44. Walk-with-friends (9.1)
45. Multiplication tracking (9.3)
46. Salvation metrics dashboard (10.4)

## Batch G — Academy

47. Academy reader UI (3.6)
48. Migrate Books 1–7 content (4.3)
49. Per-chapter URLs and SEO (12.7)
50. Day-50 → Academy unlock wired (7.4)

## Batch H — Audio

51. Voice talent identified
52. Recording for Day 1–50 (4.8)
53. Audio player integration (3.3)
54. CDN delivery

## Batch I — Internationalization (Spanish First)

55. i18n framework (13.1)
56. Spanish translation of UI (13.2)
57. Spanish translation of Day readings (13.2)
58. Spanish theological review
59. Companion multilingual (5.6, 13.5)
60. Spanish liturgical calendar localization (13.6)

## Batch J — Additional Languages

61. Portuguese (13.3)
62. French (13.3)
63. Polish (13.3)

## Batch K — Kingdom Groups & Movements

64. Kingdom Groups feature (9.2)
65. Diocesan partnerships (16.3)
66. Religious community partnerships (16.5)

## Batch L — Ecclesial Recognition

67. Theological advisor (16.1)
68. Theological review board (16.2)
69. *Nihil Obstat* / *Imprimi Potest* process (15.7)

## Batch M — Long-Arc Languages

70. Vietnamese
71. Tagalog
72. Italian, German, Dutch
73. Mandarin (where allowed)
74. Arabic (where allowed)
75. Igbo, Swahili, other African languages

## Batch N — Organizational Sustainability

76. Charitable entity registration (19.3)
77. Donation infrastructure (19.2)
78. Major donor strategy (19.4)
79. Board of directors (20.3)
80. Succession plan (20.5)

---

# APPENDIX B — EXTERNAL SERVICES INVENTORY

| Service | Purpose | Cost | Status |
|---|---|---|---|
| Vercel | Hosting | $0–240/yr | Built |
| Namecheap | Domain | $15/yr | Built |
| Clerk | Auth | $0–600/yr | Built (dev) |
| Google Cloud | OAuth | $0 | Built |
| Anthropic API | Companion | $500–50K/yr | Not started |
| Resend | Email | $0–240/yr | Not started |
| Plausible | Analytics | $108/yr | Not started |
| Sentry | Errors | $0 | Not started |
| Google Workspace | Email inbox | $72/yr | Not started |
| Stripe / Donorbox | Donations | 2.9% + 30¢/txn | Not started |
| Google Places API | Parish search | $0–$200/yr | Not started |
| Masstimes.org | Mass times | Free | Not started |
| Universalis | Lectionary | $60/yr | Not started |
| Bunny.net (or Vercel) | Audio CDN | $0–1.2K/yr | Not started |
| Apple Developer Program | Apple OAuth | $99/yr | Not started |

---

# APPENDIX C — ENVIRONMENT VARIABLES INVENTORY

| Variable | Scope | Sensitive | Used In |
|---|---|---|---|
| `VITE_CLERK_PUBLISHABLE_KEY` | Frontend | No | `main.jsx` |
| `CLERK_SECRET_KEY` | Backend | Yes | Companion API |
| `ANTHROPIC_API_KEY` | Backend | Yes | Companion API |
| `RESEND_API_KEY` | Backend | Yes | Email functions |
| `PLAUSIBLE_DOMAIN` | Frontend | No | Analytics |
| `SENTRY_DSN` | Both | No | Error capture |
| `GOOGLE_PLACES_API_KEY` | Backend | Yes | Parish search |
| `UNIVERSALIS_API_KEY` | Backend | Yes | Lectionary |
| `KV_REST_API_URL` | Backend | No | Vercel KV |
| `KV_REST_API_TOKEN` | Backend | Yes | Vercel KV |

All sensitive vars stored in Vercel Environment Variables with
"Sensitive" flag enabled. Never committed to git.

---

# APPENDIX D — FILE / CODE INVENTORY

## Currently shipped

```
/
├── index.html
├── vercel.json
├── package.json
├── vite.config.js
├── public/
│   ├── manifest.webmanifest
│   ├── favicon.svg
│   ├── apple-touch-icon.png
│   ├── icon-192.png
│   ├── icon-512.png
│   ├── icon-maskable-512.png
│   ├── privacy.html
│   └── terms.html
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── components/
│   │   ├── KingdomTabNav.jsx
│   │   ├── Hero.jsx
│   │   ├── CourseHero.jsx
│   │   ├── HubHero.jsx
│   │   ├── Footer.jsx
│   │   ├── Companion.jsx (stubbed)
│   │   ├── Bridge.jsx
│   │   ├── Circles.jsx
│   │   └── KingdomHubView.jsx
│   ├── modals/
│   │   ├── SignupModal.jsx
│   │   ├── VerifyEmailModal.jsx
│   │   ├── DailyExamen.jsx
│   │   ├── LectioDivina.jsx
│   │   └── HousesQuiz.jsx
│   ├── data/
│   │   ├── liturgical.js
│   │   ├── saints.js
│   │   ├── quiz.js
│   │   └── course.js (partial)
│   └── styles/
│       └── index.css
└── CLAUDE.md (new)
```

## To be built (top-level)

```
/
├── api/
│   ├── companion.js
│   ├── companion/
│   │   ├── system-prompt.js
│   │   └── crisis-templates/
│   ├── send-daily-email.js
│   ├── parish-search.js
│   └── export-user-data.js
├── public/
│   ├── 404.html
│   ├── sitemap.xml
│   ├── robots.txt
│   └── audio/
│       └── day-NN.mp3
├── src/
│   ├── components/
│   │   ├── AcademyReader.jsx
│   │   ├── FieldGuideIndex.jsx
│   │   ├── ParishFinder.jsx
│   │   ├── StreakCounter.jsx
│   │   ├── ProgressBar.jsx
│   │   ├── CrisisLink.jsx
│   │   ├── PWAInstallPrompt.jsx
│   │   └── LocaleSwitcher.jsx
│   ├── modals/
│   │   ├── ShareModal.jsx (Pass it on)
│   │   ├── DayCompletionModal.jsx
│   │   ├── Day50Modal.jsx
│   │   ├── CrisisModal.jsx
│   │   ├── ReportContentModal.jsx
│   │   └── (22 Field Guide practice modals)
│   ├── data/
│   │   ├── course/dayN.js (50 files)
│   │   ├── academy/book[1-7]/chapter[N].js
│   │   ├── fieldGuide/[slug].js (22 files)
│   │   ├── miracles/circle[N].js (9 files)
│   │   └── houses.js
│   ├── locales/
│   │   ├── en/[namespace].json
│   │   ├── es/[namespace].json
│   │   └── (others as added)
│   └── lib/
│       ├── liturgical.js (expanded)
│       ├── progress.js
│       ├── streak.js
│       ├── i18n.js
│       └── analytics.js
├── emails/
│   ├── welcome-day-0.jsx
│   ├── welcome-day-1.jsx
│   ├── daily-reading.jsx
│   └── milestone-day-N.jsx (for 7, 14, 30, 50, 90, 365)
└── docs/
    ├── ARCHITECTURE.md
    ├── CONTRIBUTING.md
    ├── THEOLOGICAL_REVIEW.md
    ├── PHASE_N_HANDOFF.md
    ├── CONTACTS.md
    └── LEGAL.md
```

---

# APPENDIX E — DATA SCHEMAS

## User (in Clerk)

```typescript
interface User {
  id: string;                  // Clerk-generated
  firstName: string;
  email: string;
  imageUrl?: string;
  unsafeMetadata: {
    startingFrom?: string;       // Free-text from signup
    signupDate: string;          // ISO date
    preferredHouse?: 'light' | 'fire' | 'peace' | 'glory' | 'benedict';
    locale: string;              // 'en' | 'es' | 'pt' | 'fr' | 'pl' | ...
    parishGooglePlaceId?: string;
    progress: {
      currentDay: number;        // 1-50, then "academy"
      completedDays: number[];
      streakCurrent: number;
      streakLongest: number;
      lastActiveDate: string;    // ISO date
    };
    emailPreferences: {
      daily: boolean;
      milestones: boolean;
      special: boolean;
    };
    sacramentalSelfReport?: {
      massFrequency: 'weekly' | 'monthly' | 'rarely' | 'never';
      confessionFrequency: 'monthly' | 'quarterly' | 'annually' | 'rarely';
      lastUpdated: string;
    };
    sharingCount: number;
  };
}
```

## Companion Conversation (in Vercel KV, opt-in)

```typescript
interface Conversation {
  sessionId: string;           // Random UUID, not user-tied
  locale: string;
  startedAt: string;
  endedAt?: string;
  context: {
    tab: 'gate' | 'course' | 'kingdom' | 'fieldguide' | 'academy';
    day?: number;
    house?: string;
  };
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  }>;
  feedback?: 'positive' | 'negative';
  crisisFlagged?: boolean;
}
```

## Cohort (in Vercel KV)

```typescript
interface Cohort {
  id: string;                  // Random UUID
  code: string;                // Human-readable, e.g., "ST-MARY-RCIA-2026"
  parishGooglePlaceId?: string;
  leaderId: string;            // Clerk user ID
  memberIds: string[];         // Clerk user IDs
  createdAt: string;
  startDate: string;           // First day all members agreed to begin
  visibility: 'public' | 'private';
}
```

---

# APPENDIX F — ACCEPTANCE CRITERIA SUMMARY

A single user (a hypothetical complete-product user) should be able to,
in order:

1. Find kingdomcourse.org via search or referral
2. Read the Gate Hero in their language
3. Sign up via Google or email in under 60 seconds
4. Land on Course tab with personalized greeting
5. Read Day 1 reading (text or audio)
6. Mark Day 1 complete
7. Receive a Day 2 email at chosen time
8. Open app to Day 2; streak counter shows "You have walked 2 days"
9. Use Companion to ask a question about the day's reading
10. Find their local parish via in-app search
11. See current Mass times at their parish
12. Continue Day 3 through Day 50
13. Day 50: receive Sending email; Academy unlocks
14. Read Book 1 of Academy
15. Form a Kingdom Group with 4 friends
16. Pass the link to 10 friends
17. Update privacy settings (data export, deletion)
18. Switch language and continue in Spanish
19. If in crisis, find help link from any page in two clicks

Each of these is a green test in an end-to-end suite. When all 19 pass
across all supported languages, the product matches the Master Vision.

---

*Salus animarum suprema lex.*
