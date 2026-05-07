/* =============================================================================
   src/components/PracticeRow.jsx — A single tappable practice row.

   A horizontal row that represents one of the seven daily practices: a
   colored numeral disc on the left, the verb (small caps) and practice
   name in the middle, and the duration (or "Done") on the right.

   When `isAltar` is true, the row gets warmer styling (gold tint, larger
   disc) — used to distinguish ABIDE as the source-and-summit.

   Migrated from the_kingdom.jsx line ~8778. No behavior changes.

   Behavior preserved: hover changes background subtly via inline JS
   handlers (no CSS :hover state), because the row is button-typed and
   the visual feedback is part of its tactile feel.

   Props:
     p           — a daily practice object with { n, verb, practice, tradition,
                   duration, iconName }. Comes from DAILY_PRACTICES in @data.
     isComplete  — if true, shows Check icon and "Done" status
     onStart     — invoked when the row is tapped
     isAltar     — if true, applies warmer treatment (used for ABIDE)
   ============================================================================= */

import { Check } from 'lucide-react';
import { ICON_MAP, STEP_COLORS, STEP_TINTS } from '@data';

export default function PracticeRow({ p, isComplete, onStart, isAltar = false }) {
  const Icon = ICON_MAP[p.iconName];
  const color = STEP_COLORS[p.n];
  const tint = STEP_TINTS[p.n];

  return (
    <button
      onClick={onStart}
      style={{
        width: '100%',
        background: isAltar ? 'rgba(215,177,105,0.06)' : 'transparent',
        border:
          '1px solid ' + (isAltar ? 'rgba(215,177,105,0.35)' : 'rgba(246,239,222,0.10)'),
        borderLeft: '3px solid ' + color,
        padding: isAltar ? '1.5rem 1.25rem' : '1.125rem 1.125rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        textAlign: 'left',
        cursor: 'pointer',
        color: 'var(--paper)',
        transition: 'background 0.25s ease, border-color 0.25s ease',
        minHeight: 56,
        fontFamily: 'inherit',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = isAltar
          ? 'rgba(215,177,105,0.10)'
          : 'rgba(246,239,222,0.04)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = isAltar ? 'rgba(215,177,105,0.06)' : 'transparent';
      }}
    >
      {/* Numeral disc — 44px tap target padding included by row min-height. */}
      <div
        style={{
          width: isAltar ? 44 : 38,
          height: isAltar ? 44 : 38,
          borderRadius: '50%',
          background: tint,
          border: '1px solid ' + color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {isComplete ? (
          <Check size={isAltar ? 16 : 14} strokeWidth={2.5} style={{ color }} />
        ) : Icon ? (
          <Icon size={isAltar ? 16 : 14} style={{ color }} />
        ) : (
          <span className="sc-bold" style={{ fontSize: 11, color }}>
            {p.n}
          </span>
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: '0.625rem',
            flexWrap: 'wrap',
          }}
        >
          <span className="sc-bold" style={{ fontSize: 10, color, letterSpacing: '0.22em' }}>
            {p.verb}
          </span>
          <span
            className="display"
            style={{
              fontSize: isAltar ? '1.15rem' : '1rem',
              fontWeight: isAltar ? 500 : 400,
              color: 'var(--paper)',
              lineHeight: 1.3,
            }}
          >
            {p.practice}
          </span>
        </div>
        <p
          className="body"
          style={{
            fontSize: '0.85rem',
            color: 'rgba(246,239,222,0.55)',
            marginTop: '0.25rem',
            fontStyle: 'italic',
            lineHeight: 1.45,
            // Truncate long lines on mobile to keep rows scannable.
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {p.tradition}
        </p>
      </div>

      {/* Status — duration, or "Done" if completed. */}
      <div style={{ flexShrink: 0, textAlign: 'right' }}>
        {isComplete ? (
          <span className="sc" style={{ fontSize: 9, color: 'var(--gold-2)' }}>
            Done
          </span>
        ) : (
          <span className="sc" style={{ fontSize: 9, color: 'rgba(246,239,222,0.45)' }}>
            {p.duration}
          </span>
        )}
      </div>
    </button>
  );
}
