import React, { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import {
  BoxGeometry,
  BufferGeometry,
  Color,
  CylinderGeometry,
  DirectionalLight,
  EdgesGeometry,
  Fog,
  HemisphereLight,
  LineBasicMaterial,
  Matrix4,
  MeshStandardMaterial,
  PlaneGeometry,
  ShaderMaterial,
  Vector3,
} from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { PAL, Paint } from './palette';
import { FOG } from './fog';
import { asphaltNoise } from './textures';
import { Box, Halos, Pools, Stacks } from './props';
import { DAY_SKY, daylight, LampGlow, lampShare, NIGHT_SKY } from './daylight';

// The yard around the stops: ground, lanes, stacked cargo, lamp poles, cranes, the quay and the sky glow.

// Seeded, so the yard is the same on every visit (and in the still renders)
const rng = (seed: number) => () => {
  seed = (seed * 16807) % 2147483647;
  return seed / 2147483647;
};

// Keep-out zones (x0, x1, z0, z1) where the stops' own objects stand, and the camera lane
const CLEAR: [number, number, number, number][] = [
  [-26, 9, -12, 12], // the gate and the name wall
  [1.6, 16, -210, 30], // the lane the camera travels
  [16, 26, -24, -10], // notice board
  [-16, 10, -56, -30], // loading bay
  [16, 24, -140, -56], // project containers
  [-2, 24, -205, -150], // signal gantry and dispatch office
];
const clear = (x: number, z: number, hx: number, hz: number): boolean =>
  !CLEAR.some(([x0, x1, z0, z1]) => x + hx > x0 && x - hx < x1 && z + hz > z0 && z - hz < z1);

const PAINTS: [Paint, number][] = [
  ['dark', 0.3],
  ['ink', 0.3],
  ['steel', 0.25],
  ['copper', 0.1],
  ['bone', 0.05],
];

const buildStacks = (): Box[] => {
  const r = rng(11);
  const pickPaint = (): Paint => {
    let t = r();
    for (const [p, w] of PAINTS) {
      if ((t -= w) <= 0) return p;
    }
    return 'dark';
  };
  const boxes: Box[] = [];
  const block = (xs: number[], zs: number[]) => {
    xs.forEach((x) =>
      zs.forEach((z) => {
        if (r() < 0.12 || !clear(x, z, 1.3, 6.2)) return;
        const tiers = 1 + Math.floor(r() * r() * 4);
        for (let t = 0; t < tiers; t++) boxes.push({ position: [x, 1.295 + t * 2.59, z], rotationY: Math.PI / 2, paint: pickPaint() });
      }),
    );
  };
  const range = (from: number, to: number, step: number): number[] => {
    const out: number[] = [];
    for (let v = from; step > 0 ? v <= to : v >= to; v += step) out.push(v);
    return out;
  };
  // Blocks of rows either side of the lane, containers end to end along Z
  block(range(-9, -30, -2.6), range(-18, -190, -13));
  block(range(-38, -52, -2.6), range(-10, -190, -13));
  block(range(26, 44, 2.6), range(8, -190, -13));
  block(range(52, 64, 2.6), range(0, -180, -13));
  // Rows behind the name wall run across the view
  range(-7.2, -14, -2.6).forEach((z, row) =>
    range(-24, 0, 12.4).forEach((x) => {
      const tiers = 2 + ((row + Math.round(x)) % 2);
      for (let t = 0; t < tiers; t++) boxes.push({ position: [x, 1.295 + t * 2.59, z], rotationY: 0, paint: pickPaint() });
    }),
  );
  return boxes;
};

/* ───────── lamp poles along the lane, placed in the gaps between stops ───────── */

const POLES: [number, number][] = [
  [0.8, -16],
  [0.8, -60],
  [0.8, -84],
  [0.8, -108],
  [0.8, -132],
  [0.8, -172],
  [15.6, -2],
  [15.6, -30],
  [15.6, -74],
  [15.6, -90],
  [15.6, -106],
  [15.6, -122],
  [15.6, -142],
  [15.6, -178],
];
const POLE_HEIGHT = 11;

// Lamp heads lean out over the lane
const HEADS = POLES.map(([x, z]) => [x + (x < 8 ? 1.2 : -1.2), POLE_HEIGHT - 0.3, z] as [number, number, number]);

const Poles: React.FC = () => {
  // Every pole is merged into two meshes: the steel, and the lit lamp heads
  const [steel, lamps] = useMemo(
    () => [
      mergeGeometries(
        POLES.flatMap(([x, z], i) => [
          new CylinderGeometry(0.09, 0.13, POLE_HEIGHT, 8).translate(x, POLE_HEIGHT / 2, z),
          new BoxGeometry(1.4, 0.12, 0.3).translate((x + HEADS[i][0]) / 2, POLE_HEIGHT - 0.1, z),
        ]),
      ),
      mergeGeometries(HEADS.map(([x, y, z]) => new BoxGeometry(0.7, 0.14, 0.4).translate(x, y, z))),
    ],
    [],
  );
  const heads = HEADS;
  return (
    <group>
      <mesh geometry={steel}>
        <meshStandardMaterial color={PAL.paint.dark} roughness={0.6} metalness={0.5} />
      </mesh>
      <mesh geometry={lamps}>
        <LampGlow intensity={1.1} />
      </mesh>
      <Halos points={heads.map((at) => ({ at, size: 2.6 }))} strength={0.5} />
      <Pools pools={heads.map(([x, , z]) => ({ at: [x, z] as [number, number], radius: 8 }))} />
    </group>
  );
};

/* ───────── cranes: steel lattice drawn as wireframe ───────── */

const boxEdges = (w: number, h: number, d: number, x: number, y: number, z: number): BufferGeometry =>
  new EdgesGeometry(new BoxGeometry(w, h, d)).applyMatrix4(new Matrix4().makeTranslation(x, y, z));

// Ship-to-shore crane: portal legs on the quay, boom out over the water, A-frame on top
const quayCrane = (cx: number): BufferGeometry[] => {
  const parts: BufferGeometry[] = [];
  const legs = [
    [-8, -194],
    [8, -194],
    [-8, -206],
    [8, -206],
  ];
  legs.forEach(([dx, z]) => parts.push(boxEdges(1.2, 36, 1.2, cx + dx, 18, z)));
  // Leg bracing
  [-194, -206].forEach((z) => [8, 20, 30].forEach((y) => parts.push(boxEdges(16, 0.8, 0.8, cx, y, z))));
  // Boom: back over the quay, out over the water
  parts.push(boxEdges(3, 2.4, 78, cx, 37.5, -226));
  for (let z = -190; z > -264; z -= 6) parts.push(boxEdges(3, 2.4, 0.2, cx, 37.5, z));
  // A-frame
  parts.push(boxEdges(1, 20, 1, cx - 3, 48, -200), boxEdges(1, 20, 1, cx + 3, 48, -200));
  parts.push(boxEdges(8, 1, 1, cx, 58, -200));
  return parts;
};

// Rubber-tyred gantry over a block of stacks
const yardGantry = (x0: number, x1: number, z: number): BufferGeometry[] => [
  boxEdges(0.8, 17, 0.8, x0, 8.5, z - 3),
  boxEdges(0.8, 17, 0.8, x0, 8.5, z + 3),
  boxEdges(0.8, 17, 0.8, x1, 8.5, z - 3),
  boxEdges(0.8, 17, 0.8, x1, 8.5, z + 3),
  boxEdges(x1 - x0 + 0.8, 1.4, 0.8, (x0 + x1) / 2, 17, z - 3),
  boxEdges(x1 - x0 + 0.8, 1.4, 0.8, (x0 + x1) / 2, 17, z + 3),
];

const CRANES_AT = [-22, 34, 60];

const Cranes: React.FC = () => {
  const geometry = useMemo(
    () =>
      mergeGeometries([
        ...CRANES_AT.flatMap(quayCrane),
        ...yardGantry(-31, -8, -96),
        ...yardGantry(-31, -8, -150),
        ...yardGantry(25, 45, -44),
        ...yardGantry(25, 45, -118),
      ]),
    [],
  );
  const material = useMemo(() => new LineBasicMaterial({ color: PAL.wire }), []);
  // Warning lamps on the crane tops and boom tips
  const warnings = CRANES_AT.flatMap((cx) => [
    { at: [cx, 58.8, -200] as [number, number, number], size: 3 },
    { at: [cx, 38.9, -264] as [number, number, number], size: 3 },
  ]);
  return (
    <group>
      <lineSegments geometry={geometry} material={material} />
      <Halos points={warnings} strength={0.8} />
    </group>
  );
};

/* ───────── ground, lane paint, quay, water and the sky glow ───────── */

const QUAY_Z = -201;

// Surfaces that only look this dark because the night is: by day they take their real colours
const SURFACE = {
  asphalt: { night: new Color(PAL.asphalt), day: new Color('#4B4F55') },
  concrete: { night: new Color(PAL.concrete), day: new Color('#8A8A86') },
  water: { night: new Color(PAL.water), day: new Color('#566674') },
};

const Ground: React.FC = () => {
  const asphalt = useRef<MeshStandardMaterial>(null);
  const concrete = useRef<MeshStandardMaterial>(null);
  const water = useRef<MeshStandardMaterial>(null);
  useFrame(() => {
    const t = daylight.value;
    asphalt.current?.color.lerpColors(SURFACE.asphalt.night, SURFACE.asphalt.day, t);
    concrete.current?.color.lerpColors(SURFACE.concrete.night, SURFACE.concrete.day, t);
    water.current?.color.lerpColors(SURFACE.water.night, SURFACE.water.day, t);
  });
  const map = useMemo(() => {
    const t = asphaltNoise().clone();
    t.repeat.set(70, 70);
    t.needsUpdate = true;
    return t;
  }, []);
  // Lane edge dashes, merged into one mesh
  const dashes = useMemo(() => {
    const parts: BufferGeometry[] = [];
    for (let z = 14; z > QUAY_Z + 6; z -= 7) {
      [2.2, 14.4].forEach((x) => parts.push(new PlaneGeometry(0.16, 3.2).rotateX(-Math.PI / 2).translate(x, 0.015, z)));
    }
    return mergeGeometries(parts);
  }, []);
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[5, 0, (60 + QUAY_Z) / 2]}>
        <planeGeometry args={[320, 60 - QUAY_Z]} />
        <meshStandardMaterial ref={asphalt} color={PAL.asphalt} map={map} roughness={0.96} metalness={0} />
      </mesh>
      <mesh geometry={dashes}>
        <meshStandardMaterial color={PAL.stencil} roughness={1} polygonOffset polygonOffsetFactor={-1} />
      </mesh>
      {/* Quay edge and bollards */}
      <mesh position={[5, 0.25, QUAY_Z - 0.6]}>
        <boxGeometry args={[320, 0.5, 1.2]} />
        <meshStandardMaterial ref={concrete} color={PAL.concrete} roughness={0.9} />
      </mesh>
      {[-14, -4, 6, 16, 26, 36].map((x) => (
        <mesh key={x} position={[x, 0.75, QUAY_Z - 0.6]}>
          <cylinderGeometry args={[0.22, 0.26, 0.5, 10]} />
          <meshStandardMaterial color={PAL.paint.dark} roughness={0.5} metalness={0.6} />
        </mesh>
      ))}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[5, -1.4, QUAY_Z - 300]}>
        <planeGeometry args={[900, 600]} />
        <meshStandardMaterial ref={water} color={PAL.water} roughness={0.22} metalness={0.7} />
      </mesh>
    </group>
  );
};

// Sodium glow of a city past the water, low on the horizon. Not fogged: it's what the fog is lit by.
// Gone by day, when the city's lights are off.
const Horizon: React.FC = () => {
  const material = useMemo(
    () =>
      new ShaderMaterial({
        uniforms: { uColor: { value: new Color(PAL.lamp) }, uNight: { value: 1 } },
        vertexShader: /* glsl */ `
          varying float vY;
          void main() { vY = uv.y; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
        `,
        fragmentShader: /* glsl */ `
          uniform vec3 uColor;
          uniform float uNight;
          varying float vY;
          void main() { gl_FragColor = vec4(uColor, pow(1.0 - vY, 3.0) * 0.16 * uNight); }
        `,
        transparent: true,
        depthWrite: false,
        fog: false,
      }),
    [],
  );
  useFrame(() => {
    material.uniforms.uNight.value = lampShare();
  });
  return (
    <mesh position={[5, 50, -620]} material={material}>
      <planeGeometry args={[1800, 130]} />
    </mesh>
  );
};

// The two lights of the sky. Night: a cool fill and a low moon, so everything warm comes from the lamps.
// Day: bright overcast fill and a high sun from over the left shoulder, lighting the faces along the route.
const SKY = {
  fill: { night: new Color('#5B6E90'), day: new Color('#DCE6EE') },
  ground: { night: new Color('#10151E'), day: new Color('#6A6152') },
  fillIntensity: { night: 1.7, day: 2.1 },
  key: { night: new Color(PAL.moon), day: new Color('#FFF0D8') },
  keyIntensity: { night: 1.1, day: 3.1 },
  keyPosition: { night: new Vector3(-60, 80, 30), day: new Vector3(-50, 110, 70) },
  background: { night: new Color(NIGHT_SKY), day: new Color(DAY_SKY) },
};

const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

export const Yard: React.FC = () => {
  const { scene } = useThree();
  const stacks = useMemo(buildStacks, []);
  const fill = useRef<HemisphereLight>(null);
  const key = useRef<DirectionalLight>(null);
  const applied = useRef(-1);

  useLayoutEffect(() => {
    scene.background = new Color(NIGHT_SKY);
    scene.fog = new Fog(NIGHT_SKY, FOG.near, FOG.far);
    applied.current = -1;
    return () => {
      scene.background = null;
      scene.fog = null;
    };
  }, [scene]);

  // Sky, fog and the two sky lights follow the daylight
  useFrame(() => {
    const t = daylight.value;
    if (t === applied.current || !fill.current || !key.current) return;
    applied.current = t;
    (scene.background as Color).lerpColors(SKY.background.night, SKY.background.day, t);
    (scene.fog as Fog).color.lerpColors(SKY.background.night, SKY.background.day, t);
    fill.current.color.lerpColors(SKY.fill.night, SKY.fill.day, t);
    fill.current.groundColor.lerpColors(SKY.ground.night, SKY.ground.day, t);
    fill.current.intensity = lerp(SKY.fillIntensity.night, SKY.fillIntensity.day, t);
    key.current.color.lerpColors(SKY.key.night, SKY.key.day, t);
    key.current.intensity = lerp(SKY.keyIntensity.night, SKY.keyIntensity.day, t);
    key.current.position.lerpVectors(SKY.keyPosition.night, SKY.keyPosition.day, t);
  });

  return (
    <>
      <hemisphereLight ref={fill} args={['#5B6E90', '#10151E', 1.7]} />
      <directionalLight ref={key} color={PAL.moon} intensity={1.1} position={[-60, 80, 30]} />
      <Ground />
      <Stacks boxes={stacks} />
      <Poles />
      <Cranes />
      <Horizon />
    </>
  );
};
