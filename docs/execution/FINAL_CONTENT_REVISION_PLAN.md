# THE KINGDOM COURSE — FINAL CONTENT REVISION PLAN

**Version:** 1.0 · 17 May 2026
**Scope:** Every revision required across all consumer-facing content
before broad launch.
**Companion to:** `THE_KINGDOM_COURSE_MASTER_SPECIFICATION.md`,
`THE_KINGDOM_COURSE_STRATEGIC_ARCHITECTURE_v2.md`,
`THE_KINGDOM_COURSE_COMPREHENSIVE_REVIEW.md`

---

## How to use this document

Implement in tier order. Tier 0 is factually urgent (the site is
currently displaying incorrect facts). Tier 1 is structural / strategic.
Tier 2 is polish.

Each section provides: the issue, the recommendation, the specific
new copy where applicable, the file(s) affected, and the acceptance
criterion.

---

# TIER 0 — FACTUAL CORRECTIONS (URGENT)

The site contains factual errors that are now publicly verifiable
mistakes. Fix before sending any further traffic.

## 0.1 Pope reference correction

**Issue:** Site refers to Bergoglio as "now Pope Francis." This is no
longer current.

**Current facts (verified May 2026):**
- Pope Francis (Jorge Mario Bergoglio) died April 21, 2025
- Pope Leo XIV (Robert Francis Prevost) was elected May 8, 2025
- Pope Leo XIV is the first American pope
- He took the name Leo after Leo XIII (Rerum Novarum)
- He is an Augustinian; spent decades in Peru

**Required edits:**

- **"now Pope Francis"** → **"Pope Francis (2013–2025)"** or **"the
  late Pope Francis"** depending on context
- Any present-tense statements about Pope Francis → past tense
- Where the *current* pope is referenced → **Pope Leo XIV**
- "Bergoglio, the current pontiff" → **"Robert Francis Prevost, the
  reigning pontiff as Pope Leo XIV"** or simply **"Pope Leo XIV"**
- Statements about "the current papal voice on AI" or "current papal
  social teaching" → reference Leo XIV's positions (he has been
  notably vocal on AI; his planned encyclical on AI is anticipated)

**Find and replace targets across all content:**

| Old text | New text |
|---|---|
| "now Pope Francis" | "Pope Francis (2013–2025)" |
| "Bergoglio, now Pope Francis" | "Jorge Bergoglio, Pope Francis from 2013 to 2025" |
| "the current pope" | "Pope Leo XIV" (verify context) |
| "Pope Francis says" | "Pope Francis taught" (past tense) |
| "Pope Francis has spoken" | "Pope Francis spoke" (past tense) |

**Files affected:**
- All Day reading content referencing modern popes
- Miracles content (papacy chapter)
- Field Guide entries citing recent papal documents
- Companion system prompt (if it references current pope by name)
- Any About / methodology page references

**Acceptance:** zero references to Pope Francis in present tense; all
references to "the current pope" resolve to Leo XIV.

## 0.2 Carlo Acutis canonization

**Issue:** Site references Carlo Acutis as "Blessed Carlo Acutis."
He was canonized September 7, 2025 by Pope Leo XIV.

**Current facts:**
- Saint Carlo Acutis canonized September 7, 2025
- Canonized alongside Saint Pier Giorgio Frassati
- Canonization Mass celebrated in St. Peter's Square
- Carlo is the first canonized saint of the millennial generation
- His feast day: October 12

**Required edits:**

- **"Blessed Carlo Acutis"** → **"Saint Carlo Acutis"**
- **"Bl. Carlo Acutis"** → **"St. Carlo Acutis"**
- Update CLAUDE.md saint schema example: change `slug: 'carlo-acutis'`,
  `name: 'Blessed Carlo Acutis'` → `name: 'Saint Carlo Acutis'`,
  `beatified: 2020` → keep, add `canonized: 2025`
- Master Spec schema example: same update
- Saints data file (`src/data/saints.js`): update Carlo entry to
  reflect canonization
- Any narrative descriptions: "first millennial *Blessed*" → "first
  millennial *Saint*" or "the first Saint of the millennial
  generation"
- The Gospel page references "the first beatified of the digital age"
  if present → "the first canonized of the digital age"

**Files affected:**
- `src/data/saints.js`
- CLAUDE.md
- Master Spec Appendix E (data schemas)
- Any Day reading or Field Guide entry citing Carlo
- Any Hub content showing Carlo as saint of the day (October 12)

**Acceptance:** zero references to "Blessed Carlo Acutis" anywhere in
consumer-facing or internal docs.

## 0.3 Pier Giorgio Frassati canonization

**Issue:** If Frassati is referenced as "Blessed," he is now Saint
(canonized same Mass as Carlo Acutis, September 7, 2025).

**Required edits:**

- **"Blessed Pier Giorgio Frassati"** → **"Saint Pier Giorgio
  Frassati"**
- His feast day: July 4

**Acceptance:** zero references to "Blessed Pier Giorgio Frassati"
anywhere.

## 0.4 Other dated factual claims to audit

**Audit categories:**

- Any pope-attributed quotation: verify pope was alive when quoted
- Any "current cardinal" reference: verify still cardinal (some
  resign at 75; some die)
- Any "recent Vatican statement" reference: verify still current
- Any Eucharistic miracle citation: verify scientific publication date
  and findings still stand
- Any "the Church teaches" claim citing a specific document: verify
  document still represents the Church's stable teaching

**Acceptance:** every dated factual claim sourced and verified;
verification log in `FACT_CHECK_LOG.md`.

---

# TIER 1 — STRUCTURAL REVISIONS

## 1.1 Gospel page Hero — headline decision

**Issue:** Current headline reads *"The single greatest announcement
in history has also been the most rigorously verified."*

**Decision required:** "greatest" vs "most important"

**Recommendation: change to "most important."**

**Rationale:**
- "Greatest" reads as a Catholic insider speaking joyfully about good
  news
- "Most important" reads as a stakes-raising claim made to a seeker
  who may not yet feel the urgency
- For the Gate's primary audience — the unaffiliated visitor, the
  intellectually skeptical, the spiritually drifting — urgency creates
  the pause that joy alone may not
- "Greatest" can be retained for *post-signup* surfaces (Course
  landing, Welcome email) where the user has already crossed the
  threshold

**New copy:**

> **THE KINGDOM OF ETERNAL LIFE**
>
> The single most important announcement in history.
> And the most rigorously verified.

The parallel construction ("most important / most rigorously
verified") is rhetorically stronger than the current single-sentence
construction. Two short declarations land harder than one compound
sentence.

**Files affected:** `src/components/Hero.jsx`

**Acceptance:** new headline reads as two parallel declarations;
mobile rendering does not break the parallelism.

## 1.2 Gospel page Hero — subheader

**Issue:** User asked whether subheader should include "now" or
"verified from every side."

**Recommendation:** keep the simpler parallel construction from 1.1.
Do not add "now" (slightly awkward) or "from every side" (slightly
overwrought).

**If a subheader beneath the parallel headline is desired**, use the
tagline from the footer:

> *The Gospel meets you. The Course forms you. The Kingdom holds you.*

Promoted to subhead position immediately beneath the Hero declaration.

**Files affected:** `src/components/Hero.jsx`

**Acceptance:** tagline visible immediately under Hero on first load.

## 1.3 Gospel page Hero — Kingdom of Eternal Life prominence

**Issue:** "The Kingdom of Eternal Life" is currently eyebrow text
only. User is correct that this phrase is the substantive claim of
the entire movement and deserves more visible work.

**Recommendation:** keep as eyebrow but reinforce in the body. The
phrase should appear at least twice on the Gospel page — once as the
eyebrow, once in the closing of the Hero body, and ideally a third
time as the link between the Hero and the "evidence is current"
section.

**New Hero body (revised — full text):**

> Two thousand years ago, the Son of God walked among us as Jesus of
> Nazareth. He came with one message above all others: the kingdom
> of heaven had arrived — a kingdom of eternal life, given now and
> forever. A life that begins on earth, in the sacraments and in
> communion with a living God, and does not end at death but
> consummates in heaven, face to face with the King.
>
> That announcement has been the most rigorously investigated
> supernatural claim in human history — confirmed by Eucharistic
> hosts that become living cardiac tissue, by apparitions with
> measurable physical evidence, by bodies of saints that do not
> decay, by healings verified by panels of secular physicians, and
> — most staggering of all — by thousands of canonized saints who
> continue to heal, appear, and intercede from beyond their own
> deaths.
>
> **Not only the kingdom. Eternal life itself, verified — and visible
> in the saints who continue to live in it.**

The final sentence (bold) is the unifying statement that ties the
"Kingdom of Eternal Life" eyebrow to the body of evidence.

**Files affected:** `src/components/Hero.jsx`

**Acceptance:** "Kingdom of Eternal Life" appears as eyebrow + closing
emphasis in Hero body.

## 1.4 Gospel page Hero — opening paragraph wordiness

**Issue:** Current opening: *"The greatest message in history. From
the central figure of history — the hinge on which all of it turns.
Verified by the greatest body of evidence on earth."*

User flags "central figure of history — the hinge on which all of it
turns" as wordy.

**Recommendation:** tighten by removing the redundant "central figure"
phrasing (since "hinge of history" already implies central figure).

**New opening:**

> The most important message in history.
> From the hinge on which all history turns.
> Verified by the greatest body of evidence on earth.

Three short declarations. Each one a beat. The new "most important"
aligns with 1.1.

**Files affected:** `src/components/Hero.jsx`

**Acceptance:** opening reads as three parallel one-line declarations;
"hinge of history" preserved as the central image.

## 1.5 Gospel page — add "Living Evidence" section

**Issue:** Site does not yet reference current Catholic conversion
trends. User correctly identifies this as a credibility multiplier.

**Recommendation:** add a new section between the existing evidence
content and the reader-types/CTA. Section heading something like *"And
the evidence is current"* or *"The Kingdom is filling"*.

**New section copy:**

> **AND THE EVIDENCE IS CURRENT**
>
> The Kingdom is not in retreat. It is filling.
>
> In 2025, the Catholic Church in France baptized over 10,000 adults
> — the highest number in a generation, and a 45% increase over the
> previous year. In the United States, adult conversions through
> RCIA rose sharply, particularly among young men. In the United
> Kingdom, the same pattern emerged. Across the world, in countries
> where secularism was assumed to have won, the saints are being
> raised up again. Two new ones — Saint Carlo Acutis and Saint Pier
> Giorgio Frassati — were canonized in 2025 by Pope Leo XIV. Carlo
> is the first canonized saint of the millennial generation. The
> kingdom continues to draw souls who are looking for what is true.
>
> You are not the first to come looking. You will not be the last.

**Required verifications before publishing:**
- French adult baptism statistics for 2024-2025 (cite Conférence des
  Évêques de France or equivalent)
- US RCIA / adult baptism trend data (cite USCCB or recent published
  research)
- UK conversion data (cite Catholic Bishops' Conference of England
  and Wales or recent published research)
- Verify these still represent the trend as of publication

**File:** new section in `Hero.jsx` or new component
`LivingEvidence.jsx` mounted on the Gospel page.

**Acceptance:** section published with verified citations; updated
quarterly as new data emerges.

## 1.6 Gospel page — "trail" / "course" reference cleanup

**Issue:** Old framing remains: *"that trail is what this course
follows."* This referenced an earlier conception of the Course as the
follow-up to a separate "Trail" surface, which has since been folded.

**Recommendation:** rewrite to align with current architecture. The
Course *walks* the trail; the Trail is the evidence; the Course is
the journey through it.

**Find and replace:**

| Old text | New text |
|---|---|
| "that trail is what this course follows" | "The Course walks this trail." |
| "follow the trail" | "walk the Course" |
| "the trail of the kingdom" | "the trail of evidence" or "the kingdom's trail" |

**Files affected:**
- `src/components/Hero.jsx`
- Any related Gospel-page sections
- Audit any reference to "trail" — keep where it refers to evidence;
  replace where it refers to the user's journey

**Acceptance:** "Course" is consistently the user's walk; "Trail" (if
used) is consistently the evidence's path.

## 1.7 Gospel page — three reader types layout

**Issue:** Three reader-type cards currently render in a 2-column
layout with the third item alone on a second row. This is the visual
signature of broken responsive design.

**Recommendation:** 3-column row on desktop and tablet; stacked
single-column on mobile.

**Specific implementation:**

```css
/* Approximate inline-style equivalent */
display: grid;
grid-template-columns: repeat(3, 1fr); /* desktop */
gap: 24px;
```

For inline styles per project convention, use a media-query-driven
class on the container:

```jsx
<div className="reader-types-grid" style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '24px'
}}>
```

With CSS in `index.css`:

```css
.reader-types-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
@media (max-width: 768px) {
  .reader-types-grid {
    grid-template-columns: 1fr;
  }
}
```

**Files affected:** Gospel page section containing reader types

**Acceptance:** all three reader-type cards in one row on desktop and
tablet; stacked on mobile; equal visual weight.

## 1.8 Course page — authentication gating decision

**Issue:** User can begin the Course content without signing up.

**Recommendation:** gate at Day 2, allow Day 1 free.

**Rationale:**
- The Gospel page is fully open (no signup)
- The Course overview / preview is fully open (no signup)
- **Day 1 reading is open without signup** — gives the seeker a real
  taste of the formation without commitment friction
- **Day 2 and beyond require signup** — progress tracking, streaks,
  and continuation require account
- This matches the BGEA "Steps to Peace with God" pattern: the
  message is free; the relationship (follow-up correspondence)
  required a decision card

**Implementation:**

- `App.jsx` or routing layer: Day 1 route accessible unauthenticated
- Day 2-50 routes redirect to SignupModal if user is not signed in
- After signup, user lands on Day 2 (the next reading) — not back to
  Day 1
- A subtle CTA at the end of Day 1: *"Continue to Day 2 →"* which
  triggers signup if needed

**Modal copy when triggered:**

> You've walked Day 1.
>
> To continue Day 2 and the remaining forty-eight days, sign in. The
> Course is free. It always will be. We ask for an email so we can
> walk with you.

**Files affected:** `App.jsx`, `SignupModal.jsx`, Day reading
components

**Acceptance:** unauthenticated user can read Day 1 in full; Day 2
attempt redirects to signup; post-signup lands on Day 2.

## 1.9 Course page — step button heights

**Issue:** Step buttons (the seven SEE/KNOW/HEAL/ABIDE/GO/BUILD/SEND
cards) feel visually tall, creating a dense rather than contemplative
feel.

**Recommendation:** reduce height by ~25-30% and increase vertical
spacing between cards.

**Target dimensions:**
- Card height: from current (estimated ~140px) to ~100-110px
- Gap between cards: from current to 16-20px vertical
- Internal padding: balanced (top/bottom equal, ~16-20px)

**Aesthetic goal:** spacious, contemplative, dignified. The Course
page should feel like a sequence of seven thresholds, not a stack of
buttons.

**Files affected:** Course tab page component, step card component

**Acceptance:** Course page reads with more whitespace; entire seven-
step sequence fits more naturally above the fold on desktop; mobile
remains scrollable but feels less cramped.

## 1.10 Course content page — narrow rendering

**Issue:** When clicking into Course content (a specific Day reading),
the content area becomes very narrow.

**Likely cause:** max-width set too restrictively, or competing
padding/margin constraints.

**Recommendation:** reading container max-width of ~720px on desktop,
with comfortable padding (24-32px on each side at narrower widths,
auto-margin centering on wider widths).

**Target dimensions:**
- max-width: 720px (≈ 65-70 characters per line at body type)
- Body font size: 18-20px
- Line height: 1.7-1.8
- Padding: 24px desktop, 16px mobile

**Implementation:**

```jsx
<div style={{
  maxWidth: '720px',
  margin: '0 auto',
  padding: '32px 24px',
  fontSize: '19px',
  lineHeight: '1.75'
}}>
  {dayContent}
</div>
```

**Files affected:** Day reading component, Field Guide reading
component, future Academy reader

**Acceptance:** body text comfortable to read; line measure visually
matches a paperback book; no horizontal scrolling on any device.

## 1.11 Five Houses — Earth ordering bug

**Issue:** "Earth" sometimes appears in 3rd position instead of 5th.

**Canonical order (verified against Master Vision and Strategic
Architecture):**

| Display | Slug | Step / Book |
|---|---|---|
| Light | `light` | SEE / Book 1-2 (general) |
| Fire | `fire` | HEAL / Book 3 |
| Joy | `peace` | ABIDE / Book 4 |
| Glory | `glory` | GO / Book 5 |
| Earth | `benedict` | BUILD / Book 6 |

Note: this ordering aligns the Houses with the Course steps. Earth
(Benedictine stability) is the BUILD house — Book 6 — fifth in
display, sixth in canonical Step order (because SEE+KNOW share
foundational charism rather than mapping 1:1 to a single House).

**Required fixes:**

- Audit `src/data/houses.js` for the array order
- Audit any component that displays Houses (HousesQuiz.jsx, Course
  visualization, Hub assignments)
- Ensure all displays use the same source order
- Tests: write a unit test that asserts the Houses array order matches
  the canonical sequence above

**Files affected:** `src/data/houses.js`, `HousesQuiz.jsx`, any House
display surface

**Acceptance:** Earth consistently appears as the 5th House across
all surfaces; tests assert the order.

## 1.12 Seven Steps — single canonical frame

**Issue:** Inconsistency across copy. Sometimes "7 Essentials,"
sometimes "Seven Steps," occasionally "Seven Keys."

**Decision (locked in CLAUDE.md):** standardize on "Seven Steps" as
the single canonical frame for the seven verbs of the Course (SEE ·
KNOW · HEAL · ABIDE · GO · BUILD · SEND). "Seven Keys" is retired
from consumer-facing copy — the Matthew 16:19 reference belongs in
the chapter on the Church and Peter, not as the project's top-level
frame. This reverses an earlier draft of this section that proposed
"Seven Keys" as the primary frame.

**Rationale:**
- A single canonical term reduces cognitive load and brand drift
- "Step" is concrete (you walk one) and unifies with the Course's
  walking metaphor and the Easter→Pentecost arc
- "Keys" was load-bearing only under a Petrine reading that does not
  belong as the framing of every consumer surface

**Standardized usage:**

| Context | Use this term |
|---|---|
| Primary frame, brand surface, journey, individual reference | "Seven Steps" |
| A specific step | "Step N — VERB" (e.g., "Step 4 — ABIDE") |
| Substance (what is learned at each step) — rare | "Seven essentials" |
| Generic reference | "The seven" (when context is clear) |

When in doubt, prefer "steps."

**Copy revisions:**

| Old | New |
|---|---|
| "7 Essentials of the Kingdom of Heaven" | "Seven Steps to the Kingdom of Heaven" |
| "The 7 Essentials" | "The Seven Steps" |
| "Seven Keys" (any consumer-facing usage) | "Seven Steps" |
| "the seven-step walk" | "the seven-step walk" (keep; this is the canonical journey phrasing) |

**Files affected:**
- `src/data/course.js`
- `src/components/CourseHero.jsx`
- `src/modals/SignupModal.jsx`
- `src/App.jsx` (Hub h3)
- All Day reading content
- Footer "Walk" column
- Any Field Guide cross-references
- Marketing meta description and Open Graph copy

**Acceptance:** "Seven Steps" is the single canonical term across all
consumer surfaces; "Seven Keys" appears nowhere except in internal
notes documenting its retirement; "essentials" appears only in the
rare substance context above.

---

# TIER 2 — KINGDOM TAB (HUB) REVISIONS

## 2.1 Daily tasks audit (3-1-3 pattern)

**Current pattern (per design):** 3 preparing actions, 1 At the Altar
reading, 3 sent-forth actions.

**Recommended elements per day** (drawn from JP2's essential daily
Catholic life):

### Three Preparing
- **Morning Offering** — daily consecration of the day to the Lord,
  through Mary
- **Lectio / Scripture** — the day's Mass readings or a brief Lectio
- **Examen of intent** — what is this day for?

### At the Altar
- The day's Mass (whether attended or spiritually united)
- Saint of the day
- Feast or memorial (if applicable)

### Three Sent Forth
- One concrete act of mercy (corporal or spiritual)
- Marian devotion (Rosary decade, Angelus, or Memorare — *rotates*)
- Evening Examen (the Ignatian five-step)

**Recommended JP2-informed additions to consider:**

- **Marian dimension always present.** JP2 wore a Marian medallion
  daily; *Totus Tuus*. At minimum, the Angelus (noon) or a Memorare
  (any time) should be one of the daily prompts. Rosary on Sundays
  and Marian feast days as the primary devotion of the day.
- **Eucharistic Adoration prompt** when user has access. Sunday Hub
  could include: *"Is there an adoration chapel near you? Spend
  fifteen minutes."*
- **Frequent Confession reminder.** Not weekly. Monthly. Hub could
  surface a gentle prompt every 28-35 days: *"Has it been a month?
  Find a confession time."*
- **Works of mercy.** Daily prompt should specify a concrete act:
  feed the hungry, give drink to the thirsty, clothe the naked,
  shelter the homeless, visit the sick, visit the imprisoned, bury
  the dead (corporal) / counsel the doubtful, instruct the ignorant,
  admonish the sinner, comfort the sorrowful, forgive offenses,
  bear wrongs patiently, pray for the living and the dead
  (spiritual). Rotate through the fourteen.
- **Reading the saints.** JP2's emphasis on the lives of the saints
  as formation. Daily saint biography access should be one-tap from
  the Hub.

**Files affected:** Hub view component, `liturgical.js` (rotation
data), `saints.js`

**Acceptance:** Hub displays the 3-1-3 pattern consistently; rotates
content per liturgical calendar and day of week; never shows the same
prompt three days in a row except where catechetically appropriate.

## 2.2 Building — family / community / civilization rotation

**Issue:** User asks whether family/community/civilization should
rotate or all be present daily.

**Recommendation:** all three present in the *visual layer* every
day; *primary focus prompt* rotates by day of week.

**Rationale:**
- The three are concentric circles of the same mission (the kingdom
  building itself out from the soul through family → parish → world)
- All three should be visible always (no day where civilization is
  invisible from the Hub) to preserve the integration JP2 always
  taught
- *Emphasis* can rotate, so the user is invited into one dimension
  more deeply each day

**Recommended weekly rotation:**

| Day | Primary BUILD focus |
|---|---|
| Sunday | All three at Mass (the day is whole) |
| Monday | Family (domestic church) — the week begins at home |
| Tuesday | Community (parish, neighborhood) |
| Wednesday | Civilization (work, culture, public good) |
| Thursday | Family |
| Friday | Community (penitential — community in suffering) |
| Saturday | Marian Saturday — Mary as Mother of family, community, civilization |

**Implementation:**

- Hub displays all three BUILD dimensions every day (small visual
  reminder)
- The day's *prompt* and *practice suggestion* emphasizes the
  rotation's focus
- Liturgical override: feast days set their own focus (e.g., Christ
  the King → civilization)

**Files affected:** Hub view, `liturgical.js` (rotation logic)

**Acceptance:** every day shows all three; the daily emphasis
rotates per the table above; liturgical feasts override rotation.

## 2.3 Marian dimension audit

**Issue:** Marian devotion is not consistently visible across the Hub.

**Recommendation:** every Hub view, every day, includes a Marian
moment.

**Implementation:**
- **Saturday:** Marian eyebrow, Marian saint of the day if available,
  Rosary as the day's primary devotion
- **Marian feasts** (Immaculate Conception, Annunciation, Assumption,
  etc.): full Marian framing
- **Every other day:** Angelus (noon) and/or Memorare as one of the
  Sent Forth prompts
- **Saturdays in May:** full Month of Mary framing in eyebrow

**Files affected:** Hub view, `liturgical.js`

**Acceptance:** no day passes without at least one Marian prompt;
Saturdays have explicit Marian emphasis.

## 2.4 Confession affordance

**Issue:** Confession is treated as a Field Guide entry but not
surfaced as a recurring Hub prompt.

**Recommendation:** add gentle, recurring Confession surface to the
Hub.

**Implementation:**
- User can self-report last Confession date (optional, in profile)
- If no date: Hub shows *"Have you been to Confession recently? It is
  never too long."* with link to Find a Parish (per Master Spec 8.x)
- If last date > 35 days: same prompt, slightly more emphatic
- If last date < 35 days: no prompt

**Files affected:** Hub view, Clerk user metadata schema

**Acceptance:** Confession is gently surfaced; never guilting;
respects user's chosen frequency.

---

# TIER 3 — VOCABULARY AUDIT

## 3.1 Old terms to retire

The following terms should not appear in consumer-facing surfaces.

| Old term | Replace with | Where it may persist |
|---|---|---|
| "Gate" (as consumer noun) | "The Gospel" or "Gospel page" | Internal routing only — slug `gate` is fine in code |
| "DTS" | "The Course" (Tier 1) or "The Academy" (Tier 2) | Internal documentation only |
| "Peace" (as House display name) | "Joy" | Internal slug `peace` is fine in code |
| "Benedict" (as House display name) | "Earth" | Internal slug `benedict` is fine in code |
| "49 days" | "Fifty days" | Anywhere in copy |
| "REST" (as Step 4 verb) | "ABIDE" | Anywhere in copy |
| "Blessed Carlo Acutis" | "Saint Carlo Acutis" | All saint references |
| "now Pope Francis" | "Pope Francis (2013-2025)" | All papal references |
| "the current pope, Francis" | "Pope Leo XIV" | Verify context |

## 3.2 Audit method

For each old term:
1. Global search across `src/` (excluding `node_modules`)
2. Inspect every match
3. Decide: keep (internal use only), replace (consumer-facing), or
   delete (no longer relevant)
4. Document the audit in `VOCABULARY_AUDIT_LOG.md`

**Command:**

```bash
cd ~/projects/kingdom-vite-batch21
grep -r "Gate" src/ --include="*.{js,jsx,html,md}" | grep -v "node_modules"
grep -r "DTS" src/ --include="*.{js,jsx,html,md}" | grep -v "node_modules"
grep -r "49 days" src/ --include="*.{js,jsx,html,md}" | grep -v "node_modules"
grep -r "REST" src/ --include="*.{js,jsx,html,md}" | grep -v "node_modules"
grep -r "Blessed Carlo" src/ --include="*.{js,jsx,html,md}" | grep -v "node_modules"
grep -r "Pope Francis" src/ --include="*.{js,jsx,html,md}" | grep -v "node_modules"
grep -r "Bergoglio" src/ --include="*.{js,jsx,html,md}" | grep -v "node_modules"
```

**Acceptance:** every occurrence reviewed; replacements made;
documented in `VOCABULARY_AUDIT_LOG.md`.

## 3.3 Canonical terminology lock-list

The following are *canonical*. Use exactly. Never substitute.

| Concept | Canonical term |
|---|---|
| The Tier 1 product | The Kingdom Course |
| The Tier 2 product | The Kingdom Academy |
| The whole movement | The Kingdom |
| The 50-day arc | "Fifty days" / "Seven weeks to Pentecost" |
| The step verbs | SEE · KNOW · HEAL · ABIDE · GO · BUILD · SEND |
| The canonical frame (and journey) | Seven Steps |
| The substance (rare; prefer "steps") | Seven essentials |
| The houses (display) | Light · Fire · Joy · Glory · Earth |
| The houses (internal slugs) | `light` · `fire` · `peace` · `glory` · `benedict` |
| The classical movements | Via Purgativa · Via Illuminativa · Via Unitiva |
| The Mass-anchored daily pattern | 3-1-3 (3 preparing · At the Altar · 3 sent forth) |
| The current pope | Pope Leo XIV |
| The recently canonized millennial | Saint Carlo Acutis |
| The recently canonized layman | Saint Pier Giorgio Frassati |
| The Latin motto | *Salus animarum suprema lex.* |
| The motto translation | *The salvation of souls is the supreme law.* |
| The methodology mark | *Per machinas, per Magisterium.* |

## 3.4 Catholic vocabulary lock-list (preventing Protestantization)

The following are *avoided*. Use the Catholic terms instead.

| Avoid | Use |
|---|---|
| "personal relationship with Jesus" (as primary frame) | "communion with the King" or simply "relationship with Christ" |
| "service" (instead of "Mass") | "Mass" |
| "saved" (as one-time decision) | "in a state of grace" or "saved by Christ's work, walking in grace" |
| "fellowship" (as primary community term) | "communion" or "common life" |
| "preacher" (in normal usage about priests) | "priest" or "pastor" |
| "Christ-follower" | "Christian" or "Catholic" |
| "do life together" | "walk together" or "live in communion" |
| "doing church" | "the parish" or "the Mass" |
| "altar call" | "the kerygma" or "the invitation" |
| "ask Jesus into your heart" | "open yourself to Christ" or "receive Him" |
| "biblical" (alone, as adjective for "good") | "rooted in Scripture and Tradition" or simply omit |

These are *not* errors of doctrine when used carefully — but their
cumulative use in a Catholic project drifts the voice toward
non-sacramental evangelicalism. The lock-list prevents drift.

**Acceptance:** every consumer-facing piece passes a vocabulary-lint
check (per Strategic Architecture v2 §2.5).

---

# TIER 4 — GRAMMAR AND COPY POLISH

## 4.1 Common patterns to audit

Run these specific searches and review each match.

### Sentence-level

- **Sentences over 35 words** — usually candidates for splitting
- **Multiple "and" clauses in one sentence** — rhetorical loss
- **Hedging phrases** — *"perhaps," "maybe," "sort of," "kind of"* —
  delete or strengthen
- **Throat-clearing openings** — *"It is important to note that..."*,
  *"What is interesting is that..."*  — delete and start at the verb
- **Adverb stacking** — *"very," "really," "extremely,"
  "incredibly"* — usually deletable
- **Passive voice in apologetic content** — switch to active where
  rhetorical force is needed

### Punctuation

- **Em-dash usage** — should be deliberate (parenthetical aside or
  dramatic break), not casual
- **Semicolons** — used correctly (two independent clauses related)
- **Commas in lists** — Oxford comma consistently used
- **Quotation marks** — straight or curly used consistently (typically
  curly for prose, straight for code)

### Capitalization

- **"Kingdom" / "kingdom"** — capitalize when referring to the
  *Kingdom of God* / the brand "The Kingdom Course" / etc.;
  lowercase when generic
- **"Mass" / "mass"** — always capitalize when referring to the
  Catholic liturgy
- **"Confession" / "confession"** — capitalize the sacrament
- **"Eucharist" / "eucharist"** — always capitalize
- **"Catechism" / "catechism"** — capitalize when referring to the
  CCC; lowercase as generic category
- **"Pope" / "pope"** — capitalize when used as a title before a
  name (Pope Leo XIV); lowercase when generic ("the pope said")
- **"Saint" / "saint" / "St."** — capitalize when used before a
  name (Saint Carlo Acutis, St. Carlo Acutis); lowercase generic

### Hyphenation

- **"Mass-anchored"** — hyphenate as compound adjective
- **"three-tab"** — hyphenate as compound adjective
- **"day-by-day"** — hyphenate as compound adjective
- **"50-day"** — hyphenate as compound adjective
- **"AI-assisted"** — hyphenate
- **"citation-rich"** — hyphenate

### Typography

- **Smart quotes** for prose (curly), straight quotes for code
- **Em dashes** with hair-space or no space around them, consistently
- **Ellipses** — use the single character `…` not three periods `...`
- **Quote marks** matched (open/close)

## 4.2 Specific known issues

To be filled in as the audit proceeds. Initial known items:

| Surface | Issue | Fix |
|---|---|---|
| Hero | "central figure of history — the hinge on which all of it turns" | Tighten per 1.4 |
| Hero | Subheader unclear what role it plays | Promote tagline per 1.2 |
| Course tab | "7 Essentials of the Kingdom of Heaven" | "Seven Steps to the Kingdom of Heaven" per 1.12 |
| Hub | "The day as a kingdom day" | Add brief gloss for first-time users |
| Various | "Blessed Carlo Acutis" | "Saint Carlo Acutis" per 0.2 |
| Various | "now Pope Francis" | "Pope Francis (2013–2025)" per 0.1 |

## 4.3 AI disclosure standardization

**Issue:** Per Strategic Architecture v2 §1.2, every AI-assisted
surface needs the AI disclosure footer. This is not yet present.

**Standardized text:**

> *This content was prepared with AI assistance, grounded in the
> Catechism and Sacred Tradition. AI can make mistakes. Verify what
> matters; consult your priest; read the cited sources.*

**Placement:**
- Every Day reading: footer area
- Every Field Guide entry: footer area
- Every Academy chapter (when shipped): footer area
- Companion: included in session preamble (per SA v2 §2.7)
- About page: full methodology disclosure

**Files affected:** Day reading component, Field Guide component,
Academy reader (when shipped), Companion UI, About page

**Acceptance:** disclosure present on every AI-assisted surface.

## 4.4 Methodology mark

**Issue:** Methodology mark not yet present in chrome.

**Standardized mark (per SA v2 §2.7):**

> *AI-presented · Magisterium-grounded · Citation-verified ·
> Theologically reviewed*

Or short Latin form:

> *Per machinas, per Magisterium*

**Placement:** Footer of every page, linked to `/methodology`.

**Files affected:** `Footer.jsx`

**Acceptance:** mark visible on every page; tapping opens
`/methodology`.

---

# TIER 5 — METHODOLOGY PAGE (NEW)

## 5.1 The methodology page

**Issue:** Per Strategic Architecture v2 §2.6, the hard lines and AI
methodology must be published on a dedicated page.

**Implementation:** new static HTML page at `public/methodology.html`,
served at `/methodology` (clean URL via `vercel.json`).

**Content:** use Strategic Architecture v2 Appendix D as source text.
Render with same paper-and-gold brand styling as `privacy.html` and
`terms.html`.

**Files affected:** new `public/methodology.html`; `vercel.json`
(if needed); `Footer.jsx` (link)

**Acceptance:** `/methodology` renders the published hard lines and
AI methodology statement.

---

# TIER 6 — IMPLEMENTATION CHECKLIST

## 6.1 Per-file action list

### `src/components/Hero.jsx`
- [ ] Headline: "most important" replacement (1.1)
- [ ] Parallel construction subheader / tagline placement (1.2)
- [ ] "Kingdom of Eternal Life" closing emphasis (1.3)
- [ ] Opening paragraph tightening (1.4)
- [ ] Add `<LivingEvidence />` section reference (1.5)
- [ ] "Trail / Course" wording cleanup (1.6)

### `src/components/LivingEvidence.jsx` (NEW)
- [ ] Create new component (1.5)
- [ ] Verify all statistics with cited sources
- [ ] Render in Gospel page flow

### `src/components/CourseHero.jsx`
- [ ] "Seven Steps" framing replacing "7 Essentials" (1.12)
- [ ] Reduce step button height (1.9)
- [ ] Increase vertical spacing between steps (1.9)

### `src/components/Footer.jsx`
- [ ] Add methodology mark in chrome (4.4)
- [ ] Add /methodology link (5.1)

### `src/data/houses.js`
- [ ] Verify Earth is 5th in array order (1.11)
- [ ] Update all House data references

### `src/data/saints.js`
- [ ] Carlo Acutis: `name: 'Saint Carlo Acutis'`, add
  `canonized: 2025` (0.2)
- [ ] Pier Giorgio Frassati: `name: 'Saint Pier Giorgio Frassati'`,
  add `canonized: 2025` (0.3)
- [ ] Audit all "Blessed" references; update where canonization has
  occurred

### `src/data/course.js`
- [ ] "Seven Steps" framing (1.12)
- [ ] Audit Pope Francis references (0.1)
- [ ] Audit Carlo Acutis references (0.2)
- [ ] Add AI disclosure footer to each Day reading (4.3)

### `src/data/liturgical.js`
- [ ] Saturday Marian framing (2.3)
- [ ] BUILD rotation logic (2.2)
- [ ] Carlo Acutis feast day (October 12): mark as Optional Memorial
- [ ] Pier Giorgio Frassati feast day (July 4): mark as Optional Memorial

### `src/components/KingdomHubView.jsx` (or equivalent)
- [ ] 3-1-3 pattern content review (2.1)
- [ ] BUILD rotation display logic (2.2)
- [ ] Marian dimension daily prompt (2.3)
- [ ] Confession affordance (2.4)

### Day reading component (Day 1, Day 2, etc.)
- [ ] Authentication gating: Day 1 free, Day 2+ requires signup (1.8)
- [ ] Reading container max-width 720px (1.10)
- [ ] AI disclosure footer (4.3)
- [ ] Citation verification (1.6 in SA v2)

### `src/modals/SignupModal.jsx`
- [ ] "In one sentence — what is bringing you here today?" rename
  (from Comprehensive Review)
- [ ] Make field optional
- [ ] Add Privacy/Terms acknowledgment line
- [ ] If triggered from Day 2: show "You've walked Day 1" modal copy
  (1.8)

### `public/methodology.html` (NEW)
- [ ] Create file with content from SA v2 Appendix D (5.1)
- [ ] Brand-styled (Cormorant Garamond, paper background)
- [ ] Linked from footer (4.4)

### `vercel.json`
- [ ] Verify `/methodology` clean URL works

### `index.html`
- [ ] Meta description: verify current ("The Gospel meets you...")
- [ ] Open Graph image: 1200×630 brand image (verify exists)
- [ ] Twitter card: summary_large_image

### `CLAUDE.md`
- [ ] Update saint schema example: Carlo Acutis as Saint (0.2)
- [ ] Verify Houses canonical order (1.11)
- [ ] Update "Seven Steps" framing (1.12)
- [ ] Note Pope Leo XIV as current pope (0.1)

## 6.2 Sequential implementation order

**Day 1 (urgent factual):**
1. Pope Francis → Pope Leo XIV (0.1)
2. Blessed Carlo Acutis → Saint Carlo Acutis (0.2)
3. Blessed Pier Giorgio Frassati → Saint Pier Giorgio Frassati (0.3)
4. Push commit; verify production

**Day 2 (Hero):**
5. Headline change (1.1)
6. Subheader / tagline placement (1.2)
7. Kingdom of Eternal Life reinforcement (1.3)
8. Opening paragraph tightening (1.4)
9. Trail/Course wording cleanup (1.6)
10. Three reader types layout fix (1.7)

**Day 3 (Course page):**
11. Authentication gating (1.8)
12. Step button heights (1.9)
13. Reading content width (1.10)
14. Earth ordering bug (1.11)
15. Seven Steps standardization (1.12)

**Day 4 (Hub):**
16. Daily tasks audit (2.1)
17. BUILD rotation (2.2)
18. Marian dimension daily (2.3)
19. Confession affordance (2.4)

**Day 5 (vocabulary):**
20. Old terms global search and replace (3.1)
21. Catholic vocabulary lock-list audit (3.4)
22. Capitalization audit (4.1)

**Day 6 (methodology + AI disclosure):**
23. Living Evidence section (1.5)
24. Methodology page creation (5.1)
25. AI disclosure footer on all surfaces (4.3)
26. Methodology mark in footer (4.4)

**Day 7 (grammar polish):**
27. Sentence-level audit per 4.1
28. Specific known issues (4.2)
29. Final read-through every consumer surface

**Day 8 (verification):**
30. `npm run build` clean
31. Production smoke test (L.10 equivalent)
32. Mobile smoke test on real phone
33. Send to soft-launch testers

## 6.3 Acceptance criteria (final)

The revision is complete when:

- [ ] Zero references to "Blessed Carlo Acutis" or "Blessed Pier
  Giorgio Frassati" remain
- [ ] Zero references to Pope Francis in present tense
- [ ] "Pope Leo XIV" reflected wherever the current pope is mentioned
- [ ] Hero displays the parallel "most important / most rigorously
  verified" construction
- [ ] Living Evidence section displays with verified citations
- [ ] Three reader-types render in 3-column row on desktop
- [ ] Day 1 accessible without signup; Day 2+ gates to SignupModal
- [ ] Earth consistently appears as 5th House
- [ ] "Seven Steps" is the canonical frame across all surfaces;
  "Seven Keys" fully retired from consumer copy
- [ ] Hub shows BUILD rotation per day of week
- [ ] Hub shows Marian dimension every day
- [ ] Methodology page live at `/methodology`
- [ ] Methodology mark visible in footer on every page
- [ ] AI disclosure footer on every Day reading
- [ ] `npm run build` zero warnings
- [ ] Production smoke test passes
- [ ] Mobile smoke test passes on real phone

When all 16 boxes check, ship.

---

# APPENDIX A — REVISED HERO COPY (FULL TEXT)

**For copy-paste reference.**

```
THE KINGDOM OF ETERNAL LIFE

The single most important announcement in history.
And the most rigorously verified.

The Gospel meets you. The Course forms you. The Kingdom holds you.

—

The most important message in history.
From the hinge on which all history turns.
Verified by the greatest body of evidence on earth.

Two thousand years ago, the Son of God walked among us as Jesus of
Nazareth. He came with one message above all others: the kingdom of
heaven had arrived — a kingdom of eternal life, given now and
forever. A life that begins on earth, in the sacraments and in
communion with a living God, and does not end at death but
consummates in heaven, face to face with the King.

That announcement has been the most rigorously investigated
supernatural claim in human history — confirmed by Eucharistic hosts
that become living cardiac tissue, by apparitions with measurable
physical evidence, by bodies of saints that do not decay, by healings
verified by panels of secular physicians, and — most staggering of
all — by thousands of canonized saints who continue to heal, appear,
and intercede from beyond their own deaths.

Not only the kingdom. Eternal life itself, verified — and visible in
the saints who continue to live in it.

[ ENTER ]
```

---

# APPENDIX B — LIVING EVIDENCE SECTION COPY

**For copy-paste reference. Verify all statistics before publishing.**

```
AND THE EVIDENCE IS CURRENT

The Kingdom is not in retreat. It is filling.

In 2025, the Catholic Church in France baptized over 10,000 adults —
the highest number in a generation, and a 45% increase over the
previous year. In the United States, adult conversions through RCIA
rose sharply, particularly among young men. In the United Kingdom,
the same pattern emerged. Across the world, in countries where
secularism was assumed to have won, the saints are being raised up
again.

Two new ones — Saint Carlo Acutis and Saint Pier Giorgio Frassati —
were canonized in 2025 by Pope Leo XIV. Carlo Acutis is the first
canonized saint of the millennial generation. He died at fifteen of
leukemia in 2006. He spent his short life cataloguing Eucharistic
miracles. He is the patron of the internet.

The kingdom continues to draw souls who are looking for what is true.

You are not the first to come looking. You will not be the last.

[ BEGIN THE COURSE ]
```

---

# APPENDIX C — POPE REFERENCE UPDATE LIST

**Find every match. Update per the table in 0.1.**

```bash
grep -rn "Pope Francis" src/ --include="*.{js,jsx,html,md}"
grep -rn "Bergoglio" src/ --include="*.{js,jsx,html,md}"
grep -rn "current pope" src/ --include="*.{js,jsx,html,md}"
grep -rn "current pontiff" src/ --include="*.{js,jsx,html,md}"
grep -rn "now Pope" src/ --include="*.{js,jsx,html,md}"
```

Document each match in `POPE_REFERENCE_UPDATE_LOG.md` with old text,
new text, and verification date.

---

# APPENDIX D — CARLO ACUTIS UPDATE LIST

**Find every match. Update per the table in 0.2.**

```bash
grep -rn "Blessed Carlo" src/ --include="*.{js,jsx,html,md}"
grep -rn "Bl. Carlo" src/ --include="*.{js,jsx,html,md}"
grep -rn "Carlo Acutis" src/ --include="*.{js,jsx,html,md}"
grep -rn "the first millennial" src/ --include="*.{js,jsx,html,md}"
grep -rn "first beatified" src/ --include="*.{js,jsx,html,md}"
```

Update saint biography:

```js
{
  slug: 'carlo-acutis',
  name: 'Saint Carlo Acutis',
  feastDate: '10-12',
  house: 'fire',
  born: 1991,
  died: 2006,
  beatified: 2020,
  canonized: 2025,
  canonizedBy: 'Pope Leo XIV',
  patronOf: ['the internet', 'computer programmers', 'young people'],
  oneLineSummary: 'The first canonized saint of the millennial generation.',
  biography: '...',
  prayer: '...',
  imageUrl: '/saints/carlo-acutis.jpg',
  sources: ['Vatican.va canonization homily, Sept 7 2025', ...]
}
```

Update Pier Giorgio Frassati biography:

```js
{
  slug: 'pier-giorgio-frassati',
  name: 'Saint Pier Giorgio Frassati',
  feastDate: '07-04',
  house: 'glory',
  born: 1901,
  died: 1925,
  beatified: 1990,
  canonized: 2025,
  canonizedBy: 'Pope Leo XIV',
  patronOf: ['young Catholics', 'mountaineers', 'students'],
  oneLineSummary: 'Italian layman, mountaineer, servant of the poor; "Man of the Beatitudes."',
  biography: '...',
  prayer: '...',
  imageUrl: '/saints/pier-giorgio-frassati.jpg',
  sources: ['Vatican.va canonization homily, Sept 7 2025', ...]
}
```

---

# APPENDIX E — METHODOLOGY MARK PLACEMENT TEMPLATE

For consistent use across files.

**In Footer.jsx (chrome footer):**

```jsx
<div style={{
  fontSize: '11px',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: 'var(--gold)',
  marginTop: '8px'
}}>
  <a href="/methodology" style={{ color: 'inherit', textDecoration: 'none' }}>
    AI-presented · Magisterium-grounded · Citation-verified · Theologically reviewed
  </a>
</div>
```

**In Day reading component (post-reading):**

```jsx
<div style={{
  fontSize: '13px',
  fontStyle: 'italic',
  color: 'var(--ink-muted)',
  borderTop: '1px solid var(--gold-faint)',
  paddingTop: '24px',
  marginTop: '48px'
}}>
  This content was prepared with AI assistance, grounded in the
  Catechism and Sacred Tradition. AI can make mistakes. Verify what
  matters; consult your priest; read the cited sources.
</div>
```

**In Companion session preamble:**

```
I'm an AI guide. I cite my sources. For sacramental or pastoral
decisions, talk to a priest. How can I walk with you today?
```

---

*Salus animarum suprema lex.*

— 17 May 2026
