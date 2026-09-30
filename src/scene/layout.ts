import { experience, projects, skillGroups } from '../data/profile';

// Where things stand in the yard, worked out from the content, so the scene reshapes itself when the
// content changes: another project adds a container stack and moves everything past the row further
// down the lane; another loading-bay module lengthens the API gantry; another skill group widens the
// signal gantry. The lane runs from the gate (z ≈ +18) down toward the quay (−z).

/* ───────── the project row ───────── */

// One two-high stack per project on the right of the lane, 16 m apart
export const ROW = { start: -100, step: 16, x: 20 };
export const fileZ = (i: number): number => ROW.start - ROW.step * i;
const PROJECT_COUNT = Math.max(projects.length, 1);
export const ROW_END = fileZ(PROJECT_COUNT - 1);

// Everything past the row (signal gantry, dispatch office, quay, cranes, lamps and lane paint) was laid out
// for a five-project row. past() moves one of its coordinates by however much longer or shorter the row is.
const DESIGNED_FOR = 5;
export const past = (z: number): number => z - (PROJECT_COUNT - DESIGNED_FOR) * ROW.step;

export const QUAY_Z = past(-235);

/* ───────── the loading bay (experience) ───────── */

// One 10' container per module, the rightmost at the lane edge, 3.4 m apart; the API gantry spans them, and
// the data-store tanks stand behind it, 5.8 m apart from its left end
export const BAY = (() => {
  const n = Math.max(experience.modules.length, 1);
  const moduleX = Array.from({ length: n }, (_, i) => 0.6 - (n - 1 - i) * 3.4);
  // The gantry never gets shorter than it takes to span two tanks and carry its lettering
  const beam = { x0: Math.min(moduleX[0] - 2.6, -12.2), x1: 3.2, y: 6.3 };
  const tankX = experience.architecture.stores.map((_, k) => beam.x0 + 2.8 + k * 5.8);
  return { moduleX, beam, tankX };
})();

/* ───────── the signal gantry (skills) ───────── */

// One signal head per skill group, one lamp per skill. The truss rises if a group is long enough that its
// head would hang into the camera's way, and the camera stands back far enough to take the whole gantry in.
export const SIGNALS = (() => {
  const spacing = 2.55;
  const plateW = 2.2;
  const lampStep = 0.5;
  const centerX = 10.7;
  const n = Math.max(skillGroups.length, 1);
  const plateHeight = (skills: number): number => 0.95 + skills * lampStep;
  const tallest = Math.max(1, ...skillGroups.map((g) => g.skills.length));
  const top = Math.max(8.1, 3.6 + plateHeight(tallest));
  const headX = (i: number): number => centerX + (i - (n - 1) / 2) * spacing;
  const towerX: [number, number] = [headX(0) - plateW / 2 - 1.1, headX(n - 1) + plateW / 2 + 1.1];
  const distance = Math.max(19, ((towerX[1] - towerX[0]) / 2 + 1.5) / 0.53);
  return { z: past(-194), centerX, spacing, plateW, lampStep, top, headX, plateHeight, towerX, distance };
})();
