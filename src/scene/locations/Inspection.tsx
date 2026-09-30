import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { BoxGeometry, BufferGeometry, DoubleSide, MeshBasicMaterial, PlaneGeometry } from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { SecurityBoard, SECURITY_BOARD } from '../../content/SecurityBoard';
import { stillStop } from '../../site/mode';
import { PAL } from '../palette';
import { Placard } from '../Placard';
import { additiveLight, Halos, Paint } from '../props';
import { LampGlow, LampPoint, lampShare } from '../daylight';
import { Beams } from '../lights';

// Security: the terminal's scanner portal, spanning the lane. Every container leaves the yard through it;
// on this route, so does every project. Steel legs with scanner heads down their inner faces, hazard
// bands at the foot, a curtain of scan light between them at night, and the inspection board hanging
// from the beam, facing the approach.

const Z = -84;
const LEGS = [0.9, 15.9];
const HEIGHT = 8.6;
const BEAM_Y = 8.1;
const MID_X = (LEGS[0] + LEGS[1]) / 2;
const BOARD = { at: [MID_X, 5.2, Z + 0.55] as [number, number, number], width: 6.8 };
const boardHeight = (BOARD.width * SECURITY_BOARD.height) / SECURITY_BOARD.width;

const merge = (parts: BufferGeometry[]): BufferGeometry => {
  const m = mergeGeometries(parts);
  parts.forEach((p) => p.dispose());
  return m;
};

// A sheet of light that adds to whatever is behind it, only visible in the night air
const ScanCurtain: React.FC<{ geometry: BufferGeometry }> = ({ geometry }) => {
  const material = useRef<MeshBasicMaterial>(null);
  useFrame(() => {
    if (material.current) material.current.opacity = 0.13 * lampShare();
  });
  return (
    <mesh geometry={geometry} userData={{ noShadow: true }}>
      <meshBasicMaterial
        ref={material}
        color={PAL.lamp}
        transparent
        opacity={0.13}
        depthWrite={false}
        side={DoubleSide}
        premultipliedAlpha
        {...additiveLight}
      />
    </mesh>
  );
};

export const Inspection: React.FC = () => {
  const [steel, hazardInk, hazardAmber, heads, curtain] = useMemo(() => {
    const s: BufferGeometry[] = [];
    const ink: BufferGeometry[] = [];
    const amber: BufferGeometry[] = [];
    const h: BufferGeometry[] = [];
    LEGS.forEach((lx) => {
      s.push(new BoxGeometry(1.2, HEIGHT, 1.6).translate(lx, HEIGHT / 2, Z));
      // Foot plate
      s.push(new BoxGeometry(1.8, 0.2, 2.2).translate(lx, 0.1, Z));
      // Hazard band: alternating blocks wrapped round the foot of each leg
      for (let i = 0; i < 6; i++) {
        (i % 2 ? amber : ink).push(new BoxGeometry(1.24, 0.25, 1.64).translate(lx, 0.45 + i * 0.25, Z));
      }
      // Scanner heads down the inner face
      const inner = lx < MID_X ? lx + 0.62 : lx - 0.62;
      for (let y = 2.2; y < 7.6; y += 0.75) h.push(new BoxGeometry(0.05, 0.4, 1).translate(inner, y, Z));
    });
    // The beam, with a hazard strip along its underside
    s.push(new BoxGeometry(LEGS[1] - LEGS[0] + 1.2, 1.1, 1.6).translate(MID_X, BEAM_Y + 0.5, Z));
    for (let x = LEGS[0] + 0.6, i = 0; x < LEGS[1] - 0.6; x += 0.6, i += 1) {
      (i % 2 ? amber : ink).push(new BoxGeometry(0.6, 0.12, 1.62).translate(x + 0.3, BEAM_Y - 0.04, Z));
    }
    // Hangers down to the board (the still photographs leave the board out, so its hangers too)
    (stillStop ? [] : [-BOARD.width / 2 + 0.6, BOARD.width / 2 - 0.6]).forEach((dx) =>
      s.push(new BoxGeometry(0.08, BEAM_Y - (BOARD.at[1] + boardHeight / 2), 0.08).translate(
        MID_X + dx,
        (BEAM_Y + BOARD.at[1] + boardHeight / 2) / 2,
        Z + 0.4,
      )),
    );
    // Scan curtain: a thin sheet of light between the legs, below the board
    const c = new PlaneGeometry(LEGS[1] - LEGS[0] - 1.3, 2.9).translate(MID_X, 1.6, Z);
    return [merge(s), merge(ink), merge(amber), merge(h), c];
  }, []);

  return (
    <group>
      <mesh geometry={steel}>
        <meshStandardMaterial color="#2A3240" roughness={0.5} metalness={0.55} />
      </mesh>
      <mesh geometry={hazardInk}>
        <meshStandardMaterial color={PAL.paint.dark} roughness={0.6} />
      </mesh>
      <mesh geometry={hazardAmber}>
        <meshStandardMaterial color="#D69232" roughness={0.6} />
      </mesh>
      <mesh geometry={heads} userData={{ noShadow: true }}>
        <LampGlow intensity={1.5} dayShare={0.4} />
      </mesh>
      <ScanCurtain geometry={curtain} />

      <Paint position={[MID_X, BEAM_Y + 0.55, Z + 0.81]} fontSize={0.62} fit={14.5} color={PAL.stencil}>
        SECURITY INSPECTION · EVERY REQUEST CHECKED
      </Paint>

      {/* Down-lights under the beam, over the lane */}
      <Beams
        beams={[MID_X - 4.6, MID_X + 4.6].map((bx) => ({ top: [bx, BEAM_Y - 0.1, Z + 0.2] as [number, number, number], length: BEAM_Y - 0.1, radius: 2 }))}
        strength={0.14}
      />
      <Halos
        points={[MID_X - 4.6, MID_X + 4.6].map((bx) => ({ at: [bx, BEAM_Y - 0.12, Z + 0.2] as [number, number, number], size: 1.2 }))}
        strength={0.9}
      />
      <LampPoint position={[MID_X, BEAM_Y - 1, Z + 3.5]} color={PAL.lamp} intensity={60} distance={18} decay={2} />

      <Placard
        stop="inspection"
        size={SECURITY_BOARD}
        width={BOARD.width}
        position={BOARD.at}
        frame={{ color: PAL.paint.dark, border: 0.12, depth: 0.16 }}
      >
        <SecurityBoard />
      </Placard>
    </group>
  );
};
