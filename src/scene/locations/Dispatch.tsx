import React from 'react';
import {
  DispatchWindow,
  DISPATCH_WINDOW,
  EducationPlaque,
  EDUCATION_PLAQUE,
  OrderSlip,
  ORDER_SLIP,
} from '../../content/Dispatch';
import { PAL } from '../palette';
import { Placard } from '../Placard';
import { Halos, Paint, Post } from '../props';

// The end of the line: the dispatch office on the quay, water and cranes behind it. The window carries
// the hire details, the order slip on the stand in front is the contact form, and the education plaque
// is screwed to the wall beside the window.

const FRONT_Z = -195.5;
const CABIN = { x: 9.8, w: 13, h: 6, d: 5 };
const WINDOW = { at: [8, 2.72, FRONT_Z + 0.02] as [number, number, number], width: 5 };
const SLIP = { at: [13.9, 1.9, -190.4] as [number, number, number], rotY: -0.3, width: 2.25 };
const slipHeight = (SLIP.width * ORDER_SLIP.height) / ORDER_SLIP.width;
const PLAQUE = { at: [12.4, 4.35, FRONT_Z + 0.02] as [number, number, number], width: 2.4 };

export const Dispatch: React.FC = () => {
  const roofLamp: [number, number, number] = [CABIN.x + CABIN.w / 2 - 1, CABIN.h + 0.55, FRONT_Z + 0.3];
  return (
    <group>
      {/* The office: a bone portacabin with a fascia over the window */}
      <mesh position={[CABIN.x, CABIN.h / 2, FRONT_Z - CABIN.d / 2]}>
        <boxGeometry args={[CABIN.w, CABIN.h, CABIN.d]} />
        <meshStandardMaterial color={PAL.paint.bone} roughness={0.85} metalness={0.05} />
      </mesh>
      <mesh position={[CABIN.x, CABIN.h + 0.08, FRONT_Z - CABIN.d / 2 + 0.2]}>
        <boxGeometry args={[CABIN.w + 0.6, 0.16, CABIN.d + 0.8]} />
        <meshStandardMaterial color={PAL.paint.dark} roughness={0.7} />
      </mesh>
      <Paint position={[WINDOW.at[0], CABIN.h - 0.5, FRONT_Z + 0.02]} fontSize={0.72} color={PAL.stencilDark}>
        DISPATCH
      </Paint>
      {/* Door */}
      <mesh position={[CABIN.x + CABIN.w / 2 - 1.1, 1.15, FRONT_Z + 0.02]}>
        <planeGeometry args={[1.2, 2.3]} />
        <meshStandardMaterial color={PAL.paint.dark} roughness={0.7} />
      </mesh>
      <mesh position={roofLamp}>
        <sphereGeometry args={[0.2, 16, 10]} />
        <meshStandardMaterial color={PAL.lamp} emissive={PAL.lamp} emissiveIntensity={1.2} toneMapped={false} />
      </mesh>
      <Halos points={[{ at: roofLamp, size: 3 }]} strength={0.8} />
      <pointLight position={[CABIN.x, 5.4, FRONT_Z + 6]} color={PAL.lamp} intensity={55} distance={24} decay={2} />

      <Placard
        stop="dispatch"
        size={DISPATCH_WINDOW}
        width={WINDOW.width}
        position={WINDOW.at}
        frame={{ color: PAL.paint.dark, border: 0.14, depth: 0.12 }}
      >
        <DispatchWindow />
      </Placard>

      <Placard
        stop="dispatch"
        size={EDUCATION_PLAQUE}
        width={PLAQUE.width}
        position={PLAQUE.at}
        frame={{ color: PAL.paint.steel, border: 0.03, depth: 0.04 }}
      >
        <EducationPlaque />
      </Placard>

      {/* The order slip on a standing desk in front of the window */}
      <group position={SLIP.at} rotation={[0, SLIP.rotY, 0]}>
        <Post from={[0, -SLIP.at[1], -0.25]} height={SLIP.at[1] - slipHeight / 2 + 0.1} radius={0.1} />
        <mesh position={[0, -SLIP.at[1] + 0.03, -0.25]}>
          <cylinderGeometry args={[0.45, 0.5, 0.06, 16]} />
          <meshStandardMaterial color={PAL.paint.dark} roughness={0.6} metalness={0.5} />
        </mesh>
      </group>
      <Placard
        stop="dispatch"
        size={ORDER_SLIP}
        width={SLIP.width}
        position={SLIP.at}
        rotation={[0, SLIP.rotY, 0]}
        frame={{ color: PAL.paint.dark, border: 0.05, depth: 0.08 }}
      >
        <OrderSlip />
      </Placard>
    </group>
  );
};
