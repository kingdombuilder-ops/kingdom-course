/* =============================================================================
   src/components/StepRibbon.jsx — Compact horizontal step progress.

   Seven thin colored bars, each topped by the step's icon and verb in
   small caps. Used inside CourseHero as a glance-able progress indicator.
   The currently-active step is highlighted; complete steps show full
   opacity; future steps show muted opacity.

   Migrated from the_kingdom.jsx line ~6630.

   Props:
     progress       — { "w1-d1": true, "w2-d3": true, ... } — keys are
                      "w{week}-d{day}" for completed days
     currentWeekN   — 1..7, the week the user is currently on
   ============================================================================= */

import { SEVEN_WEEKS, STEP_COLORS } from '@data';
import { STEP_ICONS } from './_courseGeometry.js';

export default function StepRibbon({ progress = {}, currentWeekN = 1 }) {
  return (
    <div className="rise d-3" style={{ maxWidth: '32rem', margin: '0 auto' }}>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {SEVEN_WEEKS.map((w) => {
          let stepDays = 0;
          for (let d = 1; d <= 7; d++) if (progress[`w${w.n}-d${d}`]) stepDays++;
          const stepComplete = stepDays === 7;
          const stepCurrent = w.n === currentWeekN;
          const Icon = STEP_ICONS[w.n];
          const color = STEP_COLORS[w.n];
          return (
            <div
              key={w.n}
              style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.375rem' }}
              title={`Step ${w.n} · ${w.verb}`}
            >
              <div
                style={{
                  height: 4,
                  borderRadius: '9999px',
                  background: color,
                  opacity: stepComplete ? 1 : stepCurrent ? 0.85 : 0.32,
                  transition: 'opacity 0.5s ease',
                }}
              />
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.125rem',
                }}
              >
                <Icon
                  size={10}
                  style={{
                    color: stepCurrent ? color : 'var(--mute)',
                    opacity: stepCurrent ? 1 : 0.55,
                  }}
                />
                <span
                  className="sc"
                  style={{
                    fontSize: 9,
                    color: stepCurrent ? color : 'var(--mute)',
                  }}
                >
                  {w.verb}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
