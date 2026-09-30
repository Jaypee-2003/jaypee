import React from 'react';
import {
  DispatchWindow,
  DISPATCH_WINDOW,
  EducationPlaque,
  EDUCATION_PLAQUE,
  OrderSlip,
  ORDER_SLIP,
} from '../../content/Dispatch';
import { stillStop } from '../../site/mode';
import { PAL } from '../palette';
import { Placard } from '../Placard';
import { Halos, Paint, Post } from '../props';
import { Beams } from '../lights';
import { past } from '../layout';
import { LampGlow, LampPoint } from '../daylight';

// The end of the line: the dispatch office on the quay, water and cranes behind it. The window carries
// the hire details, the order slip on the stand in front is the contact form, and the education plaque
// is screwed to the wall beside the window.

const FRONT_Z = past(-229.5);
const CABIN = { x: 9.8, w: 13, h: 6, d: 5 };
const WINDOW = { at: [8, 2.72, FRONT_Z + 0.02] as [number, number, number], width: 5 };
const SLIP = { at: [13.9, 1.9, past(-224.4)] as [number, number, number], rotY: -0.3, width: 2.25 };
const slipHeight = (SLIP.width * ORDER_SLIP.height) / ORDER_SLIP.width;
const PLAQUE = { at: [12.4, 4.35, FRONT_Z + 0.02] as [number, number, number], width: 2.4 };
const windowHeight = (WINDOW.width * DISPATCH_WINDOW.height) / DISPATCH_WINDOW.width;

// Gooseneck sign lamps either side of the DISPATCH lettering: an arm out from the wall, a dark shade,
// and a warm lens under it washing the wall and the letters
const GOOSENECK_X = [WINDOW.at[0] - 2.2, WINDOW.at[0] + 2.2];
const GOOSENECK = { y: 5.95, out: 0.62 };
const Goosenecks: React.FC = () => (
  <group>
    {GOOSENECK_X.map((x) => (
      <group key={x} position={[x, GOOSENECK.y, FRONT_Z]}>
        <mesh position={[0, 0, 0.04]}>
          <cylinderGeometry args={[0.09, 0.09, 0.06, 14]} />
          <meshStandardMaterial color={PAL.paint.dark} roughness={0.5} metalness={0.6} />
        </mesh>
        <mesh position={[0, 0.06, GOOSENECK.out / 2]} rotation={[Math.PI / 2 - 0.25, 0, 0]}>
          <cylinderGeometry args={[0.025, 0.025, GOOSENECK.out, 8]} />
          <meshStandardMaterial color={PAL.paint.dark} roughness={0.5} metalness={0.6} />
        </mesh>
        <mesh position={[0, 0.02, GOOSENECK.out]} rotation={[-0.35, 0, 0]}>
          <cylinderGeometry args={[0.07, 0.26, 0.2, 20, 1, true]} />
          <meshStandardMaterial color="#1B2029" roughness={0.45} metalness={0.6} side={2} />
        </mesh>
        <mesh position={[0, -0.075, GOOSENECK.out + 0.035]} rotation={[-0.35, 0, 0]}>
          <cylinderGeometry args={[0.24, 0.24, 0.01, 20]} />
          <LampGlow intensity={1.4} />
        </mesh>
        <LampPoint position={[0, -0.25, GOOSENECK.out + 0.2]} color={PAL.lamp} intensity={9} distance={4.5} decay={2} />
      </group>
    ))}
    <Halos points={GOOSENECK_X.map((x) => ({ at: [x, GOOSENECK.y - 0.1, FRONT_Z + GOOSENECK.out + 0.05] as [number, number, number], size: 0.8 }))} strength={0.9} />
    <Beams
      beams={GOOSENECK_X.map((x) => ({
        top: [x, GOOSENECK.y - 0.08, FRONT_Z + GOOSENECK.out + 0.04] as [number, number, number],
        length: 1.1,
        radius: 0.75,
        tilt: [-0.35, 0] as [number, number],
      }))}
      strength={0.22}
    />
  </group>
);

// In the still photograph the window has no lettering: it's lit from inside, blinds half drawn
const SLATS = Array.from({ length: 11 }, (_, i) => i);
const LitWindow: React.FC = () => (
  <group position={[WINDOW.at[0], WINDOW.at[1], FRONT_Z]}>
    <mesh position={[0, 0, 0.03]}>
      <boxGeometry args={[WINDOW.width + 0.28, windowHeight + 0.28, 0.1]} />
      <meshStandardMaterial color={PAL.paint.dark} roughness={0.7} />
    </mesh>
    <mesh position={[0, 0, 0.09]}>
      <planeGeometry args={[WINDOW.width, windowHeight]} />
      <LampGlow intensity={0.32} dayShare={0.05} dayColor="#3F4C58" />
    </mesh>
    {SLATS.map((i) => (
      <mesh key={i} position={[0, windowHeight / 2 - 0.12 - i * 0.19, 0.1]}>
        <planeGeometry args={[WINDOW.width, 0.1]} />
        <LampGlow color="#6B4A22" intensity={0.35} dayShare={0.05} dayColor="#B9B2A2" />
      </mesh>
    ))}
    {[-WINDOW.width / 6, WINDOW.width / 6].map((x) => (
      <mesh key={x} position={[x, 0, 0.12]}>
        <boxGeometry args={[0.1, windowHeight, 0.06]} />
        <meshStandardMaterial color={PAL.paint.dark} roughness={0.7} />
      </mesh>
    ))}
  </group>
);

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
      <Goosenecks />
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
        <LampGlow intensity={1.2} />
      </mesh>
      <Halos points={[{ at: roofLamp, size: 3 }]} strength={0.8} />
      <LampPoint position={[CABIN.x, 5.4, FRONT_Z + 6]} color={PAL.lamp} intensity={55} distance={24} decay={2} />

      {stillStop && <LitWindow />}
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
      {!stillStop && (
        <group position={SLIP.at} rotation={[0, SLIP.rotY, 0]}>
          <Post from={[0, -SLIP.at[1], -0.25]} height={SLIP.at[1] - slipHeight / 2 + 0.1} radius={0.1} />
          <mesh position={[0, -SLIP.at[1] + 0.03, -0.25]}>
            <cylinderGeometry args={[0.45, 0.5, 0.06, 16]} />
            <meshStandardMaterial color={PAL.paint.dark} roughness={0.6} metalness={0.5} />
          </mesh>
        </group>
      )}
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
