import React, { Component, ReactNode, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { Canvas, useThree } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import { theme } from '../styles/theme';
import { anchorVh, STOPS, StopId, stopAtVh, TOTAL_VH } from '../site/stops';
import { setActiveStop, setScroller } from '../site/store';
import { stillStop } from '../site/mode';
import { SkillsBoard } from '../content/SkillsBoard';
import { registerSlot } from './slots';
import { FOV, POSES } from './rig';
import { CameraRig } from './CameraRig';
import { Yard } from './Environment';
import { DaylightDriver } from './daylight';
import { ShadowRules } from './shadows';
import { Gate } from './locations/Gate';
import { Notice } from './locations/Notice';
import { Bay } from './locations/Bay';
import { Tower } from './locations/Tower';
import { Inspection } from './locations/Inspection';
import { Row } from './locations/Row';
import { Signals } from './locations/Signals';
import { Dispatch } from './locations/Dispatch';

// The whole site as one scene. The page itself is only a scroll track: its length is the dolly's
// length, and scroll position is where the camera is on it. Everything visible lives on a fixed stage —
// one canvas for the yard, and the DOM placards standing in it.

const Track = styled.div`
  height: ${(TOTAL_VH + 1) * 100}vh;
`;

const Stage = styled.div`
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: clip;
`;

// Placard slots, one per stop in route order (see slots.ts). A landmark for the site's content.
const Layer = styled.main`
  position: absolute;
  inset: 0;
  pointer-events: none;
`;

const Slot = styled.div`
  position: absolute;
  inset: 0;
`;

const Loading = styled.p`
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  font-family: ${theme.fonts.display};
  font-weight: 700;
  font-size: 15px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: ${theme.ui.textDim};
  background: ${theme.ui.page};
  transition: opacity 0.6s ease-out;
`;

class SceneBoundary extends Component<{ onFail: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError(): { failed: boolean } {
    return { failed: true };
  }

  componentDidCatch(): void {
    this.props.onFail();
  }

  render(): ReactNode {
    return this.state.failed ? null : this.props.children;
  }
}

// Mounted inside the canvas once everything has loaded
const World: React.FC<{ still: StopId | null; onReady: () => void }> = ({ still, onReady }) => {
  const { invalidate, gl } = useThree();

  useEffect(() => {
    // Let the placards' CSS transforms and the first frame land before revealing the stage
    let frames = 0;
    let id = 0;
    const tick = (): void => {
      invalidate();
      if (++frames < 3) id = requestAnimationFrame(tick);
      else {
        onReady();
        if (still) document.documentElement.dataset.still = 'ready';
      }
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [invalidate, onReady, still]);

  useEffect(() => {
    const canvas = gl.domElement;
    const lost = (e: Event): void => e.preventDefault();
    canvas.addEventListener('webglcontextlost', lost);
    return () => canvas.removeEventListener('webglcontextlost', lost);
  }, [gl]);

  return (
    <>
      <DaylightDriver />
      <CameraRig still={still} />
      <Yard />
      <Gate />
      <Notice />
      <Bay />
      <Tower />
      <Inspection />
      <Row />
      <Signals />
      <Dispatch />
      <ShadowRules />
      <Preload all />
    </>
  );
};

const SceneSite: React.FC<{ onFail: () => void }> = ({ onFail }) => {
  const still = (stillStop as StopId | null) ?? null;
  const [slotsReady, setSlotsReady] = useState(false);
  const [fontsReady, setFontsReady] = useState(false);
  const [shown, setShown] = useState(false);
  const vhAtScroll = useRef(0);

  useLayoutEffect(() => setSlotsReady(true), []);

  // Placards are measured once when they mount, so wait for the page fonts first
  useEffect(() => {
    let live = true;
    document.fonts.ready.then(() => live && setFontsReady(true));
    return () => {
      live = false;
    };
  }, []);

  // Scroll is the camera: register how to reach a stop, and report which stop we're at
  useLayoutEffect(() => {
    if (still) return undefined;
    const report = (): void => {
      vhAtScroll.current = window.scrollY / window.innerHeight;
      setActiveStop(stopAtVh(vhAtScroll.current));
    };
    // The track is measured in viewport heights; on resize, stay at the same place along it
    const resize = (): void => window.scrollTo({ top: vhAtScroll.current * window.innerHeight, behavior: 'auto' });
    setScroller((id, smooth) =>
      window.scrollTo({ top: anchorVh(id) * window.innerHeight, behavior: smooth ? 'smooth' : 'auto' }),
    );
    report();
    window.addEventListener('scroll', report, { passive: true });
    window.addEventListener('resize', resize);
    return () => {
      setScroller(null);
      window.removeEventListener('scroll', report);
      window.removeEventListener('resize', resize);
    };
  }, [still]);

  return (
    <>
      {!still && <Track aria-hidden="true" />}
      <Stage>
        <Layer>
          {STOPS.map((stop) => (
            <Slot key={stop.id} ref={(el) => registerSlot(stop.id, el)}>
              {stop.id === 'signals' && <SkillsBoard inScene />}
            </Slot>
          ))}
        </Layer>
        {slotsReady && fontsReady && (
          <SceneBoundary onFail={onFail}>
            <Canvas
              frameloop="demand"
              shadows="soft"
              dpr={[1, 1.5]}
              camera={{ fov: FOV, near: 0.1, far: 800, position: POSES.gate.pos }}
              gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', preserveDrawingBuffer: Boolean(still) }}
              style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
              aria-hidden="true"
            >
              <Suspense fallback={null}>
                <World still={still} onReady={() => setShown(true)} />
              </Suspense>
            </Canvas>
          </SceneBoundary>
        )}
        {!still && (
          <Loading aria-hidden="true" style={{ opacity: shown ? 0 : 1, pointerEvents: 'none' }}>
            Opening the yard
          </Loading>
        )}
      </Stage>
    </>
  );
};

export default SceneSite;
