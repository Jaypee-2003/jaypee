import React, { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';
import { StopId } from '../site/stops';
import { lookCurve, paramAtVh, posCurve, stillPose } from './rig';

const pos = new Vector3();
const look = new Vector3();

// Drives the camera off the page's scroll position. Rendering is on demand: scroll, resize and pointer
// movement request frames, and the rig keeps requesting them only until the damped camera settles.
export const CameraRig: React.FC<{ still: StopId | null }> = ({ still }) => {
  const { camera, invalidate, size } = useThree();
  const u = useRef<number | null>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const sway = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (still) return undefined;
    const wake = (): void => invalidate();
    const onPointer = (e: PointerEvent): void => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
      invalidate();
    };
    window.addEventListener('scroll', wake, { passive: true });
    window.addEventListener('pointermove', onPointer, { passive: true });
    return () => {
      window.removeEventListener('scroll', wake);
      window.removeEventListener('pointermove', onPointer);
    };
  }, [invalidate, still]);

  useFrame((_, delta) => {
    // A still is a fixed photograph: its own pose, no track, no sway
    if (still) {
      const pose = stillPose(still);
      camera.position.set(...pose.pos);
      camera.lookAt(...pose.look);
      return;
    }

    const dt = Math.min(delta, 0.1);
    const target = paramAtVh(window.scrollY / window.innerHeight);

    // Frame-rate independent damping toward the scroll position: the camera glides, never jumps
    if (u.current === null) u.current = target;
    else u.current += (target - u.current) * (1 - Math.exp(-dt * 3.4));
    const travelling = Math.abs(target - u.current) > 1e-5;
    if (!travelling) u.current = target;

    posCurve.getPoint(u.current, pos);
    lookCurve.getPoint(u.current, look);

    // Poses are framed for 16:10. On narrower windows, step back along the view line to keep the same width in shot.
    const pull = Math.min(Math.max(1.6 / (size.width / size.height), 1), 1.45);
    pos.sub(look).multiplyScalar(pull).add(look);
    camera.position.copy(pos);
    camera.lookAt(look);

    // A little hand-held sway toward the pointer, in camera space
    const k = 1 - Math.exp(-dt * 4);
    sway.current.x += (pointer.current.x - sway.current.x) * k;
    sway.current.y += (pointer.current.y - sway.current.y) * k;
    const swaying =
      Math.abs(pointer.current.x - sway.current.x) > 0.002 || Math.abs(pointer.current.y - sway.current.y) > 0.002;
    camera.translateX(sway.current.x * 0.22);
    camera.translateY(-sway.current.y * 0.12);

    if (travelling || swaying) invalidate();
  });

  return null;
};
