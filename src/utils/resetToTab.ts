import { router } from 'expo-router';

// Ends a completed booking flow (Tracking / Success / Order Details' "Back
// Home" actions). A plain router.replace('/(tabs)/home') only swaps the
// current screen — every screen pushed underneath during the booking flow
// (Laundry Details, Services, Pickup, Summary, Payment, Success, Tracking)
// stays in the stack, so swipe-back/hardware-back can still reveal it.
//
// dismissAll() pops the root Stack back to its first entry (POP_TO_TOP),
// then replace() swaps that single remaining entry for Home — leaving a
// one-entry stack with nothing left to swipe/back into. This mirrors the
// existing logout pattern in app/(tabs)/profile.tsx.
export function resetToHome() {
  router.dismissAll();
  router.replace('/(tabs)/home');
}
