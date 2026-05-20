/* =============================================================================
   lib/companion-crisis.js — Companion crisis detection + response (§5.3).

   SAFETY-CRITICAL. Pre-filter that runs on the user's latest message
   BEFORE the Anthropic call. On detection, the Companion short-circuits:
   it returns the crisis-response template and never proceeds to a normal
   model response (MASTER_SPECIFICATION §5.3: "Never proceed to normal
   Companion response after crisis detection without human override").

   Two-layer safety architecture:
     - Layer 1 (this file): deterministic keyword/phrase pre-filter.
       100% recall on the explicit and clear-implicit patterns it knows.
       Fast, free, no model call.
     - Layer 2 (the system prompt, lib/companion-system-prompt.js): the
       crisis instruction handles genuinely ambiguous implicit ideation
       ("I just don't see the point") that a keyword filter can't catch
       without unacceptable false positives.

   Design bias: for crisis detection, recall outweighs precision — a
   false positive (showing resources to someone not in crisis) is mildly
   jarring; a false negative (missing a real crisis) is catastrophic.
   Patterns are phrase-level (not bare words) to keep false positives
   reasonable while erring toward catching real distress.

   Patterns are intentionally specific multi-word phrases. Bare words
   ("kill", "die", "suicide", "hits me") are avoided — they false-trigger
   on benign contexts ("this workout is killing me", "suicide prevention
   hotline", "the sun hits me"). The ambiguous-but-listed §5.3 implicit
   phrases ("can't go on") are included; the genuinely ambiguous ones
   ("no point") are left to Layer 2.
   ============================================================================= */

const CRISIS_PATTERNS = {
  suicidal: [
    'kill myself', 'killing myself', 'kill me',
    'want to die', 'wanna die', 'want to be dead',
    'wish i was dead', 'wish i were dead',
    'end my life', 'ending my life', 'end it all',
    'take my own life', 'take my life',
    "don't want to live", 'do not want to live',
    "don't want to be alive", "don't want to be here anymore",
    'no reason to live', 'no reason to be alive', 'nothing to live for',
    'better off without me', 'better off dead',
    'everyone would be better off without me', 'world would be better without me',
    'suicidal', 'commit suicide', 'committing suicide',
    'attempt suicide', 'attempted suicide',
    'thinking about suicide', 'thoughts of suicide',
    "can't go on", 'cannot go on',
  ],
  selfHarm: [
    'cut myself', 'cutting myself', 'hurt myself', 'harm myself',
    'self-harm', 'self harm', 'harming myself',
    'starve myself', 'starving myself',
    'make myself throw up', 'make myself vomit',
  ],
  abuse: [
    'being abused', 'he hits me', 'she hits me', 'they hit me',
    'my husband hits', 'my wife hits', 'my partner hits',
    'my dad hits', 'my mom hits', 'my father hits', 'my mother hits',
    'beats me', 'being beaten', 'being hit at home', 'hurts me at home',
    'afraid to go home',
  ],
  psychotic: [
    'voices telling me', 'voices in my head', 'hearing voices',
    'voices are telling me', 'voices told me', 'command voices',
  ],
};

/* Returns { crisis: boolean, category?: string }. Case-insensitive
   phrase match against the user's text. First matching category wins
   (ordering is suicidal → selfHarm → abuse → psychotic; suicidal is
   checked first because it's the most time-critical). */
export function detectCrisis(text) {
  if (typeof text !== 'string' || !text) return { crisis: false };
  const lower = text.toLowerCase();
  for (const [category, patterns] of Object.entries(CRISIS_PATTERNS)) {
    for (const phrase of patterns) {
      if (lower.includes(phrase)) {
        return { crisis: true, category };
      }
    }
  }
  return { crisis: false };
}

/* Static crisis-response template (§5.3). Acknowledges the person's
   pain, states the Companion's limits, provides concrete resources
   (988 US/CA, local emergency, a physically-present person, parish
   priest), does NOT attempt therapy, and keeps the Catholic frame
   ("the Church does not abandon anyone"). Per §5.3 this is a static
   template; locale-specific variants are post-launch (§5.6).

   This single template fires for ALL categories, including abuse and
   psychotic. That is a deliberate soft-launch simplification, not an
   oversight: 988 (US) now routes broader mental-health crisis intake,
   and the universal lines (someone physically present, parish priest,
   local emergency for immediate danger) cover the gap reasonably. The
   suicide framing is imprecise for an abuse disclosure but degrades
   gracefully.

   §5.6 BACKLOG — category-specific resource arrays (post-launch):
     - abuse     → 1-800-799-SAFE (National DV Hotline); RAINN
                   1-800-656-HOPE for sexual assault if the classifier
                   distinguishes that subcase.
     - psychotic → keep 988 (still appropriate); consider adding
                   "if you have a psychiatrist or therapist, call them
                   now too."
     - suicidal / selfHarm → 988 retained.
   A locale matrix layers on top of these. Keep the patterns static and
   auditable — no regex disambiguation, no second-stage LLM classifier;
   both add failure surface for marginal precision gain (see header). */
export const CRISIS_RESPONSE = `
I want to pause here, because what you've shared matters more than anything else we could talk about.

I am a digital companion — I am not equipped to help you carry this, and you deserve a real human who can. Please reach out now to someone who can be with you:

• Call or text 988 — the Suicide and Crisis Lifeline, free and available 24/7 in the US and Canada. If you are elsewhere, call your local emergency number.
• Tell someone near you right now — a family member, a friend, anyone who can be physically present with you.
• Your parish priest is someone you can call too. The Church does not abandon anyone in this place, and neither should you have to be alone in it.

If you are in immediate danger, please call your local emergency number now.

You are not alone, and you are not beyond help. Please reach out to one of these people today.
`.trim();
