/* =============================================================================
   src/components/Bridge.jsx — Connects the Circles to the Course path.

   "The circles you just saw are the path you are about to walk."

   Static section, no props. SVG visualization on the left showing the same
   nine concentric rings compressed, with a beating wine core ("ABIDE")
   and inward + outward arrows. Right column explains the three classical
   movements of the spiritual life.

   Migrated from the_kingdom.jsx line ~7280. Tailwind classes converted to
   inline styles. Custom CSS classes preserved (paper-bg, ornament, sc,
   display-strong, body, display, pulse-core).

   Depends on RING_COLORS from the gospel data module.

   No props.
   ============================================================================= */

import { RING_COLORS } from '@data';

export default function Bridge() {
  const size = 340;
  const cx = size / 2;
  const cy = size / 2;
  const maxR = 130;
  const minR = 10;
  const step = (maxR - minR) / 8;

  return (
    <section
      className="paper-bg"
      style={{
        paddingTop: 'clamp(6rem, 10vw, 8rem)',
        paddingBottom: 'clamp(6rem, 10vw, 8rem)',
        borderTop: '1px solid var(--line)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          maxWidth: '64rem',
          margin: '0 auto',
          padding: '0 clamp(1.5rem, 3vw, 2.5rem)',
        }}
      >
        <div
          className="ornament"
          style={{ marginBottom: '2.5rem', maxWidth: '24rem', margin: '0 auto 2.5rem' }}
        >
          <span className="sc">The Shape of the Path</span>
        </div>
        <h2
          className="display-strong"
          style={{
            textAlign: 'center',
            fontSize: 'clamp(2rem, 4.8vw, 3.2rem)',
            lineHeight: 1.06,
            marginBottom: '1.5rem',
            fontWeight: 600,
          }}
        >
          The circles you just saw{' '}
          <span style={{ fontStyle: 'italic', color: 'var(--gold-3)' }}>
            are the path you are about to walk.
          </span>
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 18rem), 1fr))',
            gap: 'clamp(3rem, 5vw, 4rem)',
            alignItems: 'center',
            marginTop: '4rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <svg
              width={size}
              height={size}
              viewBox={`0 0 ${size} ${size}`}
              style={{ maxWidth: '100%', height: 'auto' }}
            >
              <defs>
                <radialGradient id="bridgeCore" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#F4D98C" stopOpacity="1" />
                  <stop offset="70%" stopColor="#B5883F" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#B5883F" stopOpacity="0" />
                </radialGradient>
                <marker id="arrowIn" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                  <path d="M0,0 L0,8 L7,4 z" fill="var(--wine)" />
                </marker>
                <marker id="arrowOut" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                  <path d="M0,0 L0,8 L7,4 z" fill="var(--gold)" />
                </marker>
              </defs>

              {/* Concentric rings — RING_COLORS reversed (innermost lightest) */}
              {[...Array(9)].map((_, i) => (
                <circle
                  key={i}
                  cx={cx}
                  cy={cy}
                  r={minR + i * step}
                  fill="none"
                  stroke={RING_COLORS[8 - i]}
                  strokeWidth="0.8"
                  opacity="0.7"
                />
              ))}

              <circle cx={cx} cy={cy} r={maxR + 20} fill="url(#bridgeCore)" opacity="0.4" />

              {/* Inward arrow */}
              <line
                x1={cx - maxR - 8}
                y1={cy - maxR - 8}
                x2={cx - 32}
                y2={cy - 32}
                stroke="var(--wine)"
                strokeWidth="1.5"
                markerEnd="url(#arrowIn)"
              />

              {/* Beating core — ABIDE */}
              <circle cx={cx} cy={cy} r="24" fill="var(--wine)" className="pulse-core" />

              {/* Outward arrow */}
              <line
                x1={cx + 32}
                y1={cy + 32}
                x2={cx + maxR + 8}
                y2={cy + maxR + 8}
                stroke="var(--gold)"
                strokeWidth="1.5"
                markerEnd="url(#arrowOut)"
              />

              {/* Labels */}
              <text
                x={cx - maxR - 4}
                y={cy - maxR - 14}
                fill="var(--wine)"
                fontSize="10"
                fontFamily="Cormorant SC, serif"
                letterSpacing="2"
                textAnchor="start"
              >
                INWARD
              </text>
              <text
                x={cx}
                y={cy + 4}
                fill="#F4D98C"
                fontSize="10"
                fontFamily="Cormorant SC, serif"
                letterSpacing="2"
                textAnchor="middle"
                style={{ pointerEvents: 'none' }}
              >
                ABIDE
              </text>
              <text
                x={cx + maxR + 4}
                y={cy + maxR + 22}
                fill="var(--gold-3)"
                fontSize="10"
                fontFamily="Cormorant SC, serif"
                letterSpacing="2"
                textAnchor="end"
              >
                OUTWARD
              </text>
            </svg>
          </div>

          <div>
            <p
              className="body"
              style={{
                fontSize: 'clamp(1.1rem, 1.85vw, 1.18rem)',
                lineHeight: 1.7,
                marginBottom: '1.5rem',
                color: 'var(--ink-2)',
              }}
            >
              The evidence radiates outward from a single center — the King — in nine concentric
              rings. You have just seen this from above. The course you are about to walk is the
              same geography, viewed from within.
            </p>
            <p
              className="body"
              style={{
                fontSize: 'clamp(1.1rem, 1.85vw, 1.18rem)',
                lineHeight: 1.7,
                marginBottom: '1.5rem',
                color: 'var(--ink-2)',
              }}
            >
              The ancient Church described the spiritual life in three movements. Modern saints
              still teach them. They are the <em>Via Purgativa</em>, the <em>Via Illuminativa</em>,
              and the <em>Via Unitiva</em> —{' '}
              <span style={{ fontStyle: 'italic', color: 'var(--gold-3)' }}>
                inward, abiding, outward.
              </span>
            </p>
            <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <span
                  className="sc"
                  style={{
                    fontSize: 10,
                    width: 80,
                    flexShrink: 0,
                    paddingTop: '0.375rem',
                    color: 'var(--wine)',
                  }}
                >
                  Inward
                </span>
                <p
                  className="body"
                  style={{
                    fontSize: '1.02rem',
                    lineHeight: 1.6,
                    color: 'var(--ink-2)',
                  }}
                >
                  Steps 1–3. The stripping. The mind, the heart, and the eyes cleared of what
                  blocks the King.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <span
                  className="sc"
                  style={{
                    fontSize: 10,
                    width: 80,
                    flexShrink: 0,
                    paddingTop: '0.375rem',
                    color: 'var(--gold-3)',
                  }}
                >
                  Abide
                </span>
                <p
                  className="body"
                  style={{
                    fontSize: '1.02rem',
                    lineHeight: 1.6,
                    color: 'var(--ink-2)',
                  }}
                >
                  Step 4. At the center. Joy, the Mass, beauty, rest — the King received and
                  adored.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <span
                  className="sc"
                  style={{
                    fontSize: 10,
                    width: 80,
                    flexShrink: 0,
                    paddingTop: '0.375rem',
                    color: 'var(--gold-3)',
                  }}
                >
                  Outward
                </span>
                <p
                  className="body"
                  style={{
                    fontSize: '1.02rem',
                    lineHeight: 1.6,
                    color: 'var(--ink-2)',
                  }}
                >
                  Steps 5–7. Sent. The saint carrying the King out into the city, the civilization,
                  the next generation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
