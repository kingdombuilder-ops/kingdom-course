/* =============================================================================
   src/components/LivingEvidence.jsx — Current-evidence section on the Gate.

   The "evidence is current" section that sits between the historical
   evidentiary content (Trail / Circles / Bridge) and the closing
   GateInvitation. Per FINAL_CONTENT_REVISION_PLAN §1.5: the Catholic
   Church is filling, not retreating; the 2025 numbers from France,
   the US, and England & Wales testify to this in real time.

   All statistics are sourced from verified 2025 reports. The component
   is static; when the data is refreshed (annually), edit the inline
   copy + sources note.

   Sources (verified May 2026):
     - France 10,384 adult catechumens / +45% / French Bishops' Conference
       https://www.catholicnewsagency.com/news/263349/france-sees-record-10384-adult-baptisms-in-2025-45-percent-increase-as-young-catholics-lead-revival
       https://www.thetablet.co.uk/news/french-church-record-easter-baptisms/
     - US dioceses surveyed by National Catholic Register (Mar 2025):
       https://www.ncregister.com/news/easter-2025-new-catholics-by-the-numbers
     - England & Wales Easter 2025 record (The Tablet, NCR):
       https://www.thetablet.co.uk/news/highest-number-in-15-years-to-join-catholic-church-at-easter/
       https://www.ncregister.com/cna/surge-in-adults-entering-church-in-england-this-easter-prompted-by-internet-tradition

   No props.
   ============================================================================= */

export default function LivingEvidence() {
  return (
    <section
      className="paper-bg"
      style={{
        position: 'relative',
        paddingTop: 'clamp(5rem, 9vw, 7rem)',
        paddingBottom: 'clamp(5rem, 9vw, 7rem)',
      }}
    >
      <div
        style={{
          maxWidth: '45rem',
          margin: '0 auto',
          padding: '0 clamp(1.5rem, 3vw, 2.5rem)',
        }}
      >
        <div
          className="ornament"
          style={{ maxWidth: '18rem', marginBottom: '2rem' }}
        >
          <span className="sc-bold" style={{ fontSize: 11 }}>
            And the evidence is current
          </span>
        </div>

        <h2
          className="display-strong"
          style={{
            fontSize: 'clamp(2.1rem, 5.2vw, 3.4rem)',
            lineHeight: 1.05,
            fontWeight: 600,
            letterSpacing: '-0.01em',
            marginBottom: '1.5rem',
          }}
        >
          The Kingdom is not in retreat.{' '}
          <span style={{ fontStyle: 'italic', color: 'var(--gold-3)' }}>It is filling.</span>
        </h2>

        <div style={{ height: 1, marginBottom: '2rem', maxWidth: '5rem', background: 'var(--gold)' }} />

        <p
          className="body-lede"
          style={{
            fontSize: 'clamp(1.18rem, 2vw, 1.28rem)',
            lineHeight: 1.7,
            marginBottom: '1.5rem',
            color: 'var(--ink-2)',
          }}
        >
          In 2025, the Catholic Church in France welcomed{' '}
          <strong style={{ color: 'var(--ink)', fontWeight: 600 }}>
            10,384 adults to baptism at Easter
          </strong>{' '}
          — the highest figure since the French Bishops' Conference began the
          survey two decades ago, and a 45% increase over the previous year.
          Forty-two percent of the new catechumens were aged 18–25.
        </p>

        <p
          className="body"
          style={{
            fontSize: 'clamp(1.16rem, 1.9vw, 1.24rem)',
            lineHeight: 1.7,
            marginBottom: '1.5rem',
            color: 'var(--ink-2)',
          }}
        >
          In the United States, dioceses surveyed coast to coast reported sharp
          double-digit increases in adult conversions — Detroit's largest class
          since 2017, Philadelphia's highest in a decade, with young men
          leading the rise. In England and Wales, Easter 2025 brought the
          highest numbers in a generation: Westminster's largest class since
          2018, Southwark and Birmingham at decade highs. The same pattern is
          repeating across the world — in country after country where
          secularism was supposed to have won, the kingdom is filling.
        </p>

        <p
          className="body"
          style={{
            fontSize: 'clamp(1.16rem, 1.9vw, 1.24rem)',
            lineHeight: 1.7,
            marginBottom: '2.5rem',
            color: 'var(--ink-2)',
          }}
        >
          And the saints are being raised up again. In 2025, Pope Leo XIV
          canonized two new ones — Saint Carlo Acutis and Saint Pier Giorgio
          Frassati. Carlo is the first canonized saint of the millennial
          generation. He died at fifteen of leukemia in 2006. He spent his
          short life cataloguing Eucharistic miracles online.
        </p>

        <p
          className="display-strong"
          style={{
            fontStyle: 'italic',
            fontSize: 'clamp(1.4rem, 2.4vw, 1.7rem)',
            lineHeight: 1.4,
            marginBottom: '0.75rem',
            color: 'var(--wine)',
            fontWeight: 500,
          }}
        >
          The kingdom continues to draw souls who are looking for what is true.
        </p>

        <p
          className="display"
          style={{
            fontStyle: 'italic',
            fontSize: 'clamp(1.2rem, 2.1vw, 1.4rem)',
            lineHeight: 1.4,
            marginBottom: '3rem',
            color: 'var(--ink)',
          }}
        >
          You are not the first to come looking. You will not be the last.
        </p>

        <p
          className="sc"
          style={{
            fontSize: 10,
            lineHeight: 1.6,
            color: 'var(--mute)',
            letterSpacing: '0.08em',
          }}
        >
          Sources · French Bishops' Conference (CEF), 2025 · National Catholic
          Register diocesan survey, Easter 2025 · The Tablet (England &amp; Wales) ·
          Vatican canonization, 7 Sept 2025
        </p>
      </div>
    </section>
  );
}
