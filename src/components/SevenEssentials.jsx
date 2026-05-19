/* =============================================================================
   src/components/SevenEssentials.jsx — The Hub's main body.

   Renders the seven daily essentials as a vertical stack of EssentialBlock
   sections, each with its own per-essential content body:

     I.   SEE   — Today in the Universal Church (saint of the day, Gospel
                  reference, papal intention, season)
     II.  KNOW  — Today's Gospel + four lectio prompts
     III. HEAL  — Five movements of the Carmelite Examen, healing-centered
                  (notice / gratitude / sorrow / intention / hope)
     IV.  ABIDE — Mass / Adoration. The fons et culmen. House of Joy.
                  (Franciscan altar quote + Spiritual Communion fallback)
     V.   GO    — Today's apostolic act + copy-pasteable invitation +
                  copy-pasteable Gospel verse. House of Glory (Ignatian).
     VI.  BUILD — Three-mode preview: family · community · civilization.
     VII. SEND  — The Rosary. Mary as Mother of every House. Universal.

   The page opens with a MiniPath strip — seven small medallions in 3-1-3
   rhythm with ABIDE at the altar in gold. Tapping a medallion scrolls to
   the corresponding EssentialBlock below.

   Compline appears as an evening footer (>= 8pm or before 4am).

   Migrated from the_kingdom.jsx line ~9115. No behavior changes.

   Props:
     completedToday   — array of essential numbers completed today
                        (e.g. [1, 4] means SEE and ABIDE done)
     onPracticeStart  — invoked with (n) when an essential's CTA is tapped
     onCompline       — invoked when the evening Compline button is tapped
     complineDone     — boolean; if true, the Compline button shows "Sleep
                        in peace" with a check
   ============================================================================= */

import { Fragment } from 'react';
import {
  Check, Moon, Eye, BookOpen, Heart, Cross, Footprints, Hammer, Crown,
} from 'lucide-react';
import {
  CHURCH_TODAY,
  DAILY_PRACTICES,
  STEP_COLORS,
  TODAY_GO,
  TODAY_FAMILY,
  TODAY_COMMUNITY,
  TODAY_CIVILIZATION,
  TODAY_BUILD,
  IS_SATURDAY,
} from '@data';
import { toRoman } from '@shared/utils';
import CopyButton from '@shared/CopyButton';
import EssentialBlock from './EssentialBlock.jsx';

export default function SevenEssentials({
  completedToday = [],
  onPracticeStart,
  onCompline,
  complineDone = false,
}) {
  const see = DAILY_PRACTICES.find((p) => p.n === 1);
  const know = DAILY_PRACTICES.find((p) => p.n === 2);
  const heal = DAILY_PRACTICES.find((p) => p.n === 3);
  const abide = DAILY_PRACTICES.find((p) => p.n === 4);
  const go = DAILY_PRACTICES.find((p) => p.n === 5);
  const build = DAILY_PRACTICES.find((p) => p.n === 6);
  const send = DAILY_PRACTICES.find((p) => p.n === 7);

  const hour = new Date().getHours();
  const isEvening = hour >= 20 || hour < 4;

  /* MiniPath — compact horizontal strip at the top of the Hub. Seven small
     medallions in 3-1-3 rhythm, ABIDE marked in gold as the source and
     summit. Visually echoes the Course's HorizontalJourney so the user
     sees one architecture across both tabs. Tappable to scroll to the
     corresponding EssentialBlock below. */
  const MiniPath = () => (
    <div
      style={{
        maxWidth: '44rem',
        margin: '0 auto',
        padding: '1.25rem 1.25rem 1.5rem',
        borderBottom: '1px solid rgba(246,239,222,0.08)',
      }}
    >
      <div
        className="sc-bold"
        style={{
          fontSize: 9,
          color: 'var(--gold-2)',
          marginBottom: '0.875rem',
          letterSpacing: '0.22em',
          textAlign: 'center',
        }}
      >
        Today's Seven
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.25rem',
        }}
      >
        {DAILY_PRACTICES.map((p, i) => {
          const color = STEP_COLORS[p.n];
          const isComplete = completedToday.includes(p.n);
          const isAltar = p.n === 4;
          /* A thin vertical rule before ABIDE (idx 2 → 3) and after ABIDE
             (idx 3 → 4) — visually frames the altar in the 3-1-3 rhythm. */
          return (
            <Fragment key={p.n}>
              {(i === 3 || i === 4) && (
                <div
                  style={{
                    width: 1,
                    height: 18,
                    background: 'rgba(215,177,105,0.30)',
                    margin: '0 0.125rem',
                  }}
                />
              )}
              <button
                onClick={() => {
                  const target = document.querySelector(`[data-essential="${p.n}"]`);
                  if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                aria-label={`${p.verb} — ${p.practice}`}
                style={{
                  position: 'relative',
                  width: isAltar ? 32 : 26,
                  height: isAltar ? 32 : 26,
                  borderRadius: '50%',
                  background: isComplete ? color : 'transparent',
                  border: '1.5px solid ' + (isAltar ? 'var(--gold-2)' : color),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0,
                  boxShadow: isAltar ? '0 0 12px rgba(215,177,105,0.30)' : 'none',
                  padding: 0,
                }}
              >
                {isComplete ? (
                  <Check
                    size={isAltar ? 14 : 11}
                    strokeWidth={2.5}
                    style={{ color: 'var(--paper)' }}
                  />
                ) : (
                  (() => {
                    /* Each essential gets a universally-readable icon —
                       replaces the prior letter-initial (which was abstract
                       for seekers). SEE = Eye, KNOW = BookOpen (Lectio),
                       HEAL = Heart, ABIDE = Cross (Eucharist as the source/
                       summit), GO = Footprints (Ite, missa est), BUILD =
                       Hammer (work), SEND = Crown (Mary, Queen of Heaven;
                       saints making saints). */
                    const PathIcon =
                      p.n === 1
                        ? Eye
                        : p.n === 2
                        ? BookOpen
                        : p.n === 3
                        ? Heart
                        : p.n === 4
                        ? Cross
                        : p.n === 5
                        ? Footprints
                        : p.n === 6
                        ? Hammer
                        : Crown;
                    return (
                      <PathIcon
                        size={isAltar ? 14 : 11}
                        style={{ color: isAltar ? 'var(--gold-2)' : color }}
                      />
                    );
                  })()
                )}
              </button>
            </Fragment>
          );
        })}
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '0.5rem',
          fontSize: 9,
        }}
      >
        <span className="sc" style={{ color: 'rgba(246,239,222,0.40)', letterSpacing: '0.18em' }}>
          3 preparing
        </span>
        <span className="sc" style={{ color: 'var(--gold-2)', letterSpacing: '0.18em' }}>
          at the altar
        </span>
        <span className="sc" style={{ color: 'rgba(246,239,222,0.40)', letterSpacing: '0.18em' }}>
          3 sent forth
        </span>
      </div>
    </div>
  );

  /* SEE block — expanded with Today in the Universal Church content. */
  const SeeContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Saint of the day */}
      <div
        style={{
          padding: '1.25rem',
          background: 'rgba(246,239,222,0.03)',
          border: '1px solid rgba(246,239,222,0.10)',
        }}
      >
        <div
          className="sc-bold"
          style={{ fontSize: 9, color: 'var(--gold-2)', marginBottom: '0.375rem' }}
        >
          Today at the Altar · {CHURCH_TODAY.feast.feastDay}
        </div>
        <h3
          className="display"
          style={{
            fontSize: '1.25rem',
            fontWeight: 500,
            color: 'var(--paper)',
            marginBottom: '0.25rem',
          }}
        >
          {CHURCH_TODAY.feast.name}
        </h3>
        <p
          className="body"
          style={{
            fontStyle: 'italic',
            fontSize: '0.85rem',
            color: 'rgba(246,239,222,0.55)',
            marginBottom: '0.625rem',
          }}
        >
          {CHURCH_TODAY.feast.years}
        </p>
        <p
          className="body"
          style={{ fontSize: '0.95rem', lineHeight: 1.55, color: 'rgba(246,239,222,0.78)' }}
        >
          {CHURCH_TODAY.feast.line}
        </p>
        {CHURCH_TODAY.feast.verse && (
          <p
            className="display"
            style={{
              fontStyle: 'italic',
              fontSize: '0.95rem',
              lineHeight: 1.45,
              color: 'rgba(246,239,222,0.65)',
              marginTop: '0.75rem',
              paddingLeft: '0.875rem',
              borderLeft: '2px solid rgba(215,177,105,0.4)',
            }}
          >
            "{CHURCH_TODAY.feast.verse}"
            <span
              className="sc"
              style={{
                display: 'block',
                fontSize: 9,
                fontStyle: 'normal',
                color: 'var(--gold-2)',
                marginTop: '0.25rem',
              }}
            >
              {CHURCH_TODAY.feast.verseRef}
            </span>
          </p>
        )}
      </div>

      {/* Today's Gospel reference */}
      <div
        style={{
          padding: '1rem 0',
          borderBottom: '1px solid rgba(246,239,222,0.08)',
          borderTop: '1px solid rgba(246,239,222,0.08)',
        }}
      >
        <div
          className="sc-bold"
          style={{ fontSize: 9, color: 'var(--wine-2)', marginBottom: '0.25rem' }}
        >
          Today's Gospel
        </div>
        <p
          className="display"
          style={{ fontSize: '1.05rem', color: 'var(--paper)', marginBottom: '0.25rem' }}
        >
          {CHURCH_TODAY.readings.gospel.ref}
        </p>
        <p
          className="body"
          style={{
            fontStyle: 'italic',
            fontSize: '0.88rem',
            color: 'rgba(246,239,222,0.55)',
          }}
        >
          {CHURCH_TODAY.readings.gospel.blurb}
        </p>
      </div>

      {/* Papal intention + season */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
        <div>
          <div
            className="sc-bold"
            style={{ fontSize: 9, color: 'rgba(92,122,58,0.85)' }}
          >
            Pope's Intention · {CHURCH_TODAY.papalIntention.month}
          </div>
          <p
            className="body"
            style={{
              fontSize: '0.92rem',
              color: 'rgba(246,239,222,0.7)',
              marginTop: '0.25rem',
            }}
          >
            {CHURCH_TODAY.papalIntention.text}
          </p>
        </div>
        <div
          className="sc"
          style={{
            fontSize: 9,
            color: 'rgba(246,239,222,0.45)',
            marginTop: '0.5rem',
          }}
        >
          {CHURCH_TODAY.season} · {CHURCH_TODAY.rank}
        </div>
      </div>
    </div>
  );

  /* KNOW block — show today's Gospel text in full + four lectio prompts. */
  const KnowContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div
        style={{
          padding: '1.25rem',
          background: 'rgba(246,239,222,0.03)',
          border: '1px solid rgba(246,239,222,0.10)',
        }}
      >
        <div
          className="sc-bold"
          style={{ fontSize: 9, color: STEP_COLORS[2], marginBottom: '0.375rem' }}
        >
          {CHURCH_TODAY.readings.gospel.ref}
        </div>
        <p
          className="display"
          style={{
            fontStyle: 'italic',
            fontSize: '1rem',
            lineHeight: 1.55,
            color: 'rgba(246,239,222,0.85)',
          }}
        >
          {CHURCH_TODAY.readings.gospel.text}
        </p>
      </div>
      <ul
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          margin: 0,
          padding: 0,
          listStyle: 'none',
        }}
      >
        {[
          { sc: 'Lectio',       line: 'Read it slowly. Where does it pause you?' },
          { sc: 'Meditatio',    line: 'What word, what image, what phrase rises?' },
          { sc: 'Oratio',       line: 'Speak to him from there.' },
          { sc: 'Contemplatio', line: 'Then sit. Let him speak back, in silence.' },
        ].map((m, i) => (
          <li
            key={i}
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '0.75rem',
              padding: '0.5rem 0',
            }}
          >
            <span
              className="sc-bold"
              style={{
                fontSize: 9,
                color: STEP_COLORS[2],
                minWidth: '5.5rem',
                letterSpacing: '0.18em',
              }}
            >
              {m.sc}
            </span>
            <span
              className="body"
              style={{
                fontStyle: 'italic',
                fontSize: '0.92rem',
                lineHeight: 1.5,
                color: 'rgba(246,239,222,0.72)',
              }}
            >
              {m.line}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );

  /* HEAL block — five movements of the Carmelite Examen, healing-centered.
     The Hub's HEAL essential is named for healing, not review (Ignatian).
     Teresa of Ávila's Interior Castle frames the same five-step structure
     as a movement of interior healing. Same shape; different emphasis. */
  const HealContent = () => (
    <ul
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        margin: 0,
        padding: 0,
        listStyle: 'none',
      }}
    >
      {[
        { n: 1, name: 'Notice',    line: 'Where did love stir today? Where did it fail?' },
        { n: 2, name: 'Gratitude', line: 'What grace was given — even where you did not see it?' },
        { n: 3, name: 'Sorrow',    line: 'What wound surfaced today, in you or through you?' },
        { n: 4, name: 'Intention', line: 'What will you bring to Christ for healing?' },
        { n: 5, name: 'Hope',      line: 'Sleep in his peace. He heals in the dark.' },
      ].map((m) => (
        <li
          key={m.n}
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: '0.75rem',
            padding: '0.5rem 0',
            borderBottom: '1px solid rgba(246,239,222,0.06)',
          }}
        >
          <span
            className="sc-bold"
            style={{ fontSize: 9, color: STEP_COLORS[3], minWidth: '1.5rem' }}
          >
            {toRoman(m.n)}
          </span>
          <span style={{ flex: 1, minWidth: 0 }}>
            <span
              className="display"
              style={{ fontSize: '1rem', color: 'var(--paper)', display: 'block' }}
            >
              {m.name}
            </span>
            <span
              className="body"
              style={{
                fontStyle: 'italic',
                fontSize: '0.88rem',
                lineHeight: 1.5,
                color: 'rgba(246,239,222,0.6)',
              }}
            >
              {m.line}
            </span>
          </span>
        </li>
      ))}
    </ul>
  );

  /* ABIDE block — Mass / Adoration. ABIDE is now formally aligned with
     the House of Joy (Franciscan), reflecting Francis's foundational
     contribution to how the Western Church approaches the altar. He
     standardized the Roman Rite. He brought adoration into the streets.
     He taught the West to kneel before the host. To see the Mass in a
     Franciscan way is to see it in the most universal way — with humility
     before the bread that is God hiding himself, the manger and the altar
     as the same act. Universality through humility, not enclosure. */
  const AbideContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div
        style={{
          padding: '1rem 1.25rem',
          borderLeft: '2px solid #5C7A3A',
          background: 'rgba(92,122,58,0.06)',
        }}
      >
        <div
          className="sc-bold"
          style={{
            fontSize: 9,
            color: '#7A9B4D',
            marginBottom: '0.5rem',
            letterSpacing: '0.18em',
          }}
        >
          The Franciscan altar · House of Joy
        </div>
        <p
          className="display"
          style={{
            fontStyle: 'italic',
            fontSize: '0.98rem',
            lineHeight: 1.55,
            color: 'rgba(246,239,222,0.85)',
          }}
        >
          Christ humbles himself in the host as he humbled himself in the manger.
        </p>
        <p
          className="body"
          style={{
            fontStyle: 'italic',
            fontSize: '0.85rem',
            lineHeight: 1.55,
            color: 'rgba(246,239,222,0.6)',
            marginTop: '0.625rem',
          }}
        >
          Francis gave the Eucharist to the whole Church — standardizing the Roman Rite, bringing
          adoration into the streets, teaching the West to kneel before the host. To approach this
          altar in his way is to approach it in the most universal way: with humility, with wonder,
          with the joy that endured the cross. <em>For the joy set before him.</em>
        </p>
      </div>

      {/* Spiritual Communion — for those who cannot go today */}
      <div
        style={{
          padding: '1.25rem',
          background: 'rgba(215,177,105,0.06)',
          border: '1px solid rgba(215,177,105,0.20)',
        }}
      >
        <div
          className="sc-bold"
          style={{ fontSize: 9, color: 'var(--gold-2)', marginBottom: '0.5rem' }}
        >
          When you cannot go
        </div>
        <p
          className="display"
          style={{
            fontStyle: 'italic',
            fontSize: '1rem',
            lineHeight: 1.55,
            color: 'rgba(246,239,222,0.85)',
          }}
        >
          "My Jesus, I believe that you are present in the Most Holy Sacrament. I love you above all
          things, and I desire to receive you into my soul. Since I cannot at this moment receive you
          sacramentally, come at least spiritually into my heart. I embrace you as if you were
          already there, and unite myself wholly to you. Never permit me to be separated from you.
          Amen."
        </p>
        <p
          className="sc"
          style={{
            fontSize: 9,
            color: 'var(--gold-2)',
            marginTop: '0.625rem',
            letterSpacing: '0.18em',
          }}
        >
          Spiritual Communion · St. Alphonsus Liguori
        </p>
      </div>
    </div>
  );

  /* GO block — today's apostolic act with copy-pasteable invitation
     and today's Gospel verse. The user can complete the act without
     opening the modal: tap "Copy invitation" and "Copy Gospel verse"
     and send.

     GO is now formally aligned with the House of Glory (Ignatian).
     The Jesuits are the missionary order par excellence — Francis Xavier,
     the reductions, *Ad maiorem Dei gloriam*, the fourth vow of mission.
     The Spiritual Exercises culminate in *Contemplatio ad Amorem* —
     going outward to find God in all things. Pope Francis (a Jesuit)
     wrote *Evangelii Gaudium* on missionary discipleship. Glory = GO
     reflects the actual charism more accurately than any other pairing. */
  const GoContent = () => {
    const goColor = STEP_COLORS[5];
    const verseShare = `${CHURCH_TODAY.readings.gospel.blurb} (${CHURCH_TODAY.readings.gospel.ref})`;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div
          style={{
            padding: '1rem 1.25rem',
            borderLeft: '2px solid ' + goColor,
            background: 'rgba(74,95,126,0.06)',
          }}
        >
          <div
            className="sc-bold"
            style={{
              fontSize: 9,
              color: goColor,
              marginBottom: '0.375rem',
              letterSpacing: '0.18em',
            }}
          >
            The Ignatian going forth · House of Glory
          </div>
          <p
            className="body"
            style={{
              fontStyle: 'italic',
              fontSize: '0.85rem',
              lineHeight: 1.55,
              color: 'rgba(246,239,222,0.65)',
            }}
          >
            <em>Ite, missa est. Ad maiorem Dei gloriam.</em> The Mass is ended; go to the
            peripheries. Francis Xavier crossed oceans for one soul. So can you, in one
            conversation, today.
          </p>
        </div>
        <div
          style={{
            padding: '1.25rem',
            background: 'rgba(246,239,222,0.03)',
            border: '1px solid rgba(246,239,222,0.10)',
          }}
        >
          <div
            className="sc-bold"
            style={{ fontSize: 9, color: goColor, marginBottom: '0.5rem' }}
          >
            Today's act
          </div>
          <h3
            className="display"
            style={{
              fontSize: '1.15rem',
              fontWeight: 500,
              color: 'var(--paper)',
              marginBottom: '0.5rem',
            }}
          >
            {TODAY_GO.primary}
          </h3>
          <p
            className="body"
            style={{ fontSize: '0.92rem', lineHeight: 1.55, color: 'rgba(246,239,222,0.7)' }}
          >
            {TODAY_GO.detail}
          </p>
        </div>

        {/* Today's Gospel — for "Go and proclaim the gospel". Always present. */}
        <div
          style={{
            padding: '1rem 1.25rem',
            borderLeft: '2px solid ' + goColor,
            background: 'rgba(246,239,222,0.02)',
          }}
        >
          <div
            className="sc-bold"
            style={{
              fontSize: 9,
              color: goColor,
              marginBottom: '0.375rem',
              letterSpacing: '0.18em',
            }}
          >
            Today's Gospel · {CHURCH_TODAY.readings.gospel.ref}
          </div>
          <p
            className="display"
            style={{
              fontStyle: 'italic',
              fontSize: '0.95rem',
              lineHeight: 1.5,
              color: 'rgba(246,239,222,0.82)',
              marginBottom: '0.875rem',
            }}
          >
            "{CHURCH_TODAY.readings.gospel.blurb}"
          </p>
          <CopyButton text={verseShare} label="Copy Gospel" color={goColor} />
        </div>

        {/* Copy-pasteable invitation — when applicable for today's prompt. */}
        {TODAY_GO.share && (
          <div
            style={{
              padding: '1rem 1.25rem',
              background: 'rgba(246,239,222,0.03)',
              border: '1px solid rgba(246,239,222,0.10)',
            }}
          >
            <div
              className="sc-bold"
              style={{
                fontSize: 9,
                color: goColor,
                marginBottom: '0.375rem',
                letterSpacing: '0.18em',
              }}
            >
              Send to someone — if it fits
            </div>
            <p
              className="body"
              style={{
                fontStyle: 'italic',
                fontSize: '0.92rem',
                lineHeight: 1.5,
                color: 'rgba(246,239,222,0.78)',
                marginBottom: '0.875rem',
              }}
            >
              "{TODAY_GO.share}"
            </p>
            <CopyButton text={TODAY_GO.share} label="Copy message" color={goColor} />
          </div>
        )}
      </div>
    );
  };

  /* BUILD block — three dimensions visible every day; the day's emphasis
     rotates per FINAL_CONTENT_REVISION_PLAN §2.2. Saturday and Sunday
     show a banner instead of an emphasis on a single dimension; Friday
     emphasizes Community with the penitential framing. */
  const BuildContent = () => {
    const dimensions = [
      { key: 'family',       label: 'Family',                              data: TODAY_FAMILY },
      { key: 'community',    label: `Community · ${TODAY_COMMUNITY.kind}`, data: TODAY_COMMUNITY },
      { key: 'civilization', label: 'Civilization',                        data: TODAY_CIVILIZATION },
    ];
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {TODAY_BUILD.banner && (
          <div
            className="sc-bold"
            style={{
              fontSize: 9,
              letterSpacing: '0.18em',
              color: 'var(--gold-2)',
              padding: '0.75rem 1rem',
              background: 'rgba(215,177,105,0.06)',
              border: '1px solid rgba(215,177,105,0.20)',
            }}
          >
            {TODAY_BUILD.banner}
          </div>
        )}
        {dimensions.map((d) => {
          const isEmphasized = TODAY_BUILD.emphasis === d.key;
          return (
            <div
              key={d.key}
              style={{
                position: 'relative',
                padding: '0.875rem 1rem',
                paddingLeft: isEmphasized ? 'calc(1rem + 2px)' : '1rem',
                background: isEmphasized ? 'rgba(215,177,105,0.07)' : 'rgba(246,239,222,0.03)',
                border: '1px solid ' + (isEmphasized ? 'rgba(215,177,105,0.32)' : 'rgba(246,239,222,0.10)'),
              }}
            >
              {isEmphasized && (
                <div
                  aria-hidden
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: 2,
                    background: 'var(--gold)',
                  }}
                />
              )}
              <div
                className="sc-bold"
                style={{
                  fontSize: 9,
                  color: isEmphasized ? 'var(--gold-2)' : '#B8915C',
                  marginBottom: '0.25rem',
                  letterSpacing: '0.18em',
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  columnGap: '0.5rem',
                }}
              >
                <span>{d.label}</span>
                {isEmphasized && (
                  <span style={{ color: 'var(--gold-2)', opacity: 0.85 }}>
                    · Today's focus
                  </span>
                )}
              </div>
              <p
                className="body"
                style={{
                  fontSize: '0.88rem',
                  lineHeight: 1.45,
                  color: isEmphasized ? 'rgba(246,239,222,0.82)' : 'rgba(246,239,222,0.7)',
                }}
              >
                <strong style={{ color: 'var(--paper)', fontWeight: 500 }}>{d.data.name}.</strong>{' '}
                {d.data.do}
              </p>
            </div>
          );
        })}
      </div>
    );
  };

  /* SEND block — the Rosary, prayed for souls. SEND remains universal —
     Mary is the Mother of the whole Church, not the patroness of one
     charism. Every House prays the Rosary. The bookend symmetry: SEE
     opens the day in the universal Church, SEND closes it with Mary
     who belongs to every tradition. */
  const SendContent = () => {
    const sendColor = STEP_COLORS[7];
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div
          style={{
            padding: '1rem 1.25rem',
            borderLeft: '2px solid ' + sendColor,
            background: 'rgba(61,52,80,0.10)',
          }}
        >
          <div
            className="sc-bold"
            style={{
              fontSize: 9,
              color: 'rgba(184,164,217,0.9)',
              marginBottom: '0.5rem',
              letterSpacing: '0.18em',
            }}
          >
            {IS_SATURDAY ? 'Marian Saturday · Mother of every House' : 'Mary, Mother of every House'}
          </div>
          <p
            className="body"
            style={{
              fontStyle: 'italic',
              fontSize: '0.85rem',
              lineHeight: 1.55,
              color: 'rgba(246,239,222,0.65)',
            }}
          >
            The Rosary belongs to no single charism — Dominican, Carmelite, Benedictine, Franciscan,
            Ignatian. Mary belongs to every House because she is Mother of the whole Church. The
            Rosary is the prayer the saints made universal.
          </p>
        </div>

        <div
          style={{
            padding: '1.25rem',
            background: 'rgba(246,239,222,0.03)',
            borderLeft: '2px solid ' + sendColor,
          }}
        >
          <div
            className="sc-bold"
            style={{
              fontSize: 9,
              color: sendColor,
              marginBottom: '0.5rem',
              letterSpacing: '0.18em',
            }}
          >
            For whom you are praying today
          </div>
          <p
            className="body"
            style={{
              fontStyle: 'italic',
              fontSize: '0.95rem',
              lineHeight: 1.6,
              color: 'rgba(246,239,222,0.82)',
            }}
          >
            For your family, your friends, your parish.
            For those who carry burdens you cannot see.
            For one who does not yet believe — by name.
            For the dying, that they may be received.
            For the salvation of all souls.
          </p>
        </div>

        <div
          style={{
            padding: '0.875rem 1rem',
            background: 'rgba(246,239,222,0.02)',
            border: '1px solid rgba(246,239,222,0.08)',
          }}
        >
          <p
            className="body"
            style={{
              fontStyle: 'italic',
              fontSize: '0.88rem',
              lineHeight: 1.55,
              color: 'rgba(246,239,222,0.62)',
            }}
          >
            <span
              className="sc-bold"
              style={{
                fontSize: 9,
                color: sendColor,
                letterSpacing: '0.18em',
                display: 'block',
                marginBottom: '0.25rem',
              }}
            >
              With others, if possible
            </span>
            Even one decade — or one Hail Mary — prayed with someone else counts. A child before bed,
            a spouse in the morning, a friend on the phone. The rest can be prayed alone. The
            kingdom multiplies through prayer prayed together.
          </p>
        </div>
      </div>
    );
  };

  // ---- Main render ---------------------------------------------------------
  return (
    <div className="ink-bg" style={{ color: 'var(--paper)', paddingBottom: '2rem' }}>
      <MiniPath />

      <EssentialBlock
        practice={see}
        isComplete={completedToday.includes(1)}
        romanNumeral="I"
        onStart={() => onPracticeStart && onPracticeStart(1)}
      >
        <SeeContent />
      </EssentialBlock>

      <EssentialBlock
        practice={know}
        isComplete={completedToday.includes(2)}
        romanNumeral="II"
        onStart={() => onPracticeStart && onPracticeStart(2)}
      >
        <KnowContent />
      </EssentialBlock>

      <EssentialBlock
        practice={heal}
        isComplete={completedToday.includes(3)}
        romanNumeral="III"
        onStart={() => onPracticeStart && onPracticeStart(3)}
      >
        <HealContent />
      </EssentialBlock>

      <EssentialBlock
        practice={abide}
        isComplete={completedToday.includes(4)}
        isAltar
        romanNumeral="IV"
        onStart={() => onPracticeStart && onPracticeStart(4)}
      >
        <AbideContent />
      </EssentialBlock>

      <EssentialBlock
        practice={go}
        isComplete={completedToday.includes(5)}
        romanNumeral="V"
        onStart={() => onPracticeStart && onPracticeStart(5)}
      >
        <GoContent />
      </EssentialBlock>

      <EssentialBlock
        practice={build}
        isComplete={completedToday.includes(6)}
        romanNumeral="VI"
        onStart={() => onPracticeStart && onPracticeStart(6)}
      >
        <BuildContent />
      </EssentialBlock>

      <EssentialBlock
        practice={send}
        isComplete={completedToday.includes(7)}
        romanNumeral="VII"
        onStart={() => onPracticeStart && onPracticeStart(7)}
      >
        <SendContent />
      </EssentialBlock>

      {/* Tagline — the architectural truth. */}
      <div
        style={{
          maxWidth: '44rem',
          margin: '0 auto',
          padding: '2rem 1.25rem 1rem',
          textAlign: 'center',
        }}
      >
        <p
          className="display"
          style={{
            fontStyle: 'italic',
            fontSize: '1rem',
            color: 'var(--gold-2)',
            lineHeight: 1.5,
          }}
        >
          Three preparing. One at the altar. Three sent forth.
        </p>
      </div>

      {/* Compline — surfaces in the evening (>=20:00 or <04:00). */}
      {isEvening && (
        <div
          style={{
            maxWidth: '44rem',
            margin: '0 auto',
            padding: '2rem 1.25rem',
            textAlign: 'center',
            borderTop: '1px solid rgba(107,91,149,0.25)',
          }}
        >
          <div
            className="sc-bold"
            style={{
              fontSize: 9,
              color: 'rgba(184,164,217,0.85)',
              marginBottom: '0.875rem',
            }}
          >
            When the day ends
          </div>
          <button
            onClick={onCompline}
            className="sc"
            style={{
              fontSize: 11,
              padding: '0.875rem 1.5rem',
              border: '1px solid #6B5B95',
              background: complineDone ? 'rgba(107,91,149,0.15)' : 'transparent',
              color: '#B8A4D9',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.625rem',
              minHeight: 44,
              width: '100%',
              maxWidth: '20rem',
              justifyContent: 'center',
              fontFamily: 'inherit',
            }}
          >
            <Moon size={13} />
            {complineDone ? 'Compline prayed · Sleep in peace' : 'End the day with Compline'}
            {complineDone && <Check size={11} strokeWidth={3} />}
          </button>
          <p
            className="body"
            style={{
              fontStyle: 'italic',
              fontSize: '0.85rem',
              marginTop: '0.625rem',
              color: 'rgba(246,239,222,0.5)',
            }}
          >
            The Church's last prayer of the day.
          </p>
        </div>
      )}
    </div>
  );
}
