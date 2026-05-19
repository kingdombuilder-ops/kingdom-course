/* =============================================================================
   src/components/KingdomHubView.jsx — The Kingdom tab's "hub" view.

   Composes the full Hub page top-to-bottom:

     HubHero          — brand strip, today's weekday/date, season, house ribbon
     SevenEssentials  — the daily seven (with their per-essential content)
     KingdomMoreGrid  — five secondary cards (Your House · Field Guide ·
                        Intentions · Cloud of Witnesses · Academy)

   The page lives on the dark ink background; HubHero is on paper as a
   visual stop before the seven start.

   Migrated from the_kingdom.jsx routing block at line ~13319 (the
   tab === "kingdom" && kingdomView === "hub" branch).

   Props:
     houseKey           — passed to HubHero and KingdomMoreGrid (the latter
                          uses it to decide whether to span both columns
                          and show today's saint quote)
     completedToday     — passed to SevenEssentials
     onPracticeStart    — passed to SevenEssentials (called with essential n)
     onCompline         — passed to SevenEssentials
     complineDone       — passed to SevenEssentials
     intentions         — passed to KingdomMoreGrid (for count + preview)
     onOpenHouseQuiz    — passed to KingdomMoreGrid
     onOpenIntention    — passed to KingdomMoreGrid
     onOpenWitnesses    — passed to KingdomMoreGrid
     onGoToFieldGuide   — passed to KingdomMoreGrid (stub until batch 11)
   ============================================================================= */

import HubHero from './HubHero.jsx';
import SevenEssentials from './SevenEssentials.jsx';
import ConfessionPrompt from './ConfessionPrompt.jsx';
import KingdomMoreGrid from './KingdomMoreGrid.jsx';

export default function KingdomHubView({
  houseKey,
  completedToday = [],
  onPracticeStart,
  onCompline,
  complineDone = false,
  intentions = [],
  onOpenHouseQuiz,
  onOpenIntention,
  onOpenWitnesses,
  onGoToFieldGuide,
  lastConfessionDate = null,
  onMarkConfession,
}) {
  return (
    <div className="view-enter">
      <HubHero houseKey={houseKey} />
      <SevenEssentials
        completedToday={completedToday}
        onPracticeStart={onPracticeStart}
        onCompline={onCompline}
        complineDone={complineDone}
      />
      <ConfessionPrompt
        lastConfessionDate={lastConfessionDate}
        onMarkConfession={onMarkConfession}
      />
      <KingdomMoreGrid
        houseKey={houseKey}
        intentions={intentions}
        onOpenHouseQuiz={onOpenHouseQuiz}
        onOpenIntention={onOpenIntention}
        onOpenWitnesses={onOpenWitnesses}
        onGoToFieldGuide={onGoToFieldGuide}
      />
    </div>
  );
}
