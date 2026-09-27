import { useSyncExternalStore } from 'react';

// Night or day — one setting for the whole site. In the 3D view it's the light in the yard; in the plain
// view it's the page theme (dark / light). Kept in a module store, not context, because the drei <Html>
// placards render in their own React roots.
//
// It's written to <html data-theme> so CSS can theme the page (see index.css); public/index.html sets
// the same attribute before first paint, so a returning day visitor never sees a night flash.

export type TimeOfDay = 'night' | 'day';

const KEY = 'jpb:time';
const THEME_COLOR: Record<TimeOfDay, string> = { night: '#0B121C', day: '#F4F0E7' };

const isTime = (v: unknown): v is TimeOfDay => v === 'night' || v === 'day';

const initial = (): TimeOfDay => {
  // `?time=day` lets the still-image script render daylight photographs
  const fromUrl = new URLSearchParams(window.location.search).get('time');
  if (isTime(fromUrl)) return fromUrl;
  try {
    const stored = window.localStorage.getItem(KEY);
    if (isTime(stored)) return stored;
  } catch {
    // storage blocked: fall through to the default
  }
  // The yard's own identity is the night shift
  return 'night';
};

let current: TimeOfDay = initial();
const listeners = new Set<() => void>();

const apply = (): void => {
  document.documentElement.dataset.theme = current;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[current]);
};
apply();

export const getTimeOfDay = (): TimeOfDay => current;

export const setTimeOfDay = (next: TimeOfDay): void => {
  if (next === current) return;
  current = next;
  try {
    window.localStorage.setItem(KEY, next);
  } catch {
    // storage blocked: the choice lasts for this visit only
  }
  apply();
  listeners.forEach((l) => l());
};

export const useTimeOfDay = (): TimeOfDay =>
  useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => current,
  );
