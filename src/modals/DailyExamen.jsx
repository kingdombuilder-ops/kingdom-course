/* =============================================================================
   src/modals/DailyExamen.jsx — HEAL · The Ignatian five-movement prayer.

   Ten minutes that return the day to God — and return the user to themselves
   before him. St. Ignatius of Loyola called this the most important thing in
   life: "If only one of the spiritual exercises were possible, it would be
   this one."

   Migrated from the_kingdom.jsx line ~12735. Three things move with the
   modal because nothing else uses them:
     - EXAMEN_MOVEMENTS data (line ~12652)
     - GLORY_BE_TEXT (line ~12692)
     - ExamenTimer helper (line ~12694)

   Phase machine (three phases, simpler than TheRosary):
     intro    — frame, Ignatius quote, Begin
     movement — one of the five Ignatian movements; each has its own:
                - color, tint, glow (visual treatment)
                - icon, Roman numeral badge
                - scripture verse + reference
                - practice type: gratitude-three | breath | journal | single-resolve
                - suggested duration (used by ExamenTimer)
     closing  — Glory Be + Amen + (optional) save-preference toggle

   The five movements:
     I.   Gratitude — three small gifts of the day (gratitude-three input)
     II.  Petition  — ask the Spirit for light (breath visualization)
     III. Review    — walk through the day with God (journal)
     IV.  Sorrow    — name what fell short (journal)
     V.   Resolve   — commit one act for tomorrow (single-resolve journal)

   One thing to know about the closing: there's a "Let it go / Save to journal"
   toggle that updates `savePreference` state, but no code currently *reads*
   that state — both buttons effectively behave identically (the Amen button
   just fires onComplete). This is intentional pre-wired UX. When the
   Supabase journal lands, this is where the persistence branch will hang.
   Until then: the privacy claim "Nothing is saved unless you choose to
   save at the end" is technically true in a vacuous sense, because no save
   action exists yet.

   Props:
     onComplete()  — caller marks essential III (HEAL) complete and closes
     onClose()     — caller closes without marking complete
   ============================================================================= */

import { useState, useEffect, useRef } from 'react';
import {
  X, ArrowRight, ArrowLeft, Check, Sun, Hand, Eye, Cross, Sparkles, Wind,
  Clock, Play, Pause, RotateCcw,
} from 'lucide-react';

// ---- GLORY_BE_TEXT --------------------------------------------------------
const GLORY_BE_TEXT =
  'Glory be to the Father, and to the Son, and to the Holy Spirit. ' +
  'As it was in the beginning, is now, and ever shall be, world without end.';

// ---- EXAMEN_MOVEMENTS -----------------------------------------------------
// The five Ignatian movements. Each one carries everything needed to render
// it: visual treatment (color/tint/glow/icon), text content (invitation,
// body, scripture, scriptureRef), and practice configuration (practiceType,
// practiceLabel, suggestedSeconds, optional placeholder).
//
// practiceType is one of:
//   gratitude-three  — three text inputs labeled I/II/III
//   breath           — animated breath circle, no input
//   journal          — multi-line textarea (5 rows)
//   single-resolve   — multi-line textarea, smaller (3 rows)
const EXAMEN_MOVEMENTS = [
  {
    n: 1,
    name: 'Gratitude',
    color: '#D7B169',
    tint: 'rgba(215,177,105,0.12)',
    glow: 'rgba(215,177,105,0.45)',
    icon: Sun,
    suggestedSeconds: 120,
    invitation: 'Recall the gifts of the day.',
    body:
      'Before anything else, before the failures and the sorrows — gifts. The day was given to ' +
      'you. Name three. Specifically. Not abstractions. The cup of coffee. The kind word. The small ' +
      'mercy you nearly missed.',
    scripture: 'Every good and perfect gift is from above, coming down from the Father of lights.',
    scriptureRef: 'James 1:17',
    practiceType: 'gratitude-three',
    practiceLabel: 'Three gifts from this day',
  },
  {
    n: 2,
    name: 'Petition',
    color: '#6B1E1E',
    tint: 'rgba(107,30,30,0.12)',
    glow: 'rgba(107,30,30,0.45)',
    icon: Hand,
    suggestedSeconds: 60,
    invitation: 'Ask the Spirit for light.',
    body:
      "Now ask. Without the Spirit's help, your review will be only memory — not vision. Ask for " +
      'light to see this day as God saw it. Ask for honesty about yourself. Ask for love that does ' +
      'not flinch.',
    scripture: 'Send forth your light and your truth; let them guide me.',
    scriptureRef: 'Psalm 43:3',
    practiceType: 'breath',
    practiceLabel: 'Breathe in light · Breathe out fog',
  },
  {
    n: 3,
    name: 'Review',
    color: '#B5883F',
    tint: 'rgba(181,136,63,0.12)',
    glow: 'rgba(181,136,63,0.45)',
    icon: Eye,
    suggestedSeconds: 240,
    invitation: 'Walk through the day with God.',
    body:
      "Replay the day. Wake up — get out of bed — the morning's first encounter — and so on, hour " +
      'by hour, until now. Where was God present? In what moment did you feel most alive? Where did ' +
      "consolation rise? Where desolation? Don't analyze yet. Just notice.",
    scripture:
      'I have set the Lord always before me; because he is at my right hand, I shall not be shaken.',
    scriptureRef: 'Psalm 16:8',
    practiceType: 'journal',
    practiceLabel: 'What did you see as you walked through the day?',
    placeholder: 'I noticed...\n\nThe moment I felt most alive was...\n\nWhere I felt resistance was...',
  },
  {
    n: 4,
    name: 'Sorrow',
    color: '#8A6828',
    tint: 'rgba(138,104,40,0.12)',
    glow: 'rgba(138,104,40,0.45)',
    icon: Cross,
    suggestedSeconds: 120,
    invitation: 'Name what fell short.',
    body:
      "Where did you fail today — in love, in patience, in attention, in courage? Don't catalog " +
      'every fault. Name what stands out. What asks for forgiveness. Then receive it. The Father is ' +
      'not waiting to condemn. He is waiting to embrace.',
    scripture: 'Search me, O God, and know my heart; test me and know my anxious thoughts.',
    scriptureRef: 'Psalm 139:23',
    practiceType: 'journal',
    practiceLabel: 'What asks for forgiveness?',
    placeholder: 'Forgive me for...\n\nI fell short when...',
  },
  {
    n: 5,
    name: 'Resolve',
    color: '#5C7A3A',
    tint: 'rgba(92,122,58,0.12)',
    glow: 'rgba(92,122,58,0.45)',
    icon: Sparkles,
    suggestedSeconds: 90,
    invitation: 'Commit one act for tomorrow.',
    body:
      "Don't make a list of resolutions you can't keep. One act. One practice. One person to call. " +
      "One small turning toward Christ that tomorrow will ask of you. Name it specifically — write " +
      "it where you'll see it again.",
    scripture: 'Lord, what would you have me do?',
    scriptureRef: 'Acts 9:6',
    practiceType: 'single-resolve',
    practiceLabel: 'Tomorrow, one thing:',
    placeholder: 'Tomorrow I will...',
  },
];

// ---- ExamenTimer ----------------------------------------------------------
// Local helper: a play/pause/reset countdown, themed by the movement's color.
// Identical in structure to ContemplatioTimer in LectioDivina, but with
// different color/layout treatment. Could be unified later via a shared
// helper if a third caller appears; for now both stay local to their modals.
function ExamenTimer({ seconds, color }) {
  const [remaining, setRemaining] = useState(seconds);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    setRemaining(seconds);
    setRunning(false);
  }, [seconds]);

  useEffect(() => {
    if (running && remaining > 0) {
      intervalRef.current = setInterval(() => {
        setRemaining((r) => {
          if (r <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            return 0;
          }
          return r - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, remaining]);

  const reset = () => {
    setRemaining(seconds);
    setRunning(false);
  };

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const pct = ((seconds - remaining) / seconds) * 100;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Clock size={12} style={{ color }} />
        <span
          className="sc-bold"
          style={{
            fontSize: 11, color, minWidth: '3rem',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {mins}:{secs.toString().padStart(2, '0')}
        </span>
      </div>
      <div style={{ width: 96, height: 3, overflow: 'hidden', background: 'rgba(246,239,222,0.1)' }}>
        <div style={{ height: '100%', transition: 'width 1s linear', width: `${pct}%`, background: color }} />
      </div>
      <button
        onClick={() => setRunning(!running)}
        style={{
          width: 32, height: 32, borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: `1px solid ${color}`,
          background: running ? color : 'transparent',
          color: running ? 'var(--ink)' : color,
          cursor: 'pointer',
        }}
        aria-label={running ? 'Pause' : 'Start'}
      >
        {running ? <Pause size={11} /> : <Play size={11} style={{ marginLeft: 1 }} />}
      </button>
      <button
        onClick={reset}
        style={{
          width: 32, height: 32, borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'rgba(246,239,222,0.4)',
          background: 'transparent', border: 0, cursor: 'pointer',
        }}
        aria-label="Reset"
      >
        <RotateCcw size={11} />
      </button>
    </div>
  );
}

// ---- DailyExamen (default export) ----------------------------------------
export default function DailyExamen({ onComplete, onClose }) {
  const [phase, setPhase] = useState('intro');                // intro | movement | closing
  const [mIndex, setMIndex] = useState(0);                    // 0..4 within movement phase
  const [gratitude, setGratitude] = useState(['', '', '']);   // I/II/III gifts on movement 1
  const [journals, setJournals] = useState({ review: '', sorrow: '', resolve: '' });
  // savePreference is wired to the closing toggle but is currently unread —
  // the persistence branch lands when the journal backend ships. See the
  // file header comment for context.
  const [savePreference, setSavePreference] = useState('ephemeral');

  const movement = EXAMEN_MOVEMENTS[mIndex];

  const beginExamen = () => {
    setPhase('movement');
    setMIndex(0);
  };

  const nextMovement = () => {
    if (mIndex < EXAMEN_MOVEMENTS.length - 1) {
      setMIndex(mIndex + 1);
    } else {
      setPhase('closing');
    }
  };

  const prevMovement = () => {
    if (phase === 'closing') {
      setPhase('movement');
      setMIndex(EXAMEN_MOVEMENTS.length - 1);
    } else if (mIndex > 0) {
      setMIndex(mIndex - 1);
    } else {
      setPhase('intro');
    }
  };

  // Single journal field switches between review/sorrow/resolve buckets
  // by movement number. Gratitude has its own three-input shape.
  const handleJournalChange = (val) => {
    if (movement.n === 3) setJournals({ ...journals, review: val });
    else if (movement.n === 4) setJournals({ ...journals, sorrow: val });
    else if (movement.n === 5) setJournals({ ...journals, resolve: val });
  };

  const currentJournalValue = () => {
    if (movement.n === 3) return journals.review;
    if (movement.n === 4) return journals.sorrow;
    if (movement.n === 5) return journals.resolve;
    return '';
  };

  const handleGratitudeChange = (i, val) => {
    const next = [...gratitude];
    next[i] = val;
    setGratitude(next);
  };

  const handleAmen = () => {
    onComplete && onComplete();
  };

  // Whether the user has typed anything anywhere — gates the appearance of
  // the "Let it go / Save to journal" toggle on the closing screen.
  const hasContent =
    (journals.review && journals.review.trim()) ||
    (journals.sorrow && journals.sorrow.trim()) ||
    (journals.resolve && journals.resolve.trim()) ||
    gratitude.some((v) => v && v.trim());

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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
            <svg width="22" height="22" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="18" fill="none" stroke="var(--gold-2)" strokeWidth="1" />
              <circle cx="20" cy="20" r="12" fill="none" stroke="var(--gold-2)" strokeWidth="1" />
              <circle cx="20" cy="20" r="6"  fill="none" stroke="var(--gold-2)" strokeWidth="1" />
              <circle cx="20" cy="20" r="2"  fill="var(--wine)" />
            </svg>
            <div>
              <div className="sc-bold" style={{ fontSize: 10, color: 'var(--paper)' }}>Daily Examen</div>
              <div className="body" style={{ fontStyle: 'italic', fontSize: '0.78rem', color: 'rgba(246,239,222,0.55)' }}>
                Pray Now · 10 min
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

        {/* Six progress dots — five movements + one for the Glory Be (closing) */}
        {phase !== 'intro' && (
          <div
            style={{
              maxWidth: '48rem', margin: '0 auto', padding: '0 1.5rem 0.75rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem',
            }}
          >
            {[...EXAMEN_MOVEMENTS, { n: 6, name: 'Glory Be', color: '#D7B169' }].map((m, i) => {
              const isActive =
                (phase === 'movement' && i === mIndex) ||
                (phase === 'closing' && i === 5);
              const isComplete = i < mIndex || (phase === 'closing' && i < 5);
              return (
                <div
                  key={i}
                  style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: isActive || isComplete ? m.color : 'rgba(246,239,222,0.2)',
                  }}
                />
              );
            })}
          </div>
        )}
      </header>

      <main style={{ maxWidth: '48rem', margin: '0 auto', padding: '3rem 1.5rem', position: 'relative' }}>
        {/* INTRO */}
        {phase === 'intro' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
              <div
                className="breathe"
                style={{
                  width: 80, height: 80, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(215,177,105,0.10)',
                  border: '2px solid var(--gold-2)',
                  boxShadow: '0 0 32px rgba(215,177,105,0.35)',
                }}
              >
                <Eye size={32} style={{ color: 'var(--gold-2)' }} />
              </div>
            </div>
            <div className="sc-bold" style={{ fontSize: 10, marginBottom: '0.75rem', color: 'var(--gold-2)' }}>
              Step 3 · HEAL · Ignatian
            </div>
            <h1
              className="display-strong"
              style={{
                fontSize: 'clamp(2.2rem, 5.5vw, 3.4rem)',
                lineHeight: 1.06, marginBottom: '1rem', fontWeight: 600,
              }}
            >
              The Daily Examen
            </h1>
            <div style={{ height: 1, margin: '0 auto 1.5rem', maxWidth: '5rem', background: 'var(--gold-2)' }} />
            <p
              className="body-lede"
              style={{
                fontSize: 'clamp(1.1rem, 2vw, 1.18rem)',
                lineHeight: 1.7, maxWidth: '32rem',
                margin: '0 auto 1.5rem', color: 'rgba(246,239,222,0.85)',
              }}
            >
              Ignatius's five-step end-of-day prayer. Ten minutes that return the day to God — and
              return you to yourself, before Him.
            </p>
            <p
              className="body"
              style={{
                fontStyle: 'italic',
                fontSize: '1rem', lineHeight: 1.6,
                maxWidth: '32rem', margin: '0 auto 2rem',
                color: 'rgba(246,239,222,0.6)',
              }}
            >
              Gratitude · Petition · Review · Sorrow · Resolve. Then the Glory Be.
            </p>
            <div
              style={{
                borderLeft: '2px solid var(--gold-2)',
                paddingLeft: '1rem',
                padding: '0.5rem 0 0.5rem 1rem',
                margin: '0 auto 2.5rem',
                maxWidth: '28rem', textAlign: 'left',
              }}
            >
              <p
                className="display"
                style={{
                  fontStyle: 'italic',
                  fontSize: '1.1rem', lineHeight: 1.4,
                  color: 'rgba(246,239,222,0.85)',
                }}
              >
                "The Examen is the most important thing in life. If only one of the spiritual
                exercises were possible, it would be this one."
              </p>
              <p className="sc" style={{ fontSize: 9, marginTop: '0.5rem', color: 'var(--gold-2)' }}>
                St. Ignatius of Loyola
              </p>
            </div>
            <button
              onClick={beginExamen}
              className="btn-gold sc-bold"
              style={{
                fontSize: 11, padding: '1rem 1.75rem',
                display: 'inline-flex', alignItems: 'center', gap: '0.75rem', minHeight: 48,
              }}
            >
              <Hand size={14} /> Begin the Examen <ArrowRight size={13} />
            </button>
            <p
              className="body"
              style={{
                fontStyle: 'italic',
                fontSize: '0.9rem', marginTop: '1rem',
                color: 'rgba(246,239,222,0.5)',
              }}
            >
              Find a quiet place. The day is waiting to be returned.
            </p>
          </div>
        )}

        {/* MOVEMENT — one of the five */}
        {phase === 'movement' && (() => {
          const m = movement;
          const Icon = m.icon;
          return (
            <div className="fade-in" key={m.n}>
              {/* Header: disc, movement label, invitation */}
              <div
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  textAlign: 'center', marginBottom: '2rem',
                }}
              >
                <div
                  className="movement-disc"
                  style={{
                    marginBottom: '1.25rem',
                    '--mvmt-color': m.color, '--mvmt-tint': m.tint, '--mvmt-glow': m.glow,
                  }}
                >
                  <Icon size={26} style={{ color: m.color }} />
                  <span className="movement-disc-roman" style={{ '--mvmt-color': m.color }}>
                    {['I', 'II', 'III', 'IV', 'V'][m.n - 1]}
                  </span>
                </div>
                <div className="sc-bold" style={{ fontSize: 10, marginBottom: '0.5rem', color: m.color }}>
                  Movement {m.n} of 5 · {m.name}
                </div>
                <h2
                  className="display-strong"
                  style={{
                    fontSize: 'clamp(1.85rem, 4.5vw, 2.8rem)',
                    lineHeight: 1.06, marginBottom: '0.5rem', fontWeight: 600,
                  }}
                >
                  {m.invitation}
                </h2>
              </div>

              {/* Body text */}
              <p
                className="body-lede"
                style={{
                  fontSize: 'clamp(1.06rem, 1.8vw, 1.13rem)',
                  lineHeight: 1.7, maxWidth: '42rem',
                  margin: '0 auto 2rem', textAlign: 'center',
                  color: 'rgba(246,239,222,0.82)',
                }}
              >
                {m.body}
              </p>

              {/* Scripture verse pull */}
              <div style={{ maxWidth: '32rem', margin: '0 auto 2.5rem' }}>
                <div className="verse-pull-dark" style={{ '--mvmt-color': m.color }}>
                  <p
                    className="display"
                    style={{
                      fontStyle: 'italic',
                      fontSize: 'clamp(1.15rem, 2vw, 1.25rem)',
                      lineHeight: 1.4, color: 'rgba(246,239,222,0.92)',
                    }}
                  >
                    "{m.scripture}"
                  </p>
                  <p className="sc" style={{ fontSize: 9, marginTop: '0.5rem', color: m.color }}>
                    {m.scriptureRef}
                  </p>
                </div>
              </div>

              {/* Practice — one of four shapes per practiceType */}
              <div style={{ maxWidth: '32rem', margin: '0 auto 2.5rem' }}>
                <div className="sc-bold" style={{ fontSize: 10, marginBottom: '0.75rem', color: m.color }}>
                  {m.practiceLabel}
                </div>

                {m.practiceType === 'gratitude-three' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="gratitude-input" style={{ '--mvmt-color': m.color }}>
                        <span className="gnum" style={{ '--mvmt-color': m.color }}>
                          {['I', 'II', 'III'][i]}
                        </span>
                        <input
                          type="text"
                          placeholder={[
                            'A small thing...',
                            'Something that surprised you...',
                            'A person, a moment...',
                          ][i]}
                          value={gratitude[i] || ''}
                          onChange={(e) => handleGratitudeChange(i, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {m.practiceType === 'breath' && (
                  <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
                      <div
                        className="breathe"
                        style={{
                          width: 112, height: 112, borderRadius: '50%',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: m.tint,
                          border: `2px solid ${m.color}`,
                          boxShadow: `0 0 32px ${m.glow}`,
                        }}
                      >
                        <Wind size={32} style={{ color: m.color }} />
                      </div>
                    </div>
                    <p
                      className="body"
                      style={{
                        fontStyle: 'italic',
                        fontSize: '1.05rem', lineHeight: 1.55,
                        color: 'rgba(246,239,222,0.78)',
                      }}
                    >
                      Breathe in light. Breathe out fog.
                    </p>
                    <p
                      className="body"
                      style={{
                        fontStyle: 'italic',
                        fontSize: '0.92rem', marginTop: '0.5rem',
                        color: 'rgba(246,239,222,0.55)',
                      }}
                    >
                      Five slow breaths. Then move on when ready.
                    </p>
                  </div>
                )}

                {(m.practiceType === 'journal' || m.practiceType === 'single-resolve') && (
                  <textarea
                    className="journal-field"
                    style={{ '--mvmt-color': m.color }}
                    rows={m.practiceType === 'single-resolve' ? 3 : 5}
                    placeholder={m.placeholder}
                    value={currentJournalValue()}
                    onChange={(e) => handleJournalChange(e.target.value)}
                  />
                )}

                <p
                  className="body"
                  style={{
                    fontStyle: 'italic',
                    fontSize: '0.85rem', marginTop: '0.75rem',
                    color: 'rgba(246,239,222,0.45)',
                  }}
                >
                  What you write here is private. Nothing is saved unless you choose to save at the end.
                </p>
              </div>

              {/* Suggested-time timer */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
                <ExamenTimer seconds={m.suggestedSeconds} color={m.color} />
              </div>
              <p
                className="body"
                style={{
                  fontStyle: 'italic', textAlign: 'center',
                  fontSize: '0.82rem', color: 'rgba(246,239,222,0.4)',
                }}
              >
                Suggested time. Linger or move on as the Spirit leads.
              </p>
            </div>
          );
        })()}

        {/* CLOSING */}
        {phase === 'closing' && (
          <div className="fade-in" style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
              <div
                className="breathe"
                style={{
                  width: 80, height: 80, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(215,177,105,0.12)',
                  border: '2px solid var(--gold-2)',
                  boxShadow: '0 0 36px rgba(215,177,105,0.45)',
                }}
              >
                <Cross size={28} style={{ color: 'var(--gold-2)' }} />
              </div>
            </div>
            <div className="sc-bold" style={{ fontSize: 10, marginBottom: '0.75rem', color: 'var(--gold-2)' }}>
              The Closing
            </div>
            <h2
              className="display-strong"
              style={{
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                lineHeight: 1.06, marginBottom: '1rem', fontWeight: 600,
              }}
            >
              Glory Be
            </h2>
            <div style={{ height: 1, margin: '0 auto 2rem', maxWidth: '5rem', background: 'var(--gold-2)' }} />
            <div style={{ maxWidth: '32rem', margin: '0 auto 2.5rem' }}>
              <p
                className="display"
                style={{
                  fontStyle: 'italic',
                  fontSize: 'clamp(1.3rem, 2.5vw, 1.45rem)',
                  lineHeight: 1.5, marginBottom: '1.5rem',
                  color: 'rgba(246,239,222,0.92)',
                }}
              >
                {GLORY_BE_TEXT}
              </p>
              <p
                className="display"
                style={{
                  fontStyle: 'italic',
                  fontSize: 'clamp(1.5rem, 3vw, 1.65rem)',
                  color: 'var(--gold-2)',
                }}
              >
                Amen.
              </p>
            </div>

            {/* Save preference toggle — only shown if the user has typed
                anything during the movements. Currently both buttons behave
                identically because no save action is wired (see header
                comment). The state is preserved as a UX hook for the
                Supabase journal integration. */}
            {hasContent && (
              <div
                style={{
                  maxWidth: '28rem', margin: '0 auto 2rem',
                  border: '1px solid var(--line-dark)',
                  padding: '1.25rem',
                  background: 'rgba(246,239,222,0.04)',
                }}
              >
                <div
                  className="sc-bold"
                  style={{
                    fontSize: 10, marginBottom: '0.75rem',
                    color: 'var(--gold-2)', textAlign: 'left',
                  }}
                >
                  Your reflection
                </div>
                <p
                  className="body"
                  style={{
                    fontStyle: 'italic',
                    fontSize: '0.95rem', lineHeight: 1.5,
                    marginBottom: '1rem',
                    color: 'rgba(246,239,222,0.7)', textAlign: 'left',
                  }}
                >
                  By default what you wrote will not be saved — the Examen is for self-knowledge
                  before God. But you can save tonight's reflection if you want to read it back.
                </p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => setSavePreference('ephemeral')}
                    className="sc"
                    style={{
                      fontSize: 9, padding: '0.75rem 1rem',
                      border: '1px solid', flex: 1, minHeight: 44, cursor: 'pointer',
                      borderColor: savePreference === 'ephemeral' ? 'var(--gold-2)' : 'var(--line-dark)',
                      color: savePreference === 'ephemeral' ? 'var(--gold-2)' : 'rgba(246,239,222,0.6)',
                      background:
                        savePreference === 'ephemeral'
                          ? 'rgba(215,177,105,0.06)'
                          : 'transparent',
                      fontFamily: 'inherit',
                    }}
                  >
                    Let it go
                  </button>
                  <button
                    onClick={() => setSavePreference('save')}
                    className="sc"
                    style={{
                      fontSize: 9, padding: '0.75rem 1rem',
                      border: '1px solid', flex: 1, minHeight: 44, cursor: 'pointer',
                      borderColor: savePreference === 'save' ? 'var(--gold-2)' : 'var(--line-dark)',
                      color: savePreference === 'save' ? 'var(--gold-2)' : 'rgba(246,239,222,0.6)',
                      background:
                        savePreference === 'save'
                          ? 'rgba(215,177,105,0.06)'
                          : 'transparent',
                      fontFamily: 'inherit',
                    }}
                  >
                    Save to journal
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={handleAmen}
              className="btn-gold sc-bold"
              style={{
                fontSize: 11, padding: '1rem 2rem',
                display: 'inline-flex', alignItems: 'center', gap: '0.75rem', minHeight: 48,
              }}
            >
              <Check size={14} /> Amen · Done
            </button>
            <p
              className="body"
              style={{
                fontStyle: 'italic',
                fontSize: '0.92rem',
                maxWidth: '28rem', margin: '1rem auto 0',
                color: 'rgba(246,239,222,0.55)',
              }}
            >
              Carry the resolution forward. Tomorrow asks one thing.
            </p>
          </div>
        )}
      </main>

      {/* Bottom navigation — only during movement phase. */}
      {phase !== 'intro' && phase !== 'closing' && (
        <footer
          className="ink-bg"
          style={{ position: 'sticky', bottom: 0, borderTop: '1px solid var(--line-dark)' }}
        >
          <div
            style={{
              maxWidth: '48rem', margin: '0 auto', padding: '1rem 1.5rem',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem',
            }}
          >
            <button
              onClick={prevMovement}
              className="btn-ghost-dark sc"
              style={{
                fontSize: 10, padding: '0.625rem 1rem',
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem', minHeight: 40,
              }}
            >
              <ArrowLeft size={12} /> Back
            </button>
            <div className="sc" style={{ fontSize: 9, color: 'rgba(246,239,222,0.5)' }}>
              {phase === 'movement' ? `Movement ${movement.n} of 5 — ${movement.name}` : ''}
            </div>
            <button
              onClick={nextMovement}
              className="btn-gold sc-bold"
              style={{
                fontSize: 10, padding: '0.625rem 1.25rem',
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem', minHeight: 40,
              }}
            >
              {mIndex === EXAMEN_MOVEMENTS.length - 1 ? 'To the Glory Be' : 'Next movement'}{' '}
              <ArrowRight size={12} />
            </button>
          </div>
        </footer>
      )}
    </div>
  );
}
