/* =============================================================================
   src/components/ConfessionPrompt.jsx — gentle, recurring Confession surface.

   Per FINAL_CONTENT_REVISION_PLAN §2.4. The Hub surfaces Confession as a
   small banner between the Seven Essentials and the More Grid:

     - If the user has never recorded a Confession date → render the
       soft prompt asking when they last went.
     - If the last recorded date is more than 35 days ago → render the
       same prompt with slightly more emphatic copy.
     - If less than 35 days → render nothing.

   Acceptance: gently surfaced, never guilting, respects the user's
   chosen frequency. Pastoral tone — Confession is never weekly or
   guilting; the standard catechetical encouragement is monthly.

   When the user taps "Mark today," the parent persists today's date so
   the prompt sleeps for the next ~35 days.

   The "Find a parish" link is deferred until the parish locator (per
   Master Spec 8.x / AbideLocator integration) lands.

   Props:
     lastConfessionDate  — ISO string or null
     onMarkConfession()  — invoked when the user taps "Mark today";
                           caller should persist today's date
   ============================================================================= */

const DAYS_BEFORE_PROMPT = 35;

function daysBetween(isoDate) {
  if (!isoDate) return null;
  const last = new Date(isoDate);
  if (Number.isNaN(last.getTime())) return null;
  const diffMs = Date.now() - last.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

export default function ConfessionPrompt({ lastConfessionDate, onMarkConfession = () => {} }) {
  const daysSince = daysBetween(lastConfessionDate);

  // Within the user's chosen frequency — sleep.
  if (daysSince !== null && daysSince < DAYS_BEFORE_PROMPT) return null;

  const prompt = daysSince === null
    ? 'Have you been to Confession recently? It is never too long.'
    : 'Has it been a month? It is never too long.';

  return (
    <section
      className="ink-bg"
      style={{
        paddingTop: '2.5rem',
        paddingBottom: '2.5rem',
        borderTop: '1px solid rgba(246,239,222,0.10)',
        borderBottom: '1px solid rgba(246,239,222,0.10)',
      }}
    >
      <div style={{ maxWidth: '44rem', margin: '0 auto', padding: '0 1.25rem' }}>
        <div
          className="ornament"
          style={{ maxWidth: '12rem', marginBottom: '1rem', color: 'var(--gold-2)' }}
        >
          <span className="sc-bold" style={{ fontSize: 10, color: 'var(--gold-2)' }}>
            Confession
          </span>
        </div>
        <p
          className="display"
          style={{
            fontStyle: 'italic',
            fontSize: 'clamp(1.1rem, 2vw, 1.25rem)',
            lineHeight: 1.55,
            color: 'rgba(246,239,222,0.85)',
            marginBottom: '1.25rem',
          }}
        >
          {prompt}
        </p>
        <button
          onClick={onMarkConfession}
          className="btn-ghost sc"
          style={{
            fontSize: 11,
            padding: '0.625rem 1rem',
            borderColor: 'rgba(246,239,222,0.32)',
            color: 'var(--paper)',
            fontFamily: 'inherit',
            cursor: 'pointer',
          }}
        >
          Mark today
        </button>
      </div>
    </section>
  );
}
