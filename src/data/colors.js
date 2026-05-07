/* =============================================================================
   src/data/colors.js — the chromatic spine of the seven essentials.

   Each of the seven essentials carries one signature color, used everywhere
   that essential appears: medallions, ghost numbers, glow shadows, accent
   bars, House associations. Indexed 1–7 to match the essential's roman
   numeral so STEP_COLORS[1] is SEE, STEP_COLORS[4] is ABIDE, etc.

   1 SEE     #9A4423 — terracotta (the awakening day)
   2 KNOW    #D7B169 — gold       (the Light · Dominican)
   3 HEAL    #8C2A2A — wine       (the Fire · Carmelite)
   4 ABIDE   #5C7A3A — olive      (the Peace · Franciscan altar)
   5 GO      #4A5F7E — slate      (the Glory · Ignatian mission)
   6 BUILD   #7A5230 — earth      (the Earth · Benedictine work)  *was 5C4A2E
   7 SEND    #3D3450 — twilight   (the Marian close · universal)

   Note: BUILD's chromatic value here (#7A5230) is deliberately warmer than
   the House-of-Earth swatch (#5C4A2E) so the essential reads as work-color,
   not soil-color, when adjacent to gold and wine. The House identity uses
   the deeper #5C4A2E in House-card surfaces.
   ============================================================================= */

export const STEP_COLORS = {
  1: '#9A4423',
  2: '#D7B169',
  3: '#8C2A2A',
  4: '#5C7A3A',
  5: '#4A5F7E',
  6: '#7A5230',
  7: '#3D3450',
};

export const STEP_TINTS = {
  1: 'rgba(154,68,35,0.10)',
  2: 'rgba(215,177,105,0.10)',
  3: 'rgba(140,42,42,0.10)',
  4: 'rgba(92,122,58,0.10)',
  5: 'rgba(74,95,126,0.10)',
  6: 'rgba(122,82,48,0.10)',
  7: 'rgba(61,52,80,0.10)',
};

export const STEP_GLOWS = {
  1: 'rgba(154,68,35,0.45)',
  2: 'rgba(215,177,105,0.55)',
  3: 'rgba(140,42,42,0.45)',
  4: 'rgba(92,122,58,0.55)',
  5: 'rgba(74,95,126,0.45)',
  6: 'rgba(122,82,48,0.45)',
  7: 'rgba(61,52,80,0.45)',
};

export const TAB_LABEL = {
  gate:    'The Gospel',
  course:  'The Course',
  kingdom: 'The Kingdom',
};
