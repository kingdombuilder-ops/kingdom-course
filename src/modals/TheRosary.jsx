/* =============================================================================
   src/modals/TheRosary.jsx — SEND · Mary's prayer for the salvation of souls.

   The seventh and final daily essential. Five mysteries × ten Hail Marys per
   decade × the punctuating Our Father / Glory Be / Fátima prayer. Twenty
   minutes traditionally; the user can move at any pace. Today's mystery
   set is suggested by day-of-week, but the user can choose any.

   Migrated from the_kingdom.jsx line ~10339. The big static data tables
   (ROSARY_PRAYERS at line 10210, MYSTERY_SETS at line 10220) and the
   suggestedMysteryKey() helper (line 10328) all move into this file —
   nothing else uses them.

   The phase machine has four levels:
     phase: intro | opening | mystery | closing
     openingStep: 0..4   (within "opening")
     mysteryIndex: 0..4  (which of the five mysteries we are in)
     subPhase: announce | ourFather | hailMarys | gloryBe | fatima
     hailMaryIndex: 0..9 (within "hailMarys")

   The advance/retreat helpers walk this state forward and back. Tapping
   any bead in the strip jumps to that bead within the current mystery —
   the user can rewind a Hail Mary, replay an Our Father, etc.

   One observation about behavior preserved from source: the `intention`
   text field on the intro phase captures who the user is praying for
   (a name, a list, "all souls"). This input is never displayed back to
   the user during the prayer — it lives only as state. That's intentional:
   the act of typing the intention sets it in the user's mind; the prayer
   itself is then offered for that intention without further reminder.

   Props:
     onComplete()  — caller marks essential VII complete and closes
     onClose()     — caller closes without marking complete
   ============================================================================= */

import { useState } from 'react';
import { X, ArrowRight, ArrowLeft, Check, Heart, Crown } from 'lucide-react';

// ---- ROSARY_PRAYERS ------------------------------------------------------
// The fixed prayer texts. Translations of the traditional Latin originals;
// these renderings match the wording used by the USCCB.
const ROSARY_PRAYERS = {
  signOfCross:
    'In the name of the Father, and of the Son, and of the Holy Spirit. Amen.',
  apostlesCreed:
    'I believe in God, the Father almighty, Creator of heaven and earth, ' +
    'and in Jesus Christ, his only Son, our Lord, who was conceived by the Holy Spirit, ' +
    'born of the Virgin Mary, suffered under Pontius Pilate, was crucified, died and was buried; ' +
    'he descended into hell; on the third day he rose again from the dead; ' +
    'he ascended into heaven, and is seated at the right hand of God the Father almighty; ' +
    'from there he will come to judge the living and the dead. ' +
    'I believe in the Holy Spirit, the holy catholic Church, the communion of saints, ' +
    'the forgiveness of sins, the resurrection of the body, and life everlasting. Amen.',
  ourFather:
    'Our Father, who art in heaven, hallowed be thy name; thy kingdom come, ' +
    'thy will be done on earth as it is in heaven. ' +
    'Give us this day our daily bread, and forgive us our trespasses, ' +
    'as we forgive those who trespass against us; and lead us not into temptation, ' +
    'but deliver us from evil. Amen.',
  hailMary:
    'Hail Mary, full of grace, the Lord is with thee. Blessed art thou amongst women, ' +
    'and blessed is the fruit of thy womb, Jesus. ' +
    'Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen.',
  gloryBe:
    'Glory be to the Father, and to the Son, and to the Holy Spirit. ' +
    'As it was in the beginning, is now, and ever shall be, world without end. Amen.',
  fatima:
    'O my Jesus, forgive us our sins, save us from the fires of hell, ' +
    'lead all souls to heaven, especially those most in need of thy mercy.',
  hailHolyQueen:
    'Hail, holy Queen, Mother of mercy, our life, our sweetness and our hope. ' +
    'To thee do we cry, poor banished children of Eve. ' +
    'To thee do we send up our sighs, mourning and weeping in this valley of tears. ' +
    'Turn then, most gracious advocate, thine eyes of mercy toward us, ' +
    'and after this our exile, show unto us the blessed fruit of thy womb, Jesus. ' +
    'O clement, O loving, O sweet Virgin Mary. Pray for us, O holy Mother of God, ' +
    'that we may be made worthy of the promises of Christ. Amen.',
};

// ---- MYSTERY_SETS -------------------------------------------------------
// The four sets of mysteries. Each set has five mysteries; each mystery
// has a Scripture reference, a "fruit" (the spiritual virtue traditionally
// associated with the mystery), a scene description, and a meditation
// prompt that personalizes the mystery to the user's day.
const MYSTERY_SETS = {
  joyful: {
    key: 'joyful',
    name: 'Joyful Mysteries',
    days: ['Mon', 'Sat'],
    color: '#D7B169',
    tint: 'rgba(215,177,105,0.10)',
    glow: 'rgba(215,177,105,0.45)',
    framing:
      'The mysteries of the Incarnation. The Word becomes flesh. God enters the world as a child, ' +
      'and Mary stands at the heart of it.',
    mysteries: [
      {
        n: 1, name: 'The Annunciation', scripture: 'Luke 1:26–38', fruit: 'Humility',
        scene:
          'The angel Gabriel appears to a young woman in Nazareth. She is told she will bear the Son of God. ' +
          "She answers: 'Be it done unto me according to thy word.'",
        meditation: "Mary's yes opens the door for everything. What is God asking of you that requires a yes?",
      },
      {
        n: 2, name: 'The Visitation', scripture: 'Luke 1:39–56', fruit: 'Charity',
        scene:
          'Mary travels in haste to her cousin Elizabeth. The unborn John leaps in the womb. ' +
          "Elizabeth proclaims: 'Blessed art thou among women.' Mary answers: 'My soul magnifies the Lord.'",
        meditation: 'Charity moves quickly. Whose joy is yours to magnify today?',
      },
      {
        n: 3, name: 'The Nativity', scripture: 'Luke 2:1–20', fruit: 'Poverty of spirit',
        scene:
          'There is no room at the inn. The Son of God is born in a stable, laid in a feeding trough, ' +
          'surrounded by animals. The shepherds — the lowest in the social order — are the first to come.',
        meditation: 'God enters the world poor. Where in your poverty is he waiting to enter?',
      },
      {
        n: 4, name: 'The Presentation', scripture: 'Luke 2:22–38', fruit: 'Obedience',
        scene:
          'Mary and Joseph bring the infant Jesus to the temple. ' +
          "Simeon takes him in his arms and prophesies: 'A sword will pierce your own soul.' " +
          'Anna gives thanks. The kingdom is announced before it begins.',
        meditation:
          'The sword foretold. Obedience is not simple — it costs. What costly obedience is asked of you?',
      },
      {
        n: 5, name: 'The Finding in the Temple', scripture: 'Luke 2:41–52', fruit: 'Joy in finding Christ',
        scene:
          'At twelve, Jesus is lost for three days. Mary and Joseph search in anguish. ' +
          "They find him in his Father's house, teaching the elders. He returns with them and is obedient.",
        meditation: 'Sometimes Christ is hidden. The seeking is itself the formation. Where are you searching?',
      },
    ],
  },
  sorrowful: {
    key: 'sorrowful',
    name: 'Sorrowful Mysteries',
    days: ['Tue', 'Fri'],
    color: '#8C2A2A',
    tint: 'rgba(140,42,42,0.10)',
    glow: 'rgba(140,42,42,0.45)',
    framing:
      'The mysteries of the Passion. The Son of God walks toward the cross — not because he must, ' +
      'but because love does.',
    mysteries: [
      {
        n: 1, name: 'The Agony in the Garden', scripture: 'Matthew 26:36–46', fruit: 'Sorrow for sin',
        scene:
          'In Gethsemane, Jesus prays alone. The disciples sleep. He sees what is coming. ' +
          "He sweats blood. He prays: 'Not my will, but thine, be done.'",
        meditation: 'The deepest yes is said in the dark. What yes is being asked of you in the dark?',
      },
      {
        n: 2, name: 'The Scourging at the Pillar', scripture: 'John 19:1', fruit: 'Purity',
        scene:
          'He is bound to a pillar and beaten by Roman soldiers. The flesh that bore the Word is torn open. ' +
          'He says nothing.',
        meditation:
          'Christ bore in his body the sins he never committed. ' +
          'What burden are you carrying that is not yours alone?',
      },
      {
        n: 3, name: 'The Crowning with Thorns', scripture: 'Matthew 27:27–31', fruit: 'Courage',
        scene:
          "They press a crown of thorns onto his head. They mock him: 'Hail, King of the Jews.' " +
          'They strike him. He is silent.',
        meditation:
          'The true King is mocked. Courage is to stand inside that mockery without retreating into rage.',
      },
      {
        n: 4, name: 'The Carrying of the Cross', scripture: 'Luke 23:26–32', fruit: 'Patience',
        scene:
          'The cross presses on his torn back. He falls — three times. Simon of Cyrene is forced to help. ' +
          'Veronica wipes his face. The women of Jerusalem weep. He keeps walking.',
        meditation:
          'He fell, and rose, and fell, and rose. The path is rarely a straight line. ' +
          'Where do you need to stand up again?',
      },
      {
        n: 5, name: 'The Crucifixion', scripture: 'Luke 23:33–46', fruit: 'Perseverance',
        scene:
          'They nail him to the wood. He forgives the soldiers. He gives Mary to John, and John to Mary. ' +
          "He cries: 'It is finished.' He breathes his last. The veil of the temple is torn in two.",
        meditation:
          'It is finished. The world is changed. Sit at the foot of the cross with Mary and let what ' +
          'needs to die in you, die.',
      },
    ],
  },
  glorious: {
    key: 'glorious',
    name: 'Glorious Mysteries',
    days: ['Wed', 'Sun'],
    color: '#5C7A3A',
    tint: 'rgba(92,122,58,0.10)',
    glow: 'rgba(92,122,58,0.45)',
    framing:
      'The mysteries of victory. Christ is risen. The kingdom breaks open. ' +
      'Death itself has been defeated, and the Church goes out into the world.',
    mysteries: [
      {
        n: 1, name: 'The Resurrection', scripture: 'Matthew 28:1–10', fruit: 'Faith',
        scene:
          'On the third day, the women come to the tomb. The stone is rolled away. ' +
          "An angel says: 'He is not here. He is risen.' The world is permanently changed.",
        meditation:
          'Death has lost. Resurrection is not a metaphor — it is the most concrete fact in history. ' +
          'What in you needs to rise?',
      },
      {
        n: 2, name: 'The Ascension', scripture: 'Acts 1:6–11', fruit: 'Hope of heaven',
        scene:
          'Forty days later, Jesus blesses his disciples and is taken up into heaven. ' +
          "The angels say: 'He will come again.' The disciples return to Jerusalem with great joy.",
        meditation:
          'He has gone ahead to prepare a place. Heaven is not ethereal — it is your destination. ' +
          'What does it mean to live as if you knew that?',
      },
      {
        n: 3, name: 'The Descent of the Holy Spirit', scripture: 'Acts 2:1–13', fruit: 'Love of God',
        scene:
          'On Pentecost, the disciples are in the upper room. A sound like a mighty wind. ' +
          'Tongues of fire over each head. They go out and proclaim the gospel in every language. ' +
          'Three thousand are baptized that day.',
        meditation:
          'The Spirit fell on ordinary fishermen and made them apostles. The same Spirit is in you. ' +
          'What is he asking?',
      },
      {
        n: 4, name: 'The Assumption of Mary', scripture: 'Revelation 12:1', fruit: 'Grace of a holy death',
        scene:
          'At the end of her earthly life, Mary is taken body and soul into heaven. ' +
          'The first disciple of Christ, the Mother of God, is given the firstfruits of the resurrection.',
        meditation:
          'What is promised to her is promised to the whole Body. ' +
          'She has gone where you are called to follow.',
      },
      {
        n: 5, name: 'The Coronation of Mary', scripture: 'Revelation 12:1', fruit: "Trust in Mary's intercession",
        scene:
          'Mary is crowned Queen of Heaven and Earth. She does not lord it over the kingdom — ' +
          'she intercedes for it. From her throne she prays for every soul in every age.',
        meditation:
          'She is praying for you right now. ' +
          'What would you ask the Queen Mother to bring to her Son on your behalf?',
      },
    ],
  },
  luminous: {
    key: 'luminous',
    name: 'Luminous Mysteries',
    days: ['Thu'],
    color: '#4A5F7E',
    tint: 'rgba(74,95,126,0.10)',
    glow: 'rgba(74,95,126,0.45)',
    framing:
      'The mysteries of light. Five moments from Christ\u2019s public ministry where the kingdom of ' +
      'heaven became visible on earth.',
    mysteries: [
      {
        n: 1, name: 'The Baptism of Jesus', scripture: 'Matthew 3:13–17', fruit: 'Openness to the Holy Spirit',
        scene:
          'Jesus comes to John in the Jordan. The heavens open. The Spirit descends like a dove. ' +
          "The Father's voice: 'This is my beloved Son, with whom I am well pleased.'",
        meditation:
          'The Trinity revealed. The Father is pleased with you, too — beloved son or daughter. Sit with that.',
      },
      {
        n: 2, name: 'The Wedding at Cana', scripture: 'John 2:1–11', fruit: "Trust in Mary's intercession",
        scene:
          "At a wedding feast, the wine runs out. Mary notices. She tells him. He says: 'My hour has not yet come.' " +
          "She turns to the servants: 'Do whatever he tells you.' Water becomes wine. The first sign.",
        meditation:
          'Mary saw the need before it was named. Her instruction is the same to you: do whatever he tells you.',
      },
      {
        n: 3, name: 'The Proclamation of the Kingdom', scripture: 'Mark 1:14–15', fruit: 'Conversion of heart',
        scene:
          'Jesus walks the roads of Galilee, healing, teaching, casting out demons. ' +
          "The kingdom of God is breaking in. He calls: 'Repent, and believe in the gospel.'",
        meditation:
          'The kingdom is at hand. Where does it want to break in to your life — and what stands in its way?',
      },
      {
        n: 4, name: 'The Transfiguration', scripture: 'Matthew 17:1–8', fruit: 'Desire for holiness',
        scene:
          'On Mount Tabor, Jesus is transfigured before Peter, James, and John. His face shines like the sun. ' +
          "Moses and Elijah appear. The Father's voice again: 'This is my beloved Son. Listen to him.'",
        meditation:
          'Behind the human face, the divine glory was always there. Sometimes the veil parts. ' +
          'Sometimes you see. What have you seen that you almost forgot?',
      },
      {
        n: 5, name: 'The Institution of the Eucharist', scripture: 'Luke 22:19–20', fruit: 'Eucharistic adoration',
        scene:
          "At the Last Supper, he takes bread and wine. He gives thanks. He says: 'This is my body. " +
          "This is my blood. Do this in remembrance of me.' The Mass is born. The kingdom is given a permanent center.",
        meditation:
          'He left himself behind, in the Eucharist, so that he could remain with you always. ' +
          'He is in every tabernacle on earth, waiting for you. Go to him.',
      },
    ],
  },
};

// ---- suggestedMysteryKey -------------------------------------------------
// Today's traditional mystery set, by day-of-week. Exported so the
// verification harness can test it directly without rendering the modal.
//   Sunday    → Glorious
//   Monday    → Joyful
//   Tuesday   → Sorrowful
//   Wednesday → Glorious
//   Thursday  → Luminous (added by St. John Paul II in 2002)
//   Friday    → Sorrowful
//   Saturday  → Joyful
export function suggestedMysteryKey(date = new Date()) {
  const day = date.getDay();
  if (day === 0) return 'glorious';
  if (day === 1) return 'joyful';
  if (day === 2) return 'sorrowful';
  if (day === 3) return 'glorious';
  if (day === 4) return 'luminous';
  if (day === 5) return 'sorrowful';
  return 'joyful'; // Saturday
}

// ---- TheRosary (default export) -----------------------------------------
export default function TheRosary({ onComplete, onClose }) {
  const [phase, setPhase] = useState('intro');           // intro | opening | mystery | closing
  const [setKey, setSetKey] = useState(null);
  const [intention, setIntention] = useState('');         // Held in state; never displayed back. By design.
  const [openingStep, setOpeningStep] = useState(0);      // 0..4 within opening
  const [mysteryIndex, setMysteryIndex] = useState(0);    // 0..4
  const [subPhase, setSubPhase] = useState('announce');   // announce | ourFather | hailMarys | gloryBe | fatima
  const [hailMaryIndex, setHailMaryIndex] = useState(0);  // 0..9 within hailMarys

  const set = setKey ? MYSTERY_SETS[setKey] : null;
  const mystery = set ? set.mysteries[mysteryIndex] : null;

  // Opening cards — defined inside the component because they reference
  // ROSARY_PRAYERS strings and the array shape never changes per render.
  // Five cards: sign of cross, creed, our father, three hail marys, glory be.
  const OPENING_CARDS = [
    { key: 'sign',  title: 'Sign of the Cross',   text: ROSARY_PRAYERS.signOfCross,   gesture: 'Begin.' },
    { key: 'creed', title: "The Apostles' Creed", text: ROSARY_PRAYERS.apostlesCreed, gesture: 'On the crucifix.' },
    { key: 'of',    title: 'The Our Father',      text: ROSARY_PRAYERS.ourFather,     gesture: 'On the first large bead.' },
    {
      key: 'hm3', title: 'Three Hail Marys', text: ROSARY_PRAYERS.hailMary,
      subtext: 'For the increase of faith, hope, and charity. Pray three times.',
      gesture: 'On the next three small beads.',
    },
    { key: 'gb',    title: 'The Glory Be',        text: ROSARY_PRAYERS.gloryBe,       gesture: 'Before the centerpiece.' },
  ];

  // ---- Phase machine helpers ----------------------------------------------

  const beginWithSet = (key) => {
    setSetKey(key);
    setPhase('opening');
    setOpeningStep(0);
  };

  const advanceOpening = () => {
    if (openingStep < OPENING_CARDS.length - 1) {
      setOpeningStep(openingStep + 1);
    } else {
      setPhase('mystery');
      setMysteryIndex(0);
      setSubPhase('announce');
      setHailMaryIndex(0);
    }
  };
  const retreatOpening = () => {
    if (openingStep > 0) setOpeningStep(openingStep - 1);
    else setPhase('intro');
  };

  // Advance within a mystery: announce → ourFather → hailMarys (×10) → gloryBe → fatima
  // After fatima on the last mystery, advance to closing.
  const advanceMystery = () => {
    if (subPhase === 'announce') {
      setSubPhase('ourFather');
    } else if (subPhase === 'ourFather') {
      setSubPhase('hailMarys');
      setHailMaryIndex(0);
    } else if (subPhase === 'hailMarys') {
      if (hailMaryIndex < 9) {
        setHailMaryIndex(hailMaryIndex + 1);
      } else {
        setSubPhase('gloryBe');
      }
    } else if (subPhase === 'gloryBe') {
      setSubPhase('fatima');
    } else if (subPhase === 'fatima') {
      if (mysteryIndex < 4) {
        setMysteryIndex(mysteryIndex + 1);
        setSubPhase('announce');
        setHailMaryIndex(0);
      } else {
        setPhase('closing');
      }
    }
  };

  const retreatMystery = () => {
    if (subPhase === 'fatima') setSubPhase('gloryBe');
    else if (subPhase === 'gloryBe') {
      setSubPhase('hailMarys');
      setHailMaryIndex(9);
    } else if (subPhase === 'hailMarys') {
      if (hailMaryIndex > 0) setHailMaryIndex(hailMaryIndex - 1);
      else setSubPhase('ourFather');
    } else if (subPhase === 'ourFather') {
      setSubPhase('announce');
    } else if (subPhase === 'announce') {
      if (mysteryIndex > 0) {
        setMysteryIndex(mysteryIndex - 1);
        setSubPhase('fatima');
      } else {
        // Back to opening, last card
        setPhase('opening');
        setOpeningStep(OPENING_CARDS.length - 1);
      }
    }
  };

  const jumpToBead = (i) => { setSubPhase('hailMarys'); setHailMaryIndex(i); };
  const jumpToOurFather = () => setSubPhase('ourFather');
  const jumpToGloryBe = () => setSubPhase('gloryBe');

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
              <div className="sc-bold" style={{ fontSize: 10, color: 'var(--paper)' }}>The Rosary</div>
              <div className="body" style={{ fontStyle: 'italic', fontSize: '0.78rem', color: 'rgba(246,239,222,0.55)' }}>
                Pray Now · 20 min
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

        {/* Mystery progress strip — shown during mystery and closing */}
        {(phase === 'mystery' || phase === 'closing') && set && (
          <div
            style={{
              maxWidth: '48rem', margin: '0 auto', padding: '0 1.5rem 0.75rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '1rem', flexWrap: 'wrap',
            }}
          >
            {set.mysteries.map((m, i) => {
              const isActive = phase === 'mystery' && i === mysteryIndex;
              const isComplete = (phase === 'mystery' && i < mysteryIndex) || phase === 'closing';
              return (
                <div
                  key={i}
                  className={
                    'mystery-strip-dot ' +
                    (isActive ? 'active' : '') +
                    (isComplete ? ' complete' : '')
                  }
                  style={{ '--mystery-color': set.color, '--mystery-glow': set.glow }}
                  onClick={() => {
                    setMysteryIndex(i);
                    setSubPhase('announce');
                    setHailMaryIndex(0);
                  }}
                >
                  <div className="dot" />
                  <span
                    className="sc"
                    style={{ fontSize: 9, color: isActive ? set.color : 'rgba(246,239,222,0.45)' }}
                  >
                    {String(m.n)}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Opening progress dots */}
        {phase === 'opening' && (
          <div
            style={{
              maxWidth: '48rem', margin: '0 auto', padding: '0 1.5rem 0.75rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem',
            }}
          >
            {OPENING_CARDS.map((_, i) => (
              <div
                key={i}
                style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: i <= openingStep ? 'var(--gold-2)' : 'rgba(246,239,222,0.2)',
                }}
              />
            ))}
          </div>
        )}
      </header>

      <main style={{ maxWidth: '48rem', margin: '0 auto', padding: '3rem 1.5rem' }}>
        {/* INTRO — choose a mystery set */}
        {phase === 'intro' && (() => {
          const suggested = suggestedMysteryKey();
          const todayName = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][(new Date()).getDay()];
          return (
            <div className="fade-in" style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.75rem' }}>
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
                  <Heart size={32} style={{ color: 'var(--gold-2)' }} />
                </div>
              </div>
              <div className="sc-bold" style={{ fontSize: 10, marginBottom: '0.75rem', color: 'var(--gold-2)' }}>
                Step 7 · SEND · Marian · For souls
              </div>
              <h1
                className="display-strong"
                style={{ fontSize: 'clamp(2.2rem, 5.5vw, 3.4rem)', lineHeight: 1.06, marginBottom: '1rem', fontWeight: 600 }}
              >
                The Rosary
              </h1>
              <div style={{ height: 1, margin: '0 auto 1.5rem', maxWidth: '5rem', background: 'var(--gold-2)' }} />
              <p
                className="body-lede"
                style={{
                  fontSize: 'clamp(1.05rem, 2vw, 1.16rem)',
                  lineHeight: 1.7,
                  maxWidth: '32rem',
                  margin: '0 auto 1.5rem',
                  color: 'rgba(246,239,222,0.85)',
                }}
              >
                Mary's prayer for the salvation of souls. For your family, your friends, your parish — and one
                who does not yet believe. The kingdom multiplies through prayer.
              </p>

              {/* Intention input — captures who the user is praying for. The
                  text never displays back during the rosary; the act of
                  typing the intention sets it in the user's mind. */}
              <div style={{ maxWidth: '26rem', margin: '0 auto 2rem' }}>
                <label
                  className="sc-bold"
                  style={{
                    fontSize: 10, color: 'var(--gold-2)',
                    display: 'block', textAlign: 'left', marginBottom: '0.5rem',
                  }}
                >
                  For whom are you praying today?
                </label>
                <input
                  type="text"
                  value={intention}
                  onChange={(e) => setIntention(e.target.value)}
                  placeholder="Family · friends · a name · or 'all souls'"
                  style={{
                    width: '100%',
                    background: 'rgba(246,239,222,0.04)',
                    border: '1px solid rgba(246,239,222,0.20)',
                    borderRadius: 0,
                    padding: '0.75rem 1rem',
                    fontFamily: "'EB Garamond', Georgia, serif",
                    fontSize: '1rem',
                    color: 'var(--paper)',
                    outline: 'none',
                  }}
                />
                <p
                  className="body"
                  style={{
                    fontStyle: 'italic',
                    fontSize: '0.82rem',
                    marginTop: '0.5rem',
                    textAlign: 'left',
                    color: 'rgba(246,239,222,0.5)',
                  }}
                >
                  With others if possible — even one decade, or one Hail Mary, with someone else counts.
                  The rest can be prayed alone.
                </p>
              </div>

              <p
                className="body"
                style={{
                  fontStyle: 'italic',
                  fontSize: '0.98rem',
                  maxWidth: '28rem',
                  margin: '0 auto 2.5rem',
                  color: 'rgba(246,239,222,0.6)',
                }}
              >
                Choose a set of mysteries. Today the Church traditionally prays the{' '}
                <span style={{ color: 'var(--gold-2)' }}>{MYSTERY_SETS[suggested].name}</span>.
              </p>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 16rem), 1fr))',
                  gap: '1rem',
                  marginBottom: '2rem',
                  textAlign: 'left',
                }}
              >
                {Object.values(MYSTERY_SETS).map((s) => {
                  const isSuggested = s.key === suggested;
                  return (
                    <button
                      key={s.key}
                      onClick={() => beginWithSet(s.key)}
                      className={'mystery-set-card ' + (isSuggested ? 'suggested' : '')}
                      style={{ '--mystery-color': s.color }}
                    >
                      <div className="sc-bold" style={{ fontSize: 10, color: s.color, marginBottom: '0.5rem' }}>
                        {s.name.replace(' Mysteries', '')}
                      </div>
                      <h3
                        className="display"
                        style={{ fontSize: '1.4rem', lineHeight: 1.15, marginBottom: '0.75rem', color: 'var(--paper)' }}
                      >
                        {s.name}
                      </h3>
                      <p
                        className="body"
                        style={{
                          fontStyle: 'italic',
                          fontSize: '0.88rem',
                          lineHeight: 1.5,
                          color: 'rgba(246,239,222,0.7)',
                          marginBottom: '0.75rem',
                        }}
                      >
                        {s.framing}
                      </p>
                      <div>
                        {s.days.map((d) => (
                          <span
                            key={d}
                            className="day-tag"
                            style={{ '--mystery-color': s.color, marginRight: '0.375rem' }}
                          >
                            {d}
                          </span>
                        ))}
                        {isSuggested && (
                          <span
                            className="day-tag"
                            style={{
                              '--mystery-color': 'var(--gold-2)',
                              borderColor: 'var(--gold-2)',
                              color: 'var(--gold-2)',
                            }}
                          >
                            Today
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              <p
                className="body"
                style={{ fontStyle: 'italic', fontSize: '0.9rem', color: 'rgba(246,239,222,0.5)' }}
              >
                Today is {todayName}. Choose what your soul most needs to walk through.
              </p>
            </div>
          );
        })()}

        {/* OPENING — five cards in sequence */}
        {phase === 'opening' && (() => {
          const card = OPENING_CARDS[openingStep];
          return (
            <div className="fade-in" style={{ textAlign: 'center' }}>
              <div className="sc-bold" style={{ fontSize: 10, marginBottom: '0.75rem', color: 'var(--gold-2)' }}>
                Opening · {openingStep + 1} of {OPENING_CARDS.length}
              </div>
              <h2
                className="display-strong"
                style={{
                  fontSize: 'clamp(1.85rem, 4.5vw, 2.6rem)',
                  lineHeight: 1.1, marginBottom: '0.75rem', fontWeight: 600,
                }}
              >
                {card.title}
              </h2>
              <p
                className="body"
                style={{
                  fontStyle: 'italic',
                  fontSize: '0.95rem',
                  color: 'rgba(246,239,222,0.55)',
                  marginBottom: '2rem',
                }}
              >
                {card.gesture}
              </p>
              <div
                style={{
                  maxWidth: '36rem', margin: '0 auto 2rem',
                  padding: '2rem 1.5rem',
                  border: '1px solid var(--line-dark)',
                  background: 'rgba(246,239,222,0.04)',
                }}
              >
                <p
                  className="display"
                  style={{
                    fontStyle: 'italic',
                    fontSize: 'clamp(1.1rem, 2.2vw, 1.3rem)',
                    lineHeight: 1.6,
                    color: 'rgba(246,239,222,0.92)',
                  }}
                >
                  {card.text}
                </p>
                {card.subtext && (
                  <p
                    className="body"
                    style={{
                      fontStyle: 'italic',
                      fontSize: '0.92rem',
                      marginTop: '1.25rem',
                      color: 'rgba(246,239,222,0.55)',
                    }}
                  >
                    {card.subtext}
                  </p>
                )}
              </div>
            </div>
          );
        })()}

        {/* MYSTERY — scene + bead strip + prayer text */}
        {phase === 'mystery' && set && mystery && (
          <div className="fade-in">
            {/* Scene card stays visible above all sub-phases */}
            <div className="mystery-scene-card" style={{ '--mystery-color': set.color }}>
              <div className="sc-bold" style={{ fontSize: 9, color: set.color, marginBottom: '0.375rem' }}>
                Mystery {mystery.n} of 5 · {set.name.replace(' Mysteries', '')}
              </div>
              <h3
                className="display-strong"
                style={{
                  fontSize: 'clamp(1.4rem, 3vw, 1.8rem)',
                  lineHeight: 1.15, marginBottom: '0.5rem', fontWeight: 600,
                }}
              >
                {mystery.name}
              </h3>
              <div
                style={{
                  display: 'flex', alignItems: 'baseline', gap: '0.75rem',
                  marginBottom: '0.75rem', flexWrap: 'wrap',
                }}
              >
                <span className="sc" style={{ fontSize: 9, color: set.color }}>{mystery.scripture}</span>
                <span style={{ color: 'rgba(246,239,222,0.3)' }}>·</span>
                <span
                  className="body"
                  style={{ fontStyle: 'italic', fontSize: '0.85rem', color: 'rgba(246,239,222,0.6)' }}
                >
                  Fruit: {mystery.fruit}
                </span>
              </div>
              <p
                className="body"
                style={{
                  fontSize: '0.95rem',
                  lineHeight: 1.55,
                  color: 'rgba(246,239,222,0.82)',
                  marginBottom: '0.75rem',
                }}
              >
                {mystery.scene}
              </p>
              <p
                className="body"
                style={{
                  fontStyle: 'italic',
                  fontSize: '0.92rem',
                  lineHeight: 1.5,
                  color: 'rgba(246,239,222,0.65)',
                }}
              >
                {mystery.meditation}
              </p>
            </div>

            {/* Bead strip — Our Father · 10 Hail Marys · Glory Be */}
            <div className="bead-strip" style={{ marginTop: '2rem' }}>
              <button
                className={
                  'bead-large ' +
                  (subPhase === 'ourFather'
                    ? 'current'
                    : (subPhase === 'hailMarys' || subPhase === 'gloryBe' || subPhase === 'fatima'
                      ? 'prayed'
                      : ''))
                }
                style={{ '--mystery-color': set.color, '--mystery-glow': set.glow }}
                onClick={jumpToOurFather}
                aria-label="Our Father"
              >
                OF
              </button>
              {[...Array(10)].map((_, i) => {
                const isCurrent = subPhase === 'hailMarys' && i === hailMaryIndex;
                const isPrayed =
                  (subPhase === 'hailMarys' && i < hailMaryIndex) ||
                  subPhase === 'gloryBe' ||
                  subPhase === 'fatima';
                return (
                  <button
                    key={i}
                    className={'bead ' + (isCurrent ? 'current' : (isPrayed ? 'prayed' : ''))}
                    style={{ '--mystery-color': set.color, '--mystery-glow': set.glow }}
                    onClick={() => jumpToBead(i)}
                    aria-label={`Hail Mary ${i + 1}`}
                  />
                );
              })}
              <button
                className={
                  'bead-large ' +
                  (subPhase === 'gloryBe' ? 'current' : (subPhase === 'fatima' ? 'prayed' : ''))
                }
                style={{ '--mystery-color': set.color, '--mystery-glow': set.glow }}
                onClick={jumpToGloryBe}
                aria-label="Glory Be"
              >
                GB
              </button>
            </div>

            {/* Prayer text — varies by sub-phase. The opening words of each
                prayer are split off via .replace() and styled with .prayer-emph
                for visual emphasis. Fragile if prayer text changes — but the
                texts are fixed liturgical translations, so this is stable. */}
            <div className="prayer-text-card">
              {subPhase === 'announce' && (
                <div>
                  <div className="sc-bold" style={{ fontSize: 10, marginBottom: '1rem', color: set.color }}>
                    Take a breath. Enter the scene.
                  </div>
                  <p
                    className="body"
                    style={{
                      fontStyle: 'italic',
                      fontSize: '1.05rem',
                      lineHeight: 1.6,
                      color: 'rgba(246,239,222,0.7)',
                      maxWidth: '32rem',
                      margin: '0 auto',
                    }}
                  >
                    Stay here as long as you need. When you are ready, begin the Our Father.
                  </p>
                </div>
              )}
              {subPhase === 'ourFather' && (
                <div>
                  <div className="sc-bold" style={{ fontSize: 10, marginBottom: '1rem', color: set.color }}>
                    The Our Father · 1 of 1
                  </div>
                  <p className="prayer-words">
                    <span className="prayer-emph">Our Father,</span>{' '}
                    {ROSARY_PRAYERS.ourFather.replace('Our Father, ', '')}
                  </p>
                </div>
              )}
              {subPhase === 'hailMarys' && (
                <div>
                  <div className="sc-bold" style={{ fontSize: 10, marginBottom: '1rem', color: set.color }}>
                    Hail Mary · {hailMaryIndex + 1} of 10
                  </div>
                  <p className="prayer-words">
                    <span className="prayer-emph">Hail Mary,</span>{' '}
                    {ROSARY_PRAYERS.hailMary.replace('Hail Mary, ', '')}
                  </p>
                </div>
              )}
              {subPhase === 'gloryBe' && (
                <div>
                  <div className="sc-bold" style={{ fontSize: 10, marginBottom: '1rem', color: set.color }}>
                    The Glory Be
                  </div>
                  <p className="prayer-words">
                    <span className="prayer-emph">Glory be</span>{' '}
                    {ROSARY_PRAYERS.gloryBe.replace('Glory be ', '')}
                  </p>
                </div>
              )}
              {subPhase === 'fatima' && (
                <div>
                  <div className="sc-bold" style={{ fontSize: 10, marginBottom: '1rem', color: set.color }}>
                    The Fátima Prayer
                  </div>
                  <p className="prayer-words">
                    <span className="prayer-emph">O my Jesus,</span>{' '}
                    {ROSARY_PRAYERS.fatima.replace('O my Jesus, ', '')}
                  </p>
                  <p
                    className="body"
                    style={{
                      fontStyle: 'italic',
                      fontSize: '0.88rem',
                      marginTop: '1.5rem',
                      color: 'rgba(246,239,222,0.5)',
                    }}
                  >
                    Given by Mary at Fátima, 1917, for the salvation of souls.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* CLOSING — Hail Holy Queen + Sign of Cross + Amen */}
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
                <Crown size={32} style={{ color: 'var(--gold-2)' }} />
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
              Hail Holy Queen
            </h2>
            <div style={{ height: 1, margin: '0 auto 2rem', maxWidth: '5rem', background: 'var(--gold-2)' }} />
            <div style={{ maxWidth: '36rem', margin: '0 auto 2.5rem' }}>
              <p
                className="display"
                style={{
                  fontStyle: 'italic',
                  fontSize: 'clamp(1.1rem, 2vw, 1.25rem)',
                  lineHeight: 1.55,
                  color: 'rgba(246,239,222,0.92)',
                  marginBottom: '1.5rem',
                }}
              >
                {ROSARY_PRAYERS.hailHolyQueen}
              </p>
            </div>
            <div
              style={{
                marginBottom: '2.5rem',
                paddingTop: '2rem',
                borderTop: '1px solid var(--line-dark)',
              }}
            >
              <div className="sc-bold" style={{ fontSize: 10, marginBottom: '1rem', color: 'var(--gold-2)' }}>
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
                {ROSARY_PRAYERS.signOfCross}
              </p>
            </div>
            <button
              onClick={() => onComplete && onComplete()}
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
                maxWidth: '28rem',
                margin: '1rem auto 0',
                color: 'rgba(246,239,222,0.55)',
              }}
            >
              The Queen Mother heard you. She is praying with you, and for you, even now.
            </p>
          </div>
        )}
      </main>

      {/* Bottom navigation — only during opening and mystery phases. */}
      {(phase === 'opening' || phase === 'mystery') && (
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
              onClick={phase === 'opening' ? retreatOpening : retreatMystery}
              className="btn-ghost-dark sc"
              style={{
                fontSize: 10, padding: '0.625rem 1rem',
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem', minHeight: 40,
              }}
            >
              <ArrowLeft size={12} /> Back
            </button>
            <div className="sc" style={{ fontSize: 9, color: 'rgba(246,239,222,0.5)' }}>
              {phase === 'opening'
                ? `Opening — ${OPENING_CARDS[openingStep].title}`
                : subPhase === 'announce'
                ? `Mystery ${mystery.n} — Contemplate`
                : subPhase === 'ourFather'
                ? `Mystery ${mystery.n} — Our Father`
                : subPhase === 'hailMarys'
                ? `Mystery ${mystery.n} — Hail Mary ${hailMaryIndex + 1}/10`
                : subPhase === 'gloryBe'
                ? `Mystery ${mystery.n} — Glory Be`
                : `Mystery ${mystery.n} — Fátima Prayer`}
            </div>
            <button
              onClick={phase === 'opening' ? advanceOpening : advanceMystery}
              className="btn-gold sc-bold"
              style={{
                fontSize: 10, padding: '0.625rem 1.25rem',
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem', minHeight: 40,
              }}
            >
              {phase === 'opening' && openingStep === OPENING_CARDS.length - 1
                ? 'First mystery'
                : phase === 'mystery' && subPhase === 'fatima' && mysteryIndex === 4
                ? 'To the closing'
                : 'Next'}{' '}
              <ArrowRight size={12} />
            </button>
          </div>
        </footer>
      )}
    </div>
  );
}
