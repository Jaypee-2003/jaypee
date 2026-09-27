import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { BackSide, Color, Mesh, ShaderMaterial } from 'three';
import { DAY_SKY, daylight, MOON_DIR, NIGHT_SKY, SUN_DIR } from './daylight';

// The sky: one dome that follows the camera, drawn behind everything. It blends between night and day
// with the daylight value, and passes through the same tone mapping and colour conversion as the fogged
// geometry, so its horizon is exactly the fog colour and the far yard fades into it without a seam.
//   Night: deep navy, stars, the moon with its glow, and a few thin clouds edged in moonlight.
//   Day:   clear blue overhead, hazy at the horizon, the sun with its glare, and scattered cumulus.
// Clouds are procedural (value-noise fbm on a flat cloud layer) and still: the scene renders on demand.

const vertex = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vDir = position;
    vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    gl_Position = p.xyww; // on the far plane
  }
`;

const fragment = /* glsl */ `
  uniform float uDay;
  uniform vec3 uSunDir;
  uniform vec3 uMoonDir;
  uniform vec3 uHorizonNight;
  uniform vec3 uHorizonDay;
  uniform vec3 uZenithNight;
  uniform vec3 uZenithDay;
  varying vec3 vDir;

  float hash12(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }
  float hash13(vec3 p3) {
    p3 = fract(p3 * 0.1031);
    p3 += dot(p3, p3.zyx + 31.32);
    return fract((p3.x + p3.y) * p3.z);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash12(i), hash12(i + vec2(1.0, 0.0)), u.x),
               mix(hash12(i + vec2(0.0, 1.0)), hash12(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 r = mat2(0.8, -0.6, 0.6, 0.8);
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p = r * p * 2.03 + 17.0;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec3 dir = normalize(vDir);
    float h = dir.y;
    float up = clamp(h, 0.0, 1.0);

    vec3 horizon = mix(uHorizonNight, uHorizonDay, uDay);
    vec3 zenith = mix(uZenithNight, uZenithDay, uDay);
    vec3 col = mix(horizon, zenith, pow(up, 0.5));

    float sunDot = max(dot(dir, uSunDir), 0.0);
    float moonDot = max(dot(dir, uMoonDir), 0.0);

    // Warm haze toward the sun, and a cool bloom around the moon
    col += uDay * vec3(1.0, 0.86, 0.66) * (pow(sunDot, 6.0) * 0.22 + pow(sunDot, 48.0) * 0.35);
    col += (1.0 - uDay) * vec3(0.32, 0.4, 0.55) * (pow(moonDot, 10.0) * 0.12 + pow(moonDot, 160.0) * 0.35);

    // Clouds: a flat layer overhead, seen in perspective, thinning into the haze at the horizon
    float cloud = 0.0;
    float density = 0.0;
    if (h > 0.0) {
      vec2 uv = dir.xz / (h + 0.1) * 0.9;
      float n = fbm(uv + vec2(4.7, 1.3));
      float cover = mix(0.6, 0.54, uDay); // night: a few thin clouds; day: scattered cumulus
      cloud = smoothstep(cover, cover + mix(0.2, 0.1, uDay), n) * smoothstep(0.015, 0.2, h);
      density = smoothstep(cover + 0.02, cover + 0.3, n);
    }

    // Stars: one sparse random point per cell of a fine grid on the sphere, gone under cloud and by day
    vec3 sp = dir * 230.0;
    vec3 cell = floor(sp);
    float pick = hash13(cell);
    if (pick > 0.962) {
      vec3 at = vec3(hash13(cell + 11.1), hash13(cell + 23.7), hash13(cell + 37.3)) * 0.6 + 0.2;
      float d = length(fract(sp) - at);
      float bright = 0.35 + 0.9 * pow(hash13(cell + 5.3), 3.0);
      float star = smoothstep(0.13, 0.0, d) * bright;
      col += vec3(0.82, 0.88, 1.0) * star * smoothstep(0.03, 0.3, h) * (1.0 - uDay) * (1.0 - cloud);
    }

    // The moon: a pale disc with darker seas
    float moonDisc = smoothstep(0.99987, 0.99991, moonDot);
    if (moonDisc > 0.0) {
      float seas = fbm(dir.xy * 900.0) * 0.35;
      vec3 moon = vec3(0.95, 0.96, 1.0) * (1.05 - seas);
      col = mix(col, moon, moonDisc * (1.0 - uDay) * (1.0 - cloud * 0.85));
    }

    // The sun: a white disc behind a bright glare
    float sunDisc = smoothstep(0.99985, 0.9999, sunDot);
    col = mix(col, vec3(1.6, 1.5, 1.3), sunDisc * uDay * (1.0 - cloud * 0.9));
    col += uDay * vec3(1.0, 0.92, 0.78) * pow(sunDot, 900.0) * 0.9 * (1.0 - cloud * 0.7);

    // Cloud colour. Day: white tops, grey undersides, silver edges toward the sun.
    // Night: dark slate with moonlit rims — they read as shapes against the stars.
    vec3 dayCloud = mix(vec3(1.35, 1.35, 1.38), vec3(0.66, 0.71, 0.79), density * density);
    dayCloud += vec3(1.0, 0.9, 0.75) * pow(sunDot, 10.0) * (1.0 - density) * 0.5;
    vec3 nightCloud = mix(vec3(0.07, 0.085, 0.12), vec3(0.03, 0.04, 0.06), density);
    nightCloud += vec3(0.4, 0.48, 0.62) * pow(moonDot, 12.0) * (1.0 - density) * 0.6;
    col = mix(col, mix(nightCloud, dayCloud, uDay), cloud * mix(0.8, 0.92, uDay));

    // Below the horizon the sky is the fog colour, so the ground's far edge disappears into it
    col = mix(horizon, col, smoothstep(-0.02, 0.02, h));

    gl_FragColor = vec4(col, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

const ZENITH = { night: new Color('#02050B'), day: new Color('#5F88B4') };

export const Sky: React.FC = () => {
  const mesh = useRef<Mesh>(null);
  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        uniforms: {
          uDay: { value: daylight.value },
          uSunDir: { value: SUN_DIR.clone() },
          uMoonDir: { value: MOON_DIR.clone() },
          uHorizonNight: { value: new Color(NIGHT_SKY) },
          uHorizonDay: { value: new Color(DAY_SKY) },
          uZenithNight: { value: ZENITH.night },
          uZenithDay: { value: ZENITH.day },
        },
        side: BackSide,
        depthWrite: false,
        depthTest: false,
        fog: false,
      }),
    [],
  );

  useFrame(({ camera }) => {
    mesh.current?.position.copy(camera.position);
    material.uniforms.uDay.value = daylight.value;
  });

  return (
    <mesh ref={mesh} material={material} renderOrder={-1000} frustumCulled={false} userData={{ noShadow: true }}>
      <sphereGeometry args={[400, 48, 24]} />
    </mesh>
  );
};
