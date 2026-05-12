/* =============================================================================
   src/modals/index.js — modals barrel.

   Re-exports each migrated modal component. Consumers import as:

       import { HousesQuiz, AddIntentionModal } from '@modals';

   The `@modals` alias is configured in vite.config.js. As more modals
   migrate (TheRosary, LectioDivina, Compline, etc.), add their re-exports
   here.

   Migration progress: 13 of 13 — MODAL LAYER COMPLETE (incl. chrome share modal + signup)
     ✓ AbideLocator         (batch 5)
     ✓ AddIntentionModal    (batch 3)
     ✓ AwakenToTheDay       (batch 4)
     ✓ CloudOfWitnesses     (batch 3)
     ✓ Compline             (batch 6)
     ✓ DailyExamen          (batch 8)
     ✓ HousesQuiz           (batch 3)
     ✓ LectioDivina         (batch 5)
     ✓ PassItOn             (batch 18)
     ✓ ReachOut             (batch 4)
     ✓ SignupModal          (batch 20) — stub mode by default; pass submitHandler for real auth
     ✓ TheRosary            (batch 7)
     ✓ WorkOfMercy          (batch 4)
   ============================================================================= */

export { default as AbideLocator }      from './AbideLocator.jsx';
export { default as AddIntentionModal } from './AddIntentionModal.jsx';
export { default as AwakenToTheDay }    from './AwakenToTheDay.jsx';
export { default as CloudOfWitnesses }  from './CloudOfWitnesses.jsx';
export { default as Compline }          from './Compline.jsx';
export { default as DailyExamen }       from './DailyExamen.jsx';
export { default as HousesQuiz }        from './HousesQuiz.jsx';
export { default as LectioDivina }      from './LectioDivina.jsx';
export { default as PassItOn }          from './PassItOn.jsx';
export { default as ReachOut }          from './ReachOut.jsx';
export { default as SignupModal, SIGNUP_STORAGE_KEY } from './SignupModal.jsx';
export { default as TheRosary }         from './TheRosary.jsx';
export { default as VerifyEmailModal } from './VerifyEmailModal.jsx';
export { default as WorkOfMercy }       from './WorkOfMercy.jsx';
