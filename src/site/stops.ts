import { projects } from '../data/profile';

// The site is one route through the yard. Each stop is a place the camera comes to rest; the plain
// document uses the same ids for its sections, so links, the nav and the URL work the same in both.
export type StopId = 'gate' | 'notice' | 'bay' | 'tower' | 'inspection' | `file-${number}` | 'signals' | 'dispatch';

export interface Stop {
  id: StopId;
  // Scroll length in viewport heights: `travel` to get here from the previous stop, then `dwell` at rest here
  travel: number;
  dwell: number;
}

export const STOPS: Stop[] = [
  { id: 'gate', travel: 0, dwell: 0.55 },
  { id: 'notice', travel: 1.1, dwell: 0.7 },
  { id: 'bay', travel: 1.3, dwell: 0.8 },
  { id: 'tower', travel: 1.2, dwell: 0.8 },
  { id: 'inspection', travel: 1.0, dwell: 0.8 },
  ...projects.map((_, i) => ({ id: `file-${i + 1}` as StopId, travel: i === 0 ? 1.1 : 0.8, dwell: 0.7 })),
  { id: 'signals', travel: 1.2, dwell: 0.7 },
  { id: 'dispatch', travel: 1.2, dwell: 0.6 },
];

// The plain view's photograph of each place, rendered from the scene by scripts/render-stills.js. Project
// photographs are named after the project, not its position, so reordering or removing projects never pairs
// a manifest with the wrong photograph. The About section has none: the portrait is its picture.
export const stillName = (id: StopId): string => {
  const file = /^file-(\d+)$/.exec(id);
  return file ? `project-${projects[Number(file[1]) - 1]?.id ?? id}` : id;
};
export const STILLS: { stop: StopId; name: string }[] = STOPS.filter((s) => s.id !== 'notice').map((s) => ({
  stop: s.id,
  name: stillName(s.id),
}));

export interface NavSection {
  label: string;
  route: string;
  stop: StopId;
}

export const SECTIONS: NavSection[] = [
  { label: 'Home', route: '/', stop: 'gate' },
  { label: 'About', route: '/about', stop: 'notice' },
  { label: 'Experience', route: '/experience', stop: 'bay' },
  { label: 'AI & Security', route: '/ai-security', stop: 'tower' },
  { label: 'Projects', route: '/projects', stop: 'file-1' },
  { label: 'Skills', route: '/skills', stop: 'signals' },
  { label: 'Contact', route: '/contact', stop: 'dispatch' },
];

export const stopIndex = (id: StopId): number => STOPS.findIndex((s) => s.id === id);

// The nav section a stop belongs to: the last section starting at or before it
export const sectionForStop = (id: StopId): NavSection => {
  const i = stopIndex(id);
  return SECTIONS.reduce((found, s) => (stopIndex(s.stop) <= i ? s : found), SECTIONS[0]);
};

export const sectionForRoute = (route: string): NavSection => SECTIONS.find((s) => s.route === route) ?? SECTIONS[0];

/* ───────── scroll layout (3D mode): stops laid end to end along the page, in viewport heights ───────── */

export const TOTAL_VH = STOPS.reduce((n, s) => n + s.travel + s.dwell, 0);

// [start, end] of each stop's dwell, in viewport heights
export const DWELLS: [number, number][] = (() => {
  let at = 0;
  return STOPS.map((s) => {
    at += s.travel;
    const range: [number, number] = [at, at + s.dwell];
    at += s.dwell;
    return range;
  });
})();

// Scroll position (vh) to bring a stop into view: the middle of its dwell; the first and last stops use the page ends
export const anchorVh = (id: StopId): number => {
  const i = stopIndex(id);
  if (i <= 0) return 0;
  if (i === STOPS.length - 1) return TOTAL_VH;
  return (DWELLS[i][0] + DWELLS[i][1]) / 2;
};

// The stop whose dwell is nearest the scroll position
export const stopAtVh = (vh: number): StopId => {
  let best = 0;
  let bestDistance = Infinity;
  DWELLS.forEach(([a, b], i) => {
    const d = vh < a ? a - vh : vh > b ? vh - b : 0;
    if (d < bestDistance) {
      bestDistance = d;
      best = i;
    }
  });
  return STOPS[best].id;
};
