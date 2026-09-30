import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  CircleGeometry,
  Color,
  ConeGeometry,
  CylinderGeometry,
  ExtrudeGeometry,
  MeshStandardMaterial,
  Shape,
  ShapeGeometry,
} from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { PAL } from './palette';
import { Container, Paint } from './props';
import { daylight } from './daylight';

// The working yard between the stops: concrete barriers along the lane, cones, pallets, crates and
// drums, a reach stacker moving a box, the lane's paint, and wet patches that catch the lamps at night.
// Each kind of material is one merged, vertex-coloured mesh, so all of this costs a handful of draw calls.
// Everything stays out of the camera's lane and clear of the signs people read.

type V3 = [number, number, number];

// Flat per-part colour, so parts of different colours can share one mesh and one material
const tint = (geometry: BufferGeometry, hex: string): BufferGeometry => {
  const g = geometry.index ? geometry.toNonIndexed() : geometry;
  if (g !== geometry) geometry.dispose();
  const c = new Color(hex);
  const colors = new Float32Array(g.attributes.position.count * 3);
  for (let i = 0; i < colors.length; i += 3) {
    colors[i] = c.r;
    colors[i + 1] = c.g;
    colors[i + 2] = c.b;
  }
  g.setAttribute('color', new BufferAttribute(colors, 3));
  if (!g.attributes.uv) g.setAttribute('uv', new BufferAttribute(new Float32Array(g.attributes.position.count * 2), 2));
  return g;
};

const merge = (parts: BufferGeometry[]): BufferGeometry => {
  const merged = mergeGeometries(parts);
  parts.forEach((p) => p.dispose());
  return merged;
};

const Merged: React.FC<{ build: () => BufferGeometry; roughness: number; metalness?: number }> = ({
  build,
  roughness,
  metalness = 0,
}) => {
  const geometry = useMemo(build, [build]);
  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial vertexColors roughness={roughness} metalness={metalness} />
    </mesh>
  );
};

// Seeded, so the clutter is the same on every visit and in the still renders
const rng = (seed: number) => () => {
  seed = (seed * 16807) % 2147483647;
  return seed / 2147483647;
};

/* ───────── concrete: jersey barriers ───────── */

const BARRIER_RUNS: { x: number; from: number; count: number }[] = [
  { x: -0.35, from: -19, count: 3 },
  { x: -0.35, from: -171, count: 4 },
  { x: 16.5, from: -169.5, count: 4 },
];
const CONCRETE = ['#8E8B84', '#85827B', '#96928A', '#7F7C76'];

const jersey = (): Shape => {
  const s = new Shape();
  s.moveTo(-0.3, 0);
  s.lineTo(0.3, 0);
  s.lineTo(0.3, 0.08);
  s.lineTo(0.11, 0.33);
  s.lineTo(0.08, 0.81);
  s.lineTo(-0.08, 0.81);
  s.lineTo(-0.11, 0.33);
  s.lineTo(-0.3, 0.08);
  s.closePath();
  return s;
};

const buildBarriers = (): BufferGeometry => {
  const r = rng(3);
  const profile = jersey();
  const parts: BufferGeometry[] = [];
  BARRIER_RUNS.forEach(({ x, from, count }) => {
    for (let i = 0; i < count; i++) {
      const g = new ExtrudeGeometry(profile, { depth: 3, bevelEnabled: false })
        .translate(0, 0, -1.5)
        .rotateY((r() - 0.5) * 0.03)
        .translate(x + (r() - 0.5) * 0.08, 0, from - i * 3.12);
      parts.push(tint(g, CONCRETE[Math.floor(r() * CONCRETE.length)]));
    }
  });
  return merge(parts);
};

/* ───────── cones, pallets, crates, drums ───────── */

const CONES: [number, number][] = [
  [13.4, 9.2],
  [13.5, 7.7],
  [13.3, 6.2],
  ...[0, 1, 2, 3, 4].map((i): [number, number] => [4.2, -48 - i * 2]),
  [2.7, -185.5],
  [2.8, -187.5],
  [2.6, -189.5],
];

const buildCones = (): BufferGeometry => {
  const parts: BufferGeometry[] = [];
  CONES.forEach(([x, z]) => {
    parts.push(tint(new BoxGeometry(0.4, 0.04, 0.4).translate(x, 0.02, z), '#2A2A2C'));
    parts.push(tint(new ConeGeometry(0.16, 0.66, 14).translate(x, 0.37, z), '#C0612F'));
    // Reflective collar
    parts.push(tint(new CylinderGeometry(0.066, 0.092, 0.11, 14).translate(x, 0.34, z), '#E9E2D2'));
  });
  return merge(parts);
};

const WOOD = ['#8F7B5A', '#86704F', '#9A8662'];

// One pallet: five deck boards over three stringers
const pallet = (x: number, y: number, z: number, rotY: number, color: string): BufferGeometry[] => {
  const parts: BufferGeometry[] = [];
  for (let i = 0; i < 5; i++) parts.push(new BoxGeometry(1.2, 0.022, 0.15).translate(0, 0.133, -0.42 + i * 0.21));
  [-0.45, 0, 0.45].forEach((sx) => parts.push(new BoxGeometry(0.1, 0.1, 1).translate(sx, 0.07, 0)));
  for (let i = 0; i < 3; i++) parts.push(new BoxGeometry(1.2, 0.02, 0.14).translate(0, 0.01, -0.42 + i * 0.42));
  return parts.map((p) => tint(p.rotateY(rotY).translate(x, y, z), color));
};

const PALLET_STACKS: { at: V3; count: number; rot: number }[] = [
  { at: [5.2, 0, -49.5], count: 7, rot: 0.05 },
  { at: [5.35, 0, -51], count: 4, rot: -0.08 },
  { at: [17.7, 0, -230.2], count: 9, rot: 0.1 },
  { at: [21.4, 0, -20.2], count: 5, rot: -0.3 },
];
const CRATES: { at: V3; size: number }[] = [
  { at: [17.8, 0, -227.9], size: 1.1 },
  { at: [17.9, 1.1, -228.0], size: 0.9 },
  { at: [18.9, 0, -228.3], size: 1.0 },
  { at: [3.9, 0, -50.4], size: 0.9 },
];

const buildWood = (): BufferGeometry => {
  const r = rng(29);
  const parts: BufferGeometry[] = [];
  PALLET_STACKS.forEach(({ at, count, rot }) => {
    for (let i = 0; i < count; i++) {
      parts.push(...pallet(at[0] + (r() - 0.5) * 0.06, i * 0.145, at[2], rot + (r() - 0.5) * 0.06, WOOD[i % WOOD.length]));
    }
  });
  CRATES.forEach(({ at, size }, i) => {
    parts.push(tint(new BoxGeometry(size, size, size).rotateY(r() * 0.3).translate(at[0], at[1] + size / 2, at[2]), WOOD[i % WOOD.length]));
    // Batten across each face
    parts.push(tint(new BoxGeometry(size + 0.02, 0.08, size + 0.02).translate(at[0], at[1] + size * 0.3, at[2]), '#6E5B3E'));
  });
  return merge(parts);
};

const DRUM_CLUSTERS: { at: [number, number]; count: number }[] = [
  { at: [4.3, -40.2], count: 5 },
  { at: [21, -24.6], count: 4 },
  { at: [-0.9, -186.5], count: 6 },
];
const DRUM_PAINT = [PAL.paint.steel, PAL.paint.copper, PAL.paint.ink, '#5A6B52'];

const buildDrums = (): BufferGeometry => {
  const r = rng(41);
  const parts: BufferGeometry[] = [];
  DRUM_CLUSTERS.forEach(({ at, count }) => {
    for (let i = 0; i < count; i++) {
      const x = at[0] + (i % 3) * 0.62 + (r() - 0.5) * 0.1;
      const z = at[1] + Math.floor(i / 3) * 0.62 + (r() - 0.5) * 0.1;
      const paint = DRUM_PAINT[Math.floor(r() * DRUM_PAINT.length)];
      parts.push(tint(new CylinderGeometry(0.29, 0.29, 0.88, 18).translate(x, 0.44, z), paint));
      // Rolling hoops and the rim
      [0.3, 0.58].forEach((y) => parts.push(tint(new CylinderGeometry(0.3, 0.3, 0.03, 18).translate(x, y, z), paint)));
      parts.push(tint(new CylinderGeometry(0.28, 0.28, 0.02, 18).translate(x, 0.885, z), '#2B2F36'));
    }
  });
  return merge(parts);
};

/* ───────── a reach stacker moving a box ───────── */

const STACKER = { at: [-3.5, 0, -110] as V3, boomPitch: 0.44, boomLength: 7 };

const buildStacker = (): BufferGeometry => {
  const body = PAL.paint.copper;
  const dark = PAL.paint.dark;
  const parts: BufferGeometry[] = [];
  const add = (g: BufferGeometry, color: string): void => {
    parts.push(tint(g, color));
  };
  // Chassis, counterweight and engine hood
  add(new BoxGeometry(2.9, 1.1, 6.4).translate(0, 1.35, 0.3), body);
  add(new BoxGeometry(2.8, 1.5, 1.2).translate(0, 1.6, 3.2), body);
  add(new BoxGeometry(2.4, 0.9, 2).translate(0, 2.35, 2.1), body);
  // Cab: frame, glass
  add(new BoxGeometry(1.5, 1.9, 1.7).translate(-0.55, 2.85, 0.1), dark);
  add(new BoxGeometry(1.52, 1.1, 1.3).translate(-0.55, 3.15, 0.08), '#33414F');
  // Wheels (big front pair, smaller rear pair) and axles
  [
    [-1.45, -2, 0.85, 0.7],
    [1.45, -2, 0.85, 0.7],
    [-1.45, 2.5, 0.7, 0.55],
    [1.45, 2.5, 0.7, 0.55],
  ].forEach(([x, z, rad, wid]) => {
    add(new CylinderGeometry(rad, rad, wid, 20).rotateZ(Math.PI / 2).translate(x, rad, z), '#16181B');
    add(new CylinderGeometry(rad * 0.5, rad * 0.5, wid + 0.02, 12).rotateZ(Math.PI / 2).translate(x, rad, z), '#4A4E55');
  });
  // Boom: from a pivot over the rear axle, up and forward over the front
  const pivot: V3 = [0.55, 2.4, 1.9];
  add(
    new BoxGeometry(0.55, 0.6, STACKER.boomLength)
      .translate(0, 0, -STACKER.boomLength / 2)
      .rotateX(STACKER.boomPitch)
      .translate(...pivot),
    body,
  );
  // Lift cylinder under the boom
  add(new CylinderGeometry(0.14, 0.14, 3.2, 10).rotateX(Math.PI / 2 - 0.9).translate(0.55, 2.2, -0.6), '#8C9098');
  // Spreader at the boom tip
  const tip: V3 = [
    pivot[0],
    pivot[1] + Math.sin(STACKER.boomPitch) * STACKER.boomLength,
    pivot[2] - Math.cos(STACKER.boomPitch) * STACKER.boomLength,
  ];
  add(new BoxGeometry(6.2, 0.32, 0.55).translate(0, tip[1] - 0.35, tip[2]), '#C9A34A');
  add(new BoxGeometry(0.5, 0.5, 0.5).translate(pivot[0], tip[1] - 0.05, tip[2]), dark);
  return merge(parts).translate(...STACKER.at);
};

// Where the carried 20' box hangs, under the spreader (container centre, world space)
const carried = (): V3 => {
  const tipY = 2.4 + Math.sin(STACKER.boomPitch) * STACKER.boomLength;
  const tipZ = 1.9 - Math.cos(STACKER.boomPitch) * STACKER.boomLength;
  return [STACKER.at[0], tipY - 0.51 - 1.295, STACKER.at[2] + tipZ];
};

/* ───────── paint on the ground ───────── */

const LANE_LINES = [1.35, 15.25];
const ZEBRAS: { z: number; x0: number; x1: number }[] = [
  { z: 1, x0: 1.8, x1: 14.8 },
  { z: -180.5, x0: 1.8, x1: 14.8 },
];
const STOP_BARS: { x0: number; x1: number; z: number }[] = [
  { x0: 1.6, x1: 8.2, z: 4.1 },
  { x0: 1.6, x1: 15, z: -177.2 },
];
const ARROWS: [number, number][] = [
  [8.4, -26],
  [8.4, -58],
  [8.4, -168],
  [8.4, -206],
];

const arrow = (): Shape => {
  const s = new Shape();
  s.moveTo(-0.14, 0);
  s.lineTo(0.14, 0);
  s.lineTo(0.14, 2.2);
  s.lineTo(0.42, 2.2);
  s.lineTo(0, 3.1);
  s.lineTo(-0.42, 2.2);
  s.lineTo(-0.14, 2.2);
  s.closePath();
  return s;
};

const buildMarkings = (): { white: BufferGeometry; yellow: BufferGeometry } => {
  const flat = (w: number, d: number, x: number, z: number): BufferGeometry =>
    new BoxGeometry(w, 0.004, d).translate(x, 0.016, z);
  const white: BufferGeometry[] = [];
  ZEBRAS.forEach(({ z, x0, x1 }) => {
    for (let x = x0; x <= x1; x += 1.1) white.push(tint(flat(0.5, 3, x + 0.25, z), PAL.stencil));
  });
  STOP_BARS.forEach(({ x0, x1, z }) => white.push(tint(flat(x1 - x0, 0.4, (x0 + x1) / 2, z), PAL.stencil)));
  ARROWS.forEach(([x, z]) =>
    // Pointing down the lane (-z), the way the camera travels
    white.push(tint(new ShapeGeometry(arrow()).rotateX(-Math.PI / 2).translate(x, 0.017, z), PAL.stencil)),
  );
  const yellow = LANE_LINES.map((x) => tint(flat(0.14, 240, x, -108), '#C39A43'));
  return { white: merge(white), yellow: merge(yellow) };
};

const GROUND_WORDS: { text: string; at: [number, number] }[] = [
  { text: 'SLOW', at: [5.2, 10.8] },
  { text: 'A 12', at: [12.8, -31] },
  { text: 'B 04', at: [4.4, -104] },
  { text: 'C 07', at: [4.4, -132] },
  { text: 'C 15', at: [4.4, -156] },
  { text: 'STOP', at: [5.2, -175.2] },
  { text: 'QUAY', at: [5.2, -212] },
];

const Markings: React.FC = () => {
  const { white, yellow } = useMemo(buildMarkings, []);
  return (
    <group>
      <mesh geometry={white} userData={{ decal: true }}>
        <meshStandardMaterial vertexColors roughness={0.9} polygonOffset polygonOffsetFactor={-2} />
      </mesh>
      <mesh geometry={yellow} userData={{ decal: true }}>
        <meshStandardMaterial vertexColors roughness={0.85} polygonOffset polygonOffsetFactor={-2} />
      </mesh>
      {GROUND_WORDS.map(({ text, at }) => (
        <Paint key={text} position={[at[0], 0.02, at[1]]} rotation={[-Math.PI / 2, 0, 0]} fontSize={1.25} color="#C8BFAA">
          {text}
        </Paint>
      ))}
    </group>
  );
};

/* ───────── wet patches: dark by day, catching the lamps by night ───────── */

const PUDDLES: [number, number, number, number, number][] = [
  // x, z, radius x, radius z, rotation
  [3.1, -14.5, 1.3, 0.75, 0.3],
  [13.9, -29.5, 1.6, 0.9, -0.2],
  [2.6, -120, 1.2, 0.7, 0.5],
  [12.4, -151.5, 1.4, 0.8, 0.1],
  [5.6, -204, 1.8, 1, -0.4],
  [9.3, 9.6, 1.1, 0.6, 0.2],
  [2.9, -223.5, 1.3, 0.7, 0.6],
];

const buildPuddles = (): BufferGeometry =>
  merge(
    PUDDLES.map(([x, z, rx, rz, rot]) =>
      new CircleGeometry(1, 28)
        .rotateX(-Math.PI / 2)
        .scale(rx, 1, rz)
        .rotateY(rot)
        .translate(x, 0.012, z),
    ),
  );

// Night: near-black and glossy, so the lamps and the moon glint in them. Day: just darker, wetter asphalt.
const WET = { night: new Color('#141920'), day: new Color('#3E444C') };

const Puddles: React.FC = () => {
  const geometry = useMemo(buildPuddles, []);
  const material = useRef<MeshStandardMaterial>(null);
  useFrame(() => {
    const m = material.current;
    if (!m) return;
    m.color.lerpColors(WET.night, WET.day, daylight.value);
    m.metalness = 0.5 - 0.5 * daylight.value;
    m.roughness = 0.12 + 0.76 * daylight.value;
  });
  return (
    <mesh geometry={geometry} userData={{ decal: true }}>
      <meshStandardMaterial ref={material} color="#141920" roughness={0.12} metalness={0.5} polygonOffset polygonOffsetFactor={-1} />
    </mesh>
  );
};

export const Yardwork: React.FC = () => (
  <group>
    <Merged build={buildBarriers} roughness={0.95} />
    <Merged build={buildCones} roughness={0.6} />
    <Merged build={buildWood} roughness={0.92} />
    <Merged build={buildDrums} roughness={0.55} metalness={0.45} />
    <Merged build={buildStacker} roughness={0.6} metalness={0.3} />
    <Container size={20} paint="ink" position={carried()} />
    <Markings />
    <Puddles />
  </group>
);
