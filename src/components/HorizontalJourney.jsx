/* =============================================================================
   src/components/HorizontalJourney.jsx — Desktop SVG visualization.

   The pilgrim's path through the 7 weeks, drawn as a smooth Bezier curve
   from the bottom-left (Step 1) to the top-right (Pentecost / Day 50).
   Each week is a clickable medallion positioned along the path; the path
   itself dips at Step 3 (the dark night) and climbs through Steps 5-7
   toward the Pentecost terminus.

   Three "stage bands" mark the classical spiritual progression:
   Via Purgativa (Steps 1-3), Via Illuminativa (Step 4), Via Unitiva (Steps 5-7).

   The path is drawn with the `path-draw` CSS animation (2.5s on mount).

   Migrated from the_kingdom.jsx line ~6223.

   Hidden on mobile (originally via `hidden md:block`); the SevenStepsList
   serves as the mobile navigation. Here we keep the same visibility model
   via a media-query inline style (`display: 'none'` baseline, but rely on
   the parent component to show it only on wider viewports — see CourseJourney's
   composition, which renders this AND SevenStepsList together).

   Props:
     onSelectStep(n) — invoked when a medallion is tapped, with week n (1-7)
     progress        — { "w{week}-d{day}": true } map of completed days
     currentWeekN    — 1..7 of the user's current week, or null
   ============================================================================= */

import { useState } from 'react';
import { Check, Flame } from 'lucide-react';
import { SEVEN_WEEKS, STEP_COLORS, STEP_GLOWS } from '@data';
import { toRoman } from '@shared/utils';
import {
  STEP_ICONS,
  VBW,
  VBH,
  NODES,
  PENTECOST,
  smoothPath,
} from './_courseGeometry.js';

export default function HorizontalJourney({ onSelectStep, progress = {}, currentWeekN = null }) {
  const [hovered, setHovered] = useState(null);
  const fullPath = smoothPath([...NODES, PENTECOST]);

  const completedSteps = SEVEN_WEEKS.filter((w) => {
    let n = 0;
    for (let d = 1; d <= 7; d++) if (progress[`w${w.n}-d${d}`]) n++;
    return n === 7;
  }).map((w) => w.n);

  return (
    <div
      // Hidden on narrow viewports (<= 768px); SevenStepsList covers mobile.
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '64rem',
        margin: '0 auto',
        aspectRatio: `${VBW}/${VBH}`,
      }}
      className="course-journey-svg-wrapper"
    >
      <svg
        viewBox={`0 0 ${VBW} ${VBH}`}
        preserveAspectRatio="xMidYMid meet"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="pathGrad" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#9A4423" stopOpacity="0.7" />
            <stop offset="33%" stopColor="#8C2A2A" stopOpacity="0.7" />
            <stop offset="55%" stopColor="#5C7A3A" stopOpacity="0.7" />
            <stop offset="80%" stopColor="#7A5230" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#D7B169" stopOpacity="1" />
          </linearGradient>
          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Three subtle ground bands — Purgativa / Illuminativa / Unitiva */}
        {[
          { x1: 60, x2: 470, label: 'Via Purgativa', sub: 'Inward — the stripping' },
          { x1: 470, x2: 630, label: 'Via Illuminativa', sub: 'Light at the center' },
          { x1: 630, x2: 1080, label: 'Via Unitiva', sub: 'Outward — the saint is sent' },
        ].map((band, i) => (
          <g key={i}>
            <line
              x1={band.x1}
              y1="320"
              x2={band.x2}
              y2="320"
              stroke="rgba(215,177,105,0.25)"
              strokeWidth="0.8"
              strokeDasharray="3 4"
            />
            <text
              x={(band.x1 + band.x2) / 2}
              y="342"
              textAnchor="middle"
              fill="#D7B169"
              fontSize="10"
              fontFamily="Cormorant SC, serif"
              letterSpacing="3"
              fontWeight="600"
            >
              {band.label.toUpperCase()}
            </text>
            <text
              x={(band.x1 + band.x2) / 2}
              y="358"
              textAnchor="middle"
              fill="rgba(246,239,222,0.5)"
              fontSize="11"
              fontFamily="EB Garamond, serif"
              fontStyle="italic"
            >
              {band.sub}
            </text>
          </g>
        ))}

        {/* Path glow underlay */}
        <path
          d={fullPath}
          stroke="url(#pathGrad)"
          strokeWidth="6"
          fill="none"
          opacity="0.18"
          filter="url(#softGlow)"
        />
        {/* Main path — dashed gold pilgrim's road */}
        <path
          d={fullPath}
          stroke="url(#pathGrad)"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
          strokeDasharray="3 6"
          className="path-draw"
        />

        {/* Pentecost terminus */}
        <g>
          <circle
            cx={PENTECOST.x}
            cy={PENTECOST.y}
            r="22"
            fill="rgba(215,177,105,0.10)"
            stroke="#D7B169"
            strokeWidth="1"
          />
          <circle
            cx={PENTECOST.x}
            cy={PENTECOST.y}
            r="14"
            fill="#6B1E1E"
            stroke="#D7B169"
            strokeWidth="1.2"
          />
          <path
            d={`M ${PENTECOST.x} ${PENTECOST.y - 6} q -4 4 -2 8 q 2 4 0 6 q 4 -2 4 -6 q 0 -4 -2 -8 z`}
            fill="#F4D98C"
            opacity="0.95"
          />
          {[0, 60, 120, 180, 240, 300].map((angle) => {
            const rad = (angle * Math.PI) / 180;
            const x1 = PENTECOST.x + Math.cos(rad) * 26;
            const y1 = PENTECOST.y + Math.sin(rad) * 26;
            const x2 = PENTECOST.x + Math.cos(rad) * 32;
            const y2 = PENTECOST.y + Math.sin(rad) * 32;
            return (
              <line
                key={angle}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#D7B169"
                strokeWidth="1"
                opacity="0.6"
              />
            );
          })}
          <text
            x={PENTECOST.x}
            y={PENTECOST.y + 50}
            textAnchor="middle"
            fill="#D7B169"
            fontSize="10"
            fontFamily="Cormorant SC, serif"
            letterSpacing="2.5"
            fontWeight="600"
          >
            DAY 50 · PENTECOST
          </text>
          <text
            x={PENTECOST.x}
            y={PENTECOST.y + 65}
            textAnchor="middle"
            fill="rgba(246,239,222,0.55)"
            fontSize="10"
            fontFamily="EB Garamond, serif"
            fontStyle="italic"
          >
            The Sending
          </text>
        </g>
      </svg>

      {/* HTML medallion buttons positioned by % over the SVG */}
      {SEVEN_WEEKS.map((w, i) => {
        const node = NODES[i];
        const xPct = (node.x / VBW) * 100;
        const yPct = (node.y / VBH) * 100;
        const Icon = STEP_ICONS[w.n];
        const color = STEP_COLORS[w.n];
        const glow = STEP_GLOWS[w.n];
        const isComplete = completedSteps.includes(w.n);
        const isCurrent = currentWeekN === w.n;
        const isHovered = hovered === w.n;

        return (
          <button
            key={w.n}
            onClick={() => onSelectStep && onSelectStep(w.n)}
            onMouseEnter={() => setHovered(w.n)}
            onMouseLeave={() => setHovered(null)}
            onFocus={() => setHovered(w.n)}
            onBlur={() => setHovered(null)}
            style={{
              position: 'absolute',
              left: `${xPct}%`,
              top: `${yPct}%`,
              transform: 'translate(-50%, -50%)',
              background: 'transparent',
              border: 0,
              padding: 0,
              cursor: 'pointer',
              fontFamily: 'inherit',
              '--step-color': color,
              '--step-glow': glow,
            }}
            aria-label={`Step ${w.n} — ${w.verb} — ${w.humanTitle}`}
          >
            <div
              className="journey-medallion"
              style={{
                background: color,
                borderColor: isCurrent ? '#D7B169' : color,
                boxShadow: isCurrent
                  ? `0 0 38px ${glow}, 0 0 0 3px rgba(215,177,105,0.35), inset 0 1px 0 rgba(255,255,255,0.2)`
                  : undefined,
              }}
            >
              <span
                className="display"
                style={{ fontSize: '1.35rem', fontWeight: 300, color: '#F6EFDE' }}
              >
                {toRoman(w.n)}
              </span>
              {isComplete && (
                <div
                  style={{
                    position: 'absolute',
                    top: -4,
                    right: -4,
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'var(--gold-2)',
                    color: 'var(--ink)',
                    border: '1.5px solid var(--ink)',
                  }}
                >
                  <Check size={10} strokeWidth={3} />
                </div>
              )}
              {w.ignition && (
                <div
                  style={{
                    position: 'absolute',
                    top: -4,
                    left: -4,
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'var(--wine)',
                    border: '1.5px solid var(--paper)',
                  }}
                >
                  <Flame size={10} color="#F4D98C" />
                </div>
              )}
            </div>

            {/* Verb label below medallion (always visible) */}
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '100%',
                transform: 'translateX(-50%)',
                marginTop: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                whiteSpace: 'nowrap',
              }}
            >
              <Icon size={10} style={{ color, opacity: 0.85 }} />
              <span
                className="sc-bold"
                style={{ fontSize: 9, color: 'rgba(246,239,222,0.85)' }}
              >
                {w.verb}
              </span>
            </div>

            {/* Hover tooltip */}
            {isHovered && (
              <div className="journey-tooltip" style={{ '--step-color': color }}>
                <div className="sc-bold" style={{ fontSize: 9, marginBottom: '0.25rem', color }}>
                  Step {w.n} · {w.verb}
                </div>
                <div
                  className="display"
                  style={{ fontSize: '1.05rem', lineHeight: 1.15, color: 'var(--paper)' }}
                >
                  {w.humanTitle}
                </div>
                {w.patron && (
                  <div
                    className="body"
                    style={{
                      fontStyle: 'italic',
                      fontSize: '0.78rem',
                      marginTop: '0.25rem',
                      color: 'rgba(246,239,222,0.65)',
                    }}
                  >
                    {w.patron}
                  </div>
                )}
                <div
                  className="body"
                  style={{
                    fontStyle: 'italic',
                    fontSize: '0.78rem',
                    marginTop: '0.375rem',
                    color: 'rgba(246,239,222,0.5)',
                  }}
                >
                  {w.question}
                </div>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
