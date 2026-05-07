/* =============================================================================
   src/data/index.js — the data barrel.

   Pure data and pure helpers only. No React. No JSX. No DOM. Importable
   from any other module via the @data alias:

       import { CHURCH_TODAY, HOUSES, STEP_COLORS } from '@data';

   To add a new data module: drop the file in src/data/, then re-export here.
   ============================================================================= */

// Liturgical
export {
  LITURGICAL_DAYS,
  LITURGICAL_FALLBACK,
  LITURGICAL_PAPAL_INTENTIONS_2026,
  getLiturgicalDay,
} from './liturgical.js';

// Color spine
export { STEP_COLORS, STEP_TINTS, STEP_GLOWS, TAB_LABEL } from './colors.js';

// Houses
export {
  HOUSES,
  HOUSE_LIST,
  HOUSES_HUB,
  HOUSE_QUOTES,
  TODAY_HOUSE_QUOTE_INDEX,
} from './houses.js';

// Saints
export { SAINTS_HUB } from './saints.js';

// Practices (the seven essentials + works of mercy + icon map)
export { DAILY_PRACTICES, WORKS_OF_MERCY, ICON_MAP } from './practices.js';

// Field Guide (22 practices + 5 categories — used by FieldGuideHub + PracticeGuide)
export { PRACTICE_CATEGORIES, PRACTICES } from './field-guide.js';

// Course (the 7-week, 49-day curriculum — used by Course tab views)
export { COURSE_PROGRESSION_COLORS, SEVEN_WEEKS } from './course.js';

// Gospel tab (Gate) — 9 circles of evidence + ring colors
export { CIRCLES, RING_COLORS } from './gospel.js';

// Rotating daily prompts
export {
  FAMILY_PROMPTS,
  CIVILIZATION_PROMPTS,
  VOCATION_PROMPTS,
  CIVIC_PROMPTS,
  todayDateNum,
  TODAY_FAMILY,
  TODAY_CIVILIZATION,
  TODAY_VOCATION,
  TODAY_CIVIC,
  TODAY_COMMUNITY,
  TODAY_MERCY,
  todayWorkIndex,
  TODAY_WORK_OF_MERCY,
  GO_PROMPTS,
  todayGoIndex,
  TODAY_GO,
  SEND_PROMPTS,
  TODAY_SEND,
} from './prompts.js';

// Discernment quiz
export { QUIZ_QUESTIONS } from './quiz.js';

// ----------------------------------------------------------------------------
// Computed singletons — read once at module load. The whole app reads these
// exactly as before. If a consumer needs the *current* day mid-session
// (e.g. after midnight), call getLiturgicalDay() directly.
// ----------------------------------------------------------------------------

import { getLiturgicalDay } from './liturgical.js';

export const CHURCH_TODAY = getLiturgicalDay();
