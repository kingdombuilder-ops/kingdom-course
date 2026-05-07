/* =============================================================================
   src/modals/LectioDivina.jsx — KNOW · The four-rung ladder.

   Twelve-hundred-year-old Carthusian practice for hearing Scripture as
   prayer rather than information. Lectio · Meditatio · Oratio · Contemplatio
   — read, meditate, pray, rest. Today's Mass Gospel as the text.

   Three phases:
     intro    — frame the practice, show today's Gospel, "Begin Lectio"
     step     — one of the four rungs; passage card stays visible at top
     closing  — the Word remains; sign of the cross; Amen

   Each step has a custom interaction:
     0 lectio       — read counter (3 passes; gates advance)
     1 meditatio    — single-word input (gates advance)
     2 oratio       — journal field (advance freely)
     3 contemplatio — deep-breathing circle + 5-min timer (advance freely)

   Migrated from the_kingdom.jsx line ~10864 with no behavioral changes.
   The source's `<React.Fragment key={i}>` is rewritten as `<Fragment key={i}>`
   from the named import — the automatic JSX runtime doesn't put React in
   scope by default.

   Note on privacy: the journal field is local-state only — its contents are
   never persisted (not even to localStorage). The "What you write is
   private. Nothing is saved." line under the field is literally true. When
   a future build adds optional journaling persistence, that line will need
   to update accordingly.

   Props:
     gospel        — defaults to CHURCH_TODAY.readings.gospel; can be
                     overridden for testing or to use a different reading
     onComplete()  — caller marks essential II complete and closes
     onClose()     — caller closes without marking complete
   ============================================================================= */

import { Fragment, useState, useEffect, useRef } from 'react';
import {
  X, BookOpen, ArrowRight, ArrowLeft, Check, Cross, Clock, Play, Pause, RotateCcw, Wind,
} from 'lucide-react';
import { CHURCH_TODAY } from '@data';

// ---- Constants ------------------------------------------------------------
const LECTIO_COLOR = '#D7B169';
const LECTIO_TINT  = 'rgba(215,177,105,0.10)';
const LECTIO_GLOW  = 'rgba(215,177,105,0.45)';

const LECTIO_STEPS = [
  {
    n: 1, key: 'lectio',       name: 'Lectio',       latinSub: 'Read',
    invitation: 'Read the Word.',
    body: "Read it slowly. When you reach the end, read it again. Don't analyze. Don't argue. Don't interpret yet. Just listen, the way you would listen to a friend who is telling you something important — for the first time.",
    guigoQuote: 'Reading puts food whole into the mouth.',
  },
  {
    n: 2, key: 'meditatio',    name: 'Meditatio',    latinSub: 'Meditate',
    invitation: 'Notice what catches you.',
    body: "What word, what phrase, what image arrests you? Don't choose with the mind. Notice what already chose you — what won't let you move past it. One word is enough. Sit with it.",
    guigoQuote: 'Meditation chews it and breaks it down.',
  },
  {
    n: 3, key: 'oratio',       name: 'Oratio',       latinSub: 'Pray',
    invitation: 'Speak to God about it.',
    body: 'Now talk to him. Out loud, or in writing here. About what surfaced — the word, the question, the resistance, the consolation. Honestly. Whatever the passage stirred. He is listening.',
    guigoQuote: 'Prayer extracts the flavor.',
  },
  {
    n: 4, key: 'contemplatio', name: 'Contemplatio', latinSub: 'Rest',
    invitation: 'Stop. Rest in his presence.',
    body: "Now stop reading. Stop speaking. Stop thinking. Just remain. He has heard you. The Word that was given is now inside you. Don't try to feel anything. Don't try to do anything. Simply rest.",
    guigoQuote: 'Contemplation is the sweetness itself.',
  },
];

// ---- ContemplatioTimer ----------------------------------------------------
// Local helper: a play/pause/reset countdown, default 5 minutes. Used only
// on the contemplatio step. Lives here rather than in @shared because no
// other module currently needs it; promote later if it's reused.
function ContemplatioTimer({ seconds = 300 }) {
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
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.875rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Clock size={12} style={{ color: LECTIO_COLOR }} />
        <span
          className="sc-bold"
          style={{
            fontSize: 11,
            color: LECTIO_COLOR,
            minWidth: '3rem',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {mins}:{secs.toString().padStart(2, '0')}
        </span>
      </div>
      <div style={{ width: 96, height: 3, overflow: 'hidden', background: 'rgba(246,239,222,0.1)' }}>
        <div style={{ height: '100%', transition: 'width 1s linear', width: `${pct}%`, background: LECTIO_COLOR }} />
      </div>
      <button
        onClick={() => setRunning(!running)}
        style={{
          width: 32, height: 32, borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: `1px solid ${LECTIO_COLOR}`,
          background: running ? LECTIO_COLOR : 'transparent',
          color: running ? 'var(--ink)' : LECTIO_COLOR,
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

// ---- LectioDivina (default export) ---------------------------------------
export default function LectioDivina({
  gospel = CHURCH_TODAY.readings.gospel,
  onComplete,
  onClose,
}) {
  const [phase, setPhase] = useState('intro');         // intro | step | closing
  const [stepIndex, setStepIndex] = useState(0);       // 0..3
  const [readCount, setReadCount] = useState(0);       // 0..3 in lectio
  const [surfacedWord, setSurfacedWord] = useState('');
  const [oratioJournal, setOratioJournal] = useState('');

  const step = LECTIO_STEPS[stepIndex];

  const begin = () => {
    setPhase('step');
    setStepIndex(0);
    setReadCount(0);
  };

  const advance = () => {
    if (stepIndex < LECTIO_STEPS.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      setPhase('closing');
    }
  };

  const retreat = () => {
    if (stepIndex > 0) setStepIndex(stepIndex - 1);
    else setPhase('intro');
  };

  // Lectio gates on 3 reads; meditatio gates on a non-empty word; oratio
  // and contemplatio advance freely.
  const canAdvance = () => {
    if (stepIndex === 0) return readCount >= 3;
    if (stepIndex === 1) return surfacedWord.trim().length > 0;
    return true;
  };

  const jumpToStep = (i) => setStepIndex(i);

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
              <div className="sc-bold" style={{ fontSize: 10, color: 'var(--paper)' }}>Lectio Divina</div>
              <div className="body" style={{ fontStyle: 'italic', fontSize: '0.78rem', color: 'rgba(246,239,222,0.55)' }}>
                Pray Now · 15 min
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

        {/* Step nav strip — visible only during the four-step phase. */}
        {phase === 'step' && (
          <div style={{ maxWidth: '48rem', margin: '0 auto', padding: '0 1.5rem 0.875rem' }}>
            <div className="lectio-step-nav">
              {LECTIO_STEPS.map((s, i) => {
                const isActive = i === stepIndex;
                const isComplete = i < stepIndex;
                return (
                  <div
                    key={s.key}
                    className={
                      'lectio-step-nav-item ' +
                      (isActive ? 'active' : '') +
                      (isComplete ? ' complete' : '')
                    }
                    style={{ '--lectio-color': LECTIO_COLOR, '--lectio-glow': LECTIO_GLOW }}
                    onClick={() => jumpToStep(i)}
                  >
                    <div className="lectio-dot" />
                    <span
                      className="sc"
                      style={{ fontSize: 9, color: isActive ? LECTIO_COLOR : 'rgba(246,239,222,0.55)' }}
                    >
                      {s.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </header>

      <main style={{ maxWidth: '48rem', margin: '0 auto', padding: '3rem 1.5rem' }}>
        {/* INTRO */}
        {phase === 'intro' && (
          <div className="fade-in" style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.75rem' }}>
              <div
                className="breathe"
                style={{
                  width: 80, height: 80, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: LECTIO_TINT,
                  border: `2px solid ${LECTIO_COLOR}`,
                  boxShadow: `0 0 32px ${LECTIO_GLOW}`,
                }}
              >
                <BookOpen size={32} style={{ color: LECTIO_COLOR }} />
              </div>
            </div>
            <div className="sc-bold" style={{ fontSize: 10, marginBottom: '0.75rem', color: LECTIO_COLOR }}>
              Step 2 · KNOW · The Word
            </div>
            <h1
              className="display-strong"
              style={{ fontSize: 'clamp(2.2rem, 5.5vw, 3.4rem)', lineHeight: 1.06, marginBottom: '1rem', fontWeight: 600 }}
            >
              Lectio Divina
            </h1>
            <div style={{ height: 1, margin: '0 auto 1.5rem', maxWidth: '5rem', background: LECTIO_COLOR }} />
            <p
              className="body-lede"
              style={{
                fontSize: 'clamp(1.05rem, 2vw, 1.16rem)',
                lineHeight: 1.7,
                maxWidth: '32rem',
                margin: '0 auto 1.25rem',
                color: 'rgba(246,239,222,0.85)',
              }}
            >
              Divine reading. Four steps for hearing Scripture as prayer rather than information.
              Today's Mass Gospel as your text.
            </p>
            <p
              className="body"
              style={{
                fontStyle: 'italic',
                fontSize: '0.98rem',
                maxWidth: '32rem',
                margin: '0 auto 2rem',
                color: 'rgba(246,239,222,0.6)',
              }}
            >
              Read · Meditate · Pray · Rest. Twelve hundred years old. Still works.
            </p>

            <div
              style={{
                borderLeft: `2px solid ${LECTIO_COLOR}`,
                padding: '0.5rem 0 0.5rem 1.25rem',
                margin: '0 auto 2rem',
                maxWidth: '30rem',
                textAlign: 'left',
              }}
            >
              <p
                className="display"
                style={{ fontStyle: 'italic', fontSize: '1.08rem', lineHeight: 1.5, color: 'rgba(246,239,222,0.85)' }}
              >
                "Reading puts food whole into the mouth. Meditation chews it and breaks it down.
                Prayer extracts the flavor. Contemplation is the sweetness itself."
              </p>
              <p className="sc" style={{ fontSize: 9, marginTop: '0.625rem', color: LECTIO_COLOR }}>
                Guigo II, the Carthusian — c. 1180
              </p>
            </div>

            <div
              className="lectio-passage-card"
              style={{ '--lectio-color': LECTIO_COLOR, marginBottom: '2rem', textAlign: 'left' }}
            >
              <div
                style={{
                  display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
                  marginBottom: '0.875rem', flexWrap: 'wrap', gap: '0.5rem',
                }}
              >
                <div className="sc-bold" style={{ fontSize: 10, color: LECTIO_COLOR }}>Today's Gospel</div>
                <div className="sc" style={{ fontSize: 9, color: 'rgba(246,239,222,0.55)' }}>{gospel.ref}</div>
              </div>
              <p className="passage-text">{gospel.text || gospel.blurb}</p>
            </div>

            <button
              onClick={begin}
              className="btn-gold sc-bold"
              style={{ fontSize: 11, padding: '1rem 1.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.75rem', minHeight: 48 }}
            >
              <BookOpen size={14} /> Begin Lectio <ArrowRight size={13} />
            </button>
            <p
              className="body"
              style={{ fontStyle: 'italic', fontSize: '0.9rem', marginTop: '1rem', color: 'rgba(246,239,222,0.5)' }}
            >
              Find a quiet place. The Word is waiting.
            </p>
          </div>
        )}

        {/* STEP — one of the four. */}
        {phase === 'step' && (
          <div className="fade-in" key={step.key}>
            {/* Passage card — always at top during steps */}
            <div
              className="lectio-passage-card"
              style={{ '--lectio-color': LECTIO_COLOR, marginBottom: '2rem' }}
            >
              <div
                style={{
                  display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
                  marginBottom: '0.625rem', flexWrap: 'wrap', gap: '0.5rem',
                }}
              >
                <div className="sc-bold" style={{ fontSize: 10, color: LECTIO_COLOR }}>The Word</div>
                <div className="sc" style={{ fontSize: 9, color: 'rgba(246,239,222,0.55)' }}>{gospel.ref}</div>
              </div>
              <p className="passage-text">{gospel.text || gospel.blurb}</p>
            </div>

            {/* Step header */}
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div className="sc-bold" style={{ fontSize: 10, marginBottom: '0.5rem', color: LECTIO_COLOR }}>
                Step {step.n} of 4 · {step.latinSub}
              </div>
              <h2
                className="display-strong"
                style={{ fontSize: 'clamp(1.85rem, 4.5vw, 2.6rem)', lineHeight: 1.06, marginBottom: '0.5rem', fontWeight: 600 }}
              >
                {step.name}
              </h2>
              <p
                className="display"
                style={{ fontStyle: 'italic', fontSize: 'clamp(1.08rem, 2vw, 1.2rem)', color: 'var(--gold-2)' }}
              >
                {step.invitation}
              </p>
            </div>

            <p
              className="body-lede"
              style={{
                fontSize: 'clamp(1.02rem, 1.7vw, 1.1rem)',
                lineHeight: 1.7,
                maxWidth: '36rem',
                margin: '0 auto 2rem',
                textAlign: 'center',
                color: 'rgba(246,239,222,0.82)',
              }}
            >
              {step.body}
            </p>

            {/* Step 1 — Lectio: read counter */}
            {stepIndex === 0 && (
              <div style={{ maxWidth: '32rem', margin: '0 auto' }}>
                <div
                  className="sc-bold"
                  style={{ fontSize: 10, marginBottom: '0.625rem', textAlign: 'center', color: LECTIO_COLOR }}
                >
                  Read it through. Three times.
                </div>
                <div className="read-counter">
                  {[1, 2, 3].map((i) => (
                    <Fragment key={i}>
                      <button
                        onClick={() => setReadCount(Math.max(readCount, i))}
                        className={'read-counter-circle ' + (readCount >= i ? 'read' : '')}
                        style={{ '--lectio-color': LECTIO_COLOR, '--lectio-glow': LECTIO_GLOW }}
                        aria-label={`Mark read ${i}`}
                      >
                        {readCount >= i ? <Check size={14} strokeWidth={3} /> : i}
                      </button>
                      {i < 3 && (
                        <div className={'read-counter-line ' + (readCount >= i + 1 ? 'read' : '')} />
                      )}
                    </Fragment>
                  ))}
                </div>
                <p
                  className="body"
                  style={{
                    fontStyle: 'italic',
                    fontSize: '0.92rem',
                    textAlign: 'center',
                    color: 'rgba(246,239,222,0.55)',
                    marginTop: '0.5rem',
                  }}
                >
                  {readCount === 0 ? 'Tap a circle each time you finish a reading.' :
                   readCount === 1 ? 'Once. Now again — slower this time.' :
                   readCount === 2 ? 'Twice. One more pass — listen for what arrests you.' :
                                     'Three times. The Word is in you now. Continue.'}
                </p>
              </div>
            )}

            {/* Step 2 — Meditatio: one-word input */}
            {stepIndex === 1 && (
              <div style={{ maxWidth: '32rem', margin: '0 auto' }}>
                <div
                  className="sc-bold"
                  style={{ fontSize: 10, marginBottom: '0.75rem', textAlign: 'center', color: LECTIO_COLOR }}
                >
                  The word that surfaced
                </div>
                <input
                  type="text"
                  className="surfaced-word-input"
                  value={surfacedWord}
                  onChange={(e) => setSurfacedWord(e.target.value)}
                  placeholder="One word. One phrase. What chose you?"
                  autoFocus
                />
                <p
                  className="body"
                  style={{
                    fontStyle: 'italic',
                    fontSize: '0.88rem',
                    textAlign: 'center',
                    color: 'rgba(246,239,222,0.5)',
                    marginTop: '1rem',
                  }}
                >
                  Don't think hard. The word that surfaced is the right word.
                </p>
              </div>
            )}

            {/* Step 3 — Oratio: journal */}
            {stepIndex === 2 && (
              <div style={{ maxWidth: '32rem', margin: '0 auto' }}>
                {surfacedWord && (
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
                    <div className="your-word-reminder" style={{ '--lectio-color': LECTIO_COLOR }}>
                      <span className="label">Your word</span>
                      <span className="word">{surfacedWord}</span>
                    </div>
                  </div>
                )}
                <div className="sc-bold" style={{ fontSize: 10, marginBottom: '0.75rem', color: LECTIO_COLOR }}>
                  Speak to him about it
                </div>
                <textarea
                  className="journal-field"
                  rows={6}
                  value={oratioJournal}
                  onChange={(e) => setOratioJournal(e.target.value)}
                  placeholder={"Lord, this word...\n\nWhat I want to say is...\n\nWhat I'm afraid to say is..."}
                  style={{ '--mvmt-color': LECTIO_COLOR }}
                />
                <p
                  className="body"
                  style={{
                    fontStyle: 'italic',
                    fontSize: '0.85rem',
                    marginTop: '0.75rem',
                    color: 'rgba(246,239,222,0.45)',
                  }}
                >
                  What you write is private. Nothing is saved. This is between you and him.
                </p>
              </div>
            )}

            {/* Step 4 — Contemplatio: deep-breathing circle + timer */}
            {stepIndex === 3 && (
              <div style={{ maxWidth: '32rem', margin: '0 auto', textAlign: 'center' }}>
                {surfacedWord && (
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
                    <div className="your-word-reminder" style={{ '--lectio-color': LECTIO_COLOR }}>
                      <span className="label">Your word</span>
                      <span className="word">{surfacedWord}</span>
                    </div>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
                  <div
                    className="deep-breathe"
                    style={{
                      width: 144, height: 144, borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: LECTIO_TINT,
                      border: `2px solid ${LECTIO_COLOR}`,
                      boxShadow: `0 0 48px ${LECTIO_GLOW}`,
                    }}
                  >
                    <Wind size={40} style={{ color: LECTIO_COLOR }} />
                  </div>
                </div>
                <p
                  className="body"
                  style={{
                    fontStyle: 'italic',
                    fontSize: '1.05rem',
                    lineHeight: 1.55,
                    color: 'rgba(246,239,222,0.78)',
                    marginBottom: '1.5rem',
                  }}
                >
                  No words now. No effort. Just remain.
                </p>
                <ContemplatioTimer seconds={300} />
                <p
                  className="body"
                  style={{
                    fontStyle: 'italic',
                    fontSize: '0.9rem',
                    marginTop: '0.75rem',
                    color: 'rgba(246,239,222,0.5)',
                  }}
                >
                  Five minutes. Or longer. The Spirit will tell you.
                </p>
              </div>
            )}

            {/* Guigo's quote at the bottom of every step */}
            <div
              style={{
                marginTop: '3rem',
                paddingTop: '1.5rem',
                borderTop: '1px solid var(--line-dark-soft)',
                textAlign: 'center',
              }}
            >
              <p
                className="display"
                style={{ fontStyle: 'italic', fontSize: '0.95rem', color: 'rgba(246,239,222,0.5)' }}
              >
                "{step.guigoQuote}"
              </p>
              <p className="sc" style={{ fontSize: 9, marginTop: '0.5rem', color: 'rgba(246,239,222,0.4)' }}>
                Guigo II
              </p>
            </div>
          </div>
        )}

        {/* CLOSING */}
        {phase === 'closing' && (
          <div className="fade-in" style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
              <div
                className="breathe"
                style={{
                  width: 80, height: 80, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: LECTIO_TINT,
                  border: `2px solid ${LECTIO_COLOR}`,
                  boxShadow: `0 0 36px ${LECTIO_GLOW}`,
                }}
              >
                <Cross size={28} style={{ color: LECTIO_COLOR }} />
              </div>
            </div>
            <div className="sc-bold" style={{ fontSize: 10, marginBottom: '0.75rem', color: LECTIO_COLOR }}>
              The Closing
            </div>
            <h2
              className="display-strong"
              style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', lineHeight: 1.06, marginBottom: '1rem', fontWeight: 600 }}
            >
              The Word remains.
            </h2>
            <div style={{ height: 1, margin: '0 auto 2rem', maxWidth: '5rem', background: LECTIO_COLOR }} />

            {surfacedWord && (
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
                <div className="your-word-reminder" style={{ '--lectio-color': LECTIO_COLOR }}>
                  <span className="label">Today's word</span>
                  <span className="word">{surfacedWord}</span>
                </div>
              </div>
            )}

            <p
              className="body-lede"
              style={{
                fontSize: 'clamp(1.05rem, 2vw, 1.15rem)',
                lineHeight: 1.7,
                maxWidth: '32rem',
                margin: '0 auto 2rem',
                color: 'rgba(246,239,222,0.85)',
              }}
            >
              You read. You noticed. You spoke. You rested. Now go — and let the Word follow you through the day.
            </p>

            <div
              style={{
                paddingTop: '1.5rem',
                marginTop: '1.5rem',
                borderTop: '1px solid var(--line-dark)',
                marginBottom: '2rem',
              }}
            >
              <div className="sc-bold" style={{ fontSize: 10, marginBottom: '0.75rem', color: LECTIO_COLOR }}>
                Sign of the Cross
              </div>
              <p
                className="display"
                style={{
                  fontStyle: 'italic',
                  fontSize: 'clamp(1.05rem, 1.8vw, 1.2rem)',
                  lineHeight: 1.5,
                  color: 'rgba(246,239,222,0.85)',
                  maxWidth: '28rem',
                  margin: '0 auto',
                }}
              >
                In the name of the Father, and of the Son, and of the Holy Spirit. Amen.
              </p>
            </div>

            <button
              onClick={() => onComplete && onComplete()}
              className="btn-gold sc-bold"
              style={{ fontSize: 11, padding: '1rem 2rem', display: 'inline-flex', alignItems: 'center', gap: '0.75rem', minHeight: 48 }}
            >
              <Check size={14} /> Amen · Done
            </button>
            <p
              className="body"
              style={{
                fontStyle: 'italic',
                fontSize: '0.92rem',
                maxWidth: '28rem',
                margin: '1rem auto 0',
                color: 'rgba(246,239,222,0.55)',
              }}
            >
              The Word does not return empty. It will accomplish what he sent it to do.
            </p>
          </div>
        )}
      </main>

      {/* Bottom navigation — only during the four-step phase. */}
      {phase === 'step' && (
        <footer className="ink-bg" style={{ position: 'sticky', bottom: 0, borderTop: '1px solid var(--line-dark)' }}>
          <div
            style={{
              maxWidth: '48rem', margin: '0 auto', padding: '1rem 1.5rem',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem',
            }}
          >
            <button
              onClick={retreat}
              className="btn-ghost-dark sc"
              style={{
                fontSize: 10, padding: '0.625rem 1rem',
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem', minHeight: 40,
              }}
            >
              <ArrowLeft size={12} /> Back
            </button>
            <div className="sc" style={{ fontSize: 9, color: 'rgba(246,239,222,0.5)' }}>
              Step {step.n} of 4 — {step.name}
            </div>
            <button
              onClick={advance}
              disabled={!canAdvance()}
              className="btn-gold sc-bold"
              style={{
                fontSize: 10, padding: '0.625rem 1.25rem',
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem', minHeight: 40,
              }}
            >
              {stepIndex === LECTIO_STEPS.length - 1 ? 'To the closing' : 'Continue'} <ArrowRight size={12} />
            </button>
          </div>
        </footer>
      )}
    </div>
  );
}
