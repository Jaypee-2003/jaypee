import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  CylinderGeometry,
  Mesh,
  MeshBasicMaterial,
  ShaderMaterial,
  SRGBColorSpace,
  Texture,
} from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { PAL } from './palette';
import { FOG } from './fog';
import { additiveLight } from './props';
import { daylight, lampShare } from './daylight';

// Light made visible: beams of lamplight hanging in the night air, and a lit city across the water.

/* ───────── beams: a soft cone of light under each lamp ───────── */

export interface Beam {
  // Where the light leaves the lamp, how far down it reaches, and its radius there
  top: [number, number, number];
  length: number;
  radius: number;
  // Tilt away from straight down, radians around x and z
  tilt?: [number, number];
}

// Brightest at the lamp and fading to nothing at the ground; strongest where you look through the most
// air (the middle of the cone), soft at its silhouette; faded by distance like the fog. Added on top of
// what's behind without touching alpha, so a beam in front of a sign lightens the sign rather than
// hiding it.
const beamVertex = /* glsl */ `
  attribute float aAlong;
  varying float vAlong;
  varying float vFacing;
  varying float vFade;
  void main() {
    vAlong = aAlong;
    vec4 world = modelMatrix * vec4(position, 1.0);
    vec3 n = normalize(mat3(modelMatrix) * normal);
    vec3 toCamera = normalize(cameraPosition - world.xyz);
    vFacing = abs(dot(n, toCamera));
    vec4 mv = viewMatrix * world;
    vFade = 1.0 - smoothstep(${FOG.near.toFixed(1)}, ${(FOG.far * 1.3).toFixed(1)}, -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;
const beamFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uStrength;
  varying float vAlong;
  varying float vFacing;
  varying float vFade;
  void main() {
    float fall = pow(1.0 - vAlong, 1.8);
    float body = pow(vFacing, 1.6);
    gl_FragColor = vec4(uColor * fall * body * uStrength * vFade, 0.0);
  }
`;

const beamGeometry = (beams: Beam[]): BufferGeometry => {
  const parts = beams.map(({ top, length, radius, tilt = [0, 0] }) => {
    // Open cone, apex up; aAlong runs 0 at the lamp to 1 at the ground
    const g = new CylinderGeometry(0.22, radius, length, 28, 6, true).translate(0, -length / 2, 0);
    const pos = g.attributes.position;
    const along = new Float32Array(pos.count);
    for (let i = 0; i < pos.count; i++) along[i] = -pos.getY(i) / length;
    g.setAttribute('aAlong', new BufferAttribute(along, 1));
    g.rotateX(tilt[0]).rotateZ(tilt[1]).translate(...top);
    return g;
  });
  const merged = mergeGeometries(parts);
  parts.forEach((p) => p.dispose());
  return merged;
};

export const Beams: React.FC<{ beams: Beam[]; strength?: number; color?: string }> = ({
  beams,
  strength = 0.2,
  color = PAL.lamp,
}) => {
  const geometry = useMemo(() => beamGeometry(beams), [beams]);
  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: beamVertex,
        fragmentShader: beamFragment,
        uniforms: { uColor: { value: new Color(color) }, uStrength: { value: strength } },
        transparent: true,
        depthWrite: false,
        ...additiveLight,
      }),
    [color, strength],
  );
  const mesh = useRef<Mesh>(null);
  useFrame(() => {
    const share = lampShare();
    material.uniforms.uStrength.value = strength * share;
    if (mesh.current) mesh.current.visible = share > 0.01;
  });
  return <mesh ref={mesh} geometry={geometry} material={material} userData={{ noShadow: true }} />;
};

/* ───────── the city across the water ───────── */

// A skyline drawn once into two canvases: the silhouette, and its lit windows. Seeded, so it's the same
// on every visit.
const drawCity = (): { shape: Texture; windows: Texture } => {
  const W = 2048;
  const H = 256;
  const shape = document.createElement('canvas');
  const windows = document.createElement('canvas');
  shape.width = windows.width = W;
  shape.height = windows.height = H;
  const s = shape.getContext('2d') as CanvasRenderingContext2D;
  const w = windows.getContext('2d') as CanvasRenderingContext2D;
  let seed = 101;
  const rand = (): number => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };

  s.fillStyle = '#ffffff';
  let x = 0;
  while (x < W) {
    const bw = 14 + rand() * 46;
    // A few towers, mostly low blocks; quieter toward the edges
    const edge = Math.min(x, W - x) / (W / 2);
    const tall = rand() < 0.12 ? 1.8 : 1;
    const bh = (18 + rand() * 70) * tall * (0.45 + 0.55 * edge);
    s.fillRect(x, H - bh, bw, bh);
    // Rooftop kit: a mast or a tank on some
    if (rand() < 0.2) s.fillRect(x + bw * 0.4, H - bh - 10 - rand() * 14, 2, 24);
    if (rand() < 0.15) s.fillRect(x + bw * 0.2, H - bh - 5, bw * 0.3, 5);

    // Windows: a sparse grid, mostly warm, some cool office white
    for (let wy = H - bh + 6; wy < H - 6; wy += 7) {
      for (let wx = x + 4; wx < x + bw - 4; wx += 6) {
        if (rand() < 0.2) {
          const warm = rand() < 0.75;
          const a = 0.35 + rand() * 0.65;
          w.fillStyle = warm ? `rgba(255,178,92,${a})` : `rgba(210,225,255,${a})`;
          w.fillRect(wx, wy, 2, 3);
        }
      }
    }
    // Red lamps on the tallest tops
    if (tall > 1) {
      w.fillStyle = 'rgba(255,70,50,1)';
      w.fillRect(x + bw / 2 - 1.5, H - bh - 3, 3, 3);
    }
    x += bw + (rand() < 0.3 ? rand() * 20 : 0);
  }
  // Street lights along the waterfront
  for (let i = 0; i < 90; i++) {
    w.fillStyle = `rgba(255,170,80,${0.5 + rand() * 0.5})`;
    w.fillRect(rand() * W, H - 3 - rand() * 3, 2, 2);
  }

  const toTexture = (c: HTMLCanvasElement): Texture => {
    const t = new CanvasTexture(c);
    t.colorSpace = SRGBColorSpace;
    t.anisotropy = 4;
    return t;
  };
  return { shape: toTexture(shape), windows: toTexture(windows) };
};

const CITY = { z: -600, width: 1500, height: 88, base: -1.4 };
const SILHOUETTE = { night: new Color('#05080E'), day: new Color('#A3B0BC') };

export const City: React.FC = () => {
  const { shape, windows } = useMemo(drawCity, []);
  const silhouette = useRef<MeshBasicMaterial>(null);
  const lights = useRef<MeshBasicMaterial>(null);
  useFrame(() => {
    silhouette.current?.color.lerpColors(SILHOUETTE.night, SILHOUETTE.day, daylight.value);
    if (lights.current) lights.current.opacity = 0.9 * lampShare();
  });
  const position: [number, number, number] = [5, CITY.base + CITY.height / 2, CITY.z];
  return (
    <group userData={{ noShadow: true }}>
      <mesh position={position} userData={{ noShadow: true }}>
        <planeGeometry args={[CITY.width, CITY.height]} />
        <meshBasicMaterial ref={silhouette} alphaMap={shape} transparent depthWrite={false} fog={false} />
      </mesh>
      <mesh position={[position[0], position[1], position[2] + 0.5]} userData={{ noShadow: true }}>
        <planeGeometry args={[CITY.width, CITY.height]} />
        <meshBasicMaterial
          ref={lights}
          map={windows}
          transparent
          depthWrite={false}
          fog={false}
          premultipliedAlpha
          {...additiveLight}
        />
      </mesh>
    </group>
  );
};
