/* =============================================================================
   src/shared/utils.js — small pure helpers, no React, no side effects.
   ============================================================================= */

/* Roman numerals 1–9. The Hub and Course display essentials and weeks
   in roman numerals as a small typographic gesture. Falls back to
   the bare number for inputs above 9 (we never need higher in practice). */
export function toRoman(n) {
  const map = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'];
  return map[n - 1] || String(n);
}

/* Clamp a number to a [min, max] range. */
export const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

/* Format an ISO date string YYYY-MM-DD from a Date object. The liturgical
   dictionary is keyed by this exact format. */
export function isoDate(date = new Date()) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/* Date display in the project's voice: "April 28, 2026" */
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
export function formatDisplayDate(date = new Date()) {
  return `${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

/* Weekday name */
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export function weekdayName(date = new Date()) {
  return WEEKDAYS[date.getDay()];
}

/* Pluralize: helper for natural language ("1 day" vs "2 days") */
export const plural = (n, singular, pluralForm = singular + 's') =>
  `${n} ${n === 1 ? singular : pluralForm}`;
