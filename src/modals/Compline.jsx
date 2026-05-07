/* =============================================================================
   src/modals/Compline.jsx — The Night Office.

   The last hour of the Liturgy of the Hours. Twelve minutes that close the
   day before God: examination, hymn, psalmody, reading, responsory, the
   Nunc Dimittis, blessing, and the seasonal Marian antiphon. The day given
   back. The night blessed. Sleep entrusted.

   Migrated from the_kingdom.jsx line ~12348. Three things move with the
   modal because nothing else uses them:
     - MARIAN_ANTIPHONS data (line ~12150)
     - todaysMarianAntiphon() resolver (line ~12131)
     - COMPLINE_SECTIONS array (line ~12202)
     - ComplineSilence helper (line ~12310)

   Two structural improvements made during migration:

     1. The source declares MARIAN_ANTIPHONS *after* todaysMarianAntiphon()
        references it. Works at runtime because the function only runs after
        module init, but reads as fragile. Reordered: data first, function
        second. Same behavior.

     2. The Easter date band is hardcoded for 2026 (April 5 – May 24).
        Correct for this year, will silently misfire in 2027. Comment
        expanded to name the dependency explicitly so it's not forgotten
        when the full liturgical calendar is wired in. The fix belongs in
        liturgical.js where the year's feasts already live; until then,
        behavior is preserved.

   Aesthetic note: the modal uses a deeper-than-ink palette (.night-bg)
   accented with the blue-purple of evening (#6B5B95), warming to gold only
   at the closing Marian antiphon. The transition is the structural arc.

   Props:
     onComplete()  — caller marks the day complete; the user has prayed
     onClose()     — caller closes without finishing
   ============================================================================= */

import { useState, useEffect, useRef } from 'react';
import { X, Moon, ArrowRight, ArrowLeft, Check } from 'lucide-react';

// ---- Constants ------------------------------------------------------------
const COMPLINE_COLOR       = '#6B5B95';
const COMPLINE_COLOR_LIGHT = '#B8A4D9';

/* The four seasonal Marian antiphons. Each ~1500-year tradition. */
const MARIAN_ANTIPHONS = {
  almaRedemptoris: {
    key: 'alma',
    name: 'Alma Redemptoris Mater',
    season: 'Advent · Christmas',
    text:
      'Loving Mother of the Redeemer, gate of heaven, star of the sea, ' +
      'hasten to aid your fallen people who strive to rise once more. ' +
      'You who brought forth your holy Creator, while all nature marveled, ' +
      "Virgin before and after, receiving that 'Hail' from the mouth of Gabriel, " +
      'have mercy on us sinners.',
    note: 'Sung from the First Sunday of Advent through the Feast of the Presentation.',
  },
  aveRegina: {
    key: 'ave',
    name: 'Ave Regina Caelorum',
    season: 'Lent',
    text:
      'Hail, Queen of Heaven; hail, Lady of the Angels; ' +
      'hail, root of Jesse; hail, the gate through which the Light has risen on the world. ' +
      'Rejoice, glorious Virgin, lovely beyond all others; ' +
      'farewell, most beautiful maiden, and pray for us to Christ.',
    note: 'Sung from the Presentation through Holy Wednesday.',
  },
  reginaCaeli: {
    key: 'regina',
    name: 'Regina Caeli',
    season: 'Easter',
    text:
      'Queen of Heaven, rejoice, alleluia. ' +
      'For he whom you were worthy to bear, alleluia, ' +
      'has risen as he said, alleluia. ' +
      'Pray for us to God, alleluia.',
    note: 'Sung throughout the fifty days of Easter.',
  },
  salveRegina: {
    key: 'salve',
    name: 'Salve Regina',
    season: 'Ordinary Time',
    text:
      'Hail, holy Queen, Mother of mercy, our life, our sweetness and our hope. ' +
      'To thee do we cry, poor banished children of Eve. ' +
      'To thee do we send up our sighs, mourning and weeping in this valley of tears. ' +
      'Turn then, most gracious advocate, thine eyes of mercy toward us, ' +
      'and after this our exile, show unto us the blessed fruit of thy womb, Jesus. ' +
      'O clement, O loving, O sweet Virgin Mary.',
    note: 'Sung throughout Ordinary Time, the longest stretch of the year.',
  },
};

/* Today's seasonal Marian antiphon.

   PROVISIONAL: the Easter band edges are hardcoded to 2026's calendar
   (Easter April 5; Pentecost May 24). Correct for the launch year, will
   misfire in 2027 — Easter falls on different dates each year. Proper fix
   is to derive the bands from the liturgical dictionary in
   src/data/liturgical.js, which already encodes the year's feasts. Until
   then, returns:
     - Advent through the Presentation (~Nov 27 – Feb 2): Alma Redemptoris Mater
     - Feb 3 through the Easter Vigil:                    Ave Regina Caelorum
     - Easter season (50 days from Easter):               Regina Caeli
     - Ordinary Time:                                     Salve Regina
   When the calendar is wired in, replace this with a date lookup. */
export function todaysMarianAntiphon(d = new Date()) {
  const month = d.getMonth() + 1;
  const day = d.getDate();
  if ((month === 4 && day >= 5) || (month === 5 && day <= 24)) {
    return MARIAN_ANTIPHONS.reginaCaeli;
  }
  if ((month === 11 && day >= 27) || month === 12 || month === 1 || (month === 2 && day <= 2)) {
    return MARIAN_ANTIPHONS.almaRedemptoris;
  }
  if ((month === 2 && day >= 3) || month === 3 || (month === 4 && day < 5)) {
    return MARIAN_ANTIPHONS.aveRegina;
  }
  return MARIAN_ANTIPHONS.salveRegina;
}

/* The fixed sections of Compline. Section order matters — this is a
   liturgy, not a menu. The simple <v> and <em> tags inside `prayer` are
   not real HTML; they are sentinels parsed by renderPrayerHTML below into
   typed React spans (versicle markers and emphasis). This keeps the
   prayer text human-readable in source while letting the renderer apply
   typography without dangerouslySetInnerHTML. */
const COMPLINE_SECTIONS = [
  {
    key: 'opening',
    label: 'Opening',
    title: 'O God, come to my assistance.',
    prayer:
      '<v>℣.</v> O God, come to my assistance. ' +
      '<v>℟.</v> O Lord, make haste to help me. ' +
      '<v>℣.</v> Glory be to the Father, and to the Son, and to the Holy Spirit, ' +
      'as it was in the beginning, is now, and ever shall be, world without end. Amen.',
    rubric: 'Make the sign of the cross.',
  },
  {
    key: 'examination',
    label: 'Examination of Conscience',
    title: 'What was I, today, that I should not have been?',
    rubric:
      'A short pause. Briefly recall how you have failed today — in love, in patience, in attention. ' +
      'Receive forgiveness from the One who is waiting to give it. There is no list to write here. ' +
      'The act is between you and him.',
    isExamination: true,
  },
  {
    key: 'confiteor',
    label: 'The Confiteor',
    title: 'I confess to almighty God…',
    prayer:
      'I confess to almighty God and to you, my brothers and sisters, that I have greatly sinned, ' +
      'in my thoughts and in my words, in what I have done and in what I have failed to do, ' +
      '<em>through my fault, through my fault, through my most grievous fault;</em> ' +
      'therefore I ask blessed Mary ever-Virgin, all the angels and saints, and you, my brothers and sisters, ' +
      'to pray for me to the Lord our God.',
    rubric: "Strike the breast at the threefold 'through my fault.'",
  },
  {
    key: 'hymn',
    label: 'Hymn',
    title: 'Te lucis ante terminum',
    prayer:
      'Before the ending of the day, Creator of the world, we pray that, with thy wonted favor, ' +
      'thou wouldst be our guard and keeper now. ' +
      'From all ill dreams defend our eyes, from nightly fears and fantasies; ' +
      'tread under foot our ghostly foe, that no pollution we may know. ' +
      'O Father, that we ask be done, through Jesus Christ thine only Son, ' +
      'who, with the Holy Ghost and thee, doth live and reign eternally. Amen.',
    rubric: 'Te lucis ante terminum — sung in the Latin Church for over fifteen hundred years.',
  },
  {
    key: 'psalm',
    label: 'Psalm 91',
    title: 'He who dwells in the shelter of the Most High.',
    prayer:
      'He who dwells in the shelter of the Most High, who abides in the shadow of the Almighty, ' +
      'will say to the Lord, "My refuge and my fortress, my God in whom I trust." ' +
      'For he will deliver you from the snare of the fowler and from the deadly pestilence; ' +
      'he will cover you with his pinions, and under his wings you will find refuge. ' +
      'His faithfulness is a shield and buckler. You will not fear the terror of the night, ' +
      'nor the arrow that flies by day, nor the pestilence that stalks in darkness, ' +
      'nor the destruction that wastes at noonday. ' +
      'Because you have made the Lord your refuge, the Most High your habitation, ' +
      'no evil shall befall you, no scourge come near your tent. For he will give his angels charge of you, ' +
      'to guard you in all your ways. On their hands they will bear you up, lest you dash your foot against a stone. ' +
      'When he calls to me, I will answer him; I will be with him in trouble, ' +
      'I will rescue him and honor him. With long life I will satisfy him, and show him my salvation.',
    rubric: 'The night psalm. Pray slowly. Let each line settle.',
  },
  {
    key: 'silence-after-psalm',
    label: 'Silence',
    title: 'Sit with the psalm.',
    rubric: 'Pause. Let the words remain. The silence is part of the prayer.',
    isSilence: true,
  },
  {
    key: 'reading',
    label: 'Short Reading',
    title: '1 Peter 5:8–9',
    prayer:
      'Be sober, be watchful. Your adversary the devil prowls around like a roaring lion, ' +
      'seeking some one to devour. Resist him, firm in your faith.',
    rubric: 'The first epistle of Peter.',
  },
  {
    key: 'responsory',
    label: 'Responsory',
    title: 'Into your hands, O Lord.',
    prayer:
      '<v>℟.</v> Into your hands, O Lord, I commend my spirit. ' +
      '<v>℣.</v> You have redeemed us, Lord, God of truth. <em>I commend my spirit.</em> ' +
      '<v>℣.</v> Glory to the Father, and to the Son, and to the Holy Spirit. ' +
      '<v>℟.</v> Into your hands, O Lord, I commend my spirit.',
    rubric: 'The last words of Christ from the cross. Now they are yours.',
  },
  {
    key: 'nunc-dimittis',
    label: 'Gospel Canticle',
    title: 'Nunc Dimittis',
    prayer:
      '<em>Now, Master, you may let your servant go in peace, according to your word; ' +
      'for my eyes have seen your salvation, ' +
      'which you have prepared in the sight of all peoples: ' +
      'a light for revelation to the Gentiles, and the glory of your people Israel.</em>',
    rubric:
      'The canticle of Simeon, who held the infant Christ in the temple — Luke 2:29–32. ' +
      'Prayed every night by the Church for fifteen hundred years.',
  },
  {
    key: 'concluding-prayer',
    label: 'Concluding Prayer',
    title: 'Visit, we beseech you, O Lord.',
    prayer:
      'Visit, we beseech you, O Lord, this dwelling, and drive far from it all snares of the enemy; ' +
      'let your holy angels dwell herein to preserve us in peace; ' +
      'and may your blessing be upon us always. Through Christ our Lord. Amen.',
    rubric: 'An ancient prayer for the household at night.',
  },
  {
    key: 'blessing',
    label: 'Blessing',
    title: 'May the Lord grant us a quiet night and a perfect end.',
    prayer: 'Amen.',
    rubric: "The Church's signature blessing at the close of every day.",
    isBlessing: true,
  },
];

// ---- ComplineSilence ------------------------------------------------------
// Local helper: a counter-up timer with a minimum duration. Used inside the
// examination section and after the psalm. The user taps to begin; the
// timer counts up; once the minimum is met, the label changes from
// "Ns remaining" to "Continue when ready."
function ComplineSilence({ minSeconds = 30 }) {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setElapsed((e) => e + 1);
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  return (
    <div className="compline-silence">
      <div className="night-breathe">
        <Moon size={24} style={{ color: COMPLINE_COLOR_LIGHT }} />
      </div>
      <p
        className="display"
        style={{
          fontStyle: 'italic',
          fontSize: '1.05rem',
          lineHeight: 1.5,
          color: 'rgba(246,239,222,0.78)',
          maxWidth: '26rem',
          marginBottom: '1rem',
        }}
      >
        Be still. Breathe. Let the silence be the prayer.
      </p>
      {!running ? (
        <button
          onClick={() => setRunning(true)}
          className="sc"
          style={{
            fontSize: 9,
            padding: '0.5rem 1rem',
            border: `1px solid ${COMPLINE_COLOR_LIGHT}`,
            color: COMPLINE_COLOR_LIGHT,
            background: 'transparent',
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Begin the silence
        </button>
      ) : (
        <span className="sc" style={{ fontSize: 10, color: COMPLINE_COLOR_LIGHT }}>
          {elapsed < minSeconds ? `${minSeconds - elapsed}s remaining` : 'Continue when ready.'}
        </span>
      )}
    </div>
  );
}

// ---- Compline (default export) -------------------------------------------
export default function Compline({ onComplete, onClose }) {
  // Phases:
  //   intro    — frame, antiphon preview, "Begin Compline"
  //   liturgy  — full single-page flow with all sections
  //   (closed)  handled inline; user taps Amen on the antiphon
  const [phase, setPhase] = useState('intro');
  const [examination, setExamination] = useState('');
  const [currentSectionKey, setCurrentSectionKey] = useState(COMPLINE_SECTIONS[0].key);

  const antiphon = todaysMarianAntiphon();
  const liturgyRef = useRef(null);

  // When entering liturgy, scroll to top.
  useEffect(() => {
    if (phase === 'liturgy' && liturgyRef.current) {
      liturgyRef.current.scrollTop = 0;
    }
  }, [phase]);

  // Track visible section for the progress dots — uses IntersectionObserver
  // when available, no-op otherwise (the dots simply won't update without it,
  // which is acceptable graceful degradation).
  useEffect(() => {
    if (phase !== 'liturgy') return;
    const sectionEls = COMPLINE_SECTIONS
      .map((s) => document.getElementById(`compline-${s.key}`))
      .filter(Boolean);
    if (sectionEls.length === 0) return;

    if (typeof IntersectionObserver !== 'undefined') {
      const observer = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((e) => e.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
          if (visible.length > 0) {
            const id = visible[0].target.id;
            const key = id.replace('compline-', '');
            setCurrentSectionKey(key);
          }
        },
        { rootMargin: '-30% 0px -50% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
      );
      sectionEls.forEach((el) => observer.observe(el));
      return () => observer.disconnect();
    }
    return undefined;
  }, [phase]);

  // Translate <v>...</v> versicle markers and <em>...</em> emphasis into
  // typed React spans. Done with simple pattern matching rather than
  // dangerouslySetInnerHTML — the input strings come only from this file's
  // static data.
  const renderPrayerHTML = (text) => {
    const parts = [];
    let remaining = text;
    let idx = 0;
    while (remaining.length > 0) {
      const vMatch = remaining.match(/^<v>(.*?)<\/v>/);
      const eMatch = remaining.match(/^<em>(.*?)<\/em>/);
      if (vMatch) {
        parts.push(<span key={idx++} className="versicle">{vMatch[1]}</span>);
        remaining = remaining.slice(vMatch[0].length);
      } else if (eMatch) {
        parts.push(
          <span
            key={idx++}
            style={{ fontStyle: 'normal', fontWeight: 500, color: COMPLINE_COLOR_LIGHT }}
          >
            {eMatch[1]}
          </span>
        );
        remaining = remaining.slice(eMatch[0].length);
      } else {
        const next = remaining.search(/<v>|<em>/);
        if (next === -1) {
          parts.push(<span key={idx++}>{remaining}</span>);
          break;
        } else {
          parts.push(<span key={idx++}>{remaining.slice(0, next)}</span>);
          remaining = remaining.slice(next);
        }
      }
    }
    return parts;
  };

  const scrollToBlessing = () => {
    const el = document.getElementById('compline-blessing');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div
      className="night-bg"
      style={{ position: 'fixed', inset: 0, zIndex: 100, overflowY: 'auto', color: 'var(--paper)' }}
      ref={liturgyRef}
    >
      <header
        className="night-bg"
        style={{ position: 'sticky', top: 0, zIndex: 30, borderBottom: '1px solid rgba(107,91,149,0.25)' }}
      >
        <div
          style={{
            maxWidth: '44rem', margin: '0 auto', padding: '1rem 1.5rem',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
            <svg width="22" height="22" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="18" fill="none" stroke={COMPLINE_COLOR_LIGHT} strokeWidth="1" />
              <circle cx="20" cy="20" r="12" fill="none" stroke={COMPLINE_COLOR_LIGHT} strokeWidth="1" />
              <circle cx="20" cy="20" r="6"  fill="none" stroke={COMPLINE_COLOR_LIGHT} strokeWidth="1" />
              <circle cx="20" cy="20" r="2"  fill="var(--gold-2)" />
            </svg>
            <div>
              <div className="sc-bold" style={{ fontSize: 10, color: 'var(--paper)' }}>Compline</div>
              <div className="body" style={{ fontStyle: 'italic', fontSize: '0.78rem', color: 'rgba(246,239,222,0.55)' }}>
                The Night Office · 12 min
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

        {phase === 'liturgy' && (
          <div style={{ maxWidth: '44rem', margin: '0 auto', padding: '0 1.5rem 0.875rem' }}>
            <div className="compline-progress">
              {COMPLINE_SECTIONS.map((s) => {
                const idx = COMPLINE_SECTIONS.findIndex((x) => x.key === s.key);
                const currentIdx = COMPLINE_SECTIONS.findIndex((x) => x.key === currentSectionKey);
                const isCurrent = s.key === currentSectionKey;
                const isRead = idx < currentIdx;
                return (
                  <div
                    key={s.key}
                    className={
                      'compline-progress-dot ' +
                      (isCurrent ? 'current' : '') +
                      (isRead ? ' read' : '')
                    }
                    onClick={() => {
                      const el = document.getElementById(`compline-${s.key}`);
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    title={s.label}
                  />
                );
              })}
              <span
                className="sc"
                style={{ fontSize: 9, color: 'rgba(246,239,222,0.45)', marginLeft: '0.625rem' }}
              >
                + Antiphon
              </span>
            </div>
          </div>
        )}
      </header>

      <main style={{ maxWidth: '44rem', margin: '0 auto', padding: '3rem 1.5rem' }}>
        {/* INTRO */}
        {phase === 'intro' && (
          <div className="fade-in" style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
              <div className="night-breathe" style={{ width: 88, height: 88 }}>
                <Moon size={36} style={{ color: COMPLINE_COLOR_LIGHT }} />
              </div>
            </div>
            <div className="sc-bold" style={{ fontSize: 10, marginBottom: '0.75rem', color: COMPLINE_COLOR_LIGHT }}>
              The Night Office · Liturgy of the Hours
            </div>
            <h1
              className="display-strong"
              style={{ fontSize: 'clamp(2.2rem, 5.5vw, 3.4rem)', lineHeight: 1.06, marginBottom: '1rem', fontWeight: 600 }}
            >
              Compline.
            </h1>
            <div style={{ height: 1, margin: '0 auto 1.5rem', maxWidth: '5rem', background: COMPLINE_COLOR_LIGHT }} />
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
              The Church's last prayer of the day. Twelve minutes that close the day before God —
              examination, hymn, psalmody, and the entrusting of sleep to the One who keeps it.
            </p>
            <p
              className="body"
              style={{
                fontStyle: 'italic',
                fontSize: '0.98rem',
                lineHeight: 1.6,
                maxWidth: '32rem',
                margin: '0 auto 2rem',
                color: 'rgba(246,239,222,0.6)',
              }}
            >
              Monks have prayed it before sleep for fifteen hundred years. The same words. The same
              hour. Across every continent. Tonight — yours, too.
            </p>
            <div
              style={{
                borderLeft: `2px solid ${COMPLINE_COLOR_LIGHT}`,
                padding: '0.5rem 0 0.5rem 1.25rem',
                margin: '0 auto 2rem',
                maxWidth: '30rem',
                textAlign: 'left',
              }}
            >
              <p
                className="display"
                style={{ fontStyle: 'italic', fontSize: '1.08rem', lineHeight: 1.55, color: 'rgba(246,239,222,0.85)' }}
              >
                "Into your hands, O Lord, I commend my spirit."
              </p>
              <p className="sc" style={{ fontSize: 9, marginTop: '0.5rem', color: COMPLINE_COLOR_LIGHT }}>
                The last words of Christ. The last words of every Catholic day.
              </p>
            </div>

            {/* Tonight's antiphon preview */}
            <div
              style={{
                padding: '1.25rem 1.5rem',
                border: '1px solid rgba(215,177,105,0.35)',
                background: 'linear-gradient(180deg, rgba(215,177,105,0.06) 0%, rgba(107,91,149,0.04) 100%)',
                marginBottom: '2rem',
                textAlign: 'left',
              }}
            >
              <div className="sc-bold" style={{ fontSize: 9, color: 'var(--gold-2)', marginBottom: '0.375rem' }}>
                Tonight's Marian Antiphon · {antiphon.season}
              </div>
              <div
                className="display-strong"
                style={{ fontSize: '1.3rem', lineHeight: 1.15, marginBottom: '0.5rem', fontWeight: 600 }}
              >
                {antiphon.name}
              </div>
              <p
                className="body"
                style={{ fontStyle: 'italic', fontSize: '0.88rem', lineHeight: 1.5, color: 'rgba(246,239,222,0.65)' }}
              >
                {antiphon.note}
              </p>
            </div>

            <button
              onClick={() => setPhase('liturgy')}
              className="btn-gold sc-bold"
              style={{
                fontSize: 11, padding: '1rem 1.75rem',
                display: 'inline-flex', alignItems: 'center', gap: '0.75rem', minHeight: 48,
              }}
            >
              <Moon size={14} /> Begin Compline <ArrowRight size={13} />
            </button>
            <p
              className="body"
              style={{ fontStyle: 'italic', fontSize: '0.9rem', marginTop: '1rem', color: 'rgba(246,239,222,0.5)' }}
            >
              Find a quiet place. The Church is waiting to pray with you.
            </p>
          </div>
        )}

        {/* LITURGY — full single-page flow */}
        {phase === 'liturgy' && (
          <div className="fade-in">
            <p
              className="body"
              style={{
                fontStyle: 'italic',
                fontSize: '0.92rem',
                marginBottom: '2.5rem',
                textAlign: 'center',
                color: 'rgba(246,239,222,0.55)',
              }}
            >
              Pray slowly, top to bottom. The dots above track where you are.
            </p>

            {COMPLINE_SECTIONS.map((s, i) => (
              <div
                id={`compline-${s.key}`}
                key={s.key}
                className={s.isBlessing ? 'compline-blessing' : 'compline-section'}
                style={{ '--compline-color': COMPLINE_COLOR }}
              >
                {!s.isBlessing && (
                  <div className="compline-label">
                    {i + 1} · {s.label}
                  </div>
                )}

                {s.isSilence ? (
                  <>
                    <div className="compline-title">{s.title}</div>
                    <ComplineSilence minSeconds={30} />
                    <div className="compline-rubric">{s.rubric}</div>
                  </>
                ) : s.isExamination ? (
                  <>
                    <div className="compline-title">{s.title}</div>
                    <p className="compline-rubric" style={{ marginBottom: '1.25rem' }}>{s.rubric}</p>
                    <textarea
                      className="compline-examination-input"
                      rows={3}
                      placeholder="What burdened you today? (Optional. Private. Nothing is saved.)"
                      value={examination}
                      onChange={(e) => setExamination(e.target.value)}
                    />
                    <ComplineSilence minSeconds={20} />
                  </>
                ) : s.isBlessing ? (
                  <>
                    <div className="sc-bold" style={{ fontSize: 10, marginBottom: '1rem', color: COMPLINE_COLOR_LIGHT }}>
                      The Blessing
                    </div>
                    <h2
                      className="display-strong"
                      style={{
                        fontSize: 'clamp(1.85rem, 4vw, 2.5rem)',
                        lineHeight: 1.1, marginBottom: '1rem',
                        fontWeight: 600, color: 'var(--paper)',
                      }}
                    >
                      {s.title}
                    </h2>
                    <div style={{ height: 1, margin: '0 auto 1.5rem', maxWidth: '4rem', background: COMPLINE_COLOR_LIGHT }} />
                    <p
                      className="display"
                      style={{
                        fontStyle: 'italic',
                        fontSize: 'clamp(1.6rem, 3vw, 2rem)',
                        color: COMPLINE_COLOR_LIGHT,
                        marginBottom: '1rem',
                      }}
                    >
                      {s.prayer}
                    </p>
                    <p
                      className="body"
                      style={{ fontStyle: 'italic', fontSize: '0.92rem', color: 'rgba(246,239,222,0.55)' }}
                    >
                      {s.rubric}
                    </p>
                  </>
                ) : (
                  <>
                    <h3 className="compline-title">{s.title}</h3>
                    {s.prayer && (
                      <p className="compline-prayer">{renderPrayerHTML(s.prayer)}</p>
                    )}
                    {s.rubric && <p className="compline-rubric">{s.rubric}</p>}
                  </>
                )}
              </div>
            ))}

            {/* Marian Antiphon — the warm gold close */}
            <div
              id="compline-antiphon"
              className="marian-antiphon-card"
              style={{ marginTop: '2.5rem' }}
            >
              <div className="sc-bold" style={{ fontSize: 10, color: 'var(--gold-2)', marginBottom: '0.5rem' }}>
                Marian Antiphon · {antiphon.season}
              </div>
              <h2
                className="display-strong"
                style={{
                  fontSize: 'clamp(1.7rem, 3.6vw, 2.3rem)',
                  lineHeight: 1.1, marginBottom: '0.75rem', fontWeight: 600,
                }}
              >
                {antiphon.name}
              </h2>
              <div style={{ height: 1, margin: '0 auto 1.25rem', maxWidth: '4rem', background: 'var(--gold-2)' }} />
              <p
                className="display"
                style={{
                  fontStyle: 'italic',
                  fontSize: 'clamp(1.1rem, 2vw, 1.25rem)',
                  lineHeight: 1.55,
                  color: 'rgba(246,239,222,0.92)',
                  marginBottom: '1rem',
                }}
              >
                {antiphon.text}
              </p>
              <p
                className="body"
                style={{ fontStyle: 'italic', fontSize: '0.85rem', color: 'rgba(246,239,222,0.55)' }}
              >
                {antiphon.note}
              </p>
            </div>

            {/* Final amen */}
            <div style={{ textAlign: 'center', padding: '2.5rem 1.5rem 1rem' }}>
              <button
                onClick={() => onComplete && onComplete()}
                className="btn-gold sc-bold"
                style={{
                  fontSize: 11, padding: '1rem 2rem',
                  display: 'inline-flex', alignItems: 'center', gap: '0.75rem', minHeight: 48,
                }}
              >
                <Check size={14} /> Amen · Sleep in peace
              </button>
              <p
                className="body"
                style={{
                  fontStyle: 'italic',
                  fontSize: '0.92rem',
                  maxWidth: '30rem',
                  margin: '1rem auto 0',
                  color: 'rgba(246,239,222,0.55)',
                }}
              >
                The Church has prayed for you tonight. Mary is awake. He is keeping watch over your sleep.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Bottom nav for the liturgy phase — quick jump to the blessing. */}
      {phase === 'liturgy' && (
        <footer
          className="night-bg"
          style={{ position: 'sticky', bottom: 0, borderTop: '1px solid rgba(107,91,149,0.25)' }}
        >
          <div
            style={{
              maxWidth: '44rem', margin: '0 auto', padding: '0.875rem 1.5rem',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem',
            }}
          >
            <button
              onClick={() => setPhase('intro')}
              className="btn-ghost-dark sc"
              style={{
                fontSize: 10, padding: '0.5rem 0.875rem',
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem', minHeight: 36,
              }}
            >
              <ArrowLeft size={11} /> Back to start
            </button>
            <span className="sc" style={{ fontSize: 9, color: 'rgba(246,239,222,0.55)' }}>
              {COMPLINE_SECTIONS.find((s) => s.key === currentSectionKey)?.label || 'Compline'}
            </span>
            <button
              onClick={scrollToBlessing}
              className="sc"
              style={{
                fontSize: 10, padding: '0.5rem 0.875rem',
                border: `1px solid ${COMPLINE_COLOR_LIGHT}`,
                color: COMPLINE_COLOR_LIGHT,
                background: 'transparent',
                cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                minHeight: 36,
                fontFamily: 'inherit',
              }}
            >
              To the blessing <ArrowRight size={11} />
            </button>
          </div>
        </footer>
      )}
    </div>
  );
}
