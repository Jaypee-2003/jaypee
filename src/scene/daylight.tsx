import React, { RefObject, useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Color, Light, MeshStandardMaterial, PointLight, Side, Vector3 } from 'three';
import { getTimeOfDay, useTimeOfDay } from '../site/timeOfDay';
import { stillStop } from '../site/mode';
import { PAL } from './palette';

// How much daylight is in the yard: 0 at night, 1 by day. <DaylightDriver> eases it toward the chosen
// time of day, so switching is a dusk or a dawn rather than a cut; everything lit reads it each frame.
export const daylight = { value: getTimeOfDay() === 'day' ? 1 : 0 };

export const NIGHT_SKY = PAL.night;
// Hazy daylight. Keep in step with the scene's --page colour in src/index.css (placards fade into it).
export const DAY_SKY = '#C9D4DC';

// Where the sun and the moon are, as directions from the yard. Both sit ahead of the camera's usual
// heading (down the lane, -z) so they're in the sky of most shots; their light and shadows come from the
// same place the sky draws them. Sun: just left of the lane, 23° up. Moon: further left, lower.
const fromAngles = (azimuthLeftDeg: number, elevationDeg: number): Vector3 => {
  const az = (azimuthLeftDeg * Math.PI) / 180;
  const el = (elevationDeg * Math.PI) / 180;
  return new Vector3(-Math.sin(az) * Math.cos(el), Math.sin(el), -Math.cos(az) * Math.cos(el)).normalize();
};
export const SUN_DIR = fromAngles(5, 23);
export const MOON_DIR = fromAngles(35, 20);

// Share of a lamp's night-time strength left on: 1 at night, `dayShare` by day
export const lampShare = (dayShare = 0): number => dayShare + (1 - dayShare) * (1 - daylight.value);

export const DaylightDriver: React.FC = () => {
  const target = useTimeOfDay() === 'day' ? 1 : 0;
  const invalidate = useThree((s) => s.invalidate);

  // The scene renders on demand: wake it up when the time of day changes
  useEffect(() => invalidate(), [target, invalidate]);

  useFrame((_, delta) => {
    const gap = target - daylight.value;
    if (gap === 0) return;
    // Stills are photographs: straight to the chosen light
    if (stillStop || Math.abs(gap) < 0.002) daylight.value = target;
    else daylight.value += gap * (1 - Math.exp(-Math.min(delta, 0.1) * 3.2));
    invalidate();
  });
  return null;
};

// A light that belongs to the night: street lamps, floodlights, worklights. Dims by day.
export const useLampLight = (ref: RefObject<Light>, intensity: number, dayShare = 0): void => {
  useFrame(() => {
    if (ref.current) ref.current.intensity = intensity * lampShare(dayShare);
  });
};

export const LampPoint: React.FC<
  { intensity: number; dayShare?: number } & Omit<JSX.IntrinsicElements['pointLight'], 'intensity' | 'ref'>
> = ({ intensity, dayShare = 0, ...props }) => {
  const ref = useRef<PointLight>(null);
  useLampLight(ref, intensity, dayShare);
  return <pointLight ref={ref} intensity={intensity * lampShare(dayShare)} {...props} />;
};

// The lit face of a lamp. Stays amber by day — it's an amber lens — but stops glowing. Give it a
// `dayColor` when it isn't a lens by day (a lit window is just glass in daylight).
export const LampGlow: React.FC<{ intensity: number; dayShare?: number; color?: string; dayColor?: string; side?: Side }> = ({
  intensity,
  dayShare = 0,
  color = PAL.lamp,
  dayColor,
  side,
}) => {
  const ref = useRef<MeshStandardMaterial>(null);
  const colors = useRef<[Color, Color] | null>(dayColor ? [new Color(color), new Color(dayColor)] : null);
  useFrame(() => {
    if (!ref.current) return;
    ref.current.emissiveIntensity = intensity * lampShare(dayShare);
    if (colors.current) ref.current.color.lerpColors(colors.current[0], colors.current[1], daylight.value);
  });
  return (
    <meshStandardMaterial
      ref={ref}
      color={color}
      emissive={color}
      emissiveIntensity={intensity * lampShare(dayShare)}
      toneMapped={false}
      side={side}
    />
  );
};
