/* =============================================================================
   src/data/prompts.js — the rotating daily prompts.

   These are the user-facing variations that change with the day-of-month:
     - GO_PROMPTS:        seven apostolic acts (kerygma, share-the-walk, etc.)
     - FAMILY_PROMPTS:    seven domestic-church acts (BUILD's first circle)
     - CIVILIZATION_PROMPTS: seven civic acts (BUILD's third circle)
     - WORKS_OF_MERCY (re-exported via @data, lives in practices.js)

   Each TODAY_* constant is computed once at module load. The same seven
   prompts cycle weekly, so the same prompt appears roughly once per week.

   Backwards-compat aliases (VOCATION_PROMPTS, CIVIC_PROMPTS, TODAY_VOCATION,
   TODAY_CIVIC, TODAY_MERCY) preserve any older references in components
   that haven't yet been updated. Safe to remove once those components
   have all been migrated and verified.
   ============================================================================= */

import { WORKS_OF_MERCY } from './practices.js';

export const FAMILY_PROMPTS = [
  { name: "Build the family",            do: "If you have one — be present, attentive, slow today. If you don't — call your parents, your siblings, your godchildren. The domestic church is the first civilization." },
  { name: "Bless a child or sibling",    do: "A blessing on the forehead. A word of love spoken aloud. A prayer over them as they sleep, or as they leave the house. The kingdom is taught in homes first." },
  { name: "Honor your parents",          do: "Call. Visit. Listen longer than feels comfortable. They carry the patrimony — and the time grows shorter than we admit." },
  { name: "Mentor or be mentored",       do: "Spend time today with someone older or younger in your craft, your faith, your life. Pass knowledge — in either direction." },
  { name: "Bring excellence to one task", do: "The work itself becomes prayer. Give one task today — at home, at work, for those you love — the attention you would give the altar." },
  { name: "Make beauty in the home",     do: "Create one thing today that didn't exist this morning — a meal, a clean room, a kind sentence, a moment of quiet. Beauty is the form love takes." },
  { name: "Resist the rush",             do: "Refuse one shortcut today, especially with those closest. Do the small thing well. Civilization is built from a thousand quiet refusals to cut corners with the people in front of you." },
];

export const CIVILIZATION_PROMPTS = [
  { name: "Be a peacemaker",                do: "Refuse one piece of gossip today. End one feud, even silently. Bring peace to one room you are in." },
  { name: "Build community",                do: "Invite someone to a meal. Host. The Lord ate with people; we extend his table." },
  { name: "Speak truth in public",          do: "In one conversation today, say the true thing — kindly but plainly — that everyone is too tired to say." },
  { name: "Defend the weak",                do: "In one decision today — at work, in your civic life, in conversation — favor the one with less power." },
  { name: "Steward what is yours",          do: "Give thanks for what you have. Tend it. The kingdom is built by those who do not despise small things." },
  { name: "Make a culture worth inheriting", do: "What you tolerate today, your children will inherit. Refuse one ugliness — in speech, in entertainment, in posture." },
  { name: "Build something that will outlast you", do: "Give an hour today to a long-arc project — your craft, your art, your study, your patrimony for those who will come after." },
];

/* Backwards-compat aliases — preserved so any existing internal reference
   to VOCATION_PROMPTS / CIVIC_PROMPTS still resolves. The new canonical
   names are FAMILY_PROMPTS and CIVILIZATION_PROMPTS. */
export const VOCATION_PROMPTS = FAMILY_PROMPTS;
export const CIVIC_PROMPTS = CIVILIZATION_PROMPTS;

export const todayDateNum = (new Date()).getDate();
export const TODAY_FAMILY       = FAMILY_PROMPTS[todayDateNum % FAMILY_PROMPTS.length];
export const TODAY_CIVILIZATION = CIVILIZATION_PROMPTS[todayDateNum % CIVILIZATION_PROMPTS.length];
export const TODAY_VOCATION     = TODAY_FAMILY;       // alias
export const TODAY_CIVIC        = TODAY_CIVILIZATION; // alias
/* Today's discerned community work (formerly "mercy" — same data, the
   theological label preserved on each prompt's `kind` field but the
   UI label moves to "Community" to express the middle circle of charity. */
export const TODAY_COMMUNITY    = WORKS_OF_MERCY[todayDateNum % WORKS_OF_MERCY.length];
export const TODAY_MERCY        = TODAY_COMMUNITY;    // alias

export const todayWorkIndex = (new Date()).getDate() % WORKS_OF_MERCY.length;
export const TODAY_WORK_OF_MERCY = WORKS_OF_MERCY[todayWorkIndex];

/* SEND prompts — seven rotating attention patterns. Five relational
   turns toward the overlooked, plus two apostolic turns that honor
   Christ's "Go" — the kingdom extends through witness and through
   the prayer for those who do not yet believe. */
/* GO prompts — seven daily apostolic acts.
   Each prompt now includes a `share` field — a ready-to-paste sentence
   the user can copy and send (alongside today's Gospel verse) to make
   the apostolic act trivially actionable. The kingdom grows by
   invitation; the user shouldn't have to compose. The site itself
   (kingdomcourse.org) is the medium — the Gospel made simple, the
   thing that can be sent to anyone, anywhere, with no parish-required
   barrier. Mass is for the formed; the Gospel is the door. */
export const GO_PROMPTS = [
  { primary: "Speak the kerygma.",
    detail: "Tell one person, in plain language, about Christ today. Not a sermon — a sentence. \"He is risen. He is alive. He is for you.\"",
    share: "Thinking of you today. The most important thing I've come to know — He is risen, He is alive, and He is for you. That changes everything.",
  },
  { primary: "Share the walk.",
    detail: "Send someone the kingdom made simple. The Gospel itself, distilled for whoever you send it to. kingdomcourse.org",
    share: "This stopped me today. It's the Gospel of the kingdom, made simple — the thing I wish I'd been shown years ago. Sharing in case it lands for you too. kingdomcourse.org",
  },
  { primary: "Pray for one who does not yet believe — by name.",
    detail: "The colleague, the sibling, the parent. Pray with the conviction that the Father wants their salvation more than you do.",
    share: "I prayed for you today. No agenda. Just wanted you to know.",
  },
  { primary: "Reach out to one who has drifted.",
    detail: "A friend, a family member who has stopped showing up. Don't argue. Just ask how they are. Listen longer than feels comfortable.",
    share: "Been a while. Was thinking of you. How are you, really?",
  },
  { primary: "Bear witness in your work.",
    detail: "Let your faith be visible today in how you work — your patience, your honesty, your refusal to gossip, the small grace under pressure that makes someone ask, \"what is different about you?\"",
    share: null, // This one is lived, not sent
  },
  { primary: "Speak gently of the kingdom to someone unexpected.",
    detail: "Not the person who already agrees with you. The one who would never expect you to mention it. A sentence is enough.",
    share: "Something I'm learning that's stayed with me — the kingdom of heaven is here, now. Not far off. Not later. Here.",
  },
  { primary: "Invite one person.",
    detail: "Don't worry about Mass — that's for the formed. Send them the Gospel itself, the kingdom made simple. kingdomcourse.org",
    share: "Hey — I came across this and thought of you. The Gospel of the kingdom, in the simplest form I've seen. Have a look when you have a minute. kingdomcourse.org",
  },
];
export const todayGoIndex = (new Date()).getDate() % GO_PROMPTS.length;
export const TODAY_GO = GO_PROMPTS[todayGoIndex];

/* Backwards-compat aliases — keep TODAY_SEND defined so any existing
   reference resolves. The ReachOut modal reads TODAY_SEND; that modal
   is now the GO modal (Today's Apostolic Act), so the prompt source is
   correct under the new semantics. */
export const SEND_PROMPTS = GO_PROMPTS;
export const TODAY_SEND = TODAY_GO;
