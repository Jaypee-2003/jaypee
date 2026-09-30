import React, { useMemo } from 'react';
import { BoxGeometry, BufferGeometry, CylinderGeometry } from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { AIBoard, AI_BOARD } from '../../content/AIBoard';
import { stillStop } from '../../site/mode';
import { PAL } from '../palette';
import { Placard } from '../Placard';
import { Halos, Paint, Post } from '../props';
import { LampGlow, LampPoint } from '../daylight';

// AI: the terminal's operations tower — the yard's brain, where every move is planned. A concrete shaft,
// a glazed control cab lit from inside at night (warm light and the cool glow of screens), a radar and an
// antenna mast. Its operations display stands at the foot of the tower, facing the lane.

const TOWER = { x: 24, z: -72, shaft: 10, cab: 3.2 };
const BOARD = { at: [13.6, 2.95, -61.5] as [number, number, number], rotY: -0.63, width: 6.2 };
const boardHeight = (BOARD.width * AI_BOARD.height) / AI_BOARD.width;

const CONCRETE = '#8C8A84';

export const Tower: React.FC = () => {
  const { x, z, shaft, cab } = TOWER;
  const top = shaft + cab;

  // Structure in one mesh: shaft with a stair core, cab floor and roof, window mullions, radar and mast
  const [concrete, steel, glass, screens] = useMemo(() => {
    const c: BufferGeometry[] = [
      new BoxGeometry(3.4, shaft, 3.4).translate(x, shaft / 2, z),
      new BoxGeometry(1.4, shaft - 1, 1.2).translate(x - 2.1, (shaft - 1) / 2, z + 0.6),
      new BoxGeometry(7, 0.4, 7).translate(x, shaft + 0.2, z),
    ];
    const s: BufferGeometry[] = [
      new BoxGeometry(7.6, 0.35, 7.6).translate(x, top + 0.18, z),
      // Mullions at the cab's corners and along each face
      ...[-1, 1].flatMap((sx) => [-1, 1].map((sz) => new BoxGeometry(0.16, cab, 0.16).translate(x + sx * 3.3, shaft + 0.4 + cab / 2, z + sz * 3.3))),
      ...[-1.1, 1.1].flatMap((o) => [
        new BoxGeometry(0.08, cab, 0.08).translate(x - 3.32, shaft + 0.4 + cab / 2, z + o),
        new BoxGeometry(0.08, cab, 0.08).translate(x + o, shaft + 0.4 + cab / 2, z + 3.32),
        new BoxGeometry(0.08, cab, 0.08).translate(x + o, shaft + 0.4 + cab / 2, z - 3.32),
      ]),
      // Radar: pedestal and bar
      new CylinderGeometry(0.25, 0.35, 0.8, 12).translate(x + 1.6, top + 0.75, z - 1.4),
      new BoxGeometry(3.2, 0.18, 0.3).rotateY(0.5).translate(x + 1.6, top + 1.25, z - 1.4),
      // Antenna mast with cross-arms
      new CylinderGeometry(0.06, 0.09, 5, 8).translate(x - 2, top + 2.8, z + 2),
      new BoxGeometry(1.2, 0.05, 0.05).translate(x - 2, top + 3.8, z + 2),
      new BoxGeometry(0.8, 0.05, 0.05).translate(x - 2, top + 4.6, z + 2),
      // Railing on the cab floor ledge
      new BoxGeometry(7, 0.05, 0.05).translate(x, shaft + 1.1, z + 3.5),
      new BoxGeometry(0.05, 0.05, 7).translate(x - 3.5, shaft + 1.1, z),
      // Door at the foot
      new BoxGeometry(0.06, 2.2, 1.1).translate(x - 1.73, 1.1, z - 0.6),
    ];
    // Glazing: slightly inset from the mullions
    const g = [new BoxGeometry(6.5, cab - 0.3, 6.5).translate(x, shaft + 0.4 + cab / 2, z)];
    // Screens inside the glass, facing the lane (-x) and the camera's approach (+z)
    const sc: BufferGeometry[] = [];
    [-2.2, -0.9, 0.5, 1.9].forEach((o, i) => {
      sc.push(new BoxGeometry(0.04, 0.7 + (i % 2) * 0.15, 1).translate(x - 3.28, shaft + 1.6, z + o));
      sc.push(new BoxGeometry(1, 0.7 + ((i + 1) % 2) * 0.15, 0.04).translate(x + o, shaft + 1.6, z + 3.28));
    });
    const merge = (parts: BufferGeometry[]): BufferGeometry => {
      const m = mergeGeometries(parts);
      parts.forEach((p) => p.dispose());
      return m;
    };
    return [merge(c), merge(s), merge(g), merge(sc)];
  }, [x, z, shaft, cab, top]);

  const beacon: [number, number, number] = [x - 2, top + 5.4, z + 2];

  return (
    <group>
      <mesh geometry={concrete}>
        <meshStandardMaterial color={CONCRETE} roughness={0.92} />
      </mesh>
      <mesh geometry={steel}>
        <meshStandardMaterial color={PAL.paint.dark} roughness={0.55} metalness={0.55} />
      </mesh>
      {/* Tinted glass: dark and glossy by day, warm with the room behind it at night */}
      <mesh geometry={glass} userData={{ noShadow: true }}>
        <LampGlow intensity={0.28} color="#2B3440" dayColor="#39495A" dayShare={0} />
      </mesh>
      <mesh geometry={screens} userData={{ noShadow: true }}>
        <LampGlow intensity={1.2} color="#FFB347" dayShare={0.25} />
      </mesh>
      <LampPoint position={[x - 5, shaft + 1.6, z]} color={PAL.lamp} intensity={40} distance={14} decay={2} />

      {/* Name down the shaft, and the operations mark on the cab ledge */}
      <Paint position={[x - 1.71, shaft - 2.6, z]} rotation={[0, -Math.PI / 2, 0]} fontSize={1.3} color={PAL.stencilDark}>
        OPS
      </Paint>
      <Paint position={[x - 3.52, shaft + 0.2, z]} rotation={[0, -Math.PI / 2, 0]} fontSize={0.3} face="label" color={PAL.stencil}>
        TERMINAL OPERATIONS · AI
      </Paint>

      {/* Red obstruction light on the mast */}
      <mesh position={beacon} userData={{ noShadow: true }}>
        <sphereGeometry args={[0.2, 12, 8]} />
        <LampGlow intensity={1.6} dayShare={0.35} color={PAL.warning} />
      </mesh>
      <Halos points={[{ at: beacon, size: 1.4 }]} strength={1} color={PAL.warning} dayShare={0.15} />
      <Halos points={[{ at: beacon, size: 5 }]} strength={0.3} color={PAL.warning} />

      {/* The operations display at the foot of the tower */}
      {!stillStop && (
        <group position={BOARD.at} rotation={[0, BOARD.rotY, 0]}>
          {[-BOARD.width / 2 + 0.5, BOARD.width / 2 - 0.5].map((px) => (
            <Post key={px} from={[px, -BOARD.at[1], -0.25]} height={BOARD.at[1] - boardHeight / 2 + 0.2} radius={0.11} />
          ))}
          <LampPoint position={[0, 0, 1.6]} color="#FFB347" intensity={14} distance={7} decay={2} dayShare={0.2} />
        </group>
      )}
      <Placard
        stop="tower"
        size={AI_BOARD}
        width={BOARD.width}
        position={BOARD.at}
        rotation={[0, BOARD.rotY, 0]}
        frame={{ color: '#11161E', border: 0.14, depth: 0.32 }}
      >
        <AIBoard />
      </Placard>
    </group>
  );
};
