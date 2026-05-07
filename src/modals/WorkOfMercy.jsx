/* =============================================================================
   src/modals/WorkOfMercy.jsx — BUILD · Today's building act.

   The sixth essential's modal. The user discerns one act of love from one
   of three concentric circles:

     1. Family       — the domestic church (FAMILY_PROMPTS, 7 acts)
     2. Community    — the wounded near you (WORKS_OF_MERCY, 17 acts)
     3. Civilization — the world you are shaping (CIVILIZATION_PROMPTS, 7 acts)

   31 acts in total. The default view shows three pre-discerned for the
   user — TODAY_FAMILY, TODAY_COMMUNITY, TODAY_CIVILIZATION — one from
   each circle. "Show all options" expands to the full library.

   Two phases:
     discern   — pick an act
     committed — confirm and offer ("I will do this. Amen.")

   Migrated from the_kingdom.jsx line ~11349 with no behavioral changes.
   The "Spirit chooses" random helper still picks from whichever pool is
   currently visible (today's three or the full 31).

   Note: WorkOfMercy is the legacy filename. The user-facing name of this
   essential is "BUILD · Today's Building Act"; the modal name was kept
   for git-history continuity until a future rename pass.

   Props:
     onComplete(selectedAct)  — caller receives the act and marks complete
     onClose()                — caller closes without committing
   ============================================================================= */

import { useState } from 'react';
import { X, Building2, Hand, Sparkles, Check } from 'lucide-react';
import {
  FAMILY_PROMPTS,
  WORKS_OF_MERCY,
  CIVILIZATION_PROMPTS,
  TODAY_FAMILY,
  TODAY_COMMUNITY,
  TODAY_CIVILIZATION,
} from '@data';

// Pre-tag acts that don't already carry a kind. WORKS_OF_MERCY rows
// already have kind: "Corporal" | "Spiritual"; the family and civilization
// prompts get tagged here.
const FAMILY_ACTS       = FAMILY_PROMPTS.map((p) => ({ ...p, kind: 'Family' }));
const COMMUNITY_ACTS    = WORKS_OF_MERCY;
const CIVILIZATION_ACTS = CIVILIZATION_PROMPTS.map((p) => ({ ...p, kind: 'Civilization' }));

export default function WorkOfMercy({ onComplete, onClose }) {
  const [selectedAct, setSelectedAct] = useState(null);
  const [phase, setPhase] = useState('discern'); // discern | committed
  const [showAll, setShowAll] = useState(false);  // false = today's 3; true = all 31

  // The pre-discerned three — one per circle, rotated by date in @data.
  const todaysThree = [
    { ...TODAY_FAMILY, kind: 'Family' },
    TODAY_COMMUNITY,
    { ...TODAY_CIVILIZATION, kind: 'Civilization' },
  ];

  const select = (act) => setSelectedAct(act);

  const letSpiritChoose = () => {
    // Pull from whichever pool is currently visible.
    const pool = showAll
      ? [...FAMILY_ACTS, ...COMMUNITY_ACTS, ...CIVILIZATION_ACTS]
      : todaysThree;
    setSelectedAct(pool[Math.floor(Math.random() * pool.length)]);
  };

  const commit = () => setPhase('committed');

  return (
    <div
      className="ink-bg"
      style={{ position: 'fixed', inset: 0, zIndex: 100, overflowY: 'auto', color: 'var(--paper)' }}
    >
      <header
        className="ink-bg"
        style={{ position: 'sticky', top: 0, zIndex: 30, borderBottom: '1px solid var(--line-dark)' }}
      >
        <div
          style={{
            maxWidth: '48rem', margin: '0 auto', padding: '1rem 1.5rem',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <svg width="22" height="22" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="18" fill="none" stroke="#7A5230" strokeWidth="1" />
              <circle cx="20" cy="20" r="12" fill="none" stroke="#7A5230" strokeWidth="1" />
              <circle cx="20" cy="20" r="6"  fill="none" stroke="#7A5230" strokeWidth="1" />
              <circle cx="20" cy="20" r="2"  fill="var(--wine)" />
            </svg>
            <div>
              <div className="sc-bold" style={{ fontSize: 10, color: 'var(--paper)' }}>
                Today's Building Act
              </div>
              <div className="body" style={{ fontStyle: 'italic', fontSize: '0.78rem', color: 'rgba(246,239,222,0.55)' }}>
                BUILD · varies
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{ padding: '0.5rem', background: 'transparent', border: 0, cursor: 'pointer', borderRadius: '50%' }}
          >
            <X size={16} style={{ color: 'rgba(246,239,222,0.7)' }} />
          </button>
        </div>
      </header>

      <main style={{ maxWidth: '48rem', margin: '0 auto', padding: '3rem 1.5rem' }}>
        {phase === 'discern' && (
          <div className="fade-in">
            {/* Hero */}
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <div
                  className="breathe"
                  style={{
                    width: 76, height: 76, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(122,82,48,0.12)',
                    border: '2px solid #7A5230',
                    boxShadow: '0 0 28px rgba(122,82,48,0.45)',
                  }}
                >
                  <Building2 size={28} style={{ color: '#B8915C' }} />
                </div>
              </div>
              <div className="sc-bold" style={{ fontSize: 10, marginBottom: '0.5rem', color: '#B8915C' }}>
                Step 6 · BUILD · Three Circles of Charity
              </div>
              <h1
                className="display-strong"
                style={{ fontSize: 'clamp(2rem, 4.5vw, 2.8rem)', lineHeight: 1.08, marginBottom: '1rem', fontWeight: 600 }}
              >
                Where will the kingdom be built through you today?
              </h1>
              <div style={{ height: 1, margin: '0 auto 1.25rem', maxWidth: '5rem', background: '#B8915C' }} />

              <p
                className="body-lede"
                style={{
                  fontSize: 'clamp(1.02rem, 1.7vw, 1.1rem)',
                  lineHeight: 1.7,
                  maxWidth: '34rem',
                  margin: '0 auto 1rem',
                  color: 'rgba(246,239,222,0.82)',
                }}
              >
                Three concentric circles of love — family, community, civilization. Closest first,
                then near, then far. The saints walked outward in this order, and so do you.
              </p>
              <p
                className="body"
                style={{
                  fontStyle: 'italic',
                  fontSize: '0.95rem',
                  lineHeight: 1.6,
                  maxWidth: '32rem',
                  margin: '0 auto 1.5rem',
                  color: 'rgba(246,239,222,0.6)',
                }}
              >
                Today's three are pre-discerned for you — one from each circle. Pick the one that
                fits, or pray with all three through the day.
              </p>

              {/* Two pull-quotes — JPII on work, Francis on the Church-out-on-the-streets. */}
              <div
                style={{
                  borderLeft: '2px solid #B8915C',
                  padding: '0.5rem 0 0.5rem 1rem',
                  margin: '0 auto 0.875rem',
                  maxWidth: '30rem',
                  textAlign: 'left',
                }}
              >
                <p
                  className="display"
                  style={{ fontStyle: 'italic', fontSize: '1.02rem', lineHeight: 1.5, color: 'rgba(246,239,222,0.85)' }}
                >
                  "Through work, the human being shares in the act of the Creator, and continues to develop it."
                </p>
                <p className="sc" style={{ fontSize: 9, marginTop: '0.375rem', color: '#B8915C' }}>
                  St. John Paul II · Laborem exercens §25
                </p>
              </div>
              <div
                style={{
                  borderLeft: '2px solid #B8915C',
                  padding: '0.5rem 0 0.5rem 1rem',
                  margin: '0 auto 1rem',
                  maxWidth: '30rem',
                  textAlign: 'left',
                }}
              >
                <p
                  className="display"
                  style={{ fontStyle: 'italic', fontSize: '1.02rem', lineHeight: 1.5, color: 'rgba(246,239,222,0.85)' }}
                >
                  "I prefer a Church which is bruised, hurting and dirty because it has been out on the streets,
                  rather than a Church which is unhealthy from being confined and from clinging to its own security."
                </p>
                <p className="sc" style={{ fontSize: 9, marginTop: '0.375rem', color: '#B8915C' }}>
                  Pope Francis · Evangelii Gaudium §49
                </p>
              </div>
            </div>

            {/* Today's three — collapsed default. */}
            {!showAll && (
              <div style={{ marginBottom: '2rem' }}>
                <div
                  className="sc-bold"
                  style={{ fontSize: 10, marginBottom: '0.5rem', color: '#B8915C', letterSpacing: '0.18em' }}
                >
                  Today's three
                </div>
                <p
                  className="body"
                  style={{
                    fontStyle: 'italic',
                    fontSize: '0.92rem',
                    marginBottom: '1.25rem',
                    color: 'rgba(246,239,222,0.6)',
                  }}
                >
                  One from each mode. Pick the one that fits today — or pray with all three through the day.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {todaysThree.map((a) => {
                    const isSelected = selectedAct?.name === a.name;
                    return (
                      <button
                        key={a.name}
                        onClick={() => select(a)}
                        style={{
                          textAlign: 'left',
                          padding: '1.125rem 1.25rem',
                          background: isSelected ? 'rgba(184,145,92,0.18)' : 'rgba(246,239,222,0.03)',
                          border: '1px solid ' + (isSelected ? '#B8915C' : 'rgba(246,239,222,0.10)'),
                          color: 'var(--paper)',
                          cursor: 'pointer',
                          minHeight: 56,
                          transition: 'all 0.25s ease',
                          fontFamily: 'inherit',
                        }}
                      >
                        <div
                          className="sc-bold"
                          style={{ fontSize: 9, color: '#B8915C', marginBottom: '0.375rem', letterSpacing: '0.18em' }}
                        >
                          {a.kind}
                        </div>
                        <h3
                          className="display"
                          style={{ fontSize: '1.1rem', fontWeight: 500, color: 'var(--paper)', marginBottom: '0.375rem', lineHeight: 1.25 }}
                        >
                          {a.name}
                        </h3>
                        <p
                          className="body"
                          style={{ fontSize: '0.92rem', lineHeight: 1.5, color: 'rgba(246,239,222,0.72)' }}
                        >
                          {a.do}
                        </p>
                      </button>
                    );
                  })}
                </div>
                <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                  <button
                    onClick={() => setShowAll(true)}
                    className="sc"
                    style={{
                      fontSize: 10,
                      padding: '0.625rem 1.25rem',
                      border: '1px solid rgba(184,145,92,0.4)',
                      background: 'transparent',
                      color: 'rgba(184,145,92,0.8)',
                      cursor: 'pointer',
                      letterSpacing: '0.18em',
                      minHeight: 44,
                      fontFamily: 'inherit',
                    }}
                  >
                    Show all options
                  </button>
                  <p
                    className="body"
                    style={{ fontStyle: 'italic', fontSize: '0.82rem', marginTop: '0.5rem', color: 'rgba(246,239,222,0.45)' }}
                  >
                    Thirty-one ways to build the kingdom today.
                  </p>
                </div>
              </div>
            )}

            {/* Full library — three sections, one per circle. */}
            {showAll && (
              <>
                <CircleSection
                  label="Family · The domestic church"
                  blurb="Spouse, children, parents, siblings, godchildren. The first civilization is built here."
                  acts={FAMILY_ACTS}
                  defaultKind="Family"
                  selectedAct={selectedAct}
                  onSelect={select}
                />
                <CircleSection
                  label="Community · The wounded near you"
                  blurb="Neighbor, parish, the stranger Christ puts in your path. The corporal and spiritual works of mercy. Matthew 25."
                  acts={COMMUNITY_ACTS}
                  selectedAct={selectedAct}
                  onSelect={select}
                />
                <CircleSection
                  label="Civilization · The world you are shaping"
                  blurb="Work, art, civic life, what outlasts you. The kingdom takes territory through saints."
                  acts={CIVILIZATION_ACTS}
                  defaultKind="Civilization"
                  selectedAct={selectedAct}
                  onSelect={select}
                />

                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                  <button
                    onClick={() => setShowAll(false)}
                    className="sc"
                    style={{
                      fontSize: 10,
                      padding: '0.5rem 1rem',
                      background: 'transparent',
                      border: 0,
                      color: 'rgba(246,239,222,0.55)',
                      cursor: 'pointer',
                      letterSpacing: '0.18em',
                      fontFamily: 'inherit',
                    }}
                  >
                    ← Back to today's three
                  </button>
                </div>
              </>
            )}

            {/* Selection feedback OR "let the Spirit choose" affordance */}
            {selectedAct ? (
              <div
                className="fade-in"
                style={{
                  padding: '1.5rem 1.75rem',
                  border: '1px solid #B8915C',
                  background: 'rgba(122,82,48,0.10)',
                  marginBottom: '2rem',
                }}
              >
                <div className="sc-bold" style={{ fontSize: 10, marginBottom: '0.5rem', color: '#B8915C' }}>
                  Today's act · {selectedAct.kind}
                </div>
                <h3
                  className="display-strong"
                  style={{ fontSize: 'clamp(1.3rem, 2.5vw, 1.6rem)', lineHeight: 1.2, marginBottom: '0.625rem', fontWeight: 600 }}
                >
                  {selectedAct.name}
                </h3>
                <p
                  className="body"
                  style={{ fontSize: '1rem', lineHeight: 1.6, color: 'rgba(246,239,222,0.85)' }}
                >
                  {selectedAct.do}
                </p>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '1rem 0', marginBottom: '1.5rem' }}>
                <button
                  onClick={letSpiritChoose}
                  className="sc"
                  style={{
                    fontSize: 10,
                    padding: '0.625rem 1.25rem',
                    border: '1px solid rgba(184,145,92,0.5)',
                    color: 'rgba(184,145,92,0.85)',
                    background: 'transparent',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    minHeight: 36,
                    fontFamily: 'inherit',
                  }}
                >
                  <Sparkles size={11} /> Or — let the Spirit choose
                </button>
                <p
                  className="body"
                  style={{ fontStyle: 'italic', fontSize: '0.85rem', marginTop: '0.625rem', color: 'rgba(246,239,222,0.45)' }}
                >
                  When discernment is dry. He may surprise you.
                </p>
              </div>
            )}

            {selectedAct && (
              <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <button
                  onClick={commit}
                  className="btn-gold sc-bold"
                  style={{
                    fontSize: 11,
                    padding: '1rem 2rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    minHeight: 48,
                  }}
                >
                  <Check size={14} /> This is today's act
                </button>
              </div>
            )}
          </div>
        )}

        {phase === 'committed' && selectedAct && (
          <div className="fade-in" style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
              <div
                className="breathe"
                style={{
                  width: 80, height: 80, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(122,82,48,0.12)',
                  border: '2px solid #B8915C',
                  boxShadow: '0 0 36px rgba(184,145,92,0.45)',
                }}
              >
                <Hand size={32} style={{ color: '#B8915C' }} />
              </div>
            </div>
            <div className="sc-bold" style={{ fontSize: 10, marginBottom: '0.5rem', color: '#B8915C' }}>
              Today's act · {selectedAct.kind}
            </div>
            <h2
              className="display-strong"
              style={{ fontSize: 'clamp(1.85rem, 4vw, 2.5rem)', lineHeight: 1.06, marginBottom: '1rem', fontWeight: 600 }}
            >
              {selectedAct.name}
            </h2>
            <div style={{ height: 1, margin: '0 auto 2rem', maxWidth: '5rem', background: '#B8915C' }} />
            <p
              className="body-lede"
              style={{
                fontSize: 'clamp(1.05rem, 1.8vw, 1.15rem)',
                lineHeight: 1.7,
                maxWidth: '32rem',
                margin: '0 auto 2.5rem',
                color: 'rgba(246,239,222,0.85)',
              }}
            >
              {selectedAct.do}
            </p>

            <div
              style={{
                borderLeft: '2px solid #B8915C',
                padding: '0.5rem 0 0.5rem 1rem',
                margin: '0 auto 2rem',
                maxWidth: '30rem',
                textAlign: 'left',
              }}
            >
              <p
                className="display"
                style={{ fontStyle: 'italic', fontSize: '1.05rem', lineHeight: 1.5, color: 'rgba(246,239,222,0.85)' }}
              >
                "Be doers of the word, and not hearers only, deceiving yourselves."
              </p>
              <p className="sc" style={{ fontSize: 9, marginTop: '0.375rem', color: '#B8915C' }}>
                James 1:22
              </p>
            </div>

            <button
              onClick={() => onComplete && onComplete(selectedAct)}
              className="btn-gold sc-bold"
              style={{
                fontSize: 11,
                padding: '1rem 2rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                minHeight: 48,
              }}
            >
              <Check size={14} /> I will do this. Amen.
            </button>
            <p
              className="body"
              style={{
                fontStyle: 'italic',
                fontSize: '0.92rem',
                maxWidth: '26rem',
                margin: '1rem auto 0',
                color: 'rgba(246,239,222,0.55)',
              }}
            >
              Carry this through the day. The kingdom is being built — through you.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

/* ---------------------------------------------------------------------------
   Local helper: a circle section in the "show all" view.
   Extracted from the source's repeated three-block pattern to remove ~50
   lines of structural duplication. The cards themselves still use the
   .mercy-card class for hover/selected states.
   --------------------------------------------------------------------------- */
function CircleSection({ label, blurb, acts, defaultKind, selectedAct, onSelect }) {
  return (
    <div style={{ marginBottom: '2rem' }}>
      <div
        className="sc-bold"
        style={{ fontSize: 10, marginBottom: '0.875rem', color: '#B8915C', letterSpacing: '0.18em' }}
      >
        {label}
      </div>
      <p
        className="body"
        style={{
          fontStyle: 'italic',
          fontSize: '0.88rem',
          marginBottom: '1rem',
          color: 'rgba(246,239,222,0.55)',
        }}
      >
        {blurb}
      </p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 14rem), 1fr))',
          gap: '0.625rem',
        }}
      >
        {acts.map((a) => {
          const isSelected = selectedAct?.name === a.name;
          return (
            <button
              key={a.name}
              onClick={() => onSelect(a)}
              className={'mercy-card ' + (isSelected ? 'selected' : '')}
              style={{ '--mercy-color': '#B8915C' }}
            >
              <div className="mercy-kind">{a.kind || defaultKind}</div>
              <div className="mercy-name">{a.name}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
