import React from 'react';
import { projects } from '../../data/profile';
import { Manifest, MANIFEST } from '../../content/Manifest';
import { PAL, Paint as PaintName } from '../palette';
import { Placard } from '../Placard';
import { Container, IdMark, Paint, Post } from '../props';
import { StopId } from '../../site/stops';
import { stillStop } from '../../site/mode';
import { LampPoint } from '../daylight';

// The project row: one two-high stack per project along the right of the lane, long sides facing it.
// The project's name is painted along the top container; its manifest stands on a tally board in front.

export const FILE_X = 20; // stack centre line
export const fileZ = (i: number): number => -100 - 16 * i;

// Each project's paint, in the three-colour system
const PAINTS: PaintName[] = ['bone', 'ink', 'steel', 'copper', 'dark'];
const MANIFEST_WIDTH = 4.6;
const manifestHeight = (MANIFEST_WIDTH * MANIFEST.height) / MANIFEST.width;
// Tally board in front of the stack, turned a little toward the approaching camera
const BOARD = { x: 13.9, y: 1.5, dz: 4.9, rotY: -0.96 };
export const ROW_LIGHTS = [1, 3];

// Rotated so each container's +z side faces the lane (world -X) and its +x end points down-lane (world +Z)
const FACING: [number, number, number] = [0, -Math.PI / 2, 0];

export const Row: React.FC = () => (
  <group>
    {projects.map((project, i) => {
      const paint = PAINTS[i % PAINTS.length];
      const ink = paint === 'bone' ? PAL.stencilDark : PAL.stencil;
      const z = fileZ(i);
      return (
        <group key={project.id}>
          <Container paint={paint} position={[FILE_X, 3.885, z]} rotation={FACING}>
            <Paint position={[-1.2, -0.02, 1.225]} fontSize={1.95} fit={8.4} color={ink}>
              {project.title.toUpperCase()}
            </Paint>
            <IdMark code={`${project.code}   45G1`} x={5.8} z={1.225} color={ink} />
          </Container>
          <Container paint={paint === 'dark' ? 'steel' : 'dark'} position={[FILE_X, 1.295, z]} rotation={FACING}>
            <Paint position={[-2.2, 0.1, 1.225]} fontSize={1.0} fit={2.8}>
              {project.code}
            </Paint>
          </Container>
          {!stillStop && (
            <group position={[BOARD.x, BOARD.y, z + BOARD.dz]} rotation={[0, BOARD.rotY, 0]}>
              {[-MANIFEST_WIDTH / 2 + 0.3, MANIFEST_WIDTH / 2 - 0.3].map((x) => (
                <Post key={x} from={[x, -BOARD.y, -0.1]} height={BOARD.y - manifestHeight / 2} radius={0.06} />
              ))}
            </group>
          )}
          <Placard
            stop={`file-${i + 1}` as StopId}
            size={MANIFEST}
            width={MANIFEST_WIDTH}
            position={[BOARD.x, BOARD.y, z + BOARD.dz]}
            rotation={[0, BOARD.rotY, 0]}
            frame={{ color: PAL.paint.dark, border: 0.06, depth: 0.08 }}
          >
            <Manifest project={project} index={i} />
          </Placard>
        </group>
      );
    })}
    {ROW_LIGHTS.map((i) => (
      <LampPoint key={i} position={[13.5, 7.5, fileZ(i)]} color={PAL.lamp} intensity={110} distance={30} decay={2} />
    ))}
  </group>
);
