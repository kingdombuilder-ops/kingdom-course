# THE KINGDOM COURSE — STRATEGIC ARCHITECTURE

**Version 2.0 (FINAL) · 17 May 2026**

*Companion to `THE_KINGDOM_COURSE_MASTER_SPECIFICATION.md`. Operational
guidance. Imperative voice. No vision commentary. Implementation only.*

---

## Document scope

This document governs *how* the spec is built. The Master Spec
governs *what* is built. Cross-references to Master Spec items are
given as MS-Section.x.

Read this first. Read the Master Spec second.

## v2.0 changes from v1.0

- New Part II: Trust and Aesthetic Architecture for AI-Built Content
- New Part VIII: Sequencing Doctrine (text-first build order)
- MCP server demoted from Surface 2 to Surface 7
- SEO question-page library elevated to Surface 2 (was implicit only)
- Build order in Appendix A revised to match

---

# PART I — ORTHODOXY-AT-AI-SPEED MODEL

Six features. All required. No subset is sufficient.

## 1.1 Citation-based authority

- Every theological statement carries at least one citation:
  CCC § / Scripture book chapter:verse / conciliar document /
  encyclical / Doctor of the Church / Magisterial source
- Citations visible to the reader, not hidden in metadata
- Format consistent across surfaces: *"(CCC §1213)"*, *"(John 3:16)"*,
  *"(Lumen Gentium §40)"*
- Companion system prompt instructs citation on every claim

**Cross-refs:** MS-4.x, MS-5.2, MS-17.1

## 1.2 Transparent AI disclosure

- Standard footer on every AI-assisted surface: *"This content was
  prepared with AI assistance, grounded in the Catechism and Sacred
  Tradition. AI can make mistakes. Verify what matters; consult your
  priest; read the cited sources."*
- About page section explaining methodology
- Companion session preamble: *"I'm an AI guide. I cite my sources.
  For sacramental or pastoral decisions, talk to a priest."*

**Cross-refs:** MS-3.x, MS-5.2, MS-15.x

## 1.3 Theological advisory structure

**Initial composition (3):** 1 priest or religious, 1 academic
theologian, 1 lay catechist/formator. All publicly named with
consent.

**Mature composition (5-7):** add tradition diversity (Thomist,
Carmelite, Franciscan, Ignatian, ressourcement) and language
diversity.

**Cadence:** quarterly. 90-minute meeting. Annual in-person if
feasible.

**Sample per quarter:**
- 50 Companion conversations (consent-aware, anonymized)
- 5 Day readings
- 1 Field Guide entry
- 1 Academy chapter (book on rotation)

**Authority:**
- Does not gate publication
- Flags issues; operator addresses within 30 days
- May publicly withdraw endorsement — this is the structural backstop
- All feedback in `THEOLOGICAL_REVIEW_YYYY_QN.md`, git-versioned

**Compensation:** $200-500/quarter honorarium or volunteer.

**Cross-refs:** MS-5.8, MS-16.1, MS-16.2, MS-17.1

## 1.4 Ecclesial integration via Director-of-Evangelization role

- Accept Diocese of Victoria Director of Evangelization and Faith
  Formation appointment if offered (or analogous role in another
  diocese)
- Project operates as a tool used in the exercise of the role, not
  free-standing lay ministry
- Bishop is informed quarterly; not asked to pre-approve content
- Public byline on all materials: *"Aaron [Surname], Director of
  Evangelization and Faith Formation, Diocese of Victoria"*
- Written agreement: project remains operationally independent;
  bishop informed; project does not represent diocese as official
  ministry unless explicitly designated

**Fallback if role does not materialize:** seek equivalent appointment
in another diocese, religious order, or established apostolate with
ecclesial standing.

**Cross-refs:** MS-16.1, MS-16.3, MS-19.3

## 1.5 No personality cult

- No founder bio in chrome
- No "founder's perspective" content
- Operator named only in: About page (with role), Director byline,
  press/contact
- Voice is liturgical and institutional, not personal
- Video defaults to voice-over or animation; no founder-on-camera

**Cross-refs:** MS-3.x, MS-20.5

## 1.6 Engineered citation verification

**Three layers, all required.**

### Layer 1 — Reference databases (sources of truth)
- Full CCC, structured by paragraph number
- Full Sacred Scripture (NABRE + RSV-CE + Douay-Rheims)
- Conciliar documents (Vatican II especially), structured by
  document/paragraph
- Major encyclicals (Leo XIII through Francis)
- Doctors of the Church (verified translations)
- Saint quotation database (verified sources only — no Wikipedia,
  no unverified anthologies)
- Stored as JSON in repo (Phase 1); Postgres at scale (Phase 2)

### Layer 2 — Automated verification
- Citation extraction via regex + Claude classification
- Lookup against Layer 1 databases
- Semantic similarity check: does cited text actually say what
  surrounding context claims?
- Confidence threshold; below threshold flags for human review
- Runs on every piece of generated content before publication
- Runs on Companion responses before delivery (lighter — automated only)

### Layer 3 — Human editorial pass
- All Day readings, Field Guide entries, Academy chapters reviewed
  before publication
- Manual spot-check of 20% of citations
- Companion responses sampled (per 1.3), not per-response reviewed

**Implementation priority:** build before Companion ships.

**Cross-refs:** MS-4.x, MS-5.2, MS-17.1, MS-17.3

---

# PART II — TRUST AND AESTHETIC ARCHITECTURE FOR AI-BUILT CONTENT

## 2.1 The iconographic frame

**Principle:** AI-generated catechetical content operates in the
iconographic tradition. Stylized, openly non-photorealistic, pointing
beyond itself to the truth transmitted. Not deepfake. Not naturalism.
Window, not photograph.

**Implementation consequence:** every aesthetic decision below
defaults to stylized/symbolic over photorealistic/literal.

## 2.2 Voice strategy

- **One consistent Kingdom Course voice** via ElevenLabs Multilingual
  v2. Warm. Clearly synthetic. Never named, never given a personality
- Voice does not pretend to be priest, religious, or specific person
- **Special-occasion human voices** with explicit consent: real priest
  reading Confession guide, named religious reading their charism's
  practices. Disclosed: *"Read by Fr. [Name], pastor at [Parish]"*
- **Multilingual:** same voice profile across 30+ languages via
  ElevenLabs Multilingual v2
- **About-page disclosure:** *"The Course is read by an AI voice
  trained on consented voice profiles, used here to make daily
  formation available in any language at no cost."*

**Cross-refs:** MS-4.8, MS-2.10 (i18n audio)

## 2.3 Visual strategy

- **No AI-generated photorealistic human faces** in regular content
- **Stylized illustration is primary visual language.** Defined brand
  illustration style; references: Daniel Mitsui woodcut sensibility,
  Mary Fleeson contemporary Catholic illustration, Eric Gill
  late-Romantic Catholic illustrative tradition
- **Saint imagery:** prefer existing public-domain art (Catholic
  tradition holds thousands of works). Where AI generated, stylized
  and identifiably non-photographic
- **Symbolic/typographic visuals** are the safest and brand-aligned.
  Paper, gold rules, concentric circles, sacred typography — extend
- **Motion graphics over photorealistic video** where possible:
  Ken Burns over still illustrations, animated typography, particle
  and light effects

**Cross-refs:** MS-3.x (brand voice), MS-22 (YouTube)

## 2.4 Video strategy

**Permitted:**
- Atmospheric/environmental video via Veo 3.1, Seedance 2.0, Sora 2.
  Cathedral interiors. Candle light. Ocean horizons. Snow on a chapel
  roof. The Shroud in slow motion. Eucharistic monstrance from below.
  No faces required
- Animated illustration in motion. Frame-by-frame or generative
  animation of stylized saint scenes, parables, sacred geometry
- **Disclosed AI translation** of real recorded video via HeyGen:
  real priest records once in English; AI translates to 20 languages
  with lip-sync; every translated version labeled *"Translated from
  the original English recording by AI"*

**Forbidden:**
- AI talking-head avatars as primary voice of the project
- AI-generated face or body of Jesus Christ in any context. Use
  existing artwork (Shroud, icons, Pantocrator tradition,
  contemporary Catholic art) for visual reference to the Lord
- AI-generated face of Mary in apparition-style imagery (Guadalupe,
  Lourdes, Fatima). Existing artwork preferred
- AI representation of named real living people without explicit
  consent

**Disclosure:** every video carries footer or end-card: *"Visuals
generated with AI under human direction. Theological content
reviewed."*

**Cross-refs:** MS-22, MS-24

## 2.5 Text strategy

- Catechetical content passes through editorial pass + citation
  verification (per 1.6) + theological sampling (per 1.3)
- **Catholic vocabulary lock-list** enforced by system prompt and
  post-generation lint pass. Forbidden phrasings: "personal
  relationship with Jesus" as primary framing, "service" instead of
  "Mass," "saved" as one-time decision, "fellowship" as primary
  community term, "preacher" instead of "priest" in normal usage
- Locale-specific vocabulary lock-lists per language (Spanish:
  "Confesión," "Eucaristía," "Sagrado Corazón"; etc.)

**Cross-refs:** MS-4.x, MS-5.2

## 2.6 Hard lines (publish on Methodology page)

Publish these. Public commitment is the trust-building mechanism.

1. The face of Jesus Christ is never AI-generated. Existing Catholic
   artistic tradition is used when visual reference to the Lord is
   needed
2. AI never speaks *as* a saint. No first-person voice of named
   saints. Quotation with verified citation only
3. AI never performs or simulates sacraments. No AI absolution,
   blessing, consecration, marriage, ordination, or any sacramental
   act
4. AI never claims pastoral or spiritual authority of its own. The
   Companion refers users to: priest for Confession, spiritual
   director for direction, mental-health professional for crisis
5. AI never represents real living Catholics without explicit consent.
   No deepfakes, impersonations, "what Bishop X would say" simulations
6. AI-generated content is always versioned and correctable

**Implementation:** static page at `/methodology` (or `/how-this-works`)
linked from footer and About. Permanent. Each line internally linked
to its enforcement mechanism in code or process.

## 2.7 The methodology mark

**Visual badge appearing on every consumer-facing surface:**

> **AI-presented · Magisterium-grounded · Citation-verified ·
> Theologically reviewed**

Or shorter Latin formulation:

> **Per machinas, per Magisterium**
> *Through machines, through the Magisterium*

**Placement:** small, persistent, footer or near footer on every page.
Linked to `/methodology`.

**Acceptance:** mark visible from every page in one tap; clicking
loads full methodology page; methodology page reflects current state
of policies and processes.

---

# PART III — DISTRIBUTION ARCHITECTURE

**Principle:** one content backbone, multiple distribution surfaces.
Each surface queries the backbone via internal API.

## 3.1 Content backbone

- Content as structured JSON (Phase 1) or headless CMS (Phase 2+)
- Stable URLs/IDs across surfaces
- Internal API with consistent schema
- Git-tracked versioning (Phase 1); CMS-tracked (Phase 2+)

**Endpoints:**
```
GET  /api/days/:N              → Day N content
GET  /api/days                 → All Days
GET  /api/field-guide/:slug    → Practice content
GET  /api/field-guide          → All practices
GET  /api/academy/:book        → Book metadata + chapters
GET  /api/academy/:book/:ch    → Chapter content
GET  /api/saints/:slug         → Saint biography
GET  /api/saints?date=YYYY-MM-DD → Saints for date
GET  /api/liturgical/:date     → Liturgical day data
GET  /api/miracles/:circle     → Nine Circles content
GET  /api/qa/:slug             → SEO question-page content
POST /api/companion            → Companion (auth)
```

**Migration:** Phase 1 (current) JSON files → Phase 2 (Y1) Vercel
API routes → Phase 3 (Y2) Sanity or Strapi → Phase 4 (Y3+) public
documented API.

**Cross-refs:** MS-4.x, MS-17.x

## 3.2 Surface 1 — Web/PWA (formation home)

**Status:** [BUILT — core]

**Role:** primary home for the fifty-day catechumenate

**Requirements:** all MS-3.x components

## 3.3 Surface 2 — SEO question-page library (NEW; PRIORITY)

**Status:** [NOT STARTED — high priority]

**Role:** primary seeker-acquisition channel. Long-form text pages
optimized for the questions seekers actually search.

**Target query types:**
- "Does God exist?"
- "Why am I here?"
- "Is the Bible true?"
- "What does the Catholic Church teach about [topic]?"
- "How do I start Catholic spiritual formation?"
- "Why do Catholics pray to Mary?"
- "What is Confession really?"
- "Does the Eucharist actually become Jesus?"
- "Why does God allow suffering?"
- "How do I know if I'm in a state of grace?"
- "What is the Examen?"
- "How do I pray the Rosary?"

**Content requirements per page:**
- 1,500-3,500 words
- Direct, plain-language answer in first 200 words
- Citation-dense (per 1.1)
- Theological review before publication (per 1.3)
- AI disclosure (per 1.2)
- CTA at end: read more / begin the Course / Find a parish
- Schema.org `Article` + `FAQPage` markup
- Open Graph image custom per topic
- Internal linking between related pages
- Average 5-15 internal links per page

**URL structure:** `/answers/[slug]` (clean, indexable)

**Production:**
- AI first-draft via Claude Opus 4.7 with source materials (CCC,
  Scripture, Master Vision books) provided in context
- Citation verification (per 1.6)
- Editorial pass
- Theological review (sampled per quarter)
- Publish

**Volume targets:**
- Year 1 Q3: 50 pages live
- Year 1 Q4: 150 pages live
- Year 2: 500+ pages live
- Year 3: 1,500+ pages live across all languages

**Distribution:**
- Submitted to Google Search Console
- Indexed within 30 days of publication
- Promoted in Catholic developer communities, parish IT networks

**Acceptance:**
- Top-10 Google rankings for 5+ target queries within 6 months
- 50+ daily organic-search arrivals within 12 months
- Linked from Catholic Wikipedia / authority sites within 18 months

**Cross-refs:** MS-12.7 (long-tail content strategy — expand and
elevate)

## 3.4 Surface 3 — Daily audio podcast

**Status:** [NOT STARTED]

**Role:** daily formation companion (Bible-in-a-Year structural
pattern)

**Format:**
- 50 episodes per "season" (one per Day)
- Each 15-25 minutes
- Contents: liturgical-day greeting, Day reading (read aloud), brief
  reflection, one short prayer, closing
- AI voice (ElevenLabs Multilingual v2) primary
- Optional human readers for special episodes (priest, religious,
  bishop)

**Seasons per year:**
- Spring — Ash Wednesday to Pentecost (canonical fifty days)
- Summer — June through July
- Fall — September through October
- Advent-Christmas — Advent 1 to Epiphany

**Distribution:**
- Hosted on Transistor, Buzzsprout, or self-hosted
- Apple Podcasts, Spotify, Amazon Music, Google Podcasts, Overcast,
  Pocket Casts
- RSS at `feeds.kingdomcourse.org`
- Embedded player in web app

**Production:**
- Descript or equivalent for editing
- Licensed brand-aligned music, used sparingly
- AI voice cost: ~$22-99/month ElevenLabs
- Editing: ~2-4 hours per episode after AI generation

**Acceptance:**
- Season 1 (50 episodes) published
- Available on 4+ major podcast platforms
- 1,000+ subscribers within 90 days of Season 1 launch

**Cross-refs:** MS-4.8 (audio), MS-23

## 3.5 Surface 4 — YouTube channel

**Status:** [NOT STARTED]

**Role:** long-form discovery surface

**Content types:**
- **Evidentiary** — single Eucharistic miracle / Marian apparition /
  incorruptible / verified healing. Per-week. Visual-first.
- **Catechetical** — single Catechism question or Day reading. Deep.
- **Apologetic** — engagement with serious objections (intellectual,
  pastoral, historical). Dialogue tone.
- **Saints** — long-form lives, Bishop Barron *Pivotal Players*
  pattern. AI voice + AI visuals.

**Production:**
- Voice-over (ElevenLabs cloned voice) over AI-generated visuals
  (Veo 3.1, Seedance 2.0, Sora 2)
- Brand typography overlays
- Source citations in description and on-screen footer
- AI disclosure in every description
- No founder-on-camera by default (per 1.5)

**Cadence:**
- Year 1: 1 video per week (52/year)
- Year 2: 2 videos per week (104/year)

**Distribution:**
- Native channel at `youtube.com/@kingdomcourse` or similar
- Embedded in `/answers/[slug]` pages where topically relevant
- Linked in daily emails when topically relevant
- Repurposed via OpusClip into short-form (Surface 5)

**Acceptance:**
- Channel published
- 12 videos in first quarter
- 1,000+ subscribers within 12 months
- 100,000+ total views within 12 months

**Cross-refs:** MS-22

## 3.6 Surface 5 — Short-form video

**Status:** [NOT STARTED]

**Role:** top-of-funnel discovery via Reels / Shorts / TikTok

**Weekly content rhythm:**
- Monday — Miracle of the Week (60s)
- Tuesday — Catechism Tuesday (45s, single CCC question)
- Wednesday — Saint of the Day (60s narrated biography)
- Thursday — Coming Sunday's feast or memorial preview
- Friday — Stations of the Cross moment (single station)
- Saturday — Marian Saturday (devotion, prayer, or apparition)
- Sunday — Sunday Gospel in a sentence

**Production:**
- Primary: OpusClip auto-clips from YouTube long-form
- Secondary: native short-form via Veo 3.1 / Seedance / Sora for
  shorts that don't require human presence
- HeyGen avatar or ElevenLabs voiceover for narrated pieces

**Distribution:**
- Instagram Reels, TikTok, YouTube Shorts, Facebook Reels, Pinterest
  Idea Pins
- Cross-posted via Buffer, Later, or equivalent
- All link in bio to `kingdomcourse.org`

**Acceptance:**
- Daily posting sustained for 30 days
- 1,000+ aggregate following across platforms within 90 days
- 10,000+ aggregate following within 12 months

**Cross-refs:** MS-24

## 3.7 Surface 6 — Native app wrapper

**Status:** [NOT STARTED]

**Role:** App Store and Play Store discoverability without native
rebuild

**Implementation:**
- Capacitor (Ionic) wraps PWA in native shell
- Native push notifications via Capacitor plugins
- App icon, screenshots, ASO-optimized description
- Category: Education / Lifestyle / Reference
- Bundle ID: `org.kingdomcourse.app`

**Acceptance:**
- iOS app submitted and approved
- Android app submitted and approved
- Ranking for "Catholic formation," "Catholic prayer," "Catholic
  daily" within 90 days

**Cross-refs:** MS-3.11

## 3.8 Surface 7 — MCP server

**Status:** [NOT STARTED]

**Role:** ecosystem positioning for the developer / power-user
audience. Future-proofing as AI assistants become primary research
surface. **Not a primary seeker-acquisition channel.**

**Implementation:**
- Server at `mcp.kingdomcourse.org`
- TypeScript implementation using Anthropic MCP SDK
- Deployed on Vercel

**Tools exposed:**
- `search_field_guide(query)` → matching practices
- `get_day(N)` → Day N reading + citations
- `get_todays_saint()` → today's saint with biography
- `get_liturgical_day(date)` → liturgical day data
- `get_kerygma()` → classical kerygma in plain form
- `find_practice_for(situation)` → recommended practice
- `verify_citation(reference)` → actual text of CCC, Scripture, etc.

**Distribution:**
- Submitted to Anthropic MCP Directory
- Listed in `awesome-mcp` GitHub registry
- Documentation at `mcp.kingdomcourse.org/docs`
- Announcement to Catholic developer communities

**Build timing:** Year 1 Q3-Q4, after Surfaces 2-5 are operational.

**Acceptance:**
- Listed in Anthropic Directory under Catholic / spiritual formation
- `claude mcp add kingdom-course` works
- Sample queries return correctly-structured catechetical responses
- 500+ distinct AI assistants make calls within 6 months of listing

**Cross-refs:** MS-21

## 3.9 Surface 8 — Voice-first surfaces

**Status:** [NOT STARTED]

**Surfaces:**
- Apple Watch complication — daily Day number, current saint, tap to
  open audio
- Apple CarPlay / Android Auto — daily audio Day reading auto-
  resumes when phone connects to car
- Alexa skill — "Alexa, open The Kingdom Course"
- Google Home routine — "OK Google, my morning Kingdom"
- Siri Shortcuts — pre-built shortcuts for power users

**Implementation:**
- Apple Watch: WatchKit complication, deep-link to PWA
- CarPlay: audio app via Capacitor + custom audio session config
- Alexa skill: AWS Lambda + Alexa Skills Kit
- Google Home: Conversational Actions via Dialogflow
- Siri: Shortcuts.app integration via URL schemes

**Content source:** Surface 3 (audio podcast) audio files

**Acceptance:**
- All five surfaces published in respective stores/registries
- Each launches into daily audio content correctly

**Cross-refs:** MS-3.11, MS-4.8

## 3.10 Surface 9 — Phone-callable Companion

**Status:** [NOT STARTED]

**Role:** voice-first AI conversation for accessibility (elderly,
vision-impaired, technologically-cautious, drivers, walkers)

**Implementation:**
- Vapi, Retell AI, or Bland.ai for voice infrastructure
- Same Companion system prompt and content as Surface 1 text
  Companion (per MS-5.x)
- Per-locale phone numbers
- Conversation logs (consent-aware, per MS-5.7)

**Number strategy:**
- US/Canada toll-free: 1-855 or 1-844 number
- Per-locale local numbers for other countries

**Cost projection:**
- $0.05-0.15/minute call duration
- 1,000 daily calls × 5 min avg = $300/day = $108K/year at scale

**Acceptance:**
- Calling the number connects to Companion
- Conversation quality matches text Companion
- Crisis-detection protocol (per MS-5.3) works in voice context

**Cross-refs:** MS-5.x, MS-19.6

## 3.11 Surface 10 — Multilingual at scale

**Language priority order:**
1. English (current)
2. Spanish — ~430M Catholics
3. Portuguese — ~210M Catholics
4. French — ~80M Catholics
5. Polish — ~37M Catholics
6. Italian — ~50M Catholics
7. Vietnamese — ~7M Catholics, fastest-growing Asian Catholic pop
8. Tagalog — ~80M Catholics in Philippines
9. Igbo, Yoruba, Swahili — African languages, fastest-growing Catholic
10. Mandarin (where permitted)
11. Arabic (where permitted)
12. German, Dutch, Korean, others as opportunity

**Per language requirements:**
- All UI strings translated
- All 50 Day readings translated
- All 22 Field Guide practices translated
- Privacy and Terms translated (with lawyer review for major
  jurisdictions)
- Companion system prompt + crisis templates localized
- ElevenLabs Multilingual v2 voice profile for audio
- Native-Catholic-speaker review (priest, theologian, or formator)
- Theological vocabulary lock-list per language
- Liturgical-text accuracy against approved local vernacular liturgy

**Cross-refs:** MS-13.x, MS-17.4

## 3.12 API-first internal architecture

Already specified in 3.1. Operational summary:

- Every piece of content callable via internal API
- All surfaces query the same API
- Phase 1: JSON files served by Vercel routes
- Phase 2: documented external API at `developers.kingdomcourse.org`
- Phase 3: rate-limited public API for third-party developers and
  parishes

**Cross-refs:** MS-4.x, MS-5.x

## 3.13 Headless CMS migration path

**Trigger:** more than two non-developer contributors OR more than
monthly content updates OR translation workflows for non-technical
reviewers

**Recommendation:** Sanity for Year 2 if triggered. Alternatives:
Contentful, Strapi (self-hosted), Payload CMS.

**Cross-refs:** MS-4.x, MS-17.x

---

# PART IV — AI TOOL STACK

## 4.1 Tier 1 — Adopt immediately

### Claude Code (Anthropic)
- VS Code Extensions → search "Claude Code" → publisher `anthropic`
- Requires Anthropic Pro ($20/mo) or higher
- `CLAUDE.md` at project root (already exists)

### Claude API (Anthropic)
- Companion backend (MS-5.x)
- Sonnet 4.6 default; Opus 4.7 escalation; Haiku 4.5 utility
- Cost projection: $50-500/mo soft launch; $1K-10K/mo at 10K MAU;
  $10K-100K/mo at 100K MAU

### ElevenLabs
- Creator $22/mo (100K chars) or Pro $99/mo (500K chars)
- Voice cloning + Multilingual v2 across 30+ languages
- Voice clones only with explicit written consent

### NotebookLM (Google)
- Free
- Upload DTS books for audio overviews, study guides, summaries

### Anthropic MCP SDK
- TypeScript or Python
- Used to build Surface 7

## 4.2 Tier 2 — Year 1

### Veo 3.1 (Google) and/or Seedance 2.0 (ByteDance)
- Veo: $0.40/sec at 1080p; $0.60/sec at 4K via Gemini API
- Seedance: multi-shot with native audio sync
- Use for atmospheric/environmental video (Surfaces 4, 5)

### HeyGen
- Creator $24/mo unlimited 1080p
- Translated video (175+ languages, lip-sync) of real recorded content
- Avatar IV for narrated content (use sparingly per 1.5)

### Sora 2 (OpenAI)
- Highest fidelity, set-piece content only
- Via ChatGPT Plus/Pro

### Cursor or Windsurf
- Optional; Claude Code is primary recommendation
- Strong inline completion if running alongside

### OpusClip
- $19-79/mo based on usage
- Auto-clips YouTube long-form into short-form (Surface 5)

### Descript
- $15-50/mo
- Audio/video editing with text-based UI (Surface 3 production)

## 4.3 Tier 3 — Defer

- Vapi / Retell AI / Bland.ai (defer until Surface 9 prioritized)
- Granola / tldv / Otter (defer until advisory cadence justifies)
- Replit Agent (Claude Code covers)
- Synthesia (HeyGen covers at lower cost)
- Adobe Firefly (know exists for IP-indemnification concerns)
- v0.dev / Bolt.new (Tailwind-default conflicts with inline-styles
  canonical decision)

## 4.4 Continuous adaptation cadence

- **Quarterly:** 1-hour scan of major lab announcements (Anthropic,
  OpenAI, Google DeepMind, Meta, Mistral); document in
  `AI_TOOL_AUDIT_YYYY_QN.md`
- **Annual:** multi-day deep review; revise tier assignments
- **Trigger-based:** capability jump (new flagship model), cost shift
  (10x change), platform shift (new modality, new ecosystem)

## 4.5 Multi-model portability

- System prompt as plain text, not provider-specific syntax
- Companion API abstraction layer at `lib/companion-client.js`
- Content versioned in git, not provider dashboards
- Quarterly: test Companion responses against alternative provider
  (Claude → GPT / Gemini) to verify portability

---

# PART V — CONTENT GOVERNANCE

## 5.1 Content generation workflow

**Catechetical content (Days, Field Guide, Academy, SEO pages):**
1. Source materials gathered (relevant chapters from seven DTS books,
   Field Guide, Master Vision)
2. AI first draft (Claude Opus 4.7 with citations instruction)
3. Citation verification (per 1.6 Layer 2)
4. Editorial pass
5. Spot check (per 1.6 Layer 3)
6. Theological pre-publication review for high-risk content (Day 1
   kerygma, sacrament explanations, ethical applications)
7. Publish
8. Sample for advisor quarterly review

**Companion responses:**
1. User query received
2. System prompt + query + context (tab, Day, House) → Claude
3. Response generated
4. Pre-response citation verification (lighter — automated only)
5. Crisis-detection check (per MS-5.3)
6. Response delivered
7. Logged (consent-aware) for quarterly sampling review

## 5.2 Citation verification engineering

Per 1.6. Build before Companion ships.

## 5.3 Theological sampling review

Per 1.3. Quarterly. Documented in `THEOLOGICAL_REVIEW_YYYY_QN.md`.
Public summary on About page.

## 5.4 User-flagged correction workflow

- "Report this" link on every Companion response, Day reading, Field
  Guide entry, Academy chapter, SEO page
- Form: category (factual / citation / theological / pastoral /
  other), specifics, optional contact
- Routes to support inbox

**SLAs:**
- Acknowledgment: 24 hours
- Investigation: 7 days
- Correction (if warranted): 14 days
- Reporter notified

**Pattern detection:** quarterly review of reports; patterns drive
system prompt and content updates.

**Cross-refs:** MS-14.5, MS-18.5

## 5.5 Translation review chain

Per language:
- AI first-pass translation (Claude Opus or equivalent)
- Native-Catholic-speaker review (priest, theologian, or formator)
- Theological vocabulary verified against approved local Catholic
  vocabulary
- Liturgical-text accuracy verified against approved local vernacular
  liturgy

Quarterly: sampled review per active language.

**Cross-refs:** MS-13.x, MS-17.4

---

# PART VI — ECCLESIAL INTEGRATION

## 6.1 Director of Evangelization role

Per 1.4.

**Action:** accept appointment if offered.

**Documentation:**
- Formal letter of appointment in project records
- About page references role
- Written agreement: project remains operationally independent;
  bishop informed; project not official diocesan ministry unless
  explicitly designated

## 6.2 Theological advisory composition

Per 1.3. Operational summary:

**Initial:** 3 members (priest/religious, academic theologian, lay
catechist).

**Mature:** 5-7 with tradition and language diversity.

**Selection criteria:** active Catholic in good standing; demonstrated
theological competence; willing to be publicly named; available
quarterly.

**Compensation:** $200-500/quarter honorarium or volunteer.

## 6.3 Bishop-informed-not-gated cadence

**Quarterly:**
- 1-page summary: user growth, content shipped, advisory findings,
  pastoral concerns
- 30-60 minute meeting (in-person if feasible; otherwise video)
- Bishop receives advisory reports
- Bishop may flag concerns; operator commits to address within 30 days

**Annual:**
- Substantial year-end report
- Aggregate salvation metrics
- Catechetical pattern data
- Roadmap for coming year

**No per-piece approval.** Bishop may *request* changes; operator
commits to address. Relationship is transparency, not gating.

## 6.4 Quarterly review process

1. Operator prepares sample (per 1.3)
2. Advisors review individually (1-2 weeks)
3. Quarterly meeting (90 min); findings discussed; action items
   identified
4. Operator addresses action items (30 days)
5. Briefing to bishop after action items addressed
6. Public summary on About page

**Documentation:**
- Meetings recorded (audio, with consent)
- Notes in `THEOLOGICAL_REVIEW_YYYY_QN.md`
- Action items in GitHub Issues with `theological-review` label

## 6.5 Conflict and correction protocol

**Theological advisor identifies error:**
- Issue documented
- Operator + advisor jointly determine correction
- Correction within 14 days
- Public note (if material) on About page or changelog

**Advisor wishes to withdraw:**
- Advisor may publicly announce
- Operator publishes withdrawal on About page within 7 days
- Withdrawal is structural accountability backstop

**Bishop expresses concerns:**
- Operator meets with bishop within 7 days
- Concerns addressed in writing
- Material changes within 30 days
- Persistent disagreement: operator considers whether project should
  continue in current form

**User reports doctrinal error confirmed by advisory:**
- Content corrected within 14 days
- System prompt updated to prevent recurrence
- Pattern logged for quarterly review
- User notified

---

# PART VII — OPEN CONTENT STRATEGY

## 7.1 Licensing

| Asset | License |
|---|---|
| Course content (Day readings, Field Guide, Academy) | CC BY-SA 4.0 |
| SEO question-page library | CC BY-SA 4.0 |
| Software (web app code) | AGPL-3.0 |
| Brand and trademarks | Standard copyright; attribution required |
| Companion responses | Not separately licensed (service, not redistributable) |
| Translations | CC BY-SA 4.0 (same as source) |

## 7.2 Proprietary

- Brand mark (logo, name)
- Voice and visual identity (typography, palette as system)
- Companion system prompts and training data
- Operational analytics and user data

## 7.3 Open

- All Day readings (post-editorial)
- All Field Guide entries
- All Academy chapter content
- All SEO question pages
- All saint biographies as written
- Master Vision and supporting documents
- Miracles content
- All translations

## 7.4 Reusability targets

**Year 1:**
- Parishes print Day 1 invitation cards (provided PDF templates)
- Parishes print Field Guide entries for RCIA programs
- Catholic bloggers/content creators quote with attribution
- Diocesan formation programs incorporate content

**Year 3:**
- Other Catholic developers build on the API
- Catholic schools incorporate Academy in religion classes
- Catholic publishers may publish print editions (royalty agreement
  if commercial)
- Translation initiatives build on existing translations

## 7.5 MCP server as open content channel

Per 3.8. Open content in operational form.

---

# PART VIII — SEQUENCING DOCTRINE

**Build order doctrine:** *text first, audio second, video third,
developer/ecosystem fourth, accessibility surfaces fifth.*

The seeker is in a search bar before they are in any other surface.

## 8.1 Build order rationale (single statement)

Long-form text answering specific seeker questions is the highest-
converting medium for unaffiliated visitors. Audio is the highest-
retention medium for committed walkers. Video is the highest-trust-
building medium for already-engaged users. Developer ecosystem
distribution (MCP, API) is future-proofing. Accessibility surfaces
(voice phone, watch, smart speakers) extend reach to underserved
populations.

Build in that order.

## 8.2 Operational sequencing

**After current soft launch completes:**

1. **SEO question-page library begins immediately.** Target: 50 pages
   live in Year 1 Q3. 150 by Year 1 Q4. 500+ by Year 2.

2. **Daily audio podcast begins in parallel.** Season 1 (50 episodes)
   published Year 1 Q3. Continuous seasons thereafter.

3. **YouTube long-form begins after first 50 SEO pages publish.**
   Visual content benefits from established text base for SEO link-
   building.

4. **Short-form video begins after first 12 YouTube videos publish.**
   Repurpose-via-OpusClip strategy requires source material.

5. **Native app wrapper after Year 1 Q4.** Web/PWA optimization comes
   first; native wrap captures App Store discoverability after the
   web product is mature.

6. **MCP server in Year 1 Q4 or Year 2 Q1.** Built after primary
   seeker-acquisition channels are operational.

7. **Voice-first surfaces (Watch, CarPlay, Alexa, Google Home) in
   Year 2.** Audio podcast (Surface 3) provides content substrate.

8. **Phone-callable Companion in Year 2.** After Companion is mature
   in text and the operator has bandwidth for voice infrastructure.

9. **Multilingual Spanish in Year 2.** Other languages follow per
   priority order in 3.11.

10. **API openness (Phase 3+) in Year 2-3.** After internal API is
    stable across surfaces.

## 8.3 The encounter criterion

Every surface decision is tested against: *does this make encounter
with Christ more likely, or less?*

Surfaces that fail the test are deprecated regardless of metrics.

## 8.4 Parish bridge as non-negotiable

Every surface, in every language, on every modality, returns the
user to their parish for the sacraments. Per MS-8.x.

No surface substitutes for the parish. No surface competes with the
parish. Every surface points to the parish.

---

# PART IX — CROSS-REFERENCE TO MASTER SPEC

## 9.1 Strategic principles → spec sections

| Strategic principle | Master Spec section(s) modified |
|---|---|
| 1.1 Citation-based authority | MS-4.x, MS-5.2, MS-17.1 |
| 1.2 Transparent AI disclosure | MS-3.x, MS-5.2, MS-15.x |
| 1.3 Theological advisory | MS-5.8, MS-16.1, MS-16.2, MS-17.1 |
| 1.4 Ecclesial integration | MS-16.1, MS-16.3, MS-19.3 |
| 1.5 No personality cult | MS-3.x, MS-20.5 |
| 1.6 Engineered citation verification | MS-4.x, MS-5.2, MS-17.1, MS-17.3 |
| 2.x Trust and aesthetic architecture | MS-3.x, MS-4.x, MS-22, MS-24 |
| 2.6 Hard lines | NEW MS-26 |
| 2.7 Methodology mark | MS-3.10 (footer), NEW MS-26 |
| 3.1 Content backbone | MS-4.x, MS-17.x |
| 3.3 SEO question-page library | MS-12.7 (expand and elevate), NEW MS-27 |
| 3.4 Daily audio podcast | MS-4.8, NEW MS-23 |
| 3.5 YouTube channel | NEW MS-22 |
| 3.6 Short-form video | NEW MS-24 |
| 3.7 Native app wrapper | MS-3.11 |
| 3.8 MCP server | NEW MS-21 |
| 3.9 Voice-first surfaces | MS-3.11, MS-4.8 |
| 3.10 Phone-callable Companion | MS-5.x extension, MS-19.6 |
| 3.11 Multilingual at scale | MS-13.x |
| 3.12 API-first | MS-4.x, MS-5.x |
| 4.x AI tool stack | Operational, no specific MS items |
| 5.x Content governance | MS-17.x, MS-4.x, MS-14.5 |
| 6.x Ecclesial integration | MS-16.x |
| 7.x Open content | NEW MS-25 |
| 8.x Sequencing doctrine | Revises MS Appendix A |

## 9.2 New Master Spec sections to add

- **MS-21 — MCP Server** (per 3.8)
- **MS-22 — YouTube Channel** (per 3.5)
- **MS-23 — Daily Audio Podcast** (per 3.4)
- **MS-24 — Short-Form Video** (per 3.6)
- **MS-25 — Open Content Strategy** (per Part VII)
- **MS-26 — Methodology Page and Hard Lines** (per 2.6, 2.7)
- **MS-27 — SEO Question-Page Library** (per 3.3)

## 9.3 Master Spec sections to expand

- **MS-3.10 (Footer)** — add methodology mark from 2.7
- **MS-3.x (all consumer surfaces)** — add AI disclosure footer (1.2)
- **MS-4.x (content)** — citation requirements (1.1), citation
  verification (1.6)
- **MS-5.x (Companion)** — system prompt incorporates 1.1, 1.2, 5.4
- **MS-12.7 (long-tail SEO content)** — elevate to Tier 1 priority;
  expand per 3.3
- **MS-16.x (ecclesial)** — replace placeholders with Part VI
- **MS-17.x (content governance)** — replace placeholders with Part V

## 9.4 Master Spec Appendix A revision

**Replace existing batch order with sequencing from Part VIII.**

Specifically: SEO question-page library work begins immediately
after the current soft-launch polish batch. Audio podcast in
parallel. YouTube/short-form/native after first SEO batch lands. MCP
server in Year 1 Q4 or Year 2 Q1, not earlier.

---

# APPENDIX A — REVISED DISTRIBUTION BUILD ORDER

**Current state (May 2026):** Master Spec Batches A-C complete or in
progress. Web/PWA shipped. Auth working. Legal pages live. Pre-
launch polish complete or completing.

**Build order after soft launch:**

## Batch S1 — Seeker acquisition foundation (immediately post-soft-launch)
- SEO question-page library v1 (50 pages)
- Methodology page + hard lines published
- Citation verification engineering (per 1.6 Layers 1-3)
- Theological advisory recruited and convened
- Director of Evangelization role formally accepted

## Batch S2 — Audio and discovery (Year 1 Q3)
- Daily audio podcast Season 1 published
- SEO library expands to 150 pages
- Voice cloning + ElevenLabs setup
- YouTube channel published; first 12 videos shipped

## Batch S3 — Short-form and native (Year 1 Q4)
- Short-form video daily posting begins
- OpusClip auto-clip pipeline operational
- Native app wrapper (Capacitor) submitted to App Stores
- MCP server built and submitted to Anthropic Directory

## Batch S4 — Multilingual expansion (Year 2 Q1-Q2)
- Spanish translation complete; all surfaces multilingual
- Daily audio podcast in Spanish (Season 1)
- SEO library in Spanish (first 50 pages)
- Companion multilingual operational

## Batch S5 — Voice-first surfaces (Year 2 Q3)
- Apple Watch complication
- CarPlay / Android Auto integration
- Alexa skill published
- Google Home routine published
- Siri Shortcuts pack

## Batch S6 — Phone-callable Companion (Year 2 Q4)
- Vapi or Retell integration
- Toll-free US/Canada number
- Crisis-detection protocol verified in voice context
- Per-locale numbers added as multilingual expands

## Batch S7 — Ecosystem maturation (Year 3+)
- Portuguese, French, Polish, Italian translations
- API publicly documented at `developers.kingdomcourse.org`
- Parish dashboard (MS-8.3) operational
- Cohort enrollment (MS-8.4)
- Diocesan partnerships formalized
- Theological review board expanded to 5-7

## Batch S8 — Long-arc languages (Year 4+)
- Vietnamese, Tagalog, African languages
- Mandarin and Arabic where permitted

---

# APPENDIX B — AI TOOLS BUDGET (USD/year)

| Tool | Soft launch | 10K MAU | 100K MAU |
|---|---|---|---|
| Claude API (Companion) | $600 | $12,000 | $120,000 |
| Anthropic Pro/Max (operator) | $240 | $1,200 | $2,400 |
| ElevenLabs (Pro) | $1,188 | $1,188 | $5,940 |
| HeyGen (Creator) | $288 | $288 | $1,788 |
| Veo / Seedance / Sora | $300 | $1,200 | $6,000 |
| NotebookLM | $0 | $0 | $0 |
| OpusClip | $228 | $228 | $948 |
| Descript | $180 | $180 | $600 |
| Cursor (optional) | $240 | $240 | $1,200 |
| Vapi / Retell (Year 2+) | $0 | $3,600 | $108,000 |
| MCP server hosting | $0 | $240 | $600 |
| **Total AI stack** | **$3,300** | **$20,400** | **$247,500** |

Excludes non-AI operational costs from MS-19.6 (~$1,500-60,000
separately).

---

# APPENDIX C — ECCLESIAL CONTACTS TEMPLATE

Stored as `CONTACTS.md` outside public repo.

```markdown
# Ecclesial Contacts

## Bishop
- Name:
- Diocese:
- Role re project:
- Communication cadence:
- Last contact:

## Theological Advisors
1. Name:
   - Role:
   - Tradition:
   - Compensation:
   - Last review:
2. ...
3. ...

## Partner Parishes
...

## Partner Religious Orders
...

## Translation Reviewers per Language
- Spanish:
- Portuguese:
- French:
...
```

---

# APPENDIX D — HARD LINES PUBLIC STATEMENT

Source text for `/methodology` page (or equivalent).

```markdown
# How The Kingdom Course Is Made

The Kingdom Course is prepared with AI assistance, grounded in the
Catechism of the Catholic Church and Sacred Tradition, and reviewed
by a named theological advisory. AI can make mistakes. We design for
that — every theological claim is cited, every citation is verified,
every piece of content is correctable.

We commit to the following limits without exception:

1. The face of Jesus Christ is never AI-generated in this project.
   We use existing Catholic artistic tradition when visual reference
   to the Lord is needed.

2. AI never speaks *as* a saint. We quote saints with verified
   citation; we do not put words in their mouths.

3. AI never performs or simulates sacraments. No AI absolution,
   blessing, consecration, marriage, ordination, or any sacramental
   act. Sacraments require a priest, a parish, a Body.

4. AI never claims pastoral or spiritual authority of its own. The
   Companion refers you to a priest for Confession, a spiritual
   director for direction, a mental-health professional for crisis.

5. AI never represents real living Catholics without their explicit
   consent. No deepfakes. No impersonations. No "what Bishop X would
   say" simulations.

6. Every piece of AI-generated content is versioned and correctable.
   When you report an error, we investigate within 7 days and correct
   within 14 if warranted.

The authority of this project does not rest on AI. It rests on the
Magisterium, the saints, the cited sources, and the human ecclesial
structure that holds the project accountable.

**Per machinas, per Magisterium.**
*Through machines, through the Magisterium.*

*Salus animarum suprema lex.*
```

---

# APPENDIX E — METHODOLOGY MARK VARIATIONS

For consistent use across surfaces.

**Full mark (footer):**
> AI-presented · Magisterium-grounded · Citation-verified · Theologically reviewed

**Compact mark (mobile, sidebar):**
> Per machinas, per Magisterium

**Audio preamble (podcast, Companion voice):**
> The Kingdom Course is prepared with AI assistance, grounded in
> the Catechism and Sacred Tradition. AI can make mistakes. Verify
> what matters; talk to a priest.

**Video end-card:**
> Visuals generated with AI under human direction.
> Theological content reviewed.
> kingdomcourse.org/methodology

**Email footer:**
> The Kingdom Course is prepared with AI assistance. Read our
> methodology at kingdomcourse.org/methodology.

---

*Salus animarum suprema lex.*

— 17 May 2026
