/* =============================================================================
   src/components/index.js — Component layer barrel.

   The "components" layer holds shared UI building blocks for the tab-root
   views (Gospel, Course, Kingdom). These are larger than @shared utilities
   but smaller than full views — they compose data + JSX + light state.

   Migration progress (Kingdom tab — COMPLETE):
     ✓ HubHero            (batch 9)  — brand strip + house ribbon
     ✓ PracticeRow        (batch 9)  — single-line tappable practice row
     ✓ EssentialBlock     (batch 9)  — wrapper for one of the seven essentials
     ✓ SevenEssentials    (batch 9)  — Hub body, 7 essentials + MiniPath + Compline footer
     ✓ KingdomMoreGrid    (batch 10) — five secondary cards under the seven
     ✓ KingdomHubView     (batch 10) — full Hub page: HubHero + SevenEssentials + MoreGrid
     ✓ FieldGuideHub      (batch 11) — practices index page (22 practices, 5 categories)
     ✓ PracticeGuide      (batch 11) — single-practice editorial detail page

   Migration progress (Course tab — COMPLETE):
     ✓ StepRibbon         (batch 13) — compact horizontal step progress
     ✓ HorizontalJourney  (batch 13) — desktop SVG visualization
     ✓ SevenStepsList     (batch 13) — vertical list of 7 step cards
     ✓ CourseJourney      (batch 13) — section composing the SVG + list
     ✓ CourseHero         (batch 13) — landing hero (logged-in/out modes)
     ✓ WeekDetail         (batch 14) — single week's overview + 7 days list
     ✓ DayReading         (batch 14) — single day editorial reading view
     ✓ SendingDay         (batch 15) — Day 50 Pentecost commissioning
     ✓ CourseTabView      (batch 15) — wrapper composing all 4 views with routing

   Migration progress (Gospel/Gate tab — COMPLETE):
     ✓ Hero               (batch 17) — landing hero with two CTAs
     ✓ Prologue           (batch 17) — "The Message" section
     ✓ Trail              (batch 17) — Davidic blueprint section
     ✓ Circles            (batch 17) — 9-ring SVG + tappable list
     ✓ Bridge             (batch 17) — circles → path bridge
     ✓ CircleModal        (batch 17) — single-circle reading overlay
     ✓ GateInvitation     (batch 17) — closing CTA section
     ✓ GospelTabView      (batch 17) — wrapper composing all 6 sections + modal

   Note: PracticeCardHorizontal was DEAD CODE in source (defined but never
   referenced anywhere). Skipped intentionally.
   ============================================================================= */

export { default as HubHero }            from './HubHero.jsx';
export { default as PracticeRow }        from './PracticeRow.jsx';
export { default as EssentialBlock }     from './EssentialBlock.jsx';
export { default as SevenEssentials }    from './SevenEssentials.jsx';
export { default as KingdomMoreGrid }    from './KingdomMoreGrid.jsx';
export { default as KingdomHubView }     from './KingdomHubView.jsx';
export { default as FieldGuideHub }      from './FieldGuideHub.jsx';
export { default as PracticeGuide }      from './PracticeGuide.jsx';
export { default as StepRibbon }         from './StepRibbon.jsx';
export { default as HorizontalJourney }  from './HorizontalJourney.jsx';
export { default as SevenStepsList }     from './SevenStepsList.jsx';
export { default as CourseJourney }      from './CourseJourney.jsx';
export { default as CourseHero }         from './CourseHero.jsx';
export { default as WeekDetail }         from './WeekDetail.jsx';
export { default as DayReading }         from './DayReading.jsx';
export { default as SendingDay }         from './SendingDay.jsx';
export { default as CourseTabView }      from './CourseTabView.jsx';

// Gospel/Gate tab
export { default as Hero }               from './Hero.jsx';
export { default as Prologue }           from './Prologue.jsx';
export { default as Trail }              from './Trail.jsx';
export { default as Circles }            from './Circles.jsx';
export { default as Bridge }             from './Bridge.jsx';
export { default as CircleModal }        from './CircleModal.jsx';
export { default as GateInvitation }     from './GateInvitation.jsx';
export { default as GospelTabView }      from './GospelTabView.jsx';

// Chrome (top-level navigation)
export { default as KingdomTabNav }      from './KingdomTabNav.jsx';
export { default as Footer }             from './Footer.jsx';
export { default as Companion }          from './Companion.jsx';
export { default as FloatingCompanion }  from './FloatingCompanion.jsx';
