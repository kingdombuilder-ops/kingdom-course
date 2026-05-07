/* =============================================================================
   src/components/_courseGeometry.js — Geometry for HorizontalJourney.

   Pure module: constants + smoothPath helper. No React, no JSX.
   The leading underscore in the filename signals these are internal helpers,
   not part of the public components API.

   Migrated from the_kingdom.jsx lines 2826-2856 verbatim.

   Each Step's y-coordinate traces the spiritual topography:
     Steps 1-2 hold steady (introduction)
     Step 3 dips (the dark night, lowest point)
     Step 4 returns (illumination restores)
     Steps 5-7 climb (mission rises toward Pentecost)
   ============================================================================= */

import { Eye, Brain, Flame, Leaf, Zap, Building2, Crown } from 'lucide-react';

/** Step number → icon component */
export const STEP_ICONS = { 1: Eye, 2: Brain, 3: Flame, 4: Leaf, 5: Zap, 6: Building2, 7: Crown };

/** Journey SVG viewbox dimensions */
export const VBW = 1100;
export const VBH = 380;

/** The seven step nodes positioned along the spiritual topography */
export const NODES = [
  { x: 110, y: 200 }, // Step 1
  { x: 250, y: 195 }, // Step 2
  { x: 395, y: 232 }, // Step 3 — descent (dark night)
  { x: 550, y: 200 }, // Step 4 — return (illumination)
  { x: 705, y: 170 }, // Step 5
  { x: 860, y: 152 }, // Step 6
  { x: 990, y: 130 }, // Step 7
];

/** Pentecost terminus — the day-50 point above and to the right of step 7 */
export const PENTECOST = { x: 1050, y: 78 };

/**
 * Build a smooth cubic-bezier path through ordered points.
 * Used to draw the pilgrim's path through the seven step nodes + Pentecost.
 */
export function smoothPath(points) {
  if (points.length < 2) return '';
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1];
    const b = points[i];
    const dx = (b.x - a.x) * 0.4;
    d += ` C ${a.x + dx} ${a.y}, ${b.x - dx} ${b.y}, ${b.x} ${b.y}`;
  }
  return d;
}
