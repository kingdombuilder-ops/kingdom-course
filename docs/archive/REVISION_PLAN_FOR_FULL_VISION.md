# The Kingdom — Comprehensive Revision Plan & File Index

*Synthesized from the entire conversation thread covering web app migration batches 16-21, the strategic shift to digital-first vision, and content alignment edits. This document is the chain-of-custody bridge between the web app's current state and the master manuscripts that have not yet been touched.*

**Date:** May 2, 2026
**Companion documents:** `NEXT_STEPS.md`, `BATCH_20_21_HANDOFF.md`, `README.md`

---

## Part 1 — Executive Summary: What Changed in This Conversation

Across multiple sessions and revisions, the following changes were made to the web app at `/home/claude/kingdom-vite/` (staged at `/mnt/user-data/outputs/kingdom-vite-batch21/`).

### 1.1 Code migration completion (batches 16-21)

The original 13,631-line monolith `the_kingdom.jsx` was migrated to a complete Vite/React scaffold:

- **Batch 16-17:** Lazy-loading + Gospel/Gate tab (Hero, Prologue, Trail, Circles, Bridge, CircleModal, GateInvitation)
- **Batch 18-19:** Chrome layer (KingdomTabNav, Footer, FloatingCompanion) + Companion AI panel (stub mode)
- **Batch 20:** SignupModal in stub mode (default localStorage handler; `submitHandler` prop is the auth-provider integration seam)
- **Batch 21:** Production polish (Live mode default, dev toggle gated behind `IS_DEV`, HarnessShell tree-shaken, Tailwind toolchain removed, top-level README)

**Final state:** 31 components, 13 modals, 11 data modules, 176 unit tests passing, ~167 KB gz first-paint, production build clean.

### 1.2 The eyebrow shift — The first declaration

**Hero.jsx eyebrow** changed from "The Kingdom Made Visible" → **"The Kingdom of Eternal Life."**

*Strategic intent:* what the visitor's eye lands on before the headline names what the Kingdom *is* (eternally present, ontological), rather than asserting what the project will *do* (make it visible). The headline below ("The single greatest announcement in history…") then carries the argument.

The phrase echoes organically through the Hero's body copy ("a kingdom of eternal life, given now and forever") so the eyebrow is no longer arbitrary.

### 1.3 The strategic vision — Digital-first formation at scale

The `NEXT_STEPS.md` long-term roadmap was rewritten three times across this conversation, settling on a **digital-first scaling vision** modeled after the most successful Catholic and broader digital formation projects:

- **Hallow** ($50M+ raised, 10M+ downloads, top 10 in Apple App Store during Lent 2023) — solo prayer at scale, freemium model, Hallow's data shows 2.4x prayer-habit formation when users have skin-in-the-game commitment
- **Bible in a Year** with Fr. Mike Schmitz / Ascension Press — #1 podcast across all Apple Podcasts categories three years running; podcast-first delivery
- **Word on Fire** — Bishop Barron, 1M+ YouTube subscribers, 5,000+ monthly recurring donors via the IGNITE program
- **Headspace / Calm / Duolingo** as broader digital-formation references

The earlier roadmap had positioned Alpha-style parish small-group rollout as a co-equal channel. That was wrong for this project. The user's confirmed vision: **100% digitally scalable formation that organically leaks into in-person community when transformation is real, but never requires it.**

The NEXT_STEPS.md document is now structured around 8 phases (verify → deploy → auth → Companion backend → email + audio → operational → soft launch → public launch → maintenance) plus four cross-cutting strategic sections:
1. Strategic roadmap (six patterns from successful peers; near-term/medium-term build queues)
2. Distribution beyond the website (web → podcast → YouTube → native app multi-platform path)
3. Funding the mission (Hallow-style freemium recommended; IGNITE-style donor base alternative; both preserve "free for every soul" via scholarship paths)
4. Ecclesial recognition (imprimatur, named priest collaborator, endorsements on the Hero — for content credibility, not parish rollout)

### 1.4 Content edits — Removing in-person prerequisites from the formation experience

The Course content (`course.js`), Field Guide (`field-guide.js`), Gate page (`GateInvitation.jsx`), and SignupModal were edited to remove every place where the *product* would block or exclude a digital-first user without an existing parish or in-person small-group context. The *teaching* about parish renewal, small communities, and Catholic communal life was preserved as catechesis — pointing to in-person community as the organic fruit of transformation, not as a structural prerequisite.

**Specific edits:**

**course.js (15 edits):**
- Step 1 deployment: "Find your Kingdom Group — four to twelve" → "Invite one person to walk this with you — the first companion you are given"
- All 7 Sabbath day notes: "Kingdom Group" → varied warm prompts ("Reach out to one you walk with," "Tell someone what God has done")
- Five "If you have a Kingdom Group, meet today" closings: → "Reach out to one you walk this with"
- Step 5 deployment + practice: "lead or co-lead a Kingdom Group" → "walk the path with whoever responds"
- Step 6 deployment: "Launch a Kingdom Group in your parish" → removed; replaced with "Invite the people God has placed in your life"
- Step 7 line 1812: "A Kingdom Group of five to ten people, meeting weekly" → "A small group walking this course together — meeting weekly in person, gathering on a video call across cities, sharing daily progress in a text thread, however the friendship is given"
- Step 7 line 1861: "Kingdom Groups, retreats, parish small groups" → "small groups in homes, retreats, parish formation, online cohorts walking a course together, group chats threading daily reflection"
- Step 7 final practice + deployment: channel-agnostic accompaniment that explicitly includes online community

**course.js (deliberately preserved):** Three remaining "Kingdom Group" references in Step 6 (lines 1513, 1630, 1642) are *teaching* about how the Catholic Church grows through small communities — catechesis, not deployment instructions. These match the user's stated intent: point to in-person community through teaching, not require it through product.

**field-guide.js Practice #15 — full rewrite:**
- Title: "How to Start and Lead a Kingdom Group" → **"How to Walk the Kingdom with Others"**
- Tagline: "Four to twelve people. A meal. A reading. Real prayer." → **"Transformation wants to be shared."**
- Time: "90 minutes weekly" → **"Whatever the friendship asks"**
- Restructured around five modes: daily text thread, weekly call, video small group, in-home small group, discipling friendship
- Principle: "The form follows the friendship"
- Wisdom preserved: Safety/Honesty/Prayer/Consistency, what kills walking-together, multiplication
- Closing: *"The in-person community is the fruit of the digital faithfulness. It does not need to be programmed; it grows on its own when the formation is real."*

**GateInvitation.jsx CTA (Catholic-and-burning):**
- "Walk it with them. Start a Kingdom Group — four to twelve, one book, seven steps." → **"Send it to them. Walk it with them. The fire spreads through whoever you are already given."**

**SignupModal.jsx — third field reframed:**
- Label: "Parish or Kingdom Group" → **"Where you are starting from"**
- Placeholder: "e.g. St. Mary's, Anytown" → **"A parish, a city, a season of life — whatever you want to share"**
- Trailing copy: "If you included a parish, it may walk with you" → **"Free, for every soul on earth. Your email is safe — unsubscribe anytime."**

### 1.5 Verification

All gates remain green: 63/63 parse-check, 176/176 render-check-deep, production build clean.

---

## Part 2 — The Critical Discrepancy: Web App vs. Master Vision

Reviewing the Master Vision document (`The_Kingdom_DTS_MASTER_VISION_AND_OUTLINE.md` v8.0, April 2026), several major inconsistencies between the current web app and the canonical vision became apparent.

These are not problems with the digital-first vision — they are pre-existing branding/structural mismatches that surfaced when I read the source materials with care. They need explicit decisions before further build.

### 2.1 The product naming mismatch

| | Web app (current) | Master Vision (canonical) |
|---|---|---|
| Product name | "The Kingdom Course" | "**The Kingdom DTS**" (Discipleship Training School) |
| Domain | kingdomcourse.org | (implicit: thekingdom.org or kingdomdts.org) |
| Subtitle/tagline | "A Catholic spiritual formation initiative" | "**Formation for Saints**" |
| Movement-level tagline | (web app uses no Mt 4:17 reference) | *"The kingdom of heaven is at hand."* — Matthew 4:17 |
| Eyebrow on Hero | "The Kingdom of Eternal Life" *(this conversation's edit)* | (no eyebrow specified in master vision; movement uses Mt 4:17) |

The Master Vision says — explicitly and at length — *"Not 'The Kingdom Course' as the headline. The product — the journey, the app, the thing a Catholic downloads and walks through — is the **Kingdom DTS**."*

This means **the entire web app's branding is inconsistent with the source material's canonical naming.** Either:

- (a) The Master Vision should be revised to accept "The Kingdom Course" as the public-facing/web name (because "DTS" is jargon most non-Christians don't know)
- (b) The web app should be re-branded to "The Kingdom DTS"
- (c) "The Kingdom Course" remains as a public alias for "The Kingdom DTS" — the way "Bible in a Year" is what Catholics call Ascension's full product even though the formal name is longer

This decision needs to be made before further marketing or production work.

**My honest recommendation if you want my read:** Option (c) — keep "The Kingdom DTS" as the canonical product name in source materials, marketing collateral, ecclesial submissions, and bishop conversations; let the web app retain "Kingdom Course" as a public-facing simplified name with subtle DTS attribution in the footer ("a Kingdom DTS digital experience"). This honors both — the rigorous canonical name for serious audiences, the accessible public name for searching skeptics. Hallow does this: their app is called "Hallow" but Catholics and bishops know it's "Hallow Plus" / "Hallow Inc." / etc.

### 2.2 The format mismatch

| | Web app (current) | Master Vision (canonical) |
|---|---|---|
| Course length | 49 days / 7 steps × 7 days | 7 books / 42 chapters / Prologue + 6 per book |
| Reading length | ~5 minutes daily | ~3,100 words per chapter (~20-25 minutes weekly) |
| Pace | Daily | Weekly (chapter-per-week) |
| Total content | ~100K characters | ~154,000 words across 7 books |

The Master Vision describes books, not days. The web app has been delivering the Course content in a daily-reading format, which is fine, but it suggests:

- The web app's `course.js` is a *condensed* / *daily-format* version of the full 7-book DTS curriculum
- The full books (Books 1-7 in source) are much longer and more substantive than what's shown in the web app
- The 49-day format is a digital-product adaptation; the canonical curriculum is 42 chapters

**Implication for production:** The web app's daily readings should probably be re-derived or re-mapped against the 7-book source. Right now there's risk of the web app drifting from the canonical content.

### 2.3 The Kingdom Groups framing

This is the area where the digital-first edits we made in this conversation align *with* the Master Vision in some places and *contradict* the source manuscripts in others.

**Aligned with Master Vision:**

The Master Vision actually includes (under "The Saints and the Overwhelming Library"):

> "**Community is a gift — not a prerequisite.** The saints prove two things that matter for the Kingdom DTS. First: community is not required for deep formation. Many of the greatest saints were not formed in community... **The Kingdom DTS is designed so that a Catholic alone in a village in rural Indonesia — no parish group, no formation team, no Kingdom Group within a hundred miles — can walk the full seven-step journey and emerge transformed.**"

This is *exactly* the digital-first vision the user articulated. The Master Vision already accepts that community is a gift, not a prerequisite. **My edits to the web app brought it INTO alignment with this Master Vision principle.** Good.

**Contradicts source manuscripts:**

But the source books (especially Book 5 Chapter 6, Book 6 Chapter 6, Book 7 Chapter 4) and the Field Guide (Guides 26, 27, 28) contain *substantial* material on Kingdom Groups specifically as in-person small groups:

- **Book 5, Chapter 6** is described in the Master Vision as the source of "How to Start a Kingdom Group" — current Field Guide Guide 26
- **Book 7, Chapter 4** is the source of "How to Lead a Kingdom Group — Leadership Edition" — current Field Guide Guide 27
- **Book 6, Chapter 6** has parish renewal content centered on "small groups of six to twelve who meet regularly"

The source manuscripts describe Kingdom Groups in-person-first, with detailed home-meeting structure (90-minute sessions, fellowship/prayer/discussion/accountability blocks, food shared). The same vision the web app's Practice #15 had before this conversation's edits.

**This means the Field Guide manuscript and at least three book chapters need revision** to match the digital-first vision the user has now confirmed — the same edits made to the web app's Field Guide Practice #15, expanded across all the source-manuscript Kingdom Group content.

### 2.4 The Three Tiers structure

The Master Vision introduces a "three-tier" structure:

| Tier | Name | Scope | Status |
|---|---|---|---|
| 1 | The Kingdom DTS (the series) | 7 books + Field Guide | Current outline |
| 2 | The Kingdom Formation | 7 expanded courses, ~8-12 weeks each | Future expansion |
| 3 | The School of the Kingdom | Full 7-level curriculum (56 modules, 316 sessions) | Full buildout |

The web app maps to **Tier 1**. There's no decision yet on whether the digital-first vision applies to Tiers 2 and 3 as well, or whether those are different audiences/products.

---

## Part 3 — Comprehensive Revision Plan for Source Documents

Based on the digital-first vision the user has now confirmed, here is what needs to change across each source manuscript.

### 3.1 The Master Vision & Outline

**File:** `The_Kingdom_DTS_MASTER_VISION_AND_OUTLINE.md`
**Status:** v8.0 (April 2026)
**Revisions needed:** Moderate

**What to add / clarify:**

1. **Explicit digital-first positioning section.** The Master Vision currently says "Community is a gift — not a prerequisite" but doesn't fully articulate the digital-first scaling vision. Add a section after "What The Kingdom DTS Is" called **"Distribution Strategy"** or **"How The Kingdom DTS Reaches Souls"** that explicitly positions the product as digital-first scalable in the pattern of Hallow / Bible in a Year / Headspace / Duolingo, with in-person community as the organic fruit of transformation.

2. **Update the Hallow / IGNITE / Bible in a Year references.** The Master Vision mentions "the globally proven DTS model" (YWAM) but doesn't reference the digital-formation peers the user has now anchored on. Add a short section connecting the canonical DTS model to the digital-formation product category Hallow et al. occupy.

3. **Naming hierarchy decision.** The Master Vision currently rejects "The Kingdom Course" as a name. Either revise this rejection to accept it as a public-facing alias, or commit to re-branding the web app to "The Kingdom DTS." This is a high-leverage decision that affects every downstream document.

4. **Three Tiers + digital-first.** Clarify whether Tiers 2 (Kingdom Formation) and 3 (School of the Kingdom) follow the same digital-first scaling model, or have different distribution mechanics (e.g., Tier 3's 56-module/316-session scope might genuinely require some structured cohort experience).

5. **Eyebrow and tagline alignment.** Decide: does "The Kingdom of Eternal Life" become canonical at the Master Vision level, or stay as a web-app-specific framing while the Master Vision retains "The kingdom of heaven is at hand" (Mt 4:17)? My read: the latter — Mt 4:17 is theologically richer and Scripturally weighted; "Kingdom of Eternal Life" is a beautiful first-page declaration but isn't the movement-level tagline.

**What to preserve unchanged:**

- The Naming Hierarchy structure (movement → DTS → Field Guide → Miracles → School of Heaven)
- The Seven Keys / Seven Books architecture
- The Four Houses (Light, Fire, Earth, Joy, Glory)
- The "Made" statements (Made Kingdom, Made Accessible, etc.) — these are excellent
- The motto: *Salus animarum suprema lex*
- The DTS model framing (encounter / healing / mission)

### 3.2 The Seven DTS Books (manuscripts)

**Files:** `The_Kingdom_DTS_Book1_AWAKENING_v3.md` through `_Book7_LEADERSHIP_AND_MULTIPLICATION_v3.md`
**Status:** v3 (likely earlier than April 2026 Master Vision revision)
**Revisions needed:** Targeted (NOT comprehensive rewrites)

The seven books are the canonical curriculum. They contain ~154,000 words of carefully crafted formation content. **The vast majority should not be changed.** What changes:

**Book 1 (Awakening):**
- Section "The Path Ahead" (in the closing): Currently ends with "You have a community — or you are finding one." Soften to acknowledge that community is the fruit, not the floor. Suggested: "You have begun to walk with whoever God is already placing in your life — perhaps a friend, a family member, perhaps for now only the Holy Spirit himself, who is always enough."
- Step 1 deployment / commissioning passages: review for any "Find your Kingdom Group" language and soften to "Invite one person to walk this with you" pattern (matching the web app edit to course.js Step 1).

**Book 5 (The Glory of Mission):**
- **Chapter 6** is the source of Field Guide Guide 26 ("How to Start a Kingdom Group"). This chapter currently presents Kingdom Groups as in-person small-group facilitation. Revise to match the digital-first framing of the new Field Guide Practice #15 ("How to Walk the Kingdom with Others"): five modes of walking together (text thread, weekly call, video small group, in-home small group, discipling friendship), with the principle "the form follows the friendship," and the closing that "in-person community is the fruit of digital faithfulness."

**Book 6 (Civilization):**
- **Chapter 6** ("The New Evangelization — Building Together") includes parish renewal content with "small groups of six to twelve who meet regularly" framing. The teaching about parish renewal is theologically right (matches the user's "should point to in-person sacraments and community" intent). Preserve the *teaching*; soften the *deployment* — the "Today" section's call to "start a Kingdom Group" should become "begin walking with whoever God places in your life, by whatever means."

**Book 7 (Leadership & Multiplication):**
- **Chapter 4** is the source of Field Guide Guides 27 ("How to Lead a Kingdom Group — Leadership Edition") and 28 ("Accompanying Through a Dark Night"). The Leadership Edition material currently presupposes in-person small-group facilitation throughout. Revise comprehensively:
  - The 90-minute home-meeting structure becomes one mode among several (text thread, video call, in-person home, discipling friendship, hybrid)
  - The "session structure" details become flexible — the principles (fellowship, prayer, discussion, accountability) are universal; the form varies
  - The multiplication math ("one becomes three becomes nine becomes twenty-seven") stays — that's a digital-or-in-person mathematical reality
  - The "Identify and develop co-leaders" content stays
  - The "Common leadership pitfalls" stays
  - The "Navigating group dynamics" stays
- **Chapter 4 conclusion** should add an explicit section on *digital* leadership: how to lead a video-call group, how to lead a text-thread cohort, how to facilitate accountability across distance.

**Books 2, 3, 4 (Foundations of Light, Inner Fire, Way of Peace):**
- Spot-check for any "Kingdom Group" or "weekly small-group meeting" prerequisite framing. Most of these books focus on personal formation (truth, healing, joy, peace) and shouldn't have much in-person-required content.
- Preserve all teaching about ecclesial life, sacraments, parish, communal worship — that's theology, not deployment.

**All seven books:**
- Audit each book's closing/commissioning passage for in-person-required language. Soften to invitation-not-prerequisite framing.

### 3.3 The Kingdom Field Guide

**File:** `The_Kingdom_Field_Guide_FINAL.md`
**Status:** "FINAL" — but needs digital-first revision
**Revisions needed:** Substantial (Guides 26, 27, possibly 25, 28)

The Field Guide is closer to the "tactical" surface where the digital-first edits land most clearly.

**Guide 25: Parish Renewal**
- Currently positioned as how to renew a parish. The teaching is theologically right.
- Add explicit digital dimension: the digital practitioner can support parish renewal by inviting parishioners to walk the DTS together, by sharing daily readings in parish channels, by being a digitally-formed Catholic who shows up to Mass having been formed. The parish renewal happens because of the formed Catholic, not because of a program the project runs.

**Guide 26: How to Start a Kingdom Group**
- **Full rewrite to match the web app's Practice #15.** Title becomes "How to Walk the Kingdom with Others." Five modes (text thread, weekly call, video small group, in-home small group, discipling friendship) with "form follows the friendship" principle.

**Guide 27: How to Lead a Kingdom Group — Leadership Edition**
- **Full rewrite.** Title becomes "How to Multiply What You Have Walked" or similar. Frame as: the digital practitioner becomes a multiplier when their formation has produced fruit visible to others. Lead by being formed; the form of the leadership (text-thread, video call, in-home, etc.) follows what God gives.
- The multiplication math (one → three → nine → twenty-seven) stays.
- The "common pitfalls" wisdom stays — applies to digital and in-person equally.

**Guide 28: How to Accompany Someone Through a Dark Night**
- Mostly stays — this is one-on-one accompaniment, channel-agnostic.
- Add explicit digital framing: dark-night accompaniment can happen by phone, by message, by video call. The presence matters more than the proximity.

**All other guides (1-24):**
- Spot-check for any "in a Kingdom Group" or "in a parish small group" presuppositions.
- Most guides are personal practices (Lectio, Examen, Rosary, Confession, etc.) — already digital-compatible.

### 3.4 The Miracles of the Kingdom

**File:** `Miracles_of_the_Kingdom_REVISED.md`
**Revisions needed:** Minimal — possibly none

The Miracles volume is the evidence book. It's evidence-driven content — the Resurrection, Eucharistic miracles, incorruptibles, Marian apparitions, healing miracles, exorcism evidence, etc. None of this is shaped by digital-vs-in-person formation strategy.

**What to add (optional):**
- A closing section pointing readers from the evidence to the formation. The Miracles book is the front door for skeptics; its closing should point them to the Kingdom DTS as the next step. Currently this may already exist; if not, add a 1-2 page closing that invites the skeptic into the formation.
- The framing "kingdomdts.org" or whatever the canonical web URL becomes should appear in the closing CTA.

**What to preserve:**
- Everything else. The evidence is the evidence; the digital-first vision doesn't change what the Resurrection looks like in the historical record.

### 3.5 The School of Heaven (fiction series)

**File:** Not yet present in project knowledge for the published manuscripts (only the Master Vision references it)
**Series:** 7 novels mapped to the 7 DTS books
**Revisions needed:** Unknown — depends on extent of completion

The Master Vision describes "The School of Heaven" as a 7-novel fiction series corresponding to the 7 DTS books. Each novel maps to one DTS book's theme:

| Kingdom DTS | School of Heaven | Theme | Key |
|---|---|---|---|
| 1: Awakening | Book 1: The Awakening | The Veil lifts | SEE |
| 2: Foundations of Light | Book 2: The House of Light | Truth forms the mind | KNOW |
| 3: The Inner Fire | Book 3: The House of Fire | Dark night / healing | HEAL |
| 4: The Way of Peace | Book 4: The House of Peace | Joy as warfare | REST |
| 5: The Glory of Mission | Book 5: The House of Glory | Calling ignites | GO |
| 6: Civilization | Book 6: The Unity | Heaven shapes earth | BUILD |
| 7: Leadership & Multiplication | Book 7: The Glory Revealed | The Doors open | SEND |

**Revisions needed (if manuscripts exist):**

1. **Audit how Kingdom Groups appear in the fiction.** Fiction can present in-person small groups vividly without contradicting the digital-first vision — characters in a novel naturally meet in person. The question is whether the fiction reads as *prescribing* in-person small groups or *depicting* them as one mode among others.

2. **Add digital-formation characters and scenes.** A modern Catholic-coming-of-age novel set in 2026 should depict Catholics walking formation through their phones, texting daily reflection to friends, joining video-call cohorts. If the existing fiction is set primarily in physical-only small groups, it reads anachronistically. Update at least some scenes/characters to reflect the actual texture of digital-first Catholic formation.

3. **Connection to the DTS curriculum.** The Master Vision says the fiction is a parallel companion to the DTS. Each novel should ideally include subtle "easter eggs" pointing readers to the corresponding DTS book — without breaking narrative immersion. If those connections don't exist yet, weave them in.

### 3.6 Operations / business plan documents

**Files:** Not present in project knowledge — user mentioned "vision/operations" documents
**Revisions needed:** Unknown — depends on what exists

If operations / business plan documents exist, they likely need:

1. **Funding model decision baked in.** The NEXT_STEPS.md document recommends Hallow-style freemium with scholarship path as the primary funding model, IGNITE-style donor base as the simpler alternative. The operations document should commit to one (or hybrid) and structure the org around it.

2. **501(c)(3) filing as a pre-launch step.** Both funding models benefit from nonprofit status. Operations document should include this as a gating step.

3. **Distribution strategy across channels.** The Distribution section of NEXT_STEPS.md (web → podcast → YouTube → native app) should be reflected in the operations document's product/marketing roadmap.

4. **Hiring/role plan.** The "When to ask for help" section of NEXT_STEPS.md identifies specific roles (Catholic media partnerships consultant, audio production partner, fundraising/development director, named priest collaborator, Spanish content lead). The operations document should sequence these as actual hires/contracts.

5. **The DTS vs. Course branding decision.** The operations document should commit to one canonical product name and have all marketing/positioning flow from it.

---

## Part 4 — Specific Revision Items, Document by Document

This is the actionable checklist. Each item is a discrete edit; collectively they bring the source materials into alignment with the digital-first vision the web app now embodies.

### 4.1 Master Vision (`The_Kingdom_DTS_MASTER_VISION_AND_OUTLINE.md`)

- [ ] **Decision:** Resolve the "Kingdom Course" vs "Kingdom DTS" naming question. Document the resolution in the Naming Hierarchy section.
- [ ] **Add:** A "Distribution Strategy" or "How The Kingdom DTS Reaches Souls" section after "What The Kingdom DTS Is" — articulating the digital-first scaling vision (Hallow / Bible in a Year / Headspace / Duolingo references).
- [ ] **Add:** Reference to the IGNITE-style donor model (Word on Fire) and Hallow-style freemium as the two viable funding models, with recommendation.
- [ ] **Add:** Explicit "501(c)(3) before public launch" statement.
- [ ] **Strengthen:** The "Community is a gift — not a prerequisite" section. This is good as-is, but could be expanded to articulate the digital-first principle directly: "The deepest formation in the Catholic spiritual tradition has always been the saint's solo daily encounter — Lectio Divina, the Liturgy of the Hours, the daily Examen — sustained over years. Community is the organic fruit of transformation, not its prerequisite."
- [ ] **Update:** Tagline / eyebrow language to reflect "The Kingdom of Eternal Life" if you want this framing canonical, or keep Mt 4:17 as the canonical and let "Kingdom of Eternal Life" be the web-Hero-specific eyebrow.

### 4.2 Book 1: Awakening (`The_Kingdom_DTS_Book1_AWAKENING_v3.md`)

- [ ] **Closing section "The Path Ahead":** Soften "You have a community — or you are finding one" to "You have begun to walk with whoever God is already placing in your life — and the Holy Spirit himself, who is always enough."
- [ ] **Step 1 deployment / commissioning:** Audit and replace "Find your Kingdom Group — four to twelve" patterns with "Invite one person to walk this with you" pattern.
- [ ] **Verify:** The Nine Circles content is the same as the web app's `gospel.js` data — check for divergence.

### 4.3 Book 2: Foundations of Light (`The_Kingdom_DTS_Book2_FOUNDATIONS_OF_LIGHT_v3.md`)

- [ ] **Spot-check:** Look for any "small group" or "Kingdom Group" required-deployment language. Likely minimal in this book.
- [ ] **Preserve:** All teaching about Mass, sacraments, ecclesial life. This is theology, not deployment.

### 4.4 Book 3: The Inner Fire (`The_Kingdom_DTS_Book3_THE_INNER_FIRE_v3.md`)

- [ ] **Spot-check:** Healing material is mostly individual; should be minimal revision needed.
- [ ] **Verify:** "Accompanying others" content (Chapter 6) — does it presuppose in-person? Soften if so.

### 4.5 Book 4: The Way of Peace (`The_Kingdom_DTS_Book4_THE_WAY_OF_PEACE_v3.md`)

- [ ] **Spot-check:** Joy/peace material is mostly individual.
- [ ] **Audit:** Chapter on devotional life, hospitality — preserve teaching, soften any deployment requirements.

### 4.6 Book 5: The Glory of Mission (`The_Kingdom_DTS_Book5_THE_GLORY_OF_MISSION_v3.md`)

- [ ] **Chapter 6 — major revision:** This is the source of "How to Start a Kingdom Group" (Field Guide Guide 26). Revise to match the digital-first framing of the new Field Guide Practice #15.
- [ ] **Audit:** Mission/sending material — preserve teaching about evangelization, soften any "must have an in-person small group" prerequisites.

### 4.7 Book 6: Civilization (`The_Kingdom_DTS_Book6_CIVILIZATION_v3.md`)

- [ ] **Chapter 6 — moderate revision:** Parish renewal teaching stays. Soften the "Today" deployment from "start a Kingdom Group" to "begin walking with whoever God places in your life, by whatever means."
- [ ] **Add:** Explicit teaching on digital evangelization as part of the civilizational vision. The Master Vision says "Digital evangelization. The tools have changed. The message has not." — this can become a more substantive section in Book 6 about how the Catholic civilizational vision now includes digital formation at scale.

### 4.8 Book 7: Leadership & Multiplication (`The_Kingdom_DTS_Book7_LEADERSHIP_AND_MULTIPLICATION_v3.md`)

- [ ] **Chapter 4 — major revision:** This is the source of Field Guide Guides 27 (Leadership Edition) and 28 (Dark Night). Revise the leadership content to match digital-first framing — five modes of multiplication, "form follows the friendship," etc.
- [ ] **Add:** A new section or extended treatment on *digital* leadership patterns — how to lead a video-call cohort, how to facilitate accountability across distance, how to multiply through sharing the course rather than launching parish small groups.
- [ ] **Preserve:** The multiplication math (one → three → nine → twenty-seven). The accountability principles. The leadership pitfalls. The dark night accompaniment guidance.

### 4.9 The Kingdom Field Guide (`The_Kingdom_Field_Guide_FINAL.md`)

- [ ] **Guide 25 (Parish Renewal):** Add digital-formation dimension. The digitally-formed Catholic returns to their parish transformed and contributes to renewal.
- [ ] **Guide 26 (How to Start a Kingdom Group):** Full rewrite to match the web app's Practice #15. Title becomes "How to Walk the Kingdom with Others."
- [ ] **Guide 27 (How to Lead a Kingdom Group — Leadership Edition):** Full rewrite to match the digital-first leadership framing.
- [ ] **Guide 28 (Accompanying Through a Dark Night):** Add explicit digital framing — accompaniment can happen by phone, video call, or in person.
- [ ] **Audit all 28 guides:** Check for any in-person presuppositions; soften where present.

### 4.10 The Miracles of the Kingdom (`Miracles_of_the_Kingdom_REVISED.md`)

- [ ] **Closing section:** Add or strengthen the CTA pointing readers from the evidence to the Kingdom DTS / Kingdom Course web app. Use the canonical URL once decided.
- [ ] **Verify:** No revisions needed to the evidence content itself.

### 4.11 The School of Heaven (fiction)

- [ ] **Manuscripts not present in project knowledge:** The user has them; review them in the next conversation and apply the digital-formation lens.
- [ ] **Audit narrative:** How are Kingdom Groups depicted? Are characters using digital tools to walk formation, or only in-person small groups?
- [ ] **Modernize where appropriate:** A 2026-set Catholic novel should reflect the actual texture of digital-first Catholic formation.

### 4.12 Operations / business plan / vision documents

- [ ] **Files not present in project knowledge:** User has these; bring them to next conversation.
- [ ] **Confirm funding model:** Hallow-style freemium with scholarship, IGNITE-style donor base, or hybrid. Document the choice.
- [ ] **Confirm naming:** Kingdom DTS canonical or Kingdom Course canonical or hybrid.
- [ ] **Confirm distribution strategy:** web → podcast → YouTube → native app sequencing.
- [ ] **Sequence hiring plan:** Per the "When to ask for help" section of NEXT_STEPS.md.
- [ ] **501(c)(3) timeline:** Pre-launch filing.
- [ ] **Imprimatur path:** Identify diocesan censor; pre-launch submission.

---

## Part 5 — File Index for the Next Conversation

To continue this work, the next conversation needs access to these files. They fall into three categories.

### 5.1 Files in this project's knowledge (already accessible)

These are in the current project and should be re-attached or re-uploaded to the next conversation:

**Master canonical document:**
1. `/mnt/project/The_Kingdom_DTS_MASTER_VISION_AND_OUTLINE.md` — The canonical architectural document (v8.0, April 2026). Read this first in any new conversation.

**The seven DTS book manuscripts:**
2. `/mnt/project/The_Kingdom_DTS_Book1_AWAKENING_v3.md`
3. `/mnt/project/The_Kingdom_DTS_Book2_FOUNDATIONS_OF_LIGHT_v3.md`
4. `/mnt/project/The_Kingdom_DTS_Book3_THE_INNER_FIRE_v3.md`
5. `/mnt/project/The_Kingdom_DTS_Book4_THE_WAY_OF_PEACE_v3.md`
6. `/mnt/project/The_Kingdom_DTS_Book5_THE_GLORY_OF_MISSION_v3.md`
7. `/mnt/project/The_Kingdom_DTS_Book6_CIVILIZATION_v3.md`
8. `/mnt/project/The_Kingdom_DTS_Book7_LEADERSHIP_AND_MULTIPLICATION_v3.md`

**Companion volumes:**
9. `/mnt/project/The_Kingdom_Field_Guide_FINAL.md` — The 28-guide companion volume (revisions needed: Guides 25, 26, 27, 28 and audit of all).
10. `/mnt/project/Miracles_of_the_Kingdom_REVISED.md` — The evidence volume (revisions: closing CTA to the web app).

### 5.2 Files generated in this conversation thread

These were produced across this session and live at `/mnt/user-data/outputs/kingdom-vite-batch21/`:

**Strategic documents:**
11. `NEXT_STEPS.md` — 1,098-line implementation plan (8 phases, strategic roadmap, distribution, funding, ecclesial recognition, when-to-ask-for-help). **The most important document beyond the manuscripts.**
12. `BATCH_20_21_HANDOFF.md` — Final batch handoff (production polish + SignupModal stub mode).
13. `BATCH_18_19_HANDOFF.md` — Chrome layer + Companion handoff.
14. `BATCH_16_17_HANDOFF.md` — Lazy-loading + Gospel tab handoff.
15. `BATCH_12_15_HANDOFF.md` — Course tab handoff.
16. `BATCH_11_HANDOFF.md` — Kingdom hub handoff.
17. `BATCH_10_HANDOFF.md` — Field Guide hub handoff.
18. `BATCH_3_HANDOFF.md` through `BATCH_9_HANDOFF.md` — Modal layer migration handoffs.
19. `README.md` — Top-level entry-point doc for the Vite scaffold.
20. `RENDER_HARNESS.md` — How to use the verification harness.

**The Vite scaffold (88 files, 1.7 MB):**
21. `src/` — All 31 components, 13 modals, 11 data modules, shared utilities, styles. The complete migrated web app source.
22. `verify/` — The 3-gate verification harness (parse-check, render-check, render-check-deep with 176 unit tests).
23. `index.html`, `package.json`, `vite.config.js`, `postcss.config.js` — Build configuration.
24. `public/` — Static assets.

**This synthesis document:**
25. `REVISION_PLAN_FOR_FULL_VISION.md` — This document (being written now).

### 5.3 Files NOT yet in project knowledge (user holds these)

These were referenced in the conversation but not seen by Claude. The next conversation should request these from the user:

- **The School of Heaven fiction series manuscripts** (7 novels — possibly only some are written; user knows the state)
- **Any operations / business plan / vision documents** (the user mentioned "vision/operations" documents)
- **Any marketing / brand documents** that already exist
- **Any draft donor / funder pitch documents**
- **Any ecclesiastical correspondence** (letters to bishops, draft imprimatur submissions, etc.)
- **The original `the_kingdom.jsx`** (13,631 lines) — the source of the migration; can be retired but useful as historical reference

### 5.4 Recommended next-conversation starting prompt

When you start the next conversation, the most efficient way to onboard Claude is:

> "I'm continuing work on The Kingdom — a Catholic digital formation movement. The context is captured in `REVISION_PLAN_FOR_FULL_VISION.md` (attached). Please read that first, then [specific task].
>
> Manuscripts to revise per that plan:
> - Master Vision & Outline (v8.0)
> - Books 1-7 (DTS curriculum)
> - The Field Guide (28 guides)
> - The Miracles of the Kingdom
> - [School of Heaven, operations docs, etc. — as applicable]
>
> The web app scaffold lives at `kingdom-vite-batch21/` and is structurally complete; that's not what we're working on now. Today we're revising [whichever source document]."

---

## Part 6 — Strategic Decisions That Need to Be Made

Some of these decisions cascade across many documents. The next conversation should resolve these *before* mass revisions begin, or revisions will be redone.

### Decision 1: The naming question

**Options:**
- (a) Master Vision wins. The web app re-brands to "The Kingdom DTS." Domain becomes kingdomdts.org. Web app eyebrow becomes Mt 4:17.
- (b) Web app wins. Master Vision revises to accept "The Kingdom Course" as the public-facing product name.
- (c) Hybrid. "The Kingdom DTS" is the canonical name (used in marketing collateral, ecclesial submissions, donor materials, the master vision); "The Kingdom Course" is the public-facing simplified name on the web app and in the daily user experience. Both are correct; one is for serious audiences, one is for searchers.

**My recommendation if asked:** (c). It mirrors how successful Catholic projects are named — Hallow Inc. operates the Hallow app; Word on Fire Ministries operates wordonfire.org; Ascension Press operates ascensionpress.com. The legal/canonical entity has one name; the consumer-facing product has another.

### Decision 2: The eyebrow / first declaration

**Options:**
- (a) "The Kingdom of Eternal Life" becomes canonical at the Master Vision level — replaces or augments Mt 4:17 as the movement-level tagline.
- (b) Mt 4:17 stays as the movement-level canonical tagline; "The Kingdom of Eternal Life" stays as the web-Hero-specific eyebrow.
- (c) "The Kingdom of Eternal Life — Made Visible" combined phrase becomes the eyebrow (the option you considered earlier in this conversation).

**My recommendation:** (b). Mt 4:17 is Scripturally weighted and theologically richer; Kingdom of Eternal Life is a beautiful first-page declaration; both can coexist at different levels of the project.

### Decision 3: The funding model

**Options:**
- (a) IGNITE-style donor base only. Free for every soul, zero paywall, sustained by recurring monthly donors. Simpler product, lower revenue ceiling.
- (b) Hallow-style freemium with scholarship path. Free tier = Gate + Course + audio podcast + basic Companion. Premium tier ($69-99/year) = AI Companion at scale + human-narrator audio + advanced personalization + Kingdom Groups facilitator tools. Scholarship path means no one who can't afford it sees a paywall.
- (c) Hybrid. Both freemium and donor base; freemium for sustainability, donor base for those who prefer that model.

**My recommendation:** (b) — Hallow-style freemium with robust free tier and scholarship path. Revenue scales with audience; preserves the Gate's "free for every soul" promise via scholarship; matches the digital-formation product category Hallow / Headspace / Calm / Duolingo Super all occupy.

### Decision 4: The Kingdom Groups manuscript revisions

**Options:**
- (a) Revise all source manuscript Kingdom Group content to digital-first, matching the web app's now-current framing.
- (b) Leave source manuscript Kingdom Group content unchanged; let the web app be a digital-first product on top of source content that includes traditional small-group framing.
- (c) Selective revision: source manuscripts get the principle change (community is the fruit, not prerequisite) but retain detailed in-person small-group instruction as one option among the digital options.

**My recommendation:** (a). Source manuscripts should match the digital-first vision the user has confirmed. The detailed in-person small-group instruction can become *one of several modes* within the rewritten chapters, not the default. This matches what was done in the web app's Practice #15.

### Decision 5: Tier 2 and Tier 3 product strategy

**Options:**
- (a) Tiers 2 and 3 follow the same digital-first model as Tier 1.
- (b) Tier 1 (Kingdom DTS) is digital-first; Tier 2 (Kingdom Formation) and Tier 3 (School of the Kingdom) are cohort-based / institutional-rollout products with structured in-person experiences.
- (c) Decision deferred until Tier 1 launches and produces audience data.

**My recommendation:** (c). Don't pre-commit. Tier 1 launches digital-first; once it scales, the data and the user base will reveal whether Tier 2 should be a deeper version of the same digital pattern (more like Hallow Plus → Hallow Premium) or a structured cohort (more like Word on Fire Institute's accredited courses). Both are valid paths; the data will say which.

---

## Part 7 — A Final Note on the Work

This is a large project. Seven books, a Field Guide of 28 guides, a Miracles volume, a 7-novel fiction series, a digital web app, a future native app, a podcast feed, a YouTube channel, a donor base, an ecclesial recognition path. Most Catholic apostolates that try to do all of this fail because they try to do all of it at once.

The good news embedded in the strategic roadmap: most of this can be sequenced. The Master Vision exists. The seven books exist (in v3). The Field Guide exists. The Miracles volume exists. The web app exists, complete, with 176 passing tests and a clean production build. **Most of the heavy lifting is already done.** What remains is alignment — making sure the documents talk to each other consistently, making the strategic decisions that cascade across documents, and then sequencing the revisions and the launch.

The core insight from this conversation, which the user articulated and which I now believe is right: **Digital first, when built well, organically leaks into physical sharing with friends and community — because the formation is actually effecting change and worthy of sharing.** This is the operating principle that should govern every revision in the source documents. Where current source manuscripts presuppose in-person community as a prerequisite to formation, soften to invitation. Where they teach in-person community as a value, preserve. The product reaches every soul on earth with phone and signal; the in-person life is the fruit, not the gate.

*Salus animarum suprema lex.* The salvation of souls is the supreme law. Build the rest of it well — and don't try to build it all at once.

---

**Document version:** 1.0
**Date:** May 2, 2026
**Author:** Synthesis from the full conversation thread covering web app migration batches 16-21, strategic vision development, and content alignment edits.
