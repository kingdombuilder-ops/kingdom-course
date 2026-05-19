/* =============================================================================
   src/modals/CloudOfWitnesses.jsx — "You are not walking alone."

   The communion-of-saints section. Renders SAINTS_HUB filtered by House
   tradition (or "All"). Sits inside the Kingdom tab — structurally a
   section, not a fixed-overlay modal — but lives under src/modals/ per
   the migration plan in MIGRATION.md.

   Migrated from the_kingdom.jsx line ~9688 with one correction: the
   filter chip set previously omitted the Joy/Earth distinction by using
   the slug "peace" with the label "Peace" (pre-rename). The slugs stay
   `benedict` and `peace` for data continuity (saint records still key
   off these); the display labels are "Earth" and "Joy" respectively, in
   line with HANDOFF.md.
   ============================================================================= */

import { useState } from 'react';
import { Cross } from 'lucide-react';
import { HOUSES_HUB, SAINTS_HUB } from '@data';

const FILTERS = [
  { id: 'all',      label: 'All',   color: '#D7B169' },
  { id: 'light',    label: 'Light' },
  { id: 'fire',     label: 'Fire' },
  { id: 'peace',    label: 'Joy' },
  { id: 'glory',    label: 'Glory' },
  { id: 'benedict', label: 'Earth' },
];

export default function CloudOfWitnesses() {
  const [filter, setFilter] = useState('all');
  const filtered = filter === 'all'
    ? SAINTS_HUB
    : SAINTS_HUB.filter((s) => s.house === filter);

  return (
    <section
      className="ink-bg"
      style={{ paddingTop: '5rem', paddingBottom: '7rem', color: 'var(--paper)' }}
    >
      <div style={{ maxWidth: '76rem', margin: '0 auto', padding: '0 1.5rem' }}>
        <div className="ornament" style={{ marginBottom: '2rem', maxWidth: '20rem', color: 'var(--gold-2)' }}>
          <span className="sc-bold" style={{ fontSize: 12, color: 'var(--gold-2)' }}>Cloud of Witnesses</span>
        </div>

        <h2
          className="display-strong"
          style={{
            fontSize: 'clamp(1.95rem, 4vw, 3rem)',
            lineHeight: 1.06,
            marginBottom: '0.75rem',
            fontWeight: 600,
          }}
        >
          You are not walking alone.{' '}
          <span style={{ fontStyle: 'italic', color: 'var(--gold-2)' }}>They are with you.</span>
        </h2>

        <div style={{ height: 1, marginBottom: '1.5rem', maxWidth: '5rem', background: 'var(--gold-2)' }} />

        <p
          className="body-lede"
          style={{
            fontSize: 'clamp(1.08rem, 2vw, 1.16rem)',
            lineHeight: 1.65,
            maxWidth: '42rem',
            marginBottom: '2.5rem',
            color: 'rgba(246,239,222,0.78)',
          }}
        >
          The saints who walked the path before you, sorted by House — your spiritual family
          within the wider communion.
        </p>

        {/* House filter chips. The Joy/Earth label split is critical: slug
            stays the data key; label is what the user sees. */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem' }}>
          {FILTERS.map((f) => {
            const color = f.color || HOUSES_HUB[f.id]?.color || 'var(--gold-2)';
            const active = filter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className="sc"
                style={{
                  fontSize: 10,
                  padding: '0.625rem 1rem',
                  minHeight: 44,
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  background: active ? `${color}10` : 'transparent',
                  border: `1px solid ${active ? color : 'rgba(246,239,222,0.10)'}`,
                  color: active ? color : 'rgba(246,239,222,0.6)',
                }}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Saint card grid. Auto-fills 12rem-wide cards; --house-color drives
            the bottom border accent via the .saint-card::after pseudo. */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 12rem), 1fr))',
            gap: '1rem',
          }}
        >
          {filtered.map((s) => {
            const houseColor = HOUSES_HUB[s.house].color;
            return (
              <div
                key={s.name}
                className="saint-card"
                style={{ '--house-color': houseColor, display: 'flex', flexDirection: 'column' }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div
                    style={{
                      width: 40, height: 40, borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: `1px solid ${houseColor}`,
                      background: `${houseColor}18`,
                      flexShrink: 0,
                    }}
                  >
                    <Cross size={16} style={{ color: houseColor }} />
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div className="display" style={{ fontSize: '1.05rem', lineHeight: 1.15, color: 'var(--paper)' }}>
                      {s.name}
                    </div>
                    <div className="body" style={{ fontStyle: 'italic', fontSize: '0.78rem', color: 'rgba(246,239,222,0.55)' }}>
                      {s.years}
                    </div>
                  </div>
                </div>
                <p
                  className="body"
                  style={{
                    fontSize: '0.85rem',
                    lineHeight: 1.45,
                    flex: 1,
                    color: 'rgba(246,239,222,0.7)',
                  }}
                >
                  {s.note}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
