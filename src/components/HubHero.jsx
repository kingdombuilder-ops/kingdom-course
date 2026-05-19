/* =============================================================================
   src/components/HubHero.jsx — Brand strip at the top of the Kingdom Hub.

   Shows today's weekday + date in an ornament header, "The Kingdom." as the
   page title, the liturgical season + date in italic wine, a thin gold rule,
   and (if a House has been chosen) a ribbon button with the house color +
   patron + tradition.

   This is the visual greeting the user sees every time they open the app on
   the Kingdom tab. It composes pure data — no interactive state of its own.

   Migrated from the_kingdom.jsx line ~8551.

   Props:
     houseKey  — slug of the user's chosen House, or null/undefined if not
                 yet discerned. When null, the ribbon is hidden.

   Note: the house ribbon is rendered as a <button>, but the source defines
   no onClick. It exists as a visual badge — tapping it does nothing today.
   That's preserved here. When the Houses-detail screen lands, this is where
   its onClick will hang.
   ============================================================================= */

import { ArrowRight } from 'lucide-react';
import { CHURCH_TODAY, HOUSES_HUB, IS_SATURDAY } from '@data';

export default function HubHero({ houseKey }) {
  const h = houseKey ? HOUSES_HUB[houseKey] : null;

  return (
    <section className="paper-bg" style={{ paddingTop: '5rem', paddingBottom: '2.5rem' }}>
      <div style={{ maxWidth: '44rem', margin: '0 auto', padding: '0 1.25rem' }}>
        <div className="ornament" style={{ maxWidth: '16rem', marginBottom: '1.25rem' }}>
          <span className="sc-bold" style={{ fontSize: '11px' }}>
            {CHURCH_TODAY.weekday} · {CHURCH_TODAY.date}
          </span>
        </div>
        {/* Marian Saturday eyebrow — per FINAL_CONTENT_REVISION_PLAN §2.3,
            no day passes without a Marian moment, and Saturday carries
            explicit Marian emphasis. */}
        {IS_SATURDAY && (
          <div
            className="sc-bold"
            style={{
              fontSize: 10,
              letterSpacing: '0.18em',
              color: 'var(--wine)',
              marginBottom: '1.25rem',
            }}
          >
            Marian Saturday · The Day of Our Lady
          </div>
        )}
        <h1
          className="display-strong"
          style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 600, lineHeight: 1.0 }}
        >
          The Kingdom.
        </h1>
        <div
          className="display"
          style={{
            fontSize: 'clamp(1.15rem, 2.6vw, 1.55rem)',
            color: 'var(--wine)',
            fontStyle: 'italic',
            marginTop: '0.5rem',
          }}
        >
          {CHURCH_TODAY.season} · {CHURCH_TODAY.liturgicalDate}
        </div>
        <div style={{ height: 1, marginTop: '1.25rem', maxWidth: '5rem', background: 'var(--gold)' }} />

        {/* House ribbon — visible only when a House has been discerned. */}
        {h && (
          <div style={{ marginTop: '1.5rem' }}>
            <button
              className="btn-ghost"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.5rem 0.75rem',
                border: `1px solid ${h.color}`,
                background: `${h.color}0a`,
                fontSize: 12,
              }}
            >
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: h.color }} />
              <span className="sc-bold" style={{ fontSize: 10, color: h.color }}>
                House of {h.name}
              </span>
              <span style={{ color: 'var(--mute)', opacity: 0.5 }}>·</span>
              <span
                className="body"
                style={{ fontStyle: 'italic', fontSize: '0.88rem', color: 'var(--ink-2)' }}
              >
                {h.patron} · {h.tradition}
              </span>
              <ArrowRight size={11} style={{ color: h.color, opacity: 0.6 }} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
