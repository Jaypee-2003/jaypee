import React, { ComponentProps, useCallback, useMemo } from 'react';
import { Text } from '@react-three/drei';
import { Mesh, MeshStandardMaterial } from 'three';
import stencilFont from '@fontsource/big-shoulders-stencil-display/files/big-shoulders-stencil-display-latin-800-normal.woff';
import labelFont from '@fontsource/archivo/files/archivo-latin-600-normal.woff';
import { PAL } from './palette';

// Words that exist as paint in the yard: real geometry, lit by the scene's lamps, fogged with distance
// and hidden by whatever stands in front of them. (Words people read closely are DOM placards instead.)

const materials = new Map<string, MeshStandardMaterial>();
const paintMaterial = (color: string, glow: boolean): MeshStandardMaterial => {
  const key = `${color}:${glow}`;
  let m = materials.get(key);
  if (!m) {
    m = new MeshStandardMaterial({
      color,
      roughness: 0.95,
      metalness: 0,
      emissive: glow ? color : '#000000',
      emissiveIntensity: glow ? 1.4 : 0,
      // Sits a hair in front of the steel it's painted on
      polygonOffset: true,
      polygonOffsetFactor: -2,
    });
    materials.set(key, m);
  }
  return m;
};

type TextProps = Omit<ComponentProps<typeof Text>, 'font' | 'children'>;

interface PaintProps extends TextProps {
  children: string;
  color?: string;
  // Stencil capitals (markings on steel) or the label face (small print on signs)
  face?: 'stencil' | 'label';
  glow?: boolean;
  // Maximum width in metres: longer words are scaled down to fit the steel they're painted on
  fit?: number;
}

export const Paint: React.FC<PaintProps> = ({ children, color = PAL.stencil, face = 'stencil', glow = false, fit, ...props }) => {
  const mat = useMemo(() => paintMaterial(color, glow), [color, glow]);
  const onSync = useCallback(
    (mesh: Mesh & { textRenderInfo?: { blockBounds: number[] } }) => {
      const bounds = mesh.textRenderInfo?.blockBounds;
      if (!fit || !bounds) return;
      mesh.scale.setScalar(Math.min(1, fit / (bounds[2] - bounds[0])));
    },
    [fit],
  );
  return (
    <Text
      font={face === 'stencil' ? stencilFont : labelFont}
      material={mat}
      anchorX="center"
      anchorY="middle"
      letterSpacing={face === 'stencil' ? 0.02 : 0.04}
      sdfGlyphSize={64}
      onSync={onSync}
      {...props}
    >
      {children}
    </Text>
  );
};
