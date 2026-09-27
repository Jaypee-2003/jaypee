import { useSyncExternalStore } from 'react';
import { StopId } from './stops';

// Module-level state shared by the main React tree and the drei <Html> placards, which render in
// separate React roots and so can't see context.

/* ───────── active stop: what the nav highlights and the URL reflects ───────── */

let active: StopId = 'gate';
const listeners = new Set<() => void>();

export const setActiveStop = (id: StopId): void => {
  if (id === active) return;
  active = id;
  listeners.forEach((l) => l());
};

export const useActiveStop = (): StopId =>
  useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => active,
  );

/* ───────── scroller: the mounted presentation registers how to bring a stop into view ───────── */

type Scroller = (id: StopId, smooth: boolean) => void;

let scroller: Scroller | null = null;
let pending: StopId | null = null;

export const setScroller = (next: Scroller | null): void => {
  scroller = next;
  // A request made before the presentation mounted (a deep link) is applied on arrival, without animation
  if (next && pending) {
    next(pending, false);
    pending = null;
  }
};

export const scrollToStop = (id: StopId, smooth = true): void => {
  if (scroller) scroller(id, smooth);
  else pending = id;
};
