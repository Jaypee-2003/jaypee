import React, { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, MeshStandardMaterial, Object3D, PointLight, SpotLight, Vector3 } from 'three';
import { GateSign, GATE_SIGN } from '../../content/GateSign';
import { stillStop } from '../../site/mode';
import { PAL } from '../palette';
import { LampGlow, useLampLight } from '../daylight';
import { useStaticSpotShadow } from '../shadows';
import { Placard } from '../Placard';
import { Container, Halos, IdMark, Paint, Post } from '../props';

// The gate: the name stencilled across a three-high stack under a floodlight, and in front of it the
// gate sign carrying the one live lamp in the yard — the availability status.

const FRONT = -2; // the stack's face
const C = FRONT - 1.22; // container centre line

const SIGN = { at: [-2.4, 1.85, 9] as [number, number, number], rotY: 0.67, width: 3.6 };
const signHeight = (SIGN.width * GATE_SIGN.height) / GATE_SIGN.width;
// The lamp sits on the sign's top edge, over its left end
const LAMP_LOCAL: [number, number, number] = [-SIGN.width / 2 + 0.55, signHeight / 2 + 0.34, 0.02];

const lampWorld = new Vector3();

// The status lamp breathes slowly. It keeps the scene rendering only while the gate is in shot, and
// only ~16 times a second — a three-second pulse doesn't need 60.
const StatusLamp: React.FC = () => {
  const lens = useRef<Mesh>(null);
  const light = useRef<PointLight>(null);
  const tick = useRef(0);
  useEffect(() => () => window.clearTimeout(tick.current), []);
  useFrame(({ clock, camera, invalidate }) => {
    if (!lens.current || !light.current) return;
    const near = camera.position.distanceTo(lens.current.getWorldPosition(lampWorld)) < 22;
    const pulse = near ? 0.78 + 0.22 * Math.sin(clock.elapsedTime * 2.1) : 1;
    (lens.current.material as MeshStandardMaterial).emissiveIntensity = pulse;
    light.current.intensity = 22 * pulse;
    if (near) {
      window.clearTimeout(tick.current);
      tick.current = window.setTimeout(() => invalidate(), 60);
    }
  });
  return (
    <group position={LAMP_LOCAL}>
      <mesh ref={lens}>
        <sphereGeometry args={[0.15, 20, 12]} />
        <meshStandardMaterial color={PAL.lamp} emissive={PAL.lamp} emissiveIntensity={1.25} toneMapped={false} />
      </mesh>
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.18, 0.2, 0.16, 16]} />
        <meshStandardMaterial color={PAL.paint.dark} roughness={0.5} metalness={0.6} />
      </mesh>
      <pointLight ref={light} position={[0, 0.1, 0.6]} color={PAL.lamp} intensity={22} distance={18} decay={2} />
      <Halos points={[{ at: [0, 0, 0], size: 2.4 }]} strength={0.9} />
    </group>
  );
};

// The floodlight on the name wall stands behind the camera, out of shot: only its light is seen
const Floodlight: React.FC = () => {
  const target = useRef<Object3D>(null);
  const spot = useRef<SpotLight>(null);
  useLampLight(spot, 1500);
  useStaticSpotShadow(spot, 6);
  useFrame(() => {
    if (spot.current && target.current && spot.current.target !== target.current) spot.current.target = target.current;
  });
  return (
    <group>
      <object3D ref={target} position={[-4, 5.2, FRONT]} />
      <spotLight ref={spot} position={[11, 14, 15]} color={PAL.lamp} intensity={1500} distance={70} angle={0.36} penumbra={0.8} decay={2} castShadow />
    </group>
  );
};

export const Gate: React.FC = () => (
  <group>
    {/* The stack. Surname on the middle tier, first name on top, stepped left like a set of initials. */}
    <Container paint="dark" position={[-15, 1.295, C]} />
    <Container paint="steel" position={[-2.6, 1.295, C]}>
      <IdMark code="JPBU 202609 0   45G1" x={5.8} z={1.225} />
    </Container>
    <Container paint="steel" position={[-15, 3.885, C]} />
    <Container paint="copper" position={[-2.6, 3.885, C]}>
      <Paint position={[1.1, -0.02, 1.225]} fontSize={2.5} fit={9.6}>
        BEHERA
      </Paint>
    </Container>
    <Container paint="ink" position={[-5.6, 6.475, C]}>
      <Paint position={[0, -0.02, 1.225]} fontSize={2.5} fit={11.3}>
        JAYPRAKASH
      </Paint>
    </Container>
    <Container paint="bone" position={[-18, 6.475, C]}>
      <IdMark code="FULL STACK · SAAS · APIS · AI" x={5.8} z={1.225} color={PAL.stencilDark} />
    </Container>

    {/* The gate sign on two legs, the status lamp on its top edge */}
    {!stillStop && (
      <group position={SIGN.at} rotation={[0, SIGN.rotY, 0]}>
        <Post from={[-SIGN.width / 2 + 0.35, -SIGN.at[1], -0.12]} height={SIGN.at[1] - signHeight / 2} radius={0.08} />
        <Post from={[SIGN.width / 2 - 0.35, -SIGN.at[1], -0.12]} height={SIGN.at[1] - signHeight / 2} radius={0.08} />
        <StatusLamp />
      </group>
    )}
    <Placard
      stop="gate"
      size={GATE_SIGN}
      width={SIGN.width}
      position={SIGN.at}
      rotation={[0, SIGN.rotY, 0]}
      frame={{ color: PAL.paint.dark, border: 0.05, depth: 0.1 }}
    >
      <GateSign />
    </Placard>
    <Floodlight />

    {/* Gatehouse and the raised barrier at the lane entrance, passed on the way in */}
    <mesh position={[11.4, 1.4, 5]}>
      <boxGeometry args={[3, 2.8, 3]} />
      <meshStandardMaterial color={PAL.paint.bone} roughness={0.8} />
    </mesh>
    <mesh position={[9.89, 1.6, 5]} rotation={[0, -Math.PI / 2, 0]}>
      <planeGeometry args={[2.2, 1]} />
      <LampGlow intensity={0.7} dayShare={0.15} />
    </mesh>
    {/* Barrier post, and the raised arm in bone and warning red */}
    <mesh position={[9.6, 0.55, 7.4]}>
      <boxGeometry args={[0.36, 1.1, 0.36]} />
      <meshStandardMaterial color={PAL.paint.dark} roughness={0.6} metalness={0.4} />
    </mesh>
    <group position={[9.6, 1.05, 7.4]} rotation={[0, 0, 1.25]}>
      {Array.from({ length: 8 }, (_, i) => (
        <mesh key={i} position={[0.4 + i * 0.8, 0, 0]}>
          <boxGeometry args={[0.8, 0.14, 0.14]} />
          <meshStandardMaterial color={i % 2 ? PAL.warning : PAL.stencil} roughness={0.6} />
        </mesh>
      ))}
      {/* Counterweight */}
      <mesh position={[-0.45, 0, 0]}>
        <boxGeometry args={[0.6, 0.3, 0.3]} />
        <meshStandardMaterial color={PAL.paint.dark} roughness={0.6} metalness={0.4} />
      </mesh>
    </group>
  </group>
);
