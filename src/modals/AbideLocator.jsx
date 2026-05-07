/* =============================================================================
   src/modals/AbideLocator.jsx — ABIDE · The source and summit.

   The fourth essential's modal — and the doorway out of the app and into
   the physical Catholic Church. The user's actual eucharistic encounter
   happens *outside* this screen; the job here is to make the doorway
   clear, reverent, and real, then get out of the way.

   Three branches:
     1. Find Mass        — handoff to MassTimes.org
     2. Find Adoration   — handoff to a Google Maps Catholic-adoration query
     3. Spiritual Communion — when going isn't possible today

   Plus three confirmation toggles. The act, not the search, is what marks
   ABIDE complete — so the modal commits to onComplete only if the user
   has affirmed at least one of the toggles. Closing without confirming
   simply closes (onClose).

   Geolocation is requested only on explicit user tap, never on mount.
   Failure modes (declined, unavailable) fall back to opening the external
   search with whatever location text the user typed in the field.

   Migrated from the_kingdom.jsx line ~11782 with no behavioral changes.
   The two URL builders (buildMassTimesURL, buildGoogleMapsURL) live here
   as local helpers — they have no other consumers.

   Props:
     onComplete()  — caller marks essential IV complete (called only if a
                     toggle is confirmed)
     onClose()     — caller closes without marking complete
   ============================================================================= */

import { useState } from 'react';
import {
  X, Cross, Bookmark, ArrowUpRight, ArrowLeft, Check, Heart,
} from 'lucide-react';

// ---- Constants ------------------------------------------------------------
const SPIRITUAL_COMMUNION_PRAYER =
  'My Jesus, I believe that you are present in the Most Holy Sacrament. ' +
  'I love you above all things, and I desire to receive you into my soul. ' +
  'Since I cannot at this moment receive you sacramentally, ' +
  'come at least spiritually into my heart. ' +
  'I embrace you as if you were already there, ' +
  'and I unite myself wholly to you. ' +
  'Never permit me to be separated from you. Amen.';

// ---- URL builders ---------------------------------------------------------
function buildMassTimesURL(query) {
  const q = encodeURIComponent(query || '');
  return `https://masstimes.org/?location=${q}`;
}

function buildGoogleMapsURL(searchTerm, query) {
  const q = encodeURIComponent(query ? `${searchTerm} near ${query}` : `${searchTerm} near me`);
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

// ---- Component ------------------------------------------------------------
export default function AbideLocator({ onComplete, onClose }) {
  const [phase, setPhase] = useState('hero'); // hero | spiritual-communion
  const [locationQuery, setLocationQuery] = useState('');
  const [geoStatus, setGeoStatus] = useState('idle'); // idle | requesting | granted | denied

  // Confirmation toggles — the user's actual record of the day
  const [wentToMass, setWentToMass] = useState(false);
  const [satInAdoration, setSatInAdoration] = useState(false);
  const [madeSpiritualCommunion, setMadeSpiritualCommunion] = useState(false);

  const anyConfirmed = wentToMass || satInAdoration || madeSpiritualCommunion;

  /* Open the external search with whatever location text the user typed.
     Used as the immediate path when the field has text, and as the fallback
     when geolocation is declined or unavailable. */
  const handleSearch = (intent) => {
    const q = locationQuery.trim();
    if (intent === 'mass') {
      window.open(buildMassTimesURL(q), '_blank', 'noopener,noreferrer');
    } else if (intent === 'adoration') {
      window.open(buildGoogleMapsURL('Catholic Eucharistic Adoration', q), '_blank', 'noopener,noreferrer');
    }
  };

  /* Request browser geolocation. Only called on explicit tap when no
     location text has been entered. Falls back gracefully on denial. */
  const requestGeolocation = (intent) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setGeoStatus('denied');
      handleSearch(intent);
      return;
    }
    setGeoStatus('requesting');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setGeoStatus('granted');
        const locStr = `${latitude.toFixed(4)},${longitude.toFixed(4)}`;
        if (intent === 'mass') {
          window.open(buildMassTimesURL(locStr), '_blank', 'noopener,noreferrer');
        } else if (intent === 'adoration') {
          window.open(buildGoogleMapsURL('Catholic Eucharistic Adoration', locStr), '_blank', 'noopener,noreferrer');
        }
      },
      () => {
        setGeoStatus('denied');
        handleSearch(intent);
      },
      { timeout: 8000, maximumAge: 60000 }
    );
  };

  /* Close handler — onComplete only if a toggle is confirmed; otherwise
     plain onClose. The modal does not auto-mark ABIDE on the search action
     because the act, not the search, is what counts. */
  const finishAndClose = () => {
    if (anyConfirmed) onComplete && onComplete();
    else onClose && onClose();
  };

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
            maxWidth: '44rem', margin: '0 auto', padding: '1rem 1.5rem',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <svg width="22" height="22" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="18" fill="none" stroke="var(--gold-2)" strokeWidth="1" />
              <circle cx="20" cy="20" r="12" fill="none" stroke="var(--gold-2)" strokeWidth="1" />
              <circle cx="20" cy="20" r="6"  fill="none" stroke="var(--gold-2)" strokeWidth="1" />
              <circle cx="20" cy="20" r="2"  fill="var(--wine)" />
            </svg>
            <div>
              <div className="sc-bold" style={{ fontSize: 10, color: 'var(--paper)' }}>Mass / Adoration</div>
              <div className="body" style={{ fontStyle: 'italic', fontSize: '0.78rem', color: 'rgba(246,239,222,0.55)' }}>
                ABIDE · The source and summit
              </div>
            </div>
          </div>
          <button
            onClick={finishAndClose}
            aria-label="Close"
            style={{ padding: '0.5rem', background: 'transparent', border: 0, cursor: 'pointer', borderRadius: '50%' }}
          >
            <X size={16} style={{ color: 'rgba(246,239,222,0.7)' }} />
          </button>
        </div>
      </header>

      <main style={{ maxWidth: '44rem', margin: '0 auto', padding: '3rem 1.5rem' }}>
        {phase === 'hero' && (
          <div className="fade-in">
            {/* Hero */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.75rem' }}>
                <div className="eucharistic-hero">
                  <Cross size={48} style={{ color: 'var(--gold-2)', strokeWidth: 1.5 }} />
                </div>
              </div>
              <div className="sc-bold" style={{ fontSize: 10, marginBottom: '0.625rem', color: 'var(--gold-2)' }}>
                Step 4 · ABIDE · The Source and Summit
              </div>
              <h1
                className="display-strong"
                style={{ fontSize: 'clamp(2rem, 4.5vw, 2.8rem)', lineHeight: 1.06, marginBottom: '1rem', fontWeight: 600 }}
              >
                He is waiting for you.
              </h1>
              <p
                className="display"
                style={{
                  fontStyle: 'italic',
                  fontSize: 'clamp(1.1rem, 2vw, 1.3rem)',
                  lineHeight: 1.45,
                  color: 'rgba(246,239,222,0.85)',
                  maxWidth: '32rem',
                  margin: '0 auto',
                }}
              >
                In the tabernacle nearest you, right now. The same Christ. The same flesh and blood.
                Real, particular, present.
              </p>
              <div style={{ height: 1, margin: '1.75rem auto 0', maxWidth: '5rem', background: 'var(--gold-2)' }} />
            </div>

            <div
              style={{
                borderLeft: '2px solid var(--gold-2)',
                padding: '0.625rem 0 0.625rem 1.25rem',
                margin: '0 auto 2.5rem',
                maxWidth: '32rem',
              }}
            >
              <p
                className="display"
                style={{
                  fontStyle: 'italic',
                  fontSize: '1.1rem',
                  lineHeight: 1.55,
                  color: 'rgba(246,239,222,0.88)',
                }}
              >
                "The Eucharist is the source and summit of the Christian life. The other sacraments,
                and indeed all ecclesiastical ministries and works of the apostolate, are bound up
                with the Eucharist and are oriented toward it."
              </p>
              <p className="sc" style={{ fontSize: 9, marginTop: '0.5rem', color: 'var(--gold-2)' }}>
                Lumen Gentium 11 · Second Vatican Council
              </p>
            </div>

            {/* Location field */}
            <div style={{ marginBottom: '2rem' }}>
              <label
                className="sc-bold"
                style={{ fontSize: 10, color: 'var(--gold-2)', display: 'block', marginBottom: '0.5rem' }}
              >
                Where are you today?
              </label>
              <input
                type="text"
                className="location-search"
                placeholder="City, postal code, or address — or tap a finder to use your location"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
              />
              <p
                className="body"
                style={{
                  fontStyle: 'italic',
                  fontSize: '0.85rem',
                  marginTop: '0.5rem',
                  color: 'rgba(246,239,222,0.5)',
                }}
              >
                Optional. The finders below will use your device's location if you allow it.
              </p>
            </div>

            {/* Locator cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 18rem), 1fr))',
                gap: '1rem',
                marginBottom: '2.5rem',
              }}
            >
              {/* Find Mass */}
              <button
                onClick={() => (locationQuery.trim() ? handleSearch('mass') : requestGeolocation('mass'))}
                className="locator-card"
              >
                <div
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.875rem',
                    marginBottom: '0.875rem', position: 'relative', zIndex: 10,
                  }}
                >
                  <div
                    style={{
                      width: 48, height: 48, borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: 'rgba(215,177,105,0.18)',
                      border: '1.5px solid var(--gold-2)',
                      flexShrink: 0,
                    }}
                  >
                    <Bookmark size={20} style={{ color: 'var(--gold-2)' }} />
                  </div>
                  <div>
                    <div className="sc-bold" style={{ fontSize: 9, color: 'var(--gold-2)', marginBottom: '0.125rem' }}>
                      The Mass
                    </div>
                    <h3
                      className="display-strong"
                      style={{ fontSize: '1.4rem', lineHeight: 1.1, color: 'var(--paper)', fontWeight: 600 }}
                    >
                      Find a Mass today
                    </h3>
                  </div>
                </div>
                <p
                  className="body"
                  style={{
                    fontStyle: 'italic',
                    fontSize: '0.92rem',
                    lineHeight: 1.5,
                    color: 'rgba(246,239,222,0.72)',
                    marginBottom: '1rem',
                    position: 'relative',
                    zIndex: 10,
                  }}
                >
                  Mass times near you, from the global Catholic Mass-time directory.
                  Heaven on earth, on the calendar.
                </p>
                <div
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem',
                    marginTop: 'auto', paddingTop: '0.75rem',
                    borderTop: '1px solid rgba(215,177,105,0.20)',
                    position: 'relative', zIndex: 10,
                  }}
                >
                  <span className="sc" style={{ fontSize: 9, color: 'rgba(246,239,222,0.55)' }}>masstimes.org</span>
                  <span
                    className="sc-bold"
                    style={{
                      fontSize: 10, color: 'var(--gold-2)',
                      display: 'flex', alignItems: 'center', gap: '0.375rem',
                    }}
                  >
                    Open <ArrowUpRight size={11} />
                  </span>
                </div>
              </button>

              {/* Find Adoration */}
              <button
                onClick={() => (locationQuery.trim() ? handleSearch('adoration') : requestGeolocation('adoration'))}
                className="locator-card"
              >
                <div
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.875rem',
                    marginBottom: '0.875rem', position: 'relative', zIndex: 10,
                  }}
                >
                  <div
                    style={{
                      width: 48, height: 48, borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: 'rgba(215,177,105,0.18)',
                      border: '1.5px solid var(--gold-2)',
                      flexShrink: 0,
                    }}
                  >
                    <Cross size={20} style={{ color: 'var(--gold-2)' }} />
                  </div>
                  <div>
                    <div className="sc-bold" style={{ fontSize: 9, color: 'var(--gold-2)', marginBottom: '0.125rem' }}>
                      Adoration
                    </div>
                    <h3
                      className="display-strong"
                      style={{ fontSize: '1.4rem', lineHeight: 1.1, color: 'var(--paper)', fontWeight: 600 }}
                    >
                      Find a tabernacle
                    </h3>
                  </div>
                </div>
                <p
                  className="body"
                  style={{
                    fontStyle: 'italic',
                    fontSize: '0.92rem',
                    lineHeight: 1.5,
                    color: 'rgba(246,239,222,0.72)',
                    marginBottom: '1rem',
                    position: 'relative',
                    zIndex: 10,
                  }}
                >
                  When you can't go to Mass, sit before him. Eucharistic adoration chapels and
                  Catholic churches near you.
                </p>
                <div
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem',
                    marginTop: 'auto', paddingTop: '0.75rem',
                    borderTop: '1px solid rgba(215,177,105,0.20)',
                    position: 'relative', zIndex: 10,
                  }}
                >
                  <span className="sc" style={{ fontSize: 9, color: 'rgba(246,239,222,0.55)' }}>Google Maps</span>
                  <span
                    className="sc-bold"
                    style={{
                      fontSize: 10, color: 'var(--gold-2)',
                      display: 'flex', alignItems: 'center', gap: '0.375rem',
                    }}
                  >
                    Open <ArrowUpRight size={11} />
                  </span>
                </div>
              </button>
            </div>

            {/* Geolocation status */}
            {geoStatus === 'requesting' && (
              <p
                className="body"
                style={{
                  fontStyle: 'italic', fontSize: '0.9rem',
                  textAlign: 'center', marginBottom: '2rem',
                  color: 'rgba(215,177,105,0.85)',
                }}
              >
                Asking your device for your location…
              </p>
            )}
            {geoStatus === 'denied' && (
              <p
                className="body"
                style={{
                  fontStyle: 'italic', fontSize: '0.9rem',
                  textAlign: 'center', marginBottom: '2rem',
                  color: 'rgba(246,239,222,0.55)',
                }}
              >
                Location not available. Type a city or address above and tap a finder again.
              </p>
            )}

            {/* Spiritual Communion option — wine accent */}
            <div
              style={{
                paddingTop: '2rem',
                borderTop: '1px solid var(--line-dark)',
                textAlign: 'center',
                marginBottom: '2rem',
              }}
            >
              <div className="sc-bold" style={{ fontSize: 10, marginBottom: '0.5rem', color: 'rgba(184,42,42,0.85)' }}>
                When going isn't possible today
              </div>
              <h3
                className="display-strong"
                style={{ fontSize: 'clamp(1.4rem, 2.6vw, 1.7rem)', lineHeight: 1.15, marginBottom: '0.625rem', fontWeight: 600 }}
              >
                Make a Spiritual Communion.
              </h3>
              <p
                className="body-lede"
                style={{
                  fontSize: '1rem', lineHeight: 1.6,
                  color: 'rgba(246,239,222,0.78)',
                  maxWidth: '30rem', margin: '0 auto 1rem',
                }}
              >
                A real act of the soul, taught by the Church for centuries. Not a substitute for the
                sacrament — a true spiritual communion with the Christ already in your heart.
              </p>
              <button
                onClick={() => setPhase('spiritual-communion')}
                className="sc"
                style={{
                  fontSize: 10, padding: '0.625rem 1.25rem',
                  border: '1px solid rgba(184,42,42,0.55)',
                  color: 'rgba(220,140,140,0.95)',
                  background: 'rgba(140,42,42,0.06)',
                  cursor: 'pointer',
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  minHeight: 36,
                  fontFamily: 'inherit',
                }}
              >
                <Heart size={11} /> Pray the Spiritual Communion
              </button>
            </div>

            {/* Confirmation toggles */}
            <div style={{ paddingTop: '2rem', borderTop: '1px solid var(--line-dark)' }}>
              <div className="sc-bold" style={{ fontSize: 10, marginBottom: '0.5rem', color: 'var(--gold-2)' }}>
                When you have abided
              </div>
              <p
                className="body"
                style={{
                  fontStyle: 'italic', fontSize: '0.92rem', lineHeight: 1.55,
                  marginBottom: '1.25rem', color: 'rgba(246,239,222,0.6)',
                }}
              >
                The act, not the search, is what marks ABIDE complete. Mark this when you have
                actually been with him today.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button
                  onClick={() => setWentToMass(!wentToMass)}
                  className={'went-toggle ' + (wentToMass ? 'confirmed' : '')}
                >
                  <div className="check-circle">
                    {wentToMass && <Check size={13} strokeWidth={3} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="display" style={{ fontSize: '1.05rem', color: 'var(--paper)' }}>
                      I went to Mass today.
                    </div>
                    <div
                      className="body"
                      style={{ fontStyle: 'italic', fontSize: '0.85rem', color: 'rgba(246,239,222,0.55)', marginTop: '0.125rem' }}
                    >
                      Body and blood, soul and divinity. Received.
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => setSatInAdoration(!satInAdoration)}
                  className={'went-toggle ' + (satInAdoration ? 'confirmed' : '')}
                >
                  <div className="check-circle">
                    {satInAdoration && <Check size={13} strokeWidth={3} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="display" style={{ fontSize: '1.05rem', color: 'var(--paper)' }}>
                      I sat in Adoration today.
                    </div>
                    <div
                      className="body"
                      style={{ fontStyle: 'italic', fontSize: '0.85rem', color: 'rgba(246,239,222,0.55)', marginTop: '0.125rem' }}
                    >
                      Before the tabernacle. With him.
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => setMadeSpiritualCommunion(!madeSpiritualCommunion)}
                  className={'went-toggle ' + (madeSpiritualCommunion ? 'confirmed' : '')}
                >
                  <div className="check-circle">
                    {madeSpiritualCommunion && <Check size={13} strokeWidth={3} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="display" style={{ fontSize: '1.05rem', color: 'var(--paper)' }}>
                      I made a Spiritual Communion.
                    </div>
                    <div
                      className="body"
                      style={{ fontStyle: 'italic', fontSize: '0.85rem', color: 'rgba(246,239,222,0.55)', marginTop: '0.125rem' }}
                    >
                      A true act of the soul, in his presence wherever you are.
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Bottom action — only present when at least one toggle is confirmed. */}
            <div style={{ textAlign: 'center', marginTop: '2.5rem', paddingTop: '1.5rem' }}>
              {anyConfirmed ? (
                <>
                  <button
                    onClick={finishAndClose}
                    className="btn-gold sc-bold"
                    style={{
                      fontSize: 11, padding: '1rem 2rem',
                      display: 'inline-flex', alignItems: 'center', gap: '0.75rem', minHeight: 48,
                    }}
                  >
                    <Check size={14} /> Mark ABIDE complete
                  </button>
                  <p
                    className="body"
                    style={{
                      fontStyle: 'italic', fontSize: '0.92rem',
                      maxWidth: '26rem', margin: '1rem auto 0',
                      color: 'rgba(246,239,222,0.55)',
                    }}
                  >
                    The day has touched its center. Everything else now flows from this.
                  </p>
                </>
              ) : (
                <p
                  className="body"
                  style={{
                    fontStyle: 'italic', fontSize: '0.92rem',
                    maxWidth: '30rem', margin: '0 auto',
                    color: 'rgba(246,239,222,0.55)',
                  }}
                >
                  When you've been with him, return here and mark one of the boxes above.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Spiritual Communion subphase */}
        {phase === 'spiritual-communion' && (
          <div className="fade-in">
            <button
              onClick={() => setPhase('hero')}
              className="btn-ghost-dark sc"
              style={{
                fontSize: 10, padding: '0.5rem 0.875rem',
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                marginBottom: '2rem', minHeight: 36,
              }}
            >
              <ArrowLeft size={11} /> Back to ABIDE
            </button>

            <div className="spiritual-communion-panel">
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <div
                  className="breathe"
                  style={{
                    width: 76, height: 76, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(140,42,42,0.10)',
                    border: '2px solid var(--wine)',
                    boxShadow: '0 0 28px rgba(140,42,42,0.45)',
                  }}
                >
                  <Heart size={28} style={{ color: 'rgba(220,140,140,0.95)' }} />
                </div>
              </div>
              <div
                className="sc-bold"
                style={{
                  fontSize: 10, marginBottom: '0.5rem',
                  textAlign: 'center', color: 'rgba(220,140,140,0.95)',
                }}
              >
                The Spiritual Communion
              </div>
              <h2
                className="display-strong"
                style={{
                  fontSize: 'clamp(1.85rem, 4vw, 2.4rem)', lineHeight: 1.06,
                  marginBottom: '1rem', fontWeight: 600, textAlign: 'center',
                }}
              >
                Come into my heart.
              </h2>
              <div
                style={{
                  height: 1, margin: '0 auto 2rem',
                  maxWidth: '5rem', background: 'rgba(220,140,140,0.85)',
                }}
              />

              <p
                className="body"
                style={{
                  fontStyle: 'italic', fontSize: '0.95rem', lineHeight: 1.6,
                  marginBottom: '1.5rem',
                  color: 'rgba(246,239,222,0.7)', textAlign: 'center',
                  maxWidth: '32rem', marginLeft: 'auto', marginRight: 'auto',
                }}
              >
                Pray this slowly. Mean each line. The Church has taught for centuries that this is
                not a placeholder — it is a real act of the soul, and Christ honors it as such.
              </p>

              <p
                className="display"
                style={{
                  fontStyle: 'italic',
                  fontSize: 'clamp(1.15rem, 2.2vw, 1.35rem)',
                  lineHeight: 1.6, color: 'rgba(246,239,222,0.92)',
                  maxWidth: '34rem', margin: '0 auto 1.5rem',
                }}
              >
                {SPIRITUAL_COMMUNION_PRAYER}
              </p>

              <p
                className="body"
                style={{
                  fontStyle: 'italic', fontSize: '0.85rem', textAlign: 'center',
                  color: 'rgba(246,239,222,0.55)', marginBottom: '2rem',
                }}
              >
                Attributed to St. Alphonsus Liguori — eighteenth century.
              </p>

              <div
                style={{
                  textAlign: 'center', paddingTop: '1.5rem',
                  borderTop: '1px solid rgba(140,42,42,0.30)',
                }}
              >
                <button
                  onClick={() => {
                    setMadeSpiritualCommunion(true);
                    setPhase('hero');
                  }}
                  className="btn-gold sc-bold"
                  style={{
                    fontSize: 11, padding: '1rem 2rem',
                    display: 'inline-flex', alignItems: 'center', gap: '0.75rem',
                    minHeight: 48,
                  }}
                >
                  <Check size={14} /> Amen · I have made a Spiritual Communion
                </button>
                <p
                  className="body"
                  style={{
                    fontStyle: 'italic', fontSize: '0.9rem',
                    maxWidth: '28rem', margin: '1rem auto 0',
                    color: 'rgba(246,239,222,0.55)',
                  }}
                >
                  Christ has come spiritually into your heart. Carry him through the day.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
