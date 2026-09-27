import { BoxGeometry, CanvasTexture, RepeatWrapping, SRGBColorSpace, Texture } from 'three';

// Procedural textures, drawn once into canvases: no image downloads for the scene.

const canvas = (w: number, h: number): [HTMLCanvasElement, CanvasRenderingContext2D] => {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return [c, c.getContext('2d') as CanvasRenderingContext2D];
};

// Container corrugation as a bump map: one ridge per texture repeat, repeated every 0.28 m (see worldBox)
let corrugation: Texture | null = null;
export const corrugationBump = (): Texture => {
  if (corrugation) return corrugation;
  const [c, g] = canvas(64, 4);
  for (let x = 0; x < 64; x++) {
    const v = 0.5 + 0.5 * Math.sin((x / 64) * Math.PI * 2);
    const shade = Math.round(40 + v * 180);
    g.fillStyle = `rgb(${shade},${shade},${shade})`;
    g.fillRect(x, 0, 1, 4);
  }
  corrugation = new CanvasTexture(c);
  corrugation.wrapS = corrugation.wrapT = RepeatWrapping;
  corrugation.repeat.set(1 / 0.28, 1);
  return corrugation;
};

// Asphalt: speckled grey noise used as colour variation and roughness
let asphalt: Texture | null = null;
export const asphaltNoise = (): Texture => {
  if (asphalt) return asphalt;
  const [c, g] = canvas(256, 256);
  const img = g.createImageData(256, 256);
  let seed = 7;
  const rand = (): number => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  for (let i = 0; i < img.data.length; i += 4) {
    const v = 150 + rand() * 90 + (rand() < 0.02 ? 30 : 0);
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
    img.data[i + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  asphalt = new CanvasTexture(c);
  asphalt.wrapS = asphalt.wrapT = RepeatWrapping;
  asphalt.colorSpace = SRGBColorSpace;
  return asphalt;
};

// Soft radial falloff for lamp halos (points) and the pools of light under the lamps (ground decals)
let glow: Texture | null = null;
export const radialGlow = (): Texture => {
  if (glow) return glow;
  const [c, g] = canvas(128, 128);
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.25, 'rgba(255,255,255,0.45)');
  grad.addColorStop(0.6, 'rgba(255,255,255,0.1)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  glow = new CanvasTexture(c);
  return glow;
};

// BoxGeometry with UVs in metres, so the corrugation keeps the same pitch on every face and size
const boxes = new Map<string, BoxGeometry>();
export const worldBox = (w: number, h: number, d: number): BoxGeometry => {
  const key = `${w}:${h}:${d}`;
  const cached = boxes.get(key);
  if (cached) return cached;
  const geo = new BoxGeometry(w, h, d);
  const uv = geo.attributes.uv;
  // Face order: +x, -x, +y, -y, +z, -z — 4 vertices each; [u extent, v extent] per face
  const extents: [number, number][] = [
    [d, h],
    [d, h],
    [w, d],
    [w, d],
    [w, h],
    [w, h],
  ];
  for (let face = 0; face < 6; face++) {
    for (let v = 0; v < 4; v++) {
      const i = face * 4 + v;
      uv.setXY(i, uv.getX(i) * extents[face][0], uv.getY(i) * extents[face][1]);
    }
  }
  uv.needsUpdate = true;
  boxes.set(key, geo);
  return geo;
};
