/* =============================================================================
   src/components/KingdomMoreGrid.jsx — The Hub's "More" surfaces.

   Five secondary cards displayed below the Seven Essentials on the Kingdom
   Hub. Each card carries enough inline content to be useful at a glance
   without requiring a tap.

     1. Your House — leads the grid. When a House has been discerned, it
        spans both columns and carries today's rotating saint quote.
        When not yet discerned, it's a single-column card prompting the
        five-minute quiz.
     2. Field Guide — links to the practices index (FieldGuideHub, batch 11)
     3. Intentions — shows count + preview of currently held intentions
     4. Cloud of Witnesses — opens the saints scroll modal
     5. Academy — locked surface, visible but inactive (post-Course feature)

   Migrated from the_kingdom.jsx routing block at line ~13345 (inline JSX
   inside the tab === "kingdom" && kingdomView === "hub" branch).

   Behavior preserved as-is from source. The dynamic gridColumn span on
   the Your House card ("1 / -1" when houseKey is set, "auto" otherwise)
   is the source's idea — the discerned-house card earns the visual weight
   of the daily saint quote.

   Props:
     houseKey            — slug of the user's chosen House, or null
     intentions          — array of intention objects { id, who, what }
                           or strings (legacy shape; defensive .text || it)
     onOpenHouseQuiz()   — invoked when the Your House card is tapped
                           (regardless of whether discerned or not — clicking
                           a discerned card re-opens the quiz; the "open
                           the house screen" surface lands later)
     onOpenIntention()   — invoked when the Intentions card is tapped
     onOpenWitnesses()   — invoked when the Cloud of Witnesses card is tapped
     onGoToFieldGuide()  — invoked when the Field Guide card is tapped.
                           Currently a stub callback; the FieldGuideHub view
                           lands in batch 11.
   ============================================================================= */

import { ArrowRight, Plus, Lock } from 'lucide-react';
import { HOUSES, HOUSE_QUOTES, TODAY_HOUSE_QUOTE_INDEX } from '@data';

export default function KingdomMoreGrid({
  houseKey,
  intentions = [],
  onOpenHouseQuiz,
  onOpenIntention,
  onOpenWitnesses,
  onGoToFieldGuide,
}) {
  const house = houseKey ? HOUSES[houseKey] : null;
  const quoteIdx = TODAY_HOUSE_QUOTE_INDEX;
  const todayQuote = houseKey
    ? HOUSE_QUOTES[houseKey]?.[quoteIdx] || HOUSE_QUOTES[houseKey]?.[0]
    : null;

  return (
    <section
      className="ink-bg"
      style={{
        paddingTop: '3rem',
        paddingBottom: '4rem',
        borderTop: '1px solid rgba(246,239,222,0.10)',
      }}
    >
      <div style={{ maxWidth: '56rem', margin: '0 auto', padding: '0 1.25rem' }}>
        <p
          className="sc-bold"
          style={{
            fontSize: 10,
            color: 'var(--gold-2)',
            marginBottom: '1.5rem',
            letterSpacing: '0.22em',
          }}
        >
          More
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 16rem), 1fr))',
            gap: '0.875rem',
          }}
        >
          {/* ---- 1. Your House ----------------------------------------- */}
          {/* Leads the grid. Spans both columns when discerned (the daily
              saint quote earns the space). */}
          <button
            onClick={onOpenHouseQuiz}
            style={{
              textAlign: 'left',
              padding: '1.25rem 1.25rem',
              background: 'rgba(246,239,222,0.03)',
              border: '1px solid rgba(246,239,222,0.10)',
              borderLeft: '3px solid ' + (house ? house.color : 'var(--gold-2)'),
              cursor: 'pointer',
              color: 'var(--paper)',
              minHeight: 110,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gridColumn: houseKey ? '1 / -1' : 'auto',
              fontFamily: 'inherit',
            }}
          >
            <div>
              <div
                className="sc-bold"
                style={{
                  fontSize: 9,
                  color: house ? house.color : 'var(--gold-2)',
                  letterSpacing: '0.18em',
                  marginBottom: '0.5rem',
                }}
              >
                {house
                  ? `House of ${house.name} · ${house.tradition}`
                  : 'Your House'}
              </div>
              {house && todayQuote ? (
                <>
                  {/* Daily saint quote — rotates by date */}
                  <p
                    className="display"
                    style={{
                      fontStyle: 'italic',
                      fontSize: '1.02rem',
                      lineHeight: 1.5,
                      color: 'rgba(246,239,222,0.85)',
                      marginBottom: '0.5rem',
                    }}
                  >
                    "{todayQuote.text}"
                  </p>
                  <p
                    className="sc-bold"
                    style={{
                      fontSize: 9,
                      color: house.color,
                      letterSpacing: '0.16em',
                    }}
                  >
                    {todayQuote.saint}
                  </p>
                </>
              ) : (
                <>
                  <h3
                    className="display"
                    style={{
                      fontSize: '1.05rem',
                      color: 'var(--paper)',
                      marginBottom: '0.375rem',
                      fontWeight: 500,
                    }}
                  >
                    Take the discernment
                  </h3>
                  <p
                    className="body"
                    style={{
                      fontStyle: 'italic',
                      fontSize: '0.82rem',
                      lineHeight: 1.45,
                      color: 'rgba(246,239,222,0.55)',
                    }}
                  >
                    Five traditions, one Church — charisms not divisions. Find the saint whose path
                    matches yours: Light · Fire · Earth · Joy · Glory.
                  </p>
                </>
              )}
            </div>
            <div
              style={{
                marginTop: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span
                className="sc"
                style={{
                  fontSize: 9,
                  color: 'rgba(246,239,222,0.45)',
                  letterSpacing: '0.18em',
                }}
              >
                {houseKey ? 'Open your house' : '5 minutes · Take the discernment'}
              </span>
              <ArrowRight
                size={12}
                style={{ color: house ? house.color : 'var(--gold-2)' }}
              />
            </div>
          </button>

          {/* ---- 2. Field Guide ----------------------------------------- */}
          <button
            onClick={onGoToFieldGuide}
            style={{
              textAlign: 'left',
              padding: '1.25rem 1.25rem',
              background: 'rgba(246,239,222,0.03)',
              border: '1px solid rgba(246,239,222,0.10)',
              borderLeft: '3px solid var(--wine-2)',
              cursor: 'pointer',
              color: 'var(--paper)',
              minHeight: 110,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              fontFamily: 'inherit',
            }}
          >
            <div>
              <div
                className="sc-bold"
                style={{
                  fontSize: 9,
                  color: 'var(--wine-2)',
                  letterSpacing: '0.18em',
                  marginBottom: '0.5rem',
                }}
              >
                The Field Guide
              </div>
              <h3
                className="display"
                style={{
                  fontSize: '1.05rem',
                  color: 'var(--paper)',
                  marginBottom: '0.375rem',
                  fontWeight: 500,
                }}
              >
                Twenty-two practices
              </h3>
              <p
                className="body"
                style={{
                  fontStyle: 'italic',
                  fontSize: '0.82rem',
                  lineHeight: 1.45,
                  color: 'rgba(246,239,222,0.55)',
                }}
              >
                Lectio, Examen, Adoration, Stations, Liturgy of the Hours — the toolkit of the
                Catholic life, always at hand.
              </p>
            </div>
            <div
              style={{
                marginTop: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span
                className="sc"
                style={{
                  fontSize: 9,
                  color: 'rgba(246,239,222,0.45)',
                  letterSpacing: '0.18em',
                }}
              >
                Reference
              </span>
              <ArrowRight size={12} style={{ color: 'var(--wine-2)' }} />
            </div>
          </button>

          {/* ---- 3. Intentions ------------------------------------------ */}
          <button
            onClick={onOpenIntention}
            style={{
              textAlign: 'left',
              padding: '1.25rem 1.25rem',
              background: 'rgba(246,239,222,0.03)',
              border: '1px solid rgba(246,239,222,0.10)',
              borderLeft: '3px solid #5C7A3A',
              cursor: 'pointer',
              color: 'var(--paper)',
              minHeight: 110,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              fontFamily: 'inherit',
            }}
          >
            <div>
              <div
                className="sc-bold"
                style={{
                  fontSize: 9,
                  color: '#7A9B4D',
                  letterSpacing: '0.18em',
                  marginBottom: '0.5rem',
                }}
              >
                Intentions
              </div>
              <h3
                className="display"
                style={{
                  fontSize: '1.05rem',
                  color: 'var(--paper)',
                  marginBottom: '0.375rem',
                  fontWeight: 500,
                }}
              >
                {intentions.length === 0
                  ? 'Carry someone in prayer'
                  : `${intentions.length} held in prayer`}
              </h3>
              <p
                className="body"
                style={{
                  fontStyle: 'italic',
                  fontSize: '0.82rem',
                  lineHeight: 1.45,
                  color: 'rgba(246,239,222,0.55)',
                }}
              >
                {intentions.length === 0
                  ? 'Add a name. The Lord hears every one. Pray your seven essentials with them in mind.'
                  : intentions
                      .slice(0, 2)
                      .map((it) => (typeof it === 'string' ? it : it.who || it.what || it.text || ''))
                      .filter(Boolean)
                      .join(' · ') +
                    (intentions.length > 2 ? ` · +${intentions.length - 2} more` : '')}
              </p>
            </div>
            <div
              style={{
                marginTop: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span
                className="sc"
                style={{
                  fontSize: 9,
                  color: 'rgba(246,239,222,0.45)',
                  letterSpacing: '0.18em',
                }}
              >
                {intentions.length === 0 ? 'Add your first' : 'Add another'}
              </span>
              <Plus size={12} style={{ color: '#7A9B4D' }} />
            </div>
          </button>

          {/* ---- 4. Cloud of Witnesses ---------------------------------- */}
          <button
            onClick={onOpenWitnesses}
            style={{
              textAlign: 'left',
              padding: '1.25rem 1.25rem',
              background: 'rgba(246,239,222,0.03)',
              border: '1px solid rgba(246,239,222,0.10)',
              borderLeft: '3px solid #B8A4D9',
              cursor: 'pointer',
              color: 'var(--paper)',
              minHeight: 110,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              fontFamily: 'inherit',
            }}
          >
            <div>
              <div
                className="sc-bold"
                style={{
                  fontSize: 9,
                  color: '#B8A4D9',
                  letterSpacing: '0.18em',
                  marginBottom: '0.5rem',
                }}
              >
                Cloud of Witnesses
              </div>
              <h3
                className="display"
                style={{
                  fontSize: '1.05rem',
                  color: 'var(--paper)',
                  marginBottom: '0.375rem',
                  fontWeight: 500,
                }}
              >
                Saints who walked this
              </h3>
              <p
                className="body"
                style={{
                  fontStyle: 'italic',
                  fontSize: '0.82rem',
                  lineHeight: 1.45,
                  color: 'rgba(246,239,222,0.55)',
                }}
              >
                Aquinas · Teresa of Ávila · Francis · Ignatius · Thérèse · Mother Teresa — the
                friends already praying for you.
              </p>
            </div>
            <div
              style={{
                marginTop: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span
                className="sc"
                style={{
                  fontSize: 9,
                  color: 'rgba(246,239,222,0.45)',
                  letterSpacing: '0.18em',
                }}
              >
                Meet them
              </span>
              <ArrowRight size={12} style={{ color: '#B8A4D9' }} />
            </div>
          </button>

          {/* ---- 5. Academy (locked) ------------------------------------ */}
          {/* Visible but not interactive. Opens to those who complete the
              50-day Course — the next horizon, kept in view. */}
          <div
            style={{
              textAlign: 'left',
              padding: '1.25rem 1.25rem',
              background: 'rgba(246,239,222,0.02)',
              border: '1px solid rgba(246,239,222,0.08)',
              borderLeft: '3px solid rgba(246,239,222,0.20)',
              color: 'var(--paper)',
              minHeight: 110,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              opacity: 0.7,
            }}
          >
            <div>
              <div
                className="sc-bold"
                style={{
                  fontSize: 9,
                  color: 'rgba(246,239,222,0.55)',
                  letterSpacing: '0.18em',
                  marginBottom: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                }}
              >
                The Academy <Lock size={9} />
              </div>
              <h3
                className="display"
                style={{
                  fontSize: '1.05rem',
                  color: 'rgba(246,239,222,0.75)',
                  marginBottom: '0.375rem',
                  fontWeight: 500,
                }}
              >
                After the fifty days
              </h3>
              <p
                className="body"
                style={{
                  fontStyle: 'italic',
                  fontSize: '0.82rem',
                  lineHeight: 1.45,
                  color: 'rgba(246,239,222,0.45)',
                }}
              >
                The deeper formation. Two-year curriculum. Opens to those who complete the Course.
              </p>
            </div>
            <div style={{ marginTop: '0.875rem' }}>
              <span
                className="sc"
                style={{
                  fontSize: 9,
                  color: 'rgba(246,239,222,0.35)',
                  letterSpacing: '0.18em',
                }}
              >
                Coming
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
