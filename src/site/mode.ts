import { useCallback, useState } from 'react';
import { useMediaQuery } from '../hooks/useMediaQuery';

// 'scene'    — the live 3D yard, scroll drives the camera
// 'document' — a normal vertical page with a still render of each location (phones, tablets, reduced
//              motion, low-end hardware, no WebGL, or the visitor's own choice)
export type SiteMode = 'scene' | 'document';

const PREF_KEY = 'jpb:view';

const readPref = (): SiteMode | null => {
  try {
    const value = window.localStorage.getItem(PREF_KEY);
    return value === 'scene' || value === 'document' ? value : null;
  } catch {
    return null;
  }
};

const writePref = (mode: SiteMode): void => {
  try {
    window.localStorage.setItem(PREF_KEY, mode);
  } catch {
    // storage blocked: the choice lasts for this visit only
  }
};

let webgl: boolean | null = null;
const hasWebGL = (): boolean => {
  if (webgl === null) {
    try {
      const canvas = document.createElement('canvas');
      webgl = Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
    } catch {
      webgl = false;
    }
  }
  return webgl;
};

const lowEnd = (): boolean => {
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  return (
    (nav.hardwareConcurrency !== undefined && nav.hardwareConcurrency < 4) ||
    (nav.deviceMemory !== undefined && nav.deviceMemory < 4) ||
    Boolean(nav.connection?.saveData)
  );
};

// `?still=<stop>` renders one location for the still-image script (scripts/render-stills.js)
export const stillStop = new URLSearchParams(window.location.search).get('still');

export interface SiteModeState {
  mode: SiteMode;
  // The 3D view can be offered at all on this screen (the toggle is hidden otherwise)
  canScene: boolean;
  choose: (mode: SiteMode) => void;
  fail: () => void;
}

export const useSiteMode = (): SiteModeState => {
  const roomy = useMediaQuery('(min-width: 1024px) and (min-height: 600px)');
  const finePointer = useMediaQuery('(pointer: fine)');
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [pref, setPref] = useState<SiteMode | null>(readPref);
  const [failed, setFailed] = useState(false);

  const canScene = roomy && hasWebGL() && !failed;
  const auto: SiteMode = finePointer && !reducedMotion && !lowEnd() ? 'scene' : 'document';
  const mode: SiteMode = stillStop ? 'scene' : canScene ? pref ?? auto : 'document';

  const choose = useCallback((next: SiteMode) => {
    writePref(next);
    setPref(next);
  }, []);
  const fail = useCallback(() => setFailed(true), []);

  return { mode, canScene, choose, fail };
};
