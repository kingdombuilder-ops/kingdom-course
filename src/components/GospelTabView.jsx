/* =============================================================================
   src/components/GospelTabView.jsx — The Gate (Gospel) tab's full wrapper.

   Composes the visitor-facing Gate as one continuous scrollable page:
     1. Hero — the framing announcement
     2. Prologue — the message expanded
     3. Trail — supernatural evidence + Davidic blueprint
     4. Circles — the 9 concentric rings visualization
     5. Bridge — connecting circles to the path
     6. GateInvitation — closing CTAs

   Owns the circle modal state internally (`activeCircle`, `openedCircles`).
   Tapping any circle from the Circles section opens CircleModal; the modal
   has its own prev/next navigation that updates `activeCircle` without
   leaving the modal. Closing returns the user to the scroll position they
   left.

   Migrated routing from the_kingdom.jsx around line ~13209 (the
   tab === "gate" branch).

   Props:
     onToCourse() — invoked by the Hero's "Enter the course" CTA and the
                    GateInvitation's path/primary CTAs. Wires to App's
                    tab-switch logic.
     onShare()    — invoked by the GateInvitation's "Pass it on" button
   ============================================================================= */

import { useState, useEffect } from 'react';
import { CIRCLES } from '@data';
import Hero from './Hero.jsx';
import Prologue from './Prologue.jsx';
import Trail from './Trail.jsx';
import Circles from './Circles.jsx';
import Bridge from './Bridge.jsx';
import GateInvitation from './GateInvitation.jsx';
import CircleModal from './CircleModal.jsx';

export default function GospelTabView({ onToCourse = () => {}, onShare = () => {} }) {
  const [activeCircleN, setActiveCircleN] = useState(null);
  const [openedCircles, setOpenedCircles] = useState([]);

  const openCircle = (n) => {
    setActiveCircleN(n);
    setOpenedCircles((prev) => (prev.includes(n) ? prev : [...prev, n]));
  };
  const closeCircle = () => setActiveCircleN(null);
  const nextCircle = () => {
    if (activeCircleN === null) return;
    if (activeCircleN >= 9) return;
    openCircle(activeCircleN + 1);
  };
  const prevCircle = () => {
    if (activeCircleN === null) return;
    if (activeCircleN <= 1) return;
    openCircle(activeCircleN - 1);
  };

  const scrollToPrologue = () => {
    if (typeof document === 'undefined') return;
    const el = document.getElementById('message');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Lock body scroll while modal is open (prevents background scroll on iOS)
  useEffect(() => {
    if (typeof document === 'undefined') return undefined;
    if (activeCircleN !== null) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
    return undefined;
  }, [activeCircleN]);

  const activeCircle = activeCircleN !== null
    ? CIRCLES.find((c) => c.n === activeCircleN) || null
    : null;

  return (
    <div className="view-enter">
      <Hero onEnter={onToCourse} onToPrologue={scrollToPrologue} />
      <Prologue />
      <Trail />
      <Circles onSelect={openCircle} openedCircles={openedCircles} />
      <Bridge />
      <GateInvitation onToCourse={onToCourse} onShare={onShare} />

      {activeCircle && (
        <CircleModal
          circle={activeCircle}
          onClose={closeCircle}
          onNext={nextCircle}
          onPrev={prevCircle}
        />
      )}
    </div>
  );
}
