import React, { ReactNode, useLayoutEffect, useMemo, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import {
  BufferAttribute,
  BufferGeometry,
  Color,
  CustomBlending,
  InstancedMesh,
  MeshStandardMaterial,
  Object3D,
  PerspectiveCamera,
  OneFactor,
  ShaderMaterial,
  ZeroFactor,
} from 'three';
import { corrugationBump, radialGlow, worldBox } from './textures';
import { PAL, Paint as PaintName } from './palette';
import { FOG } from './fog';
import { Paint } from './Paint';

/* ───────────────────────── Shipping containers ───────────────────────── */

// ISO sizes in metres: [length, height, width]. Long axis runs along X.
export const ISO = {
  40: [12.19, 2.59, 2.44],
  20: [6.06, 2.59, 2.44],
  10: [2.99, 2.59, 2.44],
} as const;
export type IsoSize = keyof typeof ISO;

// Matte painted, corrugated steel. Shared per paint so every container of a colour is one material.
const steel = new Map<string, MeshStandardMaterial>();
export const containerMaterial = (paint: PaintName | 'instanced'): MeshStandardMaterial => {
  let m = steel.get(paint);
  if (!m) {
    m = new MeshStandardMaterial({
      color: paint === 'instanced' ? '#ffffff' : PAL.paint[paint],
      roughness: 0.74,
      metalness: 0.28,
      bumpMap: corrugationBump(),
      bumpScale: 2.2,
    });
    steel.set(paint, m);
  }
  return m;
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
      <mesh geometry={worldBox(l, h, w)} material={containerMaterial(paint)} />
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
  const ref = useRef<InstancedMesh>(null);
  const [l, h, w] = ISO[40];
  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const o = new Object3D();
    const c = new Color();
    boxes.forEach((b, i) => {
      o.position.set(...b.position);
      o.rotation.set(0, b.rotationY, 0);
      o.updateMatrix();
      mesh.setMatrixAt(i, o.matrix);
      mesh.setColorAt(i, c.set(PAL.paint[b.paint]));
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [boxes]);
  return <instancedMesh ref={ref} args={[worldBox(l, h, w), containerMaterial('instanced'), boxes.length]} />;
};

/* ───────────────────────── Light: halos and pools ───────────────────────── */

// Light adds colour and leaves alpha alone. Where a placard shows through the canvas (alpha 0), the
// premultiplied colour composites *onto* the DOM — lamp glow falls across the sign — instead of
// turning the sprite's square opaque.
const additiveLight = {
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

export const Halos: React.FC<{ points: { at: [number, number, number]; size: number }[]; strength?: number }> = ({
  points,
  strength = 0.55,
}) => {
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
          uColor: { value: new Color(PAL.lamp) },
          uStrength: { value: strength },
          uScale: { value: 1 },
        },
        transparent: true,
        depthWrite: false,
        ...additiveLight,
      }),
    [strength],
  );
  // World size → pixels at unit distance, for the current viewport height and FOV
  const fov = (camera as PerspectiveCamera).fov;
  material.uniforms.uScale.value = (size.height * gl.getPixelRatio()) / (2 * Math.tan((fov * Math.PI) / 360));
  return <points geometry={geometry} material={material} frustumCulled={false} />;
};

// Pools of lamplight on the asphalt: additive decals, one draw call for the whole yard
export const Pools: React.FC<{ pools: { at: [number, number]; radius: number }[] }> = ({ pools }) => {
  const ref = useRef<InstancedMesh>(null);
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

// An emissive lamp lens: the light source itself (pair with a pointLight and a halo where it matters)
export const LampLens: React.FC<{ at: [number, number, number]; radius?: number; facing?: number; dim?: boolean }> = ({
  at,
  radius = 0.16,
  facing = 0,
  dim = false,
}) => (
  <mesh position={at} rotation={[Math.PI / 2, 0, facing]}>
    <cylinderGeometry args={[radius, radius, 0.06, 20]} />
    <meshStandardMaterial
      color={dim ? '#2A2418' : PAL.lamp}
      emissive={PAL.lamp}
      emissiveIntensity={dim ? 0.05 : 1.15}
      roughness={0.4}
      toneMapped={false}
    />
  </mesh>
);

// Re-exported so locations import every building block from one place
export { Paint };
