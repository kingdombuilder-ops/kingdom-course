/* =============================================================================
   src/components/CourseJourney.jsx — The 7-week navigation section.

   The "centerpiece" — a dark-background section that houses both the
   horizontal SVG journey (HorizontalJourney) and the vertical list
   (SevenStepsList). Both render simultaneously. On wide viewports, the
   SVG visualization sits above the list; on narrow viewports, only the
   list visibly carries the navigation (the SVG is hidden via CSS media
   query — wrapper class `.course-journey-svg-wrapper` checked below 768px
   in src/styles/index.css if needed; current approach: rely on the SVG's
   intrinsic aspect ratio + small viewport behavior).

   Migrated from the_kingdom.jsx line ~6584. Tailwind classes converted
   to inline styles.

   Props:
     onEnterWeek(n)  — passed through to both HorizontalJourney and SevenStepsList
     progress        — { "w{week}-d{day}": true } map
     currentWeekN    — passed to HorizontalJourney to highlight active week
   ============================================================================= */

import HorizontalJourney from './HorizontalJourney.jsx';
import SevenStepsList from './SevenStepsList.jsx';

export default function CourseJourney({ onEnterWeek, progress = {}, currentWeekN = null }) {
  return (
    <section
      id="weeks"
      className="ink-bg"
      style={{
        position: 'relative',
        paddingTop: 'clamp(4rem, 8vw, 8rem)',
        paddingBottom: 'clamp(4rem, 8vw, 8rem)',
        color: 'var(--paper)',
      }}
    >
      <div
        style={{
          maxWidth: '72rem',
          margin: '0 auto',
          padding: '0 clamp(1.5rem, 3vw, 2.5rem)',
        }}
      >
        <div
          className="ornament"
          style={{ marginBottom: '2.5rem', maxWidth: '24rem', margin: '0 auto 2.5rem', color: 'var(--gold-2)' }}
        >
          <span className="sc-bold" style={{ fontSize: 12, color: 'var(--gold-2)' }}>
            The Path of the Saints
          </span>
        </div>
        <h2
          className="display-strong"
          style={{
            textAlign: 'center',
            fontSize: 'clamp(2.1rem, 5.2vw, 3.6rem)',
            lineHeight: 1.04,
            marginBottom: '0.75rem',
            fontWeight: 600,
          }}
        >
          One path. Three movements.
          <span style={{ display: 'block', fontStyle: 'italic', color: 'var(--gold-2)' }}>
            Seven steps.
          </span>
        </h2>
        <div
          style={{
            height: 1,
            margin: '0 auto 1.5rem',
            maxWidth: '5rem',
            background: 'var(--gold-2)',
          }}
        />
        <p
          className="body-lede"
          style={{
            textAlign: 'center',
            maxWidth: '42rem',
            margin: '0 auto 1rem',
            fontSize: 'clamp(1.15rem, 2vw, 1.25rem)',
            lineHeight: 1.6,
            color: 'rgba(246,239,222,0.85)',
          }}
        >
          The classical spiritual journey the Church has taught for two thousand years —
          inward, abiding, outward. Mapped to seven steps anyone can walk.
        </p>
        <p
          className="display-strong"
          style={{
            fontStyle: 'italic',
            textAlign: 'center',
            fontSize: 'clamp(1.15rem, 2vw, 1.3rem)',
            lineHeight: 1.4,
            maxWidth: '36rem',
            margin: '0 auto clamp(3rem, 5vw, 4rem)',
            color: 'var(--gold-2)',
            fontWeight: 500,
          }}
        >
          Seven weeks. Fifty days. The walk from Easter to Pentecost.
        </p>

        {/* The horizontal interactive Journey — rendered always, hidden by
            its parent's media query if needed. The SVG is the desktop
            visualization; SevenStepsList below covers mobile + always. */}
        <HorizontalJourney
          onSelectStep={onEnterWeek}
          progress={progress}
          currentWeekN={currentWeekN}
        />

        <div
          className="ornament"
          style={{
            marginTop: '1.5rem',
            marginBottom: '0.5rem',
            maxWidth: '14rem',
            margin: '1.5rem auto 0.5rem',
            color: 'var(--gold-2)',
          }}
        >
          <span className="sc" style={{ fontSize: 10, color: 'var(--gold-2)' }}>
            The Seven Steps
          </span>
        </div>
        <SevenStepsList onEnterWeek={onEnterWeek} progress={progress} />

        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
          <p
            className="display"
            style={{
              fontStyle: 'italic',
              fontSize: 'clamp(1.3rem, 2.4vw, 1.55rem)',
              color: 'var(--gold-2)',
            }}
          >
            Begin where you are. Walk at your pace. The Spirit is patient.
          </p>
        </div>
      </div>
    </section>
  );
}
