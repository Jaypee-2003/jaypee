import React, { useMemo } from 'react';
import { BoxGeometry, BufferGeometry, CylinderGeometry, EdgesGeometry, LineBasicMaterial } from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { skillGroups } from '../../data/profile';
import { PAL } from '../palette';
import { Halos, Paint } from '../props';
import { LampPoint } from '../daylight';

// Skills as a signal gantry over the lane: one signal head per group, one lit lamp per skill, named
// beside it. (The same list is in the DOM for assistive tech — see SkillsBoard.)

const Z = -160;
const CENTER_X = 10.7;
const SPACING = 2.55;
const TOP = 8.1; // underside of the truss
const PLATE_W = 2.2;
const LAMP_STEP = 0.5;
const headX = (i: number): number => CENTER_X + (i - (skillGroups.length - 1) / 2) * SPACING;
const plateHeight = (n: number): number => 0.95 + n * LAMP_STEP;
const lampY = (k: number): number => TOP - 0.85 - k * LAMP_STEP;

const TOWER_X = [headX(0) - PLATE_W / 2 - 1.1, headX(skillGroups.length - 1) + PLATE_W / 2 + 1.1];

export const Signals: React.FC = () => {
  const lattice = useMemo(() => {
    const parts: BufferGeometry[] = [];
    const span = TOWER_X[1] - TOWER_X[0];
    TOWER_X.forEach((x) => {
      parts.push(new EdgesGeometry(new BoxGeometry(0.9, TOP + 1, 0.9)).translate(x, (TOP + 1) / 2, Z));
      for (let y = 1.2; y < TOP; y += 1.3) parts.push(new EdgesGeometry(new BoxGeometry(0.9, 0.02, 0.9)).translate(x, y, Z));
    });
    parts.push(new EdgesGeometry(new BoxGeometry(span, 1, 0.9)).translate((TOWER_X[0] + TOWER_X[1]) / 2, TOP + 0.5, Z));
    for (let x = TOWER_X[0]; x < TOWER_X[1]; x += 1.2) {
      parts.push(new EdgesGeometry(new BoxGeometry(0.02, 1, 0.9)).translate(x, TOP + 0.5, Z));
    }
    return mergeGeometries(parts);
  }, []);
  const wire = useMemo(() => new LineBasicMaterial({ color: PAL.wire }), []);

  // Signal heads: back plates and hangers in one mesh, lamp lenses in another
  const [plates, lenses, lamps] = useMemo(() => {
    const plateParts: BufferGeometry[] = [];
    const lensParts: BufferGeometry[] = [];
    const lampPoints: { at: [number, number, number]; size: number }[] = [];
    skillGroups.forEach((g, i) => {
      const x = headX(i);
      const h = plateHeight(g.skills.length);
      plateParts.push(new BoxGeometry(PLATE_W, h, 0.14).translate(x, TOP - h / 2, Z + 0.5));
      plateParts.push(new BoxGeometry(0.06, 0.4, 0.06).translate(x - 0.6, TOP + 0.1, Z + 0.5));
      plateParts.push(new BoxGeometry(0.06, 0.4, 0.06).translate(x + 0.6, TOP + 0.1, Z + 0.5));
      g.skills.forEach((_, k) => {
        const at: [number, number, number] = [x - PLATE_W / 2 + 0.34, lampY(k), Z + 0.6];
        lensParts.push(new CylinderGeometry(0.15, 0.15, 0.06, 18).rotateX(Math.PI / 2).translate(...at));
        // Bezel ring around each lens
        plateParts.push(new CylinderGeometry(0.2, 0.2, 0.05, 20).rotateX(Math.PI / 2).translate(at[0], at[1], at[2] - 0.02));
        // Visor over each lens
        plateParts.push(new BoxGeometry(0.4, 0.04, 0.22).translate(at[0], at[1] + 0.2, at[2] + 0.08));
        lampPoints.push({ at: [at[0], at[1], at[2] + 0.05], size: 0.95 });
      });
    });
    return [mergeGeometries(plateParts), mergeGeometries(lensParts), lampPoints];
  }, []);

  return (
    <group>
      <lineSegments geometry={lattice} material={wire} />
      <mesh position={[(TOWER_X[0] + TOWER_X[1]) / 2, TOP + 0.5, Z + 0.47]}>
        <boxGeometry args={[TOWER_X[1] - TOWER_X[0] - 1, 0.8, 0.06]} />
        <meshStandardMaterial color={PAL.paint.dark} roughness={0.7} metalness={0.4} />
      </mesh>
      <Paint position={[TOWER_X[0] + 1.2, TOP + 0.5, Z + 0.51]} fontSize={0.62} anchorX="left">
        SKILLS
      </Paint>
      <Paint position={[TOWER_X[1] - 1.2, TOP + 0.5, Z + 0.51]} fontSize={0.3} face="label" anchorX="right">
        {`${skillGroups.length} GROUPS · ${skillGroups.reduce((n, g) => n + g.skills.length, 0)} SIGNALS`}
      </Paint>

      <mesh geometry={plates}>
        <meshStandardMaterial color={PAL.paint.dark} roughness={0.75} metalness={0.35} />
      </mesh>
      <mesh geometry={lenses}>
        <meshStandardMaterial color={PAL.lamp} emissive={PAL.lamp} emissiveIntensity={1.15} toneMapped={false} />
      </mesh>
      {/* Signals stay lit by day, so a little of their glow stays too */}
      <Halos points={lamps.map((l) => ({ at: l.at, size: 0.42 }))} strength={0.9} dayShare={0.35} />
      <Halos points={lamps} strength={0.5} dayShare={0.12} />
      <LampPoint position={[CENTER_X, 5, Z + 4]} color={PAL.lamp} intensity={70} dayShare={0.25} distance={20} decay={2} />

      {skillGroups.map((g, i) => {
        const x = headX(i);
        return (
          <group key={g.name}>
            <Paint position={[x - PLATE_W / 2 + 0.16, TOP - 0.32, Z + 0.58]} fontSize={0.3} anchorX="left" fit={PLATE_W - 0.3}>
              {g.name.toUpperCase()}
            </Paint>
            {g.skills.map((skill, k) => (
              <Paint
                key={skill}
                position={[x - PLATE_W / 2 + 0.58, lampY(k), Z + 0.58]}
                fontSize={0.22}
                face="label"
                anchorX="left"
                fit={PLATE_W - 0.7}
              >
                {skill}
              </Paint>
            ))}
          </group>
        );
      })}
    </group>
  );
};
