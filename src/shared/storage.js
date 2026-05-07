/* =============================================================================
   src/shared/storage.js — the storage seam.

   This is the single point of contact between the app and persistence.
   Everywhere else in the app reads through useKingdomStorage() and
   useKingdomState(); when Supabase is wired, only this file changes.

   Current implementation: localStorage with JSON serialization. Survives
   tab reloads but not device changes, browser-data clears, or incognito.
   Acceptable for the launch-stable but not for the production-ready
   experience post-Week-2.

   Future implementation: Supabase row-level. Replace useKingdomStorage's
   internals with calls to supabase.from('user_data').upsert(); add
   real-time subscriptions for cross-device sync. The component-facing
   API stays identical: useKingdomStorage(key, default) returns
   [value, setValue], same as React's useState.
   ============================================================================= */

import { useEffect, useState, useCallback } from 'react';

const PREFIX = 'kingdom:';

/* Read a value from localStorage with JSON parse. Returns the default
   if the key is missing or the value is corrupt. Never throws. */
function readKey(key, defaultValue) {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    if (raw === null) return defaultValue;
    return JSON.parse(raw);
  } catch {
    return defaultValue;
  }
}

/* Write a value to localStorage with JSON stringify. Silently noop
   on quota errors; the UI continues to show the new value via React
   state, but won't survive a reload. Acceptable degradation. */
function writeKey(key, value) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    /* quota exceeded or storage disabled — proceed without persistence */
  }
}

/* Delete a key. */
export function clearKey(key) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(PREFIX + key);
  } catch {
    /* noop */
  }
}

/* Clear all kingdom: keys. Used when the user signs out or deletes their
   account. Does not touch other localStorage entries. */
export function clearAll() {
  if (typeof window === 'undefined') return;
  try {
    const keys = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (k && k.startsWith(PREFIX)) keys.push(k);
    }
    keys.forEach((k) => window.localStorage.removeItem(k));
  } catch {
    /* noop */
  }
}

/* The primary hook. Mirrors React's useState shape: returns [value, setValue].
   Persists across reloads. Listens for cross-tab updates via the storage
   event so two tabs of the same site stay in sync.

   Usage:
     const [houseKey, setHouseKey] = useKingdomStorage('houseKey', null);
     const [completedToday, setCompletedToday] = useKingdomStorage('completedToday', []);
*/
export function useKingdomStorage(key, defaultValue) {
  const [value, setValueState] = useState(() => readKey(key, defaultValue));

  // Persist on change
  useEffect(() => {
    writeKey(key, value);
  }, [key, value]);

  // Cross-tab sync
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handler = (e) => {
      if (e.key === PREFIX + key) {
        try {
          setValueState(e.newValue === null ? defaultValue : JSON.parse(e.newValue));
        } catch {
          setValueState(defaultValue);
        }
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, [key, defaultValue]);

  // Setter — accepts a value or an updater function, like useState
  const setValue = useCallback((next) => {
    setValueState((prev) => (typeof next === 'function' ? next(prev) : next));
  }, []);

  return [value, setValue];
}

/* Daily-completion shape: { 'YYYY-MM-DD': [1, 2, 3, 4] }
   The keys are the Hub's seven essentials (1–7); presence in the array
   means "prayed today". This is the single source of truth for the
   metric — how many people prayed today's seven essentials. */
export function useDailyCompletion() {
  const [byDate, setByDate] = useKingdomStorage('completion', {});

  const todayKey = (() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  })();

  const todayList = byDate[todayKey] || [];

  const markComplete = useCallback((essentialN) => {
    setByDate((prev) => {
      const list = prev[todayKey] || [];
      if (list.includes(essentialN)) return prev;
      return { ...prev, [todayKey]: [...list, essentialN] };
    });
  }, [setByDate, todayKey]);

  const toggleComplete = useCallback((essentialN) => {
    setByDate((prev) => {
      const list = prev[todayKey] || [];
      const next = list.includes(essentialN)
        ? list.filter((n) => n !== essentialN)
        : [...list, essentialN];
      return { ...prev, [todayKey]: next };
    });
  }, [setByDate, todayKey]);

  return { completedToday: todayList, markComplete, toggleComplete, byDate };
}
