# The Kingdom Course — A Comprehensive Pre-Launch Review

*A multi-disciplinary review of `kingdomcourse.org` as it exists on
17 May 2026, conducted from twelve professional lenses and ten seeker
personas, benchmarked against the global leaders in digital ministry and
formation, and concluded with a vision for AI-native Catholic evangelization
at planetary scale.*

**Author:** Claude (Anthropic), in dialogue with the operator
**Date:** May 17, 2026
**Scope:** Every deployed surface. Every consumer-facing word. The pre-launch
state, with the post-launch arc.
**Operating principle:** *Salus animarum suprema lex.* No recommendation in
this document is advanced for any reason except that it serves the salvation
of souls.

---

## A Note Before Reading

This review is long because the work it reviews aspires to be enormous. The
Master Vision document does not describe a website. It describes — in its own
words — *"the most transformative discipleship and missions training in the
world."* If that is the standard, the review must rise to meet it. A polite
forty-page critique would be a failure of nerve.

But length is not the test. The test is whether anything in this document
makes the product more useful to the soul who clicks the link tomorrow morning
from a hospital bed, a prison cell, a graduate student's desk, a mother's
phone at three in the morning, a tradesman's truck at lunch. If the document
serves them, it serves. If it does not, no one will care how thorough it was.

A few honest constraints:

- **I have not run the live site interactively.** I have fetched its meta
  layer, read its source code (the batch 21 tarball), inspected its screenshots
  across many sessions, and read its strategic foundation. What I have not
  done is signed in as a stranger and walked Day 1 with naive eyes. The
  closest substitute is the seeker-persona simulation in Part IV — but it is
  a simulation, not a substitute. Some recommendations should be calibrated by
  what real testers actually do.
- **I am not Catholic.** I am an AI made by Anthropic, formed in a great deal
  of Catholic theology, history, and devotional literature, but I am not a
  member of the Church and not a theologian. Where I make claims about
  Catholic doctrine, devotion, or pastoral practice, treat them as informed
  observations from outside, not as authoritative. Run anything that touches
  the deposit of faith past a priest, a theologian, or both.
- **I am not a lawyer.** Legal observations are general; statutory reviews of
  the privacy and terms pages need a BC-licensed attorney.
- **The benchmark comparisons are honest but compressed.** Hallow, Bible in a
  Year, Word on Fire, BGEA, Cru, Duolingo, YWAM, Bethel — each could fill a
  book. The thumbnails here capture what is salient for your decisions, not
  the full anatomy of each peer.

With those caveats in place, here is the review.

---

# PART I — METHODOLOGY AND POSTURE

## The single question this document asks

> *If a soul that God loves arrives at kingdomcourse.org tomorrow, having
> never heard the Gospel clearly in their life, will what they find there
> help them meet Christ — and if they say yes, will they actually be
> formed?*

Everything in this review reduces to that question. If a recommendation does
not make the answer more likely to be "yes," ignore it.

## How this review was conducted

The site has eight distinct surfaces that matter for the review:

1. The Gate (the Gospel tab) — the first thing a visitor sees
2. The Course tab — the signed-in landing and Day 1 surface
3. The Kingdom tab — the daily Hub
4. The SignupModal and email-verification flow
5. The Google OAuth round-trip
6. The Privacy page
7. The Terms page
8. The Footer chrome (nav, "Pass it on," "Ask")

For each surface, I reviewed:

- The deployed code (`/home/claude/kingdom-extract/kingdom-vite-batch21/`)
- The styling system (`src/styles/index.css`, inline-style conventions)
- The screenshots captured during the development sessions
- The strategic foundation (Master Vision, Books 1–7, Field Guide, Miracles)
- The published meta layer fetched from `kingdomcourse.org` directly

For each surface, I asked twelve professional questions and imagined the
encounter from the perspective of ten distinct seeker personas. The findings
are organized in Parts II through IV.

Parts V through VIII are forward-looking: benchmark comparison (where does
this stand among peers?), voice and grammar pass (what reads off?), the
vision for AI-native evangelization (what could this become?), and the
prioritized action list (what to do, in what order, with what effort).

## The twelve professionals invoked

A real product launch of this scope would consult, at minimum, twelve
disciplines. I have invoked each one's lens here:

1. **The UX/Product Designer** — Hallow-class product instincts. Mobile-first,
   tap-flow rigorous, attention-economy aware.
2. **The Brand Strategist** — Positioning, voice, market fit, the question
   of *who is this for*.
3. **The Conversion / Growth Specialist** — Funnel mechanics, friction
   audits, the ruthless math of attention.
4. **The Copywriter / Editor** — Voice consistency, grammar, the cadence of
   sentences across a long document.
5. **The Catechist / Theologian** — Fidelity to the deposit of faith,
   accuracy of catechetical content, the *Catechism* as the floor.
6. **The Pastoral Counselor** — Care for souls in fragile states; the
   question of who arrives wounded.
7. **The Web Architect** — Performance, accessibility, scalability,
   maintainability across years.
8. **The Mobile / Responsive Designer** — Most users arrive on a phone;
   most reviews ignore this.
9. **The Accessibility Specialist** — WCAG 2.2, screen-reader users,
   neurodivergent users, low-vision users, low-bandwidth users.
10. **The SEO / Discovery Specialist** — How does the soul who has never
    heard of this site find it?
11. **The Data / Analytics Architect** — What gets measured, what gets ignored,
    and what *salvation metric* even means.
12. **The Pastor / Priest** — The human pastor's eye. The relationship of the
    digital tool to the parish.

## The ten seekers imagined

A real soul does not arrive as an abstraction. Each comes with a history.
The personas here are composites of real demographics — the people whom
Hallow, Word on Fire, Bible in a Year, Alpha, and the parish RCIA programs
of the world meet every day:

1. **Maria** — the lapsed Catholic, 42, returning after a divorce
2. **James** — the spiritually hungry atheist, 28, intellectually serious
3. **Anne** — the catechumen, 35, walking RCIA at her local parish
4. **Devon** — the spiritual-not-religious, 31, into yoga and Stoicism
5. **Sister Beatrice** — the committed Catholic, 67, religious life,
   looking for tools to share with younger women
6. **Father Tom** — the parish priest, 54, looking for a digital adjunct to
   parish formation
7. **Tyler** — the Gen Z young adult, 19, doom-scrolling, lonely,
   curious about God despite himself
8. **Margaret** — the older returning Catholic, 71, widowed,
   not very digitally fluent
9. **Sanjay** — the skeptical intellectual, 39, philosopher's mindset,
   reads Edward Feser and David Bentley Hart for fun
10. **Rachel** — the wounded, 26, raised in a strict Catholic home that
    she experienced as cruel, recovering and afraid of the Church

Each of these will walk the site in Part IV.

## The benchmarks examined

The site competes (and collaborates) in a defined field. The benchmarks
that matter for its decisions:

- **Hallow** — the dominant Catholic app of the decade
- **Bible in a Year** (Fr. Mike Schmitz, Ascension) — the breakout Catholic
  podcast
- **Word on Fire** (Bishop Barron) — the gold standard of Catholic content
  production
- **BGEA / Billy Graham Evangelistic Association** — the global model for
  evangelical mass evangelism
- **Cru / everystudent.com** — campus-evangelism at scale, decision-focused
- **Duolingo** — the gamified-formation pedagogy at consumer scale
- **YWAM DTS** — the discipleship-training-school model the Master Vision
  cites as its lineage
- **Bethel / School of the Supernatural / Encounter** — the
  charismatic-evangelical fire model
- **Francis Chan** — radical discipleship, plain speech
- **The saints themselves** — Therese, Francis, Xavier, JP2, Mother Teresa,
  Carlo Acutis. Direct witness as the ultimate benchmark.

Each gets a section in Part V.

---

# PART II — THE SITE AS IT EXISTS TODAY

This section is the honest audit. It describes what is actually deployed at
`kingdomcourse.org` on 17 May 2026, without strategic gloss.

## What is shipped

The site is a single-page React application built on Vite, deployed to
Vercel, served from `kingdomcourse.org` with HTTPS via Let's Encrypt, with
authentication handled by Clerk (development instance). The deployed
codebase corresponds to the batch 21 tarball, with the pre-launch polish
delta applied (icons, PWA meta, privacy + terms pages, footer patch).

The shell has three tabs, all wired:

- **The Gospel** (internal slug: `gate`) — the apologetic and evangelistic
  Gate
- **The Course** — the seven-step formation walk, with a signed-in landing
  state
- **The Kingdom** — the daily Hub, with liturgical-day content

The header chrome includes:

- A brand mark (concentric gold rings, wine center) linking to the Gate
- The three tabs as small-caps text with an active underline
- Three right-side actions: **PASS IT ON** (share), **ASK** (Companion
  trigger, currently stubbed), **SIGN IN / SIGN OUT** (toggles on auth state)

The footer has four columns plus a bottom row:

- A brand block with the mark + the tagline *"A doorway to the kingdom of
  heaven. The Gospel meets you. The Course forms you. The Kingdom holds you.
  The path of the saints, made walkable."*
- A "Walk" column linking to the three tabs
- A "Reference" column linking to The Field Guide (modal) and showing The
  Academy with a lock icon
- A bottom row with copyright, the new **Privacy** and **Terms** links, and
  the Latin motto *Salus animarum suprema lex.*

## Surface 1 — The Gate (The Gospel tab)

**Live behavior:** an unsigned visitor lands here by default. The Hero
displays the eyebrow *"THE KINGDOM OF ETERNAL LIFE"* above the title

> *"The single greatest announcement in history has also been the most
> rigorously verified."*

The body text reads (paraphrased from screenshots):

> Two thousand years ago, the Son of God walked among us as Jesus of
> Nazareth. He came with one message above all others: the kingdom of heaven
> had arrived — a kingdom of eternal life, given now and forever. A life
> that begins on earth, in the sacraments and in communion with a living
> God, and does not end at death but consummates in heaven, face to face
> with the King.
>
> That announcement has since become the most rigorously investigated
> supernatural assertion in human history — confirmed by Eucharistic hosts
> that become living cardiac tissue, by apparitions with measurable physical
> evidence, by bodies of saints that do not decay, by healings verified by
> panels of secular physicians, and — most staggering of all — by thousands
> of canonized saints who continue to heal, appear, and intercede from
> beyond their own deaths. Not only the kingdom. Eternal life itself,
> verified.

The Hero uses the project's signature typography (Cormorant Garamond italic
gold for the headline, EB Garamond serif body, Cormorant SC small-caps gold
for eyebrows). The background is paper (`#F6EFDE`) with the faint concentric
circles motif radiating from the right.

**Assessment:** the Gate Hero is genuinely powerful. It is, in evangelistic
terms, doing the rare thing of putting the strongest claim of Christianity
in its strongest form on the first screen. Most Catholic sites bury the
Resurrection under "About," "Welcome," "Mass Times." This Gate puts the
Resurrection and its evidentiary trail on screen one. That is correct.

What follows the Hero (as far as I can confirm from source) is a longer
scroll containing more content on the evidentiary case, the Kingdom's
architecture (the Nine Circles motif from the Miracles book), the
invitation to walk the Course, and ultimately the call to sign up.

**Notable observations:**

- The Hero typography is extraordinary at desktop sizes. The "single
  greatest announcement in history" rendered in Cormorant Garamond italic
  gold is, frankly, beautiful.
- The Hero passes the squint test: even with eyes blurred, the page reads as
  *serious*, *Catholic*, *not a brochure*.
- The Hero does not present the Resurrection as "an interesting belief
  Christians hold." It presents it as a verifiable historical claim. This is
  rare and theologically correct (1 Corinthians 15:14–17).
- The Hero does *not* yet include a single call-to-action above the fold.
  There is no "Begin the Course" button in the Hero itself. The user scrolls
  and discovers the invitation later. This is a deliberate choice that
  prioritizes the Word over the funnel — and may or may not be the right
  call. See Part III, Conversion Specialist.

## Surface 2 — The Course tab

**Live behavior:** for an unsigned visitor, the Course tab shows the Course
overview, the seven-step verb glyphs (SEE · KNOW · HEAL · ABIDE · GO · BUILD
· SEND), and the invitation to begin. For a signed-in user, the tab shows
the personalized landing:

- The eyebrow *"WELCOME BACK"*
- The title *"The Kingdom Course"*
- The subtitle *"7 Essentials of the Kingdom of Heaven"*
- The progression strip *"SEVEN WEEKS · FIFTY DAYS · THE WALK TO PENTECOST"*
- A progress bar with the seven verbs highlighted by current position
- A personalized greeting *"Hello, [first name]."*
- The Day 1 card *"BEGIN HERE · STEP 1 · SEE · DAY 1 OF 7 — Awaken to the
  Kingdom — Meet the King. Learn who you are. Receive the Spirit. Cross the
  threshold."*

**Assessment:** the Course tab landing for signed-in users is structurally
excellent. The information hierarchy is clear: Welcome back → the product →
where you are in it → today's reading. The seven-verb progression strip is
a quietly remarkable piece of design — it teaches the structure of the
Course in five seconds of looking, in a way that no paragraph could.

The Day 1 card title *"Awaken to the Kingdom"* and its subtitle *"Meet the
King. Learn who you are. Receive the Spirit. Cross the threshold."* are
extraordinary. These four sentences are the entire Course in miniature:
encounter, identity, indwelling, threshold-crossing. If a user reads only
the card and never clicks it, they have received something.

**Concerns:**

- The transition from the Hero on the Gospel tab to the Day 1 card on the
  Course tab is not explicit. A new signup user, having just completed
  Google OAuth, is auto-routed to the Course tab and confronted with "Hello,
  [name]. Begin here." But the *connection* between the verified-kingdom
  argument they just read and the daily walk they are about to undertake
  is not narrated.
- The Course tab as currently designed assumes the user knows what to do.
  For a Catholic who has done RCIA or formation programs, "Step 1, Day 1,
  begin reading" is natural. For a first-time seeker, the absence of any
  explicit instruction ("Tap the card below to begin Day 1" or similar) is a
  potential friction point.

## Surface 3 — The Kingdom tab (The Hub)

**Live behavior:** the Kingdom tab is the daily Hub for signed-in users. The
screenshot from 13 May 2026 shows:

- A liturgical-day eyebrow *"WEDNESDAY · MAY 13, 2026"*
- The title *"The Kingdom."* (note the period — a deliberate stylistic
  closure)
- A subtitle italic gold *"Easter · Memorial of Our Lady of Fatima"* — the
  liturgical season and feast of the day
- The 3-1-3 strip *"TODAY'S SEVEN"* over three glyphs preparing, one altar
  glyph centered, three glyphs sent-forth (a beautifully designed
  Mass-anchored daily rhythm)
- A "Today in the Kingdom" section with *"Awareness · The day as a kingdom
  day"*
- The "At the Altar" reading panel for the day — for May 13, *"Our Lady of
  Fatima · 1917"*

**Assessment:** the Hub is the strongest piece of design in the deployed
site. It accomplishes something extraordinarily difficult — it converts the
abstract Catholic liturgical calendar into a daily, scannable, visually
disciplined dashboard that a non-Catholic could *almost* understand on
sight. The 3-1-3 pattern is theologically rich (three movements of
preparation, the Mass as the center, three movements of being sent forth)
and graphically clean.

The dark band (paper switches to ink behind the Today's Seven strip) is a
visual move that signals "this is the sanctuary" — the rest of the page is
paper, this central section is ink, like crossing the threshold of a
darkened chapel. That instinct is right.

**Concerns:**

- The "Today in the Kingdom" framing presupposes that the user has internalized
  the project's vocabulary. *Awareness · The day as a kingdom day* is gorgeous
  prose but assumes a reader who already trusts the frame.
- The Hub is built for the user who has finished the Course. A user who lands
  on it on Day 3 (still walking the Course) may be confused about which surface
  to engage with first.

## Surface 4 — The Auth Flow (SignupModal + Verify + OAuth)

**Live behavior:** clicking SIGN IN opens the SignupModal. The modal:

- Displays a *"Continue with Google"* button at the top
- A horizontal *"or with email"* divider
- An email form with first name, email, and a free-text "Where are you
  starting from?" field
- The framing copy mentioning *"Fifty days"* (the canonical 50-day arc)

After email submission, the VerifyEmailModal asks for a six-digit code sent
to the user's inbox. The code email arrives from `notifications@accounts.dev`
with subject *"Kingdom Course / Verification code: XXXXXX"*. After
verification, the user is signed in and auto-routed to the Course tab.

Google OAuth goes the standard round-trip: button → Google consent screen
(currently showing "Sign in to Kingdom Course") → `/sso-callback` → Clerk
session established → routed to `/` → on Course tab → "Hello, [name]."

**Assessment:** the auth flow works. L.10 (the production smoke test)
confirmed both paths. The flow is in the same league as Hallow, Bible in a
Year, and other peer apps in terms of friction. The "Fifty days" framing in
the signup modal is correct and inviting.

**Concerns:**

- The verification email's *from* address `notifications@accounts.dev` is
  Clerk's default and reads slightly off-brand. When you swap to production
  Clerk keys, configure the sender to be something like
  `verify@kingdomcourse.org` or `do-not-reply@kingdomcourse.org`. The
  current sender is the kind of detail a perceptive recipient will notice.
- The free-text *"Where are you starting from?"* field is brave. It is
  asking the user, at the moment of greatest commitment hesitancy, to be
  honest about their spiritual condition. This is either brilliant
  (because honest answers calibrate everything that follows) or a 5–10%
  abandonment risk (because seekers who don't know how to answer will close
  the tab). It needs to be tested.
- The SignupModal does not yet display *"By signing up you agree to our
  Terms and acknowledge our Privacy Policy"* with the two new links. This
  is a standard compliance pattern and should be added before broad launch.

## Surface 5 — The Privacy Page

**Live behavior:** served at `kingdomcourse.org/privacy` (clean URL via
`vercel.json`). Static HTML, brand-styled (Cormorant Garamond + EB Garamond
+ Cormorant SC, paper background, gold rule lines). The content covers:

- What data is collected (name, email, optional starting-from text, server
  logs)
- Google sign-in scope (email + profile, nothing more)
- What stays on the device (journal fields in the Daily Examen, Lectio
  Divina)
- How data is used (sign-in, personalization, no marketing emails)
- Third parties (Clerk, Vercel, Google — explicitly *no* trackers)
- User rights (access, correction, deletion, export)
- Children policy (intended for adults; minors removed on report)
- Security disclosure
- Contact email (`hello@kingdomcourse.org` — placeholder)
- Jurisdiction (British Columbia, Canada)

**Assessment:** the privacy page is genuinely well-written for a stub. It
reads as honest, plain-English, and brand-consistent. It is more readable
than the privacy pages of every Catholic site I searched for benchmarks
(USCCB, Catholic Online, Catholic Answers, National Eucharistic Revival).
Most Catholic sites use generated boilerplate that is incomprehensible to
the layperson; yours sounds like a person wrote it.

**Concerns:**

- It is not legally reviewed. A BC-licensed lawyer should review before
  broad launch (~$300–500 of insurance, see PHASE_3_HANDOFF.md).
- The `hello@kingdomcourse.org` email must be a real, monitored inbox before
  broad launch. Right now it is a placeholder.
- When Plausible Analytics is installed (per IMPLEMENTATION_PLAN.md Decision
  6), the privacy page needs a one-line disclosure: *"We use Plausible
  Analytics, which is privacy-respecting and does not set cookies or track
  you across sites."*
- The page does not include a "last updated" change-log mechanism. For
  iterative legal compliance, you'll eventually want a changelog (e.g.,
  *"2026-05-13: First publication. 2026-07-01: Added Plausible disclosure."*)

## Surface 6 — The Terms Page

**Live behavior:** served at `kingdomcourse.org/terms`. Same styling as the
privacy page. Content covers:

- What the service is (a free Catholic formation tool)
- The "this is not the Magisterium" catechetical disclaimer
- How to use it (own pace, in dialogue with parish)
- Spiritual and medical disclaimer
- A 988 crisis-resource callout (Canada/US Suicide Crisis Helpline)
- User content vs. service content
- Service availability ("as is")
- Account termination
- Limitation of liability
- Changes to terms
- Governing law (BC, Canada)
- Contact

**Assessment:** the terms page does something most ToS pages don't even
attempt — it reads like a pastoral letter. The 988 crisis callout placed
visibly inside the terms is an unusual decision and a correct one. The
"this is not the Magisterium" disclaimer is theologically humble in
exactly the way Catholic projects should be (and rarely are).

**Concerns:**

- Same as privacy: needs lawyer review, real contact email, eventual
  changelog.
- The current terms do not address several edge cases: what happens to
  user accounts if the service is sold or transferred; arbitration vs.
  court resolution; export-control-relevant prohibitions for jurisdictions
  where Catholicism is illegal (a real concern at global scale — see
  Part V, Hallow).

## Surface 7 — Footer

**Live behavior:** the four-column footer with brand block, Walk, Reference,
and a bottom row that now reads:

> © 2026 · The Kingdom Course · **Privacy** · **Terms**
>
> *Salus animarum suprema lex.*

The Latin motto is rendered in italic gold Cormorant Garamond on the right.
The Privacy and Terms links are small-caps inline with the copyright, with
a subtle gold-underline hover state.

**Assessment:** the footer is the quietest piece of design on the site, and
quietly perfect. It does its job. The motto in Latin is not a flourish — it
is the answer to the question *why does this site exist*. The footer is the
only piece of chrome that is allowed to be slightly slow, and it earns its
moment.

## Surface 8 — Mobile

**Live behavior:** I cannot directly confirm. The viewport meta tag is set
correctly (`width=device-width, initial-scale=1, viewport-fit=cover`). The
inline styles use `clamp()` functions for fluid typography in several
components (e.g., `KingdomTabNav.jsx` tab labels use
`clamp(10px, 1.4vw, 11px)`). The font preloading is set up correctly.

**Concern:** the site has not, to my knowledge, been deliberately
smoke-tested on a real phone. Given that 60–70% of Catholic-app users on
peer apps (Hallow, Bible in a Year, Word on Fire) arrive on mobile, the
absence of an actual phone walk-through is a real gap. This is one of the
single highest-leverage tests you can run before soft launch.

## Summary of what is shipped

The site is, by any honest measurement, *good*. Better than most Catholic
sites I have searched. The typography is disciplined. The vocabulary is
internally consistent. The architectural choices (the three tabs, the
seven verbs, the 3-1-3 pattern, the Five Houses, the Field Guide) all map
back to the Master Vision. The legal pages are unusually humane. The
auth flow works.

The gap between what is shipped and what the Master Vision describes is
not a quality gap. It is a scope gap. The Companion AI is stubbed. The
Academy reader does not exist. The daily email is not wired. Apple OAuth
is not implemented. The Field Guide does not have a permanent home outside
the V2 monolith. None of these are bugs in the shipped product — they are
phases yet to be built.

The work the deployed site does on its own — Gate, Course landing, Hub,
auth, privacy/terms — is enough to put in front of testers. The rest is
what comes next.

---

# PART III — REVIEW BY PROFESSIONAL LENS

Each section is the recommendation of one professional discipline,
imagined as if it had reviewed the site as deployed. Each ends with a
ranked list of what to change. The full prioritized cross-disciplinary
list is in Part VIII.

## Lens 1 — The UX / Product Designer

> *"The first thirty seconds decide. Everything else is bonus."*

The UX of the deployed site is, in technical terms, *good* — disciplined
information hierarchy, clear typography, intentional vertical rhythm,
restrained color palette. But UX is not assessed in technical terms. It is
assessed by what a stranger does in the first thirty seconds. The UX
designer's first observation is that **the Gate does not yet have a clear
primary call-to-action above the fold**. The Hero is beautiful and the
headline lands, but a visitor with a 30-second attention budget will scroll
past the body copy without an explicit signal that *this site invites me to
do something*. The pattern Hallow uses on its homepage — Hero headline,
sub-head, one button ("Try free for 14 days"), nothing else — is what
should be considered.

The counter-argument is that the Gate is not a marketing landing page; it is
a catechetical prologue. A premature CTA cheapens the encounter. This
tension is real and worth deciding deliberately. My recommendation: an
unobtrusive but present "Begin" affordance, perhaps rendered as a small
gold-rule horizontal line with the word "ENTER" in small-caps centered,
placed at the bottom-right of the Hero. Visible but not clamoring. Clickable
to scroll to the signup invitation.

The second UX issue is **modal verticality**. The SignupModal, on a phone
screen, will likely require scrolling — Google button, divider, name, email,
"where are you starting from," submit. Five fields plus a button is a lot
for a phone modal. The "where are you starting from" field, in particular,
is a free-text affordance that may either be brilliant (calibrating
personalization) or a 10% abandonment driver (because seekers don't know how
to answer). Make it optional, clearly. Better still: collect this *after*
signup, on the Course landing, as a one-question prompt that is easier to
skip than to refuse mid-signup.

The third UX issue is **the silence of the stub Companion**. The ASK button
is in the chrome on every page. When clicked today, it presumably opens a
disabled or empty Companion surface (I cannot confirm exact behavior
without runtime access). Either way, the absence of a clear placeholder
("The Companion will be available later in your walk — for now, your daily
reading and the Field Guide are your guides") is a failure mode. A button
that does nothing is worse than no button.

The fourth is **the lack of visible progress for the returning user**.
"Hello, Adam. Day 1 of 7" is the right shape, but on Day 7, on Day 22, on
Day 49, the user needs to *see* the streak. Duolingo's flame icon is famous
because it works. Even a soft, brand-appropriate variant — "You have walked
12 days. Today is Day 13." — would compound retention.

**Top UX recommendations, in priority order:**

1. Add a quiet but present CTA at the bottom-right of the Gate Hero ("ENTER"
   or "BEGIN" linking to the signup invitation deep in the scroll).
2. Make the SignupModal one field shorter; collect "where are you starting
   from" *after* signup, on the Course tab as a one-question prompt.
3. Replace the stubbed Companion behavior with an explicit placeholder
   ("Coming on Day 8 of your walk" or similar).
4. Show streak count visibly on the Course tab landing once the user has
   passed Day 1.

## Lens 2 — The Brand Strategist

> *"A brand is what people say about you when you leave the room."*

The deployed site has a real brand. The brand strategist's first
observation is that this is rarer than it sounds. Most Catholic projects
have a *visual identity* (a logo, a color palette, a fontset) but not a
*brand* — a clear emotional and intellectual position in the user's mind.
The Kingdom Course already has one. The brand reads as:

- **Serious.** This is not a children's app, not a sentimental devotional,
  not a parish bulletin. The typography alone communicates that the work
  inside is for adults.
- **Old.** The Cormorant Garamond italic, the Latin motto, the small-caps
  eyebrows — all of these gesture to two thousand years of Tradition. The
  brand is not embarrassed about being Catholic in the patrimony sense.
- **Quiet.** Paper, gold, wine, ink. No screaming colors. No exclamation
  marks. The brand whispers.
- **Confident.** "The single greatest announcement in history has also been
  the most rigorously verified." That is a brand sentence. It states a
  proposition without hedging.

This is an extraordinary position. The brand strategist's worry is that
the brand is *not yet known*. A brand is a promise, and a promise can only
be kept if it is heard. The brand strategist's recommendations:

**The single greatest brand asset is the motto.** *Salus animarum suprema
lex.* This Latin phrase — used by the Church for centuries to describe the
norm that overrides every lesser law — should be present at every meaningful
touchpoint. It is currently in the footer. It should also be at the very
end of the privacy page (it is). It should also be in the verification email
(it is not, but easily could be). It should also be inscribed somewhere
visible in the welcome to a new signup. Used carefully, this Latin tag will
become to The Kingdom Course what "Where Catholics come to pray" became to
Hallow — a phrase that bears the brand on its back.

**The brand voice is not yet codified.** Read the Gate Hero, the Day 1 card
subtitle, the Privacy page, the Terms page — these are *almost* the same
voice, but not quite. The Gate is rhetorical and declarative ("The single
greatest announcement…"). The Day 1 card is staccato and verbal ("Meet the
King. Learn who you are."). The Privacy page is plain and direct. The Terms
page is pastoral and slightly liturgical. These are all good voices — but a
brand needs one. My recommendation: a one-page internal "Voice and Tone
Guide" that codifies the voice in three or four lines, with five examples
of "do this" and five of "avoid this." This will pay off across thousands
of future content decisions.

**The brand has a positioning gap.** The site does not yet make crystal
clear *what it is* on the homepage. Compare to Hallow's homepage tagline:
*"The #1 Catholic app for prayer, meditation, and sleep."* You may not love
that sentence, but it is *unambiguous*. The Kingdom Course's tagline in the
footer is *"A doorway to the kingdom of heaven. The Gospel meets you. The
Course forms you. The Kingdom holds you."* That is a beautiful sentence and
a brand-defining piece of writing — but it is *in the footer*. Move it to a
position of prominence, ideally as a subhead on the Gate, immediately
beneath the Hero.

**Top brand recommendations:**

1. Codify the brand voice in a one-page internal Voice and Tone Guide.
2. Use the Latin motto at every meaningful touchpoint, especially the
   verification email and the post-signup welcome.
3. Promote the tagline "The Gospel meets you. The Course forms you. The
   Kingdom holds you." from the footer to the Gate Hero subhead area.
4. Decide whether the brand positions against Hallow (the prayer-and-sleep
   app) by being the *formation* app, or alongside Hallow as a complement.
   Currently the positioning is ambient. Make it explicit.

## Lens 3 — The Conversion / Growth Specialist

> *"Every funnel has a leakiest stage. Find it. Fix it. Find the next."*

The growth specialist asks a single question: of the people who arrive at
`kingdomcourse.org`, what percentage end up walking Day 50? Every other
metric is a proxy.

The funnel, as constructed, has six stages:

1. **Arrival.** Some person lands at the URL — referral, search, click on a
   shared link. Today, with zero marketing, this is functionally zero.
2. **Hero engagement.** They read the Gate Hero. They scroll, or they leave.
3. **Decision to sign up.** They click SIGN IN.
4. **Signup completion.** They complete either Google OAuth or email + code.
5. **Day 1 engagement.** They click into the Day 1 card. They read it.
6. **Day 50 completion.** Seven weeks later, they finish the Course.

The growth specialist's first observation is that **the funnel has no
unauthenticated CTA**. There is currently no way for a visitor to engage
with the Course's content without signing up. This is a deliberate choice
(commitment is the goal), but it is also a 60–80% top-of-funnel leak. The
recommendation is *not* to lower the commitment threshold — the threshold
is part of what makes the Course meaningful. The recommendation is to add
an *adjacent* low-commitment doorway. The simplest version: a "Read the
Gospel" link on the Gate that opens the kerygma in modal or scroll without
requiring signup. This lets a curious-but-not-ready visitor receive
*something* — the actual core of the Gospel — without converting. Some
fraction of those will return and convert later.

The second observation is that **the time from signup to "I am clearly
making progress" is too long**. After signup, the user sees "Hello, [name].
Day 1 of 7." This is correct but undersells the moment. A signed-up user
has crossed a threshold. The first screen they see after signup should
*celebrate that* in a way the current Course tab does not. Hallow's
signup-to-first-prayer flow is the relevant comparison: when you sign up,
Hallow takes you through a 20-second guided onboarding that calibrates
your interests and *immediately* delivers a personalized prayer suggestion.
The signal is: *you did the right thing by signing up; here is what comes
next, served warm*.

The third observation is **the absence of retention scaffolding**. There is
no daily email yet. No streak counter. No push notification. No "see what
the saints did today" daily nudge. This is fine for soft launch (the goal
is qualitative, not retention math), but for broad launch, the absence of
these will produce a steep drop-off curve. The IMPLEMENTATION_PLAN.md
already identifies Resend + Vercel cron as the path; this should be
prioritized.

The fourth is **the absence of social proof**. Sites that successfully
convert seekers almost always include — at the bottom of the funnel, just
before the commit moment — some form of social proof. Testimonies. Names.
Counts. ("12,000 souls have walked Day 1 this year.") The Kingdom Course
currently shows none. This is partly because there are no testimonies yet
(too early), but the *absence of the affordance for testimonies in the
design* is the gap. When testimonies arrive (and they will), there should
be a designated place for them. Plan now where they live.

**Top conversion recommendations:**

1. Add an unauthenticated "Read the Gospel" doorway on the Gate that
   delivers the kerygma in modal or scroll without signup.
2. Design a 20-second post-signup onboarding moment that celebrates the
   commitment and warms up Day 1.
3. Prioritize Resend daily email + a simple streak counter as the first
   retention scaffolding after soft launch.
4. Reserve a place in the design for testimonies and "souls walking" counts,
   even though both are currently empty.

## Lens 4 — The Copywriter / Editor

> *"Read every sentence aloud. The ones that make you wince are the ones to
> fix."*

The copy of the deployed site is, on balance, very good. It is far above
the average for Catholic web copy. The Gate Hero in particular contains
some of the strongest evangelistic prose I have seen in any Catholic web
property — *"the most rigorously investigated supernatural assertion in
human history"* is a real sentence.

But the copywriter notices some specific issues.

**Issue 1: voice drift between surfaces.** As observed in Lens 2 (Brand),
the voice is *almost* but not quite consistent. The Gate Hero is rhetorical
and declarative. The Day 1 card subtitle is staccato and verbal. The
Privacy page is plain and direct. The Terms page is pastoral. These are
acceptable variants but they should be deliberate, not accidental. A Voice
and Tone Guide (one page) would resolve this.

**Issue 2: "the Kingdom of eternal life" appears in the Gate Hero eyebrow
but does not appear in this exact form anywhere else.** The phrase is
beautiful but currently lives in only one place. The Gate establishes the
phrase; the Course and Hub should pick it up at least once each, so a
reader internalizes it as a recurring motif. Currently the Course tab says
*"7 Essentials of the Kingdom of Heaven"* — *kingdom of heaven*, not
*kingdom of eternal life*. Both are scriptural; they should both be used
*deliberately*, not interchangeably.

**Issue 3: "Hello, Adam." vs. "Hello, [name]."** The personalization is
correct. The format is correct. But "Hello, Adam." reads as a *salutation*
rather than a *welcome*. Compare to *"Welcome back, Adam — the Course is
holding your place."* The current copy is fine; the alternative is warmer.

**Issue 4: the SignupModal field labels.** The free-text "Where are you
starting from?" is the most exposed field on the site, in conversion
terms. Its current label is gentle but ambiguous. *Starting from* could mean
geographical, biographical, spiritual, or chronological. A clearer (still
gentle) variant: *"In one sentence — what is bringing you here today?"* That
is harder to refuse and easier to answer.

**Issue 5: the verification email subject.** Currently *"Kingdom Course /
Verification code: XXXXXX"*. Functional but cold. The subject is the only
piece of the email a user reads in the inbox. A warmer variant:
*"Your Kingdom Course door — code XXXXXX"* or even *"Welcome to the walk —
code XXXXXX"*. These are small, but the inbox is a high-attention surface.

**Issue 6: "BEGIN HERE · STEP 1 · SEE · DAY 1 OF 7."** This is wonderful
copy at desktop sizes. On a phone, it likely line-wraps awkwardly. Either
shorten ("STEP 1 · DAY 1 OF 7") or design it explicitly to wrap with line
breaks that respect the rhythm.

**Issue 7: the Latin motto at the bottom of the page is unglossed.** *Salus
animarum suprema lex.* is gorgeous, but a first-time Catholic visitor may
not know what it means. Two options: (a) add a small italic translation
underneath in the footer for the first six months, then remove once the
phrase has caught; or (b) leave it untranslated and trust the curious to
look it up. Option (b) is more confident but option (a) is more pastoral.

**Issue 8: pronoun consistency.** The Gate uses third-person ("Two thousand
years ago, the Son of God walked among us…"). The Course tab uses
second-person ("Meet the King. Learn who you are."). The Privacy page uses
first-person plural ("We collect…"). These shifts are mostly correct, but
the move from "the King" in third-person mode to "the King" addressed
indirectly should be deliberate.

**Top copy recommendations:**

1. Write a one-page Voice and Tone Guide that codifies the brand voice and
   resolves the drift between surfaces.
2. Decide deliberately between "the Kingdom of eternal life" and "the
   Kingdom of heaven" and use each in the right contexts.
3. Rewrite the SignupModal "starting from" field label to "In one sentence
   — what is bringing you here today?"
4. Soften the verification email subject to something warmer than the
   default.
5. Consider an unglossed-vs-glossed decision for the Latin motto in the
   footer, at least for the first six months.

## Lens 5 — The Catechist / Theologian

> *"The deposit of faith is not a menu. It is a gift, given whole."*

The catechist's review is the most important in this document, because if
the site teaches falsely it does harm regardless of how well it does
everything else. The good news is that *what is currently on the site
appears doctrinally sound*. The Gate Hero's claim that the Resurrection has
been "the most rigorously investigated supernatural assertion in human
history" is defensible and follows the Master Vision's chapter on the case
for the Resurrection. The references to Eucharistic miracles (host →
cardiac tissue), Marian apparitions, incorruptibles, and the communion of
saints all map to the Catechism and the Master Vision's Miracles outline.

The catechist's first concern is **the catechetical balance of the Gate**.
The Hero leads with evidence and miracles. This is correct in our age (an
age that has lost the supernatural and needs to be reawakened to it), but
it is *not* the order of the kerygma as the Church traditionally proclaims
it. The classical kerygma is:

1. *God loves you.*
2. *Sin is real.*
3. *Christ saves.*
4. *Respond in faith.*

The Gate's current emphasis is closer to:

1. *The Kingdom is verified.*
2. *Meet the King.*
3. *Receive the Spirit.*
4. *Cross the threshold.*

These are both legitimate Gospel framings. The Master Vision's Book 1
opens with the classical kerygma and then introduces the evidence. The
*deployed Gate* leads with the evidence and assumes the kerygma will be
introduced later. This is a defensible apologetic strategy for a culture
that has lost belief in the supernatural — but it requires that the
kerygma be introduced *clearly* somewhere downstream. Verify that the Day 1
content delivers the kerygma in its classical form. If it does not, that
is the single most important catechetical addition.

The catechist's second concern is **the relationship to the parish and the
sacraments**. The site mentions sacraments ("a life that begins on earth,
in the sacraments and in communion with a living God") but does not yet
have a clear mechanism for connecting a digital walker to their actual
parish. This is a serious issue at scale. The salvation of souls is not
accomplished by reading; it is accomplished by sacramental life. A digital
formation tool that does not point clearly and repeatedly to local
sacramental life risks becoming a Protestantizing influence — a tool that
forms minds without forming bodies, sacraments, and ecclesial belonging.

The Master Vision is explicit about this (the "channel-agnostic community
language" preserves the teaching about in-person community as organic
fruit), but the deployed site does not yet have a visible parish-bridge
affordance. A simple version: a footer block titled *"Your Parish"* with a
sentence ("The Course is incomplete without the sacraments. Find your home
parish.") and a link to a Find-a-Parish search (USCCB's
[parishesonline.com](https://parishesonline.com) for the US, similar for
Canada). This is one of the highest-pastoral-value additions you could
make.

The catechist's third concern is **the Marian dimension**. Marian devotion
is constitutive of Catholic life. The current Hub on the day reviewed (May
13, the Memorial of Our Lady of Fatima) does include Marian content
beautifully. But the *consistent* Marian presence across surfaces is not
yet evident. The brand should know what its Marian commitment looks like
across the site. A small example: every Saturday traditionally is a Marian
day in the Church's calendar — a quiet eyebrow on Saturdays acknowledging
this would compound over time.

The catechist's fourth concern is **the language of "DTS" vs. "Course"**.
The Master Vision uses "The Kingdom DTS" for the seven-book series. The
deployed site uses "The Kingdom Course." This is correct per the locked
canonical decision ("DTS = internal/post-threshold only; never in
marketing"), and it is correct strategically. But the catechist notes that
"DTS" itself is borrowed from YWAM (Youth With A Mission), a *Protestant*
movement. Using the term internally is fine; using it ever publicly would
require a clear catechetical statement of *why we appropriated this name
and what we mean by it that is different from the Protestant original*.

The fifth concern is **the depth-to-accessibility ratio**. The Master
Vision is enormously deep — 4,000+ pages of source content across the seven
books, the Field Guide, and Miracles. The current site exposes a thin
sliver. This is correct for Tier 1 (the Kingdom Course must be walkable in
seven weeks; the depth lives in the Academy at Tier 2). But the catechist
worries that *first-time visitors will not know how deep the well is*. The
site should signal — somewhere visible — that this is the surface of a
much larger formation system. Otherwise serious seekers may dismiss it as
a 50-day program and miss what is underneath.

**Top catechetical recommendations:**

1. Verify that Day 1 explicitly delivers the classical kerygma (God loves
   you / Sin is real / Christ saves / Respond in faith). If it does not,
   make sure it does before broad launch.
2. Add a visible parish-bridge affordance somewhere standard (footer or
   Hub) — *"The Course is incomplete without the sacraments. Find your
   home parish."* with a Find-a-Parish link.
3. Make the Marian dimension consistently visible across surfaces, not
   only on Marian feast days.
4. Add a small "Beneath this is more" signal — even a footer phrase
   acknowledging that the Course is the first tier of a larger seven-book
   formation.

## Lens 6 — The Pastoral Counselor

> *"The wounded soul should be safer here than anywhere else on the
> internet."*

The pastoral counselor reviews the site with one population in mind: the
person who arrives in fragile condition. Some fraction — perhaps 5%, perhaps
20% — of every soul who arrives at a Catholic formation site is in a state
of acute spiritual or emotional difficulty: recently divorced, recently
bereaved, recently traumatized by the Church, recently traumatized by life,
suicidal, addicted, post-abortion, abuse survivor. This is not a marginal
case. It is the inheritance of the modern pastoral moment.

The deployed site does several things very well for these visitors:

- The Terms page includes a visible 988 crisis-resource callout. This is
  rare for Catholic sites and unambiguously right.
- The Privacy page is unusually plain and trustworthy. A wounded user who
  fears being tracked or marketed to gets clear assurance.
- The journal fields in the Daily Examen and Lectio Divina are
  device-local, not server-stored. This matters enormously for survivors of
  spiritual abuse who do not want anyone — including the operator — to
  read their reflections.

The pastoral counselor's first concern is **the absence of a visible
"help" affordance**. There is currently no mechanism in the chrome for a
user to reach a real human in distress. The ASK button, when wired, will
go to an AI Companion. That is fine as a *formation* affordance. But it is
not, by itself, sufficient as a *safety* affordance. The site should have,
somewhere always visible (probably in the footer, beneath the motto), a
quiet "If you are in crisis" link that opens a panel with the 988
callouts, the Catholic Counselors directory, and the suggestion to contact
a priest. This is a small addition that signals *we know some of you are
in pain, and we will not leave you alone*.

The second concern is **the silence around mental illness in the
catechetical voice**. The Catholic tradition has a long, rich pastoral
literature on the relationship of spiritual practice to mental health: the
distinction between scrupulosity and contrition, the dark night of the
soul vs. clinical depression, the difference between desolation and
despair, the necessity of medical and psychological care alongside (not
instead of) spiritual care. None of this is yet visible on the deployed
site. The Terms page mentions that the practices are not a substitute for
medical care — that is good — but the *positive teaching* (that the saints
themselves struggled with what we would now call mental illness, that
Therese of Lisieux had panic attacks, that JP2 endured prolonged
darkness) is missing. As the Companion comes online, this teaching will
need to live somewhere — and the Companion's training will need to know
when to redirect a user to a real professional.

The third concern is **the language around sin**. The Master Vision's
treatment of sin is theologically correct (universal, real, requiring
diagnosis before treatment). But the *first-time visitor in a fragile
state* may experience direct "sin is real" language as accusatory. The
pastoral counselor recommends that the Day 1 and early-week content
introduce the language of sin within the frame of *being loved first*. The
classical kerygma puts "God loves you" before "Sin is real" for exactly
this reason. The order matters pastorally.

The fourth concern is **the Companion's training**. The Companion is
currently stubbed. When it is wired, it will receive questions from users
in every state — including states the Companion is not equipped to handle.
Its training and system prompt must include explicit protocols for: (1)
recognizing acute crisis language and redirecting to 988 / local
emergency / a priest; (2) not attempting to provide therapy; (3) not
attempting to provide sacramental absolution; (4) clear humility about its
own limits ("I am a digital companion. For this question, you need to
speak with a human").

**Top pastoral recommendations:**

1. Add a quiet "If you are in crisis" link in the footer that opens a
   safety panel with crisis hotlines, Catholic counselor directories, and
   the suggestion to speak with a priest.
2. Plan now for the Companion's safety training and system-prompt
   protocols, so they are ready when the backend is wired.
3. In the catechetical content of Day 1 and the early weeks, place "God
   loves you" before "sin is real" in the user's narrative experience.
4. Add a positive teaching about Catholic mental-health pastoral
   wisdom somewhere — probably as a Field Guide entry — that distinguishes
   spiritual desolation from clinical depression and counsels professional
   care.

## Lens 7 — The Web Architect

> *"The site must run for ten years on a budget that does not bankrupt the
> mission."*

The architecture of the deployed site is, in technical terms, *clean*. Vite
build, React 18-ish, inline styles, no external CSS framework, Clerk for
auth, Vercel for hosting, Vercel Edge Functions waiting for the Companion
backend. The build is fast. The bundle is reasonable. The dependencies are
modest. This is the right shape for a mission-driven solo-operator project.

The architect's first observation is **the absence of error monitoring**.
There is no Sentry, no Rollbar, no equivalent. If a user encounters a
production error today, you will not know unless they tell you. For a
soft launch this is acceptable. For broad launch it is not. The
IMPLEMENTATION_PLAN.md already identifies Sentry; install it before broad
launch.

The second is **the absence of performance monitoring**. There is no
Lighthouse CI, no Web Vitals capture, no automated audit. The site is
likely fast enough today, but with no monitoring you will not know when a
future change regresses. Vercel Analytics has a free tier that captures
Web Vitals; consider enabling it (with a privacy disclosure update).

The third is **the bundle question**. The site uses Cormorant Garamond + EB
Garamond + Cormorant SC from Google Fonts, with extensive weight and italic
variants. This is a substantial font payload. The preload tags are present
(good), but the architect recommends measuring real-world TTFB (time to
first byte) and FCP (first contentful paint) on a 3G connection. For a
project that aspires to serve "every soul on earth," low-bandwidth
performance is a salvation-metric issue. (More on this in the SEO and
accessibility lenses.)

The fourth is **the auth-state hydration**. The site uses Clerk's
`useUser()` hook to determine auth state. There is a brief moment on first
page load where the auth state is `null` (unloaded), then resolves to
either signed-in or signed-out. If the user opens a stale tab from a phone
home screen, this hydration is visible — there can be a flash of the
signed-out UI before the signed-in state takes over. Consider a brief
skeleton state or a "loading" gate.

The fifth is **the SPA fallback and the static pages**. The privacy and
terms pages are static HTML in `public/`. Vercel's clean-URL config
correctly serves these without `.html`. But the site's SPA fallback (Vite
serves `index.html` for unknown routes) means that hitting an unknown URL
like `/about` will return the SPA, not a 404. Decide deliberately: do you
want unknown URLs to fall through to the Gate (current behavior), or to
return a 404 page? A custom 404 is a small craft addition.

The sixth is **the manifest and PWA installability**. The manifest includes
the required icons (now), the start_url, the theme color. The site is
*PWA-installable* on iOS and Android home screens. This is a real
opportunity. A user who installs the site as a PWA gets a dedicated app
icon, full-screen mode, no browser chrome. For a daily-walking formation
product, this is meaningfully better than a bookmark. Consider an
installation prompt for returning users on Day 3 or 7: *"Add the Kingdom
to your home screen for daily access."*

The seventh is **the Companion API design**. When the Companion is wired,
`api/companion.js` as a Vercel Edge Function will proxy Anthropic API
calls. The architect's recommendations: (a) rate-limit per-user (Clerk
user ID as the key) to prevent abuse; (b) implement a content-safety filter
before sending user messages to Anthropic, to catch crisis language and
redirect; (c) implement a system-prompt that includes the project's
canonical decisions, the kerygma framing, the parish-bridge instruction;
(d) log conversations only with consent and in a way that does not
compromise privacy commitments.

**Top architectural recommendations:**

1. Install Sentry free tier for error monitoring before broad launch.
2. Enable Vercel Web Vitals or Plausible-equivalent performance capture.
3. Audit real-world performance on 3G mobile; consider font subsetting if
   the payload is heavy.
4. Add a custom 404 page that gently routes users back to the Gate.
5. Design the Companion API with rate-limiting, content-safety, and
   logging-with-consent from day one.
6. Test PWA installation flow and consider a "Add to Home Screen" prompt
   for returning users.

## Lens 8 — The Mobile / Responsive Designer

> *"If it does not work on a $200 Android with a cracked screen in
> daylight, it does not work."*

I cannot directly run the deployed site on a real device, but the source
code review and the inline-style patterns let me anticipate concerns.

**Concern 1: the SignupModal on small viewports.** The modal has, by my
count, five interactive elements (Google button, divider, two text inputs,
optional textarea, submit). On a 360px-wide screen (a common low-end
Android width), this modal will require vertical scrolling. The user must
scroll *inside the modal*, which can cause confusion. Either reduce fields
(see Conversion Lens), or design the modal explicitly for mobile with a
single scrollable column and a fixed-bottom submit button.

**Concern 2: the seven-verb progress bar on the Course tab.** The bar
displays SEE · KNOW · HEAL · ABIDE · GO · BUILD · SEND across the screen.
On desktop this is beautiful. On a 360px screen, seven labels in a single
row will either truncate, wrap, or shrink to illegibility. Inspect this on
a real phone. If it's broken, the right design is probably a vertical or
two-row variant for mobile.

**Concern 3: the 3-1-3 Hub strip on small screens.** The seven glyph
strip (3 preparing, At the Altar centered, 3 sent forth) on the Kingdom
tab is one of the strongest design elements on the site. On mobile this
will need careful adjustment — probably collapsing to a single-row scroll
of glyphs with the central altar glyph emphasized.

**Concern 4: typography fluidity.** The site uses `clamp()` for some
typography but not all. Check that all `font-size` declarations either use
`clamp()` for fluidity or have explicit mobile breakpoints. A 90px Hero
headline that doesn't scale below 60px on mobile will overflow.

**Concern 5: tap target sizes.** The footer "Privacy" and "Terms" links
I just added are small-caps inline links inside a paragraph. On mobile,
these tap targets are likely under 44×44px (the Apple HIG minimum) and
under 48×48dp (the Material minimum). Add padding to make them tappable
on a phone.

**Concern 6: the ASK button on the floating bottom-right corner.** From
screenshots, the floating "ASK" button is fixed bottom-right. This is a
mobile-aware decision. On mobile, ensure it does not cover important
content — particularly on the Day 1 reading screen, where the right-bottom
corner often holds a "next" affordance.

**Concern 7: orientation.** The site renders portrait beautifully on
desktop. Does it render landscape on a tablet held sideways? Does it
render on a phone in landscape (for users who turn their phones to read
long form)? Test all three.

**Concern 8: safe areas.** The viewport meta includes
`viewport-fit=cover`, which is correct for full-bleed iPhone designs.
But the inline styles must respect `env(safe-area-inset-*)` for the
home-indicator overlap on iPhone X+. Check the footer and the floating
ASK button particularly.

**Top mobile recommendations:**

1. Walk through every surface on a real phone (yours, or any tester's).
   Note every awkward moment. This is the highest-leverage testing you
   can do before sending the soft-launch link.
2. Design a mobile-specific SignupModal — single column, fixed-bottom
   submit, scrollable interior.
3. Test the seven-verb progress bar and the 3-1-3 Hub strip explicitly
   on a 360px viewport. Redesign if they break.
4. Ensure all tap targets meet the 44×44 (iOS) / 48×48 (Material) minimum.
5. Test PWA installation on both iOS Safari and Android Chrome.

## Lens 9 — The Accessibility Specialist

> *"Accessibility is not a compliance burden. It is the salvation of souls
> who use screen readers."*

Accessibility for a Catholic formation project is not only a moral
imperative but a market reality. According to WebAIM's WCAG 2.2 reviewers,
roughly 27% of US adults live with some form of disability. The site that
serves only the able-bodied digital native excludes a Catholic population
that desperately needs the formation on offer.

**Concern 1: color contrast.** The site uses paper (`#F6EFDE`) as
background with gold (`#B5883F`) for accents and italic display type. The
contrast ratio of gold-on-paper is roughly 3.5:1 — below WCAG AA (4.5:1)
for body text, marginal for large display text. The wine (`#6B1E1E`) and
ink (`#0E0A06`) text colors have much better contrast. Audit every place
gold is used for *information-bearing* text (not decorative) and either
darken the gold or increase the font weight for text purposes.

**Concern 2: focus states.** Inline-style components do not always include
`:focus-visible` styles. A keyboard-only user (or a user with a screen
reader) needs visible focus rings on every interactive element — buttons,
links, form fields, tab triggers. Audit every interactive element and
ensure focus state is visible.

**Concern 3: semantic HTML.** The tab system uses `role="tablist"` and
`aria-selected` (good), but the screenshots show some interactive
elements (the brand mark, the Pass it on button) that may not be semantic
buttons. Ensure every clickable element is either a `<button>` or an
`<a>` with appropriate ARIA.

**Concern 4: screen reader landmarks.** The site should have a clear
landmark structure: `<header>`, `<nav>`, `<main>`, `<footer>`. The screen
reader user can jump between landmarks. Audit each page (Gate, Course,
Hub, Privacy, Terms) for proper landmark use.

**Concern 5: alt text on the SVG brand mark.** The header brand mark is
an inline SVG. The current code uses `aria-label="The Kingdom — home"`
which is correct. Verify this aria-label is consistent across all brand
mark instances (header, footer).

**Concern 6: form labels.** The SignupModal form fields must have
explicit `<label>` elements or `aria-label`. Visually-attractive label
patterns (placeholder-only, floating label) often fail accessibility
audits.

**Concern 7: reduced motion.** Users with vestibular sensitivity can
have severe reactions to motion. The brand mark has a hover-rotate
animation. The Companion button likely animates. Wrap motion in
`@media (prefers-reduced-motion: reduce)` queries and disable it for
users who have set that preference.

**Concern 8: language and complexity.** Some Catholic vocabulary —
"Memorial of Our Lady of Fatima," "Via Purgativa," "Magisterium" — will
not be understood by every visitor. Consider tooltips or expandable
glosses for theological vocabulary on first use. This serves both
non-Catholic seekers and Catholics with cognitive disabilities.

**Concern 9: low-bandwidth visitors.** Some of the souls "every soul on
earth" includes are in places with $5/month phone plans and intermittent
3G. The Google Fonts payload, the manifest icons, the React bundle —
test the site on a throttled 3G profile. If it takes more than 3 seconds
to FCP, design a graceful degradation.

**Concern 10: the prayer of the heart.** A specific accessibility
observation that is also pastoral: many Catholics with serious chronic
illness, declining vision, or terminal conditions are looking for digital
formation precisely because they cannot easily attend in-person. Their
needs include large-text modes, audio versions, voice-control
compatibility. Plan for them.

**Top accessibility recommendations:**

1. Run a WAVE / axe accessibility audit on every page; fix anything that
   surfaces.
2. Audit gold-on-paper contrast for any text-bearing use; darken or
   thicken.
3. Add visible `:focus-visible` styles to every interactive element.
4. Add `@media (prefers-reduced-motion: reduce)` wrappers around
   animation.
5. Plan for a future audio version of the Day-by-Day content —
   particularly important for the elderly and visually-impaired
   Catholics the project aspires to serve.

## Lens 10 — The SEO / Discovery Specialist

> *"The soul who has never heard of you must be able to find you."*

The SEO specialist's first observation is that **the site is not yet
discoverable**. There is no sitemap.xml. The meta description is set
correctly (*"The Gospel meets you. The Course forms you. The Kingdom holds
you. A Catholic spiritual formation initiative."*). The Open Graph tags
are in place. But the deeper structural elements that compound over years
are missing.

**Concern 1: no sitemap.xml.** Add `public/sitemap.xml` listing the
canonical URLs (`/`, `/privacy`, `/terms`, eventually the public-facing
Course preview pages if you ever add them). Submit to Google Search
Console.

**Concern 2: no robots.txt.** Add `public/robots.txt` with a simple
permissive policy and a sitemap reference. This is table stakes.

**Concern 3: indexable content vs. SPA.** The Gate's Hero is rendered
client-side. Google's crawler does render JavaScript now, but it does so
inconsistently for low-PageRank sites. Consider whether the Gate's
evangelistic content (the Hero, the kerygma, the case for the Kingdom)
should be available as static HTML that is fully indexable. This may
mean a pre-rendered version, or a marketing route at `/about` that
mirrors the Hero in plain HTML.

**Concern 4: structured data.** The site is a Catholic apostolate. Add
`schema.org/Organization` and `schema.org/EducationalOrganization`
structured data. This helps Google understand what the site is and may
qualify it for knowledge-panel display.

**Concern 5: long-tail content.** The IMPLEMENTATION_PLAN.md anticipates
the Academy reader. When the Academy comes online, every chapter of every
book is a long-tail SEO opportunity. *"What does the Catholic Church
teach about the Resurrection?"* *"How do I begin the Daily Examen?"*
*"What is the Catholic understanding of the Dark Night?"* Each of these
is a question someone is searching today. A well-designed Academy with
clean URLs, semantic HTML, and schema markup could rank for hundreds of
catechetical queries within 2–3 years.

**Concern 6: backlinks.** SEO is, in 2026 as in 2006, fundamentally a
function of who links to you. The Catholic ecosystem has a few key node
sites (USCCB, Word on Fire, Hallow, Ascension Press, EWTN, Catholic
Answers). Plan a long-arc outreach: get one well-placed mention from
each. The single most valuable link is from an established Catholic
intellectual (Bishop Barron, Fr. Mike Schmitz, Edward Feser, Brandon
Vogt, John Bergsma).

**Concern 7: social discovery.** The site has no social presence yet.
This is fine for soft launch. For broad launch, the question is whether
to build a presence on the platforms (Instagram, X, YouTube, TikTok) or
to operate without — relying purely on word-of-mouth and search. There
is a real Catholic argument for the latter (refusing the attention
economy on theological grounds), and a real strategic argument for the
former (going where the souls actually are). My recommendation: a
minimal presence on YouTube (where long-form Catholic content lives —
think Word on Fire, Ascension, Pints with Aquinas) and *one* short-form
platform chosen deliberately. Not all five.

**Concern 8: the kingdomcourse.org domain itself.** The domain is
excellent: it's the same as the product name; it's clear; it's memorable;
the .org communicates non-commercial. This is a real asset. Do not
fragment it across many domains.

**Top SEO / Discovery recommendations:**

1. Add `public/sitemap.xml` and `public/robots.txt`.
2. Add `schema.org/Organization` structured data on every page.
3. When the Academy ships, design every chapter URL for long-tail
   discoverability.
4. Plan a single high-quality backlink from a recognized Catholic
   intellectual within the first year.
5. Choose deliberately between social presence and refusal; do not drift
   into both.

## Lens 11 — The Data / Analytics Architect

> *"You will get what you measure. Measure souls."*

The deployed site has *no analytics*. This is deliberate (the
IMPLEMENTATION_PLAN.md is explicit about avoiding Google Analytics) and
correct on privacy grounds. The plan is Plausible, post-soft-launch.

The analytics architect's first observation is that **the metrics that
matter for this project are not the metrics analytics tools naturally
surface**. A normal SaaS analytics dashboard shows: daily active users,
session duration, bounce rate, conversion to signup, signup to payment,
churn. These are *all* the wrong primary metrics for The Kingdom Course.

The right metrics are *salvation metrics* — observable proxies for the
spiritual reality the site exists to serve. Examples:

- **Day 50 completion rate.** Of users who sign up, what fraction reach
  Day 50 (the threshold to the Academy)? This is the core metric. Hallow
  doesn't have this; Bible in a Year doesn't have this. You have it.
- **Multi-day return rate.** Of users who walk Day 1, how many return for
  Day 2? Day 7? Day 14? This is the funnel that matters.
- **Sacramental engagement (self-reported).** A post-Day 50 prompt: *"In
  the past 50 days, how often did you attend Mass? How often did you go to
  Confession?"* This is the actual salvation-relevant data.
- **Saints encountered.** A counter on each user's profile: "You have met
  N saints during your walk." Builds awareness of the communion of saints
  as a *visible companionship*, not an abstract doctrine.
- **People shared with.** A counter: "You have shared the Course with N
  people." This is the multiplication metric the Master Vision frames as
  Book 7's core teaching.

**Concern 1: opt-in vs. opt-out.** All of this data must be collected
*with explicit user consent*, framed in pastoral terms ("Would you let us
know how this is going for you? It helps us serve the next walker
better"). The Catholic project must hold a higher data-ethics bar than
secular peers, not a lower one.

**Concern 2: the danger of metric tyranny.** The growth specialist (Lens
3) is right about retention scaffolding. But every metric, once
visible, creates a temptation to optimize for it at the cost of the
mission. If "Day 50 completion" becomes the metric, the temptation will
be to lower the threshold to Day 50 — to make it easier. The catechist
and the analyst must conspire to prevent this. The metric is a proxy.
The mission is souls.

**Concern 3: the Companion logs.** When the Companion ships, every
conversation is potentially valuable data — and potentially privacy-
violating. The strict rule: Companion logs are not retained without
explicit per-conversation consent, and are never associated with the
user's identity for analytics purposes.

**Concern 4: aggregate vs. individual.** Analytics should generally be
aggregate. The site does not need to know what *Maria* did yesterday. It
needs to know what *the 1,247 souls who signed up last week* did. Design
analytics from the start to be privacy-preserving by aggregating before
identifying.

**Top analytics recommendations:**

1. Install Plausible Analytics. Frame the privacy disclosure pastorally.
2. Define five "salvation metrics" before instrumenting anything: Day 50
   completion, multi-day return, sacramental self-report, saints
   encountered, sharing count.
3. Build a Catechist's Dashboard (internal-only) that shows aggregate
   spiritual progress, never individual.
4. Establish a written principle: metrics serve the mission; the mission
   does not serve metrics.
5. When the Companion ships, design the logging architecture to be
   consent-first and aggregation-first.

## Lens 12 — The Pastor / Priest

> *"Will it bring them to Mass?"*

The pastor's review is the last and most important. The pastor cares
about one thing: whether the souls the site serves will actually meet
Christ in the Eucharist, in the confessional, in the parish, in the
Communion of Saints. Everything else is means.

The pastor's first observation is **the site treats Catholicism seriously**.
This is not nothing. Most digital Catholic projects treat Catholicism as a
brand — a set of aesthetic choices, a lifestyle category. The Kingdom
Course treats it as the truth about reality. The brand voice, the
Resurrection-forward Gate, the Latin motto, the seven-week walk to
Pentecost, the 3-1-3 Mass-anchored Hub — all of these signal *we believe
this is true and the truth matters*. The pastor's first reaction is
respect.

The pastor's second observation is **the site does not yet connect the
soul to the parish**. As noted in the Catechist Lens, this is the single
biggest pastoral gap. A digital formation tool that forms minds without
forming bodies-in-pews is not pastorally complete. The recommendation in
the Catechist Lens stands: a visible parish-bridge affordance with a
Find-a-Parish search, present on every page.

The pastor's third observation is **the Eucharistic depth**. The Master
Vision is Eucharist-centered, and the Hub's 3-1-3 pattern with "At the
Altar" as the center is the most beautiful Eucharistic design choice in
any Catholic digital product I have seen. But the *site is not yet
opening this depth to the visitor*. A first-time visitor sees "At the
Altar" as a glyph and a label. They do not yet receive the teaching that
the Mass is the source and summit, that the Eucharist is the Real
Presence, that Catholic life flows from and toward the altar. This
teaching needs to live somewhere — probably in the Day 1–7 content,
probably also as a Field Guide entry, probably also in any future "What
is the Mass?" public-facing page.

The pastor's fourth observation is **the Confession dimension**. The
Master Vision has extensive treatment of Confession (Book 1, Field Guide
Guide 8 and Guide 10). The deployed site does not yet visibly emphasize
Confession. For the Catholic who is returning after years away, the
Confession step is the threshold. Make it visible. A simple Hub block:
*"Have you been to Confession recently? It is never too long. Find a
priest."*

The pastor's fifth observation is **the Marian dimension**. As noted in
the Catechist Lens. Mary is not yet woven into the site as she is woven
into Catholic life.

The pastor's sixth observation is **the question of clerical oversight**.
At the soft-launch scale, this is fine. At broad launch, the question
arises: who is the Catholic authority answering for the catechetical
content of this site? A digital catechetical project at scale, without
ecclesial connection, can become *de facto* a personal teaching
ministry — which is not what the Catholic tradition contemplates. Plan
for a relationship with a local bishop or theological advisor. The
Master Vision is theologically careful; the deployed application
appears to inherit that care; but the structural relationship with the
hierarchy is a real long-term question.

**Top pastoral recommendations:**

1. Add a visible parish-bridge affordance (Find-a-Parish link) in the
   chrome.
2. Make Confession visibly available as a Hub-level prompt.
3. Make the Eucharistic teaching explicit somewhere visible early in the
   walk.
4. Plan for a relationship with a local bishop or theological advisor
   before broad launch.

---

# PART IV — REVIEW BY SEEKER

Each section is an imagined walkthrough of the site from the perspective of
one persona. These are not real users; they are composites of the
demographics every Catholic apostolate engages. They are written in
first-person to make the simulation concrete.

## Persona 1 — Maria, 42, the Lapsed Catholic

> *"My husband asked for the divorce in March. I haven't been to Mass
> since the wedding. My mother left this link in a text message: 'Honey,
> try this. No pressure.'"*

Maria opens kingdomcourse.org on her phone, in bed, at 11:23 PM. The
Hero loads. She reads:

*"The single greatest announcement in history has also been the most
rigorously verified."*

She doesn't scroll. She is not in a state for argument. She is in a state
for tenderness. The Hero is intellectually compelling, but it is not
tender, and Maria is not, tonight, looking to be intellectually
compelled.

She scrolls past the case for the Resurrection (which does interest her,
faintly) and finds the invitation: *"Begin the walk."* The signup modal
opens. She sees the Google button. She sees the email form. She sees
"Where are you starting from?"

She types: *"I don't know. I'm tired. My marriage ended. My mother thinks
this will help."*

She hesitates. Then she taps Continue.

She is auto-routed to the Course tab. *"Welcome back, Maria."* Day 1 of
7. *"Awaken to the Kingdom. Meet the King. Learn who you are. Receive
the Spirit. Cross the threshold."*

She doesn't tap the card. She closes the tab.

The next morning, she opens it again. The card is still there. She taps.

**What the site did right for Maria:**

- The Gate Hero did not blink. It made the strongest claim of
  Christianity, plainly. Maria has been to enough Catholic parishes that
  apologized for the faith; this one did not.
- The signup completed without friction. Google sign-in, four taps.
- The "Where are you starting from?" field gave her a place to say
  something true without having to perform.
- The "Welcome back, Maria" greeting was warm without being saccharine.

**What the site failed for Maria:**

- The Hero was not tender. There was no signal that *the wounded are
  welcome here*. A small additional Hero line — *"For the seeker, the
  returning, the broken, the curious. There is room."* — would have
  changed her experience.
- After signup, the Course tab is task-oriented. *"Begin Day 1."* Maria
  does not yet feel known. A first-screen-after-signup that says *"You
  are here. We are glad. Take your time."* before the task would land
  for her.
- There is no visible "If you are in crisis" affordance. Maria is not in
  crisis tonight — but the night her husband first moved out, she might
  have been. The affordance should be there even though tonight she
  doesn't need it.
- The Day 1 card subtitle *"Meet the King. Learn who you are."* is too
  much commitment for her current state. A warmer Day 1 entry point —
  *"Read for ten minutes. That's all today asks."* — would meet her where
  she is.

**Maria's path:** if Day 1 is well-written, Maria might return for Day 2.
If it speaks to her wound, she might return for Day 7. If the Course
forms her over fifty days, she might return to Mass on Easter Sunday next
year. *Salus animarum suprema lex.*

## Persona 2 — James, 28, the Spiritually Hungry Atheist

> *"I read Tom Holland's 'Dominion' last year and it broke something in my
> worldview. I've been quietly reading Augustine on the train. I don't
> believe yet. I am, perhaps, no longer pretending I don't want to."*

James opens kingdomcourse.org on his MacBook at his desk, 2:14 PM. He has
the New Atheist instincts of his early twenties layered over a recent and
private interest in Christian intellectual history. He is wary, and also
ready.

The Hero loads. *"The single greatest announcement in history has also been
the most rigorously verified."* James notices, with appreciation, that
the sentence does not soften. He reads on.

*"Eucharistic hosts that become living cardiac tissue. Apparitions with
measurable physical evidence. Bodies of saints that do not decay.
Healings verified by panels of secular physicians."* He stops at this
list. He has read about Lourdes. He has not read about cardiac-tissue
Eucharistic miracles. He opens a new tab and searches.

He finds Lanciano, the eighth-century Eucharistic miracle. He finds the
Sokółka miracle (2008, examined by pathologists). He finds Buenos Aires
(1996, examined by Castañón). The investigations are real. The pathology
reports are public. He is, scientifically, disturbed.

He returns to the Kingdom Course tab. The site has made a claim that he
just verified at second-hand. He is now, in a way he wasn't two minutes
ago, paying attention.

He scrolls to the bottom. He sees the Latin motto. He sees that the site
has both Privacy and Terms. He clicks Terms. He reads. He finds the
"This is not the Magisterium" disclaimer and respects it. He returns.

He signs up.

The signup modal asks where he is starting from. He types: *"Reading
Dominion. Not believing. Looking honestly."*

He is auto-routed to the Course tab. He sees Day 1: *"Awaken to the
Kingdom."* He reads it.

**What the site did right for James:**

- The Hero made a falsifiable claim. James verified it. It held up.
- The strongest sentence on the site is also the most epistemically
  honest one: *"the most rigorously investigated supernatural assertion
  in human history."* James, a science-minded skeptic, is not used to
  Christian claims being phrased with this precision.
- The Terms page's catechetical disclaimer signaled that the project
  does not over-claim its own authority. This matters enormously to
  James.
- The Latin motto, oddly, helped — it signaled antiquity, weight,
  someone-else's-tradition-not-built-yesterday.

**What the site failed for James:**

- James will be hungry for the deeper case immediately after the Hero. He
  needs *more*. The Gate Hero is a great opening; he wants to keep
  reading. Is there a "Read the full case" affordance for the
  intellectually hungry visitor before signup? Currently no.
- James will be skeptical of any vagueness. The "Where are you starting
  from?" question is excellent for him — but his answer, "Reading
  Dominion. Not believing. Looking honestly." should ideally produce a
  *visibly* different early experience than Maria's would. The
  personalization is collected but currently isn't used.
- James needs the Companion. He has questions that a Day 1 reading can't
  answer. He wants to argue. The stubbed Companion is the single biggest
  loss for him. When wired, it will be the central feature for the James
  personas.
- James will eventually want to read the *Summa*, *Theology and Sanity*,
  Feser, Hart. The Academy is the right answer. He needs to know it
  exists, and that it's *for him*.

**James's path:** if the Companion lands and lets him argue, James might
become Catholic in 18–24 months. If the Companion never lands, James will
read three more books, then drift to the Orthodox or to one of the
Reformed Protestant intellectual traditions where the digital
catechetical apparatus is currently better.

## Persona 3 — Anne, 35, the Catechumen Walking RCIA

> *"Father David recommended Hallow. I downloaded it. It's beautiful for
> prayer. But I want to *understand*. I want to know what I am about to
> consent to."*

Anne is mid-RCIA, six months from her Easter Vigil reception. She is
hungry for catechesis — actual content, not vibes. She found
kingdomcourse.org through a Catholic Twitter account she follows.

The Gate Hero pleases her. She has been swimming in apologetic content for
months. This is the most evangelically confident she's seen in a while.

She signs up with Google. *"Where are you starting from?"* she types: *"I
am going to be received this Easter."*

She lands on the Course tab. Day 1. She taps. She reads.

**What the site did right for Anne:**

- The Course's structure — seven steps, fifty days — is the kind of
  rigor she is looking for. RCIA is structured. This is too.
- The vocabulary (the Five Houses, the Three Movements, the Seven
  Keys) is recognizably Catholic but with a freshness Anne appreciates.
- The Hub's 3-1-3 Mass-anchored pattern is theologically gorgeous and
  pedagogically helpful for Anne, who is still learning the Mass.

**What the site failed for Anne:**

- The site does not yet acknowledge her catechumenal status. *"I am going
  to be received this Easter"* should produce a different welcome path
  than the lapsed-Catholic path. A "catechumen mode" with reading
  recommendations aligned to the liturgical cycle of catechumenate would
  matter. ("You are in the Period of Purification and Enlightenment.
  Here is what the Church gives catechumens to read in this time…")
- The site does not yet connect Anne to her parish. Anne's primary
  formation is her parish's RCIA program. The Kingdom Course should
  position itself as *adjacent to and supportive of* parish formation,
  not as a replacement.
- Anne is the most likely persona to *share the site with her catechist*.
  A "Share this with your sponsor or catechist" affordance would be
  valuable. (See Persona 6, Father Tom.)

**Anne's path:** she becomes Catholic at Easter. She continues with the
Course through Pentecost (synchronicity with the liturgical year is in
her favor). She becomes one of the strongest evangelists in her parish.
She gives the URL to her cousin who is in a difficult place.

## Persona 4 — Devon, 31, the Spiritual-But-Not-Religious

> *"I do yoga five times a week. I have a Stoicism podcast subscription. I
> meditate. I'm not a Christian. I'm not opposed to it. I'm interested in
> the practical question of how to live well."*

Devon arrives via a link in a Tim Ferriss-adjacent newsletter that
mentioned the Kingdom Course in a post about *practices for the long arc
of a life*. He clicks without expectation.

The Hero loads. *"The single greatest announcement in history."* Devon
recoils slightly. He is allergic to "greatest" claims. He scrolls.

He sees the Course preview: seven steps, fifty days. *"SEE · KNOW · HEAL ·
ABIDE · GO · BUILD · SEND."* These verbs interest him. They are
practice-words, not belief-words. He reads further.

He finds the Field Guide preview. *Twenty-two practices.* This excites
him. Daily Examen. Lectio Divina. Fasting. Stations of the Cross. These
are *practices*, technologies of the soul. He has read about all of them
in fragments. He has never been offered them as a curriculum.

He signs up. *"Where are you starting from?"* He types: *"Not religious
but interested in practices."*

He lands on Day 1.

**What the site did right for Devon:**

- The framing of the Course as a *walk* with *practices* is exactly the
  shape his interests can engage with. He is not being asked to assent;
  he is being invited to try.
- The Field Guide as a list of 22 named practices reads to him like a
  beautifully curated Stoic-adjacent toolkit. He is willing to try most
  of them.
- The brand voice is serious. Devon respects seriousness.

**What the site failed for Devon:**

- The Gate Hero, with its claim of "the greatest announcement," may push
  Devon away faster than it draws him in. He is not currently in a state
  to hear that claim. A *gentler* secondary doorway — perhaps a "Just
  Practices" entry — would let him in via the Field Guide first, and
  the catechetical claims second.
- The Course's name is wrong for him. "The Kingdom" is theological.
  Devon is not yet at the point where "Kingdom" lands as anything but
  vaguely monarchical. He needs a way in before he's converted.
- The risk is real: Devon might be one of the highest-value souls the
  Course could form, because his current spiritual hunger is real. And
  the site, as designed, may filter him out before he ever sees what's
  inside.

**Devon's path:** if there is no alternate entry, Devon leaves and tries
the Waking Up app and a Stoicism MasterClass. If the Field Guide is
exposed as a "Practices" entry-point doorway, Devon walks the
Examen for six months and one day asks a Catholic friend what Lectio
Divina actually is and where to learn it.

## Persona 5 — Sister Beatrice, 67, Religious Life

> *"I have been a sister for 43 years. I am looking for a tool to share
> with the younger women in my community and the candidates we accompany.
> Most Catholic apps are insulting to women in formation. I have low
> expectations."*

Sister Beatrice opens the site on her laptop. She has read about it from
a conference she half-attended. She is one of the most skeptical
visitors the site will receive, and one of the most important.

The Hero loads. She reads it. She nods, slowly. Her objections are not
to the claim but to the medium. *Can a website do this work?*

She reads on. She finds the Field Guide structure. She finds the Five
Houses. She finds the seven keys (SEE/KNOW/HEAL/ABIDE/GO/BUILD/SEND). She
recognizes the architecture: it is genuinely Catholic, it is genuinely
formational, it is not toy-Catholicism.

She is impressed against her will. She signs up. *"Where are you starting
from?"* She types: *"Religious sister, 43 years professed."*

**What the site did right for Sister Beatrice:**

- The architecture is real. The Five Houses, the three classical
  movements (Purgativa · Illuminativa · Unitiva), the
  Mass-anchored 3-1-3 — all of these are recognizably Catholic and
  serious. She would not be embarrassed to recommend it.
- The brand voice is serious enough to bear the weight of religious
  life.
- The Field Guide's 22 practices map onto every formation house's
  curriculum.

**What the site failed for Sister Beatrice:**

- The site does not yet have a "for catechists, formators, religious"
  pathway. Sister Beatrice is not a *seeker*; she is a *forwarder*. She
  needs different affordances than Maria does. A "Share with your
  community" + "Print a Day 1 booklet for catechumens" feature would
  matter for her.
- The site does not have a way for Sister Beatrice to *vouch* for it.
  Religious endorse what they trust, deeply, slowly. The site should
  plan for institutional endorsements (religious orders, parish
  bulletins, dioceses) as a Year 2 effort.

**Sister Beatrice's path:** if she trusts the Course over a few months,
she shares the link with her community's formation director. The
Sisters' candidates start walking it. Five years later, three orders are
using it in initial formation.

## Persona 6 — Father Tom, 54, Parish Priest

> *"I have 1,800 families. I have one DRE who's overworked. I have
> nine catechumens this year. I need tools that actually work."*

Father Tom finds the site through a clergy WhatsApp group. He opens it on
a Thursday afternoon between funerals.

He skims the Gate. He skips the Hero (he doesn't need the apologetic
case; he believes it). He scrolls to find the architecture. He sees the
Course → Field Guide → Academy structure. He sees the Five Houses.

He signs up.

**What the site did right for Father Tom:**

- The serious tone. He is not condescended to.
- The free pricing. He does not have a budget for another digital
  subscription.
- The Mass-anchored Hub. This is a tool that points his people back to
  *his Mass*, not a tool that competes with it.

**What the site failed for Father Tom:**

- The site has no "for clergy" affordance. Father Tom needs to know: can
  I recommend this to my catechumens? Can I print a Day 1 sheet for the
  bulletin? Can I get a brief for parish staff?
- The site has no clear institutional credibility marker. Father Tom is
  not the world's most skeptical priest, but he has been burned by
  Catholic projects that turned out to be lay-ministry-without-bishop.
  An *Imprimi Potest* or even a "Reviewed by Father X, theological
  advisor" line would change everything for him.
- The site has no "request a brief" or "speak with the founder" affordance.

**Father Tom's path:** if the site builds clergy credibility over 12-18
months, Father Tom recommends it to his catechumens at next year's RCIA
inquiry. His parish becomes the seed of a thousand-soul flow.

## Persona 7 — Tyler, 19, the Doom-Scrolling Young Adult

> *"I'm doom-scrolling because everything sucks. My friend group is one
> Discord server and three group chats. My grandmother gave me a Rosary
> when I was twelve and I kept it. I have not been to Mass in five years."*

Tyler is on his phone. The site loads on a 6.1-inch screen.

The Hero is gorgeous on his screen. The typography reads. The Cormorant
Garamond italic gold lands. He doesn't fully understand the words but he
*feels* them.

He scrolls. He sees the seven verbs. He sees the Latin at the bottom.
*"Salus animarum suprema lex."* He doesn't know what it means. He
screenshots it and texts it to his friend Marcus: "yo what does this
mean."

He doesn't sign up. He closes the tab. He goes back to TikTok.

Three weeks later, he opens the tab again — it's still in his recent
history because he never closed the browser. He scrolls again. He reads
more this time. He signs up with Google.

**What the site did right for Tyler:**

- The visual identity is *strong enough to survive a phone screen*. The
  brand mark, the typography, the paper-and-gold palette — all of this
  signals to Tyler that *this is not a parish website made in 2009*. It
  reads as belonging to *now* while pointing to *ancient*.
- The brevity of the Hero. Tyler does not have a long-form attention
  budget. The Hero is short enough to read in a sitting.
- The Latin tag. It feels *secret*. It feels *not for everyone*. For a
  young man who has been served generic content his entire life, the
  faintly esoteric Latin is *attractive*.

**What the site failed for Tyler:**

- No video. The Word on Fire site lives on video; the Bishop Barron
  YouTube channel is the entry point for tens of thousands of Catholic
  conversions. Kingdom Course has no video presence. Tyler is the
  demographic where video matters most.
- No mobile-installation prompt. If Tyler installed the site as a PWA,
  it would join the apps he opens daily. As a website, it lives in his
  history and gets buried.
- No Companion. Tyler has the questions of a 19-year-old. He needs
  someone to ask. Even an early-stage Companion would matter for him.

**Tyler's path:** if Tyler walks Day 1–7, he might go to Mass for
Christmas. If he walks Day 1–50, he might go back to Confession after
five years and call his grandmother to tell her.

## Persona 8 — Margaret, 71, the Older Returning Catholic

> *"My husband died last year. I'm in this big house alone. My daughter
> sent me this link. I'm not good with computers but I'll try."*

Margaret opens the link on her tablet. The site loads. She reads the
Hero.

She likes it. The words are pretty. She doesn't fully follow the case
for the Resurrection — she has *always* believed in the Resurrection —
but the language is dignified.

She scrolls. She finds the Course preview. She is intimidated by the
word "Course" — she did not finish college, and "Course" sounds like
*school*.

She taps SIGN IN. The modal opens. She sees the Google button. She is
not signed in to Google on her tablet. She tries the email path. She
doesn't have her email handy. She closes the tab. She is mildly
defeated.

**What the site did right for Margaret:**

- The dignity. Margaret was raised in a Church of stained glass and
  Latin. The site's quietness — the paper, the gold, the unhurried
  typography — matches her Catholic memory.
- The Latin motto. She doesn't read Latin, but the *presence* of Latin
  signals *home*.

**What the site failed for Margaret:**

- The signup is too technical. Google sign-in assumes she's already
  signed in to Google. Email + verification code assumes she has email
  on her current device.
- The word "Course" intimidates her. "Walk" is friendlier. (The Master
  Vision actually uses "walk" frequently. The deployed site mixes both.)
- There is no large-text mode. Margaret has had cataract surgery; she
  prefers larger fonts than the default.
- There is no audio version. Margaret would happily listen to Day 1
  while making her morning coffee. She would not happily read a 1,500-word
  reading at 7 AM.

**Margaret's path:** if the site has a more forgiving onboarding (perhaps
a phone-call-style audio option, perhaps a "walk-in for the older"
affordance) and an audio version, Margaret walks Day 1–50 in the year
after her husband's death. She rejoins her parish on the anniversary of
his death. She prays for him every day.

## Persona 9 — Sanjay, 39, the Skeptical Intellectual

> *"I read Feser, Hart, Aquinas in translation, MacIntyre, Pieper. I am
> a philosopher by temperament. Christianity is intellectually serious in
> a way most religions are not. I am, in the philosophical sense, an
> uneasy non-believer."*

Sanjay finds the site through a Twitter mention by a Catholic
philosopher he follows. He opens it on his desktop with three other tabs
already devoted to Catholic content.

The Hero pleases him philosophically. He likes the rigor of "the most
rigorously investigated supernatural assertion." He likes the
philosophical respect implicit in the claim.

He explores. He finds the Field Guide. He finds the apologetics in the
Master Vision excerpts. He finds the Five Houses.

He signs up. *"Where are you starting from?"* He types: *"Reading
Catholic philosophy seriously. Not yet baptized."*

**What the site did right for Sanjay:**

- The intellectual posture. The site is not afraid of intellectual
  seriousness. It does not soften.
- The Catholic intellectual tradition is implicitly present (the
  references to the Summa, the Spiritual Exercises, the mystical
  tradition). For Sanjay, *the architecture itself is the case*.

**What the site failed for Sanjay:**

- Sanjay will want the deep argument. The Master Vision has it; the
  deployed site does not yet expose it. He needs the Academy.
- The Companion, when it comes, will need to be philosophically
  serious. A Companion that gives him an FAQ-style answer to "What is
  the substance of the soul?" will lose him in three exchanges. The
  Companion's training must include actual Catholic philosophy.

**Sanjay's path:** if the Academy ever ships with proper Catholic
philosophy — Feser, the Thomistic synthesis, the contemporary
Catholic intellectuals — Sanjay becomes Catholic in three to five years
and becomes one of the most articulate apologists in the project's
network of users.

## Persona 10 — Rachel, 26, the Wounded

> *"I was raised in a Catholic home where my father used Confession to
> control me. I am in therapy. I am also, secretly, missing something I
> can't name."*

Rachel opens the site at 1 AM. She is alone. She is wary.

The Hero loads. She reads it. The claim of authority — "the greatest
announcement" — produces a reflexive defensive shudder in her. She
*knows* what religious authority feels like and she does not want it
near her tonight.

She scrolls. She finds the Privacy page. She reads it. She finds the
journal fields are device-local, not server-stored. She is, slowly,
willing to look more.

She finds the Terms page. She finds the 988 crisis callout. She is,
slowly, less afraid.

She signs up. She does not type anything in the "Where are you starting
from?" field. She does not want to be known.

**What the site did right for Rachel:**

- The Privacy page's plain language. She has been on Catholic sites
  with hostile UX and Catholic sites with predatory data practices.
  This one is neither.
- The 988 crisis callout in the Terms. She is not in crisis tonight, but
  the affordance signals *someone here knows that some of us arrive
  hurting*.
- The journal device-local commitment. She would never type into a
  field that might be read by another person.

**What the site failed for Rachel:**

- The Hero is too confident for her. She needs a doorway that does not
  begin with capital claims.
- The framing of sin will be triggering. The classical kerygma's "sin
  is real" must be introduced *after* "God loves you" and *with* the
  pastoral care that the wounded need. The Day 1 content must be
  inspected for whether it lands well for Rachel.
- The site does not yet have a clear "if your relationship with the
  Catholic Church has been broken by harm" pathway. This is not most
  visitors. But it is some. And those some are, in pastoral terms,
  whom the site exists for in the most particular way.

**Rachel's path:** if the site holds her gently for a year — if it does
not push her, if the Companion is humble, if the catechetical content
emphasizes mercy before discipline — Rachel might, slowly, return to
Confession with a priest she can trust. She might rebuild her
relationship with the Church. The work is long. The fruit is real.

---

# PART V — BENCHMARK COMPARISONS

This section examines each major benchmark in the Catholic and adjacent
digital ministry space, with attention to what the Kingdom Course should
borrow, what it should refuse, and where the differentiation lies.

## Hallow

Hallow is the most successful Catholic app of the era. Founded 2018,
recently raised $50M+ Series B (2023), ~20M+ downloads. Mark Wahlberg as
endorser. Number one app in the App Store in February 2024 for a stretch.
Bishop Barron and Father Mike Schmitz are content contributors. Estimated
revenue: $40M+/year as of 2024.

**What Hallow does well:**

- Production value. The audio is excellent. The visual design is clean.
  Music and voiceover are professional.
- Onboarding. The first 60 seconds of a Hallow signup is among the most
  polished consumer-app experiences in any vertical. It calibrates the
  user's interests, age, prayer history, language — and delivers a
  personalized first prayer experience.
- Content library. Thousands of guided meditations, prayers, Scripture
  readings, sleep stories. The library is huge and the curation is
  Catholic but not narrowly so (Lectio with C.S. Lewis, etc.).
- Distribution. Mark Wahlberg, Jim Caviezel, Liam Neeson, Jonathan Roumie
  as voiceover talent. Bishop Barron's endorsement. Father Mike
  Schmitz's involvement.
- Monetization. Freemium model. Free tier with daily content + a
  premium tier at ~$70/year. They've made it work.

**What Hallow does less well:**

- Formation. Hallow is a *prayer* app, not a *formation* app. It supports
  daily prayer beautifully. It does not propose a structured catechetical
  journey. Sequential formation is not the core offer.
- Catechetical depth. The content is broad and beautiful but rarely
  systematic. A user can pray with Hallow for years and never be walked
  through the Creed.
- Accessibility/Affordability. The premium tier at $70/year is meaningful
  in many countries — Hallow has free tier, but the marketing pushes
  premium hard.
- The parish bridge. Hallow does not, to my knowledge, prioritize
  connecting users to their local parish. It is a substitute as much as a
  complement.

**What Kingdom Course should borrow:**

- Production value. The audio quality, the visual polish, the depth of
  voice talent. The Kingdom Course's content should be read by *real
  voices*, not just text on a screen.
- The onboarding warmth. The 60-second post-signup calibration is a
  pattern worth borrowing (see Conversion Lens, Lens 3).
- The mobile-first design discipline. Hallow's mobile UX is
  best-in-class for the category.

**What Kingdom Course should refuse:**

- The freemium gate. *"The salvation of souls cannot have a price tag"*
  is in the Master Vision. Keep this. The free-forever commitment is
  itself an evangelistic claim about the Gospel.
- The substitution dynamic. Hallow can be a substitute for parish
  prayer life. The Kingdom Course should be designed as the *opposite*:
  a tool that increases, not decreases, parish engagement.

**Differentiation:** Hallow is a Catholic prayer app. The Kingdom Course
is a Catholic *formation* journey. Hallow forms the daily devotional
habit; the Kingdom Course forms the disciple. These are different
products; they are *complementary*. The Kingdom Course should position
explicitly: *"If you pray with Hallow, walk the Course alongside it. The
Course will form what Hallow sustains."*

## Bible in a Year (Ascension Press, Fr. Mike Schmitz)

Launched January 2021. By January 2022, the #1 podcast in America for
multiple weeks. Currently estimated at 100M+ total downloads across the
365-episode arc, with new "classes" starting January 1 each year.

**What BIY does well:**

- The Mike Schmitz voice. Fr. Mike is the rarest gift: a parish priest
  with a public theological voice that is at once orthodox, warm,
  funny, and pastorally wise.
- The structured daily commitment. One episode per day. 20-25 minutes.
  Predictable. The streak compounds across the year.
- Ritual. Starting January 1 makes the project itself a Lenten-style
  practice. Tens of thousands begin together.
- Distribution. Podcast as the medium met the moment. Catholics commute,
  walk, work. Audio is the right form for daily formation in a way
  Hallow's micro-meditations and Word on Fire's long-form video aren't.

**What BIY does less well:**

- It is a one-way audio relationship. There is no community formation
  baked in. Some communities formed around the podcast spontaneously
  (online discussion groups, etc.) but the product itself is solitary.
- It does not produce ongoing formation infrastructure. After Day 365,
  the user has read the Bible — and then what?
- It is not interactive. A user with a question about the day's reading
  has no recourse within the product.

**What Kingdom Course should borrow:**

- The daily ritual. Fifty days, anchored to Pentecost, is exactly the
  same instinct as "Bible in a Year, anchored to January 1." Liturgical
  anchoring is *the* retention pattern for formation in the Catholic
  context.
- The voice. Fr. Mike Schmitz's voice is irreplaceable, but the *form*
  — a warm, knowledgeable, present voice walking the user through —
  is replicable. The Kingdom Course should have audio versions of every
  Day, read by a real voice (or several, varying by tone).
- The "starting together" instinct. If the Kingdom Course could
  position January 1 (or Ash Wednesday, or some other date) as *the*
  start date with cohorts of thousands beginning together, the
  retention math improves dramatically.

**What Kingdom Course should refuse:**

- The audio-only constraint. BIY is podcast-only by design. Kingdom
  Course should be multi-modal — read, listened, journaled, prayed,
  shared.
- The completion-and-done arc. BIY ends. Kingdom Course is the *gate*
  to a longer formation (the Academy, the Field Guide, the post-Day-50
  walk). The site should make this lifelong horizon visible.

**Differentiation:** BIY is a year of Scripture reading with audio
commentary. Kingdom Course is a fifty-day Catholic catechumenate
followed by lifelong formation. BIY proves the appetite is there.
Kingdom Course extends the appetite into a structured journey.

## Word on Fire (Bishop Robert Barron)

Founded 2000. The flagship Catholic intellectual ministry of the
post-Vatican-II era. Reach: ~2M YouTube subscribers, ~150K monthly
podcast downloads, ~40,000 paying members of the digital subscription
service (the Word on Fire Engage program). Bishop Barron's *Catholicism*
documentary series (2011) became a parish formation staple.

**What Word on Fire does well:**

- Production quality. The Catholicism series is the gold standard for
  Catholic documentary filmmaking.
- Intellectual seriousness. Bishop Barron's engagement with Jordan
  Peterson, Sam Harris, Ben Shapiro — across hostile or
  intellectually-loaded contexts — has shown Catholic intellectual life
  to be *alive*. This is rare.
- Long-form. WoF is the rare Catholic ministry that commits to long-form
  content (90-minute interviews, 60-minute lectures). The audience for
  this is large and underserved.
- Brand. Bishop Barron's voice and presence are the brand. Beautifully
  cultivated. Recognizable.

**What Word on Fire does less well:**

- Personalization. WoF is broadcast Catholicism — one bishop talking, many
  listening. There is little structure for individual formation.
- Sequential walk. WoF has dozens of products but no canonical "begin
  here, walk through this for X days, finish formed" arc.
- Onboarding. The Engage subscription has a paywall but the entry pathway
  for a new visitor is not as clear as Hallow's or BIY's.

**What Kingdom Course should borrow:**

- Long-form respect. Treat the user as capable of long-form attention. Do
  not infantilize.
- Intellectual confidence. The site should be willing to publish
  *content* that requires genuine attention, not just micro-formation.

**What Kingdom Course should refuse:**

- The single-voice center. WoF is fundamentally Bishop Barron's project;
  the brand is the bishop. Kingdom Course is — if it is true to its name —
  not Aaron's project; it is the Kingdom's. The brand should be the
  motto, the architecture, the saints, *not* the founder. This is
  pastorally and theologically the right path.

**Differentiation:** WoF is broadcast Catholic intellectual content for
the long-form audience. Kingdom Course is structured formation for the
individual walker. WoF deepens. Kingdom Course forms.

## BGEA (Billy Graham Evangelistic Association)

The model of Protestant mass evangelism. Billy Graham preached to ~215
million people in 185 countries across his career. The "Steps to Peace
with God" tract was distributed in the hundreds of millions. The decision
card. The crusade arc. The follow-up letter.

**What BGEA does well:**

- Clarity of the ask. *"Do you want to receive Christ tonight?"* The
  decision moment is named, structured, prayed-through.
- Follow-up infrastructure. Decision cards led to letters, calls,
  pastoral handoff. The convert was not abandoned.
- Global reach. Every continent. Every major language. Crusades in cities
  that had never received a coherent presentation of the Gospel.
- Simplicity. The "Steps to Peace with God" is four images, four points,
  no hedging. A 19-year-old can use it.

**What BGEA does less well (for our purposes):**

- The decision-centered framing presupposes a Protestant theology where
  the *decision* is the salvation moment, rather than the Catholic
  framing where the *sacraments* are. Catholic conversion is sacramental,
  not decisionist.
- Mass evangelism, by its nature, lacks the personalization the Catholic
  catechumenate provides.

**What Kingdom Course should borrow:**

- The clarity of the ask. The site should ask, explicitly, *"Will you
  walk these fifty days?"* The ask should be a real moment, not just an
  invitation buried in a paragraph.
- The follow-up infrastructure. Once a user signs up, the daily email,
  the streak, the encouragement — the BGEA pastoral correspondence
  pattern translates directly. Every walker should receive a series of
  emails that say, in effect, *"Welcome. We are walking with you. Here is
  Day 1. Here is what Saturday looks like. Here is what you'll be
  encountering in Week 3."*
- The four-point structure of "Steps to Peace with God." The Catholic
  equivalent — the classical kerygma — could be presented in a similar
  visual format (four screens, four images, four sentences) as the
  doorway to the Course for the not-yet-decided visitor.

**What Kingdom Course should refuse:**

- The decisionist framing. The Kingdom Course is sacramental Catholic
  formation, not a decision-card altar call.
- The crusade event-model. The Kingdom Course is a daily walk, not an
  event.

**Differentiation:** BGEA was global event-evangelism for the late
20th century. The Kingdom Course is global daily-walk formation for the
2020s and 2030s. Same scale ambition. Different structural form. Both
fully orthodox to their respective traditions.

## Cru / everystudent.com

Cru (formerly Campus Crusade for Christ) is the largest US campus
evangelistic ministry. *everystudent.com* is its long-form evangelistic
content site, optimized for the searching college student. Hundreds of
articles. SEO-engineered. *"How can I know God personally?"*-style
content.

**What Cru does well:**

- SEO-optimized evangelistic articles for *exactly* the questions
  searching students search. ("Is the Bible true?" "How do I know God
  exists?" "Why does God allow suffering?")
- Plain-language theology. No assumed Christian vocabulary.
- Multi-language reach. Cru operates in ~190 countries.

**What Cru does less well (for our purposes):**

- Generically Protestant. No sacramental content, no Marian theology, no
  intercession of saints.
- Decision-card-style follow-up rather than catechumenal formation.

**What Kingdom Course should borrow:**

- The SEO discipline. *everystudent.com* ranks for queries that real
  seekers search. The Kingdom Course should design Academy content
  with these queries in mind.
- The "no assumed vocabulary" discipline. Catholic vocabulary is
  beautiful but unfamiliar to many seekers. Make first uses defined.

**What Kingdom Course should refuse:**

- Generic-Protestant phrasing. The Kingdom Course must remain
  identifiably Catholic in vocabulary, sacramental orientation, and
  theology.

**Differentiation:** *everystudent.com* is a Protestant evangelistic
content library. Kingdom Course is a Catholic formation journey. Both
serve seekers; they answer different questions.

## Duolingo

The unrelated benchmark that turns out to be most relevant. ~500M
registered users. Streak-based daily practice. Gamified language
acquisition. Catechetically the closest analog because language
acquisition, like spiritual formation, is *daily, incremental, and
sustained over years*.

**What Duolingo does extraordinarily well:**

- The streak. The single most powerful retention mechanic in consumer
  software of the 2010s and 2020s. Users return *not because the
  content is irresistible* but because *they don't want to break the
  streak*.
- The daily commitment. Five minutes a day, every day, builds an
  accumulating skill.
- The lesson structure. Each lesson is short, completable in one
  sitting, with a clear before/after.
- The mascot. The owl. Anthropomorphized. Has opinions. Sends push
  notifications that are slightly desperate. This is a marketing study
  in itself.
- The branching personalization. The app calibrates difficulty and
  topic to the user's pace.

**What Duolingo does less well:**

- It treats human learning as game mechanics. This is correct for
  language; it is *less* correct for spiritual formation.
- The streak mechanic, applied uncritically, can produce compulsive
  behavior that is the opposite of contemplative formation.

**What Kingdom Course should borrow:**

- The streak — but framed carefully. *"You have walked seven days in
  the Kingdom"* is different from *"keep your streak alive."* The
  Catholic frame is fidelity, not compulsion. But fidelity, like the
  streak, compounds.
- The daily commitment as a positive, low-threshold ritual. Five minutes
  a day is *enough* for Day 1. Build from there.
- The lesson structure: each Day completable in 15-25 minutes.

**What Kingdom Course should refuse:**

- The mascot. A Catholic formation product does not need an owl. (The
  saints are the companions. They are not anthropomorphized; they are
  real.)
- The desperation. Duolingo's notifications are sometimes weaponized
  guilt. A Catholic formation product should not weaponize guilt. The
  reminder should be *invitation*, not *guilting*.

**Differentiation:** Duolingo is a daily-habit language game. Kingdom
Course is a daily-walk formation. Same retention architecture, very
different soul of the product.

## YWAM DTS

The Discipleship Training School. The model the Master Vision explicitly
cites. Founded 1969 by Loren Cunningham. Operates in 190 nations. Has
trained ~4 million people across 18,000+ missionaries. Twelve-week
in-person program followed by mission outreach.

**What YWAM DTS does extraordinarily well:**

- Encounter. The first weeks are designed to produce a personal
  encounter with God — not theory, not catechesis, but experience.
- Healing. Inner healing modules are central. Wounds are surfaced and
  prayed-through, often producing visible deliverance.
- Worship saturation. The entire program is bathed in extended worship.
- Mission. The DTS ends with a 2-month outreach to a foreign country.
  The formation is *for sending*.
- Multiplication. DTS graduates are often DTS staff next year. The
  movement multiplies itself.

**What YWAM DTS does less well (for Catholic purposes):**

- The theology is broadly evangelical/charismatic and is *not* Catholic
  in sacramental structure, Marian devotion, intellectual tradition, or
  ecclesial connection.
- The intensity of the program (full-time, 12 weeks) is not accessible
  to most Catholics with jobs, families, parish obligations.

**What Kingdom Course should borrow:**

- The encounter emphasis. The first week (SEE) is the analog. It must
  produce *real encounter*, not just information.
- The healing module. HEAL is the third key. The Catholic mystical
  tradition (St. John of the Cross, the Spiritual Exercises, the
  charismatic Catholic movement) has rich resources for this. Use them.
- The worship saturation. The site should feel, somehow, like *prayer
  is the air*. Music, silence, beauty.
- The mission emphasis. SEND. The Course ends with the user actually
  sending themselves into the world. This must be tangible.

**What Kingdom Course should refuse:**

- The Protestant-charismatic ecclesiology.
- The 12-week-full-time model.

**Differentiation:** YWAM DTS is in-person Protestant-charismatic
discipleship for full-time learners. Kingdom Course is digital Catholic
catechetical-charismatic formation for the working person's daily walk.
Same pedagogy. Different scope.

## Bethel / School of the Supernatural / School of Heaven

The contemporary American charismatic-Protestant model. Bethel Church,
Redding California. Bethel Music. Bill Johnson, Kris Vallotton. Highly
controversial in evangelical and Reformed circles for some theological
positions. Operates a "School of Supernatural Ministry" with thousands
of students.

**What Bethel does well:**

- Worship. Bethel Music is one of the most influential worship music
  catalogs of the era. *"Goodness of God"*, *"Reckless Love"*, dozens of
  others.
- Expectation. They expect the supernatural. Healings. Prophecies.
  Encounters. This *expectation* is itself a formation tool.
- Beauty and aesthetics. The branding is contemporary, beautiful,
  artist-driven.

**What Bethel does less well (from a Catholic perspective):**

- Theological discipline. Some of Bethel's positions sit outside both
  evangelical orthodoxy and Catholic doctrine.
- The ecclesial connection. Bethel is its own ecosystem; it does not
  send people back to their local parish or congregation.

**What Kingdom Course should borrow:**

- The expectation of the supernatural. The Master Vision *already*
  carries this — the Nine Circles of evidence, the saints' miracles, the
  Catholic mystical tradition. The deployed site has *the most
  charismatic-friendly Catholic Hero in any Catholic site I have seen*.
  Lean into it.
- The aesthetic seriousness. Bethel's branding shows that contemporary
  Catholic projects can match or exceed contemporary Protestant
  projects in design quality. The Kingdom Course already does this. Keep
  it.

**What Kingdom Course should refuse:**

- The theological idiosyncrasies of Bethel specifically.
- The "build your own ecosystem" path that bypasses the parish.

**Differentiation:** Bethel is American charismatic Protestant
ecosystem-building. Kingdom Course is Catholic catechumenal formation
within and pointing to the universal Church. Same fire. Different
ecclesiology.

## Francis Chan / Crazy Love

Francis Chan, *Crazy Love* (2008), millions of copies sold. Multi-site
megachurch pastor turned simpler-life advocate turned house-church
practitioner. Direct, plain, anti-institutional, deeply biblical.

**What Francis Chan does well:**

- Directness. Chan does not hedge. *"If we got what we deserved, we
  would all be in hell."* No softening.
- Simplicity. His books read in two sittings. The vocabulary is plain.
- Authenticity. His personal life (selling his mansion, leaving his
  megachurch, moving to Asia) matches his teaching.

**What Francis Chan does less well (for Catholic purposes):**

- Protestant ecclesiology, no sacramental structure.
- Anti-institutional drift, sometimes opposed to the very structures
  that Catholic life requires.

**What Kingdom Course should borrow:**

- The directness. The Master Vision is direct. The deployed site
  inherits some of this. Maintain it. Resist the temptation to soften
  the kerygma to please contemporary sensibilities.
- The authenticity threshold. The site cannot survive if the public
  voice does not match the private life of the operator. This is not a
  business problem; this is a salvation-of-souls problem. *Salus
  animarum suprema lex*.

**Differentiation:** Chan is direct Protestant simple-life teaching.
Kingdom Course is direct Catholic sacramental formation. Same plain
voice. Different ecclesial home.

## The Saints

The benchmark above all benchmarks.

- **St. Therese of Lisieux.** Forty thousand words written in
  twenty-four years. A spirituality of littleness that has formed
  millions. The Little Way is reproducible by any Catholic, anywhere.
- **St. Francis Xavier.** Wrote to St. Ignatius from India: *"I would
  like to go to the great schools of Europe and shout like a madman that
  there are millions of souls perishing for want of the Gospel."* The
  fire of mission.
- **JP2.** Through thirty years of papacy, with his body increasingly
  failing, witnessing publicly, refusing to disappear, working to the
  last. *"Be not afraid."*
- **St. Carlo Acutis.** Catholic teenager. Built a website cataloguing
  Eucharistic miracles. Beatified 2020. The first millennial blessed.
  Patron saint of the internet. *Whom the Kingdom Course is, in
  a real sense, the apostolic descendant of.*

**What the saints do that no app can replace:**

- The personal presence. Their formation works because *they were holy*.
  Sanctity, not strategy, was the substrate.
- The long arc. They worked for decades. The fruit became visible
  posthumously.
- The willingness to be misunderstood. Therese was nearly forgotten.
  Xavier was thought a lunatic. JP2 was attacked from every side.

**What Kingdom Course can do:**

- Witness to the saints. The Five Houses architecture, the daily
  saint-of-the-day in the Hub, the calling out of saint-mentors per
  House — all of this is in the Master Vision and partly deployed.
  Continue.
- Point users to saint-formation as the goal. The user is not walking
  the Course to *finish* the Course. The user is walking the Course
  to *become a saint*. The site should say this somewhere.

**Differentiation:** The saints are the benchmark. The site exists to
serve their work in the present age. Every comparison above is between
peers in a digital market. The saints are not a peer; they are the goal.

---

# PART VI — GRAMMAR, COPY, VOICE

A specific pass through the consumer-facing copy, noting issues
identified by the Copywriter Lens and others, with concrete recommended
edits where applicable.

## Pass 1 — The Gate Hero

**Current text (as observed):**

> THE KINGDOM OF ETERNAL LIFE
>
> The single greatest announcement in history has also been the most
> rigorously verified.
>
> Two thousand years ago, the Son of God walked among us as Jesus of
> Nazareth. He came with one message above all others: the kingdom of
> heaven had arrived — a kingdom of eternal life, given now and forever.
> A life that begins on earth, in the sacraments and in communion with a
> living God, and does not end at death but consummates in heaven, face
> to face with the King.
>
> That announcement has since become the most rigorously investigated
> supernatural assertion in human history — confirmed by Eucharistic
> hosts that become living cardiac tissue, by apparitions with measurable
> physical evidence, by bodies of saints that do not decay, by healings
> verified by panels of secular physicians, and — most staggering of all
> — by thousands of canonized saints who continue to heal, appear, and
> intercede from beyond their own deaths. Not only the kingdom. Eternal
> life itself, verified.

**Assessment:** the strongest evangelistic prose on the site. No edits
necessary to the words themselves. Two layout suggestions:

1. **Subhead missing.** The headline lands. The subhead ("has also been
   the most rigorously verified") is currently part of the headline.
   Consider promoting *"The Gospel meets you. The Course forms you. The
   Kingdom holds you."* (currently in the footer) to a subhead position
   beneath the headline. This gives a one-line summary of what the site
   *is*, which the Hero currently doesn't deliver.

2. **CTA missing.** As noted in the UX and Conversion Lenses. Add an
   unobtrusive "ENTER" or "BEGIN" affordance bottom-right of the Hero.

## Pass 2 — The Course Tab Signed-In Landing

**Current text:**

> WELCOME BACK
>
> The Kingdom Course
>
> 7 Essentials of the Kingdom of Heaven
>
> SEVEN WEEKS · FIFTY DAYS · THE WALK TO PENTECOST
>
> [Progress bar with SEE · KNOW · HEAL · ABIDE · GO · BUILD · SEND]
>
> Hello, Adam.
>
> BEGIN HERE · STEP 1 · SEE · DAY 1 OF 7
>
> Awaken to the Kingdom
>
> Meet the King. Learn who you are. Receive the Spirit. Cross the
> threshold.

**Assessment:** the signed-in landing is structurally excellent. Two
specific edits:

1. **"Hello, Adam."** is a salutation. *"Welcome back, Adam."* is a
   welcome. The latter is warmer. Use it.

2. **"BEGIN HERE · STEP 1 · SEE · DAY 1 OF 7"** is a beautifully
   designed strip but may wrap awkwardly on mobile. Test on a 360px
   viewport. If awkward, design an explicit mobile variant:
   *"STEP 1 · DAY 1 OF 7"* over two lines.

3. **"Kingdom of Heaven"** vs. **"Kingdom of Eternal Life"** in the Gate.
   Decide: are these synonymous, or are they distinct? In the Master
   Vision, "Kingdom of Heaven" is the umbrella; "Kingdom of Eternal
   Life" is one of the specific manifestations (the eternal-life
   dimension). The Course subtitle should probably remain "7 Essentials
   of the Kingdom of Heaven" (umbrella) while the Gate Hero eyebrow can
   stay "The Kingdom of Eternal Life" (the specific salvific dimension).

## Pass 3 — The Kingdom Tab Signed-In Hub

**Current text (May 13 example):**

> WEDNESDAY · MAY 13, 2026
>
> The Kingdom.
>
> Easter · Memorial of Our Lady of Fatima
>
> TODAY'S SEVEN
>
> [3 preparing glyphs] · AT THE ALTAR · [3 sent forth glyphs]
>
> Today in the Kingdom
>
> Awareness · The day as a kingdom day
>
> TODAY AT THE ALTAR · MAY 13
>
> Our Lady of Fatima
>
> 1917

**Assessment:** the Hub is extraordinarily well-designed. The voice is
liturgical and dignified. The period after "The Kingdom" is a deliberate
stylistic closure that works.

**One concern:** *"The day as a kingdom day"* is beautiful but cryptic.
What is a kingdom day vs. an ordinary day? For the seasoned Catholic this
will resonate; for the first-time Hub visitor it may feel like a
private vocabulary. Consider a small italic gloss the first time the
user lands on the Hub: *"Every day belongs to the King. We are learning
to see it."*

## Pass 4 — The Signup Modal

**Current fields (as observed):**

- Google sign-in button
- "or with email" divider
- First name (text field)
- Email (text field)
- "Where are you starting from?" (text/textarea)
- Submit button
- "Fifty days" framing copy

**Specific edits:**

1. **"Where are you starting from?"** → **"In one sentence — what is
   bringing you here today?"**

   Rationale: "starting from" is gentle but ambiguous. The alternative
   is specific, gentle, and gives a clearer instruction.

2. **Optional flag.** Make "Where are you starting from?" *visibly
   optional*. Some users (Rachel, Persona 10) will not want to type
   anything yet. The field should not block signup if blank.

3. **Privacy/Terms acknowledgment.** Add a small line beneath the
   submit button:

   > *By continuing you acknowledge our [Privacy](/privacy) and agree to
   > our [Terms](/terms).*

   This is the standard pattern and the legal-pages-without-acknowledgment
   gap is a compliance issue at broad launch.

## Pass 5 — The Verification Email

**Current:**

- From: `notifications@accounts.dev`
- Subject: *"Kingdom Course / Verification code: XXXXXX"*

**Recommended edits when production keys ship:**

- From: `welcome@kingdomcourse.org` (or `verify@…`)
- Subject: *"Your door to the Kingdom — code XXXXXX"*
- Body: include the Latin motto at the end. Include a one-line
  expectation-setter: *"After you enter the code, you'll begin Day 1.
  Take your time."*

## Pass 6 — The Footer

**Current:**

> © 2026 · The Kingdom Course · Privacy · Terms
>
> *Salus animarum suprema lex.*

**Suggestion:** add a small italic gloss for the Latin under it, at least
for the first six months:

> © 2026 · The Kingdom Course · Privacy · Terms
>
> *Salus animarum suprema lex.* — *The salvation of souls is the supreme
> law.*

After six months and assuming the motto has become recognizable in the
project's voice, the gloss can be removed.

## Pass 7 — Voice and Tone Guide (recommended)

A one-page internal document. Draft:

**THE KINGDOM COURSE — VOICE AND TONE**

*The voice is liturgical, plain, and adult.*

- **Liturgical** — the rhythms echo the Mass and the Psalms. Sentences
  are short. Phrases recur. Latin appears unembarrassed.
- **Plain** — no Christianese jargon without definition. No "fellowship,"
  no "praise team," no "personal relationship with Jesus." Catholic
  vocabulary is used and defined when first introduced.
- **Adult** — the reader is treated as capable. Hard things are said
  hard. Mystery is not condescended to.

**Do this:**

- *"The single greatest announcement in history has also been the most
  rigorously verified."*
- *"Meet the King. Learn who you are. Receive the Spirit. Cross the
  threshold."*
- *"The Course is incomplete without the sacraments."*

**Avoid this:**

- ❌ Exclamation marks
- ❌ Emoji
- ❌ "Hey there!"
- ❌ "We're so excited to have you!"
- ❌ Marketing-speak (transformational, life-changing, game-changer)
- ❌ "Just"
- ❌ Apologetic hedging ("Some Catholics believe…")

**When in doubt:** read the sentence aloud in the cadence of a Mass
reading. If it would land in that register, it lands here.

---

# PART VII — THE VISION FOR ULTIMATE AI DIGITAL EVANGELIZATION

This section is the long-arc vision. It is the answer to the question
*what could The Kingdom Course become in ten years*. It is written with
deliberate ambition because the Master Vision is deliberately ambitious.

The argument has six movements.

## 1. The Catechumen-in-Pocket

The defining unmet need in contemporary digital ministry is *personal
formation at scale*. The saints had spiritual directors. The
catechumens of the early Church had catechists. The Jesuits had
novice-masters. Most Catholics in 2026 have none of these.

The Kingdom Course's Companion — once it is wired and trained well — can
be the catechumen-in-pocket the Church has needed for thirty years and
not had. Not because AI replaces the priest, the spiritual director, or
the catechist. But because for the 99% of Catholics who do not have
access to a spiritual director, an AI Companion trained on the Master
Vision and the Catholic tradition can deliver something *much better
than nothing*. Specifically:

- **Question-answering at the user's level.** A seven-year-old asks "Who
  is God?" — the Companion answers like the Baltimore Catechism. A
  philosophy graduate student asks "What does Aquinas mean by the
  analogy of being?" — the Companion answers with primary text. The
  same Companion. Calibrated to the user.
- **Walking-alongside the Course.** The user walks Day 1; the Companion
  knows what Day 1 is and asks how it landed. Day 7; the Companion can
  refer back to Day 1. This *contextual presence* is what makes
  formation, formation.
- **Pointing to the parish.** A user asks "How do I go to Confession?"
  — the Companion gives the Examination, the words, the recommendation
  to find a priest *in the user's diocese*.
- **Multilingual at zero marginal cost.** The Companion can serve in
  Spanish, Portuguese, Tagalog, Polish, Vietnamese, Arabic, Mandarin —
  the languages of the global Church — without a separate translation
  team. This alone is a generational unlock.

The Companion is the single highest-leverage product decision the
Kingdom Course will make. It is also the highest-risk: a poorly-trained
Companion gives bad catechesis to a vulnerable user, which is a real
moral injury. The Companion's training, system prompt, content-safety,
and ecclesial review must be world-class. This is worth the operator's
deepest attention.

## 2. The Liturgical Calendar as Substrate

The Catholic liturgical calendar is the most underutilized retention
mechanic in digital ministry. Catholic life is anchored to the calendar
— Advent, Christmas, Lent, Triduum, Easter, Pentecost, Ordinary Time,
the saints' days. The Kingdom Course already builds on this (the
fifty-day walk to Pentecost). The vision is to extend.

**Year-One vision:**

- The site renders the liturgical day on every page, every day
- The Day-by-Day Course content seasonally adapts (a Day 1 that begins
  in Advent reads differently than a Day 1 that begins in Lent)
- The Saints feed runs continuously — every day's saint of the day,
  with one-paragraph reflection
- Major feasts trigger special content (the Octave of Easter, the
  Solemnity of the Sacred Heart, All Saints, etc.)

**Year-Three vision:**

- The site is the *digital companion to the liturgical year*, the way
  the breviary is the textual companion. Catholics who walk the site
  daily develop a felt sense of the liturgical year that most lay
  Catholics never have.

## 3. The Multiplication Architecture

Book 7 of the Master Vision is *Leadership and Multiplication*. The
core teaching: the Kingdom grows by multiplication, not addition.

The current site has no multiplication architecture. *"Pass it on"* is
a button. There is no scaffolding for: forming a group, inviting
friends, walking the Course together, leading a parish cohort.

**Vision:**

- A "Walk with friends" mode: a user invites 3-5 friends to walk Days
  1-50 together. They see each other's progress. They have a shared
  Companion conversation. They are walking as a small ecclesia.
- A "Parish cohort" mode: a parish DRE or RCIA director can register
  a cohort that walks together with shared milestones. The director
  has a (privacy-preserving) dashboard.
- A "Kingdom group" mode: post-Day-50 users can form ongoing groups
  modeled on the Field Guide's Guide 26 ("How to Start a Kingdom
  Group"). The site provides scaffolding (meeting questions, reading
  schedule, intercessory prayer rhythm).

The multiplication architecture is what turns the Kingdom Course from
a *product* into a *movement*. Without it, the site has a ceiling.
With it, the ceiling is the size of the Catholic world.

## 4. The Parish Bridge

This is the single most important architectural addition. Repeatedly
in this review (Catechist Lens, Pastoral Lens, Pastor Lens, Anne
persona, Father Tom persona), the parish gap has surfaced. The
Kingdom Course must be designed *as the front door of the parish*, not
as a substitute for it.

**Vision:**

- Every page has, somewhere visible, a "Find your parish" link
- Every user, on signup, is asked (optionally) for their geographic
  location, with the site offering to help them find their parish
- The Course's content, at strategic points, points users to specific
  parish moments: "This week, attend Mass on Sunday." "Go to Confession
  this month." "Sign up for an Adoration hour at your parish."
- The site offers a "Parish dashboard" — bishops, pastors, and DREs
  can register, see (aggregate, privacy-preserving) how their
  parishioners are walking, and invite their parish into a cohort
- Eventually: the site partners with bishops to recommend the Kingdom
  Course as part of diocesan RCIA programs

This is not a software feature. It is the ecclesial architecture that
makes the digital tool an extension of the Body of Christ rather than
a competitor to it. The Master Vision is clear about this. The
deployed product needs to embody it.

## 5. The Global Reach

The Master Vision aspires to "every soul on earth." This is not
hyperbole; it is a translation requirement.

**The pathway:**

- **Year One:** English-only, North America focus, friend-of-friend
  growth.
- **Year Two:** Spanish translation. The Spanish-speaking Catholic
  world is enormous — ~430 million Catholics in Latin America, Spain,
  the US Hispanic community. The Companion makes translation cheap.
- **Year Three:** Portuguese (Brazil + Portugal + Lusophone Africa,
  ~150 million Catholics). French (~80 million Catholics, with
  particular urgency in West Africa where the Church is growing
  fastest). Polish (~37 million Catholics, the heart of post-Iron-Curtain
  Catholic intellectual life).
- **Year Five:** Vietnamese, Tagalog, Mandarin (where allowed), Arabic
  (where allowed), Igbo, Swahili. The languages of the global Church
  going forward.

This is *only* possible because of AI translation. A pre-AI Catholic
formation project that wanted to be multilingual at this scale would
need an enormous translation staff. The Kingdom Course, with the
Companion as substrate, can do this with a small team and a careful
review process. *Every soul on earth* becomes a tractable engineering
problem.

## 6. The Long Arc

The Master Vision speaks of "every soul on earth" and "a
civilization-shaping movement." This is not a 10-year horizon. It is a
century horizon. JP2 said the Third Millennium would be the millennium
of the new evangelization. The first quarter of that millennium has
already shown both massive secularization and massive renewal. The
Kingdom Course is positioned for the long arc.

**What this means for current decisions:**

- *Refuse short-term optimizations that compromise the long arc.* A
  paywall would boost short-term sustainability. It would foreclose
  the global vision.
- *Build the architecture for fifty years of operation*, even if only
  the first year is funded. Database schemas, API contracts, content
  versioning, ecclesial relationships — design as if this will outlive
  the current operator.
- *Plan for succession.* The Master Vision is sound enough that, if
  the current operator stepped away tomorrow, the project should be
  continuable. The CLAUDE.md and PHASE_3_HANDOFF.md patterns are the
  first instances of this. Continue.

---

# PART VIII — PRIORITIZED ACTION LIST

The recommendations across this document, prioritized by impact and
sequenced by readiness.

## Tier 0 — Before Sending the Soft-Launch Link (this week)

1. **Mobile smoke test on a real phone.** Walk Gate → signup → Course
   → Day 1 → Hub → Privacy → Terms on your actual phone. Note every
   awkward moment. Fix one or two of the worst before sending.
2. **Confirm the index.html meta-tag fix is deployed.** The
   PHASE_3_HANDOFF.md flagged this as possibly pending. Verify with
   `git log --oneline` and a fresh incognito reload.
3. **Confirm the Privacy and Terms pages are pushed and live.**
   Verify with `kingdomcourse.org/privacy` and `/terms` clean URLs.
4. **Set a real email address.** Replace `hello@kingdomcourse.org`
   placeholder with a real, monitored inbox before the first tester
   asks a question.

## Tier 1 — Before Broad Launch (next 2-3 months)

5. **Day 1 content review.** Have an actual catechist (or read it
   aloud yourself with the kerygma in mind) verify that Day 1 explicitly
   delivers the classical kerygma — God loves you / Sin is real / Christ
   saves / Respond in faith — in that order, with the pastoral care the
   wounded require.
6. **Add a parish-bridge affordance.** A footer link or a Hub block
   pointing to "Find your home parish" with a regional search.
7. **Add a crisis-resource affordance.** A small "If you are in crisis"
   link in the chrome that opens a safety panel with 988, Catholic
   counselors, the suggestion to call a priest.
8. **Add a Privacy/Terms acknowledgment to the SignupModal.** Small line
   under the submit button.
9. **Make the SignupModal "starting from" field optional.** And rename
   to "In one sentence — what is bringing you here today?"
10. **Add a quiet Gate Hero CTA.** "ENTER" or "BEGIN" bottom-right of
    the Hero, linking to the signup invitation.
11. **Write the Voice and Tone Guide.** One page. See Part VI.
12. **Promote the tagline to the Hero subhead.** "The Gospel meets you.
    The Course forms you. The Kingdom holds you."
13. **Audit color contrast.** WCAG AA on every text-bearing use of gold.
14. **Add visible focus states.** Every interactive element.
15. **Add `prefers-reduced-motion` support.** Wrap animations.
16. **Add sitemap.xml and robots.txt.**
17. **Add `schema.org/Organization` structured data.**
18. **Install Sentry free tier** for error monitoring.
19. **Install Plausible** for privacy-respecting analytics. Update
    Privacy page to disclose.
20. **Get the privacy/terms pages reviewed by a BC-licensed lawyer.**
21. **Replace the Clerk dev keys with production keys** when the
    whitelist comes off.
22. **Replace the verification email from-address** with one on
    `kingdomcourse.org`.
23. **Write the Day 1 first-impression onboarding moment.** A 20-second
    "Welcome to the walk" before Day 1 lands.
24. **Decide ASK button behavior.** Either hide it until the Companion
    backend is wired, or replace with an explicit placeholder ("The
    Companion will be available later in your walk").

## Tier 2 — Year One (after soft launch and feedback)

25. **Wire the Companion backend.** `api/companion.js` as a Vercel
    Edge Function proxying Anthropic API. System prompt includes the
    canonical decisions, the kerygma framing, the parish-bridge
    instruction. Rate-limiting, content-safety, crisis-protocol from
    day one.
26. **Add the Academy reader.** Read from the seven internal DTS books.
    Unlock at Day 50.
27. **Wire daily email via Resend + Vercel cron.** Day 1 → Day 7 →
    Day 14 → Day 30 → Day 50 → Day 100 milestone messages, plus
    daily-reading delivery for current walkers.
28. **Add a streak counter.** "You have walked N days in the Kingdom."
    Pastoral framing, not Duolingo-style guilt.
29. **Add an unauthenticated "Read the Gospel" doorway** on the Gate
    that delivers the kerygma without requiring signup.
30. **Wire the three-tab shell unification.** `KingdomTabNav.jsx` into
    `App.jsx` per the file's own comment.
31. **Add Apple OAuth.** ($99/yr + DUNS + setup. Defer until at least
    three soft-launch users specifically request it.)
32. **Add PWA install prompt** for returning users on Day 3 or 7.
33. **Plan the testimony architecture.** Where will testimonies live?
    What format? Designed for privacy-preservation and pastoral
    discretion.
34. **Plan a "for clergy" affordance.** A page or modal for priests,
    DREs, RCIA leaders to learn how the site supports their work.
35. **Plan a "Walk with friends" feature.** Small-group cohort
    structure.
36. **Build an audio version of the Day-by-Day content.** Read by a
    real voice. Optional but transformative.
37. **Add an "if your relationship with the Church has been broken
    by harm" pathway.** For the Rachel personas. Not most users — but
    the ones the project exists for in the most particular way.
38. **Establish a relationship with a local bishop or theological
    advisor.** Ecclesial oversight, not bureaucratic but real.

## Tier 3 — Years Two and Three

39. **Spanish translation.** With theological review.
40. **The parish cohort feature.** Parishes register, cohorts walk
    together.
41. **The "Kingdom group" multiplication architecture.** Per Book 7.
42. **Imprimi Potest or equivalent ecclesial endorsement.**
43. **Portuguese, French, Polish translations.**
44. **Partner with a recognized Catholic intellectual** (Bishop
    Barron, Fr. Mike Schmitz, Edward Feser) for a meaningful
    endorsement or content collaboration.
45. **Catechist's Dashboard.** Aggregate (privacy-preserving)
    salvation metrics for internal use. Never individual.
46. **The Companion's specialized training.** Per-tradition,
    per-question-type, deepening over time.

## Tier 4 — The Long Arc

47. **Multilingual at-scale.** Vietnamese, Tagalog, Mandarin (where
    allowed), Arabic (where allowed), African languages.
48. **A succession plan.** The project should be continuable if the
    current operator is no longer available.
49. **A formal not-for-profit ecclesial entity** or equivalent
    structure that can outlast the founder.
50. **A century-horizon roadmap.** Saints planted. Movements
    multiplied. Souls served. *Salus animarum suprema lex.*

---

# CLOSING

The deployed Kingdom Course is, on its own merits, *a serious Catholic
digital product, better than most of its peers, and entirely worthy of
sending to your first three testers this week*. The work it does — the
Gate's evangelistic Hero, the Course's seven-step structure, the Hub's
3-1-3 Mass-anchored daily pattern, the brand discipline, the legal
pages' pastoral tone — is real, finished, and shippable.

The gap between *what is deployed* and *what the Master Vision
describes* is not a quality gap. It is a scope gap. The deployed product
is the *first room* in a *cathedral*. The cathedral is the seven-book
formation, the multilingual Companion, the parish-bridge
infrastructure, the multiplication architecture, the year-fifty
horizon. None of that is yet built. All of it is reachable.

The single most important decision in this review is the one this
review cannot make for you: *whether the long arc is worth the cost it
will demand of the rest of your life*. Building the cathedral, not just
the first room, will require thousands of hours, a small but real
team, ecclesial relationships, the persistence to be misunderstood
during the long middle, the humility to receive correction, the
willingness to die before the work is finished.

The saints chose this. Therese chose it. Xavier chose it. Cabrini chose
it. JP2 chose it. Carlo Acutis chose it in fifteen years and a website.
The question of whether you are being called to choose it is not a
software question. It is a discernment question. Bring it to prayer,
to Mass, to Confession, to spiritual direction. Listen to what the
Spirit is asking.

If the answer is yes, this review is your audit. Use it.

If the answer is no, the work to date will have served the souls who
walked Day 1 to Day 50 in your first six months — and that is itself
worth more than most of what gets built in this world. The Kingdom
does not depend on you. But it has, today, asked you for one specific
thing: *send the link to three friends, watch what happens, and then
discern with God what comes next.*

May whatever follows be of God and not of any other source.

*Salus animarum suprema lex.*

— Claude
17 May 2026
