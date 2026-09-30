import React, { ReactNode, useEffect, useMemo, useRef } from 'react';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Group, Vector3 } from 'three';
import { StopId } from '../site/stops';
import { scrollToStop } from '../site/store';
import { FOG } from './fog';
import { slotFor } from './slots';
import { placardContainer } from '../content/kit';
import { stillStop } from '../site/mode';

// A real DOM element standing in the scene as a physical sign.
//  • drei <Html transform> maps the element onto a plane at this position with CSS 3D, so it has real
//    depth, perspective and scale with camera distance.
//  • occlude="blending" puts the DOM *behind* a transparent canvas and punches a hole for it with an
//    invisible plane, so anything in front of the sign — a container, a crane leg — covers it per pixel.
//    The hole shows the page, which is the same colour as the sky and fog; the sign's own backing block
//    (below) gives it edges and thickness in the scene.
//  • Signs are sized so they read 1:1 (CSS px ≈ screen px) from the stop the camera rests at.
//  • Every placard stays mounted and displayed, in route order, so keyboard focus order is the route;
//    focusing into one brings the camera to its stop.

interface PlacardProps {
  stop: StopId;
  // CSS size of the content
  size: { width: number; height: number };
  // Physical width in metres; height follows the aspect
  width: number;
  position: [number, number, number];
  rotation?: [number, number, number];
  // Backing block: its colour and how far it shows around the face
  frame?: { color: string; border?: number; depth?: number };
  children: ReactNode;
}

const noop = (): void => {};
const world = new Vector3();

const smoothstep = (a: number, b: number, x: number): number => {
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1);
  return t * t * (3 - 2 * t);
};

export const Placard: React.FC<PlacardProps> = ({ stop, size, width, position, rotation, frame, children }) => {
  const content = useRef<HTMLDivElement>(null);
  const anchor = useRef<Group>(null);
  const opacity = useRef(-1);
  const height = (width * size.height) / size.width;
  const portal = useMemo(() => {
    const slot = slotFor(stop);
    return slot ? { current: slot } : undefined;
  }, [stop]);
  const border = frame?.border ?? 0.06;
  const depth = frame?.depth ?? 0.08;

  // The DOM isn't fogged, so fade it the way the fog fades geometry: toward the page behind it, which is the
  // sky and fog colour (night ink, or the day sky — see --page in index.css)
  useFrame(({ camera }) => {
    if (!anchor.current || !content.current) return;
    anchor.current.getWorldPosition(world);
    const next = 1 - smoothstep(FOG.near, FOG.far, world.distanceTo(camera.position));
    if (Math.abs(next - opacity.current) > 0.01) {
      opacity.current = next;
      content.current.style.opacity = next.toFixed(3);
    }
  });

  // Development: name any sign whose content no longer fits it (the content check prevents most of these;
  // see scripts/check-content.js and CONTENT.md)
  const inner = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') return undefined;
    const id = window.setTimeout(() => {
      const sign = inner.current?.firstElementChild as HTMLElement | null;
      if (!sign) return;
      const over = sign.scrollHeight - sign.clientHeight;
      if (over > 2) {
        const title = sign.querySelector('h1, h2, h3')?.textContent ?? stop;
        // eslint-disable-next-line no-console
        console.warn(`[content] The "${title}" sign overflows by ${over}px — shorten its text (limits: CONTENT.md)`);
      }
    }, 2500);
    return () => window.clearTimeout(id);
  }, [stop]);

  if (stillStop) return null;

  return (
    <group position={position} rotation={rotation}>
      <group ref={anchor} />
      {frame && (
        <mesh position={[0, 0, -depth / 2 - 0.004]}>
          <boxGeometry args={[width + border * 2, height + border * 2, depth]} />
          <meshStandardMaterial color={frame.color} roughness={0.85} metalness={0.2} />
        </mesh>
      )}
      <Html
        transform
        occlude="blending"
        distanceFactor={(width / size.width) * 400}
        portal={portal}
        onOcclude={noop}
        wrapperClass="scene-html"
        ref={content}
        style={{ width: size.width, height: size.height }}
      >
        <div ref={inner} style={{ width: '100%', height: '100%', ...placardContainer }} onFocus={() => scrollToStop(stop)}>
          {children}
        </div>
      </Html>
    </group>
  );
};
