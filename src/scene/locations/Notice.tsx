import React from 'react';
import { OperatorBoard, OPERATOR_BOARD } from '../../content/OperatorBoard';
import { PAL } from '../palette';
import { Placard } from '../Placard';
import { Halos, Post } from '../props';

// A steel notice board by the lane with the operator's file on it, lit by a hooded lamp on an arm

const AT: [number, number, number] = [17, 2.95, -17.2];
const ROT_Y = -0.62;
const WIDTH = 6.25;
const HEIGHT = (WIDTH * OPERATOR_BOARD.height) / OPERATOR_BOARD.width;

export const Notice: React.FC = () => {
  const lamp: [number, number, number] = [0, HEIGHT / 2 + 1.1, 1.1];
  return (
    <group>
      <group position={AT} rotation={[0, ROT_Y, 0]}>
        {[-WIDTH / 2 + 0.5, WIDTH / 2 - 0.5].map((x) => (
          <Post key={x} from={[x, -AT[1], -0.2]} height={AT[1] + HEIGHT / 2 + 1.2} radius={0.1} />
        ))}
        {/* Lamp arm and hood over the board */}
        <mesh position={[0, HEIGHT / 2 + 1.2, 0.45]}>
          <boxGeometry args={[0.12, 0.12, 1.3]} />
          <meshStandardMaterial color={PAL.paint.dark} roughness={0.6} metalness={0.5} />
        </mesh>
        <mesh position={[0, lamp[1] + 0.12, lamp[2]]}>
          <boxGeometry args={[1.6, 0.18, 0.5]} />
          <meshStandardMaterial color={PAL.paint.dark} roughness={0.6} metalness={0.5} />
        </mesh>
        <mesh position={lamp} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.3, 0.3]} />
          <meshStandardMaterial color={PAL.lamp} emissive={PAL.lamp} emissiveIntensity={1.1} toneMapped={false} side={2} />
        </mesh>
        <pointLight position={[0, lamp[1] - 0.2, lamp[2] + 0.6]} color={PAL.lamp} intensity={30} distance={16} decay={2} />
        <Halos points={[{ at: lamp, size: 2.4 }]} strength={0.6} />
      </group>
      <Placard
        stop="notice"
        size={OPERATOR_BOARD}
        width={WIDTH}
        position={AT}
        rotation={[0, ROT_Y, 0]}
        frame={{ color: PAL.paint.dark, border: 0.12, depth: 0.16 }}
      >
        <OperatorBoard />
      </Placard>
    </group>
  );
};
