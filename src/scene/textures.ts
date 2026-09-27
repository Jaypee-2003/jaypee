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

// Weathering for container sides, multiplied into the paint: dirt thrown up along the bottom, rust
// weeping down from the top rail, scuffs and patch-painted panels. One tile is 6 m wide and exactly one
// container high (2.59 m), so the dirt line always sits at the foot of the box.
let grime: Texture | null = null;
export const containerGrime = (): Texture => {
  if (grime) return grime;
  const W = 512;
  const H = 224;
  const [c, g] = canvas(W, H);
  let seed = 19;
  const rand = (): number => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  g.fillStyle = '#ffffff';
  g.fillRect(0, 0, W, H);

  // Patch-painted panels: slightly different shade, as after repairs
  for (let i = 0; i < 3; i++) {
    const x = rand() * W;
    const w = 30 + rand() * 70;
    g.fillStyle = `rgba(${rand() < 0.5 ? '40,36,30' : '255,250,240'},${0.05 + rand() * 0.05})`;
    g.fillRect(x, 10 + rand() * 30, w, H * (0.4 + rand() * 0.4));
  }

  // Rust streaks weeping from the top rail
  for (let i = 0; i < 26; i++) {
    const x = rand() * W;
    const len = H * (0.15 + rand() * 0.55);
    const grad = g.createLinearGradient(0, 0, 0, len);
    const a = 0.1 + rand() * 0.22;
    grad.addColorStop(0, `rgba(92,52,24,${a})`);
    grad.addColorStop(1, 'rgba(92,52,24,0)');
    g.fillStyle = grad;
    g.fillRect(x, 0, 1 + rand() * 3, len);
  }

  // Road dirt along the bottom, rising in soft plumes
  const dirt = g.createLinearGradient(0, H, 0, H * 0.55);
  dirt.addColorStop(0, 'rgba(38,32,26,0.3)');
  dirt.addColorStop(0.3, 'rgba(38,32,26,0.09)');
  dirt.addColorStop(1, 'rgba(38,32,26,0)');
  g.fillStyle = dirt;
  g.fillRect(0, 0, W, H);
  for (let i = 0; i < 40; i++) {
    const x = rand() * W;
    const r = 8 + rand() * 26;
    const plume = g.createRadialGradient(x, H, 0, x, H, r * 2);
    plume.addColorStop(0, 'rgba(38,32,26,0.1)');
    plume.addColorStop(1, 'rgba(38,32,26,0)');
    g.fillStyle = plume;
    g.fillRect(x - r * 2, H - r * 2, r * 4, r * 2);
  }

  // Scuffs and dents catching grime
  for (let i = 0; i < 70; i++) {
    g.fillStyle = `rgba(30,28,26,${0.05 + rand() * 0.12})`;
    g.fillRect(rand() * W, rand() * H, 1 + rand() * 7, 1 + rand() * 2);
  }

  grime = new CanvasTexture(c);
  grime.wrapS = RepeatWrapping;
  grime.colorSpace = SRGBColorSpace;
  // worldBox UVs are in metres: 6 m per tile across, one container height (bottom = v 0) up
  grime.repeat.set(1 / 6, 1 / 2.59);
  grime.anisotropy = 4;
  return grime;
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
