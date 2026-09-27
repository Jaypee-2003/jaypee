import React, { RefObject, useEffect, useLayoutEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Material, Mesh, SpotLight } from 'three';

// Who casts and who receives. Solid things do both. Paint (lettering, lane markings, wet patches) only
// receives — it lies on a surface, so casting would just darken the surface under it. Glow, halos, the
// sky and the signs' occlusion planes stay out of the shadow passes entirely.
type Flagged = Material & { isMeshStandardMaterial?: boolean; isTroikaTextMaterial?: boolean };

export const ShadowRules: React.FC = () => {
  const scene = useThree((s) => s.scene);
  const invalidate = useThree((s) => s.invalidate);

  useEffect(() => {
    scene.traverse((object) => {
      const mesh = object as Mesh;
      if (!mesh.isMesh || mesh.userData.noShadow || Array.isArray(mesh.material)) return;
      const material = mesh.material as Flagged;
      if (material.isTroikaTextMaterial) {
        mesh.receiveShadow = true;
        mesh.castShadow = false;
        return;
      }
      if (!material.isMeshStandardMaterial || material.transparent) return;
      mesh.receiveShadow = true;
      mesh.castShadow = !mesh.userData.decal;
    });
    invalidate();
  }, [scene, invalidate]);

  return null;
};

// A floodlight's shadow: its light and everything it falls on stand still, so the map is drawn over the
// first frames (while lettering and signs finish loading) and then kept, costing nothing afterwards.
export const useStaticSpotShadow = (ref: RefObject<SpotLight>, near = 3): void => {
  const frames = useRef(0);
  useLayoutEffect(() => {
    const light = ref.current;
    if (!light) return;
    light.shadow.mapSize.set(1024, 1024);
    light.shadow.bias = -0.0006;
    light.shadow.normalBias = 0.03;
    light.shadow.camera.near = near;
    light.shadow.autoUpdate = false;
    light.shadow.needsUpdate = true;
  }, [ref, near]);
  useFrame(() => {
    if (ref.current && frames.current < 40) {
      frames.current += 1;
      ref.current.shadow.needsUpdate = true;
    }
  });
};
