/* =============================================================================
   src/components/EssentialBlock.jsx — Wrapper for one of the seven essentials.

   Each daily essential renders inside an EssentialBlock: a vertically-stacked
   section with a step indicator (Roman numeral disc + verb + duration), the
   practice name as a large heading, the tradition tagline, a slot for
   per-essential content (passed as children), and a CTA button at the bottom.

   When `isAltar` is true (used for ABIDE), the whole block gets a warmer
   treatment — gold tint background, a "fons et culmen" tag next to the verb,
   a filled CTA button. ABIDE is the source and summit; it deserves the
   visual weight.

   The section has `data-essential={n}` so MiniPath's tap-to-scroll knows
   which block to scroll to.

   Migrated from the_kingdom.jsx line ~9019. No behavior changes.

   Props:
     practice       — the daily practice object with { n, verb, practice,
                      tradition, duration } from DAILY_PRACTICES
     isComplete     — if true, shows Check in the disc and "Done"
     isAltar        — if true, gold treatment + filled CTA + "fons et culmen"
     romanNumeral   — string like "I", "II", ..., "VII"
     onStart        — invoked when the CTA button is tapped
     children       — the per-essential content (SeeContent, KnowContent, etc.)
   ============================================================================= */

import { Check, ArrowRight } from 'lucide-react';
import { STEP_COLORS, STEP_TINTS } from '@data';

export default function EssentialBlock({
  practice,
  isComplete,
  isAltar,
  romanNumeral,
  onStart,
  children,
}) {
  const color = STEP_COLORS[practice.n];
  const tint = STEP_TINTS[practice.n];

  return (
    <section
      data-essential={practice.n}
      style={{
        paddingTop: '3.5rem',
        paddingBottom: '3.5rem',
        background: isAltar ? 'rgba(215,177,105,0.04)' : 'transparent',
        borderTop: isAltar
          ? '1px solid rgba(215,177,105,0.30)'
          : '1px solid rgba(246,239,222,0.08)',
        borderBottom: isAltar ? '1px solid rgba(215,177,105,0.30)' : 'none',
        position: 'relative',
        // Ensures top of essential is visible after scroll-to from MiniPath.
        scrollMarginTop: '1rem',
      }}
    >
      {/* Step indicator — Roman numeral + verb in small caps + duration. */}
      <div style={{ maxWidth: '44rem', margin: '0 auto', padding: '0 1.25rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.875rem',
            marginBottom: '1rem',
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
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
              <Check size={14} strokeWidth={2.5} style={{ color }} />
            ) : (
              <span className="sc-bold" style={{ fontSize: 10, color }}>
                {romanNumeral}
              </span>
            )}
          </div>
          <div
            style={{
              flex: 1,
              minWidth: 0,
              display: 'flex',
              alignItems: 'baseline',
              gap: '0.625rem',
              flexWrap: 'wrap',
            }}
          >
            <span className="sc-bold" style={{ fontSize: 11, color, letterSpacing: '0.22em' }}>
              {practice.verb}
            </span>
            {isAltar && (
              <span
                className="sc"
                style={{ fontSize: 9, color: 'var(--gold-2)', fontStyle: 'italic' }}
              >
                fons et culmen
              </span>
            )}
          </div>
          <div
            className="sc"
            style={{ fontSize: 9, color: 'rgba(246,239,222,0.45)', flexShrink: 0 }}
          >
            {isComplete ? 'Done' : practice.duration}
          </div>
        </div>

        {/* Practice name */}
        <h2
          className="display-strong"
          style={{
            fontSize: isAltar ? 'clamp(1.7rem,4vw,2.2rem)' : 'clamp(1.5rem,3.5vw,1.9rem)',
            lineHeight: 1.1,
            fontWeight: 500,
            color: 'var(--paper)',
            marginBottom: '0.625rem',
          }}
        >
          {practice.practice}
        </h2>

        {/* Tradition tagline */}
        <p
          className="body"
          style={{
            fontStyle: 'italic',
            fontSize: '0.95rem',
            color: 'rgba(246,239,222,0.55)',
            marginBottom: '1.5rem',
            lineHeight: 1.5,
          }}
        >
          {practice.tradition}
        </p>

        {/* Body — children supplied by the parent for per-essential content. */}
        {children}

        {/* CTA */}
        <button
          onClick={onStart}
          style={{
            width: '100%',
            background: isAltar ? color : 'transparent',
            color: isAltar ? 'var(--paper)' : color,
            border: '1px solid ' + color,
            padding: '0.875rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            minHeight: 48,
            transition: 'all 0.25s ease',
            marginTop: '1.5rem',
            fontFamily: 'inherit',
          }}
          className="sc-bold"
        >
          <span style={{ fontSize: 11, letterSpacing: '0.18em' }}>
            {isComplete ? 'Pray again' : isAltar ? 'Find Mass · Adoration' : 'Begin'}
          </span>
          <ArrowRight size={14} />
        </button>
      </div>
    </section>
  );
}
