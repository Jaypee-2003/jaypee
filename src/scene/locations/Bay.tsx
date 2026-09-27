import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { BoxGeometry, BufferGeometry, EdgesGeometry, LineBasicMaterial, Object3D, SpotLight } from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { experience } from '../../data/profile';
import { CaseLightbox, CASE_LIGHTBOX } from '../../content/CaseLightbox';
import { PAL, Paint as PaintName } from '../palette';
import { Placard } from '../Placard';
import { Container, IdMark, Paint, Post } from '../props';

// The loading bay is Dukaan Dost's architecture, built at full size: the four modules are containers,
// hanging from one gantry beam — the shared REST API — which is piped into the Redis and MongoDB tanks.
// The amber lightbox beside it carries the case study.

const Z = -46; // container fronts face +Z, toward the lane
const MODULE_X = [-9.6, -6.2, -2.8, 0.6];
const MODULE_PAINT: PaintName[] = ['ink', 'steel', 'bone', 'copper'];
const BEAM = { x0: -12.2, x1: 3.2, y: 6.3 };
const TANKS: { x: number; label: string; paint: PaintName }[] = [
  { x: -9.4, label: 'REDIS', paint: 'copper' },
  { x: -3.6, label: 'MONGODB', paint: 'steel' },
];
const TANK_Z = Z - 6.2;

const LIGHTBOX = { at: [7.9, 3.15, -37.4] as [number, number, number], rotY: 0.3, width: 3.7 };
const lightboxHeight = (LIGHTBOX.width * CASE_LIGHTBOX.height) / CASE_LIGHTBOX.width;

const Towers: React.FC = () => {
  // Lattice legs for the gantry, drawn as wireframe steel
  const geometry = useMemo(() => {
    const parts: BufferGeometry[] = [];
    [BEAM.x0, BEAM.x1].forEach((x) => {
      parts.push(new EdgesGeometry(new BoxGeometry(1, BEAM.y, 1)).translate(x, BEAM.y / 2, Z));
      for (let y = 1; y < BEAM.y; y += 1.2) parts.push(new EdgesGeometry(new BoxGeometry(1, 0.02, 1)).translate(x, y, Z));
    });
    return mergeGeometries(parts);
  }, []);
  const material = useMemo(() => new LineBasicMaterial({ color: PAL.wire }), []);
  return <lineSegments geometry={geometry} material={material} />;
};

// Worklight over the bay, from a mast off to the right of the shot
const Worklight: React.FC = () => {
  const target = useRef<Object3D>(null);
  const spot = useRef<SpotLight>(null);
  useFrame(() => {
    if (spot.current && target.current && spot.current.target !== target.current) spot.current.target = target.current;
  });
  return (
    <group>
      <object3D ref={target} position={[-4.5, 2.5, Z]} />
      <spotLight ref={spot} position={[8, 15, -30]} color={PAL.lamp} intensity={1300} distance={60} angle={0.46} penumbra={0.8} decay={2} />
    </group>
  );
};

export const Bay: React.FC = () => {
  const beamLength = BEAM.x1 - BEAM.x0;
  const beamX = (BEAM.x0 + BEAM.x1) / 2;
  return (
    <group>
      {/* Modules */}
      {experience.modules.map((name, i) => (
        <Container key={name} size={10} paint={MODULE_PAINT[i]} position={[MODULE_X[i], 1.295, Z]}>
          <Paint
            position={[0, 0.25, 1.225]}
            fontSize={0.62}
            fit={2.5}
            color={MODULE_PAINT[i] === 'bone' ? PAL.stencilDark : PAL.stencil}
          >
            {name.toUpperCase()}
          </Paint>
          <IdMark code={`DKD-0${i + 1}`} x={1.35} z={1.225} color={MODULE_PAINT[i] === 'bone' ? PAL.stencilDark : undefined} />
        </Container>
      ))}

      {/* The API gantry: one beam every module hangs from, lit along its underside */}
      <Towers />
      <mesh position={[beamX, BEAM.y, Z]}>
        <boxGeometry args={[beamLength + 1, 0.9, 1]} />
        <meshStandardMaterial color={PAL.paint.dark} roughness={0.6} metalness={0.5} />
      </mesh>
      <Paint position={[beamX, BEAM.y, Z + 0.51]} fontSize={0.5} fit={12}>
        REST API · JWT + RBAC
      </Paint>
      <mesh position={[beamX, BEAM.y - 0.47, Z + 0.1]}>
        <boxGeometry args={[beamLength - 0.6, 0.05, 0.3]} />
        <meshStandardMaterial color={PAL.lamp} emissive={PAL.lamp} emissiveIntensity={1.2} toneMapped={false} />
      </mesh>
      <Worklight />
      {/* Hoist cables down to each module */}
      {MODULE_X.map((x) => (
        <Post key={x} from={[x, 2.59, Z]} height={BEAM.y - 0.45 - 2.59} radius={0.035} color={PAL.wire} />
      ))}

      {/* Data tanks behind, piped up into the beam */}
      {TANKS.map((t) => (
        <group key={t.label}>
          <mesh position={[t.x, 3, TANK_Z]}>
            <cylinderGeometry args={[1.5, 1.5, 6, 28]} />
            <meshStandardMaterial color={PAL.paint[t.paint]} roughness={0.55} metalness={0.45} />
          </mesh>
          <mesh position={[t.x, 3.2, TANK_Z + 1.52]}>
            <boxGeometry args={[2.3, 0.72, 0.05]} />
            <meshStandardMaterial color={PAL.paint.bone} roughness={0.8} />
          </mesh>
          <Paint position={[t.x, 3.2, TANK_Z + 1.56]} fontSize={0.52} fit={2.1} color={PAL.stencilDark}>
            {t.label}
          </Paint>
          <Post from={[t.x, 6, TANK_Z]} height={BEAM.y - 6 + 0.2} radius={0.16} color={PAL.paint.steel} />
          <mesh position={[t.x, BEAM.y + 0.2, (TANK_Z + Z) / 2]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.16, 0.16, Z - TANK_Z, 10]} />
            <meshStandardMaterial color={PAL.paint.steel} roughness={0.5} metalness={0.6} />
          </mesh>
        </group>
      ))}

      {/* The lightbox, on legs, spilling its light onto the lane */}
      <group position={LIGHTBOX.at} rotation={[0, LIGHTBOX.rotY, 0]}>
        {[-LIGHTBOX.width / 2 + 0.35, LIGHTBOX.width / 2 - 0.35].map((x) => (
          <Post key={x} from={[x, -LIGHTBOX.at[1], -0.2]} height={LIGHTBOX.at[1] - lightboxHeight / 2 + 0.2} radius={0.09} />
        ))}
        <pointLight position={[0, -0.5, 2.2]} color={PAL.lamp} intensity={45} distance={14} decay={2} />
      </group>
      <Placard
        stop="bay"
        size={CASE_LIGHTBOX}
        width={LIGHTBOX.width}
        position={LIGHTBOX.at}
        rotation={[0, LIGHTBOX.rotY, 0]}
        frame={{ color: PAL.paint.dark, border: 0.08, depth: 0.3 }}
      >
        <CaseLightbox inScene />
      </Placard>
    </group>
  );
};
