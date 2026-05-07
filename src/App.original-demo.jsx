import { useState } from 'react';
import {
  CHURCH_TODAY,
  HOUSES,
  HOUSE_QUOTES,
  TODAY_HOUSE_QUOTE_INDEX,
  DAILY_PRACTICES,
  STEP_COLORS,
  TODAY_GO,
  QUIZ_QUESTIONS,
  SAINTS_HUB,
  getLiturgicalDay,
} from '@data';
import { toRoman } from '@shared/utils';
import { useDailyCompletion } from '@shared/storage';

/* ============================================================================
   PLACEHOLDER APP — exercises every data module so the scaffold proves out
   end-to-end before the full migration. Replace this entire file with your
   real App component to migrate. See MIGRATION.md.
   ============================================================================ */

export default function App() {
  const [houseKey, setHouseKey] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const day = getLiturgicalDay(selectedDate);
  const { completedToday, toggleComplete } = useDailyCompletion();

  const offsetDay = (n) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + n);
    setSelectedDate(d);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F6EFDE', color: '#0E0A06', fontFamily: 'EB Garamond, serif', padding: '3rem 1.5rem 6rem' }}>
      <div style={{ maxWidth: '44rem', margin: '0 auto' }}>
        <header style={{ marginBottom: '3rem' }}>
          <p className="sc" style={small}>The Kingdom Course · Vite scaffold · Module check</p>
          <h1 style={h1}>Today in the Universal Church</h1>
          <p style={subtle}>{day.weekday}, {day.date} · {day.season}</p>
        </header>

        <section style={card}>
          <p style={eyebrow}>{day.liturgicalDate}</p>
          {day.feast && (
            <>
              <h2 style={h2}>{day.feast.name}</h2>
              <p style={italic}>{day.feast.line}</p>
            </>
          )}
        </section>

        {day.readings?.gospel && (
          <section style={card}>
            <p style={eyebrow}>Gospel · {day.readings.gospel.ref}</p>
            <p style={lede}>{day.readings.gospel.blurb}</p>
          </section>
        )}

        {day.papalIntention && (
          <section style={{ ...card, background: '#EFE6CF' }}>
            <p style={eyebrow}>Holy Father · {day.papalIntention.month} intention</p>
            <p style={italic}>{day.papalIntention.text}</p>
          </section>
        )}

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '3rem' }}>
          <button onClick={() => offsetDay(-1)} style={btn}>← Yesterday</button>
          <button onClick={() => setSelectedDate(new Date())} style={btn}>Today</button>
          <button onClick={() => offsetDay(1)} style={btn}>Tomorrow →</button>
        </div>

        {/* Seven Essentials — proves DAILY_PRACTICES, STEP_COLORS, useDailyCompletion wire up */}
        <h3 style={h3}>The Seven Essentials</h3>
        <ul style={list}>
          {DAILY_PRACTICES.map((p) => {
            const complete = completedToday.includes(p.n);
            const color = STEP_COLORS[p.n];
            return (
              <li key={p.n}>
                <button
                  onClick={() => toggleComplete(p.n)}
                  style={{
                    ...rowBtn,
                    borderLeft: `3px solid ${color}`,
                    background: complete ? `${color}10` : 'transparent',
                  }}
                >
                  <span className="sc-bold" style={{ ...small, color, minWidth: '2.5rem' }}>{toRoman(p.n)}</span>
                  <span style={{ flex: 1 }}>
                    <strong style={{ display: 'block' }}>{p.verb} · {p.practice}</strong>
                    <span style={{ ...italic, fontSize: '0.85rem' }}>{p.tradition}</span>
                  </span>
                  <span style={{ ...small, color: complete ? color : '#7A6F58' }}>
                    {complete ? '✓ today' : 'tap to mark'}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        {/* House discernment */}
        <h3 style={h3}>The Five Houses</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {Object.values(HOUSES).map((h) => (
            <button
              key={h.slug}
              onClick={() => setHouseKey(h.slug === houseKey ? null : h.slug)}
              style={{
                ...btn,
                borderColor: h.color,
                color: houseKey === h.slug ? '#F6EFDE' : '#0E0A06',
                background: houseKey === h.slug ? h.color : 'transparent',
                flex: '0 1 auto',
                minHeight: 44,
              }}
            >
              {h.name}
            </button>
          ))}
        </div>
        {houseKey && (
          <section style={{ ...card, borderLeft: `3px solid ${HOUSES[houseKey].color}` }}>
            <p style={eyebrow}>House of {HOUSES[houseKey].name} · {HOUSES[houseKey].tradition}</p>
            <h4 style={{ ...h2, fontSize: '1.5rem' }}>{HOUSES[houseKey].patron}</h4>
            <p style={italic}>{HOUSES[houseKey].line}</p>

            {HOUSE_QUOTES[houseKey]?.[TODAY_HOUSE_QUOTE_INDEX] && (
              <blockquote style={{ marginTop: '1.25rem', paddingLeft: '1rem', borderLeft: `2px solid ${HOUSES[houseKey].color}` }}>
                <p style={italic}>"{HOUSE_QUOTES[houseKey][TODAY_HOUSE_QUOTE_INDEX].text}"</p>
                <p style={{ ...small, marginTop: '0.5rem', color: HOUSES[houseKey].color }}>
                  — {HOUSE_QUOTES[houseKey][TODAY_HOUSE_QUOTE_INDEX].saint}
                </p>
              </blockquote>
            )}

            {/* Saints in this House */}
            <p style={{ ...eyebrow, marginTop: '1.5rem' }}>The cloud of witnesses · {HOUSES[houseKey].name}</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0.5rem 0 0' }}>
              {SAINTS_HUB.filter((s) => s.house === houseKey).map((s) => (
                <li key={s.name} style={{ padding: '0.5rem 0', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                  <strong>{s.name}</strong> <span style={{ ...small, color: '#7A6F58' }}>({s.years})</span>
                  <br/>
                  <span style={{ ...italic, fontSize: '0.85rem' }}>{s.note}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Today's GO act — proves prompts.js */}
        <h3 style={h3}>Today's Apostolic Act · GO</h3>
        <section style={card}>
          <p style={eyebrow}>The Ignatian going forth · House of Glory</p>
          <p style={{ ...lede, fontWeight: 500 }}>{TODAY_GO.primary}</p>
          <p style={italic}>{TODAY_GO.detail}</p>
        </section>

        {/* Quiz check */}
        <h3 style={h3}>Discernment Quiz · {QUIZ_QUESTIONS.length} questions</h3>
        <p style={italic}>The full quiz lives in the HousesQuiz modal (to be migrated). The data is wired and ready.</p>

        <footer style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid #D8CDA8' }}>
          <p style={{ ...italic, fontSize: '0.85rem' }}>
            This is the scaffold. Six data modules wired: liturgical, colors, houses, saints, practices, prompts, quiz.
            Two shared modules wired: utils, storage. Replace this file with your real App to migrate.
          </p>
          <p style={{ ...small, marginTop: '1rem', textAlign: 'center', color: '#8A6828' }}>
            Salus animarum suprema lex.
          </p>
        </footer>
      </div>
    </div>
  );
}

const small  = { fontFamily: 'Cormorant SC, serif', fontSize: '0.65rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#8A6828' };
const eyebrow = { ...small, marginBottom: '0.5rem' };
const h1 = { fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', fontWeight: 500, lineHeight: 1.05, margin: '1rem 0 0.5rem' };
const h2 = { fontFamily: 'Cormorant Garamond, serif', fontSize: '1.7rem', fontWeight: 500, marginTop: '0.5rem', marginBottom: '0.5rem' };
const h3 = { fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', fontWeight: 500, marginTop: '3rem', marginBottom: '1rem' };
const subtle = { fontStyle: 'italic', color: '#7A6F58', margin: 0 };
const italic = { fontStyle: 'italic', fontSize: '1rem', lineHeight: 1.55, color: '#1C160D' };
const lede = { fontSize: '1.05rem', lineHeight: 1.55, color: '#1C160D', margin: '0.5rem 0' };
const card = { borderLeft: '2px solid #B5883F', paddingLeft: '1rem', paddingTop: '0.75rem', paddingBottom: '0.75rem', marginBottom: '1.5rem' };
const list = { listStyle: 'none', padding: 0, margin: '0 0 2rem' };
const rowBtn = { width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem 1rem', textAlign: 'left', fontFamily: 'inherit', cursor: 'pointer', minHeight: 56, marginBottom: '0.25rem' };
const btn = {
  fontFamily: 'Cormorant SC, serif', fontSize: '0.7rem', letterSpacing: '0.18em', textTransform: 'uppercase',
  padding: '0.625rem 1rem', background: 'transparent', border: '1px solid #B5883F', color: '#0E0A06',
  cursor: 'pointer', minHeight: 44, flex: 1,
};
