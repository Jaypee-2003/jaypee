import React, { ReactNode, useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import {
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  Color,
  CustomBlending,
  InstancedMesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Object3D,
  PerspectiveCamera,
  OneFactor,
  ShaderMaterial,
  ZeroFactor,
} from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { containerGrime, corrugationBump, radialGlow, worldBox } from './textures';
import { PAL, Paint as PaintName } from './palette';
import { FOG } from './fog';
import { Paint } from './Paint';
import { lampShare } from './daylight';

/* ───────────────────────── Shipping containers ───────────────────────── */

// ISO sizes in metres: [length, height, width]. Long axis runs along X.
export const ISO = {
  40: [12.19, 2.59, 2.44],
  20: [6.06, 2.59, 2.44],
  10: [2.99, 2.59, 2.44],
} as const;
export type IsoSize = keyof typeof ISO;

// Matte painted, corrugated steel, weathered (see containerGrime). Shared per paint so every container
// of a colour is one material.
const steel = new Map<string, MeshStandardMaterial>();
export const containerMaterial = (paint: PaintName | 'instanced'): MeshStandardMaterial => {
  let m = steel.get(paint);
  if (!m) {
    m = new MeshStandardMaterial({
      color: paint === 'instanced' ? '#ffffff' : PAL.paint[paint],
      map: containerGrime(),
      roughness: 0.74,
      metalness: 0.28,
      bumpMap: corrugationBump(),
      bumpScale: 2.2,
    });
    steel.set(paint, m);
  }
  return m;
};

// The structural steel: same paint, a shade darker from wear, smooth rather than corrugated
const FRAME_SHADE = 0.78;
const frames = new Map<string, MeshStandardMaterial>();
export const frameMaterial = (paint: PaintName | 'instanced'): MeshStandardMaterial => {
  let m = frames.get(paint);
  if (!m) {
    const color = new Color(paint === 'instanced' ? '#ffffff' : PAL.paint[paint]).multiplyScalar(FRAME_SHADE);
    m = new MeshStandardMaterial({ color, roughness: 0.62, metalness: 0.38 });
    frames.set(paint, m);
  }
  return m;
};

// What makes a box read as a shipping container: corner posts and castings, top and bottom side rails,
// end header and sill, and on the door end (+x) flat doors with four locking bars, cam keepers, handles
// and hinges. In the container's local space, merged into one geometry per size.
const frameGeometries = new Map<IsoSize, BufferGeometry>();
export const containerFrame = (size: IsoSize): BufferGeometry => {
  const cached = frameGeometries.get(size);
  if (cached) return cached;
  const [l, h, w] = ISO[size];
  const parts: BufferGeometry[] = [];
  const box = (sx: number, sy: number, sz: number, x: number, y: number, z: number): void => {
    parts.push(new BoxGeometry(sx, sy, sz).translate(x, y, z));
  };
  const ends = [-1, 1];

  // Side rails, proud of the corrugation
  box(l - 0.02, 0.17, w + 0.03, 0, -h / 2 + 0.085, 0);
  box(l - 0.02, 0.12, w + 0.03, 0, h / 2 - 0.06, 0);
  ends.forEach((ex) => {
    // End header and sill
    box(0.05, 0.2, w, ex * (l / 2 + 0.005), h / 2 - 0.1, 0);
    box(0.05, 0.24, w, ex * (l / 2 + 0.005), -h / 2 + 0.12, 0);
    ends.forEach((ez) => {
      // Corner post, and a casting at each corner
      box(0.2, h - 0.02, 0.2, ex * (l / 2 - 0.09), 0, ez * (w / 2 - 0.09));
      ends.forEach((ey) => box(0.23, 0.14, 0.23, ex * (l / 2 - 0.1), ey * (h / 2 - 0.07), ez * (w / 2 - 0.1)));
    });
  });

  // Door end: two flat doors over the corrugated end wall, with the seam between them
  const door = l / 2 + 0.012;
  box(0.024, h - 0.44, w - 0.36, door, 0, 0);
  box(0.03, h - 0.44, 0.025, door + 0.012, 0, 0);
  [-0.915, -0.305, 0.305, 0.915].forEach((z) => {
    box(0.05, h - 0.34, 0.05, door + 0.035, 0, z); // locking bar
    ends.forEach((ey) => box(0.07, 0.11, 0.11, door + 0.04, ey * (h / 2 - 0.23), z)); // cam keepers
    box(0.05, 0.05, 0.3, door + 0.06, -0.18, z + Math.sign(z) * 0.14); // handle
  });
  ends.forEach((ez) =>
    [-0.85, -0.28, 0.28, 0.85].forEach((y) => box(0.06, 0.13, 0.08, door + 0.02, y, ez * (w / 2 - 0.21))),
  );

  const merged = mergeGeometries(parts);
  parts.forEach((g) => g.dispose());
  frameGeometries.set(size, merged);
  return merged;
};

interface ContainerProps {
  size?: IsoSize;
  paint: PaintName;
  position: [number, number, number];
  rotation?: [number, number, number];
  // Painted markings etc., in the container's local space. The +z side face sits at z = width / 2.
  children?: ReactNode;
}

export const Container: React.FC<ContainerProps> = ({ size = 40, paint, position, rotation, children }) => {
  const [l, h, w] = ISO[size];
  return (
    <group position={position} rotation={rotation}>
      <mesh geometry={worldBox(l, h, w)} material={containerMaterial(paint)} castShadow receiveShadow />
      <mesh geometry={containerFrame(size)} material={frameMaterial(paint)} castShadow receiveShadow />
      {children}
    </group>
  );
};

// Container-ID marking in the corner of a side, as on real boxes (owner code + serial, size/type code)
export const IdMark: React.FC<{ code: string; x: number; z: number; color?: string }> = ({ code, x, z, color }) => (
  <Paint position={[x, 0.86, z]} fontSize={0.2} face="label" color={color} anchorX="right">
    {code}
  </Paint>
);

/* ───────────────────────── Background stacks (one draw call) ───────────────────────── */

export interface Box {
  position: [number, number, number];
  rotationY: number;
  paint: PaintName;
}

export const Stacks: React.FC<{ boxes: Box[] }> = ({ boxes }) => {
  const shells = useRef<InstancedMesh>(null);
  const structure = useRef<InstancedMesh>(null);
  const [l, h, w] = ISO[40];
  useLayoutEffect(() => {
    const o = new Object3D();
    const c = new Color();
    [shells.current, structure.current].forEach((mesh) => {
      if (!mesh) return;
      boxes.forEach((b, i) => {
        o.position.set(...b.position);
        o.rotation.set(0, b.rotationY, 0);
        o.updateMatrix();
        mesh.setMatrixAt(i, o.matrix);
        mesh.setColorAt(i, c.set(PAL.paint[b.paint]));
      });
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
      mesh.computeBoundingSphere();
    });
  }, [boxes]);
  return (
    <>
      <instancedMesh
        ref={shells}
        args={[worldBox(l, h, w), containerMaterial('instanced'), boxes.length]}
        castShadow
        receiveShadow
      />
      <instancedMesh
        ref={structure}
        args={[containerFrame(40), frameMaterial('instanced'), boxes.length]}
        castShadow
        receiveShadow
      />
    </>
  );
};

/* ───────────────────────── Light: halos and pools ───────────────────────── */

// Light adds colour and leaves alpha alone. Where a placard shows through the canvas (alpha 0), the
// premultiplied colour composites *onto* the DOM — lamp glow falls across the sign — instead of
// turning the sprite's square opaque.
export const additiveLight = {
  blending: CustomBlending,
  blendSrc: OneFactor,
  blendDst: OneFactor,
  blendSrcAlpha: ZeroFactor,
  blendDstAlpha: OneFactor,
} as const;

// Scatter around each lamp, drawn as additive points in the scene (sized in metres, fogged with distance)
const haloVertex = /* glsl */ `
  attribute float aSize;
  uniform float uScale;
  varying float vFade;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * uScale / -mv.z;
    vFade = 1.0 - smoothstep(${FOG.near.toFixed(1)}, ${(FOG.far * 1.6).toFixed(1)}, -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;
const haloFragment = /* glsl */ `
  uniform sampler2D uMap;
  uniform vec3 uColor;
  uniform float uStrength;
  varying float vFade;
  void main() {
    float a = texture2D(uMap, gl_PointCoord).a;
    gl_FragColor = vec4(uColor * a * uStrength * vFade, 0.0);
  }
`;

// Halos are the glow of a lamp in night air: they fade out by day
export const Halos: React.FC<{
  points: { at: [number, number, number]; size: number }[];
  strength?: number;
  color?: string;
  // Share of the glow left by day (signals stay lit; street lamps go out)
  dayShare?: number;
}> = ({ points, strength = 0.55, color = PAL.lamp, dayShare = 0 }) => {
  const { size, camera, gl } = useThree();
  const geometry = useMemo(() => {
    const g = new BufferGeometry();
    g.setAttribute('position', new BufferAttribute(new Float32Array(points.flatMap((p) => p.at)), 3));
    g.setAttribute('aSize', new BufferAttribute(new Float32Array(points.map((p) => p.size)), 1));
    return g;
  }, [points]);
  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: haloVertex,
        fragmentShader: haloFragment,
        uniforms: {
          uMap: { value: radialGlow() },
          uColor: { value: new Color(color) },
          uStrength: { value: strength },
          uScale: { value: 1 },
        },
        transparent: true,
        depthWrite: false,
        ...additiveLight,
      }),
    [strength, color],
  );
  // World size → pixels at unit distance, for the current viewport height and FOV
  const fov = (camera as PerspectiveCamera).fov;
  material.uniforms.uScale.value = (size.height * gl.getPixelRatio()) / (2 * Math.tan((fov * Math.PI) / 360));
  useFrame(() => {
    material.uniforms.uStrength.value = strength * lampShare(dayShare);
  });
  return <points geometry={geometry} material={material} frustumCulled={false} />;
};

// Pools of lamplight on the asphalt: additive decals, one draw call for the whole yard
export const Pools: React.FC<{ pools: { at: [number, number]; radius: number }[] }> = ({ pools }) => {
  const ref = useRef<InstancedMesh>(null);
  const glow = useRef<MeshBasicMaterial>(null);
  useFrame(() => {
    if (glow.current) glow.current.opacity = 0.22 * lampShare();
  });
  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const o = new Object3D();
    pools.forEach((p, i) => {
      o.position.set(p.at[0], 0.02, p.at[1]);
      o.rotation.set(-Math.PI / 2, 0, 0);
      o.scale.setScalar(p.radius * 2);
      o.updateMatrix();
      mesh.setMatrixAt(i, o.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [pools]);
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, pools.length]}>
      <planeGeometry />
      <meshBasicMaterial
        ref={glow}
        map={radialGlow()}
        color={PAL.lamp}
        transparent
        opacity={0.22}
        depthWrite={false}
        premultipliedAlpha
        {...additiveLight}
      />
    </instancedMesh>
  );
};

/* ───────────────────────── Small parts ───────────────────────── */

// Matte steel post (sign legs, lamp poles)
export const Post: React.FC<{ from: [number, number, number]; height: number; radius?: number; color?: string }> = ({
  from,
  height,
  radius = 0.06,
  color = PAL.paint.dark,
}) => (
  <mesh position={[from[0], from[1] + height / 2, from[2]]}>
    <cylinderGeometry args={[radius, radius, height, 8]} />
    <meshStandardMaterial color={color} roughness={0.6} metalness={0.5} />
  </mesh>
);

// Re-exported so locations import every building block from one place
export { Paint };
