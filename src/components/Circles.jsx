/* =============================================================================
   src/components/Circles.jsx — The Nine Circles of Evidence visualization.

   Dark-background section showing the 9 concentric rings as an SVG (left
   on desktop, full-width on mobile) plus a tappable list of all 9 circles
   to the right. Both the SVG ring hit-areas and the list rows fire
   onSelect(n) when tapped. Hovering either highlights both.

   Migrated from the_kingdom.jsx line ~7092. Tailwind classes converted to
   inline styles. Custom CSS classes preserved (ink-bg, ornament, sc,
   sc-bold, display-strong, body-lede, display, body, ring-hit).

   Geometry — King at center (radius 36px), 8 data rings radiating outward
   with equal spacing, max radius 250px. Outermost rings are the largest
   hit areas; inner rings stack on top so the King ring (ring 1) is always
   tappable at the center.

   Props:
     onSelect(n)     — invoked when any ring or list row is tapped (n = 1..9)
     openedCircles   — array of n values for already-walked circles (for the
                       gold dot above the ring + the dot in the list row)
   ============================================================================= */

import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { CIRCLES, RING_COLORS } from '@data';

export default function Circles({ onSelect, openedCircles = [] }) {
  const [hovered, setHovered] = useState(null);

  // Geometry — King at center, 8 data rings radiating outward
  const size = 560;
  const labelMargin = 40; // extra bottom space for the hover label
  const cx = size / 2;
  const cy = size / 2;
  const kingR = 36;
  const maxR = 250;
  const step = (maxR - kingR) / 8;

  // rings[0] = King (center), rings[1..8] = data rings
  const rings = CIRCLES.map((c, i) => {
    if (i === 0) return { ...c, r: kingR, prevR: 0 };
    const r = kingR + i * step;
    const prevR = kingR + (i - 1) * step;
    return { ...c, r, prevR };
  });

  const dataRings = rings.slice(1);
  const isOpened = (n) => openedCircles.includes(n);

  return (
    <section
      id="circles"
      className="ink-bg"
      style={{
        position: 'relative',
        paddingTop: 'clamp(6rem, 10vw, 9rem)',
        paddingBottom: 'clamp(6rem, 10vw, 9rem)',
        color: 'var(--paper)',
        overflow: 'hidden',
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
          style={{
            marginBottom: '2.5rem',
            maxWidth: '24rem',
            margin: '0 auto 2.5rem',
            color: 'var(--gold-2)',
          }}
        >
          <span className="sc" style={{ color: 'var(--gold-2)' }}>
            The Nine Circles of Evidence
          </span>
        </div>
        <h2
          className="display-strong"
          style={{
            textAlign: 'center',
            fontSize: 'clamp(2.1rem, 5.2vw, 3.8rem)',
            lineHeight: 1.04,
            marginBottom: '1rem',
            color: 'var(--paper)',
            fontWeight: 600,
          }}
        >
          The evidence is not random.
        </h2>
        <p
          className="body-lede"
          style={{
            textAlign: 'center',
            maxWidth: '36rem',
            margin: '0 auto 3.5rem',
            fontSize: 'clamp(1.12rem, 2vw, 1.22rem)',
            lineHeight: 1.6,
            color: 'rgba(246,239,222,0.78)',
          }}
        >
          Every element of the kingdom leaves its own kind of evidence. Begin at the center — the
          King himself — and radiate outward.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 22rem), 1fr))',
            gap: '2.5rem',
            alignItems: 'flex-start',
          }}
        >
          {/* SVG visualization */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <svg
              width={size}
              height={size + labelMargin}
              viewBox={`0 0 ${size} ${size + labelMargin}`}
              style={{ maxWidth: '100%', height: 'auto' }}
            >
              <defs>
                <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#F4D98C" stopOpacity="1" />
                  <stop offset="60%" stopColor="#B5883F" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#B5883F" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Ambient glow */}
              <circle cx={cx} cy={cy} r={maxR + 40} fill="url(#coreGlow)" opacity="0.5" />

              {/* Data rings (2-9) — outermost first so inner hit areas sit on top */}
              {dataRings.slice().reverse().map((c) => {
                const isHovered = hovered === c.n;
                const opened = isOpened(c.n);
                return (
                  <g
                    key={c.n}
                    className="ring-hit"
                    onMouseEnter={() => setHovered(c.n)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => onSelect && onSelect(c.n)}
                  >
                    <circle
                      cx={cx}
                      cy={cy}
                      r={c.r}
                      fill="none"
                      stroke={RING_COLORS[c.n - 1]}
                      strokeWidth={isHovered ? 2.8 : opened ? 2 : 1.4}
                      opacity={isHovered ? 1 : opened ? 0.95 : 0.78}
                      style={{ transition: 'stroke-width 0.3s ease, opacity 0.3s ease' }}
                    />
                    {/* Invisible hit band — wider for touch ergonomics */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={(c.r + c.prevR) / 2}
                      fill="transparent"
                      stroke="transparent"
                      strokeWidth={Math.max(c.r - c.prevR, 38)}
                      pointerEvents="stroke"
                    />
                    {/* Gold dot above opened rings */}
                    {opened && (
                      <circle
                        cx={cx}
                        cy={cy - c.r}
                        r="3"
                        fill="#F4D98C"
                        opacity={isHovered ? 1 : 0.85}
                        pointerEvents="none"
                      />
                    )}
                  </g>
                );
              })}

              {/* Center — the King */}
              <circle
                cx={cx}
                cy={cy}
                r={kingR}
                fill="#6B1E1E"
                stroke="#F4D98C"
                strokeWidth={hovered === 1 ? 2 : 1.4}
                className="ring-hit"
                onClick={() => onSelect && onSelect(1)}
                onMouseEnter={() => setHovered(1)}
                onMouseLeave={() => setHovered(null)}
                style={{ transition: 'stroke-width 0.3s ease' }}
              />
              <text
                x={cx}
                y={cy + 5}
                textAnchor="middle"
                fill="#F4D98C"
                fontSize="13"
                fontFamily="Cormorant SC, serif"
                letterSpacing="3"
                style={{ pointerEvents: 'none' }}
              >
                I
              </text>
              {isOpened(1) && (
                <circle
                  cx={cx}
                  cy={cy - kingR - 6}
                  r="3"
                  fill="#F4D98C"
                  opacity="0.9"
                  pointerEvents="none"
                />
              )}

              {/* Hovered label */}
              {hovered &&
                (() => {
                  const c = rings.find((r) => r.n === hovered);
                  if (!c) return null;
                  return (
                    <g pointerEvents="none">
                      <text
                        x={cx}
                        y={size + labelMargin - 14}
                        textAnchor="middle"
                        fill="#F4D98C"
                        fontSize="11"
                        fontFamily="Cormorant SC, serif"
                        letterSpacing="3"
                      >
                        CIRCLE {c.n} — {c.title.toUpperCase()}
                      </text>
                    </g>
                  );
                })()}
            </svg>
          </div>

          {/* List of 9 circles */}
          <div>
            {CIRCLES.map((c) => {
              const opened = isOpened(c.n);
              return (
                <button
                  key={c.n}
                  onClick={() => onSelect && onSelect(c.n)}
                  onMouseEnter={() => setHovered(c.n)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: '1.5rem',
                    padding: '1rem 0',
                    borderBottom: '1px solid rgba(246,239,222,0.14)',
                    background: 'transparent',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    color: 'var(--paper)',
                    transition: 'border-color 0.3s ease',
                  }}
                >
                  <span
                    className="sc"
                    style={{
                      fontSize: 10,
                      width: 56,
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      color: 'var(--gold-2)',
                    }}
                  >
                    <span>{String(c.n).padStart(2, '0')}</span>
                    {opened && (
                      <span
                        aria-label="walked"
                        style={{
                          display: 'inline-block',
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          background: 'var(--gold-2)',
                        }}
                      />
                    )}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div
                      className="display"
                      style={{
                        fontSize: 'clamp(1.5rem, 2.4vw, 1.8rem)',
                        fontWeight: 300,
                        lineHeight: 1.15,
                        color: 'var(--paper)',
                      }}
                    >
                      {c.title}
                    </div>
                    <div
                      className="body"
                      style={{
                        fontStyle: 'italic',
                        fontSize: 'clamp(0.95rem, 1.5vw, 1rem)',
                        marginTop: '0.25rem',
                        color: 'rgba(246,239,222,0.7)',
                      }}
                    >
                      {c.subtitle}
                    </div>
                  </div>
                  <ArrowUpRight
                    size={16}
                    style={{ opacity: 0.4, color: 'var(--gold-2)' }}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Progress indicator */}
        {openedCircles.length > 0 && (
          <div
            style={{
              marginTop: '3.5rem',
              paddingTop: '2.5rem',
              borderTop: '1px solid rgba(246,239,222,0.14)',
              maxWidth: '48rem',
              margin: '3.5rem auto 0',
            }}
          >
            <p
              className="sc"
              style={{
                fontSize: 10,
                marginBottom: '0.5rem',
                textAlign: 'center',
                color: 'var(--gold-2)',
              }}
            >
              {openedCircles.length === 9
                ? 'The full trail walked'
                : `${openedCircles.length} of 9 circles walked`}
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.375rem' }}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                <span
                  key={n}
                  style={{
                    display: 'inline-block',
                    width: 32,
                    height: 2,
                    background: openedCircles.includes(n)
                      ? 'var(--gold-2)'
                      : 'rgba(246,239,222,0.18)',
                  }}
                />
              ))}
            </div>
            {openedCircles.length === 9 && (
              <p
                className="display"
                style={{
                  fontStyle: 'italic',
                  textAlign: 'center',
                  fontSize: 'clamp(1.3rem, 2.4vw, 1.5rem)',
                  marginTop: '1.5rem',
                  color: 'var(--gold-2)',
                }}
              >
                You have seen what this course can show you. Now go to the gate.
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
