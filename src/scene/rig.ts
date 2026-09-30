import { CatmullRomCurve3, Vector3 } from 'three';
import { DWELLS, STOPS, StopId } from '../site/stops';

// The dolly track: one continuous camera path through the yard. Scroll position picks a point on it.
// Each stop has a pose (where the camera stands, what it looks at); via-points shape the travel
// between stops so the camera stays in the lanes and turns before it arrives.

type V3 = [number, number, number];
export interface Pose {
  pos: V3;
  look: V3;
}

export const FOV = 40;

const fileZ = (i: number): number => -100 - 16 * i;

export const POSES: Record<string, Pose> = {
  gate: { pos: [4.8, 2.0, 18], look: [-2.8, 4.6, -2] },
  notice: { pos: [11.9, 2.3, -10.2], look: [17, 2.9, -17.2] },
  bay: { pos: [11.6, 2.8, -24.5], look: [-3, 3.6, -44] },
  // The ops tower's display, at the foot of the tower, turned toward the approach
  tower: { pos: [7.4, 2.4, -53], look: [13.6, 3.6, -61.5] },
  // Square to the scanner portal: its legs frame the shot and the board hangs from the beam
  inspection: { pos: [8.4, 2.55, -72], look: [8.4, 5.3, -84] },
  ...Object.fromEntries(
    // Looking down the row at an angle: this stack's name in perspective, the next ones receding behind,
    // and the manifest on its stand turned square to the camera
    [0, 1, 2, 3, 4].map((i) => [`file-${i + 1}`, { pos: [7, 2.4, fileZ(i) + 8.6] as V3, look: [17, 2.9, fileZ(i) + 0.2] as V3 }]),
  ),
  signals: { pos: [10.7, 3.0, -175], look: [10.7, 5.2, -194] },
  dispatch: { pos: [11.9, 2.45, -217.2], look: [11.2, 2.9, -229.5] },
};

// Framing for the still photographs in the plain view. With no signs to read, each shot is composed
// around the place itself; stops not listed here reuse their reading pose.
const STILL_POSES: Partial<Record<StopId, Pose>> = {
  gate: { pos: [-1.6, 1.9, 17], look: [-4.2, 4.3, -2] },
  bay: { pos: [6.5, 3.1, -27], look: [-4.6, 3.4, -46] },
  tower: { pos: [9.2, 2.1, -50], look: [22, 7.2, -72] },
  inspection: { pos: [8.4, 2.3, -64], look: [8.4, 4.4, -84] },
  signals: { pos: [10.7, 2.6, -173], look: [10.7, 5.6, -194] },
  dispatch: { pos: [12.5, 2.3, -210.5], look: [9.4, 3.4, -230] },
  ...Object.fromEntries(
    [0, 1, 2, 3, 4].map((i) => [`file-${i + 1}`, { pos: [9.4, 2.2, fileZ(i) + 9.5] as V3, look: [18.8, 3.3, fileZ(i) - 0.8] as V3 }]),
  ),
};

export const stillPose = (id: StopId): Pose => STILL_POSES[id] ?? POSES[id];

// Extra control points after a stop, in travel order
const VIA: Partial<Record<StopId, Pose[]>> = {
  gate: [{ pos: [6.2, 2.3, 3], look: [11, 2.6, -14] }],
  notice: [{ pos: [11.2, 2.6, -18], look: [6, 3, -38] }],
  bay: [{ pos: [10.4, 2.6, -40], look: [12.5, 3.2, -60] }],
  tower: [{ pos: [8.6, 2.6, -63], look: [8.4, 4, -84] }],
  // Through the portal, then turn to the project row
  inspection: [{ pos: [8.6, 2.5, -86.5], look: [14, 2.8, -98] }],
  'file-5': [{ pos: [10.8, 2.8, -168], look: [10.7, 4.6, -194] }],
  signals: [{ pos: [10.9, 2.7, -197], look: [10.6, 3, -226] }],
};

const points: Pose[] = [];
const stopPoint: number[] = [];
STOPS.forEach((stop) => {
  stopPoint.push(points.length);
  points.push(POSES[stop.id]);
  (VIA[stop.id] ?? []).forEach((p) => points.push(p));
});

const toVec = (v: V3): Vector3 => new Vector3(...v);
export const posCurve = new CatmullRomCurve3(points.map((p) => toVec(p.pos)), false, 'centripetal');
export const lookCurve = new CatmullRomCurve3(points.map((p) => toVec(p.look)), false, 'centripetal');

const last = points.length - 1;
const stopParam = stopPoint.map((i) => i / last);

// Travel eases in and out, so the camera leaves one stop and settles into the next like a dolly shot
const ease = (t: number): number => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// Scroll position (in viewport heights) → path parameter. Holds still through each stop's dwell.
export const paramAtVh = (vh: number): number => {
  for (let i = 0; i < STOPS.length; i++) {
    const [start, end] = DWELLS[i];
    if (vh <= end) {
      if (vh >= start || i === 0) return stopParam[i];
      const from = DWELLS[i - 1][1];
      return stopParam[i - 1] + (stopParam[i] - stopParam[i - 1]) * ease((vh - from) / (start - from));
    }
  }
  return 1;
};
