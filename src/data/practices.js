/* =============================================================================
   src/data/practices.js — the practices that fill the daily walk.

   DAILY_PRACTICES is the Hub's spine: the Seven Essentials in their
   3-1-3 rhythm. The `iconName` strings (rather than direct icon imports)
   let consumers map to icons via ICON_MAP — keeps this file pure-data.

   WORKS_OF_MERCY is the Catholic catalog (corporal + spiritual + the
   relational extensions for the Hub's specific pastoral surfaces).
   ============================================================================= */

import { Eye, Brain, Flame, Leaf, Zap, Building2, Crown } from 'lucide-react';

// Map iconName strings to actual lucide components.
// Components that read DAILY_PRACTICES use ICON_MAP[practice.iconName] to
// resolve to a renderable Component.
export const ICON_MAP = { Eye, Brain, Flame, Leaf, Zap, Building2, Crown };

/* The Seven Essentials of the daily walk. Note: GO and SEND inline copy
   reference TODAY_GO from prompts.js, so consumers should derive `line`
   for those two essentials at render time, not import a static string.
   The iconName/phase/duration/mode metadata stays static here. */
export const DAILY_PRACTICES = [
  { n: 1, verb: 'SEE',   practice: 'Today in the Kingdom',
    tradition: 'Awareness · The day as a kingdom day',
    line: "Today belongs to Christ. Today's saint, season, and intention — where do you expect to meet Him?",
    mode: 'inline',     duration: '1 min',    iconName: 'Eye',        phase: 'preparation' },
  { n: 2, verb: 'KNOW',  practice: 'The Gospel Today',
    tradition: 'Lectio Divina',
    line: 'Slow contemplative reading of the Gospel proclaimed at Mass.',
    mode: 'guided',     duration: '15 min',   iconName: 'Brain',      phase: 'preparation' },
  { n: 3, verb: 'HEAL',  practice: 'Daily Examen',
    tradition: 'Carmelite · Healing-centered',
    line: 'Five movements. Where did love stir? What wound surfaced? What will you bring to Christ?',
    mode: 'guided',     duration: '10 min',   iconName: 'Flame',      phase: 'preparation' },
  { n: 4, verb: 'ABIDE', practice: 'Mass / Adoration',
    tradition: 'The source and summit · The Franciscan altar',
    line: 'The Mass — heaven on earth. Or, when you cannot go, sit before Him in the tabernacle.',
    mode: 'locator',    duration: '60 min',   iconName: 'Leaf',       phase: 'altar' },
  { n: 5, verb: 'GO',    practice: "Today's Apostolic Act",
    tradition: 'Mission · Ite, missa est · Ad maiorem Dei gloriam',
    // line is composed at render-time using TODAY_GO from prompts.js
    line: '',
    mode: 'check-in',   duration: '5–10 min', iconName: 'Zap',        phase: 'extension' },
  { n: 6, verb: 'BUILD', practice: "Today's Building Act",
    tradition: 'Family · Community · Civilization',
    line: 'Three concentric circles of love — closest first, then near, then far. One discerned today.',
    mode: 'discern',    duration: 'varies',   iconName: 'Building2',  phase: 'extension' },
  { n: 7, verb: 'SEND',  practice: 'The Rosary, for souls',
    tradition: 'Marian · Saints making saints · Mother of every House',
    line: "Pray today's Rosary for those you love and one who does not yet believe. With others, if possible.",
    mode: 'guided',     duration: '20 min',   iconName: 'Crown',      phase: 'extension' },
];

/* The Works of Mercy — corporal, spiritual, plus the relational extensions
   that surface in the Hub's Reach Out flow. Each `do` field is the actionable
   prompt: what does this look like today, in this user's life. */
export const WORKS_OF_MERCY = [
  { kind: 'Corporal',  name: 'Feed the hungry',            do: 'Bring food to someone in need today, or give to the parish food shelf — by name.' },
  { kind: 'Corporal',  name: 'Give drink to the thirsty',  do: 'Offer water, coffee, presence to someone alone in your day.' },
  { kind: 'Corporal',  name: 'Clothe the naked',           do: 'Give a coat, a sweater, a piece of clothing to someone who needs it.' },
  { kind: 'Corporal',  name: 'Shelter the homeless',       do: 'Welcome someone in. Or contribute to a shelter today, by name.' },
  { kind: 'Corporal',  name: 'Visit the sick',             do: 'Call, visit, or sit with someone in illness — for ten minutes longer than feels comfortable.' },
  { kind: 'Corporal',  name: 'Visit the imprisoned',       do: 'Write to a prisoner, or pray by name for someone in confinement of any kind.' },
  { kind: 'Corporal',  name: 'Bury the dead',              do: "Pray for someone recently lost. Attend a wake or funeral. Honor the body that bore Christ's image." },
  { kind: 'Spiritual', name: 'Counsel the doubtful',       do: 'Sit with someone wrestling with faith. Listen first. Speak truth gently when they ask.' },
  { kind: 'Spiritual', name: 'Instruct the ignorant',      do: 'Teach someone something about the faith — a child, a friend, a colleague who asked.' },
  { kind: 'Spiritual', name: 'Admonish the sinner',        do: 'With love and tact, name what needs naming — to someone who can hear it from you.' },
  { kind: 'Spiritual', name: 'Comfort the afflicted',      do: 'Be present to someone in grief. Words optional. Presence essential.' },
  { kind: 'Spiritual', name: 'Forgive offenses',           do: "Name an offense you've carried. Release it before God today. Tell the person if you can." },
  { kind: 'Spiritual', name: 'Bear wrongs patiently',      do: "The slight you carried into today — let it die there. Don't return the wound." },
  { kind: 'Spiritual', name: 'Pray for the living and the dead', do: 'Pray by name for one living and one departed soul. Both still belong to God.' },
  /* Relational extensions — formerly under Reach Out, here under their proper canonical home. */
  { kind: 'Spiritual', name: 'Comfort the lonely',         do: "Someone in your parish or family who hasn't been called in too long. Ten minutes on the phone. That's all." },
  { kind: 'Spiritual', name: 'Notice the neglected',       do: 'The widow, the elderly, the homebound. The ones the world has stopped noticing. Notice them today.' },
  { kind: 'Spiritual', name: 'Reach the silent',           do: 'The one who never asks for help. The one always doing the carrying. Ask how they are doing — and wait.' },
];
