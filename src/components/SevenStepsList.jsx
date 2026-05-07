/* =============================================================================
   src/components/SevenStepsList.jsx — Vertical list of the 7 weeks.

   The mobile-primary navigation for the Course tab. Each week is a card
   showing: medallion with Roman numeral, step number + verb + patron,
   completion count, human title, bullet, and central question.

   Stage dividers ("Via Purgativa", "Via Illuminativa", "Via Unitiva") are
   inserted at weeks 1, 4, and 5 to mark the three classical stages of
   spiritual progress.

   Migrated from the_kingdom.jsx line ~6463. Tailwind classes converted
   to inline styles per project convention. Custom CSS classes (step-card,
   step-medallion, step-ghost, step-arrow, stage-divider) preserved.

   Props:
     onEnterWeek(n) — invoked when a step card is tapped, with week n (1-7)
     progress       — { "w{week}-d{day}": true } map of completed days
   ============================================================================= */

import { ArrowUpRight, Check, Flame } from 'lucide-react';
import {
  SEVEN_WEEKS,
  STEP_COLORS,
  STEP_TINTS,
  STEP_GLOWS,
} from '@data';
import { toRoman } from '@shared/utils';
import { STEP_ICONS } from './_courseGeometry.js';

const STAGE_BREAKS = {
  1: { label: 'Via Purgativa',    subLabel: 'Inward — the stripping' },
  4: { label: 'Via Illuminativa', subLabel: 'Light at the center' },
  5: { label: 'Via Unitiva',      subLabel: 'Outward — the saint is sent' },
};

export default function SevenStepsList({ onEnterWeek, progress = {} }) {
  return (
    <div style={{ marginTop: 'clamp(4rem, 6vw, 5rem)' }}>
      {SEVEN_WEEKS.map((w) => {
        const Icon = STEP_ICONS[w.n];
        const color = STEP_COLORS[w.n];
        const tint = STEP_TINTS[w.n];
        const glow = STEP_GLOWS[w.n];
        let completed = 0;
        for (let d = 1; d <= 7; d++) if (progress[`w${w.n}-d${d}`]) completed++;

        return (
          <div key={w.n} style={{ marginBottom: 'clamp(1.25rem, 2vw, 1.5rem)' }}>
            {STAGE_BREAKS[w.n] && (
              <div className="stage-divider">
                <div className="line" />
                <div className="label">
                  <div className="sc-bold" style={{ fontSize: 10, color: 'var(--gold-2)' }}>
                    {STAGE_BREAKS[w.n].label}
                  </div>
                  <div
                    className="body"
                    style={{
                      fontStyle: 'italic',
                      fontSize: '0.92rem',
                      marginTop: '0.25rem',
                      color: 'rgba(246,239,222,0.55)',
                    }}
                  >
                    {STAGE_BREAKS[w.n].subLabel}
                  </div>
                </div>
                <div className="line" />
              </div>
            )}

            <button
              onClick={() => onEnterWeek && onEnterWeek(w.n)}
              className="step-card dark"
              style={{
                width: '100%',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                padding: 'clamp(1.25rem, 2vw, 1.5rem)',
                gap: 'clamp(1.25rem, 2vw, 1.75rem)',
                cursor: 'pointer',
                color: 'var(--paper)',
                fontFamily: 'inherit',
                '--step-color': color,
                '--step-tint': tint,
                '--step-glow': glow,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  width: 4,
                  left: 0,
                  background: color,
                }}
              />

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(1.25rem, 2vw, 1.75rem)' }}>
                <div
                  style={{
                    position: 'relative',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: 76,
                    minHeight: 76,
                  }}
                >
                  <span
                    className="step-ghost"
                    style={{
                      position: 'absolute',
                      left: 0,
                      transform: 'translateX(-0.5rem)',
                      '--step-color': color,
                    }}
                  >
                    {w.n}
                  </span>
                  <div
                    className="step-medallion"
                    style={{
                      position: 'relative',
                      zIndex: 10,
                      '--step-color': color,
                      '--step-glow': glow,
                    }}
                  >
                    <span
                      className="display"
                      style={{
                        fontSize: 'clamp(1.5rem, 2.4vw, 1.8rem)',
                        fontWeight: 300,
                        color: '#F6EFDE',
                      }}
                    >
                      {toRoman(w.n)}
                    </span>
                    {w.ignition && (
                      <div
                        style={{
                          position: 'absolute',
                          top: -4,
                          right: -4,
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'var(--wine)',
                          border: '2px solid var(--paper)',
                        }}
                      >
                        <Flame size={11} color="#F4D98C" />
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      flexWrap: 'wrap',
                      marginBottom: '0.5rem',
                    }}
                  >
                    <span className="sc-bold" style={{ fontSize: 11, color }}>Step {w.n}</span>
                    <span style={{ color: 'var(--mute)', opacity: 0.5 }}>·</span>
                    <Icon size={12} style={{ color }} />
                    <span className="sc-bold" style={{ fontSize: 11, color }}>{w.verb}</span>
                    {w.patron && (
                      <>
                        <span style={{ color: 'var(--mute)', opacity: 0.5 }}>·</span>
                        <span
                          className="body"
                          style={{
                            fontStyle: 'italic',
                            fontSize: '0.88rem',
                            color: 'rgba(246,239,222,0.6)',
                          }}
                        >
                          {w.patron}
                        </span>
                      </>
                    )}
                    {completed > 0 && (
                      <>
                        <span style={{ color: 'var(--mute)', opacity: 0.5 }}>·</span>
                        <span
                          className="sc"
                          style={{
                            fontSize: 9,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            color,
                          }}
                        >
                          <Check size={10} /> {completed}/7
                        </span>
                      </>
                    )}
                  </div>

                  <h3
                    className="display-strong"
                    style={{
                      fontSize: 'clamp(1.6rem, 2.6vw, 2rem)',
                      lineHeight: 1.15,
                      marginBottom: '0.5rem',
                      fontWeight: 600,
                      color: 'var(--paper)',
                    }}
                  >
                    {w.humanTitle}
                  </h3>
                  <div
                    style={{
                      height: 1,
                      marginTop: '0.25rem',
                      marginBottom: '0.75rem',
                      maxWidth: '3rem',
                      background: color,
                    }}
                  />
                  <p
                    className="body"
                    style={{
                      fontSize: 'clamp(1rem, 1.5vw, 1.06rem)',
                      lineHeight: 1.6,
                      marginBottom: '0.5rem',
                      color: 'rgba(246,239,222,0.82)',
                    }}
                  >
                    {w.bullet}
                  </p>
                  <p
                    className="body"
                    style={{
                      fontStyle: 'italic',
                      fontSize: '0.92rem',
                      color: 'rgba(246,239,222,0.5)',
                    }}
                  >
                    {w.question}
                  </p>
                </div>

                <ArrowUpRight
                  size={22}
                  className="step-arrow"
                  style={{ flexShrink: 0, alignSelf: 'flex-start', marginTop: '0.25rem', color }}
                />
              </div>
            </button>
          </div>
        );
      })}
    </div>
  );
}
